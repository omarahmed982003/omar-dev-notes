---
title: 9. Git وDebugging والاختبارات الأساسية
description: Repository وCommit وBranch وMerge وConflict ومنهج تشخيص الخطأ وبناء اختبارات تمنع رجوعه.
sidebar:
  order: 9
---

## Git يحفظ تاريخ Snapshots

Repository تحتوي تاريخ المشروع. Working Tree هي الملفات الحالية، Staging Area تختار ما يدخل Commit، وCommit لقطة لها Parent ورسالة وهوية. Git لا يفهم “ميزة” تلقائيًا؛ أنت تختار تغييرات مترابطة وتكتب رسالة تشرح السبب.

```text
Working tree -- git add --> Index -- git commit --> Repository history
```

`git status` أول أمر قبل التعديل وبعده. استخدم `git diff` لمراجعة غير المضاف و`git diff --staged` لمراجعة ما سيُحفظ.

## Branch وMerge

Branch اسم متحرك يشير إلى Commit. إنشاء Branch رخيص لأنه لا ينسخ المشروع كاملًا. Merge يجمع تاريخين، وFast-forward يحرك المؤشر عندما لا يوجد تفرع. Rebase يعيد تشغيل Commits فوق Base جديدة ويغير هوياتها؛ لا تعِد كتابة تاريخ مشترك بلا تنسيق.

## Conflict

Conflict لا يعني أن Git تعطل؛ يعني أنه لا يستطيع اختيار النتيجة الصحيحة. اقرأ الطرفين والسياق، ابنِ النسخة المقصودة، شغّل الاختبارات، ثم أضف الملف المكتمل. لا تحذف Markers فقط دون فهم السلوك.

## Remote وPull Request

Remote نسخة أخرى من Repository. `fetch` يجلب المراجع دون دمج، بينما `pull` يجلب ثم يدمج أوRebase حسب الإعداد. Pull Request مساحة مراجعة وليست بديلًا عن Commits واضحة واختبارات ناجحة.

لا تضع Passwords أوAPI Keys في Git. حذفها من Commit لاحق لا يبطل السر؛ دوّره ونظف التاريخ عند الحاجة.

## Debugging بمنهج علمي

1. أعد المشكلة بمدخل ثابت.
2. اكتب Expected وActual.
3. حدد آخر نقطة كانت صحيحة.
4. اجمع Evidence من Logs وDebugger وTests.
5. ضع فرضية واحدة واختبرها بتغيير صغير.
6. أصلح السبب وأضف Regression Test.

`git bisect` يستطيع البحث الثنائي في التاريخ إذا عرفت Commit جيدة وأخرى سيئة، بشرط وجود طريقة تميّز النجاح من الفشل.

## أنواع الاختبارات

- Unit: منطق صغير سريع ومعزول.
- Integration: تفاعل مكونات مثل Database أوFilesystem.
- End-to-end: رحلة مستخدم عبر النظام.
- Regression: يثبت أن عطلًا معروفًا لن يعود.

الاختبار الجيد يرتب Arrange–Act–Assert، وله سبب فشل واحد واضح، ولا يعتمد على وقت أوشبكة عشوائية بلا تحكم.

## تأكد من فهمك

<div class="lesson-quiz" role="list">
<section class="quiz-card" role="listitem"><div class="quiz-question-row"><span class="quiz-number">01</span><p>ما الفرق بين Working Tree وStaging Area؟</p></div><details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة:</strong> Working Tree كل التعديلات الحالية، والـStaging Area الاختيار المحدد للـCommit التالي.</div></details></section>
<section class="quiz-card" role="listitem"><div class="quiz-question-row"><span class="quiz-number">02</span><p>ماذا تفعل بعد حل Conflict وقبل Commit؟</p></div><details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة:</strong> راجع النتيجة كاملة، شغّل الاختبارات، تأكد من غياب Markers، ثم Stage للملف المقصود.</div></details></section>
<section class="quiz-card" role="listitem"><div class="quiz-question-row"><span class="quiz-number">03</span><p>لماذا لا يكفي حذف Secret من آخر Commit؟</p></div><details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة:</strong> القيمة قد تبقى في التاريخ والنسخ والـLogs؛ يجب تدويرها ثم معالجة التاريخ والانتشار.</div></details></section>
<section class="quiz-card" role="listitem"><div class="quiz-question-row"><span class="quiz-number">04</span><p>ما قيمة Regression Test؟</p></div><details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة:</strong> يعيد الحالة التي كشفت العطل ويفشل إذا عاد السبب في تغيير لاحق.</div></details></section>
</div>
