---
title: "12. switch وتدفق التحكم والحاسبة"
sidebar:
  order: 12
description: "switch مناسب لاختيار فرع حسب قيمة منفصلة واحدة. استخدمه عندما تكون الحالات ثابتة وواضحة، ويفضل if للنطاقات والشروط المركبة."
tableOfContents: true
---

## الاختيار بقيمة منفصلة

switch مناسب لاختيار فرع حسب قيمة منفصلة واحدة. استخدمه عندما تكون الحالات ثابتة وواضحة، ويفضل if للنطاقات والشروط المركبة.

## selector وcase وbreak وdefault

تفحص `switch` قيمة واحدة تسمى `selector`، ثم تقفز إلى `case` المطابقة. يناسبها عدد صحيح أو `char` أو `enum`. لا تستخدم مباشرة مع `double` أو `std::string`، ولا تعبّر عن مدى مثل `score >= 50` لأن كل `case` يجب أن تكون قيمة ثابتة ومميزة وقت الترجمة.

بعد الوصول إلى حالة يستمر التنفيذ في الحالات التالية ما لم يقابله `break` أو `return` أو نهاية `switch`. هذا السلوك يسمى Fall-through، وقد يكون خطأ إذا نسيت `break`. عندما تقصده فعلًا استخدم `[[fallthrough]]` حتى يفهم القارئ والمترجم نيتك.

تعالج `default` أي قيمة لم تطابق الحالات المكتوبة. ويمكن وضع عدة `case` متتالية قبل جسم واحد عندما تشترك القيم في السلوك. إذا عرّفت متغيرًا محليًا داخل حالة، ضع جسم الحالة بين `{}` حتى لا يقفز التنفيذ عبر تهيئته من حالة أخرى.

## مثال: قائمة أوامر

```cpp
switch (choice) {
case 1: runReport(); break;
case 2: saveFile(); break;
case 0: std::cout << "Bye\n"; break;
default: std::cout << "Unknown option\n";
}
```

## أخطاء شائعة وتصحيحات

- لا يختبر `switch` الشرط `score >= 50` مباشرة.
- نسيان break قد يشغّل أكثر من حالة.

## ما الذي يقبله switch؟

يعمل Selector مع الأنواع الصحيحة و`char` وEnums والتحويلات المناسبة إليها. لا يقبل `double` أو `std::string` مباشرة. ويجب أن تكون كل `case` قيمة ثابتة ومميزة، وليست شرطًا ينفذ أثناء التشغيل.

قد تتشارك حالات متعددة جسمًا واحدًا، ويمكن توثيق الاستمرار المقصود باستخدام `[[fallthrough]]`. ضع أقواسًا حول جسم الحالة إذا عرّفت متغيرًا محليًا حتى لا يقفز التنفيذ فوق تهيئته.

## حاسبة آمنة

```cpp
double a{}, b{};
char op{};
if (!(std::cin >> a >> op >> b)) return 1;

switch (op) {
case '+': std::cout << a + b; break;
case '-': std::cout << a - b; break;
case '*': std::cout << a * b; break;
case '/':
    if (b == 0.0) std::cout << "Cannot divide by zero";
    else std::cout << a / b;
    break;
default: std::cout << "Unsupported operator";
}
```

هذا المثال يوضح أن `switch` يختار العملية، بينما يعالج `if` قاعدة النطاق داخل حالة القسمة. اختر البنية حسب نوع القرار لا حسب الرغبة في استخدام صياغة جديدة.

<div class="lesson-diagram" role="img" aria-label="كيف يختار switch الحالة وكيف يمنع break الانتقال">
<p class="lesson-diagram-title">كيف يختار switch الحالة وكيف يمنع break الانتقال</p>
<div class="diagram-flow">
<div class="diagram-node input"><span>Selector</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node decision"><span>ابحث عن case</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>نفّذ الحالة</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node decision"><span>break؟</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node output"><span>اخرج / default</span></div>
</div>
</div>

## Grouped cases وFall-through

```cpp
switch (answer) {
case 'Y':
case 'y':
    std::cout << "Confirmed";
    break;
case 'N':
case 'n':
    std::cout << "Cancelled";
    break;
default:
    std::cout << "Use Y or N";
}
```

