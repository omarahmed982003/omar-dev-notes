# المرحلة 14 — هندسة البيانات والأداء

الإصدار: 1.1 — مراجعة المنهج 2026-10-21. مراجعة تحريرية؛ لم تبدأ الدراسة.

هنشخّص استعلامًا بطيئًا ونمنع حجز مخزون مرتين ونغيّر schema بأمان. الهدف correctness وقياس مبرر، مش جمع أسماء تقنيات قواعد بيانات.

## المتطلبات وحدود المرحلة

نجاح النشر المحلي 13 وأساس SQL/constraints/transactions في 8 و Data Access المحلية 10.5. لا يُشترط إنهاء Database أو Laravel Query أو OOP القديمين بالكامل.

Storage و Indexes و Optimizer و Transactions و Schema Evolution والتعافي أساس متقدم إلزامي. Sharding و Warehouse و Lakehouse و ClickHouse تخصص اختياري بعد قياسات وحاجة واضحة؛ ليس بوابة لمرحلة Runtime 15.

## خطة الدراسة

### 14.1 — رحلة البيانات من Query إلىقرص

- المستوى: أساسي إلزامي.
- المتطلبات: SELECT و JOIN و constraints ومختبر DB.
- الناتج: يربط query بخطوات storage/I/O ويفرق cache عن durability.

#### 14.1.a — المختبر و Storage Internals

ثبت محركًا ونسخة و dataset صناعية معروفة. تتبع connection ثم parse/plan/execute، و pages/rows و heap/clustered storage و buffer pool؛ فرّق RAM و OS cache و disk.

#### 14.1.b — Logs و Flush و Recovery

اشرح WAL/redo و undo و checkpoint و background work بترتيب commit صغير. لا تسوِ بين buffer write و durable commit، ولا تنقل آلية MySQL لمحرك آخر بلا تحقق.

**تطبيق وتقييم 14.1 بعد الأجزاء السابقة:**

- تجربة صغيرة: شغّل query على dataset معلنة وراقب خطة و I/O ومقاييس cache المتاحة.
- فشل متعمّد: تجربة restart على DB قابلة للتخلص تكشف الفرق بين pending operation و committed record.
- محاولة مستقلة: ارسم رحلة تعديل سجل وبيّن ما يجب حفظه للتعافي.
- دليل النجاح: نسخ وحجم dataset ومخرجات فعلية ورسم لا يدّعي أن قياسًا صغيرًا يثبت scale ضخمة.

### 14.2 — Indexes و Optimizer وقياس الاستعلام

- المستوى: أساسي إلزامي.
- المتطلبات: 14.1 و SQL و access patterns.
- الناتج: يختار index من خطة ودليل مع حساب write/storage cost.

#### 14.2.a — تصميم Index منالسؤال

B-tree/B+tree كموديل بحث، ثم clustered/secondary/composite و leftmost prefix و covering و selectivity و sargability. اختر columns بترتيب query لا بقاعدة حفظ.

#### 14.2.b — EXPLAIN و Benchmark عادل

اقرأ estimated مقابل actual rows حسب المحرك، join/sort/temp work والإحصاءات. قارن قبل/بعد معنفس البيانات والظروف وعدد queries؛ warm/cold cache و sampling اختلافان معلنان.

**تطبيق وتقييم 14.2 بعد الأجزاء السابقة:**

- تجربة صغيرة: query بطيئة معلنة تتحسن بعد index أو rewrite مع ثبات النتيجة.
- فشل متعمّد: index إضافية لا تستخدم أو تسرّع read وتؤذي write؛ سجّل trade-off لا أحذفها عشوائيًا.
- محاولة مستقلة: شخّص query جديدة واختر index أو عدم إضافتها بدليل.
- دليل النجاح: SQL وخطط قبل/بعد ووقت وعدد صفوف وفحص correctness وتكلفة index.

### 14.3 — Transactions والتزامن دون Overselling

- المستوى: أساسي إلزامي.
- المتطلبات: 14.1 وقواعد عمل الحجز و transaction الأساسية.
- الناتج: يمنع lost update و oversell ويفسر isolation و retry الآمنة.

#### 14.3.a — ACID و Isolation و MVCC

