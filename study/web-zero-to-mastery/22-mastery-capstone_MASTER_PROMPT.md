# المرحلة 22 — مشروع الإتقان والتقييم النهائي

الإصدار:1.1 — 2026-10-21. ده capstone متقدم، مش شرط إنجاز أول تطبيق ويب أو بداية التقديم على عمل. المتطلبات: بوابات المراحل 0–20 المحلية وأدلتها، وفرع 21 فقط لو اختاره الطالب لهذا المخرج. لا يُشترط إكمال المناهج القديمة كلها أو Kubernetes أو موارد مدفوعة لإتقان Backend.

كل checkpoints أساسية للتقييم النهائي؛ أساسيات المنتج تتختبر من جديد بتطبيق مستقل وتكامل وفشل، مش بنسخ درجات قديمة. نطوّر مشروعًا قائمًا لو مناسب، مش نعيد بناء كل شيء من الصفر.

### 22.1 — Scope و Project Contract

#### 22.1.a — اختيار مشروع يخدم هدفًا واضحًا

- المتطلب والهدف:20؛ يختار Orders/Inventory SaaS أو Integration Hub بمستخدمين ومشكلة ومخرج معروف؛ Wallet تعليمي فقط بلا مدفوعات حقيقية.
- الشرح: problem statement ← users/critical flow ← ما هو خارج النطاق ← البدائل وسبب الاختيار؛ لا تبدأ بعشرين خدمة.
- المختبر والنتيجة المتوقعة: proposal قصير ورحلتان للمستخدم، واستخدام مشروع قائم لو مناسب، مع قائمة موارد تجريبية محلية.
- الفشل ودليل النجاح: scope أكبر من وقت وموارد الطالب المتاحة؛ يقلل المخرج من غير إسقاط الصحة والأمان، ويبرر اختياره بنفسه.

#### 22.1.b — معايير القبول وخطة الأدلة

- المتطلب والهدف:22.1.a؛ يحدد functional/nonfunctional requirements و invariants و SLIs و test matrix ومصدر حقيقة لكل data domain.
- الشرح: requirement ← قبول قابل للملاحظة ← test/measurement ← مكان الدليل ← gate؛ افصل افتراضًا لسه ما قستوش من حقيقة متحققة.
- المختبر والنتيجة المتوقعة: checklist قبل كتابة feature جديدة، مرتبطة بالمحاور الستة في rubric أدناه.
- الفشل ودليل النجاح: معيار «سريع وآمن» مش قابل للقياس؛ الطالب يحوله لحدود وعقد واختبار، ولا يمرر بوابة لمجرد وجود قائمة.

### 22.2 — MVP يتطور على Milestones

#### 22.2.a — Vertical Slice كاملة

- المتطلب والهدف:22.1؛ يربط هوية وصلاحيات ونموذج بيانات وواجهة/API وقواعد عمل بتدفق واحد عامل.
- الشرح: أقل use case كامل ← schema و constraints ← authorization و validation ← behavior tests ← UI/API؛ مش هيكل ضخم بلا feature.
- المختبر والنتيجة المتوقعة: إنشاء order أو استقبال أول integration event، مع حالة نجاح وحالة رفض وإثبات عزل tenant لو النظام متعدد المستأجرين.
- الفشل ودليل النجاح: تغيير ID للوصول لبيانات غير مأذونة؛ يفشل الاختبار الأمني حتى الإصلاح، وتتراجع كل boundaries المتأثرة.

#### 22.2.b — Milestones و Change Control

- المتطلب والهدف:22.2.a؛ يقسم باقي المخرجات لتغييرات صغيرة يمكن review/rollback لها، ويحدد data/API/event contracts.
- الشرح: backlog حسب الخطر ← feature flags لو مفيدة ← migration متوافقة ← dependency boundary ← release evidence.
- المختبر والنتيجة المتوقعة: milestone جديدة بوصف فرق المتطلبات واختبارات ووثائق، من غير كسر السلوك المعتمد.
- الفشل ودليل النجاح: طلب جديد يخالف scope؛ يقدم الطالب قرار قبول/تأجيل وتأثيره على التصميم والاختبار، بلا انتقال صامت لمشروع آخر.

