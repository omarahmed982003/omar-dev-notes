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
composer check-platform-reqs --lock --no-dev
```

احفظ commit SHA وbuild ID داخل metadata قابلة للمراقبة، ولا تضع secrets داخل image.

## Pipeline

```text
lint -> unit tests -> static analysis -> integration tests
-> dependency audit -> build artifact/image -> scan
-> deploy staging -> smoke test -> production -> verify
```

أوقف النشر عند فشل check. لا تجعل approval يدويًا بديلًا عن اختبارات قابلة للتكرار.

## Pipeline قابلة للمراجعة

احتفظ بالـpipeline في المستودع، وثبّت الأدوات والصور، واربط كل artifact بـcommit. مثال المراحل ليس رسمًا فقط؛ كل مرحلة تنتج دليلًا محفوظًا: test report، scan result، image digest وdeployment record.

~~~yaml
jobs:
  verify:
    steps:
      - run: composer install --no-interaction --no-progress
      - run: composer validate --strict
      - run: composer audit --locked
      - run: composer test
      - run: docker build --pull --tag app:$GIT_SHA .
~~~

لا تستخدم secret في build argument أو layer. افصل build عن release، وروّج digest نفسها من staging إلى production.


## Container

- image صغيرة بإصدار PHP وextensions مثبت.
- process رئيسية واضحة وnon-root user.
- filesystem read-only حيث يمكن.
- config/secrets وقت التشغيل.
- logs إلى stdout/stderr.
- limits وgraceful shutdown.

افصل web وworker لأن لهما lifecycle وتوسّعًا مختلفين.

## حدود النظام واختبار الحمل

اضبط CPU وmemory وprocess/file-descriptor limits، ثم راقب throttling وOOM والـlisten queue. limit بلا request يجعل scheduling عشوائيًا، وmemory limit للحاوية يجب أن يتسع لـFPM workers وOPcache وnative allocations.

اختبار الحمل يثبت نقطة saturation، لا رقمًا تسويقيًا. ارفع الحمل تدريجيًا، وسجل throughput وp95 والأخطاء وRSS واتصالات قاعدة البيانات. أوقف التجربة عندما تكسر SLO، ثم غيّر متغيرًا واحدًا وأعدها.


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

من داخل `examples/php-labs` أو الحزمة المستخرجة نفّذ:

~~~bash
docker compose -f production/compose.yaml config --quiet
docker compose -f production/compose.yaml up --build -d
curl -fsS http://127.0.0.1:8080/health
php load-probe.php http://127.0.0.1:8080/health 50 10
docker compose -f production/compose.yaml down
~~~

**معيار النجاح:** تنجح بنية Compose، وتبدأ الخدمات بحسابات غير root وfilesystems للقراءة فقط، ولا يستقبل Nginx traffic قبل صحة FPM. يرجع health JSON بحالة ok، ويظل ملف HTML الساكن خارج PHP. أمر `down` ينظف موارد التجربة.

دوّن كود الخروج والدليل الفعلي. إذا اختلف الناتج، فسر البيئة أو الفرضية التي اختلفت بدل تعديل «المتوقع» حتى يطابق الخطأ.

## اربط النقاط ببعض

ابن image بطبقات قابلة للتكرار وminimal runtime، وشغلها كمستخدم غير root. أنشئ SBOM ووقّع artifact واربط deployment بالdigest. فرّق readiness عن liveness، واستخدم canary أو blue/green مع rollback، وانشر migrations بتوافق أمامي وخلفي.

#### دورة التجربة

قبل التنفيذ اكتب توقعك، ثم شغّل المثال وسجّل الخروج. أحدث فشلًا واحدًا مقصودًا، اجمع الدليل من logs أو metrics، أصلح السبب، وأعد التشغيل لإثبات أن الإصلاح يعالج العطل ولا يخفيه.


### جرّب بنفسك

انشر نسخة canary تفشل readiness وأثبت أنها لا تستقبل traffic.
