# المرحلة 19 — الخوارزميات والأنظمة الموزعة بعمق

الإصدار: 1.1 — 2026-10-21. المرحلة متقدمة ومتطلبها بوابة 18 مع أساس حل المشكلات من 3. لو غاب متطلب من 3 نعالجه بدليل، مش نفترض إن كثرة الأدوات عوّضت فهم الخوارزمية.

دي وحدتان واضحتان داخل ملف واحد ثابت الاسم: خوارزميات تطبيقية، ثم أسس الأنظمة الموزعة. كل checkpoints أساسية للبوابة المحلية؛ التعمق البحثي أو إنهاء Algorithms الأصلي كاملًا اختياري. النجاح هنا لا يمرر نقاطًا قديمة تلقائيًا ولا ينسخ درجاتها، وبداية مسار Algorithms القديم تكون من موضعه الأصلي لو اختاره الطالب مستقلًا.

## الوحدة الأولى — اختيار البنية وإثبات صحة الحل

### 19.1 — خوارزميات Backend من المشكلة للدليل

#### 19.1.a — Correctness و Time/Space في PHP

- المتطلب والهدف:3 واختبارات الدوال؛ يحدد الطالب inputs/outputs/constraints، ويكتب brute force ثم invariant ويحسب تكلفة الوقت والذاكرة، بما فيها built-ins والنسخ.
- الشرح: مشكلة lookup/dedup ← array/string/hash map ← linear/binary search ومتطلب الترتيب ← sorting/comparator؛ لا قائمة LeetCode بدل التفكير.
- المختبر والنتيجة المتوقعة: تجميع أحداث حسب business ID؛ حل بسيط وحل محسّن، مع مقارنة النتائج على empty/duplicate/Unicode input وقياس ذاكرة نسبي معلن.
- الفشل ودليل النجاح: comparator خاطئ أو binary search على بيانات غير مرتبة؛ يقدم الطالب counterexample ويصلح العقد والحل ويشرح complexity مستقلاً.

#### 19.1.b — Heap و Tree و Graph حسب العمليات

- المتطلب والهدف:19.1.a؛ يختار heap لـ top-K أو scheduler، ويفسر range/index كشجرة، ويمثل dependency graph بلا اشتراط تنفيذ كل بنية إنتاجيًا من الصفر.
- الشرح: العمليات المطلوبة ← hash مقابل ordered structure ← priority queue ← tree traversal و BFS/DFS/topological order؛ recursion و stack depth عند الحاجة، ثم حدود الذاكرة.
- المختبر والنتيجة المتوقعة: job dependencies فيها دورة وأخرى DAG، مع قائمة أعلى K أزمنة؛ اكتشاف cycle وترتيب صالح للمجموعة السليمة و top-K تطابق oracle بسيطة.
- الفشل ودليل النجاح: missing node أو tie في priority؛ اختبارات تظهر سياسة واضحة لا نتائج عشوائية. يبرر الطالب البنية والتعقيد ويعيد الحل على input جديدة.

### 19.2 — Data Structures وراء المنتجات

#### 19.2.a — Exact مقابل Approximate

- المتطلب والهدف:19.1؛ يميز correctness exact من احتمال خطأ معلن، ويربط hashing/index/heap بتكلفة PHP الفعلية لا Big O وحده.
- الشرح: workload وحجم بيانات ← exact set/top-K ← Bloom filter/cardinality sketch كمفاهيم ← false positives وحدود الافتراض؛ لا approximate قرار مالي يحتاج exactness.
- المختبر والنتيجة المتوقعة: exact dedup baseline ومقارنة تعليمية ببنية احتمالية صغيرة أو بيانات مُعدة؛ يقاس الخطأ والذاكرة مع dataset و seed معلنين.
- الفشل ودليل النجاح: dataset منحاز أو حذف من Bloom filter عادية؛ يوضح الطالب كسر الافتراض ولا يقدم نسبة الخطأ كضمان شامل. الدليل قياس وقرار استخدام محدد.

#### 19.2.b — Placement و Consistent Hashing

- المتطلب والهدف:19.2.a وأساس sharding من 14؛ يفرق key placement من replication/consistency، ويقيس remapping و hot keys.
- الشرح: modulo baseline ← ring/virtual nodes أو rendezvous للمقارنة ← إضافة وإزالة node ← distribution و failure domain؛ الخوارزمية لا تحل failover correctness وحدها.
- المختبر والنتيجة المتوقعة: توزيع keys على nodes ثم إضافة node؛ تقرير التوزيع ونسبة keys المتحركة مقابل baseline، مع hot key منفردة.
- الفشل ودليل النجاح: عقدة شايلة معظم الحمل رغم توازن عدد keys؛ يكتشف الطالب workload skew ويبرر حلًا وحدوده. تنفيذ ring تعليمي، لا ادعاء cluster إنتاجي.

