---
title: 6. Encryption وHTTP Authentication
description: التشفير الآمن وإدارة المفاتيح وHTTP Basic وBearer Tokens والفرق عن Hashing.
sidebar:
  order: 6
---

## متى نستخدم Encryption؟

نستخدمه عندما يجب استعادة النص الأصلي، مثل سر تكامل خارجي مخزن. كلمة المرور لا تحتاج فكًا، لذلك تستخدم Hashing.

- **Symmetric:** المفتاح نفسه للتشفير وفك التشفير؛ سريع للبيانات.
- **Asymmetric:** Public/Private Key؛ للتوقيع وتبادل الأسرار وحالات محددة.
- **Authenticated Encryption (AEAD):** يحمي السرية ويكشف التعديل؛ فضّله على «تشفير فقط».

## مثال Sodium

```php
function encrypt(string $plainText, string $key): string
{
    $nonce = random_bytes(SODIUM_CRYPTO_SECRETBOX_NONCEBYTES);
    $cipher = sodium_crypto_secretbox($plainText, $nonce, $key);
    return base64_encode($nonce . $cipher);
}

function decrypt(string $encoded, string $key): string
{
    $payload = base64_decode($encoded, true);
    if ($payload === false) {
        throw new RuntimeException('Invalid encoding');
    }

    $nonceLength = SODIUM_CRYPTO_SECRETBOX_NONCEBYTES;
    $nonce = substr($payload, 0, $nonceLength);
    $cipher = substr($payload, $nonceLength);
    $plain = sodium_crypto_secretbox_open($cipher, $nonce, $key);

    if ($plain === false) {
        throw new RuntimeException('Authentication failed');
    }

    return $plain;
}
```

المفتاح يجب أن يكون بطول `SODIUM_CRYPTO_SECRETBOX_KEYBYTES` ومن مصدر عشوائي آمن، ويُحفظ في secret manager. الـNonce ليس سرًا لكنه يجب ألا يعاد استخدامه مع المفتاح وفق متطلبات الخوارزمية.

:::caution
Base64 encoding وليس encryption. ولا تخترع خوارزمية أو تجمع AES/CBC وMAC يدويًا؛ استخدم API عالي المستوى يدعم authentication.
:::

## إدارة المفاتيح

- افصل المفتاح عن ciphertext وقاعدة البيانات قدر الإمكان.
- ضع Key ID/version مع البيانات لتسهيل rotation.
- حدّد من يستطيع decrypt وراقب العمليات.
- خطط للنسخ الاحتياطي والتدوير والإلغاء.
- لا تطبع المفتاح في logs أو exceptions.

## HTTP Basic

يرسل العميل:

```http
Authorization: Basic dXNlcjpwYXNz
```

القيمة Base64 لـ`username:password` ويمكن فكها بسهولة؛ الحماية تأتي من **HTTPS**.

في PHP تحت بعض إعدادات الخادم:

```php
$user = $_SERVER['PHP_AUTH_USER'] ?? null;
$pass = $_SERVER['PHP_AUTH_PW'] ?? null;

if ($user === null || !verifyCredentials($user, $pass ?? '')) {
    header('WWW-Authenticate: Basic realm="Admin"');
    http_response_code(401);
    exit('Authentication required');
}
```

Basic مناسب لأدوات داخلية بسيطة مع TLS وrate limiting، لكنه يرسل credential مع كل request ولا يملك logout/token lifecycle متقدمًا.

## Bearer Tokens

```http
Authorization: Bearer opaque-random-token
```

من يحمل Bearer token يستطيع استخدامه؛ خزنه وانقله كسر. استخدم expiry وscope وrotation وrevocation حيث يلزم. ليس كل token JWT، وJWT لا يعني أنه مشفر أو قابل للإلغاء تلقائيًا.

## خريطة الدرس

<div class="lesson-diagram" role="img" aria-label="خريطة مفاهيم: Encryption وHTTP Authentication">
<p class="lesson-diagram-title">خريطة مفاهيم: Encryption وHTTP Authentication</p>
<div class="diagram-flow">
<div class="diagram-node input"><span>متى نستخدم Encryption؟</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>مثال Sodium</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>إدارة المفاتيح</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node decision"><span>HTTP Basic</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node output"><span>Bearer Tokens</span></div>
</div>
</div>

