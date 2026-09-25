---
title: "6. نظام التشغيل: البنية والأنواع وطريقة العمل"
description: Kernel وUser Mode وSystem Calls والعمليات والخيوط والجدولة والذاكرة والملفات والتعريفات وأنواع أنظمة التشغيل.
sidebar:
  order: 6
---

## Kernel وOperating System وDistribution

Kernel هو الجزء المميز الذي يدير CPU والذاكرة والأجهزة والعزل. Operating System يشمل Kernel وأدوات النظام والمكتبات والخدمات وواجهة الاستخدام. Linux اسم Kernel، بينما Ubuntu مثلًا Distribution تجمع Kernel وحزمًا وسياسات. Windows وmacOS أنظمة كاملة بأنوية ومكونات مختلفة.

## User Mode وKernel Mode

التطبيق يعمل عادة بصلاحيات محدودة في User Mode. عندما يحتاج ملفًا أوSocket أوMemory Mapping يستدعي System Call؛ Kernel يتحقق من المعاملات والصلاحيات ثم يتعامل مع الجهاز أوالمورد. الفصل يمنع البرنامج العادي من تنفيذ تعليمات حساسة أوقراءة ذاكرة Process أخرى مباشرة.

## Process وThread والجدولة

Process حاوية موارد وAddress Space وهوية وصلاحيات. Threads داخلها تشارك الذاكرة والملفات لكن لكل منها Stack وحالة تنفيذ. Scheduler يوزع CPU time ويوقف Thread ويستأنف أخرى عبر Context Switch. كثرة Threads قد تزيد التبديل والتنافس بدل تسريع البرنامج.

حالات Process الشائعة: Ready وRunning وBlocked/Sleeping وTerminated. انتظار Disk أوNetwork يجعل Thread Blocked، فيستطيع CPU تشغيل غيرها.

## إدارة الذاكرة

Kernel ينشئ Address Space ويضبط Page Tables ويعالج Page Faults ويدير Shared Memory وMemory-mapped files وSwap. Protection bits تمنع الكتابة في Code Pages أوالتنفيذ من Data Pages وفق السياسة. OOM policy تقرر ما يحدث عندما لا تكفي الموارد.

## Filesystems وI/O وDrivers

Filesystem ينظم أسماء الملفات والمجلدات والMetadata والصلاحيات ويربطها بBlocks تخزين. Page Cache تسرع القراءة والكتابة. Driver يتعامل مع Controller، وInterrupt أوPolling يبلغان النظام بالأحداث. File Descriptor/Handle يمثل موردًا مفتوحًا؛ يجب إغلاقه أوترك Runtime يديره بعقد واضح.

## Users وGroups وPermissions

نظام التشغيل يربط Process بهوية وصلاحيات. طبّق Least Privilege: Web Server لا يعمل كـAdministrator/Root، والـService Account لا يصل إلا للملفات والمنافذ اللازمة. Permissions ليست بديلًا عن تشفير الأسرار أوعزل الشبكة لكنها طبقة أساسية.

## أنواع أنظمة التشغيل

- Desktop: تفاعل رسومي وتطبيقات مستخدم.
- Server: خدمات طويلة العمر وإدارة عن بعد واعتمادية.
- Mobile: طاقة وحساسات وSandbox وتوزيع تطبيقات مقيد.
- Embedded: وظيفة محددة وموارد صغيرة.
- Real-time: حدود زمنية يمكن التنبؤ بها؛ Hard Real-time يعتبر تجاوز الموعد فشلًا.
- Hypervisor: يدير Virtual Machines وقد يعمل مباشرة على العتاد أوفوق OS.

Windows وLinux وmacOS تشترك في المبادئ: Processes وVirtual Memory وFiles وDrivers، لكنها تختلف في APIs والـKernel architecture والأدوات وFilesystem conventions والتوزيع والترخيص. اختر حسب التطبيق والتشغيل لا حسب شعار “الأفضل مطلقًا”.

## رحلة فتح برنامج

```text
Shell/GUI → create process → loader maps executable/libraries
          → virtual memory + stack + handles
          → scheduler runs first thread
          → program uses system calls for files/network/devices
```

## تأكد من فهمك

<div class="lesson-quiz" role="list">
<section class="quiz-card" role="listitem"><div class="quiz-question-row"><span class="quiz-number">01</span><p>هل Linux وUbuntu الشيء نفسه؟</p></div><details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة:</strong> Linux Kernel، أما Ubuntu فتوزيعة تجمعه مع أدوات وحزم وخدمات وسياسات.</div></details></section>
<section class="quiz-card" role="listitem"><div class="quiz-question-row"><span class="quiz-number">02</span><p>لماذا يحتاج التطبيق إلى System Call؟</p></div><details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة:</strong> لأنه لا يملك في User Mode صلاحية إدارة الجهاز والذاكرة المحمية مباشرة؛ Kernel يتحقق وينفذ العملية.</div></details></section>
<section class="quiz-card" role="listitem"><div class="quiz-question-row"><span class="quiz-number">03</span><p>ما الذي تشاركه Threads داخل Process؟</p></div><details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة:</strong> Address Space وموارد مثل الملفات غالبًا، مع Stack وحالة تنفيذ مستقلة لكل Thread.</div></details></section>
<section class="quiz-card" role="listitem"><div class="quiz-question-row"><span class="quiz-number">04</span><p>ما الفرق بين Server OS وReal-time OS؟</p></div><details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة:</strong> Server يركز على الخدمات والسعة والاعتمادية، بينما Real-time يركز على ضمان حدود زمن الاستجابة وقابليتها للتنبؤ.</div></details></section>
</div>
