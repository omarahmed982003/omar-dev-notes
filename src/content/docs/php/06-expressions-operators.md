---
title: 6. التعبيرات والمؤثرات
description: قيم التعبيرات، الأولوية، الحساب والإسناد والمقارنة والمنطق والمصفوفات والتنفيذ والـ Pipe.
sidebar:
  order: 6
---

## التعبير والأولوية

كل ما ينتج قيمة يُعد expression. حتى الإسناد يعيد القيمة المسندة:

```php
$b = $a = 5;
$result = 1 + 5 * 3;   // 16
$grouped = (1 + 5) * 3; // 18
```

الأقواس أفضل من حفظ جدول الأولوية. الفخ الأشهر:

```php
$ok = true && false; // false
$ok = true and false; // ($ok = true) and false، فتبقى true
```

استخدم `&&` و`||` عادة، وضع أقواسًا عندما يختلط أكثر من مؤثر.

## الحساب والزيادة والإسناد

```php
$a = 10 + 2;
$b = 10 - 2;
$c = 10 * 2;
$d = 10 / 4;
$rest = 10 % 3;
$power = 2 ** 3;

$x = 5;
echo $x++; // 5 ثم تصبح 6
echo ++$x; // تصبح 7 ثم تُطبع
```

الإسنادات المختصرة: `+= -= *= /= %= **= .= ??=`.

## المقارنة

- `==` مساواة مع تحويلات؛ `===` قيمة ونوع.
- `!=` و`<>` عدم مساواة، و`!==` عدم تطابق صارم.
- `< > <= >=` للترتيب.
- `<=>` يعيد `-1` أو `0` أو `1`.

```php
$numbers = [30, 10, 20];
usort($numbers, fn (int $a, int $b): int => $a <=> $b);
```

## المؤثرات المنطقية والنصوص والمصفوفات

```php
$allowed = $loggedIn && ($isAdmin || $ownsResource);
$denied = !$allowed;
$title = 'Hello' . ' ' . 'PHP';
$title .= ' 8';
```

```php
$left = ['a' => 1, 'shared' => 'left'];
$right = ['b' => 2, 'shared' => 'right'];
$union = $left + $right;
// a=1, shared=left, b=2
```

مؤثر `+` للمصفوفات **union حسب المفاتيح** ويحتفظ بقيمة اليسار عند تكرار المفتاح؛ ليس بديلًا مطابقًا لـ `array_merge()`. و`==` يقارن أزواج المفتاح/القيمة، أما `===` فيطلب أيضًا النوع والترتيب نفسه.

```php
if ($service instanceof Cacheable) {
    $service->warm();
}
```

إسناد object إلى متغير آخر يجعل المتغيرين يشيران عادة إلى الكائن نفسه؛ استخدم `clone` لنسخة كائن مستقلة، مع الانتباه للكائنات الداخلية.

## Error control والتنفيذ

`@expression` يخفي عرض أخطاء التعبير. تجنبه لأنه يطمس السبب؛ عالج النتيجة، ارمِ exception، وسجّل الخطأ. يمكن تخصيص معالجة بعض الأخطاء بـ `set_error_handler()`.

Backticks تنفذ أمر shell مثل `shell_exec()`:

```php
$output = `whoami`;
```

:::danger
لا تُدخل بيانات المستخدم في backticks أو `exec` أو `system` أو `shell_exec` أو `proc_open`. هذا قد يتحول إلى Remote Code Execution. استخدم API آمنًا، وإذا كان التنفيذ ضروريًا فمرر arguments منفصلة وقيّد الأوامر والصلاحيات.
:::

## Pipe Operator — PHP 8.5+

```php
$slug = ' PHP 8.5 Released '
    |> trim(...)
    |> (fn (string $s) => str_replace(' ', '-', $s))
    |> strtolower(...);
```

يمرر `|>` ناتج اليسار كوسيط وحيد إلى callable في اليمين، فيجعل السلسلة تُقرأ من أعلى لأسفل. هذا المثال **لن يعمل على PHP 8.4 أو أقدم**.

