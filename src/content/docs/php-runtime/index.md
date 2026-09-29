---
title: تشغيل PHP وأدوات الإنتاج
description: من Composer وOPcache وPHP-FPM إلى الاختبارات وRedis والطوابير والنشر والمراقبة والمرونة والتعافي.
sidebar:
  order: 0
---

# تشغيل PHP من التطوير إلى الإنتاج

المسار ده يشرح الأدوات والطبقات اللي بتحيط بتطبيق PHP بعد كتابة الكود. هتتعرف بالتدريج على مسؤولية مدير الحزم وعميل HTTP وخادم الويب وPHP-FPM، وإزاي تفرّق بين دور كل جزء.

## لماذا هو قسم مستقل؟

هذه الموضوعات ليست جزءًا من OOP، وليست مجرد صياغة للغة PHP. إنها طبقة **Runtime & Production**: تثبيت الاعتماديات، تحميل الأصناف، تنفيذ PHP بكفاءة، الاتصال بخدمات خارجية، إدارة العمليات، وتمرير الإعدادات بأمان.

## خريطة الدروس

1. [Composer وإدارة الاعتماديات](/php-runtime/01-composer-dependencies/) — `composer.json` و`composer.lock` و`install` و`update` وPSR-4.
2. [cURL وعملاء HTTP](/php-runtime/02-curl-http-clients/) — libcurl وامتداد PHP وGuzzle والمهلات والتحقق من TLS.
3. [OPcache وPreloading](/php-runtime/03-opcache-preloading/) — Opcode cache، الإعداد للإنتاج، القياس، وحدود Preloading.
4. [ذاكرة PHP وGarbage Collection](/php-runtime/04-memory-garbage-collection/) — zval وReference Counting وCopy-on-write والدورات المرجعية.
5. [PHP-FPM وإدارة العمليات](/php-runtime/05-php-fpm-processes/) — Master وWorkers وPools وأنماط `static` و`dynamic` و`ondemand`.
6. [Apache وNginx وFastCGI](/php-runtime/06-web-servers-fastcgi/) — مسار الطلب والـMPM والـEvent Loop والاتصال بـFPM.
7. [متغيرات البيئة وإدارة الإعدادات](/php-runtime/07-environment-configuration/) — `getenv()` و`$_ENV` و`.env` والأسرار.
8. [PHP CLI وphp.ini والامتدادات](/php-runtime/08-cli-ini-extensions/) — SAPIs واكتشاف الإعداد وextensions.
9. [Logging وObservability](/php-runtime/09-logging-observability/) — PSR-3 وstructured logs وmetrics وtraces.
10. [الاختبارات وجودة الكود](/php-runtime/10-testing-quality/) — PHPUnit وdoubles وcoverage والتحليل الساكن.
11. [Data Caching وRedis](/php-runtime/11-data-caching-redis/) — Cache-aside وTTL وinvalidation وstampede.
12. [Queues وWorkers](/php-runtime/12-queues-workers-scheduling/) — Idempotency وretry وDLQ وscheduling.
13. [Deployment وCI/CD وContainers](/php-runtime/13-deployment-cicd-containers/) — artifacts وhealth checks وrollout وrollback.
14. [أمان الاعتماديات](/php-runtime/14-dependency-supply-chain-security/) — Composer audit والسياسات وplugins وCI.
15. [Profiling وSLI/SLO وOpenTelemetry](/php-runtime/15-profiling-slo-opentelemetry/) — Flame Graphs وPercentiles وأهداف الخدمة وانتقال Trace Context.
16. [المرونة وإدارة Workers](/php-runtime/16-resilience-workers/) — Circuit Breaker وBulkhead وBackpressure وSignals وsystemd.
17. [Disaster Recovery واختبار الاستعادة](/php-runtime/17-disaster-recovery/) — RPO وRTO والنسخ والاسترجاع وGame Days.
18. [Sessions وShared State عند التوسع](/php-runtime/18-sessions-shared-state/) — التخزين المشترك والقفل وTTL والتوافق بين النسخ.
19. [اتصالات قاعدة البيانات وتشغيلها](/php-runtime/19-database-runtime-operations/) — ميزانية الاتصالات والمهلات والـpooling والـreplicas.
20. [PHP طويلة العمر وWorker Runtimes](/php-runtime/20-long-running-php/) — FrankenPHP وRoadRunner وSwoole وتسرب الحالة وإعادة الضبط.

## بروتوكول التجربة في كل درس

كل تمرين يمر بخمس خطوات: توقّع النتيجة، شغّل الأمر، أحدث عطلًا مقصودًا، اجمع دليلًا من الخروج أو logs أو metrics، ثم أصلح السبب وأعد الاختبار. نجاح الأمر وحده ليس دليلًا كافيًا من دون معيار قبول يمكن مراجعته.

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
- [إعداد الجلسات](https://www.php.net/manual/en/session.configuration.php) و[إدارة اتصالات PDO](https://www.php.net/manual/en/pdo.connections.php)
- [FrankenPHP Worker Mode](https://frankenphp.dev/docs/worker/)
- [Nginx FastCGI](https://nginx.org/en/docs/http/ngx_http_fastcgi_module.html) و[Apache MPM](https://httpd.apache.org/docs/2.4/mpm.html)
- [getenv()](https://www.php.net/getenv) و[`$_ENV`](https://www.php.net/manual/en/reserved.variables.environment.php)
