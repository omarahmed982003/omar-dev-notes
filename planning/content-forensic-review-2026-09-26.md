> تحديث التنفيذ: راجع [الإصلاحات والاختبارات اللاحقة](content-repair-results-2026-09-26.md). النص التالي يحفظ أدلة النسخة السابقة قبل التصحيح.

# تدقيق محتوى الدروس — 26 سبتمبر 2026

**الحكم:** المحتوى واسع ومفيد، لكنه لا يصلح حاليًا للاعتماد عليه كمنهج مكتمل ومدقق للمبتدئ. توجد أخطاء قابلة لإعادة الإنتاج، وتعريفات خاطئة، وتمارين تعد بنتائج لا يحققها المثال، وفجوات في المتطلبات والتنفيذ. بعض الإضافات وسّعت قائمة المصطلحات أكثر مما عمّقت الشرح.

هذه مراجعة للمحتوى الحالي؛ لا تعتمد أحكامها على وصف تقارير المراجعة القديمة للعمل بأنه «مغلق». لم أعدل الدروس.

## ما فُحص وحدود النتيجة

- جرد جميع ملفات المحتوى: **262 ملفًا**، 131 لكل لغة. في كل لغة: 115 درسًا محسوبًا في المسارات، ودرسان مؤرشفان من C++، و13 فهرسًا، وصفحة reference من القالب.
- استخراج **1,011 كتلة أمثلة**. منها 463 كتلة PHP؛ فُحصت صياغة 456 بمفسر **PHP 8.4.23** واستُبعدت 7 كتل تستخدم صياغة PHP 8.5. نجحت 449، وأعادت 7 تشخيصات: اثنتان فساد حقيقي في مثال التعليقات، وخمس مقتطفات تحتاج سياق كلاس أو ليست برنامجًا مستقلًا. لا يجوز وصف التشخيصات السبعة كلها بأنها أخطاء لغة في الدروس.
- 23 كتلة JSON قابلة للتحليل. صحة JSON نحويًا لا تثبت صحة إعداد Composer الموجود داخله.
- لم يكشف الفحص الساكن للروابط المحلية المطلقة بصيغة Markdown هدفًا مفقودًا. هذا لا يفحص anchors أو الروابط الخارجية كلها أو العرض في المتصفح.
- مراجعة نصية وأمثلة عبر المسارات السبعة، مع فحص أعمق للحالات المبينة أدناه وإعادة إنتاج مختارة ومراجعة مصادر أولية.
- **ليست هذه شهادة بأن كل جملة في اللغتين قورنت بمصدر وأن كل برنامج شُغّل.** لم يتوفر مترجم C++ ضمن الأوامر المكتشفة، ولم أشغّل مختبرات فعلية لـFPM وRedis وSQL وOAuth أو أراجع PDF بصريًا. تكافؤ الترجمتين لم يُثبت فقرة بفقرة. الملفات التي اجتازت lint قد تحتوي أخطاء منطقية أو اعتماديات غير معرفة.

الأدلة المحلية: [الجرد](C:/my_docs/tmp/content-audit/inventory.csv)، [تشخيصات PHP](C:/my_docs/tmp/content-audit/php-lint.json)، [كود إعادة الإنتاج](C:/my_docs/tmp/content-audit/reproduce.php)، [نتيجته](C:/my_docs/tmp/content-audit/reproduce-output.txt)، [فحوص إضافية](C:/my_docs/tmp/content-audit/additional-checks.php)، [نتائجها](C:/my_docs/tmp/content-audit/additional-output.txt).

## أخطاء ومشكلات يجب إصلاحها

الأولوية P1 تعني التصحيح قبل اعتماد المثال للتعلم أو النسخ. P2 تعني خطأ في الدقة أو اتساقًا/شرحًا ناقصًا. الخطورة هنا تخص المادة التعليمية، وليست ادعاء بوجود ثغرة مستغلة في موقع الدوكس.

### 1. P1 — تعريفات Markdown داخل كود PHP

