---
title: 15. From HTTP request to router and response
description: Front controllers, JSON bodies, routing, middleware, and correct HTTP responses without a framework.
sidebar:
  order: 15
---

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

