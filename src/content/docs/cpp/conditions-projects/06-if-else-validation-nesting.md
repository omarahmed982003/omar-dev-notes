---
title: "9. if وelse والتحقق والتداخل"
sidebar:
  order: 9
description: "if وelse توجّهان التنفيذ. اكتب الشروط بحيث يقرأها الإنسان كقواعد واضحة، وقلل التعشيق بالتحقق المبكر وتجميع المنطق المتشابه."
tableOfContents: true
---

## قبل ما تبدأ

ذاكر الدرس على 3 خطوات: افهم المشكلة الأول، تابع المثال، وبعدها جرّب الجزء العملي بنفسك. المصطلحات الجديدة الموجودة تحت متشرحة قبل ما ندخل في التفاصيل.

### كلمات جديدة في الدرس

- **Compiler:** المترجم: برنامج يحوّل كود C++ إلى ملف يقدر الكمبيوتر يشغّله.
- **Unicode:** معيار بيعطي الحروف والرموز من لغات مختلفة أرقامًا موحدة.
- **Boolean:** قيمة منطقية لها حالتان فقط: صح أو خطأ.


## كيف تختار if مسار التنفيذ؟

if وelse توجّهان التنفيذ. اكتب الشروط بحيث يقرأها الإنسان كقواعد واضحة، وقلل التعشيق بالتحقق المبكر وتجميع المنطق المتشابه.

## if وelse وelse if

تفحص `if` تعبيرًا في سياق منطقي. المقارنة الصريحة مثل `age >= 18` أوضح من الاعتماد على تحويل رقم إلى `bool`. إذا كانت النتيجة `true` ينفذ جسم `if`، وإذا كانت `false` ينتقل التنفيذ إلى `else` إن وجدت.

استخدم الأقواس المعقوفة حتى مع تعليمة واحدة. عند إضافة تعليمة لاحقًا ستبقى حدود الفرع واضحة. ترتبط `else` بأقرب `if` لم تحصل على `else`، ولذلك تزيل الأقواس أي التباس في الشروط المتداخلة.

سلسلة `else if` تختار أول شرط صحيح فقط. أما عدة تعليمات `if` مستقلة فيمكن أن تنفذ كلها. استخدم السلسلة للتصنيفات الحصرية مثل التقدير، واستخدم الشروط المستقلة عندما يستطيع المستخدم الحصول على أكثر من ميزة.

رتب الحالات غير الصالحة أولًا، ثم الحالات الخاصة، ثم القاعدة العامة. ويتيح Short Circuit فحص الأمان قبل العملية، كما في `denominator != 0 && numerator / denominator > 2`، لأن القسمة لن تنفذ إذا كان المقام صفرًا.

## مثال: تصنيف الدرجة بعد التحقق

```cpp
if (score < 0 || score > 100) {
    std::cout << "Invalid score\n";
} else if (score >= 85) {
    std::cout << "Excellent\n";
} else if (score >= 50) {
    std::cout << "Pass\n";
} else {
    std::cout << "Fail\n";
}
```

## أخطاء شائعة وتصحيحات

- if (x = 5) يسند قيمة بدل المقارنة.
- فاصلة منقوطة بعد if تصنع جسمًا فارغًا.

## من قاعدة العمل إلى شرط

اكتب القاعدة أولًا بلغة واضحة، وحدد متغيراتها وحدودها، ثم حوّلها إلى Boolean expression. قاعدة «يقبل الطلب إذا كانت الكمية موجبة والمخزون كافيًا» تصبح `quantity > 0 && quantity <= stock`.

اختبر كل حد: الكمية صفر، واحد، تساوي المخزون، وتتجاوزه. الأخطاء تظهر غالبًا في الفرق بين `<` و`<=` أو في جمع شرطين بـ`&&` بدل `||`.

## ترتيب القرارات والتحقق المبكر

تحقق من الإدخال غير الصالح أولًا، ثم الحالات الخاصة، ثم القاعدة العامة. هذا يقلل التعشيق ويمنع تنفيذ الحساب على بيانات غير موثوقة.

```cpp
if (age < 0 || age > 120) {
    std::cout << "Invalid age";
} else if (hasDebt) {
    std::cout << "Manual review";
} else if (income >= 30000 && creditScore >= 700) {
    std::cout << "Approved";
} else {
    std::cout << "Rejected";
}
```

