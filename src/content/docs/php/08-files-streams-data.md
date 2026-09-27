---
title: 8. الملفات والـ Streams وJSON وCSV
description: نظام الملفات، أوضاع الفتح، الصلاحيات، streams وwrappers وcontexts وJSON وCSV.
sidebar:
  order: 8
---

## قبل ما تبدأ

ذاكر الدرس على 3 خطوات: افهم المشكلة الأول، تابع المثال، وبعدها جرّب الجزء العملي بنفسك. المصطلحات الجديدة الموجودة تحت متشرحة قبل ما ندخل في التفاصيل.

### كلمات جديدة في الدرس

- **HTTP:** قواعد تبادل الطلبات والردود بين المتصفح والخادم.
- **URL:** العنوان الكامل لمورد على الويب، زي صفحة أو صورة أو نقطة API.
- **TLS:** طبقة تشفير بتحمي البيانات وهي ماشية بين طرفين.
- **API:** واجهة محددة تسمح لبرنامج يطلب بيانات أو ينفّذ عملية عند برنامج آخر.
- **Loop:** حلقة تكرار تعيد تنفيذ مجموعة تعليمات وفق شرط.


## الملف مش مجرد نص جاهز في الذاكرة

الملف بيانات موجودة على Storage. علشان برنامجك يتعامل معها، نظام التشغيل يفتح موردًا، والبرنامج يقرأ أو يكتب Bytes، وبعدها يقفل المورد. لو الملف كبير، تحميله كله في RAM ممكن يستهلك الذاكرة؛ القراءة سطرًا سطرًا تحافظ على استهلاك ثابت تقريبًا.

```php
$path = __DIR__ . '/orders.txt';
$handle = fopen($path, 'rb');

if ($handle === false) {
    throw new RuntimeException("Cannot open {$path}");
}

try {
    while (($line = fgets($handle)) !== false) {
        echo rtrim($line), PHP_EOL;
    }
} finally {
    fclose($handle);
}
```

الـStream واجهة موحدة لتدفق البيانات، سواء المصدر ملفًا أوMemory أوNetwork. الـHandle اللي رجع من `fopen()` مش محتوى الملف؛ هو مورد نستخدمه للقراءة والكتابة.

قبل الكتابة اسأل: هل عايز تمسح المحتوى القديم، تضيف في النهاية، ولا تنشئ ملفًا جديدًا فقط لو مش موجود؟ اختيار Mode غلط، خصوصًا `w`، ممكن يمسح الملف فور فتحه. وافحص نتيجة كل عملية؛ وجود صلاحية للمجلد لا يضمن إن القرص فيه مساحة أو إن الكتابة اكتملت.

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
if ($out === false) { throw new RuntimeException('Cannot create CSV'); }
fputcsv($out, ['id', 'name'], escape: '');
fputcsv($out, [1, 'Omar'], escape: '');
fclose($out);

$in = fopen(__DIR__ . '/users.csv', 'rb');
if ($in === false) { throw new RuntimeException('Cannot read CSV'); }
while (($row = fgetcsv($in, escape: '')) !== false) {
    [$id, $name] = $row;
}
fclose($in);

$row = str_getcsv('2,"Mona Ahmed"', escape: '');
```

استخدم دوال CSV بدل `explode(',')` لأنها تتعامل مع علامات الاقتباس والفواصل داخل الحقول.

## تدريب عملي متدرج

<details><summary>1. إيه خطر فتح ملف موجود بـ<code>w</code>؟</summary><p>الوضع يمسح المحتوى عند الفتح. استخدم <code>a</code> للإضافة، أو<code>x</code> للإنشاء الحصري، أوMode يناسب سياسة البرنامج.</p></details>

<details><summary>2. اقرأ ملفًا كبيرًا من غير تحميله كاملًا</summary><p>افتحه بـ<code>fopen</code>، واقرأ باستخدام <code>fgets</code> داخل Loop، وافحص الفشل، واقفل الـHandle داخل <code>finally</code>.</p></details>

<details><summary>3. ليه <code>explode(',', $line)</code> مش CSV Parser؟</summary><p>لأن الحقل نفسه ممكن يحتوي فاصلة داخل Quotes. استخدم <code>fgetcsv()</code> أو<code>str_getcsv()</code>.</p></details>

## مسائل مرتبطة بالدرس

<details><summary>لماذا لا تقرأ ملفًا ضخمًا كاملًا في الذاكرة؟</summary><p>قد تتجاوز memory limit؛ اقرأه stream أو على دفعات وعالج كل جزء ثم اتركه.</p></details>

<details><summary>ماذا تفعل بعد فشل <code>json_decode</code>؟</summary><p>افحص الخطأ أو استخدم <code>JSON_THROW_ON_ERROR</code>، ولا تعامل <code>null</code> الصامت كبيانات صحيحة.</p></details>

## شغّل وتحقق

استخدم [المختبر القابل للتنزيل](/php/00-lab-setup/) للسكربتات المرفقة. أوامر Composer وFPM وDocker والخادم الحقيقي تُنفذ داخل المشروع المُجهز للخدمة، مش مجلد فاضي.

نفّذ نقطة التحقق التالية داخل بيئة الدرس:

~~~bash
php stream-lab.php fixtures/large.csv
~~~

**معيار النجاح:** عدد السطور يطابق fixture وتظل الذاكرة تحت الميزانية؛ الملف المفقود أو غير المقروء يعطي فشلًا مختلفًا عن الملف الفارغ.

دوّن كود الخروج والدليل الفعلي. إذا اختلف الناتج، فسر البيئة أو الفرضية التي اختلفت بدل تعديل «المتوقع» حتى يطابق الخطأ.

## اربط النقاط ببعض

للتحديث الآمن اكتب إلى temporary file ثم flush/close وrename مناسب للمنصة، واستخدم locking عندما توجد كتابات متزامنة. طبّع المسار وتحقق أنه داخل directory مسموح لمنع traversal. JSON الكبير قد يحتاج streaming parser، وencoding/CSV dialect جزء من العقد.

### جرّب بنفسك

شغّل كاتبين متزامنين وتأكد أن القارئ لا يرى ملفًا جزئيًا.


## كتابة CSV وقراءته على PHP 8.4+

حدد `escape: ''` صراحة؛ الاعتماد على القيمة الافتراضية deprecated من PHP 8.4. القيمة الفارغة تستخدم مضاعفة التنصيص بدل معالجة backslash الخاصة بـPHP. البرنامج الكامل يكتب فاصلة وتنصيصًا وbackslash وعربيًا، ثم يقرأها ويتأكد من التطابق الحرفي.

```php
<?php
$handle = fopen('php://temp', 'w+');
if ($handle === false) throw new RuntimeException('Cannot open stream');
try {
    $expected = ['a,b', 'say "hi"', 'back\\slash', 'عمر'];
    if (fputcsv($handle, $expected, escape: '') === false) throw new RuntimeException('Write failed');
    rewind($handle);
    $actual = fgetcsv($handle, escape: '');
    if ($actual !== $expected) throw new RuntimeException('CSV round-trip failed');
    echo "CSV round-trip OK", PHP_EOL;
} finally { fclose($handle); }
```
