---
title: 17. CDNs, WAFs, and edge observability
description: Edge caching, request protection, rate limiting, and connected logs, metrics, and traces.
sidebar:
  order: 17
---

## CDN, origin, and points of presence

A **CDN** runs points of presence near users. An edge returns a cached representation when its key is valid; otherwise it fetches the **origin** and may store the result. This reduces latency and origin load.

The key usually includes host and path plus selected query or `Vary` dimensions. Including every cookie destroys cache efficiency, while ignoring identity dimensions for personalized content can expose one user's response to another.

Use `public` only for shareable content, `private` for browser-only caches, `s-maxage` for shared caches, and content-hashed asset names for long lifetimes. Plan invalidation and protect the origin from direct bypass.

## A WAF does not replace application security

A **WAF** applies managed or custom rules to request patterns. It can block, challenge, or log known attacks, but it does not know every domain rule. A well-formed invoice update may still be unauthorized. Applications must validate input, authenticate, authorize resources, and use safe database APIs.

Test broad rules in monitor mode when possible. False positives can block real customers. Give each exception a reason, owner, and expiry.

## Rate limiting and bursts

Limits may use IP, user, API key, tenant, or route. Fixed window, sliding window, and token bucket have different burst behavior. Return `429 Too Many Requests` and a truthful `Retry-After` when available.

Rate limits control arrival rate, concurrency limits protect worker capacity, and quotas cap total use over a period. Under overload, apply backpressure or load shedding rather than accepting work that cannot complete.

## Logs, metrics, and traces

- A **log** records a detailed structured event.
- A **metric** aggregates rates, errors, latency percentiles, and saturation.
- A **trace** connects spans across edge, gateway, app, database, and dependencies.

Propagate a trace/correlation ID without logging passwords, tokens, or unnecessary personal data. Watch `p50`, `p95`, and `p99`; an average hides a slow minority.

```text
Client: DNS → Connect → TLS → TTFB → Download
Server: Edge → Gateway → App → DB → External API
```

High TTFB with normal application time points toward queueing, edge, or network work. A slow database span directs investigation toward queries, indexes, and connection capacity.

## Check your understanding

<div class="lesson-quiz" role="list">
<section class="quiz-card" role="listitem"><div class="quiz-question-row"><span class="quiz-number">01</span><p>How can a bad cache key leak data?</p></div><details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Answer:</strong> If it ignores identity or another response-varying dimension, the CDN can serve one user's representation to another.</div></details></section>
<section class="quiz-card" role="listitem"><div class="quiz-question-row"><span class="quiz-number">02</span><p>Why can a WAF not secure an invoice-update endpoint alone?</p></div><details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Answer:</strong> It can detect patterns but does not own invoice authorization and business rules.</div></details></section>
<section class="quiz-card" role="listitem"><div class="quiz-question-row"><span class="quiz-number">03</span><p>Differentiate rate limit, concurrency limit, and quota.</p></div><details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Answer:</strong> They cap arrival rate, simultaneous work, and total use over a period respectively.</div></details></section>
<section class="quiz-card" role="listitem"><div class="quiz-question-row"><span class="quiz-number">04</span><p>Why use logs, metrics, and traces together?</p></div><details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Answer:</strong> A metric reveals a trend, a trace locates the failing stage, and a log provides event details needed to explain it.</div></details></section>
</div>
