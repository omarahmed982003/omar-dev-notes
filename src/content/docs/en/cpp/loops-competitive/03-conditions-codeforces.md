---
title: "Conditions and Codeforces exercises"
description: "Conditional problems train translation from story text into equations and exclusive cases. The main difficulty is usually boundaries, not typing if."
tableOfContents: true
---

## Overview

Conditional problems train translation from story text into equations and exclusive cases. The main difficulty is usually boundaries, not typing if.

## Concepts you need

- Define symbols and equations before coding.
- Look for a mathematical shortcut instead of unnecessary simulation.
- Make cases mutually exclusive or define a clear priority.
- Use a wide type when large constraints are multiplied.
- For Even Odds, split the odd and even halves using the 1-based position.

## Example

```cpp
long long oddCount = (n + 1) / 2;
long long answer = (k <= oddCount)
    ? 2 * k - 1
    : 2 * (k - oddCount);
```

## Corrections and common mistakes

- Confirm whether k is 1-based or 0-based.
- Do not use double for exact integer arithmetic.

## Lesson map

<div class="lesson-diagram" role="img" aria-label="Concept map: Conditions and Codeforces exercises">
<p class="lesson-diagram-title">Concept map: Conditions and Codeforces exercises</p>
<div class="diagram-flow">
<div class="diagram-node input"><span>Overview</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>Concepts you need</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>Example</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node decision"><span>Corrections and common mistakes</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node output"><span>Conditional problems train translation from story text into equations</span></div>
</div>
</div>

## Check your understanding

<div class="lesson-quiz" role="list">
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">01</span><p>Derive the odd half of Even Odds.</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> There are (n+1)/2 odds through n; position k in that half maps to 2k-1.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">02</span><p>Why use long long when each input fits in int?</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> Products and sums can overflow even when individual inputs fit; intermediate expression range matters.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">03</span><p>When is a formula better than simulation?</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> If position or total can be computed directly, O(1) avoids a loop that may exceed time limits.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">04</span><p>Which boundaries expose a 0-based/1-based mistake?</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> Test k=1, the last position of the first half, the first of the second half, and k=n.</div></details>
</section>
</div>

## Summary

Build the solution in stages, enable warnings, and test normal, boundary, and invalid cases. Understanding means you can explain why each line exists.
