---
title: "Input validation: من string لقيمة موثوقة"
prev: {"link":"/php/12-arrays-functional-tools/","label":"المصفوفات وأدوات التحويل"}
next: {"link":"/php/13-strings-unicode-regex/","label":"Strings وUnicode"}
description: "Input validation: من string لقيمة موثوقة"
sidebar:
  order: 6.7
---

## الرقم المكتوب مش كفاية

المتطلبات: string وbool وif والعمليات. **Input validation** قرار قبول البيانات حسب قواعد التطبيق. **Parsing** تفسير صيغة وتحويلها لقيمة. **Casting** طلب تحويل النوع، لكنه مش إثبات إن النص كله صالح.

**Normalization** تعديل متفق عليه، زي إزالة مسافات الأطراف. مش كل تعديل مسموح لكل البيانات؛ مثلًا ما تغيّرش password من نفسك.

## عقد واضح قبل الكود

هنقبل كمية من0 إلى100، من string أوint فقط. '0' صحيحة، وnull وfalse وarray والفراغ مرفوضة.

FILTER_VALIDATE_INT تفحص شكل العدد ونطاقه وترجع false للفشل. المقارنة الصارمة مهمة عشان الصفر ما يترفضش.

~~~php
<?php
function quantity(mixed $raw): ?int
{
    if (!is_string($raw) && !is_int($raw)) {
        return null;
    }
    $value = filter_var($raw, FILTER_VALIDATE_INT, [
        'options' => ['min_range' => 0, 'max_range' => 100],
    ]);
    return $value === false ? null : $value;
}
foreach (['0', '100', '101', '12x', null, false, []] as $raw) {
    echo json_encode($raw), ' => ', quantity($raw) ?? 'invalid', PHP_EOL;
}
~~~

اقرأ [functions](/php/07-functions-and-includes/) قبل المثال التنفيذي الكامل: function هنا تفصل قاعدة القبول عن العرض. الأول نفحص النوع، وبعده العدد والنطاق. الناتج0 و100 ثم invalid لباقي الحالات.

**Contract** وصف المدخلات المقبولة والنتيجة المتوقعة. int وحدها ما تمنعش قيمة سالبة؛ قاعدة المجال تحتاج فحصًا مستقلًا.

## الغياب غير القيمة الغلط

مفتاح مفقود ممكن يكون له default معلن. قيمة صريحة غلط ما تستبدلهاش بصمت. **Default** قيمة بديلة لحالة محددة في العقد، مش علاج لكل خطأ.

**Encoding** تحويل القيمة عند عرضها في سياق، زي HTML، عشان تفضل بيانات. مش بديل عن validation. و**Authorization** قرار مين مسموح له يعمل إيه؛ قبول رقم حجز لا يثبت إن المستخدم يملكه.

## تمرين مستقل

اقبل مدة من100 إلى60000. الغياب فقط له default5000؛ '0' والفراغ والقائمة والقيمة الأكبر يترفضوا. اكتب متوقع كل حالة قبل التنفيذ.

<details><summary>راجع القرار</summary>

افصل الغياب قبل الفحص، ومرّر أي قيمة موجودة للتحقق. ما تستخدمش ?: للـdefault لأنها تعتبر '0' قيمة false-like. اختبر99 و100 و60000 و60001.

</details>

## الخلاصة

Parsing وcasting وvalidation وencoding وauthorization مش عملية واحدة. اكتب العقد الأول وبعدين اختار الأداة. [Numeric strings](https://www.php.net/manual/en/language.types.numeric-strings.php).


