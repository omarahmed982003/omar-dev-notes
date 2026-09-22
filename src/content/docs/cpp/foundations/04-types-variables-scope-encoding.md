---
title: "الأنواع والمتغيرات والنطاق وترميز النص"
description: "النوع يحدد شكل القيمة والعمليات الممكنة عليها وحدود تمثيلها. المتغير يجمع اسمًا ونوعًا وقيمة وعمرًا ونطاق رؤية."
tableOfContents: true
---

## الفكرة العامة

النوع يحدد شكل القيمة والعمليات الممكنة عليها وحدود تمثيلها. المتغير يجمع اسمًا ونوعًا وقيمة وعمرًا ونطاق رؤية.

## المفاهيم التي تحتاجها

- اختر النوع حسب المعنى والمدى لا حسب الحجم وحده.
- التهيئة بالأقواس تمنع كثيرًا من تحويلات التضييق غير المقصودة.
- const لقيمة لا تتغير بعد التهيئة، وconstexpr لقيمة يمكن حسابها وقت الترجمة.
- النطاق المحلي يقلل التداخل، وstatic local يحتفظ بقيمته بين الاستدعاءات.
- النص Unicode مفهوم مجرد؛ UTF-8 وUTF-16 طريقتان لترميزه إلى وحدات تخزين.

## مثال

```cpp
#include <limits>
#include <string>

int age{20};
double price{49.95};
const std::string country{"Egypt"};
constexpr int daysPerWeek{7};
```

## أخطاء شائعة وتصحيحات

- أحجام الأنواع قد تختلف بين المنصات؛ استخدم sizeof وnumeric_limits عند الحاجة.
- float وdouble تمثيلان تقريبيان، فلا تعتمد دائمًا على مساواة عشرية مباشرة.

## خريطة الدرس

<div class="lesson-diagram" role="img" aria-label="خريطة مفاهيم: الأنواع والمتغيرات والنطاق وترميز النص">
<p class="lesson-diagram-title">خريطة مفاهيم: الأنواع والمتغيرات والنطاق وترميز النص</p>
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
<div class="quiz-question-row"><span class="quiz-number">01</span><p>لماذا int ليس مناسبًا دائمًا للعمر رغم أن القيم صغيرة؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> قد يكون مناسبًا حسابيًا، لكن الاختيار يشمل معنى القيمة والتحقق منها؛ النوع وحده لا يمنع عمرًا سالبًا أو غير منطقي.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">02</span><p>ما فائدة Brace initialization؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> تجعل التهيئة واضحة وترفض كثيرًا من تحويلات التضييق مثل تحويل 3.7 مباشرة إلى int.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">03</span><p>ما الفرق بين const وconstexpr؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> const يمنع التعديل بعد التهيئة، أما constexpr فيطلب إمكان التقييم وقت الترجمة عند استخدامه بهذه الصفة.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">04</span><p>لماذا لا يمثل char حرفًا عربيًا كاملًا في UTF-8 غالبًا؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> لأن الحرف العربي يُرمز عادة بعدة بايتات، وchar يخزن وحدة بايت واحدة لا Code Point كاملًا.</div></details>
</section>
</div>

## الخلاصة

اكتب الحل على مراحل، فعّل التحذيرات، واختبر الحالة العادية والحدود والمدخل غير الصالح. عندما تستطيع تفسير سبب كل سطر تكون قد فهمت الفكرة بدل حفظها.