تتبع عميلين وقراءة/كتابة متداخلة، ثم dirty/non-repeatable/phantom/write skew بقدر المحرك. افصل atomicity عن isolation و durability؛ snapshot مش قفلًا دائمًا.

#### 14.3.b — Locks و Deadlocks و Optimistic Updates

قارن conditional UPDATE و version check و SELECT FOR UPDATE؛ اجعل transaction قصيرة وبنفس ترتيب القفل. deadlock يحتاج rollback وإعادة محاولة محدودة و idempotent business action.

**تطبيق وتقييم 14.3 بعد الأجزاء السابقة:**

- تجربة صغيرة: عميلان يحجزان آخر قطعة بتزامن فعلي؛ واحد فقط ينجح والمخزون لا يسلب.
- فشل متعمّد: lost update أو deadlock مفتعل في DB محلية؛ الاختبار يرصدها ثم يثبت الإصلاح.
- محاولة مستقلة: أضف cancel/restock مع حفظ invariant تحت تكرار وتزامن.
- دليل النجاح: timeline و SQL و tests concurrent ونتائج invariants وتبرير isolation/locks.

### 14.4 — Schema Evolution وقراءة حجم كبير

- المستوى: أساسي إلزامي.
- المتطلبات: 14.2 و 14.3 و release/rollback في 13.
- الناتج: يغيّر schema تدريجيًا ويقرأ export دون قفزة ذاكرة أو كسر إصدار.

#### 14.4.a — Expand/Migrate/Contract و Backfill

ابدأ nullable column ثم code متوافق و backfill batches و validation ثم constraint/contract. راقب locks ووقت DDL وحدود rollback؛ لا تفترض online DDL لكل عملية.

#### 14.4.b — Keyset Pagination و Exports

قارن offset و keyset بترتيب ثابت ومفتاح مناسب، ثم chunk/stream و resume token وحدود snapshot/freshness. اشرح backpressure من DB للكتابة على ملف.

**تطبيق وتقييم 14.4 بعد الأجزاء السابقة:**

- تجربة صغيرة: backfill قابل للاستئناف و export بذاكرة محدودة مع عدد صفوف صحيح.
- فشل متعمّد: قتل backfill أو تعديل صف أثناء export؛ السلوك المسموح موثق ولا duplicate أو فقد صامت.
- محاولة مستقلة: صمّم تحويل حقل قديم لجديد بخطة old/new code واختبار resume.
- دليل النجاح: خطة migration ومقاييس و checkpoint/resume واختبار rollback أو forward-fix.

### 14.5 — Replication وحدود التوسعة واختيار التخصص

- المستوى: أساسي إلزامي.
- المتطلبات: 14.1–14.4 و latency/durability.
- الناتج: يختار primary أو replica حسب freshness ويعرف متى لا يحتاج sharding.

#### 14.5.a — Replication و HA و Read-after-write

ابدأ primary/replica و lag و failover و backup مقابل replication. تجربة منطقية أو مختبر محدود يفسر قراءة قديمة، واختيار قراءة critical من المصدر المناسب؛ لا تدّعي HA من replica واحدة.

#### 14.5.b — Partition/Sharding و OLAP — امتدادات اختيارية

ناقش trigger مبنيًا على access patterns وحجم وتكلفة، ثم shard key/hotspots/resharding و CAP/consistency. Warehouse/CDC/ClickHouse و dimensional modeling و Lake/Lakehouse محفوظة كمسار تخصص لاحق؛ لا تنفيذها شرط لـ 15.

**تطبيق وتقييم 14.5 بعد الأجزاء السابقة:**

- تجربة صغيرة: قراءة عبر مصدر متأخر محاكى بعقد freshness معلن ثم اختيار المصدر الصحيح.
- فشل متعمّد: اعتبار replica backup مستقلة أو وضع critical decision على بيانات قديمة؛ اختبار يكشف الخطر.
- محاولة مستقلة: اكتب decision record لجدولك: index أم archive أم partition أم لا تغيير.
- دليل النجاح: trade-off موثق ومقدار freshness وقياس حاجة؛ امتداد التخصص غير المختار لا يسجل Passed.

### 14.6 — Correctness للأموال والطلبات التجريبية

