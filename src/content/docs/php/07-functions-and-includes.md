---
title: 7. الدوال والـ Callbacks وتضمين الملفات
description: تعريف الدوال والوسائط والمراجع والـ closures والـ arrow functions وinclude وrequire.
sidebar:
  order: 7
---

## تعريف الدالة

الدالة كتلة قابلة لإعادة الاستخدام تنفذ مهمة محددة. الدوال العادية في PHP ذات نطاق عام (مع مراعاة namespace)، ولا يمكنك إعلان دالتين بالاسم نفسه في النطاق نفسه للتعامل مع توقيعات مختلفة.

```php
function calculateTotal(float $price, int $quantity = 1): float
{
    return $price * $quantity;
}

echo calculateTotal(19.5, 3);
echo calculateTotal(quantity: 3, price: 19.5); // named arguments
```

**Parameters** هي الأسماء في التعريف، و**arguments** هي القيم عند الاستدعاء. يمكن محاكاة حالات متعددة بقيم افتراضية وunion types وvariadics:

```php
function sum(int ...$numbers): int
{
    return array_sum($numbers);
}
echo sum(1, 2, 3);
```

فضّل `return` كي تكون الدالة قابلة للاختبار والتركيب، واترك `echo` لطبقة العرض.

## التمرير بالقيمة والمرجع

```php
function increment(int $number): int
{
    return $number + 1;
}

function incrementInPlace(int &$number): void
{
    $number++;
}
```

المرجع يغيّر متغير المستدعي، لذلك اجعله واضحًا ونادرًا.

## Variable functions وCallbacks

```php
function greet(string $name): string
{
    return "Hello {$name}";
}

$functionName = 'greet';
echo $functionName('Omar');

$routes = [
    'home' => fn (): string => 'Home',
    'health' => fn (): array => ['status' => 'ok'],
];
$response = $routes[$route] ?? fn () => 'Not found';
```

استدعِ callback بعد التحقق بـ `is_callable()` إذا لم يكن النوع مضمونًا.

## Closure وuse وArrow Function

```php
$tax = 0.14;

$withTax = function (float $price) use ($tax): float {
    return $price * (1 + $tax); // التقط $tax بالقيمة
};

$counter = 0;
$next = function () use (&$counter): int {
    return ++$counter; // التقاط بالمرجع
};

$withTaxShort = fn (float $price): float => $price * (1 + $tax);
```

Arrow function تلتقط متغيرات النطاق الخارجي تلقائيًا **بالقيمة** وتحتوي expression واحدة. الدالة المجهولة العادية تستخدم `use`، ويمكن أن تلتقط بالمرجع.

```php
$names = [' ali ', 'mona '];
$clean = array_map(trim(...), $names); // First-class callable
```

إعلان دالة داخل دالة ممكن، لكن الدالة الداخلية لا تُعلن إلا بعد تنفيذ الخارجية وتصبح في نطاق الدوال؛ تجنب هذا الأسلوب، واستخدم Closure بدلًا منه.

## include وrequire

كلاهما language construct يقرأ ملفًا وينفذه:

```php
$config = require __DIR__ . '/../config/app.php';
include __DIR__ . '/partials/header.php';
```

- فشل `require` يوقف المسار الحالي برمي `Error` في PHP الحديثة.
- فشل `include` يصدر `E_WARNING` ويكمل التنفيذ غالبًا.
- `require_once` و`include_once` يمنعان تحميل الملف نفسه أكثر من مرة.
- إذا لم يُرجع الملف قيمة صريحة، يكون ناتج التضمين الناجح عادة `1`.
- `return` داخل الملف المضمن ينهي ذلك الملف ويعيد القيمة.
- الملف المضمن يرث نطاق مكان التضمين.

`config/app.php`:

```php
<?php
return [
    'name' => 'Omar Notes',
    'debug' => false,
];
```

:::tip
استخدم `__DIR__` بدل الاعتماد على current working directory. استخدم `require_once` لتعريفات لا يجوز تكرارها، واعتمد Composer autoload للفئات في المشاريع الحقيقية.
:::

## goto

```php
goto done;
echo 'لن يُنفذ';
done:
echo 'تم';
```

`goto` يقفز إلى label داخل الملف والنطاق نفسه، ولا يجوز القفز إلى داخل loop أو switch. نادرًا ما يكون أوضح من دالة صغيرة أو `break` أو `continue`.
