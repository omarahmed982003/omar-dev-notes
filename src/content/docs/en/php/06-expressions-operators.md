---
title: 6. Expressions and operators
description: Values, precedence, arithmetic, assignment, comparison, logic, arrays, execution, and pipes.
sidebar:
  order: 6
---

## The problem: plausible arithmetic, wrong results

A price is 1500 minor units and quantity is 3. We need a subtotal, a discount, and a free-shipping decision. An **expression** produces a value; an **operator** specifies an operation; an **operand** is a value it acts on. In `$price * $quantity`, `*` is the operator and the variables are its operands. Identify input and result types before writing an expression.

Core examples require PHP 8.0+. Save `checkout.php` and run `php checkout.php`:

~~~php
<?php
declare(strict_types=1);

$price = 1500;
$quantity = 3;
$subtotal = $price * $quantity;
$discount = intdiv($subtotal * 10, 100);
$afterDiscount = $subtotal - $discount;
$shipping = $afterDiscount >= 4000 ? 0 : 500;
$total = $afterDiscount + $shipping;
echo "subtotal={$subtotal}", PHP_EOL;
echo "discount={$discount}", PHP_EOL;
echo "shipping={$shipping}", PHP_EOL;
echo "total={$total}", PHP_EOL;
~~~

~~~text
subtotal=4500
discount=450
shipping=0
total=4050
~~~

The first variables are integers in minor units. Multiplication produces 4500. `intdiv` performs integer division: this example explicitly rounds a positive discount down. We subtract 450 and compare 4050 with 4000; true selects zero shipping. Finally we add and print. These amounts are small; large values need overflow checks before multiplication, and other financial policies need explicit rounding or Decimal arithmetic.

**Wrong:** `$subtotal - 10` subtracts 10 minor units, not 10%. Testing `$subtotal >= 4000` checks eligibility before discount; choose the variable matching the store's rule. Change quantity to 2: the discounted subtotal is 2700, shipping is 500, and the result is 3200.

## Precedence is not a guaranteed evaluation order

**Precedence** controls grouping: `2 + 3 * 4` means `2 + (3 * 4)` and produces 14. `(2 + 3) * 4` produces 20. Do not rely on evaluation order when expressions mutate the same variable, such as adding two increments of one counter; put each mutation on a separate line.

Save `precedence.php`:

~~~php
<?php
$a = true && false;
$b = true and false;
var_dump($a, $b);
$x = 5;
echo $x++, PHP_EOL;
echo ++$x, PHP_EOL;
~~~

~~~text
bool(false)
bool(true)
5
7
~~~

`&&` binds more tightly than assignment, so `$a` receives false. `and` binds less tightly: `($b = true) and false` leaves b true because the final result is not assigned. Prefer `&&`, `||`, and clear parentheses. `$x++` returns the old value then increments; `++$x` increments first. Assignment itself returns a value, so `$b = $a = 5` stores 5 in both, although two lines are often clearer.

## An operation map

| Group | Operators and meaning |
|---|---|
| Arithmetic | `+ - * /`, remainder `%`, power `**` |
| Compound assignment | `+= -= *= /= %= **= .= ??=` |
| Comparison | Loose `== != <>`, strict `=== !==`, ordering `< > <= >=` |
| Three-way comparison | `<=>` returns -1, 0, or 1 for simple numbers |
| Logic | `&&` and, `||` or, `!` not, `xor` exactly one true operand |
| Strings | `.` concatenates; `.=` concatenates and assigns |

`/` may produce a float: `10 / 4` is 2.5, `intdiv(10, 4)` is 2, and `10 % 4` is 2. A zero divisor raises `DivisionByZeroError`. Floats approximate many decimal fractions; repeated decimal calculations need an explicit precision policy rather than blind exact equality.

## Type is part of comparison

Run `compare.php`. **Short circuiting** means the second operand is not evaluated when the first already determines the result:

~~~php
<?php
var_dump('0' == 0);
var_dump('0' === 0);
var_dump('0' != 0);
var_dump('0' !== 0);
$value = '0';
echo $value ?? 'missing', PHP_EOL;
echo $value ?: 'empty', PHP_EOL;
$divisor = 0;
var_dump($divisor !== 0 && 10 / $divisor > 2);
~~~

~~~text
bool(true)
bool(false)
bool(false)
bool(true)
0
empty
bool(false)
~~~

The first four comparisons distinguish string and integer value/type. `??` preserves `'0'`, whereas `?:` treats it as falsy. The last line's first operand is false, so division never occurs. Do not put essential saving or counting inside an operand that may be skipped. `$input ??= 'guest'` assigns a fallback only when missing or null.

## The same symbol with arrays or objects

Array `+` is a key-based union: the left value wins on duplicate keys. `array_merge` replaces string keys with right-hand values and renumbers numeric keys. Try:

~~~php
<?php
$left = ['timeout' => 3, 0 => 'A'];
$right = ['timeout' => 5, 0 => 'B'];
echo json_encode($left + $right, JSON_THROW_ON_ERROR), PHP_EOL;
echo json_encode(array_merge($left, $right), JSON_THROW_ON_ERROR), PHP_EOL;
~~~

~~~text
{"timeout":3,"0":"A"}
{"timeout":5,"0":"A","1":"B"}
~~~

Array `===` also checks types and key/value order; `==` does not require the same order. `instanceof` checks an object's class/interface. Assigning an object to another variable does not copy it; `clone` is shallow and nested objects may remain shared. See [OOP](/en/oop/).

## Operators do not repair hidden failures

`@` may suppress an expression's diagnostics but cannot fix the failure. Check return values or handle exceptions. PHP backticks execute a shell command like `shell_exec`; they do not display a string. Never insert user input into `exec`, `system`, or `proc_open`. Prefer a direct API, or fixed allowed commands with separate arguments when process execution is necessary.

## Pipe requires PHP 8.5

A **callable** refers to something that can be invoked; lesson 7 explains it. `|>` passes its left value as one argument to the right callable. Run `pipe.php` with PHP 8.5; the file cannot be parsed by 8.4:

~~~php
<?php
$slug = ' Hello PHP '
    |> trim(...)
    |> strtolower(...)
    |> (fn (string $s): string => str_replace(' ', '-', $s));
echo $slug, PHP_EOL;
~~~

~~~text
hello-php
~~~

Each stage returns a new value. An 8.0 alternative is `str_replace(' ', '-', strtolower(trim(' Hello PHP ')))`; it does not need first-class callable syntax. See the [official pipe reference](https://www.php.net/manual/en/language.operators.pipe.php).

## Predict, debug, complete

<details><summary>Predict 2 + 3 * 4, then (2 + 3) * 4</summary><p>14, then 20. Parentheses change grouping, not the numbers themselves.</p></details>

<details><summary>Debug: if ($quantity = 0) instead of comparison</summary><p>Assignment stores zero and the condition becomes false. Use <code>$quantity === 0</code> after checking that input is an integer. Do not switch to == just to hide a type mismatch.</p></details>

<details><summary>Complete a safe division condition with divisor=0</summary><p><code>$divisor !== 0 &amp;&amp; $amount / $divisor > 2</code>. Checking zero first prevents evaluating division; reversing operands loses that protection.</p></details>

<details><summary>Why does ['timeout' =&gt; 3] + ['timeout' =&gt; 5] not update it to 5?</summary><p>Union preserves the left value. For an override, use array_merge or unpacking with the intended key rules.</p></details>

Run `php operators-lab.php` from the [lab](/en/php/00-lab-setup/). Our notebook project uses `===` for the HTTP method and `??` for missing keys; truthiness cannot replace type validation.
