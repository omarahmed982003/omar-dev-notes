---
title: 1. Introduction and PHP syntax
description: What PHP is, request execution, tags, HTML templates, comments, and case sensitivity.
sidebar:
  order: 1
---

## What PHP is

The name historically meant **Personal Home Page**; its recursive official expansion is **PHP: Hypertext Preprocessor**. PHP is an open-source, general-purpose language best known for server-side web development.

A request normally follows this path: browser → web server → PHP runtime → database/files/services when needed → HTML or JSON response → browser. PHP source code stays on the server.

:::caution[Correction]
“PHP runs line by line without compilation” is only a teaching shortcut. The engine compiles source to opcodes before execution, and modern versions can use JIT.
:::

PHP can process forms, serve APIs, access databases and files, run CLI and cron jobs, send mail, create images/PDFs through libraries, and support both procedural and object-oriented programming. Desktop apps are possible through third-party tooling, but are not PHP’s common use case.

## Runtime and syntax

XAMPP, WAMP, MAMP, and LAMP bundle a web server, database, and PHP for local work. PHP also has a development server:

```bash
php -S localhost:8000 -t public
```

Do not use it as a production server.

```php
<?php
$title = 'My shop';
?>
<!doctype html>
<html lang="en">
<head><title><?= htmlspecialchars($title, ENT_QUOTES, 'UTF-8') ?></title></head>
<body>
<?php if ($title !== ''): ?>
    <h1><?= htmlspecialchars($title) ?></h1>
<?php else: ?>
    <p>No title</p>
<?php endif; ?>
</body>
</html>
```

Statements end with `;`; compound blocks do not need a semicolon after `}`. In PHP-only files, omit the closing `?>` to avoid accidental output. Headers, cookies, and sessions must be started before output.

Comments use `//`, `#`, or `/* ... */`. Variable names are case-sensitive. Although keywords and function/class lookup are case-insensitive, always use the declared casing; constants are case-sensitive.
