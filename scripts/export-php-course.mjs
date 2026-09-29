import fs from 'node:fs';
import path from 'node:path';

const names = {
 '05': ['grade', 'status', 'sum', 'attempts', 'scores'],
 '06': ['checkout', 'precedence', 'compare', 'array-union', 'pipe'],
 '07': ['functions', 'countdown', 'arguments', 'callbacks', 'config', 'main'],
 '08': ['stream', 'notes-json', 'csv', 'filter'],
 '11': ['withdraw', 'cleanup', 'boundary'],
 '12': ['paid', 'paid-loop', 'keys', 'sort'],
 '13': ['unicode', 'normalize', 'code', 'escaping'],
 '14': ['zones', 'dates', 'dst', 'clock'],
 '16': ['generator', 'weak', 'fiber', 'dnf', 'attribute', 'contact', 'features85'],
};
const manifest = [];
for (const [lesson, list] of Object.entries(names)) {
 const sourceName = fs.readdirSync('src/content/docs/php').find(f => f.startsWith(lesson + '-'));
 const source = fs.readFileSync('src/content/docs/php/' + sourceName, 'utf8');
 const blocks = [...source.matchAll(/^~~~php\r?\n([\s\S]*?)^~~~/gm)].map(m => m[1]);
 if (blocks.length !== list.length) throw new Error('Update program mapping for ' + lesson);
 for (let i = 0; i < list.length; i++) {
  const filename = 'programs/' + lesson + '/' + list[i] + '.php';
  const target = 'examples/php-course/' + filename;
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, blocks[i]);
  manifest.push({ file: filename, lesson: '/php/' + sourceName.replace('.md', '') + '/', php: /\|>/.test(blocks[i]) ? '8.5+' : /private\(set\)/.test(blocks[i]) ? '8.4+' : /readonly class/.test(blocks[i]) ? '8.2+' : '8.1+' });
 }
}
const sessions = fs.readFileSync('src/content/docs/php/09-uploads-cookies-sessions.md', 'utf8');
const sessionBlocks = [...sessions.matchAll(/^~~~php\r?\n([\s\S]*?)^~~~/gm)].map(m => m[1]);
const output = 'examples/php-course/session-demo/public';
fs.mkdirSync(output, { recursive: true });
fs.writeFileSync(output + '/preferences.php', sessionBlocks[0]);
fs.writeFileSync(output + '/upload.php', sessionBlocks.find(s => s.includes("$_FILES['avatar']")));
fs.writeFileSync('examples/php-course/programs.json', JSON.stringify(manifest, null, 2) + '\n');
console.log('Exported ' + manifest.length + ' complete lesson programs and 2 session/upload pages.');

