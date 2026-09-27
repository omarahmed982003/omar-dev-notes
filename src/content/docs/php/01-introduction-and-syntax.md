---
title: 1. مقدمة وصياغة PHP
description: "بداية هادية من الصفر: يعني إيه PHP، الكود بيتشغّل فين، وإزاي تكتب وتشغّل أول برنامج وتدمجه مع HTML بأمان."
sidebar:
  order: 1
---

## قبل ما تبدأ

ذاكر الدرس على 3 خطوات: افهم المشكلة الأول، تابع المثال، وبعدها جرّب الجزء العملي بنفسك. المصطلحات الجديدة الموجودة تحت متشرحة قبل ما ندخل في التفاصيل.

### كلمات جديدة في الدرس

- **Runtime:** وقت التشغيل: الفترة اللي البرنامج بيكون شغال فيها فعلًا.
- **HTTP:** قواعد تبادل الطلبات والردود بين المتصفح والخادم.
- **URL:** العنوان الكامل لمورد على الويب، زي صفحة أو صورة أو نقطة API.
- **API:** واجهة محددة تسمح لبرنامج يطلب بيانات أو ينفّذ عملية عند برنامج آخر.
- **Queue:** طابور مهام تنتظر عاملًا ينفذها في الخلفية.
- **CLI:** واجهة تتعامل معها بكتابة أوامر نصية بدل الضغط على أزرار.
- **UTF-8:** طريقة شائعة لتحويل أرقام Unicode إلى بايتات تُحفظ وتُنقل.
- **Scope:** النطاق: المكان اللي يقدر الكود داخله يشوف اسمًا أو متغيرًا.


## هنفهم إيه في الدرس ده؟

قبل ما نحفظ أوامر، محتاجين نفهم الصورة الكبيرة. لما تفتح موقع وتضغط على زر «تسجيل الدخول»، المتصفح بيبعت طلب للسيرفر. السيرفر محتاج برنامج يستقبل البيانات، يتأكد منها، يكلم قاعدة البيانات، وبعد كده يرجّع نتيجة. **PHP واحدة من اللغات اللي ممكن تكتب بيها البرنامج ده.**

في نهاية الدرس هتكون فاهم:

- PHP بتشتغل فين، والفرق بينها وبين HTML وJavaScript.
- إزاي تشغّل ملف PHP من الـTerminal أو من خلال متصفح.
- شكل تعليمات PHP، وإمتى نكتب `;`.
- إزاي نخلط PHP مع HTML من غير ما نعرّض الصفحة لمشكلة أمنية.
- إزاي تقرأ رسالة الخطأ بدل ما تعتبرها حاجة مخيفة.

## يعني إيه PHP؟

PHP لغة برمجة عامة الاستخدام، لكنها مشهورة جدًا في تطوير الـBackend، يعني الجزء اللي بيشتغل على السيرفر. الاسم بدأ تاريخيًا بـ**Personal Home Page**، وبعد كده بقى الاسم الرسمي المتكرر **PHP: Hypertext Preprocessor**.

خلّينا نفرّق بين ثلاث حاجات:

- **HTML** بيصف شكل ومحتوى الصفحة اللي المتصفح هيعرضها.
- **JavaScript في المتصفح** يضيف تفاعل بعد وصول الصفحة للمستخدم.
- **PHP** غالبًا بتشتغل على السيرفر قبل ما الاستجابة توصل للمتصفح.

مثلًا لو عندنا الكود ده على السيرفر:

```php
<?php
$name = 'Omar';
echo "Hello {$name}";
```

المتصفح مش بيستلم `$name` ولا `echo`. هو بيستلم الناتج فقط:

```text
Hello Omar
```

دي نقطة مهمة جدًا: **كود PHP نفسه المفروض يفضل على السيرفر**. لو ملف المصدر أو أسرار الاتصال بقاعدة البيانات وصلوا للمتصفح، فدي مشكلة في إعداد السيرفر وليست طريقة عمل PHP الطبيعية.

## الطلب بيمشي إزاي؟

تخيّل إنك فتحت الرابط `/products.php`:

