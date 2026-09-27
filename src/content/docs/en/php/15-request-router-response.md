---
title: 15. From HTTP request to router and response
description: Front controllers, JSON bodies, routing, middleware, and correct HTTP responses without a framework.
sidebar:
  order: 15
---

## Before you start

Read this lesson in three passes: understand the problem, follow the example, then try the final check yourself. The terms below are explained before they are used in detail.

### New terms in this lesson

- **HTTP:** The rules used to exchange requests and responses on the web.
- **API:** A defined interface through which one program requests data or actions from another.
- **Proxy:** An intermediary that receives a request and forwards it according to rules.


## Assemble one complete request path

When a client sends `POST /api/orders`, PHP receives more than a “page”: method, path, headers, and a body must become a deliberate decision and response.

```text
HTTP Request → Front Controller → Router → Middleware
             → Validation/Authorization → Handler → HTTP Response
```

A **front controller**, commonly `public/index.php`, is one dynamic entry point. The web server routes application requests there; it boots the application and reads request data.

A **router** primarily matches method plus path and selects a handler. It should not contain every business rule. **Middleware** wraps shared concerns such as request IDs, authentication, body limits, and error mapping.

Keep boundaries explicit even in a small example: request bodies are untrusted, syntactically valid JSON can contain invalid fields, status codes are part of the contract, and stray output can corrupt the response.

## Front controller

Route dynamic requests to `public/index.php` and start from one entry point:

```php
<?php
declare(strict_types=1);

require dirname(__DIR__) . '/vendor/autoload.php';

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
$path = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH) ?: '/';
```

Keep the project root outside the document root so clients cannot fetch `vendor/`, `.env`, or source files.

## Read a JSON body

```php
$contentType = strtolower(trim(explode(';', $_SERVER['CONTENT_TYPE'] ?? '')[0]));

if ($contentType !== 'application/json') {
    respond(['error' => 'Unsupported media type'], 415);
}

try {
    $payload = json_decode(
        file_get_contents('php://input'),
        true,
        64,
        JSON_THROW_ON_ERROR,
    );
} catch (JsonException) {
    respond(['error' => 'Invalid JSON'], 400);
}
```

Enforce body size in both web server and application. Parsing is not validation.

## Minimal router

```php
$handler = match ([$method, $path]) {
    ['GET', '/health'] => static fn () => respond(['status' => 'ok']),
    ['POST', '/api/orders'] => $createOrder,
    default => null,
};

if ($handler === null) {
    respond(['error' => 'Not found'], 404);
}

$handler();
```

A production router also handles parameters, method mismatch, and decoding.

## Response and middleware

Send status and headers before the body. Keep output in one response abstraction.

```text
request ID -> trusted proxy -> body limit -> routing
-> authentication -> authorization -> validation
-> handler -> error mapping -> response
```

Each middleware should have one clear responsibility. Error mapping, logging, and CORS may need to wrap the whole pipeline.

## Progressive practice

<details><summary>1. Differentiate 400, 404, 405, and 415</summary><p>They represent malformed/invalid request, missing route/resource, disallowed method for a known route, and unsupported body media type.</p></details>

<details><summary>2. JSON parses but email is missing. What fails?</summary><p>Parsing succeeded; validation fails. Return the documented validation status and error shape without invoking domain work.</p></details>

<details><summary>3. Order middleware</summary><p>Limit the body before parsing, route before route policy, authenticate before authorize, and wrap the whole path in the error boundary.</p></details>

## Lesson-specific problems

<details><summary>What does a front controller do?</summary><p>It provides one entry point that builds a request, runs routing and middleware, then sends a response.</p></details>

<details><summary>When should an API return <code>400</code>?</summary><p>When request syntax or parsing fails; semantic validation may use 422 under a documented contract.</p></details>

## Run and verify

Use the [downloadable lab](/en/php/00-lab-setup/) for supplied scripts. Commands for Composer, FPM, Docker, or a real server run inside the corresponding configured project, not an empty folder.

Execute this checkpoint inside the lesson environment:

~~~bash
php http-client-lab.php
~~~

**Success criterion:** Known routes return consistent status, Content-Type, and body; a missing route returns 404 and an internal error 500 without a stack trace.

Record the exit code and observed evidence. If reality differs, explain the environmental or design assumption that failed instead of editing the expectation to match a defect.

## Connect the ideas

A router should distinguish 404 from 405 and enforce method semantics, content type, and body limits before parsing. A response object should be emitted once by a dedicated emitter that controls status, headers, and body. Add security headers and streaming without loading every body fully.

### Try it yourself

Test 404, 405, malformed JSON, and an oversized body.
