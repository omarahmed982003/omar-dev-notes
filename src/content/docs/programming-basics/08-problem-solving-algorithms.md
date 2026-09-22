---
title: 8. التفكير البرمجي والخوارزميات
description: تحويل المشكلة إلى خطوات، كتابة Pseudocode، اختيار بنية البيانات، وفهم التعقيد بصورة عملية.
sidebar:
  order: 8
---

## من المشكلة إلى برنامج

لا تبدأ بالكود. اكتب أولًا:

1. **المدخلات:** ما البيانات القادمة؟ وما حدودها؟
2. **المخرجات:** ما النتيجة المطلوبة بدقة؟
3. **القواعد:** ما الحالات العادية والاستثنائية؟
4. **التقسيم:** حوّل المشكلة إلى خطوات صغيرة قابلة للاختبار.
5. **التحقق:** جرّب مثالًا عاديًا، حدًا أدنى، حدًا أقصى، ومدخلًا غير صالح.

مثال: حساب إجمالي سلة بعد خصم.

```text
INPUT items, discountPercent
IF discountPercent < 0 OR discountPercent > 100
    RETURN error
total = 0
FOR EACH item IN items
    IF item.price < 0 OR item.quantity < 1
        RETURN error
    total = total + item.price * item.quantity
RETURN total * (1 - discountPercent / 100)
```

الـPseudocode يشرح المنطق بلا ارتباط بصياغة لغة، ثم يمكن تحويله إلى PHP أو JavaScript أو غيرهما.

## اختيار بنية البيانات

| الحاجة | بنية مناسبة |
|---|---|
| ترتيب عناصر والسماح بالتكرار | List/Array |
| الوصول بقيمة مفتاح | Map/Associative Array |
| منع التكرار | Set |
| أول داخل أول خارج | Queue |
| آخر داخل أول خارج | Stack |

اختيار البنية يؤثر في وضوح الحل وكلفته. لا تستخدم nested loops تلقائيًا إذا كان Map يستطيع تحويل البحث المتكرر إلى lookup مباشر.

## التعقيد Big O

Big O يصف نمو الزمن أو الذاكرة مع نمو حجم الإدخال، وليس عدد الثواني الفعلي.

| التعقيد | مثال |
|---|---|
| `O(1)` | قراءة عنصر معروف المفتاح |
| `O(log n)` | Binary search في بيانات مرتبة |
| `O(n)` | المرور مرة على القائمة |
| `O(n log n)` | خوارزميات فرز فعالة شائعة |
| `O(n²)` | مقارنة كل عنصر بكل عنصر |

الأولوية للصحة والوضوح، ثم القياس قبل التحسين. خوارزمية `O(n)` قد تكون أبطأ على بيانات صغيرة من حل أبسط بسبب الثوابت.

## تمرين

لديك قائمة طلبات، وكل طلب يحوي `customer_id` و`total`. صمّم خوارزمية تعيد إجمالي كل عميل:

- اكتب المدخل والمخرج.
- عالج القائمة الفارغة والقيم السالبة.
- استخدم Map حتى يكون المرور `O(n)`.
- اكتب ثلاث حالات اختبار قبل كتابة الكود.

## خريطة الدرس

<div class="lesson-diagram" role="img" aria-label="خريطة مفاهيم: التفكير البرمجي والخوارزميات">
<p class="lesson-diagram-title">خريطة مفاهيم: التفكير البرمجي والخوارزميات</p>
<div class="diagram-flow">
<div class="diagram-node input"><span>من المشكلة إلى برنامج</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>اختيار بنية البيانات</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>التعقيد Big O</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node decision"><span>تمرين</span></div>
</div>
</div>

## تأكد من فهمك

