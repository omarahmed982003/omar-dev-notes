# المرحلة 15 — PHP Runtime وقياس الأداء

الإصدار: 1.1 — مراجعة المنهج 2026-10-21. مراجعة تحريرية؛ لم تبدأ الدراسة.

هنفهم البرنامج بيتنفذ إزاي ونقيس bottleneck حقيقية قبل التحسين. تفاصيل المحرك وسيلة لتفسير سلوك، مش سبب لتأخير بناء منتج أو حفظ structs من الذاكرة.

## المتطلبات وحدود المرحلة

نجاح بوابة 14 المحلية في query plans و transactions وقياس dataset، لا إنهاء Database Master القديم كاملًا. جهز تطبيقًا مختبرًا ونسخ PHP/FPM/extensions وأداة profiling متوافقة.

نموذج التنفيذ والذاكرة و OPcache و FPM وقياس الأداء أساس متقدم. JIT و Octane/Fibers/async تعميق اختياري بعد الأساس، وتختلف حسب نسخة المختبر؛ لا وعد بتسريع كل تطبيق.

## خطة الدراسة

### 15.1 — من Source إلى Execution وإعداد التشغيل

- المستوى: أساسي إلزامي.
- المتطلبات: CLI/FPM في 8 و 13.
- الناتج: يفسر فرق نفس الكود بين CLI و Web SAPI ويحدد config الفعلية.

#### 15.1.a — Zend و Opcodes و SAPI

تتبع source→parse/compile→opcodes→execute، ودور SAPI و extensions. ميّز runtime و web server و framework، وأين تظهر syntax/runtime failures.

#### 15.1.b — php.ini و Configuration Boundaries

حدد loaded ini و scanned files و extension versions. قارن CLI و FPM و per-request limits؛ لا تعرض phpinfo عامة ولا نسخ config تتضمن secrets.

**تطبيق وتقييم 15.1 بعد الأجزاء السابقة:**

- تجربة صغيرة: اطبع نسخة و SAPI و config غير سرية محليًا وشغّل نفس الوظيفة CLI و HTTP.
- فشل متعمّد: extension موجودة في CLI وغائبة في FPM؛ التشخيص يحدد الفرق لا يعيد تثبيت كل شيء.
- محاولة مستقلة: فسّر memory/time limit مختلفتين وأصلح مختبرًا واحدًادون تغيير عام.
- دليل النجاح: أوامر نسخ و config مختصرة ورسم مسار التنفيذ وخرج قابل للتكرار.

### 15.2 — القيم والذاكرة وحدود المشاركة

- المستوى: أساسي إلزامي.
- المتطلبات: PHP values/references و objects9.1.
- الناتج: يتنبأ بتغير قيمة ويقيس memory دون خلط alias مع object handle.

#### 15.2.a — zval و Refcount و Copy-on-write

تتبع array assignment ثم mutation ومرجع&، وقارن object handle. اشرح النموذج دون اعتبار internal layout ثابتًا لكل نسخة.

#### 15.2.b — GC و Memory Measurement

فرّق cycles عن release العادي و peak memory عن RSS. صمم قياسًا متساويًا وامنع احتفاظ الاختبار بكل النتائج؛ allocator ونسخة المحرك يؤثران في الأرقام.

**تطبيق وتقييم 15.2 بعد الأجزاء السابقة:**

- تجربة صغيرة: قارن array copy قبل/بعد mutation و object alias مع قياس ثابت.
- فشل متعمّد: reference داخل foreach تغيّر عنصرًا لاحقًا أو collection تحتفظ بكل البيانات؛ test يكشف السبب.
- محاولة مستقلة: صلح memory growth في export مع ثبات النتائج.
- دليل النجاح: predictions و output وقياس حدوده معلنة واختبار correctness بعد الإصلاح.

### 15.3 — Autoload و OPcache و Invalidation

- المستوى: أساسي إلزامي.
- المتطلبات: Composer/PSR-4 و 15.1.
- الناتج: يميّز تحميل class عن cache opcodes ويراجع تحديث الكود بعد release.

#### 15.3.a — Composer Autoload في Production

تتبع composer.lock و autoload map و optimization حسب المشروع. ملفات autoload مش cache business data؛ لا update عشوائية أثناء deploy.

#### 15.3.b — OPcache و JIT وحدود الفائدة

اشرح shared opcode cache و validation/reload وفق نمط التشغيل. جرّب JIT فقط كاختيار لاحق لمهمة CPU واضحة وقارن DB/network time؛ لا تعد بتحسن web request لمجرد تفعيله.

**تطبيق وتقييم 15.3 بعد الأجزاء السابقة:**

- تجربة صغيرة: لاحظ تغيير كود في FPM وراجع خطة invalidation/deployment دون تعريض endpoint reset عامة.
- فشل متعمّد: كود قديم بعد release أو autoload case mismatch؛ شخّص المصدر الصحيح.
- محاولة مستقلة: اكتب checklist release يثبت الكود الفعلي ويحافظ على الأمان.
- دليل النجاح: release ID و config و timing عادل واختبار عقد التطبيق قبل/بعد.

### 15.4 — FPM والـ Queue والـ Memory Budget

- المستوى: أساسي إلزامي.
- المتطلبات: 13.2 و 15.1 وقياس memory.
- الناتج: يحسب ميزانية worker أولية ويلاحظ saturation دون فتح limits بلا حد.

#### 15.4.a — Worker Model و Sizing

اشرح master/workers و request isolation و pool queue. قدّر تكلفة worker و headroom و DB connections؛ زيادة workers قد تنقل bottleneck أو تستنزف RAM.

#### 15.4.b — Timeouts و Signals و Shutdown

تتبع client/proxy/FPM/app/DB timeouts و shutdown بعد release. فرّق وقت انتظار queue عن وقت CPU، وحدّد حدود graceful stop و request termination.

