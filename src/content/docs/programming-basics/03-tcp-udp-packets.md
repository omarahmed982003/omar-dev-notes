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
