---
title: 7. Magic Methods وCloning
description: سلوك PHP الخاص عبر __get و__set و__call و__toString و__invoke و__clone و__debugInfo.
sidebar:
  order: 7
---

## ما Magic Methods؟

أسماء تبدأ بـ`__` ويحجزها PHP لاعتراض أحداث معينة. لا تنشئ method مخصصة بهذا النمط. باستثناء `__construct` و`__destruct` و`__clone`، يجب إعلان magic methods كـ`public`.

## __get و__set و__isset و__unset

```php
final class AttributeBag
{
    public function __construct(private array $data = []) {}

    public function __get(string $name): mixed
    {
        if (!array_key_exists($name, $this->data)) {
            throw new OutOfBoundsException($name);
        }
        return $this->data[$name];
    }

    public function __set(string $name, mixed $value): void
    {
        $this->data[$name] = $value;
    }

    public function __isset(string $name): bool
    {
        return isset($this->data[$name]);
    }

    public function __unset(string $name): void
    {
        unset($this->data[$name]);
    }
}
```

تعمل عند property غير متاحة. المرونة تقلل static analysis وتخفي typos؛ الأعضاء الصريحة أفضل في domain models.

## __call و__callStatic

يعملان عند method غير موجودة/غير متاحة:

```php
public function __call(string $name, array $arguments): mixed
{
    throw new BadMethodCallException("Unknown method {$name}");
}
```

تُستخدم في proxies وfluent APIs لكن يجب أن تفشل بوضوح.

## __toString و__invoke

```php
final readonly class OrderId
{
    public function __construct(private string $value) {}
    public function __toString(): string { return $this->value; }
}

final class Slugify
{
    public function __invoke(string $value): string
    {
        return strtolower(trim(str_replace(' ', '-', $value)));
    }
}

$slugify = new Slugify();
echo $slugify(' Hello World ');
```

الكائن القابل للاستدعاء مناسب لـstrategy صغيرة قابلة للحقن.

## clone و__clone

`clone` shallow copy افتراضيًا؛ nested objects تظل مشتركة:

```php
final class Order
{
    public function __construct(public DateTime $createdAt) {}

    public function __clone(): void
    {
        $this->createdAt = clone $this->createdAt;
    }
}
```

لا تستنسخ ORM Entity ذات identity بلا فهم Unit of Work؛ قد تحتاج factory لهوية جديدة.

## __debugInfo وSerialization

```php
public function __debugInfo(): array
{
    return ['id' => $this->id, 'token' => '[redacted]'];
}
```

يساعد على إخفاء secrets من `var_dump`، لكنه لا يبرر logging للكائن كاملًا. فضّل `__serialize()` و`__unserialize()` عند الحاجة، ولا تعمل `unserialize()` على بيانات غير موثوقة.

لا تعتمد على destructor لعمل business حرج؛ استخدم methods صريحة و`try/finally`.

## خريطة الدرس

<div class="lesson-diagram" role="img" aria-label="خريطة مفاهيم: Magic Methods وCloning">
<p class="lesson-diagram-title">خريطة مفاهيم: Magic Methods وCloning</p>
<div class="diagram-flow">
<div class="diagram-node input"><span>ما Magic Methods؟</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>__get و__set و__isset و__unset</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>__call و__callStatic</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node decision"><span>__toString و__invoke</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node output"><span>clone و__clone</span></div>
</div>
</div>

## تأكد من فهمك

<div class="lesson-quiz" role="list">
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">01</span><p>اشرح «ما Magic Methods؟» كأنك تراجع تطبيقًا حقيقيًا: ما الهدف وما أهم قيد يجب الانتباه له؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> أسماء تبدأ بـ__ ويحجزها PHP لاعتراض أحداث معينة. لا تنشئ method مخصصة بهذا النمط. باستثناء __construct و__destruct و__clone، يجب إعلان magic methods كـpublic. عمليًا، لا يكفي تنفيذ المسار الناجح؛ يجب توثيق الافتراضات والتحقق من القيم والحالات التي قد تكسر هذا السلوك.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">02</span><p>قارن بين «ما Magic Methods؟» و«__get و__set و__isset و__unset». لماذا لا يغني أحدهما عن الآخر داخل موضوع «Magic Methods وCloning»؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> في «ما Magic Methods؟»: أسماء تبدأ بـ__ ويحجزها PHP لاعتراض أحداث معينة. لا تنشئ method مخصصة بهذا النمط. باستثناء __construct و__destruct و__clone، يجب إعلان magic methods كـpublic. أما «__get و__set و__isset و__unset»: تعمل عند property غير متاحة. المرونة تقلل static analysis وتخفي typos؛ الأعضاء الصريحة أفضل في domain models. العلاقة بينهما أن الأول يحدد جانبًا من الحل، والثاني يكمل السلوك أو القيود اللازمة لتطبيقه بصورة صحيحة.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">03</span><p>افترض أن نظامًا تجاهل «__call و__callStatic». ما العطل أو الخطر المتوقع، وكيف تصمم اختبارًا يكشفه؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> يعملان عند method غير موجودة/غير متاحة: تُستخدم في proxies وfluent APIs لكن يجب أن تفشل بوضوح. لاكتشاف الخلل، اختبر مسارًا صحيحًا، وقيمة عند الحد، ومدخلًا غير صالح، ثم راقب النتيجة والآثار الجانبية والسجل بدل الاكتفاء بعدم ظهور Exception.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">04</span><p>حوّل «__toString و__invoke» إلى قرار هندسي قابل للمراجعة. ما الذي ستوثقه وما الحالات التي ستختبرها؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> الكائن القابل للاستدعاء مناسب لـstrategy صغيرة قابلة للحقن. وثّق سبب الاختيار والبدائل والحدود، واختبر الحالة العادية، والحد الأدنى والأقصى، والفشل الجزئي، وإعادة المحاولة أو التكرار إن كان السلوك يسمح بذلك.</div></details>
</section>
</div>
