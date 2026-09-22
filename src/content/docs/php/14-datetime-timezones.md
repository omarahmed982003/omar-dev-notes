---
title: 14. التاريخ والوقت والمناطق الزمنية
description: DateTimeImmutable وUTC وtimezones وDST وParsing وIntervals والتخزين الصحيح.
sidebar:
  order: 14
---

## لحظة أم وقت محلي؟

فرّق بين:

- **Instant:** نقطة عالمية على timeline؛ خزّنها غالبًا UTC.
- **Local date/time:** مثل موعد متجر 09:00 في القاهرة.
- **Timezone:** قواعد منطقة مثل `Africa/Cairo` وتشمل تغييرات DST التاريخية.
- **Duration/Interval:** مدة وليست تاريخًا.

Offset مثل `+02:00` ليس بديلًا عن اسم timezone؛ القواعد قد تتغير.

## DateTimeImmutable

```php
$now = new DateTimeImmutable('now', new DateTimeZone('UTC'));
$cairo = $now->setTimezone(new DateTimeZone('Africa/Cairo'));

echo $now->format(DateTimeInterface::ATOM);
echo $cairo->format('Y-m-d H:i:s P');
```

فضّل `DateTimeImmutable` حتى تعيد العمليات object جديدة ولا تغيّر قيمة يشاركها كود آخر.

## Parsing صارم

```php
$date = DateTimeImmutable::createFromFormat(
    '!Y-m-d',
    $input,
    new DateTimeZone('Africa/Cairo'),
);
$errors = DateTimeImmutable::getLastErrors();

if ($date === false || ($errors !== false &&
    ($errors['warning_count'] > 0 || $errors['error_count'] > 0))) {
    throw new InvalidArgumentException('Invalid date');
}
```

لا تعتمد على parser المرن لمدخل مستخدم يحتاج format محددًا؛ قد “يصحح” تاريخًا غير موجود.

## العمليات وDST

```php
$tomorrow = $now->add(new DateInterval('P1D'));
$after24Hours = $now->add(new DateInterval('PT24H'));
```

“اليوم التالي في الساعة نفسها” قد يختلف عن “بعد 24 ساعة” حول DST. حدد معنى المجال.

## التخزين والعرض

- خزّن instant بصيغة/نوع يحفظ UTC بدقة.
- خزّن timezone الأصلية إذا كان الموعد المستقبلي مرتبطًا بالوقت المحلي.
- حوّل إلى منطقة المستخدم عند العرض.
- لا تستخدم timezone الافتراضية الضمنية في business logic.
- اختبر نهاية الشهر والسنة وleap day وتغييرات DST.

استخدم clock قابلة للحقن في الاختبارات بدل استدعاء “الآن” داخل كل class.

## خريطة الدرس

<div class="lesson-diagram" role="img" aria-label="خريطة مفاهيم: التاريخ والوقت والمناطق الزمنية">
<p class="lesson-diagram-title">خريطة مفاهيم: التاريخ والوقت والمناطق الزمنية</p>
<div class="diagram-flow">
<div class="diagram-node input"><span>لحظة أم وقت محلي؟</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>DateTimeImmutable</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>Parsing صارم</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node decision"><span>العمليات وDST</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node output"><span>التخزين والعرض</span></div>
</div>
</div>

## تأكد من فهمك

<div class="lesson-quiz" role="list">
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">01</span><p>اشرح «لحظة أم وقت محلي؟» كأنك تراجع تطبيقًا حقيقيًا: ما الهدف وما أهم قيد يجب الانتباه له؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> فرّق بين: Instant: نقطة عالمية على timeline؛ خزّنها غالبًا UTC. Local date/time: مثل موعد متجر 09:00 في القاهرة. Timezone: قواعد منطقة مثل Africa/Cairo وتشمل تغييرات DST التاريخية. Duration/Interval: مدة وليست تاريخًا. Offset مثل +02:00 ليس بديلًا عن اسم timezone؛ القواعد قد تتغير. عمليًا، لا يكفي تنفيذ المسار الناجح؛ يجب توثيق الافتراضات والتحقق من القيم والحالات التي قد تكسر هذا السلوك.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">02</span><p>قارن بين «لحظة أم وقت محلي؟» و«DateTimeImmutable». لماذا لا يغني أحدهما عن الآخر داخل موضوع «التاريخ والوقت والمناطق الزمنية»؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> في «لحظة أم وقت محلي؟»: فرّق بين: Instant: نقطة عالمية على timeline؛ خزّنها غالبًا UTC. Local date/time: مثل موعد متجر 09:00 في القاهرة. Timezone: قواعد منطقة مثل Africa/Cairo وتشمل تغييرات DST التاريخية. Duration/Interval: مدة وليست تاريخًا. Offset مثل +02:00 ليس بديلًا عن اسم timezone؛ القواعد قد تتغير. أما «DateTimeImmutable»: فضّل DateTimeImmutable حتى تعيد العمليات object جديدة ولا تغيّر قيمة يشاركها كود آخر. العلاقة بينهما أن الأول يحدد جانبًا من الحل، والثاني يكمل السلوك أو القيود اللازمة لتطبيقه بصورة صحيحة.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">03</span><p>افترض أن نظامًا تجاهل «Parsing صارم». ما العطل أو الخطر المتوقع، وكيف تصمم اختبارًا يكشفه؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> لا تعتمد على parser المرن لمدخل مستخدم يحتاج format محددًا؛ قد “يصحح” تاريخًا غير موجود. لاكتشاف الخلل، اختبر مسارًا صحيحًا، وقيمة عند الحد، ومدخلًا غير صالح، ثم راقب النتيجة والآثار الجانبية والسجل بدل الاكتفاء بعدم ظهور Exception.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">04</span><p>حوّل «العمليات وDST» إلى قرار هندسي قابل للمراجعة. ما الذي ستوثقه وما الحالات التي ستختبرها؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> “اليوم التالي في الساعة نفسها” قد يختلف عن “بعد 24 ساعة” حول DST. حدد معنى المجال. وثّق سبب الاختيار والبدائل والحدود، واختبر الحالة العادية، والحد الأدنى والأقصى، والفشل الجزئي، وإعادة المحاولة أو التكرار إن كان السلوك يسمح بذلك.</div></details>
</section>
</div>
