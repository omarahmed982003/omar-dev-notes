---
title: "السماح بقراءة البيانات بين المواقع"
description: تعريف Origin وقيود المتصفح وSimple Requests وPreflight والـCredentials والإعداد الآمن.
sidebar:
  order: 24
prev: {"link":"/programming-basics/10-http-caching-compression/","label":"التخزين المؤقت وضغط بيانات الويب"}
next: {"link":"/programming-basics/33-browser-isolation/","label":"سياسات تحميل الموارد وعزل النوافذ"}
---

<span class="foundations-reading-scope" aria-hidden="true"></span>

## نفس الرد: مرة ممنوع قراءته ومرة مسموح

**Origin — أصل** هو البروتوكول والمضيف والمنفذ؛ اختلاف 8765 عن 8766 يجعل الأصلين مختلفين. ابدأ بتتبع القراءة ده من غير Node.js:

| المدخل | رد server | ما يراه برنامج الصفحة؟ |
|---|---|---|
| صفحة 8765 تطلب بيانات 8766 | 200 بلا سماح CORS (قواعد يطبقها browser للسماح بقراءة response بين origins) | لا يقرأ الجسم |
| نفس الطلب مع سماح لأصل 8765 | 200 مع Access-Control-Allow-Origin المناسب | يقرأ البيانات |

دي مقارنة تعليمية، مش قياسًا من جهازك. التطبيق في [معمل Node.js](/programming-basics/32-local-network-lab/) اختياري؛ لو جهزته افتح صفحته على 8765 وجرّب الخطوات التالية. أو اكمل من التتبع المكتوب، ثم اقرأ مقطع PHP ومتطلباته تحت.

1. افتح Network واضغط CORS: blocked read. الطلب إلى `/cors/no` قد يظهر 200، لكن الصفحة تعرض Blocked لأن كودها لا يملك إذن قراءة الرد.
2. اضغط CORS: allowed read. `/cors/yes` يعيد نفس البيانات مع `Access-Control-Allow-Origin: http://127.0.0.1:8765`؛ فتستطيع الصفحة قراءتها.
3. قارن رؤوس الردين، وليس رمز 200 وحده. افتح الرد مباشرة في تبويب: ده تنقل، مختلف عن محاولة كود صفحة قراءة بيانات أصل آخر.

**حاول تفسر:** السماح هنا لا يثبت تسجيل الدخول ولا ملكية المنتج؛ هو إذن قراءة للمتصفح. المثال GET بسيط، أما الطلب الذي يحتاج Preflight فهنفهم طلبه المسبق تحت. [المصدر: دليل CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CORS).

## قبل التفاصيل

Same-Origin Policy (سياسة الأصل الواحد: قيود متصفح على قراءة بيانات مصدر مختلف) تحمي المستخدم من أن تقرأ صفحة خبيثة بيانات موقع آخر بصلاحيات متصفحه. CORS (Cross-Origin Resource Sharing؛ قواعد تسمح للمتصفح بقراءة رد مصدر مختلف عندما يوافق server) استثناء يعلنه server، وليس وسيلة لمنع الطلبات من كل الأدوات.

## ما Origin؟

الـorigin (أصل الصفحة: طريقة الوصول واسم المضيف والمنفذ معًا) يتكوّن من **scheme (طريقة الوصول في بداية العنوان، مثل https) + host + port**:

```text
https://app.example:443
```

ويختلف عن `http://app.example` أو `https://api.example` أو `https://app.example:8443`.

Same-Origin Policy تمنع JavaScript (لغة برمجة تستخدم مثلًا لتنفيذ تفاعل الصفحة داخل browser) من قراءة كثير من موارد origin أخرى بلا سماح. لا تمنع إرسال كل الطلبات، ولا تحمي server-to-server (تواصل مباشر بين برامج خادم، خارج سياسة قراءة صفحات browser) clients.

## CORS

```http
Access-Control-Allow-Origin: https://app.example
Access-Control-Allow-Credentials: true
Vary: Origin
```

لا يمكن جمع credentials (بيانات اعتماد مثل رمز دخول أو ملف تعريف ارتباط مناسب) مع wildcard (قيمة عامة مثل النجمة * التي تطابق أي أصل في هذا الحقل) `*`. طابق origin مع allow-list (قائمة سماح تحدد القيم المقبولة صراحة) صريحة، ولا تعكس أي قيمة مرسلة بلا تحقق.

