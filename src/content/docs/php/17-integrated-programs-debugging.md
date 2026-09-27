---
title: 17. برامج مترابطة وDebugging عملي
description: برامج PHP كاملة تربط الأنواع والدوال والملفات والطلبات والاستثناءات، مع تمارين توقع الناتج وتصحيح الأخطاء.
sidebar:
  order: 17
---

## قبل ما تبدأ

ذاكر الدرس على 3 خطوات: افهم المشكلة الأول، تابع المثال، وبعدها جرّب الجزء العملي بنفسك. المصطلحات الجديدة الموجودة تحت متشرحة قبل ما ندخل في التفاصيل.

### كلمات جديدة في الدرس

- **Debugger:** أداة تتبّع الأخطاء: بتوقف البرنامج خطوة خطوة عشان تشوف القيم ومسار التنفيذ.
- **HTTP:** قواعد تبادل الطلبات والردود بين المتصفح والخادم.
- **Cache:** نسخة مؤقتة من البيانات هدفها تقليل وقت الانتظار والعمل المتكرر.
- **CLI:** واجهة تتعامل معها بكتابة أوامر نصية بدل الضغط على أزرار.
- **UTF-8:** طريقة شائعة لتحويل أرقام Unicode إلى بايتات تُحفظ وتُنقل.
- **Function:** دالة: جزء كود له اسم ومهمة محددة ويمكن استدعاؤه أكثر من مرة.


## من Fragment لبرنامج نقدر نشغله

المثال الصغير ممتاز لشرح Operator أوFunction واحدة، لكنه مش بيوريك المشاكل اللي بتحصل لما الأجزاء تتجمع: المدخل ممكن يكون ناقصًا، الملف ممكن مايفتحش، الإخراج ممكن يفسد، والدالة الصحيحة ممكن تُستدعى بترتيب غلط.

علشان كده البرنامج الكامل لازم يوضح:

- الأمر أوالرابط اللي يشغله.
- شكل المدخلات والقيم غير الصالحة.
- الناتج وExit Code أوHTTP Status المتوقع.
- حدود مسؤولية كل دالة.
- طريقة التعامل مع الفشل.
- حالات اختبار تثبت السلوك.

وأثناء الـDebugging، ما تبدأش بإصلاح أول سطر شكله غريب. ثبّت المشكلة بأقل Input، اكتب المتوقع والفعلي، اجمع دليلًا من Log أوDump أوTest، غيّر سببًا واحدًا، وبعد الإصلاح أضف Regression Test.

```text
Reproduce → Minimize → Observe → Hypothesis
          → One change → Verify → Regression test
```

الدروس السابقة بتديك القطع، والدرس ده بيدرّبك تشوف حدود البرنامج كاملة.

## لماذا نحتاج برامج كاملة؟

الـFragment يشرح تعليمة واحدة، لكن البرنامج الكامل يكشف حدود الطبقات: أين نقرأ المدخل؟ أين نتحقق؟ متى نرمي Exception؟ وكيف نخرج نتيجة ثابتة قابلة للاختبار؟ الأمثلة التالية صغيرة، لكنها تعمل من البداية إلى النهاية.

## برنامج CLI: تلخيص أسعار صحيحة

```php
<?php

declare(strict_types=1);

function parseMinorUnits(string $value): int
{
    if (preg_match('/\A[0-9]+(?:\.[0-9]{1,2})?\z/', $value) !== 1) {
        throw new InvalidArgumentException('Invalid amount');
    }
    [$whole, $fraction] = array_pad(explode('.', $value, 2), 2, '');
    $digits = ltrim($whole . str_pad($fraction, 2, '0'), '0');
    $digits = $digits === '' ? '0' : $digits;
    $maximum = (string) PHP_INT_MAX;
    if (strlen($digits) > strlen($maximum)
        || (strlen($digits) === strlen($maximum) && strcmp($digits, $maximum) > 0)) {
        throw new InvalidArgumentException('Amount exceeds integer range');
    }
    return (int) $digits;
}

function addMinorUnits(int $left, int $right): int
{
    if ($left < 0 || $right < 0 || $left > PHP_INT_MAX - $right) {
        throw new InvalidArgumentException('Total exceeds integer range');
    }
    return $left + $right;
}

$arguments = array_slice($argv, 1);
if ($arguments === []) {
    fwrite(STDERR, "Usage: php total.php 12.50 3.25\n");
    exit(2);
}

try {
    $total = array_reduce(
        $arguments,
        fn (int $sum, string $amount): int => addMinorUnits($sum, parseMinorUnits($amount)),
        0,
    );
    printf("%d.%02d\n", intdiv($total, 100), $total % 100);
} catch (InvalidArgumentException $exception) {
    fwrite(STDERR, $exception->getMessage() . PHP_EOL);
    exit(1);
}
```

تشغيل `php total.php 12.50 3.25` يطبع `15.75`. المثال يربط Strict Types وRegex والدوال والمصفوفات والاستثناءات وExit Codes، ويتجنب أخطاء `float` في الأموال.

## برنامج Streaming: عد السطور دون تحميل الملف

