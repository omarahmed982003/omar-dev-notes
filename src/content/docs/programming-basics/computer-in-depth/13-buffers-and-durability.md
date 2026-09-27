---
title: "نقل البيانات ومتى يصبح الحفظ ثابتًا"
description: "نقل البيانات ومتى يصبح الحفظ ثابتًا"
sidebar:
  order: 8
prev: {"link":"/programming-basics/computer-in-depth/12-memory-allocation/","label":"حجز الذاكرة وعمر البيانات"}
next: {"link":"/programming-basics/computer-in-depth/06-operating-systems/","label":"نظام التشغيل: البنية والأنواع وطريقة العمل"}
---

البرنامج ممكن ينتج بيانات أسرع من الجهاز اللي يستقبلها. هنفهم مكان الانتظار، ثم الفرق بين إرسال الكتابة وثباتها على وسيط التخزين.

## صندوق انتظار أم نسخة سريعة؟

برنامج يكتب100رسالة كل ثانية، والجهة الأخرى تقرأ60. تتراكم40رسالة كل ثانية. **Buffer — مخزن مؤقت للنقل** يحمل البيانات في الطريق. **Queue — طابور** ينظم ترتيب الانتظار. أما **Cache — نسخة لإعادة الاستخدام** فتحفظ نتيجة يمكن غالبًا جلبها أو حسابها مرة أخرى.

بعد10ثوانٍ يزيد الانتظار400رسالة. **Backpressure — إبطاء المنتج استجابة لبطء المستهلك** تمنع النمو بلا حد، أو نرفض عملًا جديدًا عند حد واضح. بعد وصول الكتابة للجهاز يأتي سؤال آخر: هل ستبقى بعد انقطاع الطاقة؟ ده معنى **Durability — ثبات البيانات بعد الفشل ضمن ضمان محدد**.

## Buffer وCache وQueue وStream وPool

| المفهوم | الهدف |
|---|---|
| Buffer (مساحة تحتفظ ببيانات مؤقتًا أثناء انتقالها بين طرفين مختلفي السرعة) | امتصاص فرق السرعة أوتجميع البيانات قبل النقل |
| Cache | الاحتفاظ بنسخة لتجنب حساب أوقراءة متكررة |
| Queue (طابور يعالج العناصر عادة بترتيب وصولها) | تنظيم وحدات عمل تنتظر المعالجة |
| Stream (تدفق بيانات متتابعة قد لا نعرف حجمه مقدمًا) | تدفق متتابع قد لا نعرف حجمه مقدمًا |
| Pool (مجموعة موارد جاهزة يعاد استخدامها بدل إنشائها كل مرة) | موارد جاهزة لإعادة الاستخدام مثل Connections أوWorkers |

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

`flush` قد يدفع البيانات من مكتبة إلى Kernel فقط؛ Kernel نفسه قد يحتفظ بها في Page Cache، وController أوDevice قد يملك Cache أخرى. إذا كان المطلوب Durability (ضمان بقاء البيانات المحفوظة وفق عقد محدد حتى بعد العطل) بعد انقطاع الكهرباء فاحتج إلى API (Application Programming Interface؛ اتفاق يسمح لبرنامج بطلب بيانات أو عملية من مكوّن آخر) وسياسة Filesystem/Database صريحة، لا مجرد طباعة أوإغلاق Stream.

## DMA وZero-copy

DMA (Direct Memory Access؛ نقل بيانات بين جهاز والذاكرة من غير نسخ المعالج لكل بايت) يسمح للجهاز بنقل Blocks من RAM أوإليها دون نسخ CPU لكل Byte. Zero-copy اسم لمجموعة تقنيات تقلل النسخ بين Buffers وطبقات Kernel/User Space؛ لا تعني عدم وجود أي حركة بيانات. استخدمها عندما يثبت القياس أن Copy Cost مؤثرة.


**تدريب وحل:** منتج يضيف 100 رسالة في الثانية ومستهلك يعالج60؛ الطابور يزيد40 كل ثانية. بعد10 ثوانٍ يزيد400 رسالة. حد حجم مع رفض أو إبطاء المنتج Backpressure يعالج النمو؛ زيادة RAM وحدها تؤجل الامتلاء. وflush، دفع البيانات من مخزن لآخر، لا يضمن وحده الحفظ بعد قطع الطاقة.

<section class="quiz-card" role="listitem"><div class="quiz-question-row"><span class="quiz-number">02</span><p>ما الفرق الجوهري بين Buffer وCache؟</p></div><details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة:</strong> Buffer يحمل بيانات في طريقها بين طرفين، أما Cache فتحفظ نسخة يمكن عادة إعادة إنتاجها لتسريع الوصول.</div></details></section>

<section class="quiz-card" role="listitem"><div class="quiz-question-row"><span class="quiz-number">04</span><p>لماذا flush لا يضمن Durability دائمًا؟</p></div><details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة:</strong> قد تنقل البيانات إلى Buffer أخرى في Kernel أوالجهاز؛ الضمان يحتاج Sync وFilesystem/Database contract مناسبًا.</div></details></section>
