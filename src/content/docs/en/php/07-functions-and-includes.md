---
title: 7. Functions, callbacks, and includes
description: Parameters, references, closures, arrow functions, callables, include, and require.
sidebar:
  order: 7
---

## The problem: the same calculation in five places

When a price rule changes, updating five copies risks missing one. A **function** groups a task under a name, receives input, and returns a result. A **parameter** names input in the definition, an **argument** is a value passed during a call, and a **return value** is the result sent back.

Start with a calculation that returns rather than prints. It can then serve CLI output, HTML, and tests. Save `functions.php` for PHP 8.0+ and run `php functions.php`:

~~~php
<?php
declare(strict_types=1);

function subtotal(int $price, int $quantity = 1): int
{
    if ($price < 0 || $quantity < 1) {
        throw new InvalidArgumentException('Invalid order');
    }
    return $price * $quantity;
}
function receipt(int $price, int $quantity): string
{
    $amount = subtotal($price, $quantity);
    return "Total: {$amount}";
}
echo receipt(1500, 3), PHP_EOL;
echo subtotal(quantity: 2, price: 500), PHP_EOL;
~~~

~~~text
Total: 4500
1000
~~~

`declare` makes scalar calls originating in this file strict. `function subtotal` defines a function; its body does not run just because PHP reads the definition. `int` before a parameter specifies input type; after the parentheses it specifies result type. `= 1` supplies quantity when omitted. The initial condition rejects values outside the contract; `throw` aborts that path with a failure, explained in lesson 11. `return` ends the call and sends back the product. The second function builds a message. The final line uses **named arguments**, so renaming a parameter can break callers.

PHP does not overload functions in one namespace by their argument count. Use defaults, union types, or variadics when appropriate. These numbers are small; extending the program requires checking multiplication bounds.

## The call stack: where execution goes and returns

The **call stack** holds active calls. Each call adds a **frame** containing its local state and return location. The last function entered is the first to return. Trace `receipt(1500, 3)`:

~~~text
main
main → receipt(price=1500, quantity=3)
main → receipt → subtotal(price=1500, quantity=3)
main → receipt(amount=4500)
main → echo("Total: 4500")
~~~

`$amount` is local to receipt; matching variable names in different frames are not the same variable. `return` resumes the caller, not the start of the program. **Recursion** is a function calling itself: each call adds a frame, so it needs a stopping case and bounded input. In `countdown.php`:

~~~php
<?php
function countdown(int $n): void
{
    if ($n < 0 || $n > 10) {
        throw new InvalidArgumentException('Use 0..10');
    }
    if ($n === 0) {
        echo "go", PHP_EOL;
        return;
    }
    echo $n, PHP_EOL;
    countdown($n - 1);
}
countdown(3);
~~~

~~~text
3
2
1
go
~~~

`void` means no useful returned value. The zero check is the **base case**, and subtracting one moves toward it; removing either can exhaust memory. A loop is often better for simple repetition. Understanding frames also makes an error's stack trace readable.

## Values, references, and variadics

Ordinary passing does not let a function reassign the caller's variable. `&` allows that mutation; use it deliberately. `...` in a parameter collects a variable number of arguments into an array. Run `arguments.php`:

~~~php
<?php
function increment(int $n): int { return $n + 1; }
function incrementInPlace(int &$n): void { $n++; }
function sum(int ...$numbers): int { return array_sum($numbers); }

$n = 4;
echo increment($n), ':', $n, PHP_EOL;
incrementInPlace($n);
echo $n, PHP_EOL;
echo sum(...[2, 3, 4]), PHP_EOL;
~~~

~~~text
5:4
5
9
~~~

The first returns 5 while leaving n=4; the second changes n to 5. At the call site `...` unpacks a list into arguments. Mutating an object differs from reassigning a variable: a function may change the shared object's state without `&`; the OOP track covers this distinction.

## Callback: pass the operation, not its result

