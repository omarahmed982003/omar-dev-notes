---
title: "switch وcase وFall-through"
description: "switch مناسب لاختيار فرع حسب قيمة منفصلة واحدة. استخدمه عندما تكون الحالات ثابتة وواضحة، ويفضل if للنطاقات والشروط المركبة."
tableOfContents: true
---

## الفكرة العامة

switch مناسب لاختيار فرع حسب قيمة منفصلة واحدة. استخدمه عندما تكون الحالات ثابتة وواضحة، ويفضل if للنطاقات والشروط المركبة.

## المفاهيم التي تحتاجها

- case labels يجب أن تكون ثوابت مميزة قابلة للمقارنة مع selector.
- break يمنع الانتقال للحالة التالية.
- default يعالج القيمة غير المعروفة.
- جمع حالات متعددة مفيد عندما تشترك في السلوك.
- Fall-through المقصود يجب أن يكون واضحًا، ويمكن توثيقه بـ[[fallthrough]].
- عرّف متغيرات الحالة داخل أقواس إذا احتجت نطاقًا محليًا.

## مثال

```cpp
switch (choice) {
case 1: runReport(); break;
case 2: saveFile(); break;
case 0: std::cout << "Bye\n"; break;
default: std::cout << "Unknown option\n";
}
```

## أخطاء شائعة وتصحيحات

- switch لا يختبر score >= 50 مباشرة.
- نسيان break قد يشغّل أكثر من حالة.

<div class="lesson-diagram" role="img" aria-label="كيف يختار switch الحالة وكيف يمنع break الانتقال">
<p class="lesson-diagram-title">كيف يختار switch الحالة وكيف يمنع break الانتقال</p>
<div class="diagram-flow">
<div class="diagram-node input"><span>Selector</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node decision"><span>ابحث عن case</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>نفّذ الحالة</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node decision"><span>break؟</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node output"><span>اخرج / default</span></div>
</div>
</div>

## تأكد من فهمك

<div class="lesson-quiz" role="list">
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">01</span><p>لماذا لا يصلح switch مباشرة لـscore&gt;=50؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> case يطابق قيمًا ثابتة منفصلة، لا نطاقات أو تعبيرات مقارنة؛ استخدم if/else للنطاقات.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">02</span><p>ماذا يحدث عند نسيان break؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> يستمر التنفيذ في الحالات التالية حتى break أو نهاية switch، وهو Fall-through قد يكون خطأ أو مقصودًا موثقًا.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">03</span><p>متى تجمع عدة case؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> عندما تشترك قيم متعددة في السلوك نفسه، مثل عدة حروف تؤدي إلى الأمر نفسه.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">04</span><p>لماذا تحتاج أقواسًا داخل case عند تعريف متغير؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> لإنشاء نطاق واضح وتجنب القفز فوق تهيئة متغير بين labels مختلفة.</div></details>
</section>
</div>

## الخلاصة

اكتب الحل على مراحل، فعّل التحذيرات، واختبر الحالة العادية والحدود والمدخل غير الصالح. عندما تستطيع تفسير سبب كل سطر تكون قد فهمت الفكرة بدل حفظها.
