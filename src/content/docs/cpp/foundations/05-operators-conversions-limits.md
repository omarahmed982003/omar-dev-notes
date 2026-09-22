---
title: "المعاملات والتحويلات وحدود الأنواع"
description: "العوامل تبني التعبيرات، والتحويلات تحدد النوع الذي تُحسب به النتيجة. افهم القواعد بدل الاعتماد على التجربة العشوائية."
tableOfContents: true
---

## الفكرة العامة

العوامل تبني التعبيرات، والتحويلات تحدد النوع الذي تُحسب به النتيجة. افهم القواعد بدل الاعتماد على التجربة العشوائية.

## المفاهيم التي تحتاجها

- قسمة عددين صحيحين تحذف الجزء الكسري؛ حوّل أحدهما إلى double عند الحاجة.
- % يعمل مع الأعداد الصحيحة ويعيد الباقي.
- العوامل العلاقية والمنطقية تنتج bool.
- التحويل الصريح static_cast يوثق النية، لكنه لا يجعل التحويل الآمن تلقائيًا.
- Overflow للأنواع signed خطر، وحدود النوع تُقرأ من numeric_limits.
- العوامل البتية تعمل على البِتّات وليست بديلًا عن && و||.

## مثال

```cpp
int total{7};
int count{2};
double average = static_cast<double>(total) / count; // 3.5
bool valid = count > 0 && average >= 0.0;
```

## أخطاء شائعة وتصحيحات

- لا تخلط = مع ==.
- ضع أقواسًا عندما تؤثر أولوية العوامل في وضوح المعنى.

## خريطة الدرس

<div class="lesson-diagram" role="img" aria-label="خريطة مفاهيم: المعاملات والتحويلات وحدود الأنواع">
<p class="lesson-diagram-title">خريطة مفاهيم: المعاملات والتحويلات وحدود الأنواع</p>
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
<div class="quiz-question-row"><span class="quiz-number">01</span><p>ما ناتج 7/2 و7.0/2 ولماذا؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> الأول 3 بقسمة صحيحة، والثاني 3.5 لأن وجود double يرفع الحساب إلى قسمة عشرية.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">02</span><p>لماذا static_cast&lt;int&gt;(largeDouble) ليس ضمان أمان؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> هو يعلن نية التحويل فقط؛ قد تضيع الكسور أو تكون القيمة خارج مجال int، لذا يجب التحقق أولًا.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">03</span><p>ما الفرق بين &amp;&amp; و&amp; مع قيم Boolean؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> &amp;&amp; منطقي ويستخدم Short-circuit، أما &amp; بتّي ويقيّم الطرفين ويعمل على البتات؛ قد تتشابه نتيجة bool لكن السلوك مختلف.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">04</span><p>كيف تمنع Overflow في n*(n+1)/2؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> وسّع أحد العوامل قبل الضرب مثل 1LL*n، وتحقق أن المجال الأوسع يكفي للحد الأقصى المتوقع.</div></details>
</section>
</div>

## الخلاصة

اكتب الحل على مراحل، فعّل التحذيرات، واختبر الحالة العادية والحدود والمدخل غير الصالح. عندما تستطيع تفسير سبب كل سطر تكون قد فهمت الفكرة بدل حفظها.
