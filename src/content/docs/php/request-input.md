---
title: "Request input وSuperglobals"
prev: {"link":"/php/14-datetime-timezones/","label":"التاريخ والوقت والمناطق الزمنية"}
next: {"link":"/php/09-uploads-cookies-sessions/","label":"Cookies وSessions"}
description: "اقرأ مدخل request وحدد نوعه وقواعده قبل الاستخدام"
sidebar:
  order: 14.5
---

المتطلبات: functions وarray وvalidation وHTML وHTTP. الـ**Superglobal** array توفرها PHP ويمكن الوصول لها داخل function بدون global. البيانات جاية من حدود ثقة؛ **Trust boundary** نقطة دخول بيانات مش مضمون شكلها أوصلاحيتها. وجود القيمة مش إثبات صحتها.

## Superglobals: بيانات متاحة في كل النطاقات

في تطبيق الويب، PHP بتحط أجزاء من الطلب والبيئة في مصفوفات خاصة اسمها **Superglobals**. متاحة داخل functions من غير `global`:

| variable | بيحتوي غالبًا على إيه؟ |
|---|---|
| `$_GET` | Query String الموجودة بعد `?` في الرابط |
| `$_POST` | حقول نموذج أُرسل بترميز Forms مناسب |
| `$_SERVER` | معلومات عن الطلب وserver والـHeaders المتاحة |
| `$_FILES` | بيانات الملفات المرفوعة |
| `$_COOKIE` | Cookies التي أرسلها العميل |
| `$_SESSION` | بيانات Session بعد `session_start()` |
| `$GLOBALS` | جدول variables العامة |

لو فتحت:

```text
http://localhost:8000/?page=2&category=books
```

تقدر تقرأ:

```php
$page = $_GET['page'] ?? '1';
$category = $_GET['category'] ?? 'all';
```

لكن كل بيانات جاية من المستخدم **غير موثوقة** حتى لو شكلها طبيعي.

## الوجود، والتحقق، والتحويل، والإخراج

دي أربع خطوات مختلفة:

1. **اقرأ القيمة** مع التعامل مع عدم وجودها.
2. **تحقق** إنها تحقق قواعد البرنامج.
3. **حوّلها** لنوع داخلي مناسب.
4. **اعمل Encoding** وقت إخراجها حسب السياق.

```php
$rawPage = $_GET['page'] ?? null;
$page = filter_var($rawPage, FILTER_VALIDATE_INT, [
    'options' => ['min_range' => 1, 'max_range' => 1000],
]);

if ($page === false) {
    $page = 1;
}
```

ليه استخدمنا `$page === false`؟ لأن `filter_var` ترجع `false` عند الفشل، والمقارنة الصارمة تمنع خلطها بقيم أخرى.

قائمة Checkboxes ممكن توصل كمصفوفة:

```text
?order_ids[]=10&order_ids[]=20
```

```php
function positiveIds(mixed $input, int $maximumCount = 100): array
{
    if (!is_array($input) || !array_is_list($input) || count($input) > $maximumCount) {
        throw new InvalidArgumentException('Expected a bounded list of IDs');
    }
    $ids = [];
    foreach ($input as $raw) {
        if ((!is_string($raw) && !is_int($raw))
            || preg_match('/\A[1-9][0-9]*\z/', (string) $raw) !== 1) {
            throw new InvalidArgumentException('Invalid ID');
        }
        $id = filter_var($raw, FILTER_VALIDATE_INT, ['options' => ['min_range' => 1]]);
        if ($id === false) {
            throw new InvalidArgumentException('ID exceeds integer range');
        }
        $ids[] = $id;
    }
    return $ids;
}

try {
    $orderIds = positiveIds($_GET['order_ids'] ?? []);
} catch (InvalidArgumentException) {
    http_response_code(422);
    exit('Invalid order IDs');
}
```

التحويل مش تحقق: `intval("12x")` بيطلع 12 رغم إن المدخل مش رقم صحيح. هنا بنقبل قائمة فيها 100 معرّف بحد أقصى، وكل معرّف عدد صحيح موجب بلا أصفار بادئة. بنرفض arrays المتداخلة والصفر وتجاوز الحد. القائمة الفارغة مسموحة. بعد التحقق لسه لازم تتأكد إن المستخدم المسجل يقدر يصل لكل طلب اختاره.

التحقق مش هو الـEscaping. ممكن الاسم يكون صحيحًا حسب قواعدك، لكن يظل محتاج `htmlspecialchars()` عند عرضه في HTML، وPrepared Statement عند استخدامه كقيمة في SQL.

## ليه `eval()` خطيرة؟

`eval()` تأخذ نصًا وتنفذه ككود PHP:

```php
$code = 'echo "hello";';
eval($code);
```

لو النص جاء من مستخدم، فأنت سمحت له يكتب كودًا على السيرفر. في التطبيقات العادية مش محتاج `eval()` أصلًا. استخدم دوالًا أو مصفوفة Callbacks أو `match`:

```php
$operations = [
    'trim' => static fn (string $value): string => trim($value),
    'upper' => static fn (string $value): string => strtoupper($value),
];

$operation = 'trim';
$result = $operations[$operation]('  hello  ');
```

## برنامج كامل: ترحيب من الرابط

```php
<?php
declare(strict_types=1);

$rawName = $_GET['name'] ?? 'Guest';

if (!is_string($rawName)) {
    $rawName = 'Guest';
}

$name = trim($rawName);
if ($name === '' || mb_strlen($name) > 50) {
    $name = 'Guest';
}

$safeName = htmlspecialchars($name, ENT_QUOTES, 'UTF-8');
?>
<!doctype html>
<html lang="en">
<head><meta charset="utf-8"><title>Greeting</title></head>
<body><h1>Hello <?= $safeName ?></h1></body>
</html>
```

جرّب الحالات دي:

```text
/?name=Omar
/?name=
/?name[]=Omar
/?name=<script>alert(1)</script>
```

كل حالة بتختبر حاجة مختلفة: قيمة طبيعية، قيمة فاضية، نوع غير متوقع، ومحاولة إدخال HTML.




## راجع فهمك

<div class="quiz-list" role="list">
<section class="quiz-card" role="listitem"><div class="quiz-question-row"><span class="quiz-number">01</span><p>الرابط يحتوي <code>?page=abc</code>. ليه التحويل المباشر إلى <code>int</code> مش كفاية؟</p></div><details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة:</strong> التحويل قد ينتج صفرًا ويخفي إن المدخل كان غير صالح. الأفضل نتحقق أنه Integer وفي النطاق المطلوب، ثم نقرر هل نستخدم Default أم نرجع خطأ.</div></details></section>
<section class="quiz-card" role="listitem"><div class="quiz-question-row"><span class="quiz-number">02</span><p>إيه الفرق بين Validation وHTML Encoding؟</p></div><details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة:</strong> Validation تقرر هل القيمة تحقق قواعد البرنامج. Encoding يحول القيمة وقت إخراجها بحيث يتعامل معها المتصفح كبيانات في السياق المحدد، لا ككود.</div></details></section>
</div>

[ارجع لدليل PHP](/php/).

