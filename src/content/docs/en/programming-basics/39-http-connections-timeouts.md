---
title: "HTTP connections and timeout budgets"
description: "Reuse connections and separate connect, read, idle, and overall deadlines so requests cannot hang indefinitely."
sidebar:
  order: 38
prev: {"link":"/en/programming-basics/38-http-large-transfers/","label":"Large HTTP transfers: ranges, multipart, and streaming"}
next: {"link":"/en/programming-basics/40-http-redirects/","label":"HTTP redirects: move a client without changing the operation"}
---

<span class="foundations-reading-scope" aria-hidden="true"></span>

A **persistent connection** carries more than one request, avoiding repeated TCP and TLS setup. HTTP/1.0 commonly closed after a response and gained keep-alive extensions; HTTP/1.1 normally persists unless closure is requested. HTTP/2 multiplexes streams in a connection, and HTTP/3 does so over QUIC.

HTTP keep-alive is not TCP keepalive. The former is application connection reuse; the latter uses low-level probes, often after long intervals, to detect a dead peer.

| Timeout | Protects against |
|---|---|
| DNS | Resolver not answering |
| Connect | Stalled TCP/QUIC establishment |
| TLS handshake | Stalled security negotiation |
| Request/header | A client sending the beginning too slowly |
| Read | No bytes arriving within an interval |
| Idle | An unused reusable connection |
| Overall deadline | The complete operation exceeding its budget |

Do not let every layer wait 30 seconds independently. A **timeout budget** divides the caller's deadline across queueing, connection work, downstream calls, processing, and an error response. Retries must consume the same deadline or they amplify load during failure.

Hop-by-hop fields such as `Connection` apply to one link and must not be blindly forwarded by proxies. Bound connection pools: too few connections cause queueing; too many consume sockets and overwhelm dependencies. Monitor active and idle counts, pool wait, connection failures, and stage-specific timeouts.

:::note[Deep dive: timeout mismatch creates intermittent 502s]
Suppose a load balancer keeps an idle upstream connection for 60 seconds while the application server closes it after 5. The proxy can select that socket just as the server closes it and send a new request, producing an intermittent `502` or connection reset. The API did not necessarily crash; adjacent hops have incompatible idle policies.

Keep the server-side connection alive slightly longer than the proxy's idle timeout, and configure the runtime's header timeout above its keep-alive timeout. During deployment, drain gracefully: stop new selection, allow current requests to finish within a deadline, then close. TCP keepalive probes neither define the application budget nor prevent every half-open connection.

Observe which endpoint closed the connection, socket age at failure, and pool reuse. Raising every timeout may hide the symptom temporarily while consuming more resources and delaying failure detection.
:::

