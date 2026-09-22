---
title: 2. cURL وعملاء HTTP
description: libcurl وامتداد PHP وGuzzle والمهلات وTLS وإرسال JSON ومعالجة الأخطاء.
sidebar:
  order: 2
---

# من cURL إلى عميل HTTP موثوق

مشروع cURL ينتج أداتين مختلفتين:

- `curl`: برنامج لسطر الأوامر.
- `libcurl`: مكتبة لنقل البيانات عبر بروتوكولات متعددة.

امتداد `ext-curl` في PHP يربط PHP بـlibcurl. وهو **عميل** يبدأ اتصالات بخوادم أخرى؛ ليس خادم ويب ولا Socket server.

## دورة الطلب في PHP

```php
<?php
declare(strict_types=1);

$handle = curl_init('https://api.example.com/v1/users/42');

curl_setopt_array($handle, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_HTTPHEADER => [
        'Accept: application/json',
        'User-Agent: OmarDevNotes/1.0',
    ],
    CURLOPT_CONNECTTIMEOUT => 3,
    CURLOPT_TIMEOUT => 10,
    CURLOPT_FOLLOWLOCATION => false,
]);

$body = curl_exec($handle);

if ($body === false) {
    $message = curl_error($handle);
    $code = curl_errno($handle);
    curl_close($handle);
    throw new RuntimeException("Network error {$code}: {$message}");
}

$status = curl_getinfo($handle, CURLINFO_RESPONSE_CODE);
curl_close($handle);

if ($status < 200 || $status >= 300) {
    throw new RuntimeException("Unexpected HTTP status: {$status}");
}

$data = json_decode($body, true, flags: JSON_THROW_ON_ERROR);
```

افصل دائمًا بين:

1. خطأ النقل: DNS أو اتصال أو timeout أو TLS؛ يظهر من `curl_exec()`.
2. استجابة HTTP فاشلة: مثل 404 أو 500؛ الاتصال نجح لكن حالة الاستجابة ليست نجاحًا.
3. محتوى غير صالح: مثل JSON تالف؛ عالجه عند فك الترميز.

## إرسال JSON

```php
$payload = json_encode(
    ['email' => 'user@example.com', 'active' => true],
    JSON_THROW_ON_ERROR
);

$handle = curl_init('https://api.example.com/v1/users');
curl_setopt_array($handle, [
    CURLOPT_POST => true,
    CURLOPT_POSTFIELDS => $payload,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_HTTPHEADER => [
        'Content-Type: application/json',
        'Accept: application/json',
        'Authorization: Bearer ' . $token,
    ],
    CURLOPT_CONNECTTIMEOUT_MS => 1000,
    CURLOPT_TIMEOUT_MS => 5000,
]);
```

لا تسجّل `Authorization` أو Cookies أو أجسامًا تحتوي بيانات شخصية.

## TLS وRedirects

:::danger[لا تعطّل التحقق]
لا تستخدم `CURLOPT_SSL_VERIFYPEER => false` أو `CURLOPT_SSL_VERIFYHOST => 0` في الإنتاج. أصلح CA bundle أو إعداد النظام؛ تعطيل التحقق يجعل الاتصال عرضة لـMan-in-the-Middle.
:::

`CURLOPT_FOLLOWLOCATION` قد يرسل الطلب إلى وجهة أخرى. ضع حدًا بـ`CURLOPT_MAXREDIRS`، ولا تسمح للمستخدم بتحديد URL حرًا في خدمة داخلية وإلا قد تنشئ SSRF. تحقّق من scheme والhost، وامنع عناوين الشبكة الداخلية وmetadata endpoints حسب بيئتك.

## Guzzle وPSR

Guzzle يقدم API أعلى مستوى ويدعم middleware وpromises وpooling. لكنه ليس “cURL بواجهة جميلة” بشكل مطلق؛ يختار Handler مناسبًا وقد يستخدم cURL أو PHP streams حسب البيئة.

```php
use GuzzleHttp\Client;

$client = new Client([
    'base_uri' => 'https://api.example.com/',
    'connect_timeout' => 3,
    'timeout' => 10,
]);

$response = $client->get('v1/users/42', [
    'headers' => ['Accept' => 'application/json'],
]);

$data = json_decode(
    (string) $response->getBody(),
    true,
    flags: JSON_THROW_ON_ERROR
);
```

عقود PSR-7 تمثل Request/Response، وPSR-18 يعرّف واجهة عميل HTTP. الاعتماد على Interface يجعل اختبار الكود وتبديل العميل أسهل.

## المهلات وإعادة المحاولة

- اضبط مهلة اتصال ومدة كلية؛ الافتراضات غير المحدودة قد تحتجز FPM worker.
- أعد المحاولة فقط للأخطاء المؤقتة، مع exponential backoff وjitter.
- لا تُعد POST غير idempotent تلقائيًا إلا بوجود idempotency key يدعمه الخادم.
- احترم `Retry-After` مع 429/503.
- ضع حدًا لحجم الاستجابة واستخدم streaming للملفات الكبيرة.

