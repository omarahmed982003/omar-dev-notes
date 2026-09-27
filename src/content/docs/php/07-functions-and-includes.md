---
title: 7. الدوال والـ Callbacks وتضمين الملفات
description: تعريف الدوال والوسائط والمراجع والـ closures والـ arrow functions وinclude وrequire.
sidebar:
  order: 7
---

## قبل ما تبدأ

ذاكر الدرس على 3 خطوات: افهم المشكلة الأول، تابع المثال، وبعدها جرّب الجزء العملي بنفسك. المصطلحات الجديدة الموجودة تحت متشرحة قبل ما ندخل في التفاصيل.

### كلمات جديدة في الدرس

- **Loop:** حلقة تكرار تعيد تنفيذ مجموعة تعليمات وفق شرط.
- **Function:** دالة: جزء كود له اسم ومهمة محددة ويمكن استدعاؤه أكثر من مرة.


## الدالة بتلم فكرة واحدة في اسم واضح

لو حسبت السعر النهائي في خمس أماكن، أي تعديل في القاعدة محتاج خمس تعديلات وممكن تنسى واحد. الدالة Function بتجمع خطوات لها هدف واحد تحت اسم، وتستقبل مدخلات، وقد ترجع نتيجة.

```php
function calculateSubtotal(int $priceCents, int $quantity): int
{
    if ($priceCents < 0 || $quantity < 1) {
        throw new InvalidArgumentException('Invalid order values');
    }

    return $priceCents * $quantity;
}

$subtotal = calculateSubtotal(1500, 3);
```

اقرأ توقيع الدالة كعقد: الاسم يشرح الفعل، والـParameters هي البيانات المطلوبة، و`int` بعد القوس هو نوع النتيجة. الدالة الجيدة مش مجرد كود اتنقل؛ لها مسؤولية واضحة، ومدخلاتها ظاهرة، ونتيجتها قابلة للاختبار.

فرّق بين **Parameter** في تعريف الدالة و**Argument** وقت الاستدعاء. وابدأ بالتمرير بالقيمة؛ المرجع `&` استثناء يحتاج سببًا واضحًا لأنه يسمح للدالة تغير متغير المستدعي.

ملفات `include` و`require` بتنظم الكود، لكنها مش بديل عن Functions وClasses وAutoloading. لما تضم ملفًا، الكود الموجود فيه بيتنفذ في اللحظة دي، وممكن يرجع قيمة أو يعرف دوالًا وأصنافًا.

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

## تدريب عملي متدرج

<details><summary>1. حوّل معادلة مكررة إلى دالة</summary><p>اعمل <code>calculateTotal(int $priceCents, int $quantity): int</code>، ارفض القيم السالبة أوQuantity أقل من 1، واختبر 1 و3 وقيمة غير صالحة.</p></details>

<details><summary>2. إيه مشكلة Reference Parameter غير الواضحة؟</summary><p>المستدعي قد يفتكر إن الدالة تحسب نتيجة فقط، بينما هي تغيّر متغيره. رجّع قيمة جديدة غالبًا أو سمّ الدالة بوضوح لو التعديل مقصود.</p></details>

<details><summary>3. require ولا include لملف الإعداد؟</summary><p>استخدم <code>require</code> لأن التطبيق لا يستطيع الاستمرار بشكل صحيح من غير الإعداد. لو المورد اختياري فعلًا، تعامل مع فشل <code>include</code> صراحة.</p></details>

## مسائل مرتبطة بالدرس

<details><summary>متى يكون التمرير بالمرجع اختيارًا سيئًا؟</summary><p>حين يخفي أن الدالة تغيّر قيمة خارجها؛ إرجاع قيمة جديدة أوضح غالبًا وأسهل للاختبار.</p></details>

<details><summary>ما الفرق العملي بين <code>include</code> و<code>require</code>؟</summary><p>فشل require يوقف التنفيذ، بينما include يصدر تحذيرًا وقد يستمر؛ استخدم require للملفات اللازمة للتطبيق.</p></details>

## شغّل وتحقق

استخدم [المختبر القابل للتنزيل](/php/00-lab-setup/) للسكربتات المرفقة. أوامر Composer وFPM وDocker والخادم الحقيقي تُنفذ داخل المشروع المُجهز للخدمة، مش مجلد فاضي.

نفّذ نقطة التحقق التالية داخل بيئة الدرس:

~~~bash
php functions-lab.php
~~~

**معيار النجاح:** تنجح الدالة للحدود المعلنة وتفشل بوضوح خارجها، ويُحمّل الملف المطلوب مرة واحدة بلا اعتماد على working directory عارض.

دوّن كود الخروج والدليل الفعلي. إذا اختلف الناتج، فسر البيئة أو الفرضية التي اختلفت بدل تعديل «المتوقع» حتى يطابق الخطأ.

## اربط النقاط ببعض

Named arguments ترتبط بأسماء parameters وقد تجعل إعادة التسمية breaking change. Variadics تجمع القيم وfirst-class callables تنقل callable بعقد أوضح. Recursion تحتاج base case وحد عمق. لا تبن include path من input، واستخدم autoload بدل سلسلة require يدوية في المشروع.

### جرّب بنفسك

اختبر callable وvariadic وrecursion بحد فشل واضح.
