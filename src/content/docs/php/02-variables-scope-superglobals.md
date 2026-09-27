---
title: 2. المتغيرات والنطاق وSuperglobals
description: شرح من الصفر للمتغيرات والإسناد بالقيمة والمرجع والنطاق، وإزاي بيانات الطلب بتوصل للبرنامج عن طريق Superglobals.
sidebar:
  order: 2
---

## قبل ما تبدأ

ذاكر الدرس على 3 خطوات: افهم المشكلة الأول، تابع المثال، وبعدها جرّب الجزء العملي بنفسك. المصطلحات الجديدة الموجودة تحت متشرحة قبل ما ندخل في التفاصيل.

### كلمات جديدة في الدرس

- **HTTP:** قواعد تبادل الطلبات والردود بين المتصفح والخادم.
- **Cache:** نسخة مؤقتة من البيانات هدفها تقليل وقت الانتظار والعمل المتكرر.
- **Session:** بيانات مؤقتة تساعد الخادم يميّز المستخدم بين أكثر من طلب.
- **UTF-8:** طريقة شائعة لتحويل أرقام Unicode إلى بايتات تُحفظ وتُنقل.
- **Scope:** النطاق: المكان اللي يقدر الكود داخله يشوف اسمًا أو متغيرًا.
- **Function:** دالة: جزء كود له اسم ومهمة محددة ويمكن استدعاؤه أكثر من مرة.


## ليه بنحتاج متغيرات؟

البرنامج بيتعامل مع قيم بتتغير: اسم المستخدم، سعر المنتج، عدد القطع، أو نتيجة حساب. بدل ما نكرر القيمة في كل مكان، بنديها اسمًا واضحًا ونخزنها في **متغير**.

فكّر في المتغير كاسم بنستخدمه علشان نوصل لقيمة أثناء تشغيل البرنامج. التشبيه بالصندوق مفيد في البداية، لكن خلي بالك إن طريقة التخزين الحقيقية تعتمد على نوع القيمة وإدارة الذاكرة داخل PHP.

```php
<?php

$productName = 'Keyboard';
$priceCents = 150000;
$inStock = true;

echo $productName, PHP_EOL;
echo $priceCents, PHP_EOL;
```

الجزء `$` بيقول لـPHP إن ده اسم متغير. علامة `=` هنا مش معناها «يساوي» في الرياضيات؛ معناها **خد القيمة اللي على اليمين واسندها للاسم اللي على الشمال**.

## قواعد تسمية المتغير

بعد `$` لازم الاسم يبدأ بحرف أو underscore، وبعد كده ممكن يحتوي أرقامًا:

```php
$name = 'Omar';       // صحيح
$_count = 3;          // صحيح
$price2 = 19.5;       // صحيح
// $2price = 19.5;    // خطأ: بدأ برقم
```

الأسماء Case-sensitive:

```php
$userName = 'Omar';
$username = 'Ali';

echo $userName; // Omar
echo $username; // Ali
```

اختار اسمًا يشرح المعنى. `$priceCents` أوضح من `$p`، و`$isEmailVerified` أوضح من `$flag`. الاسم الطويل المعقول أرخص من وقت تضيعُه وأنت بتحاول تفهم الكود بعد شهر.

## المتغير بيأخذ نوعه من القيمة

PHP لغة Dynamically Typed، يعني مش لازم تكتب نوع المتغير وقت إنشائه:

```php
$value = 10;       // int
$value = 'ten';    // string بعد الإسناد الجديد
```

ده مش معناه إن PHP «من غير أنواع». كل قيمة لها نوع، وPHP بتطبّق قواعد تحويل ومقارنة حسب النوع. هنشرح الأنواع بالتفصيل في الدرس التالي، وبعدها هنستخدم Type Declarations علشان نخلي حدود الدوال أوضح.

تقدر تشوف النوع والقيمة أثناء التعلم أو التصحيح:

```php
$price = 19.5;

var_dump($price);             // float(19.5)
echo get_debug_type($price);  // float
```

## طباعة المتغير داخل النص

الـDouble Quotes تسمح باستبدال المتغير، أما Single Quotes فتعرض النص كما هو في أغلب الحالات:

