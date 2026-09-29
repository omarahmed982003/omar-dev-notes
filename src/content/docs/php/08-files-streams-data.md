---
title: 8. الملفات والـ Streams وJSON وCSV
description: نظام الملفات، أوضاع الفتح، الصلاحيات، streams وwrappers وcontexts وJSON وCSV.
sidebar:
  order: 8
---

## المشكلة: البيانات بتختفي لما البرنامج يقفل

المتغيرات في الذاكرة مؤقتة. لو عايزين الملاحظة تفضل موجودة بين تشغيلتين، نكتبها في ملف. الملف Bytes على التخزين؛ البرنامج يفتحه ويقرأ أو يكتب ثم يقفله. **Stream** واجهة للتعامل مع البيانات وهي بتتحرك، زي شباك تقرأ منه جزءًا في كل مرة. **Handle** المقبض اللي يرجع من `fopen`، مش محتوى الملف.

**Cursor** موضع القراءة/الكتابة الحالي. **Chunk** قطعة Bytes بحجم محدد. **Buffer** مساحة وسيطة لتجميع البيانات. فهم الثلاثة يمنع تحميل ملف ضخم كله لمجرد عد سطوره. الأمثلة PHP 8.0+، و`finally` قسم تنظيف ينفذ بعد المحاولة حتى لو فشلت؛ التفاصيل في الدرس 11.

## أول تجربة كاملة بدون ملفات على جهازك

احفظ `stream.php` وشغّل `php stream.php`. `php://temp` Stream مؤقت يبدأ في الذاكرة ويمكن أن ينتقل لملف مؤقت عند تجاوز حد الذاكرة الخاص به:

~~~php
<?php
$stream = fopen('php://temp', 'w+b');
if ($stream === false) {
    throw new RuntimeException('Cannot open stream');
}
try {
    $text = "Ali\nMona\n";
    $offset = 0;
    while ($offset < strlen($text)) {
        $written = fwrite($stream, substr($text, $offset));
        if ($written === false || $written === 0) {
            throw new RuntimeException('Write made no progress');
        }
        $offset += $written;
    }
    echo 'position=', ftell($stream), PHP_EOL;
    if (!rewind($stream)) {
        throw new RuntimeException('Cannot rewind');
    }
    $count = 0;
    while (($line = fgets($stream)) !== false) {
        $count++;
        echo $count, ': ', rtrim($line, "\r\n"), PHP_EOL;
    }
    if (!feof($stream)) {
        throw new RuntimeException('Read failed before EOF');
    }
    echo "count={$count}", PHP_EOL;
} finally {
    fclose($stream);
}
~~~

~~~text
position=9
1: Ali
2: Mona
count=2
~~~

السطر الأول يفتح موردًا؛ المقارنة الصارمة تميز الفشل. النص 9 Bytes: 3 للاسم الأول وnewline و4 للثاني وnewline. `fwrite` تعيد عدد Bytes المكتوبة؛ حلقة offset تعيد محاولة **الباقي فقط** وتوقف لو العدد صفر حتى لا تعلق. `ftell` يعرض المؤشر عند النهاية. `rewind` يرجعه للبداية، وإلا القراءة بعد الكتابة قد لا تجد شيئًا.

`fgets` تقرأ سطرًا، و`!== false` تميز السطر `'0'` أو الفارغ عن الفشل. `rtrim` هنا تزيل نهايات السطور فقط، مش المسافات المقصودة. `feof` بعد القراءة يميز نهاية طبيعية عن خطأ. `fclose` في finally يحرر المورد. الذاكرة في القراءة السطرية تعتمد على أطول سطر، مش ثابتة لو سطر واحد ضخم؛ `fread($stream, 8192)` تناسب قطعًا محدودة.

## اختار وضع الفتح قبل ما تكتب

| Mode | البداية والنتيجة |
|---|---|
| `r / r+` | الملف لازم يوجد؛ قراءة / قراءة وكتابة من البداية |
| `w / w+` | يمسح المحتوى فور الفتح أو ينشئ الملف |
| `a / a+` | ينشئ إن لزم؛ الكتابة دائمًا في النهاية |
| `x / x+` | إنشاء حصري؛ يفشل لو موجود |
| `c / c+` | ينشئ إن لزم بلا مسح؛ المؤشر في البداية |

`+` تضيف القراءة والكتابة معًا، و`b` تمنع تحويلات النص الخاصة ببعض الأنظمة. **خطأ خطير:** فتح الملف بـ`w` ثم محاولة أخذ قفل؛ المسح سبق القفل. لو بتعدل بيانات موجودة ابدأ بـ`c+` وخذ القفل قبل القراءة/التعديل. وجود الملف أو نتيجة `is_writable` فحص مبدئي فقط؛ العملية نفسها قد تفشل.

