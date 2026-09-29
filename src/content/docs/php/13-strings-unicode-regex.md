---
title: 13. النصوص وUnicode وRegular Expressions
description: Bytes وUTF-8 وmbstring والتطبيع والمقارنة والـRegex الآمن في PHP.
sidebar:
  order: 13
---

## المشكلة: الاسم ثلاث حروف، لكن strlen تقول ستة

PHP `string` سلسلة **Bytes**، والـByte وحدة تخزين من 8 bits. **Unicode** يعطي الرموز أرقامًا اسمها **code points**. **UTF-8** يحول code point إلى 1–4 Bytes. **Grapheme cluster** مجموعة code points يتعامل معها المستخدم غالبًا كحرف ظاهر واحد. الثلاثة قياسات مختلفة؛ لازم تختار حسب السؤال، مش حسب اسم الدالة.

مثلًا عمر ثلاثة code points وستة Bytes. حرف e مع علامة نبرة منفصلة يبدو رمزًا واحدًا لكنه code point للحرف وآخر للعلامة. Emoji العائلة تجمع عدة رموز وروابط غير ظاهرة. الدرس PHP 8.1+، مع امتدادي `mbstring` و`intl`؛ تحقق بـ`php -m`.

## برنامج يقارن الوحدات الثلاث

احفظ `unicode.php` كـUTF-8 وشغّل `php unicode.php`:

~~~php
<?php
declare(strict_types=1);

$samples = [
    'ASCII' => 'Omar',
    'Arabic' => 'عمر',
    'accent' => "e\u{0301}",
    'family' => "👨‍👩‍👧‍👦",
];
foreach ($samples as $label => $text) {
    if (!mb_check_encoding($text, 'UTF-8')) {
        throw new InvalidArgumentException('Invalid UTF-8');
    }
    printf("%s: bytes=%d points=%d graphemes=%d\n",
        $label, strlen($text), mb_strlen($text, 'UTF-8'), grapheme_strlen($text));
}
$text = 'عمر';
echo 'first byte=', bin2hex($text[0]), PHP_EOL;
echo 'first point=', mb_substr($text, 0, 1, 'UTF-8'), PHP_EOL;
~~~

~~~text
ASCII: bytes=4 points=4 graphemes=4
Arabic: bytes=6 points=3 graphemes=3
accent: bytes=3 points=2 graphemes=1
family: bytes=25 points=7 graphemes=1
first byte=d8
first point=ع
~~~

`\u{0301}` كتابة code point للعلامة في النص ذي التنصيص المزدوج. `mb_check_encoding` تتأكد أن Bytes تشكل UTF-8 صحيحة قبل تفسيرها. `strlen` مناسبة لحجم ملف/طلب، و`mb_strlen` تعد code points، و`grapheme_strlen` تعد المجموعات الظاهرة وفق Unicode/ICU المثبتة. قواعد تجميع الرموز الحديثة قد تختلف مع إصدار ICU؛ الأمثلة هنا رموز معروفة.

`$text[0]` Byte واحدة d8، وهي جزء ناقص من الحرف ع؛ `substr` قد يقطع UTF-8 في المنتصف أيضًا. `mb_substr` تقطع حسب code points، لكنها قد تفصل علامة تشكيل؛ `grapheme_substr` أنسب لحد حروف ظاهر. لا تستخدم عدد Graphemes وحده كحد لحجم الطلب، لأن المجموعة قد تحمل علامات كثيرة؛ ضع حد Bytes أيضًا.

## شكلان لنفس الحرف: Normalization

**Normalization** توحيد تمثيلات Unicode المتكافئة وفق قاعدة محددة. NFC تفضل الشكل المركب حيث يوجد. احفظ `normalize.php`:

~~~php
<?php
$composed = "\u{00E9}";
$decomposed = "e\u{0301}";
var_dump($composed === $decomposed);
$normalized = Normalizer::normalize($decomposed, Normalizer::FORM_C);
if ($normalized === false) {
    throw new RuntimeException('Normalization failed');
}
var_dump($composed === $normalized);
echo strlen($decomposed), ' -> ', strlen($normalized), PHP_EOL;
~~~

~~~text
bool(false)
bool(true)
3 -> 2
~~~

أول مقارنة بين Bytes مختلفة، رغم تقارب الشكل. بعد NFC تتطابق. التطبيع لا يحول كل حروف متشابهة بصريًا لنفس المعنى، ولا يصلح XSS. قرر سياسة identifiers والبحث قبل التطبيع، واحتفظ بالأصل للعرض إذا مطلوب. لا تطبع أو تغير Password من نفسك. `mb_strtolower` أنسب من strtolower للنص المتعدد، لكن case folding والترتيب اللغوي لهما قواعد؛ `Collator` من intl للترتيب المحلي عند الحاجة.

## Regex: وصف شكل صغير، مش Parser لكل شيء

