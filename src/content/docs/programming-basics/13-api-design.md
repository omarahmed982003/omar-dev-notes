---
title: 13. تصميم APIs
description: REST وRPC وGraphQL وتصميم الموارد والحالات والأخطاء والصفحات والإصدارات والعقود.
sidebar:
  order: 13
---

## اختر الأسلوب حسب المشكلة

- **REST:** موارد وعقود HTTP؛ مناسب لمعظم CRUD والـpublic APIs.
- **RPC:** عمليات صريحة مثل `calculateShipping`؛ مناسب عندما يكون الفعل أهم من المورد.
- **GraphQL:** العميل يحدد الحقول عبر schema؛ قوي للواجهات المتنوعة لكنه يحتاج حدود complexity وauthorization لكل resolver.

الاسم لا يضمن الجودة. العقد الواضح، التوافق، الأمان والمراقبة أهم من الشعار.

## موارد وHTTP

```text
GET    /api/orders/42
POST   /api/orders
PATCH  /api/orders/42
DELETE /api/orders/42
```

- استخدم nouns متسقة.
- أعد `201` مع `Location` عند الإنشاء، و`204` عندما لا يوجد body.
- ميّز `400` parsing، `401` authentication، `403` permission، `404` absence، `409` conflict، و`422` validation وفق عقدك.
- لا تجعل كل نتيجة `200`.

## Validation وProblem Details

```json
{
  "type": "https://docs.example/errors/validation",
  "title": "Validation failed",
  "status": 422,
  "errors": {"email": ["Invalid format"]},
  "request_id": "req_01J..."
}
```

استخدم شكل خطأ ثابتًا، ولا تكشف stack trace أو SQL. معيار Problem Details يعرّف حقولًا قابلة للامتداد.

## Pagination وFiltering

```text
GET /api/orders?status=paid&limit=20&cursor=eyJpZCI6OTAwfQ
```

ضع حدًا أقصى للصفحة. Cursor pagination أفضل غالبًا للبيانات الكبيرة المتغيرة، بينما offset أبسط للتنقل المحدود.

## التوافق والإصدارات

- فضّل التغيير الإضافي backward-compatible.
- لا تغيّر معنى حقل قائم بصمت.
- أعلن deprecation وموعد الإزالة.
- اختبر consumers بعقود آلية.
- يمكن وضع الإصدار في path أو header؛ الاتساق أهم من الاختيار.

## العقد والتشغيل

وثّق OpenAPI أو schema قابلة للاختبار، وأضف authentication، rate limits، idempotency للعمليات الحساسة، request IDs، timeouts وobservability. صمّم الـAPI للفشل الجزئي وإعادة المحاولة لا للمسار السعيد فقط.

## مراجع

- [RFC 9110: HTTP Semantics](https://www.rfc-editor.org/rfc/rfc9110)
- [RFC 9457: Problem Details for HTTP APIs](https://www.rfc-editor.org/rfc/rfc9457)

