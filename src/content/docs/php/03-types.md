---
title: 3. أنواع البيانات ونظام الأنواع
description: نفهم النوع من البداية، والفرق بين النص والعدد والقيمة المنطقية وnull، ثم المصفوفات والكائنات وتصريحات الأنواع والأنواع المتقدمة.
sidebar:
  order: 3
---

## قبل ما تبدأ

ذاكر الدرس على 3 خطوات: افهم المشكلة الأول، تابع المثال، وبعدها جرّب الجزء العملي بنفسك. المصطلحات الجديدة الموجودة تحت متشرحة قبل ما ندخل في التفاصيل.

### كلمات جديدة في الدرس

- **Boolean:** قيمة منطقية لها حالتان فقط: صح أو خطأ.
- **Loop:** حلقة تكرار تعيد تنفيذ مجموعة تعليمات وفق شرط.
- **Function:** دالة: جزء كود له اسم ومهمة محددة ويمكن استدعاؤه أكثر من مرة.


## يعني إيه Data Type؟

القيمة `10` مش زي النص `'10'`. شكلهم قريب، لكن الأولى عدد نقدر نجمعه، والثانية حروف ممكن تكون جاية من Form. **نوع البيانات** بيقول لـPHP وللمبرمج القيمة دي معناها إيه، وإيه العمليات المنطقية اللي تنفع معها.

```php
$quantity = 10;       // int
$input = '10';        // string
$price = 19.95;       // float
$isAvailable = true;  // bool
$discount = null;     // لا توجد قيمة حاليًا
```

لو تجاهلت الأنواع، ممكن تجمع نصًا غير صالح، أو تعتبر القيمة الفارغة رقمًا، أو تقارن قيمتين بطريقة تعطي نتيجة غير متوقعة. الهدف مش حفظ قائمة الأنواع؛ الهدف إنك تعرف **القيمة الموجودة معاك، ومنين جت، وإيه العمليات الآمنة عليها**.

## خريطة بسيطة قبل التفاصيل

هنقسم الأنواع بالشكل ده:

- **Scalar:** قيمة واحدة، وتشمل `bool` و`int` و`float` و`string`.
- **Compound:** تجمع قيمًا أو سلوكًا، مثل `array` و`object`.
- **Special:** مثل `null` و`resource`.
- **أنواع تستخدم في توقيع الدوال:** مثل `callable` و`iterable` و`mixed` و`void` و`never`.
- **أنواع نعرّفها بنفسنا:** Classes وInterfaces وEnums.
- **تركيبات أنواع:** Union مثل `int|string` وIntersection مثل `Countable&Iterator`.

مش لازم تستخدم كل الأنواع المتقدمة من أول يوم. ابدأ بالـScalar والمصفوفات، وبعد ما تفهم الدوال والكائنات ارجع لأجزاء `callable` وIntersection Types.

## `bool`: صح أو غلط

الـBoolean له قيمتان فقط: `true` و`false`. بنستخدمه في الأسئلة والقرارات:

```php
$isLoggedIn = true;
$hasPermission = false;

if ($isLoggedIn && $hasPermission) {
    echo 'Allowed';
} else {
    echo 'Denied';
}
```

أسماء Boolean الأفضل تبدأ بكلمة توضح إنها سؤال: `$isActive` أو `$hasAccess` أو `$canEdit`.

PHP تعتبر بعض القيم Falsey داخل الشرط:

- `false`
- `0` و`0.0`
- النص الفارغ `''` والنص `'0'`
- المصفوفة الفارغة `[]`
- `null`

```php
if ('0') {
    echo 'will not run';
}
```

علشان كده ما تعتمدش على Truthiness لما يكون الفرق بين صفر وقيمة مفقودة مهمًا.

## `null`: مفيش قيمة

`null` معناها إن مفيش قيمة حاليًا. ده مختلف عن صفر، والنص الفارغ، و`false`.

```php
$middleName = null;

if ($middleName === null) {
    echo 'No middle name was provided';
}
```

المتغير قد يكون `null` لو أسندت له القيمة، أو قد يصبح غير معرّف بعد `unset()`:

```php
$value = 'hello';
unset($value);
```

المتغير غير المعرّف مش مطابق تمامًا لمتغير موجود وقيمته `null` في كل عمليات الفحص. استخدم `isset()` لما تريد تعرف إن المفتاح موجود وقيمته ليست `null`، و`array_key_exists()` لما وجود المفتاح نفسه مهم حتى لو قيمته `null`.

## المقارنة العادية والصارمة

