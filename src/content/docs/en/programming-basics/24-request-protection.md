---
title: "Protecting requests and limiting their rate"
description: "Protecting requests and limiting their rate"
sidebar:
  order: 31
prev: {"link":"/en/programming-basics/17-proxies-cdn-waf-observability/","label":"Deliver content and understand the origin server"}
next: {"link":"/en/programming-basics/25-request-observation/","label":"Trace requests and interpret measurements"}
---

<span class="foundations-reading-scope" aria-hidden="true"></span>

A server can receive harmful requests or more requests than it can handle. Distinguish inspecting requests from controlling their rate.

## Three counters with small numbers

A **rate limit** decides how many requests to accept over time. For two per ten seconds:

| Method | Rule | Effect |
|---|---|---|
| Fixed window | Reset a counter every ten seconds | Two at one window’s end plus two at the next start can cluster |
| Sliding window | Consider the preceding ten seconds | Avoids that boundary jump; implementation methods vary |
| Token bucket | Capacity2, replenish one token every five seconds up to capacity | Two immediate requests when full; each consumes a token |

No-Node reading trace: start an empty counter with a limit of 2 within one ten-second window; three requests inside it produce 200,200,429, assuming no other traffic. For **optional execution**, use `/limited` on 8766 in the Node.js [lab](/en/programming-basics/32-local-network-lab/), starting a fresh counter/window. `Retry-After` suggests a wait. This is one shared teaching window, not a fair per-user policy. Content inspection is a different concern.

## A WAF does not replace application security

A **WAF, Web Application Firewall**, inspects request properties under rules. **Managed rules** are maintained detection rules supplied by a provider; custom rules express additional application policies. It may block a request, issue a **challenge**, an extra client check, or write a **log**, an event record.

A correctly formed invoice update can still belong to another user. The WAF does not own every business rule. Applications still need **validation**, checking input, identity checks, and authorization. **Parameterized queries** keep data values separate from database command text; their implementation belongs to the database track, not a magic WAF setting.

A **false positive** is a legitimate request incorrectly flagged as harmful. Test broad rules in monitor mode when possible to avoid blocking real customers. Give each exception a reason, owner, and expiry.

## Rate limiting and bursts

Limits may use IP (Internet Protocol, the addressing and routing protocol; an IP address identifies a network interface in context), user, API (Application Programming Interface, a defined contract for requesting data or actions from another component) key, a **tenant**, one customer organization sharing the service, or a **route**, a request-handling path.

Fixed window, sliding window, and token bucket have different burst behavior. Return `429 Too Many Requests` and a truthful `Retry-After` when available.

Rate limits control arrival rate, concurrency limits protect worker capacity, and **quotas** cap total use over a period. **Backpressure** slows producers when consumers cannot keep up; **load shedding** rejects work during overload. Apply these policies instead of accepting work that cannot complete.

A **fixed window** counts requests in set intervals; a **sliding window** tracks a moving interval. A **token bucket** replenishes permission tokens over time and permits bursts up to its capacity. Tenant-level limits separate the consumption of customer organizations.

**Backpressure** slows incoming production; **load shedding** rejects work the system cannot complete. IP-only limits can penalize unrelated users sharing NAT (Network Address Translation, rewriting IP addresses at a network boundary).

## Check this topic

<div class="lesson-quiz" role="list">
<section class="quiz-card" role="listitem"><div class="quiz-question-row"><span class="quiz-number">02</span><p>Why can a WAF not secure an invoice-update endpoint alone?</p></div><details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Answer:</strong> It can detect patterns but does not own invoice authorization and business rules.</div></details></section>
<section class="quiz-card" role="listitem"><div class="quiz-question-row"><span class="quiz-number">03</span><p>Differentiate rate limit, concurrency limit, and quota.</p></div><details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Answer:</strong> They cap arrival rate, simultaneous work, and total use over a period respectively.</div></details></section>
</div>
