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

## خريطة الدرس

<div class="lesson-diagram" role="img" aria-label="خريطة مفاهيم: Logging وObservability">
<p class="lesson-diagram-title">خريطة مفاهيم: Logging وObservability</p>
<div class="diagram-flow">
<div class="diagram-node input"><span>ثلاثة أنواع من الإشارة</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>PSR-3 وStructured Logging</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>Correlation</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node decision"><span>ما لا نسجله</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node output"><span>Metrics مفيدة</span></div>
</div>
</div>

## تأكد من فهمك

<div class="lesson-quiz" role="list">
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">01</span><p>اشرح «ثلاثة أنواع من الإشارة» كأنك تراجع تطبيقًا حقيقيًا: ما الهدف وما أهم قيد يجب الانتباه له؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> Logs: أحداث مفصلة قابلة للبحث. Metrics: أرقام مجمعة عبر الزمن مثل latency وerror rate. Traces: رحلة request عبر services وdatabase وqueues. لا تعالج observability بإضافة error_log في كل مكان؛ صمّم schema وسياسة retention وتنبيهات. عمليًا، لا يكفي تنفيذ المسار الناجح؛ يجب توثيق الافتراضات والتحقق من القيم والحالات التي قد تكسر هذا السلوك.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">02</span><p>قارن بين «ثلاثة أنواع من الإشارة» و«PSR-3 وStructured Logging». لماذا لا يغني أحدهما عن الآخر داخل موضوع «Logging وObservability»؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> في «ثلاثة أنواع من الإشارة»: Logs: أحداث مفصلة قابلة للبحث. Metrics: أرقام مجمعة عبر الزمن مثل latency وerror rate. Traces: رحلة request عبر services وdatabase وqueues. لا تعالج observability بإضافة error_log في كل مكان؛ صمّم schema وسياسة retention وتنبيهات. أما «PSR-3 وStructured Logging»: مرّر البيانات كـcontext بدل تركيب نص يصعب تحليله. Monolog تنفيذ شائع لـPSR-3. العلاقة بينهما أن الأول يحدد جانبًا من الحل، والثاني يكمل السلوك أو القيود اللازمة لتطبيقه بصورة صحيحة.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">03</span><p>افترض أن نظامًا تجاهل «Correlation». ما العطل أو الخطر المتوقع، وكيف تصمم اختبارًا يكشفه؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> أنشئ request ID عند edge أو اقبلها فقط من proxy موثوق، ثم مرّرها إلى logs وoutgoing HTTP وqueue metadata. Trace ID ليست بالضرورة user-visible request ID. لاكتشاف الخلل، اختبر مسارًا صحيحًا، وقيمة عند الحد، ومدخلًا غير صالح، ثم راقب النتيجة والآثار الجانبية والسجل بدل الاكتفاء بعدم ظهور Exception.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">04</span><p>حوّل «ما لا نسجله» إلى قرار هندسي قابل للمراجعة. ما الذي ستوثقه وما الحالات التي ستختبرها؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> كلمات المرور وsession IDs وaccess/refresh tokens. Authorization/Cookie headers. مفاتيح التشفير والأسرار. bodies كاملة أو بيانات شخصية بلا حاجة. طبّق allow-list أو redaction واختبرها. الـlogs نفسها بيانات حساسة وتحتاج access control وintegrity وretention. وثّق سبب الاختيار والبدائل والحدود، واختبر الحالة العادية، والحد الأدنى والأقصى، والفشل الجزئي، وإعادة المحاولة أو التكرار إن كان السلوك يسمح بذلك.</div></details>
</section>
</div>
