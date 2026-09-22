---
title: 4. Output, debugging, and constants
description: echo, print, value inspection, regular, magic, and predefined constants.
sidebar:
  order: 4
---

`echo` and `print` are language constructs. `echo` has no return value and can accept multiple comma-separated arguments without parentheses; `print` accepts one value and returns `1`.

```php
echo 'Hello', ' ', 'PHP', PHP_EOL;
$result = print 'Printed';
var_dump($result);
```

The performance difference is irrelevant. Escape untrusted HTML output with `htmlspecialchars`.

```php
$user = ['id' => 7, 'active' => true];
var_dump($user);
print_r($user);
$text = print_r($user, true);
echo get_debug_type($user);
```

Framework helpers such as `dump()` and `dd()` are useful in development; do not expose debug data in production.

```php
const APP_NAME = 'Omar Notes';
define('APP_VERSION', '1.0.0');

class HttpStatus
{
    public const OK = 200;
}
```

`define()` executes at runtime and may appear conditionally; it defines a global constant, not a class constant. `const` is a declaration and can define class constants, but cannot be placed inside a function or conditional block.

Magic constants include `__LINE__`, `__FILE__`, `__DIR__`, `__FUNCTION__`, and `__CLASS__`. Predefined constants include `PHP_VERSION`, `PHP_OS_FAMILY`, and `PHP_EOL`. Use `__DIR__` for reliable include paths.

## Lesson map

<div class="lesson-diagram" role="img" aria-label="Concept map: Output, debugging, and constants">
<p class="lesson-diagram-title">Concept map: Output, debugging, and constants</p>
<div class="diagram-flow">
<div class="diagram-node input"><span>echo and print are language constructs</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>The performance difference is irrelevant</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>Framework helpers such as dump() and dd() are</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node decision"><span>define() executes at runtime and may appear conditionally;</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node output"><span>Magic constants include __LINE__, __FILE__, __DIR__, __FUNCTION__, and</span></div>
</div>
</div>

## Check your understanding

<div class="lesson-quiz" role="list">
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">01</span><p>Explain “echo and print are language constructs” as if reviewing a real implementation. What is its goal and most important constraint?</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> echo and print are language constructs. echo has no return value and can accept multiple comma-separated arguments without parentheses; print accepts one value and returns 1. In practice, a successful happy path is insufficient: document assumptions and validate the values and states that can break this behavior.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">02</span><p>Compare “echo and print are language constructs” with “The performance difference is irrelevant”. Why does neither replace the other in “Output, debugging, and constants”?</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> For “echo and print are language constructs”: echo and print are language constructs. echo has no return value and can accept multiple comma-separated arguments without parentheses; print accepts one value and returns 1. For “The performance difference is irrelevant”: The performance difference is irrelevant. Escape untrusted HTML output with htmlspecialchars. The first covers one part of the design while the second completes the behavior or constraints required for a correct implementation.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">03</span><p>Assume a system ignores “Framework helpers such as dump() and dd() are”. What failure or risk should you expect, and how would a test expose it?</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> Framework helpers such as dump() and dd() are useful in development; do not expose debug data in production. Test a valid path, an exact boundary, and invalid input, then inspect output, side effects, and logs rather than treating the absence of an exception as success.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">04</span><p>Turn “define() executes at runtime and may appear conditionally;” into a reviewable engineering decision. What should be documented and tested?</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> define() executes at runtime and may appear conditionally; it defines a global constant, not a class constant. const is a declaration and can define class constants, but cannot be placed inside a function or conditional block. Record the rationale, alternatives, and limits; test normal behavior, minimum and maximum boundaries, partial failure, and retry or repetition when applicable.</div></details>
</section>
</div>