```php
$name = 'Omar';
$price = 20;

echo "Hello {$name}, the price is {$price} pounds.", PHP_EOL;
echo 'Hello $name', PHP_EOL;
```

الناتج:

```text
Hello Omar, the price is 20 pounds.
Hello $name
```

استخدام `{$name}` بيحدد بداية الاسم ونهايته بوضوح. الصيغة القديمة `${name}` داخل النصوص Deprecated، فما تعتمدش عليها.

## الإسناد بالقيمة

شوف المثال ده وتوقع الناتج قبل ما تشغله:

```php
$a = 10;
$b = $a;
$b++;

echo $a, PHP_EOL;
echo $b, PHP_EOL;
```

الناتج:

```text
10
11
```

وقت `$b = $a` أخذت `$b` قيمة مستقلة منطقيًا. تعديل `$b` بعد كده لم يغير `$a`.

بالنسبة للمصفوفات والنصوص، PHP تستخدم داخليًا تحسينًا اسمه **Copy-on-write**: مش لازم تنسخ كل البايتات فورًا، لكنها تتصرف قدامك كأن القيم مستقلة، وتعمل النسخة الفعلية عند التعديل. المهم كمبرمج مبتدئ هو السلوك، مش تفاصيل التحسين.

## الإسناد بالمرجع

علامة `&` تخلي اسمين مرتبطين بنفس الحاوية المنطقية:

```php
$score = 10;
$alias =& $score;

$alias++;

echo $score; // 11
```

لما عدّلنا `$alias` اتغيرت `$score` لأنها مرتبطة بها بالمرجع.

```php
unset($alias);
echo $score; // ما زالت 11
```

`unset($alias)` فك الاسم `$alias`، لكنه ما حذفش القيمة من `$score`.

المرجع في PHP مش Pointer يدوي زي C، ومش محتاج تستخدمه في أغلب الكود. استخدامه من غير داعي يخلي السؤال «مين غيّر القيمة؟» أصعب جدًا. ابدأ بالإسناد العادي، واستخدم المرجع فقط لما تكون فاهم السبب والسلوك.

## الكائنات لها سلوك مختلف

عند إسناد Object لمتغير آخر، المتغيران يشيران عادة إلى نفس الكائن:

```php
$first = new stdClass();
$first->name = 'Omar';

$second = $first;
$second->name = 'Ali';

echo $first->name; // Ali
```

لو محتاج كائنًا منفصلًا تستخدم `clone`، وتفاصيل النسخ العميق والسطحي هتيجي في مسار OOP.

## المتغيرات المتغيرة

PHP تقدر تستخدم قيمة متغير كاسم لمتغير آخر:

```php
$field = 'email';
$$field = 'omar@example.com';

echo $email;
```

ده معناه إن `$$field` تحولت إلى `$email`. الميزة موجودة، لكن غالبًا المصفوفة أو الكائن أوضح:

```php
$user = [
    'email' => 'omar@example.com',
];

echo $user['email'];
```

ماتستخدمش مدخل المستخدم مباشرة كاسم متغير؛ ده يصعب التحقق والتتبع وقد يغير بيانات ماكنتش ناوي تسمح بتغييرها.

## يعني إيه Scope؟

**Scope أو النطاق** هو المكان اللي يقدر الكود يشوف فيه اسم المتغير. المتغير المكتوب خارج الدوال في نطاق الملف، والمتغير اللي يتعمل داخل دالة يكون Local للدالة.

```php
$taxRate = 0.14;

function showLocalScope(): void
{
    $message = 'I exist inside this function';
    echo $message;

    // echo $taxRate; // غير متاح تلقائيًا هنا
}

showLocalScope();
// echo $message; // غير متاح خارج الدالة
```

وجود نطاقات منفصلة بيقلل التصادم والتغييرات المفاجئة. الدالة الأفضل تستقبل اللي تحتاجه صراحة:

```php
function priceWithTax(int $priceCents, float $taxRate): int
{
    return (int) round($priceCents * (1 + $taxRate));
}

echo priceWithTax(10000, 0.14); // 11400
```

دلوقتي الدالة واضحة وسهل اختبارها: نفس المدخلات تعطي نفس النتيجة.