### 22.3 — Correctness و Security Review

#### 22.3.a — Invariants واختبارات التزامن

- المتطلب والهدف:22.2 و 17–19؛ يثبت قواعد عمل تحت duplicate/retry/reorder/concurrency، مش happy path فقط.
- الشرح: invariant ← unsafe interleaving ← constraint/transaction/idempotency ← deterministic test؛ static analysis وأدوات الجودة تدعم التفكير مش تستبدله.
- المختبر والنتيجة المتوقعة: طلبان متزامنان على آخر عنصر، و event مكرر ومتأخر؛ النتائج تطابق policy وتفضل الحالات المجهولة قابلة للتتبع.
- الفشل ودليل النجاح: crash بعد أثر خارجي وقبل الرد؛ يشرح حد ضمان العقد وينفذ reconciliation بدل إعادة عمياء، مع أدلة تشغيل.

#### 22.3.b — Threat Model واختبار Authorization

- المتطلب والهدف:12 و 22.3.a؛ يفحص trust boundaries و auth/session/secrets/input/output/dependencies/data retention حسب المشروع.
- الشرح: attacker/use case ← attack surface ← defensive control ← negative test ← residual risk؛ اختبارات أمنية في المختبر فقط.
- المختبر والنتيجة المتوقعة: security checklist واختبارات تجاوز صلاحية وتسريب tenant و XSS/CSRF أو API auth حسب السطح، مع dependency/static checks مناسبة.
- الفشل ودليل النجاح: secret في repo/logs أو مسار غير محمي؛ يمنع النجاح حتى المعالجة والتحقق من الأثر. لا يحذف history أو يغير credential حقيقي تلقائيًا.

### 22.4 — قياس وتحسين يمكن إعادته

#### 22.4.a — Workload و Baseline حقيقية

- المتطلب والهدف:22.2 و 15 و 18؛ يحدد dataset/workload/concurrency/duration/versions/hardware و p50/p95/p99/errors والذاكرة لو لازمة.
- الشرح: سؤال قياس ← workload يمثل flow ← warm-up و limits ← baseline ← bottleneck diagnosis؛ راقب client generator أيضًا.
- المختبر والنتيجة المتوقعة: أمر reproduce و raw summary منقح ونتيجة baseline؛ لا ادعاء ملايين مستخدمين من demo صغير أو RPS منفردة.
- الفشل ودليل النجاح: cache warm فقط أو generator مختنق؛ يكتشف الطالب التحيز ويعيد التجربة أو يعلن حدود الاستنتاج.

#### 22.4.b — تحسين مع Cost و Regression Budget

- المتطلب والهدف:22.4.a؛ يختار bottleneck واحدة ويثبت before/after مع correctness محفوظة ومقارنة تكلفة الموارد والتشغيل.
- الشرح: hypothesis ← smallest change ← repeated measurement ← regression/security tests ← cost/complexity/reversibility.
- المختبر والنتيجة المتوقعة: تقرير تحسين أو رفض فرضية بالدليل، مع جدول workload ثابت ونسبة تغير وأثر جانبي معلن.
- الفشل ودليل النجاح: تحسن latency مع stale data غير مقبولة؛ يرفض التغيير أو يعدل policy ويدافع عن القرار، بلا انتقاء أفضل run فقط.

### 22.5 — Release و Recovery Drill

#### 22.5.a — تشغيل نسخة قابلة للتكرار

- المتطلب والهدف:13 و 18 و 22.3؛ يبني release من revision محددة، بـ configuration و secrets آمنة و checks و migrations مدروسة.
- الشرح: build/check ← immutable artifact ← rollout/worker lifecycle ← health/SLIs ← rollback decision؛ deploy خارجي بإذن صريح، والمحلي كافي للتقييم.
- المختبر والنتيجة المتوقعة: بيئة نظيفة تشغل المنتج من الوثائق مع seed data وهمية، ثم release جديدة ومحاكاة فشل نشر.
- الفشل ودليل النجاح: code rollback مش مناسب لـ schema المتغيرة؛ يحدد الطالب حد الرجوع وخطة forward fix أو restore ويفسر أثر البيانات قبل التنفيذ.

#### 22.5.b — Restore و Incident مستقل

