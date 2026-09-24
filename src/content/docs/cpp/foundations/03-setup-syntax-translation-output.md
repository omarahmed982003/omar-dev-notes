---
title: "3. مقدمة C++ والأدوات وأول برنامج"
sidebar:
  order: 3
description: "C++ لغة مترجمة تمنح تحكمًا عاليًا بالأداء والذاكرة. تعلّم بنية البرنامج وخط البناء أهم من ربط التعلم ببيئة تطوير واحدة."
tableOfContents: true
---

## ما لغة C++؟

C++ لغة مترجمة تمنح تحكمًا عاليًا بالأداء والذاكرة. تعلّم بنية البرنامج وخط البناء أهم من ربط التعلم ببيئة تطوير واحدة.

## المحرر والـCompiler والـIDE

المحرر يغيّر الملفات النصية فقط. الـCompiler يقرأ كود C++ ويفحص قواعده وأنواعه ثم ينتج كودًا أقرب إلى الآلة. الـIDE يجمع المحرر وأوامر البناء والمصحح `Debugger` وإدارة المشروع في واجهة واحدة، لكنه لا يستبدل المترجم.

أصغر وحدة لها معنى في المصدر تسمى `Token`، مثل اسم متغير أو رقم أو عامل `+`. مجموعة Tokens يمكن أن تكوّن `Expression` ينتج قيمة، مثل `price * quantity`. وعندما يصبح التعبير جزءًا من أمر كامل ينتهي غالبًا بفاصلة منقوطة نحصل على `Statement`.

يبدأ البرنامج المستقل من الدالة `main`. إرجاع `0` يخبر نظام التشغيل تقليديًا أن التنفيذ نجح. الرأس `<iostream>` يصرّح بأدوات الإدخال والإخراج، و`std` هي مساحة الأسماء التي تضع فيها المكتبة القياسية أسماء مثل `cout`.

يمر المصدر عادة بالـPreprocessor، ثم التحليل والترجمة، ثم توليد ملف Object، وأخيرًا يربط الـLinker الملفات والمكتبات ليصنع الملف التنفيذي. درس الـCompiler التالي يشرح كل مرحلة بالتفصيل.

## أول برنامج C++

```cpp
#include <iostream>

int main() {
    std::cout << "Hello, C++!\n";
    return 0;
}
```

## أخطاء شائعة وتصحيحات

- فعّل التحذيرات واقرأ أول رسالة مرتبطة بكودك.
- لا تضع using namespace std في ملفات header أو المشاريع الكبيرة بلا حاجة.

## الأدوات والمعيار

المحرر يغيّر النص، والـIDE يضيف إدارة المشروع والبناء وDebugger، لكن المترجم الحقيقي يكون MSVC أو GCC أو Clang. اختر معيارًا واضحًا للمشروع مثل C++20 أو C++23، ولا تفترض أن كل ميزة جديدة مدعومة في كل Toolchain.

## مراحل البناء بالتفصيل

1. يعالج Preprocessor أوامر `#include` و`#define` والـConditional compilation.
2. يحلل Compiler الـTokens والصياغة والأنواع ويبني تمثيلًا وسيطًا ثم يولد كودًا.
3. يحول Assembler التعليمات إلى Object file يحتوي Machine code ورموزًا غير محسومة.
4. يجمع Linker ملفات Object والمكتبات، ويبلغ عن التعريفات المفقودة أو المكررة.

يمكن ترجمة ملفات `.cpp` بصورة منفصلة ثم ربطها. لذلك قد ينجح Compile لملف ويظهر الخطأ لاحقًا في Link إذا استدعيت دالة صرحت بها ولم توفر تعريفها.

## تشخيص الأخطاء

- **Syntax/compile error:** صياغة أو نوع غير صالح، مثل فاصلة منقوطة مفقودة.
- **Link error:** تصريح موجود لكن التعريف مفقود أو مكرر.
- **Runtime error:** بدأ البرنامج ثم فشل أثناء التنفيذ.
- **Logic error:** انتهى البرنامج دون انهيار لكن الناتج خاطئ.

