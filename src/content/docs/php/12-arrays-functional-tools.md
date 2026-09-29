---
title: 12. المصفوفات وأدوات التحويل
description: Lists وMaps وdestructuring وunpacking وmap وfilter وreduce والفرز والأداء.
sidebar:
  order: 12
---

## المشكلة: عندك مجموعة بيانات، محتاج تختار وتحول وتجمع

قائمة أسعار مش مجرد متغير واحد. **List** عناصر مفاتيحها 0 إلى n-1 بالترتيب. **Map** تربط مفتاحًا ذا معنى بقيمة مثل name→Omar. PHP تستخدم `array` للاثنين: خريطة مرتبة، فلا تفترض شكل المفاتيح من اسم المتغير.

**map** تحول كل عنصر، **filter** تختار بعض العناصر، **reduce** تجمع المجموعة في نتيجة واحدة. دي طرق للتعبير عن حركة البيانات، مش شرطًا لجعل الكود «احترافيًا». الدرس PHP 8.1+ بسبب array_is_list وunpacking المفاتيح النصية.

## برنامج كامل: إجمالي الطلبات المدفوعة

احفظ `paid.php` وشغّل `php paid.php`. نفترض أن Rows اجتازت التحقق من النوع والشكل قبل هذه المرحلة:

~~~php
<?php
declare(strict_types=1);

$orders = [
    ['id' => 'A', 'status' => 'paid', 'total' => 1200],
    ['id' => 'B', 'status' => 'pending', 'total' => 500],
    ['id' => 'C', 'status' => 'paid', 'total' => 800],
];
$paid = array_filter($orders, static fn (array $row): bool => $row['status'] === 'paid');
echo 'keys=', implode(',', array_keys($paid)), PHP_EOL;
$totals = array_map(static fn (array $row): int => $row['total'], $paid);
echo json_encode($totals, JSON_THROW_ON_ERROR), PHP_EOL;
$totals = array_values($totals);
echo json_encode($totals, JSON_THROW_ON_ERROR), PHP_EOL;
$sum = array_reduce($totals, static fn (int $carry, int $n): int => $carry + $n, 0);
echo "sum={$sum}", PHP_EOL;
echo array_is_list($totals) ? "list\n" : "map\n";
~~~

~~~text
keys=0,2
{"0":1200,"2":800}
[1200,800]
sum=2000
list
~~~

`array_filter` تستدعي callback تسأل عن status، وتحافظ على المفاتيح 0 و2؛ حذف B لا يعيد الترقيم. `array_map` مع Array واحدة تحافظ على مفاتيحها، فيتحول كل Row لعدد. JSON ترى فجوة فتعرض object. `array_values` تعيد الترقيم، فتظهر قائمة JSON. `reduce` تبدأ carry=0، ثم 1200، ثم 2000. لو القائمة فاضية النتيجة 0؛ بدون initial قد تصبح null. `array_sum` أبسط لجمع أعداد فقط؛ هنا reduce لشرح الآلية.

المصفوفة الأصلية لم تتغير. العمليات تبني Arrays جديدة، لكن لو العناصر Objects قد تشير النتائج لنفس الكائنات؛ نسخ الحاوية مش نسخًا عميقًا.

## حلقة مكافئة، ومتى تكون أوضح؟

~~~php
<?php
$orders = [
    ['status' => 'paid', 'total' => 1200],
    ['status' => 'pending', 'total' => 500],
    ['status' => 'paid', 'total' => 800],
];
$sum = 0;
foreach ($orders as $row) {
    if ($row['status'] !== 'paid') {
        continue;
    }
    $sum += $row['total'];
}
echo $sum, PHP_EOL;
~~~

~~~text
2000
~~~

نفس الاختيار والجمع بلا Arrays وسيطة؛ لو عندك توقف مبكر أو أكثر من إحصائية قد تكون Loop أوضح. مع بيانات كثيرة جدًا استخدم Generator أو pagination بدل `fetchAll` أو بناء عدة Arrays. الـGenerator تنتج عنصرًا عند الطلب؛ الدرس 16 يشرحها. PHP Arrays تحمل metadata للمفاتيح والقيم، مش مصفوفة أرقام مضغوطة. قس الذاكرة بـ`memory_get_peak_usage(true)` على نفس حجم البيانات قبل تغيير التصميم. `SplQueue` مناسبة لطابور و`SplHeap` لأولوية عندما تحتاج سلوكهما فعلًا.

## المفاتيح لها أنواع وقواعد

احفظ `keys.php`. **Destructuring** استخراج عدة قيم بأسمائها/مواضعها، و**unpacking** فرد العناصر في Array أو arguments:

