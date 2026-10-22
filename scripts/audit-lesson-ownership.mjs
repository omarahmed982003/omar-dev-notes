import { readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const root = path.resolve('src/content/docs');
async function walk(dir) {
  return (await Promise.all((await readdir(dir, { withFileTypes: true })).map(entry => entry.isDirectory()
    ? walk(path.join(dir, entry.name)) : /\.mdx?$/.test(entry.name) ? [path.join(dir, entry.name)] : []))).flat();
}
const files = await walk(root);
const rows = [];
for (const file of files) {
  const relative = path.relative(root, file).replaceAll('\\', '/');
  if (relative.startsWith('en/') || !relative.includes('/')) continue;
  const source = await readFile(file, 'utf8');
  const englishPath = path.join(root, 'en', relative);
  const english = await readFile(englishPath, 'utf8').catch(() => '');
  const headings = [...source.matchAll(/^#{2,3} (.+)$/gm)].map(match => match[1]);
  const title = source.match(/^title:\s*(.+)$/m)?.[1]?.replace(/^['"]|['"]$/g, '') ?? relative;
  const flags = [];
  if (!english) flags.push('Missing English counterpart');
  if (/استكمال التغطية|Coverage supplement|Beginner bridge/.test(source + english)) flags.push('Editorial fragments need integration');
  if (/### كلمات جديدة في الدرس/.test(source)) flags.push('Review glossary relevance in context');
  if (/وSuperglobals|وHTTP Authentication|وMigrations|وSTL|وSAML وOIDC|وTOTP وPasskeys|وSLI\/SLO/.test(title)) flags.push('Candidate for topic split');
  if (/^\d+/.test(path.basename(relative)) && source.length < 4000) flags.push('Short lesson: review explanation and examples');
  if (relative.includes('computer-fundamentals/')) flags.push('Legacy computer-use material; review retirement separately');
  rows.push({ path: relative, title, headings, characters: source.length, englishCharacters: english.length, flags });
}
rows.sort((a,b) => a.path.localeCompare(b.path));
await writeFile('planning/lesson-ownership-inventory-2026-10-20.json', JSON.stringify(rows, null, 2) + '\n');
let report = '# جرد بنية الدروس — 2026-10-20\n\nهذا جرد آلي للعناوين والأقسام، وليس شهادة بصحة المحتوى أو اكتمال مراجعة كل درس.\n\n';
for (const track of ['programming-basics', 'cpp', 'php', 'php-runtime', 'database', 'auth']) {
  const items = rows.filter(row => row.path.startsWith(track + '/'));
  report += `## ${track} — ${items.length} صفحات عربية\n\n`;
  for (const row of items) {
    report += `### ${row.title}\n\n- الملف: \`${row.path}\`\n- أقسامه: ${row.headings.join(' ← ') || 'لا توجد عناوين فرعية'}\n- فحص البنية: ${row.flags.join('؛ ') || 'يتطلب مراجعة بشرية لموضوع الدرس'}\n\n`;
  }
}
await writeFile('planning/lesson-ownership-inventory-2026-10-20.md', report);
console.log(`Inventoried ${rows.length} Arabic pages and checked English counterparts. No lesson was automatically declared complete.`);
