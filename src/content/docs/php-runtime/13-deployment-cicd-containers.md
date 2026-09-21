---
title: 13. Deployment وCI/CD وContainers
description: Build artifacts وpipeline وhealth checks وmigrations وzero-downtime وrollback وإعداد containers.
sidebar:
  order: 13
---

## Artifact قابلة للتكرار

ابنِ نسخة واحدة ثم رقّها بين البيئات بدل `composer install` مختلف على كل خادم:

```bash
composer install --no-dev --prefer-dist --no-interaction \
  --optimize-autoloader --classmap-authoritative
composer check-platform-reqs
```

احفظ commit SHA وbuild ID داخل metadata قابلة للمراقبة، ولا تضع secrets داخل image.

## Pipeline

```text
lint -> unit tests -> static analysis -> integration tests
-> dependency audit -> build artifact/image -> scan
-> deploy staging -> smoke test -> production -> verify
```

أوقف النشر عند فشل check. لا تجعل approval يدويًا بديلًا عن اختبارات قابلة للتكرار.

## Container

- image صغيرة بإصدار PHP وextensions مثبت.
- process رئيسية واضحة وnon-root user.
- filesystem read-only حيث يمكن.
- config/secrets وقت التشغيل.
- logs إلى stdout/stderr.
- limits وgraceful shutdown.

افصل web وworker لأن لهما lifecycle وتوسّعًا مختلفين.

## Health

- **Liveness:** هل العملية عالقة وتحتاج restart؟
- **Readiness:** هل تستطيع استقبال traffic الآن؟
- **Startup:** هل تحتاج وقت warm-up؟

لا تجعل liveness تعتمد على كل external service فتسبب restart storm. readiness يمكن أن تمنع traffic عند dependency أساسية.

## Zero-downtime وMigrations

استخدم rolling/blue-green حسب المنصة. اجعل schema changes backward-compatible بنمط Expand/Contract:

1. أضف البنية الجديدة.
2. انشر كودًا يدعم القديم والجديد.
3. نفّذ backfill.
4. انقل القراءة.
5. احذف القديم لاحقًا.

أعد تحميل FPM gracefully، ونسق queue workers مع نسخة payload.

## Rollback

Rollback ليست فقط إعادة image؛ migration قد تكون غير قابلة للعكس. جهز roll-forward، backups، feature flags، ومقاييس نجاح تلقائية. اختبر الإجراء قبل incident.

