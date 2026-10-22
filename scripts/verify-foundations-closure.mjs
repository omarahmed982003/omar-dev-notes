import assert from 'node:assert/strict';
import { readFile, writeFile, mkdir, mkdtemp } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import { createServer } from 'node:http';
import path from 'node:path';
import { chromium } from 'playwright-core';

const php = process.env.FOUNDATIONS_PHP || 'C:/Users/omara/.config/herd/bin/php84/php.exe';
const results = [];
const record = (check, evidence = {}) => results.push({ check, passed: true, ...evidence });
const source = async (slug, en = false) => (await readFile(`src/content/docs/${en ? 'en/' : ''}programming-basics/${slug}.md`, 'utf8')).replaceAll('\r\n', '\n');
const blocks = (text, language) => [...text.matchAll(/^(`{3,}|~{3,})(\w+)\r?\n([\s\S]*?)^\1\s*$/gm)].filter(match => match[2] === language).map(match => match[3]);
await mkdir('tmp/foundations-closure', { recursive: true });
const work = await mkdtemp(path.resolve('tmp/foundations-closure/run-'));
const pages = {};
for (const slug of ['21-url-encoding', '15-addressing-dhcp-nat-routing-ipv6', '17-proxies-cdn-waf-observability', '29-browser-scheduling', '03-tcp-udp-packets']) {
  const ar = await source(slug), en = await source(slug, true);
  pages[slug] = { ar, en };
  for (const lang of ['php', 'html', 'http']) assert.deepEqual(blocks(ar, lang), blocks(en, lang), `${slug}: ${lang} parity`);
  for (const text of [ar, en]) {
    assert.equal((text.match(/foundations-reading-scope/g) || []).length, 1);
    assert.ok(text.includes('<details>'), `${slug}: independent answer`);
    assert.ok(!text.includes('@@URL_PHP@@') && !text.includes('@@EVENT_HTML@@') && !text.includes('§'));
  }
  record(`bilingual code, reading marker, and folded exercise: ${slug}`);
}

const execute = (code, lint = false) => {
  const result = spawnSync(php, lint ? ['-l'] : [], { input: code, encoding: 'utf8', windowsHide: true, cwd: work, timeout: 10000 });
  assert.equal(result.status, 0, result.stderr);
  return result.stdout.replaceAll('\r\n', '\n');
};
const queryCode = blocks(pages['21-url-encoding'].ar, 'php')[0];
execute(queryCode, true);
const rfc3986 = value => encodeURIComponent(value).replace(/[!'()*]/g, char => '%' + char.charCodeAt(0).toString(16).toUpperCase());
for (const term of ['عمر & سارة', 'س', '', '0', 'C++ & PHP', 'part#2', '%252F', "&=+?/%!'()*"]) {
  const base64 = Buffer.from(term, 'utf8').toString('base64');
  const variant = queryCode.replace("$term = 'عمر & سارة';", `$term = base64_decode('${base64}');`);
  assert.notEqual(variant, queryCode);
  const expected = `https://example.test/search?q=${rfc3986(term)}&page=1\n${term}\n1\n2\n`;
  assert.equal(execute(variant), expected);
}
record('PHP URL round trips: Arabic, ampersand, plus, empty, zero, fragment, percent, reserved characters', { cases: 8 });
const assertions = String.raw`
function checkValue($actual, $expected): void {
    if ($actual !== $expected) throw new RuntimeException('Unexpected parsing result');
}
parse_str('q=C%2B%2B+%26+PHP&page=1', $form);
checkValue($form['q'], 'C++ & PHP');
parse_str('q=عمر & سارة&page=1', $bad);
if ($bad['q'] === 'عمر & سارة' || count($bad) !== 3) throw new RuntimeException('Unsafe join was not demonstrated');
checkValue(rawurldecode('%252F'), '%2F');
checkValue(rawurldecode(rawurldecode('%252F')), '/');
checkValue(http_build_query(['q'=>'C++ & PHP'], '', '&', PHP_QUERY_RFC3986), 'q=C%2B%2B%20%26%20PHP');
checkValue(http_build_query(['q'=>'س'], '', '&', PHP_QUERY_RFC3986), 'q=%D8%B3');
checkValue($received['page'], '1');
`;
execute(queryCode + '\n' + assertions);
record('PHP form-space decoding, literal plus, unsafe join, decoding once/twice, and parsed string type');

// These validate the prepared paper models, not a router or a production CDN.
const natRows = text => {
  const endpoints = text.split('\n').filter(line => /^\|/.test(line) && /(?:192\.168\.1\.(?:20|21):51000|203\.0\.113\.5:4000[12])/.test(line)).map(line => line.split('|')[2].trim());
  assert.deepEqual(endpoints, ['192.168.1.20:51000', '203.0.113.5:40001', '192.168.1.21:51000', '203.0.113.5:40002']);
  assert.ok(text.includes('198.51.100.10:443'));
  return [[endpoints[0], endpoints[1], '198.51.100.10:443'], [endpoints[2], endpoints[3], '198.51.100.10:443']];
};
const nat = natRows(pages['15-addressing-dhcp-nat-routing-ipv6'].ar);
assert.deepEqual(nat, natRows(pages['15-addressing-dhcp-nat-routing-ipv6'].en));
assert.deepEqual(nat, [['192.168.1.20:51000', '203.0.113.5:40001', '198.51.100.10:443'], ['192.168.1.21:51000', '203.0.113.5:40002', '198.51.100.10:443']]);
const translations = new Map(nat.map(([inside, outside]) => [outside, inside]));
assert.equal(translations.size, 2);
assert.equal(translations.get('203.0.113.5:40002'), '192.168.1.21:51000');
assert.equal(translations.get('203.0.113.5:40001'), '192.168.1.20:51000');
assert.equal(translations.get('203.0.113.5:49999'), undefined);
record('NAT/PAT paper mapping: two internal peers, distinct external ports, return targets, unmatched mapping');

const ackRows = text => text.split('\n').filter(line => /^\|/.test(line) && /100[036]–100[258]/.test(line)).map(line => {
  const cells = line.split('|').slice(1, -1).map(cell => cell.trim());
  return { range: cells[1], ack: cells[2].match(/ACK\s*(\d+)/)?.[1] || null };
});
const expectedRows = [{ range: '1000–1002', ack: '1003' }, { range: '1003–1005', ack: null }, { range: '1006–1008', ack: '1003' }, { range: '1003–1005', ack: '1009' }];
assert.deepEqual(ackRows(pages['03-tcp-udp-packets'].ar), expectedRows);
assert.deepEqual(ackRows(pages['03-tcp-udp-packets'].en), expectedRows);
function receiver(initial) {
  const bytes = new Set(); let next = initial;
  return (start, length) => { for (let i = start; i < start + length; i++) bytes.add(i); while (bytes.has(next)) next++; return next; };
}
const first = receiver(1000);
assert.deepEqual([first(1000, 3), first(1006, 3), first(1003, 3)], [1003, 1003, 1009]);
const exercise = receiver(2000);
assert.deepEqual([exercise(2000, 3), exercise(2006, 3), exercise(2003, 3)], [2003, 2003, 2009]);
assert.equal(Math.min(6000, 4000) - 3000, 1000);
assert.equal(Math.min(6000, 5000) - 3500, 1500);
for (const text of Object.values(pages['03-tcp-udp-packets'])) assert.ok(text.includes('min(6000, 5000) − 3500 = 1500'));
record('TCP paper receiver: retained out-of-order data, cumulative ACK recovery, independent trace, remaining window room');

const caches = { A: new Map(), B: new Map() }; let version = 'v1'; let originFetches = 0;
function request(pop, time, language = 'ar') {
  const key = `example.test/guide?lang=${language}`;
  const stored = caches[pop].get(key);
  if (stored && time < stored.saved + 300) return { status: 'HIT', version: stored.version };
  originFetches++;
  caches[pop].set(key, { saved: time, version });
  return { status: stored ? 'VALIDATE' : 'MISS', version };
}
const trace = [request('A', 0), request('A', 20), request('B', 30)];
version = 'v2'; trace.push(request('A', 80), request('A', 310));
assert.deepEqual(trace, [{ status: 'MISS', version: 'v1' }, { status: 'HIT', version: 'v1' }, { status: 'MISS', version: 'v1' }, { status: 'HIT', version: 'v1' }, { status: 'VALIDATE', version: 'v2' }]);
assert.equal(originFetches, 3);
assert.deepEqual(request('A', 311, 'en'), { status: 'MISS', version: 'v2' });
for (const text of Object.values(pages['17-proxies-cdn-waf-observability'])) {
  assert.ok(text.includes('public, max-age=60, s-maxage=300'));
  assert.ok(text.includes('private, no-store'));
  for (const timestamp of [0, 20, 30, 50, 80, 310]) assert.ok(new RegExp('^\\|\\s*' + timestamp + '\\s*\\|', 'm').test(text));
}
record('CDN paper model: independent PoPs, freshness, stale validation, changed origin, separate language keys', { originFetches });

const completeHTML = blocks(pages['29-browser-scheduling'].ar, 'html').find(code => code.startsWith('<!doctype html>'));
assert.ok(completeHTML);
await writeFile(path.join(work, 'event-loop.html'), completeHTML);
const browser = await chromium.launch({ executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', headless: true });
let fixtureServer;
try {
  const page = await browser.newPage(); const errors = [];
  page.setDefaultTimeout(5000);
  page.on('pageerror', error => errors.push(error.message));
  for (const [name, html, expected] of [
    ['published example', completeHTML, 'A\nB\nC\nD\n'],
    ['independent extra synchronous line', completeHTML.replace("log('B');", "log('B'); log('X');"), 'A\nB\nX\nC\nD\n'],
    ['independent direct invocation', completeHTML.replace("Promise.resolve().then(() => log('C'));", "log('C');"), 'A\nC\nB\nD\n'],
  ]) {
    await page.goto('about:blank');
    await page.setContent(html);
    await page.waitForFunction(expected => document.querySelector('#output').textContent === expected, expected);
    assert.equal(await page.locator('#output').textContent(), expected);
    record(`real browser event-loop output: ${name}`, { output: expected.trim().split('\n') });
  }
  assert.deepEqual(errors, []);

  fixtureServer = createServer((req, res) => {
    res.setHeader('Cache-Control', 'no-store');
    const sendJS = content => { res.setHeader('Content-Type', 'text/javascript'); res.end(content); };
    if (req.url === '/config.js') return void setTimeout(() => sendJS("window.labConfiguration='ready'; window.labTrace.push('config');"), 150);
    if (req.url === '/app.js') return sendJS("window.labTrace.push('app:'+(window.labConfiguration || 'missing')); ");
    if (req.url === '/main-module.js') return sendJS("import {setting} from './module-config.js'; window.labTrace.push('module:'+setting);");
    if (req.url === '/module-config.js') return void setTimeout(() => sendJS("window.labTrace.push('dependency'); export const setting='ready';"), 150);
    const mode = new URL(req.url, 'http://local.test').searchParams.get('mode');
    const tags = mode === 'module' ? '<script type="module" src="/main-module.js"></script>' : `<script ${mode === 'async' ? 'async' : 'defer'} src="/config.js"></script><script ${mode === 'async' ? 'async' : 'defer'} src="/app.js"></script>`;
    res.setHeader('Content-Type', 'text/html');
    res.end('<!doctype html><html><head><script>window.labTrace=[];</script>' + tags + '</head><body>Controlled local loading fixture</body></html>');
  });
  await new Promise((resolve, reject) => fixtureServer.once('error', reject).listen(0, '127.0.0.1', resolve));
  const base = `http://127.0.0.1:${fixtureServer.address().port}`;
  for (const [mode, expected] of [['defer', ['config', 'app:ready']], ['async', ['app:missing', 'config']], ['module', ['dependency', 'module:ready']]]) {
    await page.goto(base + '/?mode=' + mode, { waitUntil: 'load' });
    assert.deepEqual(await page.evaluate(() => window.labTrace), expected);
    record(`controlled browser loading fixture: ${mode}`, { order: expected });
  }
  if (process.argv.includes('--site')) {
    const base = process.env.AUDIT_BASE_URL || 'http://127.0.0.1:4323';
    const output = 'planning/audit-results/foundations-closure-views-2026-10-22';
    await mkdir(output, { recursive: true });
    const focus = {
      '21-url-encoding': 'تجربة PHP: رجّع نفس القيمة',
      '15-addressing-dhcp-nat-routing-ipv6': 'جهازان ومنفذ محلي واحد: مين يستقبل الرد؟',
      '17-proxies-cdn-waf-observability': 'أول طلب ثم HIT ثم تحديث',
      '29-browser-scheduling': 'ملف كامل تتوقع خرجه',
      '03-tcp-udp-packets': 'تتبع فقد بأرقام فعلية',
    };
    for (const slug of Object.keys(pages)) for (const en of [false, true]) {
      for (const width of [320, 390, 1280]) {
        await page.setViewportSize({ width, height: 900 });
        const route = '/' + (en ? 'en/' : '') + 'programming-basics/' + slug + '/';
        const response = await page.goto(base + route, { waitUntil: 'load' });
        assert.equal(response.status(), 200, route);
        assert.equal(await page.locator('html').getAttribute('dir'), en ? 'ltr' : 'rtl');
        assert.equal(await page.locator('a.language-action').getAttribute('href'), '/' + (en ? '' : 'en/') + 'programming-basics/' + slug + '/');
        const overflow = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 2);
        assert.equal(overflow, false, route + ' viewport ' + width);
        assert.ok((await page.locator('.sl-markdown-content pre').evaluateAll(nodes => nodes.map(node => getComputedStyle(node).direction))).every(direction => direction === 'ltr'));
        assert.equal(await page.locator('.sl-markdown-content details[open]').count(), 0);
        if (!en && width === 390) {
          const heading = page.getByRole('heading', { name: focus[slug], exact: true });
          await heading.evaluate(el => window.scrollTo(0, scrollY + el.getBoundingClientRect().top - 170));
          await page.screenshot({ path: path.join(output, slug + '-mobile.png') });
        }
        record('published page layout and language: ' + route, { width, direction: en ? 'ltr' : 'rtl', overflow: false });
      }
    }
  }
  assert.deepEqual(errors, []);
} finally {
  await browser.close();
  if (fixtureServer) await new Promise(resolve => fixtureServer.close(resolve));
}
await mkdir('planning/audit-results', { recursive: true });
const report = { date: '2026-10-22', work, results, limitations: ['NAT, CDN, and TCP numeric traces are prepared models checked for consistency, not live router/CDN/packet-capture experiments.', 'No production CDN, DNS, firewall, deployment, or account was changed.', 'Browser output order is tested; no fixed millisecond or real-world performance improvement is asserted.'] };
await writeFile('planning/audit-results/foundations-closure-2026-10-22.json', JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify({ checks: results.length, phpCases: 8, browserCases: 6, work }));
