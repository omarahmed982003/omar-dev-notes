---
title: 9. Logging and observability
description: PSR-3, structured events, request IDs, metrics, traces, redaction, and actionable alerts.
sidebar:
  order: 9
---

## Three signal types

- **Logs** are detailed searchable events.
- **Metrics** aggregate numbers over time.
- **Traces** follow work through services, databases, and queues.

Observability needs schemas, retention, access policy, and alerts—not random `error_log` calls.

## PSR-3 structured logs

```php
use Psr\Log\LoggerInterface;

final class Checkout
{
    public function __construct(private LoggerInterface $logger) {}

    public function run(Order $order, string $requestId): void
    {
        $this->logger->info('checkout.started', [
            'request_id' => $requestId,
            'order_id' => $order->id(),
        ]);
    }
}
```

Pass machine-readable context instead of concatenating text. Monolog is a common PSR-3 implementation.

## Correlation and redaction

Create a request ID at the trusted edge and carry it into logs, outgoing HTTP, and queue metadata. Never log passwords, session IDs, tokens, authorization or cookie fields, encryption keys, or unreviewed personal bodies. Use allow-lists or tested redaction.

## Metrics and alerts

Track request rate, error rate, latency distributions, and saturation. Useful PHP signals include FPM queue depth, max-children events, database pool pressure, API latency, queue lag, and cache hit ratio.

Alert on actionable user impact such as sustained `5xx` rate or p95 latency. Attach deployment version to signals to identify regressions.

## Reference

- [PSR-3 Logger Interface](https://www.php-fig.org/psr/psr-3/)

