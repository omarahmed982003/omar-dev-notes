---
title: 2. المتغيرات والنطاق وSuperglobals
description: قواعد تسمية المتغيرات، القيمة والمرجع، النطاق، static والمتغيرات الفائقة.
sidebar:
  order: 2
---

## المتغيرات

PHP ديناميكية النوع؛ يبدأ اسم المتغير بـ `$` ثم حرف أو underscore، ويمكن أن تتبعه أرقام. الاسم حساس لحالة الأحرف ولا يبدأ برقم.

```php
$name = 'Omar';
$_count = 3;
$price2 = 19.5;

echo "$name لديه {$price2} جنيه";
echo '$name لا يُستبدل داخل single quotes';
```

استخدم `{$name}` داخل النص المركب. الصيغة `${name}` القديمة داخل النصوص deprecated؛ لا تعتمد عليها.

## الإسناد بالقيمة والمرجع

```php
$a = 10;
$b = $a;  // نسخة من القيمة
$b++;
echo $a;  // 10

$x = 10;
$y =& $x; // الاسمان يشيران إلى الحاوية نفسها
$y++;
echo $x;  // 11
unset($y); // يفك الربط، ولا يحذف $x
```

المرجع ليس pointer يدويًا مثل C. لا تستخدمه إلا عند حاجة واضحة؛ فهو يجعل تتبع التغييرات أصعب.

### المتغيرات المتغيرة

```php
$field = 'email';
$$field = 'omar@example.com';
echo $email;
```

:::caution
المتغيرات المتغيرة موجودة، لكن المصفوفات أو الكائنات أو `match` أوضح وأكثر أمانًا عندما تأتي الأسماء من مدخل المستخدم.
:::

## النطاق

```php
$total = 100;

function addTax(float $rate): float
{
    global $total;
    return $total * (1 + $rate);
}

function addTaxExplicit(float $rate): float
{
    return $GLOBALS['total'] * (1 + $rate);
}
```

المتغير خارج الدالة global، وداخلها local. الأفضل تمرير القيم كوسائط بدل `global` و`$GLOBALS`.

```php
function nextId(): int
{
    static $id = 0;
    return ++$id;
}

echo nextId(); // 1
echo nextId(); // 2
```

المتغير `static` المحلي يُهيّأ مرة ويحفظ قيمته بين استدعاءات الدالة داخل العملية الحالية.

الملف المضمَّن بـ `include` يرث نطاق السطر الذي ضُمّن فيه. وإذا كان التضمين داخل دالة، تكون متغيراته في نطاق الدالة.

## Superglobals

تتاح هذه المصفوفات في كل النطاقات:

| المتغير | الاستخدام |
|---|---|
| `$_GET` | query string |
| `$_POST` | جسم نموذج POST |
| `$_SERVER` | معلومات الطلب والخادم |
| `$_FILES` | الملفات المرفوعة |
| `$_COOKIE` | Cookies القادمة |
| `$_SESSION` | بيانات الجلسة بعد `session_start()` |
| `$GLOBALS` | جدول المتغيرات العامة |

```php
$method = $_SERVER['REQUEST_METHOD'] ?? 'CLI';
$page = filter_input(INPUT_GET, 'page', FILTER_VALIDATE_INT) ?: 1;
$selected = $_GET['check_orders'] ?? []; // ?check_orders[]=10&check_orders[]=20

if (!is_array($selected)) {
    $selected = [];
}
$selected = array_map('intval', $selected);
```

وجود القيمة في Superglobal لا يعني أنها آمنة. تحقّق من النوع والنطاق المسموح، واستخدم escaping عند الإخراج وprepared statements لقاعدة البيانات.

## `eval()`

`eval()` ينفذ نصًا ككود PHP:

```php
$code = 'echo "hello";';
eval($code);
```

:::danger
لا تمرر أي مدخل مستخدم إلى `eval()`. في التطبيقات العادية لا تحتاجها أصلًا؛ استخدم دوالًا أو خرائط callbacks أو classes بدلًا منها.
:::

## خريطة الدرس