1. المتصفح يبعت HTTP Request.
2. Web Server زي Nginx أو Apache يستقبل الطلب.
3. لو المطلوب ملف PHP ديناميكي، السيرفر يمرره إلى PHP Runtime.
4. PHP تقرأ الكود وتنفذه. ممكن أثناء التنفيذ تقرأ ملفًا أو تكلم قاعدة بيانات أو API.
5. PHP تنتج Body ومعاه Headers وStatus Code.
6. Web Server يرجع HTTP Response للمتصفح.
7. المتصفح يعرض HTML أو يتعامل مع JSON حسب نوع الاستجابة.

```text
Browser → HTTP Request → Web Server → PHP → Database/File/API
Browser ← HTTP Response ← Web Server ← Result
```

مش لازم كل طلب يكلم قاعدة بيانات، ومش لازم الناتج يكون HTML. PHP ممكن ترجع JSON لتطبيق موبايل، أو تنشئ ملفًا، أو تشتغل من غير متصفح أصلًا عن طريق سطر الأوامر.

:::note[هل PHP «بتتفسر سطرًا سطرًا»؟]
الجملة دي مفيدة كتقريب أولي لكنها مش دقيقة تقنيًا. محرك PHP يحوّل الكود إلى Opcodes ثم ينفذها، وOPcache ممكن يحتفظ بالنتيجة دي، وفي الإصدارات الحديثة توجد JIT. اللي يهمك الآن إنك في التطوير المعتاد تعدّل الملف وتشغّله من غير Build تقليدي بعد كل تعديل.
:::

## PHP بتستخدم في إيه؟

تقدر تستخدمها في:

- استقبال Forms والتحقق من البيانات.
- إنشاء صفحات ديناميكية وREST APIs.
- قراءة وكتابة قواعد البيانات والملفات.
- إدارة Sessions وتسجيل الدخول والصلاحيات.
- تشغيل أوامر CLI وJobs مجدولة وQueue Workers.
- إرسال بريد أو التعامل مع JSON وخدمات خارجية.
- إنشاء صور أو PDFs عند تثبيت المكتبات المناسبة.
- كتابة كود Procedural أو Object-Oriented.

ممكن بأدوات خارجية تبني Desktop Apps، لكن ده مش الاستخدام الأشهر ولا أول اختيار منطقي للغة.

## جهّز البيئة واتأكد إن PHP شغالة

ممكن تثبّت PHP لوحدها، أو تستخدم حزمة جاهزة:

- **XAMPP:** متاح لأكثر من نظام.
- **WAMP:** شائع على Windows.
- **MAMP:** شائع على macOS.
- **LAMP:** وصف شائع لـLinux + Apache + MySQL/MariaDB + PHP.

افتح Terminal واكتب:

```bash
php --version
```

لو التثبيت وPATH مضبوطين، هتشوف رقم الإصدار. لو ظهر إن الأمر غير معروف، فده معناه غالبًا إن PHP مش متثبتة أو إن مكان الملف التنفيذي مش مضاف إلى `PATH`.

## أول برنامج من سطر الأوامر

أنشئ ملفًا اسمه `hello.php`:

```php
<?php

$name = 'Omar';
$lessonCount = 1;

echo "Hello {$name}!", PHP_EOL;
echo "You finished lesson {$lessonCount}.", PHP_EOL;
```

شغّله:

```bash
php hello.php
```

الناتج المتوقع:

```text
Hello Omar!
You finished lesson 1.
```

نفهم المثال بهدوء:

- `<?php` بتقول إن اللي بعدها كود PHP.
- `$name` متغير خزّنا فيه نصًا.
- `$lessonCount` متغير خزّنا فيه عددًا.
- `echo` بتخرج قيمة.
- `{}` حول اسم المتغير بتخلي حدوده واضحة داخل النص.
- `PHP_EOL` معناها نهاية سطر مناسبة لنظام التشغيل.
- `;` بتنهي التعليمة البسيطة.

في ملف PHP خالص، الأفضل غالبًا ما تكتبش وسم الإغلاق `?>`. ده يمنع مسافات غير مقصودة بعده من إنها تخرج قبل الـHeaders.

