---
title: "PHP: من أساس اللغة لتشغيل التطبيقات"
prev: false
next: {"link":"/php/00-lab-setup/","label":"تجهيز المختبرات وتشغيل الأمثلة"}
description: "مسار واحد للغة PHP وبناء تطبيقات الويب، ثم أدوات التشغيل والاختبارات والأداء والإنتاج."
sidebar:
  order: 0
---

# PHP من أساس اللغة لتشغيل التطبيقات

المسار ده يبدأ معاك من أساسيات PHP، وبعدها يبني كل فكرة على اللي قبلها لحد ما تقدر تقرأ برنامج ويب وتفهم أجزاؤه. كل درس فيه أمثلة عملية وحالات شائعة وأخطاء لازم تعرف سببها وطريقة إصلاحها.

## امشِ على مراحل، مش قائمة واحدة طويلة

الكارد بتجمع اللغة والتشغيل، لكن مش لازم تذاكر أدوات الإنتاج كلها قبل أول برنامج. **Runtime** بيئة تنفيذ الكود، و**Production** بيئة الخدمة اللي الناس بتستخدمها؛ فهمهم بييجي بعد تطبيق بسيط تقدر تختبره.

1. **ابدأ باللغة:** أول ملف، القيم وvariables والأنواع، الإخراج، العمليات، الشروط والحلقات، functions وarrays والنصوص. أرقام الدروس الحالية محفوظة كعناوين مرجعية؛ العمليات قبل الشروط في قراءة البداية، وarrays قبل تطبيقات الملفات.
2. **ابنِ تطبيقًا صغيرًا:** الملفات والأخطاء وComposer الأساسي، ثم النماذج وsessions والوقت وRequest/Response، وبعدها مشروع دفتر الملاحظات. معرفة HTML وHTTP وfunctions مطلوبة قبل جزء الويب. ميزات الكائنات المتقدمة في درس16 مرجع لاحق بعد OOP، مش شرط إنهاء المشروع.
3. **شغّل التطبيق وافحصه:** [CLI والإعدادات والامتدادات](/php-runtime/08-cli-ini-extensions/)، ثم [إعداد التطبيق](/php-runtime/07-environment-configuration/)، و[اعتماديات الإنتاج](/php-runtime/01-composer-dependencies/)، و[الاختبارات](/php-runtime/10-testing-quality/). بعد مشروع عامل ومعرفة Linux الأساسية، انتقل إلى [خادم الويب](/php-runtime/06-web-servers-fastcgi/)، ثم [FPM](/php-runtime/05-php-fpm-processes/)، و[OPcache](/php-runtime/03-opcache-preloading/)، و[السجلات](/php-runtime/09-logging-observability/)، و[النشر](/php-runtime/13-deployment-cicd-containers/).
4. **ارجع للتعمق عند الحاجة:** Redis والطوابير والتوسع وقياس الأداء والتعافي والتشغيل طويل العمر. تحتاج تطبيقًا مختبرًا وأساس SQL/transactions للتجارب المعتمدة على البيانات؛ مش متطلبات لأول برنامج PHP.

**نقطة توقف البداية:** تقدر تشغّل مشروعًا صغيرًا، تفسر طلبًا كاملًا، وتثبت رفض مدخل خاطئ بلا حفظ؟ انتقل لقسم التشغيل بالتدريج. مجرد قراءة الصفحات مش اجتيازًا أوإذن نشر خدمة حقيقية.

[افتح دليل التشغيل وأدوات الإنتاج داخل نفس المسار](/php-runtime/). Composer في درس10 لبناء أول مشروع؛ درسه التشغيلي للـrelease والـautoload المحسن. الاختبارات تبدأ مع الأمثلة، ودرس جودة الكود يعمقها لاحقًا. المختبر العام فيه تجارب تخص مسارات تانية؛ اختار تجربة الدرس فقط.

## ترتيب الدراسة الفعلي

كل موضوع له مكان واحد في الملاحة. خلص مشروع البداية قبل تعمق production؛ الأنواع المتقدمة وميزات OOP للرجوع بعد أساس الكائنات.

### ابدأ هنا

- [تجهيز المختبرات وتشغيل الأمثلة](/php/00-lab-setup/)

### أساس اللغة

- [مقدمة وصياغة PHP](/php/01-introduction-and-syntax/)
- [Variables وReferences](/php/02-variables-scope-superglobals/)
- [أنواع البيانات ونظام الأنواع](/php/03-types/)
- [Output وDebugging](/php/04-output-debugging-constants/)
- [Constants: قيم باسم ثابت](/php/constants/)
- [التعبيرات والمؤثرات](/php/06-expressions-operators/)
- [الشروط والحلقات](/php/05-control-flow/)
- [CLI: Input / Output](/php/cli-input-output/)
- [Functions وCallbacks](/php/07-functions-and-includes/)
- [Scope: مين يقدر يشوف الـvariable؟](/php/scope/)
- [Errors وExceptions](/php/11-errors-exceptions/)
- [المصفوفات وأدوات التحويل](/php/12-arrays-functional-tools/)
- [Input validation: من string لقيمة موثوقة](/php/input-validation/)
- [Strings وUnicode](/php/13-strings-unicode-regex/)
- [Regex: افحص شكل string واقرأ النتيجة](/php/regex/)
- [مشروع CLI: مصروفات من غير web](/php/cli-expenses-project/)
- [أول Test آلي يحمي البرنامج](/php/first-tests/)

