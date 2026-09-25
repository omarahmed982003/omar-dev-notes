---
title: 16. Resilience and worker management
description: Circuit breakers, bulkheads, backpressure, process signals, and worker supervision with systemd or Supervisor.
sidebar:
  order: 16
---

## Timeouts come first

Every dependency needs connection and total timeouts. Without them, PHP workers can accumulate while waiting until the pool is exhausted. Retry only transient failures on safe or idempotent operations, with bounded exponential backoff and jitter.

## Circuit breaker

A breaker is closed while calls flow, open while failures are rejected quickly, and half-open while a small number of probes test recovery. Do not count domain failures such as `422` as dependency outages. Classify connection errors, timeouts, and selected `5xx` results. Decide whether state is process-local or shared across workers.

## Bulkheads and backpressure

A bulkhead isolates capacity through a separate pool or concurrency limit. Backpressure slows or rejects producers when consumers cannot keep up. Use bounded queues, `429` or `503` with `Retry-After`, or reduced concurrency. An unbounded queue delays collapse while consuming memory.

Monitor queue depth, oldest-message age, processing throughput, and failure rate together.

## Worker lifecycle and signals

A long-running CLI worker should handle `SIGTERM`, stop reserving new work, finish or safely release the current job, close resources, and exit. `pcntl` applies to Unix-like environments; Windows service management requires a different mechanism.

```php
<?php
declare(strict_types=1);

$running = true;
pcntl_async_signals(true);
pcntl_signal(SIGTERM, static function () use (&$running): void {
    $running = false;
});

while ($running) {
    $job = reserveJob(timeoutSeconds: 5);
    if ($job === null) continue;
    try {
        handle($job);
        acknowledge($job);
    } catch (Throwable $error) {
        releaseOrDeadLetter($job, $error);
    }
}
```

Recycle workers after a documented job or memory limit, and release locks and connections during shutdown.

## Supervisor and systemd

A process manager starts workers at boot, restarts crashes, supplies the correct environment, and captures output. Prevent rapid restart loops with delay, attempt limits, and alerts.

```ini
[Service]
ExecStart=/usr/bin/php /srv/app/bin/worker.php
WorkingDirectory=/srv/app
Restart=on-failure
RestartSec=5
TimeoutStopSec=30
KillSignal=SIGTERM
```

Health means more than a live process: observe the ability to reserve work, last successful completion, oldest-message age, and error rate.

## Check your understanding

<div class="lesson-quiz" role="list">
<section class="quiz-card" role="listitem"><div class="quiz-question-row"><span class="quiz-number">01</span><p>Why can retry without a timeout amplify failure?</p></div><details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Answer:</strong> Each attempt can wait indefinitely, consuming workers and adding pressure to the failing dependency.</div></details></section>
<section class="quiz-card" role="listitem"><div class="quiz-question-row"><span class="quiz-number">02</span><p>What is half-open state for?</p></div><details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Answer:</strong> It probes recovery with limited traffic before restoring the full load.</div></details></section>
<section class="quiz-card" role="listitem"><div class="quiz-question-row"><span class="quiz-number">03</span><p>How does a bulkhead differ from a circuit breaker?</p></div><details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Answer:</strong> A bulkhead isolates capacity; a breaker temporarily stops calls after a failure pattern.</div></details></section>
<section class="quiz-card" role="listitem"><div class="quiz-question-row"><span class="quiz-number">04</span><p>What should a worker do on SIGTERM?</p></div><details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Answer:</strong> Stop taking new work, finish or release the current job within the grace period, close resources, and exit clearly.</div></details></section>
</div>