## تشغيل PHP في المتصفح

اعمل مجلدًا اسمه `public` وحط جواه `index.php`:

```php
<?php

echo '<h1>My first PHP page</h1>';
echo '<p>The server generated this HTML.</p>';
```

من المجلد اللي يحتوي `public` شغّل:

```bash
php -S localhost:8000 -t public
```

وبعد كده افتح:

```text
http://localhost:8000
```

الخادم المدمج مناسب للتعلم والتطوير المحلي فقط. مش معمول علشان يتحط مباشرة على الإنترنت كخادم إنتاج.

## تعليمات PHP والـBlocks

التعليمة البسيطة غالبًا بتنتهي بـ`;`:

```php
$price = 150;
$quantity = 2;
$total = $price * $quantity;
echo $total;
```

لكن الـBlock نفسه لا نضع بعد قوسه الأخير فاصلة منقوطة:

```php
if ($total >= 300) {
    echo 'Free shipping';
} else {
    echo 'Shipping fee applies';
}
```

لو نسيت `;`، ممكن رسالة الخطأ تشير للسطر التالي، لأن PHP استمرت في القراءة لحد ما اكتشفت إن تركيب الجملة لم يعد ممكنًا. لذلك بص كمان على السطر اللي قبل مكان الخطأ.

## دمج PHP مع HTML

PHP اتصممت من البداية بحيث تقدر تدخل وتخرج من وضع PHP داخل قالب HTML:

```php
<?php
$title = 'متجري';
$products = ['Keyboard', 'Mouse', 'Monitor'];
?>
<!doctype html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="utf-8">
    <title><?= htmlspecialchars($title, ENT_QUOTES, 'UTF-8') ?></title>
</head>
<body>
    <h1><?= htmlspecialchars($title, ENT_QUOTES, 'UTF-8') ?></h1>

    <?php if ($products === []): ?>
        <p>مفيش منتجات دلوقتي.</p>
    <?php else: ?>
        <ul>
            <?php foreach ($products as $product): ?>
                <li><?= htmlspecialchars($product, ENT_QUOTES, 'UTF-8') ?></li>
            <?php endforeach; ?>
        </ul>
    <?php endif; ?>
</body>
</html>
```

الاختصار `<?= $value ?>` معناه «اطبع القيمة». والصياغة `if: ... endif;` و`foreach: ... endforeach;` بتكون أوضح داخل HTML من كثرة الأقواس.

استخدمنا `htmlspecialchars()` لأن أي قيمة ممكن يظهر فيها نص غير موثوق لازم تتحول قبل وضعها في HTML. لو اسم المنتج كان يحتوي `<script>`، إحنا عايزين نعرضه كنص، مش نخلي المتصفح ينفذه ككود.

:::caution[مش كل Escape يصلح لكل مكان]
`htmlspecialchars()` مناسب غالبًا للنص داخل HTML. لكن URL وJavaScript وCSS لهم سياقات مختلفة. القاعدة هي: اعمل Encoding وقت الإخراج وبالطريقة المناسبة للمكان اللي هتحط فيه القيمة.
:::

## الـHeaders لازم تخرج قبل الـBody

الـHTTP Response فيها Headers ثم Body. علشان كده لازم تستدعي `header()` و`setcookie()` و`session_start()` قبل ما تطبع HTML أو نصًا:

```php
<?php

header('Content-Type: application/json; charset=utf-8');

$response = ['status' => 'ok'];
echo json_encode($response, JSON_UNESCAPED_UNICODE | JSON_THROW_ON_ERROR);
```

الناتج:

```json
{"status":"ok"}
```

لو طبعت حاجة قبل `header()`، ممكن تقابل رسالة `headers already sent`. وقتها دور على `echo` أو HTML أو حتى مسافة خرجت قبل `<?php`.

## التعليقات وحساسية الحروف


التعليق نص PHP بيتجاهله، أما قواعد كتابة الكود فاسمها Syntax. المتغير اسم بنوصل بيه لقيمة. Composer بيدير مكتبات PHP، وOPcache بيحفظ التعليمات المترجمة، وNginx بيستقبل طلبات الويب ويمرر شغل PHP لمشغّلها؛ هنشرح الأدوات دي في مسار التشغيل.

