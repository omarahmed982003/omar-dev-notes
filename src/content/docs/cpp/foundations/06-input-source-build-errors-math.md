---
title: "8. الإدخال والتحويلات والحدود والرياضيات"
sidebar:
  order: 8
description: "الإدخال والإخراج جزء من تصميم البرنامج، وليس مجرد سطرين. تحقق من نجاح القراءة، وافهم حدود cin وgetline، وافصل خطأ البناء عن خطأ التشغيل والمنطق."
tableOfContents: true
---

## قراءة البيانات وكتابة النتائج

الإدخال والإخراج جزء من تصميم البرنامج، وليس مجرد سطرين. تحقق من نجاح القراءة، وافهم حدود cin وgetline، وافصل خطأ البناء عن خطأ التشغيل والمنطق.

## cin وgetline وحالة الـStream

يقرأ `std::cin >> value` الرموز بعد تخطي المسافات، ثم يحاول تحويلها إلى نوع المتغير. إذا أدخل المستخدم نصًا في مكان عدد، يدخل الـStream حالة فشل ولا تتغير القراءات التالية حتى تمسح الحالة وتتخلص من الإدخال غير الصالح.

تقرأ `std::getline` السطر كاملًا بما فيه المسافات حتى نهاية السطر. بعد استخدام `>>` تبقى محرف نهاية السطر غالبًا، ولذلك يمكن كتابة `std::getline(std::cin >> std::ws, name)` لتخطي المسافة البيضاء المتبقية قبل قراءة الاسم.

التعليق الجيد يشرح سبب قرار أو قيد لا يظهر من الكود. أما `#include` فهو توجيه يعالجه الـPreprocessor قبل الترجمة. ينتج المترجم ملف Object، ثم يربط الـLinker هذا الملف بالتعريفات المطلوبة ليصنع الملف التنفيذي.

يوفر `<cmath>` دوال مثل `sqrt` و`pow` و`floor` و`ceil` و`round`. يجب فحص مجال الدالة ونوع القيمة المعادة. `sqrt` لا يعطي نتيجة حقيقية لعدد سالب، و`pow` قد يستخدم حسابًا عائمًا حتى عندما تبدو المدخلات صحيحة.

## مثال: قراءة رقم وسطر بأمان

```cpp
#include <iostream>
#include <string>

int main() {
    int age{};
    std::string name;
    if (!(std::cin >> age)) return 1;
    std::getline(std::cin >> std::ws, name);
    std::cout << name << " is " << age << "\n";
}
```

## أخطاء شائعة وتصحيحات

- رسالة linker تختلف عن syntax error؛ ابحث عن تعريف مفقود أو تكرار رموز.
- sqrt لقيمة سالبة في الأعداد الحقيقية لا يعطي نتيجة صالحة.

## خريطة الدرس

<div class="lesson-diagram" role="img" aria-label="خريطة مفاهيم: الإدخال وبنية المصدر والأخطاء ومكتبة الرياضيات">
<p class="lesson-diagram-title">خريطة مفاهيم: الإدخال وبنية المصدر والأخطاء ومكتبة الرياضيات</p>
<div class="diagram-flow">
<div class="diagram-node input"><span>Input Token</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>Stream State</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>Range Validation</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node decision"><span>Calculation</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node output"><span>Output أو Error واضح</span></div>
</div>
</div>

## حالة الـStream

تعيد عملية `>>` الـStream نفسه، ويتحول إلى False عند فشل القراءة. بعد الفشل تبقى القيمة الجديدة غير مقروءة وتظل حالة الخطأ حتى تستدعي `clear()`، وقد تحتاج `ignore()` لتجاوز النص المسبب للمشكلة.

```cpp
int age{};
while (!(std::cin >> age) || age < 0 || age > 120) {
    std::cout << "Invalid age\n";
    std::cin.clear();
    std::cin.ignore(std::numeric_limits<std::streamsize>::max(), '\n');
}
```

عند استخدام `getline` بعد `>>` قد تقرأ نهاية السطر المتبقية كسطر فارغ. استخدم `std::ws` عند ملاءمته أو نظف الـDelimiter بوضوح.

## التحويل وحدود النوع

قسمة Integer على Integer تنتج Integer. حوّل أحد الطرفين قبل القسمة لحفظ الكسر. لا يحمي `static_cast` من Overflow أو قيمة خارج المجال. استخدم `numeric_limits<T>::min()` و`max()` و`lowest()` وخصائص Floating point لفهم النوع على المنصة الحالية.

## cmath والتقريب

