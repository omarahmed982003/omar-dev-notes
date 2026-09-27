---
title: "كيف تتواصل الأجهزة داخل الشبكة المحلية؟"
description: كيف تنتقل بيانات التطبيق عبر طبقات الشبكة، وكيف تتواصل الأجهزة داخل LAN باستخدام Frames وMAC وSwitch وARP.
sidebar:
  order: 2
prev: {"link":"/programming-basics/01-web-and-request-flow/","label":"الإنترنت والويب ورحلة الطلب"}
next: {"link":"/programming-basics/28-lan-segmentation/","label":"تقسيم الشبكة ومنع دوران الإطارات"}
---


## جهازان وراوتر

```text
Laptop A ── Switch ── Laptop B
               │
             Router ── other networks
```

**Switch — مُبدّل** يصل الأجهزة داخل الشبكة، و**Router — موجّه** ينقل بينها وبين شبكات أخرى. افترض A=192.168.1.20 وB=192.168.1.30، وكلاهما /24، أي أول24بت تحدد الشبكة. A يعرف من القناع أن B محلي. يستخدم ARP، سؤالًا محليًا عن عنوان واجهة B، ثم يرسل **إطارًا** يحمل البيانات وعنوان واجهة B عبر المبدّل. **MAC** عنوان الواجهة على الوصلة.

لو الوجهة خارج الشبكة، إطار A المحلي يتجه إلى واجهة الراوتر، بينما عنوان IP للوجهة يظل الوجهة البعيدة في المثال الذي لا يطبق ترجمة عناوين. **جرّب على الورق:** أرسل من B إلى A، ثم من B إلى شبكة أخرى؛ مَن يستقبل الإطار المحلي في كل مرة؟ A، ثم الراوتر.

## نبدأ من رحلة بسيطة داخل البيت

افترض إن لابتوبك عايز يفتح صفحة موجودة على جهاز آخر. البرنامج يعرف URL (Uniform Resource Locator؛ عنوان يحدد موردًا وطريقة الوصول إليه)، لكن كارت الشبكة لا يرسل URL كما هو. البيانات تنزل خلال طبقات، وكل طبقة تضيف معلومات تساعد المرحلة التالية:

```text
بيانات التطبيق
  ↓ معلومات النقل
TCP segment أو UDP datagram
  ↓ معلومات IP
IP packet
  ↓ معلومات الوصلة المحلية
Ethernet frame على وصلة Ethernet، أو Wi-Fi frame على وصلة Wi-Fi
  ↓
إشارات مناسبة للوصلة
```

الطبقات مش أجهزة منفصلة بالضرورة؛ هي تقسيم للمسؤوليات. HTTP (Hypertext Transfer Protocol؛ قواعد طلب الموارد والرد عليها في الويب) يهتم بمعنى الطلب، TCP (Transmission Control Protocol؛ نقل بايتات بترتيب مع معالجة الفقد، مع احتمال فشل الاتصال) يهتم بالاتصال والترتيب، IP (Internet Protocol؛ قواعد عنونة الحزم وتوجيهها بين الشبكات، وعنوان IP رقم يحدد واجهة في هذا السياق) يهتم بالوصول بين الشبكات، وEthernet (معيار شائع للاتصال على شبكة محلية سلكية)/Wi-Fi (اتصال لاسلكي بالشبكة المحلية؛ لا يضمن اتصالها بالإنترنت) يهتمان بالنقلة الحالية داخل الـLink.

لو الوجهة خارج شبكتك المحلية، جهازك لا يبحث عن MAC (Media Access Control؛ عنوان تستخدمه واجهة الشبكة للتواصل على الوصلة المحلية) الخاص بالسيرفر البعيد. هو يحتاج MAC الخاص بالـDefault Gateway (البوابة الافتراضية: الراوتر الذي نرسل له الوجهات التي لا نملك لها مسارًا أدق)، ويرسل له الـFrame (إطار: وحدة بيانات تخص الوصلة المحلية مثل Ethernet)، وبعدها كل Router يبني Frame جديدة للنقلة التالية. عنوان IP يصف الوجهة عبر الرحلة، بينما MAC تتغير من Link لآخر.

ARP (Address Resolution Protocol؛ سؤال عن عنوان MAC المقابل لعنوان IPv4 على الشبكة المحلية) هو السؤال المحلي: «مين عنده عنوان IPv4 (Internet Protocol version 4؛ إصدار عناوين الشبكة ذي32 بتًا) ده؟ ابعتلي MAC بتاعك». النتيجة تدخل Cache (نسخة محفوظة لتقليل تكرار القراءة أو الحساب) لمدة، لكنها غير موثوقة أمنيًا بمفردها؛ ARP Spoofing ممكن يربط IP بعنوان مهاجم داخل نفس الشبكة.

## لماذا نقسم الاتصال إلى طبقات؟

كل طبقة تحل مشكلة محددة وتقدم خدمة للطبقة الأعلى. تطبيق HTTP لا يحتاج إلى معرفة نوع كابل Ethernet، وTCP لا يحتاج إلى فهم معنى JSON (JavaScript Object Notation؛ صيغة نصية لترتيب البيانات في أسماء وقيم وقوائم). يسمح هذا الفصل بتغيير تقنية في طبقة من غير إعادة تصميم النظام كله.

