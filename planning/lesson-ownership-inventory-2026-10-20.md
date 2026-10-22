# جرد بنية الدروس — 2026-10-20

هذا جرد آلي للعناوين والأقسام، وليس شهادة بصحة المحتوى أو اكتمال مراجعة كل درس.

## programming-basics — 97 صفحات عربية

### الإنترنت والويب ورحلة الطلب

- الملف: `programming-basics/01-web-and-request-flow.md`
- أقسامه: أربع خطوات قبل التفاصيل ← الفكرة قبل المصطلحات ← العميل والخادم: دوران لا نوعان من الأجهزة ← اقرأ الرابط قبل أن تتبعه ← جرّب طلبًا حقيقيًا ← أخطاء شائعة ← طبّق الفكرة ← تأكد من فهمك
- فحص البنية: يتطلب مراجعة بشرية لموضوع الدرس

### كيف يتحول اسم الموقع إلى عنوان؟

- الملف: `programming-basics/02-dns-and-ip.md`
- أقسامه: اقرأ شكل نتيجة البحث ← الفكرة: دفتر عناوين موزّع ← ما الذي يعيده DNS؟ ← رحلة الاستعلام عند غياب الـcache ← TTL: السرعة مقابل سرعة التغيير ← تجربة عملية وقراءة النتيجة ← أخطاء شائعة ← مسائل عملية ← تأكد من فهمك ← الخطوة التالية
- فحص البنية: يتطلب مراجعة بشرية لموضوع الدرس

### TCP: الاتصال من أول SYN لحد الإغلاق

- الملف: `programming-basics/03-tcp-udp-packets.md`
- أقسامه: TCP بيقدم إيه لبرنامجك؟ ← مين متصل بمين؟ ← الاتصال بيبدأ إزاي؟ ← ترتيب البايتات وتأكيد وصولها ← حجم الجزء بيتحدد إزاي؟ ← نافذة المستقبل وازدحام الشبكة ← الاتصال بينتهي إزاي؟ ← تجربة محلية بـPHP: رسالتك مش هي اتصالك ← تتأكد من إيه وقت العطل؟ ← TCP وصل البيانات، هل الطلب اتنفذ؟ ← راجع فهمك ← مراجع الدرس
- فحص البنية: يتطلب مراجعة بشرية لموضوع الدرس

### عنوان الويب والمنافذ وبروتوكول HTTP

- الملف: `programming-basics/04-url-ports-http.md`
- أقسامه: قبل التفاصيل ← HTTP ← تشريح URL ← ما المنفذ؟ ← Socket وConnection ← مثال PHP محلي ← مسائل عملية ← الخطوة التالية
- فحص البنية: Editorial fragments need integration

### اقرأ طلب HTTP وردّه

- الملف: `programming-basics/05-http-messages-state.md`
- أقسامه: قبل التفاصيل ← الطلب: العميل بيطلب إيه؟ ← Methods ← Headers شائعة ← الرد: الخادم رجّع إيه؟ ← مسائل عملية ← الخطوة التالية
- فحص البنية: يتطلب مراجعة بشرية لموضوع الدرس

### تشفير الاتصال وشهادات المواقع

- الملف: `programming-basics/06-https-tls-certificates.md`
- أقسامه: إيه الفرق بين HTTP وHTTPS؟ ← شهادة الموقع بتقول إيه؟ ← DV وOV وEV: الجهة بتتحقق من إيه؟ ← جرّب فحص شهادة ← أخطاء شائعة وراجع فهمك ← مراجع للتفاصيل ← الخطوة التالية
- فحص البنية: يتطلب مراجعة بشرية لموضوع الدرس

### رحلة الطلب داخل الخادم

- الملف: `programming-basics/07-server-side-path.md`
- أقسامه: خادم واحد يوضح الفكرة ← قبل التفاصيل ← ما السيرفر؟ ← من الإنترنت إلى التطبيق ← توزيع الشغل بين الخوادم ← Web Server وVirtual Host ← PHP-FPM والتطبيق ← رجوع الاستجابة ← حالات مهمة ← Cache hit ← Static file ← Dynamic request ← فشل backend ← تدريب نهائي ← مسائل عملية ← المهلات واستهلاك الموارد ← ماذا يحدث بعد الضغط على Enter؟ ← من المسؤول عن ماذا؟
- فحص البنية: Editorial fragments need integration

### مقارنة الخوارزميات وطرق تنظيم البيانات

- الملف: `programming-basics/08-problem-solving-algorithms.md`
- أقسامه: قبل التفاصيل ← من المشكلة إلى برنامج ← اختيار بنية البيانات ← التعقيد Big O ← تمرين ← مسائل عملية ← حل تمرين العملاء ومعنى اختيار البنية ← Best وAverage وWorst Case ← Time وSpace Complexity ← تصميم الاختبارات ← الخطوة التالية
- فحص البنية: يتطلب مراجعة بشرية لموضوع الدرس

### الخوادم الوسيطة وتوزيع الطلبات

- الملف: `programming-basics/08-server-proxy-api-gateway.md`
- أقسامه: جرّب وسيطًا واحدًا ← قبل التفاصيل ← لماذا توجد طبقات أمام التطبيق؟ ← Forward Proxy ← Reverse Proxy ← مقارنة الأدوار ← مسائل عملية ← الخطوة التالية
- فحص البنية: يتطلب مراجعة بشرية لموضوع الدرس

### كيف يعرض المتصفح الصفحة؟

- الملف: `programming-basics/09-browser-rendering-devtools.md`
- أقسامه: غيّر حجم نص وقِس عرضه ← قبل التفاصيل ← من الاستجابة إلى Pixels ← DevTools ← مسائل عملية ← قِس ما يشعر به المستخدم ← الخطوة التالية
- فحص البنية: يتطلب مراجعة بشرية لموضوع الدرس

### التخزين المؤقت وضغط بيانات الويب

- الملف: `programming-basics/10-http-caching-compression.md`
- أقسامه: ثلاث لحظات لنفس النسخة ← قبل التفاصيل ← لماذا نخزن الاستجابة؟ ← Freshness وValidation ← مثال PHP ← الضغط ← Checklist ← مرجع ← مسائل عملية ← نسخة قديمة وقت التحديث أو العطل ← امشِ مع الطلب الشرطي خطوة خطوة
- فحص البنية: يتطلب مراجعة بشرية لموضوع الدرس

### السماح بقراءة البيانات بين المواقع

- الملف: `programming-basics/11-same-origin-cors.md`
- أقسامه: نفس الرد: مرة ممنوع قراءته ومرة مسموح ← قبل التفاصيل ← ما Origin؟ ← CORS ← Preflight ← مثال PHP مبسط ← مسائل عملية ← شخّص الرفض من الرسالتين
- فحص البنية: يتطلب مراجعة بشرية لموضوع الدرس

### اسأل دوريًا أو استقبل بثًا من الخادم

- الملف: `programming-basics/12-realtime-webhooks.md`
- أقسامه: شغّل السؤال الدوري ثم البث ← قبل التفاصيل ← ليست كل التحديثات Request/Response تقليدية ← Server-Sent Events ← التشغيل ← مسائل عملية ← الخطوة التالية
- فحص البنية: يتطلب مراجعة بشرية لموضوع الدرس

### تصميم واجهات تبادل البيانات

- الملف: `programming-basics/13-api-design.md`
- أقسامه: عقد منتج واحد قبل أنواع الواجهات ← قبل التفاصيل ← اختر الأسلوب حسب المشكلة ← موارد وHTTP ← Validation وProblem Details ← Pagination وFiltering ← التوافق والإصدارات ← العقد والتشغيل ← مراجع ← مسائل عملية ← اختبر العقد عند التكرار والتغيير
- فحص البنية: يتطلب مراجعة بشرية لموضوع الدرس

### كيف تتواصل الأجهزة داخل الشبكة المحلية؟

- الملف: `programming-basics/14-network-layers-lan-ethernet-arp.md`
- أقسامه: جهازان وراوتر ← نبدأ من رحلة بسيطة داخل البيت ← لماذا نقسم الاتصال إلى طبقات؟ ← LAN وEthernet وMAC Address ← ARP والوصول إلى الـGateway ← Switch وRouter ← تدريب عملي ← تأكد من فهمك ← الخطوة التالية
- فحص البنية: يتطلب مراجعة بشرية لموضوع الدرس

### إعدادات عنوان الجهاز والاتصال

- الملف: `programming-basics/15-addressing-dhcp-nat-routing-ipv6.md`
- أقسامه: اقرأ إعداداتك قبل الحساب ← DHCP ← Private IP وPublic IP وNAT ← تدريب عملي ← تأكد من فهمك ← الخطوة التالية
- فحص البنية: Short lesson: review explanation and examples

### كيف يختلف HTTP/2 عن HTTP/3؟

- الملف: `programming-basics/16-http2-http3-quic.md`
- أقسامه: نفس ثلاثة طلبات عند فقد بيانات ← ليه ظهر أكتر من إصدار لـHTTP؟ ← HTTP Semantics ونسخة النقل ← HTTP/2 وMultiplexing ← QUIC وHTTP/3 ← اختيار الإصدار ← تدريب عملي ← تأكد من فهمك ← ضغط الرؤوس وإعادة الاتصال
- فحص البنية: يتطلب مراجعة بشرية لموضوع الدرس

### وزّع المحتوى وافهم الخادم الأصلي

- الملف: `programming-basics/17-proxies-cdn-waf-observability.md`
- أقسامه: CDN وOrigin وPoint of Presence ← الخطوة التالية
- فحص البنية: Short lesson: review explanation and examples

### اتصل بشبكة Wi-Fi وافهم مشاكلها

- الملف: `programming-basics/18-wifi-practical-basics.md`
- أقسامه: مين بيعمل إيه داخل البيت؟ ← اسم الشبكة والدخول إليها ← الإشارة والسرعة مش نفس الحاجة ← حماية الاتصال ← شخّص بالمقارنة ← سجل مقارنة بدل الاعتماد على الإحساس
- فحص البنية: يتطلب مراجعة بشرية لموضوع الدرس

### أخطاء البحث عن العناوين وحماية DNS

- الملف: `programming-basics/19-dns-protection.md`
- أقسامه: إجابة غير موجودة وحماية DNS
- فحص البنية: Short lesson: review explanation and examples

### MTU: ليه البيانات الصغيرة تعدّي والكبيرة تتعطل؟

- الملف: `programming-basics/20-transport-diagnostics.md`
- أقسامه: حجم الملف مش حجم الحزمة ← الطريق فيه أكتر من وصلة ← إزاي تثبت الفرضية؟ ← افصل مشكلة الطريق عن مشكلة التطبيق ← تمرين تشخيص ← مراجع
- فحص البنية: يتطلب مراجعة بشرية لموضوع الدرس

### الحروف والرموز داخل عنوان الويب

- الملف: `programming-basics/21-url-encoding.md`
- أقسامه: الرموز داخل العنوان
- فحص البنية: Short lesson: review explanation and examples

### تذكّر المستخدم وحماية التعديلات

- الملف: `programming-basics/22-http-state-and-updates.md`
- أقسامه: Stateless لا يعني بلا حالة في التطبيق ← مثال PHP ← اللغة والنسخة والتعديل المتزامن
- فحص البنية: Short lesson: review explanation and examples

### كيف يتفق الطرفان على اتصال مشفّر؟

- الملف: `programming-basics/23-tls-handshake-details.md`
- أقسامه: مفتاح التشفير مش كلمة السر اللي بتكتبها ← خطوات بدء الاتصال ← انتهاء الصلاحية والإلغاء ← إضافات هتقابلها مع الاتصال المشفّر
- فحص البنية: يتطلب مراجعة بشرية لموضوع الدرس

### حماية الطلبات وتحديد معدلها

- الملف: `programming-basics/24-request-protection.md`
- أقسامه: ثلاث طرق للعد بأرقام صغيرة ← WAF ليس بديلًا لأمان التطبيق ← Rate Limiting وإدارة الاندفاع
- فحص البنية: Short lesson: review explanation and examples

### تتبّع الطلب وفسّر القياسات

- الملف: `programming-basics/25-request-observation.md`
- أقسامه: اقرأ قياسًا ومعرّفًا من تجربة تملكها ← Logs وMetrics وTraces ← تأكد من فهمك ← مشروع تراكمي: تتبّع طلب واحد من الاسم إلى الـOrigin ← 1. الاسم والعنوان ← 2. الاتصال وHTTP ← 3. كرر وقارن ← 4. مسار الفشل ← التسليم ← راجع الاستنتاج قبل تعديل الخدمة
- فحص البنية: يتطلب مراجعة بشرية لموضوع الدرس