## خريطة الدرس

<div class="lesson-diagram" role="img" aria-label="خريطة مفاهيم: التعبيرات والمؤثرات">
<p class="lesson-diagram-title">خريطة مفاهيم: التعبيرات والمؤثرات</p>
<div class="diagram-flow">
<div class="diagram-node input"><span>التعبير والأولوية</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>الحساب والزيادة والإسناد</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>المقارنة</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node decision"><span>المؤثرات المنطقية والنصوص والمصفوفات</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node output"><span>Error control والتنفيذ</span></div>
</div>
</div>

## تأكد من فهمك

<div class="lesson-quiz" role="list">
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">01</span><p>اشرح «التعبير والأولوية» كأنك تراجع تطبيقًا حقيقيًا: ما الهدف وما أهم قيد يجب الانتباه له؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> كل ما ينتج قيمة يُعد expression. حتى الإسناد يعيد القيمة المسندة: الأقواس أفضل من حفظ جدول الأولوية. الفخ الأشهر: استخدم &amp;&amp; و|| عادة، وضع أقواسًا عندما يختلط أكثر من مؤثر. عمليًا، لا يكفي تنفيذ المسار الناجح؛ يجب توثيق الافتراضات والتحقق من القيم والحالات التي قد تكسر هذا السلوك.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">02</span><p>قارن بين «التعبير والأولوية» و«الحساب والزيادة والإسناد». لماذا لا يغني أحدهما عن الآخر داخل موضوع «التعبيرات والمؤثرات»؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> في «التعبير والأولوية»: كل ما ينتج قيمة يُعد expression. حتى الإسناد يعيد القيمة المسندة: الأقواس أفضل من حفظ جدول الأولوية. الفخ الأشهر: استخدم <code>&amp;&amp;</code> و<code>||</code> عادة، وضع أقواسًا عندما يختلط أكثر من مؤثر. أما «الحساب والزيادة والإسناد»: الإسنادات المختصرة: <code>+= -= *= /= %= = .= ??=</code>. العلاقة بينهما أن الأول يحدد جانبًا من الحل، والثاني يكمل السلوك أو القيود اللازمة لتطبيقه بصورة صحيحة.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">03</span><p>افترض أن نظامًا تجاهل «المقارنة». ما العطل أو الخطر المتوقع، وكيف تصمم اختبارًا يكشفه؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> <code>==</code> مساواة مع تحويلات؛ <code>===</code> قيمة ونوع. <code>!=</code> و<code>&lt;&gt;</code> عدم مساواة، و<code>!==</code> عدم تطابق صارم. <code>&lt;=&gt;</code> للترتيب ويعيد -1 أو 0 أو 1. لاكتشاف الخلل، اختبر مسارًا صحيحًا، وقيمة عند الحد، ومدخلًا غير صالح، ثم راقب النتيجة والآثار الجانبية والسجل بدل الاكتفاء بعدم ظهور Exception.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">04</span><p>حوّل «المؤثرات المنطقية والنصوص والمصفوفات» إلى قرار هندسي قابل للمراجعة. ما الذي ستوثقه وما الحالات التي ستختبرها؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> مؤثر <code>+</code> للمصفوفات union حسب المفاتيح ويحتفظ بقيمة اليسار عند تكرار المفتاح؛ ليس بديلًا مطابقًا لـ array_merge(). و<code>==</code> يقارن أزواج المفتاح/القيمة، أما <code>===</code> فيطلب أيضًا النوع والترتيب نفسه. إسناد object إلى متغير آخر يجعل المتغيرين يشيران عادة إلى الكائن نفسه؛ استخدم clone لنسخة كائن مستقلة، مع الانتباه للكائنات الداخلية. وثّق سبب الاختيار والبدائل والحدود، واختبر الحالة العادية، والحد الأدنى والأقصى، والفشل الجزئي، وإعادة المحاولة أو التكرار إن كان السلوك يسمح بذلك.</div></details>
</section>
</div>
