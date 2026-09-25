---
title: 15. Profiling وSLI/SLO وOpenTelemetry
description: تحليل الأداء وFlame Graphs وبناء مؤشرات الخدمة وانتقال Trace Context بين الخدمات.
sidebar:
  order: 15
---

## القياس قبل التحسين

ابدأ بأثر قابل للقياس: Endpoint بطيء، استهلاك CPU مرتفع، Memory Growth أو نسبة أخطاء زادت. لا تستنتج السبب من المتوسط وحده؛ افحص `p50` و`p95` و`p99` وحجم الطلب ومعدل المرور. التحسين بلا Baseline قد ينقل الكلفة إلى قاعدة البيانات أو الذاكرة بدل حلها.

## Sampling Profiler وInstrumentation

Sampling Profiler يأخذ عينات دورية من Call Stack بتكلفة أقل ويكشف أين يقضي البرنامج وقته. Instrumentation تسجل مدة عمليات محددة بدقة أكبر لكنها تضيف كودًا وكلفة. استخدم بيئة تشبه الإنتاج، Warm-up مناسبًا، وDataset واقعية.

```php
$started = hrtime(true);
try {
    $result = $service->buildReport($request);
} finally {
    $durationMs = (hrtime(true) - $started) / 1_000_000;
    $logger->info('report.completed', [
        'duration_ms' => $durationMs,
        'memory_peak_bytes' => memory_get_peak_usage(true),
    ]);
}
```

هذا قياس لعملية واحدة، وليس Profiler كاملًا. لا تضف Timer يدويًا حول كل دالة؛ استخدم Profiler وAPM وInstrumentation عند الحدود المهمة.

## قراءة Flame Graph

عرض الإطار يعبّر عن نسبة العينات، لا عن زمن استدعاء واحد. المحور الرأسي يعرض سلسلة الاستدعاءات. ابحث عن Stack عريض متكرر، ثم اسأل هل السبب CPU، Serialization، Regex، Autoloading، Query متكررة أم انتظار I/O لا يظهر جيدًا في CPU Profile. قارن قبل وبعد بنفس الحمل.

## SLI وSLO وError Budget

- **SLI:** قياس فعلي مثل نسبة الطلبات الناجحة تحت 300ms.
- **SLO:** هدف مثل 99.9% من الطلبات الناجحة خلال 30 يومًا.
- **Error Budget:** الجزء المسموح بعدم تحقيق الهدف؛ عند استهلاكه نبطئ التغييرات ونركز على الاعتمادية.

إذا كان SLO هو 99.9% فميزانية الفشل 0.1%، لكنها لا تعني تجاهل تأثير فشل نادر لكنه كارثي. عرّف ما الطلب الصالح وما النجاح، واستبعد Health Checks وحركة الاختبار من الحساب إن كان ذلك موثقًا.

## OpenTelemetry وTrace Context

OpenTelemetry يجمع Traces وMetrics وLogs وفق Context مشترك. يبدأ الطلب بـSpan، وتصبح عمليات قاعدة البيانات وHTTP أبناء له. عند استدعاء خدمة أخرى ينتقل Context عادة عبر W3C `traceparent`; لا تنشئ Trace جديدة في كل خدمة.

```text
Browser -> API span
          -> DB span
          -> HTTP client span -- traceparent --> Payment service span
```

استخدم Auto-instrumentation أو مكتبة معروفة أولًا. إذا حقنت Headers يدويًا، لا تثق بـBaggage قادم من العميل ولا تضع فيه أسرارًا أو بيانات شخصية؛ ينتقل عبر حدود الخدمة وقد يظهر في Telemetry.

## تحليل طلب بطيء

1. ابدأ من Trace بطيئة وحدد أطول Span.
2. اربطها بـLogs باستخدام Trace ID.
3. افحص Query Plan أو خدمة الطرف الثالث أو Queue time.
4. استخدم Profile إذا كان الوقت داخل CPU التطبيق.
5. أصلح السبب واختبر Load وRegression.
6. راقب SLI بعد النشر، لا زمن المثال المحلي فقط.

## تأكد من فهمك

<div class="lesson-quiz" role="list">
<section class="quiz-card" role="listitem"><div class="quiz-question-row"><span class="quiz-number">01</span><p>لماذا المتوسط لا يكفي لزمن الاستجابة؟</p></div><details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة:</strong> قد يخفي Tail بطيئًا يؤثر في عدد مهم من المستخدمين؛ راقب Percentiles والحجم والأخطاء معًا.</div></details></section>
<section class="quiz-card" role="listitem"><div class="quiz-question-row"><span class="quiz-number">02</span><p>ماذا يعني عرض إطار كبير في Flame Graph؟</p></div><details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة:</strong> ظهر هذا المسار في نسبة كبيرة من العينات؛ يحتاج تحقيقًا لكنه لا يثبت وحده أن الدالة بطيئة في كل استدعاء.</div></details></section>
<section class="quiz-card" role="listitem"><div class="quiz-question-row"><span class="quiz-number">03</span><p>ما الفرق بين SLI وSLO؟</p></div><details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة:</strong> SLI هو القياس، وSLO هو الهدف المحدد لهذا القياس خلال نافذة زمنية.</div></details></section>
<section class="quiz-card" role="listitem"><div class="quiz-question-row"><span class="quiz-number">04</span><p>كيف تحافظ على Trace واحدة بين خدمتين؟</p></div><details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة:</strong> حقن Trace Context في الطلب الصادر واستخراجه في الخدمة المستقبلة، ويفضل عبر Instrumentation موثوقة.</div></details></section>
</div>