### احسب حدود الشبكة من عنوانها

- الملف: `programming-basics/26-subnet-calculations.md`
- أقسامه: Subnet Mask وCIDR ← مثال كامل على /24 و/26
- فحص البنية: Short lesson: review explanation and examples

### اختيار الطريق وقراءة عناوين IPv6

- الملف: `programming-basics/27-routing-and-ipv6.md`
- أقسامه: Routing ← IPv6 ← اختيار الطريق وقراءة IPv6 ← الجهاز محتاج أكتر من IP علشان يتصل
- فحص البنية: Short lesson: review explanation and examples

### تقسيم الشبكة ومنع دوران الإطارات

- الملف: `programming-basics/28-lan-segmentation.md`
- أقسامه: تقسيم الشبكة ومنع الدوران
- فحص البنية: Short lesson: review explanation and examples

### تحميل البرامج وترتيب مهام المتصفح

- الملف: `programming-basics/29-browser-scheduling.md`
- أقسامه: JavaScript والتحميل ← دورة حدث مبسطة ← ليه التحميل الثاني ممكن يختلف؟
- فحص البنية: Short lesson: review explanation and examples

### استقبل إشعار خادم وتعامل مع تكراره

- الملف: `programming-basics/30-webhook-delivery.md`
- أقسامه: أرسل حدثًا مرتين ← Webhooks ← الوصول مرة لا يعني المعالجة مرة
- فحص البنية: Short lesson: review explanation and examples

### توزيع الحمل وسياسات الوسيط

- الملف: `programming-basics/31-proxy-policies.md`
- أقسامه: اربط الاسم بقرار فعلي ← Load Balancer ← API Gateway ← العناوين الحقيقية والثقة ← الفشل والمراقبة ← اختار طريقة توزيع وفكّر في إعادة المحاولة
- فحص البنية: يتطلب مراجعة بشرية لموضوع الدرس

### جهّز معمل الطلب والرد على جهازك

- الملف: `programming-basics/32-local-network-lab.md`
- أقسامه: التجهيز والتشغيل ← ابدأ برد واحد ← خريطة التجارب
- فحص البنية: Short lesson: review explanation and examples

### سياسات تحميل الموارد وعزل النوافذ

- الملف: `programming-basics/33-browser-isolation.md`
- أقسامه: لا توجد عناوين فرعية
- فحص البنية: Short lesson: review explanation and examples

### ابدأ هنا: أساسيات الكمبيوتر والبرمجة

- الملف: `programming-basics/computer-fundamentals/01-learning-roadmap.md`
- أقسامه: جهّز مكان التطبيق ← الطريق الذي هتمشيه ← طريقة مذاكرة تقدر تقيسها ← متى تعتبر البداية اكتملت؟
- فحص البنية: Short lesson: review explanation and examples؛ Legacy computer-use material; review retirement separately

### النوافذ والماوس والكتابة

- الملف: `programming-basics/computer-fundamentals/01-using-your-computer.md`
- أقسامه: مؤشرين ليهم وظيفتين ← افهم ما تراه على الشاشة ← افتح محرر النصوص ← عدّل من غير إعادة كتابة كل شيء ← تجربة وحل
- فحص البنية: Short lesson: review explanation and examples؛ Legacy computer-use material; review retirement separately

### إزاي الكمبيوتر يمثل الأرقام والنصوص؟

- الملف: `programming-basics/computer-fundamentals/02-binary-data-representation.md`
- أقسامه: ليه صفر وواحد؟ ← نفهم الخانة من الأعداد اللي نعرفها ← إزاي 5 تتكتب 101؟ ← طريقة ثانية: القسمة على 2 ← اقرأ الثنائي وارجع للعشري ← البايت يسع كام قيمة؟ ← العدد 5 مختلف عن النص «5» ← حرف عربي وخانتان سداسيتان ← جرّب وحلّ ← الخطوة التالية
- فحص البنية: Legacy computer-use material; review retirement separately

### كيف يحوّل الكمبيوتر المدخلات إلى نتيجة؟

- الملف: `programming-basics/computer-fundamentals/02-computers-data-processing.md`
- أقسامه: حاول قبل قراءة المثال ← بيانات وتعليمات ← تتبع ما فعلته في المفكرة ← تجربة كاملة
- فحص البنية: Short lesson: review explanation and examples؛ Legacy computer-use material; review retirement separately

### الملفات والمجلدات والحفظ

- الملف: `programming-basics/computer-fundamentals/02-files-and-folders.md`
- أقسامه: تجربتان منفصلتان بعد الحفظ ← الملف له اسم ومكان ومحتوى ← احفظ ثم أثبت أن الحفظ نجح ← أظهر الامتدادات ← تنزيل وضغط ونسخة احتياطية
- فحص البنية: Short lesson: review explanation and examples؛ Legacy computer-use material; review retirement separately

### من فكرة إلى خطوات ثم برنامج

- الملف: `programming-basics/computer-fundamentals/03-binary-languages-algorithms.md`
- أقسامه: اكتب خطواتك قبل الحل ← ما لغة البرمجة؟ ← الخوارزمية وصف للحل ← اختبر الخطوات على ورقة ← حل المسألة قبل اختيار الأدوات
- فحص البنية: Short lesson: review explanation and examples؛ Legacy computer-use material; review retirement separately

### مكونات الجهاز التي تستخدمها

- الملف: `programming-basics/computer-fundamentals/03-hardware-architecture.md`
- أقسامه: تتبّع فتح ملف واحد ← ماذا يدخل وماذا يخرج؟ ← وصل جهازًا وافهم وظيفة الوصلة ← شخّص من السلوك
- فحص البنية: Short lesson: review explanation and examples؛ Legacy computer-use material; review retirement separately

### البرامج والتثبيت والاستخدام الآمن

- الملف: `programming-basics/computer-fundamentals/03-programs-installation-safety.md`
- أقسامه: اختَر الصلاحية المناسبة للمهمة ← نفس الملف يمكن فتحه بطريقتين ← ثلاث خطوات مختلفة ← قرارات أمان بسيطة ← جرّب وحلل
- فحص البنية: Short lesson: review explanation and examples؛ Legacy computer-use material; review retirement separately

### المعالج وتنفيذ التعليمات

- الملف: `programming-basics/computer-fundamentals/04-cpu-gpu.md`
- أقسامه: اعتماد خطوة على أخرى أم أعمال مستقلة؟ ← من أمر إلى تنفيذ ← أين يدخل GPU؟ ← تجربة ملاحظة
- فحص البنية: Short lesson: review explanation and examples؛ Legacy computer-use material; review retirement separately

### راجع مشروعك واختار الخطوة التالية

- الملف: `programming-basics/computer-fundamentals/04-tech-fields-ai-engineering-mindset.md`
- أقسامه: اختبر جاهزيتك بمشروعك ← اثبت إن الأجزاء شغالة مع بعض ← مهمة واحدة تجمع ما تعلمته ← قائمة جاهزية عملية ← اختر مسارًا واحدًا ← متى تتوسع؟
- فحص البنية: Short lesson: review explanation and examples؛ Legacy computer-use material; review retirement separately

### جهّز مجلد أول برنامج ومحرره

- الملف: `programming-basics/computer-fundamentals/05-os-terminal-files-git.md`
- أقسامه: محرر وأداة تشغيل ← أنشئ مساحة العمل ← دورة التعديل والتشغيل ← ما الطرفية باختصار؟
- فحص البنية: Short lesson: review explanation and examples؛ Legacy computer-use material; review retirement separately

### الذاكرة والحفظ: أين ذهب شغلك؟

- الملف: `programming-basics/computer-fundamentals/05-ram-memory-buffers.md`
- أقسامه: مكتب ودفتر محفوظ ← وحدات الحجم ← تجربة آمنة
- فحص البنية: Short lesson: review explanation and examples؛ Legacy computer-use material; review retirement separately

### نظام التشغيل والبرامج والملفات

- الملف: `programming-basics/computer-fundamentals/06-operating-systems.md`
- أقسامه: رسالتان لهما حلان مختلفان ← من ينظم استخدام الجهاز؟ ← المستخدم والصلاحية ← فتح تطبيقين وحفظ ملف
- فحص البنية: Short lesson: review explanation and examples؛ Legacy computer-use material; review retirement separately

### الإنترنت والمتصفح والعنوان

- الملف: `programming-basics/computer-fundamentals/07-internet-browser-basics.md`
- أقسامه: رحلة قصيرة تكفي للبداية ← أربع كلمات تستخدمها يوميًا ← اكتب عنوانًا معلومًا ← ملف محلي وموقع على الإنترنت
- فحص البنية: Short lesson: review explanation and examples؛ Legacy computer-use material; review retirement separately

### اكتب أول برنامج واحفظه وشغّله

- الملف: `programming-basics/computer-fundamentals/08-first-program.md`
- أقسامه: السطر اللي هتغيّره ← افهم الحاوية قبل الكتابة ← برنامج كامل ← غيّر شيئًا وتوقعه ← عندما لا ترى المتوقع
- فحص البنية: Short lesson: review explanation and examples؛ Legacy computer-use material; review retirement separately

### اقرأ رسالة الخطأ واختبر نتيجتك

- الملف: `programming-basics/computer-fundamentals/09-git-debugging.md`
- أقسامه: الخطأ معلومة نستخدمها ← جرّب قراءة رسالة خطأ واحدة ← الاختبار سؤال له نتيجة متوقعة ← لماذا يوجد Git؟
- فحص البنية: Short lesson: review explanation and examples؛ Legacy computer-use material; review retirement separately

### القيم والمتغيرات والحساب

- الملف: `programming-basics/computer-fundamentals/09-values-and-calculations.md`
- أقسامه: اعرف مكان رسالة الخطأ ← لماذا نسمي القيمة؟ ← احسب ثمن الكراسات ← عدد أم نص؟ ← تدريب بالنتائج
- فحص البنية: Short lesson: review explanation and examples؛ Legacy computer-use material; review retirement separately

### قرار بسيط وتكرار خطوات

- الملف: `programming-basics/computer-fundamentals/10-decisions-and-repetition.md`
- أقسامه: قرار واحد من غير تكرار ← اختر الفرع المناسب ← كرر عملية بدل نسخها
- فحص البنية: Short lesson: review explanation and examples؛ Legacy computer-use material; review retirement separately

### الدوال ثم القوائم: نظّم الحساب والبيانات

- الملف: `programming-basics/computer-fundamentals/11-functions-and-lists.md`
- أقسامه: ابدأ بدالة ورقم واحد ← قائمة بدل أسماء كثيرة ← دالة لحساب واحد واضح ← شغّل المثال كاملًا ← عقد المثال وحدوده ← غيّر قيمة وتوقع الناتج ← راجع فهمك ← جرّب الدالة مع مدخلات فعلية
- فحص البنية: Legacy computer-use material; review retirement separately

### استقبل بيانات من المستخدم وتأكد منها

- الملف: `programming-basics/computer-fundamentals/12-input-validation.md`
- أقسامه: جرّب خانة واحدة الأول ← من ضغطة الزر للحساب ← جرّب مثالًا كاملًا ← افهم الخانات والربط ← ليه الفحص بالترتيب ده؟ ← اختبر القيم اللي ممكن تلخبط البرنامج ← راجع فهمك
- فحص البنية: Legacy computer-use material; review retirement separately

### نظّف النص وابحث فيه وقسّمه

- الملف: `programming-basics/computer-fundamentals/13-text-processing.md`
- أقسامه: اسم واحد قبل قائمة الكلمات ← كل عملية لها وظيفة واحدة ← مثال كامل ← تتبّع الكلمات واحدة واحدة ← المقارنة لها سياسة ← جرّب الحدود وحل تمرينًا
- فحص البنية: Legacy computer-use material; review retirement separately

### اقرأ بيانات وتعامل مع فشل العملية

- الملف: `programming-basics/computer-fundamentals/14-runtime-errors.md`
- أقسامه: شوف فشل واحد قبل قواعد القائمة ← وصف القائمة كنص ← إمتى العملية تفشل؟ ← نجاح القراءة لا يكفي ← مثال كامل ← تجربة فشل ثم إصلاح ← الفشل مش كله استثناءات
- فحص البنية: Legacy computer-use material; review retirement separately

### احفظ قائمة وافتحها من جديد

