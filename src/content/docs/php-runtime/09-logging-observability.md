---
title: 9. Logging وObservability
description: PSR-3 وstructured logs وrequest IDs وmetrics وtraces والتنقية والمراقبة.
sidebar:
  order: 9
---

## قبل ما تبدأ

ذاكر الدرس على 3 خطوات: افهم المشكلة الأول، تابع المثال، وبعدها جرّب الجزء العملي بنفسك. المصطلحات الجديدة الموجودة تحت متشرحة قبل ما ندخل في التفاصيل.

### كلمات جديدة في الدرس

- **HTTP:** قواعد تبادل الطلبات والردود بين المتصفح والخادم.
- **API:** واجهة محددة تسمح لبرنامج يطلب بيانات أو ينفّذ عملية عند برنامج آخر.
- **Proxy:** وسيط يستقبل الطلب ويمرره لجهة أخرى حسب قواعد محددة.
- **Cache:** نسخة مؤقتة من البيانات هدفها تقليل وقت الانتظار والعمل المتكرر.
- **Session:** بيانات مؤقتة تساعد الخادم يميّز المستخدم بين أكثر من طلب.
- **Cookie:** قيمة صغيرة يحفظها المتصفح ويرسلها مع الطلبات المناسبة.
- **Queue:** طابور مهام تنتظر عاملًا ينفذها في الخلفية.
- **Function:** دالة: جزء كود له اسم ومهمة محددة ويمكن استدعاؤه أكثر من مرة.


## ثلاثة أنواع من الإشارة

- **Logs:** أحداث مفصلة قابلة للبحث.
- **Metrics:** أرقام مجمعة عبر الزمن مثل latency وerror rate.
- **Traces:** رحلة request عبر services وdatabase وqueues.

لا تعالج observability بإضافة `error_log` في كل مكان؛ صمّم schema وسياسة retention وتنبيهات.

## PSR-3 وStructured Logging

```php
use Psr\Log\LoggerInterface;

final class Checkout
{
    public function __construct(private LoggerInterface $logger) {}

    public function run(Order $order, string $requestId): void
    {
        $this->logger->info('checkout.started', [
            'request_id' => $requestId,
            'order_id' => $order->id(),
        ]);
    }
}
```

مرّر البيانات كـcontext بدل تركيب نص يصعب تحليله. Monolog تنفيذ شائع لـPSR-3.

## Correlation

أنشئ request ID عند edge أو اقبلها فقط من proxy موثوق، ثم مرّرها إلى logs وoutgoing HTTP وqueue metadata. Trace ID ليست بالضرورة user-visible request ID.

## ما لا نسجله

- كلمات المرور وsession IDs وaccess/refresh tokens.
- Authorization/Cookie headers.
- مفاتيح التشفير والأسرار.
- bodies كاملة أو بيانات شخصية بلا حاجة.

طبّق allow-list أو redaction واختبرها. الـlogs نفسها بيانات حساسة وتحتاج access control وintegrity وretention.

## Metrics مفيدة

استخدم latency histograms وrequest rate وerror rate وsaturation. راقب PHP-FPM queue و`max children reached`، database pool، external API latency، queue lag، cache hit ratio.

## تنبيه عملي

التنبيه يجب أن يعكس أثرًا قابلًا للتصرف، مثل ارتفاع نسبة `5xx` أو p95 latency، لا كل exception منفردة. اربط deployment version بالـlogs والـmetrics لتحديد regression.

## مرجع

- [PSR-3 Logger Interface](https://www.php-fig.org/psr/psr-3/)

## مسألة تشغيلية

<details><summary>ما الذي يجعل log قابلًا للتتبع؟</summary><p>حدث منظم مع timestamp وseverity وrequest/trace ID وسياق آمن، من غير كلمات مرور أو tokens.</p></details>

## شغّل وتحقق

استخدم [المختبر القابل للتنزيل](/php/00-lab-setup/) للسكربتات المرفقة. أوامر Composer وFPM وDocker والخادم الحقيقي تُنفذ داخل المشروع المُجهز للخدمة، مش مجلد فاضي.

نفّذ نقطة التحقق التالية داخل بيئة الدرس:

~~~bash
php observability-lab.php 2> event.log
~~~

**معيار النجاح:** يحتوي كل حدث على timestamp وlevel وrequest_id وmessage، ولا يحتوي كلمة مرور أو Authorization header.

دوّن كود الخروج والدليل الفعلي. إذا اختلف الناتج، فسر البيئة أو الفرضية التي اختلفت بدل تعديل «المتوقع» حتى يطابق الخطأ.

## اربط النقاط ببعض

أضف trace context وspan IDs عبر HTTP والqueue وقاعدة البيانات، وحدد sampling يحفظ الأخطاء والطلبات النادرة دون تكلفة كاملة. اضبط cardinality للlabels ولا تضع user ID الخام في metric. حدد retention وredaction وحق الوصول واربط log وmetric وtrace بـcorrelation واحد.

### جرّب بنفسك

تتبع request واحدًا عبر ثلاث خدمات وتأكد من عدم ظهور secret.
