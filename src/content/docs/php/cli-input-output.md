---
title: "CLI: Input / Output"
prev: {"link":"/php/05-control-flow/","label":"الشروط والحلقات"}
next: {"link":"/php/07-functions-and-includes/","label":"Functions وCallbacks"}
description: "استقبال Input وعرض Output وفصل التشخيص عن النتائج، مع EOF وExit codes وArguments."
sidebar:
  order: 6.5
---

## البرنامج محتاج يسمع المستخدم

المتطلبات: variable وstring وif. **Input** البيانات اللي البرنامج بيستقبلها، و**Output** النتيجة اللي بيخرجها. الـ**CLI** طريقة تشغيل البرنامج بأمر من terminal؛ والـ**terminal** نافذة لكتابة أوامر واستقبال نتائجها.

**STDIN** قناة دخول البيانات، و**STDOUT** قناة النتائج، و**STDERR** قناة التشخيص. القنوات منفصلة حتى لو ظهرت جنب بعض في نفس النافذة.

**EOF** معناه إن مفيش بيانات تانية في القناة، مش إن المستخدم بعت سطرًا فاضيًا. fgets ترجع string للسطر أوfalse عند نهاية الإدخال أوفشل القراءة. افحص false قبل trim، وهي function تزيل المسافات المعتادة من الأطراف.

## أول مثال كامل

PHP 8.1+، احفظ greeting.php في مجلد تدريب وشغّل php greeting.php. المثال لا يكتب ملفات ولا يتصل بالشبكة.

~~~php
<?php
declare(strict_types=1);

fwrite(STDOUT, "Name: ");
$line = fgets(STDIN);
if ($line === false) {
    fwrite(STDERR, "No input\n");
    exit(2);
}
$name = trim($line);
if ($name === '') {
    fwrite(STDERR, "Name is required\n");
    exit(1);
}
fwrite(STDOUT, "Hello " . $name . PHP_EOL);
~~~

اكتب Omar ثم Enter: يظهر Hello Omar وينتهي البرنامج بكود0. اكتب مسافات: تظهر Name is required وكود1. اقفل STDIN بدون سطر: No input وكود2.

**Exit code** رقم بيرجعه البرنامج للنظام. الرقم0 للنجاح هنا؛ معنى باقي الأرقام جزء من عقد البرنامج. في PowerShell اعرض $LASTEXITCODE، وفي Bash استعمل echo $?.

في Windows إنهاء الإدخال التفاعلي غالبًا Ctrl+Z ثم Enter، وفي Unix غالبًا Ctrl+D. الاختبار الآلي الأدق يبعت قناة مغلقة مباشرة.

## Arguments بدل السؤال التفاعلي

**Argument** قيمة بتتبعت مع أمر تشغيل البرنامج. $argv قائمة النصوص و$argc عدد عناصرها، و$argv[0] اسم السكربت. احفظ hello-arg.php:

~~~php
<?php
if ($argc !== 2) {
    fwrite(STDERR, "Usage: php hello-arg.php NAME\n");
    exit(2);
}
echo "Hello ", $argv[1], PHP_EOL;
~~~

شغّل php hello-arg.php Omar. الناتج Hello Omar. لو مفيش اسم أوفي اسمين، البرنامج يرفض بكود2. وصول argument مش دليل إنها رقم صالح؛ [input validation](/php/input-validation/) تفصل الشكل عن المعنى.

## ليه نفصل القنوات؟

لو برنامج تاني بيقرأ STDOUT كبيانات، رسالة خطأ وسط النتائج ممكن تكسر معالجته. خليك واضح: النتيجة على STDOUT والتشخيص على STDERR. مجرد طباعة سطر مش دليل نجاح.

## جرّب بنفسك

اكتب برنامجًا يقرأ اسم منتج. يقبل '0' كاسم، ويرفض السطر الفاضي، ويرجع2 عند EOF. الناتج الصحيح Product: 0. ما تستخدمش !$line لأنها ممكن تخلط قيمًا مختلفة.

<details><summary>راجع الحل بعد المحاولة</summary>

اقرأ fgets ثم قارن بـ=== false. بعد trim قارن بـ=== ''. اطبع Product: وبعدها الاسم على STDOUT. اختبر '0' ومسافات وEOF كل واحدة لوحدها.

</details>

## الخلاصة

الإدخال string مش رقم جاهز، وEOF مختلف عن السطر الفاضي. افصل النتيجة عن التشخيص وافحص exit code. [مرجع CLI](https://www.php.net/manual/en/features.commandline.io-streams.php).


