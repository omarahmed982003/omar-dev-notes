---
title: "13. مشروع المركز التدريبي"
sidebar:
  order: 13
description: "مشروع مركز التدريب يجب أن يكون نموذجًا لتصميم برنامج قابل للفهم، لا كتلة كود واحدة. افصل الإدخال والتحقق والتسعير والأهلية والإخراج."
tableOfContents: true
---

## متطلبات نظام التسجيل

مشروع مركز التدريب يجب أن يكون نموذجًا لتصميم برنامج قابل للفهم، لا كتلة كود واحدة. افصل الإدخال والتحقق والتسعير والأهلية والإخراج.

## الإدخال والتحقق والتسعير والأهلية

يبدأ النظام بعقد واضح للمدخلات: عمر المتدرب، الخطة المختارة، توافر المقاعد، والمبلغ المدفوع. لكل قيمة نوع ومدى ورسالة خطأ. العمر خارج الحدود بيانات غير صالحة، والخطة المجهولة اختيار غير صالح، وعدم وجود مقعد سبب رفض مستقل.

يجب تنفيذ التحقق قبل الحساب المالي. بعد نجاحه يحدد البرنامج السعر الأساسي من الخطة، ثم يحسب الخصم والضريبة والمبلغ المطلوب والباقي. لا تضع هذه القيم في تعبير واحد؛ الاسم المستقل لكل مرحلة يجعل الفاتورة والاختبارات قابلة للمراجعة.

ضع القواعد في دوال صغيرة أو متغيرات Boolean مسماة. الدالة `validAge` تجيب عن سؤال واحد، و`planPrice` تحول رمز الخطة إلى سعر. بعد ذلك تصبح مسؤولية `main` تنسيق القراءة واستدعاء القواعد وطباعة النتيجة، بدل احتواء المشروع كله.

اختبر القيم قبل الحد وعنده وبعده، وكل خطة صحيحة مع رمز مجهول، وتوافر المقاعد وعدمه، والدفع الأقل والمساوي والأكبر من المطلوب. احسب النتيجة المتوقعة يدويًا قبل مقارنتها بخروج البرنامج.

## دوال القواعد الأساسية

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
<div class="diagram-node input"><span>بيانات المتدرب</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>الأهلية والخطة</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>مثال</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node decision"><span>أخطاء شائعة وتصحيحات</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node output"><span>الخلاصة</span></div>
</div>
</div>

## تحليل المشروع

يستقبل النظام اسم المتدرب والعمر والمسار ونوع العضوية وطريقة الدفع، ثم يتحقق من صلاحية كل قيمة. بعد ذلك يحدد الأهلية والسعر والخصم وحالة التسجيل. لا تخلط Validation مع Pricing؛ قد تكون البيانات صحيحة لكن التسجيل مرفوض لعدم وجود مقعد.

## تقسيم التنفيذ

```text
Read input
  ↓
Validate ranges and menu codes
  ↓
Check eligibility and capacity
  ↓
Calculate base fee and discount
  ↓
Choose payment status
  ↓
Print a complete receipt or rejection reason
```

استخدم `switch` لاختيار مسار أو طريقة دفع من Code ثابت، و`if` للنطاقات مثل العمر وحدود الخصم. اطبع سببًا واحدًا واضحًا للفشل أو اجمع أخطاء الإدخال قبل إعادة الطلب حسب تصميم الواجهة.

## حالات الاختبار

- أصغر وأكبر عمر مسموح وما حولهما.
- آخر مقعد متاح والحالة بعد امتلاء المجموعة.
- Code مسار أو دفع غير معروف.
- عضو وغير عضو عند حد الخصم.
- فشل Stream وإدخال سالب.

بعد إتقان الأساسيات يمكن تقسيم المشروع إلى دوال للإدخال والتحقق والتسعير والطباعة، لكن قرار التقسيم يجب أن يحافظ على تدفق واضح للبيانات.

## تصميم البيانات قبل الدوال

لا تمرر رموزًا متناثرة بلا معنى. عرّف أسماء واضحة للخطة وحالة التسجيل، واجمع بيانات المتدرب التي تتحرك معًا. حتى قبل دراسة Classes يمكن استخدام متغيرات مسماة وثوابت و`enum class` لتقليل الأرقام والحروف السحرية.

## فصل الحساب عن الإدخال والإخراج

الدالة التي تحسب السعر لا تحتاج إلى `cin` أو `cout`. تستقبل الخطة والبيانات وتعيد نتيجة. هذا يسمح باختبار عشرات الحالات مباشرة من غير إدخال يدوي. تبقى واجهة Console مسؤولة عن القراءة والعرض فقط.

## حالات المشروع المتكاملة

اختبار كل دالة وحدها مهم لكنه لا يكفي. اختبر رحلة كاملة: بيانات صحيحة ومقعد متاح ودفع كامل، ثم عمر عند الحد، وخطة غير معروفة، ومركز ممتلئ، ودفع ناقص، ومدخل نصي مكان الرقم. تأكد أن كل فشل يوقف المراحل التي لا يجب تنفيذها.

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
