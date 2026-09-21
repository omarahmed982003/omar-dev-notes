---
title: 9. Logging وObservability
description: PSR-3 وstructured logs وrequest IDs وmetrics وtraces والتنقية والمراقبة.
sidebar:
  order: 9
---

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

