---
title: "اسأل دوريًا أو استقبل بثًا من الخادم"
description: "اسأل دوريًا أو استقبل بثًا من الخادم"
sidebar:
  order: 26
prev: {"link":"/programming-basics/33-browser-isolation/","label":"سياسات تحميل الموارد وعزل النوافذ"}
next: {"link":"/programming-basics/30-webhook-delivery/","label":"استقبل إشعار خادم وتعامل مع تكراره"}
---

<span class="foundations-reading-scope" aria-hidden="true"></span>

## قارن السؤال الدوري بالبث، ثم جرّب اختياريًا

**Polling — سؤال دوري** يرسل طلبًا في كل مرة. **SSE — Server-Sent Events** بث أحداث نصية من server للمتصفح. من غير Node.js، تتبع مدخلًا واحدًا: نريد الأوقات 1 و 2 و 3؛ polling ينتج ثلاثة طلبات وردود، أما SSE في المثال فينتج طلبًا ممتدًا واحدًا وثلاث رسائل حدث داخله. دي مقارنة لطريقة النقل، مش وعدًا بتوقيت ثابت.

التطبيق التالي اختياري بمعمل Node.js؛ جهّز [المعمل المحلي](/programming-basics/32-local-network-lab/) وافتح Network. لو لا تريد تشغيله، قارن أعداد الطلبات في التتبع السابق ثم أكمل للشرح ومقطع PHP:

1. اضغط Poll three times. **Polling — سؤال دوري**: نرسل طلبًا، نقرأ الوقت، ننتظر قليلًا، ثم نكرر. تظهر ثلاثة أوقات وثلاثة طلبات `/proxy-clock`.
2. امسح قائمة Network للعرض فقط، واضغط Receive three events. **SSE — Server-Sent Events** قناة يرسل فيها server أحداثًا نصية للمتصفح. يظهر طلب `/proxy-events` واحد يحمل الأحداث 1 و 2 و 3، ثم يغلق المثال الاتصال.
3. `EventSource` أداة browser لفتح هذه القناة؛ `onmessage` تتلقى رسالة، و`close()` تغلقها. من غير الإغلاق قد تعاود الأداة الاتصال بعد انقطاعه. الكود الكامل للعميل وserver داخل ملف المعمل؛ لا تحتاج تخمين جزء مفقود.

**قارن:** الأول يسأل مرارًا حتى لو لم يحدث جديد؛ الثاني يحتفظ باتصال ليستقبل. لم نجرب WebSocket هنا؛ قناته تسمح للطرفين بالإرسال. [شرح SSE](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events).

## قبل التفاصيل

اختر قناة التحديث حسب اتجاه البيانات وتكرارها وتحمل التأخير. Polling وSSE (Server-Sent Events؛ إرسال أحداث نصية من server للمتصفح عبر HTTP (قواعد تبادل request وresponse بين client وserver)) وWebSocket وwebhooks ليست درجات أفضلية؛ كل منها يحل شكلًا مختلفًا من التواصل.

**Polling — سؤال دوري**: browser يسأل كل عدة ثوانٍ هل فيه جديد. **Long polling — سؤال ينتظر**: server يحتفظ بالطلب حتى يأتي حدث أو تنتهي المهلة، ثم يعيد العميل السؤال.

**SSE، Server-Sent Events** تدفق أحداث نصية من server للمتصفح عبر HTTP (Hypertext Transfer Protocol؛ قواعد طلب الموارد والرد عليها في الويب). **WebSocket** قناة مستمرة تسمح للطرفين بإرسال رسائل. **Webhook** طلب يرسله خادم لخادم آخر عند حدث، مثل تأكيد دفع.

## ليست كل التحديثات Request/Response تقليدية

| النمط | الاتجاه | مناسب لـ |
|---|---|---|
| Polling | العميل يسأل دوريًا | تحديثات قليلة وحل بسيط |
| Long Polling | طلب ينتظر حدثًا | توافق واسع مع latency (زمن انتظار عملية واحدة) أقل |
| SSE | Server → Browser | إشعارات وfeeds نصية |
| WebSocket | اتجاهان مستمران | دردشة وألعاب وتعاون لحظي |
| Webhook | Server → Server | إشعار نظام خارجي بحدث |

اختيار WebSocket لمجرد أنه “لحظي” يضيف إدارة connections وheartbeat وbackpressure (إبطاء المنتج عندما لا يستطيع المستهلك متابعة معدل البيانات) وتوسّع أفقي. ابدأ بأبسط نمط يحقق المطلوب.

## WebSocket على مستوى الاتصال

WebSocket يبدأ عادة بطلب HTTP/1.1 فيه `Upgrade: websocket` و`Connection: Upgrade`. لو وافق server يرد `101 Switching Protocols`، وبعدها يحمل الاتصال **Frames — وحدات رسائل WebSocket** في الاتجاهين بدل سلسلة requests وردود HTTP عادية. مع HTTP/2 توجد آلية extended CONNECT، ودعمها يعتمد على الطرفين والوسطاء.

الـFrame يحمل نوع الرسالة وطولها وبياناتها. رسائل العميل إلى server تكون **Masked — ممزوجة بمفتاح masking قصير** حسب البروتوكول؛ masking يمنع بعض التفسيرات الخاطئة عند الوسطاء، لكنه مش تشفيرًا. `wss://` يعني WebSocket داخل TLS وهو المسؤول عن السرية والتحقق.