## الوحدة الثانية — ما الذي نستطيع ضمانه تحت الفشل؟

### 19.3 — الوقت والترتيب و Replication

#### 19.3.a — Clock مش مصدر حقيقة مطلق

- المتطلب والهدف:17 و 19.1؛ يميز wall clock من monotonic durations ومن logical ordering، ولا يساوي timestamp بأسبقية سببية مؤكدة.
- الشرح: clocks مختلفة ← skew و drift ← event/processing time ← logical clock كمفهوم ← causal versus concurrent events؛ نرسم timeline قبل المعادلات.
- المختبر والنتيجة المتوقعة: simulator PHP بساعة متحكم فيها ورسائل متأخرة؛ نعرض كيف يضلل wall clock ثم نصيغ ordering contract قابلًا للاختبار.
- الفشل ودليل النجاح: إرجاع الساعة للخلف؛ يختار الطالب clock مناسبة لقياس مدة، ويشرح ما لا تثبته Lamport ordering عن concurrency.

#### 19.3.b — Replicas و Quorum و Consensus

- المتطلب والهدف:19.3.a و replication من 14؛ يفرق replication lag من partition، ويشرح ليه قرار مشترك يحتاج consensus في بعض التصاميم.
- الشرح: نسختان ورسالة مفقودة ← read/write quorum وافتراضاته ← leader election و consensus scope؛ quorum overlap وحده لا يثبت linearizability لكل implementation.
- المختبر والنتيجة المتوقعة: simulator محدود يبيّن read قديمة وتأخر replica وفقد majority؛ النتائج تتقارن بعقد معلن، بلا كتابة consensus إنتاجي.
- الفشل ودليل النجاح: partition مع writes متزامنة؛ الطالب يحدد إمتى نرفض الكتابة وإمتى نقبل التأخر وإيه اللي لسه محتاج حل، مش «تلات nodes خلاص».

### 19.4 — Consistency و Leader Safety

#### 19.4.a — اختيار Consistency حسب العملية

- المتطلب والهدف:19.3؛ يميز strong/eventual/causal و read-your-writes/monotonic reads، ويفهم CAP/PACELC في scenario محدد.
- الشرح: رصيد مقابل عداد مشاهدات ← network partition مع trade-off الدقة/الإتاحة ← latency بدون partition ← أثر الموديل على تجربة المستخدم.
- المختبر والنتيجة المتوقعة: سجل reads/writes محاكى لـ inventory ولـ analytics؛ يحدد الطالب history مقبولة وأخرى بتنقض العقد مع counterexample.
- الفشل ودليل النجاح: استدلال «نختار اتنين من تلاتة دائمًا»؛ يصححه باستخدام تعريفات ونموذج فشل، ويكتب ضمانات كل flow وحدودها.

#### 19.4.b — Failover و Fencing و Split Brain

- المتطلب والهدف:19.4.a؛ يفرق liveness من safety، ويشرح إزاي عامل قديم ممكن يكمل رغم انتهاء lease.
- الشرح: lease/leader ← توقف طويل ← leader جديد ← stale writer ← fencing token وتحقق عند المورد اللي بيحميه؛ locking مش حل سحري.
- المختبر والنتيجة المتوقعة: simulator يبعت write قديمة بعد انتخاب عامل جديد؛ المورد يرفض token الأقدم حسب عقد معلن.
- الفشل ودليل النجاح: تحقق token في العميل فقط؛ يبيّن الطالب الثغرة وينقل التحقق للـ boundary الصحيحة ويختبر history مخالفة.

### 19.5 — Saga و Compensation و Business Invariants

#### 19.5.a — حدود Transaction عبر الخدمات

- المتطلب والهدف:17.4 و 19.4؛ يفرق ACID محلية من distributed transaction، ويشرح 2PC وحدوده كمقارنة مفهومية لا شرط تنفيذ.
- الشرح: inventory+payment+order ← partial failure ← orchestration/choreography ← saga/state machine ← compensation ما بتمحيش واقع خارجي حصل.
- المختبر والنتيجة المتوقعة: مزودان وهميان وسجل حالات؛ حجز ثم رفض دفع ينتهي بحالة تعويض واضحة واختبارات invariants.
- الفشل ودليل النجاح: التعويض نفسه يفشل؛ تبقى pending compensation مع retry/reconciliation، ولا يعلن الطالب رجوعًا ذريًا مش موجود.

#### 19.5.b — مشروع Simulation واختبار الـ History

