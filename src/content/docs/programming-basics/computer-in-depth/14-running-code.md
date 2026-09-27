---
title: "من خطوات الحل إلى برنامج يعمل"
description: "من خطوات الحل إلى برنامج يعمل"
sidebar:
  order: 11
prev: {"link":"/programming-basics/computer-in-depth/03-binary-languages-algorithms/","label":"تمثيل الأعداد والحروف في الذاكرة"}
next: {"link":"/programming-basics/computer-in-depth/05-os-terminal-files-git/","label":"اقرأ ملفاتك واكتبها بالطرفية"}
---

بعد فهم تمثيل القيم، هنتتبع تعليمات البرنامج: مين يحوّلها ومين يشغّلها، وليه البرنامج قد يحتاج مكتبة خارجية.

## من الخوارزمية إلى البرنامج

1. حدّد المدخلات والمخرجات والقيود.
2. اكتب خطوات مستقلة عن اللغة باستخدام Pseudocode (وصف شبه برمجي للخطوات؛ للتفكير وليس صياغة لغة جاهزة للتشغيل) أو Flowchart (مخطط انسيابي يعرض الخطوات والقرارات بأسهم).
3. اختبر الخطوات يدويًا بحالة عادية وحدّية وغير صالحة.
4. ترجمها إلى كود، ثم قارن السلوك بالنتيجة المتوقعة.
5. قِس الوضوح والصحة أولًا، ثم حسّن الأداء عندما يثبت القياس وجود مشكلة.

Compiler: مترجم يحول كودًا إلى تعليمات آلة أو تمثيل آخر قابل للتنفيذ بأداة مناسبة. Interpreter: مفسر ينفذ الكود أو تمثيله أثناء التشغيل.

<div class="lesson-diagram" role="img" aria-label="من المشكلة إلى تعليمات ينفذها الجهاز">
<p class="lesson-diagram-title">من المشكلة إلى تعليمات ينفذها الجهاز</p>
<div class="diagram-flow diagram-pipeline">
<div class="diagram-node input"><span>المشكلة</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>الخوارزمية</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>كود المصدر</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node decision"><span>Compiler / Interpreter</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node output"><span>تعليمات قابلة للتنفيذ</span></div>
</div>
</div>

## Compiler وInterpreter وRuntime وJIT

يحول Compiler المصدر قبل التشغيل إلى كود آلة أو تمثيل وسيط. ينفذ Interpreter التعليمات أو التمثيل أثناء التشغيل. يوفر Runtime (بيئة تنفيذ اللغة والخدمات التي تحتاجها؛ غير معنى وقت التشغيل الزمني) خدمات تحتاجها اللغة مثل إدارة الذاكرة والاستثناءات والمكتبات. يجمع JIT (Just-In-Time compilation؛ ترجمة أجزاء من البرنامج أثناء تشغيله) أجزاء أثناء التشغيل اعتمادًا على الاستخدام الفعلي. كثير من المنصات تمزج أكثر من نموذج، لذلك لا تختصر اللغة في وصف «مترجمة» أو «مفسرة» فقط.

## Library وDependency ونسخة التشغيل

المكتبة كود قابل لإعادة الاستخدام، والـDependency شيء يعتمد عليه المشروع. قد تكون المكتبة Static فتدخل في الملف التنفيذي، أو Dynamic تُحمّل وقت التشغيل. اختلاف النسخ قد يغير API (Application Programming Interface؛ اتفاق يسمح لبرنامج بطلب بيانات أو عملية من مكوّن آخر) أو السلوك، ولذلك تسجل المشاريع الإصدارات وتستخدم Lock Files أو أدوات بناء قابلة لإعادة الإنتاج.
