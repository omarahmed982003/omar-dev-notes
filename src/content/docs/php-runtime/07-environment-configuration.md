---
title: 7. متغيرات البيئة وإدارة الإعدادات
description: getenv و$_ENV وputenv و.env وتحويل الإعدادات والتحقق منها وحماية الأسرار في PHP-FPM.
sidebar:
  order: 7
---

# افصل الإعداد عن الكود

متغيرات البيئة قيم يوفّرها نظام التشغيل أو container أو مدير الخدمة للعملية. تستخدم لتغيير إعدادات البيئة دون تعديل source code، مثل DSN وقيمة debug واسم البيئة.

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
PHP لا تقرأ ملف `.env` تلقائيًا. تحتاج framework أو مكتبة مثل `vlucas/phpdotenv` أو bootstrap خاص. في الإنتاج قد تُحقن المتغيرات مباشرة من orchestrator أو secret manager دون وجود ملف.
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
        $dsn = getenv('DATABASE_DSN');
        if ($dsn === false || $dsn === '') {
            throw new RuntimeException('DATABASE_DSN is required');
        }

        $debug = filter_var(
            getenv('APP_DEBUG') ?: 'false',
            FILTER_VALIDATE_BOOL,
            FILTER_NULL_ON_FAILURE,
        );

        if ($debug === null) {
            throw new RuntimeException('APP_DEBUG must be true or false');
        }

        $timeout = filter_var(
            getenv('HTTP_TIMEOUT_MS') ?: '5000',
            FILTER_VALIDATE_INT,
            ['options' => ['min_range' => 100, 'max_range' => 60_000]],
        );

        if ($timeout === false) {
            throw new RuntimeException('HTTP_TIMEOUT_MS is invalid');
        }

        return new self(
            environment: getenv('APP_ENV') ?: 'production',
            debug: $debug,
            databaseDsn: $dsn,
            httpTimeoutMs: $timeout,
        );
    }
}
```

بهذا يفشل التطبيق مبكرًا بدل اكتشاف إعداد ناقص وسط طلب حقيقي، وتتعامل بقية الطبقات مع أنواع صحيحة.

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
