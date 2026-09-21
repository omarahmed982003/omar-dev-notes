---
title: 11. الأخطاء والاستثناءات
description: Throwable وError وException وtry/catch/finally والاستثناءات المخصصة وحدود المعالجة والتسجيل الآمن.
sidebar:
  order: 11
---

## Error أم Exception؟

كل من `Exception` و`Error` يطبقان `Throwable`. الاستثناء يمثل غالبًا فشلًا متوقعًا في العملية، بينما `Error` يشمل أخطاء لغة/نوع وتشغيل لا ينبغي تحويلها كلها إلى “نجاح”.

```php
try {
    $receipt = $payments->charge($order);
} catch (PaymentDeclined $e) {
    // فشل مجال متوقع
} catch (Throwable $e) {
    // حد التطبيق: سجّل ثم حوّل لاستجابة عامة
} finally {
    $lock?->release();
}
```

`finally` ينفذ سواء نجح المسار أو رُمي exception، لذلك يناسب تحرير resource. لا تستخدم catch فارغًا.

## استثناءات المجال

```php
final class InsufficientStock extends DomainException
{
    public function __construct(public readonly int $productId)
    {
        parent::__construct('Insufficient stock');
    }
}
```

اجعل النوع يحمل معنى يمكن للطبقة العليا ترجمته إلى `409` أو رسالة مناسبة. لا تستخدم نص الرسالة لاتخاذ قرار برمجي.

## Error reporting

في التطوير:

```ini
display_errors=On
error_reporting=E_ALL
```

في الإنتاج:

```ini
display_errors=Off
log_errors=On
error_reporting=E_ALL
```

إظهار stack trace للمستخدم قد يكشف paths وأسرارًا وSQL. أعطِ المستخدم رسالة عامة وrequest ID، وسجّل التفاصيل في قناة محمية.

## Global boundary

```php
set_exception_handler(function (Throwable $e): void {
    $requestId = bin2hex(random_bytes(8));
    error_log("[{$requestId}] {$e}");

    if (!headers_sent()) {
        http_response_code(500);
        header('Content-Type: application/json');
    }

    echo json_encode(['error' => 'Internal error', 'request_id' => $requestId]);
});
```

الـhandler شبكة أمان، وليس بديلًا عن معالجة الفشل المتوقع قرب سياقه.

## قواعد

- لا تستخدم `@` لإخفاء الأخطاء.
- لا تعرض رسالة exception الخام للعميل.
- احتفظ بـ`previous` عند wrapping.
- لا تسجل password أو token أو body كاملًا بلا تنقية.
- أعد المحاولة فقط للأخطاء المؤقتة وبعملية idempotent.