~~~php
<?php
$keys = [0 => 'first', '0' => 'second', '01' => 'third'];
echo json_encode($keys, JSON_THROW_ON_ERROR), PHP_EOL;
$user = ['id' => 7, 'name' => 'Omar'];
['id' => $id, 'name' => $name] = $user;
[$first, $second] = [10, 20];
echo "{$id}:{$name}:{$first}:{$second}", PHP_EOL;

$defaults = ['timeout' => 3, 'retries' => 1];
$environment = ['timeout' => 5];
echo json_encode([...$defaults, ...$environment], JSON_THROW_ON_ERROR), PHP_EOL;
echo json_encode($defaults + $environment, JSON_THROW_ON_ERROR), PHP_EOL;
~~~

~~~text
{"0":"second","01":"third"}
7:Omar:10:20
{"timeout":5,"retries":1}
{"timeout":3,"retries":1}
~~~

`'0'` تتحول لمفتاح integer فتستبدل 0، لكن `'01'` تظل نصًا. فك بنية حقل غير موجود يسبب Warning؛ افحص شكل المدخل أولًا. في unpacking النصي القيمة اللاحقة تفوز؛ في `+` اليسار تفوز، والمفاتيح العددية في unpacking يعاد ترقيمها. و`sum(...$numbers)` يفرد القائمة لوسائط دالة، مش نفس عملية تعريف `int ...$numbers` التي تجمعها.

`isset($row['x'])` لا تفرق الغياب عن null، و`array_key_exists('x', $row)` تميز وجود المفتاح حتى لو null. `in_array($needle, $values, true)` تبحث بالقيمة والنوع؛ النسخة بلا true مرنة. `array_filter($values)` بدون callback تحذف كل falsy ومنها `0` و`'0'`؛ اكتب predicate صريحة لو الصفر صالح.

## الفرز يغيّر المصفوفة نفسها

**Comparator** دالة ترجع سالبًا لو الأول قبل الثاني، صفرًا لو متساويين، وموجبًا لو بعده. لا ترجع Boolean. برنامج `sort.php`:

~~~php
<?php
$orders = [
    ['id' => 2, 'total' => 800],
    ['id' => 3, 'total' => 1200],
    ['id' => 1, 'total' => 800],
];
usort($orders, static fn (array $a, array $b): int =>
    [$a['total'], $a['id']] <=> [$b['total'], $b['id']]
);
echo implode(',', array_column($orders, 'id')), PHP_EOL;
~~~

~~~text
1,2,3
~~~

نقارن total ثم id لكسر التعادل، فـ1 تسبق 2 رغم نفس السعر. `usort` تعيد ترقيم المفاتيح؛ قيمة عودتها نجاح العملية وليست Array مرتبة. **غلط:** `$sorted = sort($values)` تجعل sorted Boolean. انسخ القيم أولًا لو عايز الحفاظ على الأصل، ثم رتب النسخة.

| الدالة | ما يرتب؟ | يحافظ على المفاتيح؟ |
|---|---|---|
| sort / rsort | القيم تصاعدي/تنازلي | لا |
| asort / arsort | القيم | نعم |
| ksort / krsort | المفاتيح | نعم |
| usort | القيم بمقارن مخصص | لا |

للتنازلي اعكس طرفي المقارنة. قارن أنواعًا متجانسة؛ خلْط نصوص وأعداد قد يجعل ترتيبًا غير مقصود.

## توقع، شخّص، كمّل

<details><summary>توقع: array_filter([0, 5, 0, 8]) ثم JSON</summary><p>المفاتيح تبقى 1 و3، فتظهر object. لو الصفر مطلوب، استخدم callback لا تحذفه؛ لو المطلوب list بعد الفلترة استخدم array_values.</p></details>

<details><summary>Debugging: comparator ترجع $a['total'] &gt; $b['total']</summary><p>ترجع true/false فتفقد التفريق بين «قبل» و«متساوي». استخدم <code>$a['total'] &lt;=&gt; $b['total']</code> ونوع int.</p></details>

<details><summary>كمّل reduce لضرب [2,3,4]، بما فيها القائمة الفارغة</summary><p>ابدأ بقيمة 1، واستخدم <code>fn (int $carry, int $n): int =&gt; $carry * $n</code>. الناتج 24؛ الفارغة ترجع 1 حسب عقد حاصل الضرب، مش 0.</p></details>

<details><summary>إيه الأنسب لحساب مجموع وعدد مع توقف عند حد معين؟</summary><p>حلقة واضحة غالبًا؛ تقدر تحدث العدد والمجموع ثم break بدون Arrays وسيطة أو callback مع آثار جانبية مخفية.</p></details>

في الدفتر ستعرض قائمة الملاحظات وتفحص شكلها عند القراءة. شغّل `php arrays-lab.php` من [المختبر](/php/00-lab-setup/) وغيّر القيم لصفر وقائمة فارغة.
