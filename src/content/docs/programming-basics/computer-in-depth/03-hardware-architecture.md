---
title: مكوّنات الهاردوير واللوحة الأم
description: اللوحة الأم والناقلات والتخزين وأجهزة الإدخال والإخراج والطاقة والتبريد ورحلة البيانات داخل الجهاز.
sidebar:
  order: 3
prev: {"link":"/programming-basics/computer-in-depth/02-computers-data-processing/","label":"الكمبيوتر والبيانات ودورة المعالجة"}
next: {"link":"/programming-basics/computer-in-depth/04-cpu-gpu/","label":"كيف ينفّذ المعالج التعليمات؟"}
---


## كل وصلة لها وظيفة

| الجزء | شرح قريب من وظيفته | مثال |
|---|---|---|
| Socket — مقبس المعالج | مكان يثبت فيه المعالج ويوصله باللوحة | المعالج لازم يناسب المقبس؛ تشابه الحجم وحده لا يكفي |
| Bus — ناقل | طريق اتصال لنقل بيانات وإشارات بين أجزاء | USB يصل الجهاز الخارجي بالمتحكم |
| Seek — تحريك رأس القرص | انتقال الرأس لمكان البيانات في HDD | قراءة أماكن متناثرة تتطلب حركة أكثر؛ SSD لا يملك رأسًا متحركًا |
| PSU — Power Supply Unit | مزوّد يحوّل كهرباء المصدر إلى جهود تحتاجها القطع | قدرته وجودته والتوصيلات تؤثر في استقرار الجهاز |

تخيل فتح ملف: وسيط التخزين يقرأ، الناقل ينقل، الذاكرة تحمل، والمعالج يستخدم البيانات. الطاقة والتبريد يسمحان للأجزاء بالعمل؛ لا يخزنان نسخة الملف.

## الهاردوير كنظام مترابط

الكمبيوتر ليس CPU (Central Processing Unit؛ المعالج الرئيسي الذي ينفذ التعليمات) محاطًا بقطع مستقلة. اللوحة الأم تربط المعالج والذاكرة والتخزين وبطاقات التوسعة عبر مسارات كهربائية وبروتوكولات. البرنامج لا يرسل أمرًا مباشرًا لكل ترانزستور؛ يطلب خدمة من نظام التشغيل، والـDriver (تعريف الجهاز: برنامج يتيح للنظام التعامل معه) يتعامل مع Controller (متحكم: مكوّن يدير تعامل الجهاز مع جزء مادي) الجهاز.

## اللوحة الأم وChipset

تحدد اللوحة Socket المعالج، نوع RAM (Random Access Memory؛ ذاكرة العمل التي تحمل بيانات وتعليمات البرامج النشطة) وعدد القنوات، منافذ التخزين، مسارات PCIe (Peripheral Component Interconnect Express؛ اتصال سريع بين مكونات الجهاز عبر مسارات بيانات)، ومنافذ الإدخال والإخراج. الـChipset (مجموعة دوائر توفر وصلات ووحدات تحكم للمكونات) يضيف Controllers ومسارات لا يوفرها المعالج مباشرة. التوافق لا يتحدد بشكل الموصل فقط؛ Firmware (برنامج منخفض المستوى محفوظ مع الجهاز لتهيئته والتحكم فيه) والطاقة والإصدار وعدد Lanes (مسارات بيانات في وصلة مثل PCIe) عوامل مهمة.

## Buses وPCIe وUSB

الـBus ينقل Data وAddresses وControl Signals. PCIe اتصال تسلسلي Point-to-point يستخدم Lanes؛ بطاقة `x16` لديها مسارات أكثر من `x1` لكن السرعة الفعلية تعتمد أيضًا على جيل PCIe والجهاز. USB (Universal Serial Bus؛ معيار توصيل أجهزة لنقل بيانات وتوفير طاقة بحسب الدعم) يربط أجهزة متنوعة ويجمع الطاقة والبيانات وفق الإصدار والمنفذ؛ شكل USB-C لا يضمن وحده سرعة أوقدرة معينة.

## التخزين: HDD وSSD وNVMe

- HDD (Hard Disk Drive؛ وحدة تخزين بأقراص مغناطيسية تدور) مغناطيسي ميكانيكي، سعته كبيرة وتكلفته منخفضة لكن Seek أبطأ.
- SATA (Serial ATA؛ معيار توصيل تخزين) SSD (Solid-State Drive؛ وحدة تخزين إلكترونية بلا أجزاء ميكانيكية متحركة) بلا أجزاء متحركة وزمن وصوله أقل.
- NVMe (Non-Volatile Memory Express؛ بروتوكول اتصال بتخزين غير متطاير، غالبًا عبر PCIe) SSD يتصل عادة عبر PCIe ويستفيد من Queues متوازية.

التخزين دائم نسبيًا، بينما RAM أسرع ومتطايرة. فتح ملف لا يعني نقل القرص كله إلى RAM؛ النظام يقرأ Blocks/Pages حسب الحاجة ويستخدم Cache (نسخة محفوظة لتقليل تكرار القراءة أو الحساب).

## أجهزة الإدخال والإخراج

