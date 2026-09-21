---
title: 7. Inside the server
description: Load balancers, web servers, virtual hosts, PHP-FPM, applications, and the response path.
sidebar:
  order: 7
---

```text
Network → Load Balancer → Web Server
                           ├─ Static file → Response
                           └─ PHP-FPM → App → Database/Cache/API → Response
```

A load balancer distributes traffic across healthy backends. Layer 4 works with transport connections; Layer 7 understands HTTP. It may terminate TLS, perform health checks, and add forwarding headers. Only trust forwarded client IP headers from configured trusted proxies.

Nginx or Apache selects a virtual host, serves static assets directly, reverse-proxies services, or forwards dynamic PHP through FastCGI. Nginx does not execute PHP inside its own process; PHP-FPM workers run the entry point and return headers/content.

The application routes the request, runs middleware, validates input/authentication/authorization, executes business logic, and may use a database, cache, queue, or external API.

```php
<?php
header('Content-Type: application/json; charset=utf-8');

try {
    echo json_encode(['id' => 42, 'name' => 'Keyboard'], JSON_THROW_ON_ERROR);
} catch (Throwable $e) {
    error_log($e);
    http_response_code(500);
    echo json_encode(['error' => 'Internal server error']);
}
```

Do not expose stack traces or secrets. On the return path, layers may add compression, security headers, and caching. A browser/CDN cache hit skips the app; a static asset can stop at Nginx; a dynamic request reaches PHP-FPM. A proxy commonly returns 502 for an invalid/unavailable upstream and 504 for an upstream timeout, while 500 generally comes from the processing server/application.

Use request IDs and timing to trace the whole path rather than measuring PHP alone.
