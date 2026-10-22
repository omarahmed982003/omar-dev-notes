# المرحلة 20 — System Design والمعمارية

الإصدار: 1.1 — 2026-10-21. المستوى: Backend متقدم. المتطلبات: بوابة 19، ومشروع عامل من 10–18 نقدر نقيسه ونغيره. اختبار الدخول: شرح source of truth و API/event contract ونتيجة load/failure test واحدة فعلية.

هدفنا هنا دمج اللي اتعلمناه واتخاذ قرار معماري، مش إعادة شرح TCP و Redis و CAP مرة ثانية. [System Design Master](../SYSTEM_DESIGN_MASTER_PROMPT.md) مرجع تفصيلي، لا يُشترط إكماله كله ولا نسخ درجاته. كل checkpoints التالية أساسية محليًا؛ multi-region و microservice extraction الفعلي امتداد اختياري إذا احتاجه المشروع.

### 20.1 — المتطلبات والأرقام قبل الرسم

#### 20.1.a — Scope و Contracts و Business Invariants

- المتطلب والهدف: مشروع قائم؛ يحول الطالب طلبًا غامضًا لمستخدمين و critical flows ومتطلبات وظيفية وغير وظيفية وحدود واضحة.
- الشرح: المشكلة ← actors/use cases ← what is out of scope ← latency/availability/durability/security/freshness ← data/API/event contracts و source of truth.
- المختبر والنتيجة المتوقعة: صفحة متطلبات لنظام Orders أو SaaS مع مثال request/event وحالة فشل؛ كل شرط رئيسي له طريقة تحقق.
- الفشل ودليل النجاح: متطلبان متعارضان زي استجابة فورية وخدمة خارجية بطيئة؛ يسأل الطالب ويعلن trade-off بدل رقم أو حل مفروض بلا دليل.

#### 20.1.b — Estimation وأبسط تصميم يعمل

- المتطلب والهدف:20.1.a ومقاييس 18؛ يحسب average/peak RPS و storage/bandwidth و queue backlog و memory بافتراضات ووحدات.
- الشرح: حجم workload ← read/write ratio و concurrency ← p95/p99 و headroom ← component واحد لكل حاجة فعلية؛ ناقش Little's Law ضمن شروطه لا كحسبة سحرية.
- المختبر والنتيجة المتوقعة: جدول تقدير وحساب قابل للمراجعة، ثم رسم بسيط client/app/DB وأي queue/storage لهما سبب، وربط الأرقام بـ baseline مقاسة.
- الفشل ودليل النجاح: خلط MB و Mb أو average و peak؛ يكشفه الطالب باختبار معقولية ويحدث الحساب والرسم، ويصرح بافتراض لم يقسه بعد.

### 20.2 — Scaling و Data Placement بالدليل

#### 20.2.a — Access Patterns و Bottleneck

- المتطلب والهدف:20.1 و 14–16؛ يحدد bottleneck فعلية ويقارن index/query fix و cache و replica/shard بدل إضافة منتج مشهور.
- الشرح: access pattern ← baseline/trace ← read/write trade-offs و consistency ← invalidation/hot keys/hot partitions ← أبسط تغيير قابل للقياس.
- المختبر والنتيجة المتوقعة: endpoint بطيء في المشروع؛ فرضية وتحسين واحد مع before/after workload ثابت و assertions correctness.
- الفشل ودليل النجاح: cache تخفي query سيئة أو قراءة replica قديمة؛ يبين الطالب تكلفة الحل وحدوده ويختار سياسة freshness معلنة أو يرجع التغيير.

#### 20.2.b — Failure و Security و Cost في القرار نفسه

- المتطلب والهدف:20.2.a و 17–19؛ يدافع الطالب عن قرار scaling عبر mechanism → decision → failure → scale، مع عزل tenant و resource budgets.
- الشرح: failure domain ← trust boundary/least privilege/PII ← noisy neighbor و quota ← failover/restore ← cost per order/tenant و engineering burden.
- المختبر والنتيجة المتوقعة: tenant عالي الحمل ومزود بطيء؛ decision table تقارن بديلين وتوضح SLO وتأثير failure وتكلفة كل منهما بافتراضات.
- الفشل ودليل النجاح: حل يسرّب بيانات tenant أو يسقط آخرين؛ يمنع النجاح حتى إصلاح العزل واختباره. الدليل isolation tests وقياس، مش رسم مقنع فقط.

