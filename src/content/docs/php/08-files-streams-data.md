---
title: 8. الملفات والـ Streams وJSON وCSV
description: نظام الملفات، أوضاع الفتح، الصلاحيات، streams وwrappers وcontexts وJSON وCSV.
sidebar:
  order: 8
---

## Streams

الـ stream واجهة موحّدة للتعامل مع تدفق بيانات من مصدر أو إلى وجهة: ملف، ذاكرة، شبكة، URL، أو عملية أخرى. يتكون المفهوم من:

1. **Wrapper** يحدد البروتوكول مثل `file://` و`http://` و`ftp://` و`php://` و`data://` و`zlib://`. ويمكن تسجيل wrapper مخصص بـ `stream_wrapper_register()`.
2. **Context** يمرر options وparameters مثل timeout وHTTP headers.
3. **Filter** يحوّل البيانات أثناء القراءة أو الكتابة.

```php
$context = stream_context_create([
    'http' => [
        'timeout' => 3,
        'header' => "Accept: application/json\r\n",
        'ignore_errors' => true,
    ],
]);

$body = file_get_contents('https://example.com/api', false, $context);
```

:::caution
`allow_url_fopen` يتحكم في استخدام URL-aware wrappers مع دوال الملفات. لا تفعّل `allow_url_include`؛ تضمين كود PHP من URL مخاطرة شديدة. لطلبات HTTP الحقيقية استخدم عميلًا يدعم TLS والتحقق من الحالة وإعادة المحاولة.
:::

الـ streams قد تعمل محليًا أو عبر الشبكة وتستخدم buffers وchunks. راقب أخطاء الاتصال والصلاحيات والتسجيل، وافحص `false` بدل إخفاء الخطأ بـ `@`.

## فتح الملفات

```php
$handle = fopen(__DIR__ . '/data.txt', 'rb');

if ($handle === false) {
    throw new RuntimeException('تعذر فتح الملف');
}

try {
    while (($line = fgets($handle)) !== false) {
        echo rtrim($line), PHP_EOL;
    }
} finally {
    fclose($handle);
}
```

| الوضع | المعنى |
|---|---|
| `r` | قراءة من البداية؛ الملف يجب أن يوجد |
| `r+` | قراءة وكتابة؛ الملف يجب أن يوجد |
| `w` | كتابة مع تفريغ الملف أو إنشائه |
| `w+` | قراءة وكتابة مع التفريغ أو الإنشاء |
| `a` | كتابة في النهاية أو إنشاء |
| `a+` | قراءة وكتابة؛ الكتابة دائمًا في النهاية |
| `x` / `x+` | إنشاء جديد فقط؛ يفشل إن كان موجودًا |
| `c` / `c+` | إنشاء إن لزم بلا تفريغ؛ المؤشر في البداية |

أضف `b` مثل `rb` للملفات الثنائية، خصوصًا للتوافق بين الأنظمة.

```php
$handle = fopen(__DIR__ . '/app.log', 'ab');
if ($handle === false) {
    throw new RuntimeException('Cannot open log');
}

try {
    if (!flock($handle, LOCK_EX)) {
        throw new RuntimeException('Cannot lock log');
    }
    fwrite($handle, date(DATE_ATOM) . " started\n");
    fflush($handle);
    flock($handle, LOCK_UN);
} finally {
    fclose($handle);
}
```

`fwrite()` قد يعيد عدد bytes أقل من المطلوب، و`fclose()` يغلق المقبض. يمكن استخدام `file_get_contents` و`file_put_contents` للملفات الصغيرة، مع `LOCK_EX` عند الحاجة.

## الصلاحيات

في Unix: read=4، write=2، execute=1، وتُجمع لكل من owner وgroup وothers.

- `0644`: المالك يقرأ ويكتب، والباقون يقرؤون.
- `0755`: المالك كامل الصلاحيات، والباقون قراءة وتنفيذ.
- `0600`: المالك فقط يقرأ ويكتب.

```php
chmod($path, 0640);
```

لا تجعل `0777` حلًا افتراضيًا. `chmod` وسلوك الملكية يختلفان على Windows، وتتحكم صلاحيات نظام التشغيل والمستخدم الذي يشغّل PHP في النتيجة.

## JSON وSerialization

```php
$json = json_encode(
    ['name' => 'عمر', 'active' => true],
    JSON_UNESCAPED_UNICODE | JSON_THROW_ON_ERROR
);

$data = json_decode($json, true, flags: JSON_THROW_ON_ERROR);

if (function_exists('json_validate')) {
    var_dump(json_validate($json)); // PHP 8.3+
}
```

`serialize()` و`unserialize()` يحتفظان ببنية PHP، لكن:

:::danger
لا تستخدم `unserialize()` على بيانات غير موثوقة؛ قد يؤدي إلى Object Injection. استخدم JSON للبيانات المتبادلة، أو قيّد `allowed_classes` عند الضرورة.
:::

## CSV

```php
$out = fopen(__DIR__ . '/users.csv', 'wb');
fputcsv($out, ['id', 'name']);
fputcsv($out, [1, 'Omar']);
fclose($out);

$in = fopen(__DIR__ . '/users.csv', 'rb');
while (($row = fgetcsv($in)) !== false) {
    [$id, $name] = $row;
}
fclose($in);

$row = str_getcsv('2,"Mona Ahmed"');
```

