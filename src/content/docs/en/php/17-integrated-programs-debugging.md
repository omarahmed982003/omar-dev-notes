---
title: 17. Integrated programs and practical debugging
description: Complete PHP programs connecting types, functions, files, requests, and exceptions, with output-prediction and debugging exercises.
sidebar:
  order: 17
---

## Before you start

Read this lesson in three passes: understand the problem, follow the example, then try the final check yourself. The terms below are explained before they are used in detail.

### New terms in this lesson

- **Debugger:** A tool that pauses a program so you can inspect values and execution step by step.
- **CLI:** A text-based interface controlled by typed commands.
- **UTF-8:** A common encoding that stores Unicode numbers as bytes.
- **Function:** A named, reusable block of code with one defined job.


## Move from a fragment to a runnable program

A tiny snippet is ideal for one operator or function, but it hides integration failures: input can be missing, a file can fail to open, output can be corrupted, and correct functions can be composed in the wrong order.

A complete learning program should state how to run it, valid and invalid input shapes, expected output and exit/status codes, function responsibilities, failure behavior, and tests.

Debugging should follow evidence rather than random edits:

```text
Reproduce → Minimize → Observe → Hypothesis
          → One change → Verify → Regression test
```

Write expected versus actual behavior, reproduce with the smallest input, collect a log/dump/test result, change one suspected cause, and preserve the fix with a regression test. Previous lessons provide parts; this lesson exposes the boundaries between them.

## Why complete programs matter

A fragment isolates one construct; a complete program exposes boundaries: where input enters, where it is validated, when an exception is appropriate, and how a deterministic result can be tested.

## CLI program: exact price totals

```php
<?php
declare(strict_types=1);

function parseMinorUnits(string $value): int
{
    if (preg_match('/\A[0-9]+(?:\.[0-9]{1,2})?\z/', $value) !== 1) {
        throw new InvalidArgumentException('Invalid amount');
    }
    [$whole, $fraction] = array_pad(explode('.', $value, 2), 2, '');
    $digits = ltrim($whole . str_pad($fraction, 2, '0'), '0');
    $digits = $digits === '' ? '0' : $digits;
    $maximum = (string) PHP_INT_MAX;
    if (strlen($digits) > strlen($maximum)
        || (strlen($digits) === strlen($maximum) && strcmp($digits, $maximum) > 0)) {
        throw new InvalidArgumentException('Amount exceeds integer range');
    }
    return (int) $digits;
}

function addMinorUnits(int $left, int $right): int
{
    if ($left < 0 || $right < 0 || $left > PHP_INT_MAX - $right) {
        throw new InvalidArgumentException('Total exceeds integer range');
    }
    return $left + $right;
}

$arguments = array_slice($argv, 1);
if ($arguments === []) {
    fwrite(STDERR, "Usage: php total.php 12.50 3.25\n");
    exit(2);
}

try {
    $total = array_reduce($arguments, fn (int $sum, string $amount): int => addMinorUnits($sum, parseMinorUnits($amount)), 0);
    printf("%d.%02d\n", intdiv($total, 100), $total % 100);
} catch (InvalidArgumentException $exception) {
    fwrite(STDERR, $exception->getMessage() . PHP_EOL);
    exit(1);
}
```

`php total.php 12.50 3.25` prints `15.75`. The program combines strict types, regex validation, functions, arrays, exceptions, and exit codes while avoiding floating-point money errors.

## Streaming program: count lines without loading the file

```php
<?php
declare(strict_types=1);

function readableLines(string $path): Generator
{
    $file = new SplFileObject($path, 'r');
    foreach ($file as $number => $line) {
        $line = trim((string) $line);
        if ($line !== '') {
            yield $number + 1 => $line;
        }
    }
}

$path = $argv[1] ?? '';
if ($path === '' || !is_readable($path)) {
    fwrite(STDERR, "Readable file required\n");
    exit(2);
}

$count = 0;
foreach (readableLines($path) as $number => $line) {
    $count++;
    echo $number, ': ', $line, PHP_EOL;
}
echo "Count: {$count}", PHP_EOL;
```

Memory remains approximately constant relative to file size. Test an empty file, whitespace-only lines, and an unreadable path.

## Small JSON endpoint with explicit boundaries

```php
<?php
declare(strict_types=1);
header('Content-Type: application/json; charset=utf-8');

try {
    $payload = json_decode(file_get_contents('php://input'), true, flags: JSON_THROW_ON_ERROR);
    $name = is_string($payload['name'] ?? null) ? trim($payload['name']) : '';
    if ($name === '' || mb_strlen($name) > 80) {
        http_response_code(422);
        echo json_encode(['error' => 'invalid_name'], JSON_THROW_ON_ERROR);
        exit;
    }
    http_response_code(201);
    echo json_encode(['name' => $name], JSON_THROW_ON_ERROR);
} catch (JsonException) {
    http_response_code(400);
    echo '{"error":"invalid_json"}';
}
```

Malformed JSON receives `400`; valid JSON violating domain rules receives `422`. A real endpoint also needs authentication, authorization, and CSRF protection where appropriate, and must not expose exception details.

## Repeatable debugging method

