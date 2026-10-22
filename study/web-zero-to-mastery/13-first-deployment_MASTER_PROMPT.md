# المرحلة 13 — النشر الأول وتشغيل تطبيق حقيقي

الإصدار: 1.1 — مراجعة المنهج 2026-10-21. مراجعة تحريرية؛ لم تبدأ الدراسة.

هدفنا نسخة تجريبية تشتغل من تعليمات واضحة، ونقدر نرجع منها ونعيد بياناتها. النشر مش مجرد إن الصفحة فتحت مرة، ومش تصريح تلقائي بإنشاء حسابات أو خدمات مدفوعة.

## المتطلبات وحدود المرحلة

نجاح 10–12 محليًا وبوابة 4.Advanced في ملف الشبكات، مع اختبارات أمان وملفات إعداد منقّحة. يختار الطالب بيئة Linux محلية في VM/WSL أو استضافة مأذونًا بها؛ لا نعرض خدمة للإنترنت أو نغير DNS أو ندفع بدون إذن واضح.

Linux و web/FPM و release/rollback و backup أساسي. Cloud المتعمقة و Docker image building و CI/CD المتقدم في 18. مسار Git القديم مرجع وتوسعة؛ لا يشترط اجتيازه كاملًا قبل أول نشر.

## خطة الدراسة

### 13.1 — مختبر Linux وأقل صلاحية

- المستوى: أساسي إلزامي.
- المتطلبات: terminal/files/processes في 1 وأساس Git.
- الناتج: يشخّص خدمة وملفًا وصلاحية واتصالًا دون أوامر واسعة خطرة.

#### 13.1.a — Users و Permissions و Processes

حدد user الذي يشغل التطبيق وصلاحيات القراءة/الكتابة والأدلة. راقب process و PID و signals و environment و exit code؛ لا chmod 777 كحل ولا root لكل شيء.

#### 13.1.b — SSH و Logs و Network Diagnostics

فسّر host key verification و SSH keys و file permissions. استخدم logs و ss وأداة HTTP و DNS مناسبة؛ افصل connection refused عن timeout و permission denied. المختبر محلي أولًا.

**تطبيق وتقييم 13.1 بعد الأجزاء السابقة:**

- تجربة صغيرة: خدمة تجريبية محدودة الصلاحية تكتب في storage فقط ويظهر طلبها في log.
- فشل متعمّد: ملف غير مقروء أو port مشغول؛ تشخيص السبب من الخرج لا فتح كل الصلاحيات.
- محاولة مستقلة: حدد PID و user و port ثم أوقف الخدمة المحددة برفق وأعد تشغيلها.
- دليل النجاح: commands/outputs منقّحة ومخطط صلاحيات وخطة cleanup محددة.

### 13.2 — Web Server و PHP-FPM ومسار الطلب

- المستوى: أساسي إلزامي.
- المتطلبات: 13.1 و request lifecycle في 10.
- الناتج: يمرر طلبًا من Nginx إلى FPM ويحمي root التطبيق.

#### 13.2.a — Nginx و Document Root و FastCGI

ارسم client→web server→FPM→app. document root على public فقط، static assets لا تمر على PHP بلا سبب. فسّر FastCGI وحدود reverse proxy و trusted proxy.

#### 13.2.b — Process Management وحدود الخدمة

جهز service manager مأذونًا مثل systemd/Supervisor حسب المختبر، وراجع socket/port permissions و request/upload/time limits. قاعدة البيانات و FPM لا يُعرضان مباشرة للإنترنت.

**تطبيق وتقييم 13.2 بعد الأجزاء السابقة:**

- تجربة صغيرة: asset ثابت و route ديناميكية يعملان عبر المسار المحدد.
- فشل متعمّد: FPM متوقف أو public root خاطئة؛ شخّص 502 وأثبت أن.env غير متاحة.
- محاولة مستقلة: أضف health route محدودة المعلومات وتحقق من static caching الأساسي.
- دليل النجاح: config منقّحة واختبارات 200/404/502 ورفض ملفات داخلية.

### 13.3 — DNS و TLS و Production Configuration

- المستوى: أساسي إلزامي.
- المتطلبات: 13.2 و DNS/TLS في 4 و secrets في 12.
- الناتج: يفرق عطل DNS عن certificate عن app ويشغّل إعدادًا آمنًا.

#### 13.3.a — Domain و DNS و Certificate

ابدأ بـ localhost أو domain مأذون؛ تتبع resolution و SNI و certificate chain و expiry و renewal. لا disable verification لتجاوز الخطأ، ولا تعدل trust store أو DNS خارجي بلا طلب.

