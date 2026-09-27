---
title: 6. Expressions and operators
description: Values, precedence, arithmetic, assignment, comparison, logic, arrays, execution, and pipes.
sidebar:
  order: 6
---

## Before you start

Read this lesson in three passes: understand the problem, follow the example, then try the final check yourself. The terms below are explained before they are used in detail.

### New terms in this lesson

- **API:** A defined interface through which one program requests data or actions from another.


## An expression produces a value

An **expression** is code that evaluates to a value. `5`, `$price`, `$price * $quantity`, and `$age >= 18` are all expressions. An operator such as `+`, `*`, `===`, or `&&` defines the operation.

```php
$priceCents = 1500;
$quantity = 3;
$subtotal = $priceCents * $quantity;
$getsFreeShipping = $subtotal >= 4000;
```

The challenge is not memorizing symbols; it is understanding operand types, result types, and precedence. Rewrite dense expressions with parentheses and intermediate names:

```php
$calculated = $a + ($b * $c);
$isEligible = ($calculated > 10) && $active;
```

Do not use a long expression as a memory test for precedence. Ask what each operand type is, what type the result should have, and whether division by zero, overflow, floating-point precision, or short-circuit evaluation changes behavior.

## Expressions and precedence

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

## Progressive practice

<details><summary>1. Predict <code>2 + 3 * 4</code></summary><p>Multiplication has higher precedence, so the result is 14. Write <code>(2 + 3) * 4</code> when the intended result is 20.</p></details>

<details><summary>2. Why is <code>$user !== null && $user->active</code> safe?</summary><p>Short-circuit evaluation skips the second operand when the first is false. A nullsafe access may be clearer depending on the desired result.</p></details>

<details><summary>3. Correct a string-to-number comparison</summary><p>Validate and convert external input to <code>int</code>, then use <code>===</code> with a value of the same type rather than relying on loose coercion.</p></details>

## Lesson-specific problems

<details><summary>Why use parentheses even when precedence is known?</summary><p>They make intent explicit and protect meaning when code changes.</p></details>

<details><summary>What is risky about <code>==</code> across input types?</summary><p>Coercion can make different values compare equal; prefer <code>===</code> when type matters.</p></details>

## Run and verify

Use the [downloadable lab](/en/php/00-lab-setup/) for supplied scripts. Commands for Composer, FPM, Docker, or a real server run inside the corresponding configured project, not an empty folder.

Execute this checkpoint inside the lesson environment:

~~~bash
php operators-lab.php
~~~

**Success criterion:** Each case prints operands, result, and type; tests demonstrate <code>==</code> versus <code>===</code> and <code>??</code> versus truthiness.

Record the exit code and observed evidence. If reality differs, explain the environmental or design assumption that failed instead of editing the expectation to match a defect.

## Connect the ideas

The nullsafe operator stops a chain on null but does not handle exceptions or missing keys. Use parentheses when precedence mixes. The <code>@</code> operator hides symptoms rather than causes and harms observability; inspect return values or exceptions. New operators need a minimum version and compatibility test.

### Try it yourself

Rewrite a complex expression into named steps and compare types and results.