- المستوى: أساسي إلزامي.
- المتطلبات: 14.3 و decimal/minor units و idempotency في 11.7.
- الناتج: يثبت invariants ويراجع حركة أموال وهمية دون float أو double effect.

#### 14.6.a — Ledger و Reconciliation

ابدأ برصيد افتتاحي وحركتين بـ minor units/decimal و currency صريحة. فرّق ledger entries عن cached balance؛ حدّد reversal/history و reconciliation بدل overwrite بلا أثر.

#### 14.6.b — Failure Matrix و Idempotency

تتبع duplicate request و timeout بعد commit وعمليتين متزامنتين. DB unique constraint و transaction وقواعد domain مع اختبارات؛ لا Redis lock كبديل لضمان البيانات.

**تطبيق وتقييم 14.6 بعد الأجزاء السابقة:**

- تجربة صغيرة: تحويل وهمي لا يفقد المجموع وتكراره لا يخصم مرتين، ثم reconciliation تكشف فرقًا مفتعلًا.
- فشل متعمّد: float rounding أو تعطل منتصف العملية أو تكرار مفتاح مختلف المحتوى؛ يُرفض أو يُصلح بعقد محدد.
- محاولة مستقلة: أضف refund/reversal محدودًا مع اختبارات تزامن وتسوية.
- دليل النجاح: invariants و transaction timeline و ledger قابل للتدقيق و tests؛ لا ادعاء نظام مالي إنتاجي.

## المشروع وبوابة الخروج

dataset صناعية معلنة الحجم؛ query review وخطة وقياس قبل/بعد، حجز متزامن دون oversell، schema/backfill قابلة للاستئناف و restore تجريبية، وسيناريو correctness للأموال الوهمية. القبول بالنتيجة والقياس وإصلاح عطل جديد، لا بتنفيذ Warehouse أو بمليار صف مزعوم.

## مراجع وحدود الربط

[Database_Master_Prompt.md](../Database_Master_Prompt.md): 4.1–4.6 لـ storage، 5.1–5.8 لـ indexes، 6.1–6.8 لـ optimizer، 7.1–7.9 لـ transactions، 9.5–9.14 لتطور schema، 10.1–10.5 لـ recovery، 11.1–11.5 لـ replication. المراحل 12–20 و 22–24 مراجع متقدمة واختيارية حسب التخصص؛ لا يطلب 14.1 إكمالها بكاملها. [Laravel_SQL_QueryBuilder_Eloquent_Master_Prompt.md](../Laravel_SQL_QueryBuilder_Eloquent_Master_Prompt.md): 12.1–13.4 مرجع الـ locks/performance و 15.3 للمراجعة. لا تحديث لتقدم المالكين بسبب هذه الخطة.

## تشغيل الجلسة والتقدم

اقرأ README.md و COMMON_RULES.md وهذا الملف وملف PROGRESS المجاور كاملين. اشرح بالعامية المصرية الطبيعية: المشكلة ثم الفكرة وآليتها ثم تجربة صغيرة وتوقع الناتج قبل التنفيذ. مفهوم واحد وسؤال واحد كل مرة؛ لا تعرض حل المحاولة المستقلة قبل محاولة الطالب. كل عنوان فرعي وحدة شرح، وليس درسًا موسوعيًا في رسالة واحدة.

الـ IDs المحلية تقيس أدلة هذا المنهج فقط. ملفات study القديمة مراجع وتعميق وليست شرط إتمام كامل قبل العبور. لا تنسخ درجاتها، ولا تعتبر نجاح بوابة محلية نجاحًا تلقائيًا في نقطة قديمة. إن اختار الطالب دراسة المالك كاملًا، اقرأ منهجه وتقدمه والتزم بترتيبه؛ سجل الربط دون ازدواج النتائج.

حدّث التقدم المحلي وفق الدليل الحقيقي: checkpoint والعنوان الفرعي وآخر تمرين مكتمل والخطوة غير المكتملة والاختبارات والفجوات. شرط النجاح 80% على الأقل مع أدلة مستقلة وإصلاح أخطاء الأمان أو صحة البيانات الجوهرية. المتقدم الاختياري لا يعطل بوابة الأساس، ولا يسجل Passed أو درجة وهمية إن لم يُدرس. لا نشر أو commit أو push أو تعديل لتقدم مسار قديم تلقائيًا.
