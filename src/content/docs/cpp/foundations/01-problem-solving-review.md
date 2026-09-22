---
title: "مراجعة أشجار القرار والمخططات والتصحيح"
description: "قبل كتابة C++ ثبّت منطق الحل: حدّد المدخلات والنتيجة، اكتب الخطوات، مثّل القرارات، ثم اختبر الخوارزمية يدويًا. اللغة تنفذ التفكير ولا تستبدله."
tableOfContents: true
---

## الفكرة العامة

قبل كتابة C++ ثبّت منطق الحل: حدّد المدخلات والنتيجة، اكتب الخطوات، مثّل القرارات، ثم اختبر الخوارزمية يدويًا. اللغة تنفذ التفكير ولا تستبدله.

## المفاهيم التي تحتاجها

- استخدم Pseudocode للتسلسل وFlowchart لإظهار التفرعات بصريًا.
- ابدأ بالمسار الصحيح ثم أضف حالات الحدود والمدخلات غير الصالحة.
- الخطأ النحوي يمنع البناء، أما الخطأ المنطقي فينتج إجابة خاطئة رغم تشغيل البرنامج.
- جدول التتبّع يسجل قيم المتغيرات بعد كل خطوة ويكشف موضع الانحراف.

## مثال

```text
READ a, b
IF b = 0 THEN
  PRINT "Division is undefined"
ELSE
  PRINT a / b
END IF
```

## أخطاء شائعة وتصحيحات

- لا تختبر بالقيم السهلة فقط؛ جرّب الصفر والحدود والقيم السالبة.
- لا تحول الرسم إلى زينة؛ يجب أن يطابق مسارات التنفيذ فعلًا.

<div class="lesson-diagram" role="img" aria-label="من تحليل المشكلة إلى نتيجة قابلة للتحقق">
<p class="lesson-diagram-title">من تحليل المشكلة إلى نتيجة قابلة للتحقق</p>
<div class="diagram-flow">
<div class="diagram-node start"><span>ابدأ</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node input"><span>اقرأ المدخلات</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node decision"><span>تحقق من الصلاحية</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>نفّذ الخوارزمية</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node output"><span>اعرض واختبر</span></div>
</div>
</div>

## تأكد من فهمك

<div class="lesson-quiz" role="list">
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">01</span><p>لماذا يجب التحقق من المقام قبل القسمة لا بعدها؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> لأن العملية غير الصالحة تكون قد نُفذت بالفعل. التحقق المبكر يمنع الخطأ ويحدد مسارًا واضحًا للرفض.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">02</span><p>برنامج يعمل لكنه يعطي الأكبر خطأ عند تساوي قيمتين. ما نوع العيب؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> خطأ منطقي في المقارنات أو ترتيب الفروع؛ البناء والتشغيل لا يثبتان صحة الخوارزمية.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">03</span><p>متى يكون Flowchart أفضل من Pseudocode؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> عند الحاجة لرؤية التفرعات والعودة بصريًا؛ أما Pseudocode فأفضل لتفاصيل التسلسل القريبة من الكود.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">04</span><p>كيف تثبت أن خوارزمية أكبر ثلاثة أعداد تغطي كل الحالات؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> اختبر كل عنصر كأكبر، وحالات التساوي، والسالب، وحدود النوع، ثم قارن بتوقع مكتوب قبل التنفيذ.</div></details>
</section>
</div>

## الخلاصة

اكتب الحل على مراحل، فعّل التحذيرات، واختبر الحالة العادية والحدود والمدخل غير الصالح. عندما تستطيع تفسير سبب كل سطر تكون قد فهمت الفكرة بدل حفظها.
