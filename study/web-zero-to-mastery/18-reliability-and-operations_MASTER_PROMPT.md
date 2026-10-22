# المرحلة 18 — التشغيل والاعتمادية والملاحظة

الإصدار: 1.1 — 2026-10-21. دي مرحلة تشغيل متقدم، مش شرط لأول deploy. المتطلبات: بوابة 17 وأساس Linux/release/restore من 13. التحضير الخفيف للحاويات في 16 لا يُحسب اجتيازًا لهذه المرحلة.

الموضوعات الأساسية لبوابة هذه المرحلة محددة أدناه. حساب سحابي مدفوع، Kubernetes، Terraform، وتعدد المناطق extensions اختيارية، لا متطلبات؛ المختبر المحلي كفاية. لا ننشئ موارد أو تنبيهات أو حسابات خارجية دون إذن.

## الوحدة الأولى — التطبيق كـ Artifact قابل للتشغيل

### 18.1 — Docker و Compose بلا سحر

#### 18.1.a — بناء Image وفهم دورة حياتها

- المتطلب والهدف: Linux/process و dependency lockfiles؛ يفرق الطالب Dockerfile/build/image/container/registry، ويفسر build-time مقابل runtime.
- الشرح: مشكلة «شغال عندي» ← image layers و cache ← multi-stage عند فائدته ← versions/digests و build context؛ لا ملفات تطوير أو secrets ضمن image بلا حاجة.
- المختبر والنتيجة المتوقعة: بناء image لتطبيق صغير ثم تشغيله مرتين وإعادة بنائه من revision و lockfile معلنين؛ نفس السلوك، لا ادعاء binary reproducibility بلا إثبات.
- الفشل ودليل النجاح: ملف مطلوب خارج build context أو قيمة config مخبوزة بالخطأ؛ يكتشف الطالب السبب ويثبت runtime config بلا تسريب، ويفحص تاريخ image ومحتواها بدون عرض أسرار.

#### 18.1.b — Services و Persistence و Health

- المتطلب والهدف: 18.1.a و 17؛ يفصل app/worker/DB في Compose، ويعرف network/port/volume و resource limits ومسؤولية المشرف عن restart.
- الشرح: container ليس VM ← user غير root حيث يناسب ← least privilege و writable paths ← health/readiness مقابل مجرد process حي ← signal و graceful shutdown.
- المختبر والنتيجة المتوقعة: web و worker من image واحدة بأوامر مختلفة، DB ب volume تجريبية، أسرار runtime بآلية مناسبة بلا commit؛ إعادة إنشاء app لا تفقد records.
- الفشل ودليل النجاح: اقطع DB ثم أعدها، وأعد إنشاء container؛ لا يكون DB port عامًا بلا حاجة، وتكشف health السياسة الحقيقية. الدليل recovery و permissions وأثر volume موثق؛ لا حذف volume عشوائي.

### 18.2 — Release آمن و Rollback له حدود

#### 18.2.a — Pipeline و Artifact واحد

- المتطلب والهدف: 18.1 واختبارات 13؛ يبني pipeline يفصل check/build/release ويعرف revision الجاري تشغيله.
- الشرح: lint/static analysis/tests ← build assets/dependencies ← immutable artifact ← إعداد runtime ← controlled deployment؛ خطوة النشر الخارجية تحتاج إذنًا صريحًا.
- المختبر والنتيجة المتوقعة: pipeline محلي أو محاكاة CI تشغّل checks وتنتج artifact معرفًا؛ لا يصل release معروف الفشل للمرحلة التالية.
- الفشل ودليل النجاح: failing test ثم artifact قديم؛ يثبت الطالب gate و provenance ويربط version بال logs، مش يكتفي بعلامة خضراء.

#### 18.2.b — Backward Compatibility و Schema Changes

