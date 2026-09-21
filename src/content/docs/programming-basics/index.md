---
title: أساسيات الويب والشبكات
description: "مسار شامل ومصحّح للصفحات 1–11: من كتابة الرابط حتى تنفيذ PHP وعودة الاستجابة."
sidebar:
  order: 0
---

# أساسيات الويب والشبكات للمبرمج

هذا القسم يحوّل الصفحات **1–11** من الملاحظات إلى مسار منظم. احتفظنا بكل الأفكار المكتوبة، وصححنا الاختصارات غير الدقيقة، ثم أضفنا أمثلة عملية وتفاصيل تساعدك على فهم ما يحدث قبل أن يبدأ كود PHP.

## خريطة الدروس

1. [الإنترنت والويب ودورة الطلب](./01-web-and-request-flow/) — Client/Server والرسم الكامل من المتصفح إلى التطبيق.
2. [DNS وعناوين IP](./02-dns-and-ip/) — Local Cache وResolver وRoot وTLD وAuthoritative DNS.
3. [TCP وUDP والحزم](./03-tcp-udp-packets/) — Handshake وACK والترتيب وإعادة الإرسال والتحكم في التدفق والازدحام.
4. [URL والمنافذ وHTTP](./04-url-ports-http/) — أجزاء الرابط، Socket، المنافذ المشهورة، ومعنى HTTP.
5. [HTTP Request وResponse والحالة](./05-http-messages-state/) — Methods وHeaders وBody وStatus Codes وCookies/Sessions/Tokens.
6. [HTTPS وTLS والشهادات](./06-https-tls-certificates/) — التشفير المتماثل وغير المتماثل وHandshake وأنواع التحقق.
7. [داخل الخادم: Load Balancer وNginx وPHP-FPM](./07-server-side-path/) — الملفات الثابتة والديناميكية وVirtual Hosts والتطبيق وقاعدة البيانات.
8. [التفكير البرمجي والخوارزميات](./08-problem-solving-algorithms/) — تحليل المشكلة وPseudocode وبنى البيانات وBig O.
9. [كيف يعرض المتصفح الصفحة؟](./09-browser-rendering-devtools/) — DOM وCSSOM وLayout وPaint وDevTools.
10. [HTTP Caching والضغط](./10-http-caching-compression/) — Cache-Control وETag وVary وgzip وBrotli.
11. [Same-Origin Policy وCORS](./11-same-origin-cors/) — Origins وPreflight والـCredentials والإعداد الآمن.
12. [الاتصال اللحظي وWebhooks](./12-realtime-webhooks/) — Polling وSSE وWebSocket وWebhooks.
13. [تصميم APIs](./13-api-design/) — REST وRPC وGraphQL والأخطاء والصفحات والإصدارات.

:::tip[طريقة المذاكرة]
ابدأ بالرسم، ثم افتح أدوات المطور في المتصفح وتابع طلبًا حقيقيًا من تبويب Network. اربط كل حقل تراه بالدرس المناسب.
:::

## الخريطة المختصرة

```text
URL → DNS → IP + Port → TCP/QUIC + TLS → HTTP Request
    → CDN/WAF/Load Balancer → Web Server → PHP → Database
    → HTTP Response → Browser
```

هذه خريطة تعليمية؛ بعض المراحل اختيارية، وقد تختصرها Cache أو وصلة مفتوحة مسبقًا.
