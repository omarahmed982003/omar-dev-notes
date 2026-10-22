import { readFile, writeFile, rename } from 'node:fs/promises';

async function writeIfChanged(file, content) {
  if (await readFile(file, 'utf8').catch(() => null) === content) return;
  const temporary = `${file}.foundations-tmp`;
  await writeFile(temporary, content, {flag:'wx'});
  await rename(temporary, file);
}

// One-off structural migration: preserve lesson bodies while updating navigation.
const configPath = 'astro.config.mjs';
let config = await readFile(configPath, 'utf8');
const start = config.indexOf('{', config.indexOf('sidebar: ['));
let depth = 0, quoted = false, escaped = false, end;
for (let i = start; i < config.length; i++) {
  const c = config[i];
  if (quoted) {
    if (escaped) escaped = false;
    else if (c === '\\') escaped = true;
    else if (c === '"') quoted = false;
  } else if (c === '"') quoted = true;
  else if (c === '{') depth++;
  else if (c === '}' && --depth === 0) { end = i + 1; break; }
}
if (!end) throw new Error('Could not locate foundations sidebar.');
const track = JSON.parse(config.slice(start, end));
const internals = track.items.find(group => group.items && group.items.some(item => item.link === 'programming-basics/computer-in-depth'));
const math = track.items.find(group => group.label === 'الرياضيات وحل المشكلات');
const network = track.items.find(group => group.label === 'الشبكات والويب');
if (!internals || !math || !network) throw new Error('Missing expected groups.');
const lookup = new Map(internals.items.map(item => [item.link?.split('/').at(-1), item]));
lookup.set('software-and-runtime', {
  label: 'السوفتوير: من الكود لبرنامج شغال',
  translations: { en: 'Software: from source code to a running program' },
  link: 'programming-basics/computer-in-depth/software-and-runtime',
});
internals.label = 'أساسيات المبرمج: الجهاز ونظام التشغيل';
internals.translations.en = 'Programmer foundations: hardware and operating systems';
internals.collapsed = false;
const order = ['computer-in-depth', '03-hardware-architecture', 'software-and-runtime', '06-operating-systems', '04-cpu-gpu', '03-binary-languages-algorithms', '18-media-and-units', '05-ram-memory-buffers', '12-memory-allocation', '13-buffers-and-durability', '05-os-terminal-files-git', '17-terminal-environment', '15-parallel-work', '14-running-code', '16-testing-and-debugging'];
const media = lookup.get('18-media-and-units');
media.label = 'تمثيل الصور والصوت والفيديو ووحدات الحجم';
media.translations.en = 'Images, audio, video, and size units';
internals.items = order.map(key => {
  const item = lookup.get(key);
  if (!item) throw new Error(`Missing lesson: ${key}`);
  return item;
});
track.items = [track.items[0], internals, network, math];
config = config.slice(0, start) + JSON.stringify(track, null, 2) + config.slice(end);
await writeIfChanged(configPath, config);
const flatten = items => items.flatMap(item => item.items ? flatten(item.items) : item.link ? [item.link] : []);
const curriculum = [internals, network, math].map(group => {
  const [guide, ...lessons] = flatten(group.items);
  return { label: group.label, en: group.translations.en, guide, lessons };
});
await writeIfChanged('src/data/foundations-curriculum.json', JSON.stringify(curriculum, null, 2) + '\n');
for (const locale of ['', 'en/']) {
  for (let index = 1; index < internals.items.length; index++) {
    const item = internals.items[index];
    const path = `src/content/docs/${locale}${item.link}.md`;
    let source = await readFile(path, 'utf8');
    const boundary = source.indexOf('\n---', 3);
    if (boundary < 0) throw new Error(`Invalid frontmatter: ${path}`);
    let front = source.slice(0, boundary).replace(/^prev:.*\r?\n?/m, '').replace(/^next:.*\r?\n?/m, '');
    const nav = target => JSON.stringify({link: `/${locale}${target.link}/`, label: locale ? target.translations.en : target.label});
    front = front.trimEnd() + '\nprev: ' + nav(internals.items[index - 1]) + '\n';
    front += 'next: ' + (internals.items[index + 1] ? nav(internals.items[index + 1]) : 'false') + '\n';
    await writeIfChanged(path, front.trimEnd() + source.slice(boundary));
  }
}
console.log('Updated foundations sidebar, print curriculum, and previous/next links only.');