## `global` و`$GLOBALS`

PHP تسمح للدالة توصل لمتغير خارجي، لكن الأفضل تتجنب ده في أغلب الحالات:

```php
$total = 100;

function addTaxUsingGlobal(float $rate): float
{
    global $total;
    return $total * (1 + $rate);
}
```

وتقدر توصل لنفس القيمة عن طريق:

```php
function addTaxUsingGlobals(float $rate): float
{
    return $GLOBALS['total'] * (1 + $rate);
}
```

المشكلة إن اعتماد الدالة بقى مخفيًا. لو `$total` مش موجود أو اتغير في مكان بعيد، النتيجة تتغير. تمرير القيمة كـArgument يجعل الاعتماد ظاهرًا وأسهل في الاختبار.

## المتغير `static` داخل الدالة

المتغير المحلي العادي يبدأ من جديد كل استدعاء. أما `static` المحلي فيتهيأ مرة واحدة ويحفظ قيمته داخل الـProcess الحالية:

```php
function nextId(): int
{
    static $id = 0;
    return ++$id;
}

echo nextId(), PHP_EOL; // 1
echo nextId(), PHP_EOL; // 2
echo nextId(), PHP_EOL; // 3
```

ده مش تخزين دائم. لو العملية انتهت وبدأت عملية جديدة، القيمة تبدأ من الأول. كمان الحالة المخفية ممكن تصعّب الاختبار، فلا تستخدمها بدل قاعدة البيانات أو Cache أو Dependency واضحة.

## نطاق الملفات المضمّنة

الملف اللي بتضمه باستخدام `include` أو `require` يرث نطاق السطر اللي اتضم فيه:

```php
function loadConfig(): array
{
    $environment = 'development';
    return require __DIR__ . '/config.php';
}
```

لو `config.php` استخدم `$environment`، هيكون متاحًا لأنه اتضم داخل الدالة. السلوك ده مفيد أحيانًا، لكنه ممكن يعمل اعتمادًا مخفيًا؛ الأفضل إن ملفات الإعداد ترجع قيمة واضحة بدل تعديل متغيرات كثيرة.

## Superglobals: بيانات متاحة في كل النطاقات

في تطبيق الويب، PHP بتحط أجزاء من الطلب والبيئة في مصفوفات خاصة اسمها **Superglobals**. متاحة داخل الدوال من غير `global`:

| المتغير | بيحتوي غالبًا على إيه؟ |
|---|---|
| `$_GET` | Query String الموجودة بعد `?` في الرابط |
| `$_POST` | حقول نموذج أُرسل بترميز Forms مناسب |
| `$_SERVER` | معلومات عن الطلب والخادم والـHeaders المتاحة |
| `$_FILES` | بيانات الملفات المرفوعة |
| `$_COOKIE` | Cookies التي أرسلها العميل |
| `$_SESSION` | بيانات Session بعد `session_start()` |
| `$GLOBALS` | جدول المتغيرات العامة |

لو فتحت:

```text
http://localhost:8000/?page=2&category=books
```

تقدر تقرأ:

```php
$page = $_GET['page'] ?? '1';
$category = $_GET['category'] ?? 'all';
```

لكن كل بيانات جاية من المستخدم **غير موثوقة** حتى لو شكلها طبيعي.

## الوجود، والتحقق، والتحويل، والإخراج

دي أربع خطوات مختلفة:

1. **اقرأ القيمة** مع التعامل مع عدم وجودها.
2. **تحقق** إنها تحقق قواعد البرنامج.
3. **حوّلها** لنوع داخلي مناسب.
4. **اعمل Encoding** وقت إخراجها حسب السياق.

```php
$rawPage = $_GET['page'] ?? null;
$page = filter_var($rawPage, FILTER_VALIDATE_INT, [
    'options' => ['min_range' => 1, 'max_range' => 1000],
]);

if ($page === false) {
    $page = 1;
}
```

ليه استخدمنا `$page === false`؟ لأن `filter_var` ترجع `false` عند الفشل، والمقارنة الصارمة تمنع خلطها بقيم أخرى.

قائمة Checkboxes ممكن توصل كمصفوفة:

```text
?order_ids[]=10&order_ids[]=20
```