<div class="lesson-quiz" role="list">
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">01</span><p>اشرح «من المشكلة إلى برنامج» كأنك تراجع تطبيقًا حقيقيًا: ما الهدف وما أهم قيد يجب الانتباه له؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> لا تبدأ بالكود. اكتب أولًا: المدخلات: ما البيانات القادمة؟ وما حدودها؟ المخرجات: ما النتيجة المطلوبة بدقة؟ القواعد: ما الحالات العادية والاستثنائية؟ التقسيم: حوّل المشكلة إلى خطوات صغيرة قابلة للاختبار. التحقق: جرّب مثالًا عاديًا، حدًا أدنى، حدًا أقصى، ومدخلًا غير صالح. مثال: حساب إجمالي سلة بعد خصم. الـPseudocode يشرح المنطق بلا ارتباط بصياغة لغة، ثم يمكن تحويله إلى PHP أو JavaScript أو غيرهما. عمليًا، لا يكفي تنفيذ المسار الناجح؛ يجب توثيق الافتراضات والتحقق من القيم والحالات التي قد تكسر هذا السلوك.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">02</span><p>قارن بين «من المشكلة إلى برنامج» و«اختيار بنية البيانات». لماذا لا يغني أحدهما عن الآخر داخل موضوع «التفكير البرمجي والخوارزميات»؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> في «من المشكلة إلى برنامج»: لا تبدأ بالكود. اكتب أولًا: المدخلات: ما البيانات القادمة؟ وما حدودها؟ المخرجات: ما النتيجة المطلوبة بدقة؟ القواعد: ما الحالات العادية والاستثنائية؟ التقسيم: حوّل المشكلة إلى خطوات صغيرة قابلة للاختبار. التحقق: جرّب مثالًا عاديًا، حدًا أدنى، حدًا أقصى، ومدخلًا غير صالح. مثال: حساب إجمالي سلة بعد خصم. الـPseudocode يشرح المنطق بلا ارتباط بصياغة لغة، ثم يمكن تحويله إلى PHP أو JavaScript أو غيرهما. أما «اختيار بنية البيانات»: | الحاجة | بنية مناسبة | |---|---| | ترتيب عناصر والسماح بالتكرار | List/Array | | الوصول بقيمة مفتاح | Map/Associative Array | | منع التكرار | Set | | أول داخل أول خارج | Queue | | آخر داخل أول خارج | Stack | اختيار البنية يؤثر في وضوح الحل وكلفته. لا تستخدم nested loops تلقائيًا إذا كان Map يستطيع تحويل البحث المتكرر إلى lookup مباشر. العلاقة بينهما أن الأول يحدد جانبًا من الحل، والثاني يكمل السلوك أو القيود اللازمة لتطبيقه بصورة صحيحة.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">03</span><p>افترض أن نظامًا تجاهل «التعقيد Big O». ما العطل أو الخطر المتوقع، وكيف تصمم اختبارًا يكشفه؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> Big O يصف نمو الزمن أو الذاكرة مع نمو حجم الإدخال، وليس عدد الثواني الفعلي. | التعقيد | مثال | |---|---| | O(1) | قراءة عنصر معروف المفتاح | | O(log n) | Binary search في بيانات مرتبة | | O(n) | المرور مرة على القائمة | | O(n log n) | خوارزميات فرز فعالة شائعة | | O(n²) | مقارنة كل عنصر بكل عنصر | الأولوية للصحة والوضوح، ثم القياس قبل التحسين. خوارزمية O(n) قد تكون أبطأ على بيانات صغيرة من حل أبسط بسبب الثوابت. لاكتشاف الخلل، اختبر مسارًا صحيحًا، وقيمة عند الحد، ومدخلًا غير صالح، ثم راقب النتيجة والآثار الجانبية والسجل بدل الاكتفاء بعدم ظهور Exception.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">04</span><p>حوّل «تمرين» إلى قرار هندسي قابل للمراجعة. ما الذي ستوثقه وما الحالات التي ستختبرها؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> لديك قائمة طلبات، وكل طلب يحوي customer_id وtotal. صمّم خوارزمية تعيد إجمالي كل عميل: اكتب المدخل والمخرج. عالج القائمة الفارغة والقيم السالبة. استخدم Map حتى يكون المرور O(n). اكتب ثلاث حالات اختبار قبل كتابة الكود. وثّق سبب الاختيار والبدائل والحدود، واختبر الحالة العادية، والحد الأدنى والأقصى، والفشل الجزئي، وإعادة المحاولة أو التكرار إن كان السلوك يسمح بذلك.</div></details>
</section>
</div>
