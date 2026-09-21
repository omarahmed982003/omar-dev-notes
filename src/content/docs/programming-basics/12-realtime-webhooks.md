---
title: 12. الاتصال اللحظي وWebhooks
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

