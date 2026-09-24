---
title: "الكائنات وSTL وRAII والاختبارات"
description: "حوّل البيانات والقواعد إلى أنواع واضحة، واستخدم مكتبة C++ القياسية وإدارة الموارد التلقائية واختبارات صغيرة لبناء برامج قابلة للصيانة."
pagefind: false
tableOfContents: true
---

## من المتغيرات إلى نوع يمثل المجال

يجمع `class` الحالة والعمليات التي تحافظ على صحتها. اجعل التفاصيل الداخلية `private`، وقدّم واجهة عامة لا تسمح بحالة غير صالحة.

```cpp
class Order {
public:
    explicit Order(double subtotal) : subtotal_{subtotal} {
        if (subtotal < 0) throw std::invalid_argument{"negative subtotal"};
    }

    double total(double discount) const {
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
assert(finalPrice(100.0, 0.10) == 90.0);
assert(finalPrice(0.0, 0.10) == 0.0);
```

فعّل تحذيرات المترجم، واستخدم Debugger وSanitizers لاكتشاف القراءة خارج الحدود واستخدام الذاكرة بعد انتهاء عمرها. اجعل كل إصلاح Bug مصحوبًا باختبار كان يفشل قبله.

## مشروع ختامي

أعد بناء مشروع الطلب الإلكتروني: `Product` يمثل المنتج، و`Cart` يحتفظ بالعناصر، و`PricingPolicy` يحسب الخصم، ودالة مستقلة تتحقق من الإدخال. استخدم `vector` للعناصر وAlgorithms للحساب، ثم اختبر سلة فارغة، وحد الخصم، وكمية غير صالحة.

## تأكد من فهمك

<div class="lesson-quiz" role="list">
<section class="quiz-card" role="listitem"><div class="quiz-question-row"><span class="quiz-number">01</span><p>لماذا يفضّل RAII على تحرير المورد يدويًا في كل مسار؟</p></div><details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة:</strong> لأن Destructor يعمل عند انتهاء العمر حتى مع return مبكر أو Exception، فيمنع التسرب وتكرار منطق التنظيف.</div></details></section>
<section class="quiz-card" role="listitem"><div class="quiz-question-row"><span class="quiz-number">02</span><p>متى يكون Composition أوضح من Inheritance؟</p></div><details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة:</strong> عندما يحتوي النوع على تعاون بين أجزاء ولا توجد علاقة is-a حقيقية قابلة للاستبدال.</div></details></section>
<section class="quiz-card" role="listitem"><div class="quiz-question-row"><span class="quiz-number">03</span><p>ما الاختبار الذي تضيفه بعد إصلاح خطأ عند subtotal يساوي 500؟</p></div><details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة:</strong> اختبار Regression للقيمة 500 مع حالتي 499 و501 حتى يثبت سلوك الحد ولا يعود الخطأ.</div></details></section>
</div>
