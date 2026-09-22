---
title: "Competitive programming and practice platforms"
description: "Competitive programming trains constraint analysis, algorithm choice, and fast correct implementation. The judge is a measurement tool, not a substitute for understanding."
tableOfContents: true
---

## Overview

Competitive programming trains constraint analysis, algorithm choice, and fast correct implementation. The judge is a measurement tool, not a substitute for understanding.

## Concepts you need

- Read input, output, and constraints before samples.
- Translate constraints into acceptable complexity; n=10^5 usually rules out O(n²).
- Solve samples by hand, then add custom cases.
- After Wrong Answer, inspect boundaries, types, rounding, and interpretation.
- State time and memory complexity after solving.

## Example

```cpp
// Elephant: minimum moves of length at most 5
int moves = (distance + 4) / 5; // integer ceiling
```

## Corrections and common mistakes

- Passing samples does not prove correctness.
- Do not start with maximum difficulty; build a consistent practice ladder.

## Lesson map

<div class="lesson-diagram" role="img" aria-label="Concept map: Competitive programming and practice platforms">
<p class="lesson-diagram-title">Concept map: Competitive programming and practice platforms</p>
<div class="diagram-flow">
<div class="diagram-node input"><span>Overview</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>Concepts you need</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>Example</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node decision"><span>Corrections and common mistakes</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node output"><span>Competitive programming trains constraint analysis, algorithm choice, and fast</span></div>
</div>
</div>

## Check your understanding

<div class="lesson-quiz" role="list">
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">01</span><p>Why do constraints select the algorithm before coding?</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> For n=10^5, O(n²) may be impossible regardless of code quality, while O(n log n) or O(n) can fit.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">02</span><p>What does Wrong Answer after passing samples imply?</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> Samples are not proof; revisit interpretation, boundaries, types, rounding, and construct counterexamples.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">03</span><p>Why does (d+4)/5 solve Elephant?</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> It performs integer ceiling by five: adding four turns any nonzero remainder into one additional move.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">04</span><p>How do you learn after an accepted solution?</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> Record complexity, study an alternative, reimplement later, and document the misconception that blocked the first attempt.</div></details>
</section>
</div>

## Summary

Build the solution in stages, enable warnings, and test normal, boundary, and invalid cases. Understanding means you can explain why each line exists.
