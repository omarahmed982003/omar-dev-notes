---
title: 15. من HTTP Request إلى Router وResponse
description: Front Controller وقراءة JSON وRouting وMiddleware وبناء استجابة HTTP صحيحة دون Framework.
sidebar:
  order: 15
---

## Front Controller

اجعل خادم الويب يمرر الطلبات الديناميكية إلى `public/index.php`:

```php
<?php
declare(strict_types=1);

require dirname(__DIR__) . '/vendor/autoload.php';

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
$path = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH) ?: '/';
```

لا تجعل document root هو جذر المشروع؛ يجب ألا يصل العميل إلى `vendor/` أو `.env` أو source files.

## قراءة body

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

ضع حدًا لحجم body في Web Server والتطبيق. Parsing لا يغني عن validation.

## Router مبسط

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

Router حقيقية تحتاج parameters وmethod mismatch وURL decoding. الهدف فهم المسؤوليات قبل framework.

## Response

```php
function respond(array $body, int $status = 200): never
{
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    header('Cache-Control: no-store');
    echo json_encode($body, JSON_UNESCAPED_UNICODE | JSON_THROW_ON_ERROR);
    exit;
}
```

يجب إرسال headers قبل body. لا تخلط `echo` عشوائية مع response object.

## Middleware pipeline

```text
request ID -> trusted proxy -> body limit -> routing
-> authentication -> authorization -> validation
-> handler -> error mapping -> response
```

كل middleware يجب أن تكون مسؤوليتها محددة. Logging وCORS ومعالجة الأخطاء قد تحتاج تغليف المسار كله.

