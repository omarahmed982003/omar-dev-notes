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

## خريطة الدرس

<div class="lesson-diagram" role="img" aria-label="خريطة مفاهيم: JWT والتحقق الآمن">
<p class="lesson-diagram-title">خريطة مفاهيم: JWT والتحقق الآمن</p>
<div class="diagram-flow">
<div class="diagram-node input"><span>Claims قياسية مهمة</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>التوقيع المتناظر وغير المتناظر</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>مثال PHP بمكتبة</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node decision"><span>Key ID وJWKS</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node output"><span>قائمة تحقق</span></div>
</div>
</div>

## تأكد من فهمك

<div class="lesson-quiz" role="list">
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">01</span><p>اشرح «Claims قياسية مهمة» كأنك تراجع تطبيقًا حقيقيًا: ما الهدف وما أهم قيد يجب الانتباه له؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> | Claim | المعنى | التحقق | |---|---|---| | iss | الجهة المصدرة | تطابق issuer موثوقًا بالضبط | | sub | موضوع/هوية التوكين | لا تفترض أنه email | | aud | الجمهور المقصود | يجب أن تتضمن API الحالية | | exp | انتهاء الصلاحية | ارفض المنتهي | | nbf | غير صالح قبل | ارفض الاستخدام المبكر | | iat | وقت الإصدار | افحص المعقولية حسب السياسة | | jti | معرف فريد | يفيد في التتبع/منع إعادة الاستخدام | الـPayload قد يحتوي… عمليًا، لا يكفي تنفيذ المسار الناجح؛ يجب توثيق الافتراضات والتحقق من القيم والحالات التي قد تكسر هذا السلوك.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">02</span><p>قارن بين «Claims قياسية مهمة» و«التوقيع المتناظر وغير المتناظر». لماذا لا يغني أحدهما عن الآخر داخل موضوع «JWT والتحقق الآمن»؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> في «Claims قياسية مهمة»: | Claim | المعنى | التحقق | |---|---|---| | iss | الجهة المصدرة | تطابق issuer موثوقًا بالضبط | | sub | موضوع/هوية التوكين | لا تفترض أنه email | | aud | الجمهور المقصود | يجب أن تتضمن API الحالية | | exp | انتهاء الصلاحية | ارفض المنتهي | | nbf | غير صالح قبل | ارفض الاستخدام المبكر | | iat | وقت الإصدار | افحص المعقولية حسب السياسة | | jti | معرف فريد | يفيد في التتبع/منع إعادة الاستخدام | الـPayload قد يحتوي… أما «التوقيع المتناظر وغير المتناظر»: HS256: HMAC بمفتاح سري مشترك؛ كل جهة تتحقق تستطيع أيضًا إصدار token. RS256/أمثاله: Private key للتوقيع وPublic key للتحقق؛ أنسب عندما تتحقق خدمات كثيرة. EdDSA بخوارزمية مدعومة ومكتبة موثوقة خيار حديث في البيئات المتوافقة. لا تختَر الخوارزمية من قيمة alg داخل token وحدها. ثبّت allowlist في verifier ولا تقبل none. لا تستخدم كلمة مرور بشرية كمفتاح HMAC. العلاقة بينهما أن الأول يحدد جانبًا من الحل، والثاني يكمل السلوك أو القيود اللازمة لتطبيقه بصورة صحيحة.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">03</span><p>افترض أن نظامًا تجاهل «مثال PHP بمكتبة». ما العطل أو الخطر المتوقع، وكيف تصمم اختبارًا يكشفه؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> المكتبة تتعامل مع التوقيع وبعض claims الزمنية، لكن التطبيق ما زال مسؤولًا عن issuer وaudience ونوع token والسياسة. استخدم مكتبة ناضجة بدل بناء Base64/signature يدويًا. لاكتشاف الخلل، اختبر مسارًا صحيحًا، وقيمة عند الحد، ومدخلًا غير صالح، ثم راقب النتيجة والآثار الجانبية والسجل بدل الاكتفاء بعدم ظهور Exception.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">04</span><p>حوّل «Key ID وJWKS» إلى قرار هندسي قابل للمراجعة. ما الذي ستوثقه وما الحالات التي ستختبرها؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> kid يسهّل rotation، لكنه مدخل غير موثوق: اربط issuer بقائمة مفاتيح/JWKS URL موثوقة مسبقًا. لا تستخدم kid كاسم ملف أو SQL بلا تحقق. لا تتبع jku أو URL يرسله التوكين عشوائيًا؛ هذا قد يخلق SSRF أو مفتاح مهاجم. خزّن JWKS مؤقتًا مع refresh محدود، واحتفظ بالمفتاح القديم حتى تنتهي التوكينات الموقعة به. وثّق سبب الاختيار والبدائل والحدود، واختبر الحالة العادية، والحد الأدنى والأقصى، والفشل الجزئي، وإعادة المحاولة أو التكرار إن كان السلوك يسمح بذلك.</div></details>
</section>
</div>
