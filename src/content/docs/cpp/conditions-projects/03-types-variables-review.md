---
title: "مراجعة الأنواع والمتغيرات والنطاق"
description: "هذه مراجعة تطبيقية للأنواع والتهيئة والنطاق قبل استخدام الشروط في مشروع أكبر. المطلوب اختيار نوع يحفظ المعنى ويتحمل المجال المتوقع."
tableOfContents: true
---

## الفكرة العامة

هذه مراجعة تطبيقية للأنواع والتهيئة والنطاق قبل استخدام الشروط في مشروع أكبر. المطلوب اختيار نوع يحفظ المعنى ويتحمل المجال المتوقع.

## المفاهيم التي تحتاجها

- استخدم bool للحالات الثنائية بدل أرقام سحرية.
- auto مفيد عندما يكون النوع واضحًا من القيمة، لا عندما يخفي معنى مهمًا.
- string للنصوص وليس char إلا لمحرف واحد.
- قلل عمر المتغير بوضعه في أضيق نطاق يحتاجه.
- استخدم const للمدخلات التي لا ينبغي تعديلها بعد التحقق.

## مثال

```cpp
std::string plan{"standard"};
int sessions{12};
double pricePerSession{80.0};
bool paid{true};
const double subtotal = sessions * pricePerSession;
```

## أخطاء شائعة وتصحيحات

- لا تستخدم unsigned فقط لمنع السالب؛ الإدخال والتحويل قد ينتجان مفاجآت.
- لا تترك متغيرًا محليًا بلا تهيئة.

## خريطة الدرس

<div class="lesson-diagram" role="img" aria-label="خريطة مفاهيم: مراجعة الأنواع والمتغيرات والنطاق">
<p class="lesson-diagram-title">خريطة مفاهيم: مراجعة الأنواع والمتغيرات والنطاق</p>
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
<div class="quiz-question-row"><span class="quiz-number">01</span><p>متى يجعل auto الكود أقل وضوحًا؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> عندما يخفي نوعًا مؤثرًا في الدقة أو الملكية أو التحويل، خصوصًا مع أرقام وواجهات عامة.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">02</span><p>لماذا bool أفضل من 0 و1 لحالة الدفع؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> يوضح المعنى ويقيد الاستخدام المنطقي ويمنع أرقامًا سحرية، مع اسم مثل isPaid يقرأ كقاعدة.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">03</span><p>لماذا النطاق الضيق مفيد؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> يقلل التعديل غير المقصود والتعارض ويجعل عمر القيمة ومسؤوليتها واضحين.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">04</span><p>هل unsigned يمنع إدخال السالب؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> لا؛ التحويل قد يلف القيمة إلى عدد كبير. تحقق من الإدخال في نوع مناسب قبل التحويل.</div></details>
</section>
</div>

## الخلاصة

اكتب الحل على مراحل، فعّل التحذيرات، واختبر الحالة العادية والحدود والمدخل غير الصالح. عندما تستطيع تفسير سبب كل سطر تكون قد فهمت الفكرة بدل حفظها.