## cURL Multi

`curl_multi_*` يسمح بعدة عمليات نقل متزامنة دون thread لكل طلب. يفيد عندما تكون الاستدعاءات مستقلة، لكن يجب ضبط عدد الاتصالات وحدود API؛ التزامن غير المحدود ينقل الاختناق إلى الطرف الآخر.

## خريطة الدرس

<div class="lesson-diagram" role="img" aria-label="خريطة مفاهيم: cURL وعملاء HTTP">
<p class="lesson-diagram-title">خريطة مفاهيم: cURL وعملاء HTTP</p>
<div class="diagram-flow">
<div class="diagram-node input"><span>دورة الطلب في PHP</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>إرسال JSON</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>TLS وRedirects</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node decision"><span>Guzzle وPSR</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node output"><span>المهلات وإعادة المحاولة</span></div>
</div>
</div>

## تأكد من فهمك

<div class="lesson-quiz" role="list">
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">01</span><p>اشرح «دورة الطلب في PHP» كأنك تراجع تطبيقًا حقيقيًا: ما الهدف وما أهم قيد يجب الانتباه له؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> افصل دائمًا بين: خطأ النقل: DNS أو اتصال أو timeout أو TLS؛ يظهر من curl_exec(). استجابة HTTP فاشلة: مثل 404 أو 500؛ الاتصال نجح لكن حالة الاستجابة ليست نجاحًا. محتوى غير صالح: مثل JSON تالف؛ عالجه عند فك الترميز. عمليًا، لا يكفي تنفيذ المسار الناجح؛ يجب توثيق الافتراضات والتحقق من القيم والحالات التي قد تكسر هذا السلوك.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">02</span><p>قارن بين «دورة الطلب في PHP» و«إرسال JSON». لماذا لا يغني أحدهما عن الآخر داخل موضوع «cURL وعملاء HTTP»؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> في «دورة الطلب في PHP»: افصل دائمًا بين: خطأ النقل: DNS أو اتصال أو timeout أو TLS؛ يظهر من curl_exec(). استجابة HTTP فاشلة: مثل 404 أو 500؛ الاتصال نجح لكن حالة الاستجابة ليست نجاحًا. محتوى غير صالح: مثل JSON تالف؛ عالجه عند فك الترميز. أما «إرسال JSON»: لا تسجّل Authorization أو Cookies أو أجسامًا تحتوي بيانات شخصية. العلاقة بينهما أن الأول يحدد جانبًا من الحل، والثاني يكمل السلوك أو القيود اللازمة لتطبيقه بصورة صحيحة.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">03</span><p>افترض أن نظامًا تجاهل «TLS وRedirects». ما العطل أو الخطر المتوقع، وكيف تصمم اختبارًا يكشفه؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> :::danger[لا تعطّل التحقق] لا تستخدم CURLOPT_SSL_VERIFYPEER =&gt; false أو CURLOPT_SSL_VERIFYHOST =&gt; 0 في الإنتاج. أصلح CA bundle أو إعداد النظام؛ تعطيل التحقق يجعل الاتصال عرضة لـMan-in-the-Middle. ::: CURLOPT_FOLLOWLOCATION قد يرسل الطلب إلى وجهة أخرى. ضع حدًا بـCURLOPT_MAXREDIRS، ولا تسمح للمستخدم بتحديد URL حرًا في خدمة داخلية وإلا قد تنشئ SSRF. تحقّق من scheme والhost، وامنع عناوين الشبكة الداخلية وmetadata… لاكتشاف الخلل، اختبر مسارًا صحيحًا، وقيمة عند الحد، ومدخلًا غير صالح، ثم راقب النتيجة والآثار الجانبية والسجل بدل الاكتفاء بعدم ظهور Exception.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">04</span><p>حوّل «Guzzle وPSR» إلى قرار هندسي قابل للمراجعة. ما الذي ستوثقه وما الحالات التي ستختبرها؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> Guzzle يقدم API أعلى مستوى ويدعم middleware وpromises وpooling. لكنه ليس “cURL بواجهة جميلة” بشكل مطلق؛ يختار Handler مناسبًا وقد يستخدم cURL أو PHP streams حسب البيئة. عقود PSR-7 تمثل Request/Response، وPSR-18 يعرّف واجهة عميل HTTP. الاعتماد على Interface يجعل اختبار الكود وتبديل العميل أسهل. وثّق سبب الاختيار والبدائل والحدود، واختبر الحالة العادية، والحد الأدنى والأقصى، والفشل الجزئي، وإعادة المحاولة أو التكرار إن كان السلوك يسمح بذلك.</div></details>
</section>
</div>