توفر `<cmath>` دوال `sqrt` و`pow` و`abs` و`round` و`ceil` و`floor`. `ceil` يتجه إلى موجب اللانهاية و`floor` إلى سالبها، لذلك يختلفان مع الأعداد السالبة. لحساب Ceiling division لأعداد موجبة يمكن استخدام `(a + b - 1) / b` بعد فحص Overflow أو `a / b + (a % b != 0)`.

## ترجمة الصيغة إلى كود

حدد الرموز ووحداتها أولًا، ثم اكتب القيم الوسيطة بأسماء. مساحة دائرة هي `πr²` وليست `2πr`، ومساحة مستطيل ضرب الطول في العرض لا جمعهما. اختبر صفرًا وقيمة سالبة إن كانت غير صالحة وقيمة كبيرة قد تتجاوز المجال.

## Source structure

توضع التصريحات المشتركة في Header والتعريفات في `.cpp`. استخدم Namespace لتنظيم الأسماء، ولا تعتمد على ترتيب تضمين عشوائي. اجعل كل ملف يضم مباشرة ما يحتاجه كي لا ينجح البناء بالصدفة بسبب Header آخر.

## إصلاح Stream بعد إدخال غير صالح

عندما تفشل `std::cin` في تحويل النص، يظل الرمز غير الصالح في الإدخال وتُضبط Failbit. يجب مسح الحالة ثم تجاهل بقية السطر قبل إعادة المحاولة:

```cpp
std::cin.clear();
std::cin.ignore(std::numeric_limits<std::streamsize>::max(), '\n');
```

ضع القراءة داخل حلقة تحقق إذا كان البرنامج تفاعليًا. أما في برنامج تنافسي أو أداة تقرأ ملفًا محدد البنية، فقد يكون إنهاء التنفيذ برسالة خطأ أنسب من طلب الإدخال مرة أخرى.

## تنسيق الإخراج

يوفر `<iomanip>` أدوات مثل `std::fixed` و`std::setprecision` و`std::setw`. مع `fixed` تحدد `setprecision(2)` عدد الخانات بعد العلامة. هذا يغير طريقة العرض فقط ولا يحول `double` إلى قيمة مالية دقيقة.

## مجال الدوال الرياضية

تحتاج `sqrt` إلى قيمة غير سالبة في الحساب الحقيقي، وتحتاج القسمة إلى مقام غير صفر. وقد تفقد `pow` الدقة أو تنتج Overflow. استخدم الضرب المباشر مثل `x * x` للقوى الصحيحة الصغيرة عندما يكون أوضح وأدق، وافحص `std::isfinite` إذا كانت الحسابات قد تنتج Infinity أو NaN.

## Compile Error وLink Error وRuntime Error وLogic Error

يظهر Compile Error أثناء تحليل ملف مصدر، مثل فاصلة منقوطة مفقودة أو نوع غير متوافق. يظهر Link Error بعد نجاح ترجمة الملفات عندما لا يجد الـLinker تعريف دالة أو يجد تعريفات متكررة. يظهر Runtime Error أثناء التشغيل، مثل وصول غير صالح للذاكرة. أما Logic Error فيعطي نتيجة خاطئة من غير أن يتوقف البرنامج.

ابدأ بأول رسالة خطأ حقيقية في كودك؛ كثير من الرسائل التالية تكون نتيجة لها. فعّل التحذيرات، وقلّص المثال، وثبت المدخل الذي يعيد المشكلة قبل تعديل الكود.

## تأكد من فهمك

<div class="lesson-quiz" role="list">
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">01</span><p>لماذا يقرأ getline سطرًا فارغًا بعد cin &gt;&gt; age؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> يبقى محرف newline في Stream؛ استخدم getline(cin &gt;&gt; ws, name) أو تعامل مع الباقي صراحة.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">02</span><p>كيف تتحقق من فشل إدخال رقم؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> اختبر حالة Stream مثل if (!(cin &gt;&gt; value))، ثم عالج الخطأ ونظف الإدخال قبل الاستمرار.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">03</span><p>صنّف: header مفقود، قسمة على صفر، ومعادلة خصم خاطئة.</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> الأول خطأ بناء، والثاني خطأ تشغيل أو سلوك غير صالح حسب النوع، والثالث خطأ منطقي.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">04</span><p>لماذا sqrt يحتاج تحققًا رغم أن الكود يُترجم؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> المترجم يتحقق من النوع لا من قيمة التشغيل؛ الجذر الحقيقي لقيمة سالبة خارج المجال ويعطي NaN.</div></details>
</section>
</div>
