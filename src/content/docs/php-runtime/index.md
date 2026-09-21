---
title: تشغيل PHP وأدوات الإنتاج
description: Composer وcURL وOPcache وإدارة الذاكرة وPHP-FPM وخوادم الويب ومتغيرات البيئة.
sidebar:
  order: 0
---

# تشغيل PHP من التطوير إلى الإنتاج

يحوّل هذا القسم الصفحات **78–86** من الملاحظات إلى مسار متكامل يشرح الأدوات والطبقات التي تحيط بتطبيق PHP بعد كتابة الكود. صححنا المعلومات المرتبطة بمحرك PHP الحديث، وفصلنا بين مسؤولية مدير الحزم وعميل HTTP وخادم الويب وPHP-FPM.

## لماذا هو قسم مستقل؟

هذه الموضوعات ليست جزءًا من OOP، وليست مجرد صياغة للغة PHP. إنها طبقة **Runtime & Production**: تثبيت الاعتماديات، تحميل الأصناف، تنفيذ PHP بكفاءة، الاتصال بخدمات خارجية، إدارة العمليات، وتمرير الإعدادات بأمان.

## خريطة الدروس

1. [Composer وإدارة الاعتماديات](./01-composer-dependencies/) — `composer.json` و`composer.lock` و`install` و`update` وPSR-4.
2. [cURL وعملاء HTTP](./02-curl-http-clients/) — libcurl وامتداد PHP وGuzzle والمهلات والتحقق من TLS.
3. [OPcache وPreloading](./03-opcache-preloading/) — Opcode cache، الإعداد للإنتاج، القياس، وحدود Preloading.
4. [ذاكرة PHP وGarbage Collection](./04-memory-garbage-collection/) — zval وReference Counting وCopy-on-write والدورات المرجعية.
5. [PHP-FPM وإدارة العمليات](./05-php-fpm-processes/) — Master وWorkers وPools وأنماط `static` و`dynamic` و`ondemand`.
6. [Apache وNginx وFastCGI](./06-web-servers-fastcgi/) — مسار الطلب والـMPM والـEvent Loop والاتصال بـFPM.
7. [متغيرات البيئة وإدارة الإعدادات](./07-environment-configuration/) — `getenv()` و`$_ENV` و`.env` والأسرار.
8. [PHP CLI وphp.ini والامتدادات](./08-cli-ini-extensions/) — SAPIs واكتشاف الإعداد وextensions.
9. [Logging وObservability](./09-logging-observability/) — PSR-3 وstructured logs وmetrics وtraces.
10. [الاختبارات وجودة الكود](./10-testing-quality/) — PHPUnit وdoubles وcoverage والتحليل الساكن.
11. [Data Caching وRedis](./11-data-caching-redis/) — Cache-aside وTTL وinvalidation وstampede.
12. [Queues وWorkers](./12-queues-workers-scheduling/) — Idempotency وretry وDLQ وscheduling.
13. [Deployment وCI/CD وContainers](./13-deployment-cicd-containers/) — artifacts وhealth checks وrollout وrollback.
14. [أمان الاعتماديات](./14-dependency-supply-chain-security/) — Composer audit والسياسات وplugins وCI.

:::tip[الخيط الذي يربط الدروس]
المتصفح يتصل بخادم الويب، والخادم يمرر طلب PHP إلى FPM، والـWorker يشغّل كودًا حمّله Composer ويستفيد من OPcache، وقد يستدعي خدمة خارجية عبر cURL. الإعدادات والأسرار تصل من البيئة، والذاكرة تُدار داخل كل Worker.
:::

## مسار طلب إنتاجي مختصر

```text
Client
  -> Nginx / Apache (TLS, static files, routing)
  -> FastCGI
  -> PHP-FPM pool
  -> Composer autoloader + OPcache
  -> Application / Database / External API
  <- HTTP response
```

> الأمثلة تستهدف PHP 8.x. إعدادات الخادم أمثلة تعليمية ويجب تكييف المستخدمين والمسارات والسعة مع نظام التشغيل والموارد الفعلية.

## مراجع رسمية

- [الاستخدام الأساسي لـComposer](https://getcomposer.org/doc/01-basic-usage.md) و[تحسين الـAutoloader](https://getcomposer.org/doc/articles/autoloader-optimization.md)
- [توثيق cURL وlibcurl](https://curl.se/docs/)
- [OPcache](https://www.php.net/manual/en/book.opcache.php) و[Preloading](https://www.php.net/opcache.preloading.php)
- [Garbage Collection في PHP](https://www.php.net/manual/en/features.gc.php)
- [PHP-FPM](https://www.php.net/manual/en/install.fpm.php)
- [Nginx FastCGI](https://nginx.org/en/docs/http/ngx_http_fastcgi_module.html) و[Apache MPM](https://httpd.apache.org/docs/2.4/mpm.html)
- [getenv()](https://www.php.net/getenv) و[`$_ENV`](https://www.php.net/manual/en/reserved.variables.environment.php)
