---
title: 4. الإخراج والتصحيح والثوابت
description: نطبع النتيجة، نفحص القيم وقت حدوث مشكلة، ونفهم إمتى نستخدم ثابتًا بدل متغير.
sidebar:
  order: 4
---

## قبل ما تبدأ

ذاكر الدرس على 3 خطوات: افهم المشكلة الأول، تابع المثال، وبعدها جرّب الجزء العملي بنفسك. المصطلحات الجديدة الموجودة تحت متشرحة قبل ما ندخل في التفاصيل.

### كلمات جديدة في الدرس

- **Debugger:** أداة تتبّع الأخطاء: بتوقف البرنامج خطوة خطوة عشان تشوف القيم ومسار التنفيذ.
- **HTTP:** قواعد تبادل الطلبات والردود بين المتصفح والخادم.
- **API:** واجهة محددة تسمح لبرنامج يطلب بيانات أو ينفّذ عملية عند برنامج آخر.
- **Session:** بيانات مؤقتة تساعد الخادم يميّز المستخدم بين أكثر من طلب.
- **Cookie:** قيمة صغيرة يحفظها المتصفح ويرسلها مع الطلبات المناسبة.
- **Token:** قيمة تمثل هوية أو صلاحية محددة بدل إرسال كلمة السر كل مرة.
- **CLI:** واجهة تتعامل معها بكتابة أوامر نصية بدل الضغط على أزرار.
- **UTF-8:** طريقة شائعة لتحويل أرقام Unicode إلى بايتات تُحفظ وتُنقل.
- **Boolean:** قيمة منطقية لها حالتان فقط: صح أو خطأ.
- **Function:** دالة: جزء كود له اسم ومهمة محددة ويمكن استدعاؤه أكثر من مرة.


## قبل ما نبدأ

وأنت بتتعلم، محتاج تشوف نتيجتين مختلفتين: **ناتج البرنامج للمستخدم**، ومعلومات مؤقتة تساعدك أنت تفهم البرنامج بيعمل إيه. `echo` مناسبة للإخراج، أما `var_dump()` وأدوات الـDebugging فبتكشف النوع والقيمة أثناء التشخيص. خلط الاثنين في الإنتاج ممكن يعرض بيانات حساسة أو يفسد JSON وHTML.

في الدرس ده هنفهم كمان الثوابت: أسماء لقيم مش المفروض تتغير أثناء التشغيل، زي اسم التطبيق أو HTTP Status معروف.

## `echo`: أبسط طريقة للإخراج

```php
<?php

$name = 'Omar';
echo 'Hello ', $name, PHP_EOL;
```

الناتج:

```text
Hello Omar
```

`echo` عبارة لغوية Language Construct، مش دالة عادية. علشان كده الأقواس اختيارية، وتقدر تبعت لها أكتر من قيمة مفصولة بفواصل:

```php
echo 'Subtotal: ', 100, ' EGP', PHP_EOL;
```

لو محتاج تركّب قيمة واحدة الأول، استخدم دمج النصوص بالنقطة:

```php
$message = 'Hello ' . $name;
echo $message;
```

داخل HTML فيه اختصار واضح:

```php
<h1><?= htmlspecialchars($name, ENT_QUOTES, 'UTF-8') ?></h1>
```

الاختصار `<?= ... ?>` معناه «اطبع نتيجة التعبير». ما تطبعش مدخل مستخدم مباشرة؛ اعمل Encoding مناسب للمكان اللي هتضع فيه القيمة.

## `print`: قريب من `echo` مع فرق صغير

```php
$result = print 'Printed';
var_dump($result); // int(1)
```

| الخاصية | `echo` | `print` |
|---|---|---|
| القيمة المرجعة | لا توجد | دائمًا `1` |
| عدد القيم | يقبل عدة قيم بلا أقواس | قيمة واحدة |
| الاستخدام داخل Expression | لا | ممكن بسبب القيمة المرجعة |
| اختصار القوالب | `<?= ... ?>` | لا يوجد |

فرق السرعة مش قرار عملي. استخدم `echo` في أغلب الحالات لأنها أبسط ومتوقعة، واعرف `print` علشان تفهم الكود القديم أو المثال اللي قدامك.

## إخراج Terminal غير إخراج Web

