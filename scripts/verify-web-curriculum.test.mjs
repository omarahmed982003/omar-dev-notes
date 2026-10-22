import assert from 'node:assert/strict';
import test from 'node:test';
import { lessonIds, validatePair } from './verify-web-curriculum.mjs';
import { formatCurriculumMarkdown } from './format-web-curriculum.mjs';

function fixture() {
  const master = Array.from({ length: 5 }, (_, index) =>
    `### 0.${index + 1} — checkpoint\n#### 0.${index + 1}.a — sublesson`).join('\n');
  const rows = Array.from({ length: 5 }, (_, index) =>
    `| 0.${index + 1} | checkpoint | Not Started | Not assessed | None |\n| 0.${index + 1}.a | sublesson | Not Started | Not assessed | None |`).join('\n');
  return { master, progress: `Current sublesson\nLast completed exercise\nNext unfinished step\n${rows}` };
}

test('matching checkpoints and sublessons are accepted without fabricating progress', () => {
  const { master, progress } = fixture();
  const result = validatePair(master, progress, 0, { expectNotStarted: true });
  assert.deepEqual(result.errors, []);
  assert.equal(result.originalCheckpointsPreserved, 5);
  assert.equal(result.checkpoints, 5);
  assert.equal(result.sublessons, 5);
});

test('missing and unknown tracker rows are rejected', () => {
  const { master, progress } = fixture();
  const errors = validatePair(master, progress.replace('| 0.2.a |', '| 0.9.a |'), 0).errors;
  assert.ok(errors.includes('progress missing 0.2.a'));
  assert.ok(errors.includes('progress has unknown 0.9.a'));
});

test('duplicate curriculum and tracker IDs are rejected', () => {
  const { master, progress } = fixture();
  const errors = validatePair(`${master}\n### 0.1 — repeated`, `${progress}\n| 0.1 | repeated | Not Started |`, 0).errors;
  assert.ok(errors.includes('duplicate curriculum ID 0.1'));
  assert.ok(errors.includes('duplicate progress ID 0.1'));
});

test('removing an original checkpoint is rejected even if the tracker is changed too', () => {
  const { master, progress } = fixture();
  const result = validatePair(master.replace('### 0.2 — checkpoint', '## removed heading'), progress, 0);
  assert.ok(result.errors.includes('original checkpoint removed 0.2'));
  assert.ok(result.errors.includes('orphan sublesson 0.2.a'));
  assert.equal(result.originalCheckpointsPreserved, 4);
});

test('initial-state audit rejects fabricated completion and numeric scores', () => {
  const { master, progress } = fixture();
  const completed = validatePair(master, progress.replace('Not Started', 'Passed'), 0, { expectNotStarted: true });
  assert.ok(completed.errors.some((error) => error.includes('unexpected assessed')));
  const scored = validatePair(master, progress.replace('Not assessed', '90%'), 0, { expectNotStarted: true });
  assert.ok(scored.errors.some((error) => error.includes('unexpected numeric score')));
});

test('missing precise handoff fields are rejected', () => {
  const { master, progress } = fixture();
  const errors = validatePair(master, progress.replace('Next unfinished step', 'generic notes'), 0).errors;
  assert.ok(errors.includes('missing field Next unfinished step'));
});

test('lesson IDs allow topic-owned sublessons without parsing numbers from prose', () => {
  const ids = lessonIds('### 4.5 — TCP\n#### 4.5.a — Foundation\n#### 4.5.b — Depth\nSee 4.5.a later.');
  assert.deepEqual(ids.map(({ id }) => id), ['4.5', '4.5.a', '4.5.b']);
});

test('prose formatter separates Arabic/English without changing IDs, code or links', () => {
  const source = '### 10.3 — ربطLaravel\nقبل13 نقرأAPI أوبيانات\n`echo $x;` [منهجPHP](09-oop_MASTER_PROMPT.md)\n```php\n// ربطLaravel\necho "13قبل";\n```\n';
  const formatted = formatCurriculumMarkdown(source);
  assert.ok(formatted.includes('### 10.3 — ربط Laravel'));
  assert.ok(formatted.includes('قبل 13 نقرأ API'));
  assert.ok(formatted.includes('أو بيانات'));
  assert.ok(formatted.includes('[منهجPHP](09-oop_MASTER_PROMPT.md)'));
  assert.ok(formatted.includes('// ربطLaravel\necho "13قبل";'));
  assert.deepEqual(lessonIds(formatted).map(({ id }) => id), ['10.3']);
  assert.equal(formatCurriculumMarkdown(formatted), formatted);
});
