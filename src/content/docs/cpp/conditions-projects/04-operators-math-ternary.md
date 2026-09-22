---
title: "المعاملات والتحويلات والرياضيات وTernary"
description: "استخدم العوامل لبناء شروط وصيغ مقروءة. المعيار ليس قِصر السطر بل وضوح المعنى وسلامة النوع والحدود."
tableOfContents: true
---

## الفكرة العامة

استخدم العوامل لبناء شروط وصيغ مقروءة. المعيار ليس قِصر السطر بل وضوح المعنى وسلامة النوع والحدود.

## المفاهيم التي تحتاجها

- استخرج أجزاء التعبير إلى متغيرات Boolean ذات أسماء.
- Short-circuit يمنع تقييم الطرف الثاني عندما حُسمت النتيجة.
- ceil مناسب لعدد وحدات يجب شراؤها كاملًا، وfloor لعدد وحدات مكتملة.
- العامل الثلاثي يعيد قيمة، لذلك يناسب اختيارًا بسيطًا.
- العوامل البتية لها حالات مثل flags ولا تعادل المنطق البولياني.

## مثال

```cpp
bool canDivide = denominator != 0;
double result = canDivide ? numerator / denominator : 0.0;
int boxes = static_cast<int>(std::ceil(items / 12.0));
```

## أخطاء شائعة وتصحيحات

- لا تستخدم ternary متداخلة إذا احتجت وقتًا لفكها.
- floor(-2.1) يساوي -3؛ اختبر السالب صراحة.

## خريطة الدرس

<div class="lesson-diagram" role="img" aria-label="خريطة مفاهيم: المعاملات والتحويلات والرياضيات وTernary">
<p class="lesson-diagram-title">خريطة مفاهيم: المعاملات والتحويلات والرياضيات وTernary</p>
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
<div class="quiz-question-row"><span class="quiz-number">01</span><p>لماذا يفيد Short-circuit في denominator!=0 &amp;&amp; a/denominator&gt;2؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> إذا كان المقام صفرًا لا يقيّم الطرف الثاني، فيمنع القسمة غير الصالحة. ترتيب الشرط جزء من الأمان.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">02</span><p>كم صندوقًا يلزم لـ25 عنصرًا وسعة 12؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> ceil(25/12.0)=3. القسمة الصحيحة وحدها تعطي 2 وتفقد الصندوق الجزئي المطلوب.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">03</span><p>ما مشكلة ternary متداخلة لثلاث درجات؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> يصعب رؤية ترتيب الحدود وربط كل نتيجة بشرطها؛ else-if بأسماء وحدود مرتبة أوضح.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">04</span><p>متى تستخدم عاملًا بتيًا بدل منطقي؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> عند التعامل مع flags أو masks وتمثيل البتات. شروط الأعمال المعتادة تستخدم &amp;&amp; و||.</div></details>
</section>
</div>

## الخلاصة

اكتب الحل على مراحل، فعّل التحذيرات، واختبر الحالة العادية والحدود والمدخل غير الصالح. عندما تستطيع تفسير سبب كل سطر تكون قد فهمت الفكرة بدل حفظها.