اقرأ أول خطأ حقيقي، وافصل رسالة المترجم عن الأسطر التابعة لها. أنشئ أصغر مثال يعيد المشكلة، وأصلح سببًا واحدًا ثم أعد البناء.

<div class="lesson-diagram" role="img" aria-label="مراحل تحويل كود C++ إلى ملف تنفيذي">
<p class="lesson-diagram-title">مراحل تحويل كود C++ إلى ملف تنفيذي</p>
<div class="diagram-flow">
<div class="diagram-node input"><span>Source .cpp</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>Preprocessor</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>Compiler</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>Assembler</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node decision"><span>Linker</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node output"><span>Executable</span></div>
</div>
</div>

## لماذا C++؟

C++ لغة عالية المستوى تمنح وصولًا مباشرًا نسبيًا إلى الذاكرة والموارد. تستخدم في المحركات والألعاب والمتصفحات والأنظمة المضمنة والبرامج التي تحتاج أداءً وتحكمًا. هذا التحكم يجعل أخطاء العمر والحدود والتحويلات أخطر، لذلك تعلمها يبني انضباطًا في الأنواع والملكية.

تطورت اللغة من C++98 إلى تحديث C++11 الكبير، ثم C++14 و17 و20 و23. يحدد خيار `-std=` أو إعداد المشروع المعيار المستخدم. المعيار يصف اللغة والمكتبة، أما Compiler فيطبق هذا الوصف بدرجات دعم مختلفة.

## IDE والمحرر والـToolchain

المحرر يغير الملفات، والـIDE يضيف Projects وDebugger وتكامل البناء. Visual Studio يوفر MSVC عند تثبيت Desktop development with C++، وVS Code يحتاج Compiler وإضافات منفصلة، وCode::Blocks قد يأتي مع Toolchain في بعض الحزم. اختيار الأداة لا يغير قواعد اللغة.

في Visual Studio أنشئ Console App، وافتح ملف `.cpp`، واستخدم `Ctrl+F5` للتشغيل دون Debugger و`F5` معه. على الطرفية يمكن بناء الملف بـ`g++ main.cpp -o app` ثم تشغيل الناتج.

## Tokens وExpressions وStatements

`price + tax` تعبير ينتج قيمة. `total = price + tax;` Statement تنفذ إسنادًا وتنتهي بفاصلة منقوطة. تتكون الصياغة من Tokens مثل الكلمات المحجوزة والأسماء والـLiterals والمعاملات وعلامات الترقيم.

## تشريح أول برنامج

```cpp
#include <iostream>

int main()
{
    std::cout << "Hello, world!\n";
    return 0;
}
```

يجعل Header التصريحات متاحة، و`main` نقطة دخول البرنامج، و`std::cout` Standard output stream، و`<<` يرسل البيانات إلى Stream، و`return 0` يبلغ عن إنهاء ناجح. يسمح المعيار بالوصول ضمنيًا إلى نهاية `main` كإرجاع صفر، لكن كتابة القيمة توضح الفكرة للمبتدئ.

## النصوص وEscape sequences

داخل String literal تعني `\n` سطرًا جديدًا و`\t` Tab و`\"` علامة اقتباس و`\\` Backslash. يختلف Character literal مثل `'A'` عن String literal مثل `"A"`. لا تستخدم `std::endl` لمجرد سطر جديد لأنه يضيف Flush غالبًا؛ استخدم `\n` ثم Flush عندما تحتاجه فعلًا.

## Namespaces والمكتبة القياسية

تمنع Namespace تعارض الأسماء. ينتمي `cout` و`cin` و`string` إلى `std`. كتابة `std::cout` توضح الاسم الكامل، بينما `using namespace std;` يدخل أسماء كثيرة وقد يصنع تعارضات، خصوصًا داخل Headers.

```cpp
namespace school { int students{120}; }
namespace company { int students{45}; }

std::cout << school::students << ' ' << company::students;
```

