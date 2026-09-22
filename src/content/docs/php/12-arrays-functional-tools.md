---
title: 12. المصفوفات وأدوات التحويل
description: Lists وMaps وdestructuring وunpacking وmap وfilter وreduce والفرز والأداء.
sidebar:
  order: 12
---

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

## خريطة الدرس

<div class="lesson-diagram" role="img" aria-label="خريطة مفاهيم: المصفوفات وأدوات التحويل">
<p class="lesson-diagram-title">خريطة مفاهيم: المصفوفات وأدوات التحويل</p>
<div class="diagram-flow">
<div class="diagram-node input"><span>PHP array أكثر من نوع</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>map وfilter وreduce</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>Unpacking والدمج</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node decision"><span>الفرز</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node output"><span>الذاكرة</span></div>
</div>
</div>

## تأكد من فهمك

<div class="lesson-quiz" role="list">
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">01</span><p>اشرح «PHP array أكثر من نوع» كأنك تراجع تطبيقًا حقيقيًا: ما الهدف وما أهم قيد يجب الانتباه له؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> array في PHP خريطة مرتبة تستخدم كـlist أوmap. افحص شكلها عند حدود التطبيق بدل افتراض أن المفاتيح متتالية. array_is_list() يفرق list ذات مفاتيح 0..n-1 عن map. حذف عنصر من list لا يعيد الفهرسة تلقائيًا؛ استخدم array_values() عند الحاجة، خصوصًا قبل JSON. عمليًا، لا يكفي تنفيذ المسار الناجح؛ يجب توثيق الافتراضات والتحقق من القيم والحالات التي قد تكسر هذا السلوك.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">02</span><p>قارن بين «PHP array أكثر من نوع» و«map وfilter وreduce». لماذا لا يغني أحدهما عن الآخر داخل موضوع «المصفوفات وأدوات التحويل»؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> في «PHP array أكثر من نوع»: array في PHP خريطة مرتبة تستخدم كـlist أوmap. افحص شكلها عند حدود التطبيق بدل افتراض أن المفاتيح متتالية. array_is_list() يفرق list ذات مفاتيح 0..n-1 عن map. حذف عنصر من list لا يعيد الفهرسة تلقائيًا؛ استخدم array_values() عند الحاجة، خصوصًا قبل JSON. أما «map وfilter وreduce»: هذه الأدوات مناسبة لتحويلات واضحة. loop عادية أفضل أحيانًا إذا احتجت عدة نتائج أو early exit أو أردت تجنب arrays وسيطة. العلاقة بينهما أن الأول يحدد جانبًا من الحل، والثاني يكمل السلوك أو القيود اللازمة لتطبيقه بصورة صحيحة.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">03</span><p>افترض أن نظامًا تجاهل «Unpacking والدمج». ما العطل أو الخطر المتوقع، وكيف تصمم اختبارًا يكشفه؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> في المفاتيح النصية تفوز القيمة اللاحقة عند unpacking. أما + بين arrays فيحافظ على قيمة الطرف الأيسر للمفتاح الموجود؛ لا تخلطهما بلا قصد. لاكتشاف الخلل، اختبر مسارًا صحيحًا، وقيمة عند الحد، ومدخلًا غير صالح، ثم راقب النتيجة والآثار الجانبية والسجل بدل الاكتفاء بعدم ظهور Exception.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">04</span><p>حوّل «الفرز» إلى قرار هندسي قابل للمراجعة. ما الذي ستوثقه وما الحالات التي ستختبرها؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> sort()/rsort() يعيدان فهرسة القيم. asort()/arsort() يحافظان على المفاتيح. ksort()/krsort() يرتبان المفاتيح. usort() يستخدم comparator يعيد سالبًا/صفرًا/موجبًا. وثّق سبب الاختيار والبدائل والحدود، واختبر الحالة العادية، والحد الأدنى والأقصى، والفشل الجزئي، وإعادة المحاولة أو التكرار إن كان السلوك يسمح بذلك.</div></details>
</section>
</div>
