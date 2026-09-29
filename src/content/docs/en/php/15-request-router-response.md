---
title: 15. From HTTP request to router and response
description: Front controllers, JSON bodies, routing, middleware, and correct HTTP responses without a framework.
sidebar:
  order: 15
---

## The problem: a URL does not have to name a file

Instead of `save.php` and `list.php`, we want `GET /health` and `POST /notes` with one error/output policy. Separate responsibilities before adopting a framework:

| Term | Responsibility |
|---|---|
| Request | Client method, path, headers, and body |
| Front controller | One entry point, usually public/index.php |
| Middleware | Shared work around later steps, or early rejection |
| Router | Select a handler using method and path |
| Handler | Execute one use case and return a response |
| Response / emitter | Status/headers/body data; an emitter sends them once |

Requests enter in this order. Route-specific middleware may follow routing, but the example's general middleware wraps it:

~~~text
Request → Front Controller → Middleware → Router → Handler
                                         ↑          ↓
Response ← Emitter ← Middleware ←─────────┴── Response
~~~

## One complete file with explicit boundaries

Use PHP 8.1+ and mbstring. Create `public/index.php` below, or use `http-demo` in the [examples package](/downloads/php-course.zip). From http-demo run `php -S 127.0.0.1:8082 -t public public/index.php`. The final argument routes all requests through the front controller, not only existing files. This teaching API returns a note without persisting it; lesson 17 adds storage.

~~~php
<?php
declare(strict_types=1);

function response(array $data, int $status = 200, array $headers = []): array
{
    return [
        'status' => $status,
        'headers' => $headers + [
            'Content-Type' => 'application/json; charset=utf-8',
            'Cache-Control' => 'no-store',
            'X-Content-Type-Options' => 'nosniff',
        ],
        'body' => json_encode($data, JSON_THROW_ON_ERROR | JSON_UNESCAPED_UNICODE),
    ];
}
function createNote(array $request): array
{
    if ($request['type'] !== 'application/json') {
        return response(['error' => 'Unsupported media type'], 415);
    }
    try {
        $payload = json_decode($request['body'], false, 32, JSON_THROW_ON_ERROR);
    } catch (JsonException) {
        return response(['error' => 'Invalid JSON'], 400);
    }
    if (!$payload instanceof stdClass
        || !is_string($payload->text ?? null)
        || trim($payload->text) === ''
        || mb_strlen($payload->text, 'UTF-8') > 200) {
        return response(['error' => 'Use a text field with 1 to 200 code points'], 422);
    }
    return response(['text' => trim($payload->text)], 200);
}
function route(array $request): array
{
    $routes = [
        '/health' => ['GET' => static fn (array $r): array => response(['status' => 'ok'])],
        '/notes' => ['POST' => 'createNote'],
    ];
    $methods = $routes[$request['path']] ?? null;
    if ($methods === null) {
        return response(['error' => 'Not found'], 404);
    }
    $handler = $methods[$request['method']] ?? null;
    if ($handler === null) {
        return response(['error' => 'Method not allowed'], 405, ['Allow' => implode(', ', array_keys($methods))]);
    }
    return $handler($request);
}
function middleware(array $request, callable $next): array
{
    $id = bin2hex(random_bytes(8));
    try {
        if (strlen($request['body']) > 4096) {
            $reply = response(['error' => 'Body too large'], 413);
        } else {
            $reply = $next($request);
        }
    } catch (Throwable $error) {
        error_log(json_encode(['request_id' => $id, 'type' => get_class($error)], JSON_THROW_ON_ERROR));
        $reply = response(['error' => 'Internal error'], 500);
    }
    $reply['headers']['X-Request-ID'] = $id;
    return $reply;
}

$body = file_get_contents('php://input', false, null, 0, 4097);
if ($body === false) {
    $reply = response(['error' => 'Body unavailable'], 500);
} else {
    $path = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH);
    $request = [
        'method' => $_SERVER['REQUEST_METHOD'] ?? 'GET',
        'path' => is_string($path) ? $path : '',
        'type' => strtolower(trim(explode(';', $_SERVER['CONTENT_TYPE'] ?? '')[0])),
        'body' => $body,
    ];
    $reply = middleware($request, 'route');
}
http_response_code($reply['status']);
foreach ($reply['headers'] as $name => $value) {
    header("{$name}: {$value}");
}
echo $reply['body'];
~~~

