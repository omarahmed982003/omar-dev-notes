---
title: 17. CDN وWAF والمراقبة عند الحافة
description: التخزين المؤقت قرب المستخدم، حماية الحافة، Rate Limiting، وربط Logs وMetrics وTraces لتشخيص الطلب.
sidebar:
  order: 17
---

## CDN وOrigin وPoint of Presence

توزع **CDN** نقاط حضور قريبة من المستخدمين. تستقبل Edge/PoP الطلب وتعيد نسخة مخزنة إن كان Cache Key صالحًا، وإلا تطلب المحتوى من **Origin** ثم قد تحفظه. النتيجة زمن أقل وحمل أقل على الخادم الأصلي.

يتكوّن Cache Key عادة من Host وPath وQuery محددة، وقد يتأثر بـ`Vary`. إدخال كل Cookie في المفتاح يخفض نسبة Cache Hits، بينما تجاهل Cookie أو Authorization في محتوى شخصي قد يسرّب استجابة مستخدم لآخر.

سياسات مهمة:

- `Cache-Control: public` للمحتوى القابل للمشاركة، و`private` للمحتوى الخاص بالمتصفح.
- `max-age` لعمر نسخة المتصفح و`s-maxage` لعمر النسخة المشتركة.
- أسماء ملفات تحمل Hash للأصول الثابتة كي تستخدم عمرًا طويلًا.
- Purge/Invalidation عند الحاجة، مع فهم أن الانتشار قد لا يكون لحظيًا.
- حماية Origin بحيث لا يستطيع مهاجم تجاوز طبقة الحافة بسهولة.

## WAF ليس بديلًا لأمان التطبيق

يفحص **Web Application Firewall** خصائص الطلب ويطبق Managed Rules أو قواعد مخصصة ضد أنماط معروفة. يستطيع حظر أو Challenge أو Log، لكنه لا يعرف قواعد المجال كاملة: قد يكون طلب تعديل فاتورة صالح الصياغة لكن غير مسموح لهذا المستخدم. لذلك تظل Validation والمصادقة والصلاحيات وParameterized Queries داخل التطبيق.

اختبر القواعد في وضع مراقبة قبل الحظر إن أمكن؛ القاعدة الواسعة قد تنتج False Positives وتوقف عملاء حقيقيين. وثّق الاستثناءات بمدة ومالك وسبب بدل تعطيل الحماية دائمًا.

## Rate Limiting وإدارة الاندفاع

يمكن حساب الحد حسب IP أو User ID أو API Key أو Tenant أو Route. من النماذج Fixed Window وSliding Window وToken Bucket. يسمح Token Bucket باندفاع قصير حتى سعة الدلو ثم يحد المعدل المستمر.

أعد `429 Too Many Requests`، وأرسل `Retry-After` عندما تستطيع إعطاء قيمة صحيحة. لا تعتمد على IP وحده في كل الحالات؛ قد يشترك آلاف المستخدمين خلف NAT، وقد يبدل المهاجم عناوينه.

فرّق بين Rate Limit لمنع الإساءة، وConcurrency Limit لمنع تشبع Workers، وQuota لاستهلاك خطة خلال يوم أو شهر. عند الضغط الشديد استخدم Backpressure أو Load Shedding بدل قبول عمل لن يكتمل.

## Logs وMetrics وTraces

- **Log:** حدث تفصيلي مثل فشل تسجيل دخول، مع وقت ومستوى وحقول منظمة.
- **Metric:** قياس مجمع مثل معدل الطلبات وError Rate وLatency Percentiles وتشبع الاتصالات.
- **Trace:** رحلة طلب عبر Spans في CDN وGateway والتطبيق وقاعدة البيانات.

مرر Trace/Correlation ID ولا تسجل كلمات مرور أو Tokens أو بيانات شخصية بلا ضرورة. قس `p50` و`p95` و`p99`؛ المتوسط وحده يخفي بطء نسبة صغيرة من الطلبات. اربط التنبيه بعرض مستخدم متأثر، لا بكل ارتفاع لحظي عديم الأثر.

```text
Client timing: DNS → Connect → TLS → TTFB → Download
Server trace:  Edge → Gateway → App → DB → External API
```

إذا ارتفع TTFB بينما زمن التطبيق طبيعي، افحص Queueing والحافة والشبكة. إذا كان Span قاعدة البيانات بطيئًا، انتقل إلى الاستعلام والفهرس والاتصالات بدل اتهام المتصفح.

## تأكد من فهمك

<div class="lesson-quiz" role="list">
<section class="quiz-card" role="listitem"><div class="quiz-question-row"><span class="quiz-number">01</span><p>كيف قد يؤدي Cache Key خاطئ إلى تسريب بيانات؟</p></div><details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة:</strong> إذا تجاهل المفتاح الهوية أو Header يغير الاستجابة، قد تعيد CDN نسخة مستخدم إلى مستخدم آخر.</div></details></section>
<section class="quiz-card" role="listitem"><div class="quiz-question-row"><span class="quiz-number">02</span><p>لماذا لا يكفي WAF لحماية Endpoint لتعديل فاتورة؟</p></div><details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة:</strong> يستطيع كشف أنماط ضارة، لكنه لا يعرف وحده ملكية الفاتورة وصلاحية المستخدم وقواعد المجال.</div></details></section>
<section class="quiz-card" role="listitem"><div class="quiz-question-row"><span class="quiz-number">03</span><p>ما الفرق بين Rate Limit وConcurrency Limit وQuota؟</p></div><details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة:</strong> الأول يحد معدل الوصول، والثاني عدد الأعمال المتزامنة، والثالث إجمالي الاستهلاك خلال فترة.</div></details></section>
<section class="quiz-card" role="listitem"><div class="quiz-question-row"><span class="quiz-number">04</span><p>لماذا نحتاج Log وMetric وTrace معًا؟</p></div><details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة:</strong> Metric يكشف الاتجاه، وTrace يحدد المرحلة البطيئة أو الفاشلة، وLog يقدم تفاصيل الحدث اللازمة لفهم السبب.</div></details></section>
</div>
