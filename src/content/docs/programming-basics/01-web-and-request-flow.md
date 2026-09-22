---
title: 1. الإنترنت والويب ودورة الطلب
description: الفرق بين الإنترنت والويب، نموذج العميل والخادم، والرسم الكامل لرحلة الطلب والاستجابة.
sidebar:
  order: 1
---

## الإنترنت ليس هو الويب

- **الإنترنت:** بنية عالمية من الشبكات والأجهزة والراوترات والبروتوكولات.
- **الويب:** خدمة فوق الإنترنت تستخدم HTTP/HTTPS للوصول إلى موارد عبر URLs.
- البريد الإلكتروني ونقل الملفات والمكالمات والألعاب خدمات أخرى تستخدم الإنترنت.

## نموذج Client/Server

الـ **Client** برنامج يطلب خدمة: متصفح، تطبيق هاتف، أو أداة مثل `curl`. والـ **Server** دور يستقبل الطلبات ويعالجها؛ قد يعني برنامجًا أو جهازًا. أثناء التطوير يمكن أن يعمل الطرفان على جهازك نفسه.

```text
المستخدم → المتصفح → HTTP Request → الخادم
                                  ↓
                         تطبيق PHP ↔ Database
                                  ↓
المستخدم ← عرض النتيجة ← HTTP Response
```

## ماذا يحدث عند فتح رابط؟

عند فتح `https://shop.example/products/42?currency=EGP#reviews`:

1. يحلل المتصفح URL ويبحث في الـCache والسياسات المحلية.
2. يبحث DNS عن عنوان IP إذا لم يكن مخزنًا.
3. يختار نظام التشغيل الواجهة والمسار، وترسل NIC البيانات عبر Wi-Fi أو Ethernet.
4. تمر الحزم عبر الراوتر وISP وعدة شبكات.
5. يُنشأ اتصال TCP لـHTTP/1.1 أو HTTP/2، أو QUIC فوق UDP لـHTTP/3.
6. ينفذ TLS Handshake عند HTTPS.
7. يرسل المتصفح HTTP Request.
8. قد يستقبله CDN أو WAF أو Load Balancer قبل الخادم الأصلي.
9. يعيد Web Server ملفًا ثابتًا أو يمرر الطلب الديناميكي إلى PHP-FPM.
10. يتحقق التطبيق من المدخلات والهوية والصلاحيات، وقد يستخدم Cache أو Database.
11. تعود HTTP Response بالحالة والرؤوس والجسم، ثم يفسرها المتصفح ويعرضها.

## الرسم الفعلي الكامل

![رسم ملون يوضح رحلة الطلب من المتصفح عبر DNS والشبكة إلى PHP وقاعدة البيانات ثم رجوع الاستجابة](/diagrams/request-flow-ar.svg)

[افتح الرسم بالحجم الكامل](/diagrams/request-flow-ar.svg)

:::note
الرسم شامل وليس مسارًا إلزاميًا. قد يعيد Browser Cache أو CDN النتيجة دون الوصول إلى PHP، وقد لا يملك التطبيق Load Balancer أو قاعدة بيانات أصلًا.
:::

## مثال يمكن مشاهدته

```bash
curl -i "https://example.com/"
```

الخيار `-i` يعرض Response Headers مع الجسم. ولرؤية خطوات DNS والاتصال وTLS:

```bash
curl -v "https://example.com/" -o NUL
```

على Linux/macOS استبدل `NUL` بـ `/dev/null`.

## من المسؤول عن ماذا؟

| المكوّن | مسؤوليته الأساسية |
|---|---|
| Browser | بناء الطلب، إدارة Cache/Cookies، تفسير الاستجابة |
| DNS | تحويل الاسم إلى عنوان IP |
| TCP/QUIC | نقل البيانات وخصائص الاتصال |
| TLS | السرية والسلامة والتحقق من هوية الخادم |
| HTTP | معنى الطلب والاستجابة |
| Web Server | استقبال HTTP والملفات الثابتة وتمرير الديناميكي |
| PHP | منطق التطبيق وإنشاء الاستجابة |
| Database | حفظ البيانات واسترجاعها |

فهم الحدود يمنع أخطاء مثل القول إن DNS «يفتح الصفحة»، أو أن NIC «تنفذ HTTP»، أو أن Nginx «ينفذ PHP» بنفسه.

## خريطة الدرس

