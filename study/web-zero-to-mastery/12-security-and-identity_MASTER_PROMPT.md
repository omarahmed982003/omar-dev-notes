# المرحلة 12 — الأمان والهوية بعمق

الإصدار: 1.1 — مراجعة المنهج 2026-10-21. مراجعة تحريرية؛ لم تبدأ الدراسة.

هنراجع المنتج اللي بنيناه: إيه اللي بنحميه؟ مين يقدر يعمل إيه؟ وإزاي نثبت إن الرفض شغال؟ الأمان بدأ في 8 و 10 و 11؛ هنا نربط الدفاعات بتهديدات واختبارات مش أسماء ثغرات.

## المتطلبات وحدود المرحلة

نجاح API المحلية 11 وتسجيل دخول وصلاحيات واختبارات رفض فعلية. المختبر محلي ببيانات وهمية وأنظمة مأذون بها فقط؛ لا كشف أو تجريب ضد مواقع خارج النطاق.

الأساس قبل أول deploy هو حماية الحساب والجلسة والبيانات والمدخلات والأسرار وعزل المستخدمين. OAuth/OIDC و Passkeys و distributed identity تعميق اختياري بعد هذه البوابة ومع متطلباته؛ ليس مطلوبًا إنهاء Authentication Master كاملًا قبل 13.

## خطة الدراسة

### 12.1 — خريطة التهديد وحدود الثقة

- المستوى: أساسي إلزامي.
- المتطلبات: 10.6 و 11.3.
- الناتج: يربط أصلًا مهمًا بتهديد ودفاع واختبار.

#### 12.1.a — Assets و Actors و Trust Boundaries

ارسم browser و app و DB ومزود mail وهمي. ميّز identity/authentication/authorization و account/session/token، وحدّد ما نثق فيه ولماذا؛ لا تثق بقيمة من client لمجرد إخفائها في UI.

#### 12.1.b — Least Privilege و Secure Defaults

حوّل سيناريو تسريب حجز لقيود ملموسة: deny by default وأقل صلاحية وفصل دور runtime عن migration. رتّب المخاطر على المنتج الحالي قبل ضم microservices غير موجودة.

**تطبيق وتقييم 12.1 بعد الأجزاء السابقة:**

- تجربة صغيرة: threat table من خمسة أسطر يربط أصولًا ومسارات هجوم ودفاعات واختبارات.
- فشل متعمّد: طلب من مستخدم صحيح الحساب لكن ليس مالك المورد؛ تحليل الثقة يكشف الفرق.
- محاولة مستقلة: أضف مشاركة حجز وحدّد كيف تغيّر trust boundary.
- دليل النجاح: رسم وتبرير واختبار رفض واحد على الأقل لكل حد حساس.

### 12.2 — الحساب والجلسة والاسترداد الموثوق

- المستوى: أساسي إلزامي.
- المتطلبات: 12.1 و login/logout في 10.6.
- الناتج: يحمي lifecycle حساب محلي ويشرح متى لا يحتاج JWT أو provider خاص.

#### 12.2.a — Passwords و Reset و Verification

استخدم password_hash/verify أو مكوّن Framework موثوق؛ لا encrypt بدل hash. ناقش work factor و rehash و enumeration و rate limits، ثم reset token عشوائية قصيرة العمر واستعمال واحد وتخزين hash وسياسة إبطال الجلسات.

#### 12.2.b — Sessions و Cookies و CSRF و Revocation

راجع regeneration و idle/absolute timeout و logout لكل جهاز، و Secure/HttpOnly/SameSite وحدودها. أثبت CSRF وميّزها عن CORS و XSS؛ لا تعتبر HttpOnly علاجًا كاملًا لـ XSS.

#### 12.2.c — Authorization و Credentials وحدود الامتداد

طبّق owner/role/scoped token واختبارات رفض. ميّز opaque/JWT و hash/signature/encoding لفهم المخاطر من غير issuer خاص. MFA للعمليات الحساسة وسياسة recovery جزء تصميم الأمان؛ تنفيذ TOTP/Passkeys و OAuth/OIDC اختيار لاحق بالمراجع أدناه.

**تطبيق وتقييم 12.2 بعد الأجزاء السابقة:**

- تجربة صغيرة: reset واحد ينجح ثم يرفض إعادة token، و login يجدد session و logout يمنع إعادة استعمالها.
- فشل متعمّد: expired/reused reset token أو credential في log أو enumeration؛ الاختبار يكشفه ولا يقبل النجاح مع تسريب.
- محاولة مستقلة: أضف قائمة جلسات وإبطال جهاز مع اختبارات ملكية واسترداد.
- دليل النجاح: account/session flow ورسائل آمنة واختبارات reset/expiry/CSRF/authorization وتبرير اختيار auth.

