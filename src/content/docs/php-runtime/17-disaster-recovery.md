---
title: 17. Disaster Recovery واختبار الاستعادة
description: RPO وRTO والنسخ الاحتياطي والاسترجاع وRunbooks وتمارين التعافي من الكوارث.
sidebar:
  order: 17
---

## Backup ليست خطة تعافٍ

النسخة الاحتياطية ملف؛ خطة التعافي تحدد ماذا نستعيد وبأي ترتيب ومن يقرر وكيف نثبت صحة النظام. نسخة لم تُختبر استعادتها مجرد أمل. احمِ قواعد البيانات والملفات المرفوعة والإعدادات الحرجة ومفاتيح التشفير وفق سياسة منفصلة.

## RPO وRTO

- **RPO:** أكبر فقد بيانات مقبول زمنيًا. RPO ساعة يعني احتمال فقد آخر ساعة.
- **RTO:** أقصى وقت مقبول لإعادة الخدمة.

القيمتان قرارا عمل يحددان تكرار النسخ، Replication، الأتمتة، والكلفة. Replication لا تستبدل Backup؛ حذف أو فساد منطقي قد ينتقل إلى النسخة التابعة.

## سياسة النسخ

استخدم نسخًا مشفرة، صلاحيات منفصلة، Retention واضحة، ونسخة خارج الحساب أو المنطقة الأساسية. تحقق من Checksums، راقب نجاح Jobs، واختبر أن مفاتيح فك التشفير متاحة أثناء الكارثة دون تخزينها بجوار النسخة نفسها.

## ترتيب الاستعادة

1. أعلن Incident وحدد القائد وقناة الاتصال.
2. أوقف الكتابة أو اعزل النظام إن كان استمرارها يزيد الفساد.
3. اختر Recovery Point موثقًا.
4. أنشئ بيئة نظيفة واستعد قاعدة البيانات والملفات والإعدادات.
5. شغّل Migrations المتوافقة فقط.
6. تحقق من Counts وConstraints وChecksums وسيناريوهات العمل.
7. أعد المرور تدريجيًا وراقب الأخطاء والـLatency.
8. وثّق الفجوة بين RPO/RTO الفعلي والهدف.

## تمرين Restore فعلي

نفذ الاستعادة دوريًا إلى بيئة معزولة. استخدم Credentials غير إنتاجية، امنع إرسال Emails/Webhooks، ثم شغّل اختبارات Smoke وقراءات اتساق. سجّل زمن كل خطوة والعوائق اليدوية. Game Day جيد يجب أن يكشف نقص Runbook أو صلاحية أو مفتاح قبل الكارثة الحقيقية.

## تطبيق PHP أثناء التعافي

اجعل التطبيق يقبل Read-only Mode عند تعذر الكتابة، ويعرض رسالة واضحة بدل إعادة المحاولة بلا حد. لا تشغّل Worker قديمًا على Schema أحدث. احتفظ بـArtifact قابل لإعادة النشر، وConfig versioned بلا أسرار، وقائمة توافق بين إصدار التطبيق وSchema.

## تأكد من فهمك

<div class="lesson-quiz" role="list">
<section class="quiz-card" role="listitem"><div class="quiz-question-row"><span class="quiz-number">01</span><p>لماذا Replication ليست Backup؟</p></div><details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة:</strong> الحذف والفساد المنطقي وبيانات Ransomware قد تتكرر فورًا إلى النسخة التابعة.</div></details></section>
<section class="quiz-card" role="listitem"><div class="quiz-question-row"><span class="quiz-number">02</span><p>ما الفرق بين RPO وRTO؟</p></div><details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة:</strong> RPO يحدد فقد البيانات المقبول، وRTO يحدد زمن عودة الخدمة.</div></details></section>
<section class="quiz-card" role="listitem"><div class="quiz-question-row"><span class="quiz-number">03</span><p>كيف تثبت أن Restore نجح؟</p></div><details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة:</strong> بفحوص اتساق وConstraints وCounts وChecksums وSmoke Tests وسيناريوهات عمل، لا بمجرد بدء قاعدة البيانات.</div></details></section>
<section class="quiz-card" role="listitem"><div class="quiz-question-row"><span class="quiz-number">04</span><p>ما هدف Game Day؟</p></div><details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة:</strong> قياس الخطة فعليًا واكتشاف الاعتماديات والصلاحيات والخطوات اليدوية الناقصة قبل حادث حقيقي.</div></details></section>
</div>