<div class="lesson-diagram" role="img" aria-label="خريطة مفاهيم: الإنترنت والويب ودورة الطلب">
<p class="lesson-diagram-title">خريطة مفاهيم: الإنترنت والويب ودورة الطلب</p>
<div class="diagram-flow">
<div class="diagram-node input"><span>الإنترنت ليس هو الويب</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>نموذج Client/Server</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>ماذا يحدث عند فتح رابط؟</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node decision"><span>الرسم الفعلي الكامل</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node output"><span>مثال يمكن مشاهدته</span></div>
</div>
</div>

## تأكد من فهمك

<div class="lesson-quiz" role="list">
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">01</span><p>اشرح «الإنترنت ليس هو الويب» كأنك تراجع تطبيقًا حقيقيًا: ما الهدف وما أهم قيد يجب الانتباه له؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> الإنترنت: بنية عالمية من الشبكات والأجهزة والراوترات والبروتوكولات. الويب: خدمة فوق الإنترنت تستخدم HTTP/HTTPS للوصول إلى موارد عبر URLs. البريد الإلكتروني ونقل الملفات والمكالمات والألعاب خدمات أخرى تستخدم الإنترنت. عمليًا، لا يكفي تنفيذ المسار الناجح؛ يجب توثيق الافتراضات والتحقق من القيم والحالات التي قد تكسر هذا السلوك.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">02</span><p>قارن بين «الإنترنت ليس هو الويب» و«نموذج Client/Server». لماذا لا يغني أحدهما عن الآخر داخل موضوع «الإنترنت والويب ودورة الطلب»؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> في «الإنترنت ليس هو الويب»: الإنترنت: بنية عالمية من الشبكات والأجهزة والراوترات والبروتوكولات. الويب: خدمة فوق الإنترنت تستخدم HTTP/HTTPS للوصول إلى موارد عبر URLs. البريد الإلكتروني ونقل الملفات والمكالمات والألعاب خدمات أخرى تستخدم الإنترنت. أما «نموذج Client/Server»: الـ Client برنامج يطلب خدمة: متصفح، تطبيق هاتف، أو أداة مثل curl. والـ Server دور يستقبل الطلبات ويعالجها؛ قد يعني برنامجًا أو جهازًا. أثناء التطوير يمكن أن يعمل الطرفان على جهازك نفسه. العلاقة بينهما أن الأول يحدد جانبًا من الحل، والثاني يكمل السلوك أو القيود اللازمة لتطبيقه بصورة صحيحة.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">03</span><p>افترض أن نظامًا تجاهل «ماذا يحدث عند فتح رابط؟». ما العطل أو الخطر المتوقع، وكيف تصمم اختبارًا يكشفه؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> عند فتح https://shop.example/products/42?currency=EGP#reviews: يحلل المتصفح URL ويبحث في الـCache والسياسات المحلية. يبحث DNS عن عنوان IP إذا لم يكن مخزنًا. يختار نظام التشغيل الواجهة والمسار، وترسل NIC البيانات عبر Wi-Fi أو Ethernet. تمر الحزم عبر الراوتر وISP وعدة شبكات. يُنشأ اتصال TCP لـHTTP/1.1 أو HTTP/2، أو QUIC فوق UDP لـHTTP/3. ينفذ TLS Handshake عند HTTPS. يرسل المتصفح HTTP Request. قد يستقبله CDN أو WAF أو… لاكتشاف الخلل، اختبر مسارًا صحيحًا، وقيمة عند الحد، ومدخلًا غير صالح، ثم راقب النتيجة والآثار الجانبية والسجل بدل الاكتفاء بعدم ظهور Exception.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">04</span><p>حوّل «الرسم الفعلي الكامل» إلى قرار هندسي قابل للمراجعة. ما الذي ستوثقه وما الحالات التي ستختبرها؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> افتح الرسم بالحجم الكامل :::note الرسم شامل وليس مسارًا إلزاميًا. قد يعيد Browser Cache أو CDN النتيجة دون الوصول إلى PHP، وقد لا يملك التطبيق Load Balancer أو قاعدة بيانات أصلًا. ::: وثّق سبب الاختيار والبدائل والحدود، واختبر الحالة العادية، والحد الأدنى والأقصى، والفشل الجزئي، وإعادة المحاولة أو التكرار إن كان السلوك يسمح بذلك.</div></details>
</section>
</div>
