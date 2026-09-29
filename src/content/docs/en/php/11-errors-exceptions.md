---
title: 11. Errors and exceptions
description: Throwable, Error, Exception, try/catch/finally, custom exceptions, boundaries, and safe reporting.
sidebar:
  order: 11
---

## The problem: failure is not an ordinary result

A withdrawal can succeed, reject a negative amount, or reject an amount exceeding the balance. A file read may fail because storage is unavailable. If all these return `null`, the caller cannot distinguish “no data” from a bug.

An **exception** signals that an operation could not produce its normal result. `throw` raises it; `try` marks the guarded region; `catch` handles a type it understands. **Throwable** covers both Exception and Error. Error includes TypeError and DivisionByZeroError. Not every PHP diagnostic is an exception: a warning may report a problem and return false.

This lesson uses PHP 8.1+. Recall lesson 7's call stack: exceptions travel outward through calls until a suitable catch is found.

## A complete three-case program

Save `withdraw.php` and run `php withdraw.php`. The **domain** is our withdrawal rule; DomainException represents a business-rule failure even when types are valid:

~~~php
<?php
declare(strict_types=1);

function withdraw(int $balance, int $amount): int
{
    if ($balance < 0 || $amount <= 0) {
        throw new InvalidArgumentException('Use a nonnegative balance and positive amount');
    }
    if ($amount > $balance) {
        throw new DomainException('Insufficient funds');
    }
    return $balance - $amount;
}
foreach ([200, 1200, -1] as $amount) {
    echo "request={$amount}", PHP_EOL;
    try {
        $remaining = withdraw(1000, $amount);
        echo "remaining={$remaining}", PHP_EOL;
    } catch (InvalidArgumentException $error) {
        echo "invalid input", PHP_EOL;
    } catch (DomainException $error) {
        echo "declined", PHP_EOL;
    } finally {
        echo "finished attempt", PHP_EOL;
    }
}
~~~

~~~text
request=200
remaining=800
finished attempt
request=1200
declined
finished attempt
request=-1
invalid input
finished attempt
~~~

Each iteration starts with 1000; these are independent cases, not a running bank statement. 200 returns 800. 1200 throws before return, skipping the remaining-balance echo and reaching the domain catch. -1 triggers input rejection. Finally runs for all three. Put specific catches before general ones so a broad catch does not consume them first.

An exception from a deeper function unwinds that call before searching outward. Catch does not resume at the failed line; execution continues after the handled block. An uncaught failure reaches the application boundary and normally ends the request/script.

## finally cleans up; it should not replace the result

An opened resource needs closing on both success and failure. Run `cleanup.php`:

~~~php
<?php
$stream = fopen('php://temp', 'w+b');
if ($stream === false) {
    throw new RuntimeException('Open failed');
}
try {
    try {
        throw new RuntimeException('Simulated read failure');
    } finally {
        fclose($stream);
        echo "closed", PHP_EOL;
    }
} catch (RuntimeException $error) {
    echo "handled", PHP_EOL;
}
echo is_resource($stream) ? "open\n" : "not open\n";
~~~

~~~text
closed
handled
not open
~~~

The inner finally runs while the exception is leaving, then the outer catch handles it. Finally also runs on ordinary return, but do not rely on it after `exit` or forced process termination. **Mistake:** returning from finally can hide a previous result or exception. Keep cleanup from masking the original failure.

A custom exception such as `final class InsufficientStock extends DomainException {}` provides a meaningful type, but not every message needs a new class. When wrapping a failure, preserve previous: `throw new RuntimeException('Could not load notes', 0, $error);`. Program decisions should depend on type, not matching message text.

## A warning does not automatically enter catch

`file_get_contents` may emit a warning and return false. Explicitly check it, as in the files lesson. `@` hides diagnostics without repairing the read. If a specific I/O boundary must convert warnings to exceptions, install a temporary handler, restore the previous one in finally, and respect `error_reporting()`. Do not arbitrarily convert every application notice and then report success.

For a long-running worker, the message boundary decides retry versus rejection and resets state. Retry is appropriate only for a temporary failure and an **idempotent** operation, one whose repetition does not duplicate its effect. A TypeError in arithmetic needs repair, not five retries.

## Development and production: same error, different audience

**Development** is your working environment; **production** serves users. Use `php --ini` to identify loaded configuration; CLI settings can differ from FPM/Apache. A development ini excerpt:

~~~ini
error_reporting=E_ALL
display_errors=On
display_startup_errors=On
log_errors=On
~~~

In production, with error_log configured to a protected service-writable path:

~~~ini
error_reporting=E_ALL
display_errors=Off
display_startup_errors=Off
log_errors=On
zend.exception_ignore_args=On
~~~

The goal is protected diagnostics rather than exposing them to users. Never log passwords, session IDs, or complete bodies. Omitting trace arguments reduces exposure but cannot sanitize a message containing manually inserted secrets. A syntax error in the same file may occur before ini_set executes; php.ini is applied earlier.

## A complete JSON application boundary

Save `boundary.php` and serve it with a local PHP server. The request returns 500 and JSON with a different request_id each time. Logging here includes only type and location to minimize data; add sanitized context when needed:

~~~php
<?php
declare(strict_types=1);

set_exception_handler(static function (Throwable $error): void {
    $id = bin2hex(random_bytes(8));
    error_log(json_encode([
        'event' => 'unhandled_failure',
        'request_id' => $id,
        'type' => get_class($error),
        'file' => basename($error->getFile()),
        'line' => $error->getLine(),
    ], JSON_THROW_ON_ERROR));
    http_response_code(500);
    header('Content-Type: application/json; charset=utf-8');
    header('Cache-Control: no-store');
    echo json_encode(['error' => 'Internal error', 'request_id' => $id], JSON_THROW_ON_ERROR);
});
throw new RuntimeException('Demonstration failure');
~~~

The handler is a safety net for unexpected failures, not a replacement for 422 validation responses. Once a body has already been sent, the response cannot reliably be repaired; emit in one place. Empty catches and `catch (Throwable) { return null; }` hide failures. Log once at the responsible boundary rather than in every layer the failure crosses.

## Predict, debug, complete

<details><summary>Predict cleanup.php's order when the operation fails</summary><p>closed, handled, not open. Cleanup runs while the exception leaves, before the outer catch.</p></details>

<details><summary>Debug: catch (Exception) does not catch TypeError</summary><p>TypeError extends Error; both Error and Exception implement Throwable. Handle expected types near an operation and Throwable at the application boundary without converting bugs into success.</p></details>

<details><summary>Complete wrapping an error while preserving its cause</summary><p><code>throw new RuntimeException('Load failed', 0, $error);</code>. The third argument retains the previous failure for diagnosis.</p></details>

<details><summary>A user sees an internal path in production JSON</summary><p>Check display_errors, stray output, and raw exception messages. Separate a generic response/tracking ID from protected logs, then confirm the response is one valid JSON document.</p></details>

Run `php error-lab.php` from the [lab](/en/php/00-lab-setup/). In the notebook, invalid form data means 422; unexpected storage failure means 500. They are different failures.
