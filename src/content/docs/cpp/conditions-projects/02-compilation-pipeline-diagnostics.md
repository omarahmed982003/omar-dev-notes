---
title: "4. الـCompiler ومراحل البناء والتشخيص"
description: "رحلة برنامج C++ من Source Code إلى Translation Unit وTokens وAST وIR وAssembly وObject Files ثم الربط والتحميل، مع تفسير الأخطاء والتحذيرات."
sidebar:
  order: 4
tableOfContents: true
---

## لماذا يحتاج كود C++ إلى ترجمة؟

المعالج ينفذ تعليمات آلة خاصة بمعماريته، بينما نكتب C++ بصياغة مفهومة للبشر. يحول Toolchain البرنامج إلى ملف مناسب لنظام التشغيل والمعالج المستهدف. لا يقوم برنامج واحد بكل العمل بالضرورة؛ كلمة «Compiler» تستخدم أحيانًا للواجهة التي تنسق مجموعة مراحل وأدوات.

```text
Source files
  ↓ Preprocessor
Translation units
  ↓ Compiler frontend + optimizer + backend
Assembly or machine code
  ↓ Assembler
Object files
  ↓ Linker + libraries
Executable
  ↓ Operating-system loader
Running process
```

قد يدمج Toolchain بعض المراحل، وقد لا يحفظ ملف Assembly على القرص، لكن النموذج يفسر نوع كل خطأ ومكانه.

## Compiler وInterpreter وJIT

| النموذج | وقت الترجمة | الناتج المعتاد |
|---|---|---|
| Ahead-of-time compilation | قبل التشغيل | Object files وملف تنفيذي للمنصة |
| Interpretation | أثناء التشغيل | ينفذ Runtime المصدر أو تمثيلًا وسيطًا |
| Bytecode + VM + JIT | قبل التشغيل وأثناءه | Bytecode ثم كود آلة للمسارات الساخنة |

C++ تستخدم عادة ترجمة مسبقة إلى Native code. Java وC# تجمعان بين Intermediate code وVirtual machine، ومحركات JavaScript قد تفسر ثم تستخدم JIT. لذلك تقسيم اللغات إلى «مترجمة» و«مفسرة» فقط تبسيط، لأن التنفيذ الفعلي تحدده المنظومة.

## أشهر Toolchains

- **GCC** ويستخدم الأمر `g++` عادة لربط مكتبة C++ تلقائيًا.
- **Clang** بواجهة `clang++` وبنية LLVM.
- **MSVC** ويستخدم `cl` على ويندوز.

المترجم والمكتبة القياسية ونظام التشغيل والمعمارية وإعدادات البناء تؤثر جميعًا في الميزات والـABI وشكل الملف التنفيذي والرسائل.

```bash
g++ -std=c++20 -Wall -Wextra -Wpedantic main.cpp -o app
clang++ -std=c++20 -Wall -Wextra -Wpedantic main.cpp -o app
cl /std:c++20 /W4 /EHsc main.cpp
```

استخدم إعداد Debug أثناء التعلم ليحتفظ بمعلومات التصحيح، ثم قارن Release بعد تفعيل التحسينات. لا تجعل سرعة Release عذرًا لإخفاء Undefined Behavior.

## البرنامج الذي سيتحرك عبر المراحل

```cpp
#include <iostream>
#define TAX_RATE 0.14

int add(int a, int b)
{
    return a + b;
}

int main()
{
    int price{100};
    double total = price + price * TAX_RATE;
    std::cout << add(10, 20) << '\n';
    std::cout << total << '\n';
}
```

الناتج المتوقع `30` ثم `114`. الماكرو يوضح Preprocessing، لكن `constexpr double taxRate{0.14};` أفضل لقيمة عادية لأنه يملك نوعًا ونطاقًا ويخضع لقواعد C++.

## 1. Preprocessing

يعالج Preprocessor الأسطر التي تبدأ غالبًا بـ`#` قبل تحليل C++ الطبيعي:

- `#include` يضم تصريحات Header في عملية الترجمة.
- `#define` يجري Token substitution.
- `#if` و`#ifdef` و`#ifndef` تختار أجزاء من المصدر حسب الإعداد.
- `#pragma once` أو Header Guards يمنعان تضمين التعريفات نفسها أكثر من مرة داخل Translation Unit.

