# المرحلة 16 — Cache و Redis

الإصدار: 1.1 — مراجعة المنهج 2026-10-21. مراجعة تحريرية؛ لم تبدأ الدراسة.

هنضيف cache لسبب مقاس، ونرجع لسؤالين: مين source of truth؟ وإيه اللي يحصل لو Redis اختفت؟ نجاح GET/SET مش دليل correctness أو تعافٍ.

## المتطلبات وحدود المرحلة

نجاح Runtime وقياس الأداء المحلي 15 و transactions/idempotency في 11 و 14. لازم نجاح 16.0 قبل أي Docker/Redis lab؛ Docker العميقة في 18 لاحقًا.

مختبر آمن و keyspace/data structures و TTL/invalidation و atomicity و memory/recovery أساس متقدم. Sentinel/Cluster/modules/huge leaderboard تخصص اختياري بعد حاجة ومقدمات التوزيع؛ لا يشترط إكمال Redis Master كاملًا.

## خطة الدراسة

### 16.0 — تجهيز مختبر Redis آمن

- المستوى: أساسي إلزامي.
- المتطلبات: Linux/ports/processes في 13 وميزانية مختبر.
- الناتج: يشغّل Redis محلية مع نسخة ثابتة وحدود تنظيف مفهومة.

#### 16.0.a — Container و Ports و Volumes بالحد اللازم

لو Docker موجودة ومأذونة: اشرح image/container و version pin و port mapping إلى 127.0.0.1 فقط وحفظ data في volume تجريبية مسمّاة. لا تثبيت Docker أو تغيير engine/firewall تلقائيًا. البديل Redis داخل VM/WSL معزولة موجودة ومأذونة؛ اشرح عملية الخدمة والمسار والـ bind/ACL.

#### 16.0.b — Probe و Isolation و Cleanup

اختبر redis-cli PING و connection من PHP ببيانات وهمية. افصل المختبر عن production بمسار/instance لا اسم key فقط. افحص المسار والـ volume قبل أي cleanup ولا FLUSHALL على خدمة غير معروفة؛ بناء image/Compose المتقدم في 18.

**تطبيق وتقييم 16.0 بعد الأجزاء السابقة:**

- تجربة صغيرة: PING→PONG ونسخة مسجلة و port محلية فقط ثم stop/start مضبوطين.
- فشل متعمّد: port مكشوفة أو اختيار instance ليست للمختبر؛ توقف قبل أوامر الكتابة أو المسح.
- محاولة مستقلة: أعد تجهيز مختبرك من README وحدّد ما سيضيع وما سيبقى عند restart.
- دليل النجاح: commands/config منقحة و version و port/volume inventory وخطة cleanup؛ إن لم تتوفر بيئة يبقى المختبر غير منفذ.

### 16.1 — اختيار Cache ونموذج Redis

- المستوى: أساسي إلزامي.
- المتطلبات: 16.0 و 15.5 baseline.
- الناتج: يختار بيانات قابلة للتقادم ويصمم key وعمرًا وعقد فشل.

#### 16.1.a — Source of Truth و Staleness Budget

حدد catalog read لا قرار رصيد. ارسم hit/miss ووقت الحياة ومصدر إعادة البناء. cache بتسرّع قراءة مش بديل authorization أو DB constraint.

#### 16.1.b — Keyspace و Data Structures و Internals

ابدأ Strings/Hashes و SET/GET/DEL/TTL ثم قارن Set/Sorted Set/List حسب استخدام حقيقي. namespaces و serialization وحدود الحجم؛ command complexity و network I/O و atomic command لا يعني atomic workflow. Streams/PubSub تعميق مربوط بـ 17.

**تطبيق وتقييم 16.1 بعد الأجزاء السابقة:**

- تجربة صغيرة: قراءة catalog تعاد بناؤها من DB بعد miss مع key تشمل نسخة العقد وعزل tenant.
- فشل متعمّد: collision بين اثنين من tenants أو cache بيانات صاحب آخر باسم key ناقص؛ اختبار يرفض التسريب.
- محاولة مستقلة: اختر structure لمطلوب عداد أو ترتيب بسبب وتكلفة واضحين.
- دليل النجاح: رسم flow و key schema و staleness/failure contract و baseline وعدد queries.

### 16.2 — TTL و Invalidation و Stampede

