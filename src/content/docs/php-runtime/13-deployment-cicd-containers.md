---
title: 13. Deployment وCI/CD وContainers
description: Build artifacts وpipeline وhealth checks وmigrations وzero-downtime وrollback وإعداد containers.
sidebar:
  order: 13
---

## قبل ما تبدأ

ذاكر الدرس على 3 خطوات: افهم المشكلة الأول، تابع المثال، وبعدها جرّب الجزء العملي بنفسك. المصطلحات الجديدة الموجودة تحت متشرحة قبل ما ندخل في التفاصيل.

### كلمات جديدة في الدرس

- **Runtime:** وقت التشغيل: الفترة اللي البرنامج بيكون شغال فيها فعلًا.
- **Queue:** طابور مهام تنتظر عاملًا ينفذها في الخلفية.
- **Worker:** برنامج يعمل في الخلفية ويسحب المهام من الطابور وينفذها.


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

## مسألة تشغيلية

<details><summary>ليه image ناجحة مش ضمان نشر ناجح؟</summary><p>النشر يحتاج config وsecrets وmigrations وhealth checks وrollback متوافقة مع البيئة الفعلية.</p></details>

## شغّل وتحقق

استخدم [المختبر القابل للتنزيل](/php/00-lab-setup/) للسكربتات المرفقة. أوامر Composer وFPM وDocker والخادم الحقيقي تُنفذ داخل المشروع المُجهز للخدمة، مش مجلد فاضي.

نفّذ نقطة التحقق التالية داخل بيئة الدرس:

~~~bash
docker compose config --quiet
~~~

**معيار النجاح:** ينتهي التحقق بكود 0، ثم يبدأ container بحساب غير root وتنجح readiness فقط بعد جاهزية اعتماداته.

دوّن كود الخروج والدليل الفعلي. إذا اختلف الناتج، فسر البيئة أو الفرضية التي اختلفت بدل تعديل «المتوقع» حتى يطابق الخطأ.

## اربط النقاط ببعض

ابن image بطبقات قابلة للتكرار وminimal runtime، وشغلها كمستخدم غير root. أنشئ SBOM ووقّع artifact واربط deployment بالdigest. فرّق readiness عن liveness، واستخدم canary أو blue/green مع rollback، وانشر migrations بتوافق أمامي وخلفي.

### جرّب بنفسك

انشر نسخة canary تفشل readiness وأثبت أنها لا تستقبل traffic.
