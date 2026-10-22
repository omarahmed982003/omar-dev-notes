# المرحلة 7 — JavaScript والمتصفح

الإصدار: 1.1 — 2026-10-21. المتطلبات: بوابة المرحلة 6 و PHP الأساسي. نعيد بناء ما يختلف فعلًا في JavaScript، مش نفترض أن تغيير syntax يكفي. الأمثلة هنا JavaScript لا PHP، مع HTML/CSS السابقين. كل نقطة تتطلب 80% ودليل محاولة مستقلة.

### 7.1 — قيم JavaScript و scope و functions

المتطلبات: 2.9 و 3.7 و 5.1. النتيجة: يشغل script في browser ويتوقع قراراته ويفسر حدود scope من غير إسقاط نموذج PHP عليه.

#### 7.1.a — لغة جديدة فوق أساس مفهوم

التسلسل: ربط script ووقت تحميله ← console/breakpoint ← values/types و`undefined`/`null` ← let/const ← equality/coercion ← operators و if/loops باختلافاتها. المختبر: توقع مقارنة وتغير قيمة وعدّ loop؛ المتوقع source واحد وخرج معلوم. الغلط: const يجعل كل محتوى object immutable أو `==` مطابق لـ PHP.

#### 7.1.b — Function و closure في سياق

التسلسل: declaration/expression/arrow ← parameter/return ← block/function scope ← closure ← hoisting/temporal dead zone من مثال خطأ محدود. المختبر: function تصنع عدادًا مستقلًا؛ المتوقع عدادان لا يتشاركان state بلا قصد. تمرين مستقل: يصلح scope bug ويختبر دالة تحويل بيانات؛ دليل prediction/actual وشرح، لا أسماء محفوظة.

### 7.2 — Arrays و objects و modules

المتطلبات: 7.1. النتيجة: ينظم data و code ويفرق shared references عن قيم منسوخة.

#### 7.2.a — مجموعات وقراءة آمنة

التسلسل: array مقابل object ← properties ← map/filter/find ← destructuring و spread/rest بالقدر المستخدم ← optional chaining/nullish coalescing ← copying مقابل nested references. المختبر: فلترة كتالوج دون تغيير المصدر؛ المتوقع تفسير نسخة سطحية لا ادعاء deep immutability. الغلط: object JavaScript هو PHP array بنفس السلوك.

#### 7.2.b — تقسيم source وحدود الأخطاء

التسلسل: export/import ← module script و URL ← local HTTP server جاهز من المرحلة 4 ← `Error` و throw/catch ← method و`this` في استعمال صغير إن لزم. المختبر: data و function في module ين؛ المتوقع import ناجح وخطأ يمكن تتبعه عند مسار غلط. تمرين مستقل: يفصل كود المشروع ويختبر عدم تغيير input ويصلح import؛ الدليل requests و tests، بلا فرض React أو Node backend.

### 7.3 — DOM و events و forms

المتطلبات: 7.2 و HTML forms/accessibility. النتيجة: يربط فعل المستخدم بحالة و DOM مع تحديث آمن قابل للوصول.

#### 7.3.a — قراءة وتحديث عنصر

التسلسل: querySelector ← node/textContent/attributes ← create/append/remove ← فصل data عن العرض ← عدم حقن HTML غير موثوق. المختبر: قائمة مصروفات وعنوان من input؛ المتوقع ظهور النص كبيانات لا تنفيذه markup. الغلط: innerHTML أداة عامة لكل مدخل.

#### 7.3.b — حدث ورحلة مستخدم

التسلسل: addEventListener ← event target/currentTarget ← bubbling/delegation ← submit/default behavior ← validation و focus. المختبر: زر إضافة وإزالة عبر keyboard؛ المتوقع الحدث مرة واحدة و focus مفهوم. تمرين مستقل: يضيف فلترة ويصلح listener مكررًا ويثبت رفض المدخل غير الصالح؛ دليل event trace واختبار يدوي. تحقق الخادم لا يستبدله تحقق JavaScript.

### 7.4 — Async وفشل العمل المؤجل

المتطلبات: 7.3 و call stack من functions. النتيجة: يتوقع ترتيب التنفيذ ويعالج promise مرفوضة دون حجب الواجهة أو ترك state كاذبة.

