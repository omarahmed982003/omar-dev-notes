# Backend & Solution Architect Study Map

هذا هو المرجع المركزي لمسار دراسة Yousef Ahmed من Senior Backend Developer إلى Staff/Software/Solution Architect.

وظيفته تسجيل المسارات الموجودة والناقصة، منع ضياع الموضوعات أوتكرارها بلا داعٍ، تحديد الملف المتخصص الذي يملك كل موضوع، وترتيب الدراسة حسب الاعتماد والأولوية.

> آخر مراجعة: 2026-09-19 — تمت مراجعة 18 ملف Master/Progress/Projects.

## نظام الملفات

لكل مسار تعليمي كامل:

1. `Master Prompt`: المنهج، طريقة التدريس، التمارين، المشاريع ومعيار النجاح.
2. `Progress`: نقطة التوقف، الدرجات، الأدلة، الأخطاء، المراجعات وسجل الجلسات.
3. `Projects/Ideas` عند الحاجة: تطبيقات Portfolio منفصلة عن التقدم الدراسي.

## الملفات الموجودة فعليًا

| # | المسار | Master / Content | Progress | الحالة |
|---:|---|---|---|---|
| 1 | Git | `Git_Master_Prompt.md` | `GIT_PROGRESS.md` | موجود؛ نسخة المشروع من Progress أقدم من النسخة المركزية بجلسة |
| 2 | OOP, SOLID & Patterns | `OOP_Master_Prompt.md` | `OOP_PROGRESS.md` | موجود ومكتمل بنيويًا |
| 3 | Database Engineering | `Database_Master_Prompt.md` | `DATABASE_PROGRESS.md` | موجود ومكتمل بنيويًا |
| 4 | Laravel SQL / Query Builder / Eloquent | `Laravel_SQL_QueryBuilder_Eloquent_Master_Prompt.md` | `LARAVEL_QUERY_PROGRESS.md` | موجود ومكتمل بنيويًا |
| 5 | Algorithms & Data Structures | `Algorithms_Data_Structures_Master_Prompt.md` | `ALGORITHMS_DATA_STRUCTURES_PROGRESS.md` | موجود وآخر توسعة Senior/Staff مضافة |
| 6 | Redis & Caching at Scale | `Redis_Caching_At_Scale_Master_Prompt.md` | `REDIS_PROGRESS.md` | موجود وآخر إضافات Production مضافة |
| 7 | Authentication & Authorization | `AUTHENTICATION_AUTHORIZATION_MASTER_PROMPT.md` | `AUTHENTICATION_AUTHORIZATION_PROGRESS.md` | موجود ومكتمل بنيويًا |
| 8 | System Design | `SYSTEM_DESIGN_MASTER_PROMPT.md` | `SYSTEM_DESIGN_PROGRESS.md` | موجود ومكتمل بنيويًا |
| 9 | GitHub Engineering Portfolio | `GITHUB_PORTFOLIO_PROJECT_IDEAS.md` | `GITHUB_PORTFOLIO_PROGRESS.md` | موجود؛ ملف مشروعات وليس كورسًا تقليديًا |

## نتيجة مراجعة سلامة الملفات

- عدد الملفات المراجعة: 18.
- لا يوجد Master Prompt مقطوع في منتصف قسم أوجملة.
- `Algorithms` و`Redis` Master/Progress مطابقون للنسخ المصححة الأخيرة.
- Database وOOP وLaravel Query وAuthentication وSystem Design وPortfolio مطابقون للنسخ المركزية من حيث الحجم والبنية.
- `GIT_PROGRESS` في مجموعة المشروع قديم: يقف عند `Checkpoint 0.3 — Installing and Configuring Git`، بينما النسخة الأحدث نجحت في0.3 بدرجة 90% وتقف عند `Checkpoint 0.4 — Terminal, Shell, and Git Bash`.
- أشكال Progress غير موحدة تمامًا: بعضها يتابع كل Checkpoint وبعضها يتابع Phase كاملة. هذا لا يفسد الدراسة، لكنه يحتاج Standard موحد لاحقًا.

# خريطة التغطية الحالية

## 1. Git — موجود

