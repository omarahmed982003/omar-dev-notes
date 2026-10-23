import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync, execFileSync } from 'node:child_process';

// Uses the installed CLI; no services or user databases are contacted.
const php = process.env.PHP_BINARY || 'C:/Users/omara/.config/herd/bin/php84/php.exe';
const read = file => fs.readFileSync(file, 'utf8').replaceAll('\r\n', '\n');
const groups = JSON.parse(read('src/data/php-curriculum.json'));
const report = { routes: 0, navigation: 0, pairedPrograms: 0, foundationsPages: 0, checks: 0 };
const check = (condition, label) => { assert.ok(condition, label); report.checks++; };
const blocks = source => [...source.matchAll(/^(~~~|```)php\n([\s\S]*?)^\1/gm)].map(m => m[2]);
function run(code, input = '', args = []) {
  const result = spawnSync(php, ['-r', code.replace(/^<\?php\s*/, ''), ...args], { input, encoding: 'utf8', timeout: 10000 });
  if (result.error) throw result.error;
  return result;
}
const routes = groups.flatMap(g => g.items.map(i => i.link));
assert.equal(new Set(routes).size, routes.length, 'each topic has one sidebar owner');
for (const prefix of ['', 'en/']) {
  const actual = ['php', 'php-runtime'].flatMap(module => fs.readdirSync('src/content/docs/' + prefix + module)
    .filter(f => f.endsWith('.md')).map(f => module + (f === 'index.md' ? '' : '/' + f.slice(0, -3))));
  assert.deepEqual([...actual].sort(), [...routes].sort());
  for (const group of groups) for (const [index, item] of group.items.entries()) {
    const route = item.link;
    const file = 'src/content/docs/' + prefix + route + (route.includes('/') ? '.md' : '/index.md');
    const source = read(file);
    const previous = JSON.parse(source.match(/^prev: (.+)$/m)[1]);
    const next = JSON.parse(source.match(/^next: (.+)$/m)[1]);
    if (route === 'php') assert.equal(previous, false, 'guide has no self-referential Previous link');
    else assert.equal(previous.link, '/' + prefix + (index ? group.items[index - 1].link : 'php') + '/');
    assert.equal(next.link, '/' + prefix + (group.items[index + 1]?.link || 'php') + '/');
    report.navigation += 2;
    report.routes++;
    for (const [, target] of source.matchAll(/\]\((\/(?:en\/)?(?:php|php-runtime)\/[^)#]*)(?:#[^)]*)?\)/g)) {
      const slug = target.replace(/^\/(?:en\/)?/, '').replace(/\/$/, '');
      check(routes.includes(slug), file + ': ' + target);
    }
  }
}
for (const slug of ['cli-input-output', 'input-validation', 'cli-expenses-project', 'first-tests', 'constants', 'scope', 'request-input', 'program-organization', 'file-uploads', 'regex', 'generators']) {
  assert.deepEqual(blocks(read(`src/content/docs/php/${slug}.md`)), blocks(read(`src/content/docs/en/php/${slug}.md`)), slug + ': bilingual code');
  report.pairedPrograms += blocks(read(`src/content/docs/php/${slug}.md`)).length;
}
const beginner = name => read('examples/php-course/programs/beginner/' + name + '.php');
const hello = beginner('greeting');
check(run(hello, 'Omar\n').stdout.includes('Hello Omar'), 'STDIN success');
check(run(hello, '0\n').stdout.includes('Hello 0'), 'zero string accepted');
check(run(hello, '  \n').status === 1, 'blank input rejected');
check(run(hello).status === 2, 'EOF is distinct');
const argument = 'unset($argv[0]); $argv = array_merge(["hello-arg.php"], $argv); $argc = count($argv);\n' + beginner('hello-arg').replace(/^<\?php\s*/, '');
check(run(argument, '', ['Omar']).stdout.includes('Hello Omar'), 'argv success');
check(run(argument).status === 2 && run(argument, '', ['A', 'B']).status === 2, 'missing and extra argv');
const expenses = beginner('expenses');
check(run(expenses, '120\n0\n12x\n80\nquit\n').stdout.includes('total_cents=200'), 'expenses valid/zero/invalid');
check(run(expenses).stdout.includes('count=0'), 'expenses EOF');
check(run(expenses, '999999\n'.repeat(100)).stdout.includes('total_cents=99999900'), 'bounded sum');
check(run(expenses, '1\n'.repeat(101)).status === 1, '101st entry rejected');
check(run(beginner('first-tests')).status === 0, 'test runner passes');
check(run(beginner('first-tests').replace('return array_sum($values);', 'return 0;')).status !== 0, 'test runner detects mutation');

for (const prefix of ['', 'en/']) {
  const configSource = read(`src/content/docs/${prefix}php-runtime/07-environment-configuration.md`);
  const config = blocks(configSource).find(b => b.includes('final readonly class AppConfig'));
  const setup = `foreach (['APP_ENV','APP_DEBUG','HTTP_TIMEOUT_MS','DATABASE_DSN'] as $key) { putenv($key); unset($_ENV[$key]); } $_ENV['DATABASE_DSN']='test:dsn';\n`;
  const invoke = 'echo json_encode(AppConfig::fromEnvironment());';
  check(run(config + setup + invoke).stdout.includes('5000'), 'config missing timeout defaults');
  for (const value of ['0', '', '60001']) {
    check(run(config + setup + `$_ENV['HTTP_TIMEOUT_MS']=${JSON.stringify(value)};` + invoke).status !== 0, 'explicit invalid timeout ' + JSON.stringify(value));
  }
  check(run(config + setup + `$_ENV['APP_ENV']='local'; $_ENV['HTTP_TIMEOUT_MS']='100';` + invoke).stdout.includes('local'), 'dotenv-shaped source precedence');
  check(run(config + setup + `$_ENV['APP_ENV']='';` + invoke).status !== 0, 'empty environment rejected');
  const types = read(`src/content/docs/${prefix}php/03-types.md`);
  const total = blocks(types).find(code => code.includes('intdiv(PHP_INT_MAX, $quantity)'));
  check(total.indexOf('intdiv(PHP_INT_MAX, $quantity)') < total.indexOf('$totalCents = $priceCents * $quantity'), 'overflow checked before multiplication');
  check(run(total.replace("$_GET['price_cents'] ?? null", "'1999'").replace("$_GET['quantity'] ?? null", "'3'")).stdout.includes('5997'), 'total valid');
  check(!run(total.replace("$_GET['price_cents'] ?? null", 'PHP_INT_MAX').replace("$_GET['quantity'] ?? null", "'2'")).stdout.includes('Total:'), 'overflow rejected');
}
const appConfigFile = 'examples/php-labs/app-config-check.php';
const appConfigBody = blocks(read('src/content/docs/php-runtime/07-environment-configuration.md')).find(b => b.includes('final readonly class AppConfig'));
check(read(appConfigFile).includes(appConfigBody.trim()), 'downloadable config matches displayed implementation');
const cleanEnv = { ...process.env };
for (const key of ['APP_ENV', 'APP_DEBUG', 'HTTP_TIMEOUT_MS', 'DATABASE_DSN']) delete cleanEnv[key];
const runConfig = env => spawnSync(php, [appConfigFile], { env: { ...cleanEnv, ...env }, encoding: 'utf8', timeout: 10000 });
check(runConfig({}).status === 2, 'downloadable config rejects missing DSN');
check(runConfig({ DATABASE_DSN: 'sqlite::memory:', HTTP_TIMEOUT_MS: '0' }).status === 2, 'downloadable config rejects zero');
check(runConfig({ DATABASE_DSN: 'sqlite::memory:' }).status === 0, 'downloadable config accepts missing timeout default');
for (const entry of JSON.parse(read('examples/php-course/programs.json'))) {
  const file = 'examples/php-course/' + entry.file;
  if (entry.php.startsWith('8.5')) continue;
  const lint = spawnSync(php, ['-l', file], { encoding: 'utf8', timeout: 10000 });
  check(lint.status === 0, file + ': ' + lint.stdout + lint.stderr);
  const source = read('src/content/docs/' + entry.lesson.replace(/^\//, '').replace(/\/$/, '.md'));
  check(blocks(source).some(code => code.trim() === read(file).trim()), file + ': exported source match');
}
// The approved foundations scope and executable examples must survive a terminology edit.
const foundations = JSON.parse(read('src/data/foundations-curriculum.json'));
const foundationRoutes = [...new Set(['programming-basics', ...foundations.flatMap(g => [g.guide, ...g.lessons])])];
for (const route of foundationRoutes) {
  let file = 'src/content/docs/' + route + '.md';
  if (!fs.existsSync(file)) file = 'src/content/docs/' + route + '/index.md';
  const source = read(file);
  const before = execFileSync('git', ['show', 'HEAD:' + file], { encoding: 'utf8' }).replaceAll('\r\n', '\n');
  const fences = s => [...s.matchAll(/^(~~~|`{3})\w*\n[\s\S]*?^\1/gm)].map(m => m[0]);
  assert.deepEqual(fences(source), fences(before), file + ': code unchanged');
  for (const field of ['prev', 'next']) assert.equal(source.match(new RegExp('^' + field + ': (.+)$', 'm'))?.[1], before.match(new RegExp('^' + field + ': (.+)$', 'm'))?.[1], file + ': navigation unchanged');
  check(!source.includes('variableة') && !source.includes('browserات'), file + ': malformed replacement');
  report.foundationsPages++;
}
console.log(JSON.stringify(report));
console.log('Redis/FPM/Docker integration is NOT covered by this script.');