```php
<?php

declare(strict_types=1);

function readableLines(string $path): Generator
{
    $file = new SplFileObject($path, 'r');
    foreach ($file as $number => $line) {
        $line = trim((string) $line);
        if ($line !== '') {
            yield $number + 1 => $line;
        }
    }
}

$path = $argv[1] ?? '';
if ($path === '' || !is_readable($path)) {
    fwrite(STDERR, "Readable file required\n");
    exit(2);
}

$count = 0;
foreach (readableLines($path) as $number => $line) {
    $count++;
    echo $number, ': ', $line, PHP_EOL;
}
echo "Count: {$count}", PHP_EOL;
```

الذاكرة هنا تقريبًا ثابتة بالنسبة لحجم الملف لأن كل سطر يُعالج عند الطلب. اختبر ملفًا فارغًا، وسطرًا يحتوي Spaces فقط، وملفًا غير قابل للقراءة.

## Endpoint JSON صغير بحدود واضحة

```php
<?php

declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');

try {
    $payload = json_decode(file_get_contents('php://input'), true, flags: JSON_THROW_ON_ERROR);
    $name = is_string($payload['name'] ?? null) ? trim($payload['name']) : '';

    if ($name === '' || mb_strlen($name) > 80) {
        http_response_code(422);
        echo json_encode(['error' => 'invalid_name'], JSON_THROW_ON_ERROR);
        exit;
    }

    http_response_code(201);
    echo json_encode(['name' => $name], JSON_THROW_ON_ERROR);
} catch (JsonException) {
    http_response_code(400);
    echo '{"error":"invalid_json"}';
}
```

افصل خطأ صياغة JSON `400` عن قيمة صحيحة الصياغة لكنها تخالف قواعد المجال `422`. في تطبيق حقيقي أضف Authentication وAuthorization وCSRF حسب نوع العميل، ولا تضع تفاصيل Exception في الاستجابة العامة.

## منهج Debugging قابل للتكرار

1. ثبّت Input يعيد المشكلة.
2. اكتب Expected وActual بوضوح.
3. صنّف المشكلة: Parse أوType أوControl Flow أوI/O أوState خارجي.
4. صغّر الحالة حتى يبقى أقل كود يعيد الخطأ.
5. أضف Test يفشل قبل الإصلاح وينجح بعده.
6. أصلح السبب، ثم افحص الحالات المجاورة وحدود القيم.

`var_dump` و`print_r` للملاحظة المؤقتة، بينما Logger وDebugger وTests تعطي Evidence قابلة للتكرار. لا تترك Tokens أوPasswords أوBodies حساسة في Logs.

## تدريب عملي متدرج

<details><summary>1. البرنامج يفشل مع ملف فارغ فقط. أول خطوة؟</summary><p>ثبّت الملف الفارغ كأقل Reproduction، اكتب المتوقع، وشغّل Test منفصل قبل تعديل الكود.</p></details>

<details><summary>2. ليه نغيّر سببًا واحدًا في كل تجربة؟</summary><p>علشان لو النتيجة اتغيرت نعرف أي فرضية اتأكدت. تغييرات كثيرة معًا تنتج إصلاحًا غير مفهوم وقد تخفي المشكلة.</p></details>

<details><summary>3. ما قيمة Regression Test؟</summary><p>يثبت السلوك اللي كان مكسورًا ويمنع نفس الخطأ من الرجوع أثناء تعديل لاحق.</p></details>

## خريطة الدرس

<div class="lesson-diagram" role="img" aria-label="خريطة البرامج والتصحيح">
<p class="lesson-diagram-title">من العطل إلى إصلاح مثبت</p>
<div class="diagram-flow diagram-pipeline">
<div class="diagram-node input"><span>Input يعيد العطل</span></div><span class="diagram-arrow">→</span>
<div class="diagram-node process"><span>Expected مقابل Actual</span></div><span class="diagram-arrow">→</span>
<div class="diagram-node decision"><span>فرضية واحدة</span></div><span class="diagram-arrow">→</span>
<div class="diagram-node process"><span>اختبار يفشل</span></div><span class="diagram-arrow">→</span>
<div class="diagram-node output"><span>إصلاح واختبار حدود</span></div>
</div>

## مشروع تراكمي: مستورد طلبات قابل للتشغيل

ابنِ ملفًا باسم <code>orders.php</code> يقرأ ملف JSON، يتحقق من بنية كل طلب، يحسب الإجمالي بالسنتات الصحيحة، ثم يطبع ملخصًا واحدًا. اجعل حدود المشروع واضحة: القراءة قد تفشل، JSON قد يكون تالفًا، والسعر أو الكمية قد يكونان خارج العقد.

### عقد الإدخال

~~~json
[
  {"id":"A-100","unit_price_minor":1250,"quantity":2},
  {"id":"A-101","unit_price_minor":499,"quantity":1}
]
~~~

### التشغيل والنتيجة

~~~bash
php orders.php fixtures/orders.json
~~~

~~~text
orders=2
items=3
total_minor=2999
~~~

ويجب أن تعطي حالة الفشل نتيجة قابلة للاختبار:

