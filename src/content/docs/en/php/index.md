---
title: PHP
description: A corrected, expanded PHP fundamentals track based on pages 12–60 of the notes.
sidebar:
  order: 0
---

# PHP: from syntax to requests, files, and sessions

This section turns pages **12–60** of the notes into a practical learning path. Every written concept is retained, unclear or outdated points are corrected, and each lesson adds runnable examples, edge cases, and security guidance.

## Learning path

1. [Introduction and syntax](./01-introduction-and-syntax/)
2. [Variables, scope, and superglobals](./02-variables-scope-superglobals/)
3. [Data types and the type system](./03-types/)
4. [Output, debugging, and constants](./04-output-debugging-constants/)
5. [Conditions and loops](./05-control-flow/)
6. [Expressions and operators](./06-expressions-operators/)
7. [Functions, callbacks, and includes](./07-functions-and-includes/)
8. [Files, streams, JSON, and CSV](./08-files-streams-data/)
9. [Uploads, cookies, and sessions](./09-uploads-cookies-sessions/)
10. [Namespaces and autoloading](./10-namespaces-autoloading/)
11. [Errors and exceptions](./11-errors-exceptions/)
12. [Arrays and transformation tools](./12-arrays-functional-tools/)
13. [Strings, Unicode, and regular expressions](./13-strings-unicode-regex/)
14. [Date, time, and timezones](./14-datetime-timezones/)
15. [From HTTP request to router and response](./15-request-router-response/)
16. [Modern PHP 8.4 and 8.5](./16-modern-php-features/)

:::tip[How to study]
Run every example, change its inputs, and predict the result before running it again. The security notes are part of correct PHP usage, not optional extras.
:::

```php
<?php

declare(strict_types=1);

function greet(string $name): string
{
    return "Hello {$name}";
}

echo greet('Omar');
```

> Examples target PHP 8.x. Features requiring a newer minor release are labelled explicitly.
