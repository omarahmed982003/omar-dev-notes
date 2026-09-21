---
title: 8. JWT والتحقق الآمن
description: بنية JWT والتوقيع والـClaims والتحقق من issuer وaudience والوقت وإدارة المفاتيح.
sidebar:
  order: 8
---

# JWT ليست جلسة سحرية

JSON Web Token صيغة compact لنقل Claims بين أطراف. الشكل الشائع JWS مكوّن من ثلاثة أجزاء Base64url مفصولة بنقطة:

```text
BASE64URL(header).BASE64URL(payload).BASE64URL(signature)
```

- Header: نوع التوكين والخوارزمية وKey ID اختياري.
- Payload: Claims مثل المستخدم والمصدر والجمهور ووقت الانتهاء.
- Signature: تكشف تعديل header أوpayload إذا تم التحقق منها بالمفتاح الصحيح.

:::danger[Base64url لا يخفي البيانات]
يمكن لأي شخص يحمل JWT قراءة header وpayload. التوقيع يوفر السلامة والأصالة، وليس السرية. لا تضع كلمة مرور أو Secret أو بيانات شخصية غير لازمة. التشفير يحتاج JWE أو تصميمًا آخر، وليس JWT موقّعة فقط.
:::

## Claims قياسية مهمة

| Claim | المعنى | التحقق |
|---|---|---|
| `iss` | الجهة المصدرة | تطابق issuer موثوقًا بالضبط |
| `sub` | موضوع/هوية التوكين | لا تفترض أنه email |
| `aud` | الجمهور المقصود | يجب أن تتضمن API الحالية |
| `exp` | انتهاء الصلاحية | ارفض المنتهي |
| `nbf` | غير صالح قبل | ارفض الاستخدام المبكر |
| `iat` | وقت الإصدار | افحص المعقولية حسب السياسة |
| `jti` | معرف فريد | يفيد في التتبع/منع إعادة الاستخدام |

الـPayload قد يحتوي أدوارًا أو scopes، لكن تغيّر صلاحية المستخدم بعد إصدار token لن يظهر حتى انتهاء التوكين أو فحص مصدر مركزي. لذلك اجعل access tokens قصيرة العمر ولا تعتبر JWT بديلًا دائمًا لسياسة Authorization.

## التوقيع المتناظر وغير المتناظر

- `HS256`: HMAC بمفتاح سري مشترك؛ كل جهة تتحقق تستطيع أيضًا إصدار token.
- `RS256`/أمثاله: Private key للتوقيع وPublic key للتحقق؛ أنسب عندما تتحقق خدمات كثيرة.
- `EdDSA` بخوارزمية مدعومة ومكتبة موثوقة خيار حديث في البيئات المتوافقة.

لا تختَر الخوارزمية من قيمة `alg` داخل token وحدها. ثبّت allowlist في verifier ولا تقبل `none`. لا تستخدم كلمة مرور بشرية كمفتاح HMAC.

## مثال PHP بمكتبة

```bash
composer require firebase/php-jwt
```

```php
<?php
declare(strict_types=1);

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

$payload = [
    'iss' => 'https://id.example.com',
    'sub' => 'user_123',
    'aud' => 'https://api.example.com',
    'iat' => time(),
    'nbf' => time(),
    'exp' => time() + 300,
    'scope' => 'orders:read',
];

$token = JWT::encode($payload, $privateKey, 'RS256', 'key-2026-09');
$claims = (array) JWT::decode($token, new Key($publicKey, 'RS256'));

if (($claims['iss'] ?? null) !== 'https://id.example.com') {
    throw new RuntimeException('Invalid issuer');
}

$audiences = (array) ($claims['aud'] ?? []);
if (!in_array('https://api.example.com', $audiences, true)) {
    throw new RuntimeException('Invalid audience');
}
```

المكتبة تتعامل مع التوقيع وبعض claims الزمنية، لكن التطبيق ما زال مسؤولًا عن issuer وaudience ونوع token والسياسة. استخدم مكتبة ناضجة بدل بناء Base64/signature يدويًا.

## Key ID وJWKS

`kid` يسهّل rotation، لكنه مدخل غير موثوق:

1. اربط issuer بقائمة مفاتيح/JWKS URL موثوقة مسبقًا.
2. لا تستخدم `kid` كاسم ملف أو SQL بلا تحقق.
3. لا تتبع `jku` أو URL يرسله التوكين عشوائيًا؛ هذا قد يخلق SSRF أو مفتاح مهاجم.
4. خزّن JWKS مؤقتًا مع refresh محدود، واحتفظ بالمفتاح القديم حتى تنتهي التوكينات الموقعة به.

## قائمة تحقق

- HTTPS دائمًا.
- حدد allowed algorithms وtoken `typ`.
- تحقق من signature و`iss` و`aud` و`exp` و`nbf`.
- امنح clock skew صغيرًا ومحددًا، لا ساعات.
- افصل مفاتيح وأنواع ID tokens عن access tokens لمنع substitution.
- لا تسجل التوكين كاملًا.
- خطط للإلغاء: مدة قصيرة، denylist لحالات محددة، أو opaque/reference token عندما تحتاج revocation فوريًا.