## تأكد من فهمك

<div class="lesson-quiz" role="list">
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">01</span><p>اشرح «متى نستخدم Encryption؟» كأنك تراجع تطبيقًا حقيقيًا: ما الهدف وما أهم قيد يجب الانتباه له؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> نستخدمه عندما يجب استعادة النص الأصلي، مثل سر تكامل خارجي مخزن. كلمة المرور لا تحتاج فكًا، لذلك تستخدم Hashing. Symmetric: المفتاح نفسه للتشفير وفك التشفير؛ سريع للبيانات. Asymmetric: Public/Private Key؛ للتوقيع وتبادل الأسرار وحالات محددة. Authenticated Encryption (AEAD): يحمي السرية ويكشف التعديل؛ فضّله على «تشفير فقط». عمليًا، لا يكفي تنفيذ المسار الناجح؛ يجب توثيق الافتراضات والتحقق من القيم والحالات التي قد تكسر هذا السلوك.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">02</span><p>قارن بين «متى نستخدم Encryption؟» و«مثال Sodium». لماذا لا يغني أحدهما عن الآخر داخل موضوع «Encryption وHTTP Authentication»؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> في «متى نستخدم Encryption؟»: نستخدمه عندما يجب استعادة النص الأصلي، مثل سر تكامل خارجي مخزن. كلمة المرور لا تحتاج فكًا، لذلك تستخدم Hashing. Symmetric: المفتاح نفسه للتشفير وفك التشفير؛ سريع للبيانات. Asymmetric: Public/Private Key؛ للتوقيع وتبادل الأسرار وحالات محددة. Authenticated Encryption (AEAD): يحمي السرية ويكشف التعديل؛ فضّله على «تشفير فقط». أما «مثال Sodium»: المفتاح يجب أن يكون بطول SODIUM_CRYPTO_SECRETBOX_KEYBYTES ومن مصدر عشوائي آمن، ويُحفظ في secret manager. الـNonce ليس سرًا لكنه يجب ألا يعاد استخدامه مع المفتاح وفق متطلبات الخوارزمية. :::caution Base64 encoding وليس encryption. ولا تخترع خوارزمية أو تجمع AES/CBC وMAC يدويًا؛ استخدم API عالي المستوى يدعم authentication. ::: العلاقة بينهما أن الأول يحدد جانبًا من الحل، والثاني يكمل السلوك أو القيود اللازمة لتطبيقه بصورة صحيحة.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">03</span><p>افترض أن نظامًا تجاهل «إدارة المفاتيح». ما العطل أو الخطر المتوقع، وكيف تصمم اختبارًا يكشفه؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> افصل المفتاح عن ciphertext وقاعدة البيانات قدر الإمكان. ضع Key ID/version مع البيانات لتسهيل rotation. حدّد من يستطيع decrypt وراقب العمليات. خطط للنسخ الاحتياطي والتدوير والإلغاء. لا تطبع المفتاح في logs أو exceptions. لاكتشاف الخلل، اختبر مسارًا صحيحًا، وقيمة عند الحد، ومدخلًا غير صالح، ثم راقب النتيجة والآثار الجانبية والسجل بدل الاكتفاء بعدم ظهور Exception.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">04</span><p>حوّل «HTTP Basic» إلى قرار هندسي قابل للمراجعة. ما الذي ستوثقه وما الحالات التي ستختبرها؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> يرسل العميل: القيمة Base64 لـusername:password ويمكن فكها بسهولة؛ الحماية تأتي من HTTPS. في PHP تحت بعض إعدادات الخادم: Basic مناسب لأدوات داخلية بسيطة مع TLS وrate limiting، لكنه يرسل credential مع كل request ولا يملك logout/token lifecycle متقدمًا. وثّق سبب الاختيار والبدائل والحدود، واختبر الحالة العادية، والحد الأدنى والأقصى، والفشل الجزئي، وإعادة المحاولة أو التكرار إن كان السلوك يسمح بذلك.</div></details>
</section>
</div>
