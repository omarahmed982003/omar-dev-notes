# مراجعة رسومات الأساسيات — 2026-10-22

## النطاق

المسار: أساسيات المبرمج. المراجعة تخص الرسومات والمخططات داخل جميع صفحات `programming-basics` العربية والإنجليزية، بما فيها الصفحات القديمة غير المدرجة في المسار النشط: 97 صفحة لكل لغة، 194 مسارًا. لا إعادة ترتيب للمنهج أو sidebar، ولا تعديل لتقدم الدراسة، ولا commit أو push.

## ما تغير

- حُذفت 14 خريطة عامة ذات صناديق ملوّنة مكررة من 7 أزواج دروس. شملت خرائط التعلم والمجالات، ومعالجة البيانات، والرياضيات التطبيقية، والتفكير الحاسوبي، والقرار والحلقات. لم تُحذف صفحات الدروس.
- أزيل بوستر رحلة الطلب الكبير من الدرس؛ الخطوات وحدود كل مكوّن موجودة في النص والجداول، ولا تحتاج صورة أخرى تكررها.
- الرسومات المعتمدة خمس فقط، لكل منها أصل عربي وإنجليزي مستقل ووصف بديل وتعليق: قرار السحب، أكبر ثلاثة أعداد، حلقة الجمع بسهم رجوع للشرط، تبادل Cookie/Session عبر طلبين، ومقارنة حلقة Ethernet بالمسار الاحتياطي بعد STP.
- موضع كل رسم بجوار المثال وبعد التعريفات المطلوبة، لا كملحق ثابت في نهاية الدرس.
- أزيلت مخططات نصية توحي بأن DNS ينفذ بسلسلة استدعاء بين Root وTLD، أو بأن مكونات الهاردوير خط واحد، أو بأن كل طلب يمر بترتيب ثابت للخدمات.
- صُحح مسار الطلب الديناميكي: قاعدة البيانات ترجع للتطبيق؛ التطبيق يبني الاستجابة التي ترجع عبر الخادم إلى العميل. بُسّط تشريح URL بدل الاعتماد على أقواس نصية يصعب تتبعها.
- ثُبت اتجاه كتل الكود والمخططات النصية LTR داخل كارد الأساسيات فقط، مع بقاء الشرح RTL. اتجاهات الأسهم داخل SVG صريحة ولا تُقلب آليًا بالعربية.
- وُثقت قاعدة الرسم الاختياري وفروع الفشل ووضوح الموبايل في `planning/content-writing-guide.md`.

## الملفات

- تعديل 24 نسخة درس تحت `src/content/docs/programming-basics/` ونظيرها الإنجليزي؛ معظم التغيير إزالة أو تصحيح رسم لا إعادة كتابة المحتوى.
- 10 أصول SVG داخل `public/diagrams/foundations/math/` و`public/diagrams/foundations/network/`.
- أنماط مشتركة محدودة في `src/styles/custom.css` و`src/pages/print/all.astro` لعرض الرسومات فقط؛ لا تغيير لتصميم بقية الكاردات.
- فحص قابل لإعادة التشغيل: `node scripts/verify-foundations-diagrams.mjs`. يستخدم معاينة محلية افتراضيًا على4323؛ يمكن ضبط `AUDIT_BASE_URL`.

## التحقق

- `npm run build`: نجح بناء380 صفحة وفهرس Pagefind (399 ملف HTML). تحذيرات سابقة عن sitemap/site و404 وhead-inject ليست أعطالًا نتجت عن الرسومات.
- 194 مسارًا: HTTP200، اتجاه عربي/إنجليزي صحيح، language switcher صحيح، لا خرائط قديمة، لا تجاوز لعرض الصفحة عند320px، وكتل الكود LTR.
- 30 لقطة وفحص للرسومات: اللغتان × خمس رسومات ×320/390/1280px. فُحصت الرسومات بصريًا؛ الأسهم متصلة، والنص داخل حدود SVG ولا يحتاج تمريرًا أفقيًا.
- مقارنة SHA-256 لـ253 ملفًا خارج محتوى الأساسيات، تشمل ملفات study ومحتوى الكاردات الأخرى: لا اختلاف عن خط الأساس المحفوظ قبل المهمة.
- Smoke test للكاردات C++ وPHP وPHP Runtime وAuthentication وDatabase: جميع المداخل تعمل ولا تتلقى علامات تنسيق الأساسيات.
- السجل التفصيلي: [report.json](audit-results/foundations-diagrams-2026-10-22/report.json).
- لم يُجدد PDF الثنائي المحفوظ؛ تغير تنسيق صفحة الطباعة فقط. هذه مراجعة رسومات وليست ادعاءً بتشغيل جميع المعامل أو تدقيق كل جملة علمية في194 صفحة.

## مصادر تحقق علمي للرسم

