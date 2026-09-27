---
title: 9. Logging and observability
description: PSR-3, structured events, request IDs, metrics, traces, redaction, and actionable alerts.
sidebar:
  order: 9
---

## Before you start

Read this lesson in three passes: understand the problem, follow the example, then try the final check yourself. The terms below are explained before they are used in detail.

### New terms in this lesson

- **HTTP:** The rules used to exchange requests and responses on the web.
- **API:** A defined interface through which one program requests data or actions from another.
- **Cache:** A temporary copy that reduces waiting and repeated work.
- **Session:** Temporary server-side state used to recognize a user across requests.
- **Cookie:** A small value stored by the browser and sent with matching requests.
- **Queue:** A line of background jobs waiting to be processed.
- **Function:** A named, reusable block of code with one defined job.


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

## Operational problem

<details><summary>What makes a log traceable?</summary><p>A structured event with time, severity, request or trace ID, and safe context without passwords or tokens.</p></details>

## Run and verify

Use the [downloadable lab](/en/php/00-lab-setup/) for supplied scripts. Commands for Composer, FPM, Docker, or a real server run inside the corresponding configured project, not an empty folder.

Execute this checkpoint inside the lesson environment:

~~~bash
php observability-lab.php 2> event.log
~~~

**Success criterion:** Every event contains timestamp, level, request_id, and message, and contains neither a password nor an Authorization header.

Record the exit code and observed evidence. If reality differs, explain the environmental or design assumption that failed instead of editing the expectation to match a defect.

## Connect the ideas

Propagate trace context and span IDs through HTTP, queues, and databases, with sampling that preserves errors and rare requests without full cost. Control label cardinality and keep raw user IDs out of metrics. Define retention, redaction, and access while linking logs, metrics, and traces.

### Try it yourself

Trace one request across three services and confirm no secret is exposed.
