---
title: 2. DNS and IP addresses
description: Name resolution through caches, recursive resolvers, root, TLD, and authoritative servers.
sidebar:
  order: 2
---

An IP address identifies a network interface for routing. Private and public addresses differ, and a home router commonly performs NAT. `127.0.0.1` and `::1` are loopback addresses; `localhost` normally resolves to them.

DNS is a distributed record system. Common records include `A` (IPv4), `AAAA` (IPv6), `CNAME` (alias), `MX` (mail), `TXT`, and `NS`.

Resolution usually checks browser and OS caches, then asks a recursive resolver. On a cache miss, that resolver follows referrals from root to TLD to an authoritative server and returns the answer with a TTL.

```text
Browser/OS Cache → Recursive Resolver
                    ↓ cache miss
                 Root → TLD → Authoritative
```

The browser does not normally query every level itself, and the full chain is not repeated while a cached answer is valid. DNS may return several IPs for balancing or locality; it locates a server but does not deliver HTML or execute PHP.

```bash
nslookup example.com
nslookup -type=AAAA example.com
nslookup -type=MX example.com
```

## Lesson map

<div class="lesson-diagram" role="img" aria-label="Concept map: DNS and IP addresses">
<p class="lesson-diagram-title">Concept map: DNS and IP addresses</p>
<div class="diagram-flow">
<div class="diagram-node input"><span>An IP address identifies a network interface for</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>DNS is a distributed record system</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>Resolution usually checks browser and OS caches, then</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node decision"><span>The browser does not normally query every level</span></div>
</div>
</div>

## Check your understanding

<div class="lesson-quiz" role="list">
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">01</span><p>Explain “An IP address identifies a network interface for” as if reviewing a real implementation. What is its goal and most important constraint?</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> An IP address identifies a network interface for routing. Private and public addresses differ, and a home router commonly performs NAT. 127.0.0.1 and ::1 are loopback addresses; localhost normally resolves to them. In practice, a successful happy path is insufficient: document assumptions and validate the values and states that can break this behavior.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">02</span><p>Compare “An IP address identifies a network interface for” with “DNS is a distributed record system”. Why does neither replace the other in “DNS and IP addresses”?</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> For “An IP address identifies a network interface for”: An IP address identifies a network interface for routing. Private and public addresses differ, and a home router commonly performs NAT. 127.0.0.1 and ::1 are loopback addresses; localhost normally resolves to them. For “DNS is a distributed record system”: DNS is a distributed record system. Common records include A (IPv4), AAAA (IPv6), CNAME (alias), MX (mail), TXT, and NS. The first covers one part of the design while the second completes the behavior or constraints required for a correct implementation.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">03</span><p>Assume a system ignores “Resolution usually checks browser and OS caches, then”. What failure or risk should you expect, and how would a test expose it?</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> Resolution usually checks browser and OS caches, then asks a recursive resolver. On a cache miss, that resolver follows referrals from root to TLD to an authoritative server and returns the answer with a TTL. Test a valid path, an exact boundary, and invalid input, then inspect output, side effects, and logs rather than treating the absence of an exception as success.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">04</span><p>Turn “The browser does not normally query every level” into a reviewable engineering decision. What should be documented and tested?</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> The browser does not normally query every level itself, and the full chain is not repeated while a cached answer is valid. DNS may return several IPs for balancing or locality; it locates a server but does not deliver HTML or execute PHP. Record the rationale, alternatives, and limits; test normal behavior, minimum and maximum boundaries, partial failure, and retry or repetition when applicable.</div></details>
</section>
</div>
