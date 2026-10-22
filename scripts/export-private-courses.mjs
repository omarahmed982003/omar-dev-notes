import { readdir, readFile, writeFile, mkdir } from 'node:fs/promises';
import { resolve, join } from 'node:path';
import { createHash } from 'node:crypto';

// Export public lessons only. Private study records are deliberately excluded.
const destination = process.argv[2];
if (!destination) throw new Error('Provide the absolute export directory.');
const root = resolve('src/content/docs');
async function files(directory) {
  const entries = await readdir(directory, { withFileTypes: true }).catch(error => {
    if (error.code === 'ENOENT') return [];
    throw error;
  });
  return (await Promise.all(entries.map(entry => entry.isDirectory()
    ? files(join(directory, entry.name))
    : /\.mdx?$/.test(entry.name) ? [join(directory, entry.name)] : []))).flat().sort();
}
await mkdir(destination, { recursive: true });
const manifest = [];
for (const course of ['oop', 'git']) {
  const sources = [...await files(join(root, course)), ...await files(join(root, 'en', course))];
  let content = `# ${course.toUpperCase()} — archived public lessons\n\nExported: 2026-10-20\n\n`;
  if (!sources.length) content += 'No standalone public course pages were found. The private curriculum and progress remain in study/. Git material embedded in other courses is not part of this export.\n';
  for (const source of sources) {
    const original = await readFile(source, 'utf8');
    const relative = source.slice(root.length + 1).replaceAll('\\', '/');
    const hash = createHash('sha256').update(original).digest('hex');
    manifest.push({ course, source: relative, sha256: hash, bytes: Buffer.byteLength(original) });
    content += `\n\n<!-- BEGIN SOURCE: ${relative}; SHA256: ${hash} -->\n\n${original}\n\n<!-- END SOURCE: ${relative} -->\n`;
  }
  const output = join(destination, `${course.toUpperCase()}_PUBLIC_LESSONS.md`);
  await writeFile(output, content, { encoding: 'utf8', flag: 'wx' });
  const saved = await readFile(output, 'utf8');
  if (saved !== content) throw new Error(`Export verification failed: ${output}`);
  for (const source of sources) {
    if (!saved.includes(await readFile(source, 'utf8'))) throw new Error(`Missing source: ${source}`);
  }
  console.log(`${output}: verified ${sources.length} pages`);
}
await writeFile(join(destination, 'EXPORT_MANIFEST.json'), JSON.stringify(manifest, null, 2) + '\n', { flag: 'wx' });
console.log(`Manifest: ${manifest.length} source hashes. No source files deleted by this script.`);
