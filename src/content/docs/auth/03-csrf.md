---
title: 3. الحماية من CSRF
description: كيف يستغل CSRF جلسة المستخدم وكيف نمنعه بالـtokens وSameSite والتحقق من المصدر.
sidebar:
  order: 3
---

## ما الهجوم؟

في CSRF يخدع موقع خبيث متصفح مستخدم مسجل الدخول ليرسل request غير مرغوب إلى موقع موثوق. المتصفح قد يرفق Cookies تلقائيًا، فيرى الخادم جلسة صحيحة لكنه لا يعرف أن المستخدم لم يقصد الفعل.

مثال خطر: Endpoint يغيّر البريد عبر GET أو يقبل POST بلا إثبات لنية المستخدم.

## Synchronizer Token Pattern

أنشئ token عشوائيًا server-side، خزنه في Session، وضعه داخل النموذج:

```php
session_start();

if (!isset($_SESSION['csrf_token'])) {
    $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
}
```

```php
<form method="post" action="/account/email">
    <input type="hidden" name="csrf_token"
           value="<?= htmlspecialchars($_SESSION['csrf_token'], ENT_QUOTES, 'UTF-8') ?>">
    <input type="email" name="email" required>
    <button>تحديث</button>
</form>
```

تحقق قبل تنفيذ أي تغيير:

```php
$sent = $_POST['csrf_token'] ?? '';

if (
    !is_string($sent)
    || !isset($_SESSION['csrf_token'])
    || !hash_equals($_SESSION['csrf_token'], $sent)
) {
    http_response_code(403);
    exit('Invalid CSRF token');
}
```

`hash_equals()` مقارنة ثابتة الزمن نسبيًا. لا تضع token في URL أو Logs، واجعله مرتبطًا بالجلسة أو الفعل وفق نموذجك.

## دفاع متعدد الطبقات

- لا تستخدم GET لتغيير الحالة.
- استخدم `SameSite=Lax` أو `Strict` حيث يناسب.
- تحقق من `Origin` للطلبات الحساسة، واستعمل `Referer` كخيار ثانٍ مدروس.
- في APIs التي لا تعتمد على Cookies، Header مخصص مع Token قد يمنع simple cross-site forms.
- أعد طلب كلمة المرور أو MFA للفعل شديد الحساسية.
- حدّد Content-Type المتوقع ولا تقبل أشكالًا أكثر من الحاجة.

:::caution
CORS ليست بديلًا عن CSRF protection؛ وبعض الطلبات «البسيطة» يمكن إرسالها دون preflight. كذلك XSS في موقعك يستطيع غالبًا قراءة token أو تنفيذ الطلب نفسه، لذلك إصلاح XSS أساسي.
:::

## Double-submit Cookie

يمكن إرسال قيمة في Cookie وقيمة في header/body ثم مقارنتهما، لكن الأفضل أن تكون القيمة موقعة ومرتبطة بالجلسة لمنع cookie injection. لا تخترع البروتوكول إن كان framework يوفر حماية مدققة.

## Token lifecycle

لا يلزم دائمًا تدوير token بعد كل request؛ ذلك قد يكسر tabs والطلبات المتزامنة. Token لكل جلسة أو لكل نموذج كلاهما صحيح حسب الخطر وتجربة الاستخدام. دوّره عند تغيير الجلسة أو تسجيل الدخول، وحدد فشلًا واضحًا دون تنفيذ جزئي.
