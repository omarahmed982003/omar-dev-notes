---
title: 12. Queues, workers, and scheduling
description: Jobs, at-least-once delivery, idempotency, retry, backoff, DLQs, graceful shutdown, and cron.
sidebar:
  order: 12
---

## Before you start

Read this lesson in three passes: understand the problem, follow the example, then try the final check yourself. The terms below are explained before they are used in detail.

### New terms in this lesson

- **Runtime:** The period when a program is actually running.
- **HTTP:** The rules used to exchange requests and responses on the web.
- **API:** A defined interface through which one program requests data or actions from another.
- **Queue:** A line of background jobs waiting to be processed.
- **Worker:** A background process that takes jobs from a queue and runs them.


## Why a queue?

Move slow or retryable work—mail, images, reports, API synchronization—outside the HTTP request. Respond after durably recording the intent, not after spawning an unmanaged background process. Version small payloads and send identifiers instead of serialized object graphs.

## Delivery and idempotency

Many systems provide **at-least-once** delivery, so a message can repeat. Deduplicate by job or business idempotency key and make result storage atomic within one transaction and a unique constraint. A transactional outbox ties a database change to publishing intent.

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

## Operational problem

<details><summary>Why must a queued job be idempotent?</summary><p>Delivery is often at least once and workers retry; duplicate delivery must not duplicate the business effect.</p></details>

## Run and verify

The program returns a new order and then the same order with duplicate=true. Queue retries and dead-letter behavior require a broker and worker in a test environment, beyond this program.

Use the [downloadable lab](/en/php/00-lab-setup/) for supplied scripts. Commands for Composer, FPM, Docker, or a real server run inside the corresponding configured project, not an empty folder.

Execute this checkpoint inside the lesson environment:

~~~bash
php queue-demo.php
~~~

**Extended integration exercise target:** A successful message is processed once, a transient failure retries within a bound, and a permanent failure reaches dead-letter storage with a correlation ID.

Record the exit code and observed evidence. If reality differs, explain the environmental or design assumption that failed instead of editing the expectation to match a defect.

## Connect the ideas

Visibility timeout must exceed processing time or be renewed so another worker does not see the message. Ordering is often guaranteed only within a partition. Poison messages need bounded retries, dead-letter handling, and investigation. A transactional outbox closes the database/message dual-write gap.

### Try it yourself

Simulate a crash after commit but before ack and prove idempotency prevents duplicate effects.


```php
<?php
require __DIR__ . '/bootstrap.php';

$db = Lessons\connectInventory(':memory:');
Lessons\initializeInventory($db);
$first = Lessons\purchase($db, 'job-42', 1, 1, 2);
$again = Lessons\purchase($db, 'job-42', 1, 1, 2);
echo json_encode([$first, $again], JSON_THROW_ON_ERROR), PHP_EOL;
```

## Why the claim belongs in the transaction

Save the example as `queue-demo.php` in the [lab folder](/en/php/00-lab-setup/). The first call creates order 1; the second returns the same order with `duplicate: true`. Read `src/Inventory.php`: a unique `(user_id, job_key)` claim, stock update, order, and outbox event commit together. A different payload with the same key is rejected. Failure before commit rolls all four back; acknowledge the queue message only after commit. A separate “already processed?” read followed by an effect is unsafe because two workers can both pass the read.

An outbox is a table holding events to publish after commit. A publisher may crash after sending and before marking an event sent, so delivery can still repeat. External payments/email need a provider idempotency key or receiver deduplication; a database transaction cannot roll back a remote service. Run `php tests.php inventory` to test duplicate calls and injected failure. These local tests do not simulate a real queue broker or multiple worker processes.