بعد التوسيع تصبح `TAX_RATE` قريبة من `0.14`. يظل الناتج C++، ولم ينتج Machine code بعد.

### Translation Unit

كل ملف `.cpp` بعد Preprocessing مع محتوى Headers المضمّن يشكل Translation Unit مستقلة. لذلك قد يطول البناء عندما يتغير Header واسع الاستخدام، لأن ملفات كثيرة تحتاج إعادة ترجمة.

Headers تقدم تصريحات وأنواعًا مشتركة، أما التعريفات غير المناسبة للتكرار فتوضع في `.cpp`. تضمين ملف `.cpp` بدل Header يسبب غالبًا تعريفات مكررة وتنظيمًا خاطئًا للبناء.

## 2. Lexical analysis وTokens

يقسم Compiler Frontend النص إلى وحدات ذات معنى:

```cpp
int x = 10 + 20;
```

ينتج بصورة مبسطة: الكلمة المحجوزة `int`، والاسم `x`، وعامل الإسناد، والعددين، وعامل الجمع، والفاصلة المنقوطة. Tokenization تتعرف إلى القطع لكنها لا تثبت أن ترتيبها أو معناها صحيح.

التعليقات لا تصبح تعليمات تنفيذ. يزيلها مسار الترجمة المبكر عادة، لذلك لا تزيد سرعة البرنامج ولا تقللها.

## 3. Parsing وAST

يفحص Parser ترتيب Tokens وفق Grammar اللغة ويبني **Abstract Syntax Tree** تمثل البنية. التعبير:

```cpp
10 + 20 * 3
```

يضع الضرب أعمق من الجمع، لذلك يحسب `20 * 3` أولًا. يعكس هذا أولوية المعاملات حتى لو لم تكتب أقواسًا. الأقواس توثق نيتك وتجعل المراجعة أسهل.

خطأ مثل `int x = ;` يفشل نحويًا لأن التعبير بعد `=` مفقود. وقد يشير Diagnostic إلى Token تالٍ لأن المترجم لم يتأكد من الخطأ إلا عند الوصول إليه.

## 4. Semantic analysis

بعد صحة البنية يفحص المترجم المعنى القانوني:

- هل الاسم معرّف وفي Scope مناسب؟
- هل الأنواع متوافقة؟
- أي Overload يجب اختياره؟
- هل التحويل مسموح؟
- هل قواعد الوصول و`const` والقوالب صحيحة؟

```cpp
int count = "Hello"; // البنية واضحة، لكن النوع غير متوافق
unknown = 10;        // الاسم غير معرّف
```

قد ينتج خطأ واحد رسائل تابعة كثيرة. أصلح أول سبب مرتبط بكودك ثم أعد البناء بدل معالجة كل سطر كأنه مشكلة مستقلة.

## 5. Intermediate Representation

قد يحول المترجم AST إلى **IR** أسهل للتحليل والتحسين وأكثر استقلالًا عن المعالج:

```text
temp1 = b * c
temp2 = a + temp1
x = temp2
```

هذا Pseudocode تعليمي وليس LLVM IR حقيقيًا. تختلف الصيغة بين المترجمات، وقد يستخدم Compiler أكثر من IR في مراحل مختلفة.

## 6. Optimization

يحاول Optimizer تحسين البرنامج دون تغيير السلوك الملحوظ المطلوب لبرنامج سليم:

- **Constant folding:** يحسب `10 * 20` أثناء البناء.
- **Dead-code elimination:** يحذف فرعًا ثابتًا غير قابل للوصول.
- **Inlining:** يدمج جسم دالة صغيرة في موضع الاستدعاء عندما يكون مناسبًا.
- **Loop optimizations:** يعيد ترتيب أو يوسع بعض أعمال الحلقة وفق القيود.

لا يستطيع المترجم الحفاظ على معنى برنامج يعتمد على Undefined Behavior. مثلًا تجاوز مجال Signed integer أو استخدام كائن بعد انتهاء عمره يسمح بافتراضات تحسين قد تنتج سلوكًا غير متوقع.

