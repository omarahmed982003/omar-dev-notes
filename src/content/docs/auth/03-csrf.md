---
title: 3. الحماية من CSRF
description: كيف يستغل CSRF جلسة المستخدم وكيف نمنعه بالـtokens وSameSite والتحقق من المصدر.
sidebar:
  order: 3
---

## قبل ما تبدأ

ذاكر الدرس على 3 خطوات: افهم المشكلة الأول، تابع المثال، وبعدها جرّب الجزء العملي بنفسك. المصطلحات الجديدة الموجودة تحت متشرحة قبل ما ندخل في التفاصيل.

### كلمات جديدة في الدرس

- **URL:** العنوان الكامل لمورد على الويب، زي صفحة أو صورة أو نقطة API.
- **API:** واجهة محددة تسمح لبرنامج يطلب بيانات أو ينفّذ عملية عند برنامج آخر.
- **Session:** بيانات مؤقتة تساعد الخادم يميّز المستخدم بين أكثر من طلب.
- **Cookie:** قيمة صغيرة يحفظها المتصفح ويرسلها مع الطلبات المناسبة.
- **Token:** قيمة تمثل هوية أو صلاحية محددة بدل إرسال كلمة السر كل مرة.
- **UTF-8:** طريقة شائعة لتحويل أرقام Unicode إلى بايتات تُحفظ وتُنقل.


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
$origin = $_SERVER['HTTP_ORIGIN'] ?? null;
$allowedOrigins = ['https://app.example.com'];

if (
    !is_string($sent)
    || $sent === ''
    || !is_string($origin)
    || !in_array($origin, $allowedOrigins, true)
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

## سيناريو أمني

<details><summary>ليه SameSite وحده مش كفاية دائمًا؟</summary><p>له حدود وتوافق وسيناريوهات bypass؛ استخدم token وربط origin مع cookies مناسبة حسب التهديد.</p></details>

## تدريب تهديد

**السيناريو:** صفحة خارجية تحاول إرسال طلب تغيير بريد إلكتروني بملفات تعريف ارتباط الضحية.

**اختبار المنع:** أرسل الطلب بلا CSRF token، ثم بتوكين مستخدم آخر، ثم بتوكين صحيح لكن من Origin غير مسموح.

**النتيجة المتوقعة:** تُرفض المحاولات الثلاث ولا يتغير البريد؛ لا يكفي وجود Cookie صالح لقبول العملية.

### مرجع التحقق

- [OWASP CSRF Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html)

## اربط النقاط ببعض

SameSite يقلل بعض المسارات لكنه لا يستبدل token وOrigin checks، وتوجد فروق بين Lax وStrict وNone. Login CSRF قد يربط الضحية بحساب المهاجم قبل وجود جلسة موثوقة. API لا يستخدم ambient cookies غالبًا لا يحتاج CSRF بنفس الصورة، لكنه يحتاج منع token leakage وCORS صحيح.

### جرّب بنفسك

اختبر login CSRF وطلب cross-site مع SameSite modes مختلفة.


## سياسة المصدر

اضبط الـOrigin الموثوق كاملًا: البروتوكول والدومين والبورت لو مش الافتراضي. ما تبنيش القائمة من Host اللي جاي في الطلب. المثال بيرفض المصدر الغريب وكمان غياب Origin؛ بعض العملاء مش بيبعتوه، فاختبر العملاء الحقيقيين قبل اعتماد fallback مدروس بـReferer. المصدر طبقة إضافية مش إثبات هوية: عميل خارج المتصفح يقدر يكتب الهيدر. احتفظ بفحص توكين الجلسة واستخدم POST للتغييرات.
