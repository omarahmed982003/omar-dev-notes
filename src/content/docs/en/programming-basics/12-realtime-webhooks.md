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

