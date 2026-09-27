---
title: "الكائنات وSTL وRAII والاختبارات"
description: "حوّل البيانات والقواعد إلى أنواع واضحة، واستخدم مكتبة C++ القياسية وإدارة الموارد التلقائية واختبارات صغيرة لبناء برامج قابلة للصيانة."
sidebar:
  order: 14
tableOfContents: true
---

اقرأ الأول [الدوال والحاويات](/cpp/advanced/01-functions-containers-references/). مقتطفات الأصناف والخوارزميات تحتاج البرنامج المحيط والترويسات؛ المثال الأخير كامل. الـiterator بيمثل موضعًا داخل حاوية؛ النطاق `[begin, end)` يشمل البداية ويستبعد الموضع اللي بعد آخر عنصر.


## من المتغيرات إلى نوع يمثل المجال

يجمع `class` الحالة والعمليات التي تحافظ على صحتها. اجعل التفاصيل الداخلية `private`، وقدّم واجهة عامة لا تسمح بحالة غير صالحة.

```cpp
class Order {
public:
    explicit Order(double subtotal) : subtotal_{subtotal} {
        if (!std::isfinite(subtotal) || subtotal < 0) throw std::invalid_argument{"negative subtotal"};
    }

    double total(double discount) const {
        if (!std::isfinite(discount) || discount < 0 || discount > 1)
            throw std::invalid_argument{"discount outside 0..1"};
        return subtotal_ * (1.0 - discount);
    }

private:
    double subtotal_{};
};
```

الـConstructor ينشئ كائنًا صالحًا. والكلمة `const` بعد الدالة تعني أنها لا تعدل الحالة الظاهرة للكائن. استخدم Composition لبناء نوع من أنواع أصغر قبل التفكير في الوراثة.

## RAII وإدارة الموارد

يربط RAII عمر المورد بعمر كائن: يكتسب المورد في Constructor ويحرره Destructor. تستخدم `std::vector` و`std::string` هذه الفكرة لإدارة الذاكرة تلقائيًا، وتستخدمها Streams للملفات.

تجنب `new` و`delete` المباشرين في كود التطبيق. إذا احتجت ملكية ديناميكية، فابدأ بـ`std::unique_ptr`. استخدم `std::shared_ptr` فقط عندما تكون الملكية المشتركة حقيقية ومفهومة، لأن دورات المراجع قد تمنع التحرير.

## خوارزميات STL

افصل **ما تريد** عن تفاصيل الحلقة. تعمل خوارزميات المكتبة على نطاق يحدده Iterators.

```cpp
std::vector<int> scores{75, 42, 91, 60};
std::sort(scores.begin(), scores.end());

auto passed = std::count_if(scores.begin(), scores.end(),
    [](int score) { return score >= 50; });
```

تعرف أيضًا على `find` و`transform` و`accumulate`. لا تستخدم خوارزمية لمجرد قصر الكود؛ اخترها عندما تجعل النية أوضح وتحافظ على صحة الحدود.

## الأخطاء والاستثناءات

فرّق بين إدخال متوقع أن يكون غير صالح، ويمكن تمثيله بنتيجة تحقق، وبين فشل يمنع العملية من إكمال عقدها وقد يناسبه Exception. التقط الاستثناء في مستوى يستطيع إصلاح المشكلة أو تحويلها إلى رسالة مفيدة، لا عند كل سطر.

## الاختبارات والتصحيح

اختبر الدالة بوحدات صغيرة تغطي الحالة العادية والحدود والمدخل غير الصالح. استخدم Assertions لفرض افتراضات داخلية في التطوير، ولا تجعلها بديلًا عن التحقق من بيانات المستخدم.

```cpp
#include <cassert>
#include <cmath>

constexpr double tolerance = 1e-9;
assert(std::abs(finalPrice(100.0, 0.10) - 90.0) < tolerance);
assert(std::abs(finalPrice(0.0, 0.10) - 0.0) < tolerance);
```

المقارنة بسماحية تناسب الحسابات العشرية التقريبية، لكن `assert` قد يزال عند تعريف `NDEBUG`. استخدم إطار اختبارات حقيقيًا لاختبارات المشروع، واترك Assertions لافتراضات التطوير الداخلية.

فعّل تحذيرات المترجم، واستخدم Debugger وSanitizers لاكتشاف القراءة خارج الحدود واستخدام الذاكرة بعد انتهاء عمرها. اجعل كل إصلاح Bug مصحوبًا باختبار كان يفشل قبله.

## مشروع ختامي

أعد بناء مشروع الطلب الإلكتروني: `Product` يمثل المنتج، و`Cart` يحتفظ بالعناصر، و`PricingPolicy` يحسب الخصم، ودالة مستقلة تتحقق من الإدخال. استخدم `vector` للعناصر وAlgorithms للحساب، ثم اختبر سلة فارغة، وحد الخصم، وكمية غير صالحة.

## تأكد من فهمك

<div class="lesson-quiz" role="list">
<section class="quiz-card" role="listitem"><div class="quiz-question-row"><span class="quiz-number">01</span><p>لماذا يفضّل RAII على تحرير المورد يدويًا في كل مسار؟</p></div><details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة:</strong> لأن Destructor يعمل عند انتهاء العمر حتى مع return مبكر أو Exception، فيمنع التسرب وتكرار منطق التنظيف.</div></details></section>
<section class="quiz-card" role="listitem"><div class="quiz-question-row"><span class="quiz-number">02</span><p>متى يكون Composition أوضح من Inheritance؟</p></div><details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة:</strong> عندما يحتوي النوع على تعاون بين أجزاء ولا توجد علاقة is-a حقيقية قابلة للاستبدال.</div></details></section>
<section class="quiz-card" role="listitem"><div class="quiz-question-row"><span class="quiz-number">03</span><p>ما الاختبار الذي تضيفه بعد إصلاح خطأ عند subtotal يساوي 500؟</p></div><details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة:</strong> اختبار Regression للقيمة 500 مع حالتي 499 و501 حتى يثبت سلوك الحد ولا يعود الخطأ.</div></details></section>
</div>


## برنامج كامل واختبار الحدود

```cpp
#include <algorithm>
#include <fstream>
#include <iostream>
#include <stdexcept>
#include <vector>

void savePassingScores(const std::vector<int>& scores) {
    std::ofstream file("passing-scores.txt");
    if (!file) throw std::runtime_error("Cannot open output");
    for (int score : scores) {
        if (score < 0 || score > 100) throw std::invalid_argument("Invalid score");
        if (score >= 50) file << score << '\n';
    }
    file.flush();
    if (!file) throw std::runtime_error("Write failed");
    file.close();
    if (!file) throw std::runtime_error("Close failed");
}
int main() {
    std::vector<int> scores{75, 42, 91, 60};
    std::sort(scores.begin(), scores.end());
    const auto passed = std::count_if(scores.begin(), scores.end(),
        [](int score) { return score >= 50; });
    try {
        savePassingScores(scores);
        std::cout << "passed=" << passed << '\n';
    } catch (const std::exception& error) {
        std::cerr << error.what() << '\n';
        return 1;
    }
}
```

احفظه باسم `raii.cpp` وترجمه بـ`g++ -std=c++17 -Wall -Wextra -pedantic raii.cpp -o raii`، وشغله في مجلد تجارب قابل للكتابة. هيستبدل `passing-scores.txt` بالدرجات 60 و75 و91 كل واحدة في سطر، ويطبع `passed=3`. `sort` تغير vector، و`count_if` تقرأه باستخدام lambda، وهي دالة صغيرة في موضع استخدامها. الـstream يملك مقبض الملف ويحرره عند انتهاء النطاق حتى أثناء فك المكدس بسبب استثناء. فحص flush وclose صراحة يظهر فشل الكتابة؛ الـdestructor مش هيبلغ عنه عبر نتيجة العملية العادية. RAII يحرر المورد لكنه مش بيلغي البايتات المكتوبة: درجة غير صالحة ممكن تترك ملفًا جزئيًا. تحقق أولًا واستخدم بروتوكول ملف مؤقت ثم استبدال عندما تحتاج كتابة كاملة أو لا شيء. اختبر قائمة فارغة ومجلدًا لا يسمح بالكتابة.


مقتطف Order يحتاج `<cmath>` و`<stdexcept>`. بيرفض القيم غير المنتهية زي NaN، وكمان المجموع السالب والخصم خارج 0..1. double هنا لتوضيح بناء الصنف بحساب تقريبي؛ نموذج تسعير فعلي يحتاج وحدات مالية صحيحة محدودة أو نوعًا عشريًا مناسبًا.
