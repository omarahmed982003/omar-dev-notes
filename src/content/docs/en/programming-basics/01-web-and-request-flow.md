---
title: 1. The Web and request flow
description: Internet vs Web, client/server, and the complete request-response journey.
sidebar:
  order: 1
---

The **Internet** is the global network infrastructure. The **Web** is one service on top of it, using HTTP/HTTPS and URLs. Email, file transfer, calls, and games also use the Internet.

A client requests a service; a server receives and processes requests. These are roles, so both may run on one development machine.

When a browser opens a URL it checks local cache, resolves DNS, connects through the NIC/router/ISP, establishes TCP or QUIC and TLS, sends HTTP, and may pass through a CDN, WAF, or load balancer. A web server serves static content or forwards dynamic work to PHP-FPM. The application may use cache/database services and returns an HTTP response.

![A colored diagram of a browser request traveling through DNS and the network to PHP and back](/diagrams/request-flow-en.svg)

[Open the diagram full size](/diagrams/request-flow-en.svg)

```bash
curl -i "https://example.com/"
curl -v "https://example.com/" -o NUL
```

The second command exposes DNS, connection, and TLS details. Use `/dev/null` instead of `NUL` on Linux/macOS.

This is a comprehensive teaching route, not a mandatory fixed path: browser/CDN cache can answer early, and a small app may have no load balancer or database.

## Lesson map

<div class="lesson-diagram" role="img" aria-label="Concept map: The Web and request flow">
<p class="lesson-diagram-title">Concept map: The Web and request flow</p>
<div class="diagram-flow">
<div class="diagram-node input"><span>The Internet is the global network infrastructure</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>A client requests a service; a server receives</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>When a browser opens a URL it checks</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node decision"><span>The second command exposes DNS, connection, and TLS</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node output"><span>This is a comprehensive teaching route, not a</span></div>
</div>
</div>

## Check your understanding

<div class="lesson-quiz" role="list">
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">01</span><p>Explain “The Internet is the global network infrastructure” as if reviewing a real implementation. What is its goal and most important constraint?</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> The Internet is the global network infrastructure. The Web is one service on top of it, using HTTP/HTTPS and URLs. Email, file transfer, calls, and games also use the Internet. In practice, a successful happy path is insufficient: document assumptions and validate the values and states that can break this behavior.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">02</span><p>Compare “The Internet is the global network infrastructure” with “A client requests a service; a server receives”. Why does neither replace the other in “The Web and request flow”?</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> For “The Internet is the global network infrastructure”: The Internet is the global network infrastructure. The Web is one service on top of it, using HTTP/HTTPS and URLs. Email, file transfer, calls, and games also use the Internet. For “A client requests a service; a server receives”: A client requests a service; a server receives and processes requests. These are roles, so both may run on one development machine. The first covers one part of the design while the second completes the behavior or constraints required for a correct implementation.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">03</span><p>Assume a system ignores “When a browser opens a URL it checks”. What failure or risk should you expect, and how would a test expose it?</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> When a browser opens a URL it checks local cache, resolves DNS, connects through the NIC/router/ISP, establishes TCP or QUIC and TLS, sends HTTP, and may pass through a CDN, WAF, or load balancer. A web server serves static content or forwards dynamic work to PHP-FPM. The application may use cache/database services and returns an HTTP response. Test a valid path, an exact boundary, and invalid input, then inspect output, side effects, and logs rather than treating the absence of an exception as success.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">04</span><p>Turn “The second command exposes DNS, connection, and TLS” into a reviewable engineering decision. What should be documented and tested?</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> The second command exposes DNS, connection, and TLS details. Use /dev/null instead of NUL on Linux/macOS. Record the rationale, alternatives, and limits; test normal behavior, minimum and maximum boundaries, partial failure, and retry or repetition when applicable.</div></details>
</section>
</div>
