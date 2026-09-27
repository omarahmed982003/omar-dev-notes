---
title: "تتبّع الطلب وفسّر القياسات"
description: "تتبّع الطلب وفسّر القياسات"
sidebar:
  order: 33
prev: {"link":"/programming-basics/24-request-protection/","label":"حماية الطلبات وتحديد معدلها"}
next: false
---

لو الطلب بطيء، محتاج دليل عن الجزء اللي أخّر الرد. هنقرأ سجلًا ومدة ومعرّف طلب، ثم نربط قياسات أكثر من خدمة.

## اقرأ قياسًا ومعرّفًا من تجربة تملكها

في [المعمل](/programming-basics/32-local-network-lab/) نفّذ طلب المنتج ثم `/missing` ثم `/failure`. كل رد يحمل `X-Request-Id`، وفي الطرفية سطر بنفس المعرف وحالة200 أو404 أو500. ده **Log — سجل حدث**، والمعرف يربط الرد بالسجل. عبر `/proxy` تجد نفس المعرف عند الطرفين.

**Span — جزء محدد من رحلة العمل له بداية ونهاية** مثل زمن استعلام قاعدة البيانات. مجموعة أجزاء مرتبطة تكوّن Trace، أي تتبع الرحلة. معرّف الطلب وحده ليس تتبعًا كاملًا؛ المعمل يثبت الربط بين طلبين، ولا يدّعي قياس قاعدة بيانات غير موجودة.

**Percentile — قيمة يقع عندها أو تحتها جزء من القياسات**. بافتراض20مدة مرتبة 10،20،…،200مللي ثانية، وبطريقة أقرب رتبة: p50 عند الرتبة10 فيساوي100؛ p95 عند19 فيساوي190؛ p99 عند20 فيساوي200. برامج القياس قد تستخدم استيفاءً مختلفًا، والعينة الصغيرة ضعيفة لتقدير ذيل توزيع كبير. اذكر الطريقة وحجم العينة بدل التعامل مع p95 كمتوسط.

**تسليمك:** ثلاث حالات مع معرفاتها وسجلاتها، وطلب عبر الوسيط، وتفسير200/404/500. بعده جرّب المشروع العام تحت كتوسع، مع قبول غياب حقول لا يعرضها الموقع العام.

## Logs وMetrics وTraces

- **Log:** حدث تفصيلي مثل فشل تسجيل دخول، مع وقت ومستوى وحقول منظمة.
- **Metric:** قياس مجمع مثل معدل الطلبات وError Rate وLatency (زمن انتظار عملية واحدة) Percentiles وتشبع الاتصالات.
- **Trace:** رحلة طلب عبر Spans في CDN وGateway والتطبيق وقاعدة البيانات.

مرر Trace/Correlation ID ولا تسجل كلمات مرور أو Tokens أو بيانات شخصية بلا ضرورة. قس `p50` و`p95` و`p99`؛ المتوسط وحده يخفي بطء نسبة صغيرة من الطلبات. اربط التنبيه بعرض مستخدم متأثر، لا بكل ارتفاع لحظي عديم الأثر.

```text
Client timing: DNS → Connect → TLS → TTFB → Download
Server trace:  Edge → Gateway → App → DB → External API
```

إذا ارتفع TTFB (Time To First Byte؛ مدة الانتظار حتى وصول أول بايت من الرد بحسب أداة القياس) بينما زمن التطبيق طبيعي، افحص Queueing والحافة والشبكة. إذا كان Span قاعدة البيانات بطيئًا، انتقل إلى الاستعلام والفهرس والاتصالات بدل اتهام المتصفح.

## تأكد من فهمك

<div class="lesson-quiz" role="list">
<section class="quiz-card" role="listitem"><div class="quiz-question-row"><span class="quiz-number">01</span><p>كيف قد يؤدي Cache Key خاطئ إلى تسريب بيانات؟</p></div><details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة:</strong> إذا تجاهل المفتاح الهوية أو Header (حقل أو مقدمة معلومات تضاف للبيانات بحسب الطبقة) يغير الاستجابة، قد تعيد CDN نسخة مستخدم إلى مستخدم آخر.</div></details></section>
<section class="quiz-card" role="listitem"><div class="quiz-question-row"><span class="quiz-number">02</span><p>لماذا لا يكفي WAF (Web Application Firewall؛ نظام يفحص طلبات الويب ويطبق قواعد حماية) لحماية Endpoint (عنوان يقدم عملية أو بيانات من التطبيق) لتعديل فاتورة؟</p></div><details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة:</strong> يستطيع كشف أنماط ضارة، لكنه لا يعرف وحده ملكية الفاتورة وصلاحية المستخدم وقواعد المجال.</div></details></section>
<section class="quiz-card" role="listitem"><div class="quiz-question-row"><span class="quiz-number">03</span><p>ما الفرق بين Rate Limit وConcurrency Limit وQuota؟</p></div><details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة:</strong> الأول يحد معدل الوصول، والثاني عدد الأعمال المتزامنة، والثالث إجمالي الاستهلاك خلال فترة.</div></details></section>
<section class="quiz-card" role="listitem"><div class="quiz-question-row"><span class="quiz-number">04</span><p>لماذا نحتاج Log وMetric وTrace معًا؟</p></div><details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة:</strong> Metric يكشف الاتجاه، وTrace يحدد المرحلة البطيئة أو الفاشلة، وLog يقدم تفاصيل الحدث اللازمة لفهم السبب.</div></details></section>
</div>