استخدم `if` مستقلة عندما يمكن أن تتحقق عدة نتائج معًا، مثل عدّ الرقم موجبًا وزوجيًا. استخدم `else if` عندما يجب اختيار نتيجة واحدة فقط. وللنصوص استخدم مقارنة `std::string`، مع الانتباه إلى حالة الأحرف والمسافات إن كانت القاعدة تتطلب التطبيع.

## Short Circuit وأولوية المنطق

في `denominator != 0 && numerator / denominator > 2` يمنع الشرط الأول القسمة غير الآمنة. تعمل `&&` قبل `||`، لكن الأقواس أفضل عندما تجمع قواعد متعددة لأنها توثق المقصود وتمنع القراءة الخاطئة.

<div class="lesson-diagram" role="img" aria-label="مسار if/else: التحقق أولًا ثم اختيار فرع حصري">
<p class="lesson-diagram-title">مسار if/else: التحقق أولًا ثم اختيار فرع حصري</p>
<div class="diagram-flow diagram-decision">
<div class="diagram-node input"><span>اقرأ القيمة</span></div>
<span class="diagram-arrow" data-label="تحقق" aria-hidden="true">→</span>
<div class="diagram-node decision"><span>هل صالحة؟</span></div>
<span class="diagram-arrow" data-label="نعم" aria-hidden="true">→</span>
<div class="diagram-node decision"><span>أي نطاق يطابق؟</span></div>
<span class="diagram-arrow" data-label="فرع واحد" aria-hidden="true">→</span>
<div class="diagram-node process"><span>نفّذ الفرع</span></div>
<span class="diagram-arrow" data-label="return" aria-hidden="true">→</span>
<div class="diagram-node output"><span>أعد النتيجة</span></div>
</div>
<div class="diagram-branches">
<p class="diagram-branch-label">مسار الرفض وحالة الحدود</p>
<div class="diagram-node danger"><span>غير صالح ← ارفض قبل قواعد العمل</span></div>
<div class="diagram-node output"><span>حد مشترك ← اختبر = صراحة</span></div>
</div>
</div>

## Boolean context والأقواس

يمكن تحويل الصفر إلى `false` وغير الصفر إلى `true`، لكن كتابة المقارنة الصريحة توضح المقصود عندما لا يكون المتغير Boolean أصلًا. استخدم الأقواس حتى لجسم سطر واحد لتجنب أن تنفصل تعليمة جديدة عن الشرط عند التعديل.

## عدة if أم سلسلة واحدة؟

عدة `if` مستقلة مناسبة عندما يمكن للرقم أن يكون موجبًا وزوجيًا معًا. أما تصنيف الدرجة إلى Band واحدة فيحتاج `if/else if/else`. ترتيب الحدود من الأعلى إلى الأقل يمنع شرطًا عامًا مثل `score >= 50` من ابتلاع الحالات الأعلى.

## الشروط المتداخلة

يكون Nesting مناسبًا عندما لا معنى للسؤال الثاني إلا بعد نجاح الأول، مثل فحص Credit score بعد اجتياز العمر. لكن Guard clauses أو دمج شروط واضحة قد يقللان العمق. لا تدمج قواعد مستقلة في تعبير ضخم يصعب اختباره.

## Strings والمدخلات المركبة

تدعم `std::string` المقارنة بـ`==`، لكن `"Admin"` لا يساوي `"admin"`. قرر هل النظام حساس للحالة، ونظف المسافات وفق قاعدة موثقة. لا تحول النص عشوائيًا دون مراعاة Locale وUnicode.

## Guard Clauses وتقليل التداخل

عندما تكون حالة غير صالحة معروفة، عالجها مبكرًا ثم اخرج من الدالة. هذا يحافظ على المسار الصحيح في مستوى تداخل واحد بدل وضع كل خطوة داخل `if` جديدة. لا تستخدم الخروج المبكر عشوائيًا؛ اجعله لحالات واضحة برسائل ونتائج محددة.

## الشروط الحصرية والشروط المستقلة

التقدير الدراسي نتيجة واحدة، ولذلك يناسبه `if/else if/else`. أما الشارات مثل «حضور ممتاز» و«مشروع متميز» فقد تجتمع، ولذلك تحتاج `if` مستقلة. اختيار البناء الخاطئ قد يمنع نتيجة صحيحة حتى لو كانت كل مقارنة منفردة سليمة.

## De Morgan وتبسيط النفي

نفي `(age >= 18 && hasId)` يساوي `(age < 18 || !hasId)`. تساعد قوانين De Morgan في كتابة سبب الرفض مباشرة، لكن لا تحول الشرط إلى صيغة أصعب. سمّ الأجزاء المنطقية عندما يزيد عدد العوامل.

