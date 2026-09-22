---
title: 5. الشروط والحلقات
description: if وswitch وmatch وfor وwhile وdo-while وforeach مع أهم الفروق والأخطاء.
sidebar:
  order: 5
---

## if وelseif وelse

```php
$score = 82;

if ($score >= 90) {
    $grade = 'A';
} elseif ($score >= 75) {
    $grade = 'B';
} else {
    $grade = 'C';
}
```

في القوالب يمكن استخدام الصياغة البديلة:

```php
<?php if ($grade === 'A'): ?>
  <strong>ممتاز</strong>
<?php else: ?>
  <span>استمر</span>
<?php endif; ?>
```

### Ternary وNull coalescing وNullsafe

```php
$label = $active ? 'نشط' : 'متوقف';
$username = $_GET['username'] ?? 'guest';
$postId = $user?->latestPost()?->id; // null إذا انقطعت السلسلة عند null
```

`??` يفحص الوجود وعدم `null` بطريقة تشبه `isset`. والـ nullsafe operator هو `?->`، لا `?.`.

## switch

```php
switch ($role) {
    case 'admin':
        $permissions = ['all'];
        break;
    case 'editor':
        $permissions = ['read', 'write'];
        break;
    default:
        $permissions = ['read'];
}
```

نسيان `break` يسبب fall-through وقد يكون مقصودًا أو خطأ. تاريخيًا يستخدم `switch` مقارنة غير صارمة، لذلك تجنب خلط الأنواع.

## match

```php
$message = match ($status) {
    200, 201 => 'نجاح',
    404 => 'غير موجود',
    default => 'خطأ غير متوقع',
};

$category = match (true) {
    $age < 13 => 'طفل',
    $age < 18 => 'مراهق',
    default => 'بالغ',
};
```

`match` expression تعيد قيمة، تستخدم `===`، لا يحدث فيها fall-through، ولا تحتاج `break`. وإذا لم يوجد arm مطابق ولا `default` ترمي `UnhandledMatchError`.

## for

```php
for ($i = 0; $i < 5; $i++) {
    echo $i;
}

$names = ['Ali', 'Mona', 'Omar'];
for ($i = 0, $count = count($names); $i < $count; $i++) {
    echo $names[$i];
}
```

الأجزاء الثلاثة اختيارية؛ `for (;;)` حلقة لا نهائية وتحتاج `break` أو نهاية للعملية. توجد صياغة `for (...): ... endfor;` للقوالب.

## while وdo-while

```php
$attempts = 0;
while ($attempts < 3) {
    $attempts++;
}

do {
    $input = readline();
} while ($input === '');
```

`while` تفحص قبل التنفيذ وقد لا تعمل مرة واحدة. `do-while` تنفذ الجسم مرة على الأقل.

## foreach

```php
$users = [
    ['id' => 1, 'name' => 'Ali'],
    ['id' => 2, 'name' => 'Mona'],
];

foreach ($users as $index => ['id' => $id, 'name' => $name]) {
    echo "{$index}: {$id} - {$name}";
}
```

التعديل بالمرجع:

```php
$prices = [10, 20, 30];

foreach ($prices as &$price) {
    $price *= 1.14;
}
unset($price); // مهم: إزالة المرجع الباقي من آخر عنصر
```

استخدم `continue` لتخطي الدورة الحالية و`break` لإنهاء الحلقة. ويمكن `break 2` للخروج من حلقتين متداخلتين، وهو أوضح غالبًا من `goto`.

## خريطة الدرس

<div class="lesson-diagram" role="img" aria-label="خريطة مفاهيم: الشروط والحلقات">
<p class="lesson-diagram-title">خريطة مفاهيم: الشروط والحلقات</p>
<div class="diagram-flow">
<div class="diagram-node input"><span>if وelseif وelse</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>switch</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>match</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node decision"><span>for</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node output"><span>while وdo-while</span></div>
</div>
</div>

## تأكد من فهمك

<div class="lesson-quiz" role="list">
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">01</span><p>اشرح «if وelseif وelse» كأنك تراجع تطبيقًا حقيقيًا: ما الهدف وما أهم قيد يجب الانتباه له؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> في القوالب يمكن استخدام الصياغة البديلة: Ternary وNull coalescing وNullsafe ?? يفحص الوجود وعدم null بطريقة تشبه isset. والـ nullsafe operator هو ?-&gt;، لا ?.. عمليًا، لا يكفي تنفيذ المسار الناجح؛ يجب توثيق الافتراضات والتحقق من القيم والحالات التي قد تكسر هذا السلوك.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">02</span><p>قارن بين «if وelseif وelse» و«switch». لماذا لا يغني أحدهما عن الآخر داخل موضوع «الشروط والحلقات»؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> في «if وelseif وelse»: في القوالب يمكن استخدام الصياغة البديلة: Ternary وNull coalescing وNullsafe ?? يفحص الوجود وعدم null بطريقة تشبه isset. والـ nullsafe operator هو ?-&gt;، لا ?.. أما «switch»: نسيان break يسبب fall-through وقد يكون مقصودًا أو خطأ. تاريخيًا يستخدم switch مقارنة غير صارمة، لذلك تجنب خلط الأنواع. العلاقة بينهما أن الأول يحدد جانبًا من الحل، والثاني يكمل السلوك أو القيود اللازمة لتطبيقه بصورة صحيحة.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">03</span><p>افترض أن نظامًا تجاهل «match». ما العطل أو الخطر المتوقع، وكيف تصمم اختبارًا يكشفه؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> match expression تعيد قيمة، تستخدم ===، لا يحدث فيها fall-through، ولا تحتاج break. وإذا لم يوجد arm مطابق ولا default ترمي UnhandledMatchError. لاكتشاف الخلل، اختبر مسارًا صحيحًا، وقيمة عند الحد، ومدخلًا غير صالح، ثم راقب النتيجة والآثار الجانبية والسجل بدل الاكتفاء بعدم ظهور Exception.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">04</span><p>حوّل «for» إلى قرار هندسي قابل للمراجعة. ما الذي ستوثقه وما الحالات التي ستختبرها؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> الأجزاء الثلاثة اختيارية؛ for (;;) حلقة لا نهائية وتحتاج break أو نهاية للعملية. توجد صياغة for (...): ... endfor; للقوالب. وثّق سبب الاختيار والبدائل والحدود، واختبر الحالة العادية، والحد الأدنى والأقصى، والفشل الجزئي، وإعادة المحاولة أو التكرار إن كان السلوك يسمح بذلك.</div></details>
</section>
</div>
