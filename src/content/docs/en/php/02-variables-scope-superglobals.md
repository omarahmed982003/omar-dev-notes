---
title: 2. Variables, scope, and superglobals
description: Naming, assignment by value/reference, scope, static locals, and request superglobals.
sidebar:
  order: 2
---

PHP variables start with `$`; the name begins with a letter or underscore, may then contain digits, and is case-sensitive.

```php
$name = 'Omar';
$count = 3;
echo "{$name}: {$count}";
```

Double-quoted strings interpolate variables; single-quoted strings normally do not. Prefer `{$name}` for clear interpolation.

```php
$a = 10;
$b = $a;   // value copy
$b++;

$x = 10;
$y =& $x;  // both names refer to the same value container
$y++;
unset($y);
```

References are not manual C-style pointers; use them sparingly. Variable variables also exist:

```php
$field = 'email';
$$field = 'omar@example.com';
echo $email;
```

Prefer arrays or objects when names may come from user input.

## Scope

Global values are not automatically visible inside functions. `global $name` and `$GLOBALS['name']` expose them, but explicit arguments are easier to test.

```php
function nextId(): int
{
    static $id = 0;
    return ++$id;
}
```

A local `static` value is initialized once and survives later calls in the same process. Included files inherit the scope at the include point.

## Superglobals

`$_GET`, `$_POST`, `$_SERVER`, `$_FILES`, `$_COOKIE`, `$_SESSION`, and `$GLOBALS` are available in every scope.

```php
$method = $_SERVER['REQUEST_METHOD'] ?? 'CLI';
$page = filter_input(INPUT_GET, 'page', FILTER_VALIDATE_INT) ?: 1;
$ids = $_GET['check_orders'] ?? []; // ?check_orders[]=10&check_orders[]=20
$ids = is_array($ids) ? array_map('intval', $ids) : [];
```

Input is never trusted merely because PHP parsed it. Validate it, escape output, and use prepared SQL statements.

:::danger[`eval()`]
`eval('echo "hello";');` executes a string as PHP code. Never feed it user input; ordinary applications should replace it with functions, callback maps, or classes.
:::

## Lesson map

<div class="lesson-diagram" role="img" aria-label="Concept map: Variables, scope, and superglobals">
<p class="lesson-diagram-title">Concept map: Variables, scope, and superglobals</p>
<div class="diagram-flow">
<div class="diagram-node input"><span>Scope</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>Superglobals</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>PHP variables start with $; the name begins</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node decision"><span>Double-quoted strings interpolate variables; single-quoted strings norma…</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node output"><span>References are not manual C-style pointers; use them</span></div>
</div>
</div>

## Check your understanding

<div class="lesson-quiz" role="list">
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">01</span><p>Explain “Scope” as if reviewing a real implementation. What is its goal and most important constraint?</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> Global values are not automatically visible inside functions. global $name and $GLOBALS['name'] expose them, but explicit arguments are easier to test. A local static value is initialized once and survives later calls in the same process. Included files inherit the scope at the include point. In practice, a successful happy path is insufficient: document assumptions and validate the values and states that can break this behavior.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">02</span><p>Compare “Scope” with “Superglobals”. Why does neither replace the other in “Variables, scope, and superglobals”?</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> For “Scope”: Global values are not automatically visible inside functions. global $name and $GLOBALS['name'] expose them, but explicit arguments are easier to test. A local static value is initialized once and survives later calls in the same process. Included files inherit the scope at the include point. For “Superglobals”: $_GET, $_POST, $_SERVER, $_FILES, $_COOKIE, $_SESSION, and $GLOBALS are available in every scope. Input is never trusted merely because PHP parsed it. Validate it, escape output, and use prepared SQL statements. :::danger[eval()] eval('echo &quot;hello&quot;;'); executes a string as PHP code. Never feed it user input; ordinary applications should replace it with functions, callback maps, or classes. ::: The first covers one part of the design while the second completes the behavior or constraints required for a correct implementation.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">03</span><p>Assume a system ignores “PHP variables start with $; the name begins”. What failure or risk should you expect, and how would a test expose it?</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> PHP variables start with $; the name begins with a letter or underscore, may then contain digits, and is case-sensitive. Test a valid path, an exact boundary, and invalid input, then inspect output, side effects, and logs rather than treating the absence of an exception as success.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">04</span><p>Turn “Double-quoted strings interpolate variables; single-quoted strings norma…” into a reviewable engineering decision. What should be documented and tested?</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> Double-quoted strings interpolate variables; single-quoted strings normally do not. Prefer for clear interpolation. Record the rationale, alternatives, and limits; test normal behavior, minimum and maximum boundaries, partial failure, and retry or repetition when applicable.</div></details>
</section>
</div>
