---
title: "ترميز النص والتحويلات والرياضيات"
description: "النص والتحويلات والدوال الرياضية تلتقي كثيرًا في المسائل. المطلوب معرفة ما تمثله القيمة قبل تحويلها أو إجراء حساب عليها."
tableOfContents: true
---

## الفكرة العامة

النص والتحويلات والدوال الرياضية تلتقي كثيرًا في المسائل. المطلوب معرفة ما تمثله القيمة قبل تحويلها أو إجراء حساب عليها.

## المفاهيم التي تحتاجها

- ASCII يغطي مجموعة قديمة محدودة، بينما Unicode يعرّف نقاطًا لمختلف اللغات.
- UTF-8 متغير الطول ومتوافق مع ASCII، وUTF-16 يستخدم وحدة أو زوج وحدات.
- char ليس ضمانًا لاحتواء حرف Unicode كامل.
- التحويل الموسّع غالبًا يحفظ القيمة، بينما التضييق قد يفقد جزءًا أو يتجاوز المجال.
- الدوال الرياضية تعيد أنواعًا محددة وقد تحتاج تحققًا من المجال.

## مثال

```cpp
unsigned char raw{255};
int widened = raw;
double root = value >= 0 ? std::sqrt(value) : 0.0;
```

## أخطاء شائعة وتصحيحات

- عدد البايتات ليس عدد الحروف المرئية دائمًا.
- static_cast لا يثبت أن القيمة داخل المجال؛ تحقق أولًا.

## خريطة الدرس

<div class="lesson-diagram" role="img" aria-label="خريطة مفاهيم: ترميز النص والتحويلات والرياضيات">
<p class="lesson-diagram-title">خريطة مفاهيم: ترميز النص والتحويلات والرياضيات</p>
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
<div class="quiz-question-row"><span class="quiz-number">01</span><p>ما الفرق بين Unicode Code Point وUTF-8 bytes؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> Code Point هو هوية مجردة للمحرف، وUTF-8 طريقة لترميزه إلى بايت واحد أو أكثر.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">02</span><p>لماذا text.size() قد لا يساوي عدد الحروف الظاهرة؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> في UTF-8 تعيد كثير من المكتبات عدد البايتات، وقد يتكون المحرف المرئي من عدة Code Points أيضًا.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">03</span><p>متى يكون Narrowing مقبولًا؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> عندما تتحقق من المجال والدقة المطلوبة وتوثق فقد البيانات المقصود؛ cast وحده لا يكفي.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">04</span><p>كيف تتعامل مع sqrt لقيمة مستخدم سالبة؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> ارفضها أو استخدم مجال الأعداد المركبة إن كان مطلوبًا؛ لا تحول NaN إلى نتيجة تبدو صحيحة.</div></details>
</section>
</div>

## الخلاصة

اكتب الحل على مراحل، فعّل التحذيرات، واختبر الحالة العادية والحدود والمدخل غير الصالح. عندما تستطيع تفسير سبب كل سطر تكون قد فهمت الفكرة بدل حفظها.
