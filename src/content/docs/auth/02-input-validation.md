---
title: 2. التحقق من المدخلات والفلترة
description: الفرق بين Validation وSanitization واستخدام filter_var وfilter_input وقواعد النطاق.
sidebar:
  order: 2
---

## Validation ليست Sanitization

- **Validation:** هل القيمة تطابق شروطنا؟ لا يفترض أن يغيّرها.
- **Normalization:** توحيد تمثيل مشروع، مثل trim أو تحويل case عند الحاجة.
- **Sanitization:** حذف/تغيير محارف لصنع قيمة أخرى؛ قد يخفي الخطأ ويفسد البيانات.
- **Output Encoding:** تحويل القيمة عند إخراجها لسياق HTML/URL/JS، وليس عند الإدخال.

المسار المقترح:

```text
Parse → Validate shape/type/range → Authorize action → Use safely
                                           ↓
                                  Encode at output sink
```

لا تحاول «تنظيف كل المدخلات» مرة واحدة ثم تعتبرها آمنة لكل مكان.

## filter_var

```php
$email = filter_var($rawEmail, FILTER_VALIDATE_EMAIL);
if ($email === false) {
    throw new InvalidArgumentException('Invalid email');
}

$age = filter_var($rawAge, FILTER_VALIDATE_INT, [
    'options' => ['min_range' => 18, 'max_range' => 120],
]);
if ($age === false) {
    throw new InvalidArgumentException('Age must be 18–120');
}

$ip = filter_var($rawIp, FILTER_VALIDATE_IP);
$url = filter_var($rawUrl, FILTER_VALIDATE_URL);
```

تحقق باستخدام `=== false`؛ القيمة الصحيحة قد تكون `0`. و`FILTER_DEFAULT` يعني `FILTER_UNSAFE_RAW`، فلا يفعل تنظيفًا سحريًا.

## filter_input وfilter_input_array

```php
$page = filter_input(INPUT_GET, 'page', FILTER_VALIDATE_INT, [
    'options' => ['default' => 1, 'min_range' => 1],
]);

$input = filter_input_array(INPUT_POST, [
    'email' => FILTER_VALIDATE_EMAIL,
    'age' => [
        'filter' => FILTER_VALIDATE_INT,
        'options' => ['min_range' => 18, 'max_range' => 120],
    ],
]);
```

`filter_input()` يقرأ المصدر الخارجي الأصلي حسب SAPI، وقد يختلف عن قيمة عدّلتها داخل `$_GET` أو `$_POST`. اختبر بيئة التشغيل.

## قواعد المجال أهم من شكل النوع

بريد صالح نحويًا لا يعني أنه يملك الحساب. وOrder ID صحيح كعدد لا يعني أن المستخدم يملك الطلب.

```php
$orderId = filter_input(INPUT_POST, 'order_id', FILTER_VALIDATE_INT);
if ($orderId === false || $orderId < 1) {
    throw new InvalidArgumentException('Invalid order');
}

$order = $orders->findForUser($orderId, $currentUserId);
if ($order === null) {
    throw new RuntimeException('Not found or forbidden');
}
```

طبّق allow-list للـenums والفرز وأسماء الحقول. لا يمكن حماية SQL أو HTML بمجرد Sanitization عام؛ استخدم Prepared Statements وOutput Encoding.

## خريطة الدرس

<div class="lesson-diagram" role="img" aria-label="خريطة مفاهيم: التحقق من المدخلات والفلترة">
<p class="lesson-diagram-title">خريطة مفاهيم: التحقق من المدخلات والفلترة</p>
<div class="diagram-flow">
<div class="diagram-node input"><span>Validation ليست Sanitization</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>filter_var</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>filter_input وfilter_input_array</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node decision"><span>قواعد المجال أهم من شكل النوع</span></div>
</div>
</div>

## تأكد من فهمك

<div class="lesson-quiz" role="list">
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">01</span><p>اشرح «Validation ليست Sanitization» كأنك تراجع تطبيقًا حقيقيًا: ما الهدف وما أهم قيد يجب الانتباه له؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> Validation: هل القيمة تطابق شروطنا؟ لا يفترض أن يغيّرها. Normalization: توحيد تمثيل مشروع، مثل trim أو تحويل case عند الحاجة. Sanitization: حذف/تغيير محارف لصنع قيمة أخرى؛ قد يخفي الخطأ ويفسد البيانات. Output Encoding: تحويل القيمة عند إخراجها لسياق HTML/URL/JS، وليس عند الإدخال. المسار المقترح: لا تحاول «تنظيف كل المدخلات» مرة واحدة ثم تعتبرها آمنة لكل مكان. عمليًا، لا يكفي تنفيذ المسار الناجح؛ يجب توثيق الافتراضات والتحقق من القيم والحالات التي قد تكسر هذا السلوك.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">02</span><p>قارن بين «Validation ليست Sanitization» و«filter_var». لماذا لا يغني أحدهما عن الآخر داخل موضوع «التحقق من المدخلات والفلترة»؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> في «Validation ليست Sanitization»: Validation: هل القيمة تطابق شروطنا؟ لا يفترض أن يغيّرها. Normalization: توحيد تمثيل مشروع، مثل trim أو تحويل case عند الحاجة. Sanitization: حذف/تغيير محارف لصنع قيمة أخرى؛ قد يخفي الخطأ ويفسد البيانات. Output Encoding: تحويل القيمة عند إخراجها لسياق HTML/URL/JS، وليس عند الإدخال. المسار المقترح: لا تحاول «تنظيف كل المدخلات» مرة واحدة ثم تعتبرها آمنة لكل مكان. أما «filter_var»: تحقق باستخدام === false؛ القيمة الصحيحة قد تكون 0. وFILTER_DEFAULT يعني FILTER_UNSAFE_RAW، فلا يفعل تنظيفًا سحريًا. العلاقة بينهما أن الأول يحدد جانبًا من الحل، والثاني يكمل السلوك أو القيود اللازمة لتطبيقه بصورة صحيحة.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">03</span><p>افترض أن نظامًا تجاهل «filter_input وfilter_input_array». ما العطل أو الخطر المتوقع، وكيف تصمم اختبارًا يكشفه؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> filter_input() يقرأ المصدر الخارجي الأصلي حسب SAPI، وقد يختلف عن قيمة عدّلتها داخل $_GET أو $_POST. اختبر بيئة التشغيل. لاكتشاف الخلل، اختبر مسارًا صحيحًا، وقيمة عند الحد، ومدخلًا غير صالح، ثم راقب النتيجة والآثار الجانبية والسجل بدل الاكتفاء بعدم ظهور Exception.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">04</span><p>حوّل «قواعد المجال أهم من شكل النوع» إلى قرار هندسي قابل للمراجعة. ما الذي ستوثقه وما الحالات التي ستختبرها؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> بريد صالح نحويًا لا يعني أنه يملك الحساب. وOrder ID صحيح كعدد لا يعني أن المستخدم يملك الطلب. طبّق allow-list للـenums والفرز وأسماء الحقول. لا يمكن حماية SQL أو HTML بمجرد Sanitization عام؛ استخدم Prepared Statements وOutput Encoding. وثّق سبب الاختيار والبدائل والحدود، واختبر الحالة العادية، والحد الأدنى والأقصى، والفشل الجزئي، وإعادة المحاولة أو التكرار إن كان السلوك يسمح بذلك.</div></details>
</section>
</div>
