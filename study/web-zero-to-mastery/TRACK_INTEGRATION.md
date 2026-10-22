# ربط منهج الويب بالمناهج المتخصصة

الإصدار 1.1 — 2026-10-21. هذه خريطة مصادر وحدود دراسة، وليست ملف تقدم أو قائمة درجات.

## القرار المعتمد

منهج الويب له دروسه التمهيدية وتقييماته المحلية. الاستعانة بفصل قديم لا تشترط إكمال كل ما سبقه في المسار القديم، لأنها ليست جلسة في ذلك المسار ولا تمنح نجاحًا فيه. لو اختار الطالب المسار القديم صراحة نقرأ Master و Progress كاملين، ونلتزم بموضعه وترتيبه دون قفز. لا تتغير حالته بسبب جسر الويب.

لا يوجد ادعاء أن معرفة جزء من المرجع تغطي نطاق checkpoint الأصلية بالكامل. نحدد الموضوع المحلي ودليل التطبيق هنا، ويظل الامتداد القديم منظمًا ومحفوظًا للعودة.

## المصادر وحدود الاستخدام

| جزئية الويب | مرجع موجود فعلًا | نطاق المصدر للاستعانة | الحد المطلوب محليًا، وما يؤجل |
|---|---|---|---|
| 3.8، ثم تعاون العمل في 13 | [Git Master](../Git_Master_Prompt.md) | 0.2–0.5 ثم 1.1–4.3 للأساس،6.1–7.5 و 8.1–9.6 للتعاون،10.1–10.7 للاسترجاع | حفظ تغيير وفحصه واسترجاع آمن في مختبر، ثم review/conflict. Internals و rebase المتقدم وباقي المنهج امتداد؛ لا تشترط إنهاء 21 مرحلة Git لإنهاء الويب. |
| 8.4 — جسر SQL | [Database Master](../Database_Master_Prompt.md) | 0.2،1.1–1.4،2.1–2.5 و 2.9،3.1–3.3 و 3.5،7.1–7.2 كمرجع أولي للمعاملة | schema صغيرة و CRUD و JOIN و NULL/constraints و commit/rollback تمهيديان. لا Window Functions أو storage/optimizer كشرط هنا. لا Passed لأي رقم من Database بسبب المختبر المحلي. |
| 9 — OOP | [OOP Master](../OOP_Master_Prompt.md) | 1.1–1.6،2.1–2.5،3.1–5.5،6.1 و 6.3–6.4،7.1–9.5،10.1–11.3،13.1–13.4 | objects/contracts/DI وتنظيم واختبار كود التطبيق. كتالوج patterns في 12 و Reflection/Attributes في 14 امتداد متقدم، وليس شرط دخول Laravel. اختيار Pattern يحل مشكلة ملاحظة لا حفظ أسماء. |
| 10 — Laravel | [OOP مع Laravel](../OOP_Master_Prompt.md) | 15.1–15.5 و 16.1–16.6 | نراجع الدمج بعد دراسة local10.4–10.8؛ لا إلزام بمشروع ORM/Jobs قبل تقديمها. الاختبار المحلي لمشروعنا، ولا إكمال أوتوماتيكي لمشروع OOP القديم. |
| 10.5، ثم أداء البيانات في 14 | [Laravel Data Access](../Laravel_SQL_QueryBuilder_Eloquent_Master_Prompt.md) | 0.2،1.1–3.4 ثم 4.1–8.3 كأساس ومراجع،12.1–13.4 للتزامن والأداء بعد تأسيسهما | SQL ثم Builder ثم Eloquent، العلاقات الشائعة و query count. العلاقات المتقدمة وباقي المراحل تدرس حسب احتياج وتوسع التطبيق؛ لا بوابة كورس كامل قبل Runtime. |
| 12 — الأمان المحلي | [Authentication Master](../AUTHENTICATION_AUTHORIZATION_MASTER_PROMPT.md) | Modules0–3 للأساس،4–5 لفهم credentials/tokens،Module13 لآليات Laravel المناسبة | password/session/CSRF/authorization وحماية التطبيق قبل أول نشر. معرفة token لا تفرض JWT في التطبيق. |
| امتداد هوية بعد 12 وتحقق متطلباته | [Authentication Master](../AUTHENTICATION_AUTHORIZATION_MASTER_PROMPT.md) | Modules6–10 للـ OAuth/OIDC/MFA،11 للهوية الموزعة،12 للتشغيل | OAuth/federation موضوعات منظمة عند استعمالها. مختبر 11 الموزع لا يسبق خدمة ثانية أو Redis إذا اعتمد عليه؛ ننتظر 16–18 حسب المختبر. لا نضعه شرطًا للنشر الأول 13. |
| 14 — هندسة البيانات | [Database Master](../Database_Master_Prompt.md) | 4.1–6.8 للـ storage/indexes/plans،7.1–7.9 للتزامن،9.5–9.14 لتغييرات Schema،10.1–10.5 للاستعادة | مختبر execution plan وتزامن و migration قابلة للإثبات. حجم بيانات معلن، لا وعود مليار صف من مثال صغير. |
| امتداد بيانات تخصصي | [Database Master](../Database_Master_Prompt.md) | مراحل 11–14 للتوزيع،15–18 للتحليلات و Warehouse وأعباء البيانات الكبيرة وفق عناوين الملف الفعلية | HA/Sharding/OLAP/ClickHouse/CDC/Lakehouse تبقى متاحة بأماكنها؛ لا تشترط كلها قبل runtime15. نحدد المدى المختار عند بدء امتداد، ولا نعدّ المرحلة 14 هنا إكمالًا للكورس القديم. |
| 16 — Redis | [Redis Master](../Redis_Caching_At_Scale_Master_Prompt.md) | مراحل 0–7 للمفاهيم والمفاتيح والبنى والـ cache والـ atomicity والذاكرة/persistence؛10–11 للتكامل والتشغيل | cache/rate-limit مختبر محلي بعد Docker primer في 16؛ replication/cluster ومشروعات الحجم الضخم في 8–9 و 12–15 امتداد بعد متطلباتها. |
| 3 — تدريب خوارزميات مبتدئ | [Algorithms Master](../Algorithms_Data_Structures_Master_Prompt.md) | 0.2–0.3 و 1.1–1.2،2.1–3.2،8.1 كمصادر مفاهيم | problem formulation و dry run و complexity و lookup/search مناسبة لبرنامج صغير؛ لا يلزم تشخيص Senior أو خوارزميات متقدمة. |
| 19 — خوارزميات التطبيق | [Algorithms Master](../Algorithms_Data_Structures_Master_Prompt.md) | مراحل 4–10 للبنى الأساسية،13–14 لامتدادات الإنتاج،16 للاختبار،17 للمشروعات | مهمة محلية تحدد operations و invariant والكلفة واختبارها. كتالوج المسار كله ليس checkpoint واحدة. DP والمقابلات والـ structures المتقدمة امتدادات معلنة. |
| 19 — مختبر توزيع | [System Design Master](../SYSTEM_DESIGN_MASTER_PROMPT.md) | Modules5–6 و 8–10 | هنا نفهم failure/order/consistency من تجربة صغيرة. في 20 نستعمل النتيجة لتصميم نظام كامل؛ لا نكرر نفس الاختبار أو درجته. |
| 20 — قرارات النظام والمعمارية | [System Design Master](../SYSTEM_DESIGN_MASTER_PROMPT.md) | Modules0–4 للمتطلبات والحجم والأساس،7 و 11–16 لاختيار التواصل والاعتمادية والملاحظة والأمان والنشر والتكلفة | design drill محلي له أرقام وقيود وبديل وفشل. المختبرات المتخصصة القديمة اختيارية؛ لا ننقل score من 19 ونعدّه نجاحًا جديدًا. |
| كل مشروع، ثم 22 | [Portfolio Ideas](../GITHUB_PORTFOLIO_PROJECT_IDEAS.md) | README/diagrams/ADRs/tests/benchmarks/runbooks وقائمة مشروعات Tier1 | توثيق دليل مستقل وحدود معروفة. لا فتح مستودع أو نشره أو إنشاء issues/messages تلقائيًا. |

