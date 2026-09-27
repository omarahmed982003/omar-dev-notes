---
title: PHP
description: A complete PHP path that moves from language fundamentals to understandable, testable web programs.
sidebar:
  order: 0
---

# PHP: from syntax to requests, files, and sessions

This path starts with PHP fundamentals and builds each idea on the previous one until you can read a web program and understand its parts. Lessons include runnable examples, common cases, and mistakes with their causes and fixes.

## Learning path

1. [Introduction and syntax](/en/php/01-introduction-and-syntax/)
2. [Variables, scope, and superglobals](/en/php/02-variables-scope-superglobals/)
3. [Data types and the type system](/en/php/03-types/)
4. [Output, debugging, and constants](/en/php/04-output-debugging-constants/)
5. [Conditions and loops](/en/php/05-control-flow/)
6. [Expressions and operators](/en/php/06-expressions-operators/)
7. [Functions, callbacks, and includes](/en/php/07-functions-and-includes/)
8. [Files, streams, JSON, and CSV](/en/php/08-files-streams-data/)
9. [Uploads, cookies, and sessions](/en/php/09-uploads-cookies-sessions/)
10. [Namespaces and autoloading](/en/php/10-namespaces-autoloading/)
11. [Errors and exceptions](/en/php/11-errors-exceptions/)
12. [Arrays and transformation tools](/en/php/12-arrays-functional-tools/)
13. [Strings, Unicode, and regular expressions](/en/php/13-strings-unicode-regex/)
14. [Date, time, and timezones](/en/php/14-datetime-timezones/)
15. [From HTTP request to router and response](/en/php/15-request-router-response/)
16. [Modern PHP 8.0–8.5 roadmap](/en/php/16-modern-php-features/) — WeakMap, Fibers, DNF types, readonly classes, hooks, and later features.
17. [Integrated programs and practical debugging](/en/php/17-integrated-programs-debugging/) — Complete CLI, streaming, and JSON programs with output-prediction exercises.

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


[Set up the downloadable labs and runnable examples](/en/php/00-lab-setup/).