- المستوى: أساسي إلزامي.
- المتطلبات: 16.1.
- الناتج: يثبت تحديث cache وفقدها ولا يسمح بتقادم غير محدد.

#### 16.2.a — Cache-aside و Write Patterns

نفذ read-through يدويًا بسيطًا بأسلوب cache-aside، ثم write و invalidate بعد commit. قارن update/delete/versioned key وحدود race و negative caching و TTL.

#### 16.2.b — Stampede و Hot/Big Keys

اختبر miss متزامنة ثم bounded lock أو request coalescing و jitter؛ ناقش hot key/big key و memory/latency. Tags و client-side tracking امتداد اختياري بعد إثبات invalidations.

**تطبيق وتقييم 16.2 بعد الأجزاء السابقة:**

- تجربة صغيرة: تعديل catalog يظهر خلال budget معلنة وقياس cache hit/miss و DB requests.
- فشل متعمّد: تعطل invalidation أو stampede متعمدة بـ load محدود؛ لا افتراض أن TTL يزيل كل race.
- محاولة مستقلة: أضف negative cache بمدة محدودة ولا يسمم حالة إنشاء سجل جديد.
- دليل النجاح: tests قبل/بعد commit وتزامن miss ومقاييس مع تفسير تقادم متبقٍ.

### 16.3 — Rate Limiter و Sessions و Leaderboard

- المستوى: أساسي إلزامي.
- المتطلبات: 16.1 و 16.2 و auth12.
- الناتج: يختار failure policy لكل workload بدل خلط cache مع credentials.

#### 16.3.a — Rate Limit و Session Correctness

ابدأ atomic counter/expiry و race من INCR ثم EXPIRE منفصلتين، ثم أداة atomic موثوقة حسب النسخة. sessions credentials: eviction وفقد Redis قد يسجل المستخدم خروجًا؛ fail-open/closed قرار معلن حسب العملية.

#### 16.3.b — Sorted Sets وترتيب نتيجة قابلة لإعادة البناء

مثال leaderboard صغيرة بـ ZSET، score وتساوي الدرجات والـ pagination. source of truth مختلف عن read model؛ massive sharded leaderboard اختياري بعد distributed basics.

**تطبيق وتقييم 16.3 بعد الأجزاء السابقة:**

- تجربة صغيرة: N طلبات في window محددة تُقبل وبعدها تُرفض، و leaderboard تعاد من DB.
- فشل متعمّد: restart/eviction أو clock/window boundary؛ لا reset حد حساس بلا سياسة ولا ادعاء durable score.
- محاولة مستقلة: اختَر سلوكًا عند Redis down لقراءة عامة ولـ login حساس واختبره.
- دليل النجاح: tests atomic/concurrent و 429 وسياسة sessions/fallback وخطة rebuild.

### 16.4 — Atomicity و Locks وحدود الضمان

- المستوى: أساسي إلزامي.
- المتطلبات: 16.1 و DB constraints/transactions14.3.
- الناتج: يفرق atomic command عن multi-step transaction وعن lock مؤقتة.

#### 16.4.a — MULTI/EXEC/WATCH و Server-side Work

نفذ read-modify-write بوضوح ثم راقب conflict. Lua/functions عند الحاجة بأقل script وحدود وقت؛ لا blocking work طويلة على الخادم، و pipeline لتقليل الـ round trips ليست transaction.

#### 16.4.b — Lease و Expiry و Ownership و Fencing

استخدم token فريدة وفك lock فقط لمالكها وتعامل مع expiry و pause. explain fencing في المورد المحمي إن كان يدعمه؛ Redis lock وحدها لا تضمن عدم double spending أو exactly-once.

**تطبيق وتقييم 16.4 بعد الأجزاء السابقة:**

- تجربة صغيرة: مستهلكان يتنافسان على مورد تجريبي مع DB unique constraint تحمي business invariant.
- فشل متعمّد: pause أطول من lease ثم محاولة عميل قديم يكتب؛ الاختبار يكشف الحاجة لحد حماية المورد.
- محاولة مستقلة: صمّم duplicate webhook admission مع DB كحكم أخير و timeouts محددة.
- دليل النجاح: timeline و atomic tests وتوثيق ما نضمنه وما لا؛ deep distributed locks اختيار بعد 19.

### 16.5 — Memory و Persistence و Recovery