## 7. Code generation والـAssembly

يختار Backend تعليمات المعمارية المستهدفة. قد تتحول دالة جمع على x86-64 إلى تعليمات تشبه:

```asm
mov eax, edi
add eax, esi
ret
```

هذا مثال توضيحي؛ أسماء Registers وطريقة تمرير المعاملات تتبع **Calling Convention** والـABI. Windows x64 وSystem V x86-64 وARM64 لا تستخدم الترتيب نفسه بالضرورة.

Assembly لغة نصية بأسماء مثل `mov` و`add`. أما Assembler فهو الأداة التي ترمز هذه التعليمات إلى Bytes يفهمها المعالج.

## 8. Object File

ينتج Assembler ملف `.o` أو `.obj`. غالبًا لا يمكن تشغيله وحده، وقد يحتوي:

- أقسامًا لكود الآلة والبيانات الثابتة والمتغيرة.
- **Symbols** للتعريفات التي يوفرها وللمراجع التي يحتاجها.
- **Relocation entries** لمواضع لا تُعرف عناوينها النهائية بعد.
- Debug information تربط التعليمات بأسطر المصدر.
- Metadata خاصة بصيغة الملف مثل ELF أو COFF.

وجود Machine code داخل Object file لا يعني أنه برنامج كامل، لأن عناوين ودوالًا ومكتبات قد تظل غير محسومة.

## 9. Separate Compilation

```cpp
// math.cpp
int add(int a, int b) { return a + b; }
```

```cpp
// main.cpp
int add(int, int); // declaration
int main() { return add(10, 20); }
```

يترجم كل ملف إلى Object file مستقل. يعرف `main.obj` شكل الدالة من التصريح لكنه يحتاج تعريفها، بينما يوفر `math.obj` التعريف. تسمح هذه الآلية بإعادة ترجمة الملفات المتغيرة فقط، مع إعادة بناء الملفات المتأثرة إذا تغير Header.

## 10. Linking

يجمع Linker ملفات Object والأجزاء المطلوبة من المكتبات ويحل المراجع:

```text
main.obj: needs add(int, int)
math.obj: provides add(int, int)
Linker: matches the required symbol with its definition
```

### أخطاء Linker الشائعة

- **Undefined reference / unresolved external:** التصريح معروف لكن التعريف غير موجود، أو ملفه/مكتبته لم تدخل أمر الربط، أو Signature غير مطابق.
- **Multiple definition:** ظهر تعريف غير `inline` أكثر من مرة، غالبًا بسبب وضعه في Header بصورة غير صحيحة.
- **Library order أو architecture mismatch:** المكتبة غير متوافقة أو لم تُربط بالطريقة المطلوبة.

قد ينتج الربط ملفًا تنفيذيًا مكتفيًا بأجزاء مكتبات ثابتة، أو ملفًا يعتمد على Dynamic libraries تُحمّل عند التشغيل.

## 11. Loading والتشغيل

بعد نجاح البناء يقرأ نظام التشغيل صيغة الملف التنفيذي، وينشئ Process وVirtual address space، ويحمّل أقسام البرنامج والمكتبات المطلوبة، ويجهز Stack وHeap، ثم ينقل التحكم إلى كود البداية الذي يصل في النهاية إلى `main`.

نجاح Build لا يضمن نجاح Run. قد يفشل تحميل مكتبة ديناميكية، أو تظهر مشكلة في الإدخال، أو يحدث Undefined Behavior، أو يعمل البرنامج لكنه يطبق صيغة خاطئة.

## أنواع المشكلات

| النوع | المثال | المرحلة |
|---|---|---|
| Preprocessor error | Header غير موجود أو `#if` غير مغلق | Preprocessing |
| Syntax error | فاصلة منقوطة مفقودة | Parsing |
| Semantic/type error | إسناد String إلى `int` | Semantic analysis |
| Link error | تعريف دالة مفقود | Linking |
| Load error | مكتبة ديناميكية مطلوبة غير موجودة | Loading |
| Runtime failure | قسمة صحيحة على صفر أو وصول غير صالح | Execution |
| Logic error | `area = width + height` | البرنامج يعمل لكن النتيجة خاطئة |
| Warning | تضييق `double` إلى `int` أو متغير غير مستخدم | Build ينجح غالبًا |