| نموذج TCP/IP | أمثلة | وحدة البيانات |
|---|---|---|
| Application | HTTP وDNS (Domain Name System؛ نظام يجيب عن أسئلة أسماء النطاقات، ومنها عناوينها) وTLS (Transport Layer Security؛ قواعد حماية الاتصال بالتشفير والتحقق) | Message/Data |
| Transport | TCP وUDP (User Datagram Protocol؛ نقل رسائل مستقلة بلا ضمان مدمج لوصولها أو ترتيبها) | Segment (مقطع TCP يحمل جزءًا من تدفق البايتات)/Datagram (رسالة مستقلة لها حدود في بروتوكول النقل) |
| Internet | IPv4 وIPv6 (Internet Protocol version 6؛ إصدار عناوين الشبكة ذي128 بتًا) | Packet (حزمة: وحدة بيانات IP التي تُوجّه بين الشبكات) |
| Link | Ethernet وWi-Fi | Frame |

تضيف كل طبقة Header (حقل أو مقدمة معلومات تضاف للبيانات بحسب الطبقة) عند الإرسال، وتزيل الطبقة المقابلة هذا الـHeader عند الاستقبال. تسمى العملية Encapsulation.

## LAN وEthernet وMAC Address

الـLAN (Local Area Network؛ شبكة أجهزة في مساحة محلية زي بيت أو مكتب) شبكة محلية داخل منزل أو مكتب أو مركز بيانات. يحدد Ethernet طريقة بناء Frame وإرسالها داخل الشبكة المحلية. يحتوي الـFrame على MAC Address للمصدر والوجهة، ونوع البيانات، وPayload، وقيمة لاكتشاف التلف.

عنوان MAC يعمل داخل نطاق الشبكة المحلية ولا يحل محل IP. يقرأ Switch عناوين المصدر ويبني جدولًا يربط كل MAC بالمنفذ الذي ظهر منه، ثم يرسل الـFrame إلى المنفذ المناسب بدل بثه دائمًا إلى الجميع.

## ARP والوصول إلى الـGateway

عندما يعرف الجهاز IP داخل شبكته لكنه لا يعرف MAC المقابل، يرسل ARP Request (طلب: رسالة يرسلها العميل ليطلب موردًا أو عملية) بالبث: «من يملك هذا IP؟». يرد الجهاز المطلوب بعنوان MAC ويحفظ المرسل النتيجة مؤقتًا في ARP Cache.

إذا كان IP الهدف خارج الشبكة المحلية، لا يبحث الجهاز عن MAC الخادم البعيد. يرسل الـFrame إلى MAC الخاص بالـDefault Gateway، بينما يبقى IP الوجهة داخل Packet هو عنوان الخادم البعيد.

## Switch وRouter

يحوّل Switch الـFrames داخل LAN اعتمادًا على MAC. يربط Router شبكات IP مختلفة ويختار Next Hop اعتمادًا على Routing Table. قد يجمع الجهاز المنزلي وظائف Router وSwitch وWi-Fi Access Point وDHCP (Dynamic Host Configuration Protocol؛ خدمة تمنح الجهاز إعدادات الشبكة تلقائيًا) وNAT (Network Address Translation؛ تغيير عناوين IP أثناء مرور الحزم بين شبكات) في صندوق واحد، لكن كل وظيفة تظل مختلفة منطقيًا.

## تدريب عملي

<details><summary>ليه MAC السيرفر البعيد مش موجودة في Frame الخارجة من اللابتوب؟</summary><p>لأن Ethernet تعمل على الـLink المحلية فقط. اللابتوب يرسل للـDefault Gateway، فيستخدم MAC الراوتر المحلية. الراوتر يزيل Frame ويبني واحدة جديدة للنقلة التالية.</p></details>

<details><summary>رتب: Segment وPacket وFrame</summary><p>بيانات التطبيق تدخل Segment في طبقة النقل، ثم Packet في طبقة IP، ثم Frame على الـLink. عند الاستقبال تُفك الطبقات بالعكس.</p></details>

## تأكد من فهمك

<div class="lesson-quiz" role="list">
<section class="quiz-card" role="listitem"><div class="quiz-question-row"><span class="quiz-number">01</span><p>لماذا يحتاج الجهاز إلى MAC وIP معًا؟</p></div><details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة:</strong> يحدد IP الجهاز عبر الشبكات، بينما يوجه MAC الـFrame على الوصلة المحلية الحالية.</div></details></section>
<section class="quiz-card" role="listitem"><div class="quiz-question-row"><span class="quiz-number">02</span><p>إلى أي MAC يرسل جهاز Packet متجهة إلى الإنترنت؟</p></div><details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة:</strong> إلى MAC الخاص بالـDefault Gateway، مع بقاء IP الوجهة هو IP الخادم البعيد.</div></details></section>
</div>


## الخطوة التالية

كمّل في [تقسيم الشبكة ومنع دوران الإطارات](/programming-basics/28-lan-segmentation/) بعد تنفيذ التجربة هنا.
