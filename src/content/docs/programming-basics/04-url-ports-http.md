---
title: 4. URL والمنافذ وHTTP
description: تشريح الرابط، معنى Port وSocket، نطاقات المنافذ، وبروتوكول HTTP.
sidebar:
  order: 4
---

## HTTP

**HTTP = Hypertext Transfer Protocol**، وهو بروتوكول طبقة التطبيق الذي يحدد طريقة تبادل رسائل request وresponse حول resources. HTTP ليس اتصال الشبكة نفسه؛ يعمل فوق وسائل نقل مثل TCP أو QUIC.

HTTP في أصله عديم الحالة: كل request رسالة مستقلة. استمرار تسجيل الدخول أو السلة يحتاج آلية إضافية مثل Cookies/Sessions/Tokens.

## تشريح URL

```text
https://user:pass@example.com:443/products/42?currency=EGP#reviews
└─┬─┘              └────┬────┘ └┬┘└────┬─────┘└────┬─────┘└──┬──┘
scheme                  host   port    path          query      fragment
```

| الجزء | المعنى |
|---|---|
| Scheme | البروتوكول/طريقة الوصول مثل `http` و`https` |
| User info | موجود نحويًا في بعض URIs لكنه غير مناسب لكلمات المرور |
| Hostname | اسم المضيف مثل `example.com` |
| Port | الخدمة على الجهاز؛ يُحذف إذا استُخدم الافتراضي |
| Path | المورد داخل الموقع |
| Query | أزواج إضافية بعد `?` |
| Fragment | موضع محلي بعد `#` ولا يُرسل عادة إلى الخادم |

:::danger
لا تضع كلمة مرور أو token أو بيانات حساسة في URL. قد تظهر في Browser History وLogs وAnalytics وReferer.
:::

## ما المنفذ؟

عنوان IP يحدد الواجهة/الجهاز على الشبكة، والمنفذ يحدد خدمة منطقية داخل نظام التشغيل. رقم المنفذ 16-bit من `0` إلى `65535`.

- `0–1023`: System/Well-Known Ports.
- `1024–49151`: User/Registered Ports.
- `49152–65535`: Dynamic/Private Ports وفق نطاق IANA؛ قد تختلف نطاقات المنافذ المؤقتة فعليًا بين الأنظمة.

| الخدمة | المنفذ الشائع |
|---|---:|
| FTP control | 21 |
| SSH | 22 |
| SMTP | 25 |
| DNS | 53 |
| HTTP | 80 |
| HTTPS | 443 |
| MySQL | 3306 |
| PostgreSQL | 5432 |

المنفذ الشائع convention/configuration وليس حماية. يمكن تشغيل HTTP محليًا على `8000` أو `8080`.

## Socket وConnection

Socket endpoint يمكن تبسيطه إلى protocol + IP + port. اتصال TCP يُميز غالبًا بهذه الرباعية:

```text
(client IP, client port, server IP, server port)
192.0.2.5:53014 → 203.0.113.8:443
```

يستخدم العميل عادة منفذًا مؤقتًا، بينما يستمع الخادم على منفذ معروف. لذلك يمكن لآلاف العملاء الاتصال بالمنفذ 443 نفسه دون أن تختلط اتصالاتهم.

## مثال PHP محلي

```bash
php -S localhost:8000
```

في `http://localhost:8000/hello.php`:

- scheme = `http`
- host = `localhost`
- port = `8000`
- path = `/hello.php`

عدم كتابة المنفذ في HTTPS يعني عادة 443، وفي HTTP يعني 80؛ لا يعني عدم وجود منفذ.

## خريطة الدرس

<div class="lesson-diagram" role="img" aria-label="خريطة مفاهيم: URL والمنافذ وHTTP">
<p class="lesson-diagram-title">خريطة مفاهيم: URL والمنافذ وHTTP</p>
<div class="diagram-flow">
<div class="diagram-node input"><span>HTTP</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>تشريح URL</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>ما المنفذ؟</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node decision"><span>Socket وConnection</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node output"><span>مثال PHP محلي</span></div>
</div>
</div>

## تأكد من فهمك