#### 13.3.b — Production Modes و Secrets و Health

اضبط debug off و app URL و trusted proxies و cookies و logs من غير تسريب. ميّز liveness عن readiness وراقب dependency لازمة؛ health لا يعرض credentials.

**تطبيق وتقييم 13.3 بعد الأجزاء السابقة:**

- تجربة صغيرة: طلب HTTPS إلى المختبر مع تحقق صحيح من الشهادة أو تحليل config محلية إن لم تتوفر domain.
- فشل متعمّد: hostname لا يطابق certificate أو debug يسرّب trace؛ الاختبار يرفضهما.
- محاولة مستقلة: شخّص ثلاث حالات متشابهة من DNS/TLS/app وأصلح المحلية المأذونة.
- دليل النجاح: نتيجة verification وإعدادات منقّحة وخطة renewal؛ ما يتطلب إذنًا خارجيًا يبقى معلنًا غير منفذ.

### 13.4 — Release قابلة للتكرار وعمليات طويلة العمر

- المستوى: أساسي إلزامي.
- المتطلبات: 13.2 و Composer/assets و queues في 10.7.
- الناتج: يشغّل نسخة معلومة الكود والـ dependencies ويحدّث workers بأمان.

#### 13.4.a — Artifact و Dependencies و Assets

استخدم lockfiles و install مناسبًا لل production وبناء assets. حدّد release ID و config caching وملكية storage؛ لا update dependencies عشوائيًا أثناء النشر.

#### 13.4.b — Migrations و Worker Lifecycle و Scheduler

افصل تغييرات schema عن رفع الكود، واختبر توافق old/new code. restart/reload العمال بعد النشر مع graceful timeout، و scheduler واحدة بالمسؤولية المحددة؛ لا نتوقع أن workers تقرأ الكود الجديد تلقائيًا.

**تطبيق وتقييم 13.4 بعد الأجزاء السابقة:**

- تجربة صغيرة: نشر نسختين محليتين مع release ID و worker يعالج job لكل نسخة.
- فشل متعمّد: worker قديمة أو migration غير متوافقة؛ checklist تكشفها قبل تمرير traffic.
- محاولة مستقلة: أضف config آمنة أو column غير هدامة واكتب خطوات التغيير والعودة.
- دليل النجاح: script أو خطوات قابلة للتكرار و version manifest ونتائج worker/scheduler smoke checks.

### 13.5 — CI و Release Checklist و Rollback

- المستوى: أساسي إلزامي.
- المتطلبات: 13.4 و tests و Git basics.
- الناتج: يمنع release مع tests فاشلة ويشرح حدود الرجوع عند تغير البيانات.

#### 13.5.a — CI Checks وعزل بيانات الاختبار

شغّل lint/static analysis/tests على DB تجريبية. secrets اللازمة في بيئة مأذونة لا في yaml عام؛ التقارير لا تحتوي PII. ابدأ بأوامر محلية نفسها قبل ربط خدمة خارجية.

#### 13.5.b — Rollback و Forward Fix

حدد artifact السابق و config و migration compatibility. فرّق rollback للكود عن restore للبيانات؛ لا down destructive migration لمجرد السرعة. deployment approval خطوة واضحة.

**تطبيق وتقييم 13.5 بعد الأجزاء السابقة:**

- تجربة صغيرة: اختبار فاشل يمنع release، ثم إصدار سليم مع rollback محلي محدد.
- فشل متعمّد: رجوع كود لا يفهم schema جديدة؛ تحقق compatibility يرفض الرجوع غير الآمن.
- محاولة مستقلة: اكتب release checklist وأصلح fault في مختبر من غير وصفة كاملة.
- دليل النجاح: CI/local pipeline log و rollback drill وتفسير ما قد يفقده restore.

### 13.6 — نسخة احتياطية مثبتة وتنبيه بإجراء

- المستوى: أساسي إلزامي.
- المتطلبات: 13.4 وصحة البيانات في 8.
- الناتج: يستعيد DB و uploads متوافقة ويثبت إمكانية قراءة البيانات.

#### 13.6.a — Backup Scope و Protection

احصر DB و uploads و config اللازمة ومسؤولية المفاتيح دون نشرها. حدّد retention ومكانًا مختلفًاومنع وصول غير المأذون؛ snapshot مش دليل restore.

#### 13.6.b — Restore Drill و Basic Monitoring

استعد إلى DB تجريبية منفصلة، وقارن counts و invariants وملفات عينة. ضع alert لمشكلة مستخدم مع runbook، وميّز last backup success عن نجاح restore فعلي.

