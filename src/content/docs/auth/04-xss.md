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
