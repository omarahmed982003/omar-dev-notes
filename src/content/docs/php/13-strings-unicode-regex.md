---
title: 13. النصوص وUnicode وRegular Expressions
description: Bytes وUTF-8 وmbstring والتطبيع والمقارنة والـRegex الآمن في PHP.
sidebar:
  order: 13
---

## قبل ما تبدأ

ذاكر الدرس على 3 خطوات: افهم المشكلة الأول، تابع المثال، وبعدها جرّب الجزء العملي بنفسك. المصطلحات الجديدة الموجودة تحت متشرحة قبل ما ندخل في التفاصيل.

### كلمات جديدة في الدرس

- **HTTP:** قواعد تبادل الطلبات والردود بين المتصفح والخادم.
- **URL:** العنوان الكامل لمورد على الويب، زي صفحة أو صورة أو نقطة API.
- **Unicode:** معيار بيعطي الحروف والرموز من لغات مختلفة أرقامًا موحدة.
- **UTF-8:** طريقة شائعة لتحويل أرقام Unicode إلى بايتات تُحفظ وتُنقل.


## الحرف اللي شايفه مش شرط يكون Byte واحد

PHP String عبارة عن Bytes. النص الإنجليزي الأساسي غالبًا يخدعنا لأن كل حرف ASCII حجمه Byte واحد، لكن الحرف العربي في UTF-8 غالبًا يحتاج أكثر من Byte، والرمز اللي المستخدم شايفه ممكن يتكوّن من أكتر من Unicode Code Point.

```php
$text = 'عمر';

echo strlen($text), PHP_EOL;    // عدد الـBytes
echo mb_strlen($text), PHP_EOL; // عدد المحارف حسب Encoding
```

علشان كده `strlen()` و`$text[0]` مش اختيارًا صحيحًا لعد أو قص النص العربي. استخدم `mb_*`، ولو محتاج تتعامل مع Grapheme ظاهر للمستخدم استخدم وظائف `intl` المناسبة.

النص يمر بمراحل مختلفة:

```text
Bytes → UTF-8 decoding → Code Points → Grapheme clusters → Display
```

والـRegex مش «بحث سحري». هي لغة تصف Pattern. ابدأ بنمط صغير، ثبّت Anchors لما تريد مطابقة القيمة كلها، واستخدم Unicode Mode `u` للنص UTF-8. وما تستخدمش Regex لتحليل HTML كامل أو تنفيذ Parser معقد موجود له Library موثوقة.

## String في PHP

PHP string سلسلة bytes، وليست قائمة Unicode code points. لذلك:

```php
$text = 'مرحبًا';
echo strlen($text);                 // bytes
echo mb_strlen($text, 'UTF-8');     // characters تقريبًا
```

استخدم UTF-8 عبر التطبيق وقاعدة البيانات وHTTP:

```php
header('Content-Type: text/html; charset=utf-8');
```

`mb_strlen` و`mb_substr` و`mb_strtolower` أنسب للنص متعدد اللغات من نسخ byte-oriented.

## Graphemes والتطبيع

الحرف المرئي قد يتكون من أكثر من code point. امتداد `intl` يوفر أدوات grapheme و`Normalizer`:

```php
$normalized = Normalizer::normalize($input, Normalizer::FORM_C);
```

طبّع عند الحاجة الواضحة مثل البحث أو uniqueness، ولا تغيّر النص الأصلي بلا متطلب. Case folding والقواعد اللغوية أعقد من `strtolower`.

## Formatting آمن

- استخدم interpolation أو `sprintf` للعرض، لا لبناء SQL.
- قارن secrets بـ`hash_equals()` لا `===` عند الحاجة لمقارنة ثابتة الزمن.
- استخدم `htmlspecialchars` عند إخراج نص في HTML، و`rawurlencode` لمعامل URL.
- لا توجد “دالة تعقيم عامة” لكل السياقات.

