# تنفيذ تحسينات أساسيات الكمبيوتر والبرمجة والشبكات

تم تطبيق ملاحظات المراجعة على الدروس الـ59 الأصلية في النسختين العربية والإنجليزية. أصبح الكارد 89 درسًا أقصر و6 أدلة لكل لغة؛ الزيادة ناتجة أساسًا عن فصل موضوعات كانت مجمعة. الأقسام الخمسة وأسماؤها الطبيعية محفوظة.

الترتيب الحالي: استخدام الكمبيوتر 12، البرمجة وتطبيقاتها 14، الرياضيات وحل المشكلات 14، داخل الكمبيوتر والأدوات 16، الشبكات والويب 33. الأعداد هنا للتوثيق؛ ليست بادئات عناوين الأقسام.

## التغييرات الجامعة

- تصحيح المعاني التي أخذت تعريفًا من سياق مختلف: Path MTU والمنافذ الديناميكية والخادم الأصلي وService Worker ورسم DNS.
- أمثلة أصغر تسبق المصادر الكاملة، وتمارين فيها محاولة قبل الحل، وتجهيز محلي مستقل عن جهاز مؤلف الموقع.
- أربع مراحل قابلة للتشغيل لقائمة المشتريات، وتمثيل منتج بخصائص مستقلة، وحفظ في المتصفح وفي ملف بيانات مع أخطاء واضحة.
- معمل Node.js محلي بلا حزم إضافية: HTTP وAPI ووسيط واحد وCORS والكاش وPolling وSSE وwebhook وحد طلبات وسجلات معرّفاتها متاحة.
- نقل الشرح المتقدم إلى موضعه وتحديث النسختين والفهارس والسابق والتالي وترتيب الطباعة من خريطة واحدة محفوظة في `src/data/foundations-curriculum.json`.

## ما تحقق آليًا وعمليًا

- 190 صفحة مصدر: الروابط المحلية والسابق والتالي وتكافؤ وجود الصفحات باللغتين، وأمثلة التحويل الثنائي وUTF-8 وحساب العملات وأطوال رسائل HTTP.
- 79 فحصًا للأمثلة الأساسية الموسعة، و31 فحصًا للمسار البرمجي الأول.
- 57 فحصًا إضافيًا للمراحل الصغيرة والخادم المحلي وملف البيانات وواجهات الشبكة، تشمل الفشل وتكرار الإشعار والكاش ورفض CORS داخل متصفح حقيقي.
- 192 صفحة في متصفح سطح المكتب، و21 عرضًا لشاشة الهاتف، وفحصا تنقل؛ لا أخطاء JavaScript غير معالجة في نتائج التحقق.
- بناء الموقع نجح. تحذيرات البناء الموجودة تخص head-inject وصفحة404 وإعداد sitemap؛ لم تمنع البناء.
- ترتيب الفهرس مطابق لترتيب الطباعة في اللغتين. ملف الكتاب أعيد تصديره: 1219 صفحة تضم 382 مستندًا. روجعت بصريًا الصفحات 19 و67 و197 و828، وطابقت بصمة SHA-256 نسخة التحميل في البناء. نتيجة فحصه التفصيلية في `planning/audit-results/pdf-checks.json`.

هذه اختبارات محتوى وتشغيل وعرض. **لم يُنفذ اختبار فهم مع متعلم بشري مبتدئ**، ولذلك لا نرفع درجات الوضوح القديمة ونقدمها كقياس مثبت. لإجراء هذا الاختبار: أعطه مهمة جديدة، واطلب منه توقع النتيجة وشرحها، وسجل موضع احتياجه مساعدة. التقرير القديم محفوظ بوصفه حالة ما قبل التعديل.

## سجل كل ملاحظة

