---
title: 11. الأخطاء والاستثناءات
description: Throwable وError وException وtry/catch/finally والاستثناءات المخصصة وحدود المعالجة والتسجيل الآمن.
sidebar:
  order: 11
---

## قبل ما تبدأ

ذاكر الدرس على 3 خطوات: افهم المشكلة الأول، تابع المثال، وبعدها جرّب الجزء العملي بنفسك. المصطلحات الجديدة الموجودة تحت متشرحة قبل ما ندخل في التفاصيل.

### كلمات جديدة في الدرس

- **HTTP:** قواعد تبادل الطلبات والردود بين المتصفح والخادم.
- **Token:** قيمة تمثل هوية أو صلاحية محددة بدل إرسال كلمة السر كل مرة.
- **Worker:** برنامج يعمل في الخلفية ويسحب المهام من الطابور وينفذها.
- **Function:** دالة: جزء كود له اسم ومهمة محددة ويمكن استدعاؤه أكثر من مرة.


## الخطأ مش كله نوع واحد

فيه فرق بين Bug في الكود، ومدخل مستخدم غير صالح، وفشل خدمة خارجية، وحالة عمل متوقعة زي «الرصيد غير كافٍ». لو عاملنا كل الحالات بنفس الرسالة أو `try/catch` ضخمة، هنخفي السبب ومش هنعرف نرجع HTTP Status مناسب.

الـException طريقة تقول: «الدالة ماقدرتش تكمل النتيجة الطبيعية». لما يحصل `throw`، التنفيذ يخرج من المسار الحالي ويدور على `catch` مناسب. لو مفيش، يوصل لحد التطبيق العام Global Boundary.

```php
function withdraw(int $balanceCents, int $amountCents): int
{
    if ($amountCents <= 0) {
        throw new InvalidArgumentException('Amount must be positive');
    }

    if ($amountCents > $balanceCents) {
        throw new DomainException('Insufficient funds');
    }

    return $balanceCents - $amountCents;
}
```

ما تعملش Catch لمجرد إنك ترجع `null` وتنسى المشكلة. امسك الاستثناء في الطبقة اللي تعرف تضيف قرارًا: تعيد محاولة آمنة، تحول خطأ المجال إلى Response، أو تسجل التفاصيل وترجع رسالة عامة. واستخدم `finally` لتنظيف مورد لازم يتقفل سواء العملية نجحت أو فشلت.

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

## تدريب عملي متدرج

<details><summary>1. إمتى ترمي DomainException؟</summary><p>لما الطلب صالح تقنيًا لكن مرفوض حسب قواعد المجال، زي سحب أكبر من الرصيد. مدخل بنوع أوصيغة غير صحيحة يناسبه InvalidArgumentException عند هذا الحد.</p></details>

<details><summary>2. إيه مشكلة <code>catch (Throwable) { return null; }</code>؟</summary><p>بيخفي Bugs وفشل البنية ويخلطهم مع «لا توجد نتيجة». عالج الحالات المعروفة، وسيب الحد العام يسجل غير المتوقع ويرجّع استجابة آمنة.</p></details>

<details><summary>3. فين تستخدم finally؟</summary><p>لتنظيف لازم يحصل في النجاح والفشل، زي قفل ملف أوإرجاع Resource، بشرط ألا يخفي Exception الأصلية.</p></details>

## مسائل مرتبطة بالدرس

<details><summary>أين تمسك Exception؟</summary><p>في طبقة تستطيع اتخاذ قرار مفيد: التعافي أو التحويل إلى نتيجة مناسبة أو التسجيل ثم الإنهاء عند boundary.</p></details>

<details><summary>لماذا لا نعرض stack trace للمستخدم؟</summary><p>قد يكشف مسارات وأسرارًا وتفاصيل داخلية؛ أعطِ المستخدم رسالة آمنة وسجّل التفاصيل داخليًا.</p></details>

## شغّل وتحقق

استخدم [المختبر القابل للتنزيل](/php/00-lab-setup/) للسكربتات المرفقة. أوامر Composer وFPM وDocker والخادم الحقيقي تُنفذ داخل المشروع المُجهز للخدمة، مش مجلد فاضي.

نفّذ نقطة التحقق التالية داخل بيئة الدرس:

~~~bash
php error-lab.php
~~~

**معيار النجاح:** الحالة المتوقعة تُحوّل إلى نتيجة مجال واضحة، والخطأ غير المتوقع يصل إلى المعالج المركزي مرة واحدة مع correlation ID ولا يُبتلع.

دوّن كود الخروج والدليل الفعلي. إذا اختلف الناتج، فسر البيئة أو الفرضية التي اختلفت بدل تعديل «المتوقع» حتى يطابق الخطأ.

## اربط النقاط ببعض

<code>Throwable</code> يجمع Error وException، وfinally ينفذ للتنظيف حتى مع return أو throw. حوّل warnings إلى exceptions فقط عند boundary تفهم عقده. في worker طويل العمر يجب أن يمنع المعالج سقوط العملية أو تلوث الرسالة التالية حسب السياسة، مع logging مرة واحدة.

### جرّب بنفسك

اختبر success وdomain failure وunexpected error وتأكد من cleanup.
