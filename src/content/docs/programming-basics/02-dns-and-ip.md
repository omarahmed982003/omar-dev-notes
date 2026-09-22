---
title: 2. DNS وعناوين IP
description: كيف يتحول اسم النطاق إلى IP عبر Cache وResolver وRoot وTLD وAuthoritative DNS.
sidebar:
  order: 2
---

## عنوان IP

عنوان IP يعرّف واجهة على شبكة ويتيح توجيه الحزم إليها. أمثلة:

- IPv4: `192.168.1.20` محلي خاص، و`203.0.113.10` مثال توثيقي.
- IPv6: `2001:db8::10` مثال توثيقي.
- `127.0.0.1` و`::1`: Loopback، أي جهازك نفسه.
- `localhost` اسم يشير عادة إلى Loopback.

العنوان الخاص داخل منزلك ليس بالضرورة العنوان العام على الإنترنت. غالبًا يجري الراوتر NAT بينهما.

## لماذا DNS؟

البشر يتذكرون `example.com` أسهل من IP، ومالك الخدمة قد يغيّر الخوادم دون تغيير الاسم. DNS نظام موزع يعيد records، وليس مجرد «جدول اسم وIP».

أشهر السجلات:

| Record | الوظيفة |
|---|---|
| `A` | اسم إلى IPv4 |
| `AAAA` | اسم إلى IPv6 |
| `CNAME` | اسم مستعار لاسم آخر |
| `MX` | خوادم البريد |
| `TXT` | نصوص تحقق وسياسات |
| `NS` | الخوادم المسؤولة عن zone |

## رحلة DNS المكتوبة في الورق

1. يفحص Browser Cache.
2. يفحص نظام التشغيل وملف hosts والـOS Cache.
3. يسأل Recursive Resolver، وغالبًا يوفره ISP أو خدمة عامة.
4. إذا لم تكن الإجابة مخزنة، يسأل resolver خادم Root.
5. يشير Root إلى خوادم TLD مثل `.com`.
6. يشير TLD إلى Authoritative Name Server.
7. يعيد Authoritative Server السجل النهائي.
8. تُخزن النتيجة حسب TTL ثم تعود إلى المتصفح.

```text
Browser/OS Cache
      ↓ miss
Recursive Resolver
      ↓
Root → TLD → Authoritative
      ↑          |
      └── IP + TTL
```

:::caution[تصحيح]
المتصفح لا يسأل Root وTLD بنفسه عادة، ولا تتكرر الرحلة الكاملة لكل طلب. الـResolver يؤديها عند غياب الإجابة من Cache.
:::

## TTL وأكثر من عنوان

TTL مدة تسمح بتخزين الإجابة قبل إعادة الاستعلام. وقد يعيد الاسم عدة عناوين لأسباب مثل توزيع الحمل أو القرب الجغرافي. DNS يحدد عنوانًا محتملًا؛ لا ينقل صفحة HTML ولا يشغل PHP.

## تجربة عملية

```bash
nslookup example.com
nslookup -type=AAAA example.com
nslookup -type=MX example.com
```

ولفهم اختلاف طبقات الـCache، غيّر السجل في بيئة تجريبية ولاحظ أن الانتشار ليس «زرًا فوريًا»؛ كل مخزن ينتهي وفق TTL وسياساته.

## خريطة الدرس

<div class="lesson-diagram" role="img" aria-label="خريطة مفاهيم: DNS وعناوين IP">
<p class="lesson-diagram-title">خريطة مفاهيم: DNS وعناوين IP</p>
<div class="diagram-flow">
<div class="diagram-node input"><span>عنوان IP</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>لماذا DNS؟</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>رحلة DNS المكتوبة في الورق</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node decision"><span>TTL وأكثر من عنوان</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node output"><span>تجربة عملية</span></div>
</div>
</div>

## تأكد من فهمك

