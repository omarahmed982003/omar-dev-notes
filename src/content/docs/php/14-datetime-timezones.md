---
title: 14. التاريخ والوقت والمناطق الزمنية
description: DateTimeImmutable وUTC وtimezones وDST وParsing وIntervals والتخزين الصحيح.
sidebar:
  order: 14
---

## المشكلة: «الساعة 9» مش موعد كامل

ناقص التاريخ والمكان: 9 في القاهرة مش 9 في لندن. **Instant** لحظة واحدة عالميًا. **Local date/time** التاريخ والساعة في مكان. **Timezone** قواعد المكان، مثل Africa/Cairo، وتشمل تغييرات التوقيت الصيفي **DST**. **Offset** فرق عن UTC في لحظة، مثل +02:00؛ مش بديلًا عن اسم المنطقة وقواعدها. **Duration** مدة، مش تاريخًا.

نخزن لحظة حدث مضى غالبًا بـUTC، ونعرضها بمنطقة المستخدم. موعد متكرر «كل يوم 9 بالقاهرة» يحتاج الوقت المحلي واسم المنطقة وسياسة DST، مش رقم UTC ثابتًا إلى الأبد. الأمثلة PHP 8.1+، وتستخدم تواريخ محددة بدل now عشان نقدر نراجع الناتج.

## لحظة واحدة، عرضان

احفظ `zones.php` وشغّل `php zones.php`. **Immutable** تعني أن العملية ترجع كائنًا جديدًا ولا تغير الأصل:

~~~php
<?php
$utc = new DateTimeImmutable('2024-01-15 12:00:00', new DateTimeZone('UTC'));
$cairo = $utc->setTimezone(new DateTimeZone('Africa/Cairo'));
echo $utc->format('Y-m-d H:i:s P'), PHP_EOL;
echo $cairo->format('Y-m-d H:i:s P'), PHP_EOL;
var_dump($utc->getTimestamp() === $cairo->getTimestamp());
$tomorrow = $utc->modify('+1 day');
echo $utc->format('Y-m-d'), ' / ', $tomorrow->format('Y-m-d'), PHP_EOL;
~~~

~~~text
2024-01-15 12:00:00 +00:00
2024-01-15 14:00:00 +02:00
bool(true)
2024-01-15 / 2024-01-16
~~~

ننشئ تاريخًا في UTC، ثم setTimezone تحول العرض. `getTimestamp` عدد الثواني منذ Unix epoch لنفس اللحظة، فيتساوى. `Y-m-d` سنة-شهر-يوم، `H:i:s` ساعة-دقيقة-ثانية؛ الحرف i للدقائق، مش m. `P` يطبع offset. `DateTimeInterface::ATOM` صيغة جاهزة للنقل مع offset. آخر سطر يثبت أن modify لم تغير utc.

**غلط:** استدعاء `$utc->modify('+1 day');` وتجاهل العودة ثم توقع تاريخ جديد. الصحيح إسناد النتيجة. اختار DateTimeImmutable عشان مشاركة الكائن بين الدوال لا تسبب تغييرًا مفاجئًا.

## Parsing صارم: المحرك ممكن يصلح تاريخًا أنت عايز ترفضه

**Parsing** قراءة نص وتحويله لقيمة تاريخ. Parser مرنة قد تحول 30 فبراير إلى مارس. احفظ `dates.php`:

~~~php
<?php
declare(strict_types=1);
function parseDate(string $input): DateTimeImmutable
{
    if (preg_match('/\A[0-9]{4}-[0-9]{2}-[0-9]{2}\z/', $input) !== 1) {
        throw new InvalidArgumentException('Use YYYY-MM-DD');
    }
    $date = DateTimeImmutable::createFromFormat('!Y-m-d', $input, new DateTimeZone('UTC'));
    $errors = DateTimeImmutable::getLastErrors();
    if ($date === false
        || ($errors !== false && ($errors['warning_count'] > 0 || $errors['error_count'] > 0))
        || $date->format('Y-m-d') !== $input) {
        throw new InvalidArgumentException('Invalid calendar date');
    }
    return $date;
}
foreach (['2024-02-29', '2023-02-29', '2024-2-9'] as $input) {
    try {
        echo parseDate($input)->format('Y-m-d H:i:s'), PHP_EOL;
    } catch (InvalidArgumentException) {
        echo "invalid: {$input}", PHP_EOL;
    }
}
~~~

~~~text
2024-02-29 00:00:00
invalid: 2023-02-29
invalid: 2024-2-9
~~~

Regex تضبط الشكل وطول المكونات، مش صحة التقويم. `!` تصفر الحقول غير المذكورة بدل أخذ الوقت الحالي. نحفظ getLastErrors فور التحليل؛ من PHP 8.2 قد ترجع false عند عدم وجود أخطاء، فلا نفترض أنها Array. نفحص warnings أيضًا لأن إصلاح تاريخ مستحيل قد يكون Warning، ثم نعيد format للمقارنة. كل `||` توقف مبكرًا، فلا نستدعي format على false.

