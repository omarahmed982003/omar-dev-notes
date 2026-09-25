---
title: "6. ترميز النصوص والمحارف والتحويلات"
sidebar:
  order: 6
description: "النص والتحويلات والدوال الرياضية تلتقي كثيرًا في المسائل. المطلوب معرفة ما تمثله القيمة قبل تحويلها أو إجراء حساب عليها."
tableOfContents: true
---

## المحرف والنص والترميز

النص والتحويلات والدوال الرياضية تلتقي كثيرًا في المسائل. المطلوب معرفة ما تمثله القيمة قبل تحويلها أو إجراء حساب عليها.

## ASCII وUnicode وUTF-8 وUTF-16

`ASCII` جدول قديم يربط الأرقام من `0` إلى `127` بمحارف إنجليزية ورموز تحكم. `Unicode` أوسع بكثير؛ فهو يعطي كل محرف مجرد `Code Point` مثل `U+0627` لحرف الألف. الـCode Point ليس هو البايتات المخزنة، لذلك نحتاج إلى Encoding.

`UTF-8` يشفّر الـCode Point في بايت واحد إلى أربعة بايتات، ويتطابق مع ASCII في أول 128 قيمة. `UTF-16` يستخدم وحدة بطول 16 بت، وقد يحتاج زوجًا من الوحدات لبعض المحارف. لهذا لا يساوي عدد البايتات عدد الحروف دائمًا، وقد يتكون الرمز المرئي من أكثر من Code Point.

نوع `char` يمثل وحدة صغيرة من البيانات ولا يضمن احتواء محرف Unicode كامل. التحويل الموسّع، مثل نقل `unsigned char` إلى `int`، يحافظ غالبًا على القيمة. التحويل إلى نوع أضيق قد يفقد جزءًا منها أو يغيّر معناها. `static_cast` يجعل نية التحويل صريحة لكنه لا يفحص المدى نيابة عنك.

## مثال: توسيع القيمة والتحقق قبل الجذر

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
<div class="diagram-node input"><span>Unicode Code Point</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>Code Units</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>UTF-8 Bytes</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node decision"><span>Parsing وCasting</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node output"><span>التحقق من المجال قبل الاستخدام</span></div>
</div>
</div>

## من المحرف إلى البايتات

المحرف فكرة نصية، وCode point رقم في Unicode، وEncoding يحول هذا الرقم إلى Code units ثم Bytes. ASCII يغطي مجموعة إنجليزية صغيرة من 0 إلى 127. UTF-8 يحافظ على هذه القيم ببايت واحد ويستخدم أكثر من بايت لمحارف أخرى.

`char` في C++ يخزن Byte صغيرًا، وليس «حرف Unicode كاملًا» بالضرورة. قد يتكون الحرف العربي أو Emoji من عدة Bytes في UTF-8، وقد يتكون Grapheme المرئي من أكثر من Code point. لذلك `std::string::size()` تعيد عدد Bytes لا عدد الحروف التي يراها المستخدم.

## Character literals والقيم العددية

```cpp
char letter{'A'};
std::cout << letter << '\n';
std::cout << static_cast<int>(letter) << '\n';
```

يطبع السطر الأول المحرف، والثاني قيمته العددية في Execution character set. لا تعتمد على ترتيب محارف خارج المجموعات التي يضمنها المعيار أو دون معرفة Encoding.

## أنواع التحويل

- Integral promotion يرفع أنواعًا صغيرة قبل الحساب.
- Usual arithmetic conversions تختار نوعًا مشتركًا للمعاملين.
- `static_cast<T>` يوضح تحويلًا عدديًا أو تحويلًا مسموحًا وقت الترجمة.
- `const_cast` يغير Qualifiers ولا يجعل تعديل كائن Const أصليًا آمنًا.
- `dynamic_cast` يعمل في Hierarchies متعددة الأشكال ويدرس لاحقًا مع OOP.
- `reinterpret_cast` منخفض المستوى وخطير، ولا يحول معنى البتات إلى قيمة سليمة تلقائيًا.

تضييق `double` إلى `int` يقتطع الجزء الكسري، والتحويل خارج المجال قد يكون غير صالح أو Implementation-defined حسب الحالة. افحص المجال قبل التحويل.

## Parsing ليس Casting

تحويل النص `"123"` إلى رقم عملية Parsing تحتاج فحص النجاح، وليست `static_cast<int>`. استخدم أدوات مثل `std::from_chars` أو Stream مع التحقق من الحالة. والعكس Formatting يحتاج تحديد الشكل والدقة.

## Code Point وCode Unit والرمز المرئي

الـCode Point رقم مجرد يعرّف عنصرًا في Unicode. الـCode Unit هي الوحدة التي يستخدمها الترميز، مثل Byte في UTF-8 أو 16 بت في UTF-16. أما الرمز الذي يراه المستخدم فقد يتكون من أكثر من Code Point، مثل حرف مع علامة تشكيل أو Emoji مركب.

لهذا توجد أطوال مختلفة للنص: عدد البايتات، وعدد Code Points، وعدد الرموز المرئية. `std::string::size()` يعيد عدد البايتات المخزنة، ولا يضمن عدد الحروف التي يراها المستخدم.

## بنية UTF-8 والتعامل الآمن

يستخدم محرف ASCII بايتًا واحدًا في UTF-8، وتستخدم القيم الأخرى بايتين أو ثلاثة أو أربعة. لا يجوز قص النص عند بايت عشوائي لأنك قد تفصل تسلسل محرف في منتصفه. كما أن UTF-8 لا يدير اتجاه العربية أو تشكيلها؛ تتولى ذلك مكتبات Unicode ومحركات العرض.

قد يملك نصان الشكل البصري نفسه وتسلسلين مختلفين من Code Points، ولهذا تحتاج المقارنة المتقدمة أحيانًا إلى Unicode Normalization قبل البحث أو التخزين الفريد.

## Integer Promotions والتحويلات الحسابية

يرفع المترجم الأنواع الصحيحة الصغيرة مثل `char` و`short` غالبًا إلى `int` قبل الحساب. وعند جمع `int` مع `double` يتحول الصحيح إلى `double`. لكن `double result = 7 / 2;` يعطي `3.0` لأن القسمة الصحيحة حدثت قبل الإسناد. الصواب عند الحاجة إلى الكسر هو `static_cast<double>(7) / 2`.

## static_cast وdynamic_cast وconst_cast وreinterpret_cast

يستخدم `static_cast` للتحويلات المعروفة وقت الترجمة. ويستخدم `dynamic_cast` مع الأنواع متعددة الأشكال لفحص التحويل وقت التشغيل. أما `const_cast` فيغير صفة `const`، و`reinterpret_cast` يعيد تفسير التمثيل منخفض المستوى؛ كلاهما يحتاج سببًا واضحًا وخبرة أكبر. تجنب C-style cast لأنه يخفي نوع التحويل المقصود.

تحويل نص مثل `"123"` إلى عدد ليس Cast بل Parsing. يجب فحص أن النص صالح كاملًا وأن النتيجة داخل المدى. توفر المكتبة `std::stoi` التي قد ترمي Exception و`std::from_chars` التي تعيد حالة فشل قابلة للفحص.

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
