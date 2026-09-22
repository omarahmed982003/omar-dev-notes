---
title: 13. النصوص وUnicode وRegular Expressions
description: Bytes وUTF-8 وmbstring والتطبيع والمقارنة والـRegex الآمن في PHP.
sidebar:
  order: 13
---

## String في PHP

PHP string سلسلة bytes، وليست قائمة Unicode code points. لذلك:

```php
$text = 'مرحبًا';
echo strlen($text);                 // bytes
echo mb_strlen($text, 'UTF-8');     // characters تقريبًا
```

استخدم UTF-8 عبر التطبيق وقاعدة البيانات وHTTP:

```php
header('Content-Type: text/html; charset=utf-8');
```

`mb_strlen` و`mb_substr` و`mb_strtolower` أنسب للنص متعدد اللغات من نسخ byte-oriented.

## Graphemes والتطبيع

الحرف المرئي قد يتكون من أكثر من code point. امتداد `intl` يوفر أدوات grapheme و`Normalizer`:

```php
$normalized = Normalizer::normalize($input, Normalizer::FORM_C);
```

طبّع عند الحاجة الواضحة مثل البحث أو uniqueness، ولا تغيّر النص الأصلي بلا متطلب. Case folding والقواعد اللغوية أعقد من `strtolower`.

## Formatting آمن

- استخدم interpolation أو `sprintf` للعرض، لا لبناء SQL.
- قارن secrets بـ`hash_equals()` لا `===` عند الحاجة لمقارنة ثابتة الزمن.
- استخدم `htmlspecialchars` عند إخراج نص في HTML، و`rawurlencode` لمعامل URL.
- لا توجد “دالة تعقيم عامة” لكل السياقات.

## Regular Expressions

```php
$ok = preg_match('/\A[A-Z]{2}-\d{6}\z/D', $code) === 1;
```

- استخدم anchors واضحة.
- افحص `preg_last_error_msg()` عند الفشل.
- ضع حدودًا لطول input قبل regex معقدة.
- تجنب backtracking كارثي في patterns على نص غير موثوق.
- لا تستخدم regex لتحليل HTML أو JSON عندما يوجد parser.

## مثال استخراج

```php
if (preg_match('/\A(?<country>[A-Z]{2})-(?<number>\d{6})\z/D', $code, $m)) {
    $country = $m['country'];
    $number = $m['number'];
}
```

بعد مطابقة الشكل طبّق قواعد المجال؛ الشكل الصحيح لا يعني أن القيمة مسموحة.

## خريطة الدرس

<div class="lesson-diagram" role="img" aria-label="خريطة مفاهيم: النصوص وUnicode وRegular Expressions">
<p class="lesson-diagram-title">خريطة مفاهيم: النصوص وUnicode وRegular Expressions</p>
<div class="diagram-flow">
<div class="diagram-node input"><span>String في PHP</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>Graphemes والتطبيع</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>Formatting آمن</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node decision"><span>Regular Expressions</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node output"><span>مثال استخراج</span></div>
</div>
</div>

## تأكد من فهمك

<div class="lesson-quiz" role="list">
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">01</span><p>اشرح «String في PHP» كأنك تراجع تطبيقًا حقيقيًا: ما الهدف وما أهم قيد يجب الانتباه له؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> PHP string سلسلة bytes، وليست قائمة Unicode code points. لذلك: استخدم UTF-8 عبر التطبيق وقاعدة البيانات وHTTP: mb_strlen وmb_substr وmb_strtolower أنسب للنص متعدد اللغات من نسخ byte-oriented. عمليًا، لا يكفي تنفيذ المسار الناجح؛ يجب توثيق الافتراضات والتحقق من القيم والحالات التي قد تكسر هذا السلوك.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">02</span><p>قارن بين «String في PHP» و«Graphemes والتطبيع». لماذا لا يغني أحدهما عن الآخر داخل موضوع «النصوص وUnicode وRegular Expressions»؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> في «String في PHP»: PHP string سلسلة bytes، وليست قائمة Unicode code points. لذلك: استخدم UTF-8 عبر التطبيق وقاعدة البيانات وHTTP: mb_strlen وmb_substr وmb_strtolower أنسب للنص متعدد اللغات من نسخ byte-oriented. أما «Graphemes والتطبيع»: الحرف المرئي قد يتكون من أكثر من code point. امتداد intl يوفر أدوات grapheme وNormalizer: طبّع عند الحاجة الواضحة مثل البحث أو uniqueness، ولا تغيّر النص الأصلي بلا متطلب. Case folding والقواعد اللغوية أعقد من strtolower. العلاقة بينهما أن الأول يحدد جانبًا من الحل، والثاني يكمل السلوك أو القيود اللازمة لتطبيقه بصورة صحيحة.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">03</span><p>افترض أن نظامًا تجاهل «Formatting آمن». ما العطل أو الخطر المتوقع، وكيف تصمم اختبارًا يكشفه؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> استخدم interpolation أو sprintf للعرض، لا لبناء SQL. قارن secrets بـhash_equals() لا === عند الحاجة لمقارنة ثابتة الزمن. استخدم htmlspecialchars عند إخراج نص في HTML، وrawurlencode لمعامل URL. لا توجد “دالة تعقيم عامة” لكل السياقات. لاكتشاف الخلل، اختبر مسارًا صحيحًا، وقيمة عند الحد، ومدخلًا غير صالح، ثم راقب النتيجة والآثار الجانبية والسجل بدل الاكتفاء بعدم ظهور Exception.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">04</span><p>حوّل «Regular Expressions» إلى قرار هندسي قابل للمراجعة. ما الذي ستوثقه وما الحالات التي ستختبرها؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> استخدم anchors واضحة. افحص preg_last_error_msg() عند الفشل. ضع حدودًا لطول input قبل regex معقدة. تجنب backtracking كارثي في patterns على نص غير موثوق. لا تستخدم regex لتحليل HTML أو JSON عندما يوجد parser. وثّق سبب الاختيار والبدائل والحدود، واختبر الحالة العادية، والحد الأدنى والأقصى، والفشل الجزئي، وإعادة المحاولة أو التكرار إن كان السلوك يسمح بذلك.</div></details>
</section>
</div>