<div class="lesson-quiz" role="list">
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">01</span><p>اشرح «HTTP» كأنك تراجع تطبيقًا حقيقيًا: ما الهدف وما أهم قيد يجب الانتباه له؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> HTTP = Hypertext Transfer Protocol، وهو بروتوكول طبقة التطبيق الذي يحدد طريقة تبادل رسائل request وresponse حول resources. HTTP ليس اتصال الشبكة نفسه؛ يعمل فوق وسائل نقل مثل TCP أو QUIC. HTTP في أصله عديم الحالة: كل request رسالة مستقلة. استمرار تسجيل الدخول أو السلة يحتاج آلية إضافية مثل Cookies/Sessions/Tokens. عمليًا، لا يكفي تنفيذ المسار الناجح؛ يجب توثيق الافتراضات والتحقق من القيم والحالات التي قد تكسر هذا السلوك.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">02</span><p>قارن بين «HTTP» و«تشريح URL». لماذا لا يغني أحدهما عن الآخر داخل موضوع «URL والمنافذ وHTTP»؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> في «HTTP»: HTTP = Hypertext Transfer Protocol، وهو بروتوكول طبقة التطبيق الذي يحدد طريقة تبادل رسائل request وresponse حول resources. HTTP ليس اتصال الشبكة نفسه؛ يعمل فوق وسائل نقل مثل TCP أو QUIC. HTTP في أصله عديم الحالة: كل request رسالة مستقلة. استمرار تسجيل الدخول أو السلة يحتاج آلية إضافية مثل Cookies/Sessions/Tokens. أما «تشريح URL»: | الجزء | المعنى | |---|---| | Scheme | البروتوكول/طريقة الوصول مثل http وhttps | | User info | موجود نحويًا في بعض URIs لكنه غير مناسب لكلمات المرور | | Hostname | اسم المضيف مثل example.com | | Port | الخدمة على الجهاز؛ يُحذف إذا استُخدم الافتراضي | | Path | المورد داخل الموقع | | Query | أزواج إضافية بعد ? | | Fragment | موضع محلي بعد # ولا يُرسل عادة إلى الخادم | :::danger لا تضع كلمة مرور أو token أو بيانات… العلاقة بينهما أن الأول يحدد جانبًا من الحل، والثاني يكمل السلوك أو القيود اللازمة لتطبيقه بصورة صحيحة.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">03</span><p>افترض أن نظامًا تجاهل «ما المنفذ؟». ما العطل أو الخطر المتوقع، وكيف تصمم اختبارًا يكشفه؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> عنوان IP يحدد الواجهة/الجهاز على الشبكة، والمنفذ يحدد خدمة منطقية داخل نظام التشغيل. رقم المنفذ 16-bit من 0 إلى 65535. 0–1023: System/Well-Known Ports. 1024–49151: User/Registered Ports. 49152–65535: Dynamic/Private Ports وفق نطاق IANA؛ قد تختلف نطاقات المنافذ المؤقتة فعليًا بين الأنظمة. | الخدمة | المنفذ الشائع | |---|---:| | FTP control | 21 | | SSH | 22 | | SMTP | 25 | | DNS | 53 | | HTTP | 80 | | HTTPS | 443 | |… لاكتشاف الخلل، اختبر مسارًا صحيحًا، وقيمة عند الحد، ومدخلًا غير صالح، ثم راقب النتيجة والآثار الجانبية والسجل بدل الاكتفاء بعدم ظهور Exception.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">04</span><p>حوّل «Socket وConnection» إلى قرار هندسي قابل للمراجعة. ما الذي ستوثقه وما الحالات التي ستختبرها؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> Socket endpoint يمكن تبسيطه إلى protocol + IP + port. اتصال TCP يُميز غالبًا بهذه الرباعية: يستخدم العميل عادة منفذًا مؤقتًا، بينما يستمع الخادم على منفذ معروف. لذلك يمكن لآلاف العملاء الاتصال بالمنفذ 443 نفسه دون أن تختلط اتصالاتهم. وثّق سبب الاختيار والبدائل والحدود، واختبر الحالة العادية، والحد الأدنى والأقصى، والفشل الجزئي، وإعادة المحاولة أو التكرار إن كان السلوك يسمح بذلك.</div></details>
</section>
</div>