~~~bash
php orders.php fixtures/broken.json
~~~

~~~text
ERROR invalid JSON
exit_code=2
~~~

### شروط القبول

1. لا تستخدم <code>float</code> للمال، ولا تسمح بتحويل نص رقمي ضمنيًا.
2. افصل القراءة والتحقق والحساب والعرض في دوال صغيرة ذات أنواع واضحة.
3. أضف اختبارات للملف المفقود وJSON التالف والكمية صفرًا والسعر السالب والعدد الذي يتجاوز مدى <code>int</code>.
4. مرّر PHPStan أو أداة التحليل المختارة، ثم احتفظ باختبار regression لأي عيب تجده.
5. سجّل سبب الخطأ تقنيًا، لكن اجعل رسالة CLI مستقرة ولا تعرض stack trace للمستخدم.
</div>

## تأكد من فهمك

<div class="lesson-quiz" role="list">
<section class="quiz-card" role="listitem"><div class="quiz-question-row"><span class="quiz-number">01</span><p>توقع ناتج <code>array_map(fn ($x) =&gt; $x * 2, ['2', 3])</code> دون Strict Types، وما الخطر؟</p></div><details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة:</strong> الناتج [4, 6] بسبب تحويل النص الرقمي. الخطر أن بيانات غير منضبطة تمر بصمت؛ تحقق من الشكل والنوع عند الحدود.</div></details></section>
<section class="quiz-card" role="listitem"><div class="quiz-question-row"><span class="quiz-number">02</span><p>لماذا استخدام <code>float</code> لجمع أسعار كثيرة قد يعطي سنتًا خاطئًا؟</p></div><details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة:</strong> معظم الكسور العشرية تقريبية في التمثيل الثنائي. استخدم أصغر وحدة صحيحة أو Decimal مناسبًا للمجال.</div></details></section>
<section class="quiz-card" role="listitem"><div class="quiz-question-row"><span class="quiz-number">03</span><p>اكتشف الخطأ: <code>if ($value = null)</code>.</p></div><details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة:</strong> هذا إسناد لا مقارنة ويجعل الشرط false. استخدم <code>$value === null</code> وفعّل التحليل الساكن.</div></details></section>
<section class="quiz-card" role="listitem"><div class="quiz-question-row"><span class="quiz-number">04</span><p>لماذا <code>file_get_contents()</code> يحتاج فحصًا صارمًا ضد <code>false</code>؟</p></div><details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة:</strong> النص الفارغ نتيجة صحيحة لكنه falsy؛ المقارنة الصارمة تفرق بين فشل القراءة ومحتوى فارغ.</div></details></section>
<section class="quiz-card" role="listitem"><div class="quiz-question-row"><span class="quiz-number">05</span><p>صمم حالات اختبار لـ<code>parseMinorUnits</code>.</p></div><details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة:</strong> اختبر 0 و12 و12.5 و12.50، ثم -1 و1.234 وحروفًا ومسافات وقيمة ضخمة تتجاوز int.</div></details></section>
<section class="quiz-card" role="listitem"><div class="quiz-question-row"><span class="quiz-number">06</span><p>ما الفرق بين إصلاح العرض وإصلاح السبب؟</p></div><details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة:</strong> إخفاء Warning أو Catch عام قد يخفي العرض، لكن الإصلاح الحقيقي يثبت سبب الحالة ويمنعها أو يعالجها بعقد واختبار واضحين.</div></details></section>
</div>

## اربط النقاط ببعض

حوّل المشروع الختامي إلى files فعلية: fixtures صحيحة وفاسدة، test runner، وREADME بأوامر التشغيل. اجعل كل bug سابق regression test، وشغّل static analysis وtests من checkout نظيف حتى لا يعتمد النجاح على ملف محلي غير معلن.

### جرّب بنفسك

احذف cache المحلية وشغّل المشروع من نسخة نظيفة وفق README فقط.


## اختبر حدود المبالغ

المبلغ بيبدأ كنص، وماينفعش نحوله لعدد قبل فحص شكله وحدوده. `\A` و`\z` بيثبتوا بداية النص ونهايته الحقيقية؛ لكن `$` ممكن يطابق قبل سطر جديد في الآخر. بنوصل الجزء الصحيح برقمين للكسر كنص، بدل ضرب ممكن يتجاوز حد العدد قبل ما نفحصه. بنقارن طول الأرقام ثم ترتيب النصوص المتساوية الطول، وبعدها نحول إلى `int`. والجمع مسموح بس لما `left <= PHP_INT_MAX - right`. المثال يقبل مبالغ غير سالبة بكسر من رقم أو رقمين وأصفار بادئة؛ مش بيعمل تحويل عملات أو تقريب.

شغّل `php tests.php values` داخل [المختبر القابل للتنزيل](/php/00-lab-setup/). جرّب `12.5` فتطلع 1250، ثم نفس النص وبعده سطر جديد فيُرفض، ومبلغ أكبر من حد العدد فيُرفض، ومبلغين صحيحين مجموعهما أكبر من الحد فيُرفض الجمع.
