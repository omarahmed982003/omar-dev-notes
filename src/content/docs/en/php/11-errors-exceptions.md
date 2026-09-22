---
title: 11. Errors and exceptions
description: Throwable, Error, Exception, try/catch/finally, custom exceptions, boundaries, and safe reporting.
sidebar:
  order: 11
---

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

## Lesson map

<div class="lesson-diagram" role="img" aria-label="Concept map: Errors and exceptions">
<p class="lesson-diagram-title">Concept map: Errors and exceptions</p>
<div class="diagram-flow">
<div class="diagram-node input"><span>Error or Exception?</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>Domain exceptions</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>Reporting policy</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node decision"><span>Global boundary</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node output"><span>Rules</span></div>
</div>
</div>

## Check your understanding

<div class="lesson-quiz" role="list">
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">01</span><p>Explain “Error or Exception?” as if reviewing a real implementation. What is its goal and most important constraint?</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> Both Exception and Error implement Throwable. Exceptions often represent operational or domain failure; Error includes engine, type, and programming failures that should not all be converted into success. finally always runs and is useful for releasing resources. Never leave a catch block empty. In practice, a successful happy path is insufficient: document assumptions and validate the values and states that can break this behavior.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">02</span><p>Compare “Error or Exception?” with “Domain exceptions”. Why does neither replace the other in “Errors and exceptions”?</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> For “Error or Exception?”: Both Exception and Error implement Throwable. Exceptions often represent operational or domain failure; Error includes engine, type, and programming failures that should not all be converted into success. finally always runs and is useful for releasing resources. Never leave a catch block empty. For “Domain exceptions”: The type carries machine-readable meaning that an outer layer can map to 409 or another contract. Do not branch on message text. The first covers one part of the design while the second completes the behavior or constraints required for a correct implementation.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">03</span><p>Assume a system ignores “Reporting policy”. What failure or risk should you expect, and how would a test expose it?</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> Enable E_ALL and visible errors in development. In production keep display_errors=Off, log_errors=On, and return a generic message plus request ID. A browser stack trace can expose paths, secrets, and SQL. Test a valid path, an exact boundary, and invalid input, then inspect output, side effects, and logs rather than treating the absence of an exception as success.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">04</span><p>Turn “Global boundary” into a reviewable engineering decision. What should be documented and tested?</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> The global handler is a safety net, not a replacement for handling expected failures close to their context. Record the rationale, alternatives, and limits; test normal behavior, minimum and maximum boundaries, partial failure, and retry or repetition when applicable.</div></details>
</section>
</div>
