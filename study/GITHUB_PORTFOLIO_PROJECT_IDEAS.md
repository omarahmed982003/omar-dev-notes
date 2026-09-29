# GitHub Portfolio Project Ideas — Backend / Laravel

## الهدف من الملف

هذا الملف ليس قائمة مشاريع للتدريب فقط. الهدف أن يتحول GitHub الخاص بي إلى دليل عملي على أنني Senior Backend Developer قادر على تصميم أنظمة حقيقية، التعامل مع المشاكل الإنتاجية، وشرح قراراته الهندسية للشركات والعملاء.

التخصص المستهدف:

- Laravel وPHP Backend
- APIs وIntegrations وWebhooks
- SaaS وMulti-tenancy
- Databases وRedis وQueues
- Payments وWallets
- Observability وSystem Design

القاعدة الأساسية: 3–5 مستودعات قوية ومكتملة أفضل كثيرًا من 30 مستودع CRUD متشابه.

---

## كيف أستخدم هذا الملف

عند بدء أي مشروع:

1. اختر مشروعًا واحدًا من Tier 1.
2. ابدأ بنسخة MVP صغيرة تعمل من البداية للنهاية.
3. افتح Issues للمراحل التالية بدل بناء كل شيء دفعة واحدة.
4. لكل ميزة: Issue → Branch → Commits واضحة → Pull Request → Tests → Merge.
5. وثّق القرارات والمقايضات، وليس طريقة التشغيل فقط.
6. انشر Demo أو API docs إن أمكن.
7. لا تضع أسرارًا أو كود شركة أو بيانات عملاء حقيقية.

---

# Tier 1 — المشاريع الأساسية التي يجب أن تظهر في البروفايل

## 1. Integration Hub — منصة موحدة للتكاملات

فكرة قريبة من خبرتي الحقيقية ولكن بتنفيذ مستقل ومفتوح المصدر: منصة تربط التاجر بعدة مزودين خارجيين من خلال Contract موحد.

### النسخة الأولى

- تعريف Providers متعددين باستخدام Adapter/Strategy.
- مزامنة Catalog أو Menu وهمي.
- استقبال Webhooks والتحقق من التوقيع.
- Idempotency لمنع تكرار الحدث.
- Outgoing request log مع إخفاء الأسرار.
- Retry وexponential backoff.
- Dashboard أو API لإظهار النجاح والفشل والـlatency.

### ما يثبته المشروع

- تصميم integrations قابلة للتوسع.
- Resilience وfailure handling.
- Queues وrate limits وtimeouts.
- Observability وdebugging.
- Clean Architecture عملي بدون تعقيد زائد.

### Stretch Goals

- Circuit breaker.
- Dead-letter queue.
- Replay آمن للـwebhooks.
- Per-tenant credentials encryption.
- OpenTelemetry traces.

اسم مقترح: `laravel-integration-hub`.

---

## 2. Production Wallet Engine

محرك Wallet حقيقي، وليس جدول balance فقط.

### السيناريوهات المطلوبة

- Credit وDebit.
- Refundable وNon-refundable balances.
- Hold → Confirm أو Release.
- Partial payment بين المحفظة وبوابة دفع.
- Refund كامل وجزئي.
- Idempotency key لكل عملية مالية.
- Ledger immutable بدل تعديل التاريخ.
- Concurrency safety باستخدام transactions وrow locks أو optimistic locking.
- Reconciliation job واكتشاف عدم التطابق.

### اختبارات إجبارية

- طلبان يخصمان الرصيد نفسه بالتزامن.
- Webhook مكرر.
- فشل بوابة الدفع بعد إنشاء hold.
- انتهاء مدة hold.
- Refund بعد استهلاك جزء من الرصيد.

### ما يثبته المشروع

- Database transactions.
- Financial correctness.
- State machines.
- Race conditions.
- Testing للـbusiness rules الصعبة.

اسم مقترح: `laravel-wallet-ledger`.

---

## 3. Multi-tenant SaaS Starter — نسخة هندسية تعليمية

Starter صغير لكنه production-minded لتطبيق SaaS متعدد المستأجرين.

### النطاق

- Tenant resolution عن طريق subdomain أو header.
- مقارنة shared database وdatabase-per-tenant في ADR.
- Roles وpermissions داخل كل tenant.
- Tenant-scoped jobs وevents وcache keys.
- Per-tenant rate limiting.
- Audit log.
- Invitation flow.
- Tenant onboarding وoffboarding.
- اختبارات تمنع data leakage بين tenants.

### ما يثبته المشروع

- فهم حدود البيانات والأمان.
- Laravel lifecycle وqueues وcache.
- Architecture decisions مبنية على trade-offs.

اسم مقترح: `laravel-saas-tenancy-lab`.

---

## 4. OAuth 2.0 / OIDC Identity Lab

مشروع مرافق لملف دراسة الـAuthentication: Authorization Server تعليمي + API Resource Server + عميل Web/CLI.

### التدفقات

