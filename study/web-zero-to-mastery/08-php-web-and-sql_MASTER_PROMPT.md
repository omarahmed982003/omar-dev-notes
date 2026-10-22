# المرحلة 8 — PHP للويب وقاعدة البيانات الأولى

الإصدار: 1.1 — 2026-10-21. المتطلبات: بوابة المرحلة 7 و PHP متعدد الملفات من 3.5. لا نفترض SQL سابقًا ولا OOP تصميمية؛ نتعلم استهلاك object جاهز من مكتبة في موضع PDO دون تحويل الدرس إلى منهج OOP.

## حدود بوابة SQL المحلية

`8.SQL-Bridge->PDO` = نجاح `8.4.a–8.4.d` بمختبر SQL محلي و 80% لكل جزء، ثم تطبيقها في 8.5. ده جسر مبتدئ يملكه هذا الملف؛ لا يشترط إكمال Database Master حتى phase7 أو دراسة optimizer و window functions أولًا. المنهج [Database Master](../Database_Master_Prompt.md) مرجع تعميق لاحق في 14، وليس مصدر درجات لهذه الوحدات الجديدة. لا يُعلَّم أي checkpoint قديمة Passed بسبب اجتياز الجسر؛ [DATABASE_PROGRESS](../DATABASE_PROGRESS.md) يبقى كما هو ما لم ندرس مساره صراحة.

### 8.1 — PHP من طلب HTTP لرد

المتطلبات: 4.7.a و 5.3 و 3.5. النتيجة: يتتبع تنفيذ ملف PHP للويب ويفصل طلبًا عن التالي ويشرح ما يراه client.

#### 8.1.a — إعداد مختبر ويب محلي

التسلسل: CLI مقابل Web SAPI ← web server و PHP ← document root ← script و static asset ← request/response. المختبر: تشغيل محلي محدود على loopback في مجلد تدريب وإظهار header وحالة ورد صغير؛ المتوقع رؤية response لا source. الغلط: خادم PHP التطويري إعداد Production أو وضع secrets داخل document root آمن.

#### 8.1.b — مدخل و status و headers

التسلسل: request method/URL ← superglobals المحددة ← status/headers/body ← headers قبل output ← عمر الطلب. المختبر: route يعيد 200 وآخر 404؛ المتوقع خرج مختلف يمكن إثباته بـ curl. تمرين مستقل: يشخص headers-already-sent ويفسر متغيرًا لا يبقى تلقائيًا بين الطلبات؛ دليل طلبين وشرح و 80%.

### 8.2 — Routing و templates و redirect

المتطلبات: 8.1 و require/__DIR__ من 3.5.b. النتيجة: يبني صفحة server-rendered مع فصل معالجة الطلب عن العرض وحد ثقة واضح.

#### 8.2.a — اختيار route لا اختيار ملف من المستخدم

التسلسل: method/path mapping ← front controller/bootstrap صغير ← handler ← template ثابت ← output escaping حسب السياق. المختبر: قائمة وتفاصيل من data تدريب؛ المتوقع 404 لمعرف غائب ونص مستخدم يظهر كنص لا HTML. الغلط: تمرير path المستخدم مباشرة إلى include أو escaping واحد يصلح لكل HTML/JS/URL context.

#### 8.2.b — إرسال ثم Redirect ثم GET

التسلسل: template بمتغيرات معلنة ← form handling ← response redirect ← Post/Redirect/Get ← feedback مؤقت. المختبر: إضافة record مؤقت ثم refresh؛ المتوقع فهم لماذا لا نعيد POST، مع بيان أن PRG لا يضمن idempotency كاملة. تمرين مستقل: صفحة تعديل ب template مستقل و redirect صحيح وحالة غير موجود؛ دليل network flow و 80%.

### 8.3 — Validation ورفع الملفات

المتطلبات: 8.2 و 5.3. النتيجة: يقبل بيانات معلومة البنية ويرفض غير الصالح حتى لو تجاوز المستخدم validation المتصفح.

#### 8.3.a — Parse ثم validate ثم قرار

التسلسل: GET/POST ← missing/scalar/array input ← trim وحدوده ← type/range/length ← رسائل field-specific ← إعادة عرض آمنة. المختبر: طلبات مصنوعة يدويًا تتجاوز الواجهة؛ المتوقع رفض البيانات السيئة وعدم تحويل كل خطأ إلى 500. الغلط: `required` في HTML يمنع الطلب الخبيث أو كل sanitize يساوي validation.

