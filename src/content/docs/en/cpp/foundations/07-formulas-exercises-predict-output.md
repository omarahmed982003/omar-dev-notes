---
pagefind: false
title: "Formulas, exercises, and output tracing"
description: "Turning a formula into code has three stages: understand units, express the relationship, and verify with values that can be calculated manually."
tableOfContents: true
---

## Formulas and output prediction

Turning a formula into code has three stages: understand units, express the relationship, and verify with values that can be calculated manually.

## Evaluation order and value tracing

- Name variables by meaning and unit.
- Use parentheses to mirror the mathematical formula.
- Validate denominators before division.
- The sum 1..n is n(n+1)/2 and can be checked against a loop.
- The ternary operator fits short choices, not complex nested decisions.

## Example: translating a formula to C++

```cpp
double celsius{25.0};
double fahrenheit = celsius * 9.0 / 5.0 + 32.0;
int n{100};
long long sum = 1LL * n * (n + 1) / 2;
```

## Parentheses and integer-division mistakes

- Using 9/5 performs integer division and gives 1.
- Multiplication may overflow before assignment to a wider result; widen an operand first.

## Lesson map

<div class="lesson-diagram" role="img" aria-label="Concept map: Formulas, exercises, and output tracing">
<p class="lesson-diagram-title">Concept map: Formulas, exercises, and output tracing</p>
<div class="diagram-flow">
<div class="diagram-node input"><span>Mathematical formula</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>Evaluation order</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>Example</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node decision"><span>Corrections and common mistakes</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node output"><span>Turning a formula into code has three stages: understand</span></div>
</div>
</div>

## Check your understanding

<div class="lesson-quiz" role="list">
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">01</span><p>What is risky about fahrenheit = celsius*9/5+32 with integers?</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> Intermediate integer arithmetic can lose fractions; use double and 9.0/5.0 to model the formula correctly.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">02</span><p>How can you verify the 1..n formula rather than assume it?</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> Compare it with a loop for small and boundary values, then justify it by pairing or induction.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">03</span><p>Why include units in variable names?</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> It prevents combining incompatible quantities such as milliseconds and seconds and makes conversions visible.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">04</span><p>When is a ternary worse than if?</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> When conditions, side effects, or nesting grow; readability and maintainability matter more than line count.</div></details>
</section>
</div>
