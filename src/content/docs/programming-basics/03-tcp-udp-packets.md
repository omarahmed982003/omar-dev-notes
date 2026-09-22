---
title: 3. TCP وUDP والحزم
description: المصافحة، Segments وPackets وFrames، ACK وإعادة الإرسال والتحكم في التدفق والازدحام.
sidebar:
  order: 3
---

## من البيانات إلى السلك

تُغلّف البيانات أثناء نزولها خلال طبقات الشبكة:

```text
HTTP Data
   ↓
TCP Segment أو UDP Datagram
   ↓
IP Packet
   ↓
Ethernet/Wi-Fi Frame
   ↓
Bits/Signals
```

كل طبقة تضيف Header. من المعلومات الممكنة: Source/Destination Ports في طبقة النقل، Source/Destination IP في طبقة الشبكة، Sequence Number وFlags في TCP، وTTL/Hop Limit في IP. لا توجد «Packet واحدة» دائمًا؛ المحتوى الكبير يُقسّم ويعاد تجميعه.

الـ **NIC** أو Network Interface Card تتعامل مع الاتصال المحلي وFrames والإشارات. الراوتر يختار القفزة التالية للحزمة، والـISP يربط شبكتك بالشبكات الأخرى.

## TCP: Transmission Control Protocol

TCP يقدم **تدفق bytes موثوقًا ومرتبًا** بين نقطتين. يبدأ عادة بمصافحة ثلاثية:

```text
Client                         Server
  | -------- SYN ------------> |
  | <----- SYN + ACK ---------- |
  | -------- ACK ------------> |
  | ===== Application Data ===> |
```

- `SYN`: طلب بدء ومزامنة Sequence Numbers.
- `SYN-ACK`: قبول ومزامنة الطرف الثاني.
- `ACK`: تأكيد الاستلام.
- الاتصال يُعرّف بأربع قيم تقريبًا: source IP/port وdestination IP/port.

## الاعتمادية والترتيب

يرقّم TCP الـbytes/segments، ويؤكد ما وصل باستخدام ACK. إذا لم يصل التأكيد في الوقت المتوقع أو استنتج المرسل فقدًا، يعيد الإرسال. يمكن أن تصل IP Packets بترتيب مختلف، بينما يعرض TCP للتطبيق stream مرتبًا.

```text
Send 1, 2, 3, 4
Receive 1, 2, _, 4
ACK indicates missing data
Retransmit 3
Application reads 1, 2, 3, 4
```

:::note
ACK لا يعني أن تطبيق PHP أنهى العمل؛ يعني أن طبقة TCP استلمت البيانات المطلوبة.
:::

## Flow Control وCongestion Control

- **Flow control:** يمنع المرسل من إغراق جهاز الاستقبال. يعلن المستقبل Receive Window عن المساحة المتاحة.
- **Congestion control:** يمنع إغراق الشبكة. يحتفظ المرسل بـCongestion Window ويزيد السرعة تدريجيًا ويخفضها عند دلائل الفقد أو الازدحام.
- حد الإرسال الفعلي يتأثر بالأصغر بين receive window وcongestion window.

إذن فقد Packet لا يعالج فقط بإعادة الإرسال؛ يؤثر أيضًا في معدل الإرسال.

## UDP: User Datagram Protocol

UDP يرسل Datagrams بلا اتصال تقليدي ولا يضمن بنفسه الوصول أو الترتيب أو منع التكرار. لذلك Header أبسط والحمل الإضافي أقل.

| الخاصية | TCP | UDP |
|---|---|---|
| Handshake تقليدي | نعم | لا |
| ضمان الترتيب وإعادة الإرسال | يوفرهما | لا يوفرهما |
| شكل البيانات | Byte stream | Datagrams مستقلة |
| أمثلة | HTTP/1.1، HTTP/2، بريد، ملفات | DNS، صوت مباشر، ألعاب، بث |
| السرعة | ليست ضمانًا؛ حمل أكبر | ليس دائمًا أسرع؛ حمل أقل |

HTTP/3 يعمل فوق **QUIC المبني على UDP**، لكن QUIC نفسه يضيف الاعتمادية والتشفير والتحكم؛ لذلك «UDP غير موثوق» لا يعني أن التطبيق المبني فوقه يجب أن يظل غير موثوق.

## تدريب

جرّب:

```bash
ping example.com
tracert example.com
```

على Linux/macOS استخدم `traceroute`. `ping` يستخدم ICMP لا TCP، لكنه يوضح زمن الذهاب والعودة والفقد التقريبي.

## خريطة الدرس

