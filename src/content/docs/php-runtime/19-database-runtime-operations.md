---
title: 19. اتصالات قاعدة البيانات وتشغيلها
description: ميزانية الاتصالات وPDO والمهلات والاتصالات المستديمة والمعاملات والنسخ والاستعداد للفشل.
sidebar:
  order: 19
---

## قبل ما تبدأ

تصميم الجداول والاستعلامات له مساره، أما هنا فالتركيز على عمر الاتصال من Worker PHP إلى قاعدة البيانات وعلى ما يحدث عند البطء والفشل والنشر.

### كلمات جديدة

- **Connection budget:** العدد الذي تستطيع قاعدة البيانات تحمله والمخصص لكل خدمة.
- **Persistent connection:** اتصال يعاد استخدامه داخل عملية PHP.
- **Pooler:** وسيط يدير مجموعة اتصالات قاعدة البيانات.
- **Replica lag:** تأخر نسخة القراءة عن الخادم الأساسي.

## احسب الاتصالات قبل زيادة العمال

إذا شغّلت 6 نسخ، وفي كل نسخة 30 عامل FPM واتصال محتمل لكل عامل، فقد تطلب 180 اتصالًا قبل workers والـcron وأدوات الإدارة. لا تجعل `pm.max_children` وautoscaling يتجاوزان حد قاعدة البيانات.

~~~text
database budget
= web replicas × possible connections per replica
+ queue workers
+ scheduled jobs
+ administration reserve
~~~

اجعل readiness تفشل عندما لا يستطيع التطبيق إنشاء اتصال أساسي، لكن لا تجعل liveness تعيد تشغيل كل النسخ بسبب عطل قاعدة بيانات مشترك.

## PDO والمهلات

~~~php
$pdo = new PDO($dsn, $user, $password, [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_TIMEOUT => 2,
    PDO::ATTR_PERSISTENT => false,
]);
~~~

`ATTR_TIMEOUT` لا يضبط كل أنواع timeout في كل driver. اضبط connect وstatement وlock timeout في مستوى driver أو الخادم، وضع deadline للعملية الكاملة. لا تطبع DSN أو exception trace للمستخدم.

## الاتصالات المستديمة

الاتصال المستديم cache داخل كل process وليس pool مشتركة بين كل النسخ. قد يحتفظ بإعداد session أو temporary table أو lock أو transaction من الطلب السابق. استخدمه بعد قياس تكلفة الاتصال وفهم تنظيف driver، وغالبًا استخدم pooler خارجيًا عندما تحتاج تحكمًا مركزيًا.

كل معاملة تنتهي بـcommit أو rollback في مسار مضمون. أعد محاولة deadlock أو serialization failure بعدد محدود وjitter فقط عندما تكون العملية idempotent.

## القراءة من Replica

بعد كتابة الطلب إلى primary قد تعيد replica قيمة أقدم. العمليات التي تحتاج read-your-writes تقرأ من primary أو تستخدم consistency token مدعومة. راقب lag، ولا ترسل تقارير حرجة إلى replica متأخرة بلا حد.

## Migrations والنشر

استخدم Expand/Contract: أضف nullable column أو table أولًا، انشر كودًا يفهم الشكلين، نفّذ backfill على دفعات، ثم افرض constraint واحذف القديم لاحقًا. راقب مدة lock وحجم transaction ومعدل replication.

## تجربة PostgreSQL

~~~bash
docker compose -f production/compose.yaml -f production/compose.full.yaml up --build -d
curl -fsS http://127.0.0.1:8080/database
docker compose -f production/compose.yaml -f production/compose.full.yaml exec postgres psql -U app -d app -c "select * from runtime_probe"
~~~

يجب أن تتطابق `probe_key` في HTTP وPostgreSQL. أوقف postgres وتأكد أن endpoint يرجع 503 بلا credentials، ثم أعده وقس زمن التعافي.

## تأكد من فهمك

<div class="lesson-quiz" role="list">
<section class="quiz-card" role="listitem"><details><summary>لماذا قد تستهلك FPM اتصالات أكثر من المتوقع؟</summary><p>لأن كل worker وكل replica قد يحتفظ باتصال مستقل، إضافة إلى العمال والمهام الإدارية.</p></details></section>
<section class="quiz-card" role="listitem"><details><summary>ما خطر persistent connection؟</summary><p>قد تنتقل حالة الاتصال مثل transaction أو lock أو إعداد session إلى طلب لاحق.</p></details></section>
<section class="quiz-card" role="listitem"><details><summary>متى تعيد deadlock؟</summary><p>بعد rollback، بعدد محدود وjitter، وفقط عندما يمكن تكرار العملية بأمان.</p></details></section>
<section class="quiz-card" role="listitem"><details><summary>لماذا قد لا ترى الكتابة في replica؟</summary><p>لأن replication غير متزامنة وقد توجد فترة lag.</p></details></section>
</div>

#### دورة التجربة

قبل التنفيذ اكتب توقعك، ثم شغّل المثال وسجّل الخروج. أحدث فشلًا واحدًا مقصودًا، اجمع الدليل من logs أو metrics، أصلح السبب، وأعد التشغيل لإثبات أن الإصلاح يعالج العطل ولا يخفيه.


### جرّب بنفسك

توقع عدد الاتصالات الأقصى، راقبه أثناء حمل صغير، اخفض حد PostgreSQL حتى يحدث saturation، ثم أصلح ميزانية FPM والـworkers بدل إضافة retries غير محدودة.