`==` تسمح بتحويل الأنواع قبل المقارنة. `===` تقارن النوع والقيمة معًا:

```php
var_dump(0 == false);    // true
var_dump(0 === false);   // false
var_dump('10' == 10);    // true
var_dump('10' === 10);   // false
```

في أغلب كود التطبيقات، ابدأ بالمقارنة الصارمة `===` و`!==`. استخدم المقارنة المرنة فقط لو أنت فاهم قواعد التحويل ومحتاجها فعلًا.

## `int`: الأعداد الصحيحة

```php
$decimal = 42;
$octal = 0o52;
$hex = 0x2A;
$binary = 0b101010;

var_dump($decimal, $octal, $hex, $binary);
```

كل القيم السابقة تساوي 42، لكن طريقة كتابتها مختلفة. الأشكال الثنائية والسداسية تظهر في Flags والألوان والبروتوكولات، لكن العدد داخل العمليات يظل عددًا.

القسمة العادية قد ترجع `float`:

```php
echo 7 / 2;        // 3.5
echo intdiv(7, 2); // 3
echo 7 % 2;        // 1، باقي القسمة
```

التحويل إلى `int` يقتطع الجزء العشري، ولا يقربه:

```php
echo (int) 3.9; // 3
echo round(3.9); // 4
```

حجم `int` يعتمد على المنصة، وتقدر تشوف الحدود باستخدام `PHP_INT_MAX` و`PHP_INT_MIN`. لو تجاوز الحساب المجال، ممكن تتحول النتيجة إلى `float` وتفقد دقة.

## `float`: الأعداد العشرية

الـFloat تمثل كسورًا ثنائية، ولذلك مش كل كسر عشري له تمثيل دقيق:

```php
$result = 0.1 + 0.2;

var_dump($result);          // قيمة قريبة من 0.3
var_dump($result === 0.3);  // false غالبًا
```

ده مش عيب خاص بـPHP؛ دي طبيعة IEEE 754 المستخدمة في لغات كثيرة. للمقارنات العلمية استخدم Tolerance:

```php
$expected = 0.3;
$epsilon = 0.000001;

if (abs($result - $expected) < $epsilon) {
    echo 'Close enough';
}
```

للأموال، أبسط اختيار آمن في أمثلة كثيرة هو أصغر وحدة صحيحة:

```php
$priceCents = 1999;
$quantity = 3;
$totalCents = $priceCents * $quantity; // 5997
```

لو المجال يحتاج كسورًا عشرية دقيقة أو أرقامًا كبيرة، استخدم امتدادًا أو مكتبة Decimal مناسبة بدل `float`.

## `string`: النصوص والبايتات

```php
$name = 'Omar';
$message = "Hello {$name}";
$joined = 'PHP' . ' ' . '8';
```

عامل دمج النصوص هو النقطة `.`، مش `+`.

```php
echo $joined; // PHP 8
```

PHP String هي سلسلة Bytes. الوصول بالفهرس يرجع Byte، وده قد ينجح مع ASCII لكنه مش طريقة آمنة لتقسيم النص العربي:

```php
$english = 'PHP';
echo $english[0];  // P
echo $english[-1]; // P
```

للنصوص متعددة البايتات استخدم دوال `mb_*` عند توفر `mbstring`، مثل `mb_strlen()` و`mb_substr()`.

## Heredoc وNowdoc

للنصوص متعددة الأسطر:

```php
$name = 'Omar';

$heredoc = <<<TEXT
Hello $name
This value is interpolated.
TEXT;

$nowdoc = <<<'TEXT'
$name stays exactly as written.
TEXT;
```

Heredoc تتصرف قريبًا من Double Quotes، وNowdoc قريب من Single Quotes.

## النص الرقمي مش رقمًا مضمونًا

بيانات Forms وQuery Strings بتوصل غالبًا كنصوص:

```php
$rawAge = $_GET['age'] ?? null;
```

ما تعتمدش على إن PHP هتحولها تلقائيًا في الحساب. تحقق ثم حوّل:

```php
$age = filter_var($rawAge, FILTER_VALIDATE_INT, [
    'options' => ['min_range' => 1, 'max_range' => 120],
]);

if ($age === false) {
    echo 'Invalid age';
} else {
    echo "Next year you will be ", $age + 1;
}
```

`is_numeric()` مفيدة لمعرفة إن النص له شكل رقمي، لكنها لا تطبق قواعد مجال عملك. مثلًا عمر `-20` قد يكون Numeric لكنه غير صالح كتاريخ عمر بشري.

