"""Run with: python scripts/verify-lesson-labs.py --php /path/to/php"""
from pathlib import Path
import argparse, json, os, re, shutil, subprocess, time
parser=argparse.ArgumentParser()
parser.add_argument('--php',default='php')
parser.add_argument('--composer',default='composer')
parser.add_argument('--docker',default='docker')
args=parser.parse_args()
root=Path(__file__).resolve().parents[1];lab=root/'examples/php-labs';results=[]
def tool_command(value):
    resolved=shutil.which(value) or value
    if resolved.lower().endswith('.phar'):
        return [args.php,resolved]
    if os.name=='nt' and resolved.lower().endswith(('.bat','.cmd')):
        return [os.environ.get('COMSPEC','cmd.exe'),'/d','/c',resolved]
    return [resolved]
composer=tool_command(args.composer)
def run(command, expected=0, cwd=lab, env=None):
    result=subprocess.run(command,cwd=cwd,capture_output=True,text=True,encoding='utf-8',timeout=45,env=env)
    record={'command':command,'exit':result.returncode,'expected':expected,'stdout':result.stdout,'stderr':result.stderr}
    results.append(record)
    if result.returncode!=expected:raise RuntimeError(json.dumps(record,ensure_ascii=False))
    return result
for path in sorted(lab.rglob('*.php')):
    if 'vendor' not in path.parts:run([args.php,'-l',str(path)])
run([args.php,'tests.php'])
run(composer+['install','--no-interaction','--prefer-dist','--no-progress'])
run(composer+['validate','--strict'])
run(composer+['audit','--locked'])
run(composer+['check-platform-reqs','--lock','--no-dev'])
run(composer+['run','verify-production'])
exclude={'bootstrap.php','tests.php','http-router.php','http-client-lab.php','total.php','orders.php','config-check.php','load-probe.php'}
for path in sorted(lab.glob('*.php')):
    if path.name not in exclude:run([args.php,path.name])
run([args.php,'total.php','12.50','3.25'])
run([args.php,'total.php','12.5\n'],1)
run([args.php,'total.php','999999999999999999999'],1)
run([args.php,'orders.php','fixtures/orders.json'])
run([args.php,'orders.php','fixtures/broken.json'],2)
run([args.php,'stream-lab.php','fixtures/missing.csv'],2)
env=os.environ.copy();env.pop('LESSON_MODE',None)
run([args.php,'config-check.php'],1,env=env)
env['LESSON_MODE']='test';run([args.php,'config-check.php'],env=env)
run([args.php,'production/public/health.php'],env={**os.environ,'APP_ENV':'production'})
otel_env={**os.environ,'OTEL_PHP_AUTOLOAD_ENABLED':'true','OTEL_SERVICE_NAME':'php-runtime-lab','OTEL_TRACES_EXPORTER':'console'}
run([args.php,'production/public/telemetry.php'],env=otel_env)
server=subprocess.Popen([args.php,'-S','127.0.0.1:8097','http-router.php'],cwd=lab,stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL,creationflags=getattr(subprocess,'CREATE_NO_WINDOW',0))
try:
    time.sleep(1)
    if server.poll() is not None:raise RuntimeError('Local HTTP test server failed to start; check port 8097')
    run([args.php,'http-client-lab.php'])
finally:
    server.terminate();server.wait(timeout=10)
for prefix in ['', 'en/']:
    text=(root/'src/content/docs'/(prefix+'php/10-namespaces-autoloading.md')).read_text(encoding='utf-8')
    for match in re.finditer(r'(?ms)^```json\n(.*?)^```',text):
        data=json.loads(match.group(1))
        if 'autoload' in data and 'App\\' not in data['autoload']['psr-4']:raise RuntimeError('Invalid PSR-4 prefix')
runtime_blocks={}
for prefix in ['', 'en/']:
    directory=root/'src/content/docs'/(prefix+'php-runtime')
    counts=[]
    for lesson in sorted(directory.glob('[0-9][0-9]-*.md')):
        text=lesson.read_text(encoding='utf-8')
        blocks=[(match.group(2),match.group(3)) for match in re.finditer(r'(?ms)^(```|~~~)([\w-]+)\n(.*?)^\1\s*$',text)]
        counts.append((lesson.name,tuple(language for language,_ in blocks),sum(language=='php' for language,_ in blocks),text.count('<details')))
    runtime_blocks[prefix or 'ar']=counts
if runtime_blocks['ar'] != runtime_blocks['en/']:
    raise RuntimeError('Arabic and English PHP Runtime block/exercise counts differ: '+repr(runtime_blocks))
docker_status='skipped (Docker CLI unavailable)'
if shutil.which(args.docker):
    run([args.docker,'compose','-f','production/compose.yaml','config','--quiet'])
    run([args.docker,'compose','-f','production/compose.yaml','-f','production/compose.full.yaml','config','--quiet'])
    docker_status='configuration valid'
else:
    compose=(lab/'production/compose.yaml').read_text(encoding='utf-8')+(lab/'production/compose.full.yaml').read_text(encoding='utf-8')+(lab/'production/otel-collector.yaml').read_text(encoding='utf-8')
    for required in ['services:','php:','web:','read_only: true','no-new-privileges:true','condition: service_healthy','redis:','postgres:','queue-worker:','otel-collector:','otlp:']:
        if required not in compose:raise RuntimeError('Production Compose file misses '+required)
output=root/'tmp/content-repair';output.mkdir(parents=True,exist_ok=True)
version=run([args.php,'-r','echo PHP_MAJOR_VERSION,".",PHP_MINOR_VERSION;']).stdout
(output/('verified-'+version+'.json')).write_text(json.dumps(results,ensure_ascii=False,indent=2),encoding='utf-8')
print(f'PASS: {len(results)} commands, PHP {version}; Composer, HTTP, concurrent workers and expected failures included; Docker {docker_status}')