التاريخ فقط مثل يوم ميلاد ليس بالضرورة Instant؛ تخزينه كـDATE محلية له معنى مختلف عن created_at. لا تضف timezone لمجرد أن كل قيم الوقت في النظام لها timezone.

## يوم تقويمي غير 24 ساعة دائمًا

**Interval** وصف فرق، مثل `P1D` يوم تقويمي و`PT24H` 24 ساعة. شغّل `dst.php` بتوقيت لندن التاريخي المعروف في مارس 2024:

~~~php
<?php
$start = new DateTimeImmutable('2024-03-30 12:00:00', new DateTimeZone('Europe/London'));
$calendar = $start->add(new DateInterval('P1D'));
$elapsed = $start->add(new DateInterval('PT24H'));
foreach (['calendar' => $calendar, 'elapsed' => $elapsed] as $label => $end) {
    $seconds = $end->getTimestamp() - $start->getTimestamp();
    echo $label, ': ', $end->format('Y-m-d H:i P'), " seconds={$seconds}", PHP_EOL;
}
~~~

~~~text
calendar: 2024-03-31 12:00 +01:00 seconds=82800
elapsed: 2024-03-31 13:00 +01:00 seconds=86400
~~~

النقطة الأولى تحافظ على 12 محليًا، لكن الفرق 23 ساعة بسبب تقديم الساعة. الثانية تحافظ على 24 ساعة فتصبح 13 محليًا. وقت محلي قد يكون غير موجود عند تقديم الساعة، أو يتكرر عند تأخيرها؛ قرر رفضه أو اختيار offset بوضوح، ولا تقبل اختيار Parser الصامت في نظام مواعيد حساس.

`P1M` شهر مش 30 يومًا: إضافة شهر لـ31 يناير قد تتجاوز فبراير. قرر هل المطلوب آخر يوم في الشهر التالي أم إضافة تقويمية كما هي. اختبر leap day ونهاية الشهر/السنة. قواعد المناطق تتغير سياسيًا؛ حدث بيانات timezone وأعد تقييم المواعيد المستقبلية المحلية حسب سياسة التطبيق.

## اختبار «الآن» بدون الانتظار

**Clock injection** معناها تمرير الوقت الحالي كمدخل بدل استدعائه عميقًا داخل المنطق. نسخة بسيطة بدون Interfaces:

~~~php
<?php
function expired(DateTimeImmutable $deadline, DateTimeImmutable $now): bool
{
    return $now >= $deadline;
}
$deadline = new DateTimeImmutable('2024-01-01T12:00:00+00:00');
foreach (['11:59:59', '12:00:00', '12:00:01'] as $time) {
    $now = new DateTimeImmutable("2024-01-01T{$time}+00:00");
    echo $time, ': ', expired($deadline, $now) ? 'expired' : 'valid', PHP_EOL;
}
~~~

~~~text
11:59:59: valid
12:00:00: expired
12:00:01: expired
~~~

الحد نفسه منتهٍ وفق `>=`؛ دي قاعدة واضحة قابلة للاختبار. قياس زمن تنفيذ كود يفضل ساعة monotonic مثل `hrtime`، لا wall clock التي قد تُصحح أثناء القياس. خزّن event instant بوضوح، واحتفظ بالـtimezone المطلوبة للمواعيد المحلية، وحول عند العرض.

## توقع، شخّص، كمّل

<details><summary>توقع: UTC 12:00 والقاهرة 14:00 في المثال، أيهما أحدث؟</summary><p>نفس اللحظة، والدليل timestamp متساوية. النص المختلف عرض محلي فقط.</p></details>

<details><summary>Debugging: createFromFormat رجعت Object لتاريخ 2023-02-29 فاعتبرته صحيحًا</summary><p>المحرك قد يصحح التاريخ. افحص warnings/errors وround-trip، لأن وجود Object لا يثبت قبول المدخل حرفيًا.</p></details>

<details><summary>كمّل صلاحية تنتهي عند deadline نفسها</summary><p>استخدم <code>$now &gt;= $deadline</code>. اختبر ثانية قبل وحدًا مساويًا وثانية بعد؛ &gt; فقط تسمح باللحظة الحدية.</p></details>

<details><summary>موعد يومي 9 محليًا؛ نخزن offset +02:00 وحده؟</summary><p>لا. احتفظ بالوقت المحلي واسم المنطقة وسياسة الأيام الغامضة، لأن offset قد تتغير مع DST أو القانون.</p></details>

شغّل `php datetime-lab.php` من [المختبر](/php/00-lab-setup/). في الدفتر created_at لحظة UTC، ثم ننسقها للعرض. [مرجع التحليل](https://www.php.net/manual/en/datetimeimmutable.createfromformat.php).