**تطبيق وتقييم 13.6 بعد الأجزاء السابقة:**

- تجربة صغيرة: خذ backup تجريبية واستعدها في مكان منفصل وقارن عينات.
- فشل متعمّد: backup تالفة أو uploads ناقصة أو فقد key لازمة؛ لاحظ الفشل وحدّد خطة تعافٍ.
- محاولة مستقلة: أضف health/backup freshness check بإجراء تشخيص واضح.
- دليل النجاح: restore log و checks ومسارات مختبر محددة ووقت تعافٍ مقاس دون ادعاء ضمان production.

### 13.7 — تعاون Git ومراجعة الإصدار

- المستوى: أساسي إلزامي.
- المتطلبات: أساس Git في 3.8 والتغييرات المحلية المحفوظة.
- الناتج: يراجع diff ويحل conflict ويسترجع خطأ في repo تجريبية.

#### 13.7.a — Branch و Review و Conflict

اصنع branch محلية وراجع diff صغيرًا وكأنك زميل آخر. حل conflict مع فهم النتيجة و tests؛ لا merge لمجرد اختفاء علامات conflict.

#### 13.7.b — Recovery و Release Reference

حدد commit/release tag محليين واربطهما بـ artifact. جرّب revert واسترجاع ملف في repo قابلة للتخلص؛ لا reset hard على مشروع الطالب. PR/push خارجي فقط بإذن.

**تطبيق وتقييم 13.7 بعد الأجزاء السابقة:**

- تجربة صغيرة: تغيير متعارض في repo تدريب وتسويته بنتيجة مختبرة.
- فشل متعمّد: حل conflict أبقى syntax صحيحًا وكسر قاعدة عمل؛ regression test يكشفه.
- محاولة مستقلة: راجع diff فيه secret وهمية و bug ثم أنشئ إصلاحًا محليًا قابلًا للتتبع.
- دليل النجاح: diff و history و tests وشرح أثر revert؛ لا دليل زائف بإكمال Git Master كله.

## المشروع وبوابة الخروج

نسخة تجريبية يستطيع تشغيلها شخص آخر من README: release ID، config منقحة، schema/worker/scheduler صحيحة، HTTPS أو تحقق config محلية معلن، اختبارات رفض، rollback و restore إلى بيئة منفصلة. لا delete لبيانات مهمة ولا deploy أو push خارجي بغير إذن. الإتقان المحلي الأساسي لا يصبح شهادة Junior آلية.

## مراجع وحدود الربط

[Git_Master_Prompt.md](../Git_Master_Prompt.md) مرجع branching/remotes/collaboration/recovery في مواضعها الأصلية؛ لا اجتياز تلقائي لنقاطه ولا اشتراط إكماله بالكامل. راجع وثائق Laravel deployment و Nginx و PHP-FPM و Linux الخاصة بنسخ المختبر. RPO/RTO و DR وتوسيع CI/CD في 18؛ لها أساس عملي هنا لكن مش شرط بناء cloud platform كاملة.

## تشغيل الجلسة والتقدم

اقرأ README.md و COMMON_RULES.md وهذا الملف وملف PROGRESS المجاور كاملين. اشرح بالعامية المصرية الطبيعية: المشكلة ثم الفكرة وآليتها ثم تجربة صغيرة وتوقع الناتج قبل التنفيذ. مفهوم واحد وسؤال واحد كل مرة؛ لا تعرض حل المحاولة المستقلة قبل محاولة الطالب. كل عنوان فرعي وحدة شرح، وليس درسًا موسوعيًا في رسالة واحدة.

الـ IDs المحلية تقيس أدلة هذا المنهج فقط. ملفات study القديمة مراجع وتعميق وليست شرط إتمام كامل قبل العبور. لا تنسخ درجاتها، ولا تعتبر نجاح بوابة محلية نجاحًا تلقائيًا في نقطة قديمة. إن اختار الطالب دراسة المالك كاملًا، اقرأ منهجه وتقدمه والتزم بترتيبه؛ سجل الربط دون ازدواج النتائج.

حدّث التقدم المحلي وفق الدليل الحقيقي: checkpoint والعنوان الفرعي وآخر تمرين مكتمل والخطوة غير المكتملة والاختبارات والفجوات. شرط النجاح 80% على الأقل مع أدلة مستقلة وإصلاح أخطاء الأمان أو صحة البيانات الجوهرية. المتقدم الاختياري لا يعطل بوابة الأساس، ولا يسجل Passed أو درجة وهمية إن لم يُدرس. لا نشر أو commit أو push أو تعديل لتقدم مسار قديم تلقائيًا.
