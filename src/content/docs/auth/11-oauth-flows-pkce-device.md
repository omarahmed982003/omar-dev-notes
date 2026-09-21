---
title: 11. OAuth Flows الحديثة
description: Authorization Code مع PKCE وClient Credentials وDevice Authorization وRefresh Tokens والتدفقات القديمة.
sidebar:
  order: 11
---

# اختر التدفق حسب نوع العميل

```text
مستخدم + Browser/Web/Mobile  -> Authorization Code + PKCE
خدمة تتحدث مع خدمة           -> Client Credentials
TV/CLI بلا متصفح مناسب       -> Device Authorization
تجديد وصول سابق              -> Refresh Token
```

## Authorization Code + PKCE

هذا هو الاختيار الأساسي لتطبيقات الويب وSPA وNative Apps. الكود يمر عبر الـFront Channel لكنه قصير العمر وأحادي الاستخدام، أما التوكينات فتعود من Token Endpoint عبر اتصال مباشر.

```text
Browser        Client             Authorization Server
  |              |                         |
  |--- start --->|                         |
  |              |-- authorize + challenge|
  |<------------- redirect to login -------|
  |------------- login/consent ----------->|
  |<---- redirect: code + state ------------|
  |-- callback -->|                         |
  |              |-- code + verifier ------>|
  |              |<-- access/refresh token--|
```

### إنشاء PKCE

```php
<?php
declare(strict_types=1);

function base64Url(string $bytes): string
{
    return rtrim(strtr(base64_encode($bytes), '+/', '-_'), '=');
}

$codeVerifier = base64Url(random_bytes(32)); // 43 chars
$codeChallenge = base64Url(hash('sha256', $codeVerifier, true));
$state = base64Url(random_bytes(32));
$nonce = base64Url(random_bytes(32)); // عند استخدام OIDC

$_SESSION['oauth'] = [
    'state' => hash('sha256', $state),
    'verifier' => $codeVerifier,
    'nonce' => $nonce,
    'created_at' => time(),
];
```

طلب التفويض:

```text
response_type=code
client_id=...
redirect_uri=https://client.example.com/callback
scope=openid profile orders:read
state=...
nonce=...
code_challenge=...
code_challenge_method=S256
```

عند callback طابق state بقيمة session مقارنة ثابتة الزمن واحذف المعاملة بعد الاستخدام. ثم أرسل code و`code_verifier` وredirect URI نفسها إلى token endpoint. الـAuthorization Server يحسب:

```text
BASE64URL(SHA256(code_verifier)) == code_challenge
```

PKCE ليس تشفيرًا للكود؛ يربط الكود بعميل بدأ المعاملة. استخدم قيمة جديدة عالية entropy لكل محاولة و`S256` فقط.

## Client Credentials

لـmachine-to-machine عندما يعمل Client بصفته، لا بصفة مستخدم:

```http
POST /oauth/token HTTP/1.1
Content-Type: application/x-www-form-urlencoded
Authorization: Basic BASE64(client_id:client_secret)

grant_type=client_credentials&scope=reports:write
```

- للـConfidential clients فقط.
- لا يوجد user أو consent تفاعلي؛ لا تخترع `user_id` لهذا token.
- فضّل مصادقة أقوى مثل mTLS أو `private_key_jwt` في الأنظمة الحساسة.
- اجعل كل workload بهوية وصلاحيات مستقلة بدل secret مشترك بين الخدمات كلها.

## Device Authorization

مناسب لـSmart TV أو CLI أو جهاز إدخاله محدود:

1. الجهاز يطلب `device_code` و`user_code` و`verification_uri`.
2. يعرض للمستخدم الرابط والكود، ويفضل QR لا يحتوي أسرارًا غير مطلوبة.
3. المستخدم يفتح الرابط على جهاز آخر ويسجل الدخول ويوافق.
4. الجهاز يعمل polling للـtoken endpoint.

```json
{
  "device_code": "secret-device-value",
  "user_code": "WDJB-MJHT",
  "verification_uri": "https://id.example.com/device",
  "expires_in": 600,
  "interval": 5
}
```

احترم `interval`، ومع `slow_down` زد فترة polling خمس ثوانٍ، وتوقف عند `access_denied` أو `expired_token`. اعرض اسم الجهاز والعميل للمستخدم لتقليل هجمات خداع الأكواد.

## Refresh Token Grant

```http
POST /oauth/token HTTP/1.1
Content-Type: application/x-www-form-urlencoded

grant_type=refresh_token&
refresh_token=...&
client_id=...
```

لا تطلب scope أوسع من الأصلي. استخدم rotation: كل استبدال يصدر refresh token جديدًا ويلغي السابق، مع كشف reuse.

## Assertion Grants

يمكن استخدام SAML assertion كAuthorization Grant أو لمصادقة Client وفق RFC 7522. هذا **امتداد تكاملي** بين اتحاد SAML وOAuth وليس التدفق الافتراضي لكل SAML SSO. تحقق من issuer وaudience والوقت والتوقيع ومنع replay.

## تدفقات لا تبدأ بها مشروعًا جديدًا

:::danger
- **Implicit Grant:** يعيد access token عبر front channel حيث يزداد التسريب وإعادة الاستخدام. استخدم Authorization Code + PKCE.
- **Resource Owner Password Credentials:** يعلّم المستخدم إدخال كلمة مروره في Client ويصعّب MFA وWebAuthn؛ RFC 9700 يقول إنه يجب عدم استخدامه.
:::
