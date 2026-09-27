---
title: 7. Functions, callbacks, and includes
description: Parameters, references, closures, arrow functions, callables, include, and require.
sidebar:
  order: 7
---

## Before you start

Read this lesson in three passes: understand the problem, follow the example, then try the final check yourself. The terms below are explained before they are used in detail.

### New terms in this lesson

- **Scope:** The region of code in which a name or variable is visible.
- **Loop:** A structure that repeats instructions according to a condition.
- **Function:** A named, reusable block of code with one defined job.


## A function gives one idea a clear name

If subtotal logic is copied into five places, one rule change needs five edits. A function groups steps with one purpose, accepts explicit inputs, and may return a result.

```php
function calculateSubtotal(int $priceCents, int $quantity): int
{
    if ($priceCents < 0 || $quantity < 1) {
        throw new InvalidArgumentException('Invalid order values');
    }

    return $priceCents * $quantity;
}

$subtotal = calculateSubtotal(1500, 3);
```

Read the signature as a contract: the name states the action, parameters declare required data, and the trailing `int` declares the result. A parameter belongs to the definition; an argument is supplied at a call. Prefer value passing; a reference parameter is an exceptional choice because it can change caller state.

`include` and `require` organize files but do not replace functions, classes, or autoloading. Inclusion executes that file at that point and can return a value or define symbols.

## Defining a function

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

## Progressive practice

<details><summary>1. Extract a repeated formula</summary><p>Create <code>calculateTotal(int $priceCents, int $quantity): int</code>, reject negative prices and quantities below one, and test valid and invalid boundaries.</p></details>

<details><summary>2. What is risky about an unclear reference parameter?</summary><p>A caller may expect calculation only while the function mutates caller state. Prefer returning a new value, or make deliberate mutation unmistakable.</p></details>

<details><summary>3. require or include for essential configuration?</summary><p>Use <code>require</code> because the application cannot correctly continue without configuration. Treat truly optional inclusion failures explicitly.</p></details>

## Lesson-specific problems

<details><summary>When is pass-by-reference a poor choice?</summary><p>When it hides external mutation; returning a new value is often clearer and easier to test.</p></details>

<details><summary>How do <code>include</code> and <code>require</code> differ?</summary><p>A failed require stops execution, while include warns and may continue; require essential files.</p></details>

## Run and verify

Use the [downloadable lab](/en/php/00-lab-setup/) for supplied scripts. Commands for Composer, FPM, Docker, or a real server run inside the corresponding configured project, not an empty folder.

Execute this checkpoint inside the lesson environment:

~~~bash
php functions-lab.php
~~~

**Success criterion:** The function succeeds within its stated boundaries and fails clearly outside them; the required file loads once without relying on an accidental working directory.

Record the exit code and observed evidence. If reality differs, explain the environmental or design assumption that failed instead of editing the expectation to match a defect.

## Connect the ideas

Named arguments bind to parameter names and can make renaming a breaking change. Variadics collect values and first-class callables carry a clearer callable contract. Recursion needs a base case and depth limit. Never construct include paths from input; use autoloading in projects.

### Try it yourself

Test callable, variadic, and recursive paths with an explicit failure bound.
