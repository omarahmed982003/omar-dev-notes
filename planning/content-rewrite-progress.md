# Beginner-first content rewrite

This checklist tracks the project-wide rewrite approved on 2026-09-26.

## Required style

- Arabic uses clear, respectful Egyptian phrasing while preserving accurate technical terms.
- English assumes no previous knowledge and must match Arabic concepts, examples, and exercises.
- Explain the problem and mental model before syntax.
- Include runnable examples, expected output, line-by-line reasoning, common mistakes, and practical questions with explained answers.
- Replace generic generated questions and generic diagrams with concept-specific material.
- Do not remove existing technical coverage.

## Progress

| Track | Lessons | Status |
|---|---:|---|
| PHP | 17 × 2 languages | Beginner-first rewrite complete through lesson 17. Lessons 5–17 now have parallel Arabic/English explanations, runnable programs, expected output, 55 answered exercises per language, and a cumulative notebook project. Existing lessons 1–4 remain unchanged in this round. See `planning/php-rewrite-verification.md`. |
| Programming basics | 34 × 2 | Main web/network sequence 1–17 now has beginner-first framing and concept-specific exercises in both languages; computer-fundamentals and math/problem-solving subtracks remain for the full sentence-level pass |
| C++ | 14 × 2 | Pending tone and beginner-flow rewrite; preserve the current detailed coverage |
| OOP | 8 × 2 | All lessons retain detailed coverage and now use concept-specific answered exercises in both languages; sentence-level beginner-flow review completed for the generated sections |
| Database | 5 × 2 | All lessons retain detailed coverage and now use database-specific diagnostic exercises in both languages |
| PHP Runtime | 20 × 2 | Expanded on 2026-09-27 with sessions/shared state, database runtime operations, long-running workers, real Redis/PostgreSQL/OTel labs, and a five-step practice cycle in every bilingual lesson. PHP/Composer/build checks pass; Docker execution remains unavailable on this host. |
| Auth and authorization | 22 × 2 | All lessons retain their security coverage and now use threat-specific scenarios and explained answers in both languages; lessons 20–22 already had specialized material |

## Homepage

Lesson counts are calculated from content files during the Astro build. Verified on 2026-09-27: 174 counted pages per language across seven tracks. PHP contributes 18 pages: the setup lab plus 17 numbered lessons. Track tables describe numbered lessons; homepage counts also include eligible setup/reference pages.

## Editorial audit

- Repetitive lesson diagrams were diversified into pipeline, grid, cycle, and decision variants.
- Generic diagram nodes were replaced in the affected math and computer-fundamentals lessons.
- A strict project-wide review is recorded in `planning/content-critical-audit.md`.
- Per-lesson evidence and risk flags are recorded in `planning/content-audit-inventory.csv`.

## Repair round 2 — 2026-09-26

- Added topic-specific beginner bridges to the 22 English lessons in the initial below-70% screening set, then reinforced two borderline lessons found by the final full-tree comparison. A fresh comparison leaves no pair below that threshold; character ratio remains a screening signal, not proof of translation parity.
- Added bilingual threat drills to all 22 Auth lessons. Every drill names an attack, a negative test, a concrete rejection condition, and a primary or OWASP/RFC/W3C verification source.
- Added bilingual “Run and verify” checkpoints to all 17 PHP Runtime lessons, PHP lessons 1–16, and Database lessons 1–4. Each checkpoint has a command and an observable success criterion.
- Added cumulative, bilingual acceptance projects to PHP 17, OOP 8, Database 5, and Programming Basics 17.
- Preserved both historical lesson-8 URLs in Programming Basics, while disambiguating the problem-solving and web paths through sidebar labels and explicit notes.
- Added arrow labels and visible failure/default/fall-through branches to all eight decision-style diagrams.
- No existing lesson section, example, question, or technical topic was removed in this round.

## Lesson-level coverage round — 2026-09-26

- Reviewed coverage at the individual-lesson level instead of assigning one density grade to each track.
- Added a bilingual, topic-specific coverage supplement and verification checkpoint to 104 lessons:
  - 34 Programming Basics lessons.
  - 14 C++ lessons.
  - 17 PHP lessons.
  - 17 PHP Runtime lessons.
  - 22 Auth lessons.
- Supplements address the exact gaps found in the lesson audit, including protocol edge cases, runtime failure modes, language boundaries, security validation, and operational proof.
- Dense lessons now include explicit multi-pass study guidance so the existing material remains intact without forcing the learner to absorb unrelated difficulty levels in one sitting.
- OOP and Database were explicitly excluded from this round at the user’s request; neither track received a “coverage supplement” section.
- Arabic and English received matching additions, and no existing lesson content was removed.

## Beginner-flow integration round — 2026-09-26

- Preserved all existing explanations, examples, exercises, and source lessons.
- Replaced the labels "استكمال التغطية / Coverage supplement" in 104 Arabic lessons and 104 English counterparts with "اربط النقاط ببعض / Connect the ideas".
- Renamed verification endings to "جرّب بنفسك / Try it yourself".
- Added a consistent beginner entry section and plain-language term definitions to all 208 targeted lesson files.
- Integrated competitive-programming practice into the C++ problem-solving lesson and condition/formula problems into the C++ if/else lesson in both languages.
- Removed the two exercise-only C++ pages from the ordered course sidebar and lesson count while keeping their original files as archived references.
- Removed source-page-number wording from track introductions in both languages.
- OOP and Database lesson bodies remain excluded from this rewrite round; only their track introductions were cleaned.

## PHP lessons 5–17 completion — 2026-09-27

- Rebuilt 13 Arabic lessons and their 13 English counterparts around complete programs and step-by-step reasoning; preserved existing lesson URLs and order.
- Added prediction, debugging, and completion exercises with explained answers, plus common mistakes and boundary cases.
- Expanded control flow, function calls/callbacks, streams, upload/session boundaries, Composer/PSR-4 and tooling, Unicode, request handling, and the released PHP 8.0–8.5 feature timeline.
- Added a runnable cumulative notebook project with form validation, CSRF protection, per-session storage, private files, routing, escaped output, and PRG; documented its local teaching scope and limitations.
- Added PSR-4/Composer, HTTP, session/upload, and console examples under `examples/php-course`, with a downloadable archive at `/downloads/php-course.zip`.
- Verified 106 PHP blocks, 40 expected-output programs, 143 HTTP assertions, 15 standalone notebook checks, Composer quality tools, and all 26 rendered lesson pages. The final Astro build generated 388 pages.
- Detailed evidence, commands, warnings, and verification boundaries are recorded in `planning/php-rewrite-verification.md`. This round does not alter lessons 1–4 or other course tracks.
