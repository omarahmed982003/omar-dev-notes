---
title: 8. الطرفية والملفات والصلاحيات والبيئة
description: Shell والمسارات والملفات والصلاحيات ومتغيرات البيئة وPipes وExit Codes والعمل الآمن من الطرفية.
sidebar:
  order: 8
---

## Terminal وShell

Terminal واجهة نصية تعرض الإدخال والإخراج، بينما Shell برنامج يقرأ الأوامر ويفسر الاقتباس والتوسعات والـPipes ثم يبدأ Processes. أمثلة: PowerShell وBash وzsh و`cmd.exe`. الأمر نفسه قد تختلف صياغته بين Shells، لذلك لا تنسخ Escaping من Bash إلى PowerShell بلا فهم.

## المسارات والـWorking Directory

المسار المطلق يبدأ من Root أوDrive، والنسبي يُفسر انطلاقًا من Current Working Directory. `.` يعني الحالي و`..` الأب. اسم الملف ليس هو Path، ووجود Extension لا يضمن نوع المحتوى الحقيقي.

```powershell
Get-Location
Get-ChildItem
Set-Location C:\my_docs
Get-Content .\package.json
```

استخدم إكمال Tab و`-LiteralPath` عندما يحتوي الاسم محارف خاصة. قبل حذف أو نقل Recursive اطبع المسار المحلول وتأكد أنه داخل النطاق المقصود.

## الملفات والمجلدات والMetadata

الملف Bytes مع Metadata مثل الحجم والأوقات والمالك والصلاحيات. المجلد يربط أسماء بإدخالات. Rename داخل Filesystem نفسها قد يكون تعديل Metadata سريعًا، بينما النقل بين أقراص قد يعني Copy ثمDelete. Symbolic Link يشير إلى Path آخر ولا ينسخ البيانات.

## Users وGroups وPermissions

الصلاحيات تقرر من يستطيع القراءة والكتابة والتنفيذ. على Unix تُفهم غالبًا كـowner/group/others، بينما Windows يستخدم ACLs أكثر تفصيلًا. لا تجعل ملفات الأسرار قابلة للقراءة لكل المستخدمين، ولا تشغّل Server بصلاحية Administrator/Root بلا حاجة.

Executable Permission لا تعني أن الملف آمن، وامتلاك Read لا يعني السماح بتنفيذ محتواه داخل التطبيق.

## Environment Variables

هي Key/Value يرثها Child Process عادة من Parent. مناسبة لإعدادات البيئة، لكنها ليست خزنة أسرار بذاتها وقد تظهر في Process inspection أوCrash reports أوLogs. استخدم Secret Manager للإنتاج، وتحقق من وجود القيم ونوعها وحدودها عند بدء التطبيق.

```powershell
$env:APP_ENV = 'development'
Get-ChildItem Env:APP_ENV
```

التغيير داخل Process لا يعدل الجهاز كله تلقائيًا ولا يغير Processes بدأت بالفعل.

## stdin وstdout وstderr وExit Code

البرنامج يقرأ من Standard Input ويكتب النتيجة العادية إلى Standard Output والتشخيص إلى Standard Error. Exit Code صفر يعني نجاحًا عادة، وغير الصفر يصنف الفشل. هذا يسمح للـShell وCI بالتعامل مع البرنامج دون تحليل نص بشري.

```text
producer stdout | consumer stdin
errors ----------------> stderr
status ----------------> exit code
```

Pipe تمرر Stream وليست ملفًا مؤقتًا بالضرورة. Backpressure قد تجعل المنتج ينتظر إذا كان المستهلك أبطأ. Redirection تغير وجهة Stream، لذلك لا تخلط Progress messages مع Output معد للمعالجة.

## أوامر آمنة ومفيدة

- اكتشف المكان والمحتوى قبل التعديل.
- استخدم `--help` أو`Get-Help` واقرأ المعاملات.
- اقتبس Paths التي تحتوي Spaces.
- جرّب على ملف مؤقت قبل Bulk operation.
- لا تمرر أسرارًا في Command line إذا كانت ستظهر في History أوProcess list.
- افحص Exit Code وstderr في Scripts وCI.

## تأكد من فهمك

<div class="lesson-quiz" role="list">
<section class="quiz-card" role="listitem"><div class="quiz-question-row"><span class="quiz-number">01</span><p>ما الفرق بين Terminal وShell؟</p></div><details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة:</strong> Terminal تعرض الجلسة، وShell تفسر الأوامر وتبدأ العمليات وتربط الـStreams.</div></details></section>
<section class="quiz-card" role="listitem"><div class="quiz-question-row"><span class="quiz-number">02</span><p>لماذا يفشل Relative Path أحيانًا رغم وجود الملف؟</p></div><details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة:</strong> لأنه يُفسر من Working Directory الحالية، وقد تختلف عن مجلد Script أوالمشروع.</div></details></section>
<section class="quiz-card" role="listitem"><div class="quiz-question-row"><span class="quiz-number">03</span><p>لماذا نفصل stdout عن stderr؟</p></div><details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة:</strong> حتى تظل البيانات القابلة للمعالجة نظيفة بينما يمكن عرض أوتسجيل التشخيص منفصلًا.</div></details></section>
<section class="quiz-card" role="listitem"><div class="quiz-question-row"><span class="quiz-number">04</span><p>هل Environment Variable خزنة أسرار؟</p></div><details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة:</strong> لا؛ هي قناة إعداد وقد تتسرب. استخدم Secret Manager وصلاحيات وتدويرًا ومنعًا للتسجيل.</div></details></section>
</div>
