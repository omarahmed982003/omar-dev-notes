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
<div class="diagram-node input"><span>Meaning of the value</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>Choose the type</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>Correct initialization</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node decision"><span>Scope and lifetime</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node output"><span>Safe permitted operations</span></div>
</div>
</div>

## Type categories and ranges

Built-in types include Boolean, character, integer, floating-point, and `void`. Compound and user-defined types include arrays, pointers, references, classes, and enums, while `std::string` comes from the standard library. Sizes vary by implementation, so inspect `sizeof` and `numeric_limits` rather than assuming one platform.

Unsigned arithmetic wraps modulo its width, while signed overflow is undefined. Mixing signed and unsigned values can turn a negative number into a large positive value. Floating-point values have limited binary precision, so exact decimal equality is often inappropriate.

## Initialization, constants, scope, and lifetime

Brace initialization catches many narrowing conversions. Value initialization with `{}` gives a defined zero-like value for arithmetic types. `auto` still has a concrete inferred type. `const` prevents later modification through that name; `constexpr` supports compile-time values when requirements are met.

Scope determines where a name is visible. Lifetime determines when the object exists. Shadowing hides an outer name and can confuse review. Optimizers may keep values in registers or remove storage entirely, so a source-level variable does not guarantee a permanent memory slot.

## Signed, unsigned, floating point, and literals

Signed integer overflow is undefined behavior; unsigned arithmetic wraps modulo its range but can still be a logic bug. Floating-point values have limited precision, so many decimal fractions are approximations. `10` is an integer literal, `10.0` is `double`, `10LL` requests `long long`, and `10.0f` requests `float`.

## Initialization, assignment, auto, and undefined values

Initialization creates an object with its first value; assignment changes an existing object. `auto` performs compile-time type deduction and does not create a dynamically changing type. Reading an uninitialized automatic variable can produce undefined behavior. Use the narrowest useful scope and distinguish name visibility from object lifetime.

## Complete program: types and range validation

```cpp
#include <iostream>
#include <string>
int main() {
    std::string name; int age{}; long long balancePiasters{};
    std::cout << "Name age balance-in-piasters: ";
    if (!(std::cin >> name >> age >> balancePiasters)) {
        std::cerr << "Invalid input\n"; return 1;
    }
    if (age < 0 || age > 130 || balancePiasters < 0) {
        std::cerr << "Value outside the accepted range\n"; return 1;
    }
    const bool adult = age >= 18;
    std::cout << name << " | age=" << age
              << " | adult=" << std::boolalpha << adult
              << " | balance=" << balancePiasters << " piasters\n";
}
```

`Omar 24 12550` is valid, while `Omar -2 100` has valid C++ types but violates the domain. A type does not replace validation.

## Signed, unsigned, and range

Unsigned arithmetic wraps modulo `2^n`, but that does not make it a general cure for negative values or overflow. Mixing signed and unsigned operands may convert the signed value to unsigned and produce a surprising comparison. Choose a signed type for ordinary quantities that may participate in subtraction, and validate that domain values are nonnegative.

Use `std::numeric_limits<T>::min()` and `max()` when range matters. `<cstdint>` types such as `std::int64_t` communicate width when the implementation provides them.

## Floating point and precision

`float` and `double` approximate most decimal fractions in binary. Equality after arithmetic can therefore be unreliable; compare a difference against a tolerance chosen for the problem scale. Floating point is appropriate for measurements, but exact money calculations usually use integer minor units.

## Constants, storage duration, scope, and shadowing

`const` prevents mutation after initialization. `constexpr` additionally allows compile-time evaluation when its initializer is a constant expression. Local automatic variables live until their block ends; static-storage objects live for the program duration. Scope controls where a name is visible, while lifetime controls whether the object still exists.

Declaring an inner variable with the same name shadows the outer one:

```cpp
int count{10};
{
    int count{2};  // a different object
    std::cout << count << '\n';
}
std::cout << count << '\n';
```

The output is `2` then `10`. Avoid unnecessary shadowing because it makes reviews and debugging harder.

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
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">05</span><p>Predict the output of <code>int x{3}; double y{x / 2};</code> when <code>y</code> is printed. Why?</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> It prints 1 because integer division happens before conversion to double. Use <code>double y = x / 2.0;</code> to obtain 1.5.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">06</span><p>Correct a declaration that stores a visitor count above two billion and must not change after initialization.</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> After input validation, use a documented-width type such as <code>const std::int64_t visitors{value};</code> instead of assuming <code>int</code> is wide enough.</div></details>
</section>
</div>
