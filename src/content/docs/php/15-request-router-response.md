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

## خريطة الدرس

<div class="lesson-diagram" role="img" aria-label="خريطة مفاهيم: من HTTP Request إلى Router وResponse">
<p class="lesson-diagram-title">خريطة مفاهيم: من HTTP Request إلى Router وResponse</p>
<div class="diagram-flow">
<div class="diagram-node input"><span>Front Controller</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>قراءة body</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>Router مبسط</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node decision"><span>Response</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node output"><span>Middleware pipeline</span></div>
</div>
</div>

## تأكد من فهمك

<div class="lesson-quiz" role="list">
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">01</span><p>اشرح «Front Controller» كأنك تراجع تطبيقًا حقيقيًا: ما الهدف وما أهم قيد يجب الانتباه له؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> اجعل خادم الويب يمرر الطلبات الديناميكية إلى public/index.php: لا تجعل document root هو جذر المشروع؛ يجب ألا يصل العميل إلى vendor/ أو .env أو source files. عمليًا، لا يكفي تنفيذ المسار الناجح؛ يجب توثيق الافتراضات والتحقق من القيم والحالات التي قد تكسر هذا السلوك.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">02</span><p>قارن بين «Front Controller» و«قراءة body». لماذا لا يغني أحدهما عن الآخر داخل موضوع «من HTTP Request إلى Router وResponse»؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> في «Front Controller»: اجعل خادم الويب يمرر الطلبات الديناميكية إلى public/index.php: لا تجعل document root هو جذر المشروع؛ يجب ألا يصل العميل إلى vendor/ أو .env أو source files. أما «قراءة body»: ضع حدًا لحجم body في Web Server والتطبيق. Parsing لا يغني عن validation. العلاقة بينهما أن الأول يحدد جانبًا من الحل، والثاني يكمل السلوك أو القيود اللازمة لتطبيقه بصورة صحيحة.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">03</span><p>افترض أن نظامًا تجاهل «Router مبسط». ما العطل أو الخطر المتوقع، وكيف تصمم اختبارًا يكشفه؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> Router حقيقية تحتاج parameters وmethod mismatch وURL decoding. الهدف فهم المسؤوليات قبل framework. لاكتشاف الخلل، اختبر مسارًا صحيحًا، وقيمة عند الحد، ومدخلًا غير صالح، ثم راقب النتيجة والآثار الجانبية والسجل بدل الاكتفاء بعدم ظهور Exception.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">04</span><p>حوّل «Response» إلى قرار هندسي قابل للمراجعة. ما الذي ستوثقه وما الحالات التي ستختبرها؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> يجب إرسال headers قبل body. لا تخلط echo عشوائية مع response object. وثّق سبب الاختيار والبدائل والحدود، واختبر الحالة العادية، والحد الأدنى والأقصى، والفشل الجزئي، وإعادة المحاولة أو التكرار إن كان السلوك يسمح بذلك.</div></details>
</section>
</div>