#### 8.3.b — ملف غير موثوق

التسلسل: multipart ← upload error/size ← allowlist للنوع وفحص المحتوى المناسب ← اسم مولد وتخزين خارج التنفيذ ← تنزيل مضبوط وصلاحية. المختبر: ملف نص صالح وآخر كبير/نوع مخالف داخل sandbox؛ المتوقع رفض مفيد دون اعتماد اسم الامتداد وحده. تمرين مستقل: ينفذ endpoint لبيانات وملف بشروط معلنة ويفحص blank/missing/array/oversize؛ دليل قبول ورفض و 80%، لا ملفات ضارة حقيقية.

### 8.4 — جسر SQL الأول المستقل

المتطلبات: 8.3 و arrays/validation؛ لا SQL أو Database Master سابق. النتيجة: يصمم schema صغيرة ويقرأ ويعدل بياناتها ويشرح حدود transaction أولية. نختار محركًا واحدًا محليًا مدعومًا ونوثق نسخته و driver وتهيئته، وقاعدة تدريب معزولة وصلاحيات محدودة؛ لا أوامر على قاعدة حقيقية.

#### 8.4.a — جدول وأنواع وقيود

التسلسل: data/database/DBMS ← rows/columns/types ← NULL مقابل قيمة ← primary key و foreign key ← NOT NULL/UNIQUE/check الملائم للمحرك ← users/tasks schema. المختبر: إنشاء جدولين ورفض duplicate/مرجع غير موجود؛ المتوقع قاعدة البيانات تحمي قيودًا لا تتركها لتذكر التطبيق. تمرين مستقل: يضيف حقلًا بمتطلبات معلنة ويبرر نوعه وقيوده؛ دليل DDL وعمليات قبول ورفض و 80%.

#### 8.4.b — CRUD واستعلام محدد

المتطلبات: 8.4.a. التسلسل: INSERT/SELECT/UPDATE/DELETE ← WHERE و NULL semantics ← ORDER BY/LIMIT ← COUNT/SUM تمهيديًا ← transactions التدريبية حول تغييرات التجربة. المختبر: مهام لمستخدمين وتغيير task واحدة؛ المتوقع عدد الصفوف المقصود لا تحديث الجدول كله. الغلط: ترتيب SELECT مضمون بلا ORDER BY أو NULL يساوي null بمقارنة عادية. تمرين مستقل: تقرير بيانات وفحوص منع تعديل غير مقصود؛ SQL ونتائج و 80%.

#### 8.4.c — Modeling و JOIN لخدمة السؤال

المتطلبات: 8.4.b. التسلسل: cardinality ← ملكية task ← PK/FK واتجاه العلاقة ← INNER/LEFT JOIN ← duplicate rows و missing owner ← فصل كيانات بسيطة لتقليل تناقض البيانات. المختبر: قائمة مستخدمين وعدد مهامهم بما فيهم مستخدم بلا مهام؛ المتوقع تفسير الصفوف والنتيجة لا SQL محفوظة. تمرين مستقل: نموذج فئات ومهام وعلاقة واحدة يبررها ويرسمها ويستعلمها؛ دليل ERD صغير و query و 80%، لا normalization أكاديمية كاملة شرطًا.

#### 8.4.d — Transaction قبل أول تغيير متعدد

المتطلبات: 8.4.c؛ فشل/exception من 3.6. التسلسل: تغييران كوحدة عمل ← BEGIN/COMMIT/ROLLBACK ← قيد وفشل بين الخطوات ← معنى atomicity وحدودها ← مقدمة أن التزامن والعزل لهما تفاصيل لاحقة. المختبر: إنشاء task وسجل حدث معها ثم فشل مُحاكى؛ المتوقع نجاح الاثنين أو عدم حفظ أي منهما في transaction مدعومة بالمحرك. الغلط: transaction تجعل email أو filesystem rollback تلقائيًا. تمرين مستقل: يحدد boundary ويثبت فشلًا ونجاحًا بالعد قبل/بعد؛ SQL ودليل و 80% تغلق بوابة `8.SQL-Bridge->PDO`، لا تمنح درجات قديمة أو ادعاء فهم MVCC كامل.

### 8.5 — PDO واستهلاك مكتبة جاهزة

المتطلبات: بوابة `8.SQL-Bridge->PDO` و 3.6. النتيجة: يستدعي SQL بعقد آمن ويشرح ما يتغير وما لا يتغير عن المختبر اليدوي.

