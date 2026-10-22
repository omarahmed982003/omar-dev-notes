import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const originalCheckpointCounts = [5, 7, 9, 8, 9, 5, 6, 8, 8, 6, 8, 6, 6, 7, 6, 6, 5, 7, 7, 5, 5, 4, 7];

export function lessonIds(markdown) {
  return [...markdown.matchAll(/^#{3,4}\s+(\d+\.\d+(?:\.[a-z]+)?)\s+[—–-]\s+(.+)$/gm)]
    .map((match) => ({ id: match[1], title: match[2], sublesson: match[1].split('.').length === 3 }));
}

export function validatePair(master, progress, phase, options = {}) {
  const errors = [];
  const lessons = lessonIds(master);
  const ids = lessons.map(({ id }) => id);
  const rows = [...progress.matchAll(/^\|\s*(\d+\.\d+(?:\.[a-z]+)?)\s*\|(.+)$/gm)];
  const rowIds = rows.map((match) => match[1]);
  const duplicates = (values) => [...new Set(values.filter((value, index) => values.indexOf(value) !== index))];
  for (const id of duplicates(ids)) errors.push(`duplicate curriculum ID ${id}`);
  for (const id of duplicates(rowIds)) errors.push(`duplicate progress ID ${id}`);
  for (const id of ids) {
    if (!id.startsWith(`${phase}.`)) errors.push(`ID ${id} belongs to a different phase`);
    if (!rowIds.includes(id)) errors.push(`progress missing ${id}`);
    if (id.split('.').length === 3 && !ids.includes(id.split('.').slice(0, 2).join('.'))) {
      errors.push(`orphan sublesson ${id}`);
    }
  }
  for (const lesson of lessons) {
    const row = rows.find((match) => match[1] === lesson.id);
    if (!row) continue;
    const recordedTitle = row[2].split('|')[0].trim();
    if (recordedTitle !== lesson.title.replaceAll('|', '/').trim()) {
      errors.push(`progress title differs for ${lesson.id}`);
    }
  }
  for (const id of rowIds) if (!ids.includes(id)) errors.push(`progress has unknown ${id}`);
  for (let number = 1; number <= originalCheckpointCounts[phase]; number += 1) {
    if (!ids.includes(`${phase}.${number}`)) errors.push(`original checkpoint removed ${phase}.${number}`);
  }
  if (!lessons.some(({ sublesson }) => sublesson)) errors.push('missing explicit sublessons');
  for (const field of ['Current sublesson', 'Last completed exercise', 'Next unfinished step']) {
    if (!progress.toLowerCase().includes(field.toLowerCase())) errors.push(`missing field ${field}`);
  }
  if (options.expectNotStarted) {
    for (const row of rows) {
      if (/\|\s*(Passed|Completed|Assessment Completed)\s*\|/i.test(row[0])) {
        errors.push(`unexpected assessed/completed row ${row[1]}`);
      }
      if (/\|\s*\d+(?:\.\d+)?\s*%?\s*\|/.test(row[2])) {
        errors.push(`unexpected numeric score in ${row[1]}`);
      }
    }
  }
  return {
    errors,
    checkpoints: lessons.filter(({ sublesson }) => !sublesson).length,
    sublessons: lessons.filter(({ sublesson }) => sublesson).length,
    originalCheckpointsPreserved: originalCheckpointCounts[phase] - errors.filter((error) => error.startsWith('original checkpoint removed')).length,
  };
}

export function verifyCurriculum(root, options = {}) {
  const directory = path.join(root, 'study', 'web-zero-to-mastery');
  const files = fs.readdirSync(directory);
  const masters = files.filter((name) => /^\d{2}-.+_MASTER_PROMPT\.md$/.test(name)).sort();
  const progressFiles = files.filter((name) => /^\d{2}-.+_PROGRESS\.md$/.test(name));
  const errors = [];
  let checkpoints = 0;
  let sublessons = 0;
  let originalCheckpointsPreserved = 0;
  let linksChecked = 0;
  if (masters.length !== 23 || progressFiles.length !== 23) errors.push('expected 23 curriculum/progress pairs');
  masters.forEach((name, index) => {
    const phase = Number(name.slice(0, 2));
    if (phase !== index) errors.push(`phase sequence mismatch: ${name}`);
    const progressName = name.replace('_MASTER_PROMPT.md', '_PROGRESS.md');
    if (!files.includes(progressName)) {
      errors.push(`missing pair for ${name}`);
      return;
    }
    const result = validatePair(fs.readFileSync(path.join(directory, name), 'utf8'), fs.readFileSync(path.join(directory, progressName), 'utf8'), phase, options);
    checkpoints += result.checkpoints;
    sublessons += result.sublessons;
    originalCheckpointsPreserved += result.originalCheckpointsPreserved;
    errors.push(...result.errors.map((error) => `${name}: ${error}`));
  });
  const toCheck = files.filter((name) => name.endsWith('.md')).map((name) => path.join(directory, name));
  toCheck.push(path.join(root, 'study', 'WEB_ZERO_TO_MASTERY_MASTER_PROMPT.md'));
  toCheck.push(path.join(root, 'study', 'WEB_ZERO_TO_MASTERY_PROGRESS.md'));
  for (const filename of toCheck) {
    const markdown = fs.readFileSync(filename, 'utf8');
    for (const match of markdown.matchAll(/\]\(([^)]+)\)/g)) {
      const target = match[1].replace(/^<|>$/g, '');
      if (/^(https?:|mailto:)/i.test(target)) continue;
      const local = decodeURIComponent(target.split('#')[0]);
      if (!local) continue;
      linksChecked += 1;
      if (!fs.existsSync(path.resolve(path.dirname(filename), local))) errors.push(`${path.relative(root, filename)}: broken link ${target}`);
    }
  }
  return { pairs: masters.length, checkpoints, sublessons, originalCheckpointsPreserved, localLinksChecked: linksChecked, errors };
}

const isEntry = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isEntry) {
  const root = fileURLToPath(new URL('..', import.meta.url));
  const result = verifyCurriculum(root, { expectNotStarted: process.argv.includes('--expect-not-started') });
  console.log(JSON.stringify(result, null, 2));
  if (result.errors.length) process.exitCode = 1;
}