## برنامج كامل: التحقق ثم التصنيف

```cpp
#include <iostream>
int main() {
    int score{};
    std::cout << "Score from 0 to 100: ";
    if (!(std::cin >> score)) { std::cerr << "Score must be an integer\n"; return 1; }
    if (score < 0 || score > 100) std::cout << "Invalid score\n";
    else if (score >= 85) std::cout << "Excellent\n";
    else if (score >= 50) std::cout << "Pass\n";
    else std::cout << "Fail\n";
}
```

اختبر `-1` و`0` و`49` و`50` و`84` و`85` و`100` و`101` ومدخلًا نصيًا. وضع `score >= 50` أولًا يجعل فرع الممتاز غير قابل للوصول.


## مسائل تطبّق على الشروط والصيغ

## خريطة المسائل والحلول

### 959A Mahmoud and Ehab

**المدخل:** عدد صحيح موجب `n`. **المخرج:** اسم الفائز. لا نحتاج محاكاة أدوار اللعبة؛ النتيجة تعتمد على Parity فقط. إذا كان `n` زوجيًا يستطيع Mahmoud فرض الفوز، وإلا يفوز Ehab.

```cpp
#include <iostream>

int main() {
    int n{};
    std::cin >> n;
    std::cout << (n % 2 == 0 ? "Mahmoud" : "Ehab") << '\n';
}
```

عند `n = 6` يكون الباقي صفرًا فتظهر `Mahmoud`. التعقيد `O(1)` والذاكرة `O(1)`. اختبر `1` و`2` وقيمة كبيرة. الخطأ الشائع هو كتابة Loop لمحاكاة لعبة حُسمت بخاصية رياضية.

### 486A Calculating Function

الدالة تجمع `-1 + 2 - 3 + 4 ...`. كل زوج يساوي `1`. إذا كان `n` زوجيًا توجد `n / 2` أزواج. وإذا كان فرديًا نحصل على أزواج حتى `n - 1` ثم نطرح `n`.

```cpp
#include <iostream>

int main() {
    long long n{};
    std::cin >> n;

    const long long answer = (n % 2 == 0)
        ? n / 2
        : -(n + 1) / 2;

    std::cout << answer << '\n';
}
```

لـ`n = 4`: `-1 + 2 - 3 + 4 = 2`. ولـ`n = 5` تصبح النتيجة `-3`. التعقيد `O(1)`. استخدم `long long` لأن القيود أكبر من مجال `int`. الحل البديل بحلقة صحيح للقيم الصغيرة لكنه يفشل زمنيًا مع حد كبير.

### 4A Watermelon

نريد تقسيم الوزن إلى جزأين زوجيين موجبين. لذلك يجب أن يكون الوزن زوجيًا، وأن يكون أكبر من 2 لأن `2 = 0 + 2` لا يعطي جزأين موجبين.

```cpp
#include <iostream>

int main() {
    int weight{};
    std::cin >> weight;

    if (weight > 2 && weight % 2 == 0) {
        std::cout << "YES\n";
    } else {
        std::cout << "NO\n";
    }
}
```

اختبارات الحدود: `2 → NO`، `3 → NO`، `4 → YES`. التعقيد `O(1)`. الخطأ الأشهر هو الاكتفاء بالزوجية فيقبل البرنامج الوزن 2.

### 835A Key Races

زمن كل لاعب يساوي وقت الكتابة `s * v` مضافًا إليه زمن الذهاب والعودة `2 * t`. احسب الزمنين مرة واحدة ثم قارنهما.

```cpp
#include <iostream>

int main() {
    long long s{}, v1{}, v2{}, t1{}, t2{};
    std::cin >> s >> v1 >> v2 >> t1 >> t2;

    const long long first = s * v1 + 2 * t1;
    const long long second = s * v2 + 2 * t2;

    if (first < second) {
        std::cout << "First\n";
    } else if (second < first) {
        std::cout << "Second\n";
    } else {
        std::cout << "Friendship\n";
    }
}
```

مثلًا `s=5, v1=1, v2=2, t1=1, t2=1` يعطي الزمنين 7 و12، فيفوز First. التعقيد `O(1)`. لا تكرر الصيغة داخل كل فرع لأن ذلك يزيد احتمال تعديل نسخة ونسيان الأخرى.

### 1173A Nauuo and Votes

