---
title: 15. من HTTP Request إلى Router وResponse
description: Front Controller وقراءة JSON وRouting وMiddleware وبناء استجابة HTTP صحيحة دون Framework.
sidebar:
  order: 15
---

## قبل ما تبدأ

ذاكر الدرس على 3 خطوات: افهم المشكلة الأول، تابع المثال، وبعدها جرّب الجزء العملي بنفسك. المصطلحات الجديدة الموجودة تحت متشرحة قبل ما ندخل في التفاصيل.

### كلمات جديدة في الدرس

- **HTTP:** قواعد تبادل الطلبات والردود بين المتصفح والخادم.
- **URL:** العنوان الكامل لمورد على الويب، زي صفحة أو صورة أو نقطة API.
- **API:** واجهة محددة تسمح لبرنامج يطلب بيانات أو ينفّذ عملية عند برنامج آخر.
- **Proxy:** وسيط يستقبل الطلب ويمرره لجهة أخرى حسب قواعد محددة.
- **UTF-8:** طريقة شائعة لتحويل أرقام Unicode إلى بايتات تُحفظ وتُنقل.
- **Function:** دالة: جزء كود له اسم ومهمة محددة ويمكن استدعاؤه أكثر من مرة.


## خلّينا نركّب الأجزاء في طلب واحد

لما المتصفح يبعت `POST /api/orders`، PHP ما بتشوفش «صفحة» بالمعنى البسيط بس. فيه Method وPath وHeaders وBody، والتطبيق محتاج يحولهم لقرار واستجابة.

```text
HTTP Request
  → Front Controller
  → Router يحدد الـHandler
  → Middleware مشتركة
  → Validation + Authorization
  → Business Logic
  → HTTP Response
```

الـ**Front Controller** هو نقطة دخول واحدة، غالبًا `public/index.php`. بدل ما كل URL يشير لملف مختلف، Web Server يرسل الطلبات الديناميكية للنقطة دي، وهي تبدأ التطبيق وتقرأ الطلب.

الـ**Router** لا ينفذ كل شغل البرنامج؛ دوره الأساسي يطابق Method وPath ويختار Handler. والـ**Middleware** تنفذ مسؤوليات مشتركة حول الطلب، زي Request ID أوAuthentication أوError Mapping.

ابدأ بمثال صغير، لكن حافظ على الحدود: بيانات Body غير موثوقة، وJSON الصالحة نحويًا مش معناها إن الحقول صحيحة، وStatus Code جزء من العقد، وأي `echo` عشوائية ممكن تفسد Response.

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

## تدريب عملي متدرج

<details><summary>1. فرق بين 400 و404 و405 و415</summary><p>400 طلب غير صالح، 404 Route/Resource غير موجود، 405 Method غير مسموحة لمسار معروف، و415 نوع Body غير مدعوم.</p></details>

<details><summary>2. JSON صحيحة لكن email مفقود. نعمل إيه؟</summary><p>Parsing نجح، لكن Validation تفشل. ارجع 422 أوالسياسة المتفق عليها مع Error Structure ثابتة، ولا تمرر البيانات للـHandler.</p></details>

<details><summary>3. رتب Middleware</summary><p>Body Limit قبل Parsing، وRouting قبل سياسات Route، وAuthentication قبل Authorization، وError Boundary تغلف المسار كله.</p></details>

## مسائل مرتبطة بالدرس

<details><summary>ماذا يفعل front controller؟</summary><p>يوفر نقطة دخول واحدة تبني request وتمرره إلى routing وmiddleware ثم ترسل response.</p></details>

<details><summary>متى تعيد API خطأ <code>400</code>؟</summary><p>عندما لا يمكن فهم الطلب أو parsing، بينما فشل validation الدلالي يمكن أن يستخدم 422 وفق عقد واضح.</p></details>

## شغّل وتحقق

استخدم [المختبر القابل للتنزيل](/php/00-lab-setup/) للسكربتات المرفقة. أوامر Composer وFPM وDocker والخادم الحقيقي تُنفذ داخل المشروع المُجهز للخدمة، مش مجلد فاضي.

نفّذ نقطة التحقق التالية داخل بيئة الدرس:

~~~bash
php http-client-lab.php
~~~

**معيار النجاح:** تعطي المسارات المعروفة status وContent-Type وbody متسقة، ويعطي المسار الغائب 404 والخطأ الداخلي 500 بلا stack trace.

دوّن كود الخروج والدليل الفعلي. إذا اختلف الناتج، فسر البيئة أو الفرضية التي اختلفت بدل تعديل «المتوقع» حتى يطابق الخطأ.

## اربط النقاط ببعض

Router يجب أن يفرق 404 عن 405، ويطبق method semantics وContent-Type وbody limits قبل parsing. Response object لا ترسل نفسها عشوائيًا؛ emitter واحد يكتب status وheaders وbody ويمنع output سابقًا. أضف security headers وstreaming عند الحاجة دون تحميل الجسم كاملًا.

### جرّب بنفسك

اختبر 404 و405 وJSON تالفًا وbody أكبر من الحد.