- الملف: `programming-basics/computer-fundamentals/15-saving-data.md`
- أقسامه: شغّل نسختك على جهازك ← مكانان مختلفان للبيانات ← شغّل في مكان ثابت ← البرنامج الكامل ← فك المسار خطوة بخطوة ← تجربة تثبت إن الحفظ حصل ← لما حاجة تفشل ← جرّب ملف بيانات مستقل
- فحص البنية: Legacy computer-use material; review retirement separately

### ابنِ قائمة مشتريات واختبرها

- الملف: `programming-basics/computer-fundamentals/16-shopping-project.md`
- أقسامه: ابنِه في أربع خطوات قابلة للتشغيل ← شغّل نسختك على جهازك ← اتفق على السلوك قبل كتابة الكود ← قسّم المسؤوليات ← الجزء الجديد: عرض عناصر منفصلة ← شغّل المشروع ← ابنه على مراحل ← اختبارات قبول للمشروع ← تعديل صغير بحل مشروح ← لو احتجت تعدّل الكمية وحدها
- فحص البنية: Legacy computer-use material; review retirement separately

### شغّل ملفاتك بعنوان محلي ثابت

- الملف: `programming-basics/computer-fundamentals/17-local-server.md`
- أقسامه: جهّز الأداة مرة واحدة ← قدّم مجلد التدريب للمتصفح ← افصل أخطاء التجهيز
- فحص البنية: Short lesson: review explanation and examples؛ Legacy computer-use material; review retirement separately

### الصورة والصوت ووحدات الحجم

- الملف: `programming-basics/computer-fundamentals/18-media-and-units.md`
- أقسامه: والصورة والصوت؟ ← عينات الصوت ← وحدات الحجم والسرعة ← افصل الحسابات
- فحص البنية: Short lesson: review explanation and examples؛ Legacy computer-use material; review retirement separately

### استخدام الكمبيوتر

- الملف: `programming-basics/computer-fundamentals/index.md`
- أقسامه: امشِ بالترتيب وطبّق كل خطوة
- فحص البنية: Legacy computer-use material; review retirement separately

### خريطة التعلّم وقواعد الدراسة

- الملف: `programming-basics/computer-in-depth/01-learning-roadmap.md`
- أقسامه: ثلاث نتائج هتقدر تفسرها ← الفكرة العامة ← المفاهيم الأساسية ← مثال تطبيقي ← تصحيح مفاهيم وأخطاء شائعة ← خريطة الدرس ← جرّب خطة على مسألة محددة ← تأكد من فهمك
- فحص البنية: يتطلب مراجعة بشرية لموضوع الدرس

### الكمبيوتر والبيانات ودورة المعالجة

- الملف: `programming-basics/computer-in-depth/02-computers-data-processing.md`
- أقسامه: افتح صورة وتتبعها ← الكمبيوتر نظام لا قطعة واحدة ← دورة Input–Process–Output–Storage ← مثال: فتح صورة وتعديلها ← أين تذهب البيانات؟ ← تشخيص العطل من مسار البيانات ← قِس السؤال المناسب ← تأكد من فهمك
- فحص البنية: يتطلب مراجعة بشرية لموضوع الدرس

### تمثيل الأعداد والحروف في الذاكرة

- الملف: `programming-basics/computer-in-depth/03-binary-languages-algorithms.md`
- أقسامه: الفكرة العامة ← المفاهيم الأساسية ← مثال تطبيقي ← تصحيح مفاهيم وأخطاء شائعة ← من الثنائي إلى السداسي عشري ← Unicode وUTF-8 عمليًا ← Signed وUnsigned وTwo's Complement ← Floating Point ولماذا `0.1 + 0.2` ليست دقيقة دائمًا ← Endianness ← اختبر التمثيل بأرقام فعلية ← تأكد من فهمك ← الخطوة التالية
- فحص البنية: يتطلب مراجعة بشرية لموضوع الدرس

### مكوّنات الهاردوير واللوحة الأم

- الملف: `programming-basics/computer-in-depth/03-hardware-architecture.md`
- أقسامه: كل وصلة لها وظيفة ← الهاردوير كنظام مترابط ← اللوحة الأم وChipset ← Buses وPCIe وUSB ← التخزين: HDD وSSD وNVMe ← أجهزة الإدخال والإخراج ← PSU والتبريد ← رحلة البيانات ← إقلاع الجهاز وتشخيص البطء ← تأكد من فهمك
- فحص البنية: يتطلب مراجعة بشرية لموضوع الدرس

### كيف ينفّذ المعالج التعليمات؟

- الملف: `programming-basics/computer-in-depth/04-cpu-gpu.md`
- أقسامه: تعليمتان ثم مكان البيانات ← داخل CPU ← Cores وThreads وClock وIPC ← Registers وL1/L2/L3 Cache ← فك أسماء التنفيذ وجرّب القياس ← تأكد من فهمك ← الخطوة التالية
- فحص البنية: يتطلب مراجعة بشرية لموضوع الدرس

### مجالات التقنية والذكاء الاصطناعي والعقلية الهندسية

- الملف: `programming-basics/computer-in-depth/04-tech-fields-ai-engineering-mindset.md`
- أقسامه: اختَر تجربة صغيرة بمخرج واضح ← الفكرة العامة ← المفاهيم الأساسية ← مثال تطبيقي ← تصحيح مفاهيم وأخطاء شائعة ← خريطة الدرس ← المجال من مشكلة ملموسة ← تأكد من فهمك
- فحص البنية: يتطلب مراجعة بشرية لموضوع الدرس

### اقرأ ملفاتك واكتبها بالطرفية

- الملف: `programming-basics/computer-in-depth/05-os-terminal-files-git.md`
- أقسامه: الطرفية غير مفسّر الأوامر ← مكانك ومسار الملف ← مساحة تدريب وأوامر تقرأ نتيجتها ← قبل تجربة أمر واسع ← تأكد من فهمك ← الخطوة التالية
- فحص البنية: يتطلب مراجعة بشرية لموضوع الدرس

### العناوين والذاكرة الافتراضية

- الملف: `programming-basics/computer-in-depth/05-ram-memory-buffers.md`
- أقسامه: عنوانان لنفس البيانات ← ما RAM؟ ← Physical وVirtual Memory ← تتبع عنوانًا بدل تخيل شرائح منفصلة ← تأكد من فهمك ← الخطوة التالية
- فحص البنية: يتطلب مراجعة بشرية لموضوع الدرس

### نظام التشغيل: البنية والأنواع وطريقة العمل

- الملف: `programming-basics/computer-in-depth/06-operating-systems.md`
- أقسامه: شوف الفرق بين برنامج موجود وبرنامج شغال ← النواة والنظام والتوزيعة ← إزاي التطبيق يطلب خدمة محمية؟ ← برنامج واحد، وعملية، وخيوط تنفيذ ← الذاكرة: العنوان مش مكانًا ثابتًا في الشريحة ← الملف والجهاز والإشعار ← المستخدم والصلاحيات ← أنواع الاستخدام ← امشِ وراء تشغيل سكربت وقراءة ملف ← لما السكربت يفشل، تحدد الطبقة إزاي؟ ← تواصل العمليات والانتظار المتبادل ← تأكد من فهمك
- فحص البنية: يتطلب مراجعة بشرية لموضوع الدرس

### احفظ تاريخ ملفاتك وادمج التغييرات

- الملف: `programming-basics/computer-in-depth/09-git-debugging.md`
- أقسامه: أول تاريخ محلي تقدر تراجعه ← Branch وMerge ← التعارض: Git محتاج قرارك ← Remote وPull Request ← تأكد من فهمك ← الخطوة التالية ← جرّب فرعين وتعارضًا في مجلد التدريب ← راجع التاريخ بعد تجربة الدمج
- فحص البنية: يتطلب مراجعة بشرية لموضوع الدرس

### حجز الذاكرة وعمر البيانات

- الملف: `programming-basics/computer-in-depth/12-memory-allocation.md`
- أقسامه: قيمة قصيرة العمر وبيانات نحتفظ بها ← Stack وHeap ← Allocation وLeak وFragmentation وOOM
- فحص البنية: Short lesson: review explanation and examples

### نقل البيانات ومتى يصبح الحفظ ثابتًا

- الملف: `programming-basics/computer-in-depth/13-buffers-and-durability.md`
- أقسامه: صندوق انتظار أم نسخة سريعة؟ ← Buffer وCache وQueue وStream وPool ← أنواع الـBuffers ← Flush وDurability ← DMA وZero-copy
- فحص البنية: يتطلب مراجعة بشرية لموضوع الدرس

### من خطوات الحل إلى برنامج يعمل

- الملف: `programming-basics/computer-in-depth/14-running-code.md`
- أقسامه: من الخوارزمية إلى البرنامج ← Compiler وInterpreter وRuntime وJIT ← Library وDependency ونسخة التشغيل
- فحص البنية: Short lesson: review explanation and examples

### إمتى يفيد تشغيل أعمال كثيرة معًا؟

- الملف: `programming-basics/computer-in-depth/15-parallel-work.md`
- أقسامه: كيف يختلف GPU؟ ← Integrated وDiscrete GPU ← اختيار المعالج المناسب
- فحص البنية: Short lesson: review explanation and examples

### اختبر السلوك وحدّد سبب الخطأ

- الملف: `programming-basics/computer-in-depth/16-testing-and-debugging.md`
- أقسامه: اكتشاف سبب الخطأ ← أنواع الاختبارات
- فحص البنية: Short lesson: review explanation and examples

### قنوات الأوامر والصلاحيات والبيئة

- الملف: `programming-basics/computer-in-depth/17-terminal-environment.md`
- أقسامه: البيانات والاسم والصلاحيات ← متغيرات البيئة: اسم وقيمة ← ثلاث قنوات ورقم انتهاء ← جرّب القنوات بعد تعريفها
- فحص البنية: يتطلب مراجعة بشرية لموضوع الدرس

### الكمبيوتر ونظام التشغيل للمبرمج

- الملف: `programming-basics/computer-in-depth/index.md`
- أقسامه: امشِ بالترتيب ده ← اربط اللي بتشوفه بالسبب
- فحص البنية: يتطلب مراجعة بشرية لموضوع الدرس

### السوفتوير: من الكود لبرنامج شغال

- الملف: `programming-basics/computer-in-depth/software-and-runtime.md`
- أقسامه: الهاردوير موجود، مين بيحدد له يعمل إيه؟ ← الكود والبرنامج والعملية: ثلاث حاجات مختلفة ← ليه المعالج مش بيقرأ PHP مباشرة؟ ← شغّل أصغر برنامج وتابع أثره ← المكتبة والـFramework والامتداد ← المثبت على الجهاز مش بالضرورة شغال ← أخطاء هتقابلك وإزاي تفرّق بينها ← جرّب بنفسك ← مراجع للمراجعة
- فحص البنية: يتطلب مراجعة بشرية لموضوع الدرس

### أساسيات المبرمج: الكمبيوتر والبرامج والشبكات

- الملف: `programming-basics/index.md`
- أقسامه: 1. الكمبيوتر ونظام التشغيل من عين المبرمج ← 2. الشبكات والويب ← 3. التفكير والحساب اللي تحتاجه في الكود ← تذاكر إزاي؟
- فحص البنية: يتطلب مراجعة بشرية لموضوع الدرس

### النسب والمتوسط والقوى

- الملف: `programming-basics/math-problem-solving/01-arithmetic-foundations.md`
- أقسامه: حساب واحد بمعنى واضح ← الفكرة العامة ← المفاهيم الأساسية ← مثال تطبيقي ← تصحيح مفاهيم وأخطاء شائعة ← خريطة الدرس ← تأكد من فهمك ← الخطوة التالية
- فحص البنية: يتطلب مراجعة بشرية لموضوع الدرس

### المتغيرات والمعادلات والمنطق البولياني

- الملف: `programming-basics/math-problem-solving/02-variables-equations-logic.md`
- أقسامه: جملة منطقية نجربها ← الفكرة العامة ← المفاهيم الأساسية ← مثال تطبيقي ← تصحيح مفاهيم وأخطاء شائعة ← خريطة الدرس ← Truth Tables وImplication ← تأكد من فهمك ← الخطوة التالية
- فحص البنية: يتطلب مراجعة بشرية لموضوع الدرس

### القياس والوحدات والأعداد الأولية