- Authorization Code + PKCE.
- Client Credentials.
- Refresh token rotation.
- Token revocation.
- OIDC ID token والتحقق من `nonce`.
- Scopes وconsent screen.
- JWKS وkey rotation.

### المطلوب توثيقه

- لماذا Implicit Flow لم يعد الاختيار المناسب.
- الفرق بين access token وID token.
- لماذا لا يُستخدم JWT لمجرد أنه مشهور.
- threat model وsecurity checklist.

اسم مقترح: `oauth2-oidc-lab`.

---

## 5. Reliable Order Processing System

API لمعالجة الطلبات يوضح كيف نحافظ على الاتساق بين أكثر من خدمة.

### المكونات

- Orders وInventory وPayments كموديولات منفصلة.
- Outbox pattern.
- Idempotent consumers.
- Saga choreography أوorchestration مع توضيح الاختيار.
- Retry وDLQ.
- Event versioning.
- Correlation ID.
- Failure injection لاختبار الأعطال.

### ما يثبته المشروع

- Event-driven architecture.
- Eventual consistency.
- التفكير في failures بدل happy path فقط.

اسم مقترح: `reliable-order-processing`.

---

# Tier 2 — مشاريع مركزة تكمل الصورة

## 6. Redis at Scale Lab

- Leaderboard بملايين اللاعبين باستخدام Sorted Sets.
- Tie breakers واضحة.
- Distributed locks مع شرح المخاطر.
- Rate limiter: fixed window وsliding window وtoken bucket.
- Cache-aside ومنع cache stampede.
- Pub/Sub مقابل Streams.
- قياس memory وlatency وhot keys.

## 7. Webhook Gateway

- استقبال webhooks من عدة مزودين.
- HMAC verification وtimestamp tolerance.
- Deduplication وreplay protection.
- Async processing وDLQ.
- إعادة إرسال الأحداث من dashboard آمن.
- توليد test events للمطورين.

## 8. API Performance & Observability Lab

- Laravel API مع endpoints بأحمال مختلفة.
- Artillery أوk6 scenarios.
- Prometheus metrics وGrafana dashboard.
- Structured logs وtrace IDs.
- مقارنة FPM وOctane في ظروف عادلة.
- Performance report يوضح bottleneck وكيف تم إثباته.

## 9. Search and Reporting Pipeline

- مصدر معاملات في MySQL/PostgreSQL.
- CDC أوincremental ETL إلى analytical store.
- تقارير على ملايين الصفوف.
- مقارنة OLTP وOLAP.
- Late events وdeduplication وrebuild strategy.

## 10. Feature Flags Service

- Boolean وpercentage rollout.
- Targeting حسب tenant/user attributes.
- Audit history.
- Deterministic bucketing.
- SDK بسيط وfallback عند تعطل الخدمة.

---

# Tier 3 — Libraries وPackages صغيرة مفيدة

هذه لا تستبدل المشاريع الكبيرة، لكنها تظهر جودة التصميم وإمكانية إعادة الاستخدام.

- Laravel package للـidempotency middleware.
- Package للتحقق من webhook signatures لعدة providers.
- Money value object يدعم العملات والrounding بأمان.
- Tenant-aware queue middleware.
- Sensitive data redaction للlogs.
- API response/problem-details package وفق RFC 9457.
- Retry policy package مع exponential backoff وjitter.
- Health checks package للdatabase وRedis والqueue.

---

# قالب تنفيذ أي Repository

## 1. README يجب أن يجيب عن

- ما المشكلة التي يحلها المشروع؟
- ما الحدود التي لا يحاول المشروع حلها؟
- كيف أشغله خلال دقائق؟
- ما أهم architectural decisions؟
- كيف اختُبر؟
- كيف أرى API أوdemo؟
- ما القيود الحالية والخطوات التالية؟

## 2. الملفات المهمة

- `README.md`
- `LICENSE`
- `.env.example` بدون أسرار
- `docker-compose.yml` أوطريقة تشغيل موحدة
- `CONTRIBUTING.md`
- `SECURITY.md`
- `CHANGELOG.md` عند وجود releases
- `docs/architecture.md`
- `docs/threat-model.md` للمشاريع الأمنية
- `docs/adr/` لقرارات التصميم
- OpenAPI/Postman collection للـAPIs

## 3. جودة الكود

- Linting وstatic analysis.
- Unit وintegration وfeature tests.
- CI يشغل الاختبارات والتحليل.
- Database migrations وseeded demo data.
- لا توجد credentials أوtokens في history.
- Exceptions ورسائل الأخطاء واضحة.
- Pagination وvalidation وauthorization.

## 4. دليل على طريقة العمل

- Issues مكتوبة باحتراف.
- Pull Requests تشرح لماذا وكيف تم الاختبار.
- Commits صغيرة نسبيًا وبأسماء مفهومة.
- Releases وtags للمراحل المهمة.
- Project board بسيط: Backlog / In Progress / Done.

---

# قالب README مختصر