- المتطلب والهدف: 18.2.a و migrations؛ يميز rollback للكود من استرجاع بيانات، ويخطط expand/backfill/contract.
- الشرح: نسختان مؤقتًا ← rolling و blue-green و canary عند الحاجة ← health/drain و worker restart ← feature flags؛ نختار استراتيجية واحدة للمختبر ونقارن الباقي.
- المختبر والنتيجة المتوقعة: إضافة حقل واختبار نسخة قديمة وجديدة، ثم محاكاة فشل release؛ ترجع نسخة الكود بسلام من غير افتراض إلغاء writes حصلت.
- الفشل ودليل النجاح: rename لحقل غير متوافق؛ الاختبار يلتقطه قبل النشر. الطالب ينفذ بديلًا متدرجًا ويشرح إمتى الرجوع يبقى صعب، ومسار الاستعادة.

## الوحدة الثانية — موارد Cloud وحدود الأمان والتكلفة

### 18.3 — Cloud و IAM وميزانية واضحة

#### 18.3.a — خريطة موارد و Trust Boundaries

- المتطلب والهدف: 18.1 و network/security؛ يرسم compute/network/storage/DB و public/private boundaries، ويقارن managed مقابل self-hosted حسب الحاجة.
- الشرح: identity/role/policy ← least privilege وفصل البيئات ← secret management و rotation ← ingress/egress و storage access؛ لا root credential للتطبيق.
- المختبر والنتيجة المتوقعة: مخطط موارد وسياسات محلية أو محاكاة provider، مع محاولة مسموحة وأخرى مرفوضة لكل role؛ لا يتطلب إنشاء حساب مدفوع.
- الفشل ودليل النجاح: public bucket أو صلاحية أوسع من المطلوب في مختبر فقط؛ الطالب يرصدها ويقللها ويثبت إن التطبيق ما زال بينفذ العمل المأذون.

#### 18.3.b — Cost Model ودورة حياة البيئة

- المتطلب والهدف: 18.3.a؛ يقدر compute/storage/egress/backups/logging ويعرف إن cost alert مش سقف صرف إلزامي.
- الشرح: workload معلن ← مقارنة managed/self-hosted وتكلفة تشغيل الفريق ← budget/alert/cleanup plan ← configuration drift؛ IaC امتداد اختياري لإدارة إعدادات البيئة، مش إجبار على منتج.
- المختبر والنتيجة المتوقعة: جدول تكلفة بافتراضات وحدود، وخطوات إنشاء بيئة تجريبية وإيقافها محليًا؛ لو أُذن باستخدام cloud نراجع التسعير وقتها بلا وعد بالمجانية.
- الفشل ودليل النجاح: نمو storage/logs غير متوقع؛ يراجع التقدير ويقترح retention وسقف موارد وإجراء alert، من غير إسقاط بيانات لازمة لـ restore/audit.

## الوحدة الثالثة — الملاحظة ثم الاعتمادية

### 18.4 — Logs و Metrics و Traces

#### 18.4.a — إشارة مفيدة بلا بيانات حساسة

- المتطلب والهدف: 17.7؛ يربط request/job/provider call بـ correlation/trace context ويميز application logs من audit.
- الشرح: سؤال debugging ← structured logs بحقول محددة ← RED/USE و latency percentiles ← trace عبر حدود الخدمات؛ OpenTelemetry طريقة instrumentation عند توافق نسخة المختبر.
- المختبر والنتيجة المتوقعة: تتبع رحلة order واحدة عبر API و worker ومزود وهمي، مع metric للفشل وزمن الانتظار؛ لا tokens أو PII غير ضرورية في الخرج.
- الفشل ودليل النجاح: فقد context بين API وال job؛ يصلحه الطالب ويحدد المكوّن البطيء من دليل مش حدس، مع اختبار redaction.

#### 18.4.b — تكلفة Telemetry وحدودها

- المتطلب والهدف: 18.4.a؛ يميز labels محدودة القيم من high-cardinality ويشرح sampling/retention وحدود الاستنتاج.
- الشرح: metric name/labels ← زيادة عدد القيم بسبب user ID ← logs/traces للتفاصيل ← sampling bias والحمل؛ dashboard مش بديل alert.
- المختبر والنتيجة المتوقعة: قارن labels منضبطة بـ IDs فريدة في dataset صغيرة؛ يطلع الطالب بتصميم metric ومسار بحث عن request من غير label لكل مستخدم.
- الفشل ودليل النجاح: error اختفى بسبب sampling أو metric average؛ يستعين بإشارة مستقلة ويكتب إيه اللي ما نقدرش نثبته من البيانات المتاحة.

