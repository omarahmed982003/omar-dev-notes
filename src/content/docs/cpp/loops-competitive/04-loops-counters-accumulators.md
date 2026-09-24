---
title: "16. الحلقات وأنماط التكرار"
sidebar:
  order: 16
description: "الحلقة تصف تكرارًا له حالة بداية وشرط استمرار وتحديث. اختيار while أو for أو do-while يعتمد على شكل التكرار لا على التفضيل الشخصي."
tableOfContents: true
---

## مكوّنات الحلقة

الحلقة تصف تكرارًا له حالة بداية وشرط استمرار وتحديث. اختيار while أو for أو do-while يعتمد على شكل التكرار لا على التفضيل الشخصي.

## for وwhile وdo-while

كل حلقة تحتاج حالة بداية، وشرط استمرار، وتحديثًا يجعل الحالة تقترب من التوقف. غياب التحديث أو تحركه في الاتجاه الخطأ ينشئ Infinite Loop.

تجمع `for` التهيئة والشرط والتحديث في سطر واحد، لذلك تناسب عدادًا معروف المسار. تستخدم `while` عندما يعتمد التوقف على إدخال أو حالة تتغير ولا نعرف عدد الدورات مقدمًا. تنفذ `do-while` الجسم مرة على الأقل لأنها تختبر الشرط بعد التنفيذ، ولذلك تناسب قائمة يجب عرضها مرة أو محاولة إدخال أولى إلزامية.

الـCounter متغير يعد مرات تحقق شرط. الـAccumulator يدمج القيم، فيبدأ المجموع من صفر والضرب من واحد. الـSentinel قيمة خاصة تنهي سلسلة غير معروفة الطول ولا تدخل ضمن البيانات. `break` ينهي أقرب حلقة، بينما `continue` يتجاوز بقية الدورة الحالية ويعود إلى الاختبار أو التحديث.

الحلقتان المتداخلتان لا تعنيان `O(n²)` دائمًا، لكن إذا نفذت الداخلية `n` مرة لكل واحدة من `n` دورات خارجية فالإجمالي يقارب `n²`. احسب عدد العمليات الفعلي ولا تعتمد على شكل الكود وحده.

## مثال: جمع الأعداد الزوجية

```cpp
long long sum{};
for (int i = 1; i <= n; ++i) {
    if (i % 2 != 0) continue;
    sum += i;
}
```

## أخطاء شائعة وتصحيحات

- تأكد أن كل مسار يقترب من شرط التوقف.
- تحديث العداد في المكان الخطأ قد يسبب دورة زائدة أو ناقصة.

## تتبع الحلقة يدويًا

اكتب جدولًا يحوي قيمة متغير التحكم، ونتيجة الشرط، والتغيير في الحالة بعد كل Iteration. حدد **البداية، وشرط الاستمرار، والخطوة** قبل كتابة `while` أو `for`. إذا كانت الخطوة لا تقرّب الحالة من التوقف فالحلقة قد تصبح لا نهائية.

## أنماط التكرار

- Counter يبدأ من صفر ويزيد عند تحقق قاعدة.
- Accumulator يبدأ بقيمة محايدة، مثل صفر للجمع وواحد للضرب.
- Sentinel قيمة خاصة تنهي الإدخال ولا تدخل ضمن البيانات.
- Validation loop يكرر القراءة حتى تصبح القيمة صالحة.
- Nested loops تمثل صفوفًا وأعمدة، وعدد تنفيذ الجسم الداخلي يساوي حاصل ضرب حدود الحلقتين غالبًا.

```cpp
int positive{}, negative{}, even{}, odd{};
for (int i = 0; i < n; ++i) {
    int value{};
    std::cin >> value;
    if (value > 0) ++positive;
    else if (value < 0) ++negative;
    if (value % 2 == 0) ++even;
    else ++odd;
}
```

لا تحتاج Array عندما تريد ملخصًا فقط ويمكن تحديثه فور وصول كل قيمة. تحتاج تخزين العناصر إذا كنت ستعود إليها لاحقًا أو ترتبها أو تقارنها معًا.

<div class="lesson-diagram" role="img" aria-label="دورة الحلقة ومكان حدوث أخطاء البداية والحد والتحديث">
<p class="lesson-diagram-title">دورة الحلقة ومكان حدوث أخطاء البداية والحد والتحديث</p>
<div class="diagram-flow">
<div class="diagram-node start"><span>تهيئة</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node decision"><span>الشرط</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>جسم الحلقة</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>تحديث</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node output"><span>خروج</span></div>
</div>
</div>