- الملف: `programming-basics/math-problem-solving/03-applied-math-graphs-primes.md`
- أقسامه: الفكرة العامة ← المفاهيم الأساسية ← مثال تطبيقي ← تصحيح مفاهيم وأخطاء شائعة ← خريطة الدرس ← تأكد من فهمك ← الخطوة التالية
- فحص البنية: يتطلب مراجعة بشرية لموضوع الدرس

### التفكير الحاسوبي وتحليل المتطلبات

- الملف: `programming-basics/math-problem-solving/04-computational-thinking.md`
- أقسامه: مطلب واحد يتحول لاختبارات ← الفكرة العامة ← المفاهيم الأساسية ← مثال تطبيقي ← تصحيح مفاهيم وأخطاء شائعة ← حوّل طلبًا صغيرًا لحاجة تقدر تختبرها ← تأكد من فهمك
- فحص البنية: يتطلب مراجعة بشرية لموضوع الدرس

### الخوارزميات وPseudocode وأشجار القرار

- الملف: `programming-basics/math-problem-solving/05-algorithms-pseudocode-decision-trees.md`
- أقسامه: الفكرة العامة ← المفاهيم الأساسية ← مثال تطبيقي ← تصحيح مفاهيم وأخطاء شائعة ← اكتب الخوارزمية وتتبعها ← نفس مثال الأكبر على شكل شجرة ← تأكد من فهمك ← الجشع والبرمجة الديناميكية: اختار بالدليل ← لما القرار يعتمد على حالة سابقة
- فحص البنية: يتطلب مراجعة بشرية لموضوع الدرس

### المخططات الانسيابية والحلقات والتصحيح

- الملف: `programming-basics/math-problem-solving/06-flowcharts-loops-debugging.md`
- أقسامه: الفكرة العامة ← المفاهيم الأساسية ← مثال تطبيقي ← تصحيح مفاهيم وأخطاء شائعة ← امشِ مع الحلقة دورة بدورة ← تأكد من فهمك
- فحص البنية: يتطلب مراجعة بشرية لموضوع الدرس

### القسمة والباقي ودقة الحساب

- الملف: `programming-basics/math-problem-solving/07-division-and-precision.md`
- أقسامه: احسب المثال قبل المصطلح ← القسمة الصحيحة وFloor وCeil ← GCD وLCM وخوارزمية إقليدس ← Modular Arithmetic ← الدقة والخطأ العددي ← احسب بدل حفظ اسم العملية
- فحص البنية: Short lesson: review explanation and examples

### المجموعات والعلاقات ومدخلات الدالة

- الملف: `programming-basics/math-problem-solving/08-sets-relations.md`
- أقسامه: المجموعات والعلاقات والدوال ← Predicates وQuantifiers ← جدول حقيقة وعلاقات بمثال
- فحص البنية: Short lesson: review explanation and examples

### حوّل أنماط الحل إلى خطوات

- الملف: `programming-basics/math-problem-solving/09-solution-patterns.md`
- أقسامه: أنماط الحل ← من اسم النمط إلى خطواته
- فحص البنية: Short lesson: review explanation and examples

### اختَر بين الحل الجشع وحفظ النتائج

- الملف: `programming-basics/math-problem-solving/10-greedy-dynamic-programming.md`
- أقسامه: الجشع والبرمجة الديناميكية: اختار بالدليل
- فحص البنية: Short lesson: review explanation and examples

### المتتابعات والعد والاحتمال

- الملف: `programming-basics/math-problem-solving/11-counting-probability.md`
- أقسامه: المتتابعات والعلاقات التكرارية ← مبدأ العد والتباديل والتوافيق ← أساسيات الاحتمالات ← أمثلة للمتتابعات والعد والعشوائية ← مجموعات وعدّ واحتمال بحساب فعلي
- فحص البنية: Short lesson: review explanation and examples

### ارسم العلاقات وابحث عن طريق

- الملف: `programming-basics/math-problem-solving/12-graphs-and-search.md`
- أقسامه: Graphs وTrees ← تتبع Graph بالطابور
- فحص البنية: Short lesson: review explanation and examples

### ليه الحلقة صحيحة وبتنتهي؟

- الملف: `programming-basics/math-problem-solving/13-loop-reasoning.md`
- أقسامه: ابدأ بالجدول ثم برّر
- فحص البنية: Short lesson: review explanation and examples

### الرياضيات وحل المشكلات

- الملف: `programming-basics/math-problem-solving/index.md`
- أقسامه: قارن واتعمّق ← امشِ بالترتيب وطبّق كل خطوة
- فحص البنية: يتطلب مراجعة بشرية لموضوع الدرس

### الشبكات والويب

- الملف: `programming-basics/networking-next.md`
- أقسامه: الاتصال ونقل البيانات ← الويب والاتصال الآمن ← تطبيقات الويب والخوادم
- فحص البنية: يتطلب مراجعة بشرية لموضوع الدرس

### أساسيات البرمجة وتطبيقاتها

- الملف: `programming-basics/programming-practice.md`
- أقسامه: امشِ بالترتيب وطبّق كل خطوة
- فحص البنية: يتطلب مراجعة بشرية لموضوع الدرس

### UDP: رسائل مستقلة من غير اتصال TCP

- الملف: `programming-basics/udp.md`
- أقسامه: الرسالة هنا لها حدود ← إيه اللي UDP مش بيعمله تلقائيًا؟ ← مثال تتبّع بدل حفظ التعريف ← ليه حجم الرسالة مهم؟ ← إمتى تختاره؟ ← أخطاء تخلي الاختيار مضللًا ← جرّب تصميمك على الورق ← مراجع
- فحص البنية: يتطلب مراجعة بشرية لموضوع الدرس

## cpp — 20 صفحات عربية

### الدوال والحاويات والمراجع

- الملف: `cpp/advanced/01-functions-containers-references.md`
- أقسامه: لماذا نحتاج الدوال؟ ← القيمة والمرجع وconst ← النطاق والعمر ← array وvector وstring ← تقسيم الملفات ← مثال مترابط ← تأكد من فهمك ← برنامج كامل واختبار الحدود
- فحص البنية: يتطلب مراجعة بشرية لموضوع الدرس

### الكائنات وSTL وRAII والاختبارات

- الملف: `cpp/advanced/02-objects-stl-raii-testing.md`
- أقسامه: من المتغيرات إلى نوع يمثل المجال ← RAII وإدارة الموارد ← خوارزميات STL ← الأخطاء والاستثناءات ← الاختبارات والتصحيح ← مشروع ختامي ← تأكد من فهمك ← برنامج كامل واختبار الحدود
- فحص البنية: Candidate for topic split

### 12. المدخلات وقواعد العمل

- الملف: `cpp/conditions-projects/01-input-business-rules.md`
- أقسامه: قبل ما تبدأ ← كلمات جديدة في الدرس ← من نص المتطلبات إلى شروط ← صلاحية البيانات وقرار العمل ← مثال: أهلية الطالب ← أخطاء شائعة وتصحيحات ← خريطة الدرس ← استخراج المتطلبات ← Truth table وDecision table ← تصميم الحالات ← ترتيب التحقق ورسائل الرفض ← القواعد المشتقة وعدم تكرار المنطق ← برنامج كامل: صلاحية البيانات ثم قرار الأهلية ← تأكد من فهمك ← اربط النقاط ببعض ← جرّب بنفسك
- فحص البنية: Review glossary relevance in context

### 4. الـCompiler ومراحل البناء والتشخيص

- الملف: `cpp/conditions-projects/02-compilation-pipeline-diagnostics.md`
- أقسامه: قبل ما تبدأ ← كلمات جديدة في الدرس ← لماذا يحتاج كود C++ إلى ترجمة؟ ← Compiler وInterpreter وJIT ← أشهر Toolchains ← البرنامج الذي سيتحرك عبر المراحل ← 1. Preprocessing ← Translation Unit ← 2. Lexical analysis وTokens ← 3. Parsing وAST ← 4. Semantic analysis ← 5. Intermediate Representation ← 6. Optimization ← 7. Code generation والـAssembly ← 8. Object File ← 9. Separate Compilation ← 10. Linking ← أخطاء Linker الشائعة ← 11. Loading والتشغيل ← أنواع المشكلات ← طريقة تشخيص عملية ← خريطة الدرس ← تأكد من فهمك ← اربط النقاط ببعض ← جرّب بنفسك
- فحص البنية: Review glossary relevance in context

### 9. if وelse والتحقق والتداخل

- الملف: `cpp/conditions-projects/06-if-else-validation-nesting.md`
- أقسامه: قبل ما تبدأ ← كلمات جديدة في الدرس ← كيف تختار if مسار التنفيذ؟ ← if وelse وelse if ← مثال: تصنيف الدرجة بعد التحقق ← أخطاء شائعة وتصحيحات ← من قاعدة العمل إلى شرط ← ترتيب القرارات والتحقق المبكر ← Short Circuit وأولوية المنطق ← Boolean context والأقواس ← عدة if أم سلسلة واحدة؟ ← الشروط المتداخلة ← Strings والمدخلات المركبة ← Guard Clauses وتقليل التداخل ← الشروط الحصرية والشروط المستقلة ← De Morgan وتبسيط النفي ← برنامج كامل: التحقق ثم التصنيف ← مسائل تطبّق على الشروط والصيغ ← خريطة المسائل والحلول ← 959A Mahmoud and Ehab ← 486A Calculating Function ← 4A Watermelon ← 835A Key Races ← 1173A Nauuo and Votes ← 318A Even Odds ← 459A Pashmak and Garden ← 617A Elephant ← 581A Vasya the Hipster ← 281A Word Capitalization ← 1A Theatre Square ← تأكد من فهمك ← اربط النقاط ببعض ← جرّب بنفسك
- فحص البنية: Review glossary relevance in context

### 10. switch وتدفق التحكم والحاسبة

- الملف: `cpp/conditions-projects/07-switch-control-flow.md`
- أقسامه: قبل ما تبدأ ← كلمات جديدة في الدرس ← الاختيار بقيمة منفصلة ← selector وcase وbreak وdefault ← مثال: قائمة أوامر ← أخطاء شائعة وتصحيحات ← ما الذي يقبله switch؟ ← حاسبة آمنة ← Grouped cases وFall-through ← Scope داخل case ← enum بدل الأرقام السحرية ← switch أم if أم جدول بيانات؟ ← كيف تنفّذ switch القرار خطوة بخطوة؟ ← الأنواع المسموح بها للـSelector ← شروط case: قيمة ثابتة وفريدة ← تتبع Fall-through بدل تخمينه ← default ليست شرطًا إلزاميًا لكنها شبكة أمان ← مثال كامل: حاسبة مع التحقق من الإدخال ← تأكد من فهمك ← اربط النقاط ببعض ← جرّب بنفسك
- فحص البنية: Review glossary relevance in context

### 2. الشروط والتحقق والمشروعات

- الملف: `cpp/conditions-projects/index.md`
- أقسامه: لا توجد عناوين فرعية
- فحص البنية: يتطلب مراجعة بشرية لموضوع الدرس

### 1. حل المشكلات والمخططات والتصحيح

- الملف: `cpp/foundations/01-problem-solving-review.md`
- أقسامه: قبل ما تبدأ ← كلمات جديدة في الدرس ← تحليل المشكلة قبل كتابة الكود ← Pseudocode وFlowchart وجدول التتبّع ← مثال: القسمة مع فحص المقام ← أخطاء شائعة وتصحيحات ← أشجار القرار وقواعد العمل ← Flowchart وPseudocode ← Test cases قبل الكود ← تتبع الخطأ المنطقي ← تعريف المشكلة والمدخلات والمخرجات والقيود ← الخوارزمية وصحة الخطوات ← رموز الـFlowchart ← حالات الاختبار المتكافئة والحدود ← طبّق طريقة حل المشكلة على منصات التدريب ← ما البرمجة التنافسية؟ ← قراءة المسألة والقيود والتعقيد ← مثال: مسألة Elephant والقسمة السقفية ← برنامج كامل قابل للتشغيل ← أخطاء شائعة وتصحيحات ← المنصات وخطة التدريب ← أنماط المسائل المستخدمة في التدريب ← خريطة الدرس ← دورة عمل الـOnline Judge ← تصنيف النتائج ← تأكد من فهمك ← اربط النقاط ببعض ← جرّب بنفسك
- فحص البنية: Review glossary relevance in context

### 2. أنظمة الأعداد والكمبيوتر والذاكرة