| الحدث | مسؤولية التطبيق |
|---|---|
| Proxy idle timeout | heartbeat مناسب ومهلات مضبوطة بوعي |
| انقطاع الشبكة | reconnect باستخدام backoff وjitter بدل عاصفة محاولات |
| إعادة الاتصال | إعادة authentication والاشتراك وعدم افتراض وصول الرسائل القديمة |
| عميل بطيء | حد للـqueue وتطبيق backpressure أو فصل العميل |
| نسخ server متعددة | broker أو routing state مشترك للوصول للنسخة المالكة للاتصال |

**Backoff — زيادة وقت الانتظار تدريجيًا**، و**Jitter — اختلاف عشوائي صغير** يمنعان العملاء من إعادة المحاولة معًا. لو الرسائل لا تحتمل الضياع، أضف message ID أو sequence number وآلية استئناف؛ WebSocket وحده لا يضمن تسليمًا تجاريًا مرة واحدة.

**Heartbeat** رسالة دورية لفحص بقاء الاتصال، و**Backpressure** إبطاء المنتج عندما لا يقدر المستهلك يلحق بالرسائل بدل تراكمها بلا حد. **التوسع الأفقي** إضافة نسخ خدمة لتوزيع الحمل.

## Server-Sent Events

المقطع التالي يوضح صيغة حدث واحد داخل ملف PHP (اسم لغة برمجة تستخدم كثيرًا لمعالجة طلبات الويب على server) بعد سطر البداية، وليس خادم بث كاملًا. حقل event اسم الحدث وdata بياناته؛ السطر الفارغ ينهي الحدث.

X-Accel-Buffering يطلب من Nginx عدم تجميع الخرج في هذا المسار، وflush يحاول دفع الخرج؛ النتيجة تعتمد أيضًا على مخازن الإخراج وإعدادات الوسطاء:

```php
header('Content-Type: text/event-stream');
header('Cache-Control: no-cache');
header('X-Accel-Buffering: no');

echo "event: order.updated\n";
echo 'data: ' . json_encode(['id' => 42, 'status' => 'paid']) . "\n\n";
flush();
```

SSE يعيد الاتصال تلقائيًا في browser ويمكن استخدام `id` و`Last-Event-ID` للاستئناف. لا تشغل FPM (FastCGI Process (نسخة شغالة من برنامج، لها memory وموارد وهوية) Manager؛ مدير عمليات معالجة طلبات PHP) workers (وحدة تنفيذ تتولى مهمة أو طلبًا؛ قد تكون عملية أو خيطًا حسب النظام) بلا حدود؛ راجع بنية server والمهلات قبل streams (تدفق بيانات متتابعة قد لا نعرف حجمه مقدمًا) طويلة.

**EventSource** واجهة browser المعتادة لاستقبال SSE وإعادة الاتصال. حقل id يعطي الحدث معرّفًا؛ browser يستطيع إرسال Last-Event-ID في إعادة الاتصال، لكن server لازم يحتفظ بما يحتاجه لإعادة الأحداث.

PHP-FPM (PHP FastCGI Process Manager؛ برنامج يدير عمليات PHP التي تستقبل عملًا من خادم الويب) يدير عمليات PHP؛ الاتصال الطويل قد يشغل عاملًا لمدة طويلة.

:::note[تعمق أكثر: اختَر Polling أوSSE أوWebSocket حسب اتجاه البيانات]
**Short polling** بسيط لكنه يعمل Requests حتى لو مفيش جديد، وتأخيره قد يصل للفاصل بين الطلبات. **Long polling** يمسك Request لحد Event أومهلة ثم Client يعيد الاتصال فورًا؛ لازم Cursor مثل `since=1042` علشان Event حصلت بين اتصالين ما تضيعش.

**SSE** Response HTTP طويلة من server إلى client بنوع `text/event-stream`. كل Event ممكن تحمل `id`، وBrowser يعيد الاتصال ويرسل `Last-Event-ID` لاستكمال ما فاته. ابعت Heartbeat comments، عطّل Proxy buffering للمسار، واضبط Read timeout؛ وإلا الأحداث تتجمع وتصل دفعة واحدة رغم إن كودك عمل `flush`.

**WebSocket** Full-duplex ومناسب لما الطرفان يرسلان كثيرًا، لكنه اتصال Stateful يحتاج توزيعًا واعيًا، Heartbeats، Backpressure، وحدودًا للرسائل. بعد Reconnect لا تفترض أن Subscription أوالرسائل رجعت: Client يعيد المصادقة والاشتراك ويرسل آخر Sequence معروف، وserver يقرر Replay من Store مشتركة.
:::

## التشغيل

- ضع حدودًا لعدد الاتصالات والرسائل والحجم.
- استخدم ping/heartbeat واكتشف الاتصالات الميتة.
- طبّق authentication عند الاتصال وauthorization لكل قناة/حدث.
- راقب reconnect rate وqueue lag وdelivery failures.

## مسائل عملية

<details><summary>متى يكون SSE أبسط من WebSocket؟</summary><p>عندما يحتاج المتصفح تحديثات مستمرة من الخادم فقط؛ SSE أحادي الاتجاه ويعمل فوق HTTP مع إعادة اتصال مدمجة.</p></details>

<details><summary>كيف يتحقق مستقبِل webhook من المرسل؟</summary><p>يتحقق من توقيع مبني على body الخام وsecret، مع timestamp وحد زمني، ثم يمنع التكرار بمعرّف الحدث.</p></details>

<details><summary>لماذا يجب أن يكون webhook idempotent؟</summary><p>لأن المرسل قد يعيد المحاولة عند timeout حتى لو عولج الحدث؛ يجب ألا تكرر الإعادة الأثر التجاري.</p></details>

## الخطوة التالية

[استقبل إشعار خادم وتعامل مع تكراره](/programming-basics/30-webhook-delivery/).
