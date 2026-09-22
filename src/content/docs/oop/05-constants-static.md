---
title: 5. الثوابت وStatic وLate Static Binding
description: Class constants وstatic members والفرق بين self وstatic ومخاطر الحالة العامة.
sidebar:
  order: 5
---

## Class constants

```php
final class HttpStatus
{
    public const int OK = 200; // PHP 8.3+
    public const int NOT_FOUND = 404;
}
```

الثابت مخصص للـclass وليس لكل object. يمكن ضبط visibility وكتابة `final const`. إذا كان المشروع يستهدف PHP أقدم من 8.3 احذف نوع `int`.

## Static properties وmethods

```php
final class Id
{
    private static int $next = 1;

    public static function next(): int
    {
        return self::$next++;
    }
}
```

الـstatic property مشتركة على مستوى class/process. لا يوجد `$this` داخل static method، واستدعاء non-static method بصورة static يرمي Error.

:::caution
Static mutable state قد تصبح global state مخفية وتستمر داخل worker طويل العمر. استخدم object محقونًا عندما توجد dependency أو lifecycle.
:::

## self:: مقابل static::

`self::` يرتبط بالـclass التي عُرّفت فيها method. `static::` يستخدم Late Static Binding ويشير إلى called class.

```php
class Document
{
    protected const TYPE = 'document';
    public static function early(): string { return self::TYPE; }
    public static function late(): string { return static::TYPE; }
}

class Invoice extends Document
{
    protected const TYPE = 'invoice';
}

echo Invoice::early(); // document
echo Invoice::late();  // invoice
```

استخدم `static::` عندما صُممت method للامتداد polymorphically، و`self::` عندما تقصد class المعرّفة.

## Named constructors

```php
class Money
{
    protected function __construct(
        public readonly int $cents,
        public readonly string $currency,
    ) {}

    public static function egp(int $cents): static
    {
        return new static($cents, 'EGP');
    }
}
```

النوع `static` يحافظ على called class، لكن `new static` يفرض توافق constructors في الأبناء. Static مناسبة للثوابت وpure named constructors، وليست بديلًا تلقائيًا لـDependency Injection.

## خريطة الدرس

<div class="lesson-diagram" role="img" aria-label="خريطة مفاهيم: الثوابت وStatic وLate Static Binding">
<p class="lesson-diagram-title">خريطة مفاهيم: الثوابت وStatic وLate Static Binding</p>
<div class="diagram-flow">
<div class="diagram-node input"><span>Class constants</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>Static properties وmethods</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>self:: مقابل static::</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node decision"><span>Named constructors</span></div>
</div>
</div>

## تأكد من فهمك

<div class="lesson-quiz" role="list">
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">01</span><p>اشرح «Class constants» كأنك تراجع تطبيقًا حقيقيًا: ما الهدف وما أهم قيد يجب الانتباه له؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> الثابت مخصص للـclass وليس لكل object. يمكن ضبط visibility وكتابة final const. إذا كان المشروع يستهدف PHP أقدم من 8.3 احذف نوع int. عمليًا، لا يكفي تنفيذ المسار الناجح؛ يجب توثيق الافتراضات والتحقق من القيم والحالات التي قد تكسر هذا السلوك.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">02</span><p>قارن بين «Class constants» و«Static properties وmethods». لماذا لا يغني أحدهما عن الآخر داخل موضوع «الثوابت وStatic وLate Static Binding»؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> في «Class constants»: الثابت مخصص للـclass وليس لكل object. يمكن ضبط visibility وكتابة final const. إذا كان المشروع يستهدف PHP أقدم من 8.3 احذف نوع int. أما «Static properties وmethods»: الـstatic property مشتركة على مستوى class/process. لا يوجد $this داخل static method، واستدعاء non-static method بصورة static يرمي Error. :::caution Static mutable state قد تصبح global state مخفية وتستمر داخل worker طويل العمر. استخدم object محقونًا عندما توجد dependency أو lifecycle. ::: العلاقة بينهما أن الأول يحدد جانبًا من الحل، والثاني يكمل السلوك أو القيود اللازمة لتطبيقه بصورة صحيحة.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">03</span><p>افترض أن نظامًا تجاهل «self:: مقابل static::». ما العطل أو الخطر المتوقع، وكيف تصمم اختبارًا يكشفه؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> self:: يرتبط بالـclass التي عُرّفت فيها method. static:: يستخدم Late Static Binding ويشير إلى called class. استخدم static:: عندما صُممت method للامتداد polymorphically، وself:: عندما تقصد class المعرّفة. لاكتشاف الخلل، اختبر مسارًا صحيحًا، وقيمة عند الحد، ومدخلًا غير صالح، ثم راقب النتيجة والآثار الجانبية والسجل بدل الاكتفاء بعدم ظهور Exception.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">04</span><p>حوّل «Named constructors» إلى قرار هندسي قابل للمراجعة. ما الذي ستوثقه وما الحالات التي ستختبرها؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> النوع static يحافظ على called class، لكن new static يفرض توافق constructors في الأبناء. Static مناسبة للثوابت وpure named constructors، وليست بديلًا تلقائيًا لـDependency Injection. وثّق سبب الاختيار والبدائل والحدود، واختبر الحالة العادية، والحد الأدنى والأقصى، والفشل الجزئي، وإعادة المحاولة أو التكرار إن كان السلوك يسمح بذلك.</div></details>
</section>
</div>
