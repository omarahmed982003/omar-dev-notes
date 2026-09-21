---
title: 11. Same-Origin Policy وCORS
description: تعريف Origin وقيود المتصفح وSimple Requests وPreflight والـCredentials والإعداد الآمن.
sidebar:
  order: 11
---

## ما Origin؟

الـorigin يتكوّن من **scheme + host + port**:

```text
https://app.example:443
```

ويختلف عن `http://app.example` أو `https://api.example` أو `https://app.example:8443`.

Same-Origin Policy تمنع JavaScript من قراءة كثير من موارد origin أخرى بلا سماح. لا تمنع إرسال كل الطلبات، ولا تحمي server-to-server clients.

## CORS

```http
Access-Control-Allow-Origin: https://app.example
Access-Control-Allow-Credentials: true
Vary: Origin
```

لا يمكن جمع credentials مع wildcard `*`. طابق origin مع allow-list صريحة، ولا تعكس أي قيمة مرسلة بلا تحقق.

## Preflight

```http
OPTIONS /api/orders HTTP/1.1
Origin: https://app.example
Access-Control-Request-Method: POST
Access-Control-Request-Headers: Content-Type, Authorization
```

يرد الخادم بالـmethods والـheaders المسموحة ومدة حفظ القرار. تعامل مع `OPTIONS` قبل auth middleware التي تتطلب credential غير موجودة في preflight.

## مثال PHP مبسط

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
CORS ليست Authentication أو Authorization وليست بديلًا عن CSRF protection. عميل غير متصفح يستطيع تجاهلها، والخادم يجب أن يتحقق من كل طلب.
:::

