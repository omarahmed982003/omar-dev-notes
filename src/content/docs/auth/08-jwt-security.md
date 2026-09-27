---
title: 8. JWT والتحقق الآمن
description: بنية JWT والتوقيع والـClaims والتحقق من issuer وaudience والوقت وإدارة المفاتيح.
sidebar:
  order: 8
---

## قبل ما تبدأ

ذاكر الدرس على 3 خطوات: افهم المشكلة الأول، تابع المثال، وبعدها جرّب الجزء العملي بنفسك. المصطلحات الجديدة الموجودة تحت متشرحة قبل ما ندخل في التفاصيل.

### كلمات جديدة في الدرس

- **URL:** العنوان الكامل لمورد على الويب، زي صفحة أو صورة أو نقطة API.
- **API:** واجهة محددة تسمح لبرنامج يطلب بيانات أو ينفّذ عملية عند برنامج آخر.
- **Token:** قيمة تمثل هوية أو صلاحية محددة بدل إرسال كلمة السر كل مرة.
- **Scope:** نطاق التفويض: اسم صلاحية يطلبها التطبيق أو يحصل عليها، زي orders:read لقراءة الطلبات؛ ولسه لازم نتحقق إن المستخدم يملك الطلب.


- **Authorization:** التحقق من الصلاحية: تحديد العمليات المسموح للهوية تنفذها.
- **XSS:** هجوم يحاول تشغيل JavaScript غير موثوق داخل صفحة المستخدم.
- **CSRF:** هجوم يدفع متصفح مستخدم مسجل الدخول لإرسال طلب لم يقصده.
- **JWT:** صيغة Token موقعة؛ التوقيع يكشف التعديل لكنه لا يشفر المحتوى تلقائيًا.
- **Secret:** قيمة حساسة مثل مفتاح API أو كلمة مرور خدمة ولازم تبقى خارج الكود.

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

validateAccessClaims($claims, 'https://id.example.com', 'https://api.example.com', time());

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

## سيناريو أمني

<details><summary>ليه ما نحطش بيانات سرية في JWT؟</summary><p>الـpayload غالبًا encoded لا encrypted ويمكن لحامل token قراءته؛ قلل البيانات وحدد العمر والجمهور.</p></details>

## تدريب تهديد

**السيناريو:** يعدّل المهاجم header أو claim داخل JWT أو يعيد استخدام توكين من issuer أو audience مختلف.

**اختبار المنع:** اختبر توقيعًا معدلًا و<code>alg</code> غير متوقع و<code>aud</code> خاطئًا وتوكينًا منتهيًا.

**النتيجة المتوقعة:** تُرفض كل الحالات قبل تنفيذ منطق العمل؛ الخوارزمية والمصدر والجمهور والعمر قيود من إعداد الخادم لا من التوكين وحده.

### مرجع التحقق

- [OWASP JSON Web Token Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/JSON_Web_Token_for_Java_Cheat_Sheet.html)

## اربط النقاط ببعض

JWT access token لا يملك revocation لحظية بذاته؛ استخدم عمرًا قصيرًا وrotation أو introspection/denylist حسب الخطر. حدد مكان التخزين في browser ونموذج XSS/CSRF. ثبّت algorithm وissuer وaudience من config، واضبط JWKS caching والrotation، ولا تقبل nested/encrypted token دون حاجة ومكتبة تدعمها.

### جرّب بنفسك

دوّر signing key وتأكد من قبول القديم في النافذة ورفضه بعدها.


## وجود الـClaims نفسه جزء من العقد

المثال السابق مقتطف دمج: حمّل Composer autoload ووفر مفاتيح RSA مدارة. أضف الدالة التالية لنفس الملف واستدعها بعد تحقق المكتبة من التوقيع بمفتاح موثوق وخوارزمية ثابتة. سياسة access token هنا بتشترط `iss` و`sub` و`aud` و`exp` كعدد صحيح؛ معيار JWT نفسه مش بيشترط كل claim مسجلة. المكتبة ممكن تتحقق من الانتهاء فقط لو الحقل موجود. `nbf` اختياري هنا لكن لازم يكون عددًا صحيحًا لو موجود. المثال لا يسمح بفارق توقيت؛ لو بيئتك محتاجاه حدده بوضوح وبحد صغير.

```php
function validateAccessClaims(array $claims, string $issuer, string $audience, int $now): void
{
    // Only call AFTER a JOSE library has verified the signature and fixed algorithm.
    if (($claims['iss'] ?? null) !== $issuer
        || !is_string($claims['sub'] ?? null) || $claims['sub'] === ''
        || !is_int($claims['exp'] ?? null) || $claims['exp'] <= $now) {
        throw new InvalidArgumentException('Missing or invalid required claim');
    }
    $aud = $claims['aud'] ?? null;
    if (is_string($aud)) {
        $aud = [$aud];
    }
    if (!is_array($aud) || !array_is_list($aud) || $aud === []
        || count(array_filter($aud, 'is_string')) !== count($aud)
        || !in_array($audience, $aud, true)) {
        throw new InvalidArgumentException('Invalid audience');
    }
    if (array_key_exists('nbf', $claims)
        && (!is_int($claims['nbf']) || $claims['nbf'] > $now)) {
        throw new InvalidArgumentException('Invalid not-before claim');
    }
}
```

اختبر توكينًا موقّعًا فعلًا لكن المصدر أنشأه من غير `exp`: لازم يُرفض بسبب السياسة. حذف الحقل من توكين موقّع موجود بيختبر العبث بالتوقيع، وده اختبار مختلف. اختبارات `security` المحلية بتفحص السياسة، مش تنفيذ التوقيع في المكتبة الخارجية.
