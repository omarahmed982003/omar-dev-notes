---
title: 14. التاريخ والوقت والمناطق الزمنية
description: DateTimeImmutable وUTC وtimezones وDST وParsing وIntervals والتخزين الصحيح.
sidebar:
  order: 14
---

## لحظة أم وقت محلي؟

فرّق بين:

- **Instant:** نقطة عالمية على timeline؛ خزّنها غالبًا UTC.
- **Local date/time:** مثل موعد متجر 09:00 في القاهرة.
- **Timezone:** قواعد منطقة مثل `Africa/Cairo` وتشمل تغييرات DST التاريخية.
- **Duration/Interval:** مدة وليست تاريخًا.

Offset مثل `+02:00` ليس بديلًا عن اسم timezone؛ القواعد قد تتغير.

## DateTimeImmutable

```php
$now = new DateTimeImmutable('now', new DateTimeZone('UTC'));
$cairo = $now->setTimezone(new DateTimeZone('Africa/Cairo'));

echo $now->format(DateTimeInterface::ATOM);
echo $cairo->format('Y-m-d H:i:s P');
```

فضّل `DateTimeImmutable` حتى تعيد العمليات object جديدة ولا تغيّر قيمة يشاركها كود آخر.

## Parsing صارم

```php
$date = DateTimeImmutable::createFromFormat(
    '!Y-m-d',
    $input,
    new DateTimeZone('Africa/Cairo'),
);
$errors = DateTimeImmutable::getLastErrors();

if ($date === false || ($errors !== false &&
    ($errors['warning_count'] > 0 || $errors['error_count'] > 0))) {
    throw new InvalidArgumentException('Invalid date');
}
```

لا تعتمد على parser المرن لمدخل مستخدم يحتاج format محددًا؛ قد “يصحح” تاريخًا غير موجود.

## العمليات وDST

```php
$tomorrow = $now->add(new DateInterval('P1D'));
$after24Hours = $now->add(new DateInterval('PT24H'));
```

“اليوم التالي في الساعة نفسها” قد يختلف عن “بعد 24 ساعة” حول DST. حدد معنى المجال.

## التخزين والعرض

- خزّن instant بصيغة/نوع يحفظ UTC بدقة.
- خزّن timezone الأصلية إذا كان الموعد المستقبلي مرتبطًا بالوقت المحلي.
- حوّل إلى منطقة المستخدم عند العرض.
- لا تستخدم timezone الافتراضية الضمنية في business logic.
- اختبر نهاية الشهر والسنة وleap day وتغييرات DST.

استخدم clock قابلة للحقن في الاختبارات بدل استدعاء “الآن” داخل كل class.

