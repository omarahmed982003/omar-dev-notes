---
title: "اقرأ ملفاتك واكتبها بالطرفية"
description: "اقرأ ملفاتك واكتبها بالطرفية"
sidebar:
  order: 12
prev: {"link":"/programming-basics/computer-in-depth/14-running-code/","label":"من خطوات الحل إلى برنامج يعمل"}
next: {"link":"/programming-basics/computer-in-depth/17-terminal-environment/","label":"قنوات الأوامر والصلاحيات والبيئة"}
---

الطرفية مفيدة لما عايز تكرر أوامر أو تشوف نتيجة عملية بوضوح. هنستخدم PowerShell على Windows ونشتغل في مجلد تدريب جديد. المطلوب تعرف تحفظ ملفًا وتحدد مكانه؛ لا تحتاج مشروعًا جاهزًا.

## الطرفية غير مفسّر الأوامر

**Terminal — الطرفية** نافذة تعرض إدخالًا وخرجًا نصيًا. **Shell — مفسّر أوامر** البرنامج الذي يقرأ الأمر ويشغله ويربطه بأوامر أخرى. PowerShell وBash وzsh وcmd أمثلة لمفسّرات أوامر، ولكل واحد قواعده.

**Process — عملية** نسخة برنامج تعمل الآن. مفسّر الأوامر قد ينفذ الأمر بنفسه أو يبدأ عملية أخرى. **Escaping — حماية رمز من التفسير الخاص** تختلف بين المفسّرات؛ مثلًا كتابة علامة اقتباس داخل نص لها صياغة تعتمد على الأداة. لا تنقل صياغة أمر من Bash إلى PowerShell بافتراض التطابق.

## مكانك ومسار الملف

**Working directory — مجلد العمل الحالي** نقطة البداية للمسار النسبي. **Path — مسار** يحدد مكان ملف، مش اسمه وحده.

- **Absolute path — مسار مطلق** يبدأ من جذر النظام أو القرص، مثل `C:\Users\Learner\note.txt`.
- **Relative path — مسار نسبي** يبدأ من مجلدك الحالي، مثل `.\note.txt`.
- `.` تعني المجلد الحالي، و`..` المجلد الأب الذي يحتويه.
- **Extension — امتداد** نهاية الاسم مثل .txt؛ لا يثبت وحده نوع البيانات الفعلي.

لو الأمر قال إن الملف مش موجود، اعرض مجلد العمل أولًا؛ يمكن الملف موجود في مكان مختلف، فلا تغيّر اسمه عشوائيًا.

## مساحة تدريب وأوامر تقرأ نتيجتها

افتح PowerShell على Windows. الأوامر التالية تنشئ مجلد تدريب جديدًا داخل مجلد المستخدم، ثم ملفًا نصيًا. لا تعتمد على وجود مجلد صاحب الشرح. لو المجلد موجود بالفعل، اختر اسمًا جديدًا:

```powershell
Set-Location $HOME
New-Item -ItemType Directory -Name terminal-practice
Set-Location .\terminal-practice
Set-Content -LiteralPath '.\note.txt' -Value 'Hello'
Get-Location
Get-ChildItem
Get-Content -LiteralPath '.\note.txt'
```

Set-Location يغيّر مجلد العمل، و$HOME متغير جاهز يشير لمجلد حسابك. New-Item ينشئ عنصرًا، وItemType يحدد أنه مجلد. Set-Content يكتب النص؛ لو استخدمته على ملف موجود يستبدل محتواه، لذلك اشتغل في مجلد التدريب الجديد. Get-Location يعرض المكان، وGet-ChildItem يعرض عناصره، وGet-Content يقرأ الملف. المتوقع رؤية note.txt ثم Hello. Tab يساعد في إكمال الاسم.

**Quoting — وضع النص بين علامات اقتباس** يحافظ على مسار فيه مسافات. **Wildcard — نمط اختيار** مثل النجمة قد يطابق ملفات كثيرة؛ LiteralPath يعامل المسار كما هو. **Recursive — شامل المجلدات الداخلية** يوسع نطاق العملية، لذلك راجع المسار قبل نقل أو حذف.


## قبل تجربة أمر واسع

اعرض المكان ومحتوياته، واقرأ المساعدة بواسطة Get-Help أوالخيار --help إذا كانت الأداة تدعمه. اقتبس المسار الذي فيه مسافات. **Bulk operation — عملية على عناصر كثيرة** و**Recursive — شاملة المجلدات الداخلية** توسع نطاق التعديل؛ جرّب على ملفات التدريب أولًا وراجع المسار قبل النقل والحذف.

لا تضع أسرارًا داخل نص الأمر إذا كان سيظهر في تاريخ الأوامر أو قائمة العمليات. **Script — ملف أوامر** يشغّل خطوات متتابعة؛ عليه فحص رمز الانتهاء والأخطاء عند الاعتماد على برامج أخرى.


## تأكد من فهمك

<div class="lesson-quiz" role="list">
<section class="quiz-card" role="listitem"><div class="quiz-question-row"><span class="quiz-number">01</span><p>ما الفرق بين Terminal وShell؟</p></div><details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة:</strong> Terminal تعرض الجلسة، وShell تفسر الأوامر وتبدأ العمليات وتربط الـStreams.</div></details></section>
<section class="quiz-card" role="listitem"><div class="quiz-question-row"><span class="quiz-number">02</span><p>لماذا يفشل Relative Path أحيانًا رغم وجود الملف؟</p></div><details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة:</strong> لأنه يُفسر من Working Directory الحالية، وقد تختلف عن مجلد Script أوالمشروع.</div></details></section>
<section class="quiz-card" role="listitem"><div class="quiz-question-row"><span class="quiz-number">03</span><p>لماذا نفصل stdout عن stderr؟</p></div><details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة:</strong> حتى تظل البيانات القابلة للمعالجة نظيفة بينما يمكن عرض أوتسجيل التشخيص منفصلًا.</div></details></section>
<section class="quiz-card" role="listitem"><div class="quiz-question-row"><span class="quiz-number">04</span><p>هل Environment Variable خزنة أسرار؟</p></div><details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة:</strong> لا؛ هي قناة إعداد وقد تتسرب. استخدم Secret Manager وصلاحيات وتدويرًا ومنعًا للتسجيل.</div></details></section>
</div>

## الخطوة التالية

كمّل في [قنوات الأوامر والصلاحيات والبيئة](/programming-basics/computer-in-depth/17-terminal-environment/) بعد تنفيذ التجربة هنا.
