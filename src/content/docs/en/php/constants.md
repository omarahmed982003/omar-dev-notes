---
title: "Constants and their scope"
prev: {"link":"/en/php/04-output-debugging-constants/","label":"Output and debugging"}
next: {"link":"/en/php/06-expressions-operators/","label":"Expressions and operators"}
description: "Constants and their scope"
sidebar:
  order: 4.5
---

A constant names a value that is not reassigned after definition. Requires variables and echo. Class constants are a return-after-OOP section: a class groups state and behavior.

## What is a constant?

The snippets are independent, not one combined file. Add `<?php` when saving a snippet as its own PHP file. Do not define `APP_NAME` twice in the same execution; the repeated name below compares syntax.

A variable can change; a constant should not change after definition:

```php
$attempts = 1;
$attempts++;
```

```php
const APP_NAME = 'Omar Notes';
echo APP_NAME;
```

Constants do not start with `$`. Use one for a truly code-level invariant. A database password varies by environment and is a secret, so it belongs in injected configuration or a secret manager, not a repository constant.

## `const` and `define()`

```php
const APP_NAME = 'Omar Notes';
define('APP_VERSION', '1.0.0');
```

- `const` is a language declaration.
- `define()` executes at runtime and can appear conditionally.
- `define()` creates a global constant, not a class constant.
- A local `const` cannot be placed in a function or conditional block.

Conditional global constants are legal but can create hidden state; a configuration object is usually clearer in a large application.

```php
if (getenv('APP_ENV') === 'testing') {
    define('FAKE_EXTERNAL_SERVICES', true);
}
```

## Class constants

```php
final class HttpStatus
{
    public const OK = 200;
    public const NOT_FOUND = 404;
}

echo HttpStatus::NOT_FOUND;
```

A class constant keeps the name with its concept. An enum may be better when a closed set also needs values and behavior.

## Magic and predefined constants

Magic constants are calculated from source context:

```php
echo __LINE__, PHP_EOL;
echo __FILE__, PHP_EOL;
echo __DIR__, PHP_EOL;
echo __FUNCTION__, PHP_EOL;
echo __CLASS__, PHP_EOL;
echo __METHOD__, PHP_EOL;
echo __NAMESPACE__, PHP_EOL;
```

`__DIR__` makes include paths independent of the current working directory:

```php
$config = require __DIR__ . '/../config/app.php';
```

PHP and extensions also provide constants such as `PHP_VERSION`, `PHP_OS_FAMILY`, `PHP_INT_MAX`, and `PHP_EOL`. If an extension-defined constant is optional, check `defined('NAME')` before using it.

```php
echo PHP_VERSION, PHP_EOL;
echo PHP_OS_FAMILY, PHP_EOL;
echo PHP_INT_MAX, PHP_EOL;
echo PHP_EOL;
```

```php
if (defined('JSON_THROW_ON_ERROR')) {
    echo 'JSON exception flag is available';
}
```


## Independent exercise

Define MAX_ATTEMPTS as 3. Print it inside a function and compare that with reading an ordinary outer variable.

<details><summary>Review after trying</summary>

The constant needs no global import. Pass the outer variable as a parameter; it is not automatically local.

</details>


## Check your understanding

<div class="quiz-list" role="list">
<section class="quiz-card" role="listitem"><div class="quiz-question-row"><span class="quiz-number">01</span><p>Why use <code>__DIR__</code> for an include path?</p></div><details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Answer:</strong> It anchors the path to the source file rather than whichever directory started the process.</div></details></section>
<section class="quiz-card" role="listitem"><div class="quiz-question-row"><span class="quiz-number">02</span><p>Should a database password be a source-code constant?</p></div><details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Answer:</strong> No. It is secret, environment-specific, and rotated independently; inject it through protected configuration.</div></details></section>
</div>

[Return to the PHP guide](/en/php/).

