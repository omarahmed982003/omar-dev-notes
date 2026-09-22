---
title: 16. ميزات PHP الحديثة 8.4 و8.5
description: Attributes وReflection وProperty Hooks وAsymmetric Visibility وLazy Objects وPipe وURI وClone With.
sidebar:
  order: 16
---

## اكتب الحد الأدنى للإصدار

لا تستخدم ميزة جديدة بلا إعلان requirement في `composer.json` واختبار بيئة النشر:

```json
{
  "require": {
    "php": "^8.4 || ^8.5"
  }
}
```

استخدم `composer check-platform-reqs` أثناء النشر. الأمثلة التالية مميزة بالإصدار وليست كلها متاحة في PHP الأقدم.

## Attributes وReflection — PHP 8+

```php
#[Attribute(Attribute::TARGET_METHOD)]
final readonly class RequiresRole
{
    public function __construct(public string $role) {}
}

#[RequiresRole('admin')]
function deleteUser(int $id): void {}

$attribute = (new ReflectionFunction('deleteUser'))
    ->getAttributes(RequiresRole::class)[0] ?? null;
```

Attributes metadata منظمة؛ لا تنفذ الحماية وحدها. framework أو كودك يجب أن يقرأها ويطبقها.

## Property Hooks وAsymmetric Visibility — PHP 8.4

```php
final class User
{
    public private(set) string $email {
        set => filter_var($value, FILTER_VALIDATE_EMAIL)
            ? strtolower($value)
            : throw new InvalidArgumentException('Invalid email');
    }
}
```

الـhook تضيف سلوك get/set، والـasymmetric visibility تحدد من يقرأ ومن يكتب. لا تحول كل property إلى منطق مخفي؛ method مسماة أفضل للعملية المعقدة.

## Lazy Objects — PHP 8.4

Reflection تدعم lazy ghost وlazy proxy لتأخير initialization حتى ملاحظة الحالة. الاستخدام الأساسي داخل DI containers وORMs؛ لا تبنِ proxy خاصة قبل الحاجة وفهم identity وserialization.

## Pipe Operator — PHP 8.5

```php
$slug = $title
    |> trim(...)
    |> mb_strtolower(...)
    |> (fn (string $v): string => str_replace(' ', '-', $v));
```

كل مرحلة callable تستقبل نتيجة السابقة كوسيط واحد. لا تستخدم pipe لسلسلة side effects غامضة.

## URI Extension وClone With — PHP 8.5

URI extension توفر parsing وفق RFC 3986 وWHATWG بدل حلول string يدوية. وClone With تسهّل نسخ value object مع تعديل properties:

```php
$published = clone($draft, ['status' => Status::Published]);
```

حافظ على invariants عبر hooks/constructors واختبارات؛ سهولة النسخ لا تبرر حالة غير صالحة.

## إضافات 8.5

- `array_first()` و`array_last()`.
- `#[NoDiscard]` للتنبيه عند تجاهل return value.
- attributes على constants.
- تحسينات cloning وasymmetric visibility.
- `setcookie()` تدعم خيار `partitioned`.

راجع migration guide قبل الترقية، شغّل الاختبارات والتحليل الساكن، ولا تعتمد على رقم الإصدار وحده.

## مراجع

- [PHP 8.4](https://www.php.net/releases/8.4/en.php)
- [PHP 8.5](https://www.php.net/releases/8.5/en.php)
- [الإصدارات المدعومة](https://www.php.net/supported-versions.php)

## خريطة الدرس

<div class="lesson-diagram" role="img" aria-label="خريطة مفاهيم: ميزات PHP الحديثة 8.4 و8.5">
<p class="lesson-diagram-title">خريطة مفاهيم: ميزات PHP الحديثة 8.4 و8.5</p>
<div class="diagram-flow">
<div class="diagram-node input"><span>اكتب الحد الأدنى للإصدار</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>Attributes وReflection — PHP 8+</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>Property Hooks وAsymmetric Visibility — PHP 8.4</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node decision"><span>Lazy Objects — PHP 8.4</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node output"><span>Pipe Operator — PHP 8.5</span></div>
</div>
</div>

## تأكد من فهمك

<div class="lesson-quiz" role="list">
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">01</span><p>اشرح «اكتب الحد الأدنى للإصدار» كأنك تراجع تطبيقًا حقيقيًا: ما الهدف وما أهم قيد يجب الانتباه له؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> لا تستخدم ميزة جديدة بلا إعلان requirement في composer.json واختبار بيئة النشر: استخدم composer check-platform-reqs أثناء النشر. الأمثلة التالية مميزة بالإصدار وليست كلها متاحة في PHP الأقدم. عمليًا، لا يكفي تنفيذ المسار الناجح؛ يجب توثيق الافتراضات والتحقق من القيم والحالات التي قد تكسر هذا السلوك.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">02</span><p>قارن بين «اكتب الحد الأدنى للإصدار» و«Attributes وReflection — PHP 8+». لماذا لا يغني أحدهما عن الآخر داخل موضوع «ميزات PHP الحديثة 8.4 و8.5»؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> في «اكتب الحد الأدنى للإصدار»: لا تستخدم ميزة جديدة بلا إعلان requirement في composer.json واختبار بيئة النشر: استخدم composer check-platform-reqs أثناء النشر. الأمثلة التالية مميزة بالإصدار وليست كلها متاحة في PHP الأقدم. أما «Attributes وReflection — PHP 8+»: Attributes metadata منظمة؛ لا تنفذ الحماية وحدها. framework أو كودك يجب أن يقرأها ويطبقها. العلاقة بينهما أن الأول يحدد جانبًا من الحل، والثاني يكمل السلوك أو القيود اللازمة لتطبيقه بصورة صحيحة.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">03</span><p>افترض أن نظامًا تجاهل «Property Hooks وAsymmetric Visibility — PHP 8.4». ما العطل أو الخطر المتوقع، وكيف تصمم اختبارًا يكشفه؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> الـhook تضيف سلوك get/set، والـasymmetric visibility تحدد من يقرأ ومن يكتب. لا تحول كل property إلى منطق مخفي؛ method مسماة أفضل للعملية المعقدة. لاكتشاف الخلل، اختبر مسارًا صحيحًا، وقيمة عند الحد، ومدخلًا غير صالح، ثم راقب النتيجة والآثار الجانبية والسجل بدل الاكتفاء بعدم ظهور Exception.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">04</span><p>حوّل «Lazy Objects — PHP 8.4» إلى قرار هندسي قابل للمراجعة. ما الذي ستوثقه وما الحالات التي ستختبرها؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> Reflection تدعم lazy ghost وlazy proxy لتأخير initialization حتى ملاحظة الحالة. الاستخدام الأساسي داخل DI containers وORMs؛ لا تبنِ proxy خاصة قبل الحاجة وفهم identity وserialization. وثّق سبب الاختيار والبدائل والحدود، واختبر الحالة العادية، والحد الأدنى والأقصى، والفشل الجزئي، وإعادة المحاولة أو التكرار إن كان السلوك يسمح بذلك.</div></details>
</section>
</div>
