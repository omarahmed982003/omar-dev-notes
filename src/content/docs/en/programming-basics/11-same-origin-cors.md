---
title: 11. Same-origin policy and CORS
description: Origins, browser boundaries, simple requests, preflight, credentials, and safe configuration.
sidebar:
  order: 11
---

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

## Preflight

```http
OPTIONS /api/orders HTTP/1.1
Origin: https://app.example
Access-Control-Request-Method: POST
Access-Control-Request-Headers: Content-Type, Authorization
```

The server answers with allowed methods, fields, and an optional cache duration. Handle `OPTIONS` before middleware that requires credentials which preflight does not carry.

## Minimal PHP handling

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

