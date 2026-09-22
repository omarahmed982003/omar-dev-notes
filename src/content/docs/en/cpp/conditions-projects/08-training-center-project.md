---
title: "Training center registration project"
description: "The training-center project should demonstrate understandable design, not one large code block. Separate input, validation, pricing, eligibility, and output."
tableOfContents: true
---

## Overview

The training-center project should demonstrate understandable design, not one large code block. Separate input, validation, pricing, eligibility, and output.

## Concepts you need

- Define input types, plan choices, and valid ranges.
- Validate before financial calculation.
- Represent each rule with a named predicate or function.
- Separate base price, discount, tax, paid amount, and balance.
- Write normal, boundary, and rejection tests for every rule.
- After the first correct version, extract functions so main only coordinates.

## Example

```cpp
bool validAge(int age) { return age >= 12 && age <= 80; }
double planPrice(char plan) {
    switch (plan) { case 'B': return 600; case 'P': return 900; default: return 0; }
}
```

## Corrections and common mistakes

- Do not duplicate the full algorithm for each plan; vary data instead.
- Calculate expected test results independently before comparing output.

## Lesson map

<div class="lesson-diagram" role="img" aria-label="Concept map: Training center registration project">
<p class="lesson-diagram-title">Concept map: Training center registration project</p>
<div class="diagram-flow">
<div class="diagram-node input"><span>Overview</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>Concepts you need</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>Example</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node decision"><span>Corrections and common mistakes</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node output"><span>The training-center project should demonstrate understandable design, not one</span></div>
</div>
</div>

## Check your understanding

<div class="lesson-quiz" role="list">
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">01</span><p>Why should main not contain the entire project?</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> Mixing input, validation, calculation, and output makes testing and change difficult; main should coordinate small functions.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">02</span><p>How can planPrice be tested without running the full program?</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> Make it pure and pass every valid plan plus an unknown value, comparing direct expected results.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">03</span><p>What does an eligibility decision table provide?</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> It exposes missing combinations and policy conflicts before they become nested conditions.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">04</span><p>How do you avoid duplicating the algorithm for every plan?</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> Represent plans as data—name, price, properties—and run one calculation path over that data.</div></details>
</section>
</div>

## Summary

Build the solution in stages, enable warnings, and test normal, boundary, and invalid cases. Understanding means you can explain why each line exists.
