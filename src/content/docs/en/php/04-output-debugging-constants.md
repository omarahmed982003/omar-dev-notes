---
title: 4. Output, debugging, and constants
description: Produce user output, inspect values during a failure, and understand when a constant is more appropriate than a variable.
sidebar:
  order: 4
---

## Before you start

Read this lesson in three passes: understand the problem, follow the example, then try the final check yourself. The terms below are explained before they are used in detail.

### New terms in this lesson

- **Runtime:** The period when a program is actually running.
- **Debugger:** A tool that pauses a program so you can inspect values and execution step by step.
- **HTTP:** The rules used to exchange requests and responses on the web.
- **API:** A defined interface through which one program requests data or actions from another.
- **Session:** Temporary server-side state used to recognize a user across requests.
- **CLI:** A text-based interface controlled by typed commands.
- **UTF-8:** A common encoding that stores Unicode numbers as bytes.
- **Function:** A named, reusable block of code with one defined job.


## User output and developer evidence are different

While learning, you need to see both program output and temporary evidence about internal state. `echo` produces output; `var_dump()` and related tools expose types and structure for diagnosis. Mixing debug text into a production response can leak sensitive data or corrupt HTML and JSON.

This lesson also introduces constants: named values that should not change during execution, such as an application name or a known HTTP status.

## `echo`

```php
$name = 'Omar';
echo 'Hello ', $name, PHP_EOL;
```

`echo` is a language construct, not a normal function. Parentheses are optional and it accepts multiple comma-separated values. Concatenation with `.` creates one string first:

```php
$message = 'Hello ' . $name;
echo $message;
```

Inside HTML, `<?= ... ?>` is the output shorthand:

```php
<h1><?= htmlspecialchars($name, ENT_QUOTES, 'UTF-8') ?></h1>
```

Encode untrusted values for the exact output context rather than printing them directly.

## `print`

```php
$result = print 'Printed';
var_dump($result); // int(1)
```

| Property | `echo` | `print` |
|---|---|---|
| Return value | none | always `1` |
| Values | several without parentheses | one |
| In an expression | no | technically yes |
| Template shorthand | `<?= ... ?>` | none |

The performance difference is not a useful design criterion. Prefer `echo` in ordinary output and recognize `print` in existing code.

## CLI, HTML, and JSON output

`PHP_EOL` creates a terminal line break. HTML needs semantic elements such as `<p>` or `<br>`. JSON responses must contain valid JSON without debug text around them:

```php
header('Content-Type: application/json; charset=utf-8');
echo json_encode(['status' => 'ok'], JSON_THROW_ON_ERROR);
```

A `var_dump()` before that JSON makes the response invalid even if the correct object follows it.

## Why `echo` is not enough for debugging

```php
$value = false;

echo $value;      // almost no visible evidence
var_dump($value); // bool(false)
```

Arrays and objects also need structural inspection rather than ordinary output.

```php
$user = [
    'id' => 7,
    'active' => true,
    'roles' => ['editor', 'reviewer'],
];

var_dump($user);
print_r($user);
echo get_debug_type($user);
```

- `var_dump()` includes type, value, size, and nested detail.
- `print_r()` is visually simple for arrays and objects but less precise about types.
- `print_r($value, true)` returns its representation as a string.
- `get_debug_type()` returns a useful type name, especially for objects and resources.

## Debug with a hypothesis

This calculation subtracts ten cents rather than ten percent:

```php
$priceCents = 10000;
$discountPercent = 10;
$finalCents = $priceCents - $discountPercent;
```

Do not change random lines. State the expected result (`9000`), inspect value types, isolate the formula, correct it, and add a test:

```php
$discountCents = (int) round($priceCents * ($discountPercent / 100));
$finalCents = $priceCents - $discountCents;

var_dump($priceCents, $discountPercent, $discountCents, $finalCents);
```

## Framework dumps and logging

Frameworks often provide `dump()` and `dd()` (“dump and die”). They are development tools; `dd()` stops a request, and either helper can expose tokens, cookies, or customer data.

Use structured logs in production:

```php
error_log(json_encode([
    'event' => 'checkout_failed',
    'order_id' => 42,
    'reason' => 'payment_timeout',
], JSON_THROW_ON_ERROR));
```

