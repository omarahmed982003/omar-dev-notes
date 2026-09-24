---
title: 13. طبقات TCP/IP والشبكة المحلية وEthernet وARP
description: كيف تنتقل بيانات التطبيق عبر طبقات الشبكة، وكيف تتواصل الأجهزة داخل LAN باستخدام Frames وMAC وSwitch وARP.
---

## لماذا نقسم الاتصال إلى طبقات؟

كل طبقة تحل مشكلة محددة وتقدم خدمة للطبقة الأعلى. تطبيق HTTP لا يحتاج إلى معرفة نوع كابل Ethernet، وTCP لا يحتاج إلى فهم معنى JSON. يسمح هذا الفصل بتغيير تقنية في طبقة من غير إعادة تصميم النظام كله.

| نموذج TCP/IP | أمثلة | وحدة البيانات |
|---|---|---|
| Application | HTTP وDNS وTLS | Message/Data |
| Transport | TCP وUDP | Segment/Datagram |
| Internet | IPv4 وIPv6 | Packet |
| Link | Ethernet وWi-Fi | Frame |

تضيف كل طبقة Header عند الإرسال، وتزيل الطبقة المقابلة هذا الـHeader عند الاستقبال. تسمى العملية Encapsulation.

## LAN وEthernet وMAC Address

الـLAN شبكة محلية داخل منزل أو مكتب أو مركز بيانات. يحدد Ethernet طريقة بناء Frame وإرسالها داخل الشبكة المحلية. يحتوي الـFrame على MAC Address للمصدر والوجهة، ونوع البيانات، وPayload، وقيمة لاكتشاف التلف.

عنوان MAC يعمل داخل نطاق الشبكة المحلية ولا يحل محل IP. يقرأ Switch عناوين المصدر ويبني جدولًا يربط كل MAC بالمنفذ الذي ظهر منه، ثم يرسل الـFrame إلى المنفذ المناسب بدل بثه دائمًا إلى الجميع.

## ARP والوصول إلى الـGateway

عندما يعرف الجهاز IP داخل شبكته لكنه لا يعرف MAC المقابل، يرسل ARP Request بالبث: «من يملك هذا IP؟». يرد الجهاز المطلوب بعنوان MAC ويحفظ المرسل النتيجة مؤقتًا في ARP Cache.

إذا كان IP الهدف خارج الشبكة المحلية، لا يبحث الجهاز عن MAC الخادم البعيد. يرسل الـFrame إلى MAC الخاص بالـDefault Gateway، بينما يبقى IP الوجهة داخل Packet هو عنوان الخادم البعيد.

## Switch وRouter

يحوّل Switch الـFrames داخل LAN اعتمادًا على MAC. يربط Router شبكات IP مختلفة ويختار Next Hop اعتمادًا على Routing Table. قد يجمع الجهاز المنزلي وظائف Router وSwitch وWi-Fi Access Point وDHCP وNAT في صندوق واحد، لكن كل وظيفة تظل مختلفة منطقيًا.

## تأكد من فهمك

<div class="lesson-quiz" role="list">
<section class="quiz-card" role="listitem"><div class="quiz-question-row"><span class="quiz-number">01</span><p>لماذا يحتاج الجهاز إلى MAC وIP معًا؟</p></div><details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة:</strong> يحدد IP الجهاز عبر الشبكات، بينما يوجه MAC الـFrame على الوصلة المحلية الحالية.</div></details></section>
<section class="quiz-card" role="listitem"><div class="quiz-question-row"><span class="quiz-number">02</span><p>إلى أي MAC يرسل جهاز Packet متجهة إلى الإنترنت؟</p></div><details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة:</strong> إلى MAC الخاص بالـDefault Gateway، مع بقاء IP الوجهة هو IP الخادم البعيد.</div></details></section>
</div>