## while وfor وdo-while

تفحص `while` الشرط قبل الجسم وقد تنفذ صفر مرة. تجمع `for` التهيئة والشرط والتحديث في Header وتناسب العد المعروف. تنفذ `do-while` الجسم مرة قبل الفحص، فتناسب قائمة يجب عرضها أو إدخالًا يجب طلبه مرة على الأقل.

```cpp
int number{};
do {
    std::cin >> number;
} while (number <= 0);
```

## Infinite loops

قد تكون الحلقة اللانهائية خطأ بسبب Update مفقود أو اتجاه خاطئ أو فاصلة منقوطة بعد `while`. وقد تكون مقصودة في Server loop أو Event loop أو Menu، لكنها تحتاج Exit strategy واضحة واستجابة للفشل أو الإلغاء.

## Sentinel والتحقق

قيمة Sentinel مثل `-1` تنهي التسلسل ولا تدخل في البيانات. يجب قراءة القيمة التالية داخل الحلقة، وإلا لن تتغير الحالة. في Validation loop صف القيم المرفوضة بالشرط: `age < 0 || age > 120`.

## break وcontinue

ينهي `break` أقرب Loop، ويتجاوز `continue` بقية الـIteration الحالية. الإفراط فيهما قد يخفي تدفقًا معقدًا، لكنهما أوضح عندما يعبران عن توقف أو Skip محدد.

## Nested loops

في مستطيل نجوم تمثل الحلقة الخارجية الصفوف والداخلية الأعمدة. إذا كان عدد الصفوف `r` والأعمدة `c` ينفذ الجسم الداخلي `r*c` مرة. أعد تهيئة متغير الحلقة الداخلية لكل صف، وتتبع صفًا كاملًا قبل تعميم النتيجة.

## Invariant الحلقة

الـInvariant حقيقة تبقى صحيحة قبل كل دورة وبعدها. عند جمع أول `i` أعداد، يجب أن يمثل `sum` مجموع الأعداد التي تمت معالجتها فقط. يساعد ذلك على اختيار قيمة البداية وتحديث المتغير وتفسير النتيجة بعد التوقف.

## البحث والحد الأدنى والأقصى

عند البحث يمكن التوقف بـ`break` بعد العثور على القيمة إذا كنت تحتاج أول ظهور فقط. وعند حساب الحد الأدنى لا تبدأ بقيمة سحرية قد تكون داخل البيانات؛ اقرأ أول قيمة صالحة أو احتفظ بمتغير يوضح أن البرنامج لم يرَ قيمة بعد.

## معالجة أرقام العدد

يعطي `number % 10` الرقم الأخير في عدد موجب، وتزيله `number /= 10`. يمكن بهذه الحلقة حساب عدد الأرقام أو مجموعها أو عكسها. انتبه إلى حالة الصفر وإشارة العدد وأكبر قيمة عند بناء العدد المعكوس.

## التعقيد الفعلي للحلقات المتداخلة

إذا دارت الحلقة الداخلية من الصفر إلى `n` لكل دورة خارجية فالتعقيد `O(n²)`. أما إذا تحرك مؤشر داخلي إلى الأمام فقط عبر التنفيذ كله، فقد يكون مجموع عمله `O(n)`. احسب عدد مرات تنفيذ الجسم بدل الحكم من عدد مستويات الأقواس.

## نموذج الحلقة: البداية والشرط والجسم والتحديث

قبل أن تختار `while` أو `for`، حوّل المطلوب إلى أربع إجابات واضحة:

1. **البداية:** ما أول قيمة أو حالة؟
2. **شرط الاستمرار:** متى يسمح البرنامج بدورة أخرى؟
3. **الجسم:** ما العمل الذي يتكرر؟
4. **التحديث:** ما الذي يتغير حتى نقترب من التوقف؟

الدورة الواحدة تسمى Iteration. في الحلقات ذات الاختبار المسبق، يفحص البرنامج الشرط قبل كل Iteration؛ إذا كان خطأ من البداية فلن ينفذ الجسم مطلقًا.

## while بالتتبّع اليدوي

```cpp
int i = 1;

while (i <= 5) {
    std::cout << i << '\n';
    ++i;
}
```

| قبل الدورة | نتيجة `i <= 5` | المطبوع | القيمة بعد `++i` |
| ---: | --- | ---: | ---: |
| 1 | true | 1 | 2 |
| 2 | true | 2 | 3 |
| 3 | true | 3 | 4 |
| 4 | true | 4 | 5 |
| 5 | true | 5 | 6 |
| 6 | false | لا شيء | لا يوجد تحديث |