## مشروع تراكمي: تتبّع طلب واحد من الاسم إلى الـOrigin

اختر URL (Uniform Resource Locator؛ عنوان يحدد موردًا وطريقة الوصول إليه) عامًا غير حساس، وأنشئ «بطاقة رحلة» لطلب واحد. لا تكتفِ بصورة DevTools؛ اربط كل ملاحظة بطبقة وبدليل قابل لإعادة التنفيذ.

### 1. الاسم والعنوان

~~~bash
nslookup example.com
~~~

سجّل اسم الـresolver والعناوين والـTTL (Time To Live؛ عمر النسخة المخزنة في DNS، وفي IPv4 حقل منفصل يحد عدد مرات تمرير الحزمة) إن أظهرته أداتك. تغيّر العنوان بين تشغيلين قد يكون نتيجة CDN أو DNS (Domain Name System؛ نظام يجيب عن أسئلة أسماء النطاقات، ومنها عناوينها) load balancing، وليس خطأ.

### 2. الاتصال وHTTP

~~~bash
curl.exe -sS -o NUL -D headers.txt -w "status=%{http_code} remote=%{remote_ip} connect=%{time_connect} ttfb=%{time_starttransfer} total=%{time_total}\n" https://example.com/
~~~

مثال لشكل الناتج، وليس قيمة يجب نسخها:

~~~text
status=200 remote=203.0.113.10 connect=0.042 ttfb=0.118 total=0.121
~~~

على macOS أو Linux استبدل <code>NUL</code> بـ<code>/dev/null</code>. افحص <code>headers.txt</code> وابحث عن <code>cache-control</code> و<code>age</code> و<code>via</code> وأي request ID (معرّف يميز طلبًا لتتبع أحداثه)؛ غياب Header لا يثبت غياب CDN.

### 3. كرر وقارن

نفّذ الطلب خمس مرات واحفظ status وTTFB وAge. ثم أضف query parameter آمنًا ولاحظ هل غيّر cache key. لا تستنتج cache hit من السرعة وحدها؛ اطلب دليلًا من headers أو منصة الخدمة.

### 4. مسار الفشل

في المعمل اختبر مسارًا غير موجود وتأكد أن 404 تحمل معرّف الطلب. في الموقع العام سجل هل المعرف وسياسة التخزين ظاهرين؛ غيابهما ليس فشلًا منك. إذا تملك بيئة تجريبية، ولّد 500 مراقبة وتحقق أن الـtrace يصل من الحافة إلى التطبيق وأن السجل لا يحتوي Cookie أو Authorization.

### التسليم

جدول من خمس محاولات، لقطة من Network waterfall، تفسير لفرق TTFB، وفرضية واحدة قابلة للدحض عن موضع التأخير. ميّز بوضوح بين «ما قسته» و«ما استنتجته».

## راجع الاستنتاج قبل تعديل الخدمة

**Purge أو Invalidation — إبطال نسخة مخزنة** يطلب حذفها أو اعتبارها غير صالحة. التغيير قد لا يصل لكل نقطة خدمة لحظيًا. عنوان أصل ثابت يحمل رقم نسخة أو بصمة محتوى يساعد على طلب الملف الجديد صراحة؛ كلمة hash هنا بصمة من المحتوى، وليست تشفيرًا يخفيه.

**False positive — إنذار خاطئ** حظر طلب سليم ظنًا أنه هجوم. راقب قاعدة WAF قبل تعميمها، وحدد طريقة رجوع **Rollback** لإعداد معروف. **Trace context — معلومات ربط التتبع** لازم تنتقل بين الخدمات والمهام المؤجلة حتى نقدر نجمع رحلة الطلب. معرّف الطلب مفيد في ردود 404 و500 كمان، لكن لا تفترض أن أي موقع عام يعرضه.

**تدريب محلول:** الرد أسرع في المحاولة الثانية بلا دليل cache. لا تعتبرها إصابة مؤكدة؛ قد يكون السبب إعادة استخدام اتصال أو تغير الحمل. في خدمة تملكها، اربط رؤوس Age وحالة المخزن وسجلاته. لمقارنة الإبطال من نقطتين جغرافيتين، تحتاج نقطتي قياس فعليتين؛ تشغيل نفس الأمر مرتين من جهاز واحد لا يثبت انتشار التغيير عالميًا.
