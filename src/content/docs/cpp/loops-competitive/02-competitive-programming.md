---
title: "14. البرمجة التنافسية ومنصات التدريب"
sidebar:
  order: 14
description: "البرمجة التنافسية تدريب مركز على تحليل القيود واختيار الخوارزمية وكتابة حل صحيح سريع. المنصة أداة قياس وليست بديلًا عن الفهم."
tableOfContents: true
---

## ما البرمجة التنافسية؟

البرمجة التنافسية تدريب مركز على تحليل القيود واختيار الخوارزمية وكتابة حل صحيح سريع. المنصة أداة قياس وليست بديلًا عن الفهم.

## قراءة المسألة والقيود والتعقيد

المسألة التنافسية تحدد صيغة الإدخال والنتيجة المطلوبة والقيود. اقرأ هذه الأجزاء قبل الأمثلة لأن المثال يوضح حالة واحدة، بينما القيود تحدد ما إذا كان الحل ممكنًا. إذا كان `n` يصل إلى `100000`، فإن مقارنة كل عنصر بكل عنصر قد تنفذ نحو عشرة مليارات عملية، ولذلك يكون `O(n²)` غير مناسب غالبًا.

حل مثالًا صغيرًا يدويًا واكتب العلاقة الرياضية أو حالة التكرار قبل الكود. اختر النوع من أكبر نتيجة وسيطة، لا من شكل العينة. بعد الانتهاء اكتب تعقيد الزمن والذاكرة حتى تتأكد أن الحل يناسب الحدود.

نتيجة `Wrong Answer` تعني أن البرنامج أنهى التنفيذ لكنه أعاد نتيجة مختلفة. راجع فهم النص والحدود ومواضع `1-based` و`0-based` ونوع البيانات والتقريب. `Runtime Error` يشير غالبًا إلى وصول غير صالح أو قسمة على صفر، و`Time Limit Exceeded` يعني أن عدد العمليات أكبر من المسموح. تغيير الأسطر عشوائيًا لا يشخص السبب.

## مثال: مسألة Elephant والقسمة السقفية

```cpp
// Elephant: minimum moves of length at most 5
int moves = (distance + 4) / 5; // integer ceiling
```

## أخطاء شائعة وتصحيحات

- قبول العينة لا يعني قبول كل الحالات.
- لا تبدأ بأصعب منصة؛ ابنِ عادة حل يومية تدريجية.

## المنصات وخطة التدريب

توفر Codeforces مسابقات وتصنيفات ومجموعات مسائل، بينما تركز LeetCode كثيرًا على أنماط المقابلات وهياكل البيانات. ابدأ بمسائل تنفيذ وحساب وشروط، ثم الحلقات والحاويات، وسجل بعد كل مسألة: الفكرة، سبب الخطأ، التعقيد، وحالة اختبار لم تتوقعها.

## أنماط المسائل المستخدمة في التدريب

| المسألة | الفكرة الأساسية |
|---|---|
| 617A Elephant | Ceiling division صحيحة بالأعداد الصحيحة |
| 581A Vasya the Hipster | `min` ثم حساب الباقي |
| 281A Word Capitalization | تعديل أول محرف مع فحص النص الفارغ |
| 4A Watermelon | زوجية العدد مع استبعاد 2 |
| 1A Theatre Square | Ceiling لكل بعد واستخدام `long long` |
| 959A Mahmoud and Ehab | Parity وشرط بسيط |
| 486A Calculating Function | اشتقاق صيغة بدل Loop طويل |
| 835A Key Races | حساب زمنين ثم مقارنة ثلاثية |
| 1173A Nauuo and Votes | ضمان النتيجة رغم القيم المجهولة |
| 318A Even Odds | تقسيم الترتيب إلى كتلة فردية وزوجية |
| 459A Pashmak and Garden | حالات هندسية لمحاور ومربع |

اقرأ الحل بعد محاولة حقيقية، ثم أغلقه وأعد كتابة الفكرة من الذاكرة على مثال مختلف. الهدف التعرف إلى النمط واشتقاقه، لا حفظ ترتيب الأسطر.

## خريطة الدرس

<div class="lesson-diagram" role="img" aria-label="خريطة مفاهيم: مقدمة البرمجة التنافسية ومنصات التدريب">
<p class="lesson-diagram-title">خريطة مفاهيم: مقدمة البرمجة التنافسية ومنصات التدريب</p>
<div class="diagram-flow">
<div class="diagram-node input"><span>نص المسألة</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>القيود والتعقيد</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>مثال</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node decision"><span>أخطاء شائعة وتصحيحات</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node output"><span>الخلاصة</span></div>
</div>
</div>

## دورة عمل الـOnline Judge

يرسل المتسابق Source Code، فتترجمه المنصة بإصدار وخيارات محددة ثم تشغله على حالات مخفية داخل حدود للوقت والذاكرة. تقارن المنصة الخرج المتوقع بالفعلي وفق Checker. أي نص إضافي مثل `Enter n:` قد يسبب Wrong Answer لأن المطلوب تنسيق دقيق.

## تصنيف النتائج

`Compilation Error` يعني أن المصدر لم يُبنَ. `Wrong Answer` يعني أن التنفيذ انتهى لكن الخرج خاطئ. `Runtime Error` يشمل الانهيار والقسمة على صفر والوصول غير الصالح. `Time Limit Exceeded` يدل على زمن زائد، و`Memory Limit Exceeded` على استهلاك ذاكرة أكبر من الحد.

بعد القبول، لا تكتف بالكود. سجل الفكرة والتعقيد والحالة التي أخطأت فيها، ثم أعد الحل بعد أيام من الذاكرة. الهدف بناء نمط تفكير يمكن نقله إلى مسألة جديدة.

## تأكد من فهمك

<div class="lesson-quiz" role="list">
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">01</span><p>لماذا تحدد القيود الخوارزمية قبل الكود؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> لأن n=10^5 قد يستبعد O(n²) مهما كان التنفيذ مرتبًا، بينما O(n log n) أو O(n) قد يناسب.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">02</span><p>ما معنى Wrong Answer بعد نجاح العينات؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> العينات ليست إثباتًا؛ راجع تفسير المسألة والحدود والأنواع والتقريب وأنشئ حالات مضادة.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">03</span><p>لماذا صيغة (d+4)/5 تحل Elephant؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> إنها Ceiling للقسمة الصحيحة على 5: إضافة 4 ترفع أي باقي إلى خطوة إضافية دون استخدام floating point.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">04</span><p>كيف تبني تدريبًا مفيدًا بعد قبول الحل؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> اكتب التعقيد، راجع حلًا بديلًا، أعد التنفيذ لاحقًا، وسجل الخطأ الذي منعك أول مرة.</div></details>
</section>
</div>
