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

## خريطة الدرس

<div class="lesson-diagram" role="img" aria-label="خريطة مفاهيم: OAuth Flows الحديثة">
<p class="lesson-diagram-title">خريطة مفاهيم: OAuth Flows الحديثة</p>
<div class="diagram-flow">
<div class="diagram-node input"><span>Authorization Code + PKCE</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>Client Credentials</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>Device Authorization</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node decision"><span>Refresh Token Grant</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node output"><span>Assertion Grants</span></div>
</div>
</div>

## تأكد من فهمك

<div class="lesson-quiz" role="list">
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">01</span><p>اشرح «Authorization Code + PKCE» كأنك تراجع تطبيقًا حقيقيًا: ما الهدف وما أهم قيد يجب الانتباه له؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> هذا هو الاختيار الأساسي لتطبيقات الويب وSPA وNative Apps. الكود يمر عبر الـFront Channel لكنه قصير العمر وأحادي الاستخدام، أما التوكينات فتعود من Token Endpoint عبر اتصال مباشر. إنشاء PKCE طلب التفويض: عند callback طابق state بقيمة session مقارنة ثابتة الزمن واحذف المعاملة بعد الاستخدام. ثم أرسل code وcode_verifier وredirect URI نفسها إلى token endpoint. الـAuthorization Server يحسب: PKCE ليس تشفيرًا للكود؛ يربط… عمليًا، لا يكفي تنفيذ المسار الناجح؛ يجب توثيق الافتراضات والتحقق من القيم والحالات التي قد تكسر هذا السلوك.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">02</span><p>قارن بين «Authorization Code + PKCE» و«Client Credentials». لماذا لا يغني أحدهما عن الآخر داخل موضوع «OAuth Flows الحديثة»؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> في «Authorization Code + PKCE»: هذا هو الاختيار الأساسي لتطبيقات الويب وSPA وNative Apps. الكود يمر عبر الـFront Channel لكنه قصير العمر وأحادي الاستخدام، أما التوكينات فتعود من Token Endpoint عبر اتصال مباشر. إنشاء PKCE طلب التفويض: عند callback طابق state بقيمة session مقارنة ثابتة الزمن واحذف المعاملة بعد الاستخدام. ثم أرسل code وcode_verifier وredirect URI نفسها إلى token endpoint. الـAuthorization Server يحسب: PKCE ليس تشفيرًا للكود؛ يربط… أما «Client Credentials»: لـmachine-to-machine عندما يعمل Client بصفته، لا بصفة مستخدم: للـConfidential clients فقط. لا يوجد user أو consent تفاعلي؛ لا تخترع user_id لهذا token. فضّل مصادقة أقوى مثل mTLS أو private_key_jwt في الأنظمة الحساسة. اجعل كل workload بهوية وصلاحيات مستقلة بدل secret مشترك بين الخدمات كلها. العلاقة بينهما أن الأول يحدد جانبًا من الحل، والثاني يكمل السلوك أو القيود اللازمة لتطبيقه بصورة صحيحة.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">03</span><p>افترض أن نظامًا تجاهل «Device Authorization». ما العطل أو الخطر المتوقع، وكيف تصمم اختبارًا يكشفه؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> مناسب لـSmart TV أو CLI أو جهاز إدخاله محدود: الجهاز يطلب device_code وuser_code وverification_uri. يعرض للمستخدم الرابط والكود، ويفضل QR لا يحتوي أسرارًا غير مطلوبة. المستخدم يفتح الرابط على جهاز آخر ويسجل الدخول ويوافق. الجهاز يعمل polling للـtoken endpoint. احترم interval، ومع slow_down زد فترة polling خمس ثوانٍ، وتوقف عند access_denied أو expired_token. اعرض اسم الجهاز والعميل للمستخدم لتقليل هجمات خداع الأكواد. لاكتشاف الخلل، اختبر مسارًا صحيحًا، وقيمة عند الحد، ومدخلًا غير صالح، ثم راقب النتيجة والآثار الجانبية والسجل بدل الاكتفاء بعدم ظهور Exception.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">04</span><p>حوّل «Refresh Token Grant» إلى قرار هندسي قابل للمراجعة. ما الذي ستوثقه وما الحالات التي ستختبرها؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> لا تطلب scope أوسع من الأصلي. استخدم rotation: كل استبدال يصدر refresh token جديدًا ويلغي السابق، مع كشف reuse. وثّق سبب الاختيار والبدائل والحدود، واختبر الحالة العادية، والحد الأدنى والأقصى، والفشل الجزئي، وإعادة المحاولة أو التكرار إن كان السلوك يسمح بذلك.</div></details>
</section>
</div>