- المستوى: أساسي إلزامي.
- المتطلبات: 16.1–16.4.
- الناتج: يقدر حجم الذاكرة ويختبر فقد البيانات والتراجع ويعيد البناء.

#### 16.5.a — Eviction و RDB/AOF و Restart

maxmemory و policies و TTL و serialization overhead ثم RDB/AOF و fsync trade-offs. افصل cache قابلة للفقد عن queue/session critical؛ snapshot مش دليل durability كاملة.

#### 16.5.b — Observability و Lag و Security والتوسع

راقب latency/memory/evictions/errors و bounded scans بدل KEYS على keyspace كبيرة. bind/ACL/secrets و client timeouts/reconnect أساسية. lag و Sentinel/Cluster/hash slots و WAIT/modules/client-side tracking والترقيات ومقارنة Memcached امتدادات اختيارية بمراجعها، لا شرط العبور.

**تطبيق وتقييم 16.5 بعد الأجزاء السابقة:**

- تجربة صغيرة: اعمل restart أو eviction داخل instance المختبر ثم rebuild من DB وقارن الصحة و cache metrics.
- فشل متعمّد: data loss أو fallback يضغط DB أو قيمة cached غير متوافقة بعد release؛ تشخيص وتخفيف محدودان.
- محاولة مستقلة: اكتب capacity estimate وخطة recovery/upgrade لاستخدام catalog مع قياس معلن.
- دليل النجاح: memory budget وفشل/rebuild مثبت و workload isolation وخطة cost/cleanup؛ لا دعوى HA دون اختبارها.

## المشروع وبوابة الخروج

Cache ل catalog و rate limiter و leaderboard صغيرة تجريبية مع تعطيل Redis عمدًا. القبول: key isolation، freshness محددة، load محدود قبل/بعد، DB صحيحة عند duplicate، recovery/rebuild و failure policy تختبر لعملية عامة وأخرى حساسة. لا يلزم cluster ولا modules ولا Redis كقاعدة دائمة.

## مراجع وحدود الربط

[Redis_Caching_At_Scale_Master_Prompt.md](../Redis_Caching_At_Scale_Master_Prompt.md): 0.2–0.4 للهوية والمختبر، 1.1–2.8 لل keyspace/structures، 3.1–3.5 لل internals، 4.1–4.7 لل caching، 5.1–5.4 لل atomicity، 6.1–7.3 لل memory/recovery، 10.1–10.4 لل Laravel و 11.1–11.5 للتشغيل. المراحل 8–9 و 12–15 و PubSub/Streams/modules اختيارية عند حاجة ومقدماتها؛ المرجع القديم ليس شرط إكمال بكامله مسبقًا. [REDIS_PROGRESS.md](../REDIS_PROGRESS.md) لا تُنسخ درجاته و لا يتغير إلا تحت دليل جلسة مالكة.

## تشغيل الجلسة والتقدم

اقرأ README.md و COMMON_RULES.md وهذا الملف وملف PROGRESS المجاور كاملين. اشرح بالعامية المصرية الطبيعية: المشكلة ثم الفكرة وآليتها ثم تجربة صغيرة وتوقع الناتج قبل التنفيذ. مفهوم واحد وسؤال واحد كل مرة؛ لا تعرض حل المحاولة المستقلة قبل محاولة الطالب. كل عنوان فرعي وحدة شرح، وليس درسًا موسوعيًا في رسالة واحدة.

الـ IDs المحلية تقيس أدلة هذا المنهج فقط. ملفات study القديمة مراجع وتعميق وليست شرط إتمام كامل قبل العبور. لا تنسخ درجاتها، ولا تعتبر نجاح بوابة محلية نجاحًا تلقائيًا في نقطة قديمة. إن اختار الطالب دراسة المالك كاملًا، اقرأ منهجه وتقدمه والتزم بترتيبه؛ سجل الربط دون ازدواج النتائج.

حدّث التقدم المحلي وفق الدليل الحقيقي: checkpoint والعنوان الفرعي وآخر تمرين مكتمل والخطوة غير المكتملة والاختبارات والفجوات. شرط النجاح 80% على الأقل مع أدلة مستقلة وإصلاح أخطاء الأمان أو صحة البيانات الجوهرية. المتقدم الاختياري لا يعطل بوابة الأساس، ولا يسجل Passed أو درجة وهمية إن لم يُدرس. لا نشر أو commit أو push أو تعديل لتقدم مسار قديم تلقائيًا.