#### 7.4.a — Event loop و promise

التسلسل: synchronous stack ← task/microtask بنموذج مناسب للمثال ← timer ← promise states ← then/catch ← async/await. المختبر: توقع ترتيب logs في مثال صغير؛ المتوقع مقارنة دقيقة بدون القول إن setTimeout يضمن لحظة التنفيذ أو async يعني parallel دائمًا.

#### 7.4.b — فشل وإلغاء وتسابق

التسلسل: try/catch/finally مع await ← cleanup ← طلبات متداخلة ← نتيجة قديمة تصل متأخرة ← cancellation/AbortController تمهيديًا. المختبر: مهمتان بتأخيرين معلومين؛ المتوقع ألا تكتب نتيجة قديمة فوق أحدث اختيار. تمرين مستقل: يصلح unhandled rejection ويعيد الحالة بعد الفشل؛ الدليل تسلسل وتجربتان، لا حل كامل قبل المحاولة.

### 7.5 — Fetch و JSON وحالات الواجهة

المتطلبات: 7.4 و 4.7.a. النتيجة: يقرأ بيانات من HTTP ويعرض حالة صحيحة لكل نتيجة ويحمي المستخدم من الرد القديم.

#### 7.5.a — عقد صغير و mock محلي

التسلسل: fixture JSON معلومة schema ← local server من 4.4.a/4.9.a ← fetch ← status/`response.ok` ← JSON parse/validate ← render. المختبر: endpoint تدريب يعيد قائمة ثم 404؛ المتوقع فصل HTTP failure عن network failure و JSON غير صالح. لا نحتاج backend مخصصًا لم يُدرّس أو API عامًا مدفوعًا.

#### 7.5.b — Loading/error/empty/success

التسلسل: state واحدة معلنة ← loading feedback ← نتيجة فارغة ← retry مضبوط ← abort/تجاهل stale response ← focus و aria live عند الحاجة. الغلط: catch وحدها تعالج كل HTTP error أو غياب النتائج يساوي عطلًا. تمرين مستقل: بحث بتأخير وفشل وطلب ملغى و query فارغة؛ دليل أربع حالات وإثبات أن الرد القديم لا يستبدل الأحدث.

### 7.6 — Storage وحدود المتصفح الأمنية

المتطلبات: 7.5 و 4.8.a. النتيجة: يختار تخزين تفضيل غير حساس ويشرح حدود origin و cookies دون وصفها بحماية سحرية.

#### 7.6.a — بيانات تعيش بعد الصفحة

التسلسل: memory مقابل sessionStorage/localStorage ← serialization ← missing/corrupt/quota cases ← cookie مبادئها ومدة/نطاق الإرسال. المختبر: تفضيل عرض غير حساس ثم JSON تالف مُحاكى؛ المتوقع fallback آمن دون انهيار الصفحة. الغلط: localStorage مكان مناسب تلقائيًا لكل tokens والأسرار.

#### 7.6.b — Origin و CORS و trust boundary

التسلسل: scheme/host/port ← same-origin ← cross-origin read permission ← CORS ليس authentication ← cookie flags كمقدمة ل 8.6. المختبر: ردود مجهزة أو خادمان محليان مأذونان؛ المتوقع تفسير سبب رفض القراءة لا تعطيل المتصفح. تمرين مستقل: يكتب قرار storage وتفسير origin لثلاثة URLs ويصلح إعداد مختبر محدود؛ دليل و 80%، التفاصيل الأمنية المتقدمة ل 12.

### 7.7 — أدوات التطوير والاعتماديات

المتطلبات: 7.6 و 1.7 و 3.8. النتيجة: يشغل مشروعًا من وصف reproducible ويفرق source عن generated assets.

#### 7.7.a — Node و npm كأدوات

التسلسل: runtime للأداة وليس backend جديدًا ← package.json ← scripts ← dependencies/devDependencies ← lockfile ← install مقابل reproducible install ← build output. المختبر: مشروع صغير بإصدارات موثقة؛ المتوقع تثبيت/تشغيل من نسخة نظيفة داخل التدريب بعد إذن التنفيذ، لا نسخ node_modules يدويًا.

