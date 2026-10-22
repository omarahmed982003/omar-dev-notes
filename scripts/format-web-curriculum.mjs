import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Whitespace-only formatting for curriculum prose. Never rewrite code, URLs,
// filenames, lesson IDs, or protected Markdown link targets.
export function formatCurriculumMarkdown(source) {
  let fence = null;
  return source.replace(/\r\n/g, '\n').split('\n').map((line) => {
    const delimiter = line.match(/^\s*(`{3,}|~{3,})/);
    if (delimiter) {
      const character = delimiter[1][0];
      if (!fence) fence = character;
      else if (fence === character) fence = null;
      return line;
    }
    if (fence) return line;
    return line.split(/(`+[^`]*`+|\[[^\]]*\]\([^)]+\)|https?:\/\/[^\s)]+)/g).map((segment, index) => {
      if (index % 2) return segment;
      let formatted = segment
        .replace(/([\p{Script=Arabic}\u0640])([A-Za-z0-9])/gu, '$1 $2')
        .replace(/([A-Za-z0-9])([\p{Script=Arabic}\u0640])/gu, '$1 $2');
      const joinedAlternatives = ['حالة', 'تعيين', 'يرمي', 'إرسال', 'أكثر', 'طباعة', 'حقل', 'علاقة', 'حقن', 'إشعار', 'أوقف', 'يرجع', 'كتابة', 'المال', 'بيانات', 'بيئة', 'هوية', 'خوارزميات', 'نشره', 'إنشاء'];
      for (const word of joinedAlternatives) {
        formatted = formatted.replace(new RegExp(`(?<![\\p{L}])أو${word}(?![\\p{L}])`, 'gu'), `أو ${word}`);
      }
      return formatted;
    }).join('');
  }).join('\n');
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const root = fileURLToPath(new URL('..', import.meta.url));
  const directory = path.join(root, 'study', 'web-zero-to-mastery');
  const targets = fs.readdirSync(directory).filter((name) => name.endsWith('.md')).map((name) => path.join(directory, name));
  targets.push(path.join(root, 'study', 'WEB_ZERO_TO_MASTERY_MASTER_PROMPT.md'));
  targets.push(path.join(root, 'study', 'WEB_ZERO_TO_MASTERY_PROGRESS.md'));
  const changes = [];
  const check = process.argv.includes('--check');
  for (const filename of targets) {
    const source = fs.readFileSync(filename, 'utf8');
    const formatted = formatCurriculumMarkdown(source);
    if (source === formatted) continue;
    changes.push(path.relative(root, filename));
    if (!check) fs.writeFileSync(filename, formatted, 'utf8');
  }
  console.log(JSON.stringify({ mode: check ? 'check' : 'format', changedFiles: changes.length, files: changes }, null, 2));
  if (check && changes.length) process.exitCode = 1;
}