- الملف: `cpp/foundations/02-number-systems-computer-internals.md`
- أقسامه: قبل ما تبدأ ← كلمات جديدة في الدرس ← العدد وقاعدة تمثيله ← العشري والثنائي والثماني والسداسي عشر ← مثال: كتابة القيمة نفسها بثلاث قواعد ← أخطاء شائعة وتصحيحات ← خريطة الدرس ← الأساس والقيمة الموضعية ← Hexadecimal والـNibble ← CPU وRAM والتخزين ← بقية المكوّنات ← نظام التشغيل وفتح البرنامج ← التحويل بين القواعد خطوة بخطوة ← البت والبايت والكلمة ← الأعداد السالبة وTwo's Complement ← هرم الذاكرة ← CPU والتعليمات والعملية ← تأكد من فهمك ← اربط النقاط ببعض ← جرّب بنفسك
- فحص البنية: Review glossary relevance in context

### 3. مقدمة C++ والأدوات وأول برنامج

- الملف: `cpp/foundations/03-setup-syntax-translation-output.md`
- أقسامه: قبل ما تبدأ ← كلمات جديدة في الدرس ← ما لغة C++؟ ← المحرر والـCompiler والـIDE ← أول برنامج C++ ← أخطاء شائعة وتصحيحات ← الأدوات والمعيار ← مراحل البناء بالتفصيل ← تشخيص الأخطاء ← لماذا C++؟ ← IDE والمحرر والـToolchain ← Tokens وExpressions وStatements ← تشريح أول برنامج ← النصوص وEscape sequences ← Namespaces والمكتبة القياسية ← ملفات المصدر وHeader Files ← أوامر البناء والتحذيرات ← main وقيمة الخروج ووسائط التشغيل ← Standard Output وStandard Error والـBuffer ← تأكد من فهمك ← اربط النقاط ببعض ← جرّب بنفسك
- فحص البنية: Review glossary relevance in context

### 5. الأنواع والمتغيرات والنطاق والذاكرة

- الملف: `cpp/foundations/04-types-variables-scope-encoding.md`
- أقسامه: قبل ما تبدأ ← كلمات جديدة في الدرس ← النوع والمتغير ← اختيار النوع والتهيئة ← أمثلة على التصريح والتهيئة ← أخطاء شائعة وتصحيحات ← خريطة الدرس ← فئات الأنواع ← Signed وUnsigned والمدى ← Floating point ← التصريح والتهيئة والإسناد ← الثوابت والذاكرة ← Scope وLifetime وShadowing ← Integer types والمدى ← Literals وSuffixes وauto ← التخزين والعمر والنطاق ← القيمة غير المهيأة وUndefined Behavior ← برنامج كامل: اختيار النوع والتحقق من المدى ← تأكد من فهمك ← اربط النقاط ببعض ← جرّب بنفسك
- فحص البنية: Review glossary relevance in context

### 7. المعاملات والتعبيرات والعمليات البتية

- الملف: `cpp/foundations/05-operators-conversions-limits.md`
- أقسامه: قبل ما تبدأ ← كلمات جديدة في الدرس ← التعبير والعامل والنتيجة ← الحساب والمقارنة والمنطق ← مثال: متوسط لا يفقد الجزء الكسري ← أخطاء شائعة وتصحيحات ← الإدخال والإخراج ← عائلات المعاملات ← التحويلات ← مكتبة الرياضيات والصيغ ← التعبير والقيمة والآثار الجانبية ← الأولوية والترابط ← Prefix وPostfix ← العمليات البتية ← Ternary ← خريطة الدرس ← الإسناد المركب والزيادة والنقصان ← Short Circuit كأداة أمان ← Overflow وUnderflow ← أقنعة البتات ← برنامج كامل: العمليات والتحويل والقسمة الآمنة ← تأكد من فهمك ← اربط النقاط ببعض ← جرّب بنفسك
- فحص البنية: Review glossary relevance in context

### 8. الإدخال والتحويلات والحدود والرياضيات

- الملف: `cpp/foundations/06-input-source-build-errors-math.md`
- أقسامه: قبل ما تبدأ ← كلمات جديدة في الدرس ← قراءة البيانات وكتابة النتائج ← cin وgetline وحالة الـStream ← مثال: قراءة رقم وسطر بأمان ← أخطاء شائعة وتصحيحات ← خريطة الدرس ← حالة الـStream ← التحويل وحدود النوع ← cmath والتقريب ← ترجمة الصيغة إلى كود ← Source structure ← إصلاح Stream بعد إدخال غير صالح ← تنسيق الإخراج ← مجال الدوال الرياضية ← Compile Error وLink Error وRuntime Error وLogic Error ← تأكد من فهمك ← اربط النقاط ببعض ← جرّب بنفسك
- فحص البنية: Review glossary relevance in context

### 1. تأسيس C++ والكمبيوتر

- الملف: `cpp/foundations/index.md`
- أقسامه: لا توجد عناوين فرعية
- فحص البنية: يتطلب مراجعة بشرية لموضوع الدرس

### C++

- الملف: `cpp/index.md`
- أقسامه: خريطة الدروس
- فحص البنية: يتطلب مراجعة بشرية لموضوع الدرس

### 6. ترميز النصوص والمحارف والتحويلات

- الملف: `cpp/loops-competitive/01-encoding-casts-math.md`
- أقسامه: قبل ما تبدأ ← كلمات جديدة في الدرس ← المحرف والنص والترميز ← ASCII وUnicode وUTF-8 وUTF-16 ← مثال: توسيع القيمة والتحقق قبل الجذر ← أخطاء شائعة وتصحيحات ← خريطة الدرس ← من المحرف إلى البايتات ← Character literals والقيم العددية ← أنواع التحويل ← Parsing ليس Casting ← Code Point وCode Unit والرمز المرئي ← بنية UTF-8 والتعامل الآمن ← Integer Promotions والتحويلات الحسابية ← static_cast وdynamic_cast وconst_cast وreinterpret_cast ← تأكد من فهمك ← اربط النقاط ببعض ← جرّب بنفسك
- فحص البنية: Review glossary relevance in context

### مرجع محفوظ: التدريب على حل المسائل

- الملف: `cpp/loops-competitive/02-competitive-programming.md`
- أقسامه: قبل ما تبدأ ← كلمات جديدة في الدرس ← ما البرمجة التنافسية؟ ← قراءة المسألة والقيود والتعقيد ← مثال: مسألة Elephant والقسمة السقفية ← برنامج كامل قابل للتشغيل ← أخطاء شائعة وتصحيحات ← المنصات وخطة التدريب ← أنماط المسائل المستخدمة في التدريب ← خريطة الدرس ← دورة عمل الـOnline Judge ← تصنيف النتائج ← تأكد من فهمك ← اربط النقاط ببعض ← جرّب بنفسك
- فحص البنية: Review glossary relevance in context

### مرجع محفوظ: مسائل الشروط والصيغ

- الملف: `cpp/loops-competitive/03-conditions-codeforces.md`
- أقسامه: قبل ما تبدأ ← كلمات جديدة في الدرس ← تحويل نص المسألة إلى حالات ومعادلات ← الحدود والحالات والحل الرياضي ← مثال: اشتقاق Even Odds ← أخطاء شائعة وتصحيحات ← خريطة الدرس ← خريطة المسائل والحلول ← 959A Mahmoud and Ehab ← 486A Calculating Function ← 4A Watermelon ← 835A Key Races ← 1173A Nauuo and Votes ← 318A Even Odds ← 459A Pashmak and Garden ← 617A Elephant ← 581A Vasya the Hipster ← 281A Word Capitalization ← 1A Theatre Square ← استخراج الصيغة من القيود ← اختبار الانتقال بين الحالات ← تأكد من فهمك ← اربط النقاط ببعض ← جرّب بنفسك
- فحص البنية: Review glossary relevance in context

### 11. الحلقات وأنماط التكرار

- الملف: `cpp/loops-competitive/04-loops-counters-accumulators.md`
- أقسامه: قبل ما تبدأ ← كلمات جديدة في الدرس ← مكوّنات الحلقة ← for وwhile وdo-while ← مثال: جمع الأعداد الزوجية ← أخطاء شائعة وتصحيحات ← تتبع الحلقة يدويًا ← أنماط التكرار ← while وfor وdo-while ← Infinite loops ← Sentinel والتحقق ← break وcontinue ← Nested loops ← Invariant الحلقة ← البحث والحد الأدنى والأقصى ← معالجة أرقام العدد ← التعقيد الفعلي للحلقات المتداخلة ← نموذج الحلقة: البداية والشرط والجسم والتحديث ← while بالتتبّع اليدوي ← العد التصاعدي والتنازلي والخطوات المختلفة ← تحديثات الضرب والقسمة ← الفاصلة المنقوطة بعد while ← Sentinel: إدخال لا نعرف طوله ← do-while عندما يجب تنفيذ الجسم مرة ← قائمة تعمل مرة واحدة على الأقل ← for وترتيب التنفيذ الحقيقي ← Counter وAccumulator والـAverage ← Product Accumulator ← تصنيف القيم أثناء قراءتها ← أكبر قيمة دون افتراض أن الصفر أكبر ← البحث باستخدام Flag أو التوقف المبكر ← break وcontinue بالتتبّع ← Nested Loops: صفوف وأعمدة ← قائمة تفاعلية تتعافى من فشل الإدخال ← تأكد من فهمك ← اربط النقاط ببعض ← جرّب بنفسك ← اختبر عقد إدخال القائمة
- فحص البنية: Review glossary relevance in context

### 3. الترميز والحلقات

- الملف: `cpp/loops-competitive/index.md`
- أقسامه: لا توجد عناوين فرعية
- فحص البنية: يتطلب مراجعة بشرية لموضوع الدرس

## php — 19 صفحات عربية

### تجهيز المختبرات وتشغيل الأمثلة

- الملف: `php/00-lab-setup.md`
- أقسامه: التجهيز ← اختار الاختبار المناسب ← HTTP حقيقي على جهازك ← اقرأ الملفات بالترتيب ← حدود الدليل العملي
- فحص البنية: Short lesson: review explanation and examples

### 1. مقدمة وصياغة PHP

- الملف: `php/01-introduction-and-syntax.md`
- أقسامه: قبل ما تبدأ ← كلمات جديدة في الدرس ← هنفهم إيه في الدرس ده؟ ← يعني إيه PHP؟ ← الطلب بيمشي إزاي؟ ← PHP بتستخدم في إيه؟ ← جهّز البيئة واتأكد إن PHP شغالة ← أول برنامج من سطر الأوامر ← تشغيل PHP في المتصفح ← تعليمات PHP والـBlocks ← دمج PHP مع HTML ← الـHeaders لازم تخرج قبل الـBody ← التعليقات وحساسية الحروف ← مثال كامل صغير ← أخطاء شائعة في أول يوم ← خريطة رحلة أول برنامج ← تأكد من فهمك ← ملخص الدرس ← شغّل وتحقق ← اربط النقاط ببعض ← جرّب بنفسك
- فحص البنية: Review glossary relevance in context

### 2. المتغيرات والنطاق وSuperglobals

- الملف: `php/02-variables-scope-superglobals.md`
- أقسامه: قبل ما تبدأ ← كلمات جديدة في الدرس ← ليه بنحتاج متغيرات؟ ← قواعد تسمية المتغير ← المتغير بيأخذ نوعه من القيمة ← طباعة المتغير داخل النص ← الإسناد بالقيمة ← الإسناد بالمرجع ← الكائنات لها سلوك مختلف ← المتغيرات المتغيرة ← يعني إيه Scope؟ ← `global` و`$GLOBALS` ← المتغير `static` داخل الدالة ← نطاق الملفات المضمّنة ← Superglobals: بيانات متاحة في كل النطاقات ← الوجود، والتحقق، والتحويل، والإخراج ← ليه `eval()` خطيرة؟ ← برنامج كامل: ترحيب من الرابط ← خريطة حركة القيمة ← تأكد من فهمك ← ملخص الدرس ← شغّل وتحقق ← اربط النقاط ببعض ← جرّب بنفسك
- فحص البنية: Review glossary relevance in context؛ Candidate for topic split

### 3. أنواع البيانات ونظام الأنواع

