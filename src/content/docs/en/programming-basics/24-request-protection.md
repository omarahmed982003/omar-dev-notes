---
title: "Protecting requests and limiting their rate"
description: "Protecting requests and limiting their rate"
sidebar:
  order: 32
prev: {"link":"/en/programming-basics/17-proxies-cdn-waf-observability/","label":"Deliver content and understand the origin server"}
next: {"link":"/en/programming-basics/25-request-observation/","label":"Trace requests and interpret measurements"}
---

A server can receive harmful requests or more requests than it can handle. Distinguish inspecting requests from controlling their rate.

## Three counters with small numbers

A **rate limit** decides how many requests to accept over time. For two per ten seconds:

| Method | Rule | Effect |
|---|---|---|
| Fixed window | Reset a counter every ten seconds | Two at one window’s end plus two at the next start can cluster |
| Sliding window | Consider the preceding ten seconds | Avoids that boundary jump; implementation methods vary |
| Token bucket | Capacity2, replenish one token every five seconds up to capacity | Two immediate requests when full; each consumes a token |

In the [lab](/en/programming-basics/32-local-network-lab/), request `/limited` on8766 three times quickly:200,200,429. `Retry-After` suggests a wait. This is one shared teaching window, not a fair per-user policy. Content inspection is a different concern.

## A WAF does not replace application security

A **WAF (Web Application Firewall, a system applying security rules to web requests)** applies managed or custom rules to request patterns. It can block, challenge, or log known attacks, but it does not know every domain rule. A well-formed invoice update may still be unauthorized. Applications must validate input, authenticate, authorize resources, and use safe database APIs.

Test broad rules in monitor mode when possible. False positives can block real customers. Give each exception a reason, owner, and expiry.

## Rate limiting and bursts

Limits may use IP (Internet Protocol, the addressing and routing protocol; an IP address identifies a network interface in context), user, API (Application Programming Interface, a defined contract for requesting data or actions from another component) key, tenant, or route. Fixed window, sliding window, and token bucket have different burst behavior. Return `429 Too Many Requests` and a truthful `Retry-After` when available.

Rate limits control arrival rate, concurrency limits protect worker capacity, and quotas cap total use over a period. Under overload, apply backpressure or load shedding rather than accepting work that cannot complete.
