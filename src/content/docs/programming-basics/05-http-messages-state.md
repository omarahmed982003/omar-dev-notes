---
title: "اقرأ طلب HTTP وردّه"
description: "اقرأ طلب HTTP وردّه"
sidebar:
  order: 9
prev: {"link":"/programming-basics/udp/","label":"UDP: رسائل مستقلة من غير اتصال TCP"}
next: {"link":"/programming-basics/22-http-state-and-updates/","label":"تذكّر المستخدم وحماية التعديلات"}
---

<span class="foundations-reading-scope" aria-hidden="true"></span>

## قبل التفاصيل

قبل تفاصيل جلسة المستخدم ورمز دخوله، افصل بين **رسالة HTTP (Hypertext Transfer Protocol؛ قواعد طلب الموارد والرد عليها في الويب) واحدة** وبين حالة المستخدم عبر عدة رسائل. الطلب يحمل نية العميل، والاستجابة تحمل نتيجة server.

## الطلب: العميل بيطلب إيه؟

في HTTP/1.1 النصي يتكون الطلب من **Start line — سطر البداية**، ثم **Headers — حقول تصف الرسالة**، ثم سطر فارغ، ثم **Body — جسم الرسالة** لو فيه محتوى. ده مثال مكتوب للفهم، مش أمر تلصقه في الطرفية:

```http
POST /api/orders?notify=1 HTTP/1.1
Host: shop.example
Accept: application/json
Content-Type: application/json
Authorization: Bearer ey...
Cookie: session=abc123
Content-Length: 27

{"product_id":42,"count":2}
```

- **Method — طريقة الطلب:** العملية المطلوبة؛ POST هنا يرسل طلب معالجة أو إنشاء.
- **Target — هدف الطلب:** المسار `/api/orders` مع معاملات البحث `notify=1`، ومعناها هنا طلب إشعار وفق تصميم التطبيق.
- **Version — الإصدار:** HTTP/1.1 يحدد نسخة طريقة الحوار.
- **Headers — حقول الرسالة:** معلومات تصف المحتوى وطريقة التعامل معه؛ تسمى أحيانًا Metadata، أي بيانات عن البيانات.
- **Body — الجسم:** بيانات الطلب نفسها؛ هنا رقم المنتج 42 والكمية 2.

HTTP/2 وHTTP/3 يمثلان الرسائل بصيغة ثنائية بدل الأسطر النصية نفسها؛ التمثيل الثنائي غير التشفير الأمني، لكن معاني العملية وحقول الرسالة ومحتواها تظل نفسها.

قبل الجدول: **Safe — قراءة لا يقصد بها تغيير حالة المورد**، زي جلب صفحة؛ تسجيل الزيارة في السجل لا يناقض المعنى. **Idempotent — تكرار نفس الطلب له نفس الأثر المقصود على المورد**: حذف مورد ثم إعادة حذفه لا يحذفه مرتين، لكن رمز الرد قد يختلف. الطلب ممكن يكون idempotent ويغيّر الحالة، زي PUT.

والـ**Representation — تمثيل المورد** نسخة بيانات تصفه، مثل معلومات منتج بصيغة JSON (JavaScript Object Notation؛ صيغة نصية لترتيب البيانات في أسماء وقيم وقوائم).

**JSON، JavaScript (لغة برمجة تستخدم مثلًا لتنفيذ تفاعل الصفحة داخل browser) Object Notation** صيغة نصية لبيانات منظمة؛ `{"count":2}` يربط الاسم count بالقيمة 2.

جسم المثال أعلاه 27 بايتًا بترميز UTF-8 (Unicode Transformation Format بوحدات 8 بت؛ ترميز أرقام رموز Unicode كبايتات)، من غير سطر جديد في نهايته. **Content-Length** يعد البايتات لا عدد الحروف؛ تغيير الجسم يحتاج إعادة حسابه. `Bearer ey...` قيمة توضيحية مختصرة وليست رمز دخول صالحًا.

