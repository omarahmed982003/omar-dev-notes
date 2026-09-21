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
