---
title: 4. URLs, ports, and HTTP
description: URL anatomy, ports, sockets, ranges, and the role of HTTP.
sidebar:
  order: 4
---

HTTP is an application protocol defining request/response semantics for resources. It is not the network connection itself; it runs over transports such as TCP or QUIC. HTTP is stateless by default, so applications add cookies, sessions, or tokens for continuity.

```text
https://example.com:443/products/42?currency=EGP#reviews
scheme  host        port path         query        fragment
```

The fragment is normally browser-local and is not sent in the HTTP request. Never place passwords, tokens, or other secrets in URLs because history, logs, analytics, and referrers may expose them.

A port is a 16-bit number from 0 to 65535 identifying a service in the operating system. Common values include FTP 21, SSH 22, SMTP 25, DNS 53, HTTP 80, HTTPS 443, MySQL 3306, and PostgreSQL 5432. A conventional port is configuration, not security.

A socket endpoint can be simplified as protocol + IP + port. A TCP connection is distinguished by client IP/port and server IP/port, allowing many clients to share server port 443.

```bash
php -S localhost:8000
```

In `http://localhost:8000/hello.php`, the scheme is HTTP, host is localhost, port is 8000, and path is `/hello.php`. Omitting a port means the scheme’s default, not “no port”.

## Lesson map

<div class="lesson-diagram" role="img" aria-label="Concept map: URLs, ports, and HTTP">
<p class="lesson-diagram-title">Concept map: URLs, ports, and HTTP</p>
<div class="diagram-flow">
<div class="diagram-node input"><span>HTTP is an application protocol defining request/response semantics</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>The fragment is normally browser-local and is not</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>A port is a 16-bit number from 0</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node decision"><span>A socket endpoint can be simplified as protocol</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node output"><span>In http://localhost:8000/hello.php, the scheme is HTTP, host is</span></div>
</div>
</div>

## Check your understanding

<div class="lesson-quiz" role="list">
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">01</span><p>Explain “HTTP is an application protocol defining request/response semantics” as if reviewing a real implementation. What is its goal and most important constraint?</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> HTTP is an application protocol defining request/response semantics for resources. It is not the network connection itself; it runs over transports such as TCP or QUIC. HTTP is stateless by default, so applications add cookies, sessions, or tokens for continuity. In practice, a successful happy path is insufficient: document assumptions and validate the values and states that can break this behavior.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">02</span><p>Compare “HTTP is an application protocol defining request/response semantics” with “The fragment is normally browser-local and is not”. Why does neither replace the other in “URLs, ports, and HTTP”?</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> For “HTTP is an application protocol defining request/response semantics”: HTTP is an application protocol defining request/response semantics for resources. It is not the network connection itself; it runs over transports such as TCP or QUIC. HTTP is stateless by default, so applications add cookies, sessions, or tokens for continuity. For “The fragment is normally browser-local and is not”: The fragment is normally browser-local and is not sent in the HTTP request. Never place passwords, tokens, or other secrets in URLs because history, logs, analytics, and referrers may expose them. The first covers one part of the design while the second completes the behavior or constraints required for a correct implementation.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">03</span><p>Assume a system ignores “A port is a 16-bit number from 0”. What failure or risk should you expect, and how would a test expose it?</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> A port is a 16-bit number from 0 to 65535 identifying a service in the operating system. Common values include FTP 21, SSH 22, SMTP 25, DNS 53, HTTP 80, HTTPS 443, MySQL 3306, and PostgreSQL 5432. A conventional port is configuration, not security. Test a valid path, an exact boundary, and invalid input, then inspect output, side effects, and logs rather than treating the absence of an exception as success.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">04</span><p>Turn “A socket endpoint can be simplified as protocol” into a reviewable engineering decision. What should be documented and tested?</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> A socket endpoint can be simplified as protocol + IP + port. A TCP connection is distinguished by client IP/port and server IP/port, allowing many clients to share server port 443. Record the rationale, alternatives, and limits; test normal behavior, minimum and maximum boundaries, partial failure, and retry or repetition when applicable.</div></details>
</section>
</div>