- الملف: `php/03-types.md`
- أقسامه: قبل ما تبدأ ← كلمات جديدة في الدرس ← يعني إيه Data Type؟ ← خريطة بسيطة قبل التفاصيل ← `bool`: صح أو غلط ← `null`: مفيش قيمة ← المقارنة العادية والصارمة ← `int`: الأعداد الصحيحة ← `float`: الأعداد العشرية ← `string`: النصوص والبايتات ← Heredoc وNowdoc ← النص الرقمي مش رقمًا مضمونًا ← `array`: قائمة وMap في نفس النوع ← `object` وClass ← `enum`: حالات محدودة بالاسم ← `resource`: مقبض لمورد خارجي ← تصريحات الأنواع في الدوال ← Nullable وUnion Types ← `mixed` و`void` و`never` ← `callable` وClosure ← `iterable` وGenerator ← Intersection وDNF Types — للقراءة الآن ← برنامج كامل: حساب إجمالي طلب ← أخطاء شائعة ← تأكد من فهمك ← ملخص الدرس ← شغّل وتحقق ← اربط النقاط ببعض ← جرّب بنفسك
- فحص البنية: Review glossary relevance in context

### 4. الإخراج والتصحيح والثوابت

- الملف: `php/04-output-debugging-constants.md`
- أقسامه: قبل ما تبدأ ← كلمات جديدة في الدرس ← قبل ما نبدأ ← `echo`: أبسط طريقة للإخراج ← `print`: قريب من `echo` مع فرق صغير ← إخراج Terminal غير إخراج Web ← ليه `echo` مش أداة Debug كاملة؟ ← `var_dump()` و`print_r()` و`get_debug_type()` ← Debugging بخطوات بدل الطباعة العشوائية ← `dump()` و`dd()` والـLogger ← يعني إيه ثابت؟ ← `const` و`define()` ← Class Constants ← Magic Constants ← Predefined Constants ← برنامج صغير قابل للتجربة ← أخطاء شائعة ← تأكد من فهمك ← ملخص الدرس ← شغّل وتحقق ← اربط النقاط ببعض ← جرّب بنفسك
- فحص البنية: Review glossary relevance in context

### 5. الشروط والحلقات

- الملف: `php/05-control-flow.md`
- أقسامه: المشكلة: قرار واحد ثم تكراره ← if وelseif وelse: أول فرع صحيح ← اختصارات اختيار قيمة ← switch وmatch ← for: البداية ثم الاختبار ثم الجسم ثم الخطوة ← while وdo-while: إمتى تفحص؟ ← foreach وcontinue وbreak ← توقع، شخّص، كمّل ← خطوة للمشروع
- فحص البنية: يتطلب مراجعة بشرية لموضوع الدرس

### 6. التعبيرات والمؤثرات

- الملف: `php/06-expressions-operators.md`
- أقسامه: المشكلة: الحساب صحيح شكليًا والنتيجة غلط ← الأولوية مش ترتيب تنفيذ مضمون ← خريطة العمليات ← النوع جزء من المقارنة ← نفس الرمز مع Array أو Object ← رموز ما تستخدمهاش لإخفاء مشكلة ← Pipe من PHP 8.5 فقط ← توقع، شخّص، كمّل
- فحص البنية: يتطلب مراجعة بشرية لموضوع الدرس

### 7. الدوال والـ Callbacks وتضمين الملفات

- الملف: `php/07-functions-and-includes.md`
- أقسامه: المشكلة: نفس الحساب مكتوب في خمس أماكن ← Call Stack: فين بيروح التنفيذ ويرجع إزاي؟ ← القيمة والمرجع وvariadic ← Callback: ابعت طريقة الشغل، مش ناتجها ← مشروع ملفين: require ينفذ الملف ← توقع، شخّص، كمّل
- فحص البنية: يتطلب مراجعة بشرية لموضوع الدرس

### 8. الملفات والـ Streams وJSON وCSV

- الملف: `php/08-files-streams-data.md`
- أقسامه: المشكلة: البيانات بتختفي لما البرنامج يقفل ← أول تجربة كاملة بدون ملفات على جهازك ← اختار وضع الفتح قبل ما تكتب ← JSON: شكل تخزين، مش تحقق من المعنى ← CSV: الفاصلة ممكن تكون جوه الحقل ← Wrapper وContext وFilter من غير خلط ← الحفظ والصلاحيات ← توقع، شخّص، كمّل
- فحص البنية: يتطلب مراجعة بشرية لموضوع الدرس

### 9. رفع الملفات والكوكيز والجلسات

- الملف: `php/09-uploads-cookies-sessions.md`
- أقسامه: المشكلة: كل Request بتبدأ من جديد ← دورة الجلسة خطوة خطوة ← برنامج كامل: النموذج يتذكر اسمك ← Cookie flags وحدودها ← Session Fixation: المهاجم يعرف التذكرة قبل الدخول ← إنهاء الجلسة غير مسح متغير ← رفع صورة: من نموذج لملف خاص ← توقع، شخّص، كمّل
- فحص البنية: يتطلب مراجعة بشرية لموضوع الدرس

### 10. Namespaces وComposer وأدوات الجودة

- الملف: `php/10-namespaces-autoloading.md`
- أقسامه: مشكلتان مختلفتان: اسم متكرر وملف مش متحمّل ← المشروع كاملًا ← 1. composer.json: وصف المشروع ← 2. الصنف: src/Billing/PriceCalculator.php ← 3. نقطة التشغيل: bin/demo.php ← 4. اختبار السلوك: tests/PriceCalculatorTest.php ← composer.lock: نفس النسخ عند زميلك ← scripts والتحليل والتنسيق ← تشخيص Class not found ← إعداد التطوير والإنتاج ← توقع، شخّص، كمّل
- فحص البنية: يتطلب مراجعة بشرية لموضوع الدرس

### 11. الأخطاء والاستثناءات

- الملف: `php/11-errors-exceptions.md`
- أقسامه: المشكلة: الفشل مش نتيجة عادية ← برنامج كامل بثلاث حالات ← finally للتنظيف، مش لتغيير النتيجة ← Warning مش هتدخل catch تلقائيًا ← التطوير والإنتاج: نفس الخطأ وعرض مختلف ← حد تطبيق كامل يعيد JSON ← توقع، شخّص، كمّل
- فحص البنية: يتطلب مراجعة بشرية لموضوع الدرس

### 12. المصفوفات وأدوات التحويل

- الملف: `php/12-arrays-functional-tools.md`
- أقسامه: المشكلة: عندك مجموعة بيانات، محتاج تختار وتحول وتجمع ← برنامج كامل: إجمالي الطلبات المدفوعة ← حلقة مكافئة، ومتى تكون أوضح؟ ← المفاتيح لها أنواع وقواعد ← الفرز يغيّر المصفوفة نفسها ← توقع، شخّص، كمّل
- فحص البنية: يتطلب مراجعة بشرية لموضوع الدرس

### 13. النصوص وUnicode وRegular Expressions

- الملف: `php/13-strings-unicode-regex.md`
- أقسامه: المشكلة: الاسم ثلاث حروف، لكن strlen تقول ستة ← برنامج يقارن الوحدات الثلاث ← شكلان لنفس الحرف: Normalization ← Regex: وصف شكل صغير، مش Parser لكل شيء ← العرض والترميز حسب المكان ← توقع، شخّص، كمّل
- فحص البنية: يتطلب مراجعة بشرية لموضوع الدرس

### 14. التاريخ والوقت والمناطق الزمنية

- الملف: `php/14-datetime-timezones.md`
- أقسامه: المشكلة: «الساعة 9» مش موعد كامل ← لحظة واحدة، عرضان ← Parsing صارم: المحرك ممكن يصلح تاريخًا أنت عايز ترفضه ← يوم تقويمي غير 24 ساعة دائمًا ← اختبار «الآن» بدون الانتظار ← توقع، شخّص، كمّل
- فحص البنية: يتطلب مراجعة بشرية لموضوع الدرس

### 15. من HTTP Request إلى Router وResponse

- الملف: `php/15-request-router-response.md`
- أقسامه: المشكلة: العنوان مش لازم يكون اسم ملف ← ملف كامل يوضح الحدود ← تتبع البرنامج من أسفل لأعلى ثم مع طلب واحد ← JSON صحيحة مش معناها طلب صحيح ← جرّب العقد من الطرفية ← توقع، شخّص، كمّل
- فحص البنية: يتطلب مراجعة بشرية لموضوع الدرس

### 16. خريطة ميزات PHP الحديثة 8.0–8.5

- الملف: `php/16-modern-php-features.md`
- أقسامه: المشكلة: المثال صحيح، لكن السيرفر مش بيفهمه ← خريطة زمنية لإصدارات صادرة ← Generator: عنصر عند الطلب، مش Array كاملة ← WeakMap من 8.0: معلومات تتبع عمر كائن ← Fiber من 8.1: وقف واستئناف سلسلة استدعاءات ← DNF Types وReadonly Classes من 8.2 ← Attributes: بيانات وصفية تحتاج مَن يقرأها ← 8.4: Hooks وAsymmetric Visibility وLazy Objects ← 8.5: برنامج صغير بميزات صدرت بالفعل ← توقع، شخّص، كمّل
- فحص البنية: يتطلب مراجعة بشرية لموضوع الدرس

### 17. مشروع دفتر الملاحظات وDebugging عملي

- الملف: `php/17-integrated-programs-debugging.md`
- أقسامه: المشكلة: الأجزاء تعمل وحدها، لكن هل الطلب الكامل يعمل؟ ← مراحل البناء التي وصلنا لها ← 1. إعداد واضح بدل افتراض البيئة ← 2. التحقق والتخزين والعرض: src/notebook.php ← اقرأ الدوال واحدة واحدة ← 3. القالب: views/notebook.php ← 4. نقطة الدخول والـMiddleware والـRouter ← رحلة الحفظ سطرًا بسطر على مستوى القرار ← التشغيل ودليل النجاح ← Debugging: دليل قبل التعديل ← الاختبارات والأدوات على مشروع فعلي ← امتداد التدريب: البرامج الكاملة السابقة ما زالت متاحة ← توقع، شخّص، كمّل
- فحص البنية: يتطلب مراجعة بشرية لموضوع الدرس

### PHP

- الملف: `php/index.md`
- أقسامه: خريطة الدروس ← أول برنامج ← مشروع يتطور معك
- فحص البنية: يتطلب مراجعة بشرية لموضوع الدرس

## php-runtime — 21 صفحات عربية

### 1. Composer وإدارة الاعتماديات

- الملف: `php-runtime/01-composer-dependencies.md`
- أقسامه: قبل ما تبدأ ← كلمات جديدة في الدرس ← الملفان الأساسيان ← install أم update؟ ← Autoloading وPSR-4 ← تثبيت إنتاجي آمن ← سير عمل موصى به ← مسألة تشغيلية ← شغّل وتحقق ← اربط النقاط ببعض ← جرّب بنفسك
- فحص البنية: Review glossary relevance in context

### 2. cURL وعملاء HTTP

- الملف: `php-runtime/02-curl-http-clients.md`
- أقسامه: قبل ما تبدأ ← كلمات جديدة في الدرس ← دورة الطلب في PHP ← إرسال JSON ← TLS وRedirects ← Guzzle وPSR ← المهلات وإعادة المحاولة ← cURL Multi ← مسألة تشغيلية ← شغّل وتحقق ← اربط النقاط ببعض ← جرّب بنفسك
- فحص البنية: Review glossary relevance in context

### 3. OPcache وPreloading

- الملف: `php-runtime/03-opcache-preloading.md`
- أقسامه: قبل ما تبدأ ← كلمات جديدة في الدرس ← إعداد إنتاجي مبدئي ← المراقبة ← Preloading ← النشر الصحيح ← مسألة تشغيلية ← شغّل وتحقق ← اربط النقاط ببعض ← جرّب بنفسك
- فحص البنية: Review glossary relevance in context

### 4. ذاكرة PHP وGarbage Collection

- الملف: `php-runtime/04-memory-garbage-collection.md`
- أقسامه: قبل ما تبدأ ← كلمات جديدة في الدرس ← Reference Counting ← Copy-on-write ← References بعلامة & ← لماذا نحتاج Garbage Collector؟ ← الذاكرة في PHP-FPM ← القياس ← تقليل الاستهلاك ← مسألة تشغيلية ← شغّل وتحقق ← اربط النقاط ببعض ← جرّب بنفسك
- فحص البنية: Review glossary relevance in context

### 5. PHP-FPM وإدارة العمليات

- الملف: `php-runtime/05-php-fpm-processes.md`
- أقسامه: قبل ما تبدأ ← كلمات جديدة في الدرس ← Master وWorkers ← أوضاع Process Manager ← static ← dynamic ← ondemand ← حساب pm.max_children ← إعدادات تشغيل مفيدة ← queue وLittle's Law ← Graceful reload وfastcgi_finish_request ← مسألة تشغيلية ← شغّل وتحقق ← اربط النقاط ببعض ← جرّب بنفسك
- فحص البنية: Review glossary relevance in context