لدينا أصوات موجبة `x` وسالبة `y` ومجهولة `z`. تكون `+` مضمونة إذا ظل `x` أكبر حتى بعد ذهاب كل المجهول إلى الطرف الآخر: `x > y + z`. وتكون `-` مضمونة بالعكس. التعادل مؤكد فقط إذا لم توجد أصوات مجهولة وكان الطرفان متساويين.

```cpp
#include <iostream>

int main() {
    long long x{}, y{}, z{};
    std::cin >> x >> y >> z;

    if (x > y + z) {
        std::cout << "+\n";
    } else if (y > x + z) {
        std::cout << "-\n";
    } else if (z == 0 && x == y) {
        std::cout << "0\n";
    } else {
        std::cout << "?\n";
    }
}
```

اختبر `10 2 3` و`2 10 3` و`5 5 0` و`5 5 1`. التعقيد `O(1)`. الخطأ الشائع هو اعتبار `x > y` كافيًا رغم أن الأصوات المجهولة قد تقلب النتيجة.

### 318A Even Odds

يحتوي الجزء الفردي `(n + 1) / 2` عنصرًا. الموضع الفردي `k` يعطي `2*k - 1`. إذا تجاوز `k` الجزء الفردي، نطرح حجمه ثم نحول الموضع المتبقي إلى العدد الزوجي المقابل.

```cpp
#include <iostream>

int main() {
    long long n{}, k{};
    std::cin >> n >> k;

    const long long oddCount = (n + 1) / 2;
    const long long answer = (k <= oddCount)
        ? 2 * k - 1
        : 2 * (k - oddCount);

    std::cout << answer << '\n';
}
```

لـ`n = 10` يصبح الترتيب `1 3 5 7 9 2 4 6 8 10`. اختبر `k=5` و`k=6` لأنهما نقطة الانتقال. التعقيد `O(1)` بدل بناء التسلسل في `O(n)`.

### 459A Pashmak and Garden

نريد نقطتين تكملان مربعًا موازيًا للمحاور. إذا تشارك المدخلان قيمة `x` فهما ضلع رأسي، وإذا تشاركا `y` فهما ضلع أفقي. وإلا يجب أن يكون الفرق المطلق في المحورين متساويًا ليكونا قطرًا صالحًا.

```cpp
#include <cstdlib>
#include <iostream>

int main() {
    int x1{}, y1{}, x2{}, y2{};
    std::cin >> x1 >> y1 >> x2 >> y2;

    if (x1 == x2 && y1 != y2) {
        const int side = std::abs(y1 - y2);
        std::cout << x1 + side << ' ' << y1 << ' '
                  << x2 + side << ' ' << y2 << '\n';
    } else if (y1 == y2 && x1 != x2) {
        const int side = std::abs(x1 - x2);
        std::cout << x1 << ' ' << y1 + side << ' '
                  << x2 << ' ' << y2 + side << '\n';
    } else if (std::abs(x1 - x2) == std::abs(y1 - y2)) {
        std::cout << x1 << ' ' << y2 << ' '
                  << x2 << ' ' << y1 << '\n';
    } else {
        std::cout << "-1\n";
    }
}
```

اختبر ضلعًا رأسيًا، ضلعًا أفقيًا، قطرًا صحيحًا، نقطتين متطابقتين، ومستطيلًا غير مربع. التعقيد `O(1)`. الخطأ الشائع هو قبول أي قطر دون مقارنة الفرقين المطلقين.

### 617A Elephant

يقطع الفيل من 1 إلى 5 وحدات في الخطوة. أقل عدد خطوات هو القسمة السقفية للمسافة على 5.

```cpp
#include <iostream>

int main() {
    int distance{};
    std::cin >> distance;
    std::cout << (distance + 4) / 5 << '\n';
}
```

للمسافة 12 نحتاج 3 خطوات: `5 + 5 + 2`. اختبر 1 و5 و6. التعقيد `O(1)`. الحلقة التي تطرح 5 صحيحة لكنها أطول وأقل تعبيرًا عن الصيغة.

### 581A Vasya the Hipster

يستخدم جوارب بلونين مختلفين مدة `min(a,b)`. بعد نفاد اللون الأقل، تُستخدم الجوارب المتبقية في أزواج من اللون نفسه.

```cpp
#include <algorithm>
#include <cstdlib>
#include <iostream>

int main() {
    int red{}, blue{};
    std::cin >> red >> blue;

    const int different = std::min(red, blue);
    const int same = std::abs(red - blue) / 2;
    std::cout << different << ' ' << same << '\n';
}
```

