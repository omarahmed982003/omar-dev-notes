---
title: "HTTP Connections وTimeout Budget"
description: "أعد استخدام الاتصال، وافصل connect وread وidle timeouts، واضبط ميزانية مهلات تمنع الطلبات المعلقة."
sidebar:
  order: 38
prev: {"link":"/programming-basics/38-http-large-transfers/","label":"نقل الملفات الكبيرة: Range وMultipart وStreaming"}
next: {"link":"/programming-basics/40-http-redirects/","label":"HTTP Redirects: انقل العميل من غير ما تغيّر العملية بالغلط"}
---

<span class="foundations-reading-scope" aria-hidden="true"></span>

**Persistent connection — اتصال يُعاد استخدامه لأكثر من request** يوفر تكلفة TCP وTLS. في HTTP/1.0 كان الإغلاق بعد الرد شائعًا، وظهر `keep-alive` كامتداد؛ HTTP/1.1 يفترض الاتصال المستمر عادة ما لم يُطلب `Connection: close`. HTTP/2 يرسل streams متزامنة داخل اتصال، وHTTP/3 يفعل ذلك فوق QUIC.

HTTP keep-alive مش TCP keepalive: الأول سياسة إعادة استخدام اتصال التطبيق، والثاني probes منخفضة المستوى لاكتشاف peer ميت بعد مدد غالبًا طويلة.

## كل Timeout يحمي مرحلة

| المهلة | تحمي من |
|---|---|
| DNS timeout | resolver لا يرد |
| Connect timeout | TCP/QUIC establishment عالق |
| TLS handshake timeout | تفاوض الحماية عالق |
| Request/header timeout | عميل يرسل البداية ببطء |
| Read timeout | لا تصل بيانات خلال المدة |
| Idle timeout | اتصال reusable بلا نشاط |
| Overall deadline | العملية كاملة تجاوزت ميزانيتها |

لا تجعل كل طبقة تنتظر 30 ثانية مستقلًا. لو API أمامه 2 ثانية، وزّع **Timeout budget — ميزانية زمنية للعملية** على queue والاتصال والخدمة التابعة والمعالجة، واترك وقتًا لإرجاع خطأ. retry لازم يستهلك من نفس deadline، وإلا تضاعف الحمل وقت العطل.

**Hop-by-hop headers** مثل `Connection` تخص وصلة واحدة ولا يجب أن يمررها proxy كأنها end-to-end. والـpool يحتاج حدودًا: قليل جدًا يصنع انتظارًا، وكبير جدًا يستنزف sockets والخدمة التابعة.

راقب active/idle connections، وقت الانتظار في pool، connect failures، وtimeouts حسب المرحلة. لا تستخدم مهلة ضخمة لإخفاء سبب بطيء.

:::note[تعمق أكثر: Timeout mismatch يعمل 502 متقطع]
تخيل Load Balancer يحتفظ باتصال Upstream خاملًا 60 ثانية، لكن server يغلقه بعد 5 ثوانٍ. قد يختار الوسيط الـSocket في اللحظة اللي server بيقفلها ويرسل Request جديدة، فتظهر `502` أوConnection reset بصورة متقطعة. المشكلة مش إن «الـAPI وقعت»؛ دي سياسات Idle غير متوافقة بين Hopين.

خلي الطرف الذي خلف الوسيط يحتفظ بالاتصال مدة أطول قليلًا من Idle timeout عند الوسيط، واضبط Header timeout أكبر من Keep-alive timeout وفق runtime المستخدمة. وقت النشر استخدم graceful draining: أوقف قبول طلبات جديدة، اترك الجارية ضمن Deadline، ثم أغلق. TCP keepalive probes لا تصلح ميزانية التطبيق ولا تمنع كل Half-open connection.

راقب سبب إغلاق الاتصال من الطرفين، وعمر الـSocket عند الفشل، وإعادة الاستخدام في Connection pool. رفع كل المهلات قد يقلل العرض مؤقتًا لكنه يزيد الموارد المعلقة ويؤخر اكتشاف العطل.
:::

