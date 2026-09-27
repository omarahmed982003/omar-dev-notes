---
title: "Load distribution and proxy policies"
description: "Load distribution and proxy policies"
sidebar:
  order: 23
prev: {"link":"/en/programming-basics/08-server-proxy-api-gateway/","label":"Proxies and request distribution"}
next: {"link":"/en/programming-basics/10-http-caching-compression/","label":"Web caching and compression"}
---

Start after trying one proxy. Multiple service copies require selection rules, waiting and retry limits, and a clear trust boundary for incoming proxy metadata.


## Connect each term to a decision

With two application copies, **load balancing** selects a recipient. A **timeout** bounds waiting; a **retry** makes another attempt; a **retry budget** bounds attempts. A **health check** evaluates a copy’s ability to serve work.

A **token** carries a credential that the server verifies; a **quota** bounds total use over a period. **Business logic** includes ownership and permitted edits, finally enforced by the data-owning service. **Rollback** restores a known earlier configuration after trouble. These terms describe decisions, not a tool installation list.

## Load balancers

A **load balancer** distributes work across healthy instances. Layer 4 operates on TCP (Transmission Control Protocol, ordered byte transport with loss recovery; connections can still fail)/UDP (User Datagram Protocol, independent messages without built-in delivery or ordering guarantees) connections; Layer 7 understands HTTP (Hypertext Transfer Protocol, the rules for web requests and responses) hosts, paths, and headers. Common methods include round robin, least connections, and consistent hashing.

Separate liveness from readiness: a process can be alive but unable to accept work. Unlimited retries multiply load, so define timeouts, retry budgets, and idempotency for repeatable operations.

## API gateways

An **API (Application Programming Interface, a defined contract for requesting data or actions from another component) gateway** is an organized API entry point. It may route versions, validate a token, enforce quotas, transform protocols, aggregate responses, and emit shared metrics and traces. The service that owns a resource must still enforce its authorization.

Do not move all domain logic into the gateway. That creates a central monolith and release bottleneck. Keep shared edge policy in the gateway and domain rules in their owning services.

## Trust, security, and failure

Never trust `Forwarded` or `X-Forwarded-For` from arbitrary clients. Accept them only from configured trusted proxies that sanitize the chain. Do not forward credentials to unintended upstreams; cap header/body sizes and timeouts; protect management APIs; use internal TLS when the threat model requires it.

Every layer adds latency and a failure point. Replicate critical layers, use meaningful health checks, roll configuration out gradually, and propagate a correlation/trace ID. A `502` usually means an invalid or unavailable upstream response; `504` means the upstream deadline expired. Confirm with both sides' logs and a trace.

## Choosing distribution and bounding retries

**Round robin** takes turns among instances, a reasonable starting point for similarly costly requests. **Least connections** prefers fewer active connections, which can help with long-lived connections but does not directly measure their work. **Consistent hashing** maps a key to an instance while limiting remapping when membership changes.

**Session affinity** tries to keep a client on one instance; it does not make local state survive instance failure. **Liveness** asks whether a process is alive; **readiness** asks whether it can accept work now. A **retry budget** limits retry counts or time. Three layers each making three attempts can produce 27 downstream attempts.

An **idempotency key** identifies an operation whose recorded result prevents repeated effects. **Rate limits** cap request rates; **quotas** cap total consumption. **Metrics** aggregate measurements, **logs** record events, and **traces** link a request across stages.

**Worked check:** Short independent reads can use round robin. A **WebSocket**, a persistent bidirectional channel, normally stays on the instance that accepted it for that connection's lifetime. Least-connections selection can help new connections. A reconnect must not assume that messages or local state have automatically been restored.
