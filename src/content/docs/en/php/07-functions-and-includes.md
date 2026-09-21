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