**Regular expression** نمط يصف شكل النص. ابدأ بشرط طول ثم pattern بسيطة. `\A` بداية النص الحقيقية، و`\z` نهايته الحقيقية. `[0-9]` رقم ASCII، و`{4}` أربع مرات. `(?<id>...)` مجموعة باسم لالتقاط جزء. حرف `u` بعد delimiter يفعل UTF-8 mode؛ لا يغير كل قواعد المجال تلقائيًا.

برنامج `code.php` يقبل ORD وأربع أرقام فقط:

~~~php
<?php
function orderId(string $input): ?string
{
    if (strlen($input) > 32) {
        return null;
    }
    $matched = preg_match('/\AORD-(?<id>[0-9]{4})\z/u', $input, $matches);
    if ($matched === false) {
        throw new RuntimeException(preg_last_error_msg());
    }
    return $matched === 1 ? $matches['id'] : null;
}
foreach (['ORD-1234', 'xORD-1234', "ORD-1234\n", 'ORD-0000'] as $input) {
    echo json_encode($input), ' => ', orderId($input) ?? 'invalid', PHP_EOL;
}
~~~

~~~text
"ORD-1234" => 1234
"xORD-1234" => invalid
"ORD-1234\n" => invalid
"ORD-0000" => 0000
~~~

الدالة تعيد النص لا int فتحافظ على الأصفار. فحص الطول قبل المحرك يحد العمل. `preg_match` تعيد 1 للتطابق و0 لعدم التطابق وfalse للخطأ؛ لا تخلط 0 وfalse. المجموعة لا تُقرأ إلا بعد نجاح المطابقة. قبول 0000 شكليًا لا يعني وجود طلب بهذا الرقم؛ التحقق من البيانات خطوة أخرى.

**غلط:** `/^ORD-[0-9]{4}$/` قد يقبل موضع نهاية قبل newline أخيرة؛ `\z` أدق لعقد النص الكامل. وأنماط مثل `(a+)+` قد تسبب **backtracking** مكلفًا: المحرك يجرب تقسيمات كثيرة عند قرب الفشل. استبدلها بنمط أبسط، ضع حدود طول، وافحص أخطاء PCRE. لا تشغّل pattern مستخدم غير موثوق بحرية. JSON وHTML لهما Parsers؛ Regex ليست بديلًا عامًا.

## العرض والترميز حسب المكان

**Validation** تقرر هل البيانات مسموحة. **Encoding** تجعل البيانات نصًا في سياق العرض بدل أن تُفهم كتعليمات. لا توجد دالة تعقيم عامة. احفظ `escaping.php`:

~~~php
<?php
$name = '<Omar & Mona>';
echo htmlspecialchars($name, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8'), PHP_EOL;
echo '/search?q=', rawurlencode($name), PHP_EOL;
echo json_encode(['name' => $name], JSON_THROW_ON_ERROR), PHP_EOL;
~~~

~~~text
&lt;Omar &amp; Mona&gt;
/search?q=%3COmar%20%26%20Mona%3E
{"name":"<Omar & Mona>"}
~~~

HTML text/quoted attributes تحتاج htmlspecialchars، ومعامل URL يحتاج rawurlencode أو http_build_query؛ لو الرابط داخل HTML attribute يحتاج ترميز HTML بعد بناء URL. JavaScript سياق آخر؛ استخدم استجابة JSON منفصلة أو آلية embedding آمنة، مش concatenation. `sprintf`/interpolation للعرض، لا لبناء SQL. الأسرار الثابتة الطول مثل CSRF tokens تقارن بـ`hash_equals`؛ دي وظيفة مختلفة عن مقارنة نصوص المستخدم.

## توقع، شخّص، كمّل

<details><summary>توقع قياسات e مع U+0301</summary><p>3 Bytes و2 code points و1 grapheme. الأول حرف ASCII ببايت والثاني علامة ببايتين؛ الشاشة تجمعهما.</p></details>

<details><summary>Debugging: قص اسم عربي بـsubstr($name, 0, 1)</summary><p>تأخذ Byte واحدة وقد تنتج UTF-8 تالفة. استخدم mb_substr للـcode points أو grapheme_substr لحرف ظاهر، حسب عقدك.</p></details>

<details><summary>كمّل Regex تقبل AB-123456 كاملة</summary><p><code>/\A[A-Z]{2}-[0-9]{6}\z/</code>. اختبر بداية زائدة ونهاية newline. بعدها افحص إن كان كود البلد مسموحًا؛ الشكل وحده مش قاعدة المجال.</p></details>

<details><summary>preg_match رجعت false؛ هل أقول فقط إن الكود غير مطابق؟</summary><p>لا. 0 هي عدم التطابق. false خطأ نمط أو encoding أو حد محرك؛ افحص preg_last_error_msg وتعامل معه عند حد التطبيق.</p></details>

شغّل `php text-lab.php` في [المختبر](/php/00-lab-setup/). دفتر الملاحظات سيحد Bytes وcode points ويتحقق من UTF-8 ثم يرمز عند العرض. [مرجع Grapheme](https://www.php.net/manual/en/function.grapheme-strlen.php).