- internals، objects، refs وHEAD.
- branching، merge، rebase وconflicts.
- remotes، team workflows، undo وrecovery.
- worktree، bisect، blame، grep، filter-repo، signing، hooks وCI/CD.
- security، maintenance وproduction workflows.

## 2. OOP, SOLID & Design Patterns — موجود

- classes/objects وعلاقات الـobjects.
- inheritance، polymorphism، abstraction وcontracts.
- PHP type system وadvanced OOP.
- SOLID، code smells، patterns وtesting.
- Laravel OOP ومشروع نهائي.

## 3. Database Engineering — موجود

- relational model، SQL وdata modeling.
- storage internals، indexes، optimizer وexecution plans.
- transactions، locks، MVCC، deadlocks وconcurrency.
- zero-downtime migrations، replication، HA، partitioning وsharding.
- CAP، distributed data، OLAP، ClickHouse، warehouse، CDC وlakehouse.
- POS reporting، billion-row design، security وoperations.
- wallets، ledgers، holds، refunds، reversals وreconciliation.

## 4. Laravel Data Access — موجود

- SQL قبل ORM، Query Builder وEloquent.
- العلاقات العادية والمتقدمة وpolymorphic relations.
- eager loading، N+1، transactions، locks وconsistency.
- performance واختيار SQL/Builder/Eloquent.

## 5. Algorithms & Data Structures — موجود

- complexity وPHP runtime costs.
- core structures والخوارزميات.
- intervals، two-heaps، balanced trees وgraph variants.
- string matching، bit manipulation وessential math.
- LSM trees، inverted indexes، probabilistic structures وMerkle trees.
- consistent hashing، geospatial structures، ring buffers وlogs.
- concurrent structures وCRDT introduction.
- correctness/property/differential/stress/mutation testing.
- production-oriented projects.

## 6. Redis & Caching at Scale — موجود

- structures، internals، memory، expiration وeviction.
- caching patterns، invalidation، atomicity، Lua/functions وlocks.
- RDB/AOF، recovery، replication، Sentinel، Cluster وsharding.
- Pub/Sub، Keyspace Notifications، Streams وdelivery limits.
- RESP3 client-side caching و`WAIT` trade-offs.
- testing، upgrades، migrations وoperations.
- RedisJSON، Search، TimeSeries وRedis vs Memcached.
- 50M leaderboard وproduction case studies.

## 7. Authentication & Authorization — موجود

- sessions، cookies، tokens وpassword storage.
- Laravel authentication/authorization وJWT.
- OAuth 2.0، OpenID Connect وPKCE.
- API keys، service identity وwebhook verification.
- RBAC/ABAC، multi-tenancy، revocation وsecurity failures.

## 8. System Design — موجود

- requirements، estimation، APIs، data models وhigh-level design.
- caching، load balancing، replication، partitioning وasync work.
- reliability، security، observability وcost trade-offs.
- design drills وأنظمة متنوعة.

## 9. GitHub Engineering Portfolio — موجود

- مشروعات تعرض Backend/System Design/Database/Redis/Integrations.
- README، diagrams، ADRs، tests، benchmarks وrunbooks.
- تحويل الدراسة إلىevidence يمكن عرضه للشركات والعملاء.

# المسارات الناقصة

هذه الموضوعات قد تظهر كأجزاء صغيرة داخل الملفات الحالية، لكنها لا تملك حتى الآن Master Prompt وProgress مستقلين يغطيانها من الأساس إلىProduction.

## أولوية A — الأساس الناقص

### 1. Operating Systems for Backend Engineers

- processes، threads، scheduling وcontext switching.
- virtual memory، stack/heap، pages وswap.
- syscalls، file descriptors، filesystems وbuffering.
- blocking/non-blocking I/O، event loops وasync models.
- locks، semaphores، deadlocks وmemory visibility.
- PHP-FPM، workers، Octane/Swoole وcontainers.

### 2. Computer Networks & Web Protocols

- OSI/TCP-IP، IP، subnetting، routing، NAT وports.
- ARP، DHCP، DNS وnetwork troubleshooting.
- TCP، UDP، TLS وconnection lifecycle.
- HTTP/1.1، HTTP/2، HTTP/3، WebSocket وSSE.
- proxies، load balancers، CDN وconnection pooling.
- timeouts، retries، keep-alive، MTU وpacket loss.
- تتبع request منclient إلىCloudflare/Nginx/PHP/DB.