<div class="lesson-diagram" role="img" aria-label="خريطة مفاهيم: المتغيرات والنطاق وSuperglobals">
<p class="lesson-diagram-title">خريطة مفاهيم: المتغيرات والنطاق وSuperglobals</p>
<div class="diagram-flow">
<div class="diagram-node input"><span>المتغيرات</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>الإسناد بالقيمة والمرجع</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>النطاق</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node decision"><span>Superglobals</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node output"><span>eval()</span></div>
</div>
</div>

## تأكد من فهمك

<div class="lesson-quiz" role="list">
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">01</span><p>اشرح «المتغيرات» كأنك تراجع تطبيقًا حقيقيًا: ما الهدف وما أهم قيد يجب الانتباه له؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> PHP ديناميكية النوع؛ يبدأ اسم المتغير بـ $ ثم حرف أو underscore، ويمكن أن تتبعه أرقام. الاسم حساس لحالة الأحرف ولا يبدأ برقم. استخدم داخل النص المركب. الصيغة $ القديمة داخل النصوص deprecated؛ لا تعتمد عليها. عمليًا، لا يكفي تنفيذ المسار الناجح؛ يجب توثيق الافتراضات والتحقق من القيم والحالات التي قد تكسر هذا السلوك.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">02</span><p>قارن بين «المتغيرات» و«الإسناد بالقيمة والمرجع». لماذا لا يغني أحدهما عن الآخر داخل موضوع «المتغيرات والنطاق وSuperglobals»؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> في «المتغيرات»: PHP ديناميكية النوع؛ يبدأ اسم المتغير بـ $ ثم حرف أو underscore، ويمكن أن تتبعه أرقام. الاسم حساس لحالة الأحرف ولا يبدأ برقم. استخدم داخل النص المركب. الصيغة $ القديمة داخل النصوص deprecated؛ لا تعتمد عليها. أما «الإسناد بالقيمة والمرجع»: المرجع ليس pointer يدويًا مثل C. لا تستخدمه إلا عند حاجة واضحة؛ فهو يجعل تتبع التغييرات أصعب. المتغيرات المتغيرة :::caution المتغيرات المتغيرة موجودة، لكن المصفوفات أو الكائنات أو match أوضح وأكثر أمانًا عندما تأتي الأسماء من مدخل المستخدم. ::: العلاقة بينهما أن الأول يحدد جانبًا من الحل، والثاني يكمل السلوك أو القيود اللازمة لتطبيقه بصورة صحيحة.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">03</span><p>افترض أن نظامًا تجاهل «النطاق». ما العطل أو الخطر المتوقع، وكيف تصمم اختبارًا يكشفه؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> المتغير خارج الدالة global، وداخلها local. الأفضل تمرير القيم كوسائط بدل global و$GLOBALS. المتغير static المحلي يُهيّأ مرة ويحفظ قيمته بين استدعاءات الدالة داخل العملية الحالية. الملف المضمَّن بـ include يرث نطاق السطر الذي ضُمّن فيه. وإذا كان التضمين داخل دالة، تكون متغيراته في نطاق الدالة. لاكتشاف الخلل، اختبر مسارًا صحيحًا، وقيمة عند الحد، ومدخلًا غير صالح، ثم راقب النتيجة والآثار الجانبية والسجل بدل الاكتفاء بعدم ظهور Exception.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">04</span><p>حوّل «Superglobals» إلى قرار هندسي قابل للمراجعة. ما الذي ستوثقه وما الحالات التي ستختبرها؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> تتاح هذه المصفوفات في كل النطاقات: | المتغير | الاستخدام | |---|---| | $_GET | query string | | $_POST | جسم نموذج POST | | $_SERVER | معلومات الطلب والخادم | | $_FILES | الملفات المرفوعة | | $_COOKIE | Cookies القادمة | | $_SESSION | بيانات الجلسة بعد session_start() | | $GLOBALS | جدول المتغيرات العامة | وجود القيمة في Superglobal لا يعني أنها آمنة. تحقّق من النوع والنطاق المسموح، واستخدم escaping عند الإخراج… وثّق سبب الاختيار والبدائل والحدود، واختبر الحالة العادية، والحد الأدنى والأقصى، والفشل الجزئي، وإعادة المحاولة أو التكرار إن كان السلوك يسمح بذلك.</div></details>
</section>
</div>
