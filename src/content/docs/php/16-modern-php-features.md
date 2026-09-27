---
title: 16. خريطة ميزات PHP الحديثة 8.0–8.5
description: خريطة زمنية من PHP 8.0 إلى 8.5 تشمل WeakMap وFibers وDNF Types وReadonly Classes وProperty Hooks.
sidebar:
  order: 16
---

## قبل ما تبدأ

ذاكر الدرس على 3 خطوات: افهم المشكلة الأول، تابع المثال، وبعدها جرّب الجزء العملي بنفسك. المصطلحات الجديدة الموجودة تحت متشرحة قبل ما ندخل في التفاصيل.

### كلمات جديدة في الدرس

- **Runtime:** وقت التشغيل: الفترة اللي البرنامج بيكون شغال فيها فعلًا.
- **Proxy:** وسيط يستقبل الطلب ويمرره لجهة أخرى حسب قواعد محددة.
- **Cache:** نسخة مؤقتة من البيانات هدفها تقليل وقت الانتظار والعمل المتكرر.
- **Loop:** حلقة تكرار تعيد تنفيذ مجموعة تعليمات وفق شرط.
- **Function:** دالة: جزء كود له اسم ومهمة محددة ويمكن استدعاؤه أكثر من مرة.


## الحديث مش معناه تستخدم كل ميزة

ميزات PHP الحديثة بتحل مشاكل حقيقية، لكن اختيار الميزة يبدأ من نسخة PHP اللي المشروع يضمنها ومن المشكلة اللي بتحاول تحلها. كتابة Syntax من 8.4 في Package تعلن دعم 8.1 هتكسر التحميل قبل ما الكود يوصل لأي شرط.

ابدأ دائمًا بـ`composer.json` وCI:

```json
{
  "require": {
    "php": "^8.2"
  }
}
```

وبعدها اسأل عن كل ميزة:

1. ظهرت في أي إصدار؟
2. هل بيئة Production وCI والمطورين على الإصدار ده؟
3. هل الميزة توضح التصميم ولا بتخليه أصعب على الفريق؟
4. هل فيه Migration أوStatic Analysis يكتشف عدم التوافق؟

الخريطة الزمنية في الدرس مش قائمة لازم تستخدمها كلها. مثلًا `WeakMap` مفيدة لربط Metadata بعمر Object، وFibers أساس تبني عليه مكتبات Async، لكن تطبيق CRUD عادي غالبًا مش محتاج يستخدمهم مباشرة. اقرأ المثال علشان تعرف المشكلة التي تحلها الميزة قبل حفظ صياغتها.

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

## الخريطة الزمنية من PHP 8.0 إلى 8.3

| الإصدار | أهم ما يجب فهمه |
|---|---|
| PHP 8.0 | Named Arguments وAttributes وConstructor Property Promotion وUnion Types و`match` وNullsafe Operator و`WeakMap` و`ValueError` |
| PHP 8.1 | Enums وFibers وFirst-class Callables وIntersection Types و`never` وReadonly Properties |
| PHP 8.2 | DNF Types وReadonly Classes و`true` و`false` و`null` كأنواع مستقلة و`#[SensitiveParameter]` وتحذير Dynamic Properties |
| PHP 8.3 | Typed Class Constants و`#[Override]` وتحسينات Readonly أثناء `clone` والوصول الديناميكي إلى Class Constants |

هذه الخريطة ليست قائمة ترقية عمياء. اقرأ Backward Incompatible Changes وDeprecated Features لكل إصدار، وشغّل الاختبارات والتحليل الساكن قبل تغيير قيد PHP في `composer.json`.

## WeakMap — PHP 8.0

تربط `WeakMap` بيانات إضافية بكائن دون أن تجعل الخريطة سببًا في بقاء الكائن داخل الذاكرة. عندما لا يبقى Reference قوي للكائن، يستطيع Garbage Collector إزالة الكائن ومدخله من الخريطة.

```php
<?php

declare(strict_types=1);

final class Request {}

$metadata = new WeakMap();
$request = new Request();
$metadata[$request] = ['startedAt' => microtime(true)];

echo isset($metadata[$request]) ? "tracked\n" : "missing\n";
unset($request);

echo count($metadata), PHP_EOL; // 0 بعد جمع الكائن
```

استخدمها للـmetadata المرتبطة بكائن لا تملكه، لا كبديل عام للمصفوفات أو Cache دائم. لا تعتمد على توقيت Garbage Collection لتنفيذ منطق عمل مهم.

## Fibers — PHP 8.1

Fiber وحدة تنفيذ يمكن إيقافها واستئنافها تعاونيًا. هي لا تنشئ Thread ولا تجعل العملية CPU-parallel تلقائيًا؛ فائدتها الأساسية أن Event Loops ومكتبات الـasync تستطيع إخفاء State Machine مع الاحتفاظ بشكل كود متسلسل.

```php
<?php

$fiber = new Fiber(function (): string {
    $reply = Fiber::suspend('waiting-for-data');
    return strtoupper((string) $reply);
});

echo $fiber->start(), PHP_EOL;      // waiting-for-data
$fiber->resume('done');
echo $fiber->getReturn(), PHP_EOL;  // DONE
```

لا تستدعِ `resume()` قبل `start()`، ولا تستأنف Fiber انتهت. في تطبيقات الويب التقليدية استخدم Framework أو Runtime async موثوقًا بدل بناء Scheduler خاص بلا حاجة.