<figure class="concept-visual" aria-labelledby="http-message-visual-ar">
<div class="visual-heading" id="http-message-visual-ar">شوف حدود أجزاء نفس Request</div>
<div class="message-part" data-part="start"><div dir="ltr"><code>POST /api/orders?notify=1 HTTP/1.1</code></div><small><strong>Start line</strong><br>العملية، وبعدها الهدف، وبعدها الإصدار.</small></div>
<div class="message-part" data-part="headers"><div dir="ltr"><code>Host: shop.example</code><code>Accept: application/json</code><code>Content-Type: application/json</code><code>Authorization: Bearer ey...</code><code>Cookie: session=abc123</code><code>Content-Length: 27</code></div><small><strong>Headers</strong><br>وصف الرسالة وطريقة التعامل معاها. قيمة 27 بتعد بايتات Body فقط.</small></div>
<div class="message-separator">سطر فارغ: هنا Headers خلصت، وBody بتبدأ بعده</div>
<div class="message-part" data-part="body"><div dir="ltr"><code>{"product_id":42,"count":2}</code></div><small><strong>Body</strong><br>البيانات نفسها: المنتج 42 والكمية 2.</small></div>
<figcaption>اقرا الرسالة من فوق لتحت: نية الطلب، ثم وصفه، ثم بياناته. الفصل بالسطر الفارغ هنا يخص شكل HTTP/1.1 النصي؛ ألوان الأجزاء للتوضيح ومش جزء من الرسالة اللي بتتنقل.</figcaption>
</figure>

## Methods

| Method | الدلالة المعتادة | Safe؟ | Idempotent؟ |
|---|---|---:|---:|
| `GET` | جلب تمثيل المورد، مثل بيانات منتج | نعم | نعم |
| `HEAD` | مثل GET لكن من غير جسم الرد | نعم | نعم |
| `POST` | معالجة خاصة بالمورد/إنشاء شائعًا | لا | لا غالبًا |
| `PUT` | استبدال الحالة الكاملة | لا | نعم |
| `PATCH` | تعديل جزئي | لا | يعتمد على التصميم |
| `DELETE` | إزالة المورد | لا | نعم دلاليًا |
| `OPTIONS` | إمكانات الاتصال | نعم | نعم |

Safe وIdempotent دلالات يجب أن يحترمها التطبيق، وليستا آلية صلاحيات. لا يجوز تنفيذ حذف حقيقي عبر GET، وعلى server التحقق من الهوية والصلاحية في كل Method.

## Headers شائعة

- `Host`: اسم الموقع المطلوب. **Virtual hosts — مواقع افتراضية** أسماء مواقع مختلفة يخدمها نفس server، فيستخدم الاسم لاختيار الموقع.
- `Accept`: أنواع الاستجابة المقبولة.
- `Content-Type`: نوع جسم الرسالة المرسل.
- `Authorization`: بيانات اعتماد. **Bearer token** رمز يكفي تقديمه كما هو لاستخدام الإذن المرتبط به، لذلك نحافظ على سريته.
- `Cookie`: قيم صغيرة سبق أن حفظها browser ويحق إرسالها إلى هذا العنوان.
- `User-Agent`: معلومات العميل.
- `Cache-Control`: سياسة **Cache (نسخة محفوظة لتقليل تكرار القراءة أو الحساب) — التخزين المؤقت**: هل يمكن حفظ نسخة من الرد وإعادة استخدامها ومتى؟

## الرد: server رجّع إيه؟

```http
HTTP/1.1 201 Created
Content-Type: application/json; charset=utf-8
Location: /api/orders/901
Cache-Control: no-store

{"id":901,"status":"pending"}
```

