---
title: 3. Data types and the type system
description: Scalar, compound and special types, conversion, callables, iterables, and declarations.
sidebar:
  order: 3
---

PHP has scalar `bool`, `int`, `float`, and `string`; compound `array` and `object`; and special types including `null`, `resource`, `callable`, `iterable`, `mixed`, `void`, and `never`. Developers define classes, interfaces, and enums. Declarations may use unions such as `int|string` and intersections such as `Countable&Iterator`.

Falsy values are `false`, `0`, `0.0`, `""`, `"0"`, `[]`, and `null`. Prefer strict comparisons:

```php
var_dump(0 == false);  // true
var_dump(0 === false); // false
```

Integer literals may be decimal, `0o52` octal, `0x2A` hexadecimal, or `0b101010` binary. `/` performs division and `intdiv(7, 2)` returns `3`. Casting `(int) 3.9` truncates. Binary floating point is approximate, so use integer minor units or a decimal library for money.

Strings support single/double quotes, heredoc/nowdoc, indexing (including negative indexes), and `.` concatenation. Validate numeric strings before arithmetic instead of relying on juggling.

Arrays act as lists or maps. Objects combine state and behaviour. Enums model a finite set. A resource is a handle to an external resource such as a stream, though modern extensions often return objects.

- `void`: no useful returned value.
- `never`: execution never returns normally.
- `mixed`: any PHP value, including null.

```php
$double = fn (int $n): int => $n * 2;

class Formatter
{
    public function upper(string $value): string { return strtoupper($value); }
    public function __invoke(string $value): string { return trim($value); }
}

$f = new Formatter();
$upper = $f->upper(...); // first-class callable
```

A callback is a callable passed for later execution. A Closure represents an anonymous function. An object with `__invoke()` is callable.

```php
function numbers(int $max): iterable
{
    for ($i = 1; $i <= $max; $i++) {
        yield $i;
    }
}
```

`iterable` accepts arrays and `Traversable`. Every Generator is an Iterator, but not every Iterator is a Generator.

```php
<?php
declare(strict_types=1);

function findUser(int $id, ?string $locale = null): array|null
{
    return $id > 0 ? ['id' => $id, 'locale' => $locale] : null;
}
```

Without strict mode PHP may coerce scalar arguments. Strictness belongs to the calling file and applies to scalar declarations; an integer is still accepted for a float declaration. Use `get_debug_type()` and `var_dump()` when inspecting values.
