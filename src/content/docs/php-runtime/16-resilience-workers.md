---
title: 16. المرونة وإدارة Workers
description: Circuit Breaker وBulkhead وBackpressure وإشارات العمليات وإدارة Workers عبر Supervisor وsystemd.
sidebar:
  order: 16
---

## المهلة أول دفاع

كل اتصال خارجي يحتاج Connect Timeout وTotal Timeout. من دونها قد تتراكم PHP Workers وهي تنتظر خدمة بطيئة حتى ينفد الـPool. Retry ليست بديلًا عن المهلة؛ استخدمها فقط لخطأ مؤقت وعملية آمنة أو Idempotent، مع Backoff وJitter وحد أقصى.

## Circuit Breaker

يتابع الفشل في نافذة زمنية:

- **Closed:** الطلبات تمر ويُسجل النجاح والفشل.
- **Open:** يفشل سريعًا بدل الضغط على خدمة متعطلة.
- **Half-open:** يسمح بعدد محدود من الطلبات لاختبار التعافي.

لا تفتح الدائرة بسبب خطأ مجال مثل `422`. صنف Timeouts و`5xx` وأخطاء الاتصال، وحدد سياسة منفصلة لكل Dependency. شارك الحالة عبر مخزن مناسب إذا كان القرار يجب أن يشمل عدة Workers، أو اقبل أن لكل Process رؤية محلية موثقة.

## Bulkhead وBackpressure

Bulkhead يعزل الموارد: Pool منفصل أو حد تزامن لخدمة بطيئة حتى لا تستهلك كل Workers. Backpressure تجعل المنتج يبطئ أو يرفض عملًا جديدًا عندما لا يستطيع المستهلك اللحاق به. الخيارات تشمل Queue bounded، `429`/`503` مع `Retry-After`، أو تقليل Concurrency.

Queue غير محدودة لا تحل الحمل؛ تؤجل الانهيار وتستهلك الذاكرة. راقب Queue Depth وOldest Message Age وProcessing Rate، وليس طولها وحده.

## Worker lifecycle والإشارات

عامل CLI طويل العمر يجب أن يلتقط `SIGTERM` ليتوقف بأمان بعد المهمة الحالية، ويستخدم `SIGINT` للتشغيل المحلي. يحتاج امتداد `pcntl` في بيئات Unix-like؛ Windows يتطلب آلية إدارة مختلفة.

```php
<?php

declare(strict_types=1);

$running = true;
pcntl_async_signals(true);
pcntl_signal(SIGTERM, static function () use (&$running): void {
    $running = false;
});

while ($running) {
    $job = reserveJob(timeoutSeconds: 5);
    if ($job === null) {
        continue;
    }
    try {
        handle($job);
        acknowledge($job);
    } catch (Throwable $error) {
        releaseOrDeadLetter($job, $error);
    }
}
```

ضع حدًا لعدد Jobs أو الذاكرة ثم أعد تشغيل Worker دوريًا، وأغلق الاتصالات وحرر Locks عند الخروج.

## Supervisor وsystemd

مدير العمليات يبدأ Worker بعد الإقلاع، يعيده بعد Crash، يمرر Environment صحيحة، ويجمع stdout/stderr. لا تجعل Restart Loop سريعًا يخفي خطأ دائمًا؛ أضف Backoff وحدًا للمحاولات وتنبيهًا.

```ini
[Service]
ExecStart=/usr/bin/php /srv/app/bin/worker.php
WorkingDirectory=/srv/app
Restart=on-failure
RestartSec=5
TimeoutStopSec=30
KillSignal=SIGTERM
```

Health لا تعني أن Process موجودة فقط: راقب قدرتها على سحب Jobs، آخر نجاح، عمر أقدم رسالة، ومعدل الفشل.

## تأكد من فهمك

<div class="lesson-quiz" role="list">
<section class="quiz-card" role="listitem"><div class="quiz-question-row"><span class="quiz-number">01</span><p>لماذا Retry بلا Timeout يزيد العطل؟</p></div><details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة:</strong> كل محاولة قد تنتظر بلا حد، فتتراكم Workers ويزداد الضغط على الخدمة المتعثرة.</div></details></section>
<section class="quiz-card" role="listitem"><div class="quiz-question-row"><span class="quiz-number">02</span><p>ما وظيفة Half-open؟</p></div><details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة:</strong> اختبار التعافي بعدد محدود من الطلبات دون إعادة الحمل كاملًا فورًا.</div></details></section>
<section class="quiz-card" role="listitem"><div class="quiz-question-row"><span class="quiz-number">03</span><p>كيف يختلف Bulkhead عن Circuit Breaker؟</p></div><details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة:</strong> Bulkhead يعزل السعة، أما Circuit Breaker فيوقف الاستدعاء مؤقتًا عند نمط فشل.</div></details></section>
<section class="quiz-card" role="listitem"><div class="quiz-question-row"><span class="quiz-number">04</span><p>ماذا يجب أن يفعل Worker عند SIGTERM؟</p></div><details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة:</strong> يتوقف عن حجز عمل جديد، ينهي المهمة الحالية وفق المهلة، يغلق الموارد، ثم يخرج بكود واضح.</div></details></section>
</div>
