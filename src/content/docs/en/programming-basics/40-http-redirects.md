---
title: "HTTP redirects: move a client without changing the operation"
description: "Understand Location, method behavior across 301/302/303/307/308, loops, chains, and open redirects."
sidebar:
  order: 39
prev: {"link":"/en/programming-basics/39-http-connections-timeouts/","label":"HTTP connections and timeout budgets"}
next: {"link":"/en/programming-basics/networking-next/","label":"Networking and the web"}
---

<span class="foundations-reading-scope" aria-hidden="true"></span>

A **redirect** is a 3xx response asking a client to use another URL supplied in `Location`.

| Status | Common behavior | Suitable use |
|---|---|---|
| `301 Moved Permanently` | Permanent; user agents historically may change POST to GET | Resource relocation with caching considered |
| `302 Found` | Temporary; browsers may change POST to GET | Traditional temporary navigation |
| `303 See Other` | Follow with GET | Post/Redirect/Get after a form |
| `307 Temporary Redirect` | Preserve method and body | Temporary relocation of the same operation |
| `308 Permanent Redirect` | Preserve method and body | Permanent relocation of the same operation |

```http
HTTP/1.1 303 See Other
Location: /orders/842
```

Post/Redirect/Get performs the POST once, then displays a result with GET so refreshing the result does not automatically repeat the POST. It does not replace payment or API idempotency.

Avoid redirect loops and long chains. An **open redirect** accepts an attacker-controlled destination and can lend a trusted domain to phishing. Prefer internal relative paths or a strict allowlist and parse URLs rather than checking a naive string prefix. Never place secrets in a `Location` query. Test permanent 301/308 behavior carefully because clients and caches may retain it.

Laravel can target a named route with `redirect()->route('orders.show', $order)`. Validate any user-supplied return location before using it.

:::note[Deep dive: a redirect can change a method or leak a decision]
Historically, some clients change `POST` to `GET` after `301` or `302`. `303` intentionally directs the client to make a `GET`, which fits Post/Redirect/Get after a successful form. `307` and `308` preserve method and body; the former is temporary and the latter permanent. For an API request with a body, use `307/308` only when repeating the same operation is intended, and often prefer serving both routes during deprecation.

Browsers can retain `301/308` for a long time, so test with `302/307` before making a permanent decision. Every redirect hop adds latency and may repeat DNS, connection, and TLS work. Many clients remove `Authorization` when a redirect crosses hosts; that is credential-leak protection, not a failure to work around.

For `/login?next=...`, never trust an arbitrary user URL. Accept a relative in-site path or a host from an allowlist after correct parsing, and reject evasions such as `//evil.example`. Do not rely on redirects for a CORS preflight; clients should call the canonical URL directly.
:::

