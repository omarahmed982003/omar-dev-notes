---
title: 2. التحقق من المدخلات والفلترة
description: الفرق بين Validation وSanitization واستخدام filter_var وfilter_input وقواعد النطاق.
sidebar:
  order: 2
---

## Validation ليست Sanitization

- **Validation:** هل القيمة تطابق شروطنا؟ لا يفترض أن يغيّرها.
- **Normalization:** توحيد تمثيل مشروع، مثل trim أو تحويل case عند الحاجة.
- **Sanitization:** حذف/تغيير محارف لصنع قيمة أخرى؛ قد يخفي الخطأ ويفسد البيانات.
- **Output Encoding:** تحويل القيمة عند إخراجها لسياق HTML/URL/JS، وليس عند الإدخال.

المسار المقترح:

```text
Parse → Validate shape/type/range → Authorize action → Use safely
                                           ↓
                                  Encode at output sink
```

لا تحاول «تنظيف كل المدخلات» مرة واحدة ثم تعتبرها آمنة لكل مكان.

## filter_var

```php
$email = filter_var($rawEmail, FILTER_VALIDATE_EMAIL);
if ($email === false) {
    throw new InvalidArgumentException('Invalid email');
}

$age = filter_var($rawAge, FILTER_VALIDATE_INT, [
    'options' => ['min_range' => 18, 'max_range' => 120],
]);
if ($age === false) {
    throw new InvalidArgumentException('Age must be 18–120');
}

$ip = filter_var($rawIp, FILTER_VALIDATE_IP);
$url = filter_var($rawUrl, FILTER_VALIDATE_URL);
```

تحقق باستخدام `=== false`؛ القيمة الصحيحة قد تكون `0`. و`FILTER_DEFAULT` يعني `FILTER_UNSAFE_RAW`، فلا يفعل تنظيفًا سحريًا.

## filter_input وfilter_input_array

```php
$page = filter_input(INPUT_GET, 'page', FILTER_VALIDATE_INT, [
    'options' => ['default' => 1, 'min_range' => 1],
]);

$input = filter_input_array(INPUT_POST, [
    'email' => FILTER_VALIDATE_EMAIL,
    'age' => [
        'filter' => FILTER_VALIDATE_INT,
        'options' => ['min_range' => 18, 'max_range' => 120],
    ],
]);
```

`filter_input()` يقرأ المصدر الخارجي الأصلي حسب SAPI، وقد يختلف عن قيمة عدّلتها داخل `$_GET` أو `$_POST`. اختبر بيئة التشغيل.

## قواعد المجال أهم من شكل النوع

بريد صالح نحويًا لا يعني أنه يملك الحساب. وOrder ID صحيح كعدد لا يعني أن المستخدم يملك الطلب.

```php
$orderId = filter_input(INPUT_POST, 'order_id', FILTER_VALIDATE_INT);
if ($orderId === false || $orderId < 1) {
    throw new InvalidArgumentException('Invalid order');
}

$order = $orders->findForUser($orderId, $currentUserId);
if ($order === null) {
    throw new RuntimeException('Not found or forbidden');
}
```

طبّق allow-list للـenums والفرز وأسماء الحقول. لا يمكن حماية SQL أو HTML بمجرد Sanitization عام؛ استخدم Prepared Statements وOutput Encoding.