## yield from وتركيب Generators

`yield from` يفوض التكرار إلى iterable آخر، فيسمح بتقسيم Pipeline القراءة إلى Generators صغيرة دون تحميل كل البيانات في الذاكرة.

```php
function lines(string $path): Generator
{
    $file = new SplFileObject($path);
    foreach ($file as $line) {
        yield rtrim((string) $line, "\r\n");
    }
}

function allLines(array $paths): Generator
{
    foreach ($paths as $path) {
        yield from lines($path);
    }
}
```

Generator أحادي المرور غالبًا؛ لا تفترض أنك تستطيع إعادته إلى البداية بعد استهلاكه. و`yield from` لا يجعل I/O غير متزامنًا وحده.

## DNF Types وReadonly Classes — PHP 8.2

DNF Type هي Union من Intersection Types، ويجب وضع كل Intersection بين أقواس:

```php
function export((JsonSerializable&Stringable)|array $value): string
{
    return is_array($value)
        ? json_encode($value, JSON_THROW_ON_ERROR)
        : (string) $value;
}

readonly class Money
{
    public function __construct(
        public int $minorUnits,
        public string $currency,
    ) {
        if ($minorUnits < 0) {
            throw new InvalidArgumentException('Negative money');
        }
    }
}
```

Readonly Class تجعل Instance Properties المعلنة Readonly وتمنع Dynamic Properties، لكنها لا تجعل الكائنات الداخلية Deeply Immutable. إذا احتوت Property على كائن قابل للتغيير فقد تتغير حالته الداخلية.

## Attributes وReflection — PHP 8+

```php
#[Attribute(Attribute::TARGET_FUNCTION)]
final readonly class RequiresRole
{
    public function __construct(public string $role) {}
}

#[RequiresRole('admin')]
function deleteUser(int $id): void {}

$attribute = (new ReflectionFunction('deleteUser'))
    ->getAttributes(RequiresRole::class)[0]->newInstance();
echo $attribute->role; // admin
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

- [PHP 8.0](https://www.php.net/manual/en/migration80.new-features.php) و[PHP 8.1](https://www.php.net/manual/en/migration81.new-features.php)
- [PHP 8.2](https://www.php.net/manual/en/migration82.new-features.php) و[PHP 8.3](https://www.php.net/manual/en/migration83.new-features.php)
- [PHP 8.4](https://www.php.net/releases/8.4/en.php)
- [PHP 8.5](https://www.php.net/releases/8.5/en.php)
- [الإصدارات المدعومة](https://www.php.net/supported-versions.php)

## تدريب عملي متدرج

<details><summary>1. المشروع يدعم PHP 8.2. هل تستخدم Property Hooks؟</summary><p>لا، لأنها من 8.4. ارفع الحد الأدنى بعد خطة ترقية أو استخدم تصميمًا متوافقًا مع 8.2.</p></details>

<details><summary>2. إمتى WeakMap أنسب من Array بمعرّف الكائن؟</summary><p>لما الـMetadata لازم تختفي تلقائيًا عند عدم وجود References للكائن، من غير ما التخزين نفسه يطيل عمره.</p></details>

<details><summary>3. هل Fiber معناها تنفيذ متوازي؟</summary><p>لا. هي Cooperative Suspension داخل Thread؛ الـEvent Loop أوالمكتبة تنظم الاستئناف، وهي ليست CPU Parallelism.</p></details>

## مسائل مرتبطة بالدرس

<details><summary>هل تستخدم ميزة حديثة لمجرد وجودها؟</summary><p>لا. اربطها بمشكلة واضحة وحدد minimum PHP version واختبر دعم بيئة الإنتاج والأدوات.</p></details>

<details><summary>ما فائدة readonly؟</summary><p>تجعل نية عدم إعادة إسناد الحالة صريحة، لكنها لا تجعل كل object graph عميقًا غير قابل للتغيير.</p></details>

## شغّل وتحقق

استخدم [المختبر القابل للتنزيل](/php/00-lab-setup/) للسكربتات المرفقة. أوامر Composer وFPM وDocker والخادم الحقيقي تُنفذ داخل المشروع المُجهز للخدمة، مش مجلد فاضي.

نفّذ نقطة التحقق التالية داخل بيئة الدرس:

~~~bash
php modern-features-lab.php
~~~

**معيار النجاح:** تغطي الاختبارات enum صالحًا وغير صالح وreadonly mutation وmatch بلا فرع؛ استخدم الميزة لأنها تقوي العقد لا لأنها جديدة.

دوّن كود الخروج والدليل الفعلي. إذا اختلف الناتج، فسر البيئة أو الفرضية التي اختلفت بدل تعديل «المتوقع» حتى يطابق الخطأ.

## اربط النقاط ببعض

قسّم القراءة حسب minimum PHP version في مشروعك: stable usable features، ثم migration/deprecations، ثم ميزات لا تستخدمها إلا عند رفع المنصة. شغّل CI على أقل وأعلى إصدار مدعومين واستخدم PHPCompatibility أو تحليلًا مماثلًا. لا تجعل مثال 8.5 يعمل في ملف يدعي دعم 8.1.

### جرّب بنفسك

أنشئ compatibility matrix لكل مثال وحدد البديل في الإصدار الأدنى.