### 20.3 — Boundaries و Modular Monolith

#### 20.3.a — Module لها مسؤولية واضحة

- المتطلب والهدف: OOP و Laravel و 20.1؛ يميز domain boundary من folder أو table ويحدد dependency direction و ownership.
- الشرح: use case وقواعده ← cohesion/coupling ← interface/ports/adapters عند الحاجة ← modular monolith؛ لا repository أو service لكل سطر بلا فائدة.
- المختبر والنتيجة المتوقعة: فصل provider adapter عن order use case مع contract واختبار؛ يمكن استبدال المزود الوهمي دون تغيير قواعد الحجز.
- الفشل ودليل النجاح: module تقرأ أو تعدل جداول أخرى بلا عقد؛ يكشف الطالب coupling ويضع boundary ويثبت behavior tests بعد refactoring.

#### 20.3.b — DDD و Bounded Context عند وجود مشكلة

- المتطلب والهدف:20.3.a؛ يستخدم language/context/entities/value objects/invariants لتفسير المنتج، ولا يحول DDD لمجرد أسماء classes.
- الشرح: معنى «Order» بين sales/fulfillment ← bounded context/context map ← integration contract و anti-corruption boundary؛ event sourcing و CQRS extensions اختيارية لا حلول افتراضية.
- المختبر والنتيجة المتوقعة: context map صغيرة وتغيير معنى حقل بين مزودين؛ translation واضحة تحمي domain model مع اختبارات.
- الفشل ودليل النجاح: shared model يربط معاني متعارضة؛ يقدم الطالب counterexample ويشرح حدود النموذج وسبب إبقاء بعض الأجزاء بسيطة بلا DDD كامل.

### 20.4 — Evolution و ADRs

#### 20.4.a — Build versus Buy وخطة Migration

- المتطلب والهدف:20.3 و 18.2؛ يقارن شراء خدمة وبناءها، ويخطط extraction/strangler أو تغيير تخزين من غير flag day.
- الشرح: requirement/team/cost ← compatibility و data ownership ← expand/backfill/switch/contract ← rollback boundaries و exit strategy؛ انفصال service فعلي اختياري.
- المختبر والنتيجة المتوقعة: خطة migration لجزء صغير مع milestones واختبار قديم/جديد، وإمتى نوقف وإمتى نرجع، وتعريف نقطة صعوبة العودة.
- الفشل ودليل النجاح: backfill جزئية أو وجود writes متزامنة؛ يقترح الطالب reconciliation ويحمي correctness قبل زيادة الحمل.

#### 20.4.b — Diagrams و Decision Records تعيش مع الكود

- المتطلب والهدف:20.4.a؛ يكتب ADR بمشكلة وبدائل وقرار وعواقب وشرط مراجعة، ويختار أقل رسم يساعد على الفهم.
- الشرح: C4 context/container للحدود ← sequence لرحلة وفشل ← deployment للموارد؛ diagram يوضح قرارًا، مش معرض أدوات.
- المختبر والنتيجة المتوقعة: ADR واحدة وثلاثة views صغيرة أو المناسب منها، مرتبطة بـ revision و test/measurement؛ اللي ممكن نثبته مختلف عن assumption.
- الفشل ودليل النجاح: رسم يخالف التنفيذ؛ يتتبعه الطالب في الكود ويصحح التوثيق أو التنفيذ، ويثبت الرابط بدليل.

### 20.5 — Design Review وتغيير الافتراضات

#### 20.5.a — حمل ×10 أو Component غابت

- المتطلب والهدف:20.1–20.4؛ يعيد تقييم التصميم لما يتغير متطلب أو حمل، مش يكبّر كل المكونات تلقائيًا.
- الشرح: workload جديد ← failure/saturation model ← bottleneck التالية ← بدائل وتكلفة ومخاطر ← تجربة محدودة.
- المختبر والنتيجة المتوقعة: المقيّم يغير شرطًا أو يسقط عقدة تجريبية؛ الطالب يحدث الأرقام و ADRs، وينفذ تعديلًا مبررًا أو يثبت كفاية الحالي بالقياس.
- الفشل ودليل النجاح: حل ينقذ latency ويكسر invariant؛ يرفضه الطالب ويعدل trade-off، مع نتائج قابلة للتكرار وتوضيح إن الموارد ما سمحتش بتمثيل ×10 فعليًا لو ده اللي حصل.

