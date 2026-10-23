---
title: "تجهيز المختبرات وتشغيل الأمثلة"
prev: {"link":"/php/","label":"PHP: من أساس اللغة لتشغيل التطبيقات"}
next: {"link":"/php/","label":"دليل PHP"}
description: "PHP labs, fixtures, reproducible tests and expected results."
sidebar:
  order: 0.5
---

هنا هتجهز ملفات تقدر تشغّلها فعلًا، وتعرف الفرق بين اختبار function محلي واختبار خدمة كاملة. ابدأ بأساسيات PHP لو لسه مش عارف variables وfunctions؛ ارجع للملفات بالتدريج مع كل درس.

## أول برنامج: أقل متطلبات

في البداية تحتاج PHP CLI وterminal ومحرر ملفات فقط. الـCLI تشغيل PHP بأمر، والـterminal نافذة كتابة الأوامر. شغّل `php -v`، واحفظ ملف hello.php فيه `<?php echo "Hello", PHP_EOL;` ثم شغّل `php hello.php`. المتوقع Hello. لا تحتاج Database أوComposer أوDocker لأول تجربة.

بعد functions اختار مثال الدرس من [حزمة المنهج](/downloads/php-course.zip). اختبارات SQLite وSodium والمخزون اللي تحت اختيارية لحد ما توصل لموضوعها؛ مش بوابة دخول PHP. لكل code block إصدار ومتطلبات ومجلد تنفيذ، فامشِ مع الدرس بدل تشغيل كل المختبر مرة واحدة.

## المختبر الموسع بعد أساس اللغة

نزّل [ملفات المختبر](/downloads/php-labs.zip) وفك الضغط، ثم افتح الطرفية داخل مجلد `php-labs`. لو بتستخدم نسخة المشروع، الملفات في `examples/php-labs`. ثبّت PHP 8.4 أو أحدث، ثم افحص:

```bash
php -v
php -m
php tests.php
```

المختبر الأساسي يحتاج `pdo_sqlite` و`sodium` و`mbstring`، واختبار HTTP يحتاج `curl`. مافيش مكتبات خارجية مطلوبة للاختبارات الأساسية. PHP 8.5 مطلوب للأمثلة المكتوب عليها 8.5 تحديدًا في درس الميزات الحديثة. لو ظهر “could not find driver”، فعّل `pdo_sqlite` في ملف الإعداد الذي يعرضه `php --ini` لنفس PHP اللي بتشغله.

الناتج مجموعة سطور `PASS`، وفي النهاية `failures=0`. كود الخروج 0 يعني نجاح؛ أي إخفاق يرجع 1. الاختبارات تستخدم استثناءات صريحة، مش `assert` ممكن يتعطل من إعدادات PHP. لقراية كود الخروج استخدم `$LASTEXITCODE` في PowerShell أو `echo $?` في Bash.

## اختار الاختبار المناسب

| الأمر | ماذا يختبر؟ |
|---|---|
| `php tests.php values` | صيغة المبالغ وحدود الجمع والتحويل وقوائم المعرّفات |
| `php tests.php php` | Attributes وCSV والمراجع وUnicode والتاريخ |
| `php tests.php security` | سياسة Claims بعد التوقيع وCSRF والسياق المشفّر وسياسة الـhash |
| `php tests.php inventory` | معاملة شراء وتكرار الطلب وrollback والقيود |
| `php locking-lab.php` | عمليتان تتنافسان على نفس مخزون SQLite |
| `php total.php 12.50 3.25` | جمع يطبع `15.75` |
| `php orders.php fixtures/orders.json` | قراءة طلبات JSON صحيحة مع حدود المدخلات |
| `php stream-lab.php fixtures/large.csv` | قراءة 10000 سجل CSV تدريجيًا |
| `php orm-query-lab.php` | مقارنة 21 استعلامًا باستعلامين لتحميل العلاقات |
| `php restore-verify.php` | إنشاء لقطة SQLite وفتحها والتحقق من قيودها وبياناتها |

قاعدة SQLite في الذاكرة بتبدأ من جديد كل تشغيل. اختبار التزامن والاستعادة ينشئ ملفًا مؤقتًا خاصًا به ويحذفه بعد الانتهاء؛ مابيتصلش بقاعدة مشروعك.

## HTTP حقيقي على جهازك

في طرفية أولى، من مجلد المختبر:

```bash
php -S 127.0.0.1:8097 http-router.php
```

وفي طرفية ثانية من نفس المجلد:

```bash
php http-client-lab.php
```

المتوقع `status=200` و`server_error=500` و`conditional=304` و`timeout_handled=yes`. افتح `http-router.php` لفهم كل مسار، و`src/Http.php` لفهم تحليل ETag. أوقف خادم PHP بـCtrl+C. ده خادم تطوير محلي، والاختبار لا يقيس FPM أو HTTPS أو حمل الإنتاج.

## اقرأ الملفات بالترتيب

`bootstrap.php` يحمل functions بمسارات تبدأ من `__DIR__`، وهو مجلد الملف نفسه؛ كده الاستدعاء مايعتمدش على مكان الطرفية. `src/Values.php` لقواعد القيم، و`schema.sql` للجداول وبيانات البداية، و`src/Inventory.php` للمعاملة، و`tests.php` للأمثلة المتوقعة والفاشلة.

الـfixture ملف بمدخلات ثابتة معروفة علشان تقدر تكرر التجربة. `fixtures/broken.json` خطأ متعمد: شغّل مستورد الطلبات عليه وتوقع رفض صيغة JSON، مش نجاحًا بلا بيانات. غيّر نسخة من المدخلات، لا النتيجة المتوقعة، وشوف أي قاعدة انكسرت.

## حدود الدليل العملي

`cache-lab.php` يشرح ترتيب أحداث السباق داخل نموذج محلي؛ لا يشغل Redis. `profiling-lab.php` يحسب percentiles لعينة ثابتة؛ لا يرسل traces. اختبارات JWT هنا تفحص claims بعد التحقق، ولا تنفذ بروتوكول هوية كاملًا. نجاح SQLite لا يثبت درجات العزل أو deadlocks في PostgreSQL/MySQL. أكمل تجارب التشغيل الخاصة بكل خدمة في بيئة اختبار معزولة بالمحرك والإعداد الحقيقيين.