### 3. Advanced PHP Runtime & Laravel Internals

- Zend Engine، zval، references، copy-on-write وgarbage collection.
- opcache، JIT وحدوده، memory profiling وComposer autoloading.
- PHP-FPM lifecycle، worker sizing وrequest isolation.
- container، providers، boot cycle، middleware وfacades internals.
- events، queues، scheduler وexception pipeline internals.
- long-running workers، state leaks وOctane safety.

### 4. Queues, Messaging & Event-Driven Systems

- RabbitMQ، Kafka، Redis Streams وLaravel queues.
- partitions، ordering، consumer groups وoffsets.
- delivery semantics وexactly-once claims.
- ack/nack، retry، backoff، jitter، DLQ وpoison messages.
- idempotent consumers، outbox/inbox وreplay.
- backpressure، schema evolution وevent versioning.
- saga، event sourcing وCQRS بحدود واضحة.

### 5. Testing & Reliability Engineering

- unit، integration، feature، contract وend-to-end tests.
- test doubles وحدود mocks/fakes.
- concurrency، database، queue، webhook وfailure testing.
- property-based، mutation وconsumer-driven contracts.
- load، stress، spike، soak وchaos testing.
- backup/restore drills وrelease confidence.

## أولوية B — الانتقال من Senior إلىStaff

### 6. API Design & Integration Engineering

- REST resource modeling وerror contracts.
- pagination، filtering، sorting، versioning وcompatibility.
- idempotency، signing، replay protection وwebhooks.
- retries، timeout budgets، circuit breaker، bulkhead وfallback.
- SDK design، contract testing وprovider certification.
- integration observability، reconciliation وrunbooks.

> Authentication موجود، لكنه لا يغطي API/Integration Engineering بالكامل.

### 7. Security Engineering

- threat modeling وsecure design review.
- OWASP Web/API Top 10.
- SQLi، XSS، CSRF، SSRF، deserialization، traversal وcommand injection.
- secrets، encryption، key rotation وsecure logging.
- tenant isolation، supply-chain security وdependency scanning.
- incident response وsecurity testing.

> ملف Authentication يغطي identity/access فقط، وليس Security Engineering كاملًا.

### 8. Clean Architecture, DDD & Modular Systems

- boundaries، dependency direction وports/adapters.
- entities، value objects، aggregates وdomain services.
- domain events، repositories وapplication services.
- bounded contexts وcontext mapping.
- modular monolith وmicroservices extraction.
- anti-corruption layer ومنع overengineering.

> ملف OOP يغطي SOLID وpatterns، لكنه لا يغطي DDD/architecture كاملة.

### 9. Concurrency & Distributed Systems

- race conditions، atomicity، CAS وlock correctness.
- logical clocks، ordering وdistributed time.
- replication، quorum، consensus وleader election.
- CAP/PACELC، partitions، split brain وfencing.
- distributed transactions، sagas وreconciliation.
- multi-region design وdisaster scenarios.

> Database وRedis وSystem Design تحتوي أجزاء منه، لكن المسار يحتاج معالجة مترابطة مستقلة.

### 10. Linux, Containers, Cloud & Delivery

- Linux processes، permissions، filesystem، networking وdiagnostics.
- Bash، systemd، cron، signals وresource limits.
- Nginx وPHP-FPM production configuration.
- Docker، Compose، Kubernetes fundamentals.
- CI/CD، zero-downtime deployment، rollback وfeature releases.
- AWS/IAM، networking وInfrastructure as Code.

### 11. Observability, Performance & SRE

- structured logs، metrics، traces وOpenTelemetry.
- RED/USE methods وcorrelation.
- p50/p95/p99، throughput، saturation وtail latency.
- profiling، memory leaks وcapacity planning.
- SLI/SLO/SLA، error budgets وalert quality.
- incidents، runbooks، postmortems وreliability reviews.

## أولوية C — Architect & Leadership

### 12. Software & Solution Architecture

