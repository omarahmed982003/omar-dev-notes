# منهج الويب — فهرس الأجزاء المستقلة

الإصدار 1.1 — 2026-10-21. كل جزئية لها ملف دراسة MASTER_PROMPT وملف متابعة PROGRESS مستقلان. أرقام الملفات ثابتة حتى لا تضيع روابط العودة؛ جرى إصلاح ترتيب التدريس وتفصيل الوحدات إلى دروس ومختبرات قابلة للتتبع، دون تغيير تقدم قديم أو افتراض دراسة لم تحدث.

## ابدأ من هنا

1. اقرأ [سياق السيشن](../../STUDY_SESSION_CONTEXT.md) ثم [القواعد المشتركة](COMMON_RULES.md) كاملين.
2. لو الطلب «ابدأ منهج الويب»، البداية بالجزئية 0. لو «كمل»، اقرأ [مؤشر العودة](../WEB_ZERO_TO_MASTERY_PROGRESS.md) ثم ملف تقدم الجزئية المشار إليها؛ هو صاحب الحقيقة، لا ذاكرة المحادثة.
3. اقرأ ملف المنهج وملف التقدم المختارين كاملين قبل أي شرح.
4. افحص [خريطة الاعتمادات والبوابات](DEPENDENCIES.md). بوابة تأسيس مسماة يمكن أن تفتح الجزئية التالية مع بقاء عمق داخل الملف غير مكتمل؛ لا نحوله إلى Passed وهمي.
5. اقرأ [خريطة المصادر وحدود التعمق](TRACK_INTEGRATION.md). ملفات الويب تملك جسور المبتدئ وتقييماتها المحلية؛ الاستعانة بمنهج قديم لا تفرض إكماله كله ولا تمنح درجات داخله. اختيار المسار القديم نفسه يعني اتباعه من موضع تقدمه وبترتيبه.

## إزاي نمشي من غير تشتت؟

- 0–3: تشغيل البرنامج و PHP وحل المشكلات، مع إدخال CLI وتنظيم الملفات واختبار مبكر.
- 4–8: أساس الشبكات ثم HTML/CSS/JavaScript وتطبيق Plain PHP/SQL. أقسام الشبكة الأساسية تفتح HTML؛ التعميق يرجع في مواضع التطبيق قبل النشر.
- 9–13: OOP عملي ثم Laravel و APIs وحماية التطبيق والنشر الأول. لا Reflection أو Warehouse أو هوية موزعة كمتطلبات خفية للبداية.
- 14–20: هندسة Production متدرجة، مع وحدات واضحة للبيانات و Runtime و Redis والـ Queues والتشغيل والخوارزميات والتوزيع والمعمارية.
- 21: فرع Full-stack يمكن دخوله بعد 7 و 11، لا يلزم انتظار 20. فرع Backend العميق له متطلبات 14 و 17 و 18. تختار فرعًا واحدًا؛ الآخر خارج حساب البوابة، وليس Passed.
- 22: مشروع الإتقان المتقدم له rubric وأدلة مستقلة؛ مشروعاتك والنشر التجريبي يبدأان قبله بالفعل.

دي خطة دراسة ودليل للمدرّس، مش كتاب شرح مكتوب بالفعل. عند الجلسة نتعامل مع درس واحد ومثال وتجربة ومحاولة الطالب، ونسجل Current sublesson والخطوة غير المكتملة في ملف التقدم.

تفاصيل قرارات التحسين وحدود التحقق موجودة في [سجل التعديل1.1](CHANGELOG.md).

## الملفات

