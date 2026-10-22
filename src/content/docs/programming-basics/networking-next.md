---
title: "الشبكات والويب"
description: "امشِ وراء طلب من الشبكة المحلية، للعناوين ونقل البيانات، ثم اتصال ويب محمي. تفاصيل تطبيقات الخوادم تأتي بعد المسار الأساسي."
sidebar:
  order: 0
---

<span class="foundations-reading-scope" aria-hidden="true"></span>

القسم ده له مساران للقراءة. **المرور الأول** يعني الأفكار والملاحظات اللي تحتاجها علشان تفسر طلب ويب عادي. **التعمق** تفاصيل ترجع لها بعد ما تبني برنامجًا صغيرًا. الأساس والتفاصيل موجودين في درس الموضوع نفسه، مش صفحات تكملة متفرقة.

## 1. المرور الأول — امشِ وراء طلب واحد

ابدأ بالجزء الأساسي في كل درس تحت. لما الدرس يحدد نقطة توقف للمرور الأول، سيب قسم التعمق لوقت الرجوع. المنافذ وواجهة الاتصال ييجوا قبل TCP؛ حساب الشبكات وتشخيص حجم الحزم مش شروطًا لأول صفحة ويب.

1. [الإنترنت والويب ورحلة الطلب](/programming-basics/01-web-and-request-flow/)
2. [كيف تتواصل الأجهزة داخل الشبكة المحلية؟](/programming-basics/14-network-layers-lan-ethernet-arp/)
3. [إعدادات عنوان الجهاز والاتصال](/programming-basics/15-addressing-dhcp-nat-routing-ipv6/)
4. [كيف يتحول اسم الموقع إلى عنوان؟](/programming-basics/02-dns-and-ip/)
5. [عنوان الويب والمنافذ وبروتوكول HTTP](/programming-basics/04-url-ports-http/)
6. [الحروف والرموز داخل عنوان الويب](/programming-basics/21-url-encoding/)
7. [TCP: الاتصال من أول SYN لحد الإغلاق](/programming-basics/03-tcp-udp-packets/)
8. [UDP: رسائل مستقلة](/programming-basics/udp/)
9. [اقرأ طلب HTTP وردّه](/programming-basics/05-http-messages-state/)
10. [تذكّر المستخدم وحماية التعديلات](/programming-basics/22-http-state-and-updates/)
11. [تشفير الاتصال وشهادات المواقع](/programming-basics/06-https-tls-certificates/)
12. [كيف يعرض المتصفح الصفحة؟](/programming-basics/09-browser-rendering-devtools/)
13. [جهّز معمل الطلب والرد على جهازك](/programming-basics/32-local-network-lab/)

## قف هنا وطبّق الأساس

تقدر تنتقل لما تعرف تفسر الملاحظات دي، مش لما تحفظ أسماءها:

- اسم موقع غلط يفشل قبل ما HTTP يرجع حالة.
- منفذ مفيش برنامج بيستقبل عليه غير خادم وصلنا له ورجّع404.
- TCP ينقل بايتات مرتبة؛ HTTP يحدد معنى الطلب والرد.
- خطأ الشهادة غير عنوان مورد مش موجود.
- رد الخادم يقدر يضبط معرّف Cookie، والطلب اللي بعده يرجعه لاستعادة بيانات جلسة عند الخادم.

طبّق بملاحظة محلية أو التتبع الجاهز. بعده ابدأ صفحة HTML صغيرة، وكمل أساس اللغة في [PHP](/php/) لما تكون جاهزًا. **مش لازم تخلص كل الدروس اللي تحت قبل ما تبدأ.** قراءة الدليل مش تسجيل تقدم أو اجتياز دراسة.

## 2. ارجع بعد التطبيق — تعمق وتشخيص

ارجع بعد فهم المتغيرات والشروط والحلقات والدوال وتشغيل تطبيق محلي. راجع تذكير الأساس في كل موضوع، ثم قسم تفاصيله. المسار ده يوسع فهم توصيل الشبكات وحجم الحزم ومهام المتصفح والوسطاء والكاش وحدود الأمان والتسليم والقياس.

1. [تقسيم الشبكة ومنع دوران الإطارات](/programming-basics/28-lan-segmentation/)
2. [اتصل بشبكة Wi-Fi وافهم مشاكلها](/programming-basics/18-wifi-practical-basics/)
3. [احسب حدود الشبكة من عنوانها](/programming-basics/26-subnet-calculations/)
4. [اختيار الطريق وقراءة عناوين IPv6](/programming-basics/27-routing-and-ipv6/)
5. [MTU: حجم الحزم وتشخيص المسار](/programming-basics/20-transport-diagnostics/)
6. [تحميل البرامج وترتيب مهام المتصفح](/programming-basics/29-browser-scheduling/)
7. [رحلة الطلب داخل الخادم](/programming-basics/07-server-side-path/)
8. [الخوادم الوسيطة وتوزيع الطلبات](/programming-basics/08-server-proxy-api-gateway/)
9. [توزيع الحمل وسياسات الوسيط](/programming-basics/31-proxy-policies/)
10. [التخزين المؤقت وضغط بيانات الويب](/programming-basics/10-http-caching-compression/)
11. [السماح بقراءة البيانات بين المواقع](/programming-basics/11-same-origin-cors/)
12. [سياسات تحميل الموارد وعزل النوافذ](/programming-basics/33-browser-isolation/)
13. [اسأل دوريًا أو استقبل بثًا من الخادم](/programming-basics/12-realtime-webhooks/)
14. [استقبل إشعار خادم وتعامل مع تكراره](/programming-basics/30-webhook-delivery/)
15. [تصميم واجهات تبادل البيانات](/programming-basics/13-api-design/)
16. [كيف يختلف HTTP/2 عن HTTP/3؟](/programming-basics/16-http2-http3-quic/)
17. [وزّع المحتوى وافهم الخادم الأصلي](/programming-basics/17-proxies-cdn-waf-observability/)
18. [حماية الطلبات وتحديد معدلها](/programming-basics/24-request-protection/)
19. [تتبّع الطلب وفسّر القياسات](/programming-basics/25-request-observation/)

## اختار المعمل من غير ما تغيّر لغة دراستك

**Node.js** بيئة لتشغيل JavaScript. المعمل الجاهز بيه أداة ملاحظة اختيارية، مش شرط تتعلم لغة تانية قبل PHP. الدروس التابعة بتقدم تتبع طلب ورد مكتوبًا تقدر تمشي وراه من غير تشغيله. وبعض الدروس فيها معامل PHP مستقلة ومتطلباتها موضحة جنبها.

لو اخترت معمل Node استخدم الملف الكامل والعناوين المحلية المحددة. ما تعتبرش ظهور الصورة دليل فهم: توقع الحالة وسببها، وبعدها قارن اللي حصل.
