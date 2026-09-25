---
title: 5. RAM والذاكرة الافتراضية والـBuffers
description: Physical وVirtual Memory وStack وHeap والصفحات والـMMU والتخصيص والـBuffers والـCache والـQueues.
sidebar:
  order: 5
---

## ما RAM؟

RAM تخزين سريع متطاير يحمل الكود والبيانات النشطة. CPU لا يتعامل معها كقائمة متغيرات؛ يقرأ ويكتب عناوين، غالبًا عبر Cache Lines. Memory Controller يدير الاتصال بالشرائح، وتؤثر القنوات والتردد والـLatency في Bandwidth والزمن.

## Physical وVirtual Memory

كل Process يرى Address Space افتراضية خاصة. تقسم الذاكرة إلى Pages، وتترجم MMU العنوان الافتراضي إلى Physical Frame باستخدام Page Tables يديرها Kernel. هذا يوفر Isolation ويسمح بتحميل الصفحات عند الحاجة ومشاركة Pages آمنة بين العمليات.

Page Fault لا يعني Crash دائمًا؛ قد يعني أن Page صحيحة لم تُحمّل بعد. إذا اضطر النظام إلى نقل Pages باردّة إلى Swap يصبح الوصول أبطأ كثيرًا. Thrashing يحدث عندما يقضي النظام وقته في تبديل الصفحات بدل العمل.

## Stack وHeap

Stack Frames تحفظ معلومات استدعاءات الدوال ومتغيرات محلية وفق Runtime واللغة، وتُزال عادة عند العودة. Heap تستخدم للكائنات والبيانات ذات العمر الديناميكي. Stack Overflow ينتج غالبًا من Recursion عميق أوإطار ضخم؛ Heap قد تعاني Leak أوFragmentation أوOOM.

هذه أسماء لمناطق من Address Space، وليست شرائح RAM منفصلة. نظام التشغيل قد لا يمنح Physical Memory لحظة الحجز نفسها بسبب Demand Paging وOvercommit policies.

## Allocation وLeak وFragmentation وOOM

Allocator يدير Blocks ويعيد استخدامها. Leak يعني بقاء Reference أوحجز لم يعد مفيدًا. Fragmentation تعني وجود مساحة لكنها موزعة بما يصعب تلبية Block مناسب أو يزيد الهدر. عند نفاد الذاكرة قد يفشل Allocation أو يقتل النظام Process وفق سياسته.

راقب Working Set وResident Memory وPeak Usage، لا حجم المتغيرات النظري فقط. Garbage Collector يساعد في لغات Managed لكنه لا يصلح Retention مقصودة أوCaches بلا حدود.

## Buffer وCache وQueue وStream وPool

| المفهوم | الهدف |
|---|---|
| Buffer | امتصاص فرق السرعة أوتجميع البيانات قبل النقل |
| Cache | الاحتفاظ بنسخة لتجنب حساب أوقراءة متكررة |
| Queue | تنظيم وحدات عمل تنتظر المعالجة |
| Stream | تدفق متتابع قد لا نعرف حجمه مقدمًا |
| Pool | موارد جاهزة لإعادة الاستخدام مثل Connections أوWorkers |

قد تستخدم بنية واحدة لأكثر من دور، لكن سياسة الصحة مختلفة: Cache يمكن إسقاطها وإعادة بنائها، بينما Buffer غير المرسل قد يحتوي بيانات لا يجوز فقدها.

## أنواع الـBuffers

- Keyboard/Input buffer يجمع Events حتى يقرأها البرنامج.
- File buffer يقلل System Calls الصغيرة.
- Socket send/receive buffers تمتص اختلاف سرعة الشبكة والتطبيق.
- `stdout` قد يكون Line-buffered في Terminal وFully buffered عند التحويل إلى ملف.
- Ring buffer يعيد استخدام مساحة ثابتة عبر مؤشري قراءة وكتابة.
- Double buffering يبني Frame خلفية بينما تُعرض الحالية لتقليل Flicker.

Buffer Overflow يعني الكتابة بعد الحد في بيئة لا تمنعها، وهو خطر أمني. Buffer Underflow في الصوت/الفيديو يعني أن المستهلك احتاج بيانات قبل وصولها. Backpressure تمنع المنتج السريع من ملء الذاكرة بلا حد.

## Flush وDurability

`flush` قد يدفع البيانات من مكتبة إلى Kernel فقط؛ Kernel نفسه قد يحتفظ بها في Page Cache، وController أوDevice قد يملك Cache أخرى. إذا كان المطلوب Durability بعد انقطاع الكهرباء فاحتج إلى API وسياسة Filesystem/Database صريحة، لا مجرد طباعة أوإغلاق Stream.

## DMA وZero-copy

DMA يسمح للجهاز بنقل Blocks من RAM أوإليها دون نسخ CPU لكل Byte. Zero-copy اسم لمجموعة تقنيات تقلل النسخ بين Buffers وطبقات Kernel/User Space؛ لا تعني عدم وجود أي حركة بيانات. استخدمها عندما يثبت القياس أن Copy Cost مؤثرة.

## تأكد من فهمك

<div class="lesson-quiz" role="list">
<section class="quiz-card" role="listitem"><div class="quiz-question-row"><span class="quiz-number">01</span><p>هل Page Fault خطأ قاتل دائمًا؟</p></div><details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة:</strong> لا؛ قد يكون طلبًا طبيعيًا لتحميل Page صحيحة، ويصبح خطأ فقط إذا كان الوصول غير صالح أوتعذر التعامل معه.</div></details></section>
<section class="quiz-card" role="listitem"><div class="quiz-question-row"><span class="quiz-number">02</span><p>ما الفرق الجوهري بين Buffer وCache؟</p></div><details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة:</strong> Buffer يحمل بيانات في طريقها بين طرفين، أما Cache فتحفظ نسخة يمكن عادة إعادة إنتاجها لتسريع الوصول.</div></details></section>
<section class="quiz-card" role="listitem"><div class="quiz-question-row"><span class="quiz-number">03</span><p>لماذا زيادة Swap لا تعادل زيادة RAM؟</p></div><details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة:</strong> التخزين أبطأ كثيرًا؛ Swap تساعد النجاة من الضغط لكنها قد تسبب Thrashing وLatency مرتفعة.</div></details></section>
<section class="quiz-card" role="listitem"><div class="quiz-question-row"><span class="quiz-number">04</span><p>لماذا flush لا يضمن Durability دائمًا؟</p></div><details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة:</strong> قد تنقل البيانات إلى Buffer أخرى في Kernel أوالجهاز؛ الضمان يحتاج Sync وFilesystem/Database contract مناسبًا.</div></details></section>
</div>
