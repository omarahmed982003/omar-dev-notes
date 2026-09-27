---
title: 12. المصفوفات وأدوات التحويل
description: Lists وMaps وdestructuring وunpacking وmap وfilter وreduce والفرز والأداء.
sidebar:
  order: 12
---

## قبل ما تبدأ

ذاكر الدرس على 3 خطوات: افهم المشكلة الأول، تابع المثال، وبعدها جرّب الجزء العملي بنفسك. المصطلحات الجديدة الموجودة تحت متشرحة قبل ما ندخل في التفاصيل.

### كلمات جديدة في الدرس

- **Queue:** طابور مهام تنتظر عاملًا ينفذها في الخلفية.
- **Loop:** حلقة تكرار تعيد تنفيذ مجموعة تعليمات وفق شرط.
- **Function:** دالة: جزء كود له اسم ومهمة محددة ويمكن استدعاؤه أكثر من مرة.


## Array في PHP أداة مرنة جدًا

نفس نوع `array` ممكن يمثل قائمة مرتبة أوMap بمفاتيح أوRows جاية من قاعدة بيانات. المرونة دي مفيدة، لكنها تخليك مسؤول عن معرفة الشكل المتوقع.

```php
$prices = [1200, 2500, 800];
$product = ['id' => 7, 'name' => 'Keyboard'];
```

في القائمة، المفاتيح غالبًا `0, 1, 2`. في الـMap، المفتاح له معنى زي `'name'`. بعض العمليات مثل `array_filter()` تحافظ على المفاتيح، ولذلك لو محتاج JSON List متصلة استخدم `array_values()` بعد الفلترة.

الدوال `map` و`filter` و`reduce` مش هدفها تعمل الكود أقصر بأي ثمن:

- `map`: حوّل كل عنصر إلى عنصر جديد.
- `filter`: احتفظ بالعناصر اللي تحقق شرطًا.
- `reduce`: اجمع القائمة في نتيجة واحدة.

```php
$positive = array_values(array_filter(
    $prices,
    static fn (int $price): bool => $price > 0,
));

$withTax = array_map(
    static fn (int $price): int => (int) round($price * 1.14),
    $positive,
);

$total = array_sum($withTax);
```

لو سلسلة التحويلات بقت محتاجة شرح طويل، Loop واضحة ممكن تكون أفضل. اختار الأسلوب اللي يوضح حركة البيانات ويخلي الأخطاء والأنواع ظاهرة.

## PHP array أكثر من نوع

`array` في PHP خريطة مرتبة تستخدم كـlist أوmap. افحص شكلها عند حدود التطبيق بدل افتراض أن المفاتيح متتالية.

```php
$ids = [10, 20, 30];
$user = ['id' => 7, 'name' => 'Omar'];

[$first, $second] = $ids;
['id' => $id, 'name' => $name] = $user;
```

`array_is_list()` يفرق list ذات مفاتيح `0..n-1` عن map. حذف عنصر من list لا يعيد الفهرسة تلقائيًا؛ استخدم `array_values()` عند الحاجة، خصوصًا قبل JSON.

## map وfilter وreduce

```php
$paidTotals = array_map(
    static fn (array $order): int => $order['total_cents'],
    array_filter(
        $orders,
        static fn (array $order): bool => $order['status'] === 'paid',
    ),
);

$sum = array_reduce(
    $paidTotals,
    static fn (int $carry, int $total): int => $carry + $total,
    0,
);
```

هذه الأدوات مناسبة لتحويلات واضحة. loop عادية أفضل أحيانًا إذا احتجت عدة نتائج أو early exit أو أردت تجنب arrays وسيطة.

## Unpacking والدمج

```php
$defaults = ['timeout' => 3, 'retries' => 1];
$config = [...$defaults, ...$environment];

function sum(int ...$numbers): int {
    return array_sum($numbers);
}

$total = sum(...[2, 4, 6]);
```

في المفاتيح النصية تفوز القيمة اللاحقة عند unpacking. أما `+` بين arrays فيحافظ على قيمة الطرف الأيسر للمفتاح الموجود؛ لا تخلطهما بلا قصد.

## الفرز

- `sort()/rsort()` يعيدان فهرسة القيم.
- `asort()/arsort()` يحافظان على المفاتيح.
- `ksort()/krsort()` يرتبان المفاتيح.
- `usort()` يستخدم comparator يعيد سالبًا/صفرًا/موجبًا.

```php
usort($orders, static fn ($a, $b) =>
    [$b['created_at'], $b['id']] <=> [$a['created_at'], $a['id']]
);
```

## الذاكرة

PHP arrays مرنة لكنها أثقل من packed binary structures. لا تستخدم `array_map` و`fetchAll` على ملايين العناصر. استخدم Generator أو pagination أو processing streaming.

## تدريب عملي متدرج

<details><summary>1. فلتر الأسعار الموجبة وحافظ على JSON List</summary><p>استخدم <code>array_filter()</code> ثم <code>array_values()</code> لإعادة ترقيم المفاتيح قبل <code>json_encode()</code>.</p></details>

<details><summary>2. map ولا filter لتطبيق ضريبة؟</summary><p><code>map</code> لأنها تحول كل سعر إلى سعر جديد. <code>filter</code> تختار عناصر ولا يفترض أن تغيّر معناها.</p></details>

<details><summary>3. إمتى Loop أوضح من reduce؟</summary><p>لما التجميع له أكثر من حالة أوفشل أوSide Effect. الوضوح أهم من ضغط المنطق في Callback واحدة.</p></details>

## مسائل مرتبطة بالدرس

<details><summary>ما الفرق بين <code>map</code> و<code>filter</code>؟</summary><p>map يحول كل عنصر ويحافظ عادة على العدد، بينما filter يختار عناصر وقد يقلل العدد.</p></details>

<details><summary>لماذا قد تكون PHP array مكلفة للبيانات الكثيفة؟</summary><p>هي بنية hash مرنة تحمل metadata كبيرة؛ stream أو بنية أنسب قد توفر الذاكرة.</p></details>

## شغّل وتحقق

استخدم [المختبر القابل للتنزيل](/php/00-lab-setup/) للسكربتات المرفقة. أوامر Composer وFPM وDocker والخادم الحقيقي تُنفذ داخل المشروع المُجهز للخدمة، مش مجلد فاضي.

نفّذ نقطة التحقق التالية داخل بيئة الدرس:

~~~bash
php arrays-lab.php
~~~

**معيار النجاح:** يثبت الاختبار شكل المصفوفة بعد map وfilter وreduce، ولا تتغير المصفوفة الأصلية إلا إذا كان ذلك جزءًا معلنًا من العقد.

دوّن كود الخروج والدليل الفعلي. إذا اختلف الناتج، فسر البيئة أو الفرضية التي اختلفت بدل تعديل «المتوقع» حتى يطابق الخطأ.

## اربط النقاط ببعض

PHP array قد يحول بعض المفاتيح النصية الرقمية إلى integers، لذلك اختبر شكل المفاتيح بعد JSON أو input. <code>array_is_list</code> يفرق list عن map، وSPL structures قد تكون أوضح للqueue/heap. map/filter/reduce تنسخ بيانات وقد تزيد الذاكرة؛ قس قبل استخدامها على مجموعات كبيرة.

### جرّب بنفسك

اختبر مفاتيح 0 و"0" و"01" وقس الذاكرة قبل وبعد pipeline.
