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
composer check-platform-reqs --lock --no-dev
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

## دورة حياة PHP والترقية

لا يكفي أن تقول إن التطبيق يدعم PHP 8.x. سجّل أقل وأعلى minor مختبرة، وتاريخ انتهاء الدعم، ونسخ extensions. قبل الترقية:

1. اقرأ Migration Guide والـbackward-incompatible changes والـdeprecations.
2. شغّل الاختبارات والتحليل الساكن على النسختين في CI.
3. ابنِ image جديدة بكل extensions بدل استبدال binary وحدها.
4. راقب startup warnings وOPcache وFPM errors في canary.
5. احتفظ بخطة rollback متوافقة مع schema وqueue payload.

تعامل مع `E_DEPRECATED` كإشارة عمل مبكرًا في CI، لا كسبب لعرض الأخطاء للمستخدم. افصل `display_errors=Off` عن `error_reporting=E_ALL`: يمكن تسجيل الخطأ كاملًا مع إخفائه عن response.

## الأعطال المبكرة وExtension ABI

افحص startup errors قبل health check. extension مبنية لـPHP ABI أو thread-safety مختلف قد تفشل قبل تشغيل التطبيق. ثبّت مصدر الحزمة ونسختها داخل image، ثم نفّذ:

~~~bash
php -v
php --ini
php -m
php --ri opcache
composer check-platform-reqs --lock --no-dev
~~~

قارن CLI وFPM من endpoint داخلي محمي، واختبر fatal startup وغياب extension عمدًا. لا تعرض `phpinfo()` للعامة؛ يحتوي paths وإعدادات وبيانات بيئة.

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

#### دورة التجربة

قبل التنفيذ اكتب توقعك، ثم شغّل المثال وسجّل الخروج. أحدث فشلًا واحدًا مقصودًا، اجمع الدليل من logs أو metrics، أصلح السبب، وأعد التشغيل لإثبات أن الإصلاح يعالج العطل ولا يخفيه.


### جرّب بنفسك

اثبت أن CLI وFPM يحملان الإصدار والـini والامتداد المقصود نفسه.