1. Preserve an input that reproduces the failure.
2. State expected and actual results.
3. Classify the fault: parsing, type, control flow, I/O, or external state.
4. Minimize the reproduction.
5. Add a test that fails before the correction.
6. Fix the cause and test neighboring boundaries.

Temporary dumps help observation; a logger, debugger, and tests preserve reproducible evidence. Never log tokens, passwords, or sensitive request bodies.

## Progressive practice

<details><summary>1. A program fails only for an empty file. What comes first?</summary><p>Keep the empty file as the smallest reproduction, write expected behavior, and add a focused failing test before changing code.</p></details>

<details><summary>2. Why change one suspected cause at a time?</summary><p>It preserves causal evidence. Several simultaneous edits may hide the bug without proving which hypothesis was correct.</p></details>

<details><summary>3. What does a regression test provide?</summary><p>It captures the previously broken behavior and prevents the same defect from silently returning.</p></details>

## Check your understanding

<div class="lesson-quiz" role="list">
<section class="quiz-card" role="listitem"><div class="quiz-question-row"><span class="quiz-number">01</span><p>Predict <code>array_map(fn ($x) =&gt; $x * 2, ['2', 3])</code> without strict boundary validation.</p></div><details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Answer:</strong> It produces [4, 6] through numeric-string coercion. Validate shape and type at the boundary instead of depending on silent coercion.</div></details></section>
<section class="quiz-card" role="listitem"><div class="quiz-question-row"><span class="quiz-number">02</span><p>Why can repeated floating-point money addition lose a cent?</p></div><details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Answer:</strong> Most decimal fractions are approximate in binary. Use integer minor units or a suitable decimal representation.</div></details></section>
<section class="quiz-card" role="listitem"><div class="quiz-question-row"><span class="quiz-number">03</span><p>Find the bug in <code>if ($value = null)</code>.</p></div><details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Answer:</strong> It assigns null and evaluates false. Use <code>$value === null</code> and static analysis.</div></details></section>
<section class="quiz-card" role="listitem"><div class="quiz-question-row"><span class="quiz-number">04</span><p>Why compare <code>file_get_contents()</code> strictly with <code>false</code>?</p></div><details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Answer:</strong> An empty string is valid but falsy; strict comparison distinguishes read failure from empty content.</div></details></section>
<section class="quiz-card" role="listitem"><div class="quiz-question-row"><span class="quiz-number">05</span><p>Design boundary cases for <code>parseMinorUnits</code>.</p></div><details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Answer:</strong> Test 0, 12, 12.5, and 12.50, then -1, 1.234, letters, whitespace, and a value beyond integer range.</div></details></section>
<section class="quiz-card" role="listitem"><div class="quiz-question-row"><span class="quiz-number">06</span><p>How does hiding a symptom differ from fixing a cause?</p></div><details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Answer:</strong> Suppressing a warning or adding a broad catch can hide evidence; a real correction identifies the invalid state and protects it with a contract and regression test.</div></details></section>
</div>

## Cumulative project: runnable order importer

Build <code>orders.php</code to read a JSON file, validate every order, calculate totals in integer minor units, and print one summary. Treat every boundary explicitly: reading can fail, JSON can be malformed, and price or quantity can violate the contract.

### Input contract

~~~json
[
  {"id":"A-100","unit_price_minor":1250,"quantity":2},
  {"id":"A-101","unit_price_minor":499,"quantity":1}
]
~~~

### Run and expected result

~~~bash
php orders.php fixtures/orders.json
~~~

~~~text
orders=2
items=3
total_minor=2999
~~~

The failure path must be testable too:

~~~bash
php orders.php fixtures/broken.json
~~~

~~~text
ERROR invalid JSON
exit_code=2
~~~

### Acceptance criteria

1. Do not use <code>float</code> for money or silently coerce numeric strings.
2. Separate reading, validation, calculation, and presentation into small typed functions.
3. Test a missing file, malformed JSON, zero quantity, negative price, and a value beyond the <code>int</code> range.
4. Pass PHPStan or the selected analyser and preserve a regression test for every defect found.
5. Log technical causes while keeping CLI errors stable and free of user-facing stack traces.

## Connect the ideas

Turn the final project into real files: valid and malformed fixtures, a test runner, and a README with commands. Preserve each discovered bug as a regression test and run static analysis plus tests from a clean checkout so success cannot depend on undeclared local files.

### Try it yourself

Clear local caches and run the project from a clean copy using only the README.


## Boundary tests

A decimal amount is text until its grammar and range are validated. `\A` and `\z` match the absolute start and end; `$` may match before a final newline. Concatenating the whole part and two fraction digits avoids a multiplication that could overflow before validation. Compare digit lengths, then equal-length digit strings, before casting. Addition is safe only when `left <= PHP_INT_MAX - right`. This example accepts nonnegative amounts with at most two decimal places, including leading zeros; it does not implement currency conversion or rounding.

Run `php tests.php values` in the [downloadable lab](/en/php/00-lab-setup/). Try `12.5` (1250), `12.5` followed by a newline (rejected), an amount above the integer limit (rejected), and two valid amounts whose sum exceeds the limit (rejected).
