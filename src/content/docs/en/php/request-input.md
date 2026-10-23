---
title: "Request input and superglobals"
prev: {"link":"/en/php/14-datetime-timezones/","label":"Date, time, and timezones"}
next: {"link":"/en/php/09-uploads-cookies-sessions/","label":"Cookies and sessions"}
description: "Read, validate, convert, and encode external input"
sidebar:
  order: 14.5
---

Requires functions, arrays, validation, HTML, and HTTP. A superglobal is a PHP-provided array accessible across function scopes. Treat its values as untrusted input; availability is not authorization.

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

$operation = 'trim';
$result = $operations[$operation]('  hello  ');
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




## Check your understanding

<div class="quiz-list" role="list">
<section class="quiz-card" role="listitem"><div class="quiz-question-row"><span class="quiz-number">01</span><p>Why is casting <code>?page=abc</code> directly to <code>int</code> insufficient?</p></div><details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Answer:</strong> Casting can produce zero and hide invalid input. Validate an integer in the allowed range, then deliberately choose a default or error.</div></details></section>
<section class="quiz-card" role="listitem"><div class="quiz-question-row"><span class="quiz-number">02</span><p>How do validation and HTML encoding differ?</p></div><details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Answer:</strong> Validation checks application rules. Encoding makes a value data rather than executable markup in a specific output context.</div></details></section>
</div>

[Return to PHP](/en/php/).