تجمع الحالات المتتالية قيمًا مختلفة على جسم واحد. أما الاستمرار بعد تنفيذ تعليمات حالة فيوثق بـ`[[fallthrough]]` منذ C++17 عندما يكون مقصودًا. لا يختبر `switch` الحالة التالية من جديد؛ يبدأ عند Label المطابق ويستمر للأمام حتى `break` أو نهاية البنية.

## Scope داخل case

لا تنشئ Labels نطاقًا مستقلًا. ضع جسم الحالة داخل `{}` عند تعريف متغير حتى لا يقفز التنفيذ فوق Initialization، وحتى يمكنك استخدام الاسم نفسه في حالة أخرى.

## enum بدل الأرقام السحرية

إذا كانت الحالات تمثل مفهومًا معروفًا، فاستخدم `enum class` بدل `1` و`2` و`3`. يعطي كل اختيار اسمًا ونوعًا مستقلًا ويمنع خلطه بسهولة مع أعداد أخرى. ما زلت تحتاج إلى تحويل الإدخال الخام والتحقق منه قبل استخدام القيمة.

## switch أم if أم جدول بيانات؟

استخدم `switch` لقيمة منفصلة واحدة، و`if` للنطاقات والشروط المركبة. إذا زاد عدد الحالات وكانت كل حالة تربط مفتاحًا بقيمة فقط، فقد يكون جدول أو Map أو Array أوضح من عشرات أسطر `case`. وإذا اختلف السلوك المعقد لكل حالة فقد تحتاج لاحقًا إلى دوال منفصلة.

## كيف تنفّذ switch القرار خطوة بخطوة؟

يقيّم البرنامج تعبير `switch` مرة واحدة، ثم يحوّل النتيجة إلى النوع المناسب ويبحث عن Label تحمل القيمة نفسها. عند العثور عليها يقفز التنفيذ إلى أول تعليمة بعدها. لا يعيد البرنامج فحص الحالات التالية، لذلك لا تعني `case` شرطًا جديدًا مثل `if`؛ إنها نقطة دخول داخل بنية التحكم.

```cpp
char action{'P'};

switch (action) {
case 'R':
    std::cout << "Registration\n";
    break;
case 'P':
    std::cout << "Payment\n";
    break;
case 'S':
    std::cout << "Status\n";
    break;
default:
    std::cout << "Unknown action\n";
}
```

القيمة هي `'P'`، لذلك يبدأ التنفيذ من حالة الدفع ويخرج عند `break`. لا يختبر البرنامج `'R'` ثم `'P'` بالتتابع كما تفعل سلسلة `if/else if` من ناحية الصياغة، وإن كانت النتيجة المنطقية متشابهة في هذا المثال.

## الأنواع المسموح بها للـSelector

| النوع | صالح مباشرة؟ | الملاحظة |
| --- | --- | --- |
| `char` والأنواع الصحيحة | نعم | مثل أرقام القوائم وحروف الأوامر |
| `bool` | نعم تقنيًا | غالبًا تكون `if` أوضح لأن هناك احتمالين فقط |
| `enum` و`enum class` | نعم | اختيار جيد للحالات المسماة بعد معالجة الإدخال |
| `float` و`double` | لا | القيم العشرية لا تصلح Labels منفصلة موثوقة |
| `std::string` | لا | استخدم `if/else if` أو خريطة أو حوّل الإدخال إلى Enum |

قد تقبل البنية Class لها تحويل مناسب إلى نوع صحيح أو Enum، لكن التحويل الضمني هنا قد يخفي معنى القرار. في الكود التعليمي والتطبيقي اجعل نوع الـSelector واضحًا.

## شروط case: قيمة ثابتة وفريدة

كل Label يجب أن تكون Integral Constant Expression معروفة وقت الترجمة، وأن تكون فريدة بعد التحويل إلى نوع الـSelector.

```cpp
constexpr int registerCode = 1;
constexpr int reportCode = 1 + 1;

int choice{};
std::cin >> choice;

switch (choice) {
case registerCode:
    std::cout << "Register\n";
    break;
case reportCode:
    std::cout << "Report\n";
    break;
}
```

لا تصلح قيمة يحددها المستخدم ولا مقارنة وقت التشغيل كـLabel:

```cpp
// case choice:       // ليست ثابتة وقت الترجمة
// case choice > 2:   // Predicate وليست قيمة منفصلة
// case 2:            // خطأ إذا كانت reportCode تساوي 2 بالفعل
```