<div class="lesson-quiz" role="list">
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">01</span><p>اشرح «عنوان IP» كأنك تراجع تطبيقًا حقيقيًا: ما الهدف وما أهم قيد يجب الانتباه له؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> عنوان IP يعرّف واجهة على شبكة ويتيح توجيه الحزم إليها. أمثلة: IPv4: 192.168.1.20 محلي خاص، و203.0.113.10 مثال توثيقي. IPv6: 2001:db8::10 مثال توثيقي. 127.0.0.1 و::1: Loopback، أي جهازك نفسه. localhost اسم يشير عادة إلى Loopback. العنوان الخاص داخل منزلك ليس بالضرورة العنوان العام على الإنترنت. غالبًا يجري الراوتر NAT بينهما. عمليًا، لا يكفي تنفيذ المسار الناجح؛ يجب توثيق الافتراضات والتحقق من القيم والحالات التي قد تكسر هذا السلوك.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">02</span><p>قارن بين «عنوان IP» و«لماذا DNS؟». لماذا لا يغني أحدهما عن الآخر داخل موضوع «DNS وعناوين IP»؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> في «عنوان IP»: عنوان IP يعرّف واجهة على شبكة ويتيح توجيه الحزم إليها. أمثلة: IPv4: 192.168.1.20 محلي خاص، و203.0.113.10 مثال توثيقي. IPv6: 2001:db8::10 مثال توثيقي. 127.0.0.1 و::1: Loopback، أي جهازك نفسه. localhost اسم يشير عادة إلى Loopback. العنوان الخاص داخل منزلك ليس بالضرورة العنوان العام على الإنترنت. غالبًا يجري الراوتر NAT بينهما. أما «لماذا DNS؟»: البشر يتذكرون example.com أسهل من IP، ومالك الخدمة قد يغيّر الخوادم دون تغيير الاسم. DNS نظام موزع يعيد records، وليس مجرد «جدول اسم وIP». أشهر السجلات: | Record | الوظيفة | |---|---| | A | اسم إلى IPv4 | | AAAA | اسم إلى IPv6 | | CNAME | اسم مستعار لاسم آخر | | MX | خوادم البريد | | TXT | نصوص تحقق وسياسات | | NS | الخوادم المسؤولة عن zone | العلاقة بينهما أن الأول يحدد جانبًا من الحل، والثاني يكمل السلوك أو القيود اللازمة لتطبيقه بصورة صحيحة.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">03</span><p>افترض أن نظامًا تجاهل «رحلة DNS المكتوبة في الورق». ما العطل أو الخطر المتوقع، وكيف تصمم اختبارًا يكشفه؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> يفحص Browser Cache. يفحص نظام التشغيل وملف hosts والـOS Cache. يسأل Recursive Resolver، وغالبًا يوفره ISP أو خدمة عامة. إذا لم تكن الإجابة مخزنة، يسأل resolver خادم Root. يشير Root إلى خوادم TLD مثل .com. يشير TLD إلى Authoritative Name Server. يعيد Authoritative Server السجل النهائي. تُخزن النتيجة حسب TTL ثم تعود إلى المتصفح. :::caution[تصحيح] المتصفح لا يسأل Root وTLD بنفسه عادة، ولا تتكرر الرحلة الكاملة لكل طلب.… لاكتشاف الخلل، اختبر مسارًا صحيحًا، وقيمة عند الحد، ومدخلًا غير صالح، ثم راقب النتيجة والآثار الجانبية والسجل بدل الاكتفاء بعدم ظهور Exception.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">04</span><p>حوّل «TTL وأكثر من عنوان» إلى قرار هندسي قابل للمراجعة. ما الذي ستوثقه وما الحالات التي ستختبرها؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> TTL مدة تسمح بتخزين الإجابة قبل إعادة الاستعلام. وقد يعيد الاسم عدة عناوين لأسباب مثل توزيع الحمل أو القرب الجغرافي. DNS يحدد عنوانًا محتملًا؛ لا ينقل صفحة HTML ولا يشغل PHP. وثّق سبب الاختيار والبدائل والحدود، واختبر الحالة العادية، والحد الأدنى والأقصى، والفشل الجزئي، وإعادة المحاولة أو التكرار إن كان السلوك يسمح بذلك.</div></details>
</section>
</div>