```php
function positiveIds(mixed $input, int $maximumCount = 100): array
{
    if (!is_array($input) || !array_is_list($input) || count($input) > $maximumCount) {
        throw new InvalidArgumentException('Expected a bounded list of IDs');
    }
    $ids = [];
    foreach ($input as $raw) {
        if ((!is_string($raw) && !is_int($raw))
            || preg_match('/\A[1-9][0-9]*\z/', (string) $raw) !== 1) {
            throw new InvalidArgumentException('Invalid ID');
        }
        $id = filter_var($raw, FILTER_VALIDATE_INT, ['options' => ['min_range' => 1]]);
        if ($id === false) {
            throw new InvalidArgumentException('ID exceeds integer range');
        }
        $ids[] = $id;
    }
    return $ids;
}

try {
    $orderIds = positiveIds($_GET['order_ids'] ?? []);
} catch (InvalidArgumentException) {
    http_response_code(422);
    exit('Invalid order IDs');
}
```

التحويل مش تحقق: `intval("12x")` بيطلع 12 رغم إن المدخل مش رقم صحيح. هنا بنقبل قائمة فيها 100 معرّف بحد أقصى، وكل معرّف عدد صحيح موجب بلا أصفار بادئة. بنرفض المصفوفات المتداخلة والصفر وتجاوز الحد. القائمة الفارغة مسموحة. بعد التحقق لسه لازم تتأكد إن المستخدم المسجل يقدر يصل لكل طلب اختاره.

التحقق مش هو الـEscaping. ممكن الاسم يكون صحيحًا حسب قواعدك، لكن يظل محتاج `htmlspecialchars()` عند عرضه في HTML، وPrepared Statement عند استخدامه كقيمة في SQL.

## ليه `eval()` خطيرة؟

`eval()` تأخذ نصًا وتنفذه ككود PHP:

```php
$code = 'echo "hello";';
eval($code);
```

لو النص جاء من مستخدم، فأنت سمحت له يكتب كودًا على السيرفر. في التطبيقات العادية مش محتاج `eval()` أصلًا. استخدم دوالًا أو مصفوفة Callbacks أو `match`:

```php
$operations = [
    'trim' => static fn (string $value): string => trim($value),
    'upper' => static fn (string $value): string => strtoupper($value),
];

$operation = 'trim';
$result = $operations[$operation]('  hello  ');
```

## برنامج كامل: ترحيب من الرابط

```php
<?php
declare(strict_types=1);

$rawName = $_GET['name'] ?? 'Guest';

if (!is_string($rawName)) {
    $rawName = 'Guest';
}

$name = trim($rawName);
if ($name === '' || mb_strlen($name) > 50) {
    $name = 'Guest';
}

$safeName = htmlspecialchars($name, ENT_QUOTES, 'UTF-8');
?>
<!doctype html>
<html lang="en">
<head><meta charset="utf-8"><title>Greeting</title></head>
<body><h1>Hello <?= $safeName ?></h1></body>
</html>
```

جرّب الحالات دي:

```text
/?name=Omar
/?name=
/?name[]=Omar
/?name=<script>alert(1)</script>
```

كل حالة بتختبر حاجة مختلفة: قيمة طبيعية، قيمة فاضية، نوع غير متوقع، ومحاولة إدخال HTML.

## خريطة حركة القيمة

```text
Request value
     ↓
Read from $_GET
     ↓
Check type and rules
     ↓
Store in a clear local variable
     ↓
Encode for HTML output
```

## تأكد من فهمك

