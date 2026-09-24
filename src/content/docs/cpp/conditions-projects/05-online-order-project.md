---
title: "10. مشروع الطلب الإلكتروني"
sidebar:
  order: 10
description: "مشروع الطلب الإلكتروني يجمع المدخلات والتحقق والحساب والشروط في مسار واحد. بناؤه على مراحل يجعل الاختبار والتعديل أسهل."
tableOfContents: true
---

## متطلبات الطلب الإلكتروني

مشروع الطلب الإلكتروني يجمع المدخلات والتحقق والحساب والشروط في مسار واحد. بناؤه على مراحل يجعل الاختبار والتعديل أسهل.

## السعر والكمية والخصم والشحن

يحتاج البرنامج إلى سعر الوحدة والكمية وحالة العضوية أو الكوبون. يجب تحديد الحدود قبل الحساب: السعر لا يكون سالبًا، والكمية أكبر من صفر، والكوبون ينتمي إلى قائمة القيم المعروفة. رفض البيانات مبكرًا يمنع إنتاج فاتورة تبدو صحيحة من مدخلات فاسدة.

`subtotal` هو سعر الوحدة مضروبًا في الكمية قبل أي خصم. `discount` قيمة مطروحة وليست السعر النهائي. `shipping` تكلفة مستقلة، و`total` يساوي السعر الجزئي ناقص الخصم زائد الشحن. تسمية كل قيمة وسيطة تجعل الفاتورة قابلة للمراجعة وتمنع تكرار الحساب بتعابير مختلفة.

يجب أن توثق السياسة هل حد الشحن المجاني يعتمد على السعر قبل الخصم أم بعده، وهل يمكن جمع خصم العضو مع الكوبون، وكيف يتم التقريب. هذه قرارات عمل وليست تفاصيل يستطيع المبرمج تخمينها.

في الأنظمة المالية الحقيقية يفضل تخزين أصغر وحدة صحيحة، مثل القرش، بدل `double` لأن كثيرًا من الكسور العشرية لا تُمثّل بدقة في النظام الثنائي.

## نموذج أولي للحساب

```cpp
double subtotal = quantity * unitPrice;
double discount = isMember && subtotal >= 500 ? subtotal * 0.10 : 0.0;
double shipping = subtotal - discount >= 750 ? 0.0 : 45.0;
double total = subtotal - discount + shipping;
```

## أخطاء شائعة وتصحيحات

- وضّح هل الشحن المجاني يعتمد على السعر قبل الخصم أم بعده.
- لا تستخدم double لقيم مالية حرجة في أنظمة حقيقية؛ استخدم أصغر وحدة صحيحة أو نوعًا عشريًا مناسبًا.

## بناء المشروع على مراحل

1. اقرأ المدخلات وافحص نجاح Stream.
2. ارفض السعر أو الكمية السالبة قبل أي حساب.
3. احسب Subtotal مرة واحدة وخزنه باسم واضح.
4. طبّق الخصم وفق حد موثق، ثم احسب الشحن حسب القاعدة المتفق عليها.
5. اطبع فاتورة تضم القيم الوسيطة حتى يسهل تشخيص أي اختلاف.

## مصفوفة الاختبار

| الحالة | ما الذي تثبته؟ |
|---|---|
| كمية 0 | تعريف السلة الفارغة |
| 499، 500، 501 | صحة حد الخصم |
| الإجمالي حول حد الشحن المجاني | ترتيب الخصم والشحن |
| كوبون غير معروف | مسار الرفض أو التجاهل الموثق |
| إدخال نصي بدل رقم | فشل Stream دون استخدام قيمة غير صالحة |

أضف سيناريو المركز التدريبي داخل المشروع كتطبيق ثانٍ لنفس الأفكار: تحقق من العمر والمقاعد وطريقة الدفع، ثم اختر الرسوم والحالة النهائية. الفكرة الجديدة ليست `if` أخرى، بل تحويل قواعد مكتوبة إلى مسارات كاملة لا تترك حالة بلا نتيجة.

## برنامج كامل قابل للمراجعة

```cpp
#include <iomanip>
#include <iostream>

int main()
{
    int quantity{};
    long long unitPricePiasters{};
    char memberAnswer{};

    if (!(std::cin >> quantity >> unitPricePiasters >> memberAnswer) ||
        quantity < 0 || unitPricePiasters < 0) {
        std::cerr << "Invalid input\n";
        return 1;
    }

    long long subtotal = quantity * unitPricePiasters;
    bool member = memberAnswer == 'Y' || memberAnswer == 'y';
    long long discount = member && subtotal >= 50000 ? subtotal / 10 : 0;
    long long afterDiscount = subtotal - discount;
    long long shipping = afterDiscount >= 75000 ? 0 : 4500;
    long long total = afterDiscount + shipping;

    std::cout << "Subtotal: " << subtotal << " piasters\n"
              << "Discount: " << discount << " piasters\n"
              << "Shipping: " << shipping << " piasters\n"
              << "Total: " << total << " piasters\n";
}
```

استخدم البرنامج أصغر وحدة صحيحة لتجنب أخطاء الكسور في الأموال. ما زال يحتاج فحص Overflow في نظام حقيقي، كما يحتاج توثيق هل الخصم يقرب لأسفل وكيف تمثل الضرائب والكوبونات.

## فصل الحساب عن الإدخال

في المرحلة التالية انقل التسعير إلى دالة تستقبل بيانات صالحة وتعيد Breakdown. عندها تختبر 499 و500 و501 دون تشغيل `cin`، ويصبح تغيير واجهة الإدخال مستقلًا عن منطق السعر.

## خريطة الدرس

<div class="lesson-diagram" role="img" aria-label="خريطة مفاهيم: مشروع تحليل الطلب الإلكتروني">
<p class="lesson-diagram-title">خريطة مفاهيم: مشروع تحليل الطلب الإلكتروني</p>
<div class="diagram-flow">
<div class="diagram-node input"><span>السعر والكمية</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>الخصم والشحن</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>مثال</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node decision"><span>أخطاء شائعة وتصحيحات</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node output"><span>الخلاصة</span></div>
</div>
</div>

## المخزون والكوبونات والتقريب

يجب فحص المخزون قبل تأكيد الطلب. إذا كانت الكمية المطلوبة أكبر من المتاح، تحدد السياسة هل ترفض الطلب كاملًا أم تقبل الكمية المتاحة. والكوبون كيان له رمز وفترة صلاحية وحد أدنى وربما حد استخدام؛ مجرد مقارنة النص لا يكفي في نظام حقيقي.

عند استخدام أصغر وحدة مالية صحيحة، مثل القرش، تصبح عمليات الجمع دقيقة. أما الخصم النسبي فقد ينتج كسر قرش، ولذلك يجب تحديد قاعدة التقريب: إلى الأقرب أم لأسفل أم لصالح العميل. طبق التقريب في موضع واحد واختبر قيمًا تقع حول نصف الوحدة.

## ثبات الفاتورة وإعادة الحساب

احفظ القيم التي اعتمدت عليها الفاتورة وقت الطلب. إذا تغير سعر المنتج لاحقًا، لا ينبغي أن تتغير فاتورة قديمة عند عرضها. افصل سعر الكتالوج الحالي عن Snapshot السعر والخصم داخل بند الطلب.

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
