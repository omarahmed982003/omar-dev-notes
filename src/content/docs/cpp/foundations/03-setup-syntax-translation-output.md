---
title: "إعداد C++ والصياغة والترجمة والإخراج"
description: "C++ لغة مترجمة تمنح تحكمًا عاليًا بالأداء والذاكرة. تعلّم بنية البرنامج وخط البناء أهم من ربط التعلم ببيئة تطوير واحدة."
tableOfContents: true
---

## الفكرة العامة

C++ لغة مترجمة تمنح تحكمًا عاليًا بالأداء والذاكرة. تعلّم بنية البرنامج وخط البناء أهم من ربط التعلم ببيئة تطوير واحدة.

## المفاهيم التي تحتاجها

- المحرر يكتب الملفات، والمترجم يفحصها ويحولها، والـIDE يجمع أدوات متعددة.
- التعليمة Statement تنفذ فعلًا، والتعبير Expression ينتج قيمة، والـToken أصغر وحدة ذات معنى.
- يبدأ التنفيذ من main، والقيمة 0 تعني نجاحًا تقليديًا.
- iostream يوفّر أدوات الإدخال والإخراج، وstd مساحة أسماء المكتبة القياسية.
- خط البناء يشمل preprocessing ثم compilation ثم assembly ثم linking.

## مثال

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

## الخلاصة

اكتب الحل على مراحل، فعّل التحذيرات، واختبر الحالة العادية والحدود والمدخل غير الصالح. عندما تستطيع تفسير سبب كل سطر تكون قد فهمت الفكرة بدل حفظها.
