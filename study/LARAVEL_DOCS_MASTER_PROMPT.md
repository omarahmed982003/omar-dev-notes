# Laravel Official Docs — Master Prompt

الإصدار: 1.0 — 2026-10-23.
المصدر المطلوب: https://laravel.com/framework/docs
المرجع المثبت: [Laravel 13.x](https://laravel.com/framework/docs/13.x/)؛ الرابط العام كان يعرض 13.x وقت المراجعة. [Release Notes](https://laravel.com/framework/docs/13.x/releases) تحدد توافق PHP؛ لا تفترض أن كل PHP 8.x مناسبة.

## الهدف وحدود المسار

ندرس دوكس Laravel كفهم وآلية وتنفيذ، مش ترجمة صفحات أو حفظ أوامر. الترتيب هنا تعليمي؛ مش ترتيب sidebar حرفيًا، والملف خطة دراسة لا شرح نهائي لكل API. راجعت فهرس الدوكس وصفحات installation/releases/container/eloquent/testing/deployment لتحديد النطاق؛ لم تُدقّق كل فقرة في كل صفحة ولم تُنفّذ مختبرات بعد.

هذا مسار مستقل عن [مرحلة Laravel المختصرة](web-zero-to-mastery/10-laravel_MASTER_PROMPT.md) وعن [Laravel Query](Laravel_SQL_QueryBuilder_Eloquent_Master_Prompt.md). لا يستبدلهما ولا ينسخ درجاتهما. عند بدء «Laravel Docs» اقرأ هذا الملف و[LARAVEL_DOCS_PROGRESS.md](LARAVEL_DOCS_PROGRESS.md) كاملين؛ التقدم المجاور وحده يملك موضع التوقف. «كمل Laravel» بلا مسار محدد يستدعي سؤال تحديد بين Docs والمرحلة 10 وQuery. إنشاء الملفات لا يبدأ جلسة دراسة.

## سياسة الإصدار والمختبر

- ثبّت Laravel 13.x كمرجع أول، وسجل patch وPHP وComposer وDB وNode ومدير الحزم والإضافات الفعلية في Progress؛ المختبر لم يُنشأ بعد.
- اقرأ صفحة الموضوع المثبتة قبل تدريسه، وافحص changelog/upgrade عند اختلاف API. لا تنقل skeleton أو middleware registration من Laravel قديم بصمت.
- إن كان مشروع الطالب على إصدار آخر، اطلب اختيار الاستمرار عليه أو مختبر منفصل؛ لا ترقِّ مشروعه تلقائيًا. سجل مرجع الصفحة بتاريخها وفروق النسخة.
- PHP/functions/arrays/errors/OOP/interfaces/DI/Composer وSQL/HTTP/HTML متطلبات دخول تشخص في 0.1. عالج فجوة محددة بمراجع study، لا تشترط اجتياز كل المناهج السابقة ولا تمنح نجاحًا وهميًا.
- المختبر disposable ببيانات مصطنعة، وDB اختبارات منفصلة. Blade مسار العرض الأول؛ البدائل معروفة وليست واجب تعلم عدة stacks.
- اختبارات صغيرة تبدأ من أول تغيير، حتى لو باب تجميع الاختبارات لاحق. لا تؤجل الأمان أو الاختبار إلى نهاية المسار.

## قواعد الشرح والجلسة

اتبع AGENTS.md وSTUDY_SESSION_CONTEXT.md و[دليل الكتابة](../planning/content-writing-guide.md). عامية مصرية طبيعية، فقرة لفكرة ومسافات واضحة، وتعريف المصطلح أول مرة في سياقه. نبدأ بالمشكلة ثم الآلية ثم مثال صغير وinput/output وفشل ثم محاولة مستقلة. PHP/Laravel افتراضيًا؛ لا نخفي الأساس خلف starter kit.

كل checkpoint أدناه موضوع مستقل؛ يقسم داخليًا لجلسات: a المشكلة والعقد، b الآلية ومثال متتبع، c حدود وفشل، d محاولة وتقييم. سجل حرف الجزء والخطوة بالضبط في Progress. لا تشرح كل الأجزاء في رسالة واحدة؛ سؤال واحد وانتظر الإجابة، وتوقع قبل التشغيل، ولا حل المحاولة المستقلة قبل محاولة الطالب. ارسم فقط لو التسلسل أو الحالة محتاجة رسمًا مطابقًا للكود؛ لا خريطة إجبارية في آخر الدرس.

## التقييم والعبور

0.1 تشخيص خاص يغلق Assessment Completed بلا Passed أو درجة نجاح. باقي النقاط: شرح 25 + تنفيذ مستقل 40 + حالات فشل/اختبارات 25 + تبرير 10. النجاح 80% على الأقل بعد مراجعة دليل حقيقي، مع إصلاح أي خلل حرج في الصلاحيات أو سلامة البيانات أو الأسرار مهما كان المتوسط. وإلا In Progress أوNeeds Review. لا نجمع نقاطًا مستقلة لتجاوز فجوة. المتقدم والاختياري لا يمنع أول منتج أو ينال Passed بلا دراسة.

ترتيب 0–6 أساسي؛ داخل كل مرحلة التزم بالترتيب والمتطلبات المفسرة. مرحلة 7 تعميق بعد بوابة الأساس، ومرحلة 8 خيارات مستقلة. SQL والفهارس وauth/Redis الموزع لها مراجع تعميق خاصة؛ سجل العودة دون تغيير تقدمها. كل نقطة تحتاج المصدر المرتبط + تجربة صغيرة متوقعة + عطل مقصود + محاولة مستقلة جديدة + دليل code/commands/output/tests. الوصف التالي يحدد نطاق الدرس ومعيار المختبر، لا يزعم تنفيذًا.

## المرحلة 0 — التهيئة وتحديد البداية

### 0.1 — تشخيص المتطلبات

- المصدر: [installation](https://laravel.com/framework/docs/13.x/installation).
- التغطية وهدف الفهم: فهم PHP والدوال وOOP/DI وComposer وSQL وHTTP والنماذج؛ نشخص فجوات محددة ولا نفترض اجتياز مسار قديم.
- المختبر ودليل القبول: تتبع request صغيرة وقراءة دالة وJOIN؛ خطة علاج للفجوات بلا درجة نجاح للتشخيص.
### 0.2 — تثبيت المختبر والإصدار

- المصدر: [installation](https://laravel.com/framework/docs/13.x/installation).
- التغطية وهدف الفهم: PHP مدعومة ومتوافقة مع Laravel 13، Composer وlockfiles وDB معزولة؛ اختيار Blade كمسار أول وشرح بدائل frontend.
- المختبر ودليل القبول: وثّق النسخ والمسارات وشغّل مشروع تدريب وsmoke test؛ لا تثبيت عالمي أو سكربت تحميل بصلاحيات مدير تلقائيًا.
### 0.3 — خريطة المشروع وArtisan الأول

- المصدر: [structure](https://laravel.com/framework/docs/13.x/structure).
- التغطية وهدف الفهم: public وapp وbootstrap وconfig وroutes وstorage وtests؛ مصدر الكود مقابل مخرجاته.
- المختبر ودليل القبول: تتبع ملف route وعدّل response غير سرية؛ فسّر خطأ مجلد تشغيل أو صلاحية.

## المرحلة 1 — رحلة الطلب وتنظيم الاعتمادات

### 1.1 — دورة الطلب

- المصدر: [lifecycle](https://laravel.com/framework/docs/13.x/lifecycle).
- التغطية وهدف الفهم: من نقطة الدخول إلى bootstrap وmiddleware وrouter وresponse؛ فرق HTTP عن Console.
- المختبر ودليل القبول: تتبع طلب ناجح و404 من كود نسخة المختبر وارسم تسلسلًا مطابقًا.
### 1.2 — الإعدادات والبيئات

- المصدر: [configuration](https://laravel.com/framework/docs/13.x/configuration).
- التغطية وهدف الفهم: env مقابل config وsecrets وconfig cache؛ testing environment.
- المختبر ودليل القبول: أضف إعدادًا غير سري ثم شخّص قيمة cached قديمة؛ لا تعرض .env.
### 1.3 — Service Container

- المصدر: [container](https://laravel.com/framework/docs/13.x/container).
- التغطية وهدف الفهم: DI قبل binding/resolution؛ concrete/interface وcontextual binding وtransient/singleton/scoped.
- المختبر ودليل القبول: بدّل sender بتنفيذ تجريبي واكشف تسرب حالة طلب داخل singleton.
### 1.4 — Service Providers

- المصدر: [providers](https://laravel.com/framework/docs/13.x/providers).
- التغطية وهدف الفهم: register مقابل boot وترتيب تهيئة الخدمة؛ حدود عمل provider.
- المختبر ودليل القبول: سجّل عقدًا في provider واختبر resolution بلا اتصالات خارجية عند bootstrap.
### 1.5 — Facades وContracts

- المصدر: [facades](https://laravel.com/framework/docs/13.x/facades).
- التغطية وهدف الفهم: Facade proxy مقابل static call المعتادة؛ contracts مقابل implementations وحقن الاعتماد.
- المختبر ودليل القبول: تتبع facade إلى الخدمة وقارنها بحقن العقد واختبر بديلًا.

## المرحلة 2 — HTTP والعرض والنماذج

### 2.1 — Routing

- المصدر: [routing](https://laravel.com/framework/docs/13.x/routing).
- التغطية وهدف الفهم: methods وparameters وconstraints وgroups وnamed routes وbinding و404/405؛ binding ليست صلاحية.
- المختبر ودليل القبول: اكتب route مقيدة واختبر مفقودًا وطريقة خاطئة وID لمستخدم آخر.
### 2.2 — Controllers

- المصدر: [controllers](https://laravel.com/framework/docs/13.x/controllers).
- التغطية وهدف الفهم: action صغيرة وresource/invokable controllers وتقسيم مسؤوليات الحالة.
- المختبر ودليل القبول: انقل route لحالة واضحة بلا controller ضخم أو service لكل سطر.
### 2.3 — Middleware

- المصدر: [middleware](https://laravel.com/framework/docs/13.x/middleware).
- التغطية وهدف الفهم: ترتيب before/after وaliases/groups والتسجيل حسب الإصدار.
- المختبر ودليل القبول: اكتب middleware لمعرّف تتبع واختبر مسار رفض لا يصل للكتابة.
### 2.4 — Requests

- المصدر: [requests](https://laravel.com/framework/docs/13.x/requests).
- التغطية وهدف الفهم: query/form/JSON وheaders وfiles والشكل غير الموثوق؛ trusted proxies.
- المختبر ودليل القبول: اختبر missing/null/array ونوع محتوى خاطئ قبل استعمال المدخل.
### 2.5 — Responses

- المصدر: [responses](https://laravel.com/framework/docs/13.x/responses).
- التغطية وهدف الفهم: status وheaders وJSON وredirect وdownload وstreaming وحدود الإرسال.
- المختبر ودليل القبول: أعد ردًا صحيحًا وredirect واختبر headers ومنع تسريب الخطأ.
### 2.6 — URL Generation

- المصدر: [urls](https://laravel.com/framework/docs/13.x/urls).
- التغطية وهدف الفهم: named URLs وquery وsigned/temporary URLs؛ التوقيع لا يثبت ملكية المورد.
- المختبر ودليل القبول: اختبر تعديل رابط وتوقيع منتهي ورفض مستخدم غير مأذون.
### 2.7 — Views

- المصدر: [views](https://laravel.com/framework/docs/13.x/views).
- التغطية وهدف الفهم: بيانات العرض وفصل المنطق عن template وview composition عند الحاجة.
- المختبر ودليل القبول: اعرض قائمة وحالة فارغة من نفس عقد البيانات.
### 2.8 — Blade

- المصدر: [blade](https://laravel.com/framework/docs/13.x/blade).
- التغطية وهدف الفهم: escaping وdirectives وlayouts وcomponents وslots؛ خطر raw HTML.
- المختبر ودليل القبول: ابن صفحة وقالبًا ومكونًا واختبر مدخل HTML كنص.
### 2.9 — Frontend وVite وStarter Kits

- المصدر: [vite](https://laravel.com/framework/docs/13.x/vite).
- التغطية وهدف الفهم: asset pipeline وmanifest وdev مقابل build؛ اختيار stack واحد وعدم إخفاء auth وراء scaffolding.
- المختبر ودليل القبول: شغّل أصولًا مبنية من lockfile وشخّص missing manifest؛ لا شرط تعلم React/Vue.
### 2.10 — Session

- المصدر: [session](https://laravel.com/framework/docs/13.x/session).
- التغطية وهدف الفهم: عمر البيانات وflash وcookie وdrivers وlocking وحدود جلسة الطلب.
- المختبر ودليل القبول: تتبع POST→redirect→GET ونافذة مستقلة؛ اختبر flash مرة واحدة.
### 2.11 — CSRF Protection

- المصدر: [csrf](https://laravel.com/framework/docs/13.x/csrf).
- التغطية وهدف الفهم: طلبات التغيير وtoken وcookies وحدود SameSite؛ فرق CSRF عن CORS/XSS.
- المختبر ودليل القبول: طلب صحيح وآخر بلا token بلا أثر؛ تحقق فعلي لأن test environment قد تعطل middleware.
### 2.12 — Validation

- المصدر: [validation](https://laravel.com/framework/docs/13.x/validation).
- التغطية وهدف الفهم: rules وForm Requests وvalidated data وnested arrays وerror bags وbusiness rules.
- المختبر ودليل القبول: اختبر حدودًا ومدخل array وتغيير owner_id؛ لا حفظ عند الرفض.
### 2.13 — Errors وExceptions

- المصدر: [errors](https://laravel.com/framework/docs/13.x/errors).
- التغطية وهدف الفهم: فشل متوقع مقابل bug وحد reporting/rendering وdebug off.
- المختبر ودليل القبول: حوّل عطل تخزين لرد عام مع request ID واختبر عدم ظهور trace.
### 2.14 — Logging وContext

- المصدر: [logging](https://laravel.com/framework/docs/13.x/logging).
- التغطية وهدف الفهم: قنوات ومستويات وسياق منقح وربط HTTP/jobs؛ عمر السياق.
- المختبر ودليل القبول: تتبع عملية عبر سجلين بلا tokens أو بيانات حساسة، واختبر عدم انتقال السياق لطلب تال.

## المرحلة 3 — البيانات من SQL إلى Eloquent

### 3.1 — Database وTransactions

- المصدر: [database](https://laravel.com/framework/docs/13.x/database).
- التغطية وهدف الفهم: connections وbindings وtransactions وrollback وdeadlocks وحدود SQLite مقابل محرك الإنتاج.
- المختبر ودليل القبول: نفّذ كتابة متعددة تفشل في المنتصف وتثبت rollback؛ لا أثر خارجي داخل retry بلا حماية.
### 3.2 — Migrations

- المصدر: [migrations](https://laravel.com/framework/docs/13.x/migrations).
- التغطية وهدف الفهم: schema وFK/unique/check حسب المحرك وتطور الجداول وحدود rollback.
- المختبر ودليل القبول: غيّر schema في DB تدريب مع خطة استرجاع؛ لا migrate:fresh على بيانات مهمة.
### 3.3 — Seeding وFactories

- المصدر: [seeding](https://laravel.com/framework/docs/13.x/seeding).
- التغطية وهدف الفهم: بيانات مرجعية مقابل بيانات اختبارات وحالات factories وعلاقاتها.
- المختبر ودليل القبول: أعد dataset معلومة واختبر قيدًا وحالة رفض؛ راجع factories كمرجع مستقل.
### 3.4 — Query Builder

- المصدر: [queries](https://laravel.com/framework/docs/13.x/queries).
- التغطية وهدف الفهم: select/where/grouping/joins/aggregates/subqueries/bindings وsafe filters وحدود raw SQL.
- المختبر ودليل القبول: نفس التقرير SQL ثم Builder؛ اختبر OR غير مجمعة وتسرب مستخدم آخر.
### 3.5 — Pagination

- المصدر: [pagination](https://laravel.com/framework/docs/13.x/pagination).
- التغطية وهدف الفهم: offset مقابل cursor وترتيب ثابت وحدود حجم الصفحة.
- المختبر ودليل القبول: اختبر تعادل قيم الترتيب وتغيير البيانات بين الصفحات وحد page size.
### 3.6 — Eloquent Models

- المصدر: [eloquent](https://laravel.com/framework/docs/13.x/eloquent).
- التغطية وهدف الفهم: model instance مقابل builder وpersistence وmass assignment وevents/soft deletes.
- المختبر ودليل القبول: إنشاء وتعديل آمن مع payload تحاول تغيير owner/status؛ افحص SQL.
### 3.7 — Relationships

- المصدر: [eloquent-relationships](https://laravel.com/framework/docs/13.x/eloquent-relationships).
- التغطية وهدف الفهم: FK واتجاه belongsTo/hasMany ثم pivot وpolymorphic عند الحاجة وscopes.
- المختبر ودليل القبول: ارسم schema وتوقع queries؛ اكشف N+1 وأصلحه دون تحميل غير محدود.
### 3.8 — Casts وMutators

- المصدر: [eloquent-mutators](https://laravel.com/framework/docs/13.x/eloquent-mutators).
- التغطية وهدف الفهم: تبديل representation وحدود accessor/cast وdate/enum/value object.
- المختبر ودليل القبول: اختبر round-trip وnull وقيمة غير صالحة؛ cast ليست validation.
### 3.9 — Collections

- المصدر: [collections](https://laravel.com/framework/docs/13.x/collections).
- التغطية وهدف الفهم: الفرق بين query وCollection وEloquent Collection وlazy processing وحفظ المفاتيح.
- المختبر ودليل القبول: نفّذ filter/map/reduce ثم loop مكافئة وقارن الذاكرة وحد JSON list.
### 3.10 — Serialization

- المصدر: [eloquent-serialization](https://laravel.com/framework/docs/13.x/eloquent-serialization).
- التغطية وهدف الفهم: hidden/visible/appends والعلاقات المحملة وتسرب البيانات.
- المختبر ودليل القبول: اختبر عدم خروج password/hash أو علاقة غير مقصودة.
### 3.11 — API Resources

- المصدر: [eloquent-resources](https://laravel.com/framework/docs/13.x/eloquent-resources).
- التغطية وهدف الفهم: عقد JSON وconditional relationships وpagination metadata.
- المختبر ودليل القبول: ثبّت response contract ولا تسمح لresource بعمل queries مفاجئة.

## المرحلة 4 — الهوية وحماية البيانات

### 4.1 — Authentication

- المصدر: [authentication](https://laravel.com/framework/docs/13.x/authentication).
- التغطية وهدف الفهم: guards/providers وsession login/logout وstarter kit واعتماد آلية موثوقة.
- المختبر ودليل القبول: اختبر login ناجحة وفاشلة وتجديد الجلسة وإنهاءها؛ لا بناء password protocol.
### 4.2 — Authorization

- المصدر: [authorization](https://laravel.com/framework/docs/13.x/authorization).
- التغطية وهدف الفهم: Gates/Policies وownership وdeny-by-default مقابل إخفاء الأزرار.
- المختبر ودليل القبول: مصفوفة زائر/مالك/آخر/مدير؛ IDOR وحقن owner_id مرفوضان.
### 4.3 — Hashing

- المصدر: [hashing](https://laravel.com/framework/docs/13.x/hashing).
- التغطية وهدف الفهم: one-way password hashing وverify/rehash؛ ليست encryption.
- المختبر ودليل القبول: اختبر تحقق وإعادة hash عند الحاجة دون تسجيل password.
### 4.4 — Encryption

- المصدر: [encryption](https://laravel.com/framework/docs/13.x/encryption).
- التغطية وهدف الفهم: تشفير قابل للفك وkey management والبيانات القديمة عند rotation.
- المختبر ودليل القبول: اختبر عبث ciphertext وسياسة مفتاح في مختبر بلا أسرار حقيقية.
### 4.5 — Password Reset

- المصدر: [passwords](https://laravel.com/framework/docs/13.x/passwords).
- التغطية وهدف الفهم: tokens محدودة العمر وthrottling وعدم كشف وجود حساب.
- المختبر ودليل القبول: تجربة token منتهية/مستخدمة ورسائل متسقة بصندوق بريد محلي.
### 4.6 — Email Verification

- المصدر: [verification](https://laravel.com/framework/docs/13.x/verification).
- التغطية وهدف الفهم: ثقة البريد تختلف عن login والتوقيع والانتهاء.
- المختبر ودليل القبول: اختبر رابطًا معدّلًا وحماية route قبل وبعد التحقق.

## المرحلة 5 — خدمات التطبيق والآثار الجانبية

### 5.1 — File Storage

- المصدر: [filesystem](https://laravel.com/framework/docs/13.x/filesystem).
- التغطية وهدف الفهم: disks/private files وupload validation وpaths وauthorized download.
- المختبر ودليل القبول: ارفض ملفًا غير مسموح وأسماء traversal وحاول تنزيل ملف مستخدم آخر.
### 5.2 — HTTP Client

- المصدر: [http-client](https://laravel.com/framework/docs/13.x/http-client).
- التغطية وهدف الفهم: timeouts وstatus وretries وSSRF وحدود fakes.
- المختبر ودليل القبول: اختبر timeout و500 وطلبًا متكررًا؛ fake ثم endpoint محلية فعلية.
### 5.3 — Events

- المصدر: [events](https://laravel.com/framework/docs/13.x/events).
- التغطية وهدف الفهم: event/listener مقابل call مباشر وtransaction boundary.
- المختبر ودليل القبول: أطلق حدثًا بعد commit واختبر rollback لا يرسل أثرًا.
### 5.4 — Mail

- المصدر: [mail](https://laravel.com/framework/docs/13.x/mail).
- التغطية وهدف الفهم: mailables وtemplates وtransport محلي وفشل الإرسال.
- المختبر ودليل القبول: اعرض رسالة في صندوق محلي واختبر عدم إرسالها قبل commit.
### 5.5 — Notifications

- المصدر: [notifications](https://laravel.com/framework/docs/13.x/notifications).
- التغطية وهدف الفهم: notification مقابل mailable وchannels وpreferences وqueued delivery.
- المختبر ودليل القبول: قناة واحدة أولًا وحالة فشل؛ fake لا يثبت وصول بريد حقيقي.
### 5.6 — Queues

- المصدر: [queues](https://laravel.com/framework/docs/13.x/queues).
- التغطية وهدف الفهم: dispatch/worker/failed jobs وretry/backoff/timeouts وserialization وafterCommit وidempotency.
- المختبر ودليل القبول: أوقف worker ثم أعده واختبر فشلًا وإعادة تسليم بلا أثر مالي مكرر.
### 5.7 — Task Scheduling

- المصدر: [scheduling](https://laravel.com/framework/docs/13.x/scheduling).
- التغطية وهدف الفهم: scheduler مقابل queue وlocks وoverlap/timezones/DST.
- المختبر ودليل القبول: جدولة محلية بوقت ثابت مع اختبار منع تداخل وحدود القفل.
### 5.8 — Cache

- المصدر: [cache](https://laravel.com/framework/docs/13.x/cache).
- التغطية وهدف الفهم: source of truth وTTL/invalidation وdrivers وatomic locks وحدودها.
- المختبر ودليل القبول: اختبر stale data وcache miss وفشل cache؛ لا تفترض كل driver يدعم كل ميزة.
### 5.9 — Rate Limiting

- المصدر: [rate-limiting](https://laravel.com/framework/docs/13.x/rate-limiting).
- التغطية وهدف الفهم: مفتاح السياسة وحد الطلب و429 وRetry-After وحدود الخوادم المتعددة.
- المختبر ودليل القبول: اختبر مستخدمين مستقلين وتجاوزًا واستعادة السماح دون IP spoofing.
### 5.10 — Redis

- المصدر: [redis](https://laravel.com/framework/docs/13.x/redis).
- التغطية وهدف الفهم: connection وprefix وserialization وتخصيصه cache/queue/session وحدود الفقد.
- المختبر ودليل القبول: معمل Redis معزول يثبت TTL وفصل المفاتيح؛ لا تعتبره DB دائمة تلقائيًا.
### 5.11 — Artisan Console

- المصدر: [artisan](https://laravel.com/framework/docs/13.x/artisan).
- التغطية وهدف الفهم: arguments/options وIO/exit codes وcommands قابلة للاختبار.
- المختبر ودليل القبول: أمر تقرير dry-run وافحص نجاحًا ومدخلًا ناقصًا وفشل مورد.
### 5.12 — Localization

- المصدر: [localization](https://laravel.com/framework/docs/13.x/localization).
- التغطية وهدف الفهم: ترجمة وfallback/plurals وlocale مقابل timezone؛ وقت ومال بلا float.
- المختبر ودليل القبول: اختبر عربي/إنجليزي وصفر/واحد/متعدد وموعد DST ثابت.
### 5.13 — Helpers وStrings

- المصدر: [helpers](https://laravel.com/framework/docs/13.x/helpers).
- التغطية وهدف الفهم: اختيار helper ذات عقد واضح وStr/Stringable وUnicode وحدود السلاسل.
- المختبر ودليل القبول: اكتب تحويلًا محدودًا مع اختبارات null/صفر/عربية بدل حفظ كتالوج.

## المرحلة 6 — الاختبارات والبوابة التشغيلية

### 6.1 — Testing وHTTP Tests

- المصدر: [testing](https://laravel.com/framework/docs/13.x/testing).
- التغطية وهدف الفهم: unit مقابل feature وPest/PHPUnit واختيار واحد وtest environment.
- المختبر ودليل القبول: اختبارات من أول route؛ هنا راجع نجاح/رفض/حدود HTTP ولا تكتفِ happy path.
### 6.2 — Database Testing

- المصدر: [database-testing](https://laravel.com/framework/docs/13.x/database-testing).
- التغطية وهدف الفهم: DB معزولة وRefreshDatabase وfactories وassertions وحد transactions في tests.
- المختبر ودليل القبول: اختبر constraints وrollback بمحرك مناسب ولا تربط tests بقاعدة حقيقية.
### 6.3 — Mocking

- المصدر: [mocking](https://laravel.com/framework/docs/13.x/mocking).
- التغطية وهدف الفهم: stub/mock/spy وcontainer bindings وMail/Queue/HTTP fakes وما لا تثبته.
- المختبر ودليل القبول: اكتب fake محدودة ثم integration حقيقية تكشف خطأ أخفته.
### 6.4 — Console Tests

- المصدر: [console-tests](https://laravel.com/framework/docs/13.x/console-tests).
- التغطية وهدف الفهم: prompts وarguments وexit codes وoutput contracts.
- المختبر ودليل القبول: اختبر أمرًا تفاعليًا/غير تفاعلي مع failure exit code.
### 6.5 — Browser Tests

- المصدر: [dusk](https://laravel.com/framework/docs/13.x/dusk).
- التغطية وهدف الفهم: متصفح حقيقي وselectors وbrowser/server sessions؛ امتداد بعد feature tests.
- المختبر ودليل القبول: تتبع form وCSRF وredirect في مختبر، بدون بيانات دخول حقيقية.
### 6.6 — Deployment

- المصدر: [deployment](https://laravel.com/framework/docs/13.x/deployment).
- التغطية وهدف الفهم: public root وsecrets/debug off وconfig/routes/views caches وworker restart وhealth/backup/rollback.
- المختبر ودليل القبول: محاكاة إصدار محلي من lockfile ثم فشل وترجيع؛ النشر الخارجي يحتاج إذنًا.
### 6.7 — مشروع واعتماد الأساس

- المصدر: تجميع مخرجات المراحل السابقة، وليس صفحة دوكس منفصلة.
- التغطية وهدف الفهم: منتج حجوزات بواجهة Blade وAPI صغيرة وعزل مستخدمين وتخزين وإشعار وqueue واختبارات.
- المختبر ودليل القبول: ميزة جديدة مستقلة وعطل غير محفوظ وREADME من بيئة نظيفة؛ لا اعتماد بلا دليل.

## المرحلة 7 — تعميق Framework بعد بوابة الأساس

### 7.1 — Broadcasting

- المصدر: [broadcasting](https://laravel.com/framework/docs/13.x/broadcasting).
- التغطية وهدف الفهم: اتصال realtime وقنوات public/private/presence وصلاحية الاشتراك.
- المختبر ودليل القبول: معمل محلي يرفض اشتراك مستخدم غير مأذون ويثبت التسليم الفعلي.
### 7.2 — Concurrency

- المصدر: [concurrency](https://laravel.com/framework/docs/13.x/concurrency).
- التغطية وهدف الفهم: تزامن مهام مستقلة وحدود process/driver ونقل السياق والآثار الجانبية.
- المختبر ودليل القبول: قارن تسلسليًا ومتزامنًا مع قياس وفشل مهمة؛ لا ادعاء CPU parallelism لكل driver.
### 7.3 — Processes

- المصدر: [processes](https://laravel.com/framework/docs/13.x/processes).
- التغطية وهدف الفهم: تشغيل عملية خارجية وtimeouts وstdout/stderr وarguments الآمنة.
- المختبر ودليل القبول: شغّل أمرًا ثابتًا آمنًا وافحص exit code؛ لا shell من مدخل مستخدم.
### 7.4 — Package Development

- المصدر: [packages](https://laravel.com/framework/docs/13.x/packages).
- التغطية وهدف الفهم: service discovery وconfig publishing وautoload وtests وتوافق النسخ.
- المختبر ودليل القبول: حزمة محلية صغيرة من دون نشر خارجي وتثبيت في مشروع تدريب ثان.
### 7.5 — Images

- المصدر: [images](https://laravel.com/framework/docs/13.x/images).
- التغطية وهدف الفهم: معالجة صورة وحدود الحجم والأبعاد والموارد وفق API الإصدار.
- المختبر ودليل القبول: صورة اختبار وحد أبعاد وفشل مدخل؛ اقرأ متطلبات driver قبل التنفيذ.
### 7.6 — Search

- المصدر: [search](https://laravel.com/framework/docs/13.x/search).
- التغطية وهدف الفهم: بحث domain/index وتزامن الفهرس وحدود النتائج والأذونات.
- المختبر ودليل القبول: اختبر تحديثًا وحذفًا وعدم تسريب سجل غير مأذون؛ راجع Scout عند الحاجة.

## المرحلة 8 — خيارات المنظومة الرسمية

دي خريطة اختيار وليست شرط اجتياز الأساس أو دعوى إتقان كل الحزم. قبل أي خيار راجع صفحته من فهرس https://laravel.com/framework/docs/13.x/، وسجل الرابط النهائي وإصدار الحزمة ومتطلباتها؛ الحزم لا يلزم تتبع نفس رقم إصدار framework. لكل خيار checkpoint مستقلة بنفس أجزاء a–d والتقييم، وحالة Not Started حتى يُختار صراحة؛ المتروك يسجل Deferred بسبب وخطة رجوع، بلا درجة.

### 8.1 — Sanctum

- نطاق واختبار الاختيار: sessions للـSPA مقابل API tokens وabilities؛ اختبر CSRF وtoken revocation وownership.
- المتطلبات: بوابة 6.7 وأساس المجال المقابل؛ كل اختيار مستقل ولا يفرض إنهاء بقية الخيارات. ثبّت رابط docs الفعلي في سجل المصدر قبل الشرح؛ فهرس Packages/AI هو نقطة الوصول.
### 8.2 — Fortify

- نطاق واختبار الاختيار: backend auth مقابل UI؛ تتبع endpoints وthrottling واختبر flow محليًا.
- المتطلبات: بوابة 6.7 وأساس المجال المقابل؛ كل اختيار مستقل ولا يفرض إنهاء بقية الخيارات. ثبّت رابط docs الفعلي في سجل المصدر قبل الشرح؛ فهرس Packages/AI هو نقطة الوصول.
### 8.3 — Passport

- نطاق واختبار الاختيار: OAuth2 عند وجود متطلب تفويض؛ لا تختاره بدل Sanctum لمجرد أنه أكبر.
- المتطلبات: بوابة 6.7 وأساس المجال المقابل؛ كل اختيار مستقل ولا يفرض إنهاء بقية الخيارات. ثبّت رابط docs الفعلي في سجل المصدر قبل الشرح؛ فهرس Packages/AI هو نقطة الوصول.
### 8.4 — Socialite

- نطاق واختبار الاختيار: هوية مزود خارجي وstate وربط الحسابات؛ mock أولًا ولا حساب خارجي بلا إذن.
- المتطلبات: بوابة 6.7 وأساس المجال المقابل؛ كل اختيار مستقل ولا يفرض إنهاء بقية الخيارات. ثبّت رابط docs الفعلي في سجل المصدر قبل الشرح؛ فهرس Packages/AI هو نقطة الوصول.
### 8.5 — Cashier (Stripe)

- نطاق واختبار الاختيار: sandbox فقط وwebhook signatures وduplicate events وsubscription lifecycle.
- المتطلبات: بوابة 6.7 وأساس المجال المقابل؛ كل اختيار مستقل ولا يفرض إنهاء بقية الخيارات. ثبّت رابط docs الفعلي في سجل المصدر قبل الشرح؛ فهرس Packages/AI هو نقطة الوصول.
### 8.6 — Cashier (Paddle)

- نطاق واختبار الاختيار: تكامل مستقل عن Stripe؛ sandbox وحالات إلغاء/تأخير/replay.
- المتطلبات: بوابة 6.7 وأساس المجال المقابل؛ كل اختيار مستقل ولا يفرض إنهاء بقية الخيارات. ثبّت رابط docs الفعلي في سجل المصدر قبل الشرح؛ فهرس Packages/AI هو نقطة الوصول.
### 8.7 — Horizon

- نطاق واختبار الاختيار: مراقبة Redis queues وfailed jobs وworker configuration؛ لا تثبت التسليم من dashboard فقط.
- المتطلبات: بوابة 6.7 وأساس المجال المقابل؛ كل اختيار مستقل ولا يفرض إنهاء بقية الخيارات. ثبّت رابط docs الفعلي في سجل المصدر قبل الشرح؛ فهرس Packages/AI هو نقطة الوصول.
### 8.8 — Octane

- نطاق واختبار الاختيار: worker طويل العمر وrequest isolation وmemory leaks وrestart؛ اختبر تسرب الحالة.
- المتطلبات: بوابة 6.7 وأساس المجال المقابل؛ كل اختيار مستقل ولا يفرض إنهاء بقية الخيارات. ثبّت رابط docs الفعلي في سجل المصدر قبل الشرح؛ فهرس Packages/AI هو نقطة الوصول.
### 8.9 — Reverb وEcho

- نطاق واختبار الاختيار: خادم broadcasting وعميل الاشتراك؛ قنوات خاصة واختبار اتصال فعلي محلي.
- المتطلبات: بوابة 6.7 وأساس المجال المقابل؛ كل اختيار مستقل ولا يفرض إنهاء بقية الخيارات. ثبّت رابط docs الفعلي في سجل المصدر قبل الشرح؛ فهرس Packages/AI هو نقطة الوصول.
### 8.10 — Scout

- نطاق واختبار الاختيار: محرك فهرسة وsync وfilters؛ اختبر حذفًا وتأخر فهرس وصلاحيات النتائج.
- المتطلبات: بوابة 6.7 وأساس المجال المقابل؛ كل اختيار مستقل ولا يفرض إنهاء بقية الخيارات. ثبّت رابط docs الفعلي في سجل المصدر قبل الشرح؛ فهرس Packages/AI هو نقطة الوصول.
### 8.11 — Pennant

- نطاق واختبار الاختيار: feature flags وscope وrollout وتقاعد flag؛ لا تعتبر flag نظام صلاحيات.
- المتطلبات: بوابة 6.7 وأساس المجال المقابل؛ كل اختيار مستقل ولا يفرض إنهاء بقية الخيارات. ثبّت رابط docs الفعلي في سجل المصدر قبل الشرح؛ فهرس Packages/AI هو نقطة الوصول.
### 8.12 — Pint

- نطاق واختبار الاختيار: تنسيق فقط لا صحة منطق؛ dry-run ثم تعديل مقصود في نسخة تدريب.
- المتطلبات: بوابة 6.7 وأساس المجال المقابل؛ كل اختيار مستقل ولا يفرض إنهاء بقية الخيارات. ثبّت رابط docs الفعلي في سجل المصدر قبل الشرح؛ فهرس Packages/AI هو نقطة الوصول.
### 8.13 — Precognition

- نطاق واختبار الاختيار: تحقق استباقي للواجهة لا يغني عن تحقق الخادم؛ اختبر عدم تنفيذ الأثر.
- المتطلبات: بوابة 6.7 وأساس المجال المقابل؛ كل اختيار مستقل ولا يفرض إنهاء بقية الخيارات. ثبّت رابط docs الفعلي في سجل المصدر قبل الشرح؛ فهرس Packages/AI هو نقطة الوصول.
### 8.14 — Prompts

- نطاق واختبار الاختيار: Console UX وتحقق المدخل وnon-interactive mode واختبارات exit codes.
- المتطلبات: بوابة 6.7 وأساس المجال المقابل؛ كل اختيار مستقل ولا يفرض إنهاء بقية الخيارات. ثبّت رابط docs الفعلي في سجل المصدر قبل الشرح؛ فهرس Packages/AI هو نقطة الوصول.
### 8.15 — Pulse

- نطاق واختبار الاختيار: مراقبة التطبيق والتكلفة وحدود sampling وحماية dashboard.
- المتطلبات: بوابة 6.7 وأساس المجال المقابل؛ كل اختيار مستقل ولا يفرض إنهاء بقية الخيارات. ثبّت رابط docs الفعلي في سجل المصدر قبل الشرح؛ فهرس Packages/AI هو نقطة الوصول.
### 8.16 — Telescope

- نطاق واختبار الاختيار: debugging وتسجيل بيانات حساسة؛ اختبر تنقيح السجلات وحماية الوصول.
- المتطلبات: بوابة 6.7 وأساس المجال المقابل؛ كل اختيار مستقل ولا يفرض إنهاء بقية الخيارات. ثبّت رابط docs الفعلي في سجل المصدر قبل الشرح؛ فهرس Packages/AI هو نقطة الوصول.
### 8.17 — Sail

- نطاق واختبار الاختيار: بيئة Docker اختيارية وتوافق permissions/volumes وDB معزولة.
- المتطلبات: بوابة 6.7 وأساس المجال المقابل؛ كل اختيار مستقل ولا يفرض إنهاء بقية الخيارات. ثبّت رابط docs الفعلي في سجل المصدر قبل الشرح؛ فهرس Packages/AI هو نقطة الوصول.
### 8.18 — Valet

- نطاق واختبار الاختيار: خيار بيئة macOS فقط؛ لا يُفرض على Windows.
- المتطلبات: بوابة 6.7 وأساس المجال المقابل؛ كل اختيار مستقل ولا يفرض إنهاء بقية الخيارات. ثبّت رابط docs الفعلي في سجل المصدر قبل الشرح؛ فهرس Packages/AI هو نقطة الوصول.
### 8.19 — Homestead

- نطاق واختبار الاختيار: خيار VM عند الحاجة؛ لا شرط تثبيت إضافي مع Herd/Sail.
- المتطلبات: بوابة 6.7 وأساس المجال المقابل؛ كل اختيار مستقل ولا يفرض إنهاء بقية الخيارات. ثبّت رابط docs الفعلي في سجل المصدر قبل الشرح؛ فهرس Packages/AI هو نقطة الوصول.
### 8.20 — Envoy

- نطاق واختبار الاختيار: مهام تشغيل عبر SSH؛ معمل محلي/وهمي أولًا ولا أوامر خادم حقيقي بلا إذن.
- المتطلبات: بوابة 6.7 وأساس المجال المقابل؛ كل اختيار مستقل ولا يفرض إنهاء بقية الخيارات. ثبّت رابط docs الفعلي في سجل المصدر قبل الشرح؛ فهرس Packages/AI هو نقطة الوصول.
### 8.21 — Folio

- نطاق واختبار الاختيار: file-based routing عند الحاجة بعد فهم routes والصلاحيات.
- المتطلبات: بوابة 6.7 وأساس المجال المقابل؛ كل اختيار مستقل ولا يفرض إنهاء بقية الخيارات. ثبّت رابط docs الفعلي في سجل المصدر قبل الشرح؛ فهرس Packages/AI هو نقطة الوصول.
### 8.22 — Head

- المصدر: [Laravel Head](https://laravel.com/framework/docs/head)، مراجعة 2026-10-23؛ ثبّت إصدار الحزمة عند المختبر.
- نطاق واختبار الاختيار: إدارة title/meta/canonical وstructured data داخل head؛ قارن defaults ببيانات route وruntime، واختبر الناتج المرسل فعلًا بلا tags مكررة أوبيانات غير موثوقة.
- المتطلبات: بوابة 6.7 وأساس المجال المقابل؛ كل اختيار مستقل ولا يفرض إنهاء بقية الخيارات. ثبّت رابط docs الفعلي في سجل المصدر قبل الشرح؛ فهرس Packages/AI هو نقطة الوصول.
### 8.23 — Mix

- نطاق واختبار الاختيار: قراءة مشاريع legacy واختيار migration مقصودة؛ Vite المسار الافتراضي الجديد.
- المتطلبات: بوابة 6.7 وأساس المجال المقابل؛ كل اختيار مستقل ولا يفرض إنهاء بقية الخيارات. ثبّت رابط docs الفعلي في سجل المصدر قبل الشرح؛ فهرس Packages/AI هو نقطة الوصول.
### 8.24 — AI SDK

- نطاق واختبار الاختيار: مزود وتكلفة وstructured output وtimeouts وtool permissions وevals؛ fake بلا API key أولًا.
- المتطلبات: بوابة 6.7 وأساس المجال المقابل؛ كل اختيار مستقل ولا يفرض إنهاء بقية الخيارات. ثبّت رابط docs الفعلي في سجل المصدر قبل الشرح؛ فهرس Packages/AI هو نقطة الوصول.
### 8.25 — MCP

- نطاق واختبار الاختيار: tools/resources وtrust boundaries وauth وprompt injection؛ لا توصيل أدوات مؤثرة بلا إذن.
- المتطلبات: بوابة 6.7 وأساس المجال المقابل؛ كل اختيار مستقل ولا يفرض إنهاء بقية الخيارات. ثبّت رابط docs الفعلي في سجل المصدر قبل الشرح؛ فهرس Packages/AI هو نقطة الوصول.
### 8.26 — Boost وAgentic Development

- نطاق واختبار الاختيار: مساعدة مرتبطة بإصدارات المشروع؛ راجع diff واختبر ولا تسلم التفكير للوكيل.
- المتطلبات: بوابة 6.7 وأساس المجال المقابل؛ كل اختيار مستقل ولا يفرض إنهاء بقية الخيارات. ثبّت رابط docs الفعلي في سجل المصدر قبل الشرح؛ فهرس Packages/AI هو نقطة الوصول.

### 8.27 — MongoDB

- المصدر: [MongoDB](https://laravel.com/framework/docs/mongodb)، من فهرس Database؛ اختياري وليس بديلًا ضمنيًا لمعمل SQL.
- نطاق واختبار الاختيار: document modeling وdriver integration وفروق العلاقات والاستعلامات والمعاملات عن SQL؛ لا تفترض تطابق كل API أوضمانات المحركين.
- المتطلبات: بوابة 6.7 وأساس نمذجة البيانات. مختبر محلي معزول ونسخ موثقة؛ اختبر read/write وفشلًا وقيدًا واذكر حدود المقارنة. لا اتصال بقاعدة حقيقية أوحساب سحابي بلا إذن.

## التغطية والعودة للمرجع

- Prologue: Release Notes وUpgrade Guide وContribution Guide في مراجعة الإصدار والمساهمة أدناه.
- Getting Started وArchitecture وBasics: مراحل 0–2؛ Frontend/Starter Kits تقرأ مع 2.9، وDeployment في 6.6.
- Database/Eloquent: مرحلة 3؛ Factories مع 3.3 وEloquent Collections مع 3.9. MongoDB خيار8.27 مستقل، وليس ضمن إتقان SQL تلقائيًا.
- Security: مرحلة 4؛ Digging Deeper: 2.14 و3.9 ومرحلة 5 ومرحلة 7. Context مرتبط بالتتبع، Contracts في 1.5، وStrings/Helpers في 5.13.
- Testing: مرحلة 6، وDusk هو موضوع Browser Tests نفسه وليس اختبارًا ثانيًا مكررًا.
- AI/Packages: مرحلة 8. خدمات Cloud/Forge/Nightwatch/Vapor/Nova والمنتجات المدفوعة ليست متطلبات framework ولا نفتح حسابات لها تلقائيًا.
- API Documentation وChangelog مراجع بحث عند سؤال محدد، مش حفظ آلاف signatures. أي صفحة جديدة أو تغيير فهرس يُسجل Coverage gap مع تاريخ ومكان إدراج قبل تعديل ترتيب الدراسة.

مراجع الصفحات المشتركة بين أكثر من عنوان: [Contracts](https://laravel.com/framework/docs/13.x/contracts)، [Context](https://laravel.com/framework/docs/13.x/context)، [HTTP Tests](https://laravel.com/framework/docs/13.x/http-tests)، [Factories](https://laravel.com/framework/docs/13.x/eloquent-factories)، [Eloquent Collections](https://laravel.com/framework/docs/13.x/eloquent-collections)، [Frontend](https://laravel.com/framework/docs/13.x/frontend)، [Starter Kits](https://laravel.com/framework/docs/13.x/starter-kits)، [Strings](https://laravel.com/framework/docs/13.x/strings). الروابط نقاط قراءة عند الدرس؛ وجودها لا يعني تدقيق كل محتواها الآن.

## مراجعة الإصدار والمساهمة بعد المشروع

بعد 6.7، افتح [Upgrade Guide](https://laravel.com/framework/docs/13.x/upgrade) و[Contribution Guide](https://laravel.com/framework/docs/13.x/contributions). في نسخة disposable: افحص تغييرًا موثقًا، dependency constraints وdeprecations، واختبر قبل/بعد. للمساهمة جهز bug reproduction صغيرة واختبارًا وشرح expected/actual؛ لا issue/PR/push بلا طلب صريح. يسجل هذا كتعميق 7.R في Progress، لا نجاح ترقية لمجرد قراءة الدليل.

## مشروع الأساس ومخرجاته

نظام حجوزات صغير: users/bookings/items، واجهة Blade وAPI قراءة محدودة، validation وpolicies وعزل ملكية، transaction لحالة حجز، ملف خاص بتنزيل مأذون، notification بعد commit وjob قابلة للتتبع، وموعد UTC مع سياسة منطقة زمنية. لا دفع حقيقي أو بيانات عميل حقيقية. يتطور بالمراحل؛ لا نبني مشروعًا ضخمًا في آخر جلسة.

بوابة 6.7: happy path + رفض مستخدم آخر + mass assignment/CSRF/invalid shape + rollback + query count وN+1 + worker failure/retry + output escaping + clock ثابت + README و.env.example بلا secrets وlockfiles. شغل من بيئة نظيفة وأضف ميزة مستقلة ثم شخّص عطلًا جديدًا. سجل ما اختُبر فعلًا وما بقي افتراضًا، ولا تعتبر fake دليل شبكة/DB/broker حقيقي. لا لقب Master بمجرد إنهاء قراءة الدوكس.

## الحفظ والأمان ونهاية الجلسة

لا تعدل صفحات الموقع أوsidebars أوتنشر درسًا تلقائيًا؛ المطلوب هنا دراسة خاصة. لا commit/push/deploy/delete أوتغيير أسرار/DB/موارد خارجية بلا إذن. لا تثبت حزمًا أوتطبق migrations أوتشغّل remote installers لمجرد وجود أمر في الدوكس. بيانات DB التدريب وحدها مجال أي reset مصرح به.

بعد الجلسة حدّث Progress المجاور: الموضع a–d والسطر/السؤال المتوقف عنده، الدليل والإصدارات والمصدر والدرجة والتصور المصحح وReview Queue وNext Action واحدة. حافظ على التاريخ والدرجات القديمة، وحدّث ملخص المسار في STUDY_SESSION_CONTEXT.md عند تغير الدراسة. لا نسخ للمحادثة ولا درجات في صفحات عامة.