A **callable** is a value that can be invoked. A **callback** is a function passed to other code, which decides when to call it. It does not automatically mean delayed or parallel work: `array_map` invokes callbacks synchronously for each element. In `callbacks.php` we write the caller ourselves:

~~~php
<?php
declare(strict_types=1);

function transform(array $values, callable $operation): array
{
    $result = [];
    foreach ($values as $value) {
        $result[] = $operation($value);
    }
    return $result;
}
$factor = 2;
$double = function (int $n) use ($factor): int {
    return $n * $factor;
};
$factor = 10;
$values = transform([1, 2, 3], $double);
echo implode(',', $values), PHP_EOL;
$plusOne = fn (int $n): int => $n + 1;
echo implode(',', transform($values, $plusOne)), PHP_EOL;
~~~

~~~text
2,4,6
3,5,7
~~~

`transform` receives an array and an operation; it does not know whether that operation multiplies or adds. Each iteration invokes `$operation($value)` and appends its result. `function (...) use ($factor)` is an anonymous function, a **closure**, capturing factor by value when created: 2 even after the variable becomes 10. `use (&$factor)` instead observes the shared variable; use it only intentionally. `fn` is an arrow function with one expression, implicit return, and by-value capture.

**Wrong:** passing `$double(3)` to transform passes the integer 6, not a function. Pass `$double` without invoking it. A named function can be referenced by a string such as `'trim'` (a variable function), or by `trim(...)` from PHP 8.1 as a first-class callable. Then invoke that value. Use `is_callable` for uncertain sources and never let users select arbitrary function names. Prefer a local closure over declaring a named function inside a function: the inner declaration occurs only after calling the outer function, shares function-name scope, and may be redeclared.

## A two-file project: require executes a file

Create a folder containing `config.php` and `main.php`. This is a complete project without Composer. The first returns data; the second needs it:

~~~php
<?php
// config.php
return ['name' => 'Notebook', 'limit' => 3];
~~~

~~~php
<?php
// main.php
$config = require __DIR__ . '/config.php';
echo $config['name'], ': ', $config['limit'], PHP_EOL;
~~~

~~~text
Notebook: 3
~~~

Run `php main.php`. `__DIR__` is the current file's directory, independent of the working directory. `require` executes the file and receives its return value. Without an explicit return, successful inclusion normally returns 1. Included code inherits the inclusion scope, so avoid hidden dependencies on outside variables.

`include` emits a warning on failure and usually continues. Modern PHP's `require` raises an Error, interrupting the current path unless handled. The `_once` versions prevent repeated definitions. Do not expect repeated require_once calls for configuration to return the same array; a later call may return true. Never build inclusion paths from user input. Lesson 10 moves class loading to Composer.

`goto` jumps to a label in the same file and scope; it cannot enter a loop or switch from outside. `goto done; echo 'skip'; done: echo 'done';` prints done, but a small function or break is usually easier to follow.

## Predict, debug, complete

<details><summary>Predict: factor changes from 2 to 10 after creating the closure</summary><p>With use ($factor), results remain 2,4,6 because capture was by value. With use (&amp;$factor), they become 10,20,30. Arrow functions also capture by value.</p></details>

<details><summary>Debug: a function echoes a value and I try to add its result</summary><p>Printing does not return the value for arithmetic. Return the result and echo it at the presentation boundary; the function becomes testable without capturing output.</p></details>

<details><summary>Complete a callback that squares an integer</summary><p><code>fn (int $n): int =&gt; $n * $n</code>. Pass it to transform with [1,2,3] to obtain [1,4,9]. Do not invoke it before passing it.</p></details>

<details><summary>Diagnose recursion calling countdown($n) without changing n</summary><p>Each call adds a frame with the same n and never reaches zero. Pass n-1 and keep both a base case and an input bound; writing a base case alone does not guarantee progress.</p></details>

Our notebook will separate validation, storage, and presentation into functions, then pass handlers as callbacks to the router. Also run `php functions-lab.php` from the [lab](/en/php/00-lab-setup/).
