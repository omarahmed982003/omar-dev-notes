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
<div class="diagram-node input"><span>Values and operators</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>Expression</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>Example</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node decision"><span>Corrections and common mistakes</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node output"><span>Operators build expressions, and conversions determine the type used</span></div>
</div>
</div>

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
</div>
