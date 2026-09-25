---
title: "7. المعاملات والتعبيرات والعمليات البتية"
sidebar:
  order: 7
description: "العوامل تبني التعبيرات، والتحويلات تحدد النوع الذي تُحسب به النتيجة. افهم القواعد بدل الاعتماد على التجربة العشوائية."
tableOfContents: true
---

## التعبير والعامل والنتيجة

العوامل تبني التعبيرات، والتحويلات تحدد النوع الذي تُحسب به النتيجة. افهم القواعد بدل الاعتماد على التجربة العشوائية.

## الحساب والمقارنة والمنطق

التعبير `Expression` مجموعة قيم وعوامل تنتج قيمة جديدة. العوامل الحسابية هي `+` و`-` و`*` و`/` و`%`. عندما يكون طرفا القسمة عددين صحيحين، تكون النتيجة صحيحة أيضًا ويُحذف الجزء الكسري. لهذا تعطي `7 / 2` القيمة `3`، بينما يعطي `static_cast<double>(7) / 2` القيمة `3.5`.

عامل `%` يعيد باقي قسمة صحيحة، لذلك يستخدم لاختبار الزوجية وتقسيم القيم إلى دورات. العوامل `==` و`!=` و`<` و`<=` و`>` و`>=` تنتج `bool`. العوامل المنطقية `&&` و`||` تجمع شروطًا، و`!` يعكس الحقيقة. يستخدم `&&` و`||` خاصية Short Circuit، فقد لا يقيّمان الطرف الثاني إذا حُسمت النتيجة من الطرف الأول.

`static_cast` يوضح أن التحويل مقصود، لكنه لا يجعل القيمة مناسبة للنوع الجديد. افحص المجال قبل التحويل إلى نوع أصغر. تجاوز مدى signed integer يؤدي إلى سلوك غير معرّف، ويمكن قراءة الحدود من `std::numeric_limits`.

العوامل `&` و`|` و`^` و`~` و`<<` و`>>` تعمل على البتات نفسها. تستخدم في الأقنعة والرايات والبروتوكولات منخفضة المستوى، ولا تحل محل العوامل المنطقية.

## مثال: متوسط لا يفقد الجزء الكسري

```cpp
int total{7};
int count{2};
double average = static_cast<double>(total) / count; // 3.5
bool valid = count > 0 && average >= 0.0;
```

## أخطاء شائعة وتصحيحات

- لا تخلط `=` مع `==`.
- ضع أقواسًا عندما تؤثر أولوية العوامل في وضوح المعنى.

## الإدخال والإخراج

يعيد `std::cin >> value` الـStream نفسه، لذلك يمكن فحص نجاح القراءة. المدخل النصي الذي يحتوي مسافات يحتاج `std::getline`، وعند مزجه مع `>>` قد تحتاج إلى استهلاك نهاية السطر المتبقية.

```cpp
double price{};
int quantity{};
if (!(std::cin >> price >> quantity) || price < 0 || quantity < 0) {
    std::cerr << "Invalid input\n";
    return 1;
}
```

## عائلات المعاملات

- الحسابية: `+ - * / %`.
- المقارنة: `== != < <= > >=`.
- المنطقية: `&& || !` مع Short Circuit.
- الإسناد: `= += -= *= /=`.
- الزيادة والنقصان: فرّق بين القيمة الناتجة من `i++` و`++i` عندما تدخل في تعبير.
- البتية: `& | ^ ~ << >>`، وتستخدم مع الأقنعة والتمثيل الثنائي لا مع شروط Boolean.
- الشرطية: `condition ? first : second` عندما يكون الاختيار تعبيرًا بسيطًا.

## التحويلات

التحويل الضمني قد يرفع نوعًا صغيرًا أو يفقد جزءًا من القيمة. استخدم `static_cast` لإظهار النية، وابتعد عن C-style casts. `char` نوع عددي صغير يمثل Code unit، وتحويله إلى `int` يظهر القيمة العددية لا معنى المحرف الكامل في Unicode.

