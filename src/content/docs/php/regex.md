---
title: "Regex: افحص شكل string واقرأ النتيجة"
prev: {"link":"/php/13-strings-unicode-regex/","label":"Strings وUnicode"}
next: {"link":"/php/cli-expenses-project/","label":"مشروع CLI: مصروفات من غير web"}
description: "Regex: افحص شكل string واقرأ النتيجة"
sidebar:
  order: 13.5
---

المتطلبات: string وif وfunctions. **Regex** نمط يصف شكلًا من النص، مش تحققًا من وجود سجل أوصلاحية مستخدم. الـ**Pattern** وصف الشكل المطلوب، و**Match** تحقق تطابق النص معاه. **PCRE** عائلة محركات تنفيذ Regex اللي PHP بتعتمد عليها؛ **Parser** برنامج بيفهم بنية صيغة أوسع زي JSON. string ممكن تكون صحيحة كـUTF-8 وتظل لا تطابق عقد الكود المطلوب.

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

function تعيد النص لا int فتحافظ على الأصفار. فحص الطول قبل المحرك يحد العمل. `preg_match` تعيد 1 للتطابق و0 لعدم التطابق وfalse للخطأ؛ لا تخلط 0 وfalse. المجموعة لا تُقرأ إلا بعد نجاح المطابقة. قبول 0000 شكليًا لا يعني وجود طلب بهذا الرقم؛ التحقق من البيانات خطوة أخرى.

**غلط:** `/^ORD-[0-9]{4}$/` قد يقبل موضع نهاية قبل newline أخيرة؛ `\z` أدق لعقد النص الكامل. وأنماط مثل `(a+)+` قد تسبب **backtracking** مكلفًا: المحرك يجرب تقسيمات كثيرة عند قرب الفشل. استبدلها بنمط أبسط، ضع حدود طول، وافحص أخطاء PCRE. لا تشغّل pattern مستخدم غير موثوق بحرية. JSON وHTML لهما Parsers؛ Regex ليست بديلًا عامًا.


## جرّب بنفسك

اختبر ORD-0042 وORD-42 وXORD-0042 وORD-0042 مع newline أخيرة. توقع النتيجة من الـpattern قبل التنفيذ.

<details><summary>راجع بعد المحاولة</summary>

اتبع anchors والطول المحدد. 0 من preg_match معناها عدم تطابق؛ false معناها فشل تنفيذ النمط، مش نفس الحالة.

</details>

## توقع وشخّص

<details><summary>كمّل Regex تقبل AB-123456 كاملة</summary><p><code>/\A[A-Z]{2}-[0-9]{6}\z/</code>. اختبر بداية زائدة ونهاية newline. بعدها افحص إن كان كود البلد مسموحًا؛ الشكل وحده مش قاعدة المجال.</p></details>

<details><summary>preg_match رجعت false؛ هل أقول فقط إن الكود غير مطابق؟</summary><p>لا. 0 هي عدم التطابق. false خطأ نمط أو encoding أو حد محرك؛ افحص preg_last_error_msg وتعامل معه عند حد التطبيق.</p></details>

[ارجع لدليل PHP](/php/).

