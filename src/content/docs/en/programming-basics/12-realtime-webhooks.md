---
title: "Poll or receive a server stream"
description: "Poll or receive a server stream"
sidebar:
  order: 27
prev: {"link":"/en/programming-basics/33-browser-isolation/","label":"Resource loading and window isolation"}
next: {"link":"/en/programming-basics/30-webhook-delivery/","label":"Receive a webhook and handle repeated delivery"}
---


## Run polling, then streaming

In the [lab](/en/programming-basics/32-local-network-lab/), open Network:

1. Click Poll three times: request, read time, wait briefly, repeat. Expect three times and three `/proxy-clock` requests.
2. Clear the Network display and click Receive three events. **SSE, Server-Sent Events**, carries text events from server to browser: one `/proxy-events` request contains events1,2,3 before the example closes it.
3. Browser `EventSource` opens the channel; `onmessage` receives events and `close()` stops it. Without explicit closure it may reconnect after interruption. The complete client and server are in the downloadable lab file.

**Compare:** polling asks repeatedly even without new data; streaming keeps a connection. WebSocket, not implemented in this exercise, permits both peers to send. [SSE explanation](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events).

## Before the details

Choose an update channel by data direction, frequency, and tolerated delay. Polling, SSE (Server-Sent Events, an HTTP-based server-to-browser text-event stream), WebSocket, and webhooks are not a ranking; each fits a different communication shape.

**Polling** asks periodically; **long polling** holds a request until an event or deadline and then repeats. **SSE, Server-Sent Events**, streams text events from server to browser. **WebSocket** is a persistent bidirectional message channel. A **webhook** is a server request notifying another server about an event.

**Heartbeat** messages test connection liveness. **Backpressure** slows production when consumption cannot keep up. **Horizontal scaling** adds service instances to share work.

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

The following fragment sends one event from a PHP (a programming language commonly used for server-side web processing) handler after its opening tag; it is not a complete streaming server. event names the event, data supplies content, and a blank line ends the event. X-Accel-Buffering asks Nginx not to buffer this response. flush attempts to push output, but other buffers and proxies also matter. The browser's **EventSource** interface normally implements reconnection; the server must retain data needed to honor Last-Event-ID.

```php
header('Content-Type: text/event-stream');
header('Cache-Control: no-cache');
header('X-Accel-Buffering: no');

echo "event: order.updated\n";
echo 'data: ' . json_encode(['id' => 42, 'status' => 'paid']) . "\n\n";
flush();
```

Browsers reconnect automatically. Event IDs and `Last-Event-ID` can support resume. Long streams can occupy FPM (FastCGI Process Manager, managing PHP request workers) workers, so validate the server architecture and timeouts.

## Operations

- Limit connection count, message rate, and size.
- Use heartbeat and detect dead peers.
- Authenticate connections and authorize every channel or event.
- Monitor reconnect rate, queue lag, and delivery failures.

## Practical problems

<details><summary>When is SSE simpler than WebSocket?</summary><p>When a browser only needs a continuing server-to-client stream. SSE is one-way HTTP (Hypertext Transfer Protocol, the rules for web requests and responses) and includes reconnection behavior.</p></details>

<details><summary>How should a webhook receiver authenticate the sender?</summary><p>Verify a signature over the raw body with a secret, check the timestamp window, and deduplicate by event ID.</p></details>

<details><summary>Why must webhook handling be idempotent?</summary><p>A sender may retry after a timeout even if processing succeeded. Repeated delivery must not repeat the business effect.</p></details>


## Next step

After completing this practice, continue with [Receive a webhook and handle repeated delivery](/en/programming-basics/30-webhook-delivery/).
