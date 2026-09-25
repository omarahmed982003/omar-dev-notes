---
title: 4. CPU وGPU والمعالجة المتوازية
description: كيف ينفذ CPU التعليمات، وما دور الأنوية والخيوط والـCaches، ولماذا يختلف GPU في تصميمه واستخدامه.
sidebar:
  order: 4
---

## داخل CPU

ينفذ المعالج دورة Fetch–Decode–Execute. Program Counter يحدد التعليمة التالية، Control Unit تفكها وتنسق التنفيذ، ALU تنفذ الحساب والمنطق، Registers تحمل القيم الأقرب للتنفيذ، ووحدات أخرى تعالج Floating Point وVectors وBranches وMemory Access.

المعالجات الحديثة تنفذ عدة تعليمات في مراحل متداخلة وتستخدم Branch Prediction وOut-of-order Execution. لذلك “تعليمة واحدة كل Clock” تبسيط، والأداء لا يقاس بالـGHz وحده.

## Cores وThreads وClock وIPC

Core يستطيع تنفيذ Stream تعليمات مستقلًا. Hardware Thread يسمح بمشاركة بعض موارد Core لتحسين الاستفادة، لكنه ليس Core كاملًا. Clock يحدد عدد الدورات، وIPC يصف مقدار العمل المنجز في الدورة. الأداء يعتمد على الاثنين إضافة إلى الذاكرة والكود والحرارة وحدود الطاقة.

زيادة الأنوية تفيد فقط عندما يمكن تقسيم العمل. جزء Serial أوLock مشترك قد يحد التسارع وفق Amdahl's Law.

## Registers وL1/L2/L3 Cache

Registers أصغر وأسرع تخزين داخل Core. L1 صغيرة وسريعة جدًا، L2 أكبر وأبطأ، وL3 أكبر وغالبًا مشتركة. Cache تنقل البيانات في Cache Lines؛ الوصول المتجاور يستفيد من Locality، بينما القفز العشوائي يسبب Cache Misses وانتظار RAM.

Cache ليست RAM إضافية يديرها البرنامج عادة، ولا تضمن كتابة البيانات فورًا إلى التخزين. Cache Coherence تحافظ على رؤية معقولة بين Cores لكنها لا تستبدل Locks وAtomic Operations في البرامج المتزامنة.

## كيف يختلف GPU؟

CPU يحتوي عددًا أقل من Cores قوية محسنة للـLatency والتفرعات والمهام العامة. GPU يحتوي عددًا كبيرًا من وحدات أبسط لتنفيذ نفس العملية على بيانات كثيرة، فيبرع في الرسومات والمصفوفات وMachine Learning وScientific Computing.

Branching غير المنتظم ونقل البيانات الصغير المتكرر قد يقللان فائدة GPU. يجب نقل البيانات إلى ذاكرة GPU المنفصلة في البطاقات Discrete، ثم تشغيل Kernel وإعادة النتائج؛ كلفة النقل قد تكون أكبر من الحساب الصغير.

## Integrated وDiscrete GPU

Integrated GPU تشارك غالبًا ذاكرة النظام وميزانية الطاقة، وهي مناسبة للعرض وأعمال متوسطة. Discrete GPU تملك VRAM وطاقة وتبريدًا مستقلًا وأداء أعلى، لكن الوصول إلى RAM وVRAM ليس مجانيًا. Unified Memory قد تبسط البرمجة ولا تلغي كلفة الحركة الفيزيائية دائمًا.

## اختيار المعالج المناسب

| العمل | الأنسب غالبًا | السبب |
|---|---|---|
| Web request وقواعد عمل | CPU | فروع وI/O وLatency |
| ضغط ملف واحد صغير | CPU | كلفة الإرسال للـGPU لا تستحق |
| ضرب مصفوفات ضخمة | GPU | Data parallelism مرتفع |
| رسم ملايين Pixels | GPU | عمليات متشابهة على بيانات كثيرة |
| Database transaction | CPU | تحكم وذاكرة وI/O أكثر من حساب متجانس |

## تأكد من فهمك

<div class="lesson-quiz" role="list">
<section class="quiz-card" role="listitem"><div class="quiz-question-row"><span class="quiz-number">01</span><p>لماذا معالج 4GHz ليس دائمًا أسرع من 3.5GHz؟</p></div><details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة:</strong> تختلف IPC والمعمارية والـCache وعدد الأنوية وحدود الطاقة والحمل الفعلي.</div></details></section>
<section class="quiz-card" role="listitem"><div class="quiz-question-row"><span class="quiz-number">02</span><p>ما الفرق بين Core وHardware Thread؟</p></div><details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة:</strong> Core يملك وحدات تنفيذ فعلية، أما Hardware Thread فيشارك جزءًا من موارد Core لتحسين الاستفادة وليس Core مستقلًا كاملًا.</div></details></section>
<section class="quiz-card" role="listitem"><div class="quiz-question-row"><span class="quiz-number">03</span><p>متى يصبح GPU اختيارًا سيئًا؟</p></div><details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة:</strong> عندما يكون العمل صغيرًا أوSerial أوكثير التفرع أوتكلفة نقل البيانات أكبر من الحساب.</div></details></section>
<section class="quiz-card" role="listitem"><div class="quiz-question-row"><span class="quiz-number">04</span><p>كيف تؤثر Locality في الأداء؟</p></div><details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة:</strong> الوصول المتجاور يعيد استخدام Cache Lines، بينما الوصول العشوائي يزيد Cache Misses والانتظار على RAM.</div></details></section>
</div>
