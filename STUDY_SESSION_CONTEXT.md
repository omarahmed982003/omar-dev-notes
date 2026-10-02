# Study Session Context and Handoff

هذا الملف هو نقطة البداية المركزية لأي Session جديدة في هذا المشروع. وظيفته أن يوضح بسرعة:

- طبيعة المشروع ومسارات الدراسة الموجودة.
- الملفات التي يجب قراءتها قبل الشرح.
- آخر موضع مسجل لكل مسار.
- طريقة الشرح والتقييم والنشر.
- قواعد الفصل بين الدراسة الخاصة والدوكس العامة.

> **مهم:** هذا الملف بوابة توجيه وملخص للحالة، لكنه لا يستبدل ملفات المناهج والتقدم. ملف `Progress` الخاص بكل مسار هو المصدر الوحيد للحقيقة عن موضع التوقف والدرجة والأدلة والخطوة التالية. عند وجود تعارض، نتبع ملف `Progress` ثم نحدّث هذا الملخص.

## 1. ترتيب القراءة الإلزامي في Session جديدة

قبل بدء الشرح أو التقييم أو تعديل الدوكس:

1. اقرأ `AGENTS.md` كاملًا.
2. اقرأ هذا الملف كاملًا.
3. حدد المسار المطلوب من كلام الطالب.
4. اقرأ ملف `Master Prompt` الخاص بالمسار كاملًا.
5. اقرأ ملف `Progress` الخاص بالمسار كاملًا.
6. استخدم `planning/content-writing-guide.md` عند إنشاء أو مراجعة أي درس منشور.
7. قبل تعديل الدوكس، افحص `astro.config.mjs` وصفحة الـOverview والدروس والـsidebar الخاصة بالمسار نفسه.

لا تعتمد على ذاكرة المحادثة لتحديد نقطة التوقف، ولا تخلط ملفات أو تقدم أو دروس مسارين مختلفين.

## 2. طبيعة المشروع والبنية الفعلية

المشروع موقع تعليمي واحد مبني باستخدام Astro وStarlight، وداخله عدة مسارات مستقلة.

- الصفحات العربية موجودة مباشرة تحت `src/content/docs/<module>/...`.
- الصفحات الإنجليزية موجودة تحت `src/content/docs/en/<module>/...`.
- البنية الفعلية للمشروع مقدمة على المسارات الافتراضية المذكورة كأمثلة في التعليمات.
- يجب الحفاظ على اتجاه العربية والإنجليزية، والـlanguage switcher، والـsidebar، والروابط بين الصفحات.

الأوامر الموجودة في `package.json`:

```bash
npm run dev
npm run build
npm run preview
```

عند تشغيل خادم التطوير، جرّب أولًا أسلوب Astro المدعوم في الخلفية كما هو موضح في `AGENTS.md`. إذا لم يكن مدعومًا، استخدم scripts المشروع الحالية.

## 3. كيفية اختيار المسار النشط

يحدد الطالب المسار بذكر اسمه، مثل:

- `ابدأ Git` أو `Git Mode` أو `كمل Git`.
- `ابدأ OOP` أو `OOP Mode` أو `كمل OOP`.
- `ابدأ Database`.
- `ابدأ Laravel Query`.
- `ابدأ Algorithms`.
- `ابدأ Redis`.
- `ابدأ Authentication`.
- `ابدأ System Design`.
- `ابدأ Portfolio`.

بعد اختيار المسار، يظل هو المسار النشط حتى يطلب الطالب التحول صراحة إلى مسار آخر.

إذا قال الطالب `ابدأ` أو `كمل` فقط، ولم يكن هناك مسار نشط واضح في المحادثة الحالية، اسأله سؤالًا واحدًا: **عايز نبدأ أي مسار؟**

لا تفسر أوامر النشر على أنها أوامر دراسة:

- `اعمل درس ...` أو `ضيفه في الدوكس` تعني تنفيذ محتوى عام وفق شروط النشر.
- `عدّل ...` تعني تعديل الدوكس الموجودة في المسار المحدد فقط.
- الدراسة لا تعدّل الدوكس تلقائيًا.

## 4. الحالة الحالية المؤكدة

أكد الطالب بتاريخ 2026-10-02 أنه **لم يبدأ أي مسار من المسارات الموجودة**. لذلك نبدأ كل مسار من الموضع المسجل في ملف `Progress`، ولا نعتبر المراجعات أو الدروس القديمة دليل تقدم.

