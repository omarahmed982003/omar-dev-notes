---
title: "Types, variables, scope, and text encoding"
description: "A type defines representation, valid operations, and range. A variable combines a name, type, value, lifetime, and visibility."
tableOfContents: true
---

## Overview

A type defines representation, valid operations, and range. A variable combines a name, type, value, lifetime, and visibility.

## Concepts you need

- Choose a type by meaning and range, not size alone.
- Brace initialization rejects many accidental narrowing conversions.
- const prevents later mutation; constexpr can represent compile-time values.
- Local scope reduces coupling; a static local retains value across calls.
- Unicode defines characters; UTF-8 and UTF-16 encode them into storage units.

## Example

```cpp
#include <limits>
#include <string>

int age{20};
double price{49.95};
const std::string country{"Egypt"};
constexpr int daysPerWeek{7};
```

## Corrections and common mistakes

- Type sizes can vary; use sizeof and numeric_limits when it matters.
- float and double are approximate, so direct decimal equality can be unsafe.

## Lesson map

<div class="lesson-diagram" role="img" aria-label="Concept map: Types, variables, scope, and text encoding">
<p class="lesson-diagram-title">Concept map: Types, variables, scope, and text encoding</p>
<div class="diagram-flow">
<div class="diagram-node input"><span>Overview</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>Concepts you need</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>Example</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node decision"><span>Corrections and common mistakes</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node output"><span>A type defines representation, valid operations, and range. A</span></div>
</div>
</div>

## Check your understanding

<div class="lesson-quiz" role="list">
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">01</span><p>Why is int not automatically a good age model even if values are small?</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> It may fit numerically, but type alone does not reject negative or unrealistic ages; domain validation is still required.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">02</span><p>What does brace initialization improve?</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> It makes initialization explicit and rejects many narrowing conversions such as directly placing 3.7 into int.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">03</span><p>How do const and constexpr differ?</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> const prevents later mutation; constexpr represents a value that can be evaluated at compile time in the required context.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">04</span><p>Why does one char usually not hold an Arabic UTF-8 character?</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> That character is commonly encoded as multiple bytes, while char stores one byte-sized code unit.</div></details>
</section>
</div>

## Summary

Build the solution in stages, enable warnings, and test normal, boundary, and invalid cases. Understanding means you can explain why each line exists.
