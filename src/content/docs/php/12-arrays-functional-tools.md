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

