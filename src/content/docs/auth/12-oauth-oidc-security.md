---
title: 12. أمان OAuth وOIDC
description: State وNonce وPKCE وRedirect URI وتخزين التوكينات وBFF والإبطال ومراقبة التكامل.
sidebar:
  order: 12
---

# طبقات حماية مختلفة

لا تستبدل `state` و`nonce` وPKCE ببعضها عشوائيًا:

| الآلية | تحمي أساسًا من |
|---|---|
| `state` مرتبط بالجلسة | CSRF وتبديل معاملات callback |
| OIDC `nonce` | replay/substitution لنتيجة المصادقة |
| PKCE | سرقة أو حقن Authorization Code |
| Redirect URI exact match | إرسال النتيجة إلى وجهة مهاجم |

وفق OAuth Security BCP، PKCE مطلوب للـpublic clients وموصى به أيضًا للـconfidential clients. استخدم قيمًا فريدة لكل معاملة واحذفها عند النجاح أو انتهاء مهلة قصيرة.

## Callback آمن

```php
<?php
declare(strict_types=1);

session_start();

$tx = $_SESSION['oauth'] ?? null;
unset($_SESSION['oauth']); // one-time transaction

if (!is_array($tx) || time() - $tx['created_at'] > 600) {
    throw new RuntimeException('OAuth transaction expired');
}

$returnedState = $_GET['state'] ?? '';
if (
    !is_string($returnedState)
    || !hash_equals($tx['state'], hash('sha256', $returnedState))
) {
    throw new RuntimeException('Invalid state');
}

if (isset($_GET['error'])) {
    // اعرض رسالة آمنة، وسجّل code فقط دون التوكينات.
    throw new RuntimeException('Authorization was not completed');
}

$code = $_GET['code'] ?? null;
if (!is_string($code) || $code === '') {
    throw new RuntimeException('Missing authorization code');
}

// Exchange code once using tx['verifier'] and the exact redirect URI.
```

لا تسجل query كاملة لأن callback قد يحتوي code. ضع `Referrer-Policy: no-referrer` وتجنب third-party scripts في صفحة callback.

## Redirect URIs

- سجل HTTPS URI كاملة وطابقها حرفيًا؛ لا تستخدم wildcard للإنتاج.
- اسمح loopback/custom URI وفق قواعد native apps الرسمية فقط.
- لا تجعل callback open redirect يأخذ `next=https://evil.example`.
- بعد callback استخدم destination مخزنة server-side أو allowlist لمسارات داخلية.
- اربط المعاملة بالـissuer لتجنب mix-up عندما يدعم Client أكثر من Authorization Server.

## مكان التوكينات في تطبيق Browser

### Backend for Frontend

```text
Browser --Secure HttpOnly session cookie--> BFF
BFF --access token--> APIs
```

هذا الاختيار يقلل وصول JavaScript إلى التوكينات. طبّق CSRF protection وSameSite مناسبًا وsession rotation.

### Browser-only client

إذا كان التوكين داخل المتصفح، فضّل memory على storage دائم طويل العمر. `localStorage` متاح لأي JavaScript داخل origin؛ XSS يستطيع سرقته. CSP وTrusted Types وتقليل third-party scripts دفاعات مهمة لكنها لا تجعل التخزين آمنًا مطلقًا.

لا تضع token في URL أو history أو logs أو analytics. ولا تنقل client secret إلى SPA.

## Bearer مقابل Sender-constrained

Bearer token قابل لإعادة الاستخدام من أي حامل. للأنظمة الأعلى حساسية يمكن ربط التوكين بعميل عبر mTLS أو DPoP، لكن ذلك يزيد التعقيد ولا يلغي التحقق من audience/scope أو حماية الجهاز.

## Access وRefresh lifecycle

- Access token قصيرة العمر ومقيّدة بالـresource/audience.
- Refresh token أطول عمرًا وتخزن بأقوى حماية متاحة.
- Rotate refresh tokens واكشف reuse.
- ألغِ العائلة عند logout أو سرقة أو تغيير أمني.
- وفر revocation endpoint أو introspection للـopaque tokens حيث يلزم.
- لا تفترض أن “JWT لا يمكن إلغاؤها” حقيقة مطلقة؛ يمكن denylist أو version/session checks، لكن لها تكلفة state.

## OIDC login checklist

1. Discovery من issuer موثوق، لا من قيمة يرسلها المستخدم.
2. Authorization Code + PKCE S256.
3. `state`/PKCE و`nonce` مرتبطان بالجلسة والمعاملة.
4. Redirect URI مسجلة بدقة.
5. تحقق signature و`iss` و`aud` و`exp` و`nonce`.
6. استخدم `iss + sub` لربط الحساب.
7. لا تمنح صلاحيات محلية من email/domain claim دون سياسة واضحة والتحقق المطلوب.
8. أنشئ جلسة تطبيق جديدة ثم غيّر session ID.

## المراقبة دون تسريب

سجّل: issuer، client ID، flow، نتيجة عامة، error code، correlation ID، ووقت الاستجابة. لا تسجل token أو code أو verifier أو secret أو assertion. راقب:

- ارتفاع `invalid_grant`.
- reuse للـRefresh Token.
- redirect/issuer mismatch.
- فشل signature أو audience.
- طلب scopes غير معتادة.
- معدل Device Flow polling وانتهاء الأكواد.

:::tip[الخلاصة]
استخدم مكتبة OIDC/OAuth مجرّبة وموفر هوية ناضج. البروتوكول يبدو redirects وHTTP parameters، لكن صحة الربط بين browser session وissuer وclient وredirect والتوكين هي الجزء الأمني الصعب.
:::
