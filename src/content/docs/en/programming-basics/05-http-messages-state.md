---
title: 5. HTTP messages and state
description: Methods, fields, content, status codes, cookies, sessions, and tokens.
sidebar:
  order: 5
---

An HTTP/1.1 request contains a request line, header fields, a blank line, and optional content:

```http
POST /api/orders?notify=1 HTTP/1.1
Host: shop.example
Accept: application/json
Content-Type: application/json
Authorization: Bearer ey...

{"product_id":42,"count":2}
```

GET retrieves, HEAD is GET without response content, POST performs resource-specific processing, PUT replaces, PATCH partially updates, DELETE removes, and OPTIONS describes communication options. Safe/idempotent semantics are contracts, not authorization. Never implement destructive work through GET.

```http
HTTP/1.1 201 Created
Content-Type: application/json
Location: /api/orders/901

{"id":901,"status":"pending"}
```

Response classes are 1xx informational, 2xx success, 3xx redirection/cache, 4xx request/client error, and 5xx server error. 401 generally indicates missing/invalid authentication; 403 indicates understood but unauthorized.

HTTP does not automatically remember an earlier request. Cookies are browser-stored values sent by matching rules; sessions are server-side state commonly linked by a cookie ID; tokens are client-sent credentials. Not every token is a JWT, and JWT does not automatically replace session design.

```php
<?php
header('Content-Type: application/json; charset=utf-8');

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'GET') {
    http_response_code(405);
    header('Allow: GET');
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

$name = trim((string) ($_GET['name'] ?? 'Guest'));
echo json_encode(['message' => "Hello {$name}"], JSON_THROW_ON_ERROR);
```