| المسار | الحالة الحالية | نقطة البداية المسجلة |
|---|---|---|
| Git | Not Started | Phase 0 — `0.1 Diagnostic Assessment` |
| OOP | Not Started | Phase 0 — `0.1 Diagnostic Assessment` |
| Database Engineering | Not Started | Phase 0 — `0.1 Diagnostic Assessment` |
| Laravel SQL / Query Builder / Eloquent | Not Started | Phase 0 — `0.1 Diagnostic Assessment` |
| Algorithms & Data Structures | Not Started | Phase 0 — `0.1 Diagnostic` |
| Redis & Caching at Scale | Not Started | Phase 0 — `0.1 Diagnostic Assessment` |
| Authentication & Authorization | Not Started | Module 0 — Identity vs Authentication vs Authorization |
| System Design | Not Started | Module 0 — Requirements, constraints and scope |
| GitHub Portfolio | Not Started | Repository foundation and MVP scope |

### ملاحظات تعارض قديمة لا يعتمد عليها

- `study/OOP_DIAGNOSTIC_REVIEW.md` مادة مراجعة خاصة قديمة، وليست مصدر تقدم. لا تغيّر حالة `OOP_PROGRESS.md` الحالية.
- `study/BACKEND_ARCHITECT_STUDY_MAP.md` يحتوي ملاحظة قديمة عن وصول Git إلى Checkpoint لاحق. لا تعتمد عليها؛ `study/GIT_PROGRESS.md` هو المرجع.
- وجود دروس منشورة سابقًا لا يعني أن الطالب نجح في Checkpoints المقابلة.

## 5. جدول الملفات المرجعية لكل مسار

| المسار | المنهج | التقدم |
|---|---|---|
| Git | `study/Git_Master_Prompt.md` | `study/GIT_PROGRESS.md` |
| OOP | `study/OOP_Master_Prompt.md` | `study/OOP_PROGRESS.md` |
| Database Engineering | `study/Database_Master_Prompt.md` | `study/DATABASE_PROGRESS.md` |
| Laravel Data Access | `study/Laravel_SQL_QueryBuilder_Eloquent_Master_Prompt.md` | `study/LARAVEL_QUERY_PROGRESS.md` |
| Algorithms & Data Structures | `study/Algorithms_Data_Structures_Master_Prompt.md` | `study/ALGORITHMS_DATA_STRUCTURES_PROGRESS.md` |
| Redis | `study/Redis_Caching_At_Scale_Master_Prompt.md` | `study/REDIS_PROGRESS.md` |
| Authentication & Authorization | `study/AUTHENTICATION_AUTHORIZATION_MASTER_PROMPT.md` | `study/AUTHENTICATION_AUTHORIZATION_PROGRESS.md` |
| System Design | `study/SYSTEM_DESIGN_MASTER_PROMPT.md` | `study/SYSTEM_DESIGN_PROGRESS.md` |
| GitHub Portfolio | `study/GITHUB_PORTFOLIO_PROJECT_IDEAS.md` | `study/GITHUB_PORTFOLIO_PROGRESS.md` |

المرجع المركزي لبقية الخطة والمسارات المقترحة مستقبلًا هو `study/BACKEND_ARCHITECT_STUDY_MAP.md`، لكنه ليس مصدرًا لحالة التقدم.

## 6. طريقة الشرح المشتركة

- استخدم عربيًا مصريًا بسيطًا وواضحًا ومحترمًا.
- اترك أسماء الأوامر والكود والـAPIs والمصطلحات التقنية بالإنجليزية.
- اشرح مصطلحًا جديدًا عند أول ظهوره: اسمه، معناه، وظيفته، ومثال صغير عند الحاجة.
- ابدأ بالمشكلة وسبب وجود الفكرة قبل الـsyntax.
- ابنِ Mental Model دقيقًا واشرح ما يحدث داخليًا قبل التركيز على الحفظ.
- اشرح مفهومًا رئيسيًا واحدًا في المرة الواحدة.
- اسأل سؤالًا واحدًا وانتظر إجابة الطالب.
- اطلب توقع النتيجة أو السلوك قبل التنفيذ عندما يكون ذلك مناسبًا.
- لا تعرض الحل الكامل للتمرين قبل محاولة الطالب، إلا إذا طلب الحل صراحة.
- صحح التصورات الخاطئة بوضوح ولا تكتفِ بقول إن الإجابة خطأ.
- اربط المفاهيم بـBackend وProduction وLaravel عندما يفيد ذلك، من غير أن يخفي Framework الأساس.
- ناقش البدائل والـtrade-offs وfailure modes، ولا تقدم تقنية أوPattern كحل سحري.
- راجع كود الطالب وأوامره ونتائج التنفيذ والصور قبل تسجيل دليل فهم.

التسلسل النموذجي داخل Checkpoint:

1. المشكلة أوScenario واقعي.
2. لماذا نحتاج المفهوم؟
3. Mental Model.
4. ما الذي يحدث داخليًا؟
5. مثال صغير أوأمر محدود.
6. توقع النتيجة.
7. تفكيك التنفيذ والنتيجة.
8. مثال Backend أوProduction.
9. خطأ شائع أوتصميم سيئ.
10. بديل آمن أوتصميم أفضل.
11. سؤال مفاهيمي واحد.
12. تمرين عملي أوقراءة كود.
13. مراجعة الدليل وتحديد الحالة.