في CLI، `PHP_EOL` ينزل سطرًا جديدًا:

```php
echo 'First line', PHP_EOL;
echo 'Second line', PHP_EOL;
```

في HTML، نهاية السطر داخل المصدر لا تعمل بالضرورة كسطر مرئي. استخدم عناصر HTML مناسبة:

```php
echo '<p>First paragraph</p>';
echo '<p>Second paragraph</p>';
```

وفي JSON لازم تحدد نوع المحتوى وتطبع JSON صالحًا فقط، من غير رسائل Debug قبله:

```php
header('Content-Type: application/json; charset=utf-8');
echo json_encode(['status' => 'ok'], JSON_THROW_ON_ERROR);
```

لو أضفت `var_dump()` قبل JSON، العميل هيستلم Response غير صالحة حتى لو البيانات الصحيحة موجودة بعدها.

## ليه `echo` مش أداة Debug كاملة؟

لو طبعت `false` باستخدام `echo` مش هتشوف شيئًا تقريبًا، ولو طبعت Array هتظهر مشكلة أو كلمة `Array` بدل تفاصيلها. أثناء التشخيص محتاج النوع والحجم والبنية.

```php
$value = false;

echo $value;      // لا يوضح الحقيقة جيدًا
var_dump($value); // bool(false)
```

## `var_dump()` و`print_r()` و`get_debug_type()`

```php
$user = [
    'id' => 7,
    'active' => true,
    'roles' => ['editor', 'reviewer'],
];

var_dump($user);
print_r($user);
echo get_debug_type($user); // array
```

- `var_dump()` تعرض النوع والقيمة والطول والتفاصيل المتداخلة.
- `print_r()` أسهل بصريًا للمصفوفات والكائنات، لكنها أقل دقة في الأنواع.
- `print_r($value, true)` ترجع العرض كنص بدل طباعته.
- `get_debug_type()` ترجع اسم نوع أوضح، خصوصًا للكائنات والـResources.

```php
$debugText = print_r($user, true);
file_put_contents(__DIR__ . '/debug.txt', $debugText);
```

ده مثال تعليمي فقط. ما تكتبش بيانات مستخدم حساسة في ملف عام، وامسح ملفات الـDebug بعد الانتهاء.

## Debugging بخطوات بدل الطباعة العشوائية

افترض إن السعر النهائي طلع غلط:

```php
$priceCents = 10000;
$discountPercent = 10;
$finalCents = $priceCents - $discountPercent;
```

المشكلة إننا طرحنا `10` قروش بدل 10%. قبل ما تغير الكود عشوائيًا:

1. اكتب النتيجة المتوقعة: `9000`.
2. افحص كل قيمة ونوعها.
3. اختبر العملية في سطر صغير.
4. صحح المعادلة.
5. أضف Test يمنع رجوع الخطأ.

```php
$discountCents = (int) round($priceCents * ($discountPercent / 100));
$finalCents = $priceCents - $discountCents;

var_dump($priceCents, $discountPercent, $discountCents, $finalCents);
```

المفروض تشوف `10000` و`10` و`1000` و`9000`.

## `dump()` و`dd()` والـLogger

Frameworks كثيرة توفر `dump()` لعرض قيمة بشكل أحسن، و`dd()` بمعنى Dump and Die: تعرض القيم وتوقف التنفيذ. الأدوات دي للتطوير، وممكن توقف Request أو تكشف Token وCookie وبيانات عميل لو اتسابَت في الإنتاج.

في الإنتاج استخدم Logger ببيانات منظمة:

```php
error_log(json_encode([
    'event' => 'checkout_failed',
    'order_id' => 42,
    'reason' => 'payment_timeout',
], JSON_THROW_ON_ERROR));
```

ما تسجلش Password أوSession ID أوAccess Token. خلي رسالة المستخدم بسيطة، والتفاصيل التقنية في سجل محمي.

## يعني إيه ثابت؟

المتغير ممكن يتغير:

```php
$attempts = 1;
$attempts++;
```

الثابت اسم لقيمة المفروض تفضل كما هي بعد تعريفها:

```php
const APP_NAME = 'Omar Notes';
echo APP_NAME;
```

