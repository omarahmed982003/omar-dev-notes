---
title: "Input and business rules"
description: "Business rules become clear conditions when each fact is named and inputs are validated. Separate data validity from the acceptance decision."
tableOfContents: true
---

## Overview

Business rules become clear conditions when each fact is named and inputs are validated. Separate data validity from the acceptance decision.

## Concepts you need

- Start with a table of inputs, types, and valid ranges.
- Name predicates: hasPassingGrade is clearer than a repeated expression.
- Mandatory rules combine with &&; acceptable alternatives use ||.
- Report the specific rejection reason.
- Test just below, exactly at, and just above every threshold.

## Example

```cpp
bool validScore = score >= 0 && score <= 100;
bool eligible = validScore && score >= 60 && attendance >= 75;
```

## Corrections and common mistakes

- Do not allow invalid data into business decisions.
- Confirm whether each threshold is inclusive.

## Lesson map

<div class="lesson-diagram" role="img" aria-label="Concept map: Input and business rules">
<p class="lesson-diagram-title">Concept map: Input and business rules</p>
<div class="diagram-flow">
<div class="diagram-node input"><span>Overview</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>Concepts you need</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>Example</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node decision"><span>Corrections and common mistakes</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node output"><span>Business rules become clear conditions when each fact is</span></div>
</div>
</div>

## Check your understanding

<div class="lesson-quiz" role="list">
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">01</span><p>Why separate validScore from eligible?</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> The first validates data; the second applies policy. Separation distinguishes malformed input from a normal rejection.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">02</span><p>How should a 75% attendance threshold be tested?</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> Test just below, exactly 75, above, and invalid values below zero and above 100.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">03</span><p>When do eligibility rules use &amp;&amp; versus ||?</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> Use &amp;&amp; for jointly required facts and || for alternative routes; add parentheses when mixing them.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">04</span><p>Why is “not eligible” alone a weak message?</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> It does not identify the failed rule for users, tests, or support; return a specific but non-sensitive reason.</div></details>
</section>
</div>

## Summary

Build the solution in stages, enable warnings, and test normal, boundary, and invalid cases. Understanding means you can explain why each line exists.