### 12.3 — حدود المدخل والمخرج والملف والاتصال

- المستوى: أساسي إلزامي.
- المتطلبات: 12.1 و PDO و Blade و uploads.
- الناتج: يصلح مخاطر فعلية ويثبت الدفاع باختبار سلبي.

#### 12.3.a — XSS و SQL Injection

افصل validation عن contextual output encoding وعن prepared SQL values. استخدم input تجريبية داخل مختبرك، ووضّح أن binding لا يحمي identifier؛ raw HTML خطر مستقل و CSP طبقة إضافية لا بديلًا.

#### 12.3.b — Traversal و Uploads و Unsafe Deserialization

افحص path و symlink وحدود التخزين و download authorization. لا unserialize لبيانات غير موثوقة؛ حدّد schema آمنة بدل تحميل object graph من العميل.

#### 12.3.c — SSRF و Injection وحدود الاتصال

ميّز URL يختاره المستخدم عن عنوان خدمة ثابت. ضع allowlist وربطًا بالوجهة الفعلية وحدود redirect/timeout؛ لا تختبر cloud metadata حقيقية. عند shell command استخدم API مناسبة وتجنب تمرير input إلى shell.

#### 12.3.d — Dependencies و Supply Chain

اقرأ lockfile ومصدر package وتشغيل scripts والصلاحيات و security advisories من مصادرها الرسمية. اربط update باختبارات و rollback؛ لا ترقّي كلشيء عشوائيًا.

**تطبيق وتقييم 12.3 بعد الأجزاء السابقة:**

- تجربة صغيرة: تقرير أربع فئات على تطبيقك مع test قبل الإصلاح وبعده، دون طباعة secrets.
- فشل متعمّد: encoding في context غلط أو download يتجاوز directory أو URL redirect لخدمة داخلية وهمية؛ اختبارات رفض تكشفه.
- محاولة مستقلة: راجع endpoint رفع أو ربط خارجي جديدًا وحدّد Defense و negative test مستقلين.
- دليل النجاح: diff إصلاح صغير و tests تثبت الرفض والوظيفة الطبيعية، ومخاطر متبقية محددة.

### 12.4 — الأسرار والمفاتيح و TLS دون اختراع Crypto

- المستوى: أساسي إلزامي.
- المتطلبات: TLS في 4 و config في 10.1.
- الناتج: يدير secret lifecycle ويمنع تعريض config الحساسة.

#### 12.4.a — Hash و Encryption و Signature و Encoding

ابدأ بسر لابد أن نسترجعه مقابل password لابد ألا نسترجعها. استعمل مكتبة موثوقة وعشوائية cryptographic؛ حدّد متى تحتاج key ومكانها ومن يقرأها.

#### 12.4.b — Storage و Rotation و TLS Configuration

أبقِ secrets خارج repo و image و logs. اكتب خطة rotation بمرحلة overlap وحدود rollback وتحديث الخدمات. راجع certificate validation و HTTPS و cookie security؛ ضبط server الفعلي في 13.

**تطبيق وتقييم 12.4 بعد الأجزاء السابقة:**

- تجربة صغيرة: استبدل API key وهمية مع استمرار انتقال مضبوط ورفض المفتاح المتقاعد.
- فشل متعمّد: secret في commit diff أو response أو log؛ اكتشفها وأصلح موضعها وخطة إبطالها لا حذف السطر فقط.
- محاولة مستقلة: اكتب runbook لتسريب key تجريبية واختبر critical paths بعد التدوير.
- دليل النجاح: قائمة secrets ومسؤولية access وخطة rotation ونتائج فحص redaction و TLS validation.

### 12.5 — عزل الموارد ومنع إساءة الاستخدام

- المستوى: أساسي إلزامي.
- المتطلبات: 12.2 و query scoping في 10.5.
- الناتج: يمنع cross-user/cross-tenant access بحدود معلنة ويراقب Abuse دون PII زائدة.

#### 12.5.a — Object-level Authorization و Tenant Boundaries

اختبر كل قراءة وكتابة وتصدير ومهمة خلفية. tenant يحدد من سياق موثوق لا payload؛ scoping مفيد لكنه لا يكفي وحده. راجع mass assignment و IDOR/BOLA و privilege escalation.

#### 12.5.b — Rate Limits و Audit و Privacy

اختر limit حسب account/IP/action مع تجنب lockout attack. سجل actor/action/resource/outcome بلا مفاتيح أو كلمات مرور؛ فرّق audit عن debug log، وحدّد retention و data minimization.

**تطبيق وتقييم 12.5 بعد الأجزاء السابقة:**

