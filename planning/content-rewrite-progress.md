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
| PHP | 17 × 2 languages | All lessons now have beginner bridges and concept-specific answered exercises in both languages; lessons 1–4 have the deepest sentence-level rebuild and 5–17 retain their detailed core coverage |
| Programming basics | 34 × 2 | Main web/network sequence 1–17 now has beginner-first framing and concept-specific exercises in both languages; computer-fundamentals and math/problem-solving subtracks remain for the full sentence-level pass |
| C++ | 14 × 2 | Pending tone and beginner-flow rewrite; preserve the current detailed coverage |
| OOP | 8 × 2 | All lessons retain detailed coverage and now use concept-specific answered exercises in both languages; sentence-level beginner-flow review completed for the generated sections |
| Database | 5 × 2 | All lessons retain detailed coverage and now use database-specific diagnostic exercises in both languages |
| PHP Runtime | 17 × 2 | All lessons retain detailed runtime coverage and now use operational, concept-specific answered exercises in both languages; prerequisite prose still merits a later deep editorial pass |
| Auth and authorization | 22 × 2 | All lessons retain their security coverage and now use threat-specific scenarios and explained answers in both languages; lessons 20–22 already had specialized material |

## Homepage

Lesson counts are calculated from content files during the Astro build. Current total: 117 lessons per language across seven tracks.

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
