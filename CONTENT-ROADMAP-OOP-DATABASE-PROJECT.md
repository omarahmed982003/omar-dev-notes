# خطة المحتوى المؤجل: OOP وقواعد البيانات والمشروع التطبيقي

هذا الملف يجمع المقترحات التي **لم تُضف إلى الدوكس حاليًا** بناءً على القرار بإبقاء أقسام OOP وقواعد البيانات كما هي، وتأجيل المشروع التطبيقي.

## أولًا: إضافات مقترحة لقسم OOP

### 9. مبادئ SOLID بالتطبيق

اسم ملف مقترح: `09-solid-principles.md`

- **Single Responsibility:** فصل الحساب والإرسال والتخزين بدل class ضخمة.
- **Open/Closed:** إضافة strategy جديدة دون تعديل conditional مركزي.
- **Liskov Substitution:** تصميم contract تستطيع implementations احترامها دون مفاجآت.
- **Interface Segregation:** interfaces صغيرة حسب capability.
- **Dependency Inversion:** اعتماد منطق التطبيق على abstractions وربط implementations خارجيًا.
- لكل مبدأ: مثال سيئ، سبب المشكلة، refactoring، واختبار يثبت السلوك.
- توضيح أن SOLID أدوات لاتخاذ قرار وليست قواعد لزيادة عدد interfaces.

### 10. Value Objects وEntities وDTOs

اسم ملف مقترح: `10-value-objects-entities-dtos.md`

- Entity لها identity تستمر رغم تغير الخصائص.
- Value Object تُقارن بالقيمة وتكون immutable غالبًا.
- DTO لنقل بيانات بين boundary وطبقة التطبيق، وليس domain model.
- أمثلة: `Money` و`EmailAddress` و`OrderId` و`CreateOrderData`.
- منع primitive obsession وحماية invariants.
- Mapping بين HTTP Request وDTO وDomain وDatabase.
- الفرق بين serialization model وdomain object.

### 11. Design Patterns عملية

اسم ملف مقترح: `11-design-patterns.md`

- **Strategy:** تبديل سياسة الخصم أو الدفع.
- **Factory:** إنشاء implementation معقدة دون نشر تفاصيل الإنشاء.
- **Adapter:** توحيد بوابات دفع أو خدمات خارجية مختلفة.
- **Decorator:** إضافة caching/logging/retry حول contract.
- **Observer/Event Dispatcher:** فصل ردود الفعل مع توضيح حدود consistency.
- **State:** انتقال Order بين حالات مسموحة.
- **Repository:** contract للتخزين دون تحويله إلى طبقة CRUD عامة ضخمة.
- متى لا نستخدم pattern، وعلامات overengineering.

### 12. Domain Modeling

اسم ملف مقترح: `12-domain-modeling.md`

- اكتشاف invariants من قواعد العمل.
- Aggregate وAggregate Root بصورة مبسطة.
- حدود transaction حول aggregate.
- Domain Service عندما لا ينتمي السلوك إلى entity واحدة.
- Domain Events وتمييزها عن integration events.
- Anemic Domain Model مقابل Rich Domain Model.
- Ubiquitous Language وأسماء تعبر عن المجال.
- مثال Order/OrderItem/Payment مع حالات وانتقالات صحيحة.

### 13. اختبار التصميم الكائني

اسم ملف مقترح: `13-testing-object-design.md`

- الفرق بين Fake وStub وMock وSpy.
- اختبار السلوك العام بدل private methods.
- contract tests لكل implementation من interface.
- تجنب over-mocking وربط الاختبار بترتيب الاستدعاءات غير المهم.
- اختبار value objects وinvariants.
- استخدام Clock وID Generator وGateway كdependencies قابلة للاستبدال.
- اكتشاف مشاكل التصميم من صعوبة الاختبار دون جعل “قابلية الاختبار” الهدف الوحيد.

### 14. ميزات OOP الحديثة

اسم ملف مقترح: `14-modern-oop-features.md`

- Property Hooks في PHP 8.4.
- Asymmetric Property Visibility.
- Lazy Ghosts وVirtual Proxies واستخدامهما في DI/ORM.
- Attributes وReflection كmetadata.
- Clone With في PHP 8.5 وwith-er pattern.
- `#[Override]` و`#[Deprecated]` و`#[NoDiscard]`.
- Property final/asymmetric static visibility حسب إصدار PHP.
- Version badges وبدائل متوافقة للإصدارات الأقدم.

