---
title: "9. if وelse والتحقق والتداخل"
sidebar:
  order: 9
description: "if وelse توجّهان التنفيذ. اكتب الشروط بحيث يقرأها الإنسان كقواعد واضحة، وقلل التعشيق بالتحقق المبكر وتجميع المنطق المتشابه."
tableOfContents: true
---

## كيف تختار if مسار التنفيذ؟

if وelse توجّهان التنفيذ. اكتب الشروط بحيث يقرأها الإنسان كقواعد واضحة، وقلل التعشيق بالتحقق المبكر وتجميع المنطق المتشابه.

## if وelse وelse if

تفحص `if` تعبيرًا في سياق منطقي. المقارنة الصريحة مثل `age >= 18` أوضح من الاعتماد على تحويل رقم إلى `bool`. إذا كانت النتيجة `true` ينفذ جسم `if`، وإذا كانت `false` ينتقل التنفيذ إلى `else` إن وجدت.

استخدم الأقواس المعقوفة حتى مع تعليمة واحدة. عند إضافة تعليمة لاحقًا ستبقى حدود الفرع واضحة. ترتبط `else` بأقرب `if` لم تحصل على `else`، ولذلك تزيل الأقواس أي التباس في الشروط المتداخلة.

سلسلة `else if` تختار أول شرط صحيح فقط. أما عدة تعليمات `if` مستقلة فيمكن أن تنفذ كلها. استخدم السلسلة للتصنيفات الحصرية مثل التقدير، واستخدم الشروط المستقلة عندما يستطيع المستخدم الحصول على أكثر من ميزة.

رتب الحالات غير الصالحة أولًا، ثم الحالات الخاصة، ثم القاعدة العامة. ويتيح Short Circuit فحص الأمان قبل العملية، كما في `denominator != 0 && numerator / denominator > 2`، لأن القسمة لن تنفذ إذا كان المقام صفرًا.

## مثال: تصنيف الدرجة بعد التحقق

```cpp
if (score < 0 || score > 100) {
    std::cout << "Invalid score\n";
} else if (score >= 85) {
    std::cout << "Excellent\n";
} else if (score >= 50) {
    std::cout << "Pass\n";
} else {
    std::cout << "Fail\n";
}
```

## أخطاء شائعة وتصحيحات

- if (x = 5) يسند قيمة بدل المقارنة.
- فاصلة منقوطة بعد if تصنع جسمًا فارغًا.

## من قاعدة العمل إلى شرط

اكتب القاعدة أولًا بلغة واضحة، وحدد متغيراتها وحدودها، ثم حوّلها إلى Boolean expression. قاعدة «يقبل الطلب إذا كانت الكمية موجبة والمخزون كافيًا» تصبح `quantity > 0 && quantity <= stock`.

اختبر كل حد: الكمية صفر، واحد، تساوي المخزون، وتتجاوزه. الأخطاء تظهر غالبًا في الفرق بين `<` و`<=` أو في جمع شرطين بـ`&&` بدل `||`.

## ترتيب القرارات والتحقق المبكر

تحقق من الإدخال غير الصالح أولًا، ثم الحالات الخاصة، ثم القاعدة العامة. هذا يقلل التعشيق ويمنع تنفيذ الحساب على بيانات غير موثوقة.

```cpp
if (age < 0 || age > 120) {
    std::cout << "Invalid age";
} else if (hasDebt) {
    std::cout << "Manual review";
} else if (income >= 30000 && creditScore >= 700) {
    std::cout << "Approved";
} else {
    std::cout << "Rejected";
}
```

استخدم `if` مستقلة عندما يمكن أن تتحقق عدة نتائج معًا، مثل عدّ الرقم موجبًا وزوجيًا. استخدم `else if` عندما يجب اختيار نتيجة واحدة فقط. وللنصوص استخدم مقارنة `std::string`، مع الانتباه إلى حالة الأحرف والمسافات إن كانت القاعدة تتطلب التطبيع.

## Short Circuit وأولوية المنطق

في `denominator != 0 && numerator / denominator > 2` يمنع الشرط الأول القسمة غير الآمنة. تعمل `&&` قبل `||`، لكن الأقواس أفضل عندما تجمع قواعد متعددة لأنها توثق المقصود وتمنع القراءة الخاطئة.

<div class="lesson-diagram" role="img" aria-label="مسار if/else: التحقق أولًا ثم اختيار فرع حصري">
<p class="lesson-diagram-title">مسار if/else: التحقق أولًا ثم اختيار فرع حصري</p>
<div class="diagram-flow">
<div class="diagram-node input"><span>اقرأ القيمة</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node decision"><span>هل صالحة؟</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node decision"><span>أي نطاق يطابق؟</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>نفّذ الفرع</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node output"><span>أعد النتيجة</span></div>
</div>
</div>

## Boolean context والأقواس

