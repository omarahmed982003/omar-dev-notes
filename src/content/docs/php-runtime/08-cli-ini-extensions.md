---
title: 8. PHP CLI وphp.ini والامتدادات
description: اختلاف SAPIs واكتشاف الإعدادات وإدارة extensions وضبط التطوير والإنتاج.
sidebar:
  order: 8
---

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

