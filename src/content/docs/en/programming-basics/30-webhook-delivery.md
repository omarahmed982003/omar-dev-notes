---
title: "Receive a webhook and handle repeated delivery"
description: "Receive a webhook and handle repeated delivery"
sidebar:
  order: 28
prev: {"link":"/en/programming-basics/12-realtime-webhooks/","label":"Poll or receive a server stream"}
next: {"link":"/en/programming-basics/13-api-design/","label":"Designing data interfaces"}
---

A **webhook** is a server-to-server request sent for an agreed event. Its client is a server program, not the browser tab. Send one local event, then repeat it to observe duplicate-effect prevention.


## Send one event twice

Start the [lab](/en/programming-basics/32-local-network-lab/). In PowerShell:

```powershell
Set-Content -LiteralPath event.json -Value '{"id":"order-1"}' -Encoding ascii
curl.exe -i -H "Content-Type: application/json" --data-binary "@event.json" http://127.0.0.1:8766/webhook
```

The first command writes a practice event ID. `--data-binary` sends the file as a POST body. Expect `duplicate:false`, `processedCount:1`. Repeat curl: `duplicate:true`, count still1. Change the ID to order-2 and send: count2.

This local receiver loses memory on restart and does not verify an external sender signature. A deployed service needs source verification and durable deduplication; the following sections explain why after this first complete experiment.

## Webhook receiver

The **raw body** is the received bytes before parsing or changing whitespace. **HMAC, Hash-based Message Authentication Code**, computes a verification value using a shared secret and message. A **timestamp** records time; **replay** resends a previously valid message.

The code below is a fragment: timestamp, rawBody, secret, and signature must already be read and validated according to the provider's exact signing contract. SHA-256 is the hash used in this HMAC example; hash_equals avoids comparison-time differences revealing the matching prefix. This fragment alone neither checks message age nor deduplicates events.

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

## Repeated delivery without repeated effects

A reconnect does not recover messages automatically. A **sequence** orders them, a **cursor** records a read position, and a **snapshot** supplies current state. Choose a recovery mechanism appropriate to the service.

**Idempotent processing** avoids repeating the intended effect of the same operation. After signature and time checks, store the event identifier and business change atomically, meaning all succeed or all fail together, or use an equivalent reliable design. A separate "already seen?" check followed by a write can race with another request.

**Worked check:** Payment event pay-42 arrives twice. A unique processing record lets the first application record payment and the second recognize completion without adding credit again. When enqueuing, acknowledge after durable acceptance rather than before storing. Late or reordered events also require checks against the order's current state and transition rules.
