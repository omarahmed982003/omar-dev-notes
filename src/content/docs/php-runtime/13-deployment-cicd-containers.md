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

## خريطة الدرس

<div class="lesson-diagram" role="img" aria-label="خريطة مفاهيم: Deployment وCI/CD وContainers">
<p class="lesson-diagram-title">خريطة مفاهيم: Deployment وCI/CD وContainers</p>
<div class="diagram-flow">
<div class="diagram-node input"><span>Artifact قابلة للتكرار</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>Pipeline</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>Container</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node decision"><span>Health</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node output"><span>Zero-downtime وMigrations</span></div>
</div>
</div>

## تأكد من فهمك

<div class="lesson-quiz" role="list">
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">01</span><p>اشرح «Artifact قابلة للتكرار» كأنك تراجع تطبيقًا حقيقيًا: ما الهدف وما أهم قيد يجب الانتباه له؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> ابنِ نسخة واحدة ثم رقّها بين البيئات بدل composer install مختلف على كل خادم: احفظ commit SHA وbuild ID داخل metadata قابلة للمراقبة، ولا تضع secrets داخل image. عمليًا، لا يكفي تنفيذ المسار الناجح؛ يجب توثيق الافتراضات والتحقق من القيم والحالات التي قد تكسر هذا السلوك.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">02</span><p>قارن بين «Artifact قابلة للتكرار» و«Pipeline». لماذا لا يغني أحدهما عن الآخر داخل موضوع «Deployment وCI/CD وContainers»؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> في «Artifact قابلة للتكرار»: ابنِ نسخة واحدة ثم رقّها بين البيئات بدل composer install مختلف على كل خادم: احفظ commit SHA وbuild ID داخل metadata قابلة للمراقبة، ولا تضع secrets داخل image. أما «Pipeline»: أوقف النشر عند فشل check. لا تجعل approval يدويًا بديلًا عن اختبارات قابلة للتكرار. العلاقة بينهما أن الأول يحدد جانبًا من الحل، والثاني يكمل السلوك أو القيود اللازمة لتطبيقه بصورة صحيحة.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">03</span><p>افترض أن نظامًا تجاهل «Container». ما العطل أو الخطر المتوقع، وكيف تصمم اختبارًا يكشفه؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> image صغيرة بإصدار PHP وextensions مثبت. process رئيسية واضحة وnon-root user. filesystem read-only حيث يمكن. config/secrets وقت التشغيل. logs إلى stdout/stderr. limits وgraceful shutdown. افصل web وworker لأن لهما lifecycle وتوسّعًا مختلفين. لاكتشاف الخلل، اختبر مسارًا صحيحًا، وقيمة عند الحد، ومدخلًا غير صالح، ثم راقب النتيجة والآثار الجانبية والسجل بدل الاكتفاء بعدم ظهور Exception.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">04</span><p>حوّل «Health» إلى قرار هندسي قابل للمراجعة. ما الذي ستوثقه وما الحالات التي ستختبرها؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> Liveness: هل العملية عالقة وتحتاج restart؟ Readiness: هل تستطيع استقبال traffic الآن؟ Startup: هل تحتاج وقت warm-up؟ لا تجعل liveness تعتمد على كل external service فتسبب restart storm. readiness يمكن أن تمنع traffic عند dependency أساسية. وثّق سبب الاختيار والبدائل والحدود، واختبر الحالة العادية، والحد الأدنى والأقصى، والفشل الجزئي، وإعادة المحاولة أو التكرار إن كان السلوك يسمح بذلك.</div></details>
</section>
</div>