## `array`: قائمة وMap في نفس النوع

مصفوفة PHP Ordered Map، ولذلك تقدر تستخدمها كقائمة أو كخريطة مفاتيح وقيم:

```php
$colors = ['red', 'blue'];

echo $colors[0]; // red
```

```php
$user = [
    'id' => 7,
    'name' => 'Omar',
    'active' => true,
];

echo $user['name'];
```

وممكن تكون متعددة الأبعاد:

```php
$orders = [
    ['id' => 101, 'total_cents' => 5000],
    ['id' => 102, 'total_cents' => 7500],
];

echo $orders[1]['total_cents']; // 7500
```

لو استخدمت مفتاحًا غير موجود يظهر Warning. استخدم `??` لقيمة افتراضية لما يكون الغياب متوقعًا:

```php
$country = $user['country'] ?? 'Unknown';
```

## `object` وClass

الكائن Instance من Class تجمع حالة وسلوكًا:

```php
final class Product
{
    public function __construct(
        public string $name,
        public int $priceCents,
    ) {}
}

$product = new Product('Keyboard', 150000);
echo $product->name;
```

مش لازم تفهم كل تفاصيل المثال الآن. المهم تعرف إن النوع هنا `Product`، وإن الكائن يقدر يحمل Properties وMethods لها معنى مرتبط بالمجال. مسار OOP هيبني الفكرة من البداية.

## `enum`: حالات محدودة بالاسم

بدل نص حر ممكن يتكتب غلط، Enum تحدد الحالات المسموح بها:

```php
enum OrderStatus: string
{
    case Pending = 'pending';
    case Paid = 'paid';
    case Cancelled = 'cancelled';
}

$status = OrderStatus::Paid;
echo $status->value; // paid
```

دلوقتي ماينفعش الحالة تكون `'paied'` بالخطأ من غير ما يظهر خلل واضح في التحويل.

## `resource`: مقبض لمورد خارجي

بعض الدوال ترجع `resource` يمثل اتصالًا أو Stream مفتوحًا:

```php
$handle = fopen(__FILE__, 'rb');

if ($handle === false) {
    throw new RuntimeException('Could not open the file');
}

echo get_debug_type($handle); // resource (stream)
fclose($handle);
```

الـResource مش محتوى الملف نفسه؛ هو Handle نستخدمه للتعامل مع المورد. امتدادات حديثة كثيرة أصبحت تعيد Objects بدل Resources، لذلك راجع نوع القيمة في التوثيق.

## تصريحات الأنواع في الدوال

نقدر نوضح ما تستقبله الدالة وما ترجعه:

```php
function calculateTotal(int $priceCents, int $quantity): int
{
    return $priceCents * $quantity;
}

echo calculateTotal(1500, 3); // 4500
```

ده يجعل عقد الدالة واضحًا ويساعد PHP وأدوات التحليل تكتشف أخطاء بدري.

اكتب في بداية الملف:

```php
<?php
declare(strict_types=1);
```

بدون Strict Types قد تحول PHP بعض قيم الـScalar عند استدعاء الدالة. مع Strict Types، تمرير `'3'` إلى Parameter من نوع `int` يرمي `TypeError` بدل التحويل التلقائي في أغلب الحالات.

القرار يُطبّق من الملف **المستدعي** للدالة. ويوجد استثناء عملي: يمكن قبول `int` حيث المطلوب `float` لأن التحويل لا يفقد الجزء الكسري الموجود أصلًا.

## Nullable وUnion Types

لو الدالة قد ترجع مستخدمًا أو لا تجد شيئًا:

```php
function findUser(int $id): ?array
{
    return $id === 7 ? ['id' => 7, 'name' => 'Omar'] : null;
}
```

`?array` معناها `array|null`. ويمكن كتابة Union أوسع:

```php
function normalizeId(int|string $id): int
{
    if (is_string($id) && !ctype_digit($id)) {
        throw new InvalidArgumentException('Invalid ID');
    }

    return (int) $id;
}
```

ما توسعش النوع لمجرد الراحة. كل نوع إضافي بيزود الحالات اللي لازم تختبرها.

## `mixed` و`void` و`never`

- `mixed` يعني إن القيمة ممكن تكون من أي نوع، ومنها `null`. استخدم نوعًا أدق لو تقدر.
- `void` يعني إن الدالة لا ترجع قيمة مفيدة.
- `never` يعني إن الدالة لا ترجع للمستدعي أصلًا، لأنها ترمي Exception أو تستدعي `exit` أو لا تنتهي.

