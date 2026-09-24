---
title: 11. الاتصال اللحظي وWebhooks
description: Polling وLong Polling وSSE وWebSocket وWebhooks وكيف تختار النمط المناسب.
sidebar:
  order: 12
---

## ليست كل التحديثات Request/Response تقليدية

| النمط | الاتجاه | مناسب لـ |
|---|---|---|
| Polling | العميل يسأل دوريًا | تحديثات قليلة وحل بسيط |
| Long Polling | طلب ينتظر حدثًا | توافق واسع مع latency أقل |
| SSE | Server → Browser | إشعارات وfeeds نصية |
| WebSocket | اتجاهان مستمران | دردشة وألعاب وتعاون لحظي |
| Webhook | Server → Server | إشعار نظام خارجي بحدث |

اختيار WebSocket لمجرد أنه “لحظي” يضيف إدارة connections وheartbeat وbackpressure وتوسّع أفقي. ابدأ بأبسط نمط يحقق المطلوب.

## Server-Sent Events

```php
header('Content-Type: text/event-stream');
header('Cache-Control: no-cache');
header('X-Accel-Buffering: no');

echo "event: order.updated\n";
echo 'data: ' . json_encode(['id' => 42, 'status' => 'paid']) . "\n\n";
flush();
```

SSE يعيد الاتصال تلقائيًا في المتصفح ويمكن استخدام `id` و`Last-Event-ID` للاستئناف. لا تشغل FPM workers بلا حدود؛ راجع بنية الخادم والمهلات قبل streams طويلة.

## Webhooks

المستقبل يجب أن:

1. يقرأ raw body.
2. يتحقق من توقيع HMAC وtimestamp قبل parsing الموثوق.
3. يرفض replay خارج نافذة زمنية.
4. يسجل event ID ويمنع المعالجة المكررة.
5. يعيد نجاحًا سريعًا ثم ينقل العمل الثقيل إلى queue.

```php
$expected = hash_hmac('sha256', $timestamp . '.' . $rawBody, $secret);
if (!hash_equals($expected, $signature)) {
    http_response_code(401);
    exit;
}
```

المُرسل يعيد المحاولة عند الفشل؛ لذلك idempotency ليست تحسينًا اختياريًا.

## التشغيل

- ضع حدودًا لعدد الاتصالات والرسائل والحجم.
- استخدم ping/heartbeat واكتشف الاتصالات الميتة.
- طبّق authentication عند الاتصال وauthorization لكل قناة/حدث.
- راقب reconnect rate وqueue lag وdelivery failures.

## خريطة الدرس

<div class="lesson-diagram" role="img" aria-label="خريطة مفاهيم: الاتصال اللحظي وWebhooks">
<p class="lesson-diagram-title">خريطة مفاهيم: الاتصال اللحظي وWebhooks</p>
<div class="diagram-flow">
<div class="diagram-node input"><span>ليست كل التحديثات Request/Response تقليدية</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>Server-Sent Events</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>Webhooks</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node decision"><span>التشغيل</span></div>
</div>
</div>

## تأكد من فهمك

<div class="lesson-quiz" role="list">
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">01</span><p>اشرح «ليست كل التحديثات Request/Response تقليدية» كأنك تراجع تطبيقًا حقيقيًا: ما الهدف وما أهم قيد يجب الانتباه له؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> | النمط | الاتجاه | مناسب لـ | |---|---|---| | Polling | العميل يسأل دوريًا | تحديثات قليلة وحل بسيط | | Long Polling | طلب ينتظر حدثًا | توافق واسع مع latency أقل | | SSE | Server → Browser | إشعارات وfeeds نصية | | WebSocket | اتجاهان مستمران | دردشة وألعاب وتعاون لحظي | | Webhook | Server → Server | إشعار نظام خارجي بحدث | اختيار WebSocket لمجرد أنه “لحظي” يضيف إدارة connections وheartbeat وbackpressure وتوسّع… عمليًا، لا يكفي تنفيذ المسار الناجح؛ يجب توثيق الافتراضات والتحقق من القيم والحالات التي قد تكسر هذا السلوك.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">02</span><p>قارن بين «ليست كل التحديثات Request/Response تقليدية» و«Server-Sent Events». لماذا لا يغني أحدهما عن الآخر داخل موضوع «الاتصال اللحظي وWebhooks»؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> في «ليست كل التحديثات Request/Response تقليدية»: | النمط | الاتجاه | مناسب لـ | |---|---|---| | Polling | العميل يسأل دوريًا | تحديثات قليلة وحل بسيط | | Long Polling | طلب ينتظر حدثًا | توافق واسع مع latency أقل | | SSE | Server → Browser | إشعارات وfeeds نصية | | WebSocket | اتجاهان مستمران | دردشة وألعاب وتعاون لحظي | | Webhook | Server → Server | إشعار نظام خارجي بحدث | اختيار WebSocket لمجرد أنه “لحظي” يضيف إدارة connections وheartbeat وbackpressure وتوسّع… أما «Server-Sent Events»: SSE يعيد الاتصال تلقائيًا في المتصفح ويمكن استخدام id وLast-Event-ID للاستئناف. لا تشغل FPM workers بلا حدود؛ راجع بنية الخادم والمهلات قبل streams طويلة. العلاقة بينهما أن الأول يحدد جانبًا من الحل، والثاني يكمل السلوك أو القيود اللازمة لتطبيقه بصورة صحيحة.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">03</span><p>افترض أن نظامًا تجاهل «Webhooks». ما العطل أو الخطر المتوقع، وكيف تصمم اختبارًا يكشفه؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> المستقبل يجب أن: يقرأ raw body. يتحقق من توقيع HMAC وtimestamp قبل parsing الموثوق. يرفض replay خارج نافذة زمنية. يسجل event ID ويمنع المعالجة المكررة. يعيد نجاحًا سريعًا ثم ينقل العمل الثقيل إلى queue. المُرسل يعيد المحاولة عند الفشل؛ لذلك idempotency ليست تحسينًا اختياريًا. لاكتشاف الخلل، اختبر مسارًا صحيحًا، وقيمة عند الحد، ومدخلًا غير صالح، ثم راقب النتيجة والآثار الجانبية والسجل بدل الاكتفاء بعدم ظهور Exception.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">04</span><p>حوّل «التشغيل» إلى قرار هندسي قابل للمراجعة. ما الذي ستوثقه وما الحالات التي ستختبرها؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> ضع حدودًا لعدد الاتصالات والرسائل والحجم. استخدم ping/heartbeat واكتشف الاتصالات الميتة. طبّق authentication عند الاتصال وauthorization لكل قناة/حدث. راقب reconnect rate وqueue lag وdelivery failures. وثّق سبب الاختيار والبدائل والحدود، واختبر الحالة العادية، والحد الأدنى والأقصى، والفشل الجزئي، وإعادة المحاولة أو التكرار إن كان السلوك يسمح بذلك.</div></details>
</section>
</div>
