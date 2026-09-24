---
title: 9. HTTP Caching والضغط
description: Freshness وValidation وCache-Control وETag وVary وCDN وضغط gzip وBrotli.
sidebar:
  order: 10
---

## لماذا نخزن الاستجابة؟

الـcache تقلل latency واستهلاك الشبكة والحمل على PHP وقاعدة البيانات. قد توجد نسخ في المتصفح أو proxy/CDN أو التطبيق، ولكل طبقة سياسة مستقلة.

## Freshness وValidation

```http
Cache-Control: public, max-age=60, s-maxage=300
ETag: "product-42-v7"
Vary: Accept-Encoding, Accept-Language
```

- `max-age` مدة freshness للعميل.
- `s-maxage` يمكن أن يخصص shared caches.
- `private` يسمح بالتخزين الخاص ولا يسمح عادة لـCDN بالمشاركة.
- `no-store` يطلب عدم التخزين.
- `no-cache` لا يعني عدم التخزين؛ يعني إعادة التحقق قبل الاستخدام.
- `Vary` يجعل مفتاح النسخة يعتمد على headers محددة.

بعد انتهاء freshness يرسل العميل `If-None-Match`. إذا لم يتغير المورد يعيد الخادم `304 Not Modified` بلا body. ويمكن استخدام `Last-Modified` و`If-Modified-Since` عندما يناسب.

## مثال PHP

```php
$etag = '"' . hash('sha256', $json) . '"';
header('Cache-Control: public, max-age=60');
header("ETag: {$etag}");

if (trim($_SERVER['HTTP_IF_NONE_MATCH'] ?? '') === $etag) {
    http_response_code(304);
    exit;
}

header('Content-Type: application/json; charset=utf-8');
echo $json;
```

لا تجعل بيانات مستخدم خاصة `public`، ولا تعتمد على query string عشوائي كسياسة invalidation.

## الضغط

gzip وBrotli يقللان الحجم النصي مثل HTML وCSS وJSON. طبّق الضغط غالبًا في Web Server/CDN، ولا تضغط صورًا مضغوطة أصلًا بلا قياس. يجب أن تراعي cache قيمة `Accept-Encoding` عادة عبر `Vary`.

## Checklist

- حدّد من يستطيع التخزين ومدة الصلاحية.
- استخدم fingerprinted filenames للأصول الثابتة طويلة العمر.
- اختبر invalidation قبل مدة طويلة.
- لا تخزن استجابة فيها `Set-Cookie` أو بيانات شخصية بصورة عامة.
- راقب hit ratio والحجم والزمن.

## مرجع

- [RFC 9111: HTTP Caching](https://www.rfc-editor.org/rfc/rfc9111)

## خريطة الدرس

<div class="lesson-diagram" role="img" aria-label="خريطة مفاهيم: HTTP Caching والضغط">
<p class="lesson-diagram-title">خريطة مفاهيم: HTTP Caching والضغط</p>
<div class="diagram-flow">
<div class="diagram-node input"><span>لماذا نخزن الاستجابة؟</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>Freshness وValidation</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>مثال PHP</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node decision"><span>الضغط</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node output"><span>Checklist</span></div>
</div>
</div>

## تأكد من فهمك

<div class="lesson-quiz" role="list">
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">01</span><p>اشرح «لماذا نخزن الاستجابة؟» كأنك تراجع تطبيقًا حقيقيًا: ما الهدف وما أهم قيد يجب الانتباه له؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> الـcache تقلل latency واستهلاك الشبكة والحمل على PHP وقاعدة البيانات. قد توجد نسخ في المتصفح أو proxy/CDN أو التطبيق، ولكل طبقة سياسة مستقلة. عمليًا، لا يكفي تنفيذ المسار الناجح؛ يجب توثيق الافتراضات والتحقق من القيم والحالات التي قد تكسر هذا السلوك.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">02</span><p>قارن بين «لماذا نخزن الاستجابة؟» و«Freshness وValidation». لماذا لا يغني أحدهما عن الآخر داخل موضوع «HTTP Caching والضغط»؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> في «لماذا نخزن الاستجابة؟»: الـcache تقلل latency واستهلاك الشبكة والحمل على PHP وقاعدة البيانات. قد توجد نسخ في المتصفح أو proxy/CDN أو التطبيق، ولكل طبقة سياسة مستقلة. أما «Freshness وValidation»: max-age مدة freshness للعميل. s-maxage يمكن أن يخصص shared caches. private يسمح بالتخزين الخاص ولا يسمح عادة لـCDN بالمشاركة. no-store يطلب عدم التخزين. no-cache لا يعني عدم التخزين؛ يعني إعادة التحقق قبل الاستخدام. Vary يجعل مفتاح النسخة يعتمد على headers محددة. بعد انتهاء freshness يرسل العميل If-None-Match. إذا لم يتغير المورد يعيد الخادم 304 Not Modified بلا body. ويمكن استخدام Last-Modified وIf-Modified-Since… العلاقة بينهما أن الأول يحدد جانبًا من الحل، والثاني يكمل السلوك أو القيود اللازمة لتطبيقه بصورة صحيحة.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">03</span><p>افترض أن نظامًا تجاهل «مثال PHP». ما العطل أو الخطر المتوقع، وكيف تصمم اختبارًا يكشفه؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> لا تجعل بيانات مستخدم خاصة public، ولا تعتمد على query string عشوائي كسياسة invalidation. لاكتشاف الخلل، اختبر مسارًا صحيحًا، وقيمة عند الحد، ومدخلًا غير صالح، ثم راقب النتيجة والآثار الجانبية والسجل بدل الاكتفاء بعدم ظهور Exception.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">04</span><p>حوّل «الضغط» إلى قرار هندسي قابل للمراجعة. ما الذي ستوثقه وما الحالات التي ستختبرها؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> gzip وBrotli يقللان الحجم النصي مثل HTML وCSS وJSON. طبّق الضغط غالبًا في Web Server/CDN، ولا تضغط صورًا مضغوطة أصلًا بلا قياس. يجب أن تراعي cache قيمة Accept-Encoding عادة عبر Vary. وثّق سبب الاختيار والبدائل والحدود، واختبر الحالة العادية، والحد الأدنى والأقصى، والفشل الجزئي، وإعادة المحاولة أو التكرار إن كان السلوك يسمح بذلك.</div></details>
</section>
</div>