```php
function logMessage(string $message): void
{
    error_log($message);
}

function fail(string $message): never
{
    throw new RuntimeException($message);
}
```

## `callable` وClosure

الـCallable قيمة PHP تقدر تستدعيها كدالة. Callback هي Callable بنمررها علشان تتنفذ لاحقًا:

```php
$double = function (int $number): int {
    return $number * 2;
};

$shortDouble = fn (int $number): int => $number * 2;

echo $double(4);      // 8
echo $shortDouble(5); // 10
```

الـClosure كائن يمثل دالة مجهولة. وفي PHP الحديثة نقدر نأخذ First-class Callable:

```php
function clean(string $value): string
{
    return trim($value);
}

$cleaner = clean(...);
echo $cleaner('  hello  ');
```

والكائن يصبح Callable لو عرّف `__invoke()`:

```php
final class Formatter
{
    public function __invoke(string $value): string
    {
        return strtoupper(trim($value));
    }
}

$formatter = new Formatter();
echo $formatter(' hello '); // HELLO
```

## `iterable` وGenerator

`iterable` يقبل Array أو Object يطبق `Traversable`. ده مفيد لما الدالة محتاجة تلف على عناصر من غير ما تهتم بمصدرها:

```php
function printValues(iterable $values): void
{
    foreach ($values as $value) {
        echo $value, PHP_EOL;
    }
}
```

الـGenerator ينتج القيم واحدة واحدة باستخدام `yield` بدل بناء مصفوفة كاملة:

```php
function numbers(int $maximum): iterable
{
    for ($number = 1; $number <= $maximum; $number++) {
        yield $number;
    }
}

printValues(numbers(3));
```

الناتج:

```text
1
2
3
```

`yield` توقف الدالة مؤقتًا وتحفظ حالتها، ثم تكمل من نفس المكان عند طلب القيمة التالية. كل Generator يطبق Iterator، لكن مش كل Iterator معمول باستخدام Generator.

## Intersection وDNF Types — للقراءة الآن

Intersection Type مثل `Countable&Iterator` يعني إن الكائن لازم يحقق النوعين معًا. وDNF Types تسمح بتجميع Unions وIntersections بأقواس وفق قواعد محددة، مثل `(A&B)|null`.

الأنواع دي مهمة في تصميم مكتبات وعقود متقدمة، لكن ما تحتاجش تستخدمها دلوقتي. ارجع لها بعد Interfaces وOOP؛ وجودها هنا علشان خريطة الأنواع تكون كاملة من غير ما نخلط مستوى البداية بالمستوى المتقدم.

## برنامج كامل: حساب إجمالي طلب

```php
<?php
declare(strict_types=1);

function readPositiveInt(mixed $value): ?int
{
    $result = filter_var($value, FILTER_VALIDATE_INT, [
        'options' => ['min_range' => 1],
    ]);

    return $result === false ? null : $result;
}

$priceCents = readPositiveInt($_GET['price_cents'] ?? null);
$quantity = readPositiveInt($_GET['quantity'] ?? null);

if ($priceCents === null || $quantity === null) {
    http_response_code(400);
    echo 'price_cents and quantity must be positive integers';
    exit;
}

$totalCents = $priceCents * $quantity;

echo "Total: {$totalCents} cents";
```

جرّب:

```text
/?price_cents=1999&quantity=3
/?price_cents=abc&quantity=3
/?price_cents=1999&quantity=0
```

المثال بيربط بين أنواع البيانات، و`mixed` على حدود المدخل غير الموثوق، والتحقق، وNullable Return، والمقارنة الصارمة، والحساب بأعداد صحيحة.

## أخطاء شائعة

- استخدام `==` ثم الاستغراب من تحويل الأنواع.
- استخدام `float` للأموال من غير فهم الدقة.
- افتراض إن كل قيمة في `$_GET` نص واحد؛ المهاجم يقدر يرسل Array.
- استخدام `$text[0]` لتقسيم العربية.
- جعل كل الدوال تقبل `mixed` بدل تعريف عقد واضح.
- إضافة Union واسع لإخفاء تصميم غير واضح.
- استخدام `fetchAll()` أو Array ضخمة حين يمكن إنتاج العناصر تدريجيًا.

## تأكد من فهمك

