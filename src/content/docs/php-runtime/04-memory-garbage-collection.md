---
title: 4. ذاكرة PHP وGarbage Collection
description: zval وReference Counting وCopy-on-write والمراجع والكائنات والدورات المرجعية وقياس الذاكرة.
sidebar:
  order: 4
---

# كيف تمثل PHP القيم في الذاكرة؟

محرك Zend يمثل قيمة PHP ببنية داخلية تسمى `zval` تحمل نوع القيمة وبياناتها. بعض البيانات المركبة مثل strings وarrays وobjects لها هياكل إضافية محسوبة المراجع.

:::caution[تصحيح للملاحظات القديمة]
وصف `zval` بأنه دائمًا `type + value + is_ref + refcount` مناسب تاريخيًا لـPHP 5، لكنه تبسيط غير دقيق لـPHP 7/8. في المحرك الحديث قد يكون Reference نفسه zval منفصلًا، وتوجد تفاصيل refcount داخل البنية المشار إليها بحسب النوع. تعلّم السلوك المرئي في PHP ولا تعتمد على layout داخلي ثابت.
:::

## Reference Counting

عندما لا يعود شيء يشير إلى قيمة محسوبة المراجع، يمكن تحريرها فورًا عادة. لكن `refcount` ليس “عدد المتغيرات” بصورة مطلقة؛ قد تتدخل temporaries وinterning وتحسينات المحرك، لذلك مخرجات debugging قد تبدو أعلى من المتوقع.

```php
$first = ['name' => 'Omar'];
$second = $first;

unset($first);
// ما زالت البيانات موجودة لأن $second يستخدمها.
```

## Copy-on-write

عند الإسناد لا ينسخ PHP array أو string كبيرًا فورًا عادة؛ يشترك المتغيران في البيانات حتى يحاول أحدهما تعديلها:

```php
$original = range(1, 100_000);
$copy = $original;       // مشاركة مؤقتة
$copy[] = 100_001;       // هنا يلزم فصل البيانات المعدلة
```

هذا يوفّر الذاكرة والوقت، لكنه يعني أن تعديل نسخة كبيرة قد يسبب memory spike لحظيًا.

الكائنات تختلف:

```php
$a = new stdClass();
$a->count = 1;
$b = $a;
$b->count++;

echo $a->count; // 2
```

`$a` و`$b` يحملان handle للكائن نفسه. للحصول على كائن مستقل استخدم `clone` ونفّذ `__clone()` للنسخ العميق عند الحاجة.

## References بعلامة &

```php
$value = 10;
$alias =& $value;
$alias = 20;

echo $value; // 20
```

المرجع في PHP alias إلى نفس متغير التخزين، وليس مؤشر C عام يمكن إجراء pointer arithmetic عليه. لا تستخدم `&` كتحسين أداء؛ غالبًا يزيد التعقيد وقد يمنع تحسينات Copy-on-write.

## لماذا نحتاج Garbage Collector؟

Reference counting وحده لا يحرر دورة تشير إلى نفسها:

```php
final class Node
{
    public ?Node $next = null;
}

$a = new Node();
$b = new Node();
$a->next = $b;
$b->next = $a;

unset($a, $b); // بقيت دورة لا يصل إليها كود المستخدم
```

يسجل GC الحاويات المرشحة ويفحص الدورات دوريًا. يمكن طلب دورة جمع يدويًا:

```php
$cycles = gc_collect_cycles();
printf("Collected %d cycles\n", $cycles);
```

لا تستدعها بعد كل عملية. استخدمها في workers طويلة العمر فقط بعد القياس، مثل queue consumer ينشئ graphs كبيرة بين jobs.

## الذاكرة في PHP-FPM

في نموذج request/response تُحرر ذاكرة الطلب عادة عند انتهائه، لكن الـWorker نفسه يبقى حيًا وقد تحتفظ Extensions أو caches أو fragmentation بذاكرة. لذلك `pm.max_requests` مفيد لإعادة تدوير workers دوريًا، لكنه لا يصلح تسربًا منطقيًا داخل عملية طويلة.

## القياس

```php
$before = memory_get_usage(true);

$rows = loadReportRows();

printf(
    "current=%s peak=%s delta=%s\n",
    number_format(memory_get_usage(true)),
    number_format(memory_get_peak_usage(true)),
    number_format(memory_get_usage(true) - $before),
);
```

`true` يعرض الذاكرة المخصصة من النظام لمحرك PHP، وقد تكون أكبر من الحجم الفعلي المستخدم. قِس داخل workload واقعي واستخدم profiler عند الحاجة.

## تقليل الاستهلاك

