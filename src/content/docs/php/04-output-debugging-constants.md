---
title: 4. الإخراج والتصحيح والثوابت
description: echo وprint وأدوات فحص القيم والثوابت العادية والسحرية والمسبقة.
sidebar:
  order: 4
---

## echo وprint

كلاهما language construct وليس دالة عادية.

| الخاصية | `echo` | `print` |
|---|---|---|
| القيمة المرجعة | لا شيء | دائمًا `1` |
| عدد الوسائط | يقبل عدة وسائط بلا أقواس | وسيط واحد |
| داخل expression | لا | نعم، بسبب القيمة المرجعة |
| الاختصار | `<?= ... ?>` | لا يوجد |

```php
echo 'Hello', ' ', 'PHP', PHP_EOL;
$result = print 'Printed';
var_dump($result); // int(1)
```

فرق السرعة غير مهم عمليًا؛ اختر `echo` عادة، ولا تطبع مدخل مستخدم داخل HTML دون `htmlspecialchars`.

## أدوات التصحيح

```php
$user = ['id' => 7, 'active' => true];

var_dump($user);            // النوع والقيمة والتفاصيل
print_r($user);             // عرض أسهل للقراءة
$text = print_r($user, true); // أعد العرض كنص
echo get_debug_type($user); // array
```

في أطر العمل قد تجد `dump()` و`dd()`؛ الثانية تطبع ثم توقف التنفيذ. لا تترك بيانات حساسة أو debugging في الإنتاج. استخدم logger وبيئة تطوير منفصلة.

## الثوابت

```php
const APP_NAME = 'Omar Notes';
define('APP_VERSION', '1.0.0');

echo APP_NAME;
```

الثابت لا يبدأ بـ `$`، وهو متاح عالميًا. الفرق الدقيق:

- `define()` استدعاء وقت التشغيل، لذلك يمكن وضعه داخل شرط؛ ينشئ constant عامة.
- `const` تصريح لغوي وله قيود موضعية، ويمكن استخدامه لتعريف class constants.
- لا يمكن استخدام `define()` لتعريف class constant.
- لا تضع `const` داخل function أو block شرطي.

```php
class HttpStatus
{
    public const OK = 200;
    public const NOT_FOUND = 404;
}
```

## Magic وPredefined constants

```php
echo __LINE__;
echo __FILE__;
echo __DIR__;
echo __FUNCTION__;
echo __CLASS__;

echo PHP_VERSION;
echo PHP_OS_FAMILY;
echo PHP_EOL;
```

تتغير Magic constants حسب مكانها في المصدر. `__DIR__` مهم لبناء مسارات ثابتة لا تعتمد على working directory:

```php
$config = require __DIR__ . '/../config/app.php';
```

## خريطة الدرس

<div class="lesson-diagram" role="img" aria-label="خريطة مفاهيم: الإخراج والتصحيح والثوابت">
<p class="lesson-diagram-title">خريطة مفاهيم: الإخراج والتصحيح والثوابت</p>
<div class="diagram-flow">
<div class="diagram-node input"><span>echo وprint</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>أدوات التصحيح</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>الثوابت</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node decision"><span>Magic وPredefined constants</span></div>
</div>
</div>

## تأكد من فهمك

<div class="lesson-quiz" role="list">
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">01</span><p>اشرح «echo وprint» كأنك تراجع تطبيقًا حقيقيًا: ما الهدف وما أهم قيد يجب الانتباه له؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> كلاهما language construct وليس دالة عادية. | الخاصية | echo | print | |---|---|---| | القيمة المرجعة | لا شيء | دائمًا 1 | | عدد الوسائط | يقبل عدة وسائط بلا أقواس | وسيط واحد | | داخل expression | لا | نعم، بسبب القيمة المرجعة | | الاختصار | | لا يوجد | فرق السرعة غير مهم عمليًا؛ اختر echo عادة، ولا تطبع مدخل مستخدم داخل HTML دون htmlspecialchars. عمليًا، لا يكفي تنفيذ المسار الناجح؛ يجب توثيق الافتراضات والتحقق من القيم والحالات التي قد تكسر هذا السلوك.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">02</span><p>قارن بين «echo وprint» و«أدوات التصحيح». لماذا لا يغني أحدهما عن الآخر داخل موضوع «الإخراج والتصحيح والثوابت»؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> في «echo وprint»: كلاهما language construct وليس دالة عادية. | الخاصية | echo | print | |---|---|---| | القيمة المرجعة | لا شيء | دائمًا 1 | | عدد الوسائط | يقبل عدة وسائط بلا أقواس | وسيط واحد | | داخل expression | لا | نعم، بسبب القيمة المرجعة | | الاختصار | | لا يوجد | فرق السرعة غير مهم عمليًا؛ اختر echo عادة، ولا تطبع مدخل مستخدم داخل HTML دون htmlspecialchars. أما «أدوات التصحيح»: في أطر العمل قد تجد dump() وdd()؛ الثانية تطبع ثم توقف التنفيذ. لا تترك بيانات حساسة أو debugging في الإنتاج. استخدم logger وبيئة تطوير منفصلة. العلاقة بينهما أن الأول يحدد جانبًا من الحل، والثاني يكمل السلوك أو القيود اللازمة لتطبيقه بصورة صحيحة.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">03</span><p>افترض أن نظامًا تجاهل «الثوابت». ما العطل أو الخطر المتوقع، وكيف تصمم اختبارًا يكشفه؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> الثابت لا يبدأ بـ $، وهو متاح عالميًا. الفرق الدقيق: define() استدعاء وقت التشغيل، لذلك يمكن وضعه داخل شرط؛ ينشئ constant عامة. const تصريح لغوي وله قيود موضعية، ويمكن استخدامه لتعريف class constants. لا يمكن استخدام define() لتعريف class constant. لا تضع const داخل function أو block شرطي. لاكتشاف الخلل، اختبر مسارًا صحيحًا، وقيمة عند الحد، ومدخلًا غير صالح، ثم راقب النتيجة والآثار الجانبية والسجل بدل الاكتفاء بعدم ظهور Exception.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">04</span><p>حوّل «Magic وPredefined constants» إلى قرار هندسي قابل للمراجعة. ما الذي ستوثقه وما الحالات التي ستختبرها؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> تتغير Magic constants حسب مكانها في المصدر. __DIR__ مهم لبناء مسارات ثابتة لا تعتمد على working directory: وثّق سبب الاختيار والبدائل والحدود، واختبر الحالة العادية، والحد الأدنى والأقصى، والفشل الجزئي، وإعادة المحاولة أو التكرار إن كان السلوك يسمح بذلك.</div></details>
</section>
</div>