**تطبيق وتقييم 15.4 بعد الأجزاء السابقة:**

- تجربة صغيرة: load محدود على مختبر مع pool صغيرة ورصد latency/queue/RSS.
- فشل متعمّد: workers أكثر من ميزانية الذاكرة أو زمن DB أطول من budget؛ لا يُستنتج الحل بزيادة كل limits.
- محاولة مستقلة: اختر pool size مبررًا واختبره على نفس load وال data.
- دليل النجاح: حساب و headroom ومقاييس قبل/بعد ومراقبة DB connections وصحة الاستجابات.

### 15.5 — Profiling و Benchmark قابلة للدفاع

- المستوى: أساسي إلزامي.
- المتطلبات: 15.1–15.4 وقياس DB14.2.
- الناتج: يعزل bottleneck ويثبت تحسنًا بحدود قياس صريحة.

#### 15.5.a — Baseline و Profiler

حدد workload و dataset و environment و warmup و sampling. قارن wall time و CPU و I/O wait وعدد queries؛ profiler له overhead واختبار صغير مش صورة production كاملة.

#### 15.5.b — Percentiles و Load/Stress/Soak

اشرح p50/p95/p99 بمثال مرتب قبل عرض الأرقام، ثم throughput/error rate/concurrency. فرّق load عن stress و soak و coordinated omission كمحذور متقدم؛ لا averages وحدها.

**تطبيق وتقييم 15.5 بعد الأجزاء السابقة:**

- تجربة صغيرة: قياس endpoint فيها query أو CPU متعمدة ثم تحسين سبب واحد.
- فشل متعمّد: benchmark تقارن dataset مختلفة أو تتجاهل أخطاء requests؛ التقرير يرفض الاستنتاج.
- محاولة مستقلة: قدم optimization مستقلة مع correctness test ومقياس أثر جانبي.
- دليل النجاح: أوامر و raw summary و baseline وتحسن ومخاطر/تراجع وكيفية إعادة القياس.

### 15.6 — Long-running State وامتدادات Async

- المستوى: أساسي إلزامي.
- المتطلبات: 15.2 و 15.4 و jobs10.7.
- الناتج: يمنع تسرب حالة مستخدم أو اتصال ويشرح حدود تشغيل طويل العمر.

#### 15.6.a — Lifecycle و State/Connection Leaks

قارن FPM request بدفعات jobs داخل نفس process. افحص static/global/singleton وحالة tenant و open connections، وخطة recycle/reload عند deploy.

#### 15.6.b — Octane و Fibers و Async — اختياري

بعد إثبات النموذج: Fibers ليست parallel CPU تلقائيًا؛ async تحتاج non-blocking I/O و scheduler مناسبًا. Octane يغيّر lifecycle ومخاطر state؛ لا اعتماد جديد بلا سبب مقاس.

**تطبيق وتقييم 15.6 بعد الأجزاء السابقة:**

- تجربة صغيرة: شغّل عمليتين لمستخدمين بنفس worker وأثبت عدم عبور الـ state.
- فشل متعمّد: singleton يحتفظ بـ tenant أو connection ميتة بعد idle؛ اختبار تكراري يكشفه.
- محاولة مستقلة: صلح leak وعرف graceful reload واختبار reconnect.
- دليل النجاح: test على عمليات متتالية و memory trend وشرح ما يلزم قبل أي async adoption.

## المشروع وبوابة الخروج

تقرير bottleneck واحدة في تطبيقنا: workload و dataset و baseline و profiling وقرار تحسين ونتائج قبل/بعد واختبار صحة وأثر على الذاكرة/DB/error rate. لا يشترط JIT أو Octane أو load خارجي ضد أنظمة غير مأذونة.

## مراجع وحدود الربط

PHP manual و PHP internals المصدران لسلوك المحرك حسب الإصدار؛ راجع وثائق FPM و OPcache و Composer و Laravel Octane الرسمية عند التنفيذ. المحتوى المتقدم JIT/Fibers/async محفوظ اختياريًا، ولا شرط إنهاء مسار قديم كامل لدراسة هذه المرحلة.

## تشغيل الجلسة والتقدم

اقرأ README.md و COMMON_RULES.md وهذا الملف وملف PROGRESS المجاور كاملين. اشرح بالعامية المصرية الطبيعية: المشكلة ثم الفكرة وآليتها ثم تجربة صغيرة وتوقع الناتج قبل التنفيذ. مفهوم واحد وسؤال واحد كل مرة؛ لا تعرض حل المحاولة المستقلة قبل محاولة الطالب. كل عنوان فرعي وحدة شرح، وليس درسًا موسوعيًا في رسالة واحدة.

الـ IDs المحلية تقيس أدلة هذا المنهج فقط. ملفات study القديمة مراجع وتعميق وليست شرط إتمام كامل قبل العبور. لا تنسخ درجاتها، ولا تعتبر نجاح بوابة محلية نجاحًا تلقائيًا في نقطة قديمة. إن اختار الطالب دراسة المالك كاملًا، اقرأ منهجه وتقدمه والتزم بترتيبه؛ سجل الربط دون ازدواج النتائج.

حدّث التقدم المحلي وفق الدليل الحقيقي: checkpoint والعنوان الفرعي وآخر تمرين مكتمل والخطوة غير المكتملة والاختبارات والفجوات. شرط النجاح 80% على الأقل مع أدلة مستقلة وإصلاح أخطاء الأمان أو صحة البيانات الجوهرية. المتقدم الاختياري لا يعطل بوابة الأساس، ولا يسجل Passed أو درجة وهمية إن لم يُدرس. لا نشر أو commit أو push أو تعديل لتقدم مسار قديم تلقائيًا.
