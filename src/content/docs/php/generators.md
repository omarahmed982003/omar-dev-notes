---
title: "Generators: بيانات على قد الاحتياج"
prev: {"link":"/php/","label":"دليل PHP"}
next: {"link":"/php/16-modern-php-features/","label":"خريطة ميزات PHP الحديثة 8.0–8.5"}
description: "Generators: بيانات على قد الاحتياج"
sidebar:
  order: 16.2
---

بعد functions وarray وforeach وfiles. **Generator** كائن يمثل تنفيذ function متوقفًا عند yield، ويكمل لما نطلب عنصرًا. **Iteration** المرور على عناصر، و**eager** يبني النتائج كلها مقدمًا، و**lazy** يؤجل العمل لوقت طلبه. مش كل lazy أسرع، وتحويل النتيجة لـarray يلغي ميزة عدم تجميعها.

## Generator: عنصر عند الطلب، مش Array كاملة

**Generator function** هي function فيها `yield`. استدعاؤها يرجع object من نوع `Generator`، وجسمها يتقدم أثناء `foreach`. الـobject بيحتفظ بمكان التنفيذ والـvariables بين العناصر. `yield from` تفوض إنتاج العناصر لمصدر تاني. احفظ `generator.php`؛ الكود متوافق مع PHP 7.0+ لكن استخدم بيئة PHP مدعومة:

~~~php
<?php
function batches(): Generator
{
    echo "begin", PHP_EOL;
    yield from [10, 20];
    yield from [30];
    echo "end", PHP_EOL;
}
$items = batches();
echo "created", PHP_EOL;
foreach ($items as $key => $value) {
    echo "{$key}:{$value}", PHP_EOL;
}
echo implode(',', iterator_to_array(batches(), false)), PHP_EOL;
~~~

~~~text
created
begin
0:10
1:20
0:30
end
begin
end
10,20,30
~~~

created قبل begin تثبت أن الاستدعاء لم يبن القائمة. المفتاح 0 يتكرر لأن yield from تحافظ على مفاتيح المصدر؛ `iterator_to_array(..., false)` يعيد الترقيم فلا يفقد 10. الخيار الافتراضي يحافظ على المفاتيح وقد يستبدل المتكرر. التحويل إلى Array يحمل كل العناصر، فيفقد ميزة الذاكرة. لإعادة المرور أنشئ Generator جديدة؛ لا تفترض rewind بعد استهلاكها.

في ملفات كبيرة اجعل Generator تقرأ سطرًا داخل try/finally وتقفل المقبض عند انتهائها أو تدميرها. الاحتفاظ بـGenerator متوقفة يحتفظ بمواردها. `yield from` لا تجعل القراءة غير متزامنة.


## جرّب بنفسك

قارن iterator_to_array(batches()) مع iterator_to_array(batches(), false). توقع أثر تكرار المفتاح 0.

<details><summary>راجع بعد المحاولة</summary>

الافتراضي يحافظ على keys فتستبدل القيمة السابقة لنفس key. false يعيد الترقيم ويحفظ كل القيم. أنشئ Generator جديدة لكل تجربة.

</details>

## توقع وشخّص

<details><summary>توقع وقت ظهور begin عند استدعاء batches فقط</summary><p>لن يظهر حتى تبدأ التكرار. Generator مؤجلة؛ تحويلها إلى Array يستهلكها بالكامل وقد يستهلك ذاكرة كبيرة.</p></details>

<div class="quiz-list" role="list">
<section class="quiz-card" role="listitem"><div class="quiz-question-row"><span class="quiz-number">01</span><p>اكتب Generator ينتج الأعداد الزوجية من 2 إلى حد أقصى، ثم اطبع أول أربع قيم.</p></div><details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>خط الحل:</strong> ابدأ Loop من 2 وزوّد 2 كل مرة واستخدم <code>yield</code>. عند حد أقصى 8 سيكون الناتج 2 و4 و6 و8 من غير بناء Array مسبقًا.</div></details></section>
</div>

[ارجع لدليل PHP](/php/).

