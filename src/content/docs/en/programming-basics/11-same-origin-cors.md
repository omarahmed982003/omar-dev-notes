---
title: "Controlling cross-origin data access"
description: Origins, browser boundaries, simple requests, preflight, credentials, and safe configuration.
sidebar:
  order: 25
prev: {"link":"/en/programming-basics/10-http-caching-compression/","label":"Web caching and compression"}
next: {"link":"/en/programming-basics/33-browser-isolation/","label":"Resource loading and window isolation"}
---


## Same response, blocked then readable

Start the [local lab](/en/programming-basics/32-local-network-lab/) on8765. An origin consists of scheme, host, and port;8766 differs.

1. Open Network and click CORS: blocked read. `/cors/no` can show200 while JavaScript reports Blocked: it lacks read permission.
2. Click CORS: allowed read. `/cors/yes` adds `Access-Control-Allow-Origin: http://127.0.0.1:8765`, so the page reads the same data.
3. Compare response headers, not status alone. Direct navigation to the URL is different from a script reading another origin.

**Explain:** this permission proves neither login nor product ownership. This simple GET differs from requests needing preflight, covered below. [CORS guide](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CORS).

## Before the details

The Same-Origin Policy stops a malicious page from reading another site’s data with the user’s browser privileges. CORS (Cross-Origin Resource Sharing, browser rules for permitted cross-origin response access) is a server-declared exception, not a firewall against every client.

## What is an origin?

An origin is **scheme + host + port**. `https://app.example` therefore differs from `http://app.example`, `https://api.example`, or a different port.

The same-origin policy stops JavaScript from reading many cross-origin resources without permission. It does not prevent every request and does not control server-to-server clients.

## CORS response fields

```http
Access-Control-Allow-Origin: https://app.example
Access-Control-Allow-Credentials: true
Vary: Origin
```

Credentials cannot be combined with a wildcard origin. Match a strict allow-list and never blindly reflect an arbitrary `Origin`.

**CORS, Cross-Origin Resource Sharing**, is a server-declared permission for browser scripts to read selected cross-origin responses. **Credentials** include browser-managed authentication data such as cookies. An **allow-list** explicitly enumerates accepted origins.

A so-called **simple request** meets the method, field, and content-type restrictions for sending without a preflight. Not every GET qualifies, and not every POST needs preflight. JSON (JavaScript Object Notation, a text format for structured values and lists) POST normally requires it; an eligible form submission may not. Response reading remains subject to CORS.

## Preflight

```http
OPTIONS /api/orders HTTP/1.1
Origin: https://app.example
Access-Control-Request-Method: POST
Access-Control-Request-Headers: Content-Type, Authorization
```

The server answers with allowed methods, fields, and an optional cache duration. Handle `OPTIONS` before middleware that requires credentials which preflight does not carry.

A **preflight** is the preliminary OPTIONS permission request. A 204 means success without response content. **Authentication** checks identity, **authorization** checks allowed actions, and **CSRF, Cross-Site Request Forgery**, tricks a browser into an unintended authenticated operation.

## Minimal PHP handling

This is a fragment inside a PHP (a programming language commonly used for server-side web processing) request handler, after its opening PHP tag and before output, not a complete login service. It illustrates CORS fields; the real request still needs authentication and authorization. See [PHP setup](/en/php/00-lab-setup/) for the runtime and local server.

```php
$allowed = ['https://app.example', 'https://admin.example'];
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';

if (in_array($origin, $allowed, true)) {
    header("Access-Control-Allow-Origin: {$origin}");
    header('Vary: Origin');
    header('Access-Control-Allow-Credentials: true');
}

if (($_SERVER['REQUEST_METHOD'] ?? '') === 'OPTIONS') {
    header('Access-Control-Allow-Methods: GET, POST');
    header('Access-Control-Allow-Headers: Content-Type, Authorization');
    http_response_code(204);
    exit;
}
```

:::danger
CORS is not authentication, authorization, or a replacement for CSRF protection. Non-browser clients can ignore it, so the server must validate every request.
:::

## Practical problems

<details><summary>Does CORS stop <code>curl</code> from sending a request?</summary><p>No. Browsers enforce CORS for JavaScript. The server still needs authentication and authorization.</p></details>

<details><summary>Why can credentials not use a wildcard origin?</summary><p>Cookie-bearing responses must allow a specific origin, not every site, together with <code>Access-Control-Allow-Credentials</code>.</p></details>

<details><summary>When does a browser send a preflight?</summary><p>Before a non-simple cross-origin request, using OPTIONS to ask whether the intended method and headers are allowed.</p></details>

## Inspect both responses

Preflight permissions have a cache distinct from ordinary response content caching. Check whether OPTIONS failed or whether it succeeded but the actual response omitted the correct fields. curl does not enforce browser JavaScript response-reading policy.



**no-cors** is not a way to bypass restrictions and read data. An **opaque response** hides its status and body from the page script.

**Worked check:** OPTIONS succeeds but the actual reply omits Access-Control-Allow-Origin. Fix the actual response fields, including appropriate error responses, using the allow-list. Disabling browser protection or adding no-cors does not produce a readable authorized response.
