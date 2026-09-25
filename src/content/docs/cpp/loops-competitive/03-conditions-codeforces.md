---
title: "14. مسائل الشروط والصيغ"
sidebar:
  order: 14
description: "مسائل الشروط تدربك على تحويل نص قصصي إلى معادلات وحالات حصرية. الصعوبة غالبًا في فهم الحدود، لا في كتابة if نفسها."
tableOfContents: true
---

## تحويل نص المسألة إلى حالات ومعادلات

مسائل الشروط تدربك على تحويل نص قصصي إلى معادلات وحالات حصرية. الصعوبة غالبًا في فهم الحدود، لا في كتابة if نفسها.

## الحدود والحالات والحل الرياضي

عرّف كل رمز قبل كتابة الشرط. إذا كان `n` طول تسلسل و`k` موضعًا، فحدد هل يبدأ الموضع من واحد أم من صفر، وما أصغر وأكبر قيمة ممكنة. بعد ذلك قسّم الحل إلى حالات لا تتداخل، أو اكتب ترتيبًا واضحًا عندما تستطيع أكثر من قاعدة الانطباق.

لا تحاكِ عملية طويلة إذا كانت هناك صيغة مباشرة. في مجموع متناوب، يمكن جمع كل زوج بدل الدوران حتى `n`. وفي القسمة السقفية للأعداد الموجبة يمكن استخدام `(value + step - 1) / step`. الحل الرياضي يقلل الزمن ويجعل حدود الحالات أوضح.

اختر النوع بناءً على أكبر عملية وسيطة. قد يدخل كل رقم داخل `int` لكن حاصل ضرب رقمين يتجاوزه، ولذلك تستخدم مسائل كثيرة `long long`. لا تستخدم `double` عندما تحتاج نتيجة صحيحة دقيقة.

في `Even Odds` توضع الأعداد الفردية أولًا ثم الزوجية. عدد الأعداد الفردية حتى `n` هو `(n + 1) / 2`. إذا وقع `k` في هذا النصف فالقيمة `2*k - 1`، وإلا نطرح حجم النصف الأول ثم نحول الموضع المتبقي إلى عدد زوجي.

## مثال: اشتقاق Even Odds

```cpp
long long oddCount = (n + 1) / 2;
long long answer = (k <= oddCount)
    ? 2 * k - 1
    : 2 * (k - oddCount);
```

## أخطاء شائعة وتصحيحات

- انتبه هل k فهرس يبدأ من 1 أم 0.
- لا تستخدم double لحساب يحتاج دقة صحيحة كاملة.

## خريطة الدرس

<div class="lesson-diagram" role="img" aria-label="خريطة مفاهيم: الشروط وتمارين Codeforces">
<p class="lesson-diagram-title">خريطة مفاهيم: الشروط وتمارين Codeforces</p>
<div class="diagram-flow">
<div class="diagram-node input"><span>المعطيات والقيود</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>حالات حصرية</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>اشتقاق الصيغة</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node decision"><span>اختبارات الحدود</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node output"><span>كود كامل بتعقيد O(1)</span></div>
</div>
</div>

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

## استخراج الصيغة من القيود

إذا سمحت القيود بقيمة `n` تصل إلى `10^18` فلن تنجح حلقة حتى `n`، ويصبح وجود صيغة `O(1)` أو خوارزمية لوغاريتمية ضرورة. وإذا كان الناتج حاصل ضرب بعدين كبيرين، استخدم `long long` قبل الضرب لا بعده.

## اختبار الانتقال بين الحالات

أهم الاختبارات تقع عند النقطة التي يغير عندها البرنامج الفرع. في Even Odds اختبر آخر موضع فردي وأول موضع زوجي. وفي Watermelon اختبر `2` و`3` و`4`. وفي قسمة سقفية اختبر عددًا يقبل القسمة تمامًا وعددًا يزيد عنه بواحد.

لا تحفظ كود الحل. اكتب سبب كل حالة والمعادلة التي تربط الموضع بالقيمة. إذا عجزت عن شرحها على مثال صغير، فلن يكشف لك الـCompiler الخطأ الرياضي.

## تأكد من فهمك

<div class="lesson-quiz" role="list">
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">01</span><p>اشتق صيغة الجزء الفردي في Even Odds.</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> عدد الفرديات حتى n هو (n+1)/2. إذا k داخله فالقيمة ذات الموضع k هي 2k-1.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">02</span><p>لماذا نستخدم long long في مسائل تبدو مدخلاتها int؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> قد يكون كل مدخل داخل int لكن ضربها أو جمعها يتجاوز المجال؛ نوع التعبير الوسيط هو المهم.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">03</span><p>كيف تعرف أن الحل الرياضي أفضل من المحاكاة؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> إذا أمكن حساب الموضع أو المجموع بصيغة ثابتة، تصبح O(1) بدل تكرار قد يتجاوز الزمن.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">04</span><p>ما اختبار حدّي يكشف خطأ 0-based/1-based؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> اختبر k=1، وآخر موضع في الجزء الأول، وأول موضع في الجزء الثاني، وk=n.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">05</span><p>لماذا الشرط <code>w % 2 == 0</code> وحده لا يحل Watermelon؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> لأن 2 زوجي لكنه لا ينقسم إلى عددين زوجيين موجبين. الشرط الكامل هو <code>w &gt; 2 &amp;&amp; w % 2 == 0</code>.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">06</span><p>في Even Odds، ما آخر موضع فردي وما أول موضع زوجي عندما <code>n = 7</code>؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> عدد الفرديات <code>(7 + 1) / 2 = 4</code>؛ الموضع 4 يحمل 7، والموضع 5 هو أول الزوجيات ويحمل 2.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">07</span><p>لماذا تحتاج Theatre Square إلى <code>long long</code> حتى لو كان كل بُعد يقبل int؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> لأن حاصل ضرب عددي البلاطات على المحورين قد يتجاوز int. يجب أن تكون القيم الوسيطة والضرب من النوع الواسع، لا المتغير النهائي فقط.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">08</span><p>ما الحالات الهندسية الثلاث التي يجب فصلها في Pashmak and Garden؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> ضلع رأسي، ضلع أفقي، أو قطر مائل 45 درجة حيث <code>abs(dx) == abs(dy)</code>. أي حالة مائلة أخرى مستحيلة.</div></details>
</section>
</div>