Never log passwords, session identifiers, or access tokens. Return a safe user message and keep protected technical detail in the log.

## What is a constant?

A variable can change; a constant should not change after definition:

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

## Complete example

```php
<?php
declare(strict_types=1);

const TAX_RATE = 0.14;

$priceCents = 25000;
$taxCents = (int) round($priceCents * TAX_RATE);
$totalCents = $priceCents + $taxCents;

if (getenv('APP_DEBUG') === '1') {
    var_dump([
        'file' => __FILE__,
        'price_cents' => $priceCents,
        'tax_cents' => $taxCents,
    ]);
}

echo "Total: {$totalCents} cents", PHP_EOL;
```

Run it with and without `APP_DEBUG=1`. Core output remains, while internal evidence appears only in the intended development mode.

## Common mistakes

- Using `echo` to inspect booleans or arrays.
- Leaving `var_dump()` or `dd()` in a production API.
- Logging secrets while diagnosing a failure.
- Hard-coding environment configuration as constants.
- Building relative paths from the working directory rather than `__DIR__`.
- Defining broad global constant names that can collide.

## Check your understanding

<div class="lesson-quiz" role="list">
<section class="quiz-card" role="listitem"><div class="quiz-question-row"><span class="quiz-number">01</span><p>What is output and what value is assigned by <code>$result = print 'Hi';</code>?</p></div><details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Answer:</strong> It outputs <code>Hi</code> and assigns integer <code>1</code> to <code>$result</code>.</div></details></section>
<section class="quiz-card" role="listitem"><div class="quiz-question-row"><span class="quiz-number">02</span><p>Why is <code>echo false;</code> weak debugging evidence?</p></div><details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Answer:</strong> It produces almost no visible output. <code>var_dump(false)</code> preserves both type and value.</div></details></section>
<section class="quiz-card" role="listitem"><div class="quiz-question-row"><span class="quiz-number">03</span><p>A JSON endpoint returns invalid JSON. What should you inspect first?</p></div><details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Answer:</strong> Look for dumps, warnings, or HTML around the payload and ensure the endpoint returns one JSON document with the right Content-Type.</div></details></section>
<section class="quiz-card" role="listitem"><div class="quiz-question-row"><span class="quiz-number">04</span><p>Why use <code>__DIR__</code> for an include path?</p></div><details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Answer:</strong> It anchors the path to the source file rather than whichever directory started the process.</div></details></section>
<section class="quiz-card" role="listitem"><div class="quiz-question-row"><span class="quiz-number">05</span><p>Should a database password be a source-code constant?</p></div><details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Answer:</strong> No. It is secret, environment-specific, and rotated independently; inject it through protected configuration.</div></details></section>
<section class="quiz-card" role="listitem"><div class="quiz-question-row"><span class="quiz-number">06</span><p>Correct <code>$final = $priceCents - $percent;</code>.</p></div><details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Answer:</strong> Calculate the discount amount from the percentage, define rounding policy, subtract it, and test 0%, 100%, and a normal value.</div></details></section>
</div>

## Summary

`echo` and `print` produce output; debugging tools reveal type and structure. Keep user responses separate from developer evidence and never expose secrets. Constants model code-level invariants, while `__DIR__` is a practical way to construct dependable file paths.

## Run and verify

Use the [downloadable lab](/en/php/00-lab-setup/) for supplied scripts. Commands for Composer, FPM, Docker, or a real server run inside the corresponding configured project, not an empty folder.

Execute this checkpoint inside the lesson environment:

~~~bash
php debug-lab.php 2> debug.log
~~~

**Success criterion:** Intended output goes to stdout and diagnostics to stderr or a logger, with no secret value exposed in either stream.

Record the exit code and observed evidence. If reality differs, explain the environmental or design assumption that failed instead of editing the expectation to match a defect.

## Connect the ideas

In development, use Xdebug or another debugger for stacks and breakpoints. In production, disable display_errors and send detail to protected logging with a correlation ID. Constants suit structural values, while environment configuration is not a class constant merely because it is currently stable.

### Try it yourself

Test a failure in development and production and confirm users never see a stack trace.