سطر البداية يذكر الإصدار ورمز الحالة **Status code (رقم يصف نتيجة معالجة طلب HTTP)**، مثل 201 بمعنى إنشاء مورد. عبارة `Created` وصف مقروء، لا نعتمد عليها بدل الرقم. بعدها حقول الرسالة وجسم اختياري. `Location` عنوان المورد الجديد، و`no-store` تطلب عدم تخزين الرد في مخزن HTTP مؤقت.

| الفئة | المعنى | أمثلة |
|---|---|---|
| `1xx` | معلومات مؤقتة | `100 Continue` |
| `2xx` | نجاح | `200 OK`, `201 Created`, `204 No Content` |
| `3xx` | إعادة توجيه أو إعادة تحقق من نسخة مخزنة | `301`, `302`, `304` |
| `4xx` | مشكلة في الطلب | `400`, `401`, `403`, `404`, `422` |
| `5xx` | فشل جهة server | `500`, `502`, `503` |

`401` يعني غالبًا أن المصادقة مطلوبة أو غير صالحة، و`403` أن الطلب مفهوم لكن غير مسموح. لا تستخدم `200` لكل شيء؛ الحالة جزء من عقد الـAPI (Application Programming Interface؛ اتفاق يسمح لبرنامج بطلب بيانات أو عملية من مكوّن آخر).

:::note[تعمق أكثر: Safe وIdempotent وCacheable مش مترادفات]
**Safe method** يعني أن العميل لا يطلب تغيير حالة business؛ `GET` و`HEAD` للقراءة. ده لا يمنع Logging أوMetrics، لكنه يمنع تصميم `GET /delete-order/7`. **Idempotent method** يعني تكرار الطلب له نفس الأثر المقصود مرة واحدة؛ `PUT` و`DELETE` قد يرجعا ردًا مختلفًا في المحاولة الثانية لكن الحالة النهائية نفسها. **Cacheable** قرار منفصل تحكمه مواصفات HTTP والـheaders والسياسة.

الـ`POST` مش Idempotent تلقائيًا، لكن تقدر تجعل عملية بعينها آمنة لإعادة المحاولة بـ`Idempotency-Key` مربوط بالمستخدم والمدخلات والنتيجة. ما تعتبرش انقطاع الاتصال دليلًا إن server لم ينفذ: ممكن الدفع اتسجل والرد ضاع. لذلك Retry policy تعتمد على Semantics العملية، مش على Method وحدها.

اقرأ أخطاء الوسطاء بدقة: `502` يعني إن Gateway لم يحصل على رد Upstream صالح، و`503` يعني إن الخدمة غير متاحة أومافيش Capacity الآن، و`504` يعني إن Gateway انتظر Upstream لحد انتهاء المهلة. الرمز يحدد أين تبدأ التحقيق، لكنه لا يثبت Root cause من غير Logs وTrace.
:::

## مسائل عملية

<details><summary>ما الفرق بين <code>401</code> و<code>403</code>؟</summary><p>401 يعني أن الطلب يحتاج بيانات اعتماد صالحة، و 403 يعني أن الخادم رفض الإذن؛ قد يكون الرفض بسبب الهوية أو قاعدة أخرى، فلا يثبت وحده أن المستخدم سجل الدخول.</p></details>

<details><summary>كيف يكون HTTP stateless مع وجود تسجيل دخول؟</summary><p>كل طلب مستقل عند البروتوكول، لكن cookie أو token يحمل معرّفًا يسمح للتطبيق باسترجاع الحالة من مخزن بيانات الجلسات.</p></details>

<details><summary>هل يناسب GET عملية تحوّل رصيدًا؟</summary><p>لا. GET يفترض القراءة الآمنة وقد تعيد المتصفحات أو برامج فهرسة المواقع تشغيله. استخدم method تغيّر الحالة مع حماية وإعادة آمنة.</p></details>

## الخطوة التالية

[تذكّر المستخدم وحماية التعديلات](/programming-basics/22-http-state-and-updates/).
