---
title: "Trace requests and interpret measurements"
description: "Trace requests and interpret measurements"
sidebar:
  order: 33
prev: {"link":"/en/programming-basics/24-request-protection/","label":"Protecting requests and limiting their rate"}
next: false
---

When a request is slow, collect evidence of where the delay happened. Read a log, duration, and request ID before connecting measurements across services.

## Read evidence from your own environment

In the [lab](/en/programming-basics/32-local-network-lab/), request the product, `/missing`, and `/failure`. Each response has `X-Request-Id`, matched by a terminal entry with200/404/500. A **log** records an event; the ID connects response and log. `/proxy` preserves the ID at both servers.

A **span** is a timed part of work, such as a database query. Related spans form a **trace**. A request ID alone is not a complete trace: this lab proves correlation across two requests, not nonexistent database timing.

A **percentile** is a value at or below which a portion of measurements falls. For twenty sorted durations10,20,…,200ms, nearest-rank p50 uses rank10=100ms; p95 uses19=190ms; p99 uses20=200ms. Tools may interpolate differently, and a small sample poorly estimates a large population’s tail. State method and sample size; p95 is not a mean.

**Deliver:** three status/ID/log pairs, one proxy request, and explanations of200/404/500. Then use the public-site project below as an extension, accepting that public sites may hide fields.

## Logs, metrics, and traces

- A **log** records a detailed structured event.
- A **metric** aggregates rates, errors, latency percentiles, and saturation.
- A **trace** connects spans across edge, gateway, app, database, and dependencies.

Propagate a trace/correlation ID without logging passwords, tokens, or unnecessary personal data. Watch `p50`, `p95`, and `p99`; an average hides a slow minority.

```text
Client: DNS → Connect → TLS → TTFB → Download
Server: Edge → Gateway → App → DB → External API
```

High TTFB (Time To First Byte, time until the first response byte according to the measurement tool) with normal application time points toward queueing, edge, or network work. A slow database span directs investigation toward queries, indexes, and connection capacity.

## Check your understanding

<div class="lesson-quiz" role="list">
<section class="quiz-card" role="listitem"><div class="quiz-question-row"><span class="quiz-number">01</span><p>How can a bad cache key leak data?</p></div><details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Answer:</strong> If it ignores identity or another response-varying dimension, the CDN can serve one user's representation to another.</div></details></section>
<section class="quiz-card" role="listitem"><div class="quiz-question-row"><span class="quiz-number">02</span><p>Why can a WAF not secure an invoice-update endpoint alone?</p></div><details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Answer:</strong> It can detect patterns but does not own invoice authorization and business rules.</div></details></section>
<section class="quiz-card" role="listitem"><div class="quiz-question-row"><span class="quiz-number">03</span><p>Differentiate rate limit, concurrency limit, and quota.</p></div><details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Answer:</strong> They cap arrival rate, simultaneous work, and total use over a period respectively.</div></details></section>
<section class="quiz-card" role="listitem"><div class="quiz-question-row"><span class="quiz-number">04</span><p>Why use logs, metrics, and traces together?</p></div><details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Answer:</strong> A metric reveals a trend, a trace locates the failing stage, and a log provides event details needed to explain it.</div></details></section>
</div>

## Cumulative project: trace one request from name to origin

Choose a non-sensitive public URL (Uniform Resource Locator, an address identifying a resource and how to access it) and build a journey card for one request. Do not stop at a DevTools screenshot; connect every observation to a layer and reproducible evidence.

### 1. Name and address

~~~bash
nslookup example.com
~~~

Record the resolver, returned addresses, and TTL (Time To Live, a DNS cache lifetime or an IPv4 forwarding limit depending on context) when your tool exposes it. An address change between runs can be CDN or DNS (Domain Name System, a distributed system answering queries about domain names) load balancing rather than a fault.

### 2. Connection and HTTP

~~~bash
curl.exe -sS -o NUL -D headers.txt -w "status=%{http_code} remote=%{remote_ip} connect=%{time_connect} ttfb=%{time_starttransfer} total=%{time_total}\n" https://example.com/
~~~

This is an output shape, not a value to copy:

~~~text
status=200 remote=203.0.113.10 connect=0.042 ttfb=0.118 total=0.121
~~~

On macOS or Linux replace <code>NUL</code> with <code>/dev/null</code>. Inspect <code>headers.txt</code> for <code>cache-control</code>, <code>age</code>, <code>via</code>, and a request ID; a missing header does not prove that no CDN exists.

### 3. Repeat and compare

Run the request five times and save status, TTFB, and Age. Add a safe query parameter and observe whether it changes the cache key. Never infer a cache hit from speed alone; require header or provider evidence.

### 4. Failure path

Request a missing path and verify that the 404 still carries a request ID and is not cached for an unintended duration. In a staging environment you control, trigger a monitored 500 and verify trace continuity from edge to application while logs exclude Cookie and Authorization values.

### Deliverable

Provide a five-attempt table, a Network waterfall capture, an explanation of the TTFB difference, and one falsifiable hypothesis about where delay occurs. Label measured facts separately from inferences.

## Interpret the operational terms

The **origin** is the source server; **edge/PoP (Point of Presence)** is a distributed serving location. A **cache key** groups requests sharing a representation. A content **hash** fingerprints data; it is not encryption. **Purge/invalidation** removes or expires a stored copy and may propagate gradually.

A **fixed window** counts requests in set intervals; a **sliding window** tracks a moving interval. A **token bucket** replenishes permission tokens over time and permits bursts up to its capacity. A **tenant** is one customer organization sharing a service. **Backpressure** slows incoming production; **load shedding** rejects work the system cannot complete. IP-only limits can penalize unrelated users sharing NAT (Network Address Translation, rewriting IP addresses at a network boundary).

A **span** is one timed operation within a trace. **p95** means 95 percent of measured values are at or below that value; p50 is the median and p99 describes a slower tail. A **false positive** is a legitimate request flagged as an attack. **Rollback** restores a known configuration. **Trace context** carries the identifiers needed to connect related operations across services and queued work.

**Worked check:** A second request is faster without a cache indicator. Do not declare a cache hit; connection reuse or load changes can explain it. In your own service, combine Age, cache-status fields, and logs. Comparing purge completion across locations requires actual separate measurement locations; two commands on one device do not establish global propagation. Public sites need not expose request IDs on their 404 or 500 responses.
