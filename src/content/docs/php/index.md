---
title: PHP
description: مسار شامل يبدأ بأساسيات PHP ويتدرج إلى بناء برامج ويب قابلة للفهم والتجربة.
sidebar:
  order: 0
---

# PHP من الصفر إلى التعامل مع الطلب والملفات والجلسات

المسار ده يبدأ معاك من أساسيات PHP، وبعدها يبني كل فكرة على اللي قبلها لحد ما تقدر تقرأ برنامج ويب وتفهم أجزاؤه. كل درس فيه أمثلة عملية وحالات شائعة وأخطاء لازم تعرف سببها وطريقة إصلاحها.

## خريطة الدروس

1. [مقدمة وصياغة PHP](/php/01-introduction-and-syntax/) — ما PHP؟ وكيف تعمل؟ والوسوم والتعليقات والدمج مع HTML.
2. [المتغيرات والنطاق وSuperglobals](/php/02-variables-scope-superglobals/) — الإسناد بالقيمة والمرجع والمتغيرات المتغيرة ونطاق المتغير.
3. [أنواع البيانات ونظام الأنواع](/php/03-types/) — الأنواع الأساسية والمركبة و`callable` و`iterable` وUnion/Intersection والكتابة الصارمة.
4. [الإخراج والتصحيح والثوابت](/php/04-output-debugging-constants/) — `echo` و`print` و`var_dump` و`const` و`define`.
5. [الشروط والحلقات](/php/05-control-flow/) — `if` و`switch` و`match` والحلقات و`foreach` بالمرجع.
6. [التعبيرات والمؤثرات](/php/06-expressions-operators/) — الأولوية والمقارنة والمنطق والمصفوفات والتنفيذ وPipe Operator.
7. [الدوال والـ Callbacks وتضمين الملفات](/php/07-functions-and-includes/) — الدوال المجهولة وArrow Functions وFirst-class Callables و`include` و`require`.
8. [الملفات والـ Streams وJSON وCSV](/php/08-files-streams-data/) — أوضاع `fopen` والصلاحيات والـ wrappers والـ contexts والفلاتر.
9. [رفع الملفات والكوكيز والجلسات](/php/09-uploads-cookies-sessions/) — رفع آمن، إعدادات Cookies، ودورة حياة Session.
10. [Namespaces وAutoloading](/php/10-namespaces-autoloading/) — تنظيم الأسماء والاستيراد وربط PSR-4.
11. [الأخطاء والاستثناءات](/php/11-errors-exceptions/) — Throwable والاستثناءات المخصصة وحدود المعالجة.
12. [المصفوفات وأدوات التحويل](/php/12-arrays-functional-tools/) — map وfilter وreduce والفرز والذاكرة.
13. [النصوص وUnicode وRegex](/php/13-strings-unicode-regex/) — UTF-8 وmbstring والتطبيع والـpatterns الآمنة.
14. [التاريخ والوقت](/php/14-datetime-timezones/) — UTC وDateTimeImmutable وtimezones وDST.
15. [Request وRouter وResponse](/php/15-request-router-response/) — Front Controller وJSON وMiddleware.
16. [خريطة ميزات PHP الحديثة](/php/16-modern-php-features/) — PHP 8.0–8.5 وWeakMap وFibers وDNF وReadonly وHooks.
17. [برامج مترابطة وDebugging عملي](/php/17-integrated-programs-debugging/) — برامج CLI وStreaming وJSON وتمارين توقع الناتج وتصحيح الأخطاء.

:::tip[طريقة المذاكرة]
نفّذ كل مثال، ثم غيّر المدخلات وتوقع النتيجة قبل التشغيل. الأمثلة الأمنية ليست إضافات اختيارية؛ هي جزء من الاستخدام الصحيح لـ PHP.
:::

## أول برنامج

```php
<?php

declare(strict_types=1);

function greet(string $name): string
{
    return "مرحبًا {$name}";
}

echo greet('عمر');
```

> الأمثلة مكتوبة لـ PHP 8.x، وأي ميزة تحتاج إصدارًا أحدث مذكور إصدارها بجوارها.


[ابدأ بتجهيز المختبرات والأمثلة القابلة للتنزيل](/php/00-lab-setup/).
