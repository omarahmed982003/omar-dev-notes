---
title: 11. Errors and exceptions
description: Throwable, Error, Exception, try/catch/finally, custom exceptions, boundaries, and safe reporting.
sidebar:
  order: 11
---

## Before you start

Read this lesson in three passes: understand the problem, follow the example, then try the final check yourself. The terms below are explained before they are used in detail.

### New terms in this lesson

- **HTTP:** The rules used to exchange requests and responses on the web.
- **Function:** A named, reusable block of code with one defined job.


## Failures do not all mean the same thing

A programming bug, invalid user input, an unavailable dependency, and an expected domain rejection such as “insufficient funds” need different handling. A giant `try/catch` that turns everything into one message hides the cause and often returns the wrong HTTP status.

An exception says a function cannot complete its normal result. `throw` leaves the current path and searches for a compatible `catch` until the application's global boundary.

```php
function withdraw(int $balanceCents, int $amountCents): int
{
    if ($amountCents <= 0) {
        throw new InvalidArgumentException('Amount must be positive');
    }

    if ($amountCents > $balanceCents) {
        throw new DomainException('Insufficient funds');
    }

    return $balanceCents - $amountCents;
}
```

Do not catch an exception merely to return `null` and erase evidence. Catch it where code can make a real decision: perform a safe retry, map a domain failure to a response, or log protected detail and return a generic message. Use `finally` for cleanup that must happen on both success and failure.

## Error or Exception?

Both `Exception` and `Error` implement `Throwable`. Exceptions often represent operational or domain failure; `Error` includes engine, type, and programming failures that should not all be converted into success.

```php
try {
    $receipt = $payments->charge($order);
} catch (PaymentDeclined $e) {
    // Expected domain failure
} catch (Throwable $e) {
    // Application boundary: log and return a generic response
} finally {
    $lock?->release();
}
```

`finally` always runs and is useful for releasing resources. Never leave a catch block empty.

## Domain exceptions

```php
final class InsufficientStock extends DomainException
{
    public function __construct(public readonly int $productId)
    {
        parent::__construct('Insufficient stock');
    }
}
```

The type carries machine-readable meaning that an outer layer can map to `409` or another contract. Do not branch on message text.

## Reporting policy

Enable `E_ALL` and visible errors in development. In production keep `display_errors=Off`, `log_errors=On`, and return a generic message plus request ID. A browser stack trace can expose paths, secrets, and SQL.

## Global boundary

```php
set_exception_handler(function (Throwable $e): void {
    $requestId = bin2hex(random_bytes(8));
    error_log("[{$requestId}] {$e}");

    if (!headers_sent()) {
        http_response_code(500);
        header('Content-Type: application/json');
    }

    echo json_encode(['error' => 'Internal error', 'request_id' => $requestId]);
});
```

The global handler is a safety net, not a replacement for handling expected failures close to their context.

## Rules

- Do not hide failures with `@`.
- Never send raw exception messages to clients.
- Preserve `previous` when wrapping.
- Redact passwords, tokens, and sensitive bodies.
- Retry only transient failures and only with idempotent behavior.

## Progressive practice

<details><summary>1. When does DomainException fit?</summary><p>When input is technically valid but a domain rule rejects the action, such as withdrawing more than the balance.</p></details>

<details><summary>2. What is wrong with <code>catch (Throwable) { return null; }</code>?</summary><p>It hides bugs and infrastructure failure behind ordinary absence. Handle known cases and let a global boundary log unexpected failure safely.</p></details>

<details><summary>3. Where does finally help?</summary><p>For cleanup required on success and failure, such as closing a file, without replacing the original exception.</p></details>

## Lesson-specific problems

<details><summary>Where should an exception be caught?</summary><p>At a layer able to recover, translate it into a useful result, or log and terminate at a boundary.</p></details>

<details><summary>Why not show a stack trace to users?</summary><p>It may expose paths, secrets, and internals; return a safe message and log details privately.</p></details>

## Run and verify

Use the [downloadable lab](/en/php/00-lab-setup/) for supplied scripts. Commands for Composer, FPM, Docker, or a real server run inside the corresponding configured project, not an empty folder.

Execute this checkpoint inside the lesson environment:

~~~bash
php error-lab.php
~~~

**Success criterion:** An expected failure becomes an explicit domain result; an unexpected failure reaches the central handler once with a correlation ID and is not swallowed.

Record the exit code and observed evidence. If reality differs, explain the environmental or design assumption that failed instead of editing the expectation to match a defect.

## Connect the ideas

<code>Throwable</code> covers Error and Exception, while finally performs cleanup even with return or throw. Convert warnings only at boundaries whose contract you understand. In long-running workers, handling must prevent process loss or next-message contamination according to policy, with one log event.

### Try it yourself

Test success, domain failure, and unexpected error and prove cleanup runs.
