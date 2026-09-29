---
title: 18. Sessions وShared State عند التوسع
description: تخزين الجلسات وقفلها وتوزيعها بين النسخ وإدارة TTL وGC والفشل.
sidebar:
  order: 18
---

## قبل ما تبدأ

الجلسة تربط طلبات المستخدم ببعضها. في خادم واحد قد يبدو التخزين في الملفات كافيًا، لكن التوسع إلى أكثر من نسخة يحول مكان التخزين والقفل ومدة الصلاحية إلى قرارات تشغيلية.

### كلمات جديدة

- **Session handler:** المكوّن الذي يقرأ بيانات الجلسة ويكتبها.
- **Horizontal scaling:** تشغيل أكثر من نسخة من التطبيق.
- **Sticky session:** توجيه المستخدم إلى النسخة نفسها اعتمادًا على Cookie أو عنوان.
- **Lock contention:** انتظار طلب لأن طلبًا آخر يمسك القفل نفسه.

## لماذا تفشل file sessions مع أكثر من نسخة؟

المعالج الافتراضي `files` يحفظ بيانات الجلسة على القرص المحلي. إذا وصل الطلب التالي إلى نسخة أخرى فلن تجد الملف، إلا إذا استخدمت قرصًا مشتركًا أو توجيهًا لاصقًا. القرص المشترك يضيف latency ونقطة فشل، والتوجيه اللاصق يقلل حرية إعادة التوزيع ولا يحل فقد النسخة.

المخزن المشترك مثل Redis يجعل كل النسخ ترى الجلسة نفسها. لكنه يصبح dependency أساسية: سقوطه قد يمنع تسجيل الدخول والشراء، لذلك يحتاج timeout قصيرًا ومراقبة وخطة فشل واضحة.

## القفل والطلبات المتوازية

المعالج الملفي يقفل جلسة المستخدم من `session_start()` حتى نهاية الطلب أو `session_write_close()`. طلب AJAX بطيء يمكن أن يحجز طلبات المستخدم التالية رغم وجود عمال FPM متاحين.

~~~php
session_start();
$userId = $_SESSION['user_id'] ?? null;
session_write_close();

$report = buildSlowReport($userId);
~~~

أغلق الجلسة بعد آخر تعديل مطلوب، ولا تعاود فتحها بلا حاجة. افحص دلالات القفل في Redis handler المستخدم؛ تعطيل القفل بالكامل قد يسبب lost updates.

## إعداد آمن

~~~ini
session.use_strict_mode=1
session.use_only_cookies=1
session.cookie_httponly=1
session.cookie_secure=1
session.cookie_samesite=Lax
session.gc_maxlifetime=1800
~~~

اجعل TTL في المخزن متوافقًا مع مدة Cookie وسياسة تسجيل الخروج. لا تعتمد على probabilistic GC داخل كل request لتنظيف مخزن مركزي؛ استخدم expiry أصلية للمخزن. غيّر Session ID بعد تسجيل الدخول أو تغيير الصلاحية، ولا تخزن object graph يعتمد على نسخة كود محددة.

## النشر والتوافق

أثناء rolling deployment قد تقرأ النسخة الجديدة جلسة كتبتها القديمة. استخدم schema بسيطة ذات version، واقبل الإصدارين خلال الانتقال. اختبر logout، انتهاء الصلاحية، وتغيير المفتاح، ولا تجعل deploy يطرد الجميع دون قرار.

## تجربة المختبر

شغّل البيئة الكاملة:

~~~bash
docker compose -f production/compose.yaml -f production/compose.full.yaml up --build -d
curl -c cookies.txt -b cookies.txt http://127.0.0.1:8080/session
curl -c cookies.txt -b cookies.txt http://127.0.0.1:8080/session
docker compose -f production/compose.yaml -f production/compose.full.yaml exec redis redis-cli -n 1 scan 0
~~~

يجب أن ترتفع `visits` من 1 إلى 2 وأن يظهر مفتاح الجلسة في Redis. نفّذ طلبين متوازيين بعد إضافة تأخير مؤقت، ثم أغلق الجلسة مبكرًا وقارن زمن الانتظار.

## تأكد من فهمك

<div class="lesson-quiz" role="list">
<section class="quiz-card" role="listitem"><details><summary>لماذا لا تكفي file sessions مع نسختين؟</summary><p>لأن الملف محلي للنسخة، وقد يصل الطلب التالي إلى نسخة لا تملكه.</p></details></section>
<section class="quiz-card" role="listitem"><details><summary>متى تستدعي session_write_close؟</summary><p>بعد آخر قراءة أو كتابة للجلسة وقبل العمل البطيء الذي لا يحتاجها.</p></details></section>
<section class="quiz-card" role="listitem"><details><summary>هل Sticky Sessions بديل كامل للمخزن المشترك؟</summary><p>لا؛ تقلل المرونة ولا تحمي من فقد النسخة أو إعادة الجدولة.</p></details></section>
<section class="quiz-card" role="listitem"><details><summary>ما الذي يجب مراقبته؟</summary><p>زمن قراءة وكتابة الجلسة، الأخطاء، القفل، عدد المفاتيح، expirations واستهلاك الذاكرة.</p></details></section>
</div>

#### دورة التجربة

قبل التنفيذ اكتب توقعك، ثم شغّل المثال وسجّل الخروج. أحدث فشلًا واحدًا مقصودًا، اجمع الدليل من logs أو metrics، أصلح السبب، وأعد التشغيل لإثبات أن الإصلاح يعالج العطل ولا يخفيه.


### جرّب بنفسك

توقع النتيجة، شغّل الطلبين، أوقف Redis ولاحظ كود HTTP، ثم أعده وأثبت أن التطبيق لا يخفي الفشل أو يحوله إلى جلسة محلية صامتة.