#### 8.5.a — Connection و object مستخدم لا مُصمَّم

التسلسل: package/extension و PDO driver الفعلي ← object مكتبة يحتفظ باتصال و methods نستدعيها ← config خارج document root/repository ← exception mode ← query/result fetch. المختبر: نفس SELECT اليدوي عبر PDO؛ المتوقع نفس البيانات وخطأ اتصال محلي مسجل دون عرض credentials. الغلط: لازم نتعلم كل inheritance قبل استعمال client library أو إنشاء connection لكل row.

#### 8.5.b — Prepared values و transactions والفشل

التسلسل: prepare/execute ← bound values ← identifiers لا تُربط كقيم وتحتاج allowlist ← fetch modes/حدود الحجم ← begin/commit/rollback ← فشل مضبوط. المختبر: نص يحوي quote كقيمة، ثم sort key غير مسموح؛ المتوقع بقاء النص بيانات ورفض identifier. تمرين مستقل: endpoint قراءة/كتابة مع SQL واضح و rollback واختبارات invalid/empty؛ دليل generated intent والصفوف و 80%، لا SQL concatenation لمدخلات.

### 8.6 — Cookies و sessions ودخول وصلاحية

المتطلبات: 8.5 و 4.8.a و 7.6. النتيجة: يميز إثبات الهوية عن إذن قراءة record ويكمل login/logout آمنًا في مختبر فقط.

#### 8.6.a — Cookie و session identifier

التسلسل: request مستقل ← cookie ترسل تلقائيًا وفق scope ← session state على الخادم ← Secure/HttpOnly/SameSite ← expiration و regeneration. المختبر: زائر ثم جلسة مع تبديل المعرف بعد حدث مناسب؛ المتوقع شرح أين البيانات وأين identifier. الغلط: كل session بيانات داخل cookie أو HttpOnly تمنع كل آثار XSS. تمرين مستقل: يفسر trace ويفحص ضبط flags محليًا؛ 80%، مع مراعاة HTTPS في اختبار Secure.

#### 8.6.b — Login/logout و password hashing

المتطلبات: 8.6.a. التسلسل: هوية ومستخدم ← password_hash/password_verify ← login والرفض برسالة غير كاشفة ← logout وإبطال الجلسة ← عدم تسجيل السر. المختبر: مستخدمان محليان؛ المتوقع hash مختلف عن plaintext وإبطال دخول بعد logout. تمرين مستقل: يثبت رفض كلمة خاطئة وعدم بقاء الجلسة المبطلة؛ دليل واختبارات و 80%، بلا cryptography مخصصة أو نظام لعملاء حقيقيين.

#### 8.6.c — Ownership و CSRF

المتطلبات: 8.6.b. التسلسل: authorization لكل طلب و record ← owner predicate ← default deny ← CSRF token والتحقق عند التعديل ← token ليس بديل الصلاحية. المختبر: مستخدم A يحاول task لـ B وطلب تعديل بلا token؛ المتوقع الرفض وعدم تغير DB. الغلط: إخفاء زر أو صعوبة تخمين ID حماية. تمرين مستقل: يكتب negative tests لكل action ويفسر حد SameSite؛ دليل 80% بلا ثغرة ملكية أو bypass قبل النجاح.

### 8.7 — حدود الثقة والمراجعة الأمنية الأولى

المتطلبات: 8.6 و 8.3. النتيجة: يجد موضع عبور input غير موثوق ويحميه بوسيلة تناسب السياق بدل تعقيم عام.

#### 8.7.a — XSS و SQLi و path traversal

التسلسل: تتبع المصدر إلى sink ← HTML context escaping ← prepared SQL ← allowlisted resource mapping ← رفع ملفات غير منفذ. المختبر: strings اختبار غير مؤذية ومسار خارج مجلد التدريب مطلوب منطقيًا لا تنفيذ وصول فعلي؛ المتوقع عرض آمن ورفض تجاوز الحدود. الغلط: ORM أو strip_tags تمنع كل أنواع injection. تمرين مستقل: مراجعة ثلاثة handlers وإثبات إصلاحات باختبار regression؛ 80%.

#### 8.7.b — Secrets و errors ومبدأ أقل صلاحية

التسلسل: env/config خارج الشحن ← logs منقحة ← generic user errors ← credentials محلية محدودة ← مراجعة جميع authorization paths. المختبر: secret وهمي وخطأ DB؛ المتوقع عدم ظهوره في response أو diff أو log العام. تمرين مستقل: checklist threat boundaries وتقرير finding وإعادة اختبار؛ دليل و 80%، مع منع أي تسريب أو bypass معروف من المرور.

