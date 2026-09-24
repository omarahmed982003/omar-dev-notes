---
title: "5. Types, variables, scope, and memory"
sidebar:
  order: 5
description: "A type defines representation, valid operations, and range. A variable combines a name, type, value, lifetime, and visibility."
tableOfContents: true
---

## Types and variables

A type defines representation, valid operations, and range. A variable combines a name, type, value, lifetime, and visibility.

## Type selection, initialization, scope, and lifetime

- Choose a type by meaning and range, not size alone.
- Brace initialization rejects many accidental narrowing conversions.
- const prevents later mutation; constexpr can represent compile-time values.
- Local scope reduces coupling; a static local retains value across calls.
- Unicode defines characters; UTF-8 and UTF-16 encode them into storage units.

## Declaration and initialization examples

```cpp
#include <limits>
#include <string>

int age{20};
double price{49.95};
const std::string country{"Egypt"};
constexpr int daysPerWeek{7};
```

## Range, precision, and platform mistakes

- Type sizes can vary; use sizeof and numeric_limits when it matters.
- float and double are approximate, so direct decimal equality can be unsafe.

## Lesson map

<div class="lesson-diagram" role="img" aria-label="Concept map: Types, variables, scope, and text encoding">
<p class="lesson-diagram-title">Concept map: Types, variables, scope, and text encoding</p>
<div class="diagram-flow">
<div class="diagram-node input"><span>Type and value</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>Initialization and range</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>Example</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node decision"><span>Corrections and common mistakes</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node output"><span>A type defines representation, valid operations, and range. A</span></div>
</div>
</div>

## Type categories and ranges

Built-in types include Boolean, character, integer, floating-point, and `void`. Compound and user-defined types include arrays, pointers, references, classes, and enums, while `std::string` comes from the standard library. Sizes vary by implementation, so inspect `sizeof` and `numeric_limits` rather than assuming one platform.

Unsigned arithmetic wraps modulo its width, while signed overflow is undefined. Mixing signed and unsigned values can turn a negative number into a large positive value. Floating-point values have limited binary precision, so exact decimal equality is often inappropriate.

## Initialization, constants, scope, and lifetime

Brace initialization catches many narrowing conversions. Value initialization with `{}` gives a defined zero-like value for arithmetic types. `auto` still has a concrete inferred type. `const` prevents later modification through that name; `constexpr` supports compile-time values when requirements are met.

Scope determines where a name is visible. Lifetime determines when the object exists. Shadowing hides an outer name and can confuse review. Optimizers may keep values in registers or remove storage entirely, so a source-level variable does not guarantee a permanent memory slot.

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