يساعد الجدول على كشف الـOff-by-one قبل التشغيل. لو كتبت `i < 5` فآخر قيمة مطبوعة ستكون 4. ولو حذفت `++i` ستظل `i` تساوي 1 ويستمر البرنامج في طباعة 1.

## العد التصاعدي والتنازلي والخطوات المختلفة

```cpp
// من 0 إلى 9: عشر دورات بالضبط
int i = 0;
while (i < 10) {
    std::cout << i << ' ';
    ++i;
}

// من 10 إلى 1
int countdown = 10;
while (countdown >= 1) {
    std::cout << countdown << ' ';
    --countdown;
}

// الأعداد الزوجية من 0 إلى 20 مباشرة
int even = 0;
while (even <= 20) {
    std::cout << even << ' ';
    even += 2;
}
```

في العد التنازلي يجب أن تتحرك الخطوة نحو الحد. استخدام `++countdown` مع شرط `countdown >= 1` يبعد القيمة عن التوقف وقد ينتهي بسلوك غير معرّف عند تجاوز مجال النوع الصحيح.

## تحديثات الضرب والقسمة

لا يشترط أن تكون الخطوة `+1` أو `-1`. قد تكبر القيمة أو تصغر بنسبة ثابتة:

```cpp
int value = 1;
while (value <= 64) {
    std::cout << value << ' ';
    value *= 2;
}
// 1 2 4 8 16 32 64
```

```cpp
int value{};
std::cin >> value;

while (value > 0) {
    std::cout << value << ' ';
    value /= 2;
}
```

إذا كان الإدخال `100` فالتتبّع هو `100, 50, 25, 12, 6, 3, 1` ثم تصبح القيمة صفرًا بسبب القسمة الصحيحة. هذا النمط ينفذ تقريبًا `log₂(value)` دورة، لا عددًا مساويًا للقيمة نفسها. عند الضرب راقب Overflow لأنه قد يمنع الشرط من الوصول إلى الحالة المتوقعة.

## الفاصلة المنقوطة بعد while

```cpp
int i = 1;
while (i <= 5);  // جسم فارغ
{
    std::cout << i;
    ++i;
}
```

الفاصلة المنقوطة هي جسم الحلقة الفارغ، ولذلك لا يصل التنفيذ إلى Block التالي ما دام الشرط صحيحًا، كما أن `i` لا تتغير داخل الحلقة. اكتب الأقواس في سطر واضح وفعّل تحذيرات المترجم كي يلفت انتباهك إلى Empty body.

## Sentinel: إدخال لا نعرف طوله

```cpp
int number{};
std::cin >> number;

while (number != 0) {
    std::cout << "Accepted: " << number << '\n';
    std::cin >> number;
}
```

الصفر هنا إشارة توقف وليس عنصرًا من البيانات. نحتاج قراءة أولية قبل الحلقة حتى يستطيع الشرط فحص قيمة حقيقية، ثم قراءة جديدة في نهاية كل دورة. حذف القراءة الثانية يجعل الشرط يفحص القيمة نفسها إلى الأبد. الصيغة الأكثر متانة تربط الاستمرار بنجاح Stream أيضًا:

```cpp
while (std::cin >> number && number != 0) {
    std::cout << "Accepted: " << number << '\n';
}
```

## do-while عندما يجب تنفيذ الجسم مرة

```cpp
int number{};

do {
    std::cout << "Enter a positive number: ";
    std::cin >> number;
} while (number <= 0);
```

يطلب البرنامج الإدخال أولًا، ثم يكرر عند القيمة غير الصالحة. الفاصلة المنقوطة بعد `while (condition);` جزء إلزامي من الصياغة هنا، بعكس الخطأ السابق في حلقة `while` العادية.

### قائمة تعمل مرة واحدة على الأقل

```cpp
int choice{};

do {
    std::cout << "1. Play\n2. Settings\n0. Exit\n";
    std::cin >> choice;

    if (choice == 1) {
        std::cout << "Playing\n";
    } else if (choice == 2) {
        std::cout << "Settings\n";
    } else if (choice != 0) {
        std::cout << "Unknown choice\n";
    }
} while (choice != 0);
```

عرض القائمة يسبق اختبار الاختيار، لذلك تعبّر `do-while` عن المشكلة مباشرة. في تطبيق حقيقي عالج فشل `std::cin` أيضًا حتى لا يبقى البرنامج في حلقة تستخدم قيمة قديمة.

## for وترتيب التنفيذ الحقيقي

