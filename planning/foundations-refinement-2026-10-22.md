# تعديل كارد أساسيات المبرمج — 2026-10-22

## النتيجة والنطاق

نُفّذ طلب «عدل» على كارد **أساسيات المبرمج: الكمبيوتر والبرامج والشبكات**، بناءً على آخر تقييم. هذا تحرير للدوكس، وليس جلسة مذاكرة أو دليل نجاح في المنهج.

المحتوى النشط ما زال **60 درسًا**:14 كمبيوتر،32 شبكات،14 رياضيات وحل مشكلات، بالإضافة إلى 4 أدلة لكل لغة. لم يُحذف درس أو يتغير عنوان URL. بقيت الصفحات القديمة كإحالات/مراجع متاحة، ولم تعد ضمن مسار الدروس المعتمد.

## ما اتغير

### مسار قراءة واضح بدل اعتبار كل التفاصيل شروط بداية

- الكمبيوتر يبدأ بهاردوير مختصر ثم البرامج ونظام التشغيل والتنفيذ والذاكرة والملفات والتشخيص.
- الشبكات أصبحت 13 درسًا للمرور الأول و 19 للرجوع بعد التطبيق، مع تقديم المنافذ وURL على TCP.
- الرياضيات 7 دروس حسب الحاجة، ثم 7 تطبيقات وتعمق بعد أساس اللغة.
- الفهرس والأدلة وبيانات المنهج والتنقل السابق/التالي تتفق على نفس الترتيب. نهاية كل مرحلة ترجع للدليل؛ لا تدفع الطالب تلقائيًا للمرحلة المتعمقة.
- الموضوع يحتفظ بملكيته داخل درسه؛ نقاط توقف DNS وTCP وTLS وتمثيل البيانات تحدد المطلوب أولًا والتفاصيل التي نرجع لها.

### أمثلة واختبارات فعلية