## ملفات الحقيقة عند اختيار مسار قديم

| المنهج | تقدم المسار المستقل |
|---|---|
| Git | [GIT_PROGRESS.md](../GIT_PROGRESS.md) |
| OOP | [OOP_PROGRESS.md](../OOP_PROGRESS.md) |
| Database | [DATABASE_PROGRESS.md](../DATABASE_PROGRESS.md) |
| Laravel Data Access | [LARAVEL_QUERY_PROGRESS.md](../LARAVEL_QUERY_PROGRESS.md) |
| Algorithms | [ALGORITHMS_DATA_STRUCTURES_PROGRESS.md](../ALGORITHMS_DATA_STRUCTURES_PROGRESS.md) |
| Authentication | [AUTHENTICATION_AUTHORIZATION_PROGRESS.md](../AUTHENTICATION_AUTHORIZATION_PROGRESS.md) |
| Redis | [REDIS_PROGRESS.md](../REDIS_PROGRESS.md) |
| System Design | [SYSTEM_DESIGN_PROGRESS.md](../SYSTEM_DESIGN_PROGRESS.md) |
| Portfolio | [GITHUB_PORTFOLIO_PROGRESS.md](../GITHUB_PORTFOLIO_PROGRESS.md) |

## إجراء تسليم واضح

قبل بدء امتداد متخصص سجّل اسمه و Master/Progress ونقطة الأصل الحالية وسبب التوسع ومكان الرجوع للويب. بعده سجّل رابط الدليل لا نسخة من الدرجة. لا تسجل نجاح المسار الأصلي إلا بتقييمه وشروطه هو. إذا أضيف موضوع جديد للخطة نفحص مالكه أولًا ونحدد هل المطلوب شرح جديد أم تطبيق تكاملي مختلف.