التحذير ليس ضمان فشل، لكنه Finding يجب فهمه. فعّل مستوى تحذير قويًا، وتعامل مع التحذيرات الجديدة كأخطاء في المشروع التعليمي.

## طريقة تشخيص عملية

1. أعد المشكلة بأصغر Input ثابت.
2. حدد هل الفشل في Build أم Link أم Load أم Run أم النتيجة.
3. اقرأ أول Diagnostic متعلق بملفك، مع اسم الملف والسطر ونوع المشكلة.
4. قلّل الكود حتى يبقى السبب وحده.
5. أصلح تغييرًا واحدًا وأعد البناء من الحالة النظيفة عند الشك في ملفات قديمة.
6. أضف Test يمنع رجوع الخطأ.

## خريطة الدرس

<div class="lesson-diagram" role="img" aria-label="مراحل تحويل برنامج C++ من المصدر إلى عملية تعمل">
<p class="lesson-diagram-title">من Source Code إلى Running Process</p>
<div class="diagram-flow">
<div class="diagram-node input"><span>Source + Headers</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>Preprocessor</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>Tokens + AST + Semantics</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>IR + Optimization + Codegen</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>Object Files</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node decision"><span>Linker</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node output"><span>Executable + Loader</span></div>
</div>
</div>

## تأكد من فهمك

<div class="lesson-quiz" role="list">
<section class="quiz-card" role="listitem"><div class="quiz-question-row"><span class="quiz-number">01</span><p>ما الفرق بين Source file وTranslation Unit وObject file؟</p></div><details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> Source file هو الملف المكتوب. Translation Unit هي صورته بعد Preprocessing والتضمينات. Object file ناتج مترجم يحوي كود آلة وSymbols وRelocations لكنه قد لا يكون قابلًا للتشغيل وحده.</div></details></section>
<section class="quiz-card" role="listitem"><div class="quiz-question-row"><span class="quiz-number">02</span><p>لماذا قد تكون الصياغة صحيحة ويظهر Semantic error؟</p></div><details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> Grammar قد تقبل شكل الإسناد، لكن تحليل الأنواع أو الأسماء يثبت أن القيمة لا تناسب النوع أو أن الاسم غير معروف.</div></details></section>
<section class="quiz-card" role="listitem"><div class="quiz-question-row"><span class="quiz-number">03</span><p>ماذا يضيف IR بين AST وكود الآلة؟</p></div><details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> تمثيلًا داخليًا أسهل للتحليل والتحسين وأقل ارتباطًا بصياغة المصدر أو معمارية واحدة.</div></details></section>
<section class="quiz-card" role="listitem"><div class="quiz-question-row"><span class="quiz-number">04</span><p>لماذا يظهر Undefined reference بعد نجاح ترجمة كل ملف؟</p></div><details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> لأن Compiler احتاج التصريح فقط، لكن Linker لم يجد تعريف الرمز في أي Object file أو مكتبة مربوطة.</div></details></section>
<section class="quiz-card" role="listitem"><div class="quiz-question-row"><span class="quiz-number">05</span><p>هل التحسين يستطيع تغيير سلوك برنامج سليم؟ وماذا عن Undefined Behavior؟</p></div><details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> يجب أن يحافظ على السلوك الملحوظ المطلوب لبرنامج ذي سلوك معرّف. عند Undefined Behavior لا تقدم اللغة الضمان نفسه، وقد تبدو نتيجة التحسين غريبة.</div></details></section>
<section class="quiz-card" role="listitem"><div class="quiz-question-row"><span class="quiz-number">06</span><p>صنّف: Header مفقود، متغير غير معرّف، دالة بلا تعريف، مكتبة DLL مفقودة، صيغة مساحة خاطئة.</p></div><details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> Header في Preprocessing، المتغير في Semantic analysis، الدالة في Linking، المكتبة في Loading، وصيغة المساحة Logic error أثناء الاختبار.</div></details></section>
</div>