### 6. Apache وNginx وFastCGI

- الملف: `php-runtime/06-web-servers-fastcgi.md`
- أقسامه: قبل ما تبدأ ← كلمات جديدة في الدرس ← تصحيح مقارنة Apache وNginx ← Apache ← Nginx مع PHP-FPM ← Unix socket أم TCP؟ ← معاملات FastCGI ← حدود ومسؤوليات ← مسألة تشغيلية ← شغّل وتحقق ← اربط النقاط ببعض ← جرّب بنفسك
- فحص البنية: Review glossary relevance in context

### 7. متغيرات البيئة وإدارة الإعدادات

- الملف: `php-runtime/07-environment-configuration.md`
- أقسامه: قبل ما تبدأ ← كلمات جديدة في الدرس ← getenv و$_ENV وputenv ← تحميل .env في التطوير ← طبقة Config واحدة ← PHP-FPM والبيئة ← قواعد الأسرار ← ترتيب الأولوية ← مسألة تشغيلية ← شغّل وتحقق ← اربط النقاط ببعض ← جرّب بنفسك
- فحص البنية: Review glossary relevance in context

### 8. PHP CLI وphp.ini والامتدادات

- الملف: `php-runtime/08-cli-ini-extensions.md`
- أقسامه: قبل ما تبدأ ← كلمات جديدة في الدرس ← SAPI تحدد بيئة التشغيل ← ترتيب الإعداد ← Extensions ← Development مقابل Production ← CLI scripts ← دورة حياة PHP والترقية ← الأعطال المبكرة وExtension ABI ← مسألة تشغيلية ← شغّل وتحقق ← اربط النقاط ببعض ← جرّب بنفسك
- فحص البنية: Review glossary relevance in context

### 9. Logging وObservability

- الملف: `php-runtime/09-logging-observability.md`
- أقسامه: قبل ما تبدأ ← كلمات جديدة في الدرس ← ثلاثة أنواع من الإشارة ← PSR-3 وStructured Logging ← Correlation ← ما لا نسجله ← Metrics مفيدة ← تنبيه عملي ← أخطاء المحرك والتطبيق ← مرجع ← مسألة تشغيلية ← شغّل وتحقق ← اربط النقاط ببعض ← جرّب بنفسك
- فحص البنية: Review glossary relevance in context

### 10. الاختبارات وجودة الكود

- الملف: `php-runtime/10-testing-quality.md`
- أقسامه: قبل ما تبدأ ← كلمات جديدة في الدرس ← هرم عملي ← PHPUnit ← Test Doubles ← Coverage ← Static analysis وStyle ← Test data ← Contract وIntegration tests ← Mutation وFlaky tests ← مرجع ← مسألة تشغيلية ← شغّل وتحقق ← اربط النقاط ببعض ← جرّب بنفسك
- فحص البنية: Review glossary relevance in context

### 11. Data Caching وRedis

- الملف: `php-runtime/11-data-caching-redis.md`
- أقسامه: قبل ما تبدأ ← كلمات جديدة في الدرس ← أي Cache؟ ← Cache-aside ← المفاتيح وTTL ← Cache stampede ← الفشل ← Invalidation ← مسألة تشغيلية ← شغّل وتحقق ← تجربة Redis حقيقية ← اربط النقاط ببعض ← جرّب بنفسك ← إعادة ملء الـcache ممكن تتسابق مع الحذف
- فحص البنية: Review glossary relevance in context

### 12. Queues وWorkers وScheduling

- الملف: `php-runtime/12-queues-workers-scheduling.md`
- أقسامه: قبل ما تبدأ ← كلمات جديدة في الدرس ← لماذا Queue؟ ← Delivery وIdempotency ← Retry ← Worker lifecycle ← Cron وScheduler ← مسألة تشغيلية ← شغّل وتحقق ← Worker حقيقي على Redis ← اربط النقاط ببعض ← جرّب بنفسك ← ليه إثبات التنفيذ داخل المعاملة؟
- فحص البنية: Review glossary relevance in context

### 13. Deployment وCI/CD وContainers

- الملف: `php-runtime/13-deployment-cicd-containers.md`
- أقسامه: قبل ما تبدأ ← كلمات جديدة في الدرس ← Artifact قابلة للتكرار ← Pipeline ← Pipeline قابلة للمراجعة ← Container ← حدود النظام واختبار الحمل ← Health ← Zero-downtime وMigrations ← Rollback ← مسألة تشغيلية ← شغّل وتحقق ← اربط النقاط ببعض ← جرّب بنفسك
- فحص البنية: Review glossary relevance in context

### 14. أمان الاعتماديات وSupply Chain

- الملف: `php-runtime/14-dependency-supply-chain-security.md`
- أقسامه: قبل ما تبدأ ← كلمات جديدة في الدرس ← composer.lock عقد البناء ← Audit وسياسة الحزم ← Plugins وScripts ← Version policy ← CI ← SBOM وProvenance والتوقيع ← CI والـSecrets ← استجابة لثغرة ← مراجع ← مسألة تشغيلية ← شغّل وتحقق ← اربط النقاط ببعض ← جرّب بنفسك
- فحص البنية: Review glossary relevance in context

### 15. Profiling وSLI/SLO وOpenTelemetry

- الملف: `php-runtime/15-profiling-slo-opentelemetry.md`
- أقسامه: قبل ما تبدأ ← كلمات جديدة في الدرس ← القياس قبل التحسين ← Sampling Profiler وInstrumentation ← قراءة Flame Graph ← SLI وSLO وError Budget ← OpenTelemetry وTrace Context ← تحليل طلب بطيء ← SDK وOTLP عمليًا ← تأكد من فهمك ← شغّل وتحقق ← اربط النقاط ببعض ← جرّب بنفسك
- فحص البنية: Review glossary relevance in context؛ Candidate for topic split

### 16. المرونة وإدارة Workers

- الملف: `php-runtime/16-resilience-workers.md`
- أقسامه: قبل ما تبدأ ← كلمات جديدة في الدرس ← المهلة أول دفاع ← Circuit Breaker ← Bulkhead وBackpressure ← Worker lifecycle والإشارات ← Supervisor وsystemd ← وحدة systemd مكتملة ← تأكد من فهمك ← شغّل وتحقق ← اربط النقاط ببعض ← جرّب بنفسك
- فحص البنية: Review glossary relevance in context

### 17. Disaster Recovery واختبار الاستعادة

- الملف: `php-runtime/17-disaster-recovery.md`
- أقسامه: قبل ما تبدأ ← كلمات جديدة في الدرس ← Backup ليست خطة تعافٍ ← RPO وRTO ← سياسة النسخ ← ترتيب الاستعادة ← تمرين Restore فعلي ← تطبيق PHP أثناء التعافي ← تأكد من فهمك ← شغّل وتحقق ← اربط النقاط ببعض ← جرّب بنفسك
- فحص البنية: Review glossary relevance in context

### 18. Sessions وShared State عند التوسع

- الملف: `php-runtime/18-sessions-shared-state.md`
- أقسامه: قبل ما تبدأ ← كلمات جديدة ← لماذا تفشل file sessions مع أكثر من نسخة؟ ← القفل والطلبات المتوازية ← إعداد آمن ← النشر والتوافق ← تجربة المختبر ← تأكد من فهمك ← جرّب بنفسك
- فحص البنية: Short lesson: review explanation and examples

### 19. اتصالات قاعدة البيانات وتشغيلها

- الملف: `php-runtime/19-database-runtime-operations.md`
- أقسامه: قبل ما تبدأ ← كلمات جديدة ← احسب الاتصالات قبل زيادة العمال ← PDO والمهلات ← الاتصالات المستديمة ← القراءة من Replica ← Migrations والنشر ← تجربة PostgreSQL ← تأكد من فهمك ← جرّب بنفسك
- فحص البنية: يتطلب مراجعة بشرية لموضوع الدرس

### 20. PHP طويلة العمر وWorker Runtimes

- الملف: `php-runtime/20-long-running-php.md`
- أقسامه: قبل ما تبدأ ← كلمات جديدة ← ما الذي يبقى؟ ← الذاكرة والموارد ← الإشارات والنشر ← اختيار النموذج ← تمرين state leakage محلي ← تأكد من فهمك ← جرّب بنفسك
- فحص البنية: Short lesson: review explanation and examples

### تشغيل PHP وأدوات الإنتاج

- الملف: `php-runtime/index.md`
- أقسامه: لماذا هو قسم مستقل؟ ← خريطة الدروس ← بروتوكول التجربة في كل درس ← مسار طلب إنتاجي مختصر ← مراجع رسمية
- فحص البنية: يتطلب مراجعة بشرية لموضوع الدرس

## database — 7 صفحات عربية

### أساسيات SQL قبل PDO وORM

- الملف: `database/00-sql-foundations.md`
- أقسامه: من البيانات إلى جدولين ← اكتب السؤال قبل SQL ← الفلترة والتعديل ← الفهرس مش قاعدة صحة ← جرّب وفسر
- فحص البنية: يتطلب مراجعة بشرية لموضوع الدرس

### 1. PDO والاتصال الآمن

- الملف: `database/01-pdo-prepared-statements.md`
- أقسامه: لماذا PDO؟ ← الاتصال ← Prepared Statements ← ما لا يمكن ربطه؟ ← bindValue أم execute array؟ ← Fetching والذاكرة ← معالجة الخطأ ← مسائل مرتبطة بالدرس ← شغّل وتحقق
- فحص البنية: Editorial fragments need integration

### 2. ORM وأنماط الوصول للبيانات

- الملف: `database/02-orm-patterns.md`
- أقسامه: ما ORM؟ ← Active Record ← Data Mapper ← العلاقات ← N+1 Queries ← Mass Assignment وSerialization ← متى نستخدم SQL مباشرًا؟ ← مسائل مرتبطة بالدرس ← شغّل وتحقق
- فحص البنية: Editorial fragments need integration؛ Short lesson: review explanation and examples

### 3. Transactions وACID

- الملف: `database/03-transactions-acid.md`
- أقسامه: لماذا Transaction؟ ← ACID ← PDO transaction ← حدود المعاملة ← DDL وImplicit Commit ← أخطاء شائعة ← مسائل مرتبطة بالدرس ← شغّل وتحقق
- فحص البنية: Editorial fragments need integration

### 4. Isolation والأقفال وDeadlocks

- الملف: `database/04-isolation-locking.md`
- أقسامه: لماذا التزامن صعب؟ ← مستويات العزل ← Pessimistic locking ← Optimistic locking ← Deadlock ← Savepoints والمعاملات المتداخلة ← لا تجعل isolation دواءً سحريًا ← مسائل مرتبطة بالدرس ← شغّل وتحقق
- فحص البنية: Editorial fragments need integration؛ Short lesson: review explanation and examples

### 5. تصميم المخطط والفهارس وMigrations

- الملف: `database/05-schema-indexes-migrations.md`
- أقسامه: اجعل قاعدة البيانات تحمي قواعدها ← الفهرس ← EXPLAIN والقياس ← Pagination ← Migrations ← Seed وبيانات الاختبار ← Checklist ← مسائل مرتبطة بالدرس ← مشروع تراكمي: مخزون لا يسمح بالبيع الزائد ← السيناريو المتزامن ← بيانات تحقق ثابتة ← قياس الفهرس والهجرة ← شروط القبول
- فحص البنية: Editorial fragments need integration؛ Candidate for topic split

### قواعد البيانات وPDO

- الملف: `database/index.md`
- أقسامه: لا توجد عناوين فرعية
- فحص البنية: يتطلب مراجعة بشرية لموضوع الدرس

## auth — 23 صفحات عربية

### 1. حماية الجلسات

- الملف: `auth/01-session-security.md`
- أقسامه: قبل ما تبدأ ← كلمات جديدة في الدرس ← كيف تعمل الجلسة؟ ← إعداد البداية ← تسجيل الدخول وتغيير الصلاحية ← انتهاء خمول وعمر كلي ← Fingerprinting بحذر ← إغلاق القفل والخروج ← سيناريو أمني ← تدريب تهديد ← مرجع التحقق ← اربط النقاط ببعض ← جرّب بنفسك
- فحص البنية: Editorial fragments need integration؛ Review glossary relevance in context

### 2. التحقق من المدخلات والفلترة

