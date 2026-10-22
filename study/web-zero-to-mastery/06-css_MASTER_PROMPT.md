# المرحلة 6 — CSS وواجهات متجاوبة

الإصدار: 1.1 — 2026-10-21. المتطلبات: بوابة المرحلة 5. نبدأ بالمتصفح و CSS مباشرة بلا framework؛ كل قرار شكل يخدم مهمة المستخدم وقابلية القراءة والوصول. كل checkpoint يتطلب 80% ودليل مستقل.

### 6.1 — اختيار العنصر وفهم الأسلوب الفعلي

المتطلبات: 5.1–5.2. النتيجة: يربط stylesheet ويعرف لماذا declaration فازت بدل إضافة `!important` عشوائيًا.

#### 6.1.a — Syntax و selectors

التسلسل: ربط CSS ← rule/property/value ← type/class/attribute/combinators ← pseudo-class ← اختيار محدود واضح. المختبر: تلوين عنوان وبطاقة دون بقية الصفحة؛ المتوقع styles ظاهرة وطلب CSS ناجح، مع اختبار selector في DevTools.

#### 6.1.b — Cascade و inheritance و specificity

التسلسل: تعارض declarations ← cascade/source order ← inheritance ← specificity ← computed style؛ layers تمهيدًا عند الحاجة لا حفظ خوارزمية قبل المثال. الغلط: آخر سطر يفوز مهما اختلفت القوة. تمرين مستقل: يصلح تعارضين ويشرح المصدر الفائز دون `!important`؛ الدليل computed panel وتفسير.

### 6.2 — Box model والتدفق والحجم

المتطلبات: 6.1. النتيجة: يفسر عرض عنصر وسبب overflow وموقعه دون أرقام ترقيعية لكل شاشة.

#### 6.2.a — مساحة عنصر في normal flow

التسلسل: content/padding/border/margin ← box-sizing ← block/inline ← normal flow ← margin collapse في مثال محدود ← intrinsic sizing و min/max. المختبر: بطاقة عرضها معلوم؛ المتوقع حساب وفحص عرضها الحقيقي وتفسير زيادة padding.

#### 6.2.b — Units و overflow و position

التسلسل: px/%/rem/em/vh بوظيفة لا حفظ ← overflow ← relative/absolute/fixed/sticky ← containing block و z-index/stacking context مبسط. الغلط: absolute أسلوب تخطيط كل الصفحة أو hidden علاج ضياع محتوى. تمرين مستقل: يصلح نصًا طويلًا وب adge موضعها غلط ويثبت بقاء المحتوى ظاهرًا؛ دليل قياس وشرح.

### 6.3 — Layout: Flexbox ثم Grid

المتطلبات: 6.2. النتيجة: يختار أداة تخطيط مناسبة ويشرح المحاور بدل نسخ properties. الجزئيتان درسان مستقلان داخل checkpoint واحدة محفوظة الرقم، ولا تُشرحان في جلسة واحدة بالضرورة.

#### 6.3.a — Flexbox لعلاقة على محور

التسلسل: container/items ← main/cross axis ← gap/align/justify ← grow/shrink/basis ← wrapping. المختبر: شريط تحكم وبطاقات تلتف؛ المتوقع ترتيب مفهوم مع تغيير عرض النافذة. الغلط: direction دائمًا أفقي أو shrink يضمن اختفاء كل overflow. تمرين مستقل: يغير orientation ويحافظ على ترتيب DOM المنطقي؛ دليل و 80%.

#### 6.3.b — Grid لتنظيم صفوف وأعمدة

التسلسل: tracks/gaps ← explicit/implicit grid ← fr/minmax/repeat ← auto placement ← اختيار Grid مقابل Flex. المختبر: كتالوج يتغير عدد أعمدته مع المساحة؛ المتوقع توزيع دون widths منفصلة لكل بطاقة. تمرين مستقل: ينفذ layout صغيرًا ويبرر اختياره ويفحص empty/single/long item؛ دليل و 80%، لا تغيير ترتيب القراءة لمجرد الرسم.

### 6.4 — Responsive design وقراءة عربية مريحة

المتطلبات: 6.3. النتيجة: يصمم صفحة تستجيب للمحتوى والمستخدم لا لأسماء أجهزة محددة.

#### 6.4.a — Hierarchy و typography و mobile-first

التسلسل: هدف الصفحة ← wireframe بسيط ← أولوية المحتوى ← أحجام وخطوط/line length/spacing ← fluid sizing ← media queries عند انكسار المحتوى. المختبر: عنوان ووصف وإجراء واضحان على عرض ضيق وواسع؛ المتوقع سهولة العثور على الإجراء دون إخفاء معلومات أساسية.

#### 6.4.b — صور واتجاهات مختلفة

