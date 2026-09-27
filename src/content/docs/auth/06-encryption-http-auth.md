---
title: 6. Encryption وHTTP Authentication
description: التشفير الآمن وإدارة المفاتيح وHTTP Basic وBearer Tokens والفرق عن Hashing.
sidebar:
  order: 6
---

## قبل ما تبدأ

ذاكر الدرس على 3 خطوات: افهم المشكلة الأول، تابع المثال، وبعدها جرّب الجزء العملي بنفسك. المصطلحات الجديدة الموجودة تحت متشرحة قبل ما ندخل في التفاصيل.

### كلمات جديدة في الدرس

- **HTTP:** قواعد تبادل الطلبات والردود بين المتصفح والخادم.
- **URL:** العنوان الكامل لمورد على الويب، زي صفحة أو صورة أو نقطة API.
- **TLS:** طبقة تشفير بتحمي البيانات وهي ماشية بين طرفين.
- **API:** واجهة محددة تسمح لبرنامج يطلب بيانات أو ينفّذ عملية عند برنامج آخر.
- **Token:** قيمة تمثل هوية أو صلاحية محددة بدل إرسال كلمة السر كل مرة.
- **Scope:** نطاق التفويض: اسم صلاحية يطلبها التطبيق أو يحصل عليها، زي orders:read لقراءة الطلبات؛ ولسه لازم نتحقق إن المستخدم يملك الطلب.
- **Function:** دالة: جزء كود له اسم ومهمة محددة ويمكن استدعاؤه أكثر من مرة.


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
    if ($payload === false || strlen($payload) < SODIUM_CRYPTO_SECRETBOX_NONCEBYTES + SODIUM_CRYPTO_SECRETBOX_MACBYTES) {
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

## سيناريو أمني

<details><summary>هل التشفير بديل للتوقيع؟</summary><p>لا؛ التشفير يخفي المحتوى، بينما التوقيع يثبت السلامة والمنشأ. قد تحتاج الاثنين.</p></details>

## تدريب تهديد

**السيناريو:** مهاجم على الشبكة يحاول قراءة بيانات اعتماد Basic Authentication أو إجبار العميل على اتصال غير مشفر.

**اختبار المنع:** اختبر طلب HTTP بلا أي بيانات اعتماد، ثم طلب HTTPS ببيانات اعتماد تجريبية خاطئة. راقب إن العميل لا يرسل الأسرار قبل إنشاء اتصال TLS.

**النتيجة المتوقعة:** يُعاد توجيه HTTP أو يُرفض، ولا تُقبل البيانات الخاطئة، ولا تظهر الأسرار في URL أو السجلات.

### مرجع التحقق

- [OWASP Transport Layer Security Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Transport_Layer_Security_Cheat_Sheet.html)

## اربط النقاط ببعض

استخدم AEAD مع nonce فريد لكل مفتاح وassociated data للسياق، ولا تخترع key derivation أو format. افصل encryption key عن data ومكان النسخ الاحتياطي. Basic يرسل credential مع كل طلب ويحتاج TLS دائمًا، وBearer يمنح حامله الصلاحية؛ scopes وaudience والعمر والتخزين أجزاء من العقد.

### جرّب بنفسك

غيّر السياق في مثال AEAD التالي وتأكد من فشل فك التشفير. تكرار nonce خطأ استخدام خطير، لكن المكتبة لا تحتفظ بسجل يمنعه تلقائيًا.


## اربط النص المشفّر بسياقه باستخدام AEAD

`secretbox` بيتحقق من سلامة النص المشفّر، لكن مالوش معامل للبيانات المصاحبة. الـAEAD تشفير موثّق بيربط كمان سياقًا غير مشفّر بالنص: ملاحظة المستخدم 42 ماينفعش تُقرأ باعتبارها تخص المستخدم 99. السياق مش سر، وابنيه من معرّفات موثوقة وبصيغة ثابتة. مثال Sodium الكامل ده بيطبع `private note` وبعدها `wrong context rejected`.

```php
<?php
declare(strict_types=1);



function seal(string $plain, string $context, string $key): string
{
    $nonce = random_bytes(SODIUM_CRYPTO_AEAD_XCHACHA20POLY1305_IETF_NPUBBYTES);
    $cipher = sodium_crypto_aead_xchacha20poly1305_ietf_encrypt($plain, $context, $nonce, $key);
    return base64_encode($nonce . $cipher);
}

function openSealed(string $encoded, string $context, string $key): string
{
    $payload = base64_decode($encoded, true);
    $nonceBytes = SODIUM_CRYPTO_AEAD_XCHACHA20POLY1305_IETF_NPUBBYTES;
    if ($payload === false || strlen($payload) < $nonceBytes + SODIUM_CRYPTO_AEAD_XCHACHA20POLY1305_IETF_ABYTES) {
        throw new RuntimeException('Invalid encrypted payload');
    }
    $plain = sodium_crypto_aead_xchacha20poly1305_ietf_decrypt(
        substr($payload, $nonceBytes), $context, substr($payload, 0, $nonceBytes), $key,
    );
    if ($plain === false) {
        throw new RuntimeException('Authentication failed');
    }
    return $plain;
}

$key = sodium_crypto_aead_xchacha20poly1305_ietf_keygen();
$encoded = seal("private note", "user:42:note:v1", $key);
echo openSealed($encoded, "user:42:note:v1", $key), PHP_EOL;
try {
    openSealed($encoded, "user:99:note:v1", $key);
} catch (RuntimeException) {
    echo "wrong context rejected", PHP_EOL;
}
```

ولّد nonce عشوائيًا جديدًا من 24 بايت لكل تشفير بالخوارزمية دي. ضمان عدم تكراره مسؤولية المستدعي؛ التكرار مش لازم يرمي خطأ. حاوية المثال التعليمية مافيهاش بروتوكول تدوير مفاتيح أو Key ID؛ أضف صيغة محددة الإصدار ومتحققًا منها قبل التخزين الدائم في الإنتاج.

تحويل HTTP إلى HTTPS مش هيحمي بيانات Basic اللي اتبعتت بالفعل في أول طلب HTTP. اضبط HTTPS عند العميل قبل إرفاق بيانات الاعتماد، وافرض TLS عند مدخل الخدمة، وما تمررش Authorization لدومين آخر عبر التحويلات. HSTS بيساعد المتصفحات اللي تعرف السياسة أو عندها preload؛ مش بيعالج تسريب حصل بالفعل.


[PHP XChaCha20-Poly1305](https://www.php.net/manual/en/function.sodium-crypto-aead-xchacha20poly1305-ietf-encrypt.php)