لـ`3 7` توجد 3 أيام مختلفة ثم يومان من اللون المتبقي. التعقيد `O(1)`. لا تجمع اللونين ثم تقسم؛ الأيام المختلفة تستهلك جوربًا من كل لون معًا.

### 281A Word Capitalization

المطلوب تغيير الحرف الأول فقط إلى Uppercase. تحقّق من أن النص غير فارغ، ومرر قيمة `unsigned char` إلى دوال `<cctype>` لتجنب سلوك غير معرّف مع القيم السالبة لـ`char`.

```cpp
#include <cctype>
#include <iostream>
#include <string>

int main() {
    std::string word;
    std::cin >> word;

    if (!word.empty()) {
        const auto first = static_cast<unsigned char>(word.front());
        word.front() = static_cast<char>(std::toupper(first));
    }

    std::cout << word << '\n';
}
```

`hello` تصبح `Hello`، و`World` تبقى كما هي. التعقيد `O(1)` بالنسبة للعمل المطلوب بعد القراءة. المثال يتعامل مع محارف المسألة اللاتينية؛ لا يمثل حلًا عامًا لتحويل Unicode.

### 1A Theatre Square

نحسب عدد البلاطات على كل بُعد بقسمة سقفية، ثم نضرب العددين. يجب توسيع الحساب لأن الناتج قد يتجاوز `int`.

```cpp
#include <iostream>

int main() {
    long long n{}, m{}, a{};
    std::cin >> n >> m >> a;

    const long long rows = (n + a - 1) / a;
    const long long columns = (m + a - 1) / a;
    std::cout << rows * columns << '\n';
}
```

لساحة `6 × 6` وبلاطة ضلعها 4 نحتاج `2 × 2 = 4` بلاطات. التعقيد `O(1)`. الخطأ الشائع هو استخدام القسمة الصحيحة مباشرة أو تخزين حاصل الضرب في `int`.

لكل مسألة اكتب القيود والتعقيد وحالة حدية قبل الكود. الحل القصير لا يعفيك من شرح سبب الصيغة.

## تأكد من فهمك

<div class="lesson-quiz" role="list">
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">01</span><p>لماذا يجب ترتيب score&gt;=85 قبل score&gt;=50؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> لأن else-if تتوقف عند أول شرط صحيح؛ وضع &gt;=50 أولًا يلتقط درجات الممتاز ويجعل الفرع الخاص غير قابل للوصول.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">02</span><p>ما أثر if(x=5)؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> يسند 5 إلى x ثم تتحول القيمة غير الصفرية إلى true؛ استخدم <code>==</code> وفعّل تحذيرات المترجم.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">03</span><p>متى تستخدم if مستقلة بدل else-if؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> عندما يمكن أن تتحقق نتائج متعددة في الوقت نفسه، مثل منح أكثر من Badge؛ else-if للحالات الحصرية.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">04</span><p>كيف تقلل Nested if في التحقق؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> استخدم Guard clauses لرفض المدخل غير الصالح مبكرًا، ثم اترك المسار الرئيسي أقل تعشيقًا.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">05</span><p>لديك الفروع <code>score &gt;= 50</code> ثم <code>score &gt;= 85</code>. لماذا لن يصل البرنامج إلى تقدير ممتاز؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> لأن درجة 85 تحقق الفرع الأول في سلسلة else-if ويتوقف الاختيار. رتب الحدود من الأكثر تحديدًا والأعلى إلى الأقل: 85 ثم 50 ثم الباقي.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">06</span><p>صحح <code>if (age = 18)</code> واذكر وسيلة تمنع مرور الخطأ بصمت.</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> استخدم <code>if (age == 18)</code>. فعّل تحذيرات المترجم مثل <code>-Wall -Wextra -Werror</code> واكتب اختبارين لقيمتي 17 و18.</div></details>
</section>
</div>

## اربط النقاط ببعض

بعد إتقان الأمثلة اليدوية، أضف property-based checks للحواف: الناتج يجب أن يبقى داخل النطاق، والقيمة الأكبر لا تنتقل إلى تصنيف أقل دون قاعدة صريحة. استخدم compiler warnings لكشف الشروط الثابتة أو الفروع غير القابلة للوصول.

### جرّب بنفسك

ولّد قيمًا حول كل حد وتأكد من عدم وجود gap أو overlap غير مقصود.
