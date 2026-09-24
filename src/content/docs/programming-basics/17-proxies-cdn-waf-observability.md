---
title: 16. Proxy وCDN وWAF والمراقبة
description: الوسطاء بين العميل والتطبيق، التخزين عند الحافة، الحماية، وتتبع بطء الطلب وأخطائه.
---

## Forward Proxy وReverse Proxy

يعمل Forward Proxy نيابة عن العميل وقد يطبق سياسة خروج أو إخفاء أو Cache. يعمل Reverse Proxy أمام الخوادم، فيستقبل الطلبات باسم التطبيق ثم يختار Backend مناسبًا. يستطيع إنهاء TLS وضغط الاستجابة وتحديد Limits وإضافة Headers.

يجب ضبط قائمة Proxies الموثوقة قبل الاعتماد على `X-Forwarded-For` أو `Forwarded`؛ يستطيع العميل تزوير Header إذا وصل مباشرة إلى التطبيق.

## CDN

توزع CDN نقاط حضور قريبة من المستخدم وتخزن الموارد وفق Cache Keys وسياسات الصلاحية. يقل زمن الوصول ويخف الضغط عن Origin. لكن Cache غير صحيح قد يعرض بيانات مستخدم لمستخدم آخر، لذلك يجب فهم `Cache-Control` و`Vary` والكوكيز قبل تخزين استجابة شخصية.

## WAF وRate Limiting

يفحص WAF أنماط الطلبات ويطبق قواعد ضد هجمات معروفة، لكنه لا يعوض Validation وصلاحيات التطبيق. يحد Rate Limiting عدد الطلبات حسب IP أو حساب أو مفتاح API أو مورد. يجب تحديد نافذة القياس ورسالة `429` وسياسة Retry.

## Logs وMetrics وTracing

يسجل Log حدثًا بتفاصيله. تقيس Metrics قيمًا مجمعة مثل معدل الطلبات والأخطاء ومدة الاستجابة. يربط Distributed Trace خطوات الطلب بين الخدمات عبر Trace ID وSpans.

استخدم Correlation ID في السجلات والاستجابة لتتبع طلب واحد. قسم زمن الطلب إلى DNS وConnection وTLS وTTFB وتنزيل المحتوى، ثم راقب زمن قاعدة البيانات والخدمات الخارجية داخل الخادم. لا يكفي القول «الموقع بطيء» من غير تحديد المرحلة.

## تأكد من فهمك

<div class="lesson-quiz" role="list"><section class="quiz-card" role="listitem"><div class="quiz-question-row"><span class="quiz-number">01</span><p>لماذا لا يكفي WAF لحماية التطبيق؟</p></div><details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة:</strong> يرشح أنماطًا عند الحافة لكنه لا يعرف كل قواعد البيانات والصلاحيات داخل التطبيق.</div></details></section><section class="quiz-card" role="listitem"><div class="quiz-question-row"><span class="quiz-number">02</span><p>ما الفرق بين Log وMetric وTrace؟</p></div><details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة:</strong> Log حدث تفصيلي، Metric قياس مجمع، وTrace مسار طلب عبر المكونات.</div></details></section></div>
