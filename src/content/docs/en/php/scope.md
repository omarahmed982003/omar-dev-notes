---
title: "Variable scope and lifetime"
prev: {"link":"/en/php/07-functions-and-includes/","label":"Functions and callbacks"}
next: {"link":"/en/php/11-errors-exceptions/","label":"Errors and exceptions"}
description: "Variable scope and lifetime"
sidebar:
  order: 7.5
---

Requires functions. Scope controls where a variable name is visible. Lifetime describes how long its value exists, which is a different question. Global state is an implicit shared dependency; compare it with explicit function inputs.

## What is scope?

**Scope** is the region where a variable name is visible. A variable created inside a function is local to that function; a file-level variable is not automatically visible inside it.

```php
$taxRate = 0.14;

function showLocalScope(): void
{
    $message = 'I exist inside this function';
    echo $message;

    // echo $taxRate; // not automatically visible
}

showLocalScope();
// echo $message; // not visible here
```

<figure class="concept-visual" aria-labelledby="php-scope-visual-title">
<div class="visual-heading" id="php-scope-visual-title">Follow the call: which names are visible at each point?</div>
<p class="visual-note">Open these steps in order while reading <code>showLocalScope()</code> above. This illustrates name visibility, not RAM allocation.</p>
<details class="trace-step" open>
<summary>1 — Before the function call</summary>
<div class="trace-state visual-panel"><p class="visual-label">File scope</p><p dir="ltr"><code>$taxRate = 0.14</code></p><p>File-level code can use <code>$taxRate</code>. The function body has not run, so this call has not created its local <code>$message</code>.</p></div>
</details>
<details class="trace-step">
<summary>2 — While showLocalScope() is running</summary>
<div class="trace-state visual-panel"><p class="visual-label">Local scope</p><p dir="ltr"><code>$message = 'I exist inside this function'</code></p><p><code>echo $message</code> reads the local name. The file-level <code>$taxRate</code> is not automatically visible inside the function; being in the same file does not make it accessible.</p></div>
</details>
<details class="trace-step">
<summary>3 — After the function returns</summary>
<div class="trace-state visual-panel"><p class="visual-label">Back to file scope</p><p dir="ltr"><code>$taxRate → 0.14</code></p><p>File-level code can still see <code>$taxRate</code>, but cannot use the function-local name <code>$message</code>. This example does not retain its local value outside the call. A name being invisible is not a general guarantee that every associated value was immediately erased from memory.</p></div>
</details>
<figcaption>Scope asks “can this code use the name?” Lifetime asks “how long does the value exist?” Track the name and the value separately as you continue through the examples.</figcaption>
</figure>

Prefer explicit parameters:

```php
function priceWithTax(int $priceCents, float $taxRate): int
{
    return (int) round($priceCents * (1 + $taxRate));
}

echo priceWithTax(10000, 0.14); // 11400
```

The dependency is visible, and the function is easy to test with chosen inputs.

## `global` and `$GLOBALS`

PHP allows access to file-level state:

```php
$total = 100;

function addTaxUsingGlobal(float $rate): float
{
    global $total;
    return $total * (1 + $rate);
}
```

The same state is available through `$GLOBALS['total']`. Both forms hide a dependency. If distant code changes `$total`, this function's result changes. Passing the value explicitly is normally easier to understand and test.

```php
function addTaxUsingGlobals(float $rate): float
{
    return $GLOBALS['total'] * (1 + $rate);
}
```

## Local `static` variables

A local `static` variable is initialized once and retains its value between calls in one CLI process or ordinary PHP request. Traditional FPM resets userland state (application values and definitions) between requests even when the same worker is reused. A long-running job loop can retain that state and needs deliberate reset. The following example is CLI:

```php
function nextId(): int
{
    static $id = 0;
    return ++$id;
}

echo nextId(), PHP_EOL; // 1
echo nextId(), PHP_EOL; // 2
echo nextId(), PHP_EOL; // 3
```

This is not permanent storage. A new process starts over. Hidden state can also complicate tests, so do not use a local static variable as a database or shared cache.

## Scope of included files

An `include` or `require` inherits the scope at the inclusion point:

```php
function loadConfig(): array
{
    $environment = 'development';
    return require __DIR__ . '/config.php';
}
```

`config.php` can see `$environment` because inclusion happened inside the function. Prefer configuration files that return a clear value instead of silently modifying many surrounding variables.


## Independent exercise

Compare a counter using an ordinary local with one using static. Predict two calls to each.

<details><summary>Review after trying</summary>

An ordinary local restarts on each call; static persists between calls in the same process/request, not independent HTTP requests.

</details>


## Check your understanding

<div class="quiz-list" role="list">
<section class="quiz-card" role="listitem"><div class="quiz-question-row"><span class="quiz-number">01</span><p>Why is an explicit parameter easier to test than <code>global</code> state?</p></div><details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Answer:</strong> All dependencies appear in the call, so a test can supply them. A global dependency can change elsewhere without being visible in the function signature.</div></details></section>
<section class="quiz-card" role="listitem"><div class="quiz-question-row"><span class="quiz-number">02</span><p>Why should a local static counter not store permanent visit counts?</p></div><details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Answer:</strong> It retains a value within one CLI process or ordinary request. Traditional FPM resets userland state for each request even when a worker survives. Requests may also use other workers or servers; permanent counts need shared persistent storage.</div></details></section>
</div>

[Return to the PHP guide](/en/php/).