| الدرس الأصلي | ما تم تنفيذه |
|---|---|
| [ابدأ هنا: أساسيات الكمبيوتر والبرمجة](C:/my_docs/src/content/docs/programming-basics/computer-fundamentals/01-learning-roadmap.md) | اختصار تجهيز البداية إلى الأدوات المطلوبة حاليًا وتأجيل أدوات اللغات وإدارة التاريخ لوقتها. |
| [النوافذ والماوس والكتابة](C:/my_docs/src/content/docs/programming-basics/computer-fundamentals/01-using-your-computer.md) | مقارنة مرئية بين سهم الماوس وخط الكتابة، وتجربة تبين اختلاف موضع الضغط عن موضع الإدخال. |
| [الملفات والمجلدات والحفظ](C:/my_docs/src/content/docs/programming-basics/computer-fundamentals/02-files-and-folders.md) | مهمتان منفصلتان للضغط وفكّه، ولنسخ ملف إلى وسيط آخر والتحقق من استقلال النسخة. |
| [البرامج والتثبيت والاستخدام الآمن](C:/my_docs/src/content/docs/programming-basics/computer-fundamentals/03-programs-installation-safety.md) | موقف صلاحيات للكاميرا وجهات الاتصال، وتمرين يقارن فتح ملف بصلاحية المسؤول. |
| [كيف يحوّل الكمبيوتر المدخلات إلى نتيجة؟](C:/my_docs/src/content/docs/programming-basics/computer-fundamentals/02-computers-data-processing.md) | تمرين تحويل حرارة قبل الحل، مع فصل البيانات عن التعليمات واختبار الصفر. |
| [إزاي الكمبيوتر يمثل الأرقام والنصوص والصور؟](C:/my_docs/src/content/docs/programming-basics/computer-fundamentals/02-binary-data-representation.md) | الحفاظ على تحويل5 إلى101 وإضافة توقفات للتطبيق، وفصل الصورة والصوت والوحدات في درس مستقل. |
| [مكونات الجهاز التي تستخدمها](C:/my_docs/src/content/docs/programming-basics/computer-fundamentals/03-hardware-architecture.md) | تتبع ملف من التخزين إلى الذاكرة والمعالج والشاشة، وتعريف كل دور بجوار الرسم. |
| [المعالج وتنفيذ التعليمات](C:/my_docs/src/content/docs/programming-basics/computer-fundamentals/04-cpu-gpu.md) | مقارنة خطوة تعتمد على سابقتها بعمليات إضاءة بكسلات مستقلة، مع تفسير تكلفة تجهيز العمل. |
| [الذاكرة والحفظ: أين ذهب شغلك؟](C:/my_docs/src/content/docs/programming-basics/computer-fundamentals/05-ram-memory-buffers.md) | تقليل تكرار التوسعات الطويلة للاختصارات وإضافة تذكير قصير ورابط للمكونات. |
| [نظام التشغيل والبرامج والملفات](C:/my_docs/src/content/docs/programming-basics/computer-fundamentals/06-operating-systems.md) | مقارنة عملية بين المساحة غير الكافية والوصول المرفوض وخطوة تشخيص كل منهما. |
| [الإنترنت والمتصفح والعنوان](C:/my_docs/src/content/docs/programming-basics/computer-fundamentals/07-internet-browser-basics.md) | تقديم رحلة طلب ورد قصيرة قبل أسماء آليات الشبكة، مع تعريف العميل والخادم عمليًا. |
| [من فكرة إلى خطوات ثم برنامج](C:/my_docs/src/content/docs/programming-basics/computer-fundamentals/03-binary-languages-algorithms.md) | تمرين عمر وحدود مدخلاته بإجابة مطوية: التحقق قبل القرار. |
| [جهّز مجلد أول برنامج ومحرره](C:/my_docs/src/content/docs/programming-basics/computer-fundamentals/05-os-terminal-files-git.md) | تقصير تكرار شرح الترميز وربطه بمثال سابق بدل إعادة توسعة الاسم في كل موضع. |
| [اكتب أول برنامج واحفظه وشغّله](C:/my_docs/src/content/docs/programming-basics/computer-fundamentals/08-first-program.md) | عزل سطر الرسالة المطلوب تعديله وشرح علامات التنصيص والحفظ وإعادة التحميل. |
| [القيم والمتغيرات والحساب](C:/my_docs/src/content/docs/programming-basics/computer-fundamentals/09-values-and-calculations.md) | شرح Console وReferenceError قبل الحاجة إليهما، وربطهما بدرس الخطأ الذي أصبح أسبق. |
| [قرار بسيط وتكرار خطوات](C:/my_docs/src/content/docs/programming-basics/computer-fundamentals/10-decisions-and-repetition.md) | تجربة شرط واحد من غير حلقة، واختبار17 و18 و19 قبل الانتقال للتكرار. |
| [القوائم والدوال: نظّم البيانات والخطوات](C:/my_docs/src/content/docs/programming-basics/computer-fundamentals/11-functions-and-lists.md) | ملف كامل لدالة تضاعف رقمًا واحدًا قبل اجتماع الدوال والقوائم والحلقات. |
| [استقبل بيانات من المستخدم وتأكد منها](C:/my_docs/src/content/docs/programming-basics/computer-fundamentals/12-input-validation.md) | ملف إدخال بخانة واحدة قبل السعر والكمية، وشرح الرموز وأسباب ترتيب التحقق. |
| [نظّف النص وابحث فيه وقسّمه](C:/my_docs/src/content/docs/programming-basics/computer-fundamentals/13-text-processing.md) | ملف لتنظيف اسم واحد قبل المقارنة وتقسيم قائمة كلمات. |
| [اقرأ بيانات وتعامل مع فشل العملية](C:/my_docs/src/content/docs/programming-basics/computer-fundamentals/14-runtime-errors.md) | ملف يشغّل فشل JSON واحدًا ويعالجه، ثم إصلاحه، قبل تحقق نوع القائمة وعناصرها. |
| [احفظ قائمة وافتحها من جديد](C:/my_docs/src/content/docs/programming-basics/computer-fundamentals/15-saving-data.md) | درس تجهيز خادم محلي كامل، ثم تجربة ملف بيانات مستقل تشمل الحفظ والقراءة والغياب والتلف. |
| [ابنِ قائمة مشتريات واختبرها](C:/my_docs/src/content/docs/programming-basics/computer-fundamentals/16-shopping-project.md) | أربع نسخ تشغيل للمشروع قبل المصدر الكامل، ثم مثال كائن يفصل الاسم عن الكمية. |
| [راجع نتيجتك واعرف فائدة Git](C:/my_docs/src/content/docs/programming-basics/computer-fundamentals/09-git-debugging.md) | نقل الدرس بعد أول برنامج وقبل الحسابات، وتعديل اختباره ليستخدم ملفًا سبق شرحه. |
| [راجع مشروعك واختار الخطوة التالية](C:/my_docs/src/content/docs/programming-basics/computer-fundamentals/04-tech-fields-ai-engineering-mindset.md) | معيار جاهزية يشمل الدوال والقوائم والمدخلات والتحقق والأخطاء والحفظ والاسترجاع. |
| [الأساس الرياضي: الباقي والنسب والمتوسط والقوى](C:/my_docs/src/content/docs/programming-basics/math-problem-solving/01-arithmetic-foundations.md) | مثال حسابي قبل المصطلحات، وفصل القسمة والباقي وGCD وLCM والدقة في درس تدرّج مستقل. |
| [المتغيرات والمعادلات والمنطق البولياني](C:/my_docs/src/content/docs/programming-basics/math-problem-solving/02-variables-equations-logic.md) | جدول قرار صغير أولًا، ثم درس منفصل للمجموعات والعلاقات والمجال والمدى مع مثال تربيع. |
| [التفكير الحاسوبي وتحليل المتطلبات](C:/my_docs/src/content/docs/programming-basics/math-problem-solving/04-computational-thinking.md) | تتبع مطلب السحب إلى قبول ورفض وحدود واختبار تغير الرسوم، قبل تعديل التنفيذ. |
| [الخوارزميات وPseudocode وأشجار القرار](C:/my_docs/src/content/docs/programming-basics/math-problem-solving/05-algorithms-pseudocode-decision-trees.md) | شجرة فعلية لنفس مثال أكبر ثلاثة أعداد، ونقل توسع الحالة السابقة بعد المثال. |
| [المخططات الانسيابية والحلقات والتصحيح](C:/my_docs/src/content/docs/programming-basics/math-problem-solving/06-flowcharts-loops-debugging.md) | الإبقاء على تتبع الحلقة اليدوي وفصل برهان الثبات والانتهاء ونمو الخطوات. |
| [مقارنة الخوارزميات وطرق تنظيم البيانات](C:/my_docs/src/content/docs/programming-basics/08-problem-solving-algorithms.md) | فصل تنظيم البيانات والتعقيد عن أنماط الحل ثم الجشع والبرمجة الديناميكية، مع بقاء أمثلة العملاء والعملات. |
| [الرياضيات التطبيقية والقياس والرسوم والأعداد الأولية](C:/my_docs/src/content/docs/programming-basics/math-problem-solving/03-applied-math-graphs-primes.md) | فصل القياس والأوليات عن العد والاحتمال وعن الرسوم، وإضافة رسم فعلي وجدول طابور وتصحيح رابط التعقيد. |
| [خريطة التعلّم وقواعد الدراسة](C:/my_docs/src/content/docs/programming-basics/computer-in-depth/01-learning-roadmap.md) | خريطة بنتائج قابلة للملاحظة: التنفيذ، ترجمة العنوان، ثم الملفات والتاريخ والاختبار. |
| [الكمبيوتر والبيانات ودورة المعالجة](C:/my_docs/src/content/docs/programming-basics/computer-in-depth/02-computers-data-processing.md) | رسم لمسار فتح صورة وتعريف فك الترميز قبل المقاطعات ونقل البيانات. |
| [مكوّنات الهاردوير واللوحة الأم](C:/my_docs/src/content/docs/programming-basics/computer-in-depth/03-hardware-architecture.md) | تعريف Socket وBus وSeek وPSU بأدوار وأمثلة، قبل تفاصيل التوصيل. |
| [CPU وGPU والمعالجة المتوازية](C:/my_docs/src/content/docs/programming-basics/computer-in-depth/04-cpu-gpu.md) | تنفيذ تعليمتين بمثال5 ثم8، ورسم مستويات الكاش، وفصل العمل المتوازي في درس. |
| [RAM والذاكرة الافتراضية والـBuffers](C:/my_docs/src/content/docs/programming-basics/computer-in-depth/05-ram-memory-buffers.md) | تقسيم العناوين الافتراضية والحجز وعمر البيانات ومخازن النقل إلى ثلاثة دروس، ونقل التدريبات إلى موضوعها. |
| [نظام التشغيل: البنية والأنواع وطريقة العمل](C:/my_docs/src/content/docs/programming-basics/computer-in-depth/06-operating-systems.md) | تجربة قراءة عملية وخيوطها من Task Manager، مع توضيح ما لا يثبته عمود الحالة. |
| [الثنائي ولغات البرمجة والخوارزميات](C:/my_docs/src/content/docs/programming-basics/computer-in-depth/03-binary-languages-algorithms.md) | فصل تمثيل الأعداد والحروف عن تحويل الكود وتشغيله والمكتبات، مع نقل الشرح الإنجليزي الموازي. |
| [الطرفية والملفات والصلاحيات والبيئة](C:/my_docs/src/content/docs/programming-basics/computer-in-depth/05-os-terminal-files-git.md) | وضع إنشاء الملف وقراءته أولًا، وفصل القنوات والبيئة والصلاحيات، وفك صياغة cmd داخل PowerShell. |
| [Git وDebugging والاختبارات الأساسية](C:/my_docs/src/content/docs/programming-basics/computer-in-depth/09-git-debugging.md) | أول commit قبل الفروع، وتمرين كامل لتعارض وفرع ودمج، وفصل الاختبارات في درس مستقل. |
| [مجالات التقنية والذكاء الاصطناعي والعقلية الهندسية](C:/my_docs/src/content/docs/programming-basics/computer-in-depth/04-tech-fields-ai-engineering-mindset.md) | اختيارات صغيرة بأداة ومخرج محددين بدل تكليف أربعة مجالات في أسبوع. |
| [الإنترنت والويب ورحلة الطلب](C:/my_docs/src/content/docs/programming-basics/01-web-and-request-flow.md) | رحلة أولى قصيرة ورسم يفصل DNS عن HTTP، ونقل التفاصيل للخادم والمتصفح وتصحيح Service Worker وcurl. |
| [كيف تتواصل الأجهزة داخل الشبكة المحلية؟](C:/my_docs/src/content/docs/programming-basics/14-network-layers-lan-ethernet-arp.md) | رسم جهازين ومبدّل وراوتر وتتبع إطار محلي، ثم فصل تقسيم الشبكة ومنع الدوران. |
| [اتصل بشبكة Wi-Fi وافهم مشاكلها](C:/my_docs/src/content/docs/programming-basics/18-wifi-practical-basics.md) | ورقة تسجيل مقارنة لنفس الجهاز قريبًا وبعيدًا وجهاز ثانٍ، مع حدود الاستنتاج. |
| [عناوين الشبكات وتقسيمها وتوجيه البيانات](C:/my_docs/src/content/docs/programming-basics/15-addressing-dhcp-nat-routing-ipv6.md) | قراءة إعدادات الجهاز أولًا، وفصل حساب القناع عن التوجيه والإصدار السادس وشرح رسائل DHCP في سياقها. |
| [كيف يتحول اسم الموقع إلى عنوان؟](C:/my_docs/src/content/docs/programming-basics/02-dns-and-ip.md) | نتيجة lookup توضيحية مشروحة حقلًا بحقل، ثم نقل الفشل وحماية DNS إلى درس مستقل. |
| [نقل البيانات باستخدام TCP وUDP](C:/my_docs/src/content/docs/programming-basics/03-tcp-udp-packets.md) | مثال مواضع بايتات وتسلسلها، وتفسير أثر تكرار العملية، وتصحيح Path MTU وفصل التشخيص. |
| [عنوان الويب والمنافذ وبروتوكول HTTP](C:/my_docs/src/content/docs/programming-basics/04-url-ports-http.md) | تصحيح المنافذ الديناميكية، وفصل ترميز الأحرف وتفاصيل العنوان عن أول URL. |
| [طلبات HTTP والردود والجلسات](C:/my_docs/src/content/docs/programming-basics/05-http-messages-state.md) | فصل قراءة الرسالة عن تذكّر المستخدم والتعديل المشروط والمتزامن مع نقل مثال PHP. |
| [تشفير الاتصال وشهادات المواقع](C:/my_docs/src/content/docs/programming-basics/06-https-tls-certificates.md) | الإبقاء على جدول DV/OV/EV المشروح وفصل المفاتيح والمصافحة والإلغاء والتوسعات. |
| [كيف يعرض المتصفح الصفحة؟](C:/my_docs/src/content/docs/programming-basics/09-browser-rendering-devtools.md) | صفحة كاملة تغيّر حجم نص وتقيس عرضه قبل تفاصيل التحميل والمهام، ونقل التفاصيل إلى درس مستقل. |
| [رحلة الطلب داخل الخادم](C:/my_docs/src/content/docs/programming-basics/07-server-side-path.md) | طلب منتج من خادم محلي واحد أولًا، وربطه بسجل ورمز رد، وتقليل تكرار موازن الأحمال. |
| [الخوادم الوسيطة وتوزيع الطلبات](C:/my_docs/src/content/docs/programming-basics/08-server-proxy-api-gateway.md) | وسيط محلي عامل، ومقارنة معرّفات طرفيه، وفصل رسم سؤال DNS عن المرور ثم فصل السياسات. |
| [التخزين المؤقت وضغط بيانات الويب](C:/my_docs/src/content/docs/programming-basics/10-http-caching-compression.md) | تسلسل200 ثم نسخة صالحة ثم304، وأوامر طلب شرطي في المعمل، مع التفريق بين curl وكاش المتصفح. |
| [السماح بقراءة البيانات بين المواقع](C:/my_docs/src/content/docs/programming-basics/11-same-origin-cors.md) | عميل وخادم على منفذين فعليين لإظهار المنع والسماح في المتصفح، وفصل سياسات العزل. |
| [التحديثات المباشرة وإشعارات الخوادم](C:/my_docs/src/content/docs/programming-basics/12-realtime-webhooks.md) | Polling ثم SSE يعملان بعميل وخادم كاملين، وإشعار webhook في درس مستقل. |
| [تصميم واجهات تبادل البيانات](C:/my_docs/src/content/docs/programming-basics/13-api-design.md) | عقد منتج محدد بحقول وأنواع وحالات200 و400 و404 و405 واختباراته قبل مقارنة أنماط الواجهات. |
| [كيف يختلف HTTP/2 عن HTTP/3؟](C:/my_docs/src/content/docs/programming-basics/16-http2-http3-quic.md) | مقارنة لنفس ثلاثة طلبات عند الفقد، وتعريف إطار البروتوكول والتدفق وحدود ضمانات النقل. |
| [توزيع المحتوى وحماية الطلبات ومراقبتها](C:/my_docs/src/content/docs/programming-basics/17-proxies-cdn-waf-observability.md) | تصحيح الخادم الأصلي، وفصل التوزيع والحماية والمراقبة، وأمثلة حسابية للحدود وp50/p95/p99 ومعمل لمعرفات الطلب والفشل. |

## أدلة التشغيل والمصادر

ملفات النتائج: `foundations-checks.json` و`structure-checks.json` و`practice-checks.json` و`progression-checks.json` و`browser-checks.json` داخل `planning/audit-results/`. درجات وبصمات الحالة السابقة في `foundations-clarity-review.json`، وربط الملاحظات بالتنفيذ في `foundations-improvements.json`.

تصحيح Path MTU يستند إلى [RFC1191](https://www.rfc-editor.org/info/rfc1191/)، ونطاق المنافذ إلى [سجل IANA](https://www.iana.org/assignments/service-names-port-numbers). أمثلة سياسة القراءة تتوافق مع [دليل CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CORS)، والبث مع [دليل SSE](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events). تجهيز الأداة يعتمد على [تنزيل Node.js الرسمي](https://nodejs.org/en/download).

لم يتم نشر الموقع أو إنشاء commit في مستودعه. تجربة Git نُفذت داخل مستودع تدريب مؤقت منفصل، وأنتجت تعارضًا مقصودًا ثم دمجًا سليمًا. نطاق التنفيذ هو كارد الأساسيات وأمثلته وترتيب عرضه والطباعة والاختبارات ذات الصلة؛ التعديلات السابقة في المسارات الأخرى محفوظة.