## ملفات المصدر وHeader Files

يحمل ملف `.cpp` تعريفات قابلة للترجمة. ويحتوي Header عادة على تصريحات الأنواع والدوال التي تحتاجها أكثر من Translation Unit. الـDeclaration يخبر المترجم باسم الدالة ونوع مدخلاتها ونتيجتها، أما الـDefinition فيحتوي الجسم الذي سينفذ.

إذا وضعت تعريف دالة عادية في Header وضمّنته في أكثر من ملف فقد تحصل على Multiple Definition عند الربط. تستخدم Include Guards أو `#pragma once` لمنع معالجة Header نفسه أكثر من مرة داخل Translation Unit واحدة، لكنها لا تلغي قاعدة التعريف الواحد.

```cpp
// calculator.hpp
#pragma once
int add(int left, int right);

// calculator.cpp
#include "calculator.hpp"
int add(int left, int right) {
    return left + right;
}
```

## أوامر البناء والتحذيرات

```bash
g++ -std=c++20 -Wall -Wextra -Wpedantic main.cpp -o app
```

يحدد `-std=c++20` معيار اللغة. وتفعل الخيارات `-Wall -Wextra -Wpedantic` تحذيرات تكشف قيمًا غير مهيأة وتحويلات وشروطًا مشكوكًا فيها. يحدد `-o app` اسم الملف التنفيذي. التحذير لا يوقف البناء دائمًا، لكنه يستحق الفهم والإصلاح بدل إخفائه.

يمكن فصل الترجمة عن الربط:

```bash
g++ -std=c++20 -Wall -Wextra -c calculator.cpp -o calculator.o
g++ -std=c++20 -Wall -Wextra -c main.cpp -o main.o
g++ main.o calculator.o -o app
```

ينتج الخيار `-c` ملف Object ولا يشغّل الـLinker. تسمح هذه الطريقة بإعادة ترجمة الملف المتغير فقط ثم ربط الملفات من جديد.

## main وقيمة الخروج ووسائط التشغيل

يمكن أن تستقبل `main` وسائط من سطر الأوامر. يمثل `argc` عدد العناصر، ويحتوي `argv[0]` عادة على اسم البرنامج. تعني قيمة الخروج صفر النجاح تقليديًا، بينما تعبر قيمة أخرى عن فشل يستطيع Shell أو Script اكتشافه.

## Standard Output وStandard Error والـBuffer

يرسل `std::cout` النتائج العادية إلى Standard Output، بينما يناسب `std::cerr` رسائل الخطأ. قد يجمع الـStream النص في Buffer قبل إرساله لتحسين الأداء. يضيف `\n` سطرًا جديدًا، أما `std::endl` فيضيف السطر ويجبر الـStream على Flush، لذلك لا تستخدمه بعد كل سطر من غير حاجة.

## تأكد من فهمك

<div class="lesson-quiz" role="list">
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">01</span><p>ما الفرق بين IDE وCompiler؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> الـIDE واجهة تجمع التحرير والبناء والتصحيح، بينما Compiler أداة تحول المصدر وتفحصه؛ يمكن استخدام أحدهما دون الآخر.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">02</span><p>لماذا قد تنجح Compilation ثم يفشل Linking؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> كل ملف قد يكون صحيحًا منفردًا، لكن Linker لا يجد تعريف رمز مستخدم أو يجد تعريفات متكررة.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">03</span><p>ما وظيفة main وما معنى return 0؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> main نقطة دخول البرنامج المستضاف، و0 إشارة تقليدية لنظام التشغيل بأن التنفيذ انتهى بنجاح.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">04</span><p>كيف تتعامل مع عشر رسائل مترجم ناتجة من خطأ واحد؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> ابدأ بأول رسالة مرتبطة بمصدرِك، أصلحها وأعد البناء؛ الأخطاء التالية قد تكون آثارًا متسلسلة.</div></details>
</section>
</div>