<div class="lesson-diagram" role="img" aria-label="خريطة مفاهيم: TCP وUDP والحزم">
<p class="lesson-diagram-title">خريطة مفاهيم: TCP وUDP والحزم</p>
<div class="diagram-flow">
<div class="diagram-node input"><span>من البيانات إلى السلك</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>TCP: Transmission Control Protocol</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>الاعتمادية والترتيب</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node decision"><span>Flow Control وCongestion Control</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node output"><span>UDP: User Datagram Protocol</span></div>
</div>
</div>

## تأكد من فهمك

<div class="lesson-quiz" role="list">
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">01</span><p>اشرح «من البيانات إلى السلك» كأنك تراجع تطبيقًا حقيقيًا: ما الهدف وما أهم قيد يجب الانتباه له؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> تُغلّف البيانات أثناء نزولها خلال طبقات الشبكة: كل طبقة تضيف Header. من المعلومات الممكنة: Source/Destination Ports في طبقة النقل، Source/Destination IP في طبقة الشبكة، Sequence Number وFlags في TCP، وTTL/Hop Limit في IP. لا توجد «Packet واحدة» دائمًا؛ المحتوى الكبير يُقسّم ويعاد تجميعه. الـ NIC أو Network Interface Card تتعامل مع الاتصال المحلي وFrames والإشارات. الراوتر يختار القفزة التالية للحزمة، والـISP يربط… عمليًا، لا يكفي تنفيذ المسار الناجح؛ يجب توثيق الافتراضات والتحقق من القيم والحالات التي قد تكسر هذا السلوك.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">02</span><p>قارن بين «من البيانات إلى السلك» و«TCP: Transmission Control Protocol». لماذا لا يغني أحدهما عن الآخر داخل موضوع «TCP وUDP والحزم»؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> في «من البيانات إلى السلك»: تُغلّف البيانات أثناء نزولها خلال طبقات الشبكة: كل طبقة تضيف Header. من المعلومات الممكنة: Source/Destination Ports في طبقة النقل، Source/Destination IP في طبقة الشبكة، Sequence Number وFlags في TCP، وTTL/Hop Limit في IP. لا توجد «Packet واحدة» دائمًا؛ المحتوى الكبير يُقسّم ويعاد تجميعه. الـ NIC أو Network Interface Card تتعامل مع الاتصال المحلي وFrames والإشارات. الراوتر يختار القفزة التالية للحزمة، والـISP يربط… أما «TCP: Transmission Control Protocol»: TCP يقدم تدفق bytes موثوقًا ومرتبًا بين نقطتين. يبدأ عادة بمصافحة ثلاثية: SYN: طلب بدء ومزامنة Sequence Numbers. SYN-ACK: قبول ومزامنة الطرف الثاني. ACK: تأكيد الاستلام. الاتصال يُعرّف بأربع قيم تقريبًا: source IP/port وdestination IP/port. العلاقة بينهما أن الأول يحدد جانبًا من الحل، والثاني يكمل السلوك أو القيود اللازمة لتطبيقه بصورة صحيحة.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">03</span><p>افترض أن نظامًا تجاهل «الاعتمادية والترتيب». ما العطل أو الخطر المتوقع، وكيف تصمم اختبارًا يكشفه؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> يرقّم TCP الـbytes/segments، ويؤكد ما وصل باستخدام ACK. إذا لم يصل التأكيد في الوقت المتوقع أو استنتج المرسل فقدًا، يعيد الإرسال. يمكن أن تصل IP Packets بترتيب مختلف، بينما يعرض TCP للتطبيق stream مرتبًا. :::note ACK لا يعني أن تطبيق PHP أنهى العمل؛ يعني أن طبقة TCP استلمت البيانات المطلوبة. ::: لاكتشاف الخلل، اختبر مسارًا صحيحًا، وقيمة عند الحد، ومدخلًا غير صالح، ثم راقب النتيجة والآثار الجانبية والسجل بدل الاكتفاء بعدم ظهور Exception.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">04</span><p>حوّل «Flow Control وCongestion Control» إلى قرار هندسي قابل للمراجعة. ما الذي ستوثقه وما الحالات التي ستختبرها؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> Flow control: يمنع المرسل من إغراق جهاز الاستقبال. يعلن المستقبل Receive Window عن المساحة المتاحة. Congestion control: يمنع إغراق الشبكة. يحتفظ المرسل بـCongestion Window ويزيد السرعة تدريجيًا ويخفضها عند دلائل الفقد أو الازدحام. حد الإرسال الفعلي يتأثر بالأصغر بين receive window وcongestion window. إذن فقد Packet لا يعالج فقط بإعادة الإرسال؛ يؤثر أيضًا في معدل الإرسال. وثّق سبب الاختيار والبدائل والحدود، واختبر الحالة العادية، والحد الأدنى والأقصى، والفشل الجزئي، وإعادة المحاولة أو التكرار إن كان السلوك يسمح بذلك.</div></details>
</section>
</div>