### تحسينات عرض قسم OOP

- إضافة رسم: Entity مقابل Value Object مقابل DTO.
- إضافة decision tree: Interface أم abstract class أم trait أم composition؟
- إضافة صفحة تمارين refactoring مع حلول منفصلة.
- ربط كل pattern بمشكلة حقيقية بدل تعريف حفظي.
- إصدار عربي وإنجليزي متطابق في الأمثلة والتحذيرات.

---

## ثانيًا: إضافات مقترحة لقسم قواعد البيانات

### 6. SQL من البداية

اسم ملف مقترح: `06-sql-fundamentals.md`

- `SELECT` و`INSERT` و`UPDATE` و`DELETE`.
- `WHERE` و`ORDER BY` و`LIMIT`.
- `INNER JOIN` و`LEFT JOIN` والفرق العملي.
- `GROUP BY` و`COUNT/SUM/AVG` و`HAVING`.
- Subqueries وCTEs.
- Window Functions مثل `ROW_NUMBER` و`SUM OVER`.
- NULL وthree-valued logic.
- استخدام parameters بدل دمج القيم.

### 7. تصميم البيانات والعلاقات

اسم ملف مقترح: `07-data-modeling-normalization.md`

- Cardinality: one-to-one وone-to-many وmany-to-many.
- Junction tables والقيود المناسبة.
- Natural keys مقابل surrogate keys.
- Normalization من 1NF إلى 3NF بأمثلة عملية.
- متى تستخدم denormalization بعد القياس.
- منع duplicate facts وupdate anomalies.
- Modeling للحذف والحالة والتاريخ.

### 8. أنواع البيانات والهوية

اسم ملف مقترح: `08-data-types-identifiers.md`

- Integer minor units مقابل `DECIMAL` للأموال، ولماذا `FLOAT` غير مناسب غالبًا.
- Auto-increment مقابل UUID/ULID والتأثير على indexes.
- `VARCHAR` و`TEXT` وحدود الطول الفعلية.
- Unicode وcollations وcase sensitivity.
- `DATE` و`TIMESTAMP` وسياسة UTC/timezone.
- JSON columns ومتى تصبح تهربًا من تصميم schema.
- Boolean وEnum/lookup tables حسب قاعدة البيانات.

### 9. Query Performance متقدم

اسم ملف مقترح: `09-query-performance.md`

- `EXPLAIN` و`EXPLAIN ANALYZE`.
- estimated rows مقابل actual rows.
- Composite index order وleftmost prefix.
- Covering indexes.
- Selectivity وcardinality.
- Sargable predicates وتجنب functions/casts على العمود المفهرس.
- Join algorithms بصورة مبسطة.
- Slow query log وp95/p99.
- قياس بيانات بحجم قريب من الإنتاج.

### 10. إدارة الاتصالات

اسم ملف مقترح: `10-connection-management.md`

- connect/query/statement timeouts.
- Persistent PDO connections ومخاطر session state والمعاملات المفتوحة.
- Connection pools واختلافها بين PHP-FPM والـworkers طويلة العمر.
- حماية قاعدة البيانات من worker count زائد.
- Read/write splitting وreplica lag.
- retry للاتصال دون تكرار transaction أوside effect.
- health checks لا تغرق قاعدة البيانات.

### 11. Backup وRecovery وReplication

اسم ملف مقترح: `11-backup-recovery-replication.md`

- Logical مقابل physical backup.
- Full/incremental وPoint-in-Time Recovery.
- RPO وRTO.
- تشفير النسخ ومفاتيحها.
- Restore drills؛ وجود backup لا يثبت إمكان الاسترجاع.
- Replication async وreplica lag وread-after-write.
- Failover وsplit-brain بصورة مفاهيمية.
- مراقبة storage وWAL/binlog والنسخ الفاشلة.

### 12. تكامل قاعدة البيانات مع الأنظمة

اسم ملف مقترح: `12-outbox-idempotency-consistency.md`

- Transactional Outbox بالتنفيذ الكامل.
- Inbox/deduplication للمستهلك.
- Idempotency keys للطلبات والدفعات.
- Eventual consistency وتوقعات الواجهة.
- Saga/compensation بصورة مبسطة.
- عدم استدعاء API داخل transaction طويلة.
- CDC ومتى يستخدم.
- reconciliation jobs لإصلاح الاختلافات.

