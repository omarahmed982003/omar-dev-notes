---
title: "مقدمة البرمجة التنافسية ومنصات التدريب"
description: "البرمجة التنافسية تدريب مركز على تحليل القيود واختيار الخوارزمية وكتابة حل صحيح سريع. المنصة أداة قياس وليست بديلًا عن الفهم."
tableOfContents: true
---

## الفكرة العامة

البرمجة التنافسية تدريب مركز على تحليل القيود واختيار الخوارزمية وكتابة حل صحيح سريع. المنصة أداة قياس وليست بديلًا عن الفهم.

## المفاهيم التي تحتاجها

- اقرأ المدخلات والمخرجات والقيود قبل الأمثلة.
- حوّل القيود إلى تعقيد مقبول؛ n=10^5 غالبًا لا يحتمل O(n²).
- حل أمثلة يدويًا ثم اختبر حالاتك الخاصة.
- بعد Wrong Answer افحص الحدود والنوع والتقريب والفهم، لا تغيّر الكود عشوائيًا.
- اكتب تعقيد الزمن والذاكرة بعد الحل.

## مثال

```cpp
// Elephant: minimum moves of length at most 5
int moves = (distance + 4) / 5; // integer ceiling
```

## أخطاء شائعة وتصحيحات

- قبول العينة لا يعني قبول كل الحالات.
- لا تبدأ بأصعب منصة؛ ابنِ عادة حل يومية تدريجية.

## خريطة الدرس

<div class="lesson-diagram" role="img" aria-label="خريطة مفاهيم: مقدمة البرمجة التنافسية ومنصات التدريب">
<p class="lesson-diagram-title">خريطة مفاهيم: مقدمة البرمجة التنافسية ومنصات التدريب</p>
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
<div class="quiz-question-row"><span class="quiz-number">01</span><p>لماذا تحدد القيود الخوارزمية قبل الكود؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> لأن n=10^5 قد يستبعد O(n²) مهما كان التنفيذ مرتبًا، بينما O(n log n) أو O(n) قد يناسب.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">02</span><p>ما معنى Wrong Answer بعد نجاح العينات؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> العينات ليست إثباتًا؛ راجع تفسير المسألة والحدود والأنواع والتقريب وأنشئ حالات مضادة.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">03</span><p>لماذا صيغة (d+4)/5 تحل Elephant؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> إنها Ceiling للقسمة الصحيحة على 5: إضافة 4 ترفع أي باقي إلى خطوة إضافية دون استخدام floating point.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">04</span><p>كيف تبني تدريبًا مفيدًا بعد قبول الحل؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> اكتب التعقيد، راجع حلًا بديلًا، أعد التنفيذ لاحقًا، وسجل الخطأ الذي منعك أول مرة.</div></details>
</section>
</div>

## الخلاصة

اكتب الحل على مراحل، فعّل التحذيرات، واختبر الحالة العادية والحدود والمدخل غير الصالح. عندما تستطيع تفسير سبب كل سطر تكون قد فهمت الفكرة بدل حفظها.