## JSON: شكل تخزين، مش تحقق من المعنى

**Serialization** تحويل بيانات إلى تمثيل قابل للحفظ. JSON مناسبة لقيم بسيطة مشتركة بين اللغات. احفظ `notes-json.php` في مجلد تجارب قابل للكتابة؛ المثال يستبدل `notes-demo.json` في نفس المجلد:

~~~php
<?php
$path = __DIR__ . '/notes-demo.json';
$notes = [['name' => 'Omar', 'text' => 'Learn streams']];
$json = json_encode($notes, JSON_THROW_ON_ERROR);
$bytes = file_put_contents($path, $json, LOCK_EX);
if ($bytes === false || $bytes !== strlen($json)) {
    throw new RuntimeException('Save failed');
}
$raw = file_get_contents($path);
if ($raw === false) {
    throw new RuntimeException('Read failed');
}
$loaded = json_decode($raw, true, flags: JSON_THROW_ON_ERROR);
if (!is_array($loaded) || !is_string($loaded[0]['text'] ?? null)) {
    throw new RuntimeException('Unexpected data shape');
}
echo $loaded[0]['text'], PHP_EOL;
~~~

~~~text
Learn streams
~~~

`__DIR__` يثبت المسار. `json_encode` تحول Array إلى نص؛ `JSON_THROW_ON_ERROR` تمنع فشلًا صامتًا. `file_put_contents` مناسبة لملف صغير وتعيد عدد Bytes. `LOCK_EX` تنظم الكتابة بين مشاركين يستخدمون نفس القفل؛ لا تجعل دورة read→modify→write كلها آمنة تلقائيًا، ولا تمنع قارئًا لا يأخذ قفلًا من رؤية بيانات جزئية.

`json_decode(..., true)` تعيد Objects كـArrays، لكن JSON صالحة قد تكون عددًا أو null؛ لذلك فحص الشكل منفصل. `json_validate` من 8.3 مفيدة لو محتاج التحقق النحوي فقط؛ لو هتفك JSON لا تفحصها ثم تفكها مرتين بلا داعٍ. `JSON_UNESCAPED_UNICODE` تغير شكل النص المعروض لا معنى البيانات. لا تستخدم `unserialize` مع مدخل غير موثوق؛ `allowed_classes` ليست ضمانًا لجعل بيانات مهاجم آمنة.

## CSV: الفاصلة ممكن تكون جوه الحقل

**CSV** جدول نصي؛ الحقول التي تحتوي فاصلة أو تنصيصًا تحتاج قواعد اقتباس. `explode(',')` لا تفهمها. احفظ `csv.php`:

~~~php
<?php
$stream = fopen('php://temp', 'w+b');
if ($stream === false) {
    throw new RuntimeException('Cannot open CSV');
}
try {
    $expected = ['a,b', 'say "hi"', 'back\\slash', 'عمر'];
    if (fputcsv($stream, $expected, escape: '') === false) {
        throw new RuntimeException('CSV write failed');
    }
    if (!rewind($stream)) {
        throw new RuntimeException('Cannot rewind');
    }
    $actual = fgetcsv($stream, escape: '');
    if ($actual !== $expected) {
        throw new RuntimeException('CSV round-trip failed');
    }
    echo "CSV round-trip OK", PHP_EOL;
} finally {
    fclose($stream);
}
~~~

~~~text
CSV round-trip OK
~~~

البرنامج يكتب ثم يعيد القراءة ويقارن الأنواع والقيم. `escape: ''` صريحة لأن الاعتماد على الافتراضي deprecated من 8.4، ولأننا نريد مضاعفة التنصيص القياسية. `str_getcsv` لتحليل صف موجود كنص. اتفق على encoding والفاصل، وافحص عدد الأعمدة وأنواعها بعد التحليل. لو الملف سيفتح في Spreadsheet، قيم تبدأ بصيغة قد تُنفذ كـFormula؛ طبّق سياسة تصدير مناسبة.

## Wrapper وContext وFilter من غير خلط

**Wrapper** يربط عنوانًا بمصدر: `file://` ملفات، `php://memory` ذاكرة فقط، `php://temp` ذاكرة ثم تخزين مؤقت، `php://input` جسم طلب HTTP الخام. توجد أيضًا `http://` و`ftp://` و`data://` و`compress.zlib://` حسب الإضافات والإعدادات؛ يمكن تسجيل Wrapper بـ`stream_wrapper_register`، لكن مش مطلوب للمبتدئ.

**Context** إعدادات العملية مثل timeout وHTTP headers؛ لا يحول الفشل لنجاح. **Filter** يحول Bytes أثناء مرورها. تجربة `filter.php` كاملة:

