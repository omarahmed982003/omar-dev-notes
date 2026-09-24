---
title: "15. مسائل الشروط والصيغ"
sidebar:
  order: 15
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
<div class="diagram-node process"><span>الحالات والمعادلات</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>مثال</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node decision"><span>أخطاء شائعة وتصحيحات</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node output"><span>الخلاصة</span></div>
</div>
</div>

## خريطة المسائل والحلول

### 959A Mahmoud and Ehab

الناتج يعتمد على Parity فقط؛ إذا كان `n` زوجيًا يفوز Mahmoud وإلا Ehab. اختبر 1 و2 وقيمة كبيرة. لا تحتاج Loop لأن اللعبة اختُصرت إلى خاصية رياضية.

### 486A Calculating Function

المطلوب مجموع بإشارات متبادلة. اشتق صيغة تعتمد على زوجية `n` بدل الدوران حتى قيمة قد تكون ضخمة. استخدم `long long` لأن النتيجة تتجاوز `int` مع القيود الكبيرة.

### 4A Watermelon

وجود جزأين زوجيين موجبين يتطلب وزنًا زوجيًا وأكبر من 2. الشرط `w % 2 == 0` وحده يقبل 2 خطأً.

### 835A Key Races

احسب زمن كل لاعب مرة واحدة: `s * v + 2 * t`، ثم قارن القيمتين بثلاث نتائج First وSecond وFriendship. لا تكرر الصيغة داخل كل Branch.

### 1173A Nauuo and Votes

النتيجة الموجبة مضمونة إذا بقي `x` أكبر حتى لو ذهبت كل الأصوات المجهولة للطرف الآخر: `x > y + z`. طبّق القاعدة المناظرة للسالب، والتعادل المضمون فقط عندما `z == 0 && x == y`، وإلا فالنتيجة `?`.

### 318A Even Odds

يحتوي الجزء الفردي `(n + 1) / 2` عنصرًا. إذا كان `k` داخله فالقيمة `2*k - 1`، وإلا اطرح حجم الجزء واضرب Offset في 2. يختبر الحد آخر فردي وأول زوجي.

### 459A Pashmak and Garden

قسّم المسألة إلى ضلع رأسي، وضلع أفقي، وقطر صحيح أبعاده المطلقة متساوية، وحالة مستحيلة. هذا مثال على أن Geometry تتحول إلى Cases حصرية.

### مسائل إضافية

- 617A Elephant: Ceiling division لخطوات طولها 5.
- 581A Vasya the Hipster: عدد الأيام المختلفة هو `min(a,b)` ثم تقسم البقايا إلى أزواج.
- 281A Word Capitalization: افحص النص غير الفارغ ثم عدل أول محرف.
- 1A Theatre Square: Ceiling لكل بعد ثم ضرب العددين باستخدام `long long`.

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
</div>