[مقدمة PHP:266](C:/my_docs/src/content/docs/php/01-introduction-and-syntax.md:266) و[الإنجليزية:259](C:/my_docs/src/content/docs/en/php/01-introduction-and-syntax.md:259): أُدرجت أسطر مثل `- **Syntax:** ...` داخل كتلة مثال التعليقات. النسخ يعطي `Parse error: unexpected token "**"`. يجب إخراج التعريفات من الكود وفحص المثال نفسه مجددًا. هذا ليس مجرد تنسيق سيئ؛ أول درس يعلّم صياغة لا تعمل.

### 2. P1 — بادئة PSR-4 خاطئة رغم أن JSON صحيح

[Namespaces:92](C:/my_docs/src/content/docs/php/10-namespaces-autoloading.md:92) و[الإنجليزية:73](C:/my_docs/src/content/docs/en/php/10-namespaces-autoloading.md:73): المثال يحتوي `"App\\\\"`، فتكون البادئة بعد فك JSON بطول 5 وبفاصلين فعليين. الاسم `App\Billing\InvoiceService` لا يبدأ بها. الصحيح في JSON هو `"App\\": "src/"`. درس Composer الآخر يعرض الصيغة الصحيحة؛ يوجد تناقض داخلي. أُثبت عدم التطابق محليًا؛ لم أعتبر نجاح تحليل JSON دليل نجاح autoload. [توثيق Composer](https://getcomposer.org/doc/04-schema.md#psr-4).

### 3. P1 — Attribute مخصص للـmethod موضوع على function

[ميزات PHP:164](C:/my_docs/src/content/docs/php/16-modern-php-features.md:164): `TARGET_METHOD` لا يطابق الدالة الحرة `deleteUser`. الحصول على `ReflectionAttribute` ينجح، لكن `newInstance()` يفشل برسالة `cannot target function`. لذلك الخطأ قد يختبئ في المثال الحالي ويظهر عند إكمال التطبيق المقصود. استخدم `TARGET_FUNCTION` أو انقل الدالة إلى كلاس، أو اسمح بالنوعين عند الحاجة. موجود أيضًا في الإنجليزية. [دليل PHP](https://www.php.net/manual/en/language.attributes.classes.php).

### 4. P1 — محلل الأموال يقبل قيمة مشوهة ويحسب مبلغًا آخر

[المشروع المتكامل:55](C:/my_docs/src/content/docs/php/17-integrated-programs-debugging.md:55): الإدخال `"12.5\n"` يمر من regex لأن `$` يمكنه المطابقة قبل newline نهائي، ثم ينتج **1205** وحدة صغيرة. المقصود إما رفضه أو تطبيع صريح يعطي 1250؛ لا يصح تغيير المبلغ بهذه الصورة. استخدم حدودًا صارمة مثل `\A...\z` وسياسة واضحة للمسافات. أُعيد إنتاجه على PHP 8.4، والمثال نفسه في الإنجليزية.

### 5. P1 — نفس المثال لا يحمي نطاق الأعداد

[المشروع المتكامل:62](C:/my_docs/src/content/docs/php/17-integrated-programs-debugging.md:62): تحويل الجزء الصحيح ثم ضربه في 100 بلا حد يمكن أن ينتج float، فتفشل قيمة الإرجاع بـ`TypeError`. الاستثناء غير ممسوك لأن المثال يمسك `InvalidArgumentException` فقط. كذلك مجموع عدة مبالغ مقبولة منفردة قد يتجاوز int. يلزم فحص الطول/الحد قبل التحويل والضرب والجمع. التدريب نفسه يطلب اختبار قيمة ضخمة، لكن البرنامج لا يحقق معالجة الرفض المعلنة.

### 6. P1 — تحويل IDs ليس Validation

[Superglobals:346](C:/my_docs/src/content/docs/php/02-variables-scope-superglobals.md:346): `array_map('intval', $orderIds)` يحوّل `12x` إلى 12 وarray غير فارغة إلى 1. الفلترة اللاحقة `> 0` تقبلهما. المطلوب التحقق من نوع كل عنصر وصيغته ومداه ورفض nested arrays وتحديد عدد العناصر، ثم التحويل. هذا لا يثبت وحده تجاوز صلاحيات، لكنه يثبت أن المثال يقبل مدخلات غير صحيحة ويحوّلها إلى معرفات أخرى.

### 7. P2 — نموذج الترحيب لا يتحمل شكل GET غير المتوقع

[مقدمة PHP:300](C:/my_docs/src/content/docs/php/01-introduction-and-syntax.md:300): `?name[]=Omar` يجعل `trim()` يرمي `TypeError`. الدرس التالي يعالج الحالة بالفعل، لكن المثال الأول يحتاج تنبيهًا واضحًا إلى حدود تبسيطه أو فحص `is_string` قبل الاستخدام. أُثبت الخطأ محليًا.

### 8. P1 — مثال منع تكرار jobs لا يضمن عدم التكرار

[Queues:34](C:/my_docs/src/content/docs/php-runtime/12-queues-workers-scheduling.md:34): التسلسل `contains → handle → record` يسمح لعاملين بالمرور معًا، أو بتنفيذ الأثر ثم crash قبل `record`. عبارة «atomic قدر الإمكان» لا تكمل الخوارزمية. المطلوب مثال فعلي بقيد uniqueness ومعاملة عندما يكون الأثر في نفس قاعدة البيانات، أو idempotency لدى الخدمة الخارجية وآلية reconciliation. Outbox يعالج إرسال الحدث ولا يجعل كل side effect خارجي ذريًا تلقائيًا. هذه مراجعة للتسلسل؛ لم يُشغّل broker فعلي.

### 9. P1 — منع إعادة استخدام TOTP ليس اختياريًا

[درس MFA:30](C:/my_docs/src/content/docs/auth/14-mfa-passkeys.md:30): عبارة «امنع replay ... إن أمكن» أضعف من شرط البروتوكول. بعد نجاح التحقق يجب عدم قبول نفس OTP ثانية. يلزم تخزين حالة الاستهلاك بطريقة تتحمل الطلبات المتزامنة، مع فصل ذلك عن نافذة انحراف الساعة. [RFC 6238 §5.2](https://www.rfc-editor.org/rfc/rfc6238.html#section-5.2).

### 10. P1 — مثال JWT لا يفرض وجود exp

[JWT:88](C:/my_docs/src/content/docs/auth/08-jwt-security.md:88): المثال يضيف `exp` عند الإصدار ثم يستند إلى `JWT::decode` عند التحقق. المكتبة تفحص انتهاء الصلاحية **إذا كانت claim موجودة**؛ لا تفرض وجودها. إذا كان عقد التطبيق يتطلب توكينات محدودة العمر، يجب رفض غياب `exp` صراحة والتحقق من claims المطلوبة والأنواع والـtoken profile. جرّب توكينًا صحيح التوقيع بلا `exp`، وليس منتهيًا فقط. لا يعني هذا أن مهاجمًا يستطيع حذف claim دون إفساد التوقيع. [مصدر مكتبة firebase/php-jwt](https://raw.githubusercontent.com/firebase/php-jwt/main/src/JWT.php).

### 11. P2 — معيار اختبار CSRF يتجاوز المثال

[CSRF:95](C:/my_docs/src/content/docs/auth/03-csrf.md:95): الاختبار يعد برفض token صحيح مع Origin ممنوع؛ كود المثال يفحص token فقط، ولا يفحص Origin. أُثبت أن شرطه يقبل هذه الحالة. حماية token نفسها ليست خاطئة؛ الفجوة بين الدرس ومعيار نجاحه. أضف تنفيذ فحص Origin بسياسة موثقة أو بيّن أنه طبقة لم تنفذ بعد.

### 12. P2 — تمرين التشفير يطلب API غير موجودة في المثال

[التشفير:37](C:/my_docs/src/content/docs/auth/06-encryption-http-auth.md:37) و[التمرين:130](C:/my_docs/src/content/docs/auth/06-encryption-http-auth.md:130): `secretbox` يوفر authenticated encryption، لكنه لا يملك parameter للـassociated data. لا يمكن إجراء اختبار «associated data خاطئة» على هذه الواجهة. استخدم مثال AEAD مناسبًا أو اشرح الانتقال بين الواجهتين. كذلك استدعاء التشفير بـnonce مكرر لا يرفضه تلقائيًا؛ أثبت الفحص قبول الاستدعاءين. المطلوب شرح مسؤولية التفرد، لا توقع استثناء من المكتبة. [libsodium secretbox](https://doc.libsodium.org/secret-key_cryptography/secretbox).

### 13. P1 — redirect لا ينقذ credentials أُرسلت عبر HTTP

[التشفير وBasic:118](C:/my_docs/src/content/docs/auth/06-encryption-http-auth.md:118): اعتبار redirect أو رفض HTTP معيار نجاح ضد التنصت ناقص. إذا أرسل العميل Authorization عبر HTTP فقد انكشف قبل وصول الرد. يجب أن يبدأ العميل بـHTTPS وألا يرسل credentials على HTTP؛ اختبر أول طلب نفسه. إعادة التوجيه إلى HTTPS مفيدة لكنها ليست إثبات سرية الطلب السابق. [OWASP TLS](https://cheatsheetseries.owasp.org/cheatsheets/Transport_Layer_Security_Cheat_Sheet.html).

### 14. P2 — إعدادات إنشاء hash وإعادة hash غير موحدة

[Password hashing:35](C:/my_docs/src/content/docs/auth/05-password-hashing.md:35) و[إعادة hash:53](C:/my_docs/src/content/docs/auth/05-password-hashing.md:53): من يختار مثال Argon2id ثم يستعمل فرع `PASSWORD_DEFAULT` التالي سيعيد hash بسياسة مختلفة، وقد يعود إلى bcrypt. أثبت الفحص أن Argon2id يجعل هذا الشرط true في البيئة الحالية. عرّف algorithm/options مرة واستخدمهما في الإنشاء و`password_needs_rehash` وإعادة الإنشاء. وضّح أن البديلين ليسا خطوات متتابعة. [دليل PHP](https://www.php.net/manual/en/function.password-hash.php).

### 15. P2 — معالجة فشل password_hash من نمط قديم

[Password hashing:26](C:/my_docs/src/content/docs/auth/05-password-hashing.md:26): فحص `=== false` لا يلتقط أخطاء PHP 8، حيث يستخدم API استثناءات/Errors للحالات الموثقة. صحّح عقد الدالة ومعالجة الفشل عند حد التطبيق؛ لا حاجة لصنع اختبار ينتظر false. [توثيق PHP](https://www.php.net/manual/en/function.password-hash.php).

### 16. P2 — CSV يولّد تحذيرات على الإصدار المستهدف

[Files:162](C:/my_docs/src/content/docs/php/08-files-streams-data.md:162): الاعتماد على القيمة الافتراضية لـ`escape` في `fputcsv/fgetcsv` deprecated من PHP 8.4. أُعيد إنتاج التحذيرين. عرّف dialect بوضوح، ومرّر `escape: ''` عندما يكون ذلك المناسب، وتحقق أيضًا من handles قبل استعمالها. [fgetcsv](https://www.php.net/manual/en/function.fgetcsv.php)، [fputcsv](https://www.php.net/manual/en/function.fputcsv.php).

### 17. P1 — قائمة C++ قد تخرج عند إدخال خاطئ أو تتكرر عند EOF

[الحلقات:505](C:/my_docs/src/content/docs/cpp/loops-competitive/04-loops-counters-accumulators.md:505): `choice{}` يبدأ بصفر، وفشل تحويل `abc` إلى عدد يؤدي إلى قيمة صفر في الحالة المعتادة المعيارية؛ `continue` ينتقل إلى شرط `do...while(choice != 0)` فيخرج بدل إعادة السؤال. بعد نجاح choice=1 ثم EOF قد يبقى الاختيار 1 مع فشل مستمر فتدور القائمة. يجب فصل حالة الخروج عن قيمة آخر إدخال، وكسر الحلقة عند EOF/badbit ومعالجة failbit القابل للاسترداد. النتيجة مبنية على تحليل الكود وقواعد الاستخراج، وليست تشغيل C++ محليًا. [مسودة معيار C++](https://eel.is/c++draft/facet.num.get.virtuals).

### 18. P2 — مقارنة If-None-Match غير مكتملة

[HTTP caching:52](C:/my_docs/src/content/docs/programming-basics/10-http-caching-compression.md:52): مساواة header كاملة بـETag واحدة لا تدعم قائمة tags أو `W/` أو `*`. يلزم شرح weak comparison لهذا الشرط، وقصر المثال على GET/HEAD أو بيان اختلاف preconditions للطرق الأخرى. استخدم parser/library مناسبًا؛ لا يكفي تقسيم ساذج. [RFC 9110 §13.1.2](https://www.rfc-editor.org/rfc/rfc9110.html#section-13.1.2).

### 19. P2 — تعريفات المصطلحات من سياق خاطئ

[Scope في OAuth:18](C:/my_docs/src/content/docs/auth/10-oauth-concepts-tokens.md:18) مُعرّف بنطاق رؤية المتغيرات، بينما المقصود نطاق التفويض. تكرر في دروس أمن متعددة في اللغتين. [Sanitizer في XSS:14](C:/my_docs/src/content/docs/auth/04-xss.md:14) مُعرّف بأداة كشف أخطاء الذاكرة، بينما المقصود معالجة HTML غير موثوق بسياسة مسموحات. تكرر في الإنجليزية. يجب مراجعة القواميس بحسب السياق، لا استبدال كلمة موحد عبر المشروع. [OAuth scopes](https://www.rfc-editor.org/rfc/rfc6749.html#section-3.3)، [OWASP HTML sanitization](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html).

### 20. P2 — قاعدة اتجاه العمليات عامة أكثر من اللازم

[الرياضيات:26](C:/my_docs/src/content/docs/programming-basics/math-problem-solving/01-arithmetic-foundations.md:26): «العمليات في المستوى نفسه تنفذ من اليسار» ليست قاعدة عامة للقوى وكل معاملات اللغات. مثال PHP: `2 ** 3 ** 2` يساوي 512؛ الأس right-associative. ميّز precedence عن associativity وعن ترتيب تقييم operands، وقيّد قاعدة اليسار بحالاتها. [توثيق المعاملات](https://www.php.net/manual/en/language.operators.precedence.php).

### 21. P2 — إجابة تمرين الجمع لا تطابق الفرق المذكور

[Flowcharts:65](C:/my_docs/src/content/docs/programming-basics/math-problem-solving/06-flowcharts-loops-debugging.md:65): السؤال يقول إن الزيادة N؛ اقتراح `i <= N+1` يضيف N+1 إلى مجموع 1..N، وليس N. بدء sum بـN يفسر الزيادة فعلًا. مثال N=3: الصحيح 6، وإضافة الدورة الرابعة يعطي 10، بفرق 4. صحح السبب المقترح أو نص السؤال. موجود أيضًا بالإنجليزية.

### 22. P2 — Unicode موصوف مرة كترميز ثم يُفرّق عنه لاحقًا

[أساسيات الكمبيوتر:30](C:/my_docs/src/content/docs/programming-basics/computer-fundamentals/03-binary-languages-algorithms.md:30): الجملة تقول «ترميز مثل Unicode»، ثم يشرح السطر 49 أن UTF-8 هو الذي يحول القيم إلى بايتات. استخدم من البداية: Unicode معيار repertoire/code points، وUTF-8 أحد encoding forms. هذا تناقض تربوي داخل الدرس نفسه.

### 23. P2 — تمرين SQL يستخدم اسم عمود مختلفًا

[Database:153](C:/my_docs/src/content/docs/database/05-schema-indexes-migrations.md:153): المختبر يطلب EXPLAIN حسب `customer_id` بينما schema والفهرس والأمثلة السابقة تستخدم `user_id`. من يطبق على schema المعروضة سيواجه عمودًا غير موجود. وحّد الاسم أو قدّم migration وتعليلًا للتغيير.

### 24. P2 — منع stale cache وعد أقوى من الخوارزمية

[Redis:91](C:/my_docs/src/content/docs/php-runtime/11-data-caching-redis.md:91): معيار النجاح يقول إن القيمة القديمة لا تعود بعد التحديث، بينما الدرس يقبل نافذة stale ويعرض cache-aside. يمكن لقارئ أن يقرأ القيمة القديمة، ثم يكتب الكاتب الجديدة ويحذف cache، ثم يعيد القارئ ملء cache بالقديمة. عرّف أقصى stale time وآلية versioning/coordination المطلوبة، أو قيّد الاختبار بأنه بلا تزامن. لم تُنفذ تجربة Redis فعلية؛ هذا counterexample للتسلسل.

### 25. P2 — حكم OOP يعمم شروط unit test على كل الاختبارات

[OOP:65](C:/my_docs/src/content/docs/oop/08-review-checklist.md:65): «إذا احتاج الاختبار قاعدة بيانات أو شبكة، فالحدود غير مفصولة جيدًا» تصح كتوجيه لاختبار وحدة معزول، ولا تصح على integration/contract tests. قيّد العبارة بنوع الاختبار؛ مسار Runtime نفسه يشرح الحاجة لاختبار الحدود الحقيقية.

### 26. P2 — ترقيم مسار الويب ما زال غير متسق

[درس المتصفح:2](C:/my_docs/src/content/docs/programming-basics/09-browser-rendering-devtools.md:2) عنوانه 8، ودرس servers/proxies عنوانه 8 أيضًا داخل **مسار الويب نفسه**؛ لذا تفسير أن الرقمين لمسارين مختلفين لا يحل المشكلة كلها. العناوين التالية متأخرة خطوة، ثم يقفز التسلسل من 15 إلى 17. صحح العناوين والخريطة وlabels مع إبقاء URLs عند الرغبة؛ لا يلزم تغيير أسماء الملفات لإصلاح العناوين.

### 27. P2 — تكافؤ الترجمة غير مثبت وله مثال نقص ملموس

العربية في [Password hashing:35](C:/my_docs/src/content/docs/auth/05-password-hashing.md:35) تعرض إعدادات Argon2id بكود memory/time/threads؛ [الإنجليزية](C:/my_docs/src/content/docs/en/auth/05-password-hashing.md) تذكر الإمكانية دون المثال المقابل. هذا نقص محدد، وليس استنتاجًا من نسبة الحروف. توجد أخطاء مشتركة في اللغتين أيضًا، لذا إصلاح لغة واحدة غير كافٍ. يلزم جدول مقابل للتعريفات والأمثلة والتحذيرات والتمارين.

## ما ينقص المنهج فعلًا

| المسار | الموجود الجيد | النقص الذي يمنع وصفه بمنهج مكتمل |
|---|---|---|
| أساسيات الكمبيوتر والرياضيات | فصل CPU/GPU والذاكرة، ونماذج للحل والتصحيح | ذكر مجموعات واحتمالات وgraphs وgreedy وDP في فقرات قصيرة دون سلسلة أمثلة محلولة. يحتاج كل مفهوم: تعريفًا ومثالًا مضادًا وتتبعًا وتمرين تطبيق. لا يُعد طلب «اثبت» أو «نفذ» شرحًا للخطوات. |
| الويب والشبكات | رحلة الطلب وCORS/TLS وcache والحدود الأمنية | مختبر موحد يمكن تشغيله ونتائج قابلة للمقارنة، ومعالجة بروتوكولية كاملة للأمثلة مثل conditional requests. لا يُستدل على تغطية بروتوكول من ذكر اسمه فقط. |
| C++ | شرح جيد نسبيًا للتحكم والبناء والتحويلات والأخطاء | للمستوى الحالي: حسم input failure/EOF وfull consumption واختبارات فعلية. وللتوسع إلى مستوى متوسط: functions/references/containers/algorithms/RAII/testing؛ توجد مواد مؤجلة خارج الدروس. المسار يعلن أنه ينتهي عند التحكم والحلقات، فلا أعد كل موضوع متقدم مفقودًا خطأ داخل نطاقه المعلن. |
| PHP | تغطية واسعة وأمثلة تطبيقية مفيدة | مشروع أمثلة مستقل مع الحد الأدنى للإصدار وextensions، وضبط حدود الأحجام والأنواع والحسابات، وتصحيح الأمثلة المثبتة أعلاه، وتنفيذ الاختبارات السلبية بدل الاكتفاء بطلبها. |
| OOP | classes/interfaces/traits/DI/readonly | مثال refactoring كامل من procedural إلى تصميم يحمي invariants، مع Value Objects وعقود implementations واختبارات سلوك. SOLID والتصميم الأنماطي تحسين للمرحلة التالية، لا مجرد المزيد من الأسماء. |
| Database | PDO وACID والعزل والفهارس | تمهيد SQL فعلي قبل PDO/ORM أو إعلان SQL شرطًا سابقًا: JOIN وGROUP BY وNULL والعلاقات والقيود. schema/seed واحدان ومختبر معاملتين واتصالين مع إعداد محرك محدد. |
| Runtime وAuth | اتساع موضوعات التشغيل والأمن ووجود تحذيرات جيدة | fixtures وservices وحالات فشل قابلة للتشغيل؛ لا يوجد تطبيق مرجعي يربط login/session/reset/authorization/queue/logging. مختبر التزامن والإلغاء لا يُستبدل بعبارة «تأكد أنه يفشل». |

**أكبر فجوة عملية مشتركة:** أوامر مثل `php pdo-lab.php` و`php http-client-lab.php` و`php orders.php fixtures/orders.json` تشير إلى مختبرات غير موجودة كملفات تشغيل في المستودع الحالي. بعض الدروس تعطي أجزاء يمكن تركيبها، لكن ملفات الاختبار، bootstrap، بيانات fixtures، وخدمات البيئة اللازمة لا تُقدّم كاملة. لا بأس بتمرين يطلب البناء من الطالب، بشرط تسميته مهمة بناء وتوفير عقد واضح وحل مرجعي منفصل؛ لا تقدمه كأمر جاهز يثبت نجاح المثال.

**المتطلبات السابقة:** عبارة «قبل ما تبدأ» الحالية غالبًا طريقة مذاكرة عامة. لا تحدد ما يجب أن يعرفه القارئ أو يثبته: PHP version، extensions، Composer packages، SQL knowledge، Linux/FPM، أو OAuth provider. ينبغي أن تصبح هذه شروطًا قابلة للتحقق لكل مختبر.

**الإضافات الأخيرة:** فقرات «اربط النقاط» تحتوي أحيانًا أوامر تأليف مثل إضافة موضوع أو رسم بروتوكول، بدل شرح الموضوع نفسه. معيار اكتمال التغطية يجب أن يكون قدرة الطالب على تفسير المثال وتنفيذه، لا العثور على keyword داخل الملف.

## ترتيب الإصلاح المقترح

1. إصلاح الأمثلة التي ثبت فشلها والتعريفات الخاطئة في اللغتين، ثم تثبيت اختبارات صغيرة تعيد إنتاجها.
2. إصلاح عقود الأمن والتزامن: TOTP، claims المطلوبة، jobs idempotency، وفرق النقل الآمن عن redirect.
3. توحيد شروط التشغيل والإصدارات والاعتماديات وتوفير مختبرات حقيقية للأمثلة الرئيسية.
4. بناء مسار SQL تمهيدي أو إضافة شرطه السابق، ومشروع PHP/OOP/DB مترابط باختبارات قبول.
5. مقارنة الترجمتين بالمفاهيم، وتصحيح الترقيم، وتحديث تقارير الإنجاز القديمة بحيث لا تعني إضافة الفقرة أنها أغلقت الفجوة.
6. مراجعة تشغيلية لاحقة على PHP 8.5 ومترجم C++ وخدمات SQL/Redis/FPM وموفر هوية، ثم فحص عرض الويب وPDF. هذه أعمال تحقق لم تُنفذ في هذه الجولة.

لا أعطي نسبة «اكتمال» رقمية؛ لم يُحدد معيار منهج شامل ولا يتحول عدد الصفحات أو كثرة المصطلحات إلى نسبة جودة موثوقة.