~~~php
<?php
$stream = fopen('php://temp', 'w+b');
if ($stream === false) {
    throw new RuntimeException('Open failed');
}
try {
    if (fwrite($stream, 'hello') !== 5 || !rewind($stream)) {
        throw new RuntimeException('Prepare failed');
    }
    $filter = stream_filter_append($stream, 'string.toupper', STREAM_FILTER_READ);
    if ($filter === false) {
        throw new RuntimeException('Filter failed');
    }
    $text = stream_get_contents($stream);
    if ($text === false) {
        throw new RuntimeException('Read failed');
    }
    echo $text, PHP_EOL;
} finally {
    fclose($stream);
}
~~~

~~~text
HELLO
~~~

نربط الفلتر بالقراءة فقط، فنقرأ نسخة محولة؛ فلتر ASCII ده مش بديلًا لتحويل Unicode. لإنشاء إعداد HTTP مثلًا `stream_context_create(['http' => ['timeout' => 3, 'header' => "Accept: application/json\r\n"]])`، ثم تمرره إلى دالة القراءة. الطلب الحقيقي يحتاج فحص status وTLS وحد حجم؛ `ignore_errors` يسمح بقراءة جسم رد فاشل ولا يجعله ناجحًا. `allow_url_fopen` يتحكم في URL wrappers؛ اترك `allow_url_include` معطلًا، ولا تستخدم عنوان مستخدم للقراءة الحرة من شبكة الخادم.

## الحفظ والصلاحيات

في Unix الأرقام قراءة=4 وكتابة=2 وتنفيذ=1 لكل مالك/مجموعة/آخرين؛ `0600` للمالك فقط، `0644` تسمح للآخرين بالقراءة، `0755` شائعة للمجلدات. `chmod($path, 0640)` ليست بديلًا عن ضبط مستخدم الخدمة، وWindows تعتمد ACLs؛ لا تعالج خطأ الصلاحيات بـ`0777`.

لإضافة سجلات خذ `flock(..., LOCK_EX)`، اكتب كل Bytes، ثم `fflush` وحرر القفل في finally. القارئ المتعاون يأخذ `LOCK_SH`. لمنع رؤية نسخة جزئية عند الاستبدال استخدم ملفًا مؤقتًا في نفس filesystem ثم rename مع فحص الفشل واختبار المنصة؛ `fflush` وحدها لا تضمن النجاة من انقطاع الكهرباء. القفل المنفصل الثابت مطلوب لو بتستبدل الملف نفسه وعايز تنسيقًا بين عمليات متعددة.

مسار التخزين يحدده التطبيق، لا اسم يرسله المستخدم. `realpath` مفيد للموجود، لكنه يعيد false لملف جديد؛ تحقق من المجلد الأب والحد الفاصل، وانتبه للروابط الرمزية. JSON ضخمة تحتاج parser تدفقيًا، مش مجرد fopen قبل json_decode.

## توقع، شخّص، كمّل

<details><summary>توقع: حذف rewind من stream.php</summary><p>المؤشر بعد الكتابة عند 9، فتبدأ القراءة من النهاية ولا تجد السطور؛ count=0. المقبض لا يرجع للبداية تلقائيًا.</p></details>

<details><summary>Debugging: if (!$raw) بعد file_get_contents</summary><p>يخلط الفشل بالنص الفارغ أو '0'. الصحيح <code>$raw === false</code>، ثم افحص إن كان الفراغ مسموحًا حسب العقد.</p></details>

<details><summary>كمّل شرط يوقف حلقة الكتابة بدون تقدم</summary><p><code>$written === false || $written === 0</code>. فحص false وحدها يترك احتمال دوران بلا نهاية عند صفر.</p></details>

<details><summary>هل LOCK_EX على الحفظ وحده يمنع ضياع تحديثين قرآ نفس الملف؟</summary><p>لا. قد يقرأ الاثنان الحالة القديمة ثم يستبدل الثاني تعديل الأول. اقفل دورة القراءة والتعديل والكتابة كلها، أو استخدم قاعدة بيانات بمعاملة عند تطور التطبيق.</p></details>

شغّل أيضًا `php stream-lab.php fixtures/large.csv` من [المختبر](/php/00-lab-setup/). في الدرس 17 سنحفظ كل ملاحظة في ملف مستقل تحت مجلد خاص؛ اختبر ملفًا فارغًا وآخر مفقودًا وJSON تالفة كحالات مختلفة.

مراجع: [Streams](https://www.php.net/manual/en/book.stream.php)، [CSV](https://www.php.net/manual/en/function.fgetcsv.php)، [الكتابة](https://www.php.net/manual/en/function.fwrite.php).
