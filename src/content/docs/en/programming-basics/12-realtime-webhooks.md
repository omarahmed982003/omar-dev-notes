---
title: 12. Real-time communication and webhooks
description: Polling, long polling, SSE, WebSockets, webhooks, and choosing the smallest suitable model.
sidebar:
  order: 12
---

## Communication models

| Pattern | Direction | Good fit |
|---|---|---|
| Polling | Client asks periodically | Infrequent updates and simplicity |
| Long polling | A request waits for an event | Broad compatibility and lower latency |
| SSE | Server → browser | Text notifications and feeds |
| WebSocket | Persistent two-way | Chat, games, collaboration |
| Webhook | Server → server | Notify another system |

WebSockets add connection state, heartbeat, backpressure, and scaling concerns. Choose the simplest pattern that meets the requirement.

## Server-Sent Events

```php
header('Content-Type: text/event-stream');
header('Cache-Control: no-cache');
header('X-Accel-Buffering: no');

echo "event: order.updated\n";
echo 'data: ' . json_encode(['id' => 42, 'status' => 'paid']) . "\n\n";
flush();
```

Browsers reconnect automatically. Event IDs and `Last-Event-ID` can support resume. Long streams can occupy FPM workers, so validate the server architecture and timeouts.

## Webhook receiver

1. Read the raw body.
2. Verify an HMAC signature and timestamp.
3. Reject replay outside a time window.
4. persist the event ID to deduplicate.
5. Acknowledge quickly and enqueue heavy work.

```php
$expected = hash_hmac('sha256', $timestamp . '.' . $rawBody, $secret);
if (!hash_equals($expected, $signature)) {
    http_response_code(401);
    exit;
}
```

Senders retry failed deliveries, so idempotency is required.

## Operations

- Limit connection count, message rate, and size.
- Use heartbeat and detect dead peers.
- Authenticate connections and authorize every channel or event.
- Monitor reconnect rate, queue lag, and delivery failures.

## Lesson map

<div class="lesson-diagram" role="img" aria-label="Concept map: Real-time communication and webhooks">
<p class="lesson-diagram-title">Concept map: Real-time communication and webhooks</p>
<div class="diagram-flow">
<div class="diagram-node input"><span>Communication models</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>Server-Sent Events</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>Webhook receiver</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node decision"><span>Operations</span></div>
</div>
</div>

## Check your understanding

<div class="lesson-quiz" role="list">
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">01</span><p>Explain “Communication models” as if reviewing a real implementation. What is its goal and most important constraint?</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> | Pattern | Direction | Good fit | |---|---|---| | Polling | Client asks periodically | Infrequent updates and simplicity | | Long polling | A request waits for an event | Broad compatibility and lower latency | | SSE | Server → browser | Text notifications and feeds | | WebSocket | Persistent two-way | Chat, games, collaboration | | Webhook | Server → server | Notify another system | WebSockets add connection… In practice, a successful happy path is insufficient: document assumptions and validate the values and states that can break this behavior.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">02</span><p>Compare “Communication models” with “Server-Sent Events”. Why does neither replace the other in “Real-time communication and webhooks”?</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> For “Communication models”: | Pattern | Direction | Good fit | |---|---|---| | Polling | Client asks periodically | Infrequent updates and simplicity | | Long polling | A request waits for an event | Broad compatibility and lower latency | | SSE | Server → browser | Text notifications and feeds | | WebSocket | Persistent two-way | Chat, games, collaboration | | Webhook | Server → server | Notify another system | WebSockets add connection… For “Server-Sent Events”: Browsers reconnect automatically. Event IDs and Last-Event-ID can support resume. Long streams can occupy FPM workers, so validate the server architecture and timeouts. The first covers one part of the design while the second completes the behavior or constraints required for a correct implementation.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">03</span><p>Assume a system ignores “Webhook receiver”. What failure or risk should you expect, and how would a test expose it?</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> Read the raw body. Verify an HMAC signature and timestamp. Reject replay outside a time window. persist the event ID to deduplicate. Acknowledge quickly and enqueue heavy work. Senders retry failed deliveries, so idempotency is required. Test a valid path, an exact boundary, and invalid input, then inspect output, side effects, and logs rather than treating the absence of an exception as success.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">04</span><p>Turn “Operations” into a reviewable engineering decision. What should be documented and tested?</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> Limit connection count, message rate, and size. Use heartbeat and detect dead peers. Authenticate connections and authorize every channel or event. Monitor reconnect rate, queue lag, and delivery failures. Record the rationale, alternatives, and limits; test normal behavior, minimum and maximum boundaries, partial failure, and retry or repetition when applicable.</div></details>
</section>
</div>