- المتطلب والهدف:19.5.a؛ يدمج time/order/consistency/retries بمشروع صغير لفقد وتكرار وتأخر رسائل، وبيانات وهمية فقط.
- الشرح: اكتب invariant ← generate history بـ seed ثابت ← inject fault ← replay ← قارن oracle/allowed outcomes ← اشرح حدود النموذج.
- المختبر والنتيجة المتوقعة: duplicate/reorder/partition و crash أثناء compensation؛ لا يتكرر الحجز ولا تختفي unknown outcome بلا audit.
- الفشل ودليل النجاح: history جديدة من المقيّم؛ الطالب يلتقط counterexample ويصلح السياسة والاختبارات، ويشرح ما لا يضمنه النظام قبل ضماناته.

## مراجع المالك القديم وحدود التكرار

الأساس المحلي والتطبيقات هنا لها تقييمها الخاص، والمراجع التالية للتوسعة أو تفسير فجوة لا لإجبار إكمال مسار كامل:

| الموضوع | الملف والعنوان الأصلي الدقيق | الاستخدام هنا |
|---|---|---|
| PHP cost و heap | [Algorithms Master](../Algorithms_Data_Structures_Master_Prompt.md)، `Checkpoint 1.5 — Complexity of PHP Built-ins & Zend Data Structures` و`Checkpoint 5.3 — Priority Queue / Heap` | شرح متطلب 19.1، وليس درجة منسوخة |
| Structures و approximation | نفس الملف، `Checkpoint 14.6 — Probabilistic Data Structures` و`Checkpoint 14.8 — Consistent Hashing` | تعمق 19.2 واختبار workload مختلف |
| امتدادات أخرى | نفس الملف، 14.3 Skip Lists،14.4 LSM Trees،14.5 Inverted Index،14.7 Merkle Trees،14.9 Geospatial Structures،14.12 CRDT Introduction | متقدم اختياري حسب المشروع؛ لا نفقد التغطية ولا نجعلها شرط ويب عام |
| اختبار الصحة | نفس الملف، `Checkpoint 16.2 — Property-Based Testing` و`Checkpoint 16.3 — Differential Testing` | أدوات لـ 19.5.b، لا إعادة امتحان المسار كله |
| Distributed guarantees | [System Design Master](../SYSTEM_DESIGN_MASTER_PROMPT.md)، `Module 8 — Consistency وDistributed Systems Fundamentals` و`Module 9 — Transactions خارج قاعدة بيانات واحدة` | مرجع 19.3–19.5؛20 يطبّق القرارات على منتج، لا يعيد امتحانها |

Sorting/search/trees/graphs و greedy/DP و bits/essential math و advanced patterns موجودة في Algorithms الأصلي؛ ما يلزم المختبر منها أساسي، وبقية التعمق يظل اختياريًا موثقًا لا «ناقصًا» ولا Passed تلقائيًا. بوابة 19: الخمسة checkpoints بأدلتها +19.5.b، وفق COMMON_RULES؛ لا implementation إنتاجي لـ consensus ولا حفظ قوائم مسائل.

## تشغيل جلسة هذه الجزئية

- اقرأ [الفهرس](README.md) و[قواعد التدريس والتقييم](COMMON_RULES.md) كاملين، ثم هذا الملف و[ملف التقدم](19-algorithms-distributed-systems_PROGRESS.md) كاملين قبل الشرح.
- هذا الملف منهج الجزئية، وليس الدرس المنشور أو دليل اجتيازها. اشرح checkpoint واحدة على أجزاء، وسؤالًا واحدًا كل مرة، بالعامية المصرية و PHP افتراضيًا إلا في موضوع لغة أخرى.
- ملف التقدم المجاور يملك الموضع والنتائج الخاصة بهذه الجزئية. الفهرس وملف التوجيه العام لا يكرران الدرجات.
- المسارات القديمة مراجع للتعمق، لا يُفرض إكمالها لإغلاق البوابة المحلية. لو اختار الطالب دراسة مسار قديم مستقلًا اقرأ Master و Progress الخاصين به، واحفظ درجاته هناك دون نسخها هنا.
- قواعد المنهج المشتركة وخرائط ملاك الموضوعات في COMMON_RULES.md؛ أسماء ملفات المسارات القديمة المذكورة أعلاه تُحل من study الأب، لا من هذا المجلد.

## إنهاء الجلسة

حدّث تقدم الويب المحلي وفق دليله فقط. لا تعدّل تقدم مسار قديم إلا إذا اختار الطالب دراسة ذلك المسار مستقلًا واتُّبعت قواعده؛ الاستعانة بمرجع لا تمنح نجاحًا فيه. حدّث مؤشر العودة عند تغيير الجزئية، ولا تبدأ التالية تلقائيًا أو تسجل Passed بسبب إنشاء الملفات. لا نشر أو commit أو push تلقائي.
