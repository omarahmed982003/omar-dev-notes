---
title: "7. Operators, expressions, and bitwise operations"
sidebar:
  order: 7
description: "Operators build expressions, and conversions determine the type used for evaluation. Learn the rules rather than relying on trial and error."
tableOfContents: true
---

## Expressions and operators

Operators build expressions, and conversions determine the type used for evaluation. Learn the rules rather than relying on trial and error.

## Arithmetic, comparisons, logic, and bits

- Integer division discards the fraction; convert an operand to double when needed.
- % computes an integer remainder.
- Relational and logical operators produce bool.
- static_cast documents intent but cannot make a lossy conversion safe.
- Signed overflow is dangerous; inspect limits with numeric_limits.
- Bitwise operators manipulate bits and do not replace && or ||.

## Example: an average without integer truncation

```cpp
int total{7};
int count{2};
double average = static_cast<double>(total) / count; // 3.5
bool valid = count > 0 && average >= 0.0;
```

## Assignment, precedence, and overflow mistakes

- Do not confuse `=` with `==`.
- Add parentheses when precedence makes intent unclear.

## Input, operator groups, and math

Check the stream before using input. Use `getline` for text containing spaces and handle the leftover newline when mixing it with `>>`.

```cpp
double price{};
int quantity{};
if (!(std::cin >> price >> quantity) || price < 0 || quantity < 0) {
    std::cerr << "Invalid input\n";
    return 1;
}
```

Arithmetic, comparison, logical, assignment, increment, bitwise, and conditional operators solve different problems. Short circuiting can guard an unsafe operation. Prefer `static_cast` to document conversions, use `numeric_limits` for type bounds, and use `<cmath>` for `sqrt`, `round`, `ceil`, and `floor`. Name intermediate formula results and normalize units before calculating.

## Expressions, precedence, and side effects

Expressions may produce values and change state. Keep multiple mutations out of one dense expression. Precedence groups multiplication before addition, `&&` before `||`, and assignment from right to left. Use parentheses when several operator families make the business rule hard to read.

Prefix increment produces the new value; postfix produces the old value before the increment. Bitwise `&`, `|`, `^`, `~`, `<<`, and `>>` manipulate representations and masks. They differ from logical `&&` and `||`, which produce Boolean results and short-circuit.

Use the conditional operator for one short value choice. Replace deeply nested ternaries with readable branches.

## Lesson map

<div class="lesson-diagram" role="img" aria-label="Concept map: Operators, conversions, and type limits">
<p class="lesson-diagram-title">Concept map: Operators, conversions, and type limits</p>
<div class="diagram-flow">
<div class="diagram-node input"><span>Operands</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>Promotions</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>Operation</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node decision"><span>Range check</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node output"><span>Result type</span></div>
</div>
</div>

## Compound assignment, increments, and short circuiting

`x += y` means update `x` with the sum, while prefix and postfix increment differ in the value produced by the expression. Prefer prefix when the old value is not needed. `&&` and `||` short circuit, so a safety check such as `denominator != 0 && numerator / denominator > 2` prevents invalid division.

## Overflow and bit masks

Signed overflow is undefined; unsigned values wrap but may still violate the program's contract. Widen an operand before multiplication. A named unsigned mask can enable a flag with `|`, test it with `&`, remove it with `& ~flag`, and toggle it with `^`. Bitwise operations are not substitutes for Boolean logic.

## Complete program: conversion and safe division

```cpp
#include <iostream>
int main() {
    long long total{}; int count{};
    std::cout << "Total and count: ";
    if (!(std::cin >> total >> count) || count <= 0) {
        std::cerr << "Count must be positive\n"; return 1;
    }
    const double average = static_cast<double>(total) / count;
    std::cout << "Average: " << average << '\n'
              << "High average: " << std::boolalpha << (average >= 85.0) << '\n';
}
```

`double average = total / count;` performs integer division before conversion. Test `7 2` and a zero count.

## Conversions and narrowing

Integral promotion occurs before many arithmetic operations. Usual arithmetic conversions then choose a common type for both operands. Assignment converts the result afterward, so a wide destination cannot repair overflow that already happened in a narrow intermediate expression.

Brace initialization rejects many narrowing conversions. `static_cast<int>(3.9)` makes truncation explicit but does not prove that an arbitrary value lies inside the target range; check the range first.

## Prefix, postfix, and the conditional operator

Prefix increment changes the value and yields the updated value. Postfix yields the old value and then increments. Do not combine several mutations of the same variable in a dense expression; separate statements preserve intent.

The conditional operator selects one of two expressions:

```cpp
const int absolute = value >= 0 ? value : -value;
```

Use it for a small value choice, not as a replacement for a multi-step `if` block.

## Bitwise operators and masks

`&`, `|`, `^`, `~`, `<<`, and `>>` operate on bit patterns. A mask can test, set, clear, or toggle one flag. Keep bitwise expressions on unsigned values when shifts are involved, document each bit's meaning, and do not confuse `&` with logical `&&`.

```cpp
constexpr unsigned canRead = 1u << 0;
constexpr unsigned canWrite = 1u << 1;
unsigned permissions = canRead | canWrite;
const bool writable = (permissions & canWrite) != 0;
```

## Math formulas and domain checks

`<cmath>` provides `std::sqrt`, `std::pow`, `std::floor`, `std::ceil`, and rounding functions. Translate the mathematical formula with parentheses, verify the function domain, and test intermediate range. For example, square root requires a nonnegative real argument, and an integer formula such as `n * (n + 1) / 2` must widen before multiplication.

## Check your understanding

<div class="lesson-quiz" role="list">
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">01</span><p>What are 7/2 and 7.0/2, and why?</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> The first is integer 3; the second is 3.5 because a double operand promotes floating-point division.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">02</span><p>Why is static_cast&lt;int&gt;(largeDouble) not a safety guarantee?</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> It documents intent but can discard fractions or receive an out-of-range value; validate before casting.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">03</span><p>How do &amp;&amp; and &amp; differ for Boolean-looking values?</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> &amp;&amp; is logical and short-circuits; &amp; is bitwise and evaluates both operands. Their apparent Boolean results can hide different behavior.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">04</span><p>How can n*(n+1)/2 avoid intermediate overflow?</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> Promote before multiplication, for example 1LL*n, and confirm the wider type supports the maximum input.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">05</span><p>Predict <code>7 / 2</code> and <code>7 / 2.0</code>, then explain the difference.</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> The first is 3 because both operands are integers; the second is 3.5 because 2.0 makes the operation floating point.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">06</span><p>What is wrong with <code>long long total = a * b;</code> when <code>a</code> and <code>b</code> are int?</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> The int multiplication can overflow before assignment. Use <code>1LL * a * b</code> and still confirm that long long covers the required range.</div></details>
</section>
</div>
