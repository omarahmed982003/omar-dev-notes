---
title: 8. PHP CLI وphp.ini والامتدادات
description: اختلاف SAPIs واكتشاف الإعدادات وإدارة extensions وضبط التطوير والإنتاج.
sidebar:
  order: 8
---

## قبل ما تبدأ

ذاكر الدرس على 3 خطوات: افهم المشكلة الأول، تابع المثال، وبعدها جرّب الجزء العملي بنفسك. المصطلحات الجديدة الموجودة تحت متشرحة قبل ما ندخل في التفاصيل.

### كلمات جديدة في الدرس

- **Runtime:** وقت التشغيل: الفترة اللي البرنامج بيكون شغال فيها فعلًا.
- **CLI:** واجهة تتعامل معها بكتابة أوامر نصية بدل الضغط على أزرار.


## SAPI تحدد بيئة التشغيل

PHP قد تعمل عبر CLI أو FPM/FastCGI أو Apache module. نفس الكود قد يقرأ `php.ini` مختلفة ويملك extensions وإعدادات مختلفة.

```bash
php -v
php --ini
php -m
php -i
php -r "echo PHP_SAPI, PHP_EOL;"
```

عند ظهور “يعمل في terminal ولا يعمل في الموقع”، قارن executable وSAPI وملف الإعداد والمستخدم والبيئة.

## ترتيب الإعداد

`php --ini` يعرض الملف الأساسي ومجلد `conf.d`. الملفات الإضافية قد تعدّل قيمة سابقة. داخل التطبيق:

```php
printf(
    "sapi=%s ini=%s memory=%s\n",
    PHP_SAPI,
    php_ini_loaded_file() ?: 'none',
    ini_get('memory_limit'),
);
```

بعض الإعدادات `PHP_INI_SYSTEM` ولا يمكن تغييرها بـ`ini_set()` أثناء الطلب. لا تجعل bootstrap يخفي configuration drift.

## Extensions

```bash
php --ri opcache
php --ri pdo_mysql
composer check-platform-reqs
```

`extension_loaded()` يفيد في فحص واضح، لكن declare requirements في Composer أفضل لمنع نشر بيئة ناقصة.

## Development مقابل Production

في التطوير: أخطاء ظاهرة، Xdebug عند الحاجة، وOPcache بسياسة مناسبة للتغييرات. في الإنتاج: لا تعرض الأخطاء، فعّل logs وOPcache، اضبط limits وtimeouts، وأزل extensions غير اللازمة.

لا تنسخ `php.ini-development` أو `php.ini-production` بلا مراجعة؛ هما baseline وليسا إعداد تطبيقك النهائي.

## CLI scripts

```php
#!/usr/bin/env php
<?php
declare(strict_types=1);

set_time_limit(0);
$options = getopt('', ['dry-run', 'limit:']);
```

أضف exit codes صحيحة، signal handling للـworkers، logging، lock لمنع نسختين، وtimeouts لأي I/O. `set_time_limit(0)` لا يعني أن النظام أو orchestrator لن يقتل العملية.

## مسألة تشغيلية

<details><summary>ليه السلوك يختلف بين CLI والويب؟</summary><p>قد يستخدمان php.ini وSAPI وextensions وuser مختلفين؛ افحص <code>php --ini</code> و<code>phpinfo()</code> لكل بيئة.</p></details>

## شغّل وتحقق

استخدم [المختبر القابل للتنزيل](/php/00-lab-setup/) للسكربتات المرفقة. أوامر Composer وFPM وDocker والخادم الحقيقي تُنفذ داخل المشروع المُجهز للخدمة، مش مجلد فاضي.

نفّذ نقطة التحقق التالية داخل بيئة الدرس:

~~~bash
php --ini
~~~

**معيار النجاح:** حدّد ملف الإعداد المحمّل للـCLI ثم نفّذ <code>php -m</code> وتأكد أن الامتداد المطلوب ظاهر في البيئة نفسها التي تشغّل الأمر.

دوّن كود الخروج والدليل الفعلي. إذا اختلف الناتج، فسر البيئة أو الفرضية التي اختلفت بدل تعديل «المتوقع» حتى يطابق الخطأ.

## اربط النقاط ببعض

INI modes تحدد هل الإعداد يتغير في php.ini أو per-directory أو runtime. قارن <code>php --ini</code> وFPM info لتجنب تعديل ملف CLI فقط. PECL extension يجب أن يطابق PHP ABI والـthread safety والمنصة؛ افحص <code>php -i</code> وstartup errors بعد الترقية.

### جرّب بنفسك

اثبت أن CLI وFPM يحملان الإصدار والـini والامتداد المقصود نفسه.
