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

