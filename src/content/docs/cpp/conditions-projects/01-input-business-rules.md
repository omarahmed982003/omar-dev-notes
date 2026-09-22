---
title: "الإدخال وتحويل قواعد العمل إلى شروط"
description: "قواعد العمل تتحول إلى شروط واضحة بعد تسمية كل حقيقة مستقلة والتحقق من صحة المدخلات. افصل صلاحية البيانات عن قرار القبول."
tableOfContents: true
---

## الفكرة العامة

قواعد العمل تتحول إلى شروط واضحة بعد تسمية كل حقيقة مستقلة والتحقق من صحة المدخلات. افصل صلاحية البيانات عن قرار القبول.

## المفاهيم التي تحتاجها

- ابدأ بجدول يربط كل مدخل بنوعه ومداه.
- سمِّ الشروط: hasPassingGrade أفضل من تعبير طويل متكرر.
- القواعد الإلزامية تجمع بـ&&، والبدائل المقبولة بـ||.
- أخرج سبب الرفض المحدد بدل رسالة عامة.
- اختبر قيمة أقل من الحد، الحد نفسه، وقيمة أعلى منه.

## مثال

```cpp
bool validScore = score >= 0 && score <= 100;
bool eligible = validScore && score >= 60 && attendance >= 75;
```

## أخطاء شائعة وتصحيحات

- لا تجعل قيمة غير صالحة تدخل في قرار الأعمال.
- انتبه هل الحد مشمول: > أم >=.

## خريطة الدرس

<div class="lesson-diagram" role="img" aria-label="خريطة مفاهيم: الإدخال وتحويل قواعد العمل إلى شروط">
<p class="lesson-diagram-title">خريطة مفاهيم: الإدخال وتحويل قواعد العمل إلى شروط</p>
<div class="diagram-flow">
<div class="diagram-node input"><span>الفكرة العامة</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>المفاهيم التي تحتاجها</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>مثال</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node decision"><span>أخطاء شائعة وتصحيحات</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node output"><span>الخلاصة</span></div>
</div>
</div>

## تأكد من فهمك

<div class="lesson-quiz" role="list">
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">01</span><p>لماذا تفصل validScore عن eligible؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> الأول يثبت صلاحية البيانات، والثاني يطبق قاعدة العمل. الفصل يمنع اعتبار قيمة فاسدة رفضًا عاديًا ويعطي رسالة أدق.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">02</span><p>كيف تختبر حد حضور 75%؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> استخدم 74.99 أو 74 حسب النوع، ثم 75، ثم قيمة أعلى، إضافة إلى قيم غير صالحة تحت 0 وفوق 100.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">03</span><p>متى تستخدم &amp;&amp; ومتى || في أهلية؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> &amp;&amp; للمتطلبات التي يجب اجتماعها، و|| للمسارات البديلة؛ استخدم الأقواس عند دمجهما لتثبيت السياسة.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">04</span><p>لماذا رسالة “غير مؤهل” وحدها ضعيفة؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> لا تساعد المستخدم أو الاختبار أو الدعم على معرفة القاعدة الفاشلة؛ أعد سببًا محددًا دون كشف معلومات حساسة.</div></details>
</section>
</div>

## الخلاصة

اكتب الحل على مراحل، فعّل التحذيرات، واختبر الحالة العادية والحدود والمدخل غير الصالح. عندما تستطيع تفسير سبب كل سطر تكون قد فهمت الفكرة بدل حفظها.
