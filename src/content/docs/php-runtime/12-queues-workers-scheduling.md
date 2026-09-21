---
title: 12. Queues وWorkers وScheduling
description: Jobs وat-least-once delivery وidempotency وretries وbackoff وDLQ وgraceful shutdown وCron.
sidebar:
  order: 12
---

## لماذا Queue؟

انقل العمل البطيء أو القابل لإعادة المحاولة خارج HTTP request: البريد، الصور، التقارير، مزامنة APIs. أعد الاستجابة بعد حفظ نية العمل بصورة موثوقة، لا بعد تشغيل background process عشوائي.

```json
{"type":"SendReceipt","job_id":"job_01J...","order_id":42,"attempt":1}
```

أرسل IDs لا object graphs كاملة، وضع version للـpayload.

## Delivery وIdempotency

أنظمة كثيرة تقدم **at-least-once**؛ قد تصل الرسالة مرتين. صمّم handler آمنة:

```php
if ($processedJobs->contains($jobId)) {
    return;
}

$handler->handle($orderId);
$processedJobs->record($jobId);
```

يجب أن يكون تسجيل النتيجة وidempotency atomic قدر الإمكان. Transactional Outbox تربط تغيير database بإنشاء الحدث.

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

