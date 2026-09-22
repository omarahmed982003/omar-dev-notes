---
title: "الإدخال وبنية المصدر والأخطاء ومكتبة الرياضيات"
description: "الإدخال والإخراج جزء من تصميم البرنامج، وليس مجرد سطرين. تحقق من نجاح القراءة، وافهم حدود cin وgetline، وافصل خطأ البناء عن خطأ التشغيل والمنطق."
tableOfContents: true
---

## الفكرة العامة

الإدخال والإخراج جزء من تصميم البرنامج، وليس مجرد سطرين. تحقق من نجاح القراءة، وافهم حدود cin وgetline، وافصل خطأ البناء عن خطأ التشغيل والمنطق.

## المفاهيم التي تحتاجها

- cin يقرأ قيمًا مفصولة بالمسافات، وgetline يقرأ السطر كاملًا.
- بعد cin قد يبقى newline؛ استخدم std::ws قبل getline عند الانتقال بينهما.
- التعليقات تشرح السبب أو القيد، لا تعيد وصف السطر.
- التوجيه include يعالج قبل الترجمة؛ المصدر ثم يتحول إلى object ثم executable بالربط.
- cmath يوفر sqrt وpow وabs وfloor وceil وround، مع الانتباه للمجال والنوع.

## مثال

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
<div class="diagram-node input"><span>الفكرة العامة</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>المفاهيم التي تحتاجها</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>مثال</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node decision"><span>أخطاء شائعة وتصحيحات</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node output"><span>الخلاصة</span></div>
</div>
</div>

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

## الخلاصة

اكتب الحل على مراحل، فعّل التحذيرات، واختبر الحالة العادية والحدود والمدخل غير الصالح. عندما تستطيع تفسير سبب كل سطر تكون قد فهمت الفكرة بدل حفظها.