يمكن تحويل الصفر إلى `false` وغير الصفر إلى `true`، لكن كتابة المقارنة الصريحة توضح المقصود عندما لا يكون المتغير Boolean أصلًا. استخدم الأقواس حتى لجسم سطر واحد لتجنب أن تنفصل تعليمة جديدة عن الشرط عند التعديل.

## عدة if أم سلسلة واحدة؟

عدة `if` مستقلة مناسبة عندما يمكن للرقم أن يكون موجبًا وزوجيًا معًا. أما تصنيف الدرجة إلى Band واحدة فيحتاج `if/else if/else`. ترتيب الحدود من الأعلى إلى الأقل يمنع شرطًا عامًا مثل `score >= 50` من ابتلاع الحالات الأعلى.

## الشروط المتداخلة

يكون Nesting مناسبًا عندما لا معنى للسؤال الثاني إلا بعد نجاح الأول، مثل فحص Credit score بعد اجتياز العمر. لكن Guard clauses أو دمج شروط واضحة قد يقللان العمق. لا تدمج قواعد مستقلة في تعبير ضخم يصعب اختباره.

## Strings والمدخلات المركبة

تدعم `std::string` المقارنة بـ`==`، لكن `"Admin"` لا يساوي `"admin"`. قرر هل النظام حساس للحالة، ونظف المسافات وفق قاعدة موثقة. لا تحول النص عشوائيًا دون مراعاة Locale وUnicode.

## Guard Clauses وتقليل التداخل

عندما تكون حالة غير صالحة معروفة، عالجها مبكرًا ثم اخرج من الدالة. هذا يحافظ على المسار الصحيح في مستوى تداخل واحد بدل وضع كل خطوة داخل `if` جديدة. لا تستخدم الخروج المبكر عشوائيًا؛ اجعله لحالات واضحة برسائل ونتائج محددة.

## الشروط الحصرية والشروط المستقلة

التقدير الدراسي نتيجة واحدة، ولذلك يناسبه `if/else if/else`. أما الشارات مثل «حضور ممتاز» و«مشروع متميز» فقد تجتمع، ولذلك تحتاج `if` مستقلة. اختيار البناء الخاطئ قد يمنع نتيجة صحيحة حتى لو كانت كل مقارنة منفردة سليمة.

## De Morgan وتبسيط النفي

نفي `(age >= 18 && hasId)` يساوي `(age < 18 || !hasId)`. تساعد قوانين De Morgan في كتابة سبب الرفض مباشرة، لكن لا تحول الشرط إلى صيغة أصعب. سمّ الأجزاء المنطقية عندما يزيد عدد العوامل.

## برنامج كامل: التحقق ثم التصنيف

```cpp
#include <iostream>
int main() {
    int score{};
    std::cout << "Score from 0 to 100: ";
    if (!(std::cin >> score)) { std::cerr << "Score must be an integer\n"; return 1; }
    if (score < 0 || score > 100) std::cout << "Invalid score\n";
    else if (score >= 85) std::cout << "Excellent\n";
    else if (score >= 50) std::cout << "Pass\n";
    else std::cout << "Fail\n";
}
```

اختبر `-1` و`0` و`49` و`50` و`84` و`85` و`100` و`101` ومدخلًا نصيًا. وضع `score >= 50` أولًا يجعل فرع الممتاز غير قابل للوصول.

## تأكد من فهمك

<div class="lesson-quiz" role="list">
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">01</span><p>لماذا يجب ترتيب score&gt;=85 قبل score&gt;=50؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> لأن else-if تتوقف عند أول شرط صحيح؛ وضع &gt;=50 أولًا يلتقط درجات الممتاز ويجعل الفرع الخاص غير قابل للوصول.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">02</span><p>ما أثر if(x=5)؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> يسند 5 إلى x ثم تتحول القيمة غير الصفرية إلى true؛ استخدم <code>==</code> وفعّل تحذيرات المترجم.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">03</span><p>متى تستخدم if مستقلة بدل else-if؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> عندما يمكن أن تتحقق نتائج متعددة في الوقت نفسه، مثل منح أكثر من Badge؛ else-if للحالات الحصرية.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">04</span><p>كيف تقلل Nested if في التحقق؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> استخدم Guard clauses لرفض المدخل غير الصالح مبكرًا، ثم اترك المسار الرئيسي أقل تعشيقًا.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">05</span><p>لديك الفروع <code>score &gt;= 50</code> ثم <code>score &gt;= 85</code>. لماذا لن يصل البرنامج إلى تقدير ممتاز؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> لأن درجة 85 تحقق الفرع الأول في سلسلة else-if ويتوقف الاختيار. رتب الحدود من الأكثر تحديدًا والأعلى إلى الأقل: 85 ثم 50 ثم الباقي.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">06</span><p>صحح <code>if (age = 18)</code> واذكر وسيلة تمنع مرور الخطأ بصمت.</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> استخدم <code>if (age == 18)</code>. فعّل تحذيرات المترجم مثل <code>-Wall -Wextra -Werror</code> واكتب اختبارين لقيمتي 17 و18.</div></details>
</section>
</div>
