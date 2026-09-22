---
title: "مشروع تحليل الطلب الإلكتروني"
description: "مشروع الطلب الإلكتروني يجمع المدخلات والتحقق والحساب والشروط في مسار واحد. بناؤه على مراحل يجعل الاختبار والتعديل أسهل."
tableOfContents: true
---

## الفكرة العامة

مشروع الطلب الإلكتروني يجمع المدخلات والتحقق والحساب والشروط في مسار واحد. بناؤه على مراحل يجعل الاختبار والتعديل أسهل.

## المفاهيم التي تحتاجها

- عرّف قواعد السعر والخصم والشحن والحد الأدنى كتابةً.
- تحقق من الكمية والسعر والكوبون قبل الحساب.
- احسب subtotal ثم discount ثم shipping ثم total بترتيب واضح.
- افصل قرار الخصم عن قرار الشحن.
- اطبع فاتورة توضح كل جزء حتى يمكن مراجعة النتيجة.

## مثال

```cpp
double subtotal = quantity * unitPrice;
double discount = isMember && subtotal >= 500 ? subtotal * 0.10 : 0.0;
double shipping = subtotal - discount >= 750 ? 0.0 : 45.0;
double total = subtotal - discount + shipping;
```

## أخطاء شائعة وتصحيحات

- وضّح هل الشحن المجاني يعتمد على السعر قبل الخصم أم بعده.
- لا تستخدم double لقيم مالية حرجة في أنظمة حقيقية؛ استخدم أصغر وحدة صحيحة أو نوعًا عشريًا مناسبًا.

## خريطة الدرس

<div class="lesson-diagram" role="img" aria-label="خريطة مفاهيم: مشروع تحليل الطلب الإلكتروني">
<p class="lesson-diagram-title">خريطة مفاهيم: مشروع تحليل الطلب الإلكتروني</p>
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
<div class="quiz-question-row"><span class="quiz-number">01</span><p>يطبق الشحن المجاني بعد الخصم أم قبله؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> ليست حقيقة تقنية بل قرار عمل يجب توثيقه. اختلاف الأساس يغير حالات الحدود والنتيجة.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">02</span><p>لماذا لا يفضل double للأموال الحقيقية؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> التمثيل الثنائي لا يمثل بعض الكسور العشرية بدقة؛ استخدم أصغر وحدة صحيحة أو Decimal مناسبًا.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">03</span><p>كيف تمنع تراكم كوبون مع خصم العضوية؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> اجعل سياسة اختيار الخصم صريحة: اختر الأفضل أو ذا الأولوية بدل جمعهما تلقائيًا، واختبر الحالتين.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">04</span><p>ما أقل مجموعة اختبارات جيدة للمشروع؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> طلب عادي، وكل حد للخصم والشحن تحته وعنده وفوقه، كوبون صالح/فاسد، كمية صفر/سالبة، ومدخل كبير.</div></details>
</section>
</div>

## الخلاصة

اكتب الحل على مراحل، فعّل التحذيرات، واختبر الحالة العادية والحدود والمدخل غير الصالح. عندما تستطيع تفسير سبب كل سطر تكون قد فهمت الفكرة بدل حفظها.