#### 7.7.b — Build ومخاطر السلسلة

التسلسل: dev server مقابل build ← bundling بالقدر المطلوب ← environment العام في client bundle ← package scripts قد تنفذ كودًا ← مراجعة dependency ومصدرها. الغلط: متغير اسمُه secret يصبح سريًا داخل bundle أو audit tool يضمن الأمان. تمرين مستقل: يفسر script و lockfile ويكشف قيمة لا يجب شحنها للعميل ويثبت build محليًا؛ دليل أوامر و assets، بلا تثبيت dependency غير لازمة.

### 7.8 — اختبار السلوك و progressive enhancement

المتطلبات: 7.7 و 5.4. النتيجة: يثبت أن رحلة المستخدم تعمل مع loading/failure وتبقى مفهومة عند تعطل JavaScript في موضع يمكن تحسينه تدريجيًا.

#### 7.8.a — اختبار من فعل المستخدم

التسلسل: unit ل data transform ← DOM interaction ← browser flow ← fixtures محلية deterministic ← keyboard assertions. المختبر: test للبحث وإظهار empty ثم failure؛ المتوقع فشل فعلي إذا كسرنا عرض error عمدًا، لا screenshot بلا تحقق.

#### 7.8.b — تحسن دون فقد الأساس

التسلسل: رابط/نموذج HTML أصلي ← إضافة تحسين ← restore focus/state ← تقليل requests ← network offline/slow. الغلط: لو JS تعطلت يبقى من الطبيعي اختفاء كل التنقل. تمرين مستقل: يصلح رحلة جديدة ويعيد tests مع disabled JS للمحتوى القابل لذلك؛ دليل وحدود معلنة لما يحتاج backend في 8، بلا ادعاء أن API-dependent data تعمل offline تلقائيًا.

## مشروع المرحلة وبوابة الخروج

كتالوج قابل للبحث يستهلك mock محليًا: modules، async، validation، حالات loading/error/empty/success، إلغاء/رد قديم، تفضيل عرض غير حساس، keyboard واختبارات. البوابة 80% لكل checkpoint والمشروع مع عطل جديد مستقل؛ لا API عام شرط، ولا frontend framework شرط. راجع [MDN JavaScript](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Scripting) و[Fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch) عند إعداد الأمثلة.

## تشغيل جلسة هذه الجزئية

- اقرأ [الفهرس](README.md) و[قواعد التدريس والتقييم](COMMON_RULES.md) كاملين، ثم هذا الملف و[ملف التقدم](07-javascript_PROGRESS.md) كاملين قبل الشرح.
- هذا الملف منهج الجزئية، وليس الدرس المنشور أو دليل اجتيازها. اشرح checkpoint واحدة على أجزاء، وسؤالًا واحدًا كل مرة، بالعامية المصرية و PHP افتراضيًا إلا في موضوع لغة أخرى.
- ملف التقدم المجاور يملك الموضع والنتائج الخاصة بهذه الجزئية. الفهرس وملف التوجيه العام لا يكرران الدرجات.
- الجسور التمهيدية المحلية تُدرس وتُقيّم هنا. المرجع القديم لا يفرض إكمال مساره ولا يغير تقدمه؛ عند اختيار دراسة مسار قديم صراحة اقرأ Master و Progress الخاصين به كاملين من study الأب، وسجل درجاته هناك وحده مع مرجع عودة هنا.
- قواعد المنهج المشتركة وخرائط ملاك الموضوعات في COMMON_RULES.md؛ أسماء ملفات المسارات القديمة المذكورة أعلاه تُحل من study الأب، لا من هذا المجلد.

## إنهاء الجلسة

حدّث Progress هذه الجزئية وفق الدليل الفعلي والدروس الفرعية، والجسور المحلية نتائجها هنا فقط. لا تحدّث تقدمًا قديمًا إلا عند دراسة مساره الأصلي صراحة وفق قواعده، ولا تنسخ درجاته. حدّث مؤشر العودة عند تغيير الجزئية، وسجل بوابة انتقال أو موعد عودة معلنًا دون اجتياز وهمي. لا تبدأ الدراسة أو النشر أو commit أو push تلقائيًا.
