import { readFile, writeFile, rename } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import path from 'node:path';
import assert from 'node:assert/strict';

// Keep the existing Starlight registration, curriculum, print order and links aligned.
const workspace = path.resolve('.');
async function save(file, content) {
  if (await readFile(file, 'utf8') === content) return;
  const target = path.resolve(file);
  assert.ok(target.startsWith(workspace + path.sep));
  const temporary = target + '.path-tmp';
  await writeFile(temporary, content, { flag: 'wx' });
  try { await rename(temporary, target); }
  catch (error) {
    if (process.platform !== 'win32' || !['EPERM', 'EACCES'].includes(error.code)) throw error;
    const quote = value => "'" + value.replaceAll("'", "''") + "'";
    execFileSync('powershell.exe', ['-NoProfile', '-NonInteractive', '-Command',
      `Move-Item -LiteralPath ${quote(temporary)} -Destination ${quote(target)} -Force`], { windowsHide: true });
  }
}
let config = await readFile('astro.config.mjs', 'utf8');
const start = config.indexOf('{', config.indexOf('sidebar: ['));
let level = 0, quoted = false, escaped = false, end;
for (let index = start; index < config.length; index++) {
  const char = config[index];
  if (quoted) {
    if (escaped) escaped = false;
    else if (char.charCodeAt(0) === 92) escaped = true;
    else if (char === '"') quoted = false;
  } else if (char === '"') quoted = true;
  else if (char === '{') level++;
  else if (char === '}' && --level === 0) { end = index + 1; break; }
}
assert.ok(end, 'Foundations sidebar was not found');
const track = JSON.parse(config.slice(start, end));
const leaves = items => items.flatMap(item => item.items ? leaves(item.items) : item.link ? [item] : []);
const findGroup = guide => track.items.find(group => group.items && leaves(group.items).some(item => item.link === guide));
const core = findGroup('programming-basics/computer-in-depth');
const network = findGroup('programming-basics/networking-next');
const math = findGroup('programming-basics/math-problem-solving');
assert.ok(core && network && math, 'Existing course groups must be reused');
const networkFirst = [
  '01-web-and-request-flow', '14-network-layers-lan-ethernet-arp',
  '15-addressing-dhcp-nat-routing-ipv6', '02-dns-and-ip', '04-url-ports-http',
  '21-url-encoding', '03-tcp-udp-packets', 'udp', '05-http-messages-state',
  '22-http-state-and-updates', '06-https-tls-certificates', '09-browser-rendering-devtools',
  '32-local-network-lab',
].map(slug => 'programming-basics/' + slug);
const networkDepth = [
  '28-lan-segmentation', '18-wifi-practical-basics', '26-subnet-calculations',
  '27-routing-and-ipv6', '20-transport-diagnostics', '29-browser-scheduling',
  '07-server-side-path', '08-server-proxy-api-gateway', '31-proxy-policies',
  '10-http-caching-compression', '11-same-origin-cors', '33-browser-isolation',
  '12-realtime-webhooks', '30-webhook-delivery', '13-api-design', '16-http2-http3-quic',
  '17-proxies-cdn-waf-observability', '24-request-protection', '25-request-observation',
].map(slug => 'programming-basics/' + slug);
const mathOrder = leaves(math.items).map(item => item.link).filter(link => link !== 'programming-basics/math-problem-solving');
const staged = new Map();
function organize(group, guide, specifications) {
  const lookup = new Map(leaves(group.items).map(item => [item.link, item]));
  const old = [...lookup.keys()].filter(link => link !== guide).sort();
  const ordered = specifications.flatMap(stage => stage.lessons);
  assert.deepEqual([...ordered].sort(), old, `No lessons may be dropped or duplicated: ${guide}`);
  group.items = [lookup.get(guide), ...specifications.map(stage => ({
    label: stage.label, translations: { en: stage.en }, collapsed: stage.id !== 'first-pass',
    items: stage.lessons.map(link => lookup.get(link)),
  }))];
  staged.set(guide, specifications);
}
organize(network, 'programming-basics/networking-next', [
  { id: 'first-pass', label: 'المرور الأول — أساس الشبكات والويب', en: 'First pass — network and web foundations', lessons: networkFirst },
  { id: 'return-depth', label: 'ارجع بعد التطبيق — تعمق وتشخيص', en: 'Return after practice — depth and diagnosis', lessons: networkDepth },
]);
organize(math, 'programming-basics/math-problem-solving', [
  { id: 'first-pass', label: 'حسب الحاجة — الحساب والمنطق وخطوات الحل', en: 'As needed — arithmetic, logic, and solution steps', lessons: mathOrder.slice(0, 7) },
  { id: 'return-depth', label: 'بعد أساس اللغة — تطبيقات وتعمق', en: 'After language fundamentals — applications and depth', lessons: mathOrder.slice(7) },
]);
config = config.slice(0, start) + JSON.stringify(track, null, 2) + config.slice(end);
await save('astro.config.mjs', config);
const curriculum = [core, network, math].map(group => {
  const [guide, ...lessons] = leaves(group.items).map(item => item.link);
  return { label: group.label, en: group.translations.en, guide, lessons,
    ...(staged.has(guide) ? { stages: staged.get(guide) } : {}) };
});
await save('src/data/foundations-curriculum.json', JSON.stringify(curriculum, null, 2) + '\n');

// Run only after lesson authors finish. This part edits navigation, not explanations.
if (process.argv.includes('--navigation')) {
  for (const locale of ['', 'en/']) {
    for (const group of curriculum) {
      const segments = group.stages || [{ lessons: group.lessons }];
      for (const segment of segments) for (const [index, route] of segment.lessons.entries()) {
        const file = `src/content/docs/${locale}${route}.md`;
        const source = (await readFile(file, 'utf8')).replace(/\r\n/g, '\n');
        const boundary = source.indexOf('\n---', 3);
        assert.ok(boundary > 0, file);
        const previous = segment.lessons[index - 1] || group.guide;
        const next = segment.lessons[index + 1] || (group.stages ? group.guide : null);
        async function navigation(target) {
          if (!target) return 'false';
          const isIndex = curriculum.some(item => item.guide === target && !target.endsWith('/networking-next'));
          const other = await readFile(`src/content/docs/${locale}${target}${isIndex ? '/index' : ''}.md`, 'utf8');
          const label = other.match(/^title:\s*(.+)$/m)[1].replace(/^"|"$/g, '');
          return JSON.stringify({ link: `/${locale}${target}/`, label });
        }
        let front = source.slice(0, boundary).replace(/^prev:.*\n?/m, '').replace(/^next:.*\n?/m, '');
        front = front.replace(/(sidebar:\s*\n\s+order:)\s*\d+/, `$1 ${group.lessons.indexOf(route) + 1}`);
        front = front.trimEnd() + '\nprev: ' + await navigation(previous) + '\nnext: ' + await navigation(next);
        let body = source.slice(boundary);
        const heading = locale ? 'Next step' : 'الخطوة التالية';
        const pattern = new RegExp('(## ' + heading + '\\n\\n)\\[[^\\n]+\\]\\([^)]+\\)\\.?');
        if (next && pattern.test(body)) {
          const target = JSON.parse(await navigation(next));
          body = body.replace(pattern, `$1[${target.label}](${target.link}).`);
        }
        await save(file, front + body);
      }
    }
  }
}
console.log(JSON.stringify({ lessons: curriculum.reduce((sum, group) => sum + group.lessons.length, 0), networkFirstPass: networkFirst.length, networkDepth: networkDepth.length, navigationUpdated: process.argv.includes('--navigation') }));