**CORS، Cross-Origin Resource Sharing** سماح محدد يعلنه server لقراءة ردوده من صفحات ذات أصل آخر. **Credentials — بيانات إثبات هوية** تشمل مثلًا cookies التي يرسلها browser حسب إعداد الطلب والسياسات. **Allow-list — قائمة السماح** أسماء أصول تقبلها صراحة، مش أي قيمة جاء بها الطلب.

**Simple request — طلب مستوفٍ لشروط الإرسال دون فحص مسبق**: ليست كل GET بسيطة وليست كل POST تحتاج فحصًا.

توجد قيود على الطريقة والرؤوس ونوع المحتوى؛ POST بصيغة application/json (JavaScript Object Notation؛ صيغة نصية لترتيب البيانات في أسماء وقيم وقوائم) عادة يحتاج فحصًا، بينما إرسال نموذج بنوع مسموح قد لا يحتاجه. حتى عند إرسال الطلب دون فحص، قراءة الرد تظل خاضعة لـCORS.

## Preflight

```http
OPTIONS /api/orders HTTP/1.1
Origin: https://app.example
Access-Control-Request-Method: POST
Access-Control-Request-Headers: Content-Type, Authorization
```

يرد server بالـmethods (طريقة الطلب: نوع العملية المطلوبة مثل القراءة) والـheaders (حقل أو مقدمة معلومات تضاف للبيانات بحسب الطبقة) المسموحة ومدة حفظ القرار. تعامل مع `OPTIONS` قبل auth middleware (خطوة مشتركة في معالجة الطلب لفحص الهوية أو الصلاحيات) التي تتطلب credential غير موجودة في preflight.

**Preflight — فحص مسبق** طلب OPTIONS يسأل عن السماح قبل الطلب الفعلي. نتيجة 204 تعني نجاحًا بلا جسم رد. **Authentication** التحقق من الهوية، و**Authorization** تحديد العمليات المسموحة لها. **CSRF، Cross-Site Request Forgery** خداع browser لإرسال عملية غير مقصودة ببيانات دخوله؛ السماح بقراءة الرد مش هو منع هذه العملية.

## مثال PHP مبسط

المقطع التالي جزء من معالج طلب PHP (اسم لغة برمجة تستخدم كثيرًا لمعالجة طلبات الويب على server)، وليس تطبيق دخول كاملًا. يُوضع بعد بداية ملف PHP وقبل أي إخراج. أمثلة اللغة تحتاج [تجهيز PHP](/php/00-lab-setup/). هو يوضح رؤوس CORS؛ التحقق من هوية الطلب الفعلي وصلاحيته مسؤولية التطبيق:

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
CORS ليست Authentication أو Authorization وليست بديلًا عن CSRF protection. عميل غير متصفح يستطيع تجاهلها، وserver يجب أن يتحقق من كل طلب.
:::

## مسائل عملية

<details><summary>هل CORS يمنع <code>curl</code> من إرسال الطلب؟</summary><p>لا. CORS سياسة يطبقها المتصفح على JavaScript؛ يجب أن يعتمد الخادم على authentication وauthorization للحماية.</p></details>

<details><summary>لماذا لا يجتمع wildcard مع credentials؟</summary><p>لأن الاستجابة ذات cookies أو credentials يجب أن تسمح origin محددًا، لا أي موقع، مع <code>Access-Control-Allow-Credentials</code>.</p></details>

<details><summary>متى يرسل المتصفح preflight؟</summary><p>قبل طلب cross-origin غير بسيط، ليسأل عبر OPTIONS إن كان method والـheaders المطلوبة مسموحة.</p></details>

## شخّص الرفض من الرسالتين

الفحص المسبق له مخزن قرارات مستقل نسبيًا عن تخزين جسم HTTP (Hypertext Transfer Protocol؛ قواعد طلب الموارد والرد عليها في الويب). افتح Network في أدوات المطور: هل OPTIONS فشل؟ ولا نجح ووصل الطلب الفعلي لكن رده لا يحتوي السماح الصحيح؟ أداة curl لا تطبق سياسة قراءة JavaScript في browser، لذلك نجاحها وحده لا يثبت صحة CORS.

**no-cors** في طلب browser مش طريقة لتجاوز المنع وقراءة البيانات. قد ينتج **Opaque response — رد لا يكشف كوده أو جسمه لبرنامج الصفحة**.

**تدريب وحل:** OPTIONS نجح لكن الرد الفعلي نسي Access-Control-Allow-Origin. الحل إصلاح رؤوس الرد الفعلي أيضًا، بما فيها الردود المناسبة للأخطاء، وفق قائمة السماح. تعطيل سياسة browser أو إضافة no-cors لا يحول الرد لبيانات مقروءة.