```md
# Project Name

One-sentence value proposition.

## Problem
## Architecture
## Key Engineering Decisions
## Features
## Quick Start
## API Documentation
## Testing
## Security
## Observability
## Performance Results
## Trade-offs and Limitations
## Roadmap
## License
```

---

# ترتيب التنفيذ المقترح لي

بناءً على خبرتي في Laravel والـintegrations والـmulti-tenancy:

1. `laravel-integration-hub` — المشروع الرئيسي المثبّت Pin.
2. `laravel-wallet-ledger` — يثبت قوة الـbusiness logic والdatabase.
3. `oauth2-oidc-lab` — يثبت الفهم الأمني.
4. Package صغير للـidempotency أوwebhook verification.
5. `redis-at-scale-lab` أو`reliable-order-processing` حسب وقتي.

لا أبدأ الخمسة معًا. أكمل أول مشروع إلى حالة يمكن لشخص غريب تشغيلها وفهمها، ثم انتقل للثاني.

---

# خطة 12 أسبوعًا واقعية

## الأسابيع 1–2

- تنظيف GitHub profile.
- Profile README واضح.
- اختيار المشروع الرئيسي.
- كتابة scope وarchitecture sketch و10–15 issues.
- بناء happy path وتشغيل CI.

## الأسابيع 3–5

- إضافة failures وretries وidempotency.
- كتابة integration tests.
- توثيق architecture وADRs.
- نشر API docs أوdemo.

## الأسبوع 6

- Performance/security review.
- Release `v1.0.0`.
- كتابة case study قصيرة وربطها بالrepository.

## الأسابيع 7–10

- المشروع الثاني: Wallet Engine.
- التركيز على concurrency والledger والاختبارات.

## الأسابيع 11–12

- OAuth lab أوpackage صغير.
- ترتيب pinned repos والـprofile النهائي.

---

# GitHub Profile Checklist

- صورة واسم ووصف مهني وروابط صحيحة.
- Profile README مختصر يوضح التخصص والإنجازات.
- 4–6 pinned repositories فقط.
- كل repository مثبت له صورة اجتماعية ووصف وtopics.
- اللغة الإنجليزية واضحة وبسيطة؛ يمكن إضافة شرح عربي منفصل.
- contribution graph طبيعي ناتج عن تقدم حقيقي، لا commits مصطنعة.
- لا توجد forks أوtutorials عادية ضمن الـpinned repos.
- الروابط والديمو والتعليمات تعمل من حساب جديد.

---

# ما لا يستحق الوقت كبطل للبروفايل

- To-do app تقليدي.
- Blog CRUD بلا تحدٍ هندسي.
- نسخ tutorial حرفيًا.
- مشروع ضخم غير مكتمل ولا توجد طريقة تشغيل.
- عدد كبير من repositories الفارغة.
- إخفاء كل القرارات داخل الكود دون documentation.
- خلط كود شركة أوclient data داخل مشروع عام.

---

# Definition of Done للمشروع القابل للإرسال للشركات

- يعمل من clone جديد بتعليمات واضحة.
- CI أخضر.
- لديه tests للhappy path والفشل والتزامن حيث يلزم.
- README يشرح المشكلة والقرارات والقيود.
- يوجد diagram واحد مفيد على الأقل.
- لا توجد secrets أوبيانات مملوكة لجهة عمل.
- لديه release ثابت.
- يمكنني شرحه في مقابلة خلال 5 دقائق ثم التعمق لمدة 30 دقيقة.
- أستطيع الدفاع عن كل trade-off بدل القول: «عملتها لأن tutorial قال كده».

---

# Prompt للعمل مع Codex على كل مشروع

```text
أنت تعمل معي كـSenior Backend Mentor وCode Reviewer، لا كمولد كود سريع.

المشروع: [اسم المشروع]
المرحلة الحالية: [MVP / hardening / testing / documentation]
الهدف من هذه الجلسة: [هدف واحد فقط]

قبل التعديل:
1. افحص AGENTS.md والملفات المرتبطة.
2. لخّص فهمك للمشكلة والقيود.
3. اقترح أصغر تغيير متكامل يمكن اختباره.

أثناء التنفيذ:
- لا تضف abstraction بلا حاجة مثبتة.
- حافظ على security وidempotency وobservability.
- أضف أوحدّث الاختبارات المناسبة.
- اشرح trade-offs باختصار.

بعد التنفيذ:
- شغّل الاختبارات والتحليل المناسب.
- اذكر الملفات المتغيرة.
- اكتب اقتراح commit message وPR description.
- أخبرني بما يجب أن أستطيع شرحه بنفسي في المقابلة.
```

---

# مؤشر النجاح

البروفايل ناجح عندما يستطيع مهندس أوRecruiter فتحه وفهم هذه الرسالة سريعًا:

> هذا المطور لا يعرف Laravel syntax فقط؛ هو يفهم البيانات، الفشل، الأمان، التكاملات، والأنظمة الإنتاجية، ويستطيع توصيل قراراته بوضوح.
