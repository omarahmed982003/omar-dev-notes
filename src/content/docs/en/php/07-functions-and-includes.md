---
title: 7. Functions, callbacks, and includes
description: Parameters, references, closures, arrow functions, callables, include, and require.
sidebar:
  order: 7
---

Functions package reusable behaviour. PHP does not support declaring several global functions with the same name merely to overload signatures.

```php
function calculateTotal(float $price, int $quantity = 1): float
{
    return $price * $quantity;
}

echo calculateTotal(quantity: 3, price: 19.5);

function sum(int ...$numbers): int
{
    return array_sum($numbers);
}
```

Parameters are names in the declaration; arguments are supplied values. Prefer returning data over printing inside business functions. Passing by reference with `&` mutates the caller’s variable, so use it deliberately.

```php
function greet(string $name): string { return "Hello {$name}"; }
$functionName = 'greet';
echo $functionName('Omar');

$tax = 0.14;
$long = function (float $price) use ($tax): float {
    return $price * (1 + $tax);
};
$short = fn (float $price): float => $price * (1 + $tax);

$clean = array_map(trim(...), [' ali ', 'mona ']);
```

Closures explicitly capture with `use` and may capture by reference. Arrow functions capture outer variables automatically by value and contain one expression. Verify uncertain callbacks with `is_callable()`. Avoid nested named function declarations; use closures.

## Including files

```php
$config = require __DIR__ . '/../config/app.php';
include __DIR__ . '/partials/header.php';
```

`require` failure raises an `Error` on modern PHP; `include` emits `E_WARNING` and normally continues. The `_once` variants prevent duplicate inclusion. An included file may `return` a value and inherits the scope at the include point. Use `__DIR__` for stable paths, `require_once` for unique definitions, and Composer autoload for project classes.

`goto label;` can jump to a label in the same file/scope, but cannot jump into a loop or switch. Small functions, `break`, and `continue` are usually clearer.

## Lesson map

<div class="lesson-diagram" role="img" aria-label="Concept map: Functions, callbacks, and includes">
<p class="lesson-diagram-title">Concept map: Functions, callbacks, and includes</p>
<div class="diagram-flow">
<div class="diagram-node input"><span>Including files</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>Functions package reusable behaviour</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>Parameters are names in the declaration; arguments are</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node decision"><span>Closures explicitly capture with use and may capture</span></div>
</div>
</div>

## Check your understanding

<div class="lesson-quiz" role="list">
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">01</span><p>Explain “Including files” as if reviewing a real implementation. What is its goal and most important constraint?</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> require failure raises an Error on modern PHP; include emits E_WARNING and normally continues. The _once variants prevent duplicate inclusion. An included file may return a value and inherits the scope at the include point. Use __DIR__ for stable paths, require_once for unique definitions, and Composer autoload for project classes. goto label; can jump to a label in the same file/scope, but cannot jump into a loop… In practice, a successful happy path is insufficient: document assumptions and validate the values and states that can break this behavior.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">02</span><p>Compare “Including files” with “Functions package reusable behaviour”. Why does neither replace the other in “Functions, callbacks, and includes”?</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> For “Including files”: require failure raises an Error on modern PHP; include emits E_WARNING and normally continues. The _once variants prevent duplicate inclusion. An included file may return a value and inherits the scope at the include point. Use __DIR__ for stable paths, require_once for unique definitions, and Composer autoload for project classes. goto label; can jump to a label in the same file/scope, but cannot jump into a loop… For “Functions package reusable behaviour”: Functions package reusable behaviour. PHP does not support declaring several global functions with the same name merely to overload signatures. The first covers one part of the design while the second completes the behavior or constraints required for a correct implementation.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">03</span><p>Assume a system ignores “Parameters are names in the declaration; arguments are”. What failure or risk should you expect, and how would a test expose it?</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> Parameters are names in the declaration; arguments are supplied values. Prefer returning data over printing inside business functions. Passing by reference with &amp; mutates the caller’s variable, so use it deliberately. Test a valid path, an exact boundary, and invalid input, then inspect output, side effects, and logs rather than treating the absence of an exception as success.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">04</span><p>Turn “Closures explicitly capture with use and may capture” into a reviewable engineering decision. What should be documented and tested?</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> Closures explicitly capture with use and may capture by reference. Arrow functions capture outer variables automatically by value and contain one expression. Verify uncertain callbacks with is_callable(). Avoid nested named function declarations; use closures. Record the rationale, alternatives, and limits; test normal behavior, minimum and maximum boundaries, partial failure, and retry or repetition when applicable.</div></details>
</section>
</div>