### 8.8 — Integration tests محلية قابلة للإعادة

المتطلبات: 8.7 و 3.7. النتيجة: يختبر العقد من HTTP إلى DB ويثبت سلامة التنظيف وحدود الاختبار.

#### 8.8.a — Fixtures وبيئة معزولة

التسلسل: قاعدة test منفصلة ← بيانات مستخدمين ثابتة ← setup/teardown محدود ← request/response assertions ← data state assertion. المختبر: create valid ثم invalid؛ المتوقع rows محددة وعدم تلوث الاختبار التالي. الغلط: اسم قاعدة الإنتاج مسموح طالما سنعمل rollback. تمرين مستقل: test يرفض بيئة غير test قبل أي تنظيف؛ دليل و 80%.

#### 8.8.b — رحلة ورفض وفشل جديد

التسلسل: login ← create ← list ← ownership rejection ← CSRF failure ← DB/parse failure ← logout؛ اختبارات يمكن تشغيلها من خطوات موثقة. المختبر: كسر owner check مؤقتًا في نسخة تدريب؛ المتوقع negative test يفشل ثم ينجح بعد الإصلاح. تمرين مستقل: يضيف اختبار route جديدة ويشخص عطلًا مجهولًا؛ الدليل run كامل و 80% دون اختراع نتائج.

## مشروع المرحلة وبوابة الخروج

Task Manager بـ Plain PHP و SQL: حسابات محلية ومهام مملوكة، routing/templates، validation/CSRF/escaping، PDO و transaction صغيرة، integration tests و README تشغيل. البوابة: 80% لكل checkpoint وجزئية مقيمة والمشروع، لا تجاوز ملكية أو تسريب أسرار، وإصلاح عطل جديد مستقل. لا تنشر custom login لعملاء حقيقيين كتجربة. التواريخ المعقدة و UTC/user timezone/DST لها المختبر المالك في 10 بعد OOP؛ تاريخ نصي محدود هنا لا يدعي تغطيتها.

## مراجع التنفيذ

راجع [PDO](https://www.php.net/manual/en/book.pdo.php)، و[Password hashing](https://www.php.net/manual/en/book.password.php)، و[PHP sessions](https://www.php.net/manual/en/book.session.php)، ودليل SQL الرسمي للمحرك والإصدار المختارين عند إعداد المختبر. دي مصادر لتفسير السلوك وليست تصريحًا بتجربة على قاعدة إنتاج.

## تشغيل جلسة هذه الجزئية

- اقرأ [الفهرس](README.md) و[قواعد التدريس والتقييم](COMMON_RULES.md) كاملين، ثم هذا الملف و[ملف التقدم](08-php-web-and-sql_PROGRESS.md) كاملين قبل الشرح.
- هذا الملف منهج الجزئية، وليس الدرس المنشور أو دليل اجتيازها. اشرح checkpoint واحدة على أجزاء، وسؤالًا واحدًا كل مرة، بالعامية المصرية و PHP افتراضيًا إلا في موضوع لغة أخرى.
- ملف التقدم المجاور يملك الموضع والنتائج الخاصة بهذه الجزئية. الفهرس وملف التوجيه العام لا يكرران الدرجات.
- الجسور التمهيدية المحلية تُدرس وتُقيّم هنا. المرجع القديم لا يفرض إكمال مساره ولا يغير تقدمه؛ عند اختيار دراسة مسار قديم صراحة اقرأ Master و Progress الخاصين به كاملين من study الأب، وسجل درجاته هناك وحده مع مرجع عودة هنا.
- قواعد المنهج المشتركة وخرائط ملاك الموضوعات في COMMON_RULES.md؛ أسماء ملفات المسارات القديمة المذكورة أعلاه تُحل من study الأب، لا من هذا المجلد.

## إنهاء الجلسة

حدّث Progress هذه الجزئية وفق الدليل الفعلي والدروس الفرعية، والجسور المحلية نتائجها هنا فقط. لا تحدّث تقدمًا قديمًا إلا عند دراسة مساره الأصلي صراحة وفق قواعده، ولا تنسخ درجاته. حدّث مؤشر العودة عند تغيير الجزئية، وسجل بوابة انتقال أو موعد عودة معلنًا دون اجتياز وهمي. لا تبدأ الدراسة أو النشر أو commit أو push تلقائيًا.