التسلسل: responsive media ← viewport ← RTL/LTR ← logical properties ← mixed-direction text. الغلط: قلب كل الصفحة يدويًا أو breakpoint لكل جهاز. تمرين مستقل: نسخة عربية وإنجليزية لكارت طويل، يعمل عند zoom وبعرض ضيق بلا horizontal overflow؛ دليل screenshots وشرح قرارين، مع احترام image loading من 5.5.

### 6.5 — حالات المكونات وتنظيم styles

المتطلبات: 6.4 و 5.4. النتيجة: يوضح الحالة والفعل والخطأ للمستخدم من غير الاعتماد على اللون وحده.

#### 6.5.a — Hover و focus و disabled و error

التسلسل: حالة افتراضية ← focus-visible ← hover ← disabled/invalid ← contrast ومعنى النص/الأيقونة. المختبر: زر وحقل في حالات مختلفة؛ المتوقع وصول keyboard ومعلومة خطأ مفهومة حتى بلا لون. الغلط: إزالة outline لتحسين الشكل أو state مرئية لا تعكس سلوك العنصر.

#### 6.5.b — متغيرات واتساق وحركة

التسلسل: custom properties لل spacing/colors ← component scope وتنظيم أسماء ← انتقال بسيط ← reduced motion. المختبر: تغيير قيمة مشتركة يحدّث مكونات مقصودة فقط؛ المتوقع اتساق وتجنب animation إجبارية. تمرين مستقل: ينفذ component بحالاته ويصلح تكرارًا أو selector يتسرب؛ دليل stylesheet وفحص وصول.

### 6.6 — فحص الواجهة بدل التخمين

المتطلبات: 6.5. النتيجة: يعيد إنتاج عيب واجهة ويثبت الإصلاح في ظروف متعددة.

#### 6.6.a — مصفوفة فحص صغيرة

التسلسل: desktop/mobile widths ← zoom ← keyboard ← محتوى طويل/فاضي ← browser ين إن متاحين ← accessibility checks. المختبر: checklist للكتالوج مع عيب مقصود؛ المتوقع finding قابل لإعادة الإنتاج، لا «شكلها كويس عندي».

#### 6.6.b — إصلاح بالسبب و UX feedback

التسلسل: افحص computed/layout ← حدد السبب ← أقل تعديل ← regression ← اسأل مستخدم تجريبي عن مهمة لا عن الإعجاب. الغلط: browser emulation وحدها تثبت جودة كل جهاز. تمرين مستقل: يصلح overflow و focus ومشكلة hierarchy ويعيد نفس الحالات؛ دليل قبل/بعد وملاحظات قابلة للفحص.

## مشروع المرحلة وبوابة الخروج

كتالوج responsive مبني من HTML المرحلة 5، بلا framework CSS أولًا: wireframe وقرارات hierarchy/typography، layout ملائم، RTL/LTR، حالات مكونات، اختبار keyboard/zoom/long content. النجاح: 80% لكل نقطة والمشروع، ومعالجة عطل جديد بلا قائمة ترقيعات لكل شاشة. مصادر التحقق: [MDN CSS](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Styling_basics) و[CSS layout](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/CSS_layout).

## تشغيل جلسة هذه الجزئية

- اقرأ [الفهرس](README.md) و[قواعد التدريس والتقييم](COMMON_RULES.md) كاملين، ثم هذا الملف و[ملف التقدم](06-css_PROGRESS.md) كاملين قبل الشرح.
- هذا الملف منهج الجزئية، وليس الدرس المنشور أو دليل اجتيازها. اشرح checkpoint واحدة على أجزاء، وسؤالًا واحدًا كل مرة، بالعامية المصرية و PHP افتراضيًا إلا في موضوع لغة أخرى.
- ملف التقدم المجاور يملك الموضع والنتائج الخاصة بهذه الجزئية. الفهرس وملف التوجيه العام لا يكرران الدرجات.
- الجسور التمهيدية المحلية تُدرس وتُقيّم هنا. المرجع القديم لا يفرض إكمال مساره ولا يغير تقدمه؛ عند اختيار دراسة مسار قديم صراحة اقرأ Master و Progress الخاصين به كاملين من study الأب، وسجل درجاته هناك وحده مع مرجع عودة هنا.
- قواعد المنهج المشتركة وخرائط ملاك الموضوعات في COMMON_RULES.md؛ أسماء ملفات المسارات القديمة المذكورة أعلاه تُحل من study الأب، لا من هذا المجلد.

## إنهاء الجلسة

حدّث Progress هذه الجزئية وفق الدليل الفعلي والدروس الفرعية، والجسور المحلية نتائجها هنا فقط. لا تحدّث تقدمًا قديمًا إلا عند دراسة مساره الأصلي صراحة وفق قواعده، ولا تنسخ درجاته. حدّث مؤشر العودة عند تغيير الجزئية، وسجل بوابة انتقال أو موعد عودة معلنًا دون اجتياز وهمي. لا تبدأ الدراسة أو النشر أو commit أو push تلقائيًا.