```cpp
for (int i = 1; i <= 5; ++i) {
    std::cout << i << '\n';
}
```

ترتيب التنفيذ هو:

1. تنفذ `int i = 1` مرة واحدة.
2. يفحص البرنامج `i <= 5`.
3. إذا كان الشرط صحيحًا ينفذ الجسم.
4. ينفذ `++i` بعد الجسم.
5. يعود إلى الشرط، ولا يعيد Initialization.

المعادلة المكافئة تقريبًا باستخدام `while` هي:

```cpp
int i = 1;
while (i <= 5) {
    std::cout << i << '\n';
    ++i;
}
```

إذا كان لدينا `n` عناصر تبدأ فهارسها من صفر، فالنمط المعتاد هو `i < n`. عند `n = 5` تكون الفهارس `0, 1, 2, 3, 4`. استخدام `i <= n` ينتج ست دورات ويحاول لاحقًا الوصول إلى فهرس خارج الحدود.

## Counter وAccumulator والـAverage

الـCounter يجيب عن سؤال «كم عنصرًا؟»، والـAccumulator يجيب عن «ما مجموع أو ناتج العناصر؟».

```cpp
int evenCount = 0;

for (int i = 1; i <= 10; ++i) {
    if (i % 2 == 0) {
        ++evenCount;
    }
}

std::cout << evenCount; // 5
```

```cpp
int n{};
std::cin >> n;

long long sum = 0;
for (int i = 0; i < n; ++i) {
    int number{};
    std::cin >> number;
    sum += number;
}

if (n > 0) {
    double average = static_cast<double>(sum) / n;
    std::cout << "Sum: " << sum << "\nAverage: " << average;
}
```

بدأ `sum` من صفر لأن الصفر هو العنصر المحايد للجمع. وحوّلنا قبل القسمة حتى لا نفقد الجزء العشري. استخدم `long long` عندما يمكن أن يتجاوز مجموع قيم صحيحة مجال `int` حتى لو كان كل مدخل منفردًا داخل المجال.

## Product Accumulator

```cpp
long long product = 1;

for (int i = 0; i < 5; ++i) {
    int number{};
    std::cin >> number;
    product *= number;
}

std::cout << product;
```

يبدأ الضرب من 1 لأن `1 * x = x`. البدء من صفر يجعل الناتج صفرًا بعد أول عملية مهما كانت المدخلات. ما زال احتمال Overflow قائمًا لأن حاصل الضرب يكبر بسرعة.

## تصنيف القيم أثناء قراءتها

```cpp
int positive = 0;
int negative = 0;
int even = 0;
int odd = 0;

for (int i = 0; i < n; ++i) {
    int number{};
    std::cin >> number;

    if (number > 0) {
        ++positive;
    } else if (number < 0) {
        ++negative;
    }

    if (number % 2 == 0) {
        ++even;
    } else {
        ++odd;
    }
}
```

الصفر ليس موجبًا ولا سالبًا، لكنه عدد زوجي لأن باقي قسمته على 2 يساوي صفرًا. لا نحتاج Array هنا لأننا نستخرج كل الملخصات لحظة وصول الرقم. سنحتاج تخزين القيم إذا أردنا ترتيبها أو طباعتها لاحقًا أو مقارنة كل عنصر بعناصر أخرى.

## أكبر قيمة دون افتراض أن الصفر أكبر

```cpp
int maximum{};

if (!(std::cin >> maximum)) {
    return 1;
}

for (int i = 1; i < 5; ++i) {
    int number{};
    std::cin >> number;

    if (number > maximum) {
        maximum = number;
    }
}

std::cout << maximum;
```

نبدأ بأول قيمة حقيقية ثم نقرأ أربع قيم إضافية. لو بدأنا `maximum = 0` وكانت المدخلات كلها سالبة، سيطبع البرنامج صفرًا رغم أنه لم يظهر في البيانات. عند احتمال عدم وجود أي مدخل استخدم حالة «لا توجد قيمة بعد» بدل افتراض عنصر أول.

## البحث باستخدام Flag أو التوقف المبكر

```cpp
bool found = false;

for (int i = 0; i < 10; ++i) {
    int number{};
    std::cin >> number;

    if (number == 7) {
        found = true;
    }
}

std::cout << std::boolalpha << found;
```

تبقى `found` صحيحة بعد أول تطابق. إذا لم نحتج قراءة بقية القيم يمكن التوقف مبكرًا:

```cpp
if (number == 7) {
    found = true;
    break;
}
```

