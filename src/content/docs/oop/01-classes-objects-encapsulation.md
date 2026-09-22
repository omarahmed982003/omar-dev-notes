---
title: 1. الأصناف والكائنات والتغليف
description: شرح Class وObject وProperties وMethods وVisibility مع حماية قواعد الكائن.
sidebar:
  order: 1
---

## Class وObject

الـClass قالب يحدد الحالة والسلوك، والـObject instance مستقلة منه:

```php
final class Product
{
    public function __construct(
        public readonly int $id,
        public string $name,
        private int $priceCents,
    ) {
        if ($priceCents < 0) {
            throw new InvalidArgumentException('Price cannot be negative');
        }
    }

    public function priceCents(): int
    {
        return $this->priceCents;
    }

    public function changePrice(int $newPriceCents): void
    {
        if ($newPriceCents < 0) {
            throw new InvalidArgumentException('Price cannot be negative');
        }

        $this->priceCents = $newPriceCents;
    }
}

$product = new Product(1, 'Keyboard', 150000);
$product->changePrice(145000);
```

كل object له حالته، بينما تعريف methods مشترك منطقيًا بين instances.

## Encapsulation

التغليف ليس مجرد كتابة `private`. معناه أن الكائن:

- يخفي تفاصيل تمثيله الداخلية.
- يعرض عمليات ذات معنى.
- يمنع الحالة غير الصالحة.
- يستطيع تغيير تنفيذه دون كسر المستدعين.

```php
final class BankAccount
{
    public function __construct(private int $balanceCents = 0)
    {
        if ($balanceCents < 0) {
            throw new InvalidArgumentException('Invalid opening balance');
        }
    }

    public function deposit(int $amount): void
    {
        if ($amount <= 0) {
            throw new InvalidArgumentException('Amount must be positive');
        }
        $this->balanceCents += $amount;
    }

    public function withdraw(int $amount): void
    {
        if ($amount <= 0 || $amount > $this->balanceCents) {
            throw new DomainException('Invalid withdrawal');
        }
        $this->balanceCents -= $amount;
    }

    public function balanceCents(): int
    {
        return $this->balanceCents;
    }
}
```

Setter عام لكل property قد يهدم التغليف؛ سمِّ العمليات حسب المجال مثل `withdraw()` بدل `setBalance()`.

## Visibility

| modifier | داخل class | child class | الخارج |
|---|---:|---:|---:|
| `public` | نعم | نعم | نعم |
| `protected` | نعم | نعم | لا |
| `private` | نعم | لا مباشرة | لا |

اجعل أقل visibility ممكنة. `protected` يربط الأبناء بتفاصيل الأب، لذلك لا تستخدمه تلقائيًا بدل private.

## $this وObject operator

داخل instance method يشير `$this` إلى object الحالي:

```php
$this->name;       // property
$this->rename();   // method
```

استخدم `->` للأعضاء غير static. لا يتوفر `$this` داخل static method.

## Property types وDynamic properties

اكتب الأنواع وابدأ الكائن صالحًا بعد constructor. إنشاء properties غير معلنة deprecated في PHP الحديثة لمعظم الأصناف؛ عرّفها صراحة أو استخدم بنية مناسبة بدل `$object->unknown = ...`.

## Identity مقابل Equality

```php
$a = new Product(1, 'Keyboard', 100);
$b = new Product(1, 'Keyboard', 100);

var_dump($a == $b);  // properties متساوية
var_dump($a === $b); // false: ليست instance نفسها
```

لـValue Objects عرّف method مثل `equals()` بدل الاعتماد على مقارنة عامة قد تتغير عند إضافة property.

## خريطة الدرس

<div class="lesson-diagram" role="img" aria-label="خريطة مفاهيم: الأصناف والكائنات والتغليف">
<p class="lesson-diagram-title">خريطة مفاهيم: الأصناف والكائنات والتغليف</p>
<div class="diagram-flow">
<div class="diagram-node input"><span>Class وObject</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>Encapsulation</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>Visibility</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node decision"><span>$this وObject operator</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node output"><span>Property types وDynamic properties</span></div>
</div>
</div>

## تأكد من فهمك

<div class="lesson-quiz" role="list">
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">01</span><p>اشرح «Class وObject» كأنك تراجع تطبيقًا حقيقيًا: ما الهدف وما أهم قيد يجب الانتباه له؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> الـClass قالب يحدد الحالة والسلوك، والـObject instance مستقلة منه: كل object له حالته، بينما تعريف methods مشترك منطقيًا بين instances. عمليًا، لا يكفي تنفيذ المسار الناجح؛ يجب توثيق الافتراضات والتحقق من القيم والحالات التي قد تكسر هذا السلوك.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">02</span><p>قارن بين «Class وObject» و«Encapsulation». لماذا لا يغني أحدهما عن الآخر داخل موضوع «الأصناف والكائنات والتغليف»؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> في «Class وObject»: الـClass قالب يحدد الحالة والسلوك، والـObject instance مستقلة منه: كل object له حالته، بينما تعريف methods مشترك منطقيًا بين instances. أما «Encapsulation»: التغليف ليس مجرد كتابة private. معناه أن الكائن: يخفي تفاصيل تمثيله الداخلية. يعرض عمليات ذات معنى. يمنع الحالة غير الصالحة. يستطيع تغيير تنفيذه دون كسر المستدعين. Setter عام لكل property قد يهدم التغليف؛ سمِّ العمليات حسب المجال مثل withdraw() بدل setBalance(). العلاقة بينهما أن الأول يحدد جانبًا من الحل، والثاني يكمل السلوك أو القيود اللازمة لتطبيقه بصورة صحيحة.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">03</span><p>افترض أن نظامًا تجاهل «Visibility». ما العطل أو الخطر المتوقع، وكيف تصمم اختبارًا يكشفه؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> | modifier | داخل class | child class | الخارج | |---|---:|---:|---:| | public | نعم | نعم | نعم | | protected | نعم | نعم | لا | | private | نعم | لا مباشرة | لا | اجعل أقل visibility ممكنة. protected يربط الأبناء بتفاصيل الأب، لذلك لا تستخدمه تلقائيًا بدل private. لاكتشاف الخلل، اختبر مسارًا صحيحًا، وقيمة عند الحد، ومدخلًا غير صالح، ثم راقب النتيجة والآثار الجانبية والسجل بدل الاكتفاء بعدم ظهور Exception.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">04</span><p>حوّل «$this وObject operator» إلى قرار هندسي قابل للمراجعة. ما الذي ستوثقه وما الحالات التي ستختبرها؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> داخل instance method يشير $this إلى object الحالي: استخدم -&gt; للأعضاء غير static. لا يتوفر $this داخل static method. وثّق سبب الاختيار والبدائل والحدود، واختبر الحالة العادية، والحد الأدنى والأقصى، والفشل الجزئي، وإعادة المحاولة أو التكرار إن كان السلوك يسمح بذلك.</div></details>
</section>
</div>