الثابت لا يبدأ بـ`$`. استخدمه لما المعنى فعلًا ثابت في الكود، مش لمجرد منع التغيير. بيانات تختلف بين البيئات، زي Password قاعدة البيانات، مكانها Configuration/Environment مش ثابت مكتوب في Repository.

## `const` و`define()`

```php
const APP_NAME = 'Omar Notes';
define('APP_VERSION', '1.0.0');
```

- `const` تصريح لغوي، مناسب للثوابت المعروفة وقت تعريف الكود.
- `define()` استدعاء وقت التشغيل، ولذلك ممكن يظهر داخل شرط.
- `define()` ينشئ ثابتًا عامًا، ولا يعرّف Class Constant.
- ما تقدرش تضع `const` المحلي داخل Function أوBlock شرطي.

```php
if (getenv('APP_ENV') === 'testing') {
    define('FAKE_EXTERNAL_SERVICES', true);
}
```

حتى لو ده مسموح، Configuration Object غالبًا أوضح في التطبيقات الكبيرة من ثوابت عامة بتظهر حسب مسار التنفيذ.

## Class Constants

```php
final class HttpStatus
{
    public const OK = 200;
    public const NOT_FOUND = 404;
}

echo HttpStatus::NOT_FOUND;
```

وجود الثابت داخل Class بيربط الاسم بالمفهوم بدل نشر أسماء عامة. ولو الحالات تمثل مجموعة مغلقة لها سلوك وقيمة، Enum قد تكون أنسب.

## Magic Constants

PHP توفر أسماء تتغير قيمتها حسب مكانها في الملف:

```php
echo __LINE__, PHP_EOL;
echo __FILE__, PHP_EOL;
echo __DIR__, PHP_EOL;
echo __FUNCTION__, PHP_EOL;
echo __CLASS__, PHP_EOL;
echo __METHOD__, PHP_EOL;
echo __NAMESPACE__, PHP_EOL;
```

اسمها “Magic” لأن المحرك يحسب قيمتها من السياق. أهم مثال عملي هو `__DIR__`:

```php
$config = require __DIR__ . '/../config/app.php';
```

المسار هنا يبدأ من مجلد الملف نفسه، مش من Current Working Directory اللي شغلت منه الأمر. ده يخلي `require` أكثر ثباتًا.

## Predefined Constants

PHP والـExtensions تعرف ثوابت جاهزة:

```php
echo PHP_VERSION, PHP_EOL;
echo PHP_OS_FAMILY, PHP_EOL;
echo PHP_INT_MAX, PHP_EOL;
echo PHP_EOL;
```

بعض الثوابت موجودة فقط لو Extension معينة متثبتة. استخدم `defined('CONSTANT_NAME')` لو الوجود اختياري:

```php
if (defined('JSON_THROW_ON_ERROR')) {
    echo 'JSON exception flag is available';
}
```

## برنامج صغير قابل للتجربة

```php
<?php
declare(strict_types=1);

const TAX_RATE = 0.14;

$priceCents = 25000;
$taxCents = (int) round($priceCents * TAX_RATE);
$totalCents = $priceCents + $taxCents;

if (getenv('APP_DEBUG') === '1') {
    var_dump([
        'file' => __FILE__,
        'price_cents' => $priceCents,
        'tax_cents' => $taxCents,
    ]);
}

echo "Total: {$totalCents} cents", PHP_EOL;
```

شغّله مرة عادي، ومرة مع `APP_DEBUG=1` حسب طريقة ضبط Environment Variables في نظامك. الناتج الأساسي يفضل ثابتًا، بينما معلومات التشخيص تظهر فقط في بيئة التطوير.

## أخطاء شائعة

- استخدام `echo` لفحص Boolean أوArray ثم فهم النتيجة غلط.
- ترك `var_dump()` أو`dd()` في API إنتاجية.
- تسجيل أسرار بحجة التشخيص.
- اعتبار قيمة تختلف بين Development وProduction ثابتًا داخل الكود.
- بناء مسار نسبي يعتمد على المجلد الحالي بدل `__DIR__`.
- تعريف اسم ثابت عام جدًا قد يتصادم مع مكتبة أخرى.

## تأكد من فهمك

