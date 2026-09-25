---
title: 8. Servers, proxies, load balancers, and API gateways
description: Practical differences among servers, forward and reverse proxies, load balancers, and API gateways, including trust and failure boundaries.
sidebar:
  order: 8
---

## Why place layers in front of an application?

Production systems often need TLS, protection, traffic distribution, routing, observability, and shared policies. One product may perform multiple roles, yet their responsibilities remain different.

```text
Client → DNS → CDN/WAF → Load Balancer → Reverse Proxy → API Gateway
                                                        ├─ Identity
                                                        ├─ Orders
                                                        └─ Catalog → Cache/DB/Queue
```

Not every system needs every layer. A small app may use Nginx for TLS and reverse proxying; a multi-service platform may need a gateway.

## Forward and reverse proxies

A **forward proxy** acts for clients. Corporate devices send outbound traffic through it for policy, destination controls, caching, or auditing. It may hide an address from the destination but is not automatically anonymous; the proxy can identify and log the client.

A **reverse proxy** acts for servers. Clients request the app normally and the proxy selects an upstream. It may terminate TLS, route hosts and paths, compress or cache responses, enforce body limits, add request IDs, and hide internal addresses. Nginx, HAProxy, and Envoy can perform these duties. A proxy cannot replace application validation and authorization.

## Load balancers

A **load balancer** distributes work across healthy instances. Layer 4 operates on TCP/UDP connections; Layer 7 understands HTTP hosts, paths, and headers. Common methods include round robin, least connections, and consistent hashing.

Separate liveness from readiness: a process can be alive but unable to accept work. Unlimited retries multiply load, so define timeouts, retry budgets, and idempotency for repeatable operations.

## API gateways

An **API gateway** is an organized API entry point. It may route versions, validate a token, enforce quotas, transform protocols, aggregate responses, and emit shared metrics and traces. The service that owns a resource must still enforce its authorization.

Do not move all domain logic into the gateway. That creates a central monolith and release bottleneck. Keep shared edge policy in the gateway and domain rules in their owning services.

## Role comparison

| Component | Acts for | Primary decision | Typical use |
|---|---|---|---|
| Server | Service | How to process a request | App or database |
| Forward proxy | Client | Whether/where traffic exits | Corporate network |
| Reverse proxy | Servers | Which upstream receives it | TLS and host routing |
| Load balancer | Replicas | Which healthy replica gets load | Worker distribution |
| API gateway | API platform | Which API, identity, and policy apply | Microservice entry |

One product can combine roles. Review the responsibility, trust boundary, and failure mode rather than relying on a product label.

## Trust, security, and failure

Never trust `Forwarded` or `X-Forwarded-For` from arbitrary clients. Accept them only from configured trusted proxies that sanitize the chain. Do not forward credentials to unintended upstreams; cap header/body sizes and timeouts; protect management APIs; use internal TLS when the threat model requires it.

Every layer adds latency and a failure point. Replicate critical layers, use meaningful health checks, roll configuration out gradually, and propagate a correlation/trace ID. A `502` usually means an invalid or unavailable upstream response; `504` means the upstream deadline expired. Confirm with both sides' logs and a trace.

## Check your understanding

<div class="lesson-quiz" role="list">
<section class="quiz-card" role="listitem"><div class="quiz-question-row"><span class="quiz-number">01</span><p>You have three identical app replicas. What do you need first, and why is a gateway optional?</p></div><details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Answer:</strong> A load balancer distributes requests among healthy replicas. A gateway is useful for API policy or multiple services, not merely replica count.</div></details></section>
<section class="quiz-card" role="listitem"><div class="quiz-question-row"><span class="quiz-number">02</span><p>Why is a client-supplied <code>X-Forwarded-For</code> unsafe?</p></div><details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Answer:</strong> The client can forge it. Trust address metadata only from an approved proxy that sanitizes the chain.</div></details></section>
<section class="quiz-card" role="listitem"><div class="quiz-question-row"><span class="quiz-number">03</span><p>What happens when pricing and inventory rules move into the gateway?</p></div><details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Answer:</strong> It becomes a central monolith and release bottleneck while domain ownership leaks out of services.</div></details></section>
<section class="quiz-card" role="listitem"><div class="quiz-question-row"><span class="quiz-number">04</span><p>Outline a short investigation for a <code>504</code>.</p></div><details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Answer:</strong> Follow the trace ID, compare proxy timeout with upstream latency, inspect saturation and dependencies, and determine whether work completed after disconnect before retrying.</div></details></section>
</div>
