---
title: 16. خريطة ميزات PHP الحديثة 8.0–8.5
description: خريطة زمنية من PHP 8.0 إلى 8.5 تشمل WeakMap وFibers وDNF Types وReadonly Classes وProperty Hooks.
sidebar:
  order: 16
---

## المشكلة: المثال صحيح، لكن السيرفر مش بيفهمه

ميزة جديدة قد تغير Syntax فيفشل الملف **قبل التنفيذ** على إصدار أقدم. `if (PHP_VERSION_ID >= ...)` داخل نفس الملف لا تحمي صياغة لا يفهمها Parser. اختار الحد الأدنى في Composer، واختبره فعلًا، ثم تعلم الميزة لأنها تحل مشكلة محددة.

الدرس خريطة قراءة على مرحلتين: أولًا Generators وWeakMap وFibers لفهم دورة التنفيذ والذاكرة، ثم أنواع وميزات كائنات للتعرف عليها. تفاصيل OOP في [مسارها](/oop/)، مش مطلوب تبني Framework هنا.

## خريطة زمنية لإصدارات صادرة

دي تواريخ الإصدار الأول لكل سلسلة، مش توصية بتثبيت النسخة .0 القديمة. PHP 8.5 صدرت فعلًا في 20 نوفمبر 2025؛ ليست RFC مستقبلية. راجع إصدار patch مدعوم عند التثبيت.