```php
// تعليق لسطر واحد

# تعليق لسطر واحد، لكنه أقل استخدامًا
/*
   تعليق لأكثر من سطر
*/

$userName = 'Omar';
echo $userName;
// echo $username; // متغير مختلف لأن حالة الحروف مختلفة
```

أسماء المتغيرات Case-sensitive، يعني `$userName` غير `$username`. كلمات اللغة مثل `if` لا تعتمد عمليًا على حالة الحروف، وأسماء الدوال والأصناف تُطابق من غير حساسية، لكن ما تعتمدش على ده: اكتب الاسم بنفس الطريقة اللي اتعرّف بها والتزم بمعايير PSR علشان الكود يفضل واضحًا.

التعليق الجيد يشرح **سبب القرار**، مش يعيد قراءة الكود:

```php
// Keep money in cents to avoid binary floating-point rounding.
$priceCents = 1999;
```

## مثال كامل صغير

البرنامج ده يقرأ اسمًا من Query String ويعرض ترحيبًا آمنًا. شغّله بالخادم المدمج وافتح `http://localhost:8000/?name=Omar`:

```php
<?php

$rawName = $_GET['name'] ?? 'Guest';
$name = is_string($rawName) ? trim($rawName) : 'Guest';

if ($name === '') {
    $name = 'Guest';
}

$safeName = htmlspecialchars($name, ENT_QUOTES, 'UTF-8');
?>
<!doctype html>
<html lang="en">
<head><meta charset="utf-8"><title>Welcome</title></head>
<body>
    <h1>Hello <?= $safeName ?></h1>
</body>
</html>
```

غيّر الرابط إلى `?name=<b>Omar</b>`. المفروض تشوف العلامات كنص، مش اسمًا عريضًا؛ وده يثبت إن الإخراج اتعمل له Encoding.

## أخطاء شائعة في أول يوم

- فتحت ملف PHP بالنقر عليه فظهر الكود أو صفحة فارغة: شغّله من PHP CLI أو من Web Server، مش كملف عادي.
- الأمر `php` غير معروف: راجع التثبيت و`PATH`.
- ظهر `Parse error`: اقرأ رقم الملف والسطر وراجع السطر السابق أيضًا.
- ظهر `Undefined variable`: الاسم مكتوب غلط أو المتغير لم يأخذ قيمة قبل الاستخدام.
- ظهر `headers already sent`: خرج Body قبل تعديل Headers.
- الصفحة تعرض مدخل المستخدم مباشرة: استخدم Encoding مناسب وقت الإخراج.

## خريطة رحلة أول برنامج

<div class="lesson-diagram" role="img" aria-label="رحلة ملف PHP من الكتابة إلى النتيجة">
<p class="lesson-diagram-title">من الملف إلى النتيجة</p>
<div class="diagram-flow diagram-pipeline">
<div class="diagram-node input"><span>اكتب hello.php</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>شغّل PHP</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node decision"><span>اقرأ الخطأ أو الناتج</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node output"><span>عدّل وجرّب تاني</span></div>
</div>
</div>

## تأكد من فهمك

