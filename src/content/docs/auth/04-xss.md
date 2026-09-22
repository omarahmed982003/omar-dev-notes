---
title: 4. الحماية من XSS
description: Stored وReflected وDOM XSS والترميز حسب سياق HTML وAttribute وURL وJavaScript.
sidebar:
  order: 4
---

## ما XSS؟

تحدث Cross-Site Scripting عندما تُفسر بيانات غير موثوقة ككود داخل المتصفح.

- **Reflected:** ترجع payload مباشرة في نفس الاستجابة، مثل قيمة بحث.
- **Stored:** تُحفظ في قاعدة البيانات ثم تُعرض لضحايا آخرين.
- **DOM-based:** JavaScript في الصفحة ينقل بيانات إلى sink خطير مثل `innerHTML`.

النتائج قد تشمل سرقة بيانات متاحة للصفحة، تنفيذ أفعال بحساب المستخدم، تعديل الواجهة أو التصيد. `HttpOnly` يحمي قراءة Cookie فقط، ولا يمنع تنفيذ request من الصفحة المصابة.

## HTML text وattributes

```php
function e(string $value): string
{
    return htmlspecialchars($value, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}
```

```php
<h1><?= e($title) ?></h1>
<input value="<?= e($displayName) ?>">
```

ضع attribute بين quotes. لا تسمح للمستخدم بتحديد اسم attribute أو event handler.

## URL context

رمّز **قيمة المعامل** بـ`rawurlencode` ثم رمّز الرابط كـHTML عند إدخاله في attribute:

```php
$url = '/search?q=' . rawurlencode($query);
?>
<a href="<?= e($url) ?>">بحث</a>
```

لا يكفي encoding لمنع `javascript:` scheme. حلّل URL وطبّق allow-list للبروتوكول والمضيف عند الروابط الخارجية.

## JavaScript وJSON

الأفضل عدم إدخال نصوص مباشرة في inline JavaScript. إذا لزم نقل بيانات، استخدم JSON بخصائص hex:

```php
<script>
const profile = <?= json_encode(
    $profile,
    JSON_HEX_TAG | JSON_HEX_AMP | JSON_HEX_APOS | JSON_HEX_QUOT
) ?>;
</script>
```

في DOM استخدم `textContent` بدل `innerHTML` للنص:

```js
message.textContent = untrustedValue;
```

## عندما تريد السماح بـHTML

`htmlspecialchars` سيعرض HTML كنص. إذا كان المنتج يسمح بمحتوى غني، استخدم HTML sanitizer موثوقًا بسياسة allow-list، وحدّثه باستمرار. Regex ليست HTML parser.

:::danger[أماكن خطرة]
تجنب وضع غير الموثوق داخل `<script>` أو `<style>` أو HTML comments أو أسماء tags/attributes أو event handlers، وتجنب `eval` و`document.write`.
:::

## طبقات إضافية

- Auto-escaping في template engine، مع مراجعة raw/unsafe escape hatches.
- Content Security Policy قوية، ويفضل nonce/hash بدل `unsafe-inline`.
- Trusted Types لتطبيقات DOM الكبيرة حيث يناسب.
- Cookies بـHttpOnly/Secure/SameSite.
- MIME صحيح؛ JSON يجب أن يخرج `application/json`.

CSP طبقة تقليل ضرر وليست بديلًا عن encoding وsanitization.

## خريطة الدرس

<div class="lesson-diagram" role="img" aria-label="خريطة مفاهيم: الحماية من XSS">
<p class="lesson-diagram-title">خريطة مفاهيم: الحماية من XSS</p>
<div class="diagram-flow">
<div class="diagram-node input"><span>ما XSS؟</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>HTML text وattributes</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>URL context</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node decision"><span>JavaScript وJSON</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node output"><span>عندما تريد السماح بـHTML</span></div>
</div>
</div>

## تأكد من فهمك

<div class="lesson-quiz" role="list">
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">01</span><p>اشرح «ما XSS؟» كأنك تراجع تطبيقًا حقيقيًا: ما الهدف وما أهم قيد يجب الانتباه له؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> تحدث Cross-Site Scripting عندما تُفسر بيانات غير موثوقة ككود داخل المتصفح. Reflected: ترجع payload مباشرة في نفس الاستجابة، مثل قيمة بحث. Stored: تُحفظ في قاعدة البيانات ثم تُعرض لضحايا آخرين. DOM-based: JavaScript في الصفحة ينقل بيانات إلى sink خطير مثل innerHTML. النتائج قد تشمل سرقة بيانات متاحة للصفحة، تنفيذ أفعال بحساب المستخدم، تعديل الواجهة أو التصيد. HttpOnly يحمي قراءة Cookie فقط، ولا يمنع تنفيذ request من… عمليًا، لا يكفي تنفيذ المسار الناجح؛ يجب توثيق الافتراضات والتحقق من القيم والحالات التي قد تكسر هذا السلوك.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">02</span><p>قارن بين «ما XSS؟» و«HTML text وattributes». لماذا لا يغني أحدهما عن الآخر داخل موضوع «الحماية من XSS»؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> في «ما XSS؟»: تحدث Cross-Site Scripting عندما تُفسر بيانات غير موثوقة ككود داخل المتصفح. Reflected: ترجع payload مباشرة في نفس الاستجابة، مثل قيمة بحث. Stored: تُحفظ في قاعدة البيانات ثم تُعرض لضحايا آخرين. DOM-based: JavaScript في الصفحة ينقل بيانات إلى sink خطير مثل innerHTML. النتائج قد تشمل سرقة بيانات متاحة للصفحة، تنفيذ أفعال بحساب المستخدم، تعديل الواجهة أو التصيد. HttpOnly يحمي قراءة Cookie فقط، ولا يمنع تنفيذ request من… أما «HTML text وattributes»: ضع attribute بين quotes. لا تسمح للمستخدم بتحديد اسم attribute أو event handler. العلاقة بينهما أن الأول يحدد جانبًا من الحل، والثاني يكمل السلوك أو القيود اللازمة لتطبيقه بصورة صحيحة.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">03</span><p>افترض أن نظامًا تجاهل «URL context». ما العطل أو الخطر المتوقع، وكيف تصمم اختبارًا يكشفه؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> رمّز قيمة المعامل بـrawurlencode ثم رمّز الرابط كـHTML عند إدخاله في attribute: لا يكفي encoding لمنع javascript: scheme. حلّل URL وطبّق allow-list للبروتوكول والمضيف عند الروابط الخارجية. لاكتشاف الخلل، اختبر مسارًا صحيحًا، وقيمة عند الحد، ومدخلًا غير صالح، ثم راقب النتيجة والآثار الجانبية والسجل بدل الاكتفاء بعدم ظهور Exception.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">04</span><p>حوّل «JavaScript وJSON» إلى قرار هندسي قابل للمراجعة. ما الذي ستوثقه وما الحالات التي ستختبرها؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> الأفضل عدم إدخال نصوص مباشرة في inline JavaScript. إذا لزم نقل بيانات، استخدم JSON بخصائص hex: في DOM استخدم textContent بدل innerHTML للنص: وثّق سبب الاختيار والبدائل والحدود، واختبر الحالة العادية، والحد الأدنى والأقصى، والفشل الجزئي، وإعادة المحاولة أو التكرار إن كان السلوك يسمح بذلك.</div></details>
</section>
</div>
