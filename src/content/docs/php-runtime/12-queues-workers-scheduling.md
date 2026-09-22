---
title: 12. Queues وWorkers وScheduling
description: Jobs وat-least-once delivery وidempotency وretries وbackoff وDLQ وgraceful shutdown وCron.
sidebar:
  order: 12
---

## لماذا Queue؟

انقل العمل البطيء أو القابل لإعادة المحاولة خارج HTTP request: البريد، الصور، التقارير، مزامنة APIs. أعد الاستجابة بعد حفظ نية العمل بصورة موثوقة، لا بعد تشغيل background process عشوائي.

```json
{"type":"SendReceipt","job_id":"job_01J...","order_id":42,"attempt":1}
```

أرسل IDs لا object graphs كاملة، وضع version للـpayload.

## Delivery وIdempotency

أنظمة كثيرة تقدم **at-least-once**؛ قد تصل الرسالة مرتين. صمّم handler آمنة:

```php
if ($processedJobs->contains($jobId)) {
    return;
}

$handler->handle($orderId);
$processedJobs->record($jobId);
```

يجب أن يكون تسجيل النتيجة وidempotency atomic قدر الإمكان. Transactional Outbox تربط تغيير database بإنشاء الحدث.

## Retry

أعد المحاولة للأخطاء المؤقتة فقط:

```text
delay = min(cap, base * 2^attempt) + random_jitter
```

لا تعِد ValidationError أو credential مرفوضة بلا تغيير. بعد حد معين انقل الرسالة إلى Dead-Letter Queue مع سبب وتحقيق وتنبيه.

## Worker lifecycle

- timeout لكل job وI/O.
- memory limit وإعادة تدوير العملية.
- SIGTERM يوقف استقبال الجديد وينهي الحالي ضمن grace period.
- acknowledge بعد النجاح لا قبله.
- heartbeat وvisibility timeout أطول من job مع renewal عند الحاجة.

راقب queue depth وage of oldest وprocessing latency وretry/DLQ rate.

## Cron وScheduler

اجعل المهمة المجدولة idempotent، امنع overlap بقفل له expiry، واستخدم timezone واضحة. الـscheduler يمكن أن ينشر jobs إلى queue بدل تنفيذ كل العمل في عملية واحدة.

## خريطة الدرس

<div class="lesson-diagram" role="img" aria-label="خريطة مفاهيم: Queues وWorkers وScheduling">
<p class="lesson-diagram-title">خريطة مفاهيم: Queues وWorkers وScheduling</p>
<div class="diagram-flow">
<div class="diagram-node input"><span>لماذا Queue؟</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>Delivery وIdempotency</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>Retry</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node decision"><span>Worker lifecycle</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node output"><span>Cron وScheduler</span></div>
</div>
</div>

## تأكد من فهمك

<div class="lesson-quiz" role="list">
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">01</span><p>اشرح «لماذا Queue؟» كأنك تراجع تطبيقًا حقيقيًا: ما الهدف وما أهم قيد يجب الانتباه له؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> انقل العمل البطيء أو القابل لإعادة المحاولة خارج HTTP request: البريد، الصور، التقارير، مزامنة APIs. أعد الاستجابة بعد حفظ نية العمل بصورة موثوقة، لا بعد تشغيل background process عشوائي. أرسل IDs لا object graphs كاملة، وضع version للـpayload. عمليًا، لا يكفي تنفيذ المسار الناجح؛ يجب توثيق الافتراضات والتحقق من القيم والحالات التي قد تكسر هذا السلوك.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">02</span><p>قارن بين «لماذا Queue؟» و«Delivery وIdempotency». لماذا لا يغني أحدهما عن الآخر داخل موضوع «Queues وWorkers وScheduling»؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> في «لماذا Queue؟»: انقل العمل البطيء أو القابل لإعادة المحاولة خارج HTTP request: البريد، الصور، التقارير، مزامنة APIs. أعد الاستجابة بعد حفظ نية العمل بصورة موثوقة، لا بعد تشغيل background process عشوائي. أرسل IDs لا object graphs كاملة، وضع version للـpayload. أما «Delivery وIdempotency»: أنظمة كثيرة تقدم at-least-once؛ قد تصل الرسالة مرتين. صمّم handler آمنة: يجب أن يكون تسجيل النتيجة وidempotency atomic قدر الإمكان. Transactional Outbox تربط تغيير database بإنشاء الحدث. العلاقة بينهما أن الأول يحدد جانبًا من الحل، والثاني يكمل السلوك أو القيود اللازمة لتطبيقه بصورة صحيحة.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">03</span><p>افترض أن نظامًا تجاهل «Retry». ما العطل أو الخطر المتوقع، وكيف تصمم اختبارًا يكشفه؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> أعد المحاولة للأخطاء المؤقتة فقط: لا تعِد ValidationError أو credential مرفوضة بلا تغيير. بعد حد معين انقل الرسالة إلى Dead-Letter Queue مع سبب وتحقيق وتنبيه. لاكتشاف الخلل، اختبر مسارًا صحيحًا، وقيمة عند الحد، ومدخلًا غير صالح، ثم راقب النتيجة والآثار الجانبية والسجل بدل الاكتفاء بعدم ظهور Exception.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">04</span><p>حوّل «Worker lifecycle» إلى قرار هندسي قابل للمراجعة. ما الذي ستوثقه وما الحالات التي ستختبرها؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> timeout لكل job وI/O. memory limit وإعادة تدوير العملية. SIGTERM يوقف استقبال الجديد وينهي الحالي ضمن grace period. acknowledge بعد النجاح لا قبله. heartbeat وvisibility timeout أطول من job مع renewal عند الحاجة. راقب queue depth وage of oldest وprocessing latency وretry/DLQ rate. وثّق سبب الاختيار والبدائل والحدود، واختبر الحالة العادية، والحد الأدنى والأقصى، والفشل الجزئي، وإعادة المحاولة أو التكرار إن كان السلوك يسمح بذلك.</div></details>
</section>
</div>