Keyboard وMouse وCamera وNetwork Card ترسل بيانات أوEvents. الشاشة والطابعة والسماعات تستقبل نتائج. بعض الأجهزة تفعل الأمرين. Controller يدير الجهاز، وDriver يقدم واجهة يفهمها Kernel (نواة نظام التشغيل التي تدير الموارد والوصول المحمي). Interrupt (مقاطعة: إشعار يلفت المعالج إلى حدث يحتاج معالجة) يخبر CPU بحدث بدل Polling (فحص دوري بدل انتظار إشعار من الطرف الآخر) مستمر، وقد يستخدم الجهاز DMA (Direct Memory Access؛ نقل بيانات بين جهاز والذاكرة من غير نسخ المعالج لكل بايت) لنقل Blocks إلى RAM بكلفة CPU أقل.

## PSU والتبريد

Power Supply تحول الكهرباء إلى جهود مناسبة وتحتاج قدرة وجودة وحمايات ملائمة. الحرارة ترفع احتمال Throttling (تقليل معدل العمل، مثل خفض سرعة المعالج لحماية الحرارة أو الطاقة) وعدم الاستقرار؛ المشتت والمراوح وتدفق الهواء وThermal Interface (مادة أو سطح يحسن انتقال الحرارة بين الشريحة والمشتت) أجزاء وظيفية وليست شكلًا تجميليًا.

## رحلة البيانات

```text
SSD/HDD → Storage controller → RAM → CPU cache/registers
                                     ↓
                                CPU executes
                                     ↓
RAM ← result ← GPU/NIC/display/storage controller
```

ليست كل خطوة نسخة كاملة. Cache وDMA وMemory Mapping (ربط ملف أو مورد بنطاق عناوين يستطيع البرنامج الوصول إليه) وBuffers تقلل النقل أو تؤجله. سرعة النظام تحددها أبطأ مرحلة في المسار الفعلي، لا أكبر رقم على قطعة منفردة.

## إقلاع الجهاز وتشخيص البطء

**Firmware — برمجيات الجهاز الأساسية** تهيئ المكونات، و**UEFI (Unified Extensible Firmware Interface؛ واجهة برمجيات بدء تشغيل الجهاز)** واجهة بدء التشغيل التي تدير اختيارات الإقلاع وتشغّل **Bootloader — برنامج تحميل نظام التشغيل**. دول مش نظام التشغيل الكامل.

**Bottleneck — الجزء الذي يحد الأداء** يعتمد على العمل الفعلي. **Queue depth** عدد طلبات التخزين التي تنتظر أو يجري التعامل معها وفق الأداة، و**Utilization** نسبة انشغال مورد. **Thermal throttling** خفض سرعة المعالج عندما يصل لحد الحرارة؛ راقب الحرارة والسرعة معًا. قرص مشغول وطابور قراءة طويل يشيران لاتجاه مختلف عن معالج يخفض سرعته بسبب الحرارة.

**RAID (Redundant Array of Independent Disks؛ تنظيم عدة أقراص لتحسين خواص مثل التوافر أو الأداء حسب النوع)** تنظيم عدة أقراص بطرق تختلف في تحمل العطل أو الأداء. ليس نسخة احتياطية؛ حذف خاطئ أو تشفير ملفات ضار قد يؤثر في مجموعة الأقراص كلها.

**تدريب وحل:** فتح ملفات بطيء ومعالج قليل الانشغال. افحص زمن وصول التخزين وطابور الطلبات وحالة القرص، ولا تشترِ معالجًا اعتمادًا على البطء وحده. لو المشكلة تتزامن مع ارتفاع الحرارة وهبوط تردد المعالج، راجع التبريد والقياس تحت نفس الحمل.

## تأكد من فهمك

<div class="lesson-quiz" role="list">
<section class="quiz-card" role="listitem"><div class="quiz-question-row"><span class="quiz-number">01</span><p>لماذا شكل USB-C لا يخبرك بالسرعة وحده؟</p></div><details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة:</strong> الشكل Connector فقط؛ البروتوكول والإصدار والكابل والجهاز تحدد السرعة والطاقة والميزات.</div></details></section>
<section class="quiz-card" role="listitem"><div class="quiz-question-row"><span class="quiz-number">02</span><p>ما الفرق بين Controller وDriver؟</p></div><details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة:</strong> Controller مكوّن هاردوير يدير الجهاز، وDriver برنامج داخل نظام التشغيل يتحدث معه ويعرض واجهة موحدة.</div></details></section>
<section class="quiz-card" role="listitem"><div class="quiz-question-row"><span class="quiz-number">03</span><p>لماذا NVMe ليس مجرد اسم أسرع لـSSD؟</p></div><details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة:</strong> SSD يصف وسيط التخزين، بينما NVMe بروتوكول مصمم للتخزين غير المتطاير عبر PCIe وQueues متوازية.</div></details></section>
<section class="quiz-card" role="listitem"><div class="quiz-question-row"><span class="quiz-number">04</span><p>ما فائدة DMA؟</p></div><details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة:</strong> يسمح للجهاز بنقل Blocks إلى RAM أو منها دون أن ينسخ CPU كل Byte بنفسه، مع بقاء الإعداد والتنسيق للنظام.</div></details></section>
</div>
