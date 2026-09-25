---
title: "12. المدخلات وقواعد العمل"
sidebar:
  order: 12
description: "قواعد العمل تتحول إلى شروط واضحة بعد تسمية كل حقيقة مستقلة والتحقق من صحة المدخلات. افصل صلاحية البيانات عن قرار القبول."
tableOfContents: true
---

## من نص المتطلبات إلى شروط

قواعد العمل تتحول إلى شروط واضحة بعد تسمية كل حقيقة مستقلة والتحقق من صحة المدخلات. افصل صلاحية البيانات عن قرار القبول.

## صلاحية البيانات وقرار العمل

ابدأ بجدول يحدد اسم كل مدخل ونوعه والمدى المقبول. الدرجة مثلًا عدد من `0` إلى `100`. هذه قاعدة صلاحية بيانات، وليست قرار نجاح. بعد التأكد من صحة القيمة يمكن تطبيق سياسة النجاح، مثل اشتراط درجة لا تقل عن `60` وحضور لا يقل عن `75`.

سمّ كل حقيقة مستقلة باسم يشرح معناها، مثل `hasPassingGrade` أو `attendanceIsValid`. الاسم يمنع تكرار تعبير طويل ويجعل الشرط قريبًا من لغة المتطلبات.

تجمع `&&` الشروط المطلوبة معًا، لذلك تفشل النتيجة إذا فشل أي شرط. تجمع `||` بدائل يكفي تحقق أحدها. عند مزج العاملين استخدم الأقواس لتوثيق المقصود حتى لو كانت أولوية العوامل ستعطي النتيجة نفسها.

رسالة «مرفوض» وحدها لا تساعد المستخدم أو الاختبار. حدد هل السبب بيانات غير صالحة، أم درجة منخفضة، أم حضور غير كافٍ. واختبر دائمًا قيمة أقل من الحد والحد نفسه وقيمة أعلى منه لتكتشف الفرق بين `>` و`>=`.

## مثال: أهلية الطالب

```cpp
bool validScore = score >= 0 && score <= 100;
bool eligible = validScore && score >= 60 && attendance >= 75;
```

## أخطاء شائعة وتصحيحات

- لا تجعل قيمة غير صالحة تدخل في قرار الأعمال.
- انتبه هل الحد مشمول: `>` أم `>=`.

## خريطة الدرس

<div class="lesson-diagram" role="img" aria-label="خريطة مفاهيم: الإدخال وتحويل قواعد العمل إلى شروط">
<p class="lesson-diagram-title">خريطة مفاهيم: الإدخال وتحويل قواعد العمل إلى شروط</p>
<div class="diagram-flow">
<div class="diagram-node input"><span>مدخل خام</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>Validation</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>حقائق Boolean مسماة</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node decision"><span>Decision Table</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node output"><span>قبول أو سبب رفض واضح</span></div>
</div>
</div>

## استخراج المتطلبات

حوّل نص المسألة إلى أربعة أقسام: Inputs، Validity rules، Business decisions، Outputs. «اقرأ العمر والدخل، ارفض العمر الأقل من 21، واطلب ضامنًا عند انخفاض الدخل» يحتوي تحققًا من العمر، وقرارًا مستقلًا عن كفاية الدخل، ومسار مراجعة لا يساوي الرفض.

سمِّ الحقائق بدل تكرار تعبير طويل:

```cpp
bool adult = age >= 21;
bool incomeEnough = income >= 30000;
bool strongCredit = creditScore >= 700;
bool canApprove = adult && incomeEnough && strongCredit;
```

الأسماء تجعل مراجعة القاعدة أسهل، لكن لا تنس التحقق من أن القيم نفسها داخل المجال المعقول قبل استخدامها.

## Truth table وDecision table

يساعد Truth table في فهم `&&` و`||` و`!`. أما Decision table فيجمع عدة شروط وقواعد عمل. اكتب كل Combination المهم وحدد النتيجة حتى تكتشف حالة بلا Outcome أو قاعدتين تعطيان نتيجتين متعارضتين.

## تصميم الحالات

اختبر Minimum وMaximum والقيمة عند الحد وما قبلها وما بعدها. أضف مدخلًا يفشل Parsing ومدخلًا صحيح النوع لكنه غير صالح في المجال. إذا استخدمت Floating point فلا تختبر التساوي الحرفي لنتائج حسابية حساسة دون سياسة تقريب واضحة.