<div class="lesson-quiz" role="list">
<section class="quiz-card" role="listitem"><div class="quiz-question-row"><span class="quiz-number">01</span><p>إيه الناتج والقيمة الموجودة في <code>$result</code> بعد <code>$result = print 'Hi';</code>؟</p></div><details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة:</strong> يتم إخراج <code>Hi</code>، وتأخذ <code>$result</code> القيمة الصحيحة <code>1</code>.</div></details></section>
<section class="quiz-card" role="listitem"><div class="quiz-question-row"><span class="quiz-number">02</span><p>ليه <code>echo false;</code> مش كفاية علشان تعرف قيمة المتغير؟</p></div><details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة:</strong> لأنها تخرج كنص فارغ تقريبًا. <code>var_dump(false)</code> تعرض النوع والقيمة بوضوح: <code>bool(false)</code>.</div></details></section>
<section class="quiz-card" role="listitem"><div class="quiz-question-row"><span class="quiz-number">03</span><p>API ترجع JSON، لكن العميل يقول إن JSON غير صالحة. إيه أول حاجة تدور عليها؟</p></div><details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة:</strong> دور على أي <code>var_dump</code> أوWarning أوHTML خرج قبل أو بعد JSON، وتأكد من Content-Type ومن إن المسار يطبع Document JSON واحدة فقط.</div></details></section>
<section class="quiz-card" role="listitem"><div class="quiz-question-row"><span class="quiz-number">04</span><p>إمتى تستخدم <code>__DIR__</code> في مسار ملف؟</p></div><details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة:</strong> لما المسار لازم يكون محسوبًا بالنسبة لمكان الملف الحالي، بغض النظر عن المجلد اللي بدأ منه تشغيل البرنامج.</div></details></section>
<section class="quiz-card" role="listitem"><div class="quiz-question-row"><span class="quiz-number">05</span><p>هل كلمة مرور قاعدة البيانات مناسبة كـ<code>const</code> داخل الكود؟ ليه؟</p></div><details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة:</strong> لا. هي Secret وتختلف بين البيئات وتحتاج Rotation؛ تُحقن من Environment أوSecret Manager ولا تُحفظ في Repository.</div></details></section>
<section class="quiz-card" role="listitem"><div class="quiz-question-row"><span class="quiz-number">06</span><p>صحح معادلة خصم كتبت <code>$final = $priceCents - $percent;</code>.</p></div><details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة:</strong> احسب الخصم أولًا: <code>$discount = (int) round($priceCents * ($percent / 100));</code> ثم اطرحه. اختبر 0% و100% وقيمة عادية وحدد سياسة التقريب.</div></details></section>
</div>

## ملخص الدرس

`echo` و`print` للإخراج، لكن أدوات الـDebugging تكشف النوع والبنية وقت التشخيص. افصل ناتج المستخدم عن معلومات المطور، وما تعرضش أسرارًا. الثابت مناسب لقيمة لا تتغير داخل تصميم البرنامج، و`__DIR__` مثال عملي مهم لبناء مسار موثوق.

## شغّل وتحقق

استخدم [المختبر القابل للتنزيل](/php/00-lab-setup/) للسكربتات المرفقة. أوامر Composer وFPM وDocker والخادم الحقيقي تُنفذ داخل المشروع المُجهز للخدمة، مش مجلد فاضي.

نفّذ نقطة التحقق التالية داخل بيئة الدرس:

~~~bash
php debug-lab.php 2> debug.log
~~~

**معيار النجاح:** يذهب الناتج المقصود إلى stdout والتشخيص إلى stderr أو logger، ولا تظهر قيمة سرية في أي منهما.

دوّن كود الخروج والدليل الفعلي. إذا اختلف الناتج، فسر البيئة أو الفرضية التي اختلفت بدل تعديل «المتوقع» حتى يطابق الخطأ.

## اربط النقاط ببعض

في التطوير استخدم Xdebug أو debugger لفحص stack وbreakpoints، وفي الإنتاج عطّل display_errors ووجّه التفاصيل إلى logger محمي مع correlation ID. الثابت مناسب لقيمة بنيوية لا تتغير أثناء التشغيل، بينما configuration البيئية ليست class constant لمجرد أنها «ثابتة الآن».

### جرّب بنفسك

اختبر خطأً في التطوير والإنتاج وتأكد أن المستخدم لا يرى stack trace.
