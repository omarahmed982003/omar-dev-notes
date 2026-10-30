---
title: "Read an HTTP request and response"
description: "Read an HTTP request and response"
sidebar:
  order: 9
prev: {"link":"/en/programming-basics/udp/","label":"UDP: independent messages without a TCP connection"}
next: {"link":"/en/programming-basics/22-http-state-and-updates/","label":"Remembering users and protecting updates"}
---

<span class="foundations-reading-scope" aria-hidden="true"></span>

## Read one message before tracing a session

HTTP (Hypertext Transfer Protocol, the rules for web requests and responses) exchanges discrete request and response messages. A request method expresses intent, headers carry metadata, and an optional body carries a representation. The response status describes the protocol result; it should not be guessed from body text.

HTTP being stateless means the protocol does not automatically remember an earlier request. Applications build continuity with cookies, server-side sessions, or tokens. That state needs independent expiry, integrity, privacy, and authorization rules.

## Before the details

Before sessions or tokens, separate **one HTTP message** from user state across messages. A request carries client intent; a response carries the server result.

An HTTP/1.1 request contains a request line, header fields, a blank line, and optional content:

```http
POST /api/orders?notify=1 HTTP/1.1
Host: shop.example
Accept: application/json
Content-Type: application/json
Authorization: Bearer ey...
Cookie: session=abc123
Content-Length: 27

{"product_id":42,"count":2}
```

The example body is **27 UTF-8 (Unicode Transformation Format with 8-bit units, encoding Unicode character numbers as bytes) bytes**, with no trailing newline. Content-Length counts bytes, not visible characters. Bearer ey... is a placeholder credential, not a usable token.

**JSON, JavaScript Object Notation**, is structured text mapping names such as count to values such as 2.

<figure class="concept-visual" aria-labelledby="http-message-visual-en">
<div class="visual-heading" id="http-message-visual-en">See the boundaries in the same request</div>
<div class="message-part" data-part="start"><div dir="ltr"><code>POST /api/orders?notify=1 HTTP/1.1</code></div><small><strong>Request line</strong><br>The method, target, and protocol version.</small></div>
<div class="message-part" data-part="headers"><div dir="ltr"><code>Host: shop.example</code><code>Accept: application/json</code><code>Content-Type: application/json</code><code>Authorization: Bearer ey...</code><code>Cookie: session=abc123</code><code>Content-Length: 27</code></div><small><strong>Header fields</strong><br>Metadata describing the message and how to handle it. The value 27 counts only body bytes.</small></div>
<div class="message-separator">Blank line: headers end here; content starts after it</div>
<div class="message-part" data-part="body"><div dir="ltr"><code>{"product_id":42,"count":2}</code></div><small><strong>Body</strong><br>The data: product 42 and a count of 2.</small></div>
<figcaption>Read from top to bottom: intent, metadata, then content. The blank-line boundary belongs to textual HTTP/1.1 framing; these colors are annotations, not transmitted message data. HTTP/2 and HTTP/3 carry these concepts in binary framing instead.</figcaption>
</figure>

A **safe** method requests no change to resource state; incidental logging is allowed. An **idempotent** method has the same intended state effect when repeated, although response codes may differ. DELETE can be idempotent without being safe. A **representation** is returned data describing a resource.

GET retrieves, HEAD is GET without response content, POST performs resource-specific processing, PUT replaces, PATCH partially updates, DELETE removes, and OPTIONS describes communication options. Safe/idempotent semantics are contracts, not authorization. Never implement destructive work through GET.

```http
HTTP/1.1 201 Created
Content-Type: application/json
Location: /api/orders/901

{"id":901,"status":"pending"}
```

Response classes are 1xx informational, 2xx success, 3xx redirection/cache, 4xx request/client error, and 5xx server error. 401 generally indicates missing/invalid authentication; 403 indicates understood but unauthorized.

:::note[Deep dive: safe, idempotent, and cacheable are different properties]
A **safe method** does not ask for a business-state change; `GET` and `HEAD` are reads. Logging and metrics may still change, but an endpoint such as `GET /delete-order/7` violates the contract. An **idempotent method** has the same intended effect when repeated; a second `PUT` or `DELETE` may return a different response while leaving the same final state. **Cacheable** is a separate property controlled by HTTP rules, headers, and policy.

`POST` is not automatically idempotent, but a specific operation can be made safe to retry with an `Idempotency-Key` bound to user, input, and stored result. A lost connection does not prove that the server did nothing: payment may have committed while the response was lost. Retry policy follows operation semantics, not only the method name.

Read gateway failures precisely: `502` means the gateway did not obtain a valid upstream response, `503` means the service is unavailable or lacks capacity, and `504` means an upstream deadline expired. The code suggests where to begin, but logs and a trace are still required to establish root cause.
:::

## Practical problems

<details><summary>How do <code>401</code> and <code>403</code> differ?</summary><p>401 means valid authentication is required; 403 means permission was refused; it does not prove the identity was known.</p></details>

<details><summary>How can HTTP be stateless while login persists?</summary><p>Each protocol request is independent, but a cookie or token supplies an identifier that lets the application recover state.</p></details>

<details><summary>Should GET transfer account credit?</summary><p>No. GET is expected to be safe and may be repeated by browsers or crawlers. Use a state-changing method with protection and safe retry design.</p></details>

## Next step

[Remembering users and protecting updates](/en/programming-basics/22-http-state-and-updates/).
