---
title: 5. PHP-FPM وإدارة العمليات
description: FastCGI وMaster وWorkers وPools وأنماط static وdynamic وondemand وحساب السعة والمراقبة.
sidebar:
  order: 5
---

# PHP-FPM ليس خادم HTTP

PHP-FPM اختصار **FastCGI Process Manager**، وهو التنفيذ الأساسي لـFastCGI في PHP. يستقبل طلبات FastCGI من خادم موثوق مثل Nginx أو Apache، يدير مجموعة عمليات PHP، ثم يعيد الاستجابة.

```text
Nginx/Apache -> FastCGI socket -> FPM master -> worker -> PHP response
```

:::danger
لا تعرّض منفذ PHP-FPM لشبكة غير موثوقة. عميل FastCGI يستطيع تمرير إعدادات تؤثر في تنفيذ الطلب؛ اربطه بـUnix socket أو interface داخلي واضبط الصلاحيات و`listen.allowed_clients` عند TCP.
:::

## Master وWorkers

- Master process يقرأ إعدادات pools ويدير الإنشاء والإيقاف وإعادة التحميل.
- Worker process يعالج طلب PHP واحدًا في اللحظة في النموذج المعتاد.
- Pool يعزل مجموعة workers بإعدادات مثل user/group وsocket وphp.ini values والحدود.

يمكن أن تخدم تطبيقين بمستخدمين وsockets منفصلة لتقليل أثر الاختراق، بدل وضع كل المواقع في pool واحدة.

## أوضاع Process Manager

### static

ينشئ بالضبط `pm.max_children` workers ويحتفظ بها. أداء متوقع ولا يوجد spawn عند الضغط، لكنه يحجز الذاكرة حتى في الهدوء.

```ini
pm = static
pm.max_children = 20
```

### dynamic

يبدأ بعدد workers ويحافظ على spare capacity بين حدين:

```ini
pm = dynamic
pm.max_children = 40
pm.start_servers = 8
pm.min_spare_servers = 4
pm.max_spare_servers = 12
```

غالبًا اختيار متوازن لخدمة نشطة.

### ondemand

ينشئ workers عند وصول الطلبات ويقتل الخامل بعد مدة:

```ini
pm = ondemand
pm.max_children = 20
pm.process_idle_timeout = 10s
```

يوفر ذاكرة للمواقع قليلة المرور مقابل cold-start وتكلفة spawn.

## حساب pm.max_children

ابدأ بقياس RSS الفعلي بعد warm-up:

```text
available RAM for FPM / realistic high-percentile worker RSS
```

مثال: إذا خصصت 2 GiB لـFPM وكان worker عند الحمل يستهلك 80 MiB، فالحد النظري 25. اترك هامشًا للنظام وخادم الويب وOPcache وقاعدة البيانات؛ قد تبدأ مثلًا بـ18–20 ثم تختبر.

لا تقسم `memory_limit` على RAM مباشرة؛ `memory_limit` حد request تقريبي وليس RSS العامل المعتاد، وقد توجد ذاكرة Extensions أو shared memory خارجه.

## إعدادات تشغيل مفيدة

```ini
pm.max_requests = 500
request_terminate_timeout = 30s
request_slowlog_timeout = 3s
slowlog = /var/log/php-fpm/app-slow.log
catch_workers_output = yes
ping.path = /fpm-ping
pm.status_path = /fpm-status
```

- `pm.max_requests` يعيد تدوير worker بعد عدد طلبات، مفيد للحد من نمو طويل الأمد.
- slowlog يسجل backtrace للطلبات البطيئة، وليس مجرد URL.
- status يعرض active/idle processes وqueue وmax children reached.
- لا تنشر ping/status للعامة؛ اسمح بهما داخليًا فقط.

## queue وLittle's Law

إذا وصل 100 طلب/ثانية ومتوسط خدمة PHP هو 200ms، فالتزامن المتوسط يقارب:

```text
concurrency = throughput × latency = 100 × 0.2 = 20 workers
```

هذا متوسط لا يغطي القمم أو tail latency. إذا كان `max children reached` أو listen queue يرتفع، فإما أن السعة قليلة أو التطبيق/قاعدة البيانات بطيئة. زيادة workers بلا حدود قد تغرق قاعدة البيانات.

## Graceful reload وfastcgi_finish_request

استخدم reload من مدير الخدمة في النشر حتى تكمل العمليات الحالية حيث أمكن. وتسمح `fastcgi_finish_request()` بإرسال الاستجابة ثم متابعة عمل قصير، لكنها تبقي worker مشغولًا؛ الأعمال الثقيلة أو الموثوقة مكانها queue worker مستقل.