<div class="lesson-quiz" role="list">
<section class="quiz-card" role="listitem"><div class="quiz-question-row"><span class="quiz-number">01</span><p>توقع الناتج: <code>$a = 5; $b = $a; $b++; echo "$a,$b";</code></p></div><details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة:</strong> <code>5,6</code> لأن الإسناد العادي أعطى <code>$b</code> قيمة مستقلة منطقيًا.</div></details></section>
<section class="quiz-card" role="listitem"><div class="quiz-question-row"><span class="quiz-number">02</span><p>أضف <code>&</code> في المثال السابق عند الإسناد. إيه اللي هيتغير؟</p></div><details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة:</strong> لو كتبنا <code>$b =& $a</code> فالناتج <code>6,6</code> لأن الاسمين مرتبطان بنفس القيمة المنطقية.</div></details></section>
<section class="quiz-card" role="listitem"><div class="quiz-question-row"><span class="quiz-number">03</span><p>ليه الدالة اللي تستقبل <code>$total</code> كـArgument أسهل في الاختبار من دالة تستخدم <code>global</code>؟</p></div><details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة:</strong> لأن كل اعتماد ظاهر في التوقيع، فنقدر نعطيها مدخلات محددة ونتوقع النتيجة. <code>global</code> يخلي النتيجة مرتبطة بحالة خارجية قد تتغير من مكان آخر.</div></details></section>
<section class="quiz-card" role="listitem"><div class="quiz-question-row"><span class="quiz-number">04</span><p>الرابط يحتوي <code>?page=abc</code>. ليه التحويل المباشر إلى <code>int</code> مش كفاية؟</p></div><details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة:</strong> التحويل قد ينتج صفرًا ويخفي إن المدخل كان غير صالح. الأفضل نتحقق أنه Integer وفي النطاق المطلوب، ثم نقرر هل نستخدم Default أم نرجع خطأ.</div></details></section>
<section class="quiz-card" role="listitem"><div class="quiz-question-row"><span class="quiz-number">05</span><p>إيه الفرق بين Validation وHTML Encoding؟</p></div><details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة:</strong> Validation تقرر هل القيمة تحقق قواعد البرنامج. Encoding يحول القيمة وقت إخراجها بحيث يتعامل معها المتصفح كبيانات في السياق المحدد، لا ككود.</div></details></section>
<section class="quiz-card" role="listitem"><div class="quiz-question-row"><span class="quiz-number">06</span><p>اكتب Counter باستخدام <code>static</code>، ثم اشرح ليه ماينفعش تستخدمه لحفظ عدد زيارات الموقع بشكل دائم.</p></div><details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة:</strong> المتغير يحفظ قيمته بين استدعاءات الدالة داخل العملية الحالية فقط. الزيارات قد تذهب لعمليات أو خوادم مختلفة، والقيمة تضيع عند انتهاء العملية؛ نحتاج مخزنًا مشتركًا ودائمًا مثل Database أو Cache مناسب.</div></details></section>
</div>

## ملخص الدرس

المتغير اسم لقيمة أثناء تشغيل البرنامج. الإسناد العادي والمرجع مش نفس الشيء، والكائنات لها سلوك مشاركة مختلف. الـScope يحدد مين يقدر يشوف المتغير، وتمرير القيم للدوال أوضح من `global`. الـSuperglobals بتدخل بيانات الطلب للبرنامج، لكن وجود البيانات لا يجعلها صحيحة أو آمنة: اقرأها، تحقق منها، حوّلها، واعمل Encoding وقت الإخراج.

## شغّل وتحقق

استخدم [المختبر القابل للتنزيل](/php/00-lab-setup/) للسكربتات المرفقة. أوامر Composer وFPM وDocker والخادم الحقيقي تُنفذ داخل المشروع المُجهز للخدمة، مش مجلد فاضي.

نفّذ نقطة التحقق التالية داخل بيئة الدرس:

~~~bash
php scope-lab.php
~~~

**معيار النجاح:** تثبت المخرجات الفرق بين local وglobal وstatic، ولا يقرأ من superglobal قبل التحقق من وجود المفتاح وشكله.

دوّن كود الخروج والدليل الفعلي. إذا اختلف الناتج، فسر البيئة أو الفرضية التي اختلفت بدل تعديل «المتوقع» حتى يطابق الخطأ.

## اربط النقاط ببعض

Superglobals حدود ثقة وليست بيانات جاهزة: افحص الوجود والشكل والحجم ثم حول إلى type داخل request object. Variable variables و<code>eval</code> ليستا أدوات تصميم معتادة؛ غالبًا map أو callable registry أو parser صريح أوضح وأأمن. لا تجعل global state اعتمادًا مخفيًا.

### جرّب بنفسك

حوّل endpoint يقرأ $_GET في كل مكان إلى قيمة محققة تمرر للدوال.
