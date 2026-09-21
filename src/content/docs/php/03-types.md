---
title: 3. أنواع البيانات ونظام الأنواع
description: الأنواع الأساسية والمركبة والخاصة، التحويل، callable وiterable وتصريحات النوع.
sidebar:
  order: 3
---

## خريطة الأنواع

- Scalar: `bool` و`int` و`float` و`string`.
- مركبة: `array` و`object`.
- خاصة: `null` و`resource` و`callable` و`iterable` و`mixed` و`void` و`never`.
- يعرّفها المطور: classes وinterfaces وenums.
- مركبة في التصريحات: Union مثل `int|string` وIntersection مثل `Countable&Iterator`.
- Singleton types مثل `true` و`false`.

### null وbool

يكون المتغير `null` إذا أُسندت إليه `null`، أو لم يُعرَّف، أو أزيل بـ `unset`. استخدم `is_null($x)` أو `$x === null`.

القيم falsey هي: `false` و`0` و`0.0` و`""` و`"0"` و`[]` و`null`. لذلك استخدم المقارنة الصارمة عندما يهم النوع.

```php
var_dump(0 == false);  // true
var_dump(0 === false); // false
```

### int وfloat

```php
$decimal = 42;
$octal = 0o52;
$hex = 0x2A;
$binary = 0b101010;

echo 7 / 2;       // 3.5
echo intdiv(7, 2); // 3
echo (int) 3.9;    // 3، اقتطاع لا تقريب
```

عند تجاوز مجال `int` قد تتحول النتيجة إلى `float`. والكسور الثنائية ليست دقيقة تمامًا:

```php
var_dump(0.1 + 0.2 === 0.3); // غالبًا false
echo round(0.1 + 0.2, 2);    // 0.3
```

للأموال استخدم أصغر وحدة صحيحة مثل القروش، أو مكتبة decimal مناسبة.

### string

```php
$name = 'Omar';
$message = "Hello {$name}";
$joined = 'PHP' . ' ' . '8';
echo $message[0];
echo $message[-1];
```

```php
$heredoc = <<<TEXT
Hello $name
Multiple lines
TEXT;

$nowdoc = <<<'TEXT'
$name is not interpolated here
TEXT;
```

لا تعتمد على التحويل الحسابي الضمني للنصوص؛ تحقّق بـ `filter_var` أو `is_numeric` ثم حوّل صراحة.

## المصفوفات والكائنات وEnum وResource

المصفوفة في PHP قد تكون قائمة، associative map، أو متعددة الأبعاد:

```php
$colors = ['red', 'blue'];
$user = ['id' => 7, 'name' => 'Omar'];
$matrix = [[1, 2], [3, 4]];
```

الكائن instance من class يجمع properties وmethods. والـ enum يمثل مجموعة محدودة من الحالات:

```php
enum OrderStatus: string
{
    case Pending = 'pending';
    case Paid = 'paid';
}
```

`resource` مقبض لمورد خارجي مثل stream. كثير من الامتدادات الحديثة أصبحت تعيد objects بدل resources، لذا افحص التوثيق و`get_debug_type()`.

## void وnever وmixed

- `void`: الدالة لا تسمح بإرجاع قيمة مفيدة؛ يمكن كتابة `return;`.
- `never`: الدالة لا تعود طبيعيًا لأنها ترمي exception أو تستدعي `exit` أو لا تنتهي.
- `mixed`: يقبل كل الأنواع، ومنها `null`؛ استخدم نوعًا أدق إن أمكن.

```php
function logMessage(string $message): void
{
    error_log($message);
}

function fail(string $message): never
{
    throw new RuntimeException($message);
}
```

## callable وClosure وFirst-class callable

```php
$double = function (int $n): int { return $n * 2; };
$short = fn (int $n): int => $n * 2;

class Formatter
{
    public function upper(string $value): string
    {
        return strtoupper($value);
    }

    public function __invoke(string $value): string
    {
        return trim($value);
    }
}

$f = new Formatter();
$callables = [$double, [$f, 'upper'], $f];
$upper = $f->upper(...); // First-class callable syntax
```

Callback هو callable يتم تمريره ليُستدعى لاحقًا. Closure كائن يمثل دالة مجهولة. والكائن يصبح callable إذا عرّف `__invoke()`.

## iterable وGenerator

`iterable` يعني array أو كائنًا يطبق `Traversable`. و`Iterator` يعرّف `rewind/current/key/next/valid`.

```php
function numbers(int $max): iterable
{
    for ($i = 1; $i <= $max; $i++) {
        yield $i;
    }
}
```

كل `Generator` هو `Iterator`، وليس كل Iterator مولّدًا. `yield` يوقف التنفيذ مؤقتًا ويستأنف من نفس النقطة، أما `return` فينهيه.

## تصريحات النوع والكتابة الصارمة

```php
<?php
declare(strict_types=1);

function findUser(int $id, ?string $locale = null): array|null
{
    return $id > 0 ? ['id' => $id, 'locale' => $locale] : null;
}
```

بدون strict mode قد تحول PHP الأنواع scalar الممكنة. الكتابة الصارمة قرار **لكل ملف مستدعٍ**، وتنطبق على الأنواع scalar مع استثناء قبول `int` حيث يُطلب `float`. افحص الأنواع بـ `get_debug_type()` و`var_dump()`.