## 7. النجاح وتحديث التقدم

لا يُعلّم Checkpoint بأنه `Passed` إلا بعد:

- تقييم مفاهيمي.
- تقييم عملي أوقراءة كود أوتصميم عند الحاجة.
- مراجعة دليل الطالب الفعلي.
- درجة نهائية لا تقل عن 80%.

إذا لم تتحقق الشروط، تبقى الحالة `In Progress` أو `Needs Review`.

عند تحديث ملف Progress:

- احتفظ بكل Checkpoints السابقة والدرجات والأدلة والمراجعات.
- سجل ما فُهم، والتصورات التي صُححت، والدليل العملي، ونقاط الضعف المتبقية.
- سجل الدرجة والتاريخ والخطوة التالية وملخصًا قصيرًا للجلسة.
- لا تنسخ الشرح الكامل أوالمحادثة داخل ملف التقدم.
- حدّث جدول الحالة المختصر في هذا الملف إذا تغيرت نقطة البداية أوالحالة.
- تعليمات `AGENTS.md` الخاصة بالتحديث المباشر للملفات داخل هذا المشروع مقدمة عند تعارضها مع صياغة قديمة تطلب فقط إرجاع الملف داخل code block.

## 8. ملخص هدف كل مسار

### Git

يبني Mental Model لـGit من Version Control والمناطق الثلاث وGit Objects حتى branching وmerging وremotes وteam workflows وundo/recovery وrebase وsecurity وCI/CD والمشروع النهائي. التدريبات الخطرة تكون داخل Repository تجريبي فقط، مع شرح الأثر والاسترجاع قبل التنفيذ.

### OOP

يعتمد PHP 8.3+ ويبدأ بـPlain PHP قبل Laravel. يغطي Class/Object وState/Behavior وEncapsulation والعلاقات وCoupling/Cohesion وInheritance/Polymorphism وContracts وType System وValue Objects وSOLID وCode Smells وPatterns وTesting وLaravel OOP ومشروع Orders/Payments/Wallets.

### Database Engineering

يعتمد MySQL 8 كمختبر أساسي، مع PostgreSQL وClickHouse عند الحاجة. يغطي النموذج العلاقي وSQL وmodeling وstorage internals وindexes وoptimizer وtransactions وMVCC وmigrations وbackup/replication وpartitioning/sharding وOLAP/Warehouse/CDC وتصميم POS وWallets على نطاق واسع.

### Laravel SQL / Query Builder / Eloquent

يشرح الاستعلام نفسه من خلال Raw SQL ثم Query Builder ثم Eloquent، مع شكل الجداول والمفاتيح واتجاه العلاقة والـgenerated SQL وعدد الاستعلامات والذاكرة والأداء. لا يبدأ بالعلاقات السحرية قبل فهم SQL وForeign Keys وJOIN.

### Algorithms & Data Structures

يعتمد PHP ويركز على Problem Solving لمهندس Backend، وليس حفظ LeetCode. يبدأ بالقيود وBrute Force، ثم Time/Space Complexity والـbottleneck والـinvariant والتنفيذ والاختبارات. يربط البنى والخوارزميات بقواعد البيانات وRedis والأنظمة الموزعة.

### Redis & Caching at Scale

يركز على mechanism وusage وproduction failures وmassive scale. السؤالان الدائمان: أين Source of Truth؟ وماذا يحدث إذا فقد Redis البيانات؟ يغطي structures وTTL وinternals وcaching وatomicity وlocks وpersistence وreplication وcluster وLaravel وoperations وleaderboards.

### Authentication & Authorization

يغطي Identity وAuthentication وAuthorization وthreat modeling وpasswords وsessions وcookies وCSRF/CORS/XSS وauthorization models وAPI keys وHMAC وJWT وOAuth 2.0 وOIDC وMFA وPasskeys وdistributed identity وLaravel security.

### System Design

لا يعتمد حفظ رسومات المقابلات. كل قرار يمر عبر Mechanism وDecision وFailure وScale. يبدأ بالمتطلبات والقيود والأرقام، ثم request lifecycle وscaling وdata systems وcaching وconsistency وmessaging وreliability وobservability وsecurity والتكلفة.

### GitHub Portfolio

مسار تنفيذي لتحويل الدراسة إلى أدلة هندسية قابلة للعرض: مشروعات Backend موثقة تحتوي README وdiagrams وADRs وtests وbenchmarks وrunbooks وقرارات قابلة للدفاع عنها.

## 9. قواعد نشر وتعديل الدوكس

لا تعدّل الدوكس أثناء الشرح أوالتقييم إلا إذا طلب الطالب التنفيذ بوضوح، أواكتملت شروط النشر المحددة في `AGENTS.md`.

