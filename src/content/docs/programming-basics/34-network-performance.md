---
title: "Latency وBandwidth: ليه الاتصال السريع ممكن يتأخر؟"
description: "افصل زمن الانتظار عن سعة النقل، وافهم RTT وthroughput وbandwidth-delay product قبل تحسين الشبكة."
sidebar:
  order: 33
prev: {"link":"/programming-basics/25-request-observation/","label":"تتبّع الطلب وفسّر القياسات"}
next: {"link":"/programming-basics/35-vpc-firewalls/","label":"VPC وFirewall: ابنِ حدود شبكة الخدمة"}
---

<span class="foundations-reading-scope" aria-hidden="true"></span>

تنزيل ملف سريع لا يعني إن أول byte وصل بسرعة، والعكس صحيح. علشان تشخّص صح لازم تفصل بين الزمن والسعة.

## المصطلحات الأساسية

- **Latency — الزمن من بدء عملية لحد ظهور نتيجتها**. في الشبكات قد نقيس زمن اتجاه واحد أو زمن request كامل.
- **RTT، Round-Trip Time — زمن الذهاب والعودة** بين إرسال رسالة صغيرة ووصول ردها.
- **Bandwidth — السعة النظرية أو المتاحة لنقل بيانات في الثانية**، مثل `100 Mbps`.
- **Throughput — المعدل الذي تحقق فعليًا** بعد خصم headers والفقد والازدحام وحدود الطرفين.
- **Jitter — تغير latency من قياس لآخر**؛ مهم للصوت والألعاب حتى لو المتوسط مقبول.

| الموقف | العامل الغالب |
|---|---|
| API صغير يفتح اتصالات متتابعة | RTT وعدد الرحلات |
| تنزيل ملف كبير | throughput وحجم الملف |
| مكالمة تتقطع رغم متوسط جيد | jitter والفقد والـbuffering |
| رفع سريع في البداية ثم يبطؤ | ازدحام أو limits أو storage، مش bandwidth وحدها |

## احسب قبل ما تخمّن

`100 Mbps` تعني 100 megabits في الثانية، مش 100 megabytes. الحد النظري يقارب `12.5 MB/s` قبل overhead. ملف `100 MB` يحتاج على الأقل نحو 8 ثوانٍ عند استغلال كامل للسعة؛ الواقع أطول.

**Bandwidth-delay product، BDP** هو كمية البيانات التي يمكن أن تكون “في الطريق” قبل وصول ACK:

```text
BDP = bandwidth × RTT
100 Mbps × 0.08 s = 8 megabits ≈ 1 MB
```

لو نافذة النقل أصغر كثيرًا من BDP فلن تمتلئ الوصلة البعيدة. ولو request صغير يحتاج DNS وTCP وTLS وHTTP بالتتابع، تقليل حجم body وحده قد لا يعالج التأخير.

:::note
أرقام الإنترنت تتغير حسب المسافة والوسيط والازدحام والجهاز. استخدم القياسات كرتب تقريبية لا كوعود: RAM أسرع بكثير من disk، والشبكة المحلية غالبًا أقل latency من اتصال بعيد، لكن cache miss أو queue ممتلئة قد تقلب النتيجة.
:::

## قِس الطبقات

استخدم `curl.exe` على Windows لعرض مراحل request:

```powershell
curl.exe -s -o NUL -w "dns=%{time_namelookup} connect=%{time_connect} tls=%{time_appconnect} first_byte=%{time_starttransfer} total=%{time_total}`n" https://example.com/
```

كرّر القياس؛ عينة واحدة لا تمثل distribution. قارن median وp95 عند مراقبة خدمة، وحدد هل البطء قبل الاتصال، أثناء TLS، قبل أول byte، أم أثناء تنزيل body.

:::note[تعمق أكثر: Useful numbers لازم تتقاس في سياق]
الـRTT بين منطقتين مش رقم ثابت محفوظ؛ يتغير حسب المسار والازدحام وشبكة المستخدم. وحجم ملف 10 MB لا يعني زمن `size / advertised bandwidth` فقط: فيه DNS وhandshakes وslow start وLoss وserver time وprotocol overhead. استخدم الأرقام القديمة كـOrder-of-magnitude للتقدير، ثم قِس من مكان يشبه المستخدم الحقيقي.

**Bandwidth-delay product** يساوي Bandwidth × RTT، ويمثل تقريبًا كمية البيانات المطلوبة in flight لملء الطريق. وصلة 100 Mbps مع RTT قدره 100 ms تحتاج قرابة 1.25 MB in flight؛ لو نافذة TCP أوBuffer أصغر، مش هتوصل للسعة المعلنة. Jitter مهم للـRealtime حتى لو المتوسط جيد، وP95/P99 يكشفان مستخدمين لا يظهرون في Average.
:::

## راجع فهمك

<details><summary>زادت سرعة الخط للضعف لكن API الصغير لم يتحسن. ليه؟</summary><p>لأن الرحلات المتتابعة أو معالجة server قد تكون المسيطرة؛ زيادة bandwidth لا تلغي RTT.</p></details>
<details><summary>هل throughput يساوي bandwidth؟</summary><p>لا. throughput نتيجة فعلية تتأثر بالـoverhead والفقد والازدحام وحدود الطرفين.</p></details>

