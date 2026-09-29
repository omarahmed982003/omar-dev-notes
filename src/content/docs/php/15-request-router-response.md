---
title: 15. من HTTP Request إلى Router وResponse
description: Front Controller وقراءة JSON وRouting وMiddleware وبناء استجابة HTTP صحيحة دون Framework.
sidebar:
  order: 15
---

## المشكلة: العنوان مش لازم يكون اسم ملف

بدل `save.php` و`list.php` عايزين `GET /health` و`POST /notes`، مع طريقة واحدة للتعامل مع الأخطاء والإخراج. هنفصل خمس مسؤوليات قبل أي Framework:

| المصطلح | مسؤوليته |
|---|---|
| Request | method وpath وheaders وbody جاية من العميل |
| Front Controller | نقطة الدخول الواحدة، غالبًا public/index.php |
| Middleware | عمل مشترك يحيط بالخطوات التالية أو يرفض قبلها |
| Router | يختار Handler حسب method وpath |
| Handler | ينفذ حالة واحدة ويرجع Response |
| Response / Emitter | بيانات status/headers/body؛ وEmitter ترسلها مرة واحدة |

الطلب يدخل كما يلي؛ Middleware خاصة بمسار قد تأتي بعد Router، لكن middleware العامة في المثال تغلفها:

~~~text
Request → Front Controller → Middleware → Router → Handler
                                         ↑          ↓
Response ← Emitter ← Middleware ←─────────┴── Response
~~~

## ملف كامل يوضح الحدود

PHP 8.1+ وmbstring. أنشئ `public/index.php` كما يلي، أو استخدم `http-demo` في [حزمة الأمثلة](/downloads/php-course.zip). من مجلد http-demo شغّل `php -S 127.0.0.1:8082 -t public public/index.php`. المعامل الأخير يجعل كل الطلبات تمر عبر Front Controller، مش مجرد ملفات موجودة. المثال API تعليمية تعيد الملاحظة ولا تحفظها؛ الحفظ في الدرس 17.

~~~php
<?php
declare(strict_types=1);

function response(array $data, int $status = 200, array $headers = []): array
{
    return [
        'status' => $status,
        'headers' => $headers + [
            'Content-Type' => 'application/json; charset=utf-8',
            'Cache-Control' => 'no-store',
            'X-Content-Type-Options' => 'nosniff',
        ],
        'body' => json_encode($data, JSON_THROW_ON_ERROR | JSON_UNESCAPED_UNICODE),
    ];
}
function createNote(array $request): array
{
    if ($request['type'] !== 'application/json') {
        return response(['error' => 'Unsupported media type'], 415);
    }
    try {
        $payload = json_decode($request['body'], false, 32, JSON_THROW_ON_ERROR);
    } catch (JsonException) {
        return response(['error' => 'Invalid JSON'], 400);
    }
    if (!$payload instanceof stdClass
        || !is_string($payload->text ?? null)
        || trim($payload->text) === ''
        || mb_strlen($payload->text, 'UTF-8') > 200) {
        return response(['error' => 'Use a text field with 1 to 200 code points'], 422);
    }
    return response(['text' => trim($payload->text)], 200);
}
function route(array $request): array
{
    $routes = [
        '/health' => ['GET' => static fn (array $r): array => response(['status' => 'ok'])],
        '/notes' => ['POST' => 'createNote'],
    ];
    $methods = $routes[$request['path']] ?? null;
    if ($methods === null) {
        return response(['error' => 'Not found'], 404);
    }
    $handler = $methods[$request['method']] ?? null;
    if ($handler === null) {
        return response(['error' => 'Method not allowed'], 405, ['Allow' => implode(', ', array_keys($methods))]);
    }
    return $handler($request);
}
function middleware(array $request, callable $next): array
{
    $id = bin2hex(random_bytes(8));
    try {
        if (strlen($request['body']) > 4096) {
            $reply = response(['error' => 'Body too large'], 413);
        } else {
            $reply = $next($request);
        }
    } catch (Throwable $error) {
        error_log(json_encode(['request_id' => $id, 'type' => get_class($error)], JSON_THROW_ON_ERROR));
        $reply = response(['error' => 'Internal error'], 500);
    }
    $reply['headers']['X-Request-ID'] = $id;
    return $reply;
}

$body = file_get_contents('php://input', false, null, 0, 4097);
if ($body === false) {
    $reply = response(['error' => 'Body unavailable'], 500);
} else {
    $path = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH);
    $request = [
        'method' => $_SERVER['REQUEST_METHOD'] ?? 'GET',
        'path' => is_string($path) ? $path : '',
        'type' => strtolower(trim(explode(';', $_SERVER['CONTENT_TYPE'] ?? '')[0])),
        'body' => $body,
    ];
    $reply = middleware($request, 'route');
}
http_response_code($reply['status']);
foreach ($reply['headers'] as $name => $value) {
    header("{$name}: {$value}");
}
echo $reply['body'];
~~~

## تتبع البرنامج من أسفل لأعلى ثم مع طلب واحد

