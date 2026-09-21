---
title: 12. Queues, workers, and scheduling
description: Jobs, at-least-once delivery, idempotency, retry, backoff, DLQs, graceful shutdown, and cron.
sidebar:
  order: 12
---

## Why a queue?

Move slow or retryable work—mail, images, reports, API synchronization—outside the HTTP request. Respond after durably recording the intent, not after spawning an unmanaged background process. Version small payloads and send identifiers instead of serialized object graphs.

## Delivery and idempotency

Many systems provide **at-least-once** delivery, so a message can repeat. Deduplicate by job or business idempotency key and make result storage atomic where possible. A transactional outbox ties a database change to publishing intent.

## Retry policy

Retry transient failures with capped exponential backoff and jitter. Do not retry permanent validation or credential errors unchanged. After a limit, move the message to a dead-letter queue with diagnosis and alerting.

## Worker lifecycle

- Set per-job and I/O timeouts.
- Enforce memory limits and recycle long-lived processes.
- On SIGTERM, stop accepting work and finish current work within a grace period.
- Acknowledge after success.
- Align visibility timeout with runtime and renew it when supported.

Monitor queue depth, oldest-message age, processing latency, retries, and DLQ rate.

## Scheduler

Make scheduled work idempotent, prevent unsafe overlap with an expiring lock, and define the timezone. A scheduler can enqueue work instead of performing everything in one process.

