---
title: 7. متغيرات البيئة وإدارة الإعدادات
prev: {"link":"/php-runtime/08-cli-ini-extensions/","label":"PHP CLI وphp.ini والامتدادات"}
next: {"link":"/php-runtime/01-composer-dependencies/","label":"Composer وإدارة الاعتماديات"}
description: getenv و$_ENV وputenv و.env وتحويل الإعدادات والتحقق منها وحماية الأسرار في PHP-FPM.
sidebar:
  order: 7
---

## قبل ما تبدأ

ذاكر الدرس على 3 خطوات: افهم المشكلة الأول، تابع المثال، وبعدها جرّب الجزء العملي بنفسك. المصطلحات الجديدة الموجودة تحت متشرحة قبل ما ندخل في التفاصيل.

### كلمات جديدة في الدرس

- **Configuration:** قيم بتحدد سلوك التطبيق حسب البيئة من غير تعديل منطق البرنامج، زي حد الانتظار واسم البيئة.
- **Boolean:** قيمة منطقية لها حالتان فقط: صح أو خطأ.
- **Function:** جزء كود له اسم ومهمة محددة ويمكن استدعاؤه أكثر من مرة.


- **Composer:** مدير حزم PHP يثبت المكتبات ويجهز التحميل التلقائي.
- **PHP-FPM:** مدير عمليات يشغّل عمال PHP لصالح خادم الويب.
- **Container:** بيئة معزولة تجمع التطبيق واعتماداته.

# افصل الإعداد عن الكود

متغيرات البيئة قيم يوفّرها Operating System أو container أو مدير الخدمة للعملية. تستخدم لتغيير إعدادات البيئة دون تعديل source code، مثل DSN وقيمة debug واسم البيئة.

```text
OS / container / service manager
              -> PHP-FPM master
              -> worker process
              -> getenv() / $_SERVER / $_ENV
```

## getenv و$_ENV وputenv

```php
$dsn = getenv('DATABASE_DSN');

if ($dsn === false || $dsn === '') {
    throw new RuntimeException('DATABASE_DSN is required');
}
```

افحص `=== false` لأن النص `"0"` قيمة صحيحة لكنه falsy.

- `getenv('NAME')` يقرأ متغيرًا ويعيد `false` عند غيابه.
- `$_ENV` نسخة superglobal من القيم التي استوردتها PHP، وقد تكون فارغة إذا كان `variables_order` لا يحتوي `E`.
- `$_SERVER` قد يحتوي بعض قيم البيئة/CGI حسب SAPI.
- `putenv('NAME=value')` يغيّر بيئة العملية للطلب الحالي، ولا يعني أن `$_ENV` سيتزامن تلقائيًا معه.

:::caution[تصحيح مهم]
PHP لا تقرأ ملف `.env` تلقائيًا. تحتاج framework أو مكتبة مثل `vlucas/phpdotenv` أو bootstrap خاص. في الإنتاج قد تُحقن variables مباشرة من orchestrator أو secret manager دون وجود ملف.
:::

## تحميل .env في التطوير

```bash
composer require vlucas/phpdotenv
```

```php
<?php
declare(strict_types=1);

require dirname(__DIR__) . '/vendor/autoload.php';

$dotenv = Dotenv\Dotenv::createImmutable(dirname(__DIR__));
$dotenv->safeLoad();
$dotenv->required(['APP_ENV', 'DATABASE_DSN']);
```

```dotenv
# .env.example - أسماء وأمثلة غير سرية
APP_ENV=local
APP_DEBUG=false
DATABASE_DSN=mysql:host=127.0.0.1;dbname=app;charset=utf8mb4
```

- ارفع `.env.example` بلا أسرار.
- ضع `.env` في `.gitignore` وخارج document root.
- لا تضع قيم production الحقيقية في README أو logs أو frontend bundle.
- إذا تسرب سر، احذفه من السجل و**دوّره**؛ حذف commit وحده لا يبطل السر.

## طبقة Config واحدة

المثال يحتاج PHP 8.2+ بسبب `readonly class`، وفهم Class وConstructor من OOP. أسماء البيئة المقبولة هنا عقد المثال، وعدّلها عمدًا لو مشروعك له أسماء تانية.

لا تستدعِ `getenv()` في كل class. حوّل النصوص وتحقق منها عند بدء التطبيق:

```php
final readonly class AppConfig
{
    public function __construct(
        public string $environment,
        public bool $debug,
        public string $databaseDsn,
        public int $httpTimeoutMs,
    ) {}

    public static function fromEnvironment(): self
    {
        $dsn = $_ENV['DATABASE_DSN'] ?? getenv('DATABASE_DSN');
        if ($dsn === false || $dsn === '') {
            throw new RuntimeException('DATABASE_DSN is required');
        }

        $environment = $_ENV['APP_ENV'] ?? (($raw = getenv('APP_ENV')) === false ? 'production' : $raw);
        if (!in_array($environment, ['local', 'testing', 'staging', 'production'], true)) {
            throw new RuntimeException('APP_ENV is invalid');
        }

        $debug = filter_var(
            $_ENV['APP_DEBUG'] ?? (($raw = getenv('APP_DEBUG')) === false ? 'false' : $raw),
            FILTER_VALIDATE_BOOL,
            FILTER_NULL_ON_FAILURE,
        );

        if ($debug === null) {
            throw new RuntimeException('APP_DEBUG must be true or false');
        }

        $timeout = filter_var(
            $_ENV['HTTP_TIMEOUT_MS'] ?? (($raw = getenv('HTTP_TIMEOUT_MS')) === false ? '5000' : $raw),
            FILTER_VALIDATE_INT,
            ['options' => ['min_range' => 100, 'max_range' => 60_000]],
        );

        if ($timeout === false) {
            throw new RuntimeException('HTTP_TIMEOUT_MS is invalid');
        }

        return new self(
            environment: $environment,
            debug: $debug,
            databaseDsn: $dsn,
            httpTimeoutMs: $timeout,
        );
    }
}
```

