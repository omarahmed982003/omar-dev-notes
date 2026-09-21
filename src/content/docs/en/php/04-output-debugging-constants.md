---
title: 4. Output, debugging, and constants
description: echo, print, value inspection, regular, magic, and predefined constants.
sidebar:
  order: 4
---

`echo` and `print` are language constructs. `echo` has no return value and can accept multiple comma-separated arguments without parentheses; `print` accepts one value and returns `1`.

```php
echo 'Hello', ' ', 'PHP', PHP_EOL;
$result = print 'Printed';
var_dump($result);
```

The performance difference is irrelevant. Escape untrusted HTML output with `htmlspecialchars`.

```php
$user = ['id' => 7, 'active' => true];
var_dump($user);
print_r($user);
$text = print_r($user, true);
echo get_debug_type($user);
```

Framework helpers such as `dump()` and `dd()` are useful in development; do not expose debug data in production.

```php
const APP_NAME = 'Omar Notes';
define('APP_VERSION', '1.0.0');

class HttpStatus
{
    public const OK = 200;
}
```

`define()` executes at runtime and may appear conditionally; it defines a global constant, not a class constant. `const` is a declaration and can define class constants, but cannot be placed inside a function or conditional block.

Magic constants include `__LINE__`, `__FILE__`, `__DIR__`, `__FUNCTION__`, and `__CLASS__`. Predefined constants include `PHP_VERSION`, `PHP_OS_FAMILY`, and `PHP_EOL`. Use `__DIR__` for reliable include paths.
