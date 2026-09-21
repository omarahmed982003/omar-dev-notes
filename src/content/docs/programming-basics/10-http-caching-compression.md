---
title: 10. HTTP Caching والضغط
description: Freshness وValidation وCache-Control وETag وVary وCDN وضغط gzip وBrotli.
sidebar:
  order: 10
---

## لماذا نخزن الاستجابة؟

الـcache تقلل latency واستهلاك الشبكة والحمل على PHP وقاعدة البيانات. قد توجد نسخ في المتصفح أو proxy/CDN أو التطبيق، ولكل طبقة سياسة مستقلة.

## Freshness وValidation

```http
Cache-Control: public, max-age=60, s-maxage=300
ETag: "product-42-v7"
Vary: Accept-Encoding, Accept-Language
```

- `max-age` مدة freshness للعميل.
- `s-maxage` يمكن أن يخصص shared caches.
- `private` يسمح بالتخزين الخاص ولا يسمح عادة لـCDN بالمشاركة.
- `no-store` يطلب عدم التخزين.
- `no-cache` لا يعني عدم التخزين؛ يعني إعادة التحقق قبل الاستخدام.
- `Vary` يجعل مفتاح النسخة يعتمد على headers محددة.

بعد انتهاء freshness يرسل العميل `If-None-Match`. إذا لم يتغير المورد يعيد الخادم `304 Not Modified` بلا body. ويمكن استخدام `Last-Modified` و`If-Modified-Since` عندما يناسب.

## مثال PHP

```php
$etag = '"' . hash('sha256', $json) . '"';
header('Cache-Control: public, max-age=60');
header("ETag: {$etag}");

if (trim($_SERVER['HTTP_IF_NONE_MATCH'] ?? '') === $etag) {
    http_response_code(304);
    exit;
}

header('Content-Type: application/json; charset=utf-8');
echo $json;
```

لا تجعل بيانات مستخدم خاصة `public`، ولا تعتمد على query string عشوائي كسياسة invalidation.

## الضغط

gzip وBrotli يقللان الحجم النصي مثل HTML وCSS وJSON. طبّق الضغط غالبًا في Web Server/CDN، ولا تضغط صورًا مضغوطة أصلًا بلا قياس. يجب أن تراعي cache قيمة `Accept-Encoding` عادة عبر `Vary`.

## Checklist

- حدّد من يستطيع التخزين ومدة الصلاحية.
- استخدم fingerprinted filenames للأصول الثابتة طويلة العمر.
- اختبر invalidation قبل مدة طويلة.
- لا تخزن استجابة فيها `Set-Cookie` أو بيانات شخصية بصورة عامة.
- راقب hit ratio والحجم والزمن.

## مرجع

- [RFC 9111: HTTP Caching](https://www.rfc-editor.org/rfc/rfc9111)