- استخدم Generator أو pagination بدل تحميل ملايين الصفوف.
- حرر المراجع الكبيرة داخل loops طويلة بـ`unset()` عند ثبوت الحاجة.
- تجنب `fetchAll()` للنتائج الضخمة.
- انتبه إلى closures التي تلتقط كائنات كبيرة.
- افصل cache مشتركة مثل OPcache/Redis عن ذاكرة heap الخاصة بالطلب.
- لا ترفع `memory_limit` قبل معرفة سبب الاستهلاك.

## خريطة الدرس

<div class="lesson-diagram" role="img" aria-label="خريطة مفاهيم: ذاكرة PHP وGarbage Collection">
<p class="lesson-diagram-title">خريطة مفاهيم: ذاكرة PHP وGarbage Collection</p>
<div class="diagram-flow">
<div class="diagram-node input"><span>Reference Counting</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>Copy-on-write</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>References بعلامة &amp;</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node decision"><span>لماذا نحتاج Garbage Collector؟</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node output"><span>الذاكرة في PHP-FPM</span></div>
</div>
</div>

## تأكد من فهمك

<div class="lesson-quiz" role="list">
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">01</span><p>اشرح «Reference Counting» كأنك تراجع تطبيقًا حقيقيًا: ما الهدف وما أهم قيد يجب الانتباه له؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> عندما لا يعود شيء يشير إلى قيمة محسوبة المراجع، يمكن تحريرها فورًا عادة. لكن refcount ليس “عدد المتغيرات” بصورة مطلقة؛ قد تتدخل temporaries وinterning وتحسينات المحرك، لذلك مخرجات debugging قد تبدو أعلى من المتوقع. عمليًا، لا يكفي تنفيذ المسار الناجح؛ يجب توثيق الافتراضات والتحقق من القيم والحالات التي قد تكسر هذا السلوك.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">02</span><p>قارن بين «Reference Counting» و«Copy-on-write». لماذا لا يغني أحدهما عن الآخر داخل موضوع «ذاكرة PHP وGarbage Collection»؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> في «Reference Counting»: عندما لا يعود شيء يشير إلى قيمة محسوبة المراجع، يمكن تحريرها فورًا عادة. لكن refcount ليس “عدد المتغيرات” بصورة مطلقة؛ قد تتدخل temporaries وinterning وتحسينات المحرك، لذلك مخرجات debugging قد تبدو أعلى من المتوقع. أما «Copy-on-write»: عند الإسناد لا ينسخ PHP array أو string كبيرًا فورًا عادة؛ يشترك المتغيران في البيانات حتى يحاول أحدهما تعديلها: هذا يوفّر الذاكرة والوقت، لكنه يعني أن تعديل نسخة كبيرة قد يسبب memory spike لحظيًا. الكائنات تختلف: $a و$b يحملان handle للكائن نفسه. للحصول على كائن مستقل استخدم clone ونفّذ __clone() للنسخ العميق عند الحاجة. العلاقة بينهما أن الأول يحدد جانبًا من الحل، والثاني يكمل السلوك أو القيود اللازمة لتطبيقه بصورة صحيحة.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">03</span><p>افترض أن نظامًا تجاهل «References بعلامة &amp;». ما العطل أو الخطر المتوقع، وكيف تصمم اختبارًا يكشفه؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> المرجع في PHP alias إلى نفس متغير التخزين، وليس مؤشر C عام يمكن إجراء pointer arithmetic عليه. لا تستخدم &amp; كتحسين أداء؛ غالبًا يزيد التعقيد وقد يمنع تحسينات Copy-on-write. لاكتشاف الخلل، اختبر مسارًا صحيحًا، وقيمة عند الحد، ومدخلًا غير صالح، ثم راقب النتيجة والآثار الجانبية والسجل بدل الاكتفاء بعدم ظهور Exception.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">04</span><p>حوّل «لماذا نحتاج Garbage Collector؟» إلى قرار هندسي قابل للمراجعة. ما الذي ستوثقه وما الحالات التي ستختبرها؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> Reference counting وحده لا يحرر دورة تشير إلى نفسها: يسجل GC الحاويات المرشحة ويفحص الدورات دوريًا. يمكن طلب دورة جمع يدويًا: لا تستدعها بعد كل عملية. استخدمها في workers طويلة العمر فقط بعد القياس، مثل queue consumer ينشئ graphs كبيرة بين jobs. وثّق سبب الاختيار والبدائل والحدود، واختبر الحالة العادية، والحد الأدنى والأقصى، والفشل الجزئي، وإعادة المحاولة أو التكرار إن كان السلوك يسمح بذلك.</div></details>
</section>
</div>
