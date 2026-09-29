---
title: 12. Queues وWorkers وScheduling
description: Jobs وat-least-once delivery وidempotency وretries وbackoff وDLQ وgraceful shutdown وCron.
sidebar:
  order: 12
---

## قبل ما تبدأ

ذاكر الدرس على 3 خطوات: افهم المشكلة الأول، تابع المثال، وبعدها جرّب الجزء العملي بنفسك. المصطلحات الجديدة الموجودة تحت متشرحة قبل ما ندخل في التفاصيل.

### كلمات جديدة في الدرس

- **HTTP:** قواعد تبادل الطلبات والردود بين المتصفح والخادم.
- **Queue:** طابور مهام تنتظر عاملًا ينفذها في الخلفية.
- **Worker:** برنامج يعمل في الخلفية ويسحب المهام من الطابور وينفذها.


## لماذا Queue؟

انقل العمل البطيء أو القابل لإعادة المحاولة خارج HTTP request: البريد، الصور، التقارير، مزامنة APIs. أعد الاستجابة بعد حفظ نية العمل بصورة موثوقة، لا بعد تشغيل background process عشوائي.

```json
{"type":"SendReceipt","job_id":"job_01J...","order_id":42,"attempt":1}
```

أرسل IDs لا object graphs كاملة، وضع version للـpayload.

## Delivery وIdempotency

أنظمة كثيرة تقدم **at-least-once**؛ قد تصل الرسالة مرتين. صمّم handler آمنة:

```php
<?php
require __DIR__ . '/bootstrap.php';

$db = Lessons\connectInventory(':memory:');
Lessons\initializeInventory($db);
$first = Lessons\purchase($db, 'job-42', 1, 1, 2);
$again = Lessons\purchase($db, 'job-42', 1, 1, 2);
echo json_encode([$first, $again], JSON_THROW_ON_ERROR), PHP_EOL;
```

يجب أن يكون تسجيل النتيجة وidempotency داخل معاملة واحدة وقيد فريد. Transactional Outbox تربط تغيير database بإنشاء الحدث.

## Retry

أعد المحاولة للأخطاء المؤقتة فقط:

```text
delay = min(cap, base * 2^attempt) + random_jitter
```

لا تعِد ValidationError أو credential مرفوضة بلا تغيير. بعد حد معين انقل الرسالة إلى Dead-Letter Queue مع سبب وتحقيق وتنبيه.

## Worker lifecycle

- timeout لكل job وI/O.
- memory limit وإعادة تدوير العملية.
- SIGTERM يوقف استقبال الجديد وينهي الحالي ضمن grace period.
- acknowledge بعد النجاح لا قبله.
- heartbeat وvisibility timeout أطول من job مع renewal عند الحاجة.

راقب queue depth وage of oldest وprocessing latency وretry/DLQ rate.

## Cron وScheduler

اجعل المهمة المجدولة idempotent، امنع overlap بقفل له expiry، واستخدم timezone واضحة. الـscheduler يمكن أن ينشر jobs إلى queue بدل تنفيذ كل العمل في عملية واحدة.

## مسألة تشغيلية

<details><summary>ليه job لازم تكون idempotent؟</summary><p>لأن التسليم غالبًا at-least-once وقد يعيد worker المحاولة؛ تكرار الرسالة لا يجب أن يكرر الأثر التجاري.</p></details>

## شغّل وتحقق

المثال يطبع طلبًا جديدًا ثم نفس الطلب مع duplicate=true. محاولات queue وdead-letter تحتاج وسيط رسائل وعاملًا في بيئة اختبار، وليست جزءًا من هذا البرنامج.

استخدم [المختبر القابل للتنزيل](/php/00-lab-setup/) للسكربتات المرفقة. أوامر Composer وFPM وDocker والخادم الحقيقي تُنفذ داخل المشروع المُجهز للخدمة، مش مجلد فاضي.

نفّذ نقطة التحقق التالية داخل بيئة الدرس:

~~~bash
php queue-demo.php
~~~

**هدف تجربة التكامل الموسعة:** تُعالج الرسالة الناجحة مرة، والفشل المؤقت يُعاد بحد أقصى، والرسالة الدائمة تصل إلى dead-letter مع correlation ID.

دوّن كود الخروج والدليل الفعلي. إذا اختلف الناتج، فسر البيئة أو الفرضية التي اختلفت بدل تعديل «المتوقع» حتى يطابق الخطأ.

## Worker حقيقي على Redis

~~~bash
docker compose -f production/compose.yaml -f production/compose.full.yaml up --build -d
curl -fsS -X POST http://127.0.0.1:8080/queue
docker compose -f production/compose.yaml -f production/compose.full.yaml logs queue-worker
docker compose -f production/compose.yaml -f production/compose.full.yaml exec redis redis-cli llen lesson:queue
~~~

يجب أن يظهر `processed=<job_id>` ويعود طول القائمة إلى صفر. أوقف worker، أرسل job وتأكد أنها تبقى، ثم أعده وأثبت المعالجة. أرسل نفس `job_id` يدويًا مرتين واختبر سجل duplicate.


## اربط النقاط ببعض

Visibility timeout يجب أن يتجاوز المعالجة أو يتجدد حتى لا تظهر الرسالة لعامل ثانٍ. Ordering غالبًا مضمون داخل partition فقط. Poison message تحتاج retry محدودًا وdead-letter وتحقيقًا. Transactional outbox يربط تغيير قاعدة البيانات بنشر الحدث دون dual-write gap.

#### دورة التجربة

قبل التنفيذ اكتب توقعك، ثم شغّل المثال وسجّل الخروج. أحدث فشلًا واحدًا مقصودًا، اجمع الدليل من logs أو metrics، أصلح السبب، وأعد التشغيل لإثبات أن الإصلاح يعالج العطل ولا يخفيه.


### جرّب بنفسك

حاكِ crash بعد commit وقبل ack وتأكد أن idempotency تمنع الأثر المكرر.


## ليه إثبات التنفيذ داخل المعاملة؟

احفظ المثال باسم `queue-demo.php` في [مجلد المختبر](/php/00-lab-setup/). الاستدعاء الأول ينشئ الطلب 1، والتاني يرجع نفس الطلب مع `duplicate: true`. افتح `src/Inventory.php`: إثبات التنفيذ بقيد فريد `(user_id, job_key)` وتغيير المخزون والطلب وحدث outbox بيتحفظوا في معاملة واحدة. نفس المفتاح بمدخلات مختلفة يُرفض. الفشل قبل commit يلغي الأربعة، وما تبعتش إقرار نجاح للـqueue إلا بعد commit. فحص «اتنفذ قبل كده؟» ثم تنفيذ الأثر منفصلين خطر: عاملان ممكن يعدّوا الفحص معًا.

الـoutbox جدول بيحفظ أحداث هتتبعت بعد commit. الناشر ممكن يرسل ثم يتعطل قبل تسجيل الإرسال، فالتسليم لسه ممكن يتكرر. الدفع أو البريد خارج قاعدة البيانات محتاج مفتاح منع تكرار عند المزود أو إزالة التكرار عند المستقبِل؛ معاملة قاعدة البيانات مش هتلغي طلبًا لخدمة خارجية. شغّل `php tests.php inventory` لاختبار التكرار والفشل المتعمد. الاختبارات المحلية دي مش محاكاة لوسيط رسائل حقيقي أو عدة عمليات workers.
