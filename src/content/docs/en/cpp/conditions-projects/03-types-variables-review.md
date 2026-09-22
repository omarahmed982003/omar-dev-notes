---
title: "Types, variables, and scope review"
description: "This applied review revisits types, initialization, and scope before larger conditional programs. Select a type that preserves meaning and supports the expected range."
tableOfContents: true
---

## Overview

This applied review revisits types, initialization, and scope before larger conditional programs. Select a type that preserves meaning and supports the expected range.

## Concepts you need

- Use bool for binary state instead of magic integers.
- auto helps when the initializer makes the type obvious, not when it hides important meaning.
- Use string for text and char for one character.
- Keep a variable in the narrowest useful scope.
- Use const for validated inputs that should not change.

## Example

```cpp
std::string plan{"standard"};
int sessions{12};
double pricePerSession{80.0};
bool paid{true};
const double subtotal = sessions * pricePerSession;
```

## Corrections and common mistakes

- Do not use unsigned merely to reject negatives; conversions can surprise.
- Do not leave local fundamental variables uninitialized.

## Lesson map

<div class="lesson-diagram" role="img" aria-label="Concept map: Types, variables, and scope review">
<p class="lesson-diagram-title">Concept map: Types, variables, and scope review</p>
<div class="diagram-flow">
<div class="diagram-node input"><span>Overview</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>Concepts you need</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>Example</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node decision"><span>Corrections and common mistakes</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node output"><span>This applied review revisits types, initialization, and scope before</span></div>
</div>
</div>

## Check your understanding

<div class="lesson-quiz" role="list">
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">01</span><p>When can auto reduce clarity?</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> When it hides a type that affects precision, ownership, or conversion, especially in numeric and public-interface code.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">02</span><p>Why is bool better than 0/1 for payment state?</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> It communicates intent, restricts use to logical state, and reads clearly with a name such as isPaid.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">03</span><p>Why is narrow scope valuable?</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> It reduces accidental mutation and name conflicts while making lifetime and responsibility visible.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">04</span><p>Does unsigned prevent negative input?</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> No. Conversion can wrap a negative value into a large positive number; validate before conversion.</div></details>
</section>
</div>

## Summary

Build the solution in stages, enable warnings, and test normal, boundary, and invalid cases. Understanding means you can explain why each line exists.