- تجربة صغيرة: matrix مستخدمين و اثنين من tenants وثلاث عمليات مع audit للرفض.
- فشل متعمّد: تغيير tenant ID أو export endpoint غير محمي؛ لا يتسرب صف واحد.
- محاولة مستقلة: أضف admin operation مع least privilege و rate limit واضح.
- دليل النجاح: tests لل matrix و 429 حيث ينطبق و sample audit منقّح وسياسة retention.

### 12.6 — مراجعة أمنية وإعادة اختبار

- المستوى: أساسي إلزامي.
- المتطلبات: 12.1–12.5.
- الناتج: يسلم review قابلة للتنفيذ ويثبت إغلاق findings لا يكتفي لقطة scanner.

#### 12.6.a — اختيار العينة وتقييم المخاطر

راجع entry points و dependencies و session و authorization و config. استخدم checklist مع سبب ودليل؛ صنّف impact/likelihood وحدود ما فُحص، ولا ادعاء أن المشروع خالٍ من الثغرات.

#### 12.6.b — Fix و Retest واستجابة حادثة مصغرة

أصلح finding واحدة كل خطوة وتحقق من regression. جرّب secret leak وهمية واحتواءها ثم recovery. disclosure في النطاق المأذون فقط؛ لا تنشر تفاصيل حساسة.

**تطبيق وتقييم 12.6 بعد الأجزاء السابقة:**

- تجربة صغيرة: تقرير findings مع reproduction محلية وإصلاح واختبار رجوع.
- فشل متعمّد: إغلاق finding لمجرد سكوت الأداة بينما اختبار الاستغلال المحلي ما زال ينجح.
- محاولة مستقلة: راجع feature لم تكتبها أنت وأصلح عيبًا دون إرشاد حل كامل.
- دليل النجاح: report ونطاق معلن و tests قبل/بعد وسجل خطر متبقٍ؛ لا finding حرجة معروفة قبل deploy.

## المشروع وبوابة الخروج

Security review للمشروع السابق: assets/trust boundaries و authorization matrix و reset/session lifecycle واختبارات CSRF/XSS/SQLi/uploads و secrets وأدلة إعادة اختبار. لا عبور مع تجاوز ملكية أو تسريب سر أو إجراء auth غير مفهوم. لا يشترط بناء OAuth server أو microservices أو Redis sessions قبل النشر.

## مراجع وحدود الربط

[AUTHENTICATION_AUTHORIZATION_MASTER_PROMPT.md](../AUTHENTICATION_AUTHORIZATION_MASTER_PROMPT.md) Modules 0–3 مرجع الأساس، Module 4 لتوقيع webhook/API key عند 17، Module 5 للتعميق في JWT بعد حاجة واضحة، Modules 6–9 لـ OAuth/OIDC بعد 13 ومع HTTP clients، Module 10 لـ MFA/Passkeys بعد تصميم استرداد آمن، Modules 11–12 للهوية الموزعة بعد 16–19، Module 13 لتفاصيل Laravel حسب المختبر. محاور المصدر محفوظة لكن غير مطلوب إكمالها بكاملها قبل 13. [AUTHENTICATION_AUTHORIZATION_PROGRESS.md](../AUTHENTICATION_AUTHORIZATION_PROGRESS.md) لا يتغير إلا بجلسة مسار قديم لها دليلها.

## تشغيل الجلسة والتقدم

اقرأ README.md و COMMON_RULES.md وهذا الملف وملف PROGRESS المجاور كاملين. اشرح بالعامية المصرية الطبيعية: المشكلة ثم الفكرة وآليتها ثم تجربة صغيرة وتوقع الناتج قبل التنفيذ. مفهوم واحد وسؤال واحد كل مرة؛ لا تعرض حل المحاولة المستقلة قبل محاولة الطالب. كل عنوان فرعي وحدة شرح، وليس درسًا موسوعيًا في رسالة واحدة.

الـ IDs المحلية تقيس أدلة هذا المنهج فقط. ملفات study القديمة مراجع وتعميق وليست شرط إتمام كامل قبل العبور. لا تنسخ درجاتها، ولا تعتبر نجاح بوابة محلية نجاحًا تلقائيًا في نقطة قديمة. إن اختار الطالب دراسة المالك كاملًا، اقرأ منهجه وتقدمه والتزم بترتيبه؛ سجل الربط دون ازدواج النتائج.

حدّث التقدم المحلي وفق الدليل الحقيقي: checkpoint والعنوان الفرعي وآخر تمرين مكتمل والخطوة غير المكتملة والاختبارات والفجوات. شرط النجاح 80% على الأقل مع أدلة مستقلة وإصلاح أخطاء الأمان أو صحة البيانات الجوهرية. المتقدم الاختياري لا يعطل بوابة الأساس، ولا يسجل Passed أو درجة وهمية إن لم يُدرس. لا نشر أو commit أو push أو تعديل لتقدم مسار قديم تلقائيًا.