- المتطلب والهدف:22.5.a؛ يثبت RPO/RTO مقاسين، مع runbook و timeline و correctness validation بعد التعافي.
- الشرح: declare failure ← isolate ← restore/replay ← verify data/critical flow ← resume ← postmortem؛ backup غير مختبرة مش proof.
- المختبر والنتيجة المتوقعة: fault يختارها المقيّم في بيانات تجريبية، منها فقد بيئة أو توقف worker؛ استعادة وتقرير إيه اللي رجع وإيه اللي ما رجعش، مع الأوقات.
- الفشل ودليل النجاح: backup الأولى غير صالحة؛ ينفذ بديلًا أو يعلن الحدود ويصلح الخطة ويعيد الاختبار. فقد صامت أو ادعاء نجاح بلا verify يمنع النجاح.

### 22.6 — Documentation ودليل Portfolio

#### 22.6.a — README و API Docs و ADRs

- المتطلب والهدف:22.2–22.5؛ يكتب مستندات تكفي شخصًا آخر لتشغيل المشروع واستخدام العقود وفهم القرار والقيود.
- الشرح: quick start ← env example بلا secrets ← architecture/data contracts ← tests/benchmark/recovery commands ← ADRs و known limitations.
- المختبر والنتيجة المتوقعة: تشغيل من مسار نظيف بأوامر الوثائق، و request examples و error responses و seed data؛ روابط الأدلة صالحة.
- الفشل ودليل النجاح: dependency أو متغير ناقص؛ تتصلح الوثائق وما تعتمدش على ذاكرة صاحبها، ثم تتكرر التجربة وتتسجل نسخة المختبر.

#### 22.6.b — عرض صادق بلا نشر تلقائي

- المتطلب والهدف:22.6.a؛ يختصر المشكلة والقرارات والنتائج المقاسة وحدودها، ويخفي أسرار وبيانات خاصة من الأدلة.
- الشرح: claim ← source evidence ← scope/limitations ← demo ← feedback؛ ارجع [Portfolio ideas](../GITHUB_PORTFOLIO_PROJECT_IDEAS.md) للتعمق دون نسخ درجات أو فرض كل المشاريع.
- المختبر والنتيجة المتوقعة: portfolio package محلية مع صور أو logs منقحة وملخص trade-offs وخطة تحسين، بلا تحويله لإعلان بمستوى وظيفي مضمون.
- الفشل ودليل النجاح: claim غير مدعومة أو PII في screenshot؛ تتصحح قبل العرض. لا commit/push/deploy/share خارجي تلقائي.

### 22.7 — تقييم مستقل وخطة الفجوات

#### 22.7.a — Feature و Bug و Code Review غير محفوظة

- المتطلب والهدف:22.1–22.6؛ يظهر الطالب استقلالًا في طلب جديد و bug مجهول وقراءة كود غير مألوف؛ ما ينفعش يتقال له الحل ثم نسميه تقييمًا.
- الشرح: clarification ← plan/prediction ← independent attempt ← tests/debugging ← review؛ hints تتسجل والمهمة تتغير لو أُعطي الحل.
- المختبر والنتيجة المتوقعة: feature صغيرة غير مجهزة، و fault جديدة، و review بعلة وإصلاح؛ الأدلة توضح الاستدلال وليه الاختبار يمسك الخطأ.
- الفشل ودليل النجاح: الحل ينجح بالمثال ويكسر edge case؛ الطالب يصحح من counterexample ويعيد اختبارًا مستقلًا، مش تحسين درجة ورقية.

#### 22.7.b — دفاع نهائي وإعادة تقييم الفجوات

- المتطلب والهدف:22.7.a؛ يدافع عن contracts/invariants/scale/security/recovery/cost، ويقول لا أعرف لو الدليل غير كافٍ، مع خطة تحقق.
- الشرح: review الأدلة ← سؤال trade-off جديد ← تقييم المحاور الستة ← remediation محددة ← retest مستقل ← handoff.
- المختبر والنتيجة المتوقعة: شخص آخر أو المقيّم يعيد التشغيل والاختبار، ومصفوفة نتائج تشير لمواضع الأدلة وتفرق completed من not assessed.
- الفشل ودليل النجاح: محور أقل من 80 أو ثغرة critical؛ الحالة Needs Review وخطة إصلاح ثم retest، ولا يتغطى الضعف بمتوسط مرتفع.