### 13. أمن البيانات والخصوصية

اسم ملف مقترح: `13-database-security-privacy.md`

- Database users منفصلة وأقل صلاحية.
- منع الاتصال العام واستخدام TLS.
- تشفير at rest وfield-level encryption وحدود كل منهما.
- عدم تسجيل query parameters الحساسة.
- Row-level security عند دعمها مع عدم اعتبارها بديلًا لكل فحص.
- Data classification وretention وdeletion.
- Masking لبيئات الاختبار.
- Audit للعمليات الإدارية.

### تحسينات عرض قسم قواعد البيانات

- قاعدة بيانات تجريبية موحدة لكل الأمثلة: users/orders/products/payments.
- ER diagram عربي وإنجليزي.
- ملفات SQL قابلة للتشغيل بجوار الدروس.
- مقارنة MySQL/PostgreSQL عندما يختلف السلوك بدل تعميم واحد.
- تمارين فيها query خاطئة ثم `EXPLAIN` وتحسين.
- فصل SQL العام عن تفاصيل PDO/ORM.

---

## ثالثًا: المشروع التطبيقي المقترح

## الفكرة

مشروع **متجر مصغر ونظام طلبات** يربط المسارات الستة دون إدخال framework في البداية، ثم يمكن إضافة نسخة framework لاحقًا.

### النطاق الوظيفي

- تسجيل مستخدم وتأكيد البريد.
- Login وlogout وpassword reset وMFA اختيارية.
- أدوار Customer وSupport وAdmin.
- منتجات ومخزون وسلة وطلبات.
- دفع وهمي عبر Adapter.
- Webhook لتأكيد الدفع.
- إرسال receipt عبر queue.
- لوحة إدارة محمية بسياسات صلاحيات.
- API JSON مع pagination وidempotency.

### المراحل

1. **رحلة الطلب**
   - DNS/HTTP/TLS diagram.
   - Nginx إلى PHP-FPM.
   - Front Controller وRouter.

2. **PHP الأساسية**
   - Parsing وValidation.
   - Responses وأخطاء Problem Details.
   - Namespaces وComposer.

3. **OOP**
   - `Money` و`EmailAddress` و`OrderId` كـValue Objects.
   - `Order` كـEntity/Aggregate.
   - Payment Strategy/Adapter.
   - Repository interfaces وDI.

4. **قاعدة البيانات**
   - Schema وmigrations وconstraints.
   - PDO prepared statements.
   - transaction لإنشاء الطلب وحجز المخزون.
   - indexes وpagination وEXPLAIN.

5. **الأمان**
   - session hardening وCSRF وXSS.
   - password hashing وMFA.
   - RBAC + ownership + tenant boundary إن أضيف multi-tenancy.
   - rate limiting وaudit events.

6. **التشغيل**
   - PHPUnit وintegration tests.
   - PHPStan وcoding style.
   - Redis cache وqueue worker.
   - structured logs وrequest IDs.
   - CI/CD وcontainer وhealth endpoints.

### هيكل مقترح

```text
public/index.php
src/
  Domain/
  Application/
  Infrastructure/
  Http/
config/
migrations/
tests/
  Unit/
  Integration/
  Feature/
```

### مخرجات كل مرحلة

- شرح عربي وإنجليزي.
- Diagram.
- كود قابل للتشغيل.
- اختبار واحد على الأقل.
- أخطاء شائعة ونسخة غير آمنة للمقارنة.
- تمرين وتلميحات وحل منفصل.
- Checklist قبل الانتقال.

### معايير الإكمال

- لا توجد SQL غير parameterized.
- كل endpoint لها validation وauthorization.
- الأسرار خارج repository.
- الاختبارات والتحليل الساكن ينجحان.
- jobs idempotent وتملك retry policy.
- logs بلا tokens/passwords.
- migration وrollback/roll-forward موثقان.
- README تشغيل محلي وproduction notes.

## ترتيب التنفيذ عند اعتماد الخطة

1. إضافة دروس SQL Fundamentals وSOLID/Value Objects أولًا.
2. إنشاء schema وER diagram للمشروع.
3. تنفيذ المرحلة الأساسية بلا framework.
4. إضافة الأمان والاختبارات.
5. إضافة Redis/queue/observability/deployment.
6. ترجمة كل خطوة إلى الإنجليزية بالتوازي، لا بعد اكتمال العربية.

