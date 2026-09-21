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