### 18.5 — SLO و Incident Response

#### 18.5.a — قياس ما يشعر به المستخدم

- المتطلب والهدف: 18.4؛ يعرف SLI/SLO/error budget ويحدد نطاقًا ونافذة قياس وبسطًا ومقامًا قابلين للتحقق.
- الشرح: critical flow ← good/total events و latency threshold ← objective ← budget وبناء alert على symptom مش ارتفاع CPU وحده.
- المختبر والنتيجة المتوقعة: requests صناعية متفق عليها؛ حساب availability/latency SLI ومقارنتهما بسجل خام، ثم alert له إجراء واضح.
- الفشل ودليل النجاح: fallback يرجع 200 مع فشل العمل؛ يعدل الطالب SLI ليكتشف الفشل الحقيقي، مش مجرد لوحة أرقام شكلها مطمئن.

#### 18.5.b — تشخيص واحتواء وتعلّم

- المتطلب والهدف: 18.5.a؛ يميز mitigation من root cause، ويستخدم runbook ويحفظ timeline ويسجل postmortem بلا لوم.
- الشرح: detect/triage ← scope/impact ← containment/communication ← recovery validation ← متابعة بمالك ومعيار تحقق، بلا مواعيد وهمية.
- المختبر والنتيجة المتوقعة: provider بطيء يكدس jobs؛ يشخصه الطالب من telemetry ويقلل الأثر، ويقدر شخص آخر يفهم اللي حصل من runbook.
- الفشل ودليل النجاح: الإجراء الأول ما نفعش؛ لا يمحو logs ولا يرفع الحدود بلا علة. الدليل timeline و rollback للإجراء ومتابعة قابلة للاختبار.

### 18.6 — Backup و Restore و Disaster Drill

#### 18.6.a — ماذا نحفظ وكيف نثبت أنه صالح؟

- المتطلب والهدف: backup من 13 و data engineering؛ يميز backup من replication ويحدد DB/uploads/config/keys و metadata المطلوبة، دون نسخ secrets لمكان غير محمي.
- الشرح: source of truth ← snapshot/logs/PITR حسب المختبر ← retention/encryption/access ← restore لبيئة معزولة ← integrity checks و business invariants.
- المختبر والنتيجة المتوقعة: backup ثم restore لتجربة Orders؛ مقارنة عدد وسلامة records/relations والملفات واختبار عملي أساسي، لأن وجود file مش إثبات استعادة.
- الفشل ودليل النجاح: backup ناقص أو مفتاح غير متاح؛ يكتشف الطالب الفشل ويصلح الخطة بأثر قابل للتحقق، ولا يلمس production.

#### 18.6.b — RPO و RTO مقاسان

- المتطلب والهدف: 18.6.a؛ يفرق objective من observed result ويحسب فقد بيانات وزمن عودة مقاسين.
- الشرح: اختيار نقطة العطل ← وقف writes بسياسة واضحة ← restore/replay ← فحص correctness ← استئناف traffic؛ وضح unknown outcomes للعمليات الجارية.
- المختبر والنتيجة المتوقعة: فقد بيئة تجريبية قابلة لإعادة الإنشاء؛ runbook يعيد الخدمة مع سجل أوقات وآخر write استعيدت.
- الفشل ودليل النجاح: نسخة فاسدة تمنع الاستعادة الأولى؛ يستخدم الطالب بديلًا ويعلن RPO/RTO الفعليين وإيه البيانات اللي ما رجعتش بدل إخفائها.

### 18.7 — اختبارات Reliability وتجربة التشغيل

#### 18.7.a — Workload و Fault Injection منضبطان

