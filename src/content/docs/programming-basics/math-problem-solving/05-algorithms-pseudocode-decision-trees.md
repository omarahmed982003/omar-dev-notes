---
title: "الخوارزميات وPseudocode وأشجار القرار"
description: "الـPseudocode وشجرة القرار تمثيلان للتفكير قبل الكود: الأول يوضح تسلسل الخطوات، والثانية توضح مسارات القرارات المتفرعة."
tableOfContents: true
prev: {"link":"/programming-basics/math-problem-solving/04-computational-thinking/","label":"التفكير الحاسوبي وتحليل المتطلبات"}
next: {"link":"/programming-basics/math-problem-solving/06-flowcharts-loops-debugging/","label":"المخططات الانسيابية والحلقات والتصحيح"}
sidebar:
  order: 6
---

استخدم القسم بعد [القيم والقرارات والحلقات](/programming-basics/computer-fundamentals/10-decisions-and-repetition/). ارجع للحساب حسب الحاجة؛ الرسوم والتعقيد والبرمجة الديناميكية توسعات لاحقة وليست شروطًا لأول برنامج.


## الفكرة العامة

الـPseudocode وشجرة القرار تمثيلان للتفكير قبل الكود: الأول يوضح تسلسل الخطوات، والثانية توضح مسارات القرارات المتفرعة.

## المفاهيم الأساسية

- الخوارزمية الجيدة لها مدخلات واضحة، خطوات غير ملتبسة، نهاية، ومخرجات صحيحة.
- استخدم أسماء تعبّر عن المعنى بدل x وy في مسائل الأعمال.
- الـPseudocode لا يلتزم بصياغة لغة، لكنه يجب أن يظل دقيقًا.
- شجرة القرار مناسبة عندما تقود الإجابات إلى حالات نهائية متعددة.
- رتّب التحقق من العام إلى الخاص، ومن رفض المدخل غير الصالح إلى قواعد العمل.

## مثال تطبيقي

إيجاد الأكبر بين ثلاثة أعداد: ابدأ بالعدد الأول كأكبر قيمة، قارنه بالثاني وحدّثه عند الحاجة، ثم كرر مع الثالث. هذه الطريقة أبسط من كتابة كل التركيبات الممكنة.

## تصحيح مفاهيم وأخطاء شائعة

- شجرة القرار الكبيرة قد تصبح صعبة الصيانة؛ اجمع القواعد المتشابهة وسمِّ الشروط.
- لا تجعل مسارًا بلا نتيجة أو تترك حالة ممكنة دون معالجة.

<div class="lesson-diagram" role="img" aria-label="شجرة قرار مبسطة تبدأ بالتحقق قبل قواعد العمل">
<p class="lesson-diagram-title">شجرة قرار مبسطة تبدأ بالتحقق قبل قواعد العمل</p>
<div class="diagram-flow diagram-decision">
<div class="diagram-node input"><span>اقرأ المدخلات</span></div>
<span class="diagram-arrow" data-label="تحقق" aria-hidden="true">→</span>
<div class="diagram-node decision"><span>هل المدخل صالح؟</span></div>
<span class="diagram-arrow" data-label="نعم" aria-hidden="true">→</span>
<div class="diagram-node decision"><span>هل تتحقق القاعدة؟</span></div>
<span class="diagram-arrow" data-label="نعم" aria-hidden="true">→</span>
<div class="diagram-node process"><span>نفّذ الإجراء</span></div>
<span class="diagram-arrow" data-label="اكتمل" aria-hidden="true">→</span>
<div class="diagram-node output"><span>اعرض النتيجة</span></div>
</div>
<div class="diagram-branches">
<p class="diagram-branch-label">مسارا «لا» اللذان يجب ألا يختفيا من الخوارزمية</p>
<div class="diagram-node danger"><span>مدخل غير صالح ← رسالة تصحيح</span></div>
<div class="diagram-node output"><span>القاعدة لا تتحقق ← رفض أو بديل</span></div>
</div>
</div>

## اكتب الخوارزمية وتتبعها

**Pseudocode — خطوات شبه برمجية** وصف دقيق للحل من غير الالتزام بلغة تشغيل. المثال يستقبل ثلاثة أعداد صالحة ويرجع أكبر قيمة:

