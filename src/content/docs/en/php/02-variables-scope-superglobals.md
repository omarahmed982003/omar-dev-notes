---
title: 2. Variables, scope, and superglobals
description: Variables from first principles, value and reference assignment, scope, and how request data reaches a PHP program through superglobals.
sidebar:
  order: 2
---

## Before you start

Read this lesson in three passes: understand the problem, follow the example, then try the final check yourself. The terms below are explained before they are used in detail.

### New terms in this lesson

- **HTTP:** The rules used to exchange requests and responses on the web.
- **URL:** The complete address of a resource such as a page or API endpoint.
- **Cache:** A temporary copy that reduces waiting and repeated work.
- **Session:** Temporary server-side state used to recognize a user across requests.
- **UTF-8:** A common encoding that stores Unicode numbers as bytes.
- **Scope:** The region of code in which a name or variable is visible.
- **Function:** A named, reusable block of code with one defined job.


## Why do programs need variables?

Programs work with values that change: a user's name, a product price, a quantity, or a calculated result. A **variable** gives a value a meaningful name so later instructions can use it.

The “labeled box” analogy is useful at first, although the engine's real storage strategy depends on the value type and memory management.

```php
<?php

$productName = 'Keyboard';
$priceCents = 150000;
$inStock = true;

echo $productName, PHP_EOL;
echo $priceCents, PHP_EOL;
```

The `$` introduces a variable name. Here `=` is assignment: evaluate the right side and assign its value to the name on the left.

## Naming rules and useful names

After `$`, a variable name starts with a letter or underscore and may then contain digits:

```php
$name = 'Omar';       // valid
$_count = 3;          // valid
$price2 = 19.5;       // valid
// $2price = 19.5;    // invalid
```

Variable names are case-sensitive:

```php
$userName = 'Omar';
$username = 'Ali';

echo $userName; // Omar
echo $username; // Ali
```

Choose a name that carries meaning. `$priceCents` is clearer than `$p`; `$isEmailVerified` is clearer than `$flag`.

## The value determines the current type

PHP is dynamically typed, so a variable declaration does not need a type:

```php
$value = 10;      // int
$value = 'ten';   // now string
```

This does not mean PHP has no types. Every value has a type, and operations, conversions, and comparisons follow type rules. Inspect a value while learning or debugging:

```php
$price = 19.5;

var_dump($price);             // float(19.5)
echo get_debug_type($price);  // float
```

## Variables inside strings

Double-quoted strings interpolate variables; single-quoted strings usually preserve the text:

```php
$name = 'Omar';
$price = 20;

echo "Hello {$name}, the price is {$price} pounds.", PHP_EOL;
echo 'Hello $name', PHP_EOL;
```

Output:

```text
Hello Omar, the price is 20 pounds.
Hello $name
```

Braces clearly mark the variable boundary. The older `${name}` interpolation syntax is deprecated.

## Assignment by value

Predict this result before running it:

```php
$a = 10;
$b = $a;
$b++;

echo $a, PHP_EOL;
echo $b, PHP_EOL;
```

Output:

```text
10
11
```

`$b = $a` gives `$b` a logically independent value. Changing `$b` does not change `$a`.

For arrays and strings, PHP can optimize copying internally through **copy-on-write**. It need not copy every byte immediately, but the values behave independently and separation occurs when one is changed. Learn the visible semantics before the storage optimization.

## Assignment by reference

`&` links two variable names to the same logical container:

```php
$score = 10;
$alias =& $score;

$alias++;
echo $score; // 11
```

`unset($alias)` removes that name's link; it does not delete `$score`.

A PHP reference is not manual pointer arithmetic like C. Most application code does not need references. Unnecessary aliases make it difficult to answer “which code changed this value?”

## Objects behave differently

Assigning an object to another variable normally makes both variables refer to the same object:

```php
$first = new stdClass();
$first->name = 'Omar';

$second = $first;
$second->name = 'Ali';

echo $first->name; // Ali
```

Use `clone` when you need a distinct object. The OOP track explains shallow and deep copying later.

## Variable variables

PHP can use one variable's value as another variable's name:

```php
$field = 'email';
$$field = 'omar@example.com';

echo $email;
```

The feature exists, but an array or object is usually clearer:

```php
$user = ['email' => 'omar@example.com'];
echo $user['email'];
```

Never turn arbitrary user input directly into variable names. It hides allowed fields and makes validation and reasoning difficult.

## What is scope?

**Scope** is the region where a variable name is visible. A variable created inside a function is local to that function; a file-level variable is not automatically visible inside it.

```php
$taxRate = 0.14;

function showLocalScope(): void
{
    $message = 'I exist inside this function';
    echo $message;

    // echo $taxRate; // not automatically visible
}

showLocalScope();
// echo $message; // not visible here
```

Prefer explicit parameters:

```php
function priceWithTax(int $priceCents, float $taxRate): int
{
    return (int) round($priceCents * (1 + $taxRate));
}

echo priceWithTax(10000, 0.14); // 11400
```

The dependency is visible, and the function is easy to test with chosen inputs.

## `global` and `$GLOBALS`

PHP allows access to file-level state:

```php
$total = 100;

function addTaxUsingGlobal(float $rate): float
{
    global $total;
    return $total * (1 + $rate);
}
```

The same state is available through `$GLOBALS['total']`. Both forms hide a dependency. If distant code changes `$total`, this function's result changes. Passing the value explicitly is normally easier to understand and test.

## Local `static` variables

A local `static` variable is initialized once and keeps its value between calls in the current process:

```php
function nextId(): int
{
    static $id = 0;
    return ++$id;
}

echo nextId(), PHP_EOL; // 1
echo nextId(), PHP_EOL; // 2
echo nextId(), PHP_EOL; // 3
```

This is not permanent storage. A new process starts over. Hidden state can also complicate tests, so do not use a local static variable as a database or shared cache.

## Scope of included files

An `include` or `require` inherits the scope at the inclusion point:

```php
function loadConfig(): array
{
    $environment = 'development';
    return require __DIR__ . '/config.php';
}
```

`config.php` can see `$environment` because inclusion happened inside the function. Prefer configuration files that return a clear value instead of silently modifying many surrounding variables.

## Superglobals bring request data into PHP

PHP places request and environment data in special arrays available in every scope:

| Variable | Typical content |
|---|---|
| `$_GET` | Query-string values after `?` |
| `$_POST` | Fields from form-encoded POST bodies |
| `$_SERVER` | Request, server, and available header information |
| `$_FILES` | Uploaded-file metadata |
| `$_COOKIE` | Cookies sent by the client |
| `$_SESSION` | Session data after `session_start()` |
| `$GLOBALS` | Global symbol table |

For this URL:

```text
http://localhost:8000/?page=2&category=books
```

you can read:

```php
$page = $_GET['page'] ?? '1';
$category = $_GET['category'] ?? 'all';
```

All client-controlled data is untrusted, even when it looks normal.

## Read, validate, convert, and encode

These are separate steps:

1. Read while handling absence.
2. Validate against application rules.
3. Convert to a useful internal type.
4. Encode when outputting into a specific context.

```php
$rawPage = $_GET['page'] ?? null;
$page = filter_var($rawPage, FILTER_VALIDATE_INT, [
    'options' => ['min_range' => 1, 'max_range' => 1000],
]);

if ($page === false) {
    $page = 1;
}
```

A checkbox list may arrive as an array:

```text
?order_ids[]=10&order_ids[]=20
```

```php
function positiveIds(mixed $input, int $maximumCount = 100): array
{
    if (!is_array($input) || !array_is_list($input) || count($input) > $maximumCount) {
        throw new InvalidArgumentException('Expected a bounded list of IDs');
    }
    $ids = [];
    foreach ($input as $raw) {
        if ((!is_string($raw) && !is_int($raw))
            || preg_match('/\A[1-9][0-9]*\z/', (string) $raw) !== 1) {
            throw new InvalidArgumentException('Invalid ID');
        }
        $id = filter_var($raw, FILTER_VALIDATE_INT, ['options' => ['min_range' => 1]]);
        if ($id === false) {
            throw new InvalidArgumentException('ID exceeds integer range');
        }
        $ids[] = $id;
    }
    return $ids;
}

try {
    $orderIds = positiveIds($_GET['order_ids'] ?? []);
} catch (InvalidArgumentException) {
    http_response_code(422);
    exit('Invalid order IDs');
}
```

Conversion is not validation: `intval("12x")` silently produces 12. Require a list of at most 100 canonical positive integer IDs and reject nested arrays, zero, leading zeros, and overflow. The empty list is allowed. After validation, separately check that the authenticated user may access every selected order.

Validation is not output encoding. A valid name still needs `htmlspecialchars()` in HTML and a value still needs a prepared statement when used in SQL.