<div class="lesson-quiz" role="list">
<section class="quiz-card" role="listitem"><div class="quiz-question-row"><span class="quiz-number">01</span><p>إيه الفرق بين <code>0</code> و<code>'0'</code> و<code>false</code> و<code>null</code>؟</p></div><details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة:</strong> القيم أنواعها مختلفة: Integer وString وBoolean وNull. قد تتشابه في شرط أو مقارنة مرنة، لكنها لا تتساوى بالمقارنة الصارمة، ولكل واحدة معنى مختلف في البرنامج.</div></details></section>
<section class="quiz-card" role="listitem"><div class="quiz-question-row"><span class="quiz-number">02</span><p>توقع الناتج: <code>var_dump('5' === 5); var_dump('5' == 5);</code></p></div><details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة:</strong> الأولى <code>false</code> لاختلاف النوع، والثانية <code>true</code> لأن المقارنة المرنة تحول القيم وفق قواعد PHP.</div></details></section>
<section class="quiz-card" role="listitem"><div class="quiz-question-row"><span class="quiz-number">03</span><p>ليه <code>0.1 + 0.2 === 0.3</code> قد تكون False؟</p></div><details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة:</strong> لأن الكسور تُخزن بتمثيل ثنائي محدود، وبعض القيم العشرية لا تُمثل بالضبط. نقارن بتسامح مناسب أو نستخدم تمثيلًا عشريًا دقيقًا حسب المجال.</div></details></section>
<section class="quiz-card" role="listitem"><div class="quiz-question-row"><span class="quiz-number">04</span><p>متى تستخدم <code>array_key_exists()</code> بدل <code>isset()</code>؟</p></div><details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة:</strong> لما يهمك تعرف إن المفتاح موجود حتى لو قيمته <code>null</code>. ‏<code>isset()</code> ترجع False للمفتاح المفقود وللقيمة Null.</div></details></section>
<section class="quiz-card" role="listitem"><div class="quiz-question-row"><span class="quiz-number">05</span><p>صلّح تصميم دالة سعر تقبل <code>mixed</code> من داخل التطبيق كله.</p></div><details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة:</strong> اقبل <code>mixed</code> فقط عند حد خارجي لو كان المصدر غير موثوق، ثم تحقق وحوّل إلى <code>int</code> يمثل القروش. خلي دوال المجال الداخلية تقبل <code>int</code> واضحًا بدل إعادة التحقق في كل مكان.</div></details></section>
<section class="quiz-card" role="listitem"><div class="quiz-question-row"><span class="quiz-number">06</span><p>اكتب Generator ينتج الأعداد الزوجية من 2 إلى حد أقصى، ثم اطبع أول أربع قيم.</p></div><details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>خط الحل:</strong> ابدأ Loop من 2 وزوّد 2 كل مرة واستخدم <code>yield</code>. عند حد أقصى 8 سيكون الناتج 2 و4 و6 و8 من غير بناء Array مسبقًا.</div></details></section>
</div>

## ملخص الدرس

النوع هو معنى القيمة والعمليات المناسبة لها. استخدم المقارنة الصارمة، وتحقق من النصوص قبل تحويلها، وما تستخدمش Float للأموال من غير قرار واعٍ. Arrays مناسبة للقوائم والخرائط، وObjects وEnums تضيف أنواعًا لها معنى. Type Declarations وStrict Types تجعل حدود الدوال أوضح، والأنواع المتقدمة موجودة علشان نستخدمها لما نوصل لمشكلتها، مش لمجرد استعراضها.

## شغّل وتحقق

استخدم [المختبر القابل للتنزيل](/php/00-lab-setup/) للسكربتات المرفقة. أوامر Composer وFPM وDocker والخادم الحقيقي تُنفذ داخل المشروع المُجهز للخدمة، مش مجلد فاضي.

نفّذ نقطة التحقق التالية داخل بيئة الدرس:

~~~bash
php types-lab.php
~~~

**معيار النجاح:** تمر الحالات الصحيحة، وترفض الدالة النوع الخاطئ في strict mode بدل تحويله بصمت؛ وثّق نوع الخطأ وكود الخروج.

دوّن كود الخروج والدليل الفعلي. إذا اختلف الناتج، فسر البيئة أو الفرضية التي اختلفت بدل تعديل «المتوقع» حتى يطابق الخطأ.

## اربط النقاط ببعض

قسّم الدراسة إلى scalar/null، ثم arrays/objects/enums، ثم advanced declarations مثل union/intersection/never. أضف اختبارات للحدود الرقمية وnumeric strings وNaN/INF، ولا تستخدم type متقدمًا قبل وجود عقد يحتاجه. Serialization موضوع تخزين وثقة منفصل عن type declaration.

### جرّب بنفسك

اكتب مصفوفة حالات تبين القيمة والنوع قبل وبعد كل تحويل.
