import { readFile, writeFile, mkdir, mkdtemp } from 'node:fs/promises';
import { spawn, spawnSync } from 'node:child_process';
import { createServer } from 'node:net';
import path from 'node:path';
import assert from 'node:assert/strict';
import { chromium } from 'playwright-core';

// Exercise the published examples themselves, not separately reimplemented code.
const php = process.env.FOUNDATIONS_PHP || 'C:/Users/omara/.config/herd/bin/php84/php.exe';
const curriculum = JSON.parse(await readFile('src/data/foundations-curriculum.json', 'utf8'));
const checks = [];
const record = (name, detail = {}) => checks.push({ name, passed: true, ...detail });
const codeBlocks = source => [...source.matchAll(/^(`{3,}|~{3,})php\r?\n([\s\S]*?)^\1\s*$/gm)].map(m => m[2].replaceAll('\r\n', '\n'));
const source = async (route, en = false) => (await readFile(`src/content/docs/${en ? 'en/' : ''}programming-basics/${route}.md`, 'utf8')).replaceAll('\r\n', '\n');
await mkdir('tmp/foundations-content-tests', { recursive: true });
const work = await mkdtemp(path.resolve('tmp/foundations-content-tests/run-'));
const run = (code, expected = undefined) => {
  const result = spawnSync(php, [], { input: code, encoding: 'utf8', windowsHide: true, cwd: work, timeout: 10000 });
  assert.equal(result.status, 0, result.stderr);
  if (expected !== undefined) assert.equal(result.stdout.replaceAll('\r\n', '\n').trim(), expected);
  return result;
};
const checkedPHP = code => {
  const result = spawnSync(php, ['-l'], { input: code, encoding: 'utf8', windowsHide: true, cwd: work, timeout: 10000 });
  assert.equal(result.status, 0, result.stderr);
};
const augment = (code, test) => code + '\n' + test;
const phpAssertions = String.raw`
function sameValue($actual, $expected): void {
    if ($actual !== $expected) throw new RuntimeException('Unexpected test value');
}
function rejects(callable $operation, string $class): void {
    try { $operation(); } catch (Throwable $e) {
        if ($e instanceof $class) return;
        throw $e;
    }
    throw new RuntimeException('Expected rejection did not happen');
}
`;

assert.equal(curriculum.flatMap(group => group.lessons).length, 60);
assert.equal(new Set(curriculum.flatMap(group => group.lessons)).size, 60);
assert.deepEqual(curriculum.slice(1).map(group => group.stages.map(stage => stage.lessons.length)), [[13, 19], [7, 7]]);
record('60 unique lessons retained; network 13/19 and mathematics 7/7 stage boundaries');

const math = curriculum[2].lessons.map(route => route.replace('programming-basics/', ''));
for (const route of math) {
  const ar = await source(route), en = await source(route, true);
  assert.ok(!/sum of the rest \(Representational State Transfer/i.test(en), route);
  assert.ok(!/\]\(\/(?:en\/)?programming-basics\/(?:javascript|html)[^)]*\)/i.test(ar + en), route);
  const a = codeBlocks(ar), b = codeBlocks(en);
  assert.deepEqual(a, b, `Executable PHP differs: ${route}`);
  for (const code of a) { checkedPHP(code); run(code); }
  record(`mathematics parity, prerequisite links, and PHP execution: ${route}`, { examples: a.length * 2 });
}

for (const route of ['07-server-side-path', '08-server-proxy-api-gateway', '10-http-caching-compression', '11-same-origin-cors', '12-realtime-webhooks', '13-api-design', '24-request-protection', '25-request-observation', '30-webhook-delivery', '31-proxy-policies', '32-local-network-lab']) {
  for (const en of [false, true]) {
    const opening = (await source(route, en)).slice(0, 2200);
    assert.ok(en ? /optional|not required/i.test(opening) : /اختياري|مش شرط/.test(opening), `Optional environment declaration: ${route}`);
  }
}
assert.ok(!(await source('25-request-observation', true)).includes('App → DB → External API'));
record('Each Node-dependent lesson declares optional execution locally; tracing does not route through a database');

const totals = codeBlocks(await source('08-problem-solving-algorithms'))[0];
run(totals, '1:120\n2:50');
run(augment(totals, phpAssertions + String.raw`
sameValue(totalsByCustomer([]), []);
sameValue(totalsByCustomer([['customer_id'=>1,'total'=>0]]), [1=>0]);
sameValue(totalsByCustomer([['customer_id'=>1,'total'=>PHP_INT_MAX]]), [1=>PHP_INT_MAX]);
foreach ([['customer_id'=>1], ['customer_id'=>0,'total'=>3], ['customer_id'=>1,'total'=>-1],
          ['customer_id'=>1,'total'=>'3'], null] as $invalid) {
    rejects(fn()=>totalsByCustomer([$invalid]), InvalidArgumentException::class);
}
rejects(fn()=>totalsByCustomer([['customer_id'=>1,'total'=>PHP_INT_MAX],['customer_id'=>1,'total'=>1]]), OverflowException::class);
`));
record('totalsByCustomer: normal, empty, zero, missing, negative, wrong type, maximum integer, overflow');

const pairs = codeBlocks(await source('math-problem-solving/09-solution-patterns'))[0];
run(pairs, '8:1,2\n10:none\n1:none\n10:none');
run(augment(pairs, phpAssertions + String.raw`
sameValue(pairSumSorted([1,3,5,8], 6), [0,2]);
sameValue(pairSumSorted([1,3,5,8], 4), [0,1]);
sameValue(pairSumSorted([5,5], 10), [0,1]);
sameValue(pairSumSorted([5], 10), null);
sameValue(pairSumSorted([], 1), null);
sameValue(pairSumSorted([-5,-2,0,4], -7), [0,1]);
sameValue(pairSumSorted([-1000000,1000000], 0), [0,1]);
sameValue(pairSumSorted([-1000000,-1000000], -2000000), [0,1]);
rejects(fn()=>pairSumSorted([3,1], 4), InvalidArgumentException::class);
rejects(fn()=>pairSumSorted([1=>'3'], 3), InvalidArgumentException::class);
rejects(fn()=>pairSumSorted(['3'], 3), InvalidArgumentException::class);
rejects(fn()=>pairSumSorted([1000001], 3), InvalidArgumentException::class);
rejects(fn()=>pairSumSorted([], 2000001), InvalidArgumentException::class);
`));
record('two pointers: both movements, absent, distinct positions, duplicates, negative, bounds, invalid input');

const loop = codeBlocks(await source('math-problem-solving/06-flowcharts-loops-debugging'))[0];
for (const [n, expected] of [[0, '0'], [1, '1'], [3, '6'], [4, '10']]) run(loop.replace('$n = 3;', `$n = ${n};`), expected);
run(loop.replace('$n = 3;', '$n = 4;').replace('$i <= $n', '$i < $n'), '6');
record('loop: zero, one, normal, independent boundary, deliberate off-by-one');

const freePort = async () => {
  const server = createServer();
  await new Promise((resolve, reject) => server.once('error', reject).listen(0, '127.0.0.1', resolve));
  const port = server.address().port;
  await new Promise(resolve => server.close(resolve));
  return port;
};
const processes = [];
async function startPHP(directory, extra = []) {
  const port = await freePort();
  const child = spawn(php, [...extra, '-S', `127.0.0.1:${port}`, '-t', directory], { windowsHide: true, cwd: work, stdio: ['ignore', 'pipe', 'pipe'] });
  processes.push(child);
  let log = '', spawnError;
  child.stderr.on('data', chunk => log += chunk.toString());
  child.on('error', error => spawnError = error);
  const base = `http://127.0.0.1:${port}`;
  for (let attempt = 0; attempt < 50; attempt++) {
    if (spawnError) throw spawnError;
    if (child.exitCode !== null) throw new Error(log);
    try { await fetch(base + '/__readiness__'); return { base, log: () => log }; }
    catch { await new Promise(resolve => setTimeout(resolve, 100)); }
  }
  throw new Error('Local PHP fixture did not start');
}
let browser;
try {
  // This deliberately trips the catch block in strict_types mode over real HTTP.
  for (const en of [false, true]) {
    const dir = path.join(work, en ? 'server-en' : 'server-ar');
    await mkdir(dir);
    const code = codeBlocks(await source('07-server-side-path', en))[0];
    assert.ok(code.includes('declare(strict_types=1)'));
    assert.ok(code.includes('error_log((string) $e)'));
    checkedPHP(code);
    await writeFile(path.join(dir, 'product.php'), code);
    const server = await startPHP(dir);
    for (const [query, status, expected] of [['', 200, { id: 42, name: 'Keyboard' }], ['?fail=1', 500, { error: 'Internal server error' }], ['', 200, { id: 42, name: 'Keyboard' }]]) {
      const response = await fetch(server.base + '/product.php' + query);
      assert.equal(response.status, status);
      assert.ok(response.headers.get('content-type').startsWith('application/json'));
      assert.equal(response.headers.get('cache-control'), 'no-store');
      const text = await response.text();
      assert.deepEqual(JSON.parse(text), expected);
      assert.ok(!/RuntimeException|TypeError|Stack trace|Deliberate local failure/i.test(text));
    }
    assert.ok(server.log().includes('Deliberate local failure'));
    assert.ok(!server.log().includes('error_log(): Argument'));
    record(`server catch over HTTP ${en ? 'English' : 'Arabic'}: 200 → 500 → 200; private error log only`);
  }

  const sessionDir = path.join(work, 'sessions'), publicDir = path.join(sessionDir, 'public'), dataDir = path.join(sessionDir, 'session-data');
  await mkdir(publicDir, { recursive: true }); await mkdir(dataDir);
  const sessionAR = codeBlocks(await source('22-http-state-and-updates'))[0];
  assert.deepEqual(codeBlocks(await source('22-http-state-and-updates', true))[0], sessionAR);
  checkedPHP(sessionAR); await writeFile(path.join(publicDir, 'counter.php'), sessionAR);
  const sessionServer = await startPHP(publicDir, ['-d', `session.save_path=${dataDir}`]);
  const first = await fetch(sessionServer.base + '/counter.php');
  assert.deepEqual(await first.json(), { visits: 1 });
  const cookie = first.headers.get('set-cookie');
  assert.ok(/HttpOnly/i.test(cookie) && /SameSite=Lax/i.test(cookie));
  const second = await fetch(sessionServer.base + '/counter.php', { headers: { Cookie: cookie.split(';')[0] } });
  assert.deepEqual(await second.json(), { visits: 2 });
  const separate = await fetch(sessionServer.base + '/counter.php');
  assert.deepEqual(await separate.json(), { visits: 1 });
  record('PHP session over HTTP: 1 → 2 with cookie; 1 without cookie; HttpOnly and SameSite=Lax');

  if (process.argv.includes('--browser')) {
    const dir = path.join(work, 'isolation'); await mkdir(dir);
    const blocks = codeBlocks(await source('33-browser-isolation'));
    assert.deepEqual(codeBlocks(await source('33-browser-isolation', true)), blocks);
    checkedPHP(blocks[0]); checkedPHP(blocks[1]);
    const resource = await startPHP(dir);
    // Only the generated fixture port changes; source snippets remain untouched.
    await writeFile(path.join(dir, 'page.php'), blocks[0].replace('http://127.0.0.1:8776', resource.base));
    await writeFile(path.join(dir, 'resource.php'), blocks[1]);
    const document = await startPHP(dir);
    browser = await chromium.launch({ executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', headless: true });
    const page = await browser.newPage();
    const outcomes = [];
    for (const policy of ['same-origin', 'cross-origin', 'absent']) {
      const fixture = policy === 'absent'
        ? blocks[1].replace("header('Cross-Origin-Resource-Policy: same-origin');", '')
        : blocks[1].replace('Cross-Origin-Resource-Policy: same-origin', `Cross-Origin-Resource-Policy: ${policy}`);
      await writeFile(path.join(dir, 'resource.php'), fixture);
      await page.goto(document.base + '/page.php', { waitUntil: 'load' });
      const result = await page.evaluate(() => ({ isolated: crossOriginIsolated, width: document.querySelector('img').naturalWidth, complete: document.querySelector('img').complete }));
      assert.equal(result.isolated, true);
      assert.equal(result.complete, true);
      assert.equal(result.width, policy === 'cross-origin' ? 180 : 0);
      outcomes.push({ policy, ...result });
    }
    record('CORP/COEP browser lab: same-origin blocked, cross-origin displayed, absent blocked', { outcomes });
  }
} finally {
  if (browser) await browser.close();
  await Promise.all(processes.map(child => new Promise(resolve => {
    if (child.exitCode !== null) return resolve();
    child.once('exit', resolve); child.kill();
  })));
}
await mkdir('planning/audit-results', { recursive: true });
const report = { date: '2026-10-22', php: spawnSync(php, ['-v'], { encoding: 'utf8', windowsHide: true }).stdout.split(/\r?\n/)[0], work, checks, limitations: ['Optional Node labs were reviewed, not all executed.', 'Windows editor-memory GUI experiment was not executed; its paper values are illustrative.', ...(!process.argv.includes('--browser') ? ['Browser isolation cases require --browser.'] : [])] };
await writeFile('planning/audit-results/foundations-runtime-2026-10-22.json', JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify({ checks: checks.length, browser: process.argv.includes('--browser'), work }));