| الجزئية | ملف الدراسة | ملف التقدم |
|---|---|---|
| 0 — البداية وطريقة التعلم | [المنهج](00-getting-started_MASTER_PROMPT.md) | [التقدم](00-getting-started_PROGRESS.md) |
| 1 — الكمبيوتر بالقدر اللي يأسس مبرمج | [المنهج](01-computer-foundations_MASTER_PROMPT.md) | [التقدم](01-computer-foundations_PROGRESS.md) |
| 2 — البرمجة باستخدام PHP | [المنهج](02-php-fundamentals_MASTER_PROMPT.md) | [التقدم](02-php-fundamentals_PROGRESS.md) |
| 3 — حل المشكلات وتنظيم البرنامج | [المنهج](03-problem-solving_MASTER_PROMPT.md) | [التقدم](03-problem-solving_PROGRESS.md) |
| 4 — الإنترنت والشبكات لمطور ويب | [المنهج](04-networks-and-web_MASTER_PROMPT.md) | [التقدم](04-networks-and-web_PROGRESS.md) |
| 5 — HTML وبناء واجهة لها معنى | [المنهج](05-html_MASTER_PROMPT.md) | [التقدم](05-html_PROGRESS.md) |
| 6 — CSS وواجهات متجاوبة | [المنهج](06-css_MASTER_PROMPT.md) | [التقدم](06-css_PROGRESS.md) |
| 7 — JavaScript والمتصفح | [المنهج](07-javascript_MASTER_PROMPT.md) | [التقدم](07-javascript_PROGRESS.md) |
| 8 — PHP للويب وقاعدة البيانات الأولى | [المنهج](08-php-web-and-sql_MASTER_PROMPT.md) | [التقدم](08-php-web-and-sql_PROGRESS.md) |
| 9 — OOP وتصميم الكود | [المنهج](09-oop_MASTER_PROMPT.md) | [التقدم](09-oop_PROGRESS.md) |
| 10 — Laravel من الأساس للمنتج | [المنهج](10-laravel_MASTER_PROMPT.md) | [التقدم](10-laravel_PROGRESS.md) |
| 11 — APIs وربط الواجهة | [المنهج](11-apis_MASTER_PROMPT.md) | [التقدم](11-apis_PROGRESS.md) |
| 12 — الأمان والهوية بعمق | [المنهج](12-security-and-identity_MASTER_PROMPT.md) | [التقدم](12-security-and-identity_PROGRESS.md) |
| 13 — النشر الأول وتشغيل تطبيق حقيقي | [المنهج](13-first-deployment_MASTER_PROMPT.md) | [التقدم](13-first-deployment_PROGRESS.md) |
| 14 — هندسة البيانات والأداء | [المنهج](14-data-engineering_MASTER_PROMPT.md) | [التقدم](14-data-engineering_PROGRESS.md) |
| 15 — PHP Runtime وقياس الأداء | [المنهج](15-php-runtime-performance_MASTER_PROMPT.md) | [التقدم](15-php-runtime-performance_PROGRESS.md) |
| 16 — Cache و Redis | [المنهج](16-redis-and-caching_MASTER_PROMPT.md) | [التقدم](16-redis-and-caching_PROGRESS.md) |
| 17 — Queues والتكاملات الموثوقة | [المنهج](17-queues-and-integrations_MASTER_PROMPT.md) | [التقدم](17-queues-and-integrations_PROGRESS.md) |
| 18 — التشغيل والاعتمادية والملاحظة | [المنهج](18-reliability-and-operations_MASTER_PROMPT.md) | [التقدم](18-reliability-and-operations_PROGRESS.md) |
| 19 — الخوارزميات والأنظمة الموزعة بعمق | [المنهج](19-algorithms-distributed-systems_MASTER_PROMPT.md) | [التقدم](19-algorithms-distributed-systems_PROGRESS.md) |
| 20 — System Design والمعمارية | [المنهج](20-system-design-architecture_MASTER_PROMPT.md) | [التقدم](20-system-design-architecture_PROGRESS.md) |
| 21 — تخصص واجهات أعمق أو تركيز Backend | [المنهج](21-specialization_MASTER_PROMPT.md) | [التقدم](21-specialization_PROGRESS.md) |
| 22 — مشروع الإتقان والتقييم النهائي | [المنهج](22-mastery-capstone_MASTER_PROMPT.md) | [التقدم](22-mastery-capstone_PROGRESS.md) |

## حدود الحالة الحالية

كل الأجزاء Not Started، والفرع الاختياري Not selected. لم تبدأ جلسة دراسة. الملفات القديمة في study محفوظة ولم تُعاد كتابة درجاتها. ملفا WEB_ZERO_TO_MASTERY في study الأب مدخل توجيه ومؤشر عودة فقط. تعديل 1.1 لم يمنح نجاحًا لأي checkpoint أو درس فرعي.

التشخيص 0.1 ينتهي مستقبلًا بحالة Assessment Completed بعد جمع الأدلة وخطة الفجوات، وليس امتحان نجاح 80% لمعارف لم تُدرس. اختيار 21.1 قرار توجيه Completed بلا درجة. بقية التقييمات العملية تحتاج 80% ودليلًا مستقلاً وإصلاح الأخطاء الجوهرية.
