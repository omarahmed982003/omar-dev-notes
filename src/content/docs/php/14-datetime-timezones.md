---
title: 14. التاريخ والوقت والمناطق الزمنية
description: DateTimeImmutable وUTC وtimezones وDST وParsing وIntervals والتخزين الصحيح.
sidebar:
  order: 14
---

## قبل ما تبدأ

ذاكر الدرس على 3 خطوات: افهم المشكلة الأول، تابع المثال، وبعدها جرّب الجزء العملي بنفسك. المصطلحات الجديدة الموجودة تحت متشرحة قبل ما ندخل في التفاصيل.


### كلمات جديدة في الدرس

الدرس ده مفيهوش اسم تقني جديد محتاج تحفظه لوحده؛ أي فكرة جديدة هتتشرح وقت ظهورها في المثال.

## الوقت أصعب من رقم الساعة اللي ظاهر

لما المستخدم يقول «الاجتماع الساعة 9»، ناقصنا نعرف التاريخ والمنطقة الزمنية، وهل الساعة 9 قبل أو بعد تغيير التوقيت الصيفي. علشان كده بنفرق بين:

- **Instant:** لحظة واحدة على الخط الزمني العالمي.
- **Local date/time:** شكل الساعة والتاريخ في منطقة معينة.
- **Timezone:** قواعد تحول اللحظة إلى وقت محلي، ومنها تغييرات DST التاريخية والمستقبلية.
- **Duration/Interval:** مدة أو فرق بين وقتين.

قاعدة عملية جيدة: خزّن اللحظات بصيغة UTC، واحتفظ بالمنطقة الزمنية الأصلية لما معنى الحدث يعتمد عليها، وحوّل للعرض عند حدود الواجهة.

```php
$createdAt = new DateTimeImmutable('now', new DateTimeZone('UTC'));
$cairoTime = $createdAt->setTimezone(new DateTimeZone('Africa/Cairo'));

echo $createdAt->format(DateTimeInterface::ATOM), PHP_EOL;
echo $cairoTime->format('Y-m-d H:i:s P'), PHP_EOL;
```

استخدام `DateTimeImmutable` يقلل التعديل المفاجئ: `modify()` و`setTimezone()` يرجعوا Object جديدًا بدل تغيير الأصل. وما تضيفش `24 * 60 * 60` وتفترض إنه «نفس الساعة بكرة»؛ عبور DST ممكن يغير طول اليوم المحلي.

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

## تدريب عملي متدرج

<details><summary>1. حوّل لحظة UTC للعرض في القاهرة</summary><p>أنشئ <code>DateTimeImmutable</code> في UTC، ثم استخدم <code>setTimezone(new DateTimeZone('Africa/Cairo'))</code> وFormat يعرض Offset.</p></details>

<details><summary>2. ليه إضافة 86400 ثانية مش دايمًا «نفس الساعة بكرة»؟</summary><p>لأن اليوم المحلي قد يتغير طوله عند DST. استخدم قواعد Calendar وTimezone حسب معنى العملية.</p></details>

<details><summary>3. اختبر تاريخًا غير صالح</summary><p>استخدم Parsing صارم وافحص <code>DateTimeImmutable::getLastErrors()</code> بدل السماح للمحرك بتعديل التاريخ تلقائيًا.</p></details>

## مسائل مرتبطة بالدرس

<details><summary>لماذا نخزن اللحظة بـUTC مع timezone منفصل عند الحاجة؟</summary><p>UTC يحفظ اللحظة دون غموض، والـtimezone يسمح بإعادة العرض وفق قواعد المكان وDST.</p></details>

<details><summary>لماذا إضافة 24 ساعة ليست دائمًا «غدًا في نفس الموعد»؟</summary><p>تغيير DST قد يجعل اليوم المحلي 23 أو 25 ساعة؛ استخدم عملية تقويمية عندما تقصد اليوم التالي محليًا.</p></details>

## شغّل وتحقق

استخدم [المختبر القابل للتنزيل](/php/00-lab-setup/) للسكربتات المرفقة. أوامر Composer وFPM وDocker والخادم الحقيقي تُنفذ داخل المشروع المُجهز للخدمة، مش مجلد فاضي.

نفّذ نقطة التحقق التالية داخل بيئة الدرس:

~~~bash
php datetime-lab.php
~~~

**معيار النجاح:** تُخزن اللحظة كـUTC وتُعرض في منطقتين بزمنين محليين يمثلان اللحظة نفسها، مع اختبار انتقال توقيت صيفي إن كان ينطبق.

دوّن كود الخروج والدليل الفعلي. إذا اختلف الناتج، فسر البيئة أو الفرضية التي اختلفت بدل تعديل «المتوقع» حتى يطابق الخطأ.

## اربط النقاط ببعض

الوقت المحلي قد يكون غير موجود أو يتكرر أثناء DST؛ parsing بلا سياسة قد يختار نتيجة غير متوقعة. Calendar interval مثل شهر لا يساوي عدد ثوان ثابتًا. مرر Clock للتطبيق والاختبارات بدل استدعاء now في عمق المنطق، وخزن instant مع timezone المطلوبة لإعادة الحساب.

### جرّب بنفسك

اختبر وقتًا قبل وبعد DST وساعة وهمية ثابتة.