## Rubric نهائي — ستة محاور منفصلة

كل محور من 100، وتُمنح نقاطه بالدليل الفعلي. تتوزع الـ 100 داخله: تفسير 25، تنفيذ مستقل 40، اختبارات/فشل 25، تبرير 10 وفق COMMON_RULES؛ لا يُعطى أي رقم بلا review. الجدول يحدد إيه اللي بيتقيّم، مش درجة ممنوحة مسبقًا.

| المحور | دليل اجتياز محدد | مانع حرج حتى الإصلاح وإعادة الاختبار |
|---|---|---|
| Correctness | invariants و transactions و concurrency/idempotency وأثر تجاري يمكن تتبعه | فقد صامت، تكرار أثر مالي/حجز، أو فساد بيانات غير معالج |
| Security | threat model و authorization/tenant isolation و secret handling و negative tests | تجاوز صلاحية، تسريب سر/بيانات، أو ثغرة حرجة قابلة لإعادة الإنتاج |
| Testing | tests قابلة للتكرار تمسك mutations/faults مع contract/integration مناسبة | false positive تخفي خللًا حرجًا أو اختبارات لم تُشغل بلا إقرار |
| Operations | reproducible release/rollback/restore و runbook و SLIs و RPO/RTO مقاسان | restore غير متحقق أو ادعاء تعافٍ مع فقد غير معلن |
| Performance | workload/versions/raw results و bottleneck وتحسين وتكلفة بحدود واضحة | أرقام ملفقة أو حمل تسبب في خروج عن صلاحية المختبر |
| Design & communication | requirements/estimates/contracts/ADRs وبدائل ودفاع وحزمة تشغيل لآخر | عقد أساسي غامض يخفي خرق correctness/security ولا يعرف صاحبه حدوده |

النجاح = كل checkpoint المنطبقة ومشروعها ناجحة +80% على الأقل في كل محور من الستة +عدم بقاء مانع حرج +إعادة تشغيل مستقلة مناسبة. المحور غير المقاس يبقى Not assessed مش 80 افتراضية. متوسط 90 ما يعوضش محورًا 70، ولا لقب Master من عدد صفحات أو شهور. فرع 21 غير المختار مستبعد من المتطلبات والدرجات.

## تشغيل جلسة هذه الجزئية

- اقرأ [الفهرس](README.md) و[قواعد التدريس والتقييم](COMMON_RULES.md) كاملين، ثم هذا الملف و[ملف التقدم](22-mastery-capstone_PROGRESS.md) كاملين قبل الشرح.
- هذا الملف منهج الجزئية، وليس الدرس المنشور أو دليل اجتيازها. اشرح checkpoint واحدة على أجزاء، وسؤالًا واحدًا كل مرة، بالعامية المصرية و PHP افتراضيًا إلا في موضوع لغة أخرى.
- ملف التقدم المجاور يملك الموضع والنتائج الخاصة بهذه الجزئية. الفهرس وملف التوجيه العام لا يكرران الدرجات.
- المسارات القديمة مراجع للتعمق، لا يُفرض إكمالها لإغلاق البوابة المحلية. لو اختار الطالب دراسة مسار قديم مستقلًا اقرأ Master و Progress الخاصين به، واحفظ درجاته هناك دون نسخها هنا.
- قواعد المنهج المشتركة وخرائط ملاك الموضوعات في COMMON_RULES.md؛ أسماء ملفات المسارات القديمة المذكورة أعلاه تُحل من study الأب، لا من هذا المجلد.

## إنهاء الجلسة

حدّث تقدم الويب المحلي وفق دليله فقط. لا تعدّل تقدم مسار قديم إلا إذا اختار الطالب دراسة ذلك المسار مستقلًا واتُّبعت قواعده؛ الاستعانة بمرجع لا تمنح نجاحًا فيه. حدّث مؤشر العودة عند تغيير الجزئية، ولا تبدأ التالية تلقائيًا أو تسجل Passed بسبب إنشاء الملفات. لا نشر أو commit أو push تلقائي.