### من برنامج صغير لتطبيق web

- [Program organization: ملفات ونقطة دخول واضحة](/php/program-organization/)
- [الملفات والـ Streams وJSON وCSV](/php/08-files-streams-data/)
- [Namespaces وComposer وأدوات الجودة](/php/10-namespaces-autoloading/)
- [التاريخ والوقت والمناطق الزمنية](/php/14-datetime-timezones/)
- [Request input وSuperglobals](/php/request-input/)
- [Cookies وSessions](/php/09-uploads-cookies-sessions/)
- [File uploads: من form لتخزين private](/php/file-uploads/)
- [من HTTP Request إلى Router وResponse](/php/15-request-router-response/)
- [مشروع دفتر الملاحظات وDebugging عملي](/php/17-integrated-programs-debugging/)

### تشغيل التطبيق والتحقق منه

- [قسم التشغيل وأدوات الإنتاج — PHP](/php-runtime/)
- [PHP CLI وphp.ini والامتدادات](/php-runtime/08-cli-ini-extensions/)
- [Environment variables وConfiguration](/php-runtime/07-environment-configuration/)
- [Composer وإدارة الاعتماديات](/php-runtime/01-composer-dependencies/)
- [الاختبارات وجودة الكود](/php-runtime/10-testing-quality/)
- [أمان الاعتماديات وSupply Chain](/php-runtime/14-dependency-supply-chain-security/)
- [cURL وعملاء HTTP](/php-runtime/02-curl-http-clients/)
- [Apache وNginx وFastCGI](/php-runtime/06-web-servers-fastcgi/)
- [PHP-FPM وإدارة العمليات](/php-runtime/05-php-fpm-processes/)
- [OPcache وPreloading](/php-runtime/03-opcache-preloading/)
- [Logging وObservability](/php-runtime/09-logging-observability/)
- [Deployment وCI/CD وContainers](/php-runtime/13-deployment-cicd-containers/)

### ارجع للتعمق بعد التطبيق

- [Generators: بيانات على قد الاحتياج](/php/generators/)
- [خريطة ميزات PHP الحديثة 8.0–8.5](/php/16-modern-php-features/)
- [ذاكرة PHP وGarbage Collection](/php-runtime/04-memory-garbage-collection/)
- [Data Caching وRedis](/php-runtime/11-data-caching-redis/)
- [Queues وWorkers وScheduling](/php-runtime/12-queues-workers-scheduling/)
- [Profiling وSLI/SLO وOpenTelemetry](/php-runtime/15-profiling-slo-opentelemetry/)
- [المرونة وإدارة Workers](/php-runtime/16-resilience-workers/)
- [Disaster Recovery واختبار الاستعادة](/php-runtime/17-disaster-recovery/)
- [Sessions وShared State عند التوسع](/php-runtime/18-sessions-shared-state/)
- [اتصالات قاعدة البيانات وتشغيلها](/php-runtime/19-database-runtime-operations/)
- [PHP طويلة العمر وWorker Runtimes](/php-runtime/20-long-running-php/)

:::tip[طريقة المذاكرة]
نفّذ كل مثال، ثم غيّر المدخلات وتوقع النتيجة قبل التشغيل. الأمثلة الأمنية ليست إضافات اختيارية؛ هي جزء من الاستخدام الصحيح لـ PHP.
:::

## أول برنامج

```php
<?php

echo 'Hello PHP', PHP_EOL;
```

احفظ المثال باسم `hello.php` وشغّل `php hello.php` بعد تجهيز PHP CLI، وهي طريقة تشغيل PHP بأمر نصي. `<?php` بداية كود PHP، و`echo` تعرض النص، و`PHP_EOL` تضيف نهاية سطر. المتوقع `Hello PHP` في سطر واحد. مش محتاج Functions أوDatabase علشان تبدأ.

> الأمثلة مكتوبة لـ PHP 8.x، وأي ميزة تحتاج إصدارًا أحدث مذكور إصدارها بجوارها.


[ابدأ بتجهيز المختبرات والأمثلة القابلة للتنزيل](/php/00-lab-setup/).

## مشروع يتطور معك

ابدأ ببرامج CLI الصغيرة في مرحلة أساس اللغة، وبعدها امشِ مع مرحلة الويب: مشروع Composer ثم API ثم دفتر الملاحظات. [حمّل الملفات الكاملة](/downloads/php-course.zip): برامج CLI، وبرامج الدروس، ونموذج Session وFile upload، ومشروع Composer مع lock واختبارات، ودفتر الملاحظات. ترتيب المراحل فوق وفي sidebar هو ترتيب القراءة؛ الأرقام القديمة في الروابط مش ترتيب مطلوب للدراسة.
