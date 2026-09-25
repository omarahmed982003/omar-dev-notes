---
title: "5. الأنواع والمتغيرات والنطاق والذاكرة"
sidebar:
  order: 5
description: "النوع يحدد شكل القيمة والعمليات الممكنة عليها وحدود تمثيلها. المتغير يجمع اسمًا ونوعًا وقيمة وعمرًا ونطاق رؤية."
tableOfContents: true
---

## النوع والمتغير

النوع يحدد شكل القيمة والعمليات الممكنة عليها وحدود تمثيلها. المتغير يجمع اسمًا ونوعًا وقيمة وعمرًا ونطاق رؤية.

## اختيار النوع والتهيئة

النوع يحدد مجموعة القيم الممكنة، وطريقة تمثيلها في الذاكرة، والعمليات التي يسمح بها المترجم. اختر `int` عندما تمثل عددًا صحيحًا يقع داخل مداه، و`double` عندما تحتاج قيمة كسرية تقريبية، و`bool` لحقيقة منطقية، و`std::string` لنص قابل للتعامل كوحدة واحدة.

لا تختَر النوع من حجمه فقط. اسأل عن معنى القيمة وأكبر وأصغر قيمة متوقعة. رقم الهوية مثلًا قد يتكون من أرقام لكنه ليس كمية نجري عليها جمعًا، ولذلك يناسبه النص غالبًا.

التهيئة تضع أول قيمة للمتغير. الصيغة ذات الأقواس مثل `int count{0};` تساعد المترجم على رفض كثير من تحويلات التضييق. `const` تمنع تعديل القيمة بعد تهيئتها، بينما `constexpr` تطلب أن تكون القيمة قابلة للحساب وقت الترجمة عندما تسمح العبارة بذلك.

النطاق `Scope` يحدد أين يمكن استخدام الاسم، والعمر `Lifetime` يحدد متى يوجد الكائن فعلًا. المتغير المحلي ينتهي عادة عند مغادرة كتلته. أما `static` المحلي فيحتفظ بقيمته بين استدعاءات الدالة. تعريف اسم محلي يطابق اسمًا خارجيًا يسمى `Shadowing` وقد يخفي القيمة التي كنت تقصدها.

## أمثلة على التصريح والتهيئة

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
<div class="diagram-node input"><span>معنى القيمة</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>اختيار النوع</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>تهيئة صحيحة</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node decision"><span>Scope وLifetime</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node output"><span>عمليات آمنة ومسموحة</span></div>
</div>
</div>

## فئات الأنواع

تضم الأنواع الأساسية `bool` وCharacter types وSigned/unsigned integers وFloating-point types و`void`. وتبني اللغة والمكتبة أنواعًا مركبة مثل Arrays وPointers وReferences، وأنواعًا معرفة من المستخدم مثل Classes وEnums، وأنواع مكتبة مثل `std::string`.

لا يضمن المعيار الحجم نفسه لكل Integer type على كل منصة، لكنه يضمن ترتيبًا أدنى للعروض. على MSVC الحديث يكون `int` غالبًا 4 Bytes و`long long` ثمانية، لكن استخدم `sizeof` و`std::numeric_limits` بدل حفظ افتراضات المنصة.

## Signed وUnsigned والمدى

يخصص النوع Signed جزءًا من التمثيل للقيم السالبة، بينما يستخدم Unsigned كل الأنماط من صفر فأعلى ويطبق Arithmetic modulo `2^N`. خلط Signed وUnsigned قد يحول قيمة سالبة إلى عدد كبير. لا تستخدم Unsigned كعلاج تلقائي للمدخل السالب؛ تحقق من المجال أولًا.

```cpp
std::cout << sizeof(int) << '\n';
std::cout << std::numeric_limits<int>::min() << '\n';
std::cout << std::numeric_limits<int>::max() << '\n';
```

## Floating point

`float` و`double` يمثلان مدى واسعًا بدقة محدودة. كثير من الكسور العشرية لا تملك تمثيلًا ثنائيًا دقيقًا، لذلك لا تعتمد على `0.1 + 0.2 == 0.3`. استخدم Tolerance مناسبة للسياق، وللأموال استخدم أصغر وحدة صحيحة أو نوعًا عشريًا مناسبًا.

## التصريح والتهيئة والإسناد

```cpp
int a;        // قد يكون غير مهيأ محليًا
int b = 5;    // copy initialization
int c(5);     // direct initialization
int d{5};     // list initialization وتمنع narrowing الواضح
int e{};      // value initialization إلى صفر
```

يفضل تعريف المتغير قريبًا من أول استخدام وتهيئته فورًا. تستخدم `auto` النوع المستنتج من Initializer، لكنها لا تعني «بلا نوع». راجع النوع المستنتج عندما تكون المراجع و`const` والتحويلات مؤثرة.

## الثوابت والذاكرة

`const` يمنع تعديل الاسم بعد التهيئة، و`constexpr` يطلب قيمة قابلة للاستخدام وقت الترجمة عند تحقق الشروط. لا يعني وجود متغير أن اللغة تعدك بعنوان ذاكرة ثابت؛ قد يحتفظ Optimizer بالقيمة في Register أو يزيلها إذا لم تؤثر في السلوك.

## Scope وLifetime وShadowing

