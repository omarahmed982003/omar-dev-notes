---
title: 12. تصميم APIs
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

## خريطة الدرس

<div class="lesson-diagram" role="img" aria-label="خريطة مفاهيم: تصميم APIs">
<p class="lesson-diagram-title">خريطة مفاهيم: تصميم APIs</p>
<div class="diagram-flow">
<div class="diagram-node input"><span>اختر الأسلوب حسب المشكلة</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>موارد وHTTP</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>Validation وProblem Details</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node decision"><span>Pagination وFiltering</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node output"><span>التوافق والإصدارات</span></div>
</div>
</div>

## تأكد من فهمك

<div class="lesson-quiz" role="list">
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">01</span><p>اشرح «اختر الأسلوب حسب المشكلة» كأنك تراجع تطبيقًا حقيقيًا: ما الهدف وما أهم قيد يجب الانتباه له؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> REST: موارد وعقود HTTP؛ مناسب لمعظم CRUD والـpublic APIs. RPC: عمليات صريحة مثل calculateShipping؛ مناسب عندما يكون الفعل أهم من المورد. GraphQL: العميل يحدد الحقول عبر schema؛ قوي للواجهات المتنوعة لكنه يحتاج حدود complexity وauthorization لكل resolver. الاسم لا يضمن الجودة. العقد الواضح، التوافق، الأمان والمراقبة أهم من الشعار. عمليًا، لا يكفي تنفيذ المسار الناجح؛ يجب توثيق الافتراضات والتحقق من القيم والحالات التي قد تكسر هذا السلوك.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">02</span><p>قارن بين «اختر الأسلوب حسب المشكلة» و«موارد وHTTP». لماذا لا يغني أحدهما عن الآخر داخل موضوع «تصميم APIs»؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> في «اختر الأسلوب حسب المشكلة»: REST: موارد وعقود HTTP؛ مناسب لمعظم CRUD والـpublic APIs. RPC: عمليات صريحة مثل calculateShipping؛ مناسب عندما يكون الفعل أهم من المورد. GraphQL: العميل يحدد الحقول عبر schema؛ قوي للواجهات المتنوعة لكنه يحتاج حدود complexity وauthorization لكل resolver. الاسم لا يضمن الجودة. العقد الواضح، التوافق، الأمان والمراقبة أهم من الشعار. أما «موارد وHTTP»: استخدم nouns متسقة. أعد 201 مع Location عند الإنشاء، و204 عندما لا يوجد body. ميّز 400 parsing، 401 authentication، 403 permission، 404 absence، 409 conflict، و422 validation وفق عقدك. لا تجعل كل نتيجة 200. العلاقة بينهما أن الأول يحدد جانبًا من الحل، والثاني يكمل السلوك أو القيود اللازمة لتطبيقه بصورة صحيحة.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">03</span><p>افترض أن نظامًا تجاهل «Validation وProblem Details». ما العطل أو الخطر المتوقع، وكيف تصمم اختبارًا يكشفه؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> استخدم شكل خطأ ثابتًا، ولا تكشف stack trace أو SQL. معيار Problem Details يعرّف حقولًا قابلة للامتداد. لاكتشاف الخلل، اختبر مسارًا صحيحًا، وقيمة عند الحد، ومدخلًا غير صالح، ثم راقب النتيجة والآثار الجانبية والسجل بدل الاكتفاء بعدم ظهور Exception.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">04</span><p>حوّل «Pagination وFiltering» إلى قرار هندسي قابل للمراجعة. ما الذي ستوثقه وما الحالات التي ستختبرها؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> ضع حدًا أقصى للصفحة. Cursor pagination أفضل غالبًا للبيانات الكبيرة المتغيرة، بينما offset أبسط للتنقل المحدود. وثّق سبب الاختيار والبدائل والحدود، واختبر الحالة العادية، والحد الأدنى والأقصى، والفشل الجزئي، وإعادة المحاولة أو التكرار إن كان السلوك يسمح بذلك.</div></details>
</section>
</div>