تعريف الدوال لا ينفذ أجسامها. التنفيذ الحقيقي يبدأ بقراءة body في الأسفل. نقرأ بحد 4097 Bytes عشان نكتشف تجاوز 4096 بدون تحميل كل الجسم في ذاكرة التطبيق. الخادم نفسه يحتاج حدًا لأن PHP أو الخادم قد يكون استقبل/خزن الجسم قبل وصول الكود. `parse_url(..., PHP_URL_PATH)` يستبعد query string، فـ`/health?check=1` يختار نفس المسار.

نبني Request Array ثم نستدعي middleware مع `'route'` كـCallback. Middleware تنشئ request ID وتفحص الحجم قبل parsing. لو الحجم مقبول تستدعي next؛ Router يبحث المسار أولًا، ثم method، ثم يستدعي Handler. الرد يرجع بالعكس؛ Middleware تضيف header، وEmitter ترسل status ثم headers ثم body.

`response` تبني بيانات فقط، ولا تعمل echo أو exit. `json_encode` هنا قبل إرسال headers، فيمكن للحد العام تحويل فشل encoding إلى 500. لا تخلط `var_dump` مع الرد. read failure خارج middleware له 500 مستقلة هنا؛ لو أردت request ID لكل خطأ ضع إنشاء الطلب نفسه داخل boundary أوسع.

## JSON صحيحة مش معناها طلب صحيح

createNote تفصل ثلاثة أسئلة: هل Content-Type مناسب؟ هل النص JSON سليمة؟ هل الجذر Object وله حقل text نصي غير فارغ وبطول مسموح؟ `[]` و`null` و`42` JSON سليمة لكن ليست العقد المطلوب. `json_decode` بدون true تعطينا stdClass للجذر object، فيسهل تمييزها عن list.

`trim` تنظف الأطراف العادية؛ لا تدّعي تنظيف كل أنواع المسافات في Unicode. `mb_strlen` يقيس code points كما اتفقنا. البرنامج يرد 200 لنتيجة التحقق وإعادة النص، لأنه لا ينشئ موردًا دائمًا؛ تطبيق إنشاء حقيقي يضيف حفظًا ويرد 201 وLocation عند وجود عنوان للمورد.

عناوين Router هنا حرفية وثابتة؛ لا تنفذ decoding متكررًا ولا تحوّل path إلى include. Router إنتاجية تحتاج سياسة parameters وURL decoding وHEAD/OPTIONS وcontent negotiation؛ اتبع Framework عند الحاجة. لا تثق في X-Forwarded-* إلا من Proxy معروف ومضبوط.

## جرّب العقد من الطرفية

في Windows استعمل `curl.exe` بدل alias PowerShell. لتفادي فروق quoting احفظ `note.json` بمحتوى `{"text":"Learn routing"}`، و`broken.json` بمحتوى `{` فقط، ثم:

~~~bash
curl -i http://127.0.0.1:8082/health
curl -i -X POST -H "Content-Type: application/json" --data-binary @note.json http://127.0.0.1:8082/notes
curl -i -X POST -H "Content-Type: application/json" --data-binary @broken.json http://127.0.0.1:8082/notes
~~~

| الطلب | النتيجة |
|---|---|
| GET /health | 200 و`{"status":"ok"}` |
| GET /missing | 404 |
| GET /notes | 405 وAllow: POST |
| POST /notes بدون JSON Content-Type | 415 |
| POST /notes مع JSON مكسورة | 400 |
| POST /notes مع [] أو text فارغة/Array | 422 |
| body أكبر من 4096 Bytes | 413 قبل parsing |
| text صحيحة | 200 و`{"text":"Learn routing"}` |

Header X-Request-ID عشوائي، فلا تثبت قيمته في Test؛ تحقق من وجوده وشكله. الـContent-Type وstatus جزء من الاختبار، مش body فقط. لا تقرأ مسارًا فيه تخزين أو vendor من Document Root؛ اجعل public فقط مكشوفًا.

## توقع، شخّص، كمّل

<details><summary>توقع: GET /notes مقابل GET /unknown</summary><p>الأول مسار معروف بطريقة غير مسموحة: 405 وAllow. الثاني مسار غائب: 404. ترتيب البحث عن path ثم method هو السبب.</p></details>

<details><summary>Debugging: Router نفذت echo قبل Middleware تضيف header</summary><p>الإرسال المبكر قد يرسل headers ويمنع التعديل أو يفسد JSON. خلي Handler ترجع Response وEmitter واحدة ترسل بعد رجوع السلسلة.</p></details>

<details><summary>كمّل خطوة تمنع body كبيرة قبل json_decode</summary><p>اقرأ حد+1 ثم قارن الطول بالحد وأعد 413. أضف حد الخادم أيضًا؛ Content-Length وحدها ليست دليلًا على الحجم الفعلي لكل طرق النقل.</p></details>

<details><summary>رتب authentication وauthorization وvalidation</summary><p>بعد اختيار Route، اعرف الهوية ثم الصلاحية قبل تنفيذ أثر محمي، وتحقق من المدخل قبل business logic. حد الأخطاء يحيط بالسلسلة، وحد الجسم يسبق parsing. الترتيب التفصيلي يعتمد مسؤولية كل middleware.</p></details>

المشروع التالي ينقل نفس الحدود إلى ملفات ويضيف نموذجًا وجلسة وتخزينًا. للمزيد من HTTP جرّب المعمل كما هو موضح في [تجهيز المختبر](/php/00-lab-setup/).
