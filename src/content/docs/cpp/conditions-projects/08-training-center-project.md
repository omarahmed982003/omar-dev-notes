---
title: "مشروع نظام تسجيل مركز تدريبي"
description: "مشروع مركز التدريب يجب أن يكون نموذجًا لتصميم برنامج قابل للفهم، لا كتلة كود واحدة. افصل الإدخال والتحقق والتسعير والأهلية والإخراج."
tableOfContents: true
---

## الفكرة العامة

مشروع مركز التدريب يجب أن يكون نموذجًا لتصميم برنامج قابل للفهم، لا كتلة كود واحدة. افصل الإدخال والتحقق والتسعير والأهلية والإخراج.

## المفاهيم التي تحتاجها

- حدد أنواع المدخلات وخيارات الخطط وحدودها.
- نفذ التحقق قبل أي حساب مالي.
- ضع كل قاعدة في دالة أو قيمة Boolean مسماة.
- افصل السعر الأساسي والخصم والضريبة والمبلغ المدفوع والباقي.
- اكتب حالات اختبار عادية وحدّية ورفض لكل قاعدة.
- بعد نجاح النسخة الأولى استخرج الدوال لتقليل مسؤولية main.

## مثال

```cpp
bool validAge(int age) { return age >= 12 && age <= 80; }
double planPrice(char plan) {
    switch (plan) { case 'B': return 600; case 'P': return 900; default: return 0; }
}
```

## أخطاء شائعة وتصحيحات

- لا تكرر الكود نفسه لكل خطة؛ غيّر البيانات واترك الخوارزمية مشتركة.
- الاختبار المتوقع يجب أن يحسب يدويًا قبل مقارنة خرج البرنامج.

## خريطة الدرس

<div class="lesson-diagram" role="img" aria-label="خريطة مفاهيم: مشروع نظام تسجيل مركز تدريبي">
<p class="lesson-diagram-title">خريطة مفاهيم: مشروع نظام تسجيل مركز تدريبي</p>
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
<div class="quiz-question-row"><span class="quiz-number">01</span><p>لماذا لا يجب أن تحتوي main كل المشروع؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> خلط الإدخال والتحقق والحساب والطباعة يصعب الاختبار والتغيير؛ اجعل main منسقًا واستخرج وظائف صغيرة.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">02</span><p>كيف تختبر planPrice دون تشغيل البرنامج كاملًا؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> اجعلها دالة نقية، ومرر كل خطة صحيحة وقيمة غير معروفة، ثم قارن النتائج المتوقعة مباشرة.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">03</span><p>ما فائدة جدول القرار للأهلية؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> يكشف التركيبات غير المغطاة والتعارض بين القواعد قبل تحويلها إلى شروط متداخلة.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">04</span><p>كيف تمنع تكرار الخوارزمية لكل خطة؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> مثل الخطط كبيانات: اسم وسعر وخصائص، ثم استخدم مسار حساب واحد يقرأ هذه البيانات.</div></details>
</section>
</div>

## الخلاصة

اكتب الحل على مراحل، فعّل التحذيرات، واختبر الحالة العادية والحدود والمدخل غير الصالح. عندما تستطيع تفسير سبب كل سطر تكون قد فهمت الفكرة بدل حفظها.
