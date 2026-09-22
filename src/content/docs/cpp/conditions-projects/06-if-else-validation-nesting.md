---
title: "if وelse والتحقق والشروط المتداخلة"
description: "if وelse توجّهان التنفيذ. اكتب الشروط بحيث يقرأها الإنسان كقواعد واضحة، وقلل التعشيق بالتحقق المبكر وتجميع المنطق المتشابه."
tableOfContents: true
---

## الفكرة العامة

if وelse توجّهان التنفيذ. اكتب الشروط بحيث يقرأها الإنسان كقواعد واضحة، وقلل التعشيق بالتحقق المبكر وتجميع المنطق المتشابه.

## المفاهيم التي تحتاجها

- if يقبل تعبيرًا قابلًا للتحويل إلى bool، لكن المقارنة الصريحة أوضح غالبًا.
- الأقواس تمنع أخطاء السطر الواحد عند إضافة تعليمات لاحقًا.
- else ترتبط بأقرب if غير مرتبطة؛ الأقواس تحسم المقصود.
- سلسلة else-if حصرية؛ عدة if مستقلة قد تنفذ أكثر من فرع.
- رتّب الحالات الخاصة والحدود قبل الحالة العامة.
- Short-circuit يسمح بفحص المقام قبل القسمة أو المؤشر قبل الاستخدام.

## مثال

```cpp
if (score < 0 || score > 100) {
    std::cout << "Invalid score\n";
} else if (score >= 85) {
    std::cout << "Excellent\n";
} else if (score >= 50) {
    std::cout << "Pass\n";
} else {
    std::cout << "Fail\n";
}
```

## أخطاء شائعة وتصحيحات

- if (x = 5) يسند قيمة بدل المقارنة.
- فاصلة منقوطة بعد if تصنع جسمًا فارغًا.

<div class="lesson-diagram" role="img" aria-label="مسار if/else: التحقق أولًا ثم اختيار فرع حصري">
<p class="lesson-diagram-title">مسار if/else: التحقق أولًا ثم اختيار فرع حصري</p>
<div class="diagram-flow">
<div class="diagram-node input"><span>اقرأ القيمة</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node decision"><span>هل صالحة؟</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node decision"><span>أي نطاق يطابق؟</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>نفّذ الفرع</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node output"><span>أعد النتيجة</span></div>
</div>
</div>

## تأكد من فهمك

<div class="lesson-quiz" role="list">
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">01</span><p>لماذا يجب ترتيب score&gt;=85 قبل score&gt;=50؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> لأن else-if تتوقف عند أول شرط صحيح؛ وضع &gt;=50 أولًا يلتقط درجات الممتاز ويجعل الفرع الخاص غير قابل للوصول.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">02</span><p>ما أثر if(x=5)؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> يسند 5 إلى x ثم تتحول القيمة غير الصفرية إلى true؛ استخدم == وفعّل تحذيرات المترجم.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">03</span><p>متى تستخدم if مستقلة بدل else-if؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> عندما يمكن أن تتحقق نتائج متعددة في الوقت نفسه، مثل منح أكثر من Badge؛ else-if للحالات الحصرية.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">04</span><p>كيف تقلل Nested if في التحقق؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> استخدم Guard clauses لرفض المدخل غير الصالح مبكرًا، ثم اترك المسار الرئيسي أقل تعشيقًا.</div></details>
</section>
</div>

## الخلاصة

اكتب الحل على مراحل، فعّل التحذيرات، واختبر الحالة العادية والحدود والمدخل غير الصالح. عندما تستطيع تفسير سبب كل سطر تكون قد فهمت الفكرة بدل حفظها.