## Regular Expressions

```php
$ok = preg_match('/\A[A-Z]{2}-\d{6}\z/D', $code) === 1;
```

- استخدم anchors واضحة.
- افحص `preg_last_error_msg()` عند الفشل.
- ضع حدودًا لطول input قبل regex معقدة.
- تجنب backtracking كارثي في patterns على نص غير موثوق.
- لا تستخدم regex لتحليل HTML أو JSON عندما يوجد parser.

## مثال استخراج

```php
if (preg_match('/\A(?<country>[A-Z]{2})-(?<number>\d{6})\z/D', $code, $m)) {
    $country = $m['country'];
    $number = $m['number'];
}
```

بعد مطابقة الشكل طبّق قواعد المجال؛ الشكل الصحيح لا يعني أن القيمة مسموحة.

## تدريب عملي متدرج

<details><summary>1. ليه strlen مش طول اسم عربي للمستخدم؟</summary><p>لأنها تعد Bytes. استخدم <code>mb_strlen()</code> للمحارف، أوGrapheme Functions لو الرمز الظاهر ممكن يتكون من أكثر من Code Point.</p></details>

<details><summary>2. اكتب Pattern لرقم طلب كامل مثل ORD-1234</summary><p>استخدم Anchors: <code>/\AORD-\d{4}\z/D</code> أوصيغة مكافئة مناسبة، واختبر النص الكامل وقيمة فيها Prefix أوNewline.</p></details>

<details><summary>3. ليه لازم تحدد حدًا لطول المدخل قبل Regex مكلفة؟</summary><p>علشان تمنع استهلاك CPU وMemory بمدخل ضخم أوPattern له Backtracking سيئ.</p></details>

## مسائل مرتبطة بالدرس

<details><summary>لماذا قد تفشل <code>strlen</code> في عد الحروف المرئية؟</summary><p>لأنها تعد bytes، وحرف UTF-8 قد يستخدم أكثر من byte؛ استخدم mbstring أو grapheme حسب المعنى المطلوب.</p></details>

<details><summary>ما خطر regex على مدخل طويل غير موثوق؟</summary><p>نمط سيئ قد يسبب backtracking مكلفًا؛ حدّ طول الإدخال وصمّم النمط واختبر حالات عدائية.</p></details>

## شغّل وتحقق

الملف يفرق بين البايتات وcode points في ASCII والعربية وemoji، ويرفض السطر الجديد في المبلغ. اختبار الأداء لنمط regex آخر يحتاج حد مدخل وقياسًا منفصلًا.

استخدم [المختبر القابل للتنزيل](/php/00-lab-setup/) للسكربتات المرفقة. أوامر Composer وFPM وDocker والخادم الحقيقي تُنفذ داخل المشروع المُجهز للخدمة، مش مجلد فاضي.

نفّذ نقطة التحقق التالية داخل بيئة الدرس:

~~~bash
php text-lab.php
~~~

**هدف تجربة التكامل الموسعة:** تمر نصوص ASCII والعربية وemoji، ويُقاس الطول بالدالة المناسبة؛ regex الكارثي يرفض بحد زمني أو يُعاد تصميمه.

دوّن كود الخروج والدليل الفعلي. إذا اختلف الناتج، فسر البيئة أو الفرضية التي اختلفت بدل تعديل «المتوقع» حتى يطابق الخطأ.

## اربط النقاط ببعض

افحص أخطاء <code>preg_*</code> وحدود backtracking ولا تقبل regex قد تعلق على input مهاجم. طبّع Unicode قبل مقارنة identifiers عندما يحدد المجال ذلك، لكن احتفظ بالقيمة الأصلية للعرض. escaping يعتمد السياق: HTML text وattribute وURL وJavaScript ليست عملية واحدة.

### جرّب بنفسك

اختبر regex على input طويل عدائي وقارن زمنه بالحالة الطبيعية.
