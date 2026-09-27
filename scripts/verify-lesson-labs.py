"""Run with: python scripts/verify-lesson-labs.py --php /path/to/php"""
from pathlib import Path
import argparse, json, os, re, subprocess, time
parser=argparse.ArgumentParser();parser.add_argument('--php',default='php');args=parser.parse_args()
root=Path(__file__).resolve().parents[1];lab=root/'examples/php-labs';results=[]
def run(command, expected=0, cwd=lab, env=None):
    result=subprocess.run(command,cwd=cwd,capture_output=True,text=True,encoding='utf-8',timeout=45,env=env)
    record={'command':command,'exit':result.returncode,'expected':expected,'stdout':result.stdout,'stderr':result.stderr}
    results.append(record)
    if result.returncode!=expected:raise RuntimeError(json.dumps(record,ensure_ascii=False))
    return result
for path in sorted(lab.rglob('*.php')):run([args.php,'-l',str(path)])
run([args.php,'tests.php'])
exclude={'bootstrap.php','tests.php','http-router.php','http-client-lab.php','total.php','orders.php','config-check.php'}
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
output=root/'tmp/content-repair';output.mkdir(parents=True,exist_ok=True)
version=run([args.php,'-r','echo PHP_MAJOR_VERSION,".",PHP_MINOR_VERSION;']).stdout
(output/('verified-'+version+'.json')).write_text(json.dumps(results,ensure_ascii=False,indent=2),encoding='utf-8')
print(f'PASS: {len(results)} commands, PHP {version}; HTTP, concurrent workers and expected failures included')
