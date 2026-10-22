---
title: "Trace requests and interpret measurements"
description: "Trace requests and interpret measurements"
sidebar:
  order: 32
prev: {"link":"/en/programming-basics/24-request-protection/","label":"Protecting requests and limiting their rate"}
next: {"link":"/en/programming-basics/networking-next/","label":"Networking and the web"}
---

<span class="foundations-reading-scope" aria-hidden="true"></span>

When a request is slow, collect evidence of where the delay happened. Read a log, duration, and request ID before connecting measurements across services.

## Read evidence from your own environment

No-Node reading alternative: these are prepared explanatory records. Each input request has an output status and correlation identifier:

| Request | Status | ID in response and log |
| --- | --- | --- |
| Existing product | 200 | demo-1 |
| Missing resource | 404 | demo-2 |
| Intentional failure | 500 | demo-3 |

Match demo-2 to the missing resource and explain its non-200 status. These are not measurements from your computer. Execution in the Node.js [lab](/en/programming-basics/32-local-network-lab/) is **optional**: request the product, `/missing`, and `/failure`. Real generated IDs need not match demo labels. Each response has `X-Request-Id`, matched by a terminal entry with 200/404/500. A **log** records an event; the ID connects response and log. `/proxy` preserves the ID at both servers.

A **span** is a timed part of work, such as a database query. Related spans form a **trace**. A request ID alone is not a complete trace: this lab proves correlation across two requests, not nonexistent database timing.

A **percentile** is a value at or below which a portion of measurements falls. For twenty sorted durations of 10, 20, …, 200 ms, the nearest-rank method gives p50 at rank 10 = 100 ms; p95 at rank 19 = 190 ms; and p99 at rank 20 = 200 ms. Tools may interpolate differently, and a small sample poorly estimates a large population’s tail.

State method and sample size; p95 is not a mean.

**If you run the lab, deliver:** three status/ID/log pairs, one proxy request, and explanations of 200/404/500. **For reading only:** match each prepared record to its status and identifier, and explain why an identifier alone does not measure database time. Label these as prepared teaching data, not measurements from your computer. The public-site project below is an optional extension; public sites may hide fields.

## Logs, metrics, and traces

- A **log** records a detailed structured event.
- A **metric** aggregates rates, errors, latency percentiles, and saturation.
- A **trace** connects spans across edge, gateway, app, database, and dependencies.

Propagate a trace/correlation ID without logging passwords, tokens, or unnecessary personal data. Watch `p50`, `p95`, and `p99`; an average hides a slow minority.

Client measurements may include name lookup, connection establishment, TLS, time until the first response byte, and downloading the response. Server spans record what actually happened: an application span may contain a database query or an external-service call. These are not mandatory stages in a fixed order, and a database is not an intermediary to an external API.

High TTFB (Time To First Byte, time until the first response byte according to the measurement tool) with normal application time points toward queueing, edge, or network work. A slow database span directs investigation toward queries, indexes, and connection capacity.

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

In the local lab, request a missing path and verify that its 404 carries a request ID. On the public site, record whether the identifier and cache policy are exposed; absent fields are not a failure on your part. In a staging environment you control, trigger a monitored 500 and verify trace continuity from edge to application while logs exclude Cookie and Authorization values.

### Deliverable

Provide a five-attempt table, a Network waterfall capture, an explanation of the TTFB difference, and one falsifiable hypothesis about where delay occurs. Label measured facts separately from inferences.

## Check the inference before changing the service

**Trace context** carries the identifiers needed to connect related operations across services and queued work. Request IDs are useful on 404 and 500 responses too, but do not assume a public site exposes them.

## Check your understanding

<div class="lesson-quiz" role="list">

<section class="quiz-card" role="listitem"><div class="quiz-question-row"><span class="quiz-number">04</span><p>Why use logs, metrics, and traces together?</p></div><details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Answer:</strong> A metric reveals a trend, a trace locates the failing stage, and a log provides event details needed to explain it.</div></details></section>
</div>