Block scope يبدأ وينتهي مع `{}`، وFunction scope يتعلق بأجزاء محددة مثل Labels، وNamespace scope يستمر عبر الملفات وفق التصريحات. قد يخفي متغير داخلي اسمًا خارجيًا، وهو Shadowing يربك القراءة. Lifetime يحدد متى يوجد الكائن، بينما Scope يحدد أين يمكن استخدام الاسم. الخلط بينهما يؤدي لاحقًا إلى References معلقة.

## Integer types والمدى

توجد الأنواع `short` و`int` و`long` و`long long` بنسخ signed وunsigned. يضمن المعيار ترتيبًا أدنى للأحجام لكنه لا يضمن أن `int` دائمًا 32 بت على كل منصة. استخدم `sizeof` لمعرفة الحجم في بيئة معينة، و`std::numeric_limits<T>::min()` و`max()` لمعرفة المدى.

اختيار `long long` لا يصلح منطق البرنامج إذا كانت العملية نفسها تنفذ أولًا بنوع أصغر. في التعبير `int a * int b` يحدث الضرب كـ`int` قبل إسناده إلى `long long`. حوّل أحد الطرفين أو عرّف المدخلات بالنوع الواسع عند احتمال تجاوز المدى.

## Literals وSuffixes وauto

العدد `10` Integer literal من نوع مناسب يبدأ عادة بـ`int`، و`10.0` Floating literal من نوع `double`. تضيف اللاحقة `LL` معنى `long long`، وتضيف `f` معنى `float`. أما `auto` فيطلب من المترجم استنتاج النوع من القيمة المهيئة.

لا يعني `auto` أن المتغير بلا نوع أو أن نوعه يتغير لاحقًا. الاستنتاج يحدث وقت الترجمة ثم يبقى النوع ثابتًا. استخدمه عندما يكون النوع واضحًا من الجهة اليمنى أو طويلًا جدًا، ولا تستخدمه إذا كان يخفي معنى مهمًا مثل الفرق بين signed وunsigned.

## التخزين والعمر والنطاق

المتغير المحلي العادي ينشأ عند وصول التنفيذ إلى تعريفه وينتهي عند مغادرة الكتلة. المتغير `static` المحلي ينشأ مرة واحدة ويستمر حتى نهاية البرنامج، لكنه يظل مرئيًا داخل الدالة فقط. المتغير العام يملك عمر البرنامج كله ويزيد الترابط بين الأجزاء، لذلك يفضل تقليل استخدامه.

النطاق Scope يتعلق بإمكانية الوصول إلى الاسم، والعمر Lifetime يتعلق بوجود الكائن. قد ينتهي نطاق اسم بينما يستمر كائن أشير إليه بطريقة أخرى، وقد يبقى اسم مرئيًا لكنه يشير إلى كائن انتهى عمره إذا استخدمت مرجعًا أو مؤشرًا بطريقة خاطئة.

## القيمة غير المهيأة وUndefined Behavior

قراءة متغير محلي أساسي قبل تهيئته خطأ خطير، وقد تنتج قيمة مختلفة من تشغيل إلى آخر. التهيئة الصفرية بالأقواس تمنع ذلك: `int attempts{};` يبدأ من صفر و`bool finished{};` يبدأ بقيمة false.

لا تعتمد على أن الذاكرة كانت صفرًا أثناء التجربة. بعض الأخطاء تؤدي إلى Undefined Behavior، أي أن معيار C++ لا يفرض نتيجة محددة، وقد يبدو البرنامج صحيحًا ثم يتغير مع التحسين أو بيئة أخرى.

## برنامج كامل: اختيار النوع والتحقق من المدى

```cpp
#include <iostream>
#include <string>

int main() {
    std::string name;
    int age{};
    long long balancePiasters{};

    std::cout << "Name age balance-in-piasters: ";
    if (!(std::cin >> name >> age >> balancePiasters)) {
        std::cerr << "Invalid input\n";
        return 1;
    }
    if (age < 0 || age > 130 || balancePiasters < 0) {
        std::cerr << "Value outside the accepted range\n";
        return 1;
    }

    const bool adult = age >= 18;
    std::cout << name << " | age=" << age
              << " | adult=" << std::boolalpha << adult
              << " | balance=" << balancePiasters << " piasters\n";
}
```

مدخل `Omar 24 12550` يطبع بيانات صحيحة، بينما `Omar -2 100` يمر من ناحية النوع لكنه يفشل قاعدة المجال. النوع لا يغني عن Validation، و`long long` يختار من الحد الأقصى المحتمل لا من القيمة التجريبية الصغيرة.

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
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">05</span><p>توقع الناتج: <code>int x{3}; double y{x / 2};</code> ثم طباعة <code>y</code>. لماذا؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> الناتج 1 لأن القسمة حدثت بين عددين صحيحين قبل التحويل إلى double. استخدم <code>double y = x / 2.0;</code> للحصول على 1.5.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">06</span><p>صحح تعريفًا يخزن عدد زوار قد يتجاوز ملياري زائر وقيمة لا يجوز أن تتغير بعد التهيئة.</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> استخدم نوعًا موثق المجال مثل <code>const std::int64_t visitors{value};</code> بعد التحقق من المدخل، بدل افتراض أن <code>int</code> يكفي.</div></details>
</section>
</div>
