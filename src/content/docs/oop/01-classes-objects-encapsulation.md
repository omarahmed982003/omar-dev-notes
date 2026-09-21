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