قبل إنشاء أوتعديل أي درس:

1. افحص بنية المشروع الحالية.
2. افحص `astro.config.mjs`.
3. حدد تسجيل المسار والـsidebar الفعلي.
4. اقرأ صفحة الـOverview العربية والإنجليزية.
5. اقرأ دروسًا حالية من المسار نفسه.
6. اتبع `planning/content-writing-guide.md`.
7. لا تنشئ نظام مسارات أوlocalization جديدًا.

الدرس المنشور المناسب للمبتدئ يبدأ بالمشكلة والفكرة قبل القواعد، ويشرح المصطلحات عند أول ظهور، ويحتوي عند ملاءمة الموضوع على:

- هدف واضح.
- Mental Model صحيح.
- مثال صغير كامل وقابل للتشغيل.
- شرح المدخلات والتنفيذ والنتيجة المتوقعة.
- تدرج إلى استخدام عملي.
- أخطاء شائعة وحالات طرفية.
- تطبيق وحل مشروح واختبارات.
- خلاصة وأسئلة تقيس الفهم.

قواعد اللغتين:

- العربية طبيعية وواضحة وليست ترجمة آلية.
- الإنجليزية تفترض أيضًا عدم وجود معرفة سابقة.
- النسختان متكافئتان في المفاهيم والأمثلة والتدريبات الأساسية.
- راجع روابط ومسارات كل لغة بصورة مستقلة.

بعد أي تغيير عام في الدوكس:

1. شغّل `npm run build`.
2. أصلح الأخطاء الناتجة عن التغيير.
3. تحقق من المسار العربي والإنجليزي.
4. تحقق من الـsidebar والموضع الصحيح.
5. تحقق من language switcher.
6. تحقق أن المسارات الأخرى لم تتغير.
7. راجع `git diff` لمنع التعديلات غير المرتبطة.

## 10. الفصل والخصوصية والأمان

- لا تخلط محتوى Git أوOOP أوأي مسار داخل مسار آخر.
- لا تنشر درجات الطالب أوإجاباته أوضعفه أوأدلة التقييم في الدروس العامة.
- لا تنشئ دروسًا مستقبلية قبل استحقاقها أوطلبها.
- لا تحذف ملفات أوتعيد كتابة Git history أوتعمل commit أوpush أوdeploy دون طلب صريح.
- قبل أي أمر قد يفقد عملًا، اشرح ما سيتغير وما يمكن استرجاعه وما قد يصعب استرجاعه.
- استخدم بيئات وبيانات تجريبية آمنة في التمارين الخطرة.

## 11. التقرير المطلوب بعد التنفيذ

بعد إنشاء أوتعديل درس عام، يجب أن يتضمن التقرير النهائي:

- المسار النشط.
- ما تم تنفيذه.
- الملفات المنشأة.
- الملفات المعدلة.
- المسار العربي والإنجليزي.
- موضع الدرس في الـsidebar والمرحلة أوالقسم.
- تحديث التقدم إذا كان جزءًا من Session ناجحة.
- نتيجة Build والتحقق.
- أي افتراضات تمت.

أما جلسة الدراسة التفاعلية، فتنتهي الرسالة الحالية بعد سؤال واحد حتى يجيب الطالب.

## 12. بروتوكول نهاية الجلسة وبداية الجلسة التالية

في نهاية أي جلسة دراسة فعلية:

1. حدّث ملف Progress الخاص بالمسار وفق الدليل الحقيقي.
2. حدّث صف المسار في قسم **الحالة الحالية المؤكدة** داخل هذا الملف.
3. سجّل Current Phase وCurrent Checkpoint والحالة والدرجة والخطوة التالية في Progress.
4. لا تضع التفاصيل الخاصة أوالإجابات داخل هذا الملف؛ اتركها في Progress فقط.

في بداية Session جديدة:

```text
AGENTS.md
    ↓
STUDY_SESSION_CONTEXT.md
    ↓
تحديد المسار من طلب الطالب
    ↓
Master Prompt + Progress للمسار
    ↓
البدء من Next Action المسجل
    ↓
سؤال واحد وانتظار الإجابة
```

## 13. آخر Handoff مؤكد

- تاريخ المراجعة: 2026-10-02.
- كل مسارات الدراسة: لم تبدأ.
- لا يوجد مسار نشط محفوظ بين المحادثات؛ يجب تحديده من طلب الطالب الجديد.
- نقطة البداية العامة: Diagnostic Assessment أوأول Module مسجل في Progress الخاص بالمسار.
- الملفات المرجعية لـGit وOOP موجودة الآن بالأسماء الصحيحة.
- لم يُطلب دمج نتائج `OOP_DIAGNOSTIC_REVIEW.md` القديمة في التقدم الحالي.