## مكتبة الرياضيات والصيغ

توفر `<cmath>` دوالًا مثل `sqrt` و`pow` و`round` و`ceil` و`floor` و`abs`. انتبه إلى أن `ceil` و`floor` يتحركان نحو اتجاهين مختلفين مع القيم السالبة. اكتب الصيغة إلى خطوات مسماة، ووحّد الوحدات قبل الحساب.

```cpp
double radius{};
std::cin >> radius;
constexpr double pi = 3.141592653589793;
double area = pi * radius * radius;
```

## التعبير والقيمة والآثار الجانبية

قد ينتج Expression قيمة ويغيّر حالة في الوقت نفسه. الإسناد والزيادة والقراءة من Stream أمثلة لها Side effects. لا تضع عدة تعديلات على المتغير نفسه في تعبير معقد؛ افصل الخطوات حتى يكون ترتيبها واضحًا ومضمونًا.

## الأولوية والترابط

تحدد Precedence كيف تُجمع المعاملات، وتحدد Associativity اتجاه التجميع عند تساوي الأولوية. الضرب قبل الجمع، و`&&` قبل `||`، والإسناد يرتبط من اليمين. لا تحفظ الجدول كاملًا؛ استخدم أقواسًا عند جمع عائلات مختلفة، لأن صحة الكود وحدها لا تكفي إن كان القارئ سيفهم قاعدة أخرى.

## Prefix وPostfix

يزيد `++i` القيمة ثم ينتج الجديدة، بينما ينتج `i++` القيمة القديمة ثم يزيد. داخل Statement مستقل تكون النتيجة العملية نفسها للأنواع البسيطة، لكن الفرق يظهر داخل التعبير. تجنب تعبيرات تعتمد على عدة زيادات لأنها سهلة الخطأ ولا تضيف وضوحًا.

## العمليات البتية

يعمل `&` و`|` و`^` و`~` و`<<` و`>>` على تمثيل العدد. القناع `permissions & writeMask` يختبر Bit، و`permissions | writeMask` يفعله، و`permissions & ~writeMask` يلغيه. لا تخلط `&` مع `&&` أو `|` مع `||`؛ الثانية تعمل على Boolean وتستخدم Short Circuit.

## Ternary

المعامل `condition ? a : b` Expression تختار قيمة واحدة، ولذلك يناسب تعيين Label أو قيمة قصيرة. لا تحوله إلى شجرة شروط متداخلة طويلة؛ استخدم `if/else` عندما تحتاج خطوات أو حالات كثيرة.

## خريطة الدرس

<div class="lesson-diagram" role="img" aria-label="خريطة مفاهيم: المعاملات والتحويلات وحدود الأنواع">
<p class="lesson-diagram-title">خريطة مفاهيم: المعاملات والتحويلات وحدود الأنواع</p>
<div class="diagram-flow">
<div class="diagram-node input"><span>Operands</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>Promotions</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>Operation</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node decision"><span>Range Check</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node output"><span>Result Type</span></div>
</div>
</div>

## الإسناد المركب والزيادة والنقصان

يختصر `total += value` التعبير `total = total + value` مع تقييم الجانب الأيسر مرة واحدة. توجد صور مشابهة مثل `-=`, `*=`, `/=` و`%=`. أما `++i` فيزيد القيمة ثم ينتج الجديدة، بينما `i++` ينتج القديمة ثم يزيد المتغير. عندما لا تحتاج القيمة الناتجة، يوضح `++i` أن الهدف هو الزيادة نفسها.

لا تضع أكثر من تعديل معقد لنفس المتغير في تعبير واحد. افصل الخطوات إلى Statements واضحة حتى لا تعتمد على ترتيب تقييم يصعب فهمه أو يسبب سلوكًا غير معرّف في صيغ معينة.