- [PHP: session_start](https://www.php.net/manual/en/function.session-start.php) و[Basic usage](https://www.php.net/manual/en/session.examples.basic.php): استعادة الجلسة بالمعرّف وبيانات الحالة عند الخادم.
- [Cisco: Spanning Tree Protocol](https://www.cisco.com/c/en/us/td/docs/routers/access/3200/software/wireless/SpanningTree.html): إيقاف تمرير المسار الزائد لتجنب الحلقة، وإمكانية إعادة استعماله عند تغير التوصيل.

## جرد الملفات المعدلة في هذه الجولة

- `src/content/docs/en/programming-basics/02-dns-and-ip.md`
- `src/content/docs/en/programming-basics/07-server-side-path.md`
- `src/content/docs/en/programming-basics/28-lan-segmentation.md`
- `src/content/docs/en/programming-basics/computer-fundamentals/03-hardware-architecture.md`
- `src/content/docs/en/programming-basics/computer-in-depth/01-learning-roadmap.md`
- `src/content/docs/en/programming-basics/computer-in-depth/02-computers-data-processing.md`
- `src/content/docs/en/programming-basics/computer-in-depth/04-tech-fields-ai-engineering-mindset.md`
- `src/content/docs/en/programming-basics/math-problem-solving/03-applied-math-graphs-primes.md`
- `src/content/docs/en/programming-basics/math-problem-solving/04-computational-thinking.md`
- `src/content/docs/en/programming-basics/math-problem-solving/05-algorithms-pseudocode-decision-trees.md`
- `src/content/docs/en/programming-basics/math-problem-solving/06-flowcharts-loops-debugging.md`
- `src/content/docs/programming-basics/02-dns-and-ip.md`
- `src/content/docs/programming-basics/04-url-ports-http.md`
- `src/content/docs/programming-basics/07-server-side-path.md`
- `src/content/docs/programming-basics/25-request-observation.md`
- `src/content/docs/programming-basics/28-lan-segmentation.md`
- `src/content/docs/programming-basics/computer-fundamentals/03-hardware-architecture.md`
- `src/content/docs/programming-basics/computer-in-depth/01-learning-roadmap.md`
- `src/content/docs/programming-basics/computer-in-depth/02-computers-data-processing.md`
- `src/content/docs/programming-basics/computer-in-depth/04-tech-fields-ai-engineering-mindset.md`
- `src/content/docs/programming-basics/math-problem-solving/03-applied-math-graphs-primes.md`
- `src/content/docs/programming-basics/math-problem-solving/04-computational-thinking.md`
- `src/content/docs/programming-basics/math-problem-solving/05-algorithms-pseudocode-decision-trees.md`
- `src/content/docs/programming-basics/math-problem-solving/06-flowcharts-loops-debugging.md`

الملفات المشتركة: `planning/content-writing-guide.md`، `src/styles/custom.css`، `src/pages/print/all.astro`، `STUDY_SESSION_CONTEXT.md`. الملفات المضافة للتدقيق: هذا التقرير و`scripts/verify-foundations-diagrams.mjs` ومخرجاته. أصول الرسومات المنشأة/المحسنة:

- `public/diagrams/foundations/math/atm-decision-ar.svg`
- `public/diagrams/foundations/math/atm-decision-en.svg`
- `public/diagrams/foundations/math/loop-back-edge-ar.svg`
- `public/diagrams/foundations/math/loop-back-edge-en.svg`
- `public/diagrams/foundations/math/maximum-tree-ar.svg`
- `public/diagrams/foundations/math/maximum-tree-en.svg`
- `public/diagrams/foundations/network/cookie-session-ar.svg`
- `public/diagrams/foundations/network/cookie-session-en.svg`
- `public/diagrams/foundations/network/switch-loop-ar.svg`
- `public/diagrams/foundations/network/switch-loop-en.svg`

تمت مقارنة26 مصدر درس متاحًا في لقطات بداية المراجعة: كتل PHP وC++ وJavaScript وBash وPowerShell وHTTP وJSON لم تتغير. التعديل شمل الرسم أو وصفه أو اتجاه عرضه، لا حلولًا برمجية جديدة.

## متابعة بطلب الطالب: استعادة الرسم المفيد

طلب الطالب إعادة رسم رحلة Request نفسه، وأوضح أن رفضه للخرائط الشكلية لا للرسومات التوضيحية. أعيدت إحالتا `/diagrams/request-flow-ar.svg` و`/diagrams/request-flow-en.svg` في درس07، مع فتح بالحجم الكامل. أضيف رسم مصافحة TCP باللغتين في درس03. لا تُعد «خمس رسومات» حدًا أو قائمة أنواع حصرية؛ الأرقام أعلاه تخص الجولة السابقة. لم تُعَد الخرائط العامة المحذوفة. التحقق المحدّث يستهدف194 مسارًا و42 حالة عرض (سبع رسومات باللغتين وثلاثة مقاسات)، مع رابط تكبير للرسم الشامل بدل اشتراط قراءة كل تفاصيله في المصغّر.

نتيجة متابعة الاستعادة: نجح بناء380 صفحة وفهرس البحث، ونجح الفحص الفعلي لـ194 مسارًا و42 حالة عرض و12 أصل SVG تفصيليًا، إضافة لفحص رابطَي الرسم الشامل بالحجم الكامل. الصفحات المعدلة في المتابعة: درسا `03-tcp-udp-packets.md` و`07-server-side-path.md` باللغتين. الأصول الجديدة: `public/diagrams/foundations/network/tcp-handshake-ar.svg` و`tcp-handshake-en.svg`. المسارات هي `/programming-basics/03-tcp-udp-packets/` و`/programming-basics/07-server-side-path/` ونظيراهما تحت `/en/`. لا تغيير للـsidebar أو التقدم أو الكاردات الأخرى.
