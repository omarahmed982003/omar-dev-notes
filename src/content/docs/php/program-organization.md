---
title: "Program organization: ملفات ونقطة دخول واضحة"
prev: {"link":"/php/","label":"دليل PHP"}
next: {"link":"/php/08-files-streams-data/","label":"الملفات والـ Streams وJSON وCSV"}
description: "Program organization: ملفات ونقطة دخول واضحة"
sidebar:
  order: 7.8
---

بعد functions وarray نحتاج نفصل الحساب عن تشغيل البرنامج. **Entry point** ملف يبدأ منه التنفيذ، و**bootstrap** كود تجهيز يحمل الأجزاء المطلوبة. **Working directory** المجلد اللي terminal شغالة منه؛ مش لازم يكون مجلد الملف. هنستخدم require لتنفيذ ملف مطلوب، و__DIR__ لتثبيت مكانه.

## مشروع ملفين: require ينفذ الملف

اعمل مجلدًا فيه `config.php` و`main.php`. ده مشروع كامل بدون Composer. الملف الأول يرجع بيانات؛ الثاني يحتاجها:

~~~php
<?php
// config.php
return ['name' => 'Notebook', 'limit' => 3];
~~~

~~~php
<?php
// main.php
$config = require __DIR__ . '/config.php';
echo $config['name'], ': ', $config['limit'], PHP_EOL;
~~~

~~~text
Notebook: 3
~~~

شغّل `php main.php`. `__DIR__` مجلد الملف الحالي؛ يحميك من اختلاف مجلد التشغيل. `require` يقرأ وينفذ الملف ثم يأخذ return. بدون return صريحة نتيجة التضمين الناجح عادة 1. الملف يرث نطاق مكان التضمين؛ لذلك تجنب اعتمادًا خفيًا على متغيرات خارجية.

`include` تصدر Warning عند الفشل وغالبًا تكمل. `require` ترمي Error في PHP الحديثة، فلا يكمل المسار بدون معالجة. نسختا `_once` تمنعان إعادة تحميل التعريفات. لا تستخدم require_once لقراءة Config ثم تتوقع نفس Array في كل استدعاء؛ التحميل الثاني قد يرجع true. لا تبن مسار التضمين من Input. الدرس 10 ينقل تحميل Classes إلى Composer.

`goto` تقفز إلى label داخل الملف والنطاق نفسه، ولا تدخل بها Loop أو switch من الخارج. مثال `goto done; echo 'skip'; done: echo 'done';` يطبع done، لكن function صغيرة أو break غالبًا أسهل في التتبع.


## جرّب بنفسك

شغّل main.php من مجلده ومن المجلد الأب. غيّر limit في config.php إلى 0 وتتبع الناتج.

<details><summary>راجع بعد المحاولة</summary>

__DIR__ يحدد مكان الملف بصرف النظر عن مكان terminal. require يرجع قيمة return؛ نجاح تحميل الملف وحده مش تحقق من البيانات.

</details>

[ارجع لدليل PHP](/php/).

