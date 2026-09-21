---
title: 5. HTTP Request وResponse والحالة
description: بنية رسائل HTTP وMethods وHeaders وBody وStatus Codes وCookies وSessions وTokens.
sidebar:
  order: 5
---

## Request

في HTTP/1.1 النصي يتكون الطلب من start line وheaders وسطر فارغ ثم body اختياري:

```http
POST /api/orders?notify=1 HTTP/1.1
Host: shop.example
Accept: application/json
Content-Type: application/json
Authorization: Bearer ey...
Cookie: session=abc123
Content-Length: 29

{"product_id":42,"count":2}
```

- **Method:** نية الطلب.
- **Target/Path + Query:** المورد والمعاملات.
- **Version:** نسخة بروتوكول الرسالة.
- **Headers:** metadata والتحكم.
- **Body:** المحتوى، وليس موجودًا في كل طلب.

HTTP/2 وHTTP/3 يشفّران الرسائل بصيغة ثنائية وليست الأسطر النصية نفسها، لكن المعاني تبقى methods/fields/content.

## Methods

| Method | الدلالة المعتادة | Safe؟ | Idempotent؟ |
|---|---|---:|---:|
| `GET` | جلب representation | نعم | نعم |
| `HEAD` | مثل GET دون response content | نعم | نعم |
| `POST` | معالجة خاصة بالمورد/إنشاء شائعًا | لا | لا غالبًا |
| `PUT` | استبدال الحالة الكاملة | لا | نعم |
| `PATCH` | تعديل جزئي | لا | يعتمد على التصميم |
| `DELETE` | إزالة المورد | لا | نعم دلاليًا |
| `OPTIONS` | إمكانات الاتصال | نعم | نعم |

Safe وIdempotent دلالات يجب أن يحترمها التطبيق، وليستا آلية صلاحيات. لا يجوز تنفيذ حذف حقيقي عبر GET، وعلى الخادم التحقق من الهوية والصلاحية في كل Method.

## Headers شائعة

- `Host`: اسم الموقع المطلوب، مهم مع Virtual Hosts.
- `Accept`: أنواع الاستجابة المقبولة.
- `Content-Type`: نوع body المرسل.
- `Authorization`: بيانات اعتماد، مثل Bearer token.
- `Cookie`: cookies المطابقة.
- `User-Agent`: معلومات العميل.
- `Cache-Control`: سياسة Cache.

## Response

```http
HTTP/1.1 201 Created
Content-Type: application/json; charset=utf-8
Location: /api/orders/901
Cache-Control: no-store

{"id":901,"status":"pending"}
```

تتكون من protocol version وstatus code وreason phrase اختياري في HTTP/1.1، ثم headers وbody اختياري.

| الفئة | المعنى | أمثلة |
|---|---|---|
| `1xx` | معلومات مؤقتة | `100 Continue` |
| `2xx` | نجاح | `200 OK`, `201 Created`, `204 No Content` |
| `3xx` | Redirect/Cache | `301`, `302`, `304` |
| `4xx` | مشكلة في الطلب | `400`, `401`, `403`, `404`, `422` |
| `5xx` | فشل جهة الخادم | `500`, `502`, `503` |

`401` يعني غالبًا أن المصادقة مطلوبة أو غير صالحة، و`403` أن الطلب مفهوم لكن غير مسموح. لا تستخدم `200` لكل شيء؛ الحالة جزء من عقد الـAPI.

## Stateless لا يعني بلا حالة في التطبيق

HTTP لا يتذكر تلقائيًا الطلب السابق. التطبيق يبني الاستمرارية بواسطة:

- **Cookie:** قيمة يخزنها المتصفح ويرسلها حسب domain/path/security rules.
- **Session:** بيانات server-side مرتبطة غالبًا بمعرّف في Cookie.
- **Token:** credential يرسله العميل، شائع في APIs. ليس كل token JWT، وJWT ليس Session بديلًا تلقائيًا.

## مثال PHP

```php
<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'GET') {
    http_response_code(405);
    header('Allow: GET');
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

$name = trim((string) ($_GET['name'] ?? 'زائر'));

echo json_encode(
    ['message' => "مرحبًا {$name}"],
    JSON_UNESCAPED_UNICODE | JSON_THROW_ON_ERROR
);
```

جرّب `curl -i "http://localhost:8000/hello.php?name=Omar"`، ثم افحص الطلب من Network في DevTools.