```text
read a, b, c
largest = a
if b > largest:
    largest = b
if c > largest:
    largest = c
print largest
```

read معناها اقرأ، وprint اطبع، وif اختبر الشرط، وعلامة = هنا تعيين قيمة. مع a=−7 وb=−2 وc=−5 نبدأ بـlargest=−7، ثم نحدثها إلى−2، ثم نتركها لأن−5 أصغر. الناتج−2. لو بدأنا largest بصفر هنعطي نتيجة غلط لأن الصفر مش ضمن المدخلات.

**Precondition — شرط قبل البدء**: القيم أعداد صالحة. **Postcondition — شرط بعد الانتهاء**: الناتج واحد من القيم ولا توجد قيمة أكبر منه. عند تعميم الحل لقائمة، **Loop invariant — حقيقة محفوظة أثناء التكرار** هي أن largest أكبر القيم التي فحصناها حتى الآن. **Termination — الانتهاء** مضمون لأن كل دورة تفحص عنصرًا جديدًا وعدد العناصر محدود. القائمة الفارغة تحتاج قرارًا صريحًا، مثل إرجاع «لا توجد قيمة»، بدل قراءة أول عنصر غير موجود.




## نفس مثال الأكبر على شكل شجرة

نفترض أن a وb وc أعداد صالحة. كل «نعم/لا» تختار فرعًا، وكل نهاية ترجع قيمة:

```text
a >= b?
├─ Yes: a >= c?
│        ├─ Yes → a
│        └─ No  → c
└─ No:  b >= c?
         ├─ Yes → b
         └─ No  → c
```

`>=` أكبر من أو يساوي. جرّب −7 و−2 و−5: أول إجابة لا، ثم نعم، فنرجع b أي−2. جرّب تساوي الثلاثة: أي واحدة تحمل نفس أكبر قيمة. قارن الشجرة بخطوات تحديث `largest`؛ النتيجة نفسها، لكن تكرار التحديث يتوسع لقائمة بسهولة.
## تأكد من فهمك

<div class="lesson-quiz" role="list">
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">01</span><p>لماذا طريقة “ابدأ بالأول كأكبر قيمة ثم حدّثه” أفضل من تعداد ترتيبات ثلاثة أعداد؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> تحتاج مقارنتين فقط وتتوسع لأي عدد من القيم، بينما تعداد الترتيبات يزداد بسرعة ويصعب التحقق منه.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">02</span><p>متى تصبح شجرة القرار اختيارًا سيئًا؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> عندما تتكاثر الفروع والقواعد المشتركة فتتكرر العقد. عندها يفيد جدول قرار أو قواعد مسماة أو State Machine.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">03</span><p>ما الخصائص الأربع التي يجب إثباتها في خوارزمية جيدة؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> وضوح المدخلات والمخرجات، دقة الخطوات، الانتهاء في وقت محدود، والصحة لكل الحالات الواقعة داخل المتطلبات.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">04</span><p>رتب فحوص خصم يعتمد على صلاحية السعر والعضوية وقيمة الطلب.</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> تحقق من صلاحية السعر أولًا، ثم احسب الأهلية، ثم طبق قاعدة العضوية والحد المالي. لا تسمح لمدخل غير صالح بالدخول في حساب الخصم.</div></details>
</section>
</div>

## الجشع والبرمجة الديناميكية: اختار بالدليل

مثال العملات المحلول موجود في [درس مقارنة الخوارزميات](/programming-basics/math-problem-solving/10-greedy-dynamic-programming/)، بعد شرح تنظيم البيانات ونمو عدد الخطوات. هنا ركّز أولًا على كتابة خطوات حل واضح وتتبعها.



## لما القرار يعتمد على حالة سابقة

في شجرة القرار، كل **ورقة** نهاية مسار. لو شرط الخصم «عضو وسعره100 أو أكثر»، اختبر عضوًا عند99 و100، وغير عضو عند100، وسعرًا سالبًا مرفوضًا. **State Machine — نموذج حالات وانتقالات** ينفع لما القرار يعتمد على الحالة السابقة، مثل طلب «جديد ← مدفوع ← مشحون». لا نسمح بانتقال جديد مباشرة إلى مشحون وفق القاعدة دي.