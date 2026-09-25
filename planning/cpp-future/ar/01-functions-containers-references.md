---
title: "الدوال والحاويات والمراجع"
description: "قسّم البرنامج إلى دوال واضحة، واختر array أو vector أو string حسب شكل البيانات، ومرّر القيم بأمان باستخدام القيمة أو المرجع."
pagefind: false
tableOfContents: true
---

## لماذا نحتاج الدوال؟

عندما يكبر البرنامج لا يجب أن تبقى كل الخطوات داخل `main`. الدالة تسمي مهمة واحدة، وتحدد مدخلاتها وناتجها، وتسمح باختبارها وإعادة استخدامها.

```cpp
double finalPrice(double subtotal, double discountRate)
{
    return subtotal * (1.0 - discountRate);
}
```

يفصل **التصريح** اسم الدالة وأنواعها عن **التعريف** الذي يحتوي الجسم. يحتاج المترجم إلى معرفة التصريح قبل أول استدعاء، بينما يجد Linker التعريف النهائي عند ربط الملفات.

## القيمة والمرجع وconst

التمرير بالقيمة ينسخ المعامل، لذلك لا يغير الأصل. المرجع `T&` يسمح بتعديل الأصل. المرجع الثابت `const T&` يمنع التعديل ويتجنب نسخ كائن كبير.

```cpp
void addTax(double& total, double rate) { total *= 1.0 + rate; }
double average(const std::vector<int>& values);
```

استخدم قيمة للأنواع الصغيرة عندما تريد استقلالًا، و`const&` للقراءة من كائن كبير، و`&` فقط عندما يكون تعديل الوسيط جزءًا واضحًا من عقد الدالة. تجنب إعادة Reference لمتغير محلي لأنه ينتهي عند خروج الدالة.

## النطاق والعمر

المتغير المحلي يعيش حتى نهاية Block. والمتغير `static` المحلي يحتفظ بقيمته بين الاستدعاءات. افصل بين **Scope** الذي يحدد أين يظهر الاسم و**Lifetime** الذي يحدد متى يوجد الكائن فعليًا.

## array وvector وstring

| النوع | الحجم | الاستخدام |
|---|---|---|
| `std::array<T, N>` | ثابت ومعروف وقت الترجمة | عدد عناصر ثابت مع واجهة آمنة |
| `std::vector<T>` | يتغير أثناء التشغيل | القائمة العامة الافتراضية |
| `std::string` | نص قابل للتعديل | معالجة النصوص والبحث والدمج |

```cpp
std::vector<int> scores{75, 91, 60};
scores.push_back(84);

int total = 0;
for (int score : scores) total += score;
double avg = scores.empty() ? 0.0
                            : static_cast<double>(total) / scores.size();
```

الفهرس يبدأ من صفر. `operator[]` لا يفحص الحدود، بينما `at()` يرمي استثناءً عند فهرس غير صالح. قد يعيد `vector` حجز ذاكرته عند النمو، لذلك قد تصبح المؤشرات والمراجع لعناصره القديمة غير صالحة.

## تقسيم الملفات

ضع التصريحات العامة في Header محمي بـ`#pragma once` أو Header Guards، والتعريفات في ملفات `.cpp`. لا تستخدم `using namespace std;` في Header لأنه يلوث مساحة أسماء كل ملف يضمه.

## مثال مترابط

ابنِ برنامج درجات بثلاث دوال: `readScores` للإدخال، و`average` للحساب، و`printReport` للعرض. بهذا يصبح اختبار الحساب مستقلًا عن الطرفية، ويمكن لاحقًا استبدال الإدخال بملف دون إعادة كتابة المنطق.

## تأكد من فهمك

<div class="lesson-quiz" role="list">
<section class="quiz-card" role="listitem"><div class="quiz-question-row"><span class="quiz-number">01</span><p>متى تختار const T&amp; بدل T؟</p></div><details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة:</strong> عند قراءة كائن كبير دون نسخه ودون السماح بتعديله. أما الأنواع الصغيرة مثل int فتمريرها بالقيمة أبسط غالبًا.</div></details></section>
<section class="quiz-card" role="listitem"><div class="quiz-question-row"><span class="quiz-number">02</span><p>لماذا قد يصبح Reference لعنصر vector غير صالح بعد push_back؟</p></div><details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة:</strong> قد ينقل vector عناصره إلى مساحة أكبر، فيشير المرجع القديم إلى الذاكرة السابقة.</div></details></section>
<section class="quiz-card" role="listitem"><div class="quiz-question-row"><span class="quiz-number">03</span><p>كيف تجعل دالة حساب المتوسط قابلة للاختبار دون cin أو cout؟</p></div><details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة:</strong> اجعلها تستقبل الحاوية وتعيد النتيجة فقط، واترك القراءة والعرض لدوال أخرى.</div></details></section>
</div>