لكن في مسألة Input منظمة قد تظل بقية القيم جزءًا من البيانات المطلوبة للخطوة التالية؛ لا تستخدم `break` قبل أن تفهم أثر تركها داخل Stream.

## break وcontinue بالتتبّع

```cpp
for (int i = 1; i <= 10; ++i) {
    if (i == 5) {
        break;
    }
    std::cout << i << ' ';
}
// 1 2 3 4
```

عند `i == 5` يخرج `break` من أقرب حلقة، فلا يزور القيم من 6 إلى 10.

```cpp
for (int i = 1; i <= 10; ++i) {
    if (i == 5) {
        continue;
    }
    std::cout << i << ' ';
}
// 1 2 3 4 6 7 8 9 10
```

يتجاوز `continue` بقية جسم الدورة الحالية فقط. في `for` ينتقل إلى التحديث ثم الشرط. في `while` ينتقل إلى الشرط مباشرة، لذلك قد يتجاوز Update مكتوبًا في نهاية الجسم ويسبب Infinite Loop.

## Nested Loops: صفوف وأعمدة

```cpp
for (int row = 1; row <= 3; ++row) {
    for (int column = 1; column <= 4; ++column) {
        std::cout << "* ";
    }
    std::cout << '\n';
}
```

تكمل الحلقة الداخلية أعمدتها الأربعة لكل صف خارجي، فينفذ الطبع 12 مرة. الصيغة نفسها باستخدام `while` تحتاج إعادة تهيئة العمود داخل دورة الصف:

```cpp
int row = 1;

while (row <= 3) {
    int column = 1;

    while (column <= 4) {
        std::cout << "* ";
        ++column;
    }

    std::cout << '\n';
    ++row;
}
```

لو وضعت `column` خارج الحلقة الخارجية ولم تعدها إلى 1، ستنتهي بعد الصف الأول وتفشل بقية الصفوف. ويمكن دمج نوعين مختلفين من الحلقات؛ المهم أن يكون دور كل واحدة واضحًا، مثل `while` لعدد الصفوف الذي تحكمه حالة خارجية و`for` لأعمدة ذات عدد معروف.

## تأكد من فهمك

<div class="lesson-quiz" role="list">
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">01</span><p>متى تختار do-while بدل while؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> عندما يجب تنفيذ الجسم مرة واحدة قبل اختبار الاستمرار، مثل عرض قائمة أو قراءة أول محاولة.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">02</span><p>ما سبب Off-by-one الأكثر شيوعًا؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> عدم الاتفاق على هل الحد مشمول، أو بداية العداد، أو موضع التحديث؛ اكتب أول وآخر قيمة متوقعة قبل الحلقة.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">03</span><p>كيف تحسب متوسط سلسلة تنتهي بـ-1؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> اجمع القيم وعدها دون إدخال -1، ثم اقسم بعد التأكد أن count&gt;0.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">04</span><p>ماذا يحدث لتعقيد حلقتين متداخلتين كل منهما n؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> عادة O(n²)، لكن افحص الحدود الفعلية؛ إذا الداخلية تتناقص أو تتقدم إجمالًا فقد يختلف التحليل.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">05</span><p>ما ناتج حلقة تبدأ من 100 وتنفذ <code>i /= 2</code> ما دام <code>i &gt; 0</code>؟ ولماذا تختفي الكسور؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> تطبع 100، 50، 25، 12، 6، 3، 1. المتغير int، لذلك القسمة الصحيحة تحذف الجزء الكسري؛ بعد 1 تصبح القيمة 0 فتتوقف الحلقة.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">06</span><p>لماذا يبدأ Product Accumulator من 1، ولماذا لا يجوز بدء Maximum من 0 دائمًا؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> الواحد هو العنصر المحايد للضرب، أما الصفر فيصفّر الناتج. والـMaximum يجب أن يبدأ بأول عنصر حقيقي لأن كل المدخلات قد تكون سالبة.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">07</span><p>ما الفرق بين break وcontinue داخل حلقة for، وما الخطر الخاص بـcontinue داخل while؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> break ينهي أقرب حلقة، وcontinue يتجاوز بقية الدورة. في while قد يتجاوز continue تحديث الحالة المكتوب آخر الجسم، فتظل الحالة ثابتة وتصبح الحلقة لا نهائية.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">08</span><p>لماذا يجب إعادة column إلى 1 داخل كل دورة من حلقة الصفوف؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> لأن الحلقة الداخلية تستهلك قيم العمود حتى النهاية في الصف الأول. تهيئته داخل الحلقة الخارجية تنشئ عداد أعمدة جديدًا لكل صف.</div></details>
</section>
</div>