استخدم دوال CSV بدل `explode(',')` لأنها تتعامل مع علامات الاقتباس والفواصل داخل الحقول.

## خريطة الدرس

<div class="lesson-diagram" role="img" aria-label="خريطة مفاهيم: الملفات والـ Streams وJSON وCSV">
<p class="lesson-diagram-title">خريطة مفاهيم: الملفات والـ Streams وJSON وCSV</p>
<div class="diagram-flow">
<div class="diagram-node input"><span>Streams</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>فتح الملفات</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>الصلاحيات</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node decision"><span>JSON وSerialization</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node output"><span>CSV</span></div>
</div>
</div>

## تأكد من فهمك

<div class="lesson-quiz" role="list">
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">01</span><p>اشرح «Streams» كأنك تراجع تطبيقًا حقيقيًا: ما الهدف وما أهم قيد يجب الانتباه له؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> الـ stream واجهة موحّدة للتعامل مع تدفق بيانات من مصدر أو إلى وجهة: ملف، ذاكرة، شبكة، URL، أو عملية أخرى. يتكون المفهوم من: Wrapper يحدد البروتوكول مثل file:// وhttp:// وftp:// وphp:// وdata:// وzlib://. ويمكن تسجيل wrapper مخصص بـ stream_wrapper_register(). Context يمرر options وparameters مثل timeout وHTTP headers. Filter يحوّل البيانات أثناء القراءة أو الكتابة. :::caution allow_url_fopen يتحكم في استخدام… عمليًا، لا يكفي تنفيذ المسار الناجح؛ يجب توثيق الافتراضات والتحقق من القيم والحالات التي قد تكسر هذا السلوك.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">02</span><p>قارن بين «Streams» و«فتح الملفات». لماذا لا يغني أحدهما عن الآخر داخل موضوع «الملفات والـ Streams وJSON وCSV»؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> في «Streams»: الـ stream واجهة موحّدة للتعامل مع تدفق بيانات من مصدر أو إلى وجهة: ملف، ذاكرة، شبكة، URL، أو عملية أخرى. يتكون المفهوم من: Wrapper يحدد البروتوكول مثل file:// وhttp:// وftp:// وphp:// وdata:// وzlib://. ويمكن تسجيل wrapper مخصص بـ stream_wrapper_register(). Context يمرر options وparameters مثل timeout وHTTP headers. Filter يحوّل البيانات أثناء القراءة أو الكتابة. :::caution allow_url_fopen يتحكم في استخدام… أما «فتح الملفات»: | الوضع | المعنى | |---|---| | r | قراءة من البداية؛ الملف يجب أن يوجد | | r+ | قراءة وكتابة؛ الملف يجب أن يوجد | | w | كتابة مع تفريغ الملف أو إنشائه | | w+ | قراءة وكتابة مع التفريغ أو الإنشاء | | a | كتابة في النهاية أو إنشاء | | a+ | قراءة وكتابة؛ الكتابة دائمًا في النهاية | | x / x+ | إنشاء جديد فقط؛ يفشل إن كان موجودًا | | c / c+ | إنشاء إن لزم بلا تفريغ؛ المؤشر في البداية | أضف b مثل rb للملفات الثنائية،… العلاقة بينهما أن الأول يحدد جانبًا من الحل، والثاني يكمل السلوك أو القيود اللازمة لتطبيقه بصورة صحيحة.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">03</span><p>افترض أن نظامًا تجاهل «الصلاحيات». ما العطل أو الخطر المتوقع، وكيف تصمم اختبارًا يكشفه؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> في Unix: read=4، write=2، execute=1، وتُجمع لكل من owner وgroup وothers. 0644: المالك يقرأ ويكتب، والباقون يقرؤون. 0755: المالك كامل الصلاحيات، والباقون قراءة وتنفيذ. 0600: المالك فقط يقرأ ويكتب. لا تجعل 0777 حلًا افتراضيًا. chmod وسلوك الملكية يختلفان على Windows، وتتحكم صلاحيات نظام التشغيل والمستخدم الذي يشغّل PHP في النتيجة. لاكتشاف الخلل، اختبر مسارًا صحيحًا، وقيمة عند الحد، ومدخلًا غير صالح، ثم راقب النتيجة والآثار الجانبية والسجل بدل الاكتفاء بعدم ظهور Exception.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">04</span><p>حوّل «JSON وSerialization» إلى قرار هندسي قابل للمراجعة. ما الذي ستوثقه وما الحالات التي ستختبرها؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> serialize() وunserialize() يحتفظان ببنية PHP، لكن: :::danger لا تستخدم unserialize() على بيانات غير موثوقة؛ قد يؤدي إلى Object Injection. استخدم JSON للبيانات المتبادلة، أو قيّد allowed_classes عند الضرورة. ::: وثّق سبب الاختيار والبدائل والحدود، واختبر الحالة العادية، والحد الأدنى والأقصى، والفشل الجزئي، وإعادة المحاولة أو التكرار إن كان السلوك يسمح بذلك.</div></details>
</section>
</div>
