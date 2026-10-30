---
title: "Latency and bandwidth: why a fast link can still feel slow"
description: "Separate delay from transfer capacity, then use RTT, throughput, jitter, and bandwidth-delay product correctly."
sidebar:
  order: 33
prev: {"link":"/en/programming-basics/25-request-observation/","label":"Trace requests and interpret measurements"}
next: {"link":"/en/programming-basics/35-vpc-firewalls/","label":"VPC and firewalls: define service network boundaries"}
---

<span class="foundations-reading-scope" aria-hidden="true"></span>

A fast large download does not prove that the first byte arrived quickly. Diagnose time and capacity separately.

## Core measurements

- **Latency** is elapsed time from an operation starting until its result becomes observable.
- **RTT, round-trip time**, is the trip to a peer and back.
- **Bandwidth** is theoretical or available transfer capacity per second.
- **Throughput** is the rate actually achieved after protocol overhead, loss, congestion, and endpoint limits.
- **Jitter** is variation in latency between samples.

| Situation | Usually dominant |
|---|---|
| Small API with serial connection work | RTT and round trips |
| Large download | Throughput and body size |
| Choppy call despite a reasonable average | Jitter, loss, and buffering |
| Fast start followed by slowdown | Congestion, limits, or storage—not bandwidth alone |

`100 Mbps` is about `12.5 MB/s` before overhead. A 100 MB file therefore needs at least roughly eight seconds at full utilization.

**Bandwidth-delay product, BDP**, estimates bytes that can be in flight before an acknowledgement returns:

```text
BDP = bandwidth × RTT
100 Mbps × 0.08 s = 8 megabits ≈ 1 MB
```

A transport window far below BDP cannot fill a long-distance link. A small request that serially needs DNS, TCP, TLS, and HTTP may instead be round-trip bound.

Measure stages on Windows:

```powershell
curl.exe -s -o NUL -w "dns=%{time_namelookup} connect=%{time_connect} tls=%{time_appconnect} first_byte=%{time_starttransfer} total=%{time_total}`n" https://example.com/
```

Repeat measurements. One sample is not a distribution; compare median and p95 and locate delay before connect, during TLS, before first byte, or during body transfer.

:::note[Deep dive: useful numbers require context]
RTT between two regions is not a permanent number to memorize; routing, congestion, and the user's access network change it. A 10 MB object also does not take only `size / advertised bandwidth`: DNS, handshakes, slow start, loss, server time, and protocol overhead contribute. Use remembered numbers only for order-of-magnitude estimates, then measure from a location that resembles the real user.

The **bandwidth-delay product** is bandwidth multiplied by RTT and approximates the data required in flight to fill a path. A 100 Mbps link with 100 ms RTT needs about 1.25 MB in flight; a smaller TCP window or buffer prevents reaching the advertised capacity. Jitter matters to real-time traffic even when the mean is good, while P95 and P99 expose users hidden by an average.
:::