| Version | Release date | Features |
|---|---|---|
| [8.0](https://www.php.net/releases/8.0/en.php) | 2020-11-26 | Named arguments, attributes, constructor promotion, union types, match, nullsafe, WeakMap, ValueError, mixed, JIT |
| [8.1](https://www.php.net/releases/8.1/en.php) | 2021-11-25 | Enums, fibers, first-class callables, intersection types, never, readonly properties, array_is_list |
| [8.2](https://www.php.net/releases/8.2/en.php) | 2022-12-08 | DNF types, readonly classes, standalone true/false/null, SensitiveParameter, dynamic-property deprecation |
| [8.3](https://www.php.net/releases/8.3/en.php) | 2023-11-23 | Typed class constants, Override, json_validate, readonly reinitialization during cloning, dynamic class-constant access |
| [8.4](https://www.php.net/releases/8.4/en.php) | 2024-11-21 | Property hooks, asymmetric visibility, lazy objects, array_find/array_any/array_all, Deprecated attribute |
| [8.5](https://www.php.net/releases/8.5/en.php) | 2025-11-20 | Pipe, URI extension, clone with, NoDiscard, array_first/array_last, partitioned cookie option |


التواريخ موثقة في [سجل الإصدارات](https://www.php.net/ChangeLog-8.php). الجدول يعرف مكان الميزة؛ مش شرط تحفظه. **مهم تاريخيًا:** Generators و`yield` من 5.5، و`yield from` من 7.0؛ وجودها هنا لا يجعلها ميزة PHP 8. **JIT** ترجمة وقت التشغيل، ومش ضمانًا أن موقعك أسرع؛ قياس التطبيق هو الحكم.

`require: {"php":"^8.3"}` يعني `>=8.3.0 <9.0.0`، فلا تدخل Hooks من 8.4 في ملف يدعي دعم 8.3. `composer check-platform-reqs` يفحص المنصة الفعلية. راجع migration/deprecations واختبر أقل وأعلى إصدار تدعمه؛ رقم إصدار جديد لا يلغي اختباراتك.

## Generator: عنصر عند الطلب، مش Array كاملة

**Generator** دالة تحتوي yield؛ استدعاؤها يرجع كائن تكرار، وجسمها يتقدم أثناء foreach. تحتفظ بمكانها والمتغيرات بين العناصر. `yield from` تفوض إنتاج العناصر لمصدر آخر. احفظ `generator.php`؛ الكود متوافق مع PHP 7.0+ لكن استخدم بيئة PHP مدعومة:

~~~php
<?php
function batches(): Generator
{
    echo "begin", PHP_EOL;
    yield from [10, 20];
    yield from [30];
    echo "end", PHP_EOL;
}
$items = batches();
echo "created", PHP_EOL;
foreach ($items as $key => $value) {
    echo "{$key}:{$value}", PHP_EOL;
}
echo implode(',', iterator_to_array(batches(), false)), PHP_EOL;
~~~

~~~text
created
begin
0:10
1:20
0:30
end
begin
end
10,20,30
~~~

created قبل begin تثبت أن الاستدعاء لم يبن القائمة. المفتاح 0 يتكرر لأن yield from تحافظ على مفاتيح المصدر؛ `iterator_to_array(..., false)` يعيد الترقيم فلا يفقد 10. الخيار الافتراضي يحافظ على المفاتيح وقد يستبدل المتكرر. التحويل إلى Array يحمل كل العناصر، فيفقد ميزة الذاكرة. لإعادة المرور أنشئ Generator جديدة؛ لا تفترض rewind بعد استهلاكها.

في ملفات كبيرة اجعل Generator تقرأ سطرًا داخل try/finally وتقفل المقبض عند انتهائها أو تدميرها. الاحتفاظ بـGenerator متوقفة يحتفظ بمواردها. `yield from` لا تجعل القراءة غير متزامنة.

## WeakMap من 8.0: معلومات تتبع عمر كائن

**Strong reference** مرجع يبقي الكائن حيًا. WeakMap تستخدم كائنات كمفاتيح دون أن يكون المفتاح سببًا لإبقائها حية؛ مناسبة لmetadata، أي معلومات إضافية مؤقتة. احفظ `weak.php`، PHP 8.0+:

~~~php
<?php
$map = new WeakMap();
$request = new stdClass();
$map[$request] = 'checked';
$alias = $request;
echo count($map), PHP_EOL;
unset($request);
echo count($map), PHP_EOL;
unset($alias);
echo count($map), PHP_EOL;
~~~

~~~text
1
1
0
~~~

حذف request وحدها لا يكفي لأن alias مرجع قوي. بعد حذف الاثنين يختفي المدخل في هذا المثال بدون cycles. لو القيمة المخزنة نفسها تحتفظ بمرجع للمفتاح قد تبقيه حيًا؛ الضعف للمفتاح مش وعدًا بإزالة كل graph. لا تستخدم توقيت garbage collection لتقرير سداد أو حذف مهم، ولا تعتبر WeakMap cache دائمة. [المرجع](https://www.php.net/manual/en/class.weakmap.php).

## Fiber من 8.1: وقف واستئناف سلسلة استدعاءات

**Fiber** سياق تنفيذ يمكنه تعليق Call Stack ثم استكمالها. **Cooperative** يعني أن الكود يسلّم التحكم صراحة؛ ليست Thread ولا CPU parallelism. احفظ `fiber.php`، PHP 8.1+:

~~~php
<?php
$fiber = new Fiber(function (): string {
    echo "fiber entered", PHP_EOL;
    $reply = Fiber::suspend('need input');
    echo "fiber resumed", PHP_EOL;
    return strtoupper($reply);
});
echo "main before", PHP_EOL;
echo $fiber->start(), PHP_EOL;
echo "main between", PHP_EOL;
$fiber->resume('done');
echo $fiber->getReturn(), PHP_EOL;
~~~

~~~text
main before
fiber entered
need input
main between
fiber resumed
DONE
~~~

new Fiber لا تشغلها. start تدخل الجسم لحد suspend؛ قيمة need input ترجع للمستدعي. resume ترسل done لتصبح ناتج suspend في `$reply`. بعد النهاية getReturn تقرأ DONE؛ return النهائية مش بالضرورة قيمة resume. لا تستأنف قبل start أو بعد النهاية. دوال `isStarted/isSuspended/isTerminated` توضح الحالة.

Event loop مكتبة تنظم مَن يستأنف ومتى عند جاهزية I/O؛ Fiber وحدها لا تصنع loop ولا تجعل file_get_contents غير blocking. استخدم مكتبة موثوقة لو احتجت async. [مرجع Fibers](https://www.php.net/manual/en/language.fibers.php).

## DNF Types وReadonly Classes من 8.2

**Union** تقبل واحدًا من الأنواع، مثل A أو B. **Intersection** تشترط نفس الكائن يحقق النوعين A وB. **DNF** تجمعهما بصيغة «(A وB) أو C». الأقواس حول intersection مطلوبة. مثال `dnf.php` كامل على 8.2+:

~~~php
<?php
function describe((Countable&Stringable)|array $value): string
{
    return is_array($value) ? 'array:' . count($value) : (string) $value;
}
$items = new class implements Countable, Stringable {
    public function count(): int { return 2; }
    public function __toString(): string { return $this->count() . ' items'; }
};
echo describe([10, 20]), PHP_EOL;
echo describe($items), PHP_EOL;

readonly class Amount
{
    public function __construct(public int $minorUnits) {}
}
$amount = new Amount(500);
echo $amount->minorUnits, PHP_EOL;
try {
    $amount->minorUnits = 600;
} catch (Error) {
    echo "readonly blocked reassignment", PHP_EOL;
}
~~~

~~~text
array:2
2 items
500
readonly blocked reassignment
~~~

Array تمر من فرع union، والكائن يحقق Countable وStringable معًا. readonly class تجعل Instance properties المقيدة بالنوع readonly وتمنع dynamic properties؛ ليست deep immutability: كائن داخل property قد تتغير حالته. constructor promotion اختصار لتعريف property واستقبالها، ظهرت من 8.0، لكن readonly class نفسها 8.2.

Enums من 8.1 مجموعة حالات مغلقة؛ backed enum تستخدم from التي ترمي ValueError لو القيمة غير موجودة أو tryFrom التي ترجع null. readonly property من 8.1، وnever لدالة لا ترجع طبيعيًا، مثل التي تنهي أو ترمي دائمًا. اقرأ التفاصيل في [OOP](/oop/) و[نظام الأنواع](/php/03-types/).

## Attributes: بيانات وصفية تحتاج مَن يقرأها

**Reflection** فحص تعريفات الكود أثناء التشغيل. مثال `attribute.php`، PHP 8.0+:

~~~php
<?php
#[Attribute(Attribute::TARGET_FUNCTION)]
final class Label
{
    public function __construct(public string $text) {}
}
#[Label('Preview')]
function preview(): void {}
$definition = new ReflectionFunction('preview');
$label = $definition->getAttributes(Label::class)[0]->newInstance();
echo $label->text, PHP_EOL;
~~~

~~~text
Preview
~~~

Attribute لا تنفذ إذنًا أو مسارًا تلقائيًا؛ Reflection هنا قرأتها ثم استخدمنا text. `#[SensitiveParameter]` من 8.2 تخفي قيمة parameter في traces، ولا تنقح logs كتبتها بنفسك. `#[Override]` من 8.3 تساعد في كشف method يفترض أنها تعيد تعريف أصل غير موجود. Typed class constants من 8.3 تصرح النوع، مثل `public const int LIMIT = 10;`؛ والوصول الديناميكي `ClassName::{$name}` من 8.3.

## 8.4: Hooks وAsymmetric Visibility وLazy Objects

**Hook** كود عند قراءة/كتابة property. **Asymmetric visibility** صلاحية قراءة تختلف عن الكتابة. مثال `contact.php` على 8.4+:

~~~php
<?php
final class Contact
{
    public private(set) string $email {
        set {
            $clean = trim($value);
            if (filter_var($clean, FILTER_VALIDATE_EMAIL) === false) {
                throw new InvalidArgumentException('Invalid email');
            }
            $this->email = strtolower($clean);
        }
    }
    public function __construct(string $email) { $this->email = $email; }
}
$contact = new Contact(' OMAR@EXAMPLE.COM ');
echo $contact->email, PHP_EOL;
~~~

~~~text
omar@example.com
~~~

constructor مسموح لها بالكتابة، والقراءة public؛ كتابة خارجية تُرفض. lowercase البريد سياسة تعليمية هنا وليست قاعدة لكل نظم البريد. **Lazy object** تؤجل initialization لحين الحاجة للحالة؛ Reflection توفر ghost/proxy. تستخدمها DI/ORM غالبًا، ومش معنى lazy أن كل method تشغّل initializer فورًا. احتفظ بدالة مسماة للعمليات المعقدة بدل منطق مخفي في property. [مرجع lazy objects](https://www.php.net/manual/en/language.oop5.lazy-objects.php).

## 8.5: برنامج صغير بميزات صدرت بالفعل

احفظ `features85.php` وشغّله بـPHP 8.5. **URI** عنوان مورد؛ الامتداد الجديد يوفر APIs وفق RFC 3986 وWHATWG. Clone with تنسخ كائنًا وتعدل properties أثناء النسخ؛ لا تعيد تشغيل constructor تلقائيًا، فلا تعتمد عليها لإعادة التحقق:

~~~php
<?php
readonly class Page
{
    public function __construct(public string $title) {}
    public function withTitle(string $title): self
    {
        return clone($this, ['title' => $title]);
    }
}
$draft = new Page('Draft');
$published = $draft->withTitle('Published');
$slug = ' Learn PHP ' |> trim(...) |> strtolower(...);
$uri = new Uri\Rfc3986\Uri('https://example.com/notes?sort=new');
echo $draft->title, ' / ', $published->title, PHP_EOL;
echo $slug, PHP_EOL;
echo $uri->getHost(), PHP_EOL;
echo array_first(['A', 'B']), '/', array_last(['A', 'B']), PHP_EOL;
~~~

~~~text
Draft / Published
learn php
example.com
A/B
~~~

الأصل Draft لم يتغير. عملية clone with داخل method لها صلاحية الكتابة؛ readonly من 8.4 لها protected(set) افتراضيًا، فلا تفترض أن تعديلها من global scope مسموح. Pipe تمرر وسيطًا واحدًا لكل callable؛ تفاصيلها في الدرس 6. array_first/last تعيدان null للفارغ؛ null قد تكون قيمة عنصر أيضًا، فلا تخلط الحالتين لو العقد يفرقهما.

`#[NoDiscard]` تصدر Warning عند تجاهل نتيجة معلّمة؛ `(void)` تجاهل صريح في 8.5. توجد أيضًا attributes على constants، callable/static closures في constant expressions، وتوسيع asymmetric visibility، وخيار Cookie `partitioned`. راجع [الإعلان الرسمي لـ8.5](https://www.php.net/releases/8.5/en.php) قبل اختيار API، ولا تحول وجودها إلى إلزام باستخدامها.

## توقع، شخّص، كمّل

<details><summary>توقع عدد WeakMap بعد unset(request) مع بقاء alias</summary><p>1؛ alias مرجع قوي. الضعف في المفتاح لا يلغي المراجع الأخرى.</p></details>

<details><summary>Debugging: وضعت pipe داخل if لفحص الإصدار على PHP 8.4</summary><p>يفشل parsing قبل if. ضع المثال في ملف يعمل فقط على 8.5 أو استخدم الصياغة القديمة وارفع الحد الأدنى بخطة.</p></details>

<details><summary>كمّل نوع يقبل Array أو كائنًا Countable وStringable</summary><p><code>(Countable&amp;Stringable)|array</code> من 8.2. نفس الكائن لازم يحقق الواجهتين؛ union بينهما ستغير العقد.</p></details>

<details><summary>توقع وقت ظهور begin عند استدعاء batches فقط</summary><p>لن يظهر حتى تبدأ التكرار. Generator مؤجلة؛ تحويلها إلى Array يستهلكها بالكامل وقد يستهلك ذاكرة كبيرة.</p></details>

<details><summary>هل Fiber تقلل وقت حساب CPU طويل تلقائيًا؟</summary><p>لا. لا Thread ولا parallelism؛ من غير suspend يظل الحساب ممسكًا بالتحكم. فائدتها في تنظيم تعليق العمل مع scheduler وI/O مناسبين.</p></details>

شغّل كل ملف على الحد المعلن، و`php -l` على الأقل قبل التنفيذ. `php modern-features-lab.php` من [المختبر](/php/00-lab-setup/) يضيف enum وreadonly وmatch failures. راجع [الدعم الحالي](https://www.php.net/supported-versions.php) عند النشر.
