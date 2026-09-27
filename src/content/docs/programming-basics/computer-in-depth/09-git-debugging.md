---
title: "احفظ تاريخ ملفاتك وادمج التغييرات"
description: "احفظ تاريخ ملفاتك وادمج التغييرات"
sidebar:
  order: 14
prev: {"link":"/programming-basics/computer-in-depth/17-terminal-environment/","label":"قنوات الأوامر والصلاحيات والبيئة"}
next: {"link":"/programming-basics/computer-in-depth/16-testing-and-debugging/","label":"اختبر السلوك وحدّد سبب الخطأ"}
---


## أول تاريخ محلي تقدر تراجعه

**Git** برنامج إدارة تاريخ الملفات؛ نزّله من [موقع Git الرسمي](https://git-scm.com/downloads) لو مش موجود. افتح PowerShell واكتب git --version؛ المطلوب رقم إصدار بدل رسالة أن الأمر غير معروف. في مجلد تدريب جديد داخل حسابك:

```powershell
Set-Location $HOME
New-Item -ItemType Directory -Name git-practice
Set-Location .\git-practice
git init
git config user.name "Learning Example"
git config user.email "learner@example.invalid"
Set-Content -LiteralPath note.txt -Value 'First version'
git status
git add note.txt
git diff --staged
git commit -m "Add practice note"
git log --oneline
```

اختَر اسم مجلد جديدًا لو موجود بالفعل. git init ينشئ مستودعًا، وconfig هنا يضع هوية تدريب داخل هذا المستودع فقط. status يعرض الحالة. add يختار محتوى الملف للقطة القادمة؛ منطقة الاختيار اسمها Staging area أوIndex. diff --staged يعرض المختار، وcommit يسجل اللقطة، وlog يعرض تاريخها. هذه أوامر محلية لا تنشر شيئًا.

عدّل النص إلى Second version، ثم git diff؛ المتوقع سطر محذوف وآخر مضاف. ## Git يحفظ لقطات من تاريخ الملفات

**Git** برنامج لتسجيل تاريخ الملفات. **Snapshot — لقطة** حالة محتوى الملفات عند نقطة محددة. Repository (مستودع يحفظ تاريخ ملفات المشروع ومراجعه) يحتوي تاريخ المشروع. **Working tree — ملفات العمل الحالية** هي الملفات التي تعدلها، **Staging area — منطقة اختيار التغييرات** تختار ما يدخل Commit (لقطة مختارة من التغييرات لها معرّف ورسالة)، واللقطة لها معرّف ورسالة وهوية صاحبها، وقد تشير إلى لقطة سابقة اسمها Parent. Git لا يفهم “ميزة” تلقائيًا؛ أنت تختار تغييرات مترابطة وتكتب رسالة تشرح السبب.

```text
Working tree -- git add --> Index -- git commit --> Repository history
```

`git status` أول أمر قبل التعديل وبعده. استخدم `git diff` لمراجعة غير المضاف و`git diff --staged` لمراجعة ما سيُحفظ.

## Branch وMerge

Branch (اسم يشير إلى نقطة في التاريخ ويتحرك مع تسجيل تغييرات عليها) اسم متحرك يشير إلى Commit. إنشاء Branch رخيص لأنه لا ينسخ المشروع كاملًا. Merge (دمج تاريخ تغييرات فرعين) يجمع تاريخين، وFast-forward يحرك المؤشر عندما لا يوجد تفرع. Rebase (إعادة بناء تغييرات فوق نقطة أخرى، فتتغير معرّفاتها) يعيد تشغيل Commits فوق Base جديدة ويغير هوياتها؛ لا تعِد كتابة تاريخ مشترك بلا تنسيق.

## التعارض: Git محتاج قرارك

**Conflict — تعارض** لا يعني أن Git تعطل؛ يعني أنه لا يستطيع اختيار النتيجة الصحيحة. اقرأ الطرفين والسياق، ابنِ النسخة المقصودة، شغّل الاختبارات، ثم أضف الملف المكتمل. **Markers — علامات التعارض** تحدد أجزاء من الطرفين؛ لا تحذف العلامات فقط دون اختيار المحتوى الصحيح.

## Remote وPull Request

**Remote — مستودع بعيد** عنوان لنسخة أخرى من المشروع تتبادل معها التغييرات. `fetch` يجلب المراجع دون دمج، بينما `pull` يجلب ثم يدمج أوRebase حسب الإعداد. **Pull request — طلب مراجعة ودمج** مساحة مراجعة وليست بديلًا عن Commits واضحة واختبارات ناجحة.

لا تضع كلمات مرور أوAPI (Application Programming Interface؛ اتفاق يسمح لبرنامج بطلب بيانات أو عملية من مكوّن آخر) Keys، مفاتيح تسمح لبرنامج باستدعاء خدمة، في Git. حذفها من Commit لاحق لا يبطل السر؛ أبطل المفتاح القديم وأنشئ بديلًا، ثم عالج وجوده في التاريخ والنسخ عند الحاجة.

## تأكد من فهمك

<div class="lesson-quiz" role="list">
<section class="quiz-card" role="listitem"><div class="quiz-question-row"><span class="quiz-number">01</span><p>ما الفرق بين Working Tree وStaging Area؟</p></div><details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة:</strong> Working Tree كل التعديلات الحالية، والـStaging Area الاختيار المحدد للـCommit التالي.</div></details></section>
<section class="quiz-card" role="listitem"><div class="quiz-question-row"><span class="quiz-number">02</span><p>ماذا تفعل بعد حل Conflict وقبل Commit؟</p></div><details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة:</strong> راجع النتيجة كاملة، شغّل الاختبارات، تأكد من غياب Markers، ثم Stage للملف المقصود.</div></details></section>
<section class="quiz-card" role="listitem"><div class="quiz-question-row"><span class="quiz-number">03</span><p>لماذا لا يكفي حذف Secret من آخر Commit؟</p></div><details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة:</strong> القيمة قد تبقى في التاريخ والنسخ والـLogs؛ يجب تدويرها ثم معالجة التاريخ والانتشار.</div></details></section>
<section class="quiz-card" role="listitem"><div class="quiz-question-row"><span class="quiz-number">04</span><p>ما قيمة Regression Test؟</p></div><details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة:</strong> يعيد الحالة التي كشفت العطل ويفشل إذا عاد السبب في تغيير لاحق.</div></details></section>
</div>

## الخطوة التالية

كمّل في [اختبر السلوك وحدّد سبب الخطأ](/programming-basics/computer-in-depth/16-testing-and-debugging/) بعد تنفيذ التجربة هنا.

## جرّب فرعين وتعارضًا في مجلد التدريب

نفّذ بعد أول commit في المجلد الجديد فقط. `branch -M main` يسمي الفرع الحالي main، و`switch -c` ينشئ فرعًا وينتقل له. هنغيّر نفس سطر الملف بطريقتين:

```powershell
git branch -M main
git switch -c practice-change
Set-Content -LiteralPath note.txt -Value 'Branch version'
git add note.txt
git commit -m "Change note on practice branch"
git switch main
Set-Content -LiteralPath note.txt -Value 'Main version'
git add note.txt
git commit -m "Change note on main"
git merge practice-change
```

المتوقع تعارض لأن النسختين غيّرتا نفس السطر. افتح note.txt: العلامات `<<<<<<<` و`=======` و`>>>>>>>` تفصل البدائل؛ ليست النص النهائي. اختر معنى الحل واكتب `Combined learning note` بدل الكتلة كلها، واحفظ، ثم نفّذ `git add note.txt` و`git commit -m "Resolve practice conflict"`. افحص `git status`: لا يبقى تعارض. `git log --oneline --graph --all` يرسم التاريخ النصي. لم نرفع شيئًا لأي موقع.
## راجع التاريخ بعد تجربة الدمج

**Parent** لقطة سابقة تشير إليها اللقطة الحالية. **Fast-forward** تحريك اسم فرع لتاريخ امتد منه مباشرة. **Conflict markers** علامات داخل ملف يضعها Git لإظهار أجزاء التعارض؛ لا تحذفها عشوائيًا دون حل المعنى.

**restore** يسترجع محتوى ملفات أو اختيارها حسب الخيارات؛ **revert** يضيف لقطة تعكس أثر لقطة سابقة؛ **reset** يغيّر موضع المرجع وقد يغير منطقة الاختيار أو الملفات حسب الخيارات. ليست أسماء لعملية واحدة، ولا نحتاج تجربة خيارات تمسح العمل لفهم الفرق.

**تدريب وحل:** لقطةA تحسب2+3=5، وB استبدلت + بـ- فأعطت-1، وC عدلت تعليقًا فقط. أول لقطة فاشلة هيB. git bisect يضيّق البحث بنصف التاريخ كل مرة حسب حكم اختبارك. **Arrange–Act–Assert** في الاختبار يعني جهز المدخل، نفذ، ثم قارن بالمتوقع. **CI (Continuous Integration؛ دمج تغييرات الكود مع فحوص آلية متكررة)** تشغيل فحوص آلية عند دمج التغييرات؛ البداية من نسخة نظيفة تكشف ملفات نسيت إدخالها في التاريخ.
