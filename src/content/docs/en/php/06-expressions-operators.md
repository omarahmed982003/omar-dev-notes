---
title: 6. Expressions and operators
description: Values, precedence, arithmetic, assignment, comparison, logic, arrays, execution, and pipes.
sidebar:
  order: 6
---

Every PHP expression has a value; assignment itself evaluates to the assigned value.

```php
$b = $a = 5;
$result = 1 + 5 * 3;    // 16
$grouped = (1 + 5) * 3; // 18

$ok = true && false;    // false
$ok = true and false;   // assignment happens first: true
```

Prefer parentheses over memorising precedence, and normally use `&&` and `||`.

Arithmetic operators are `+ - * / % **`; assignments include `+= -= *= /= %= **= .= ??=`. Prefix increment changes then returns; postfix returns then changes.

Use `===`/`!==` when type matters. The spaceship `<=>` returns -1, 0, or 1 and is convenient in sorting.

```php
usort($numbers, fn (int $a, int $b): int => $a <=> $b);

$union = ['a' => 1, 'shared' => 'left']
       + ['b' => 2, 'shared' => 'right'];
```

Array `+` is key union: left-side duplicate keys win. It is not the same as `array_merge()`. Array `===` additionally requires identical types and order. Use `instanceof` for object type checks. Object assignment normally points both variables at the same object; use `clone` for another instance.

Avoid the `@` error-control operator because it hides diagnostics. Backticks, `exec`, `system`, `shell_exec`, and `proc_open` execute operating-system commands.

:::danger
Never interpolate user input into a shell command. Prefer a safe API; when process execution is unavoidable, allow-list the command and arguments and run with minimal privileges.
:::

## Pipe operator — PHP 8.5+

```php
$slug = ' PHP 8.5 Released '
    |> trim(...)
    |> (fn (string $s) => str_replace(' ', '-', $s))
    |> strtolower(...);
```

`|>` passes the left value as the single argument to the callable on the right. This syntax does not run on PHP 8.4 or earlier.

## Lesson map

<div class="lesson-diagram" role="img" aria-label="Concept map: Expressions and operators">
<p class="lesson-diagram-title">Concept map: Expressions and operators</p>
<div class="diagram-flow">
<div class="diagram-node input"><span>Pipe operator — PHP 8.5+</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>Every PHP expression has a value; assignment itself</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>Prefer parentheses over memorising precedence, and normally use</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node decision"><span>Arithmetic operators are + - * / %</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node output"><span>Use ===/!== when type matters</span></div>
</div>
</div>

## Check your understanding

<div class="lesson-quiz" role="list">
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">01</span><p>Explain “Pipe operator — PHP 8.5+” as if reviewing a real implementation. What is its goal and most important constraint?</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> |&gt; passes the left value as the single argument to the callable on the right. This syntax does not run on PHP 8.4 or earlier. In practice, a successful happy path is insufficient: document assumptions and validate the values and states that can break this behavior.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">02</span><p>Compare “Pipe operator — PHP 8.5+” with “Every PHP expression has a value; assignment itself”. Why does neither replace the other in “Expressions and operators”?</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> For “Pipe operator — PHP 8.5+”: |&gt; passes the left value as the single argument to the callable on the right. This syntax does not run on PHP 8.4 or earlier. For “Every PHP expression has a value; assignment itself”: Every PHP expression has a value; assignment itself evaluates to the assigned value. The first covers one part of the design while the second completes the behavior or constraints required for a correct implementation.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">03</span><p>Assume a system ignores “Prefer parentheses over memorising precedence, and normally use”. What failure or risk should you expect, and how would a test expose it?</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> Prefer parentheses over memorising precedence, and normally use &amp;&amp; and ||. Test a valid path, an exact boundary, and invalid input, then inspect output, side effects, and logs rather than treating the absence of an exception as success.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">04</span><p>Turn “Arithmetic operators are + - * / %” into a reviewable engineering decision. What should be documented and tested?</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> Arithmetic operators are + - * / % ; assignments include += -= *= /= %= = .= ??=. Prefix increment changes then returns; postfix returns then changes. Record the rationale, alternatives, and limits; test normal behavior, minimum and maximum boundaries, partial failure, and retry or repetition when applicable.</div></details>
</section>
</div>
