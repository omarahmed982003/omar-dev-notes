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