- المتطلب والهدف: 18.4–18.6؛ يختار unit/fake/contract/integration/concurrency/load حسب السؤال، ولا يساوي fake بتجربة فشل شبكة حقيقي.
- الشرح: فرضية ← workload/rate/duration/dataset وموارد ثابتة ← baseline ← fault محدود ← قياس correctness و latency والتعافي؛ لا اختبار على نظام غير مأذون.
- المختبر والنتيجة المتوقعة: duplicate order وحمل محدود و DB latency/worker crash؛ metrics والـ invariants تصف التدهور والتعافي وحدود التجربة.
- الفشل ودليل النجاح: load generator هو bottleneck؛ يكتشفه الطالب ويصلح التجربة بدل ادعاء سعة النظام، ويربط كل اختبار بـ assertion محدد.

#### 18.7.b — Handoff لشخص آخر

- المتطلب والهدف: 18.7.a؛ يجهز release قابلًا للتكرار مع فشل نشر/worker واستعادة، ومقاييس وتقرير timeline.
- الشرح: README و health checks ← تشغيل بخطوات معلنة ← عطل غير محفوظ ← تشخيص واستعادة ← مراجعة توثيق وتحسين.
- المختبر والنتيجة المتوقعة: شخص آخر أو المقيّم في بيئة نظيفة يشغل النظام وينفذ runbook؛ لو الطالب وحده يسجل حدود التحقق بدل ادعاء review مستقل.
- الفشل ودليل النجاح: خطوة ناقصة في الوثائق؛ تتصحح ثم تتعاد التجربة من البداية. البوابة دليل release و rollback/restore و SLI مقاس وعدم فقد غير معلن، مش عدد أدوات مثبتة.

## حدود المرحلة ومراجعها

كل checkpoint بوابة محلية بتقييم COMMON_RULES وأدلة sublessons. استعن بوثائق [Docker build](https://docs.docker.com/build/building/best-practices/) و[Laravel deployment](https://laravel.com/docs/deployment) حسب النسخة. في [System Design Master](../SYSTEM_DESIGN_MASTER_PROMPT.md)، العناوين الدقيقة `Module 12 — Reliability وResilience` و`Module 13 — Observability وProduction Debugging` و`Module 15 — Deployment وEvolution` و`Module 16 — Cost وArchitecture Economics` مراجع متقدمة، لا شرط إكمال الملف كله ولا سجل درجات موازٍ.

## تشغيل جلسة هذه الجزئية

- اقرأ [الفهرس](README.md) و[قواعد التدريس والتقييم](COMMON_RULES.md) كاملين، ثم هذا الملف و[ملف التقدم](18-reliability-and-operations_PROGRESS.md) كاملين قبل الشرح.
- هذا الملف منهج الجزئية، وليس الدرس المنشور أو دليل اجتيازها. اشرح checkpoint واحدة على أجزاء، وسؤالًا واحدًا كل مرة، بالعامية المصرية و PHP افتراضيًا إلا في موضوع لغة أخرى.
- ملف التقدم المجاور يملك الموضع والنتائج الخاصة بهذه الجزئية. الفهرس وملف التوجيه العام لا يكرران الدرجات.
- المسارات القديمة مراجع للتعمق، لا يُفرض إكمالها لإغلاق البوابة المحلية. لو اختار الطالب دراسة مسار قديم مستقلًا اقرأ Master و Progress الخاصين به، واحفظ درجاته هناك دون نسخها هنا.
- قواعد المنهج المشتركة وخرائط ملاك الموضوعات في COMMON_RULES.md؛ أسماء ملفات المسارات القديمة المذكورة أعلاه تُحل من study الأب، لا من هذا المجلد.

## إنهاء الجلسة

حدّث تقدم الويب المحلي وفق دليله فقط. لا تعدّل تقدم مسار قديم إلا إذا اختار الطالب دراسة ذلك المسار مستقلًا واتُّبعت قواعده؛ الاستعانة بمرجع لا تمنح نجاحًا فيه. حدّث مؤشر العودة عند تغيير الجزئية، ولا تبدأ التالية تلقائيًا أو تسجل Passed بسبب إنشاء الملفات. لا نشر أو commit أو push تلقائي.
