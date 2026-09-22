---
title: "أنظمة الأعداد ومكوّنات الكمبيوتر"
description: "تفهم أنظمة الأعداد كيف تُمثّل القيم، وتفهم مكونات الحاسوب أين يعيش البرنامج وكيف ينتقل من التخزين إلى التنفيذ."
tableOfContents: true
---

## الفكرة العامة

تفهم أنظمة الأعداد كيف تُمثّل القيم، وتفهم مكونات الحاسوب أين يعيش البرنامج وكيف ينتقل من التخزين إلى التنفيذ.

## المفاهيم التي تحتاجها

- العشري أساسه 10، والثنائي 2، والثماني 8، والسداسي عشر 16.
- في النظام الموضعي تساوي قيمة الخانة الرقم مضروبًا في قوة الأساس.
- كل رقم Hex يمثل أربع بِتّات، لذلك يسهل التحويل بينهما.
- CPU ينفذ التعليمات، وRAM تحمل البيانات النشطة، وCache تقلل زمن الوصول المتكرر.
- عند تشغيل برنامج يحمّل نظام التشغيل أجزاءه من التخزين إلى الذاكرة وينشئ Process.

## مثال

```text
45₁₀ = 32 + 8 + 4 + 1 = 101101₂ = 2D₁₆
```

## أخطاء شائعة وتصحيحات

- الذاكرة RAM ليست التخزين الدائم.
- التحويل لا يغير القيمة؛ يغير طريقة كتابتها فقط.

## خريطة الدرس

<div class="lesson-diagram" role="img" aria-label="خريطة مفاهيم: أنظمة الأعداد ومكوّنات الكمبيوتر">
<p class="lesson-diagram-title">خريطة مفاهيم: أنظمة الأعداد ومكوّنات الكمبيوتر</p>
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
<div class="quiz-question-row"><span class="quiz-number">01</span><p>حوّل 0x2D إلى عشري وثنائي.</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> 2D = 2×16+13 = 45، وكل رقم Hex أربع بتات: 2=0010 وD=1101، إذن 00101101.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">02</span><p>لماذا تستخدم Hex في عناوين الذاكرة والألوان؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> تمثيل أقصر من الثنائي مع تحويل مباشر لكل أربع بتات، لذلك يجمع الدقة وسهولة القراءة.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">03</span><p>ماذا يحدث تقريبًا عند فتح برنامج من SSD؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> يحمّل نظام التشغيل الكود والبيانات المطلوبة إلى RAM، ينشئ Process، ثم يجلب CPU التعليمات مع الاستفادة من Cache.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">04</span><p>هل زيادة RAM تجعل CPU أسرع؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> لا ترفع سرعة المعالج نفسها، لكنها تقلل اللجوء للتخزين البطيء عند ضغط الذاكرة وقد تحسن أداء النظام.</div></details>
</section>
</div>

## الخلاصة

اكتب الحل على مراحل، فعّل التحذيرات، واختبر الحالة العادية والحدود والمدخل غير الصالح. عندما تستطيع تفسير سبب كل سطر تكون قد فهمت الفكرة بدل حفظها.