بهذا يفشل التطبيق مبكرًا بدل اكتشاف إعداد ناقص وسط طلب حقيقي، وتتعامل بقية الطبقات مع أنواع صحيحة.

الـdefault يتطبق على الغياب فقط. قيمة HTTP_TIMEOUT_MS='0' موجودة لكنها خارج النطاق، فلا نستبدلها بـ5000. تحميل .env عبر createImmutable يملأ $_ENV و$_SERVER افتراضيًا، مش getenv؛ المثال يقرأ $_ENV أولًا ثم process environment. **Precedence** ترتيب أولوية المصادر، وهنا المصدر الأول له الأولوية؛ لا تطبع قيم الأسرار عند التشخيص.

## PHP-FPM والبيئة

FPM قد ينظف البيئة افتراضيًا عبر `clear_env`. مرّر قائمة صريحة في إعداد pool أو عبر مدير الخدمة:

```ini
; app-pool.conf
clear_env = yes
env[APP_ENV] = $APP_ENV
env[DATABASE_DSN] = $DATABASE_DSN
```

الأفضل عدم نسخ البيئة كاملة بلا حاجة. امنح كل pool الحد الأدنى من الأسرار والصلاحيات.

## قواعد الأسرار

- Environment variables ليست تشفيرًا؛ يمكن أن تظهر لأدوات مراقبة أو child processes حسب النظام.
- استخدم secret manager عندما تحتاج rotation وauditing وسياسات وصول.
- لا تعرض `phpinfo()` أو dump كاملًا لـ`$_ENV` في الإنتاج.
- افصل secrets عن الإعدادات العامة، ودوّر كلمات المرور والمفاتيح دوريًا.
- لا ترسل سرًا إلى browser؛ ما يصل إلى JavaScript لم يعد server secret.

## ترتيب الأولوية

حدد سياسة واحدة واضحة، مثل:

```text
hard-coded safe defaults
  <- committed non-secret config
  <- environment-specific values
  <- secret manager
```

لا تجعل ترتيب الدمج ضمنيًا؛ سجّل **مصدر الإعداد وأسماء المفاتيح** عند التشخيص، دون تسجيل القيم السرية.

## مسألة تشغيلية

<details><summary>ليه ما نحطش secret في Git؟</summary><p>تاريخ Git يظل محتفظًا به وقد يصل لنسخ كثيرة؛ استخدم secret manager ودوّر السر إذا تسرب.</p></details>

## شغّل وتحقق

استخدم [المختبر القابل للتنزيل](/php/00-lab-setup/) للسكربتات المرفقة. أوامر Composer وFPM وDocker وserver الحقيقي تُنفذ داخل المشروع المُجهز للخدمة، مش مجلد فاضي.

نفّذ نقطة التحقق التالية داخل بيئة الدرس:

~~~bash
php app-config-check.php
~~~

الملف `app-config-check.php` في المختبر بيضم نفس AppConfig المعروضة فوق، مش تجربة LESSON_MODE القديمة. جرّب من PowerShell داخل مجلد المختبر:

~~~powershell
$env:DATABASE_DSN = 'sqlite::memory:'
$env:HTTP_TIMEOUT_MS = '0'
php app-config-check.php
$LASTEXITCODE
Remove-Item Env:HTTP_TIMEOUT_MS
php app-config-check.php
$LASTEXITCODE
Remove-Item Env:DATABASE_DSN
~~~

الأولى ترفض timeout وتخرج بكود 2؛ التانية تستخدم Default وتطبع أسماء المفاتيح فقط وكود 0. استخدم نافذة تدريب من غير قيم مشروعك؛ الأوامر الأخيرة تزيل القيم التدريبية من النافذة الحالية. في Bash استعمل `DATABASE_DSN='sqlite::memory:' HTTP_TIMEOUT_MS=0 php app-config-check.php` للفشل، واحذف تعيين HTTP_TIMEOUT_MS من الأمر لتجربة الغياب.

**معيار النجاح:** يفشل التشغيل مبكرًا عند غياب DATABASE_DSN أووجود قيمة غير صالحة، ويطبع أسماء الإعدادات لا قيم الأسرار.

دوّن كود الخروج والدليل الفعلي. إذا اختلف الناتج، فسر البيئة أو الفرضية التي اختلفت بدل تعديل «المتوقع» حتى يطابق الخطأ.

## اربط النقاط ببعض

ابن typed configuration schema يحقق القيم مرة عند startup ويحول المدة والحجم وBoolean صراحة. حدد precedence بين defaults وfile وenvironment وsecret manager. Configuration immutable داخل request، وsecret rotation تحتاج نافذة تقبل القديم والجديد دون طباعة أي قيمة.

#### دورة التجربة

قبل التنفيذ اكتب توقعك، ثم شغّل المثال وسجّل الخروج. أحدث فشلًا واحدًا مقصودًا، اجمع الدليل من logs أو metrics، أصلح السبب، وأعد التشغيل لإثبات أن الإصلاح يعالج العطل ولا يخفيه.


### جرّب بنفسك

احذف متغيرًا مطلوبًا وأدخل Boolean ملتبسًا وتأكد من fail-fast.