## Why `eval()` is dangerous

`eval()` executes a string as PHP source:

```php
$code = 'echo "hello";';
eval($code);
```

If that string comes from a user, you have allowed them to execute server code. Ordinary applications do not need this. Use functions, callback maps, or `match` instead:

```php
$operations = [
    'trim' => static fn (string $value): string => trim($value),
    'upper' => static fn (string $value): string => strtoupper($value),
];

$result = $operations['trim']('  hello  ');
```

## Complete example: greeting from a URL

```php
<?php
declare(strict_types=1);

$rawName = $_GET['name'] ?? 'Guest';

if (!is_string($rawName)) {
    $rawName = 'Guest';
}

$name = trim($rawName);
if ($name === '' || mb_strlen($name) > 50) {
    $name = 'Guest';
}

$safeName = htmlspecialchars($name, ENT_QUOTES, 'UTF-8');
?>
<!doctype html>
<html lang="en">
<head><meta charset="utf-8"><title>Greeting</title></head>
<body><h1>Hello <?= $safeName ?></h1></body>
</html>
```

Test `?name=Omar`, an empty name, `?name[]=Omar`, and a name containing HTML. Each case checks a different assumption.

## Value flow

```text
Request value → Read → Check type and rules → Store clearly → Encode for output
```

## Check your understanding

<div class="lesson-quiz" role="list">
<section class="quiz-card" role="listitem"><div class="quiz-question-row"><span class="quiz-number">01</span><p>Predict <code>$a = 5; $b = $a; $b++; echo "$a,$b";</code>.</p></div><details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Answer:</strong> <code>5,6</code>; normal assignment produces logically independent values.</div></details></section>
<section class="quiz-card" role="listitem"><div class="quiz-question-row"><span class="quiz-number">02</span><p>What changes if assignment uses <code>&</code>?</p></div><details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Answer:</strong> With <code>$b =& $a</code>, the result becomes <code>6,6</code> because the names are linked.</div></details></section>
<section class="quiz-card" role="listitem"><div class="quiz-question-row"><span class="quiz-number">03</span><p>Why is an explicit parameter easier to test than <code>global</code> state?</p></div><details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Answer:</strong> All dependencies appear in the call, so a test can supply them. A global dependency can change elsewhere without being visible in the function signature.</div></details></section>
<section class="quiz-card" role="listitem"><div class="quiz-question-row"><span class="quiz-number">04</span><p>Why is casting <code>?page=abc</code> directly to <code>int</code> insufficient?</p></div><details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Answer:</strong> Casting can produce zero and hide invalid input. Validate an integer in the allowed range, then deliberately choose a default or error.</div></details></section>
<section class="quiz-card" role="listitem"><div class="quiz-question-row"><span class="quiz-number">05</span><p>How do validation and HTML encoding differ?</p></div><details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Answer:</strong> Validation checks application rules. Encoding makes a value data rather than executable markup in a specific output context.</div></details></section>
<section class="quiz-card" role="listitem"><div class="quiz-question-row"><span class="quiz-number">06</span><p>Why should a local static counter not store permanent visit counts?</p></div><details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Answer:</strong> It lasts only in one process; traffic may use other processes or servers, and the state disappears when that process ends. Use shared persistent storage.</div></details></section>
</div>

## Summary

A variable names a value during execution. Normal assignment, references, and objects do not have identical sharing behavior. Scope controls visibility, and explicit parameters are clearer than global dependencies. Superglobals bring request data into PHP, but data must be read defensively, validated, converted, and encoded for its output context.

## Run and verify

Use the [downloadable lab](/en/php/00-lab-setup/) for supplied scripts. Commands for Composer, FPM, Docker, or a real server run inside the corresponding configured project, not an empty folder.

Execute this checkpoint inside the lesson environment:

~~~bash
php scope-lab.php
~~~

**Success criterion:** Output proves the difference among local, global, and static state, and no superglobal value is read before checking key presence and shape.

Record the exit code and observed evidence. If reality differs, explain the environmental or design assumption that failed instead of editing the expectation to match a defect.

## Connect the ideas

Superglobals are trust boundaries, not ready data: check presence, shape, and size, then convert into a request object. Variable variables and <code>eval</code> are rarely sound design tools; a map, callable registry, or explicit parser is clearer and safer. Avoid hidden global dependencies.

### Try it yourself

Refactor an endpoint reading $_GET everywhere into validated values passed to functions.