## Read from the entry point, then trace one request

Function definitions do not execute their bodies. Execution starts at the body read near the bottom. Reading at most 4097 bytes detects exceeding 4096 without loading an unbounded body into application memory. The server also needs a body limit because PHP/server infrastructure may already have received or buffered it. `parse_url(..., PHP_URL_PATH)` excludes the query, so `/health?check=1` selects the same route.

We construct a request array and call middleware with `'route'` as a callback. Middleware creates an ID and checks size before parsing. If acceptable it invokes next; the router finds a path, then method, then calls a handler. The response returns outward; middleware adds a header, and the emitter sends status, headers, then body.

`response` builds data without echo or exit. Encoding occurs before headers are sent, so the general boundary can turn encoding failure into 500. Never mix var_dump with the response. The read-failure branch here has its own 500 outside middleware; put request construction inside a broader boundary if every failure needs an ID.

## Valid JSON does not imply a valid request

createNote asks three separate questions: is Content-Type supported, is the text valid JSON, and is its root an object containing a nonempty bounded text string? `[]`, `null`, and `42` are valid JSON but violate this contract. Decoding without true produces stdClass for an object, making it distinguishable from a list.

`trim` removes ordinary surrounding whitespace; it does not promise all Unicode whitespace handling. `mb_strlen` measures the agreed code points. This validation/echo example returns 200 because it creates no persistent resource; a real creation endpoint adds storage and returns 201 plus Location when the resource has an address.

Routes here are fixed literal paths. Do not repeatedly decode them or convert paths into include filenames. A production router also needs policies for parameters, URL decoding, HEAD/OPTIONS, and content negotiation; use a framework when appropriate. Trust X-Forwarded-* only from configured trusted proxies.

## Exercise the contract from a terminal

On Windows use `curl.exe` instead of PowerShell's alias. To avoid shell quoting differences, save `note.json` containing `{"text":"Learn routing"}` and `broken.json` containing only `{`, then run:

~~~bash
curl -i http://127.0.0.1:8082/health
curl -i -X POST -H "Content-Type: application/json" --data-binary @note.json http://127.0.0.1:8082/notes
curl -i -X POST -H "Content-Type: application/json" --data-binary @broken.json http://127.0.0.1:8082/notes
~~~

| Request | Result |
|---|---|
| GET /health | 200 and `{"status":"ok"}` |
| GET /missing | 404 |
| GET /notes | 405 and Allow: POST |
| POST /notes without JSON Content-Type | 415 |
| POST /notes with broken JSON | 400 |
| POST /notes with [] or empty/array text | 422 |
| Body exceeding 4096 bytes | 413 before parsing |
| Valid text | 200 and `{"text":"Learn routing"}` |

X-Request-ID is random; tests should check its presence/shape, not one fixed value. Assert Content-Type and status as well as body. Expose only public as document root, keeping storage and vendor inaccessible.

## Predict, debug, complete

<details><summary>Predict GET /notes versus GET /unknown</summary><p>The first is a known path with an unsupported method: 405 and Allow. The second is an unknown path: 404. Checking path before method creates that distinction.</p></details>

<details><summary>Debug: a router echoes before middleware adds a header</summary><p>Early output can send headers or corrupt JSON. Return response data from handlers and use one emitter after the chain returns.</p></details>

<details><summary>Complete a body-limit check before json_decode</summary><p>Read limit+1 bytes, compare length with the limit, and return 413. Add a server limit too; Content-Length alone does not establish actual body size for every transfer mode.</p></details>

<details><summary>Order authentication, authorization, and validation</summary><p>After route selection, establish identity and permission before protected effects, and validate input before business logic. Error handling wraps the chain; body limits precede parsing. Detailed ordering depends on each middleware's responsibility.</p></details>

The cumulative project moves these boundaries into files and adds forms, sessions, and storage. For additional HTTP practice see [lab setup](/en/php/00-lab-setup/).