- الملف: `auth/02-input-validation.md`
- أقسامه: قبل ما تبدأ ← كلمات جديدة في الدرس ← Validation ليست Sanitization ← filter_var ← filter_input وfilter_input_array ← قواعد المجال أهم من شكل النوع ← سيناريو أمني ← تدريب تهديد ← مرجع التحقق ← اربط النقاط ببعض ← جرّب بنفسك
- فحص البنية: Editorial fragments need integration؛ Review glossary relevance in context؛ Short lesson: review explanation and examples

### 3. الحماية من CSRF

- الملف: `auth/03-csrf.md`
- أقسامه: قبل ما تبدأ ← كلمات جديدة في الدرس ← ما الهجوم؟ ← Synchronizer Token Pattern ← دفاع متعدد الطبقات ← Double-submit Cookie ← Token lifecycle ← سيناريو أمني ← تدريب تهديد ← مرجع التحقق ← اربط النقاط ببعض ← جرّب بنفسك ← سياسة المصدر
- فحص البنية: Editorial fragments need integration؛ Review glossary relevance in context

### 4. الحماية من XSS

- الملف: `auth/04-xss.md`
- أقسامه: قبل ما تبدأ ← كلمات جديدة في الدرس ← ما XSS؟ ← HTML text وattributes ← URL context ← JavaScript وJSON ← عندما تريد السماح بـHTML ← طبقات إضافية ← سيناريو أمني ← تدريب تهديد ← مرجع التحقق ← اربط النقاط ببعض ← جرّب بنفسك
- فحص البنية: Editorial fragments need integration؛ Review glossary relevance in context

### 5. كلمات المرور وHashing

- الملف: `auth/05-password-hashing.md`
- أقسامه: قبل ما تبدأ ← كلمات جديدة في الدرس ← Hashing ليس Encryption ← التحقق وإعادة الـhash ← سياسة صحيحة ← Pepper اختياري ← تغيير واسترجاع كلمة المرور ← سيناريو أمني ← تدريب تهديد ← مرجع التحقق ← اربط النقاط ببعض ← جرّب بنفسك ← افهم الناتج والفشل
- فحص البنية: Editorial fragments need integration؛ Review glossary relevance in context

### 6. Encryption وHTTP Authentication

- الملف: `auth/06-encryption-http-auth.md`
- أقسامه: قبل ما تبدأ ← كلمات جديدة في الدرس ← متى نستخدم Encryption؟ ← مثال Sodium ← إدارة المفاتيح ← HTTP Basic ← Bearer Tokens ← سيناريو أمني ← تدريب تهديد ← مرجع التحقق ← اربط النقاط ببعض ← جرّب بنفسك ← اربط النص المشفّر بسياقه باستخدام AEAD
- فحص البنية: Editorial fragments need integration؛ Review glossary relevance in context؛ Candidate for topic split

### 7. المصادقة والصلاحيات عمليًا

- الملف: `auth/07-authentication-authorization.md`
- أقسامه: قبل ما تبدأ ← كلمات جديدة في الدرس ← ثلاثة أسئلة مختلفة ← Login flow ← RBAC ← Ownership وPolicies ← Middleware لا يلغي الفحص داخل المجال ← حالات HTTP ← Defense in depth ← سيناريو أمني ← تدريب تهديد ← مرجع التحقق ← اربط النقاط ببعض ← جرّب بنفسك
- فحص البنية: Editorial fragments need integration؛ Review glossary relevance in context؛ Short lesson: review explanation and examples

### 8. JWT والتحقق الآمن

- الملف: `auth/08-jwt-security.md`
- أقسامه: قبل ما تبدأ ← كلمات جديدة في الدرس ← Claims قياسية مهمة ← التوقيع المتناظر وغير المتناظر ← مثال PHP بمكتبة ← Key ID وJWKS ← قائمة تحقق ← سيناريو أمني ← تدريب تهديد ← مرجع التحقق ← اربط النقاط ببعض ← جرّب بنفسك ← وجود الـClaims نفسه جزء من العقد
- فحص البنية: Review glossary relevance in context

### 9. Federated Identity وSSO وSAML وOIDC

- الملف: `auth/09-federation-saml-oidc.md`
- أقسامه: قبل ما تبدأ ← كلمات جديدة في الدرس ← OAuth وOIDC وSAML ← SAML Web Browser SSO ← OpenID Connect ← تحقق ID token ← متى أختار ماذا؟ ← سيناريو أمني ← تدريب تهديد ← مرجع التحقق ← اربط النقاط ببعض ← جرّب بنفسك
- فحص البنية: Review glossary relevance in context؛ Candidate for topic split

### 10. مفاهيم OAuth 2.0 والتوكينات

- الملف: `auth/10-oauth-concepts-tokens.md`
- أقسامه: قبل ما تبدأ ← كلمات جديدة في الدرس ← الأدوار الأربعة ← Client registration ← Public وConfidential ← Scope وConsent ← Access token ← Refresh token ← API key ليست OAuth token ← Token endpoint response ← أخطاء مفاهيمية ← سيناريو أمني ← تدريب تهديد ← مرجع التحقق ← اربط النقاط ببعض ← جرّب بنفسك
- فحص البنية: Review glossary relevance in context

### 11. OAuth Flows الحديثة

- الملف: `auth/11-oauth-flows-pkce-device.md`
- أقسامه: قبل ما تبدأ ← كلمات جديدة في الدرس ← Authorization Code + PKCE ← إنشاء PKCE ← Client Credentials ← Device Authorization ← Refresh Token Grant ← Assertion Grants ← تدفقات لا تبدأ بها مشروعًا جديدًا ← سيناريو أمني ← تدريب تهديد ← مرجع التحقق ← اربط النقاط ببعض ← جرّب بنفسك
- فحص البنية: Review glossary relevance in context

### 12. أمان OAuth وOIDC

- الملف: `auth/12-oauth-oidc-security.md`
- أقسامه: قبل ما تبدأ ← كلمات جديدة في الدرس ← Callback آمن ← Redirect URIs ← مكان التوكينات في تطبيق Browser ← Backend for Frontend ← Browser-only client ← Bearer مقابل Sender-constrained ← Access وRefresh lifecycle ← OIDC login checklist ← المراقبة دون تسريب ← سيناريو أمني ← تدريب تهديد ← مرجع التحقق ← اربط النقاط ببعض ← جرّب بنفسك
- فحص البنية: Review glossary relevance in context

### 13. دورة حياة الحساب

- الملف: `auth/13-account-lifecycle.md`
- أقسامه: قبل ما تبدأ ← كلمات جديدة في الدرس ← التسجيل ← Token التأكيد ← Password reset ← العمليات الحساسة ← تغيير البريد والحذف ← حالات السباق ← سيناريو أمني ← تدريب تهديد ← مرجع التحقق ← اربط النقاط ببعض ← جرّب بنفسك
- فحص البنية: Review glossary relevance in context؛ Short lesson: review explanation and examples

### 14. MFA وTOTP وPasskeys

- الملف: `auth/14-mfa-passkeys.md`
- أقسامه: قبل ما تبدأ ← كلمات جديدة في الدرس ← العامل ليس مجرد خطوة ثانية ← TOTP ← Recovery Codes ← WebAuthn وPasskeys ← Step-up ← Recovery هي أضعف حلقة ← مرجع ← سيناريو أمني ← تدريب تهديد ← مرجع التحقق ← اربط النقاط ببعض ← جرّب بنفسك ← ارفض الـOTP اللي نجح قبل كده
- فحص البنية: Review glossary relevance in context؛ Candidate for topic split؛ Short lesson: review explanation and examples

### 15. API Keys وهوية الأنظمة

- الملف: `auth/15-api-keys-machine-identity.md`
- أقسامه: قبل ما تبدأ ← كلمات جديدة في الدرس ← API key ليست هوية مستخدم ← شكل وتخزين ← صلاحيات ودورة حياة ← Rate limits وService Accounts ← mTLS ← سيناريو أمني ← تدريب تهديد ← مرجع التحقق ← اربط النقاط ببعض ← جرّب بنفسك
- فحص البنية: Review glossary relevance in context؛ Short lesson: review explanation and examples

### 16. ABAC وReBAC وعزل الـTenants

- الملف: `auth/16-advanced-authorization-multitenancy.md`
- أقسامه: قبل ما تبدأ ← كلمات جديدة في الدرس ← RBAC ليست كل شيء ← Policy decision ← Multi-tenancy ← Deny by default والاختبار ← مرجع ← سيناريو أمني ← تدريب تهديد ← مرجع التحقق ← اربط النقاط ببعض ← جرّب بنفسك
- فحص البنية: Review glossary relevance in context؛ Short lesson: review explanation and examples

### 17. Rate Limiting ومقاومة الإساءة

- الملف: `auth/17-rate-limiting-abuse.md`
- أقسامه: قبل ما تبدأ ← كلمات جديدة في الدرس ← ما الذي نحده؟ ← الخوارزميات ← استجابة HTTP ← Login وCredential Stuffing ← CAPTCHA وRisk ← الفشل والتشغيل ← سيناريو أمني ← تدريب تهديد ← مرجع التحقق ← اربط النقاط ببعض ← جرّب بنفسك
- فحص البنية: Review glossary relevance in context؛ Short lesson: review explanation and examples

### 18. Security Logging وAudit Trail

- الملف: `auth/18-security-logging-audit.md`
- أقسامه: قبل ما تبدأ ← كلمات جديدة في الدرس ← Operational log أم Audit؟ ← Schema مقترحة ← أحداث مهمة ← سلامة ووصول ← التنبيه والتحقيق ← مرجع ← سيناريو أمني ← تدريب تهديد ← مرجع التحقق ← اربط النقاط ببعض ← جرّب بنفسك
- فحص البنية: Review glossary relevance in context؛ Short lesson: review explanation and examples

### 19. إدارة الأسرار ومفاتيح التشفير

- الملف: `auth/19-secrets-key-management.md`
- أقسامه: قبل ما تبدأ ← كلمات جديدة في الدرس ← ما السر؟ ← دورة الحياة ← Secret Manager ← Envelope Encryption ← Rotation ← الوصول والتدقيق ← عند التسريب ← مرجع ← سيناريو أمني ← تدريب تهديد ← مرجع التحقق ← اربط النقاط ببعض ← جرّب بنفسك
- فحص البنية: Review glossary relevance in context؛ Short lesson: review explanation and examples

### 20. Threat Modeling واختبار الصلاحيات

- الملف: `auth/20-threat-modeling-authorization-testing.md`
- أقسامه: قبل ما تبدأ ← كلمات جديدة في الدرس ← ابدأ بالأصول وحدود الثقة ← حلل تدفق تسجيل الدخول ← Authorization Test Matrix ← Deny by default وعدم تسريب الوجود ← مراجعة التهديد عند التغيير ← تأكد من فهمك ← تدريب تهديد ← مرجع التحقق ← اربط النقاط ببعض ← جرّب بنفسك
- فحص البنية: Review glossary relevance in context

### 21. الأجهزة والجلسات وكلمات المرور المسربة وSCIM

- الملف: `auth/21-device-sessions-breached-passwords-scim.md`
- أقسامه: قبل ما تبدأ ← كلمات جديدة في الدرس ← سجل جلسات قابل للإدارة ← فحص كلمات المرور المسربة ← SCIM: Provisioning وليس Login ← Deprovisioning أهم من Provisioning ← تأكد من فهمك ← تدريب تهديد ← مرجع التحقق ← اربط النقاط ببعض ← جرّب بنفسك
- فحص البنية: Review glossary relevance in context

### 22. PAR وJAR وRAR وحوادث التوكينات

- الملف: `auth/22-par-jar-rar-token-incidents.md`
- أقسامه: قبل ما تبدأ ← كلمات جديدة في الدرس ← المشكلة التي تعالجها الإضافات ← PAR — Pushed Authorization Requests ← JAR — JWT-Secured Authorization Request ← RAR — Rich Authorization Requests ← سيناريو Incident: Access Token مسرب ← Runbook يمنع القرارات المرتجلة ← تأكد من فهمك ← تدريب تهديد ← مرجع التحقق ← اربط النقاط ببعض ← جرّب بنفسك
- فحص البنية: Review glossary relevance in context

### الأمان والمصادقة والصلاحيات

- الملف: `auth/index.md`
- أقسامه: خريطة الدروس ← مراجع المعايير ← تابع حسابًا واحدًا عبر حدود النظام
- فحص البنية: يتطلب مراجعة بشرية لموضوع الدرس