#### 20.5.b — وثيقة التصميم والدفاع الهندسي

- المتطلب والهدف:20.5.a؛ يقدم وثيقة تصميم للمشروع القائم، مع بديل أبسط وسبب قبوله أو رفضه، ودفاع مستقل.
- الشرح: requirements → estimates → contracts → simple design → bottlenecks → failures/security/cost → evolution؛ مش إعادة امتحان الموضوعات الأصلية المجتازة.
- المختبر والنتيجة المتوقعة: review من المقيّم مع سؤال جديد وتتبع flow فعلي؛ كل component له سبب ودليل واستراتيجية فشل.
- الفشل ودليل النجاح: إزالة مكون غير ضروري أو كشف افتراض غير موثق؛ الطالب يبسط أو يصلح التصميم بلا ادعاء إن الرسم وحده Proof. البوابة: وثيقة +implementation/measurement +دفاع وفق COMMON_RULES.

## خريطة المراجع وحدود الملكية

| المحلي | العنوان الدقيق في System Design Master | دوره |
|---|---|---|
|20.1| `Module 0 — طريقة التفكير في System Design` و`Module 1 — Estimation وCapacity Planning` | تعميق المتطلبات والأرقام |
|20.2| Modules3–7، و`Module 14 — Security وMulti-tenancy فيالتصميم` و`Module 16 — Cost وArchitecture Economics` | مقارنة تصاميم وتكلفة؛ أساسها التقني اتدرس قبل كده |
|20.3–20.4| `Module 15 — Deployment وEvolution` | حدود وتطور؛ DDD التفصيلي امتداد حسب المشروع |
|20.5| `منهج حل أي System Design Interview` و`Definition of Done` تحت Capstone | شكل review لا اشتراط كل case studies القديمة |

الـ case studies القديمة (URL shortener/rate limiter/notifications/chat/analytics/multi-region/Wallet) محفوظة كاختيارات تعمق؛ مش لازم بناء العشرة لإغلاق 20. موضوعات consistency/saga/messaging/observability تتراجع من أدلة 17–19؛ المحلي يقيم قرار دمجها في المنتج مش درجة موضوع اتنسخ مرة ثانية.

## تشغيل جلسة هذه الجزئية

- اقرأ [الفهرس](README.md) و[قواعد التدريس والتقييم](COMMON_RULES.md) كاملين، ثم هذا الملف و[ملف التقدم](20-system-design-architecture_PROGRESS.md) كاملين قبل الشرح.
- هذا الملف منهج الجزئية، وليس الدرس المنشور أو دليل اجتيازها. اشرح checkpoint واحدة على أجزاء، وسؤالًا واحدًا كل مرة، بالعامية المصرية و PHP افتراضيًا إلا في موضوع لغة أخرى.
- ملف التقدم المجاور يملك الموضع والنتائج الخاصة بهذه الجزئية. الفهرس وملف التوجيه العام لا يكرران الدرجات.
- المسارات القديمة مراجع للتعمق، لا يُفرض إكمالها لإغلاق البوابة المحلية. لو اختار الطالب دراسة مسار قديم مستقلًا اقرأ Master و Progress الخاصين به، واحفظ درجاته هناك دون نسخها هنا.
- قواعد المنهج المشتركة وخرائط ملاك الموضوعات في COMMON_RULES.md؛ أسماء ملفات المسارات القديمة المذكورة أعلاه تُحل من study الأب، لا من هذا المجلد.

## إنهاء الجلسة

حدّث تقدم الويب المحلي وفق دليله فقط. لا تعدّل تقدم مسار قديم إلا إذا اختار الطالب دراسة ذلك المسار مستقلًا واتُّبعت قواعده؛ الاستعانة بمرجع لا تمنح نجاحًا فيه. حدّث مؤشر العودة عند تغيير الجزئية، ولا تبدأ التالية تلقائيًا أو تسجل Passed بسبب إنشاء الملفات. لا نشر أو commit أو push تلقائي.
