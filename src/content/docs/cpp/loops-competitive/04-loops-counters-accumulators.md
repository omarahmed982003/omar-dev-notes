---
title: "الحلقات والعدادات والمجاميع"
description: "الحلقة تصف تكرارًا له حالة بداية وشرط استمرار وتحديث. اختيار while أو for أو do-while يعتمد على شكل التكرار لا على التفضيل الشخصي."
tableOfContents: true
---

## الفكرة العامة

الحلقة تصف تكرارًا له حالة بداية وشرط استمرار وتحديث. اختيار while أو for أو do-while يعتمد على شكل التكرار لا على التفضيل الشخصي.

## المفاهيم التي تحتاجها

- for مناسب عندما يكون العداد ومساره معروفين.
- while مناسب عندما يعتمد التوقف على حالة تتغير أثناء التنفيذ.
- do-while ينفذ الجسم مرة واحدة على الأقل، ويفيد في قوائم أو تحقق تفاعلي.
- Counter يعد، Accumulator يجمع، Sentinel ينهي سلسلة غير معلومة الطول.
- break ينهي أقرب حلقة، وcontinue يتجاوز بقية الدورة.
- الحلقات المتداخلة غالبًا تضرب عدد التكرارات؛ احسب التعقيد.

## مثال

```cpp
long long sum{};
for (int i = 1; i <= n; ++i) {
    if (i % 2 != 0) continue;
    sum += i;
}
```

## أخطاء شائعة وتصحيحات

- تأكد أن كل مسار يقترب من شرط التوقف.
- تحديث العداد في المكان الخطأ قد يسبب دورة زائدة أو ناقصة.

<div class="lesson-diagram" role="img" aria-label="دورة الحلقة ومكان حدوث أخطاء البداية والحد والتحديث">
<p class="lesson-diagram-title">دورة الحلقة ومكان حدوث أخطاء البداية والحد والتحديث</p>
<div class="diagram-flow">
<div class="diagram-node start"><span>تهيئة</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node decision"><span>الشرط</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>جسم الحلقة</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>تحديث</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node output"><span>خروج</span></div>
</div>
</div>

## تأكد من فهمك

<div class="lesson-quiz" role="list">
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">01</span><p>متى تختار do-while بدل while؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> عندما يجب تنفيذ الجسم مرة واحدة قبل اختبار الاستمرار، مثل عرض قائمة أو قراءة أول محاولة.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">02</span><p>ما سبب Off-by-one الأكثر شيوعًا؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> عدم الاتفاق على هل الحد مشمول، أو بداية العداد، أو موضع التحديث؛ اكتب أول وآخر قيمة متوقعة قبل الحلقة.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">03</span><p>كيف تحسب متوسط سلسلة تنتهي بـ-1؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> اجمع القيم وعدها دون إدخال -1، ثم اقسم بعد التأكد أن count&gt;0.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">04</span><p>ماذا يحدث لتعقيد حلقتين متداخلتين كل منهما n؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> عادة O(n²)، لكن افحص الحدود الفعلية؛ إذا الداخلية تتناقص أو تتقدم إجمالًا فقد يختلف التحليل.</div></details>
</section>
</div>

## الخلاصة

اكتب الحل على مراحل، فعّل التحذيرات، واختبر الحالة العادية والحدود والمدخل غير الصالح. عندما تستطيع تفسير سبب كل سطر تكون قد فهمت الفكرة بدل حفظها.