## ترتيب التحقق ورسائل الرفض

افصل فشل قراءة القيمة عن كونها خارج المجال وعن عدم استيفاء قاعدة العمل. النص بدل الرقم Input Error، ودرجة `120` Validation Error، ودرجة `55` رفض طبيعي وفق السياسة. هذا الفصل يمنع عرض «غير مؤهل» لبيانات لم تكن صالحة أصلًا.

إذا أمكن فشل أكثر من قاعدة، حدد هل يعرض النظام أول سبب أم كل الأسباب. عرض كل الأسباب يناسب نموذج تسجيل، بينما قد يتعمد نظام أمني عدم كشف تفاصيل حساسة. اكتب القرار في المتطلبات واختبر ترتيب الرسائل.

## القواعد المشتقة وعدم تكرار المنطق

احسب الحقيقة المسماة مرة واحدة ثم استخدمها. إذا كررت `score >= 60 && attendance >= 75` في ثلاثة أماكن، فقد تعدل حدًا وتنسى الآخرين. يمكن لاحقًا نقل القاعدة إلى دالة نقية تستقبل البيانات وتعيد النتيجة من غير قراءة أو طباعة، فيسهل اختبارها.

## برنامج كامل: صلاحية البيانات ثم قرار الأهلية

```cpp
#include <iostream>
int main() {
    int score{}, attendance{}; char paidAnswer{};
    std::cout << "Score attendance paid(y/n): ";
    if (!(std::cin >> score >> attendance >> paidAnswer)) {
        std::cerr << "Invalid input format\n"; return 1;
    }
    if (score < 0 || score > 100 || attendance < 0 || attendance > 100 ||
        (paidAnswer != 'y' && paidAnswer != 'Y' && paidAnswer != 'n' && paidAnswer != 'N')) {
        std::cerr << "Input outside the accepted domain\n"; return 1;
    }
    const bool paid = paidAnswer == 'y' || paidAnswer == 'Y';
    const bool eligible = score >= 60 && attendance >= 75 && paid;
    std::cout << (eligible ? "Eligible\n" : "Not eligible\n");
}
```

اختبر `59/60` و`74/75` وإجابتي الدفع ومدخلًا خارج المجال. الـValidation يسبق قرار الأهلية ولا يختلط به.

## تأكد من فهمك

<div class="lesson-quiz" role="list">
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">01</span><p>لماذا تفصل validScore عن eligible؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> الأول يثبت صلاحية البيانات، والثاني يطبق قاعدة العمل. الفصل يمنع اعتبار قيمة فاسدة رفضًا عاديًا ويعطي رسالة أدق.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">02</span><p>كيف تختبر حد حضور 75%؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> استخدم 74.99 أو 74 حسب النوع، ثم 75، ثم قيمة أعلى، إضافة إلى قيم غير صالحة تحت 0 وفوق 100.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">03</span><p>متى تستخدم &amp;&amp; ومتى || في أهلية؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> &amp;&amp; للمتطلبات التي يجب اجتماعها، و|| للمسارات البديلة؛ استخدم الأقواس عند دمجهما لتثبيت السياسة.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">04</span><p>لماذا رسالة “غير مؤهل” وحدها ضعيفة؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> لا تساعد المستخدم أو الاختبار أو الدعم على معرفة القاعدة الفاشلة؛ أعد سببًا محددًا دون كشف معلومات حساسة.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">05</span><p>صمم أقل مجموعة اختبارات لقاعدة: العمر من 18 إلى 60 شاملًا والحضور 75% على الأقل.</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> اختبر 17 و18 و60 و61 مع حضور صالح، ثم 74.99 و75 مع عمر صالح، وأضف مدخلًا غير رقميًا. هذه تغطي الحدود وكل سبب رفض مستقل.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">06</span><p>كيف تكشف Decision Table تعارض قاعدتين قبل كتابة الكود؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> تسرد تركيبات الحقائق ونتيجة كل تركيب؛ إذا حصل الصف نفسه على نتيجتين أو بقي صف بلا نتيجة يظهر الغموض قبل تحويله إلى if.</div></details>
</section>
</div>
