---
title: 17. Integrated programs and practical debugging
description: Complete PHP programs connecting types, functions, files, requests, and exceptions, with output-prediction and debugging exercises.
sidebar:
  order: 17
---

## Why complete programs matter

A fragment isolates one construct; a complete program exposes boundaries: where input enters, where it is validated, when an exception is appropriate, and how a deterministic result can be tested.

## CLI program: exact price totals

```php
<?php
declare(strict_types=1);

function parseMinorUnits(string $value): int
{
    if (!preg_match('/^\d+(?:\.\d{1,2})?$/', $value)) {
        throw new InvalidArgumentException("Invalid amount: {$value}");
    }
    [$whole, $fraction] = array_pad(explode('.', $value, 2), 2, '');
    return ((int) $whole * 100) + (int) str_pad($fraction, 2, '0');
}

$arguments = array_slice($argv, 1);
if ($arguments === []) {
    fwrite(STDERR, "Usage: php total.php 12.50 3.25\n");
    exit(2);
}

try {
    $total = array_reduce($arguments, fn (int $sum, string $amount): int => $sum + parseMinorUnits($amount), 0);
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

## Check your understanding

<div class="lesson-quiz" role="list">
<section class="quiz-card" role="listitem"><div class="quiz-question-row"><span class="quiz-number">01</span><p>Predict <code>array_map(fn ($x) =&gt; $x * 2, ['2', 3])</code> without strict boundary validation.</p></div><details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Answer:</strong> It produces [4, 6] through numeric-string coercion. Validate shape and type at the boundary instead of depending on silent coercion.</div></details></section>
<section class="quiz-card" role="listitem"><div class="quiz-question-row"><span class="quiz-number">02</span><p>Why can repeated floating-point money addition lose a cent?</p></div><details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Answer:</strong> Most decimal fractions are approximate in binary. Use integer minor units or a suitable decimal representation.</div></details></section>
<section class="quiz-card" role="listitem"><div class="quiz-question-row"><span class="quiz-number">03</span><p>Find the bug in <code>if ($value = null)</code>.</p></div><details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Answer:</strong> It assigns null and evaluates false. Use <code>$value === null</code> and static analysis.</div></details></section>
<section class="quiz-card" role="listitem"><div class="quiz-question-row"><span class="quiz-number">04</span><p>Why compare <code>file_get_contents()</code> strictly with <code>false</code>?</p></div><details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Answer:</strong> An empty string is valid but falsy; strict comparison distinguishes read failure from empty content.</div></details></section>
<section class="quiz-card" role="listitem"><div class="quiz-question-row"><span class="quiz-number">05</span><p>Design boundary cases for <code>parseMinorUnits</code>.</p></div><details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Answer:</strong> Test 0, 12, 12.5, and 12.50, then -1, 1.234, letters, whitespace, and a value beyond integer range.</div></details></section>
<section class="quiz-card" role="listitem"><div class="quiz-question-row"><span class="quiz-number">06</span><p>How does hiding a symptom differ from fixing a cause?</p></div><details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Answer:</strong> Suppressing a warning or adding a broad catch can hide evidence; a real correction identifies the invalid state and protects it with a contract and regression test.</div></details></section>
</div>
