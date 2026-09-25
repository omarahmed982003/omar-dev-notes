---
title: 3. مكوّنات الهاردوير واللوحة الأم
description: اللوحة الأم والناقلات والتخزين وأجهزة الإدخال والإخراج والطاقة والتبريد ورحلة البيانات داخل الجهاز.
sidebar:
  order: 3
---

## الهاردوير كنظام مترابط

الكمبيوتر ليس CPU محاطًا بقطع مستقلة. اللوحة الأم تربط المعالج والذاكرة والتخزين وبطاقات التوسعة عبر مسارات كهربائية وبروتوكولات. البرنامج لا يرسل أمرًا مباشرًا لكل ترانزستور؛ يطلب خدمة من نظام التشغيل، والـDriver يتعامل مع Controller الجهاز.

## اللوحة الأم وChipset

تحدد اللوحة Socket المعالج، نوع RAM وعدد القنوات، منافذ التخزين، مسارات PCIe، ومنافذ الإدخال والإخراج. الـChipset يضيف Controllers ومسارات لا يوفرها المعالج مباشرة. التوافق لا يتحدد بشكل الموصل فقط؛ Firmware والطاقة والإصدار وعدد Lanes عوامل مهمة.

## Buses وPCIe وUSB

الـBus ينقل Data وAddresses وControl Signals. PCIe اتصال تسلسلي Point-to-point يستخدم Lanes؛ بطاقة `x16` لديها مسارات أكثر من `x1` لكن السرعة الفعلية تعتمد أيضًا على جيل PCIe والجهاز. USB يربط أجهزة متنوعة ويجمع الطاقة والبيانات وفق الإصدار والمنفذ؛ شكل USB-C لا يضمن وحده سرعة أوقدرة معينة.

## التخزين: HDD وSSD وNVMe

- HDD مغناطيسي ميكانيكي، سعته كبيرة وتكلفته منخفضة لكن Seek أبطأ.
- SATA SSD بلا أجزاء متحركة وزمن وصوله أقل.
- NVMe SSD يتصل عادة عبر PCIe ويستفيد من Queues متوازية.

التخزين دائم نسبيًا، بينما RAM أسرع ومتطايرة. فتح ملف لا يعني نقل القرص كله إلى RAM؛ النظام يقرأ Blocks/Pages حسب الحاجة ويستخدم Cache.

## أجهزة الإدخال والإخراج

Keyboard وMouse وCamera وNetwork Card ترسل بيانات أوEvents. الشاشة والطابعة والسماعات تستقبل نتائج. بعض الأجهزة تفعل الأمرين. Controller يدير الجهاز، وDriver يقدم واجهة يفهمها Kernel. Interrupt يخبر CPU بحدث بدل Polling مستمر، وقد يستخدم الجهاز DMA لنقل Blocks إلى RAM بكلفة CPU أقل.

## PSU والتبريد

Power Supply تحول الكهرباء إلى جهود مناسبة وتحتاج قدرة وجودة وحمايات ملائمة. الحرارة ترفع احتمال Throttling وعدم الاستقرار؛ المشتت والمراوح وتدفق الهواء وThermal Interface أجزاء وظيفية وليست شكلًا تجميليًا.

## رحلة البيانات

```text
SSD/HDD → Storage controller → RAM → CPU cache/registers
                                     ↓
                                CPU executes
                                     ↓
RAM ← result ← GPU/NIC/display/storage controller
```

ليست كل خطوة نسخة كاملة. Cache وDMA وMemory Mapping وBuffers تقلل النقل أو تؤجله. سرعة النظام تحددها أبطأ مرحلة في المسار الفعلي، لا أكبر رقم على قطعة منفردة.

## تأكد من فهمك

<div class="lesson-quiz" role="list">
<section class="quiz-card" role="listitem"><div class="quiz-question-row"><span class="quiz-number">01</span><p>لماذا شكل USB-C لا يخبرك بالسرعة وحده؟</p></div><details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة:</strong> الشكل Connector فقط؛ البروتوكول والإصدار والكابل والجهاز تحدد السرعة والطاقة والميزات.</div></details></section>
<section class="quiz-card" role="listitem"><div class="quiz-question-row"><span class="quiz-number">02</span><p>ما الفرق بين Controller وDriver؟</p></div><details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة:</strong> Controller مكوّن هاردوير يدير الجهاز، وDriver برنامج داخل نظام التشغيل يتحدث معه ويعرض واجهة موحدة.</div></details></section>
<section class="quiz-card" role="listitem"><div class="quiz-question-row"><span class="quiz-number">03</span><p>لماذا NVMe ليس مجرد اسم أسرع لـSSD؟</p></div><details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة:</strong> SSD يصف وسيط التخزين، بينما NVMe بروتوكول مصمم للتخزين غير المتطاير عبر PCIe وQueues متوازية.</div></details></section>
<section class="quiz-card" role="listitem"><div class="quiz-question-row"><span class="quiz-number">04</span><p>ما فائدة DMA؟</p></div><details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة:</strong> يسمح للجهاز بنقل Blocks إلى RAM أو منها دون أن ينسخ CPU كل Byte بنفسه، مع بقاء الإعداد والتنسيق للنظام.</div></details></section>
</div>