## Short Circuit كأداة أمان

في `count != 0 && total / count > 10` لن تنفذ القسمة إذا كان `count` صفرًا. وفي `index >= size || values[index] == 0` لن يحدث الوصول إلى العنصر إذا كان الفهرس خارج النهاية. يجب أن يأتي فحص الأمان قبل العملية التي يعتمد عليها.

## Overflow وUnderflow

إذا تجاوز signed integer مداه فالسلوك غير معرّف. أما unsigned فيلتف وفق حساب modulo، لكن الالتفاف قد يظل خطأ منطقيًا. افحص قبل الجمع أو الضرب عندما تأتي القيم من مصدر غير موثوق، واستخدم نوعًا أوسع للنتائج الوسيطة.

Floating-point overflow قد ينتج Infinity، والقيم الصغيرة جدًا قد تصبح Subnormal أو صفرًا. لا تقارن نتائج الحسابات العشرية دائمًا بـ`==`; استخدم سماحية مناسبة لطبيعة المسألة.

## أقنعة البتات

يمكن لكل بت أن يمثل Flag مستقلة. يستخدم `mask | flag` لتفعيل راية، و`mask & flag` لاختبارها، و`mask & ~flag` لإزالتها، و`mask ^ flag` لقلبها. يجب استخدام نوع unsigned مناسب، وتوثيق معنى كل بت بثابت مسمى بدل أرقام سحرية.

## برنامج كامل: العمليات والتحويل والقسمة الآمنة

```cpp
#include <iostream>
int main() {
    long long total{}; int count{};
    std::cout << "Total and count: ";
    if (!(std::cin >> total >> count) || count <= 0) {
        std::cerr << "Count must be positive\n"; return 1;
    }
    const double average = static_cast<double>(total) / count;
    std::cout << "Average: " << average << '\n'
              << "High average: " << std::boolalpha << (average >= 85.0) << '\n';
}
```

النسخة `double average = total / count;` تنفذ قسمة صحيحة أولًا. اختبر `7 2` لترى الفرق بين `3` و`3.5`، واختبر Count صفرًا.

## تأكد من فهمك

<div class="lesson-quiz" role="list">
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">01</span><p>ما ناتج 7/2 و7.0/2 ولماذا؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> الأول 3 بقسمة صحيحة، والثاني 3.5 لأن وجود double يرفع الحساب إلى قسمة عشرية.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">02</span><p>لماذا static_cast&lt;int&gt;(largeDouble) ليس ضمان أمان؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> هو يعلن نية التحويل فقط؛ قد تضيع الكسور أو تكون القيمة خارج مجال int، لذا يجب التحقق أولًا.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">03</span><p>ما الفرق بين &amp;&amp; و&amp; مع قيم Boolean؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> &amp;&amp; منطقي ويستخدم Short-circuit، أما &amp; بتّي ويقيّم الطرفين ويعمل على البتات؛ قد تتشابه نتيجة bool لكن السلوك مختلف.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">04</span><p>كيف تمنع Overflow في n*(n+1)/2؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> وسّع أحد العوامل قبل الضرب مثل 1LL*n، وتحقق أن المجال الأوسع يكفي للحد الأقصى المتوقع.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">05</span><p>توقع قيم <code>7 / 2</code> و<code>7 / 2.0</code> وفسر اختلافهما.</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> الأولى 3 لأن المعاملين صحيحان، والثانية 3.5 لأن وجود 2.0 يرفع العملية إلى floating point قبل القسمة.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">06</span><p>ما الخطأ في حساب <code>long long total = a * b;</code> إذا كان <code>a</code> و<code>b</code> من نوع <code>int</code>؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> قد يحدث overflow أثناء ضرب int قبل الإسناد الواسع. صححه إلى <code>1LL * a * b</code> وتحقق من أن long long نفسه يكفي.</div></details>
</section>
</div>