- business capabilities إلىtechnical boundaries.
- quality attributes وarchitecture styles.
- C4، sequence، deployment وdata-flow diagrams.
- ADRs وarchitecture fitness functions.
- build vs buy، managed vs self-hosted، cost/risk/compliance.
- migration roadmaps، strangler pattern وgovernance.

> System Design يغطي تصميم أنظمة؛ Solution Architecture يضيف business alignment، governance وmigration.

### 13. Technical Leadership

- code/design reviews ورفع معايير الفريق.
- mentoring، delegation وtechnical communication.
- discovery، estimation، planning وprioritization.
- technical debt وlegacy modernization.
- incident leadership وcross-team coordination.
- RFCs، decision-making وقياس أثر القرارات.

# ترتيب التنفيذ المقترح المحدّث

لا يلزم إنهاء مسار كامل قبل لمس الآخر، لكن يوجد Primary Track واحد مع Supporting Track خفيف.

## تثبيت الأساس

1. Git.
2. OOP/SOLID.
3. Database Engineering.
4. Laravel Data Access.
5. Algorithms بصورة منتظمة بالتوازي.

## فهم runtime والاتصال

6. Operating Systems.
7. Computer Networks.
8. Advanced PHP & Laravel Internals.

## الأنظمة الإنتاجية

9. Redis & Caching.
10. Queues/Messaging/Event-Driven Systems.
11. API Design & Integrations.
12. Authentication/Authorization.
13. Testing & Reliability.
14. Security Engineering.

## Staff Engineering

15. Clean Architecture & DDD.
16. Concurrency & Distributed Systems.
17. System Design.
18. Linux/Containers/Cloud/Delivery.
19. Observability/Performance/SRE.

## Architect/Lead

20. Software & Solution Architecture.
21. Technical Leadership.
22. بناء GitHub Portfolio تدريجيًا من المشاريع المكتملة، وليس بعد انتهاء الدراسة كلها.

# بروتوكول تنمية التفكير

كل Checkpoint أوCase Study يمر قدر الإمكان بالآتي:

1. سؤال أوprediction قبل الشرح.
2. تحديد functional وnon-functional requirements.
3. تحديد operations، constraints وscale.
4. تحديد source of truth والinvariants.
5. تصميم أوحل أولي من الطالب.
6. مناقشة correctness والtrade-offs.
7. رفع الحمل ×10 ثم×100.
8. إدخال concurrency، duplicate أوout-of-order input.
9. إسقاط component أوقطع الشبكة.
10. مناقشة recovery، observability وsecurity.
11. تنفيذ أوتجربة عملية.
12. سؤال Senior ثمStaff/Architect.
13. تسجيل دليل الفهم داخل Progress.

# الأسئلة العقلية الثابتة

- ما الحجم الآن وبعد سنة؟
- ما مصدر الحقيقة وما الـinvariants؟
- ماذا يحدث مع التزامن، التكرار والترتيب الخاطئ؟
- ماذا يحدث إذا سقط السيرفر وسط العملية أوانقطعت الشبكة؟
- هل العملية idempotent وقابلة للretry؟
- أين يمكن فقد أوتكرار البيانات؟
- كيف نكتشف العطل ونستعيد أونعيد بناء البيانات؟
- ما تكلفة الحل وتعقيده التشغيلي؟
- متى يكون الحل الأبسط أفضل؟
- كيف أثبت صحة القرار بالmetrics/tests/experiments؟

# قواعد الحفظ والتحديث

- لا نعتمد على ذاكرة المحادثة لتحديد المنهج أوموضع التوقف.
- هذا الملف هو المصدر المركزي لحالة خريطة المسارات، وليس لحالة التقدم داخل الدروس.
- كل Master Prompt هو المصدر لمنهج وتحديات مساره.
- كل Progress هو المصدر الوحيد لحالة تقدم ذلك المسار.
- لا نسجل مسارًا على أنه موجود إلا إذا وُجد ملفه فعلًا وتمت مراجعة بنيته.
- وجود موضوع داخل مسار آخر لا يعني اكتمال المسار المتخصص.
- أي فكرة جديدة تُضاف إلىالملف المتخصص أولًا، ثم تُحدّث حالة الخريطة عند الحاجة.
- الحد الأدنى لأي Progress: Current Position، checkpoint-level status، score، evidence، mistakes، review queue، session log وnext action.
