---
title: "9. if, else, validation, and nesting"
sidebar:
  order: 9
description: "if and else direct execution. Write conditions as readable rules and reduce nesting through early validation and grouped logic."
tableOfContents: true
---

## How if chooses an execution path

if and else direct execution. Write conditions as readable rules and reduce nesting through early validation and grouped logic.

## if, else, else-if, and short circuiting

- if accepts a contextually Boolean expression, but explicit predicates are often clearer.
- Braces prevent maintenance bugs when a one-line body grows.
- else binds to the nearest unmatched if; braces remove ambiguity.
- An else-if chain is exclusive; separate if statements may all run.
- Place specific boundary cases before broad cases.
- Short-circuiting can validate a denominator or index before use.

## Example: validate and classify a score

```cpp
if (score < 0 || score > 100) {
    std::cout << "Invalid score\n";
} else if (score >= 85) {
    std::cout << "Excellent\n";
} else if (score >= 50) {
    std::cout << "Pass\n";
} else {
    std::cout << "Fail\n";
}
```

## Assignment, empty-body, and nesting mistakes

- if (x = 5) assigns instead of comparing.
- A semicolon immediately after if creates an empty body.

<div class="lesson-diagram" role="img" aria-label="if/else flow: validate first, then choose one branch">
<p class="lesson-diagram-title">if/else flow: validate first, then choose one branch</p>
<div class="diagram-flow">
<div class="diagram-node input"><span>Read value</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node decision"><span>Valid?</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node decision"><span>Which range?</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>Run branch</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node output"><span>Return result</span></div>
</div>
</div>

## From business rule to condition

Write the rule in plain language, identify variables and boundaries, and then translate it into a Boolean expression. “Accept when quantity is positive and stock is sufficient” becomes `quantity > 0 && quantity <= stock`. Test zero, one, exactly the stock, and one above it.

Validate invalid input first, then special cases, then the general rule. Use separate `if` statements when several labels may apply, and an `else if` chain when exactly one outcome must win. Parenthesize mixed `&&` and `||` rules even when precedence would produce the same result.

## Decision ordering and short circuiting

Reject invalid data first, then handle special cases, then the general rule. `&&` and `||` short circuit, but parentheses still document grouped business rules. Several independent `if` statements may all run; an `if/else if/else` chain selects only the first true branch.

## Nested decisions, guard clauses, and strings

Nesting is useful when the second question has no meaning until the first succeeds. Guard clauses can reject invalid states early and keep the normal path shallow. `std::string` supports `==`, but case and surrounding whitespace are part of the value unless the input contract defines normalization.

## De Morgan's laws

The negation of `(age >= 18 && hasId)` is `(age < 18 || !hasId)`. Use the equivalent form that states the rule most clearly, and name complex Boolean parts instead of building one unreadable expression.

## Complete program: validate, then classify

```cpp
#include <iostream>
int main() {
    int score{};
    std::cout << "Score from 0 to 100: ";
    if (!(std::cin >> score)) { std::cerr << "Score must be an integer\n"; return 1; }
    if (score < 0 || score > 100) std::cout << "Invalid score\n";
    else if (score >= 85) std::cout << "Excellent\n";
    else if (score >= 50) std::cout << "Pass\n";
    else std::cout << "Fail\n";
}
```

Test `-1`, `0`, `49`, `50`, `84`, `85`, `100`, `101`, and malformed text. Putting `score >= 50` first makes the excellent branch unreachable.

## Boolean context, independent conditions, and exclusive chains

An `if` converts its condition to Boolean. Write comparisons that communicate intent instead of depending on accidental nonzero values. Use separate `if` statements when several outcomes may all apply, such as awarding multiple badges. Use one `if`/`else if` chain when exactly one classification must win.

Order overlapping thresholds from the most specific to the least specific. If `score >= 50` appears before `score >= 85`, an excellent score is captured by the earlier branch.

## Compound text input and early validation

When a decision uses a full name or sentence, read it with `std::getline`. If formatted extraction preceded it, consume the leftover newline deliberately. Validate syntax and range before applying business rules, and use guard clauses to keep the valid path shallow.

```cpp
if (!(std::cin >> age)) {
    std::cerr << "Invalid number\n";
    return 1;
}
if (age < 0 || age > 120) {
    std::cerr << "Age outside the accepted range\n";
    return 1;
}
```

## Check your understanding

<div class="lesson-quiz" role="list">
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">01</span><p>Why must score&gt;=85 come before score&gt;=50?</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> An else-if chain stops at the first true branch; placing &gt;=50 first would swallow excellent scores.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">02</span><p>What does if(x=5) do?</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> It assigns 5 to x and then treats the nonzero result as true; use <code>==</code> and enable compiler warnings.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">03</span><p>When are independent if statements better than else-if?</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> When multiple outcomes may coexist, such as awarding several badges; else-if is for exclusive results.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">04</span><p>How can deeply nested validation be reduced?</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> Reject invalid states early with guard clauses so the main valid path remains shallow.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">05</span><p>A chain tests <code>score &gt;= 50</code> before <code>score &gt;= 85</code>. Why can it never award excellent?</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> A score of 85 satisfies the first branch and the else-if chain stops. Order thresholds from most specific and highest to lowest.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">06</span><p>Correct <code>if (age = 18)</code> and name one way to prevent the bug from passing silently.</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> Write <code>if (age == 18)</code>, enable warnings such as <code>-Wall -Wextra -Werror</code>, and test ages 17 and 18.</div></details>
</section>
</div>