<div class="lesson-quiz" role="list">
<section class="quiz-card" role="listitem"><div class="quiz-question-row"><span class="quiz-number">01</span><p>المتصفح طلب ملف PHP. هل يستلم الكود نفسه؟ اشرح الرحلة باختصار.</p></div><details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة:</strong> لا. Web Server يمرر الملف إلى PHP، وPHP تنفذه وترجع الناتج. المتصفح يستلم Response فيها HTML أو JSON أو نوع محتوى آخر، وليس كود المصدر.</div></details></section>
<section class="quiz-card" role="listitem"><div class="quiz-question-row"><span class="quiz-number">02</span><p>إيه الناتج المتوقع من <code>echo 'PHP', ' ', 8;</code>؟</p></div><details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة:</strong> الناتج هو <code>PHP 8</code>. ‏<code>echo</code> تقدر تستقبل أكثر من قيمة مفصولة بفواصل وتخرجهم بالترتيب.</div></details></section>
<section class="quiz-card" role="listitem"><div class="quiz-question-row"><span class="quiz-number">03</span><p>الكود بيقول إن الخطأ في السطر 8، لكن السطر شكله سليم. فين تبص بعد كده؟</p></div><details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة:</strong> راجع السطر السابق؛ ممكن يكون ناقصه فاصلة منقوطة أو علامة اقتباس أو قوس، ولم يكتشف المحرك استحالة التركيب إلا عند السطر 8.</div></details></section>
<section class="quiz-card" role="listitem"><div class="quiz-question-row"><span class="quiz-number">04</span><p>ليه ماينفعش نكتب <code>echo $_GET['name'];</code> مباشرة داخل HTML؟</p></div><details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة:</strong> لأن المستخدم يقدر يرسل HTML أو JavaScript. لازم نتحقق من المدخل حسب قواعدنا، وعند عرضه كنص نستخدم <code>htmlspecialchars()</code> بالسياق المناسب.</div></details></section>
<section class="quiz-card" role="listitem"><div class="quiz-question-row"><span class="quiz-number">05</span><p>صلّح الكود: <code>$name = 'Omar' echo $name;</code></p></div><details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة:</strong> أضف <code>;</code> بعد الإسناد: <code>$name = 'Omar'; echo $name;</code>. كل واحدة تعليمة مستقلة.</div></details></section>
<section class="quiz-card" role="listitem"><div class="quiz-question-row"><span class="quiz-number">06</span><p>مهمة تطبيقية: اعمل صفحة تستقبل <code>product</code> و<code>price</code> من الرابط وتعرضهما بأمان.</p></div><details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>خط الحل:</strong> اقرأ القيم باستخدام <code>??</code> لقيمة افتراضية، تحقق أن السعر رقم صالح، وحوّل اسم المنتج باستخدام <code>htmlspecialchars()</code> وقت عرضه. جرّب قيمة فارغة وسعرًا غير رقمي واسمًا يحتوي علامات HTML.</div></details></section>
</div>

## ملخص الدرس

PHP بتشتغل غالبًا على السيرفر، والمتصفح بياخد الناتج فقط. تقدر تشغلها من CLI أو Web Server محلي. ابدأ كل ملف بوسم PHP، أنهِ التعليمات البسيطة بـ`;`، واعمل Encoding لأي بيانات غير موثوقة وقت عرضها. في الدرس الجاي هنفهم المتغيرات بشكل أعمق: القيمة بتتخزن إزاي، وإيه معنى Scope، وإزاي بيانات الطلب بتدخل البرنامج.

## شغّل وتحقق

استخدم [المختبر القابل للتنزيل](/php/00-lab-setup/) للسكربتات المرفقة. أوامر Composer وFPM وDocker والخادم الحقيقي تُنفذ داخل المشروع المُجهز للخدمة، مش مجلد فاضي.

نفّذ نقطة التحقق التالية داخل بيئة الدرس:

~~~bash
php hello.php
~~~

**معيار النجاح:** يطبع البرنامج السطر المتوقع وينتهي بكود 0؛ ثم أضف خطأ syntax متعمدًا مرة واحدة وتأكد أن الرسالة تحدد الملف والسطر.

دوّن كود الخروج والدليل الفعلي. إذا اختلف الناتج، فسر البيئة أو الفرضية التي اختلفت بدل تعديل «المتوقع» حتى يطابق الخطأ.

## اربط النقاط ببعض

لمنع حمل زائد، ادرس الدرس في مسارين: CLI أولًا لفهم syntax وexit code، ثم Web لفهم headers وbody. Composer ليس مطلوبًا لأول ملف، لكنه يصبح نقطة بدء المشروع الحقيقي عبر autoload واعتماديات مثبتة. لا تخلط بين PHP built-in server وبيئة إنتاج.

### جرّب بنفسك

شغّل المثال في CLI ثم Web وحدد اختلاف input/output والعملية المستضيفة.
