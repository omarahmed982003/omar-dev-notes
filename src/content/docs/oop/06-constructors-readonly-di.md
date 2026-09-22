---
title: 6. Constructors وReadonly وDependency Injection
description: تهيئة object صالح وConstructor Promotion وReadonly وحقن الاعتماديات بدل إنشائها داخليًا.
sidebar:
  order: 6
---

## Constructor يحمي بداية الكائن

```php
final class EmailAddress
{
    public function __construct(public readonly string $value)
    {
        if (filter_var($value, FILTER_VALIDATE_EMAIL) === false) {
            throw new InvalidArgumentException('Invalid email');
        }
    }
}
```

بعد نجاح constructor يجب أن يكون object صالحًا. المثال يستخدم Constructor Property Promotion. وإذا عرّف child constructor خاصًا به فلن يستدعي parent constructor تلقائيًا؛ استدعِ `parent::__construct(...)` عند الحاجة.

## readonly

```php
final readonly class Money
{
    public function __construct(
        public int $cents,
        public string $currency,
    ) {
        if ($cents < 0) {
            throw new InvalidArgumentException();
        }
    }
}
```

Readonly class من PHP 8.2 تجعل properties المعلنة readonly وتمنع dynamic properties. لا يمكنها static أو untyped properties.

:::caution[ليست Deep Immutability]
إذا احتوت readonly property على object، لا يمكن تبديل المرجع لكن يمكن أن تتغير حالة object الداخلي إن كان mutable.
:::

في PHP 8.4 أصبح نطاق التهيئة الافتراضي للـreadonly property هو `protected(set)` بدل private-set الضمني السابق؛ انتبه عند الوراثة والترقية.

## Dependency Injection

```php
final class OrderService
{
    public function __construct(
        private PaymentGateway $payments,
        private OrderRepository $orders,
        private Clock $clock,
    ) {}

    public function checkout(Order $order): Receipt
    {
        $receipt = $this->payments->charge(
            $order->customerId(),
            $order->totalCents(),
        );
        $this->orders->markPaid($order, $receipt, $this->clock->now());
        return $receipt;
    }
}
```

DI تجعل dependencies ظاهرة وتسمح بـproduction وfake implementations. Dependency Injection ليست Container؛ يمكن توصيل objects يدويًا.

- Constructor injection للاعتماد المطلوب طوال عمر object.
- Method parameter لبيانات/اعتماد خاص بعملية واحدة.
- Setter injection قد تترك object ناقصًا.

تجنب Service Locator مثل `Container::get()` داخل منطق المجال لأنه يخفي dependencies.

## خريطة الدرس

<div class="lesson-diagram" role="img" aria-label="خريطة مفاهيم: Constructors وReadonly وDependency Injection">
<p class="lesson-diagram-title">خريطة مفاهيم: Constructors وReadonly وDependency Injection</p>
<div class="diagram-flow">
<div class="diagram-node input"><span>Constructor يحمي بداية الكائن</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>readonly</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>Dependency Injection</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node decision"><span>اختيار حقن الاعتماد المناسب واختباره</span></div>
</div>
</div>

## تأكد من فهمك

<div class="lesson-quiz" role="list">
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">01</span><p>اشرح «Constructor يحمي بداية الكائن» كأنك تراجع تطبيقًا حقيقيًا: ما الهدف وما أهم قيد يجب الانتباه له؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> بعد نجاح constructor يجب أن يكون object صالحًا. المثال يستخدم Constructor Property Promotion. وإذا عرّف child constructor خاصًا به فلن يستدعي parent constructor تلقائيًا؛ استدعِ parent::__construct(...) عند الحاجة. عمليًا، لا يكفي تنفيذ المسار الناجح؛ يجب توثيق الافتراضات والتحقق من القيم والحالات التي قد تكسر هذا السلوك.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">02</span><p>قارن بين «Constructor يحمي بداية الكائن» و«readonly». لماذا لا يغني أحدهما عن الآخر داخل موضوع «Constructors وReadonly وDependency Injection»؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> في «Constructor يحمي بداية الكائن»: بعد نجاح constructor يجب أن يكون object صالحًا. المثال يستخدم Constructor Property Promotion. وإذا عرّف child constructor خاصًا به فلن يستدعي parent constructor تلقائيًا؛ استدعِ parent::__construct(...) عند الحاجة. أما «readonly»: Readonly class من PHP 8.2 تجعل properties المعلنة readonly وتمنع dynamic properties. لا يمكنها static أو untyped properties. :::caution[ليست Deep Immutability] إذا احتوت readonly property على object، لا يمكن تبديل المرجع لكن يمكن أن تتغير حالة object الداخلي إن كان mutable. ::: في PHP 8.4 أصبح نطاق التهيئة الافتراضي للـreadonly property هو protected(set) بدل private-set الضمني السابق؛ انتبه عند الوراثة والترقية. العلاقة بينهما أن الأول يحدد جانبًا من الحل، والثاني يكمل السلوك أو القيود اللازمة لتطبيقه بصورة صحيحة.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">03</span><p>افترض أن نظامًا تجاهل «Dependency Injection». ما العطل أو الخطر المتوقع، وكيف تصمم اختبارًا يكشفه؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> DI تجعل dependencies ظاهرة وتسمح بـproduction وfake implementations. Dependency Injection ليست Container؛ يمكن توصيل objects يدويًا. Constructor injection للاعتماد المطلوب طوال عمر object. Method parameter لبيانات/اعتماد خاص بعملية واحدة. Setter injection قد تترك object ناقصًا. تجنب Service Locator مثل Container::get() داخل منطق المجال لأنه يخفي dependencies. لاكتشاف الخلل، اختبر مسارًا صحيحًا، وقيمة عند الحد، ومدخلًا غير صالح، ثم راقب النتيجة والآثار الجانبية والسجل بدل الاكتفاء بعدم ظهور Exception.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">04</span><p>حوّل «اختيار حقن الاعتماد المناسب واختباره» إلى قرار هندسي قابل للمراجعة. ما الذي ستوثقه وما الحالات التي ستختبرها؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> تهيئة object صالح وConstructor Promotion وReadonly وحقن الاعتماديات بدل إنشائها داخليًا. وثّق سبب الاختيار والبدائل والحدود، واختبر الحالة العادية، والحد الأدنى والأقصى، والفشل الجزئي، وإعادة المحاولة أو التكرار إن كان السلوك يسمح بذلك.</div></details>
</section>
</div>