- إصلاح تسجيل الاستثناء في PHP مع strict_types باستخدام تحويله إلى string قبل error_log. معمل product.php كامل:200 ثم فشل مقصود 500 ثم 200، مع رد عام للعميل وسجل خاص للخادم.
- مصدر نوع معامل error_log: [مرجع PHP الرسمي](https://www.php.net/manual/en/function.error-log.php). الاختبار الفعلي، لا مجرد lint، أثبت اكتمال مسار الفشل.
- توفير بديل تتبع جاهز بمدخل وخرج في كل درس يعتمد على معمل Node، مع توضيح اختياريته محليًا. التسليم يميز نتائج تشغيل الطالب عن بيانات القراءة التعليمية.
- قياس الذاكرة حُدد باسم WorkingSet64، عملية PID واحدة، وحدة bytes، ثلاث قراءات ونهاية معلنة، مع بديل ورقي افتراضي. التعريف: [Microsoft WorkingSet64](https://learn.microsoft.com/en-us/dotnet/api/system.diagnostics.process.workingset64).
- إضافة تتبع main/A/B والرجوع وعمر H1، مع بيان أنه نموذج عام وليس خريطة تخزين PHP حرفية.
- إضافة جسور PHP للحلقة والتجميع والمؤشرين. التحقق يشمل الفراغ والصفر والحدود والغياب والمدخل المرفوض وتجاوز العدد الصحيح، لا حالة نجاح واحدة فقط.
- تمارين مستقلة وإجابات مطوية ومعايير تحقق للحلقات وDP والاحتمال والأنماط، وتصحيح rest/REST ومتطلبات JavaScript/HTML القديمة في الرياضيات.
- تصحيح AR/EN في تكليف 404، ومسار spans داخل التطبيق بدل DB→External API، وإزالة تكرار المصطلحات الإنجليزية.
- تدريب الكاش لم يعد يَعِد بـ 304 من مثال يرسل no-store.

### الرسومات والكتابة

رسم رحلة Request الأصلي محفوظ باللغتين، وكذلك مصافحة TCP والرسومات التوضيحية المعتمدة. لم تُضف خريطة شكلية في آخر كل درس. اقتصر تعديل الرسم الشامل على توضيح أن إنشاء الاتصال يمر بالشبكة وأن NAT اختياري؛ الشكل والهندسة لم يتغيرا.

استُخدمت إرشادات الرسومات للتحقق من المعنى والاتجاه، دون إنشاء ملف Figma أو توليد صورة نقطية جديدة. روجعت المسافات وMarkdown واتجاه الكود، وثُبتت قواعد ترتيب القراءة واختبارات الفشل وبدائل البيئة وتكافؤ اللغتين في دليل الكتابة.

## الملفات

أُنشئت في هذه الجولة:

- `scripts/organize-foundations-learning-path.mjs`: تنظيم التسجيل الحالي والبيانات وملاحة الدروس، مع منع إسقاط المسارات أو تكرارها.
- `scripts/verify-foundations-refinement.mjs`: اختبارات أمثلة PHP المنشورة وHTTP والجلسات وسياسات المتصفح.
- هذا التقرير وتقارير التحقق المشار إليها أدناه.

تعدلت:

- أدلة الكارد العربية والإنجليزية: `index.md` و`networking-next.md` و`math-problem-solving/index.md`.
- دروس الكارد المعتمدة داخل `src/content/docs/programming-basics/` ونسخها تحت `src/content/docs/en/programming-basics/`: المحتوى المحدد أعلاه، والملاحة لجميع الدروس.
- `astro.config.mjs`: مجموعة كارد الأساسيات فقط، بإضافة مجموعتي المرور الأول والرجوع للتعمق داخل التسجيل الموجود.
- `src/data/foundations-curriculum.json`، و`planning/content-writing-guide.md`، و`STUDY_SESSION_CONTEXT.md`.
- `scripts/verify-foundations-card.mjs`: التحقق من حدود المراحل الجديدة.
- `public/diagrams/request-flow-ar.svg` و`request-flow-en.svg`: العبارات المحددة أعلاه فقط.

## التحقق المنفذ

| الفحص | النتيجة |
|---|---|
| npm run build | ناجح:380 صفحة، وفهرس Pagefind اكتمل لـ 399 ملف HTML |
| جميع المسارات النشطة باللغتين |128 مسارًا:200، اتجاه صحيح، روابط داخلية ومراسي وتبديل لغة |
| ترتيب الدروس |60 درسًا؛ حدود 13/19 و 7/7 والتنقل صحيح |
| صفحات الأساسيات بما فيها legacy |194 صفحة بعرض 320؛ لا تجاوز لعرض المستند، وكود LTR |
| عرض الرسوم |42 حالة بعروض 320 و 390 و 1280، و 12 أصل SVG تفصيلي بلا خروج للنص عن viewBox |
| الرسم الأصلي لرحلة الطلب | رابط الحجم الكامل يعمل؛ فحص مستقل للعبارات المصححة ولقطتان كاملتان بلا شريط رأس الصفحة |
| الاختبارات الأساسية القائمة |8 أمثلة PHP ومختبر PowerShell؛ المجموع 9 سجلات مختبر |
| اختبارات التحسين الجديدة |23 مجموعة تحقق ناجحة، بما فيها الحالات الطرفية والفشل |
| معمل الجلسة PHP |زيارات 1 ثم 2 مع Cookie، ثم 1 من غيرها؛ HttpOnly وSameSite=Lax |
| معمل CORP/COEP بمتصفح Edge |same-origin يمنع الصورة، cross-origin يعرضها، غياب CORP يمنعها مع require-corp؛ العزل true |
| الاستثناء عبر HTTP في اللغتين |200→500→200، لا استثناء/trace في جسم العميل، التفاصيل بالسجل |
| عدم تسريب التغيير |253 ملف دراسة/مسارات أخرى مطابق لبصمته قبل العمل، وبقية إعدادات الموقع خارج كارد الأساسيات محفوظة |
| whitespace |git diff --check ناجح للملفات في النطاق؛ لا ملفات نقل مؤقتة باقية |

ملفات الأدلة:

- [فحص الكارد والتنقل والروابط](audit-results/foundations-card-2026-10-22.json)
- [اختبارات التشغيل الجديدة](audit-results/foundations-runtime-2026-10-22.json)
- [فحص الصفحات والرسوم](audit-results/foundations-diagrams-2026-10-22/report.json)
- [رحلة الطلب العربية بالحجم الكامل](audit-results/foundations-diagrams-2026-10-22/request-full-ar.png)
- [رحلة الطلب الإنجليزية بالحجم الكامل](audit-results/foundations-diagrams-2026-10-22/request-full-en.png)
- سجل البناء المحلي: `tmp/foundations-refinement-build-2026-10-22.log`.

## الحدود والافتراضات

- تفسير «عدل» هو تنفيذ ملاحظات آخر تقييم للكارد فقط، وليس إعادة تصميم الموقع أو تغيير منهج الدراسة.
- لم تُشغّل كل تجارب Node الاختيارية. فُحص تنفيذ الوعود المعنية في مصدر المعمل، وجرى تشغيل أمثلة PHP والجلسات وسياسات الصور المحددة فعليًا.
- لم تُنفذ تجربة GUI لقياس محرر النصوص. جُرّب أمر WorkingSet64 قراءةً على عملية PowerShell، والأرقام الورقية معلنة افتراضية.
- لا ادعاء باختبار انقطاع الكهرباء أو مراجعة تشغيل كل مثال قديم في الصفحات المؤرشفة.
- تحذيرات البناء القائمة عن site/sitemap وhead-inject باقية؛ ليست أخطاء بناء ناتجة عن هذه الجولة.
- لم يتغير Progress أو PDF الثنائي أو الكاردات الأخرى؛ ولم يحدث commit أوpush أوdeploy.

## المسارات وموضع الفهرس

المدخل العربي: `/programming-basics/`، والإنجليزي: `/en/programming-basics/`.

الأقسام الثلاثة: الكمبيوتر والبرامج، الشبكات والويب، الرياضيات وحل المشكلات. مرحلتا القراءة داخل قسمي الشبكات والرياضيات، لا كارد جديد ولا نسخ مكررة للدروس.

قائمة الدروس المعتمدة، وكل سطر له نظير إنجليزي بإضافة `/en` في بداية المسار:

- `/programming-basics/computer-in-depth/03-hardware-architecture/`
- `/programming-basics/computer-in-depth/software-and-runtime/`
- `/programming-basics/computer-in-depth/06-operating-systems/`
- `/programming-basics/computer-in-depth/04-cpu-gpu/`
- `/programming-basics/computer-in-depth/03-binary-languages-algorithms/`
- `/programming-basics/computer-fundamentals/18-media-and-units/`
- `/programming-basics/computer-in-depth/05-ram-memory-buffers/`
- `/programming-basics/computer-in-depth/12-memory-allocation/`
- `/programming-basics/computer-in-depth/13-buffers-and-durability/`
- `/programming-basics/computer-in-depth/05-os-terminal-files-git/`
- `/programming-basics/computer-in-depth/17-terminal-environment/`
- `/programming-basics/computer-in-depth/15-parallel-work/`
- `/programming-basics/computer-in-depth/14-running-code/`
- `/programming-basics/computer-in-depth/16-testing-and-debugging/`
- `/programming-basics/01-web-and-request-flow/`
- `/programming-basics/14-network-layers-lan-ethernet-arp/`
- `/programming-basics/15-addressing-dhcp-nat-routing-ipv6/`
- `/programming-basics/02-dns-and-ip/`
- `/programming-basics/04-url-ports-http/`
- `/programming-basics/21-url-encoding/`
- `/programming-basics/03-tcp-udp-packets/`
- `/programming-basics/udp/`
- `/programming-basics/05-http-messages-state/`
- `/programming-basics/22-http-state-and-updates/`
- `/programming-basics/06-https-tls-certificates/`
- `/programming-basics/09-browser-rendering-devtools/`
- `/programming-basics/32-local-network-lab/`
- `/programming-basics/28-lan-segmentation/`
- `/programming-basics/18-wifi-practical-basics/`
- `/programming-basics/26-subnet-calculations/`
- `/programming-basics/27-routing-and-ipv6/`
- `/programming-basics/20-transport-diagnostics/`
- `/programming-basics/29-browser-scheduling/`
- `/programming-basics/07-server-side-path/`
- `/programming-basics/08-server-proxy-api-gateway/`
- `/programming-basics/31-proxy-policies/`
- `/programming-basics/10-http-caching-compression/`
- `/programming-basics/11-same-origin-cors/`
- `/programming-basics/33-browser-isolation/`
- `/programming-basics/12-realtime-webhooks/`
- `/programming-basics/30-webhook-delivery/`
- `/programming-basics/13-api-design/`
- `/programming-basics/16-http2-http3-quic/`
- `/programming-basics/17-proxies-cdn-waf-observability/`
- `/programming-basics/24-request-protection/`
- `/programming-basics/25-request-observation/`
- `/programming-basics/math-problem-solving/01-arithmetic-foundations/`
- `/programming-basics/math-problem-solving/07-division-and-precision/`
- `/programming-basics/math-problem-solving/02-variables-equations-logic/`
- `/programming-basics/math-problem-solving/08-sets-relations/`
- `/programming-basics/math-problem-solving/04-computational-thinking/`
- `/programming-basics/math-problem-solving/05-algorithms-pseudocode-decision-trees/`
- `/programming-basics/math-problem-solving/06-flowcharts-loops-debugging/`
- `/programming-basics/08-problem-solving-algorithms/`
- `/programming-basics/math-problem-solving/13-loop-reasoning/`
- `/programming-basics/math-problem-solving/09-solution-patterns/`
- `/programming-basics/math-problem-solving/10-greedy-dynamic-programming/`
- `/programming-basics/math-problem-solving/03-applied-math-graphs-primes/`
- `/programming-basics/math-problem-solving/11-counting-probability/`
- `/programming-basics/math-problem-solving/12-graphs-and-search/`
