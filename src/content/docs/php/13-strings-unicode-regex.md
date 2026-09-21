---
title: 13. النصوص وUnicode وRegular Expressions
description: Bytes وUTF-8 وmbstring والتطبيع والمقارنة والـRegex الآمن في PHP.
sidebar:
  order: 13
---

## String في PHP

PHP string سلسلة bytes، وليست قائمة Unicode code points. لذلك:

```php
$text = 'مرحبًا';
echo strlen($text);                 // bytes
echo mb_strlen($text, 'UTF-8');     // characters تقريبًا
```

استخدم UTF-8 عبر التطبيق وقاعدة البيانات وHTTP:

```php
header('Content-Type: text/html; charset=utf-8');
```

`mb_strlen` و`mb_substr` و`mb_strtolower` أنسب للنص متعدد اللغات من نسخ byte-oriented.

## Graphemes والتطبيع

الحرف المرئي قد يتكون من أكثر من code point. امتداد `intl` يوفر أدوات grapheme و`Normalizer`:

```php
$normalized = Normalizer::normalize($input, Normalizer::FORM_C);
```

طبّع عند الحاجة الواضحة مثل البحث أو uniqueness، ولا تغيّر النص الأصلي بلا متطلب. Case folding والقواعد اللغوية أعقد من `strtolower`.

## Formatting آمن

- استخدم interpolation أو `sprintf` للعرض، لا لبناء SQL.
- قارن secrets بـ`hash_equals()` لا `===` عند الحاجة لمقارنة ثابتة الزمن.
- استخدم `htmlspecialchars` عند إخراج نص في HTML، و`rawurlencode` لمعامل URL.
- لا توجد “دالة تعقيم عامة” لكل السياقات.

## Regular Expressions

```php
$ok = preg_match('/\A[A-Z]{2}-\d{6}\z/D', $code) === 1;
```

- استخدم anchors واضحة.
- افحص `preg_last_error_msg()` عند الفشل.
- ضع حدودًا لطول input قبل regex معقدة.
- تجنب backtracking كارثي في patterns على نص غير موثوق.
- لا تستخدم regex لتحليل HTML أو JSON عندما يوجد parser.

## مثال استخراج

```php
if (preg_match('/\A(?<country>[A-Z]{2})-(?<number>\d{6})\z/D', $code, $m)) {
    $country = $m['country'];
    $number = $m['number'];
}
```

بعد مطابقة الشكل طبّق قواعد المجال؛ الشكل الصحيح لا يعني أن القيمة مسموحة.