استخدام `constexpr` يعلن بوضوح أن الاسم قيمة ثابتة وقت الترجمة. وقد يكون `const int` صالحًا في بعض الحالات عندما يحقق قواعد Constant Expression، لكن `constexpr` يعبّر عن القصد بدقة أكبر.

## تتبع Fall-through بدل تخمينه

```cpp
int choice{1};

switch (choice) {
case 1:
    std::cout << "One\n";
case 2:
    std::cout << "Two\n";
    break;
default:
    std::cout << "Other\n";
}
```

التتبّع الصحيح:

1. يجد البرنامج `case 1` ويطبع `One`.
2. لا توجد `break`، فيكمل إلى التعليمات التالية ويطبع `Two`.
3. تقابله `break` فيخرج من `switch`.

لم يقارن البرنامج القيمة مع `case 2` مرة ثانية. إذا كان الانتقال مقصودًا بين جسمين، اكتب `[[fallthrough]];` في C++17 أو أحدث. أما وضع Labels متتالية بلا تعليمات بينها، مثل `'Y'` و`'y'`، فهو تجميع قيم على الجسم نفسه ولا يحتاج Attribute.

## default ليست شرطًا إلزاميًا لكنها شبكة أمان

يمكن حذف `default`، وعندها لا ينفذ `switch` شيئًا إذا لم توجد حالة مطابقة. وجودها أفضل غالبًا مع مدخل المستخدم لأنها تكشف القيمة غير المدعومة. يجوز وضعها في الوسط، لكن وضعها في النهاية يجعل التدفق أسهل في القراءة. وإذا وضعتها قبل حالات أخرى فتذكّر أن التنفيذ قد يستمر منها إلى ما بعدها عند غياب `break`.

## مثال كامل: حاسبة مع التحقق من الإدخال

```cpp
#include <iostream>

int main() {
    double left{}, right{};
    char operation{};

    std::cout << "Enter: number operator number: ";
    if (!(std::cin >> left >> operation >> right)) {
        std::cerr << "Invalid input\n";
        return 1;
    }

    switch (operation) {
    case '+':
        std::cout << "Result: " << left + right << '\n';
        break;
    case '-':
        std::cout << "Result: " << left - right << '\n';
        break;
    case '*':
        std::cout << "Result: " << left * right << '\n';
        break;
    case '/':
        if (right == 0.0) {
            std::cerr << "Cannot divide by zero\n";
            return 1;
        }
        std::cout << "Result: " << left / right << '\n';
        break;
    default:
        std::cerr << "Unsupported operator\n";
        return 1;
    }
}
```

اختبر البرنامج بالمدخلات `8 / 2` و`8 / 0` و`5 * 3` و`5 ? 3`. كل اختبار يغطي مسارًا مختلفًا: نجاح القسمة، قاعدة منع الصفر، عملية عادية، والـ`default`. التحقق من نجاح `std::cin` يسبق القرار لأن `switch` لا يستطيع إصلاح Input Stream فاشل.

## تأكد من فهمك

<div class="lesson-quiz" role="list">
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">01</span><p>لماذا لا يصلح switch مباشرة لـscore&gt;=50؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> case يطابق قيمًا ثابتة منفصلة، لا نطاقات أو تعبيرات مقارنة؛ استخدم if/else للنطاقات.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">02</span><p>ماذا يحدث عند نسيان break؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> يستمر التنفيذ في الحالات التالية حتى break أو نهاية switch، وهو Fall-through قد يكون خطأ أو مقصودًا موثقًا.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">03</span><p>متى تجمع عدة case؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> عندما تشترك قيم متعددة في السلوك نفسه، مثل عدة حروف تؤدي إلى الأمر نفسه.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">04</span><p>لماذا تحتاج أقواسًا داخل case عند تعريف متغير؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> لإنشاء نطاق واضح وتجنب القفز فوق تهيئة متغير بين labels مختلفة.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">05</span><p>إذا بدأت القيمة من case 1 ولا توجد break قبل case 2، هل يعيد البرنامج مقارنة الـSelector مع 2؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> لا. بعد القفز إلى Label المطابقة يستمر التنفيذ للأمام مثل أي تعليمات متتابعة حتى break أو return أو نهاية switch.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">06</span><p>لماذا يستخدم مثال الحاسبة switch للعملية وif داخل القسمة؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> العملية قيمة حرفية منفصلة تناسب switch، أما منع القسمة فيعتمد على Predicate وقت التشغيل وهو <code>right == 0.0</code>، لذلك تناسبه if.</div></details>
</section>
</div>
