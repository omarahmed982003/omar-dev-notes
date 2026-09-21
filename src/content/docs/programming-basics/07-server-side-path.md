---
title: "7. داخل الخادم: Load Balancer وNginx وPHP-FPM"
description: رحلة الطلب داخل البنية الخلفية من الشبكة إلى الخادم والتطبيق وقاعدة البيانات ثم الاستجابة.
sidebar:
  order: 7
---

## من الإنترنت إلى التطبيق

الجزء الأخير من الرسم المكتوب في الصفحتين 10 و11 هو:

```text
Network
   ↓
Load Balancer
   ↓
Web Server (Nginx/Apache)
   ├── Static File → Response
   └── Dynamic PHP → PHP-FPM
                         ↓
                    Application
                    ↙    ↓     ↘
                 Cache Database External API
                         ↓
                      Response
```

كل طبقة اختيارية ويمكن دمج عدة أدوار على جهاز واحد في مشروع صغير.

## Load Balancer

يوزع الطلبات على أكثر من backend لرفع التوافر والسعة. قد يعمل على Layer 4 باستخدام TCP/UDP، أو Layer 7 ويفهم HTTP.

وظائف محتملة:

- Health checks واستبعاد الخادم غير السليم.
- TLS termination.
- توزيع round-robin أو least-connections أو خوارزمية أخرى.
- Sticky sessions عند الضرورة، مع أن shared session store غالبًا أسهل للتوسع.
- إضافة forwarding headers.

:::caution
لا تثق في `X-Forwarded-For` من أي عميل مباشرة. اضبط قائمة trusted proxies، وإلا يمكن تزوير عنوان العميل.
:::

أمثلة: Nginx/HAProxy أو خدمات سحابية مثل AWS Elastic Load Balancing. والـLoad Balancer ليس بديلًا لقاعدة البيانات أو كود التطبيق.

## Web Server وVirtual Host

يستقبل Nginx أو Apache الاتصال ويختار الموقع باستخدام IP/port واسم `Host` أو SNI/TLS configuration.

- **Static file:** صورة أو CSS أو JS يمكن إعادته مباشرة، مع Cache وCompression.
- **Dynamic PHP:** يُمرر إلى PHP runtime، غالبًا PHP-FPM عبر FastCGI.
- **Reverse proxy:** قد يمرر الطلب إلى خدمة أخرى.

:::note[تصحيح]
Nginx لا ينفذ PHP داخل عمليته. يمرر الطلب إلى PHP-FPM ثم يستقبل الناتج. Apache يمكن أن يستخدم PHP-FPM أيضًا أو إعدادات أخرى.
:::

## PHP-FPM والتطبيق

يدير PHP-FPM مجموعة workers. يستقبل FastCGI parameters والطلب، يشغّل entry point مثل `public/index.php`، ثم يعيد headers/body لخادم الويب.

التطبيق بدوره:

1. يطابق Route.
2. يشغّل Middleware.
3. يتحقق من المدخلات والمصادقة والصلاحيات.
4. ينفذ business logic.
5. يستخدم Database/Cache/Queue/API عند الحاجة.
6. يبني Response.

```php
<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');

try {
    $product = ['id' => 42, 'name' => 'Keyboard'];
    echo json_encode($product, JSON_THROW_ON_ERROR);
} catch (Throwable $e) {
    error_log($e);
    http_response_code(500);
    echo json_encode(['error' => 'Internal server error']);
}
```

لا ترسل stack trace أو كلمات مرور قاعدة البيانات للمستخدم.

## رجوع الاستجابة

تعود النتيجة إلى Web Server ثم Load Balancer/CDN ثم الشبكة والمتصفح. قد تضيف طبقات وسيطة headers أو compression أو caching.

راقب:

- `Content-Type` الصحيح.
- Status code الصحيح.
- `Cache-Control` للبيانات الخاصة والعامة.
- Security headers الملائمة.
- Request ID لتتبع نفس الطلب في logs عبر الخدمات.
- زمن كل طبقة، لا زمن PHP فقط.

## حالات مهمة

### Cache hit

```text
Browser/CDN Cache → response
PHP and database are skipped
```

### Static file

```text
Nginx → /public/app.css → response
PHP is skipped
```

### Dynamic request

```text
Nginx → PHP-FPM → App → Database → response
```

### فشل backend

قد يعيد proxy حالة `502 Bad Gateway` عندما لا يحصل على استجابة صحيحة من upstream، أو `504 Gateway Timeout` عند انتهاء المهلة. أما `500` فعادة خطأ داخل التطبيق/الخادم الذي عالج الطلب.

## تدريب نهائي

1. افتح Network tab وسجّل method وstatus وcontent type.
2. أعد تحميل الصفحة ولاحظ `304` أو `from memory cache`.
3. أضف ملف CSS ثابتًا وendpoint PHP ديناميكيًا وقارن.
4. أرسل request ID في header وسجله داخل PHP.
5. ارسم مسارك الفعلي وحدد الطبقات غير الموجودة بدل نسخ المخطط حرفيًا.
