---
title: "Scope: مين يقدر يشوف الـvariable؟"
prev: {"link":"/php/07-functions-and-includes/","label":"Functions وCallbacks"}
next: {"link":"/php/11-errors-exceptions/","label":"Errors وExceptions"}
description: "Scope: مين يقدر يشوف الـvariable؟"
sidebar:
  order: 7.5
---

بعد functions: **Scope** القواعد اللي تحدد منين تقدر تستخدم اسم variable. **Lifetime** المدة اللي تفضل القيمة فيها موجودة؛ دي مش نفس قواعد ظهور الاسم. **Global state** بيانات مشتركة غير ممررة صراحة للـfunction، وممكن تصعب الاختبار. هنقارنها بمدخل واضح.

## يعني إيه Scope؟

**Scope** هو المكان اللي يقدر الكود يشوف فيه اسم variable. variable المكتوب خارج functions في نطاق الملف، وvariable اللي يتعمل داخل function يكون Local للfunction.

```php
$taxRate = 0.14;

function showLocalScope(): void
{
    $message = 'I exist inside this function';
    echo $message;

    // echo $taxRate; // not automatically visible
}

showLocalScope();
// echo $message; // not visible here
```

<figure class="concept-visual" aria-labelledby="php-scope-visual-title">
<div class="visual-heading" id="php-scope-visual-title">اتبع الاستدعاء: الاسم ظاهر لمين في كل لحظة؟</div>
<p class="visual-note">افتح الخطوات بالترتيب وارجع لنفس مثال <code>showLocalScope()</code>. هنا بنرسم قواعد ظهور الأسماء، مش تقسيم RAM.</p>
<details class="trace-step" open>
<summary>1 — قبل استدعاء function</summary>
<div class="trace-state visual-panel"><p class="visual-label">File scope</p><p dir="ltr"><code>$taxRate = 0.14</code></p><p>كود الملف يقدر يستخدم <code>$taxRate</code>. جسم function لسه ما اشتغلش، و<code>$message</code> لسه ما اتعملتش في الاستدعاء ده.</p></div>
</details>
<details class="trace-step">
<summary>2 — أثناء تنفيذ <bdi dir="ltr">showLocalScope()</bdi></summary>
<div class="trace-state visual-panel"><p class="visual-label">Local scope</p><p dir="ltr"><code>$message = 'I exist inside this function'</code></p><p>السطر <code>echo $message</code> يقرأ الاسم المحلي. لكن <code>$taxRate</code> الخارجية مش متاحة تلقائيًا جوه function؛ وجودها في نفس الملف مش كفاية.</p></div>
</details>
<details class="trace-step">
<summary>3 — بعد رجوع function</summary>
<div class="trace-state visual-panel"><p class="visual-label">Back to file scope</p><p dir="ltr"><code>$taxRate → 0.14</code></p><p>كود الملف لسه يقدر يشوف <code>$taxRate</code>، لكنه ما يقدرش يستخدم اسم <code>$message</code> المحلي. في المثال ده القيمة المحلية ما خرجتش من الاستدعاء؛ غياب الاسم من نطاق معين مش قاعدة عامة إن كل قيمة مرتبطة به اتمسحت من الذاكرة فورًا.</p></div>
</details>
<figcaption>Scope بيسأل «أقدر أستخدم الاسم هنا؟». Lifetime بيسأل «القيمة عايشة لحد إمتى؟». دول سؤالين مختلفين؛ اتبع الاسم والقيمة كل واحد لوحده وإنت بتكمل الأمثلة.</figcaption>
</figure>

وجود نطاقات منفصلة بيقلل التصادم والتغييرات المفاجئة. function الأفضل تستقبل اللي تحتاجه صراحة:

```php
function priceWithTax(int $priceCents, float $taxRate): int
{
    return (int) round($priceCents * (1 + $taxRate));
}

echo priceWithTax(10000, 0.14); // 11400
```

دلوقتي function واضحة وسهل اختبارها: نفس المدخلات تعطي نفس النتيجة.

## `global` و`$GLOBALS`

PHP تسمح للfunction توصل لمتغير خارجي، لكن الأفضل تتجنب ده في أغلب الحالات:

```php
$total = 100;

function addTaxUsingGlobal(float $rate): float
{
    global $total;
    return $total * (1 + $rate);
}
```

وتقدر توصل لنفس القيمة عن طريق:

```php
function addTaxUsingGlobals(float $rate): float
{
    return $GLOBALS['total'] * (1 + $rate);
}
```

المشكلة إن اعتماد function بقى مخفيًا. لو `$total` مش موجود أو اتغير في مكان بعيد، النتيجة تتغير. تمرير القيمة كـArgument يجعل الاعتماد ظاهرًا وأسهل في الاختبار.

## variable `static` داخل function

الـLocal variable العادية تبدأ من جديد كل استدعاء. أما `static` المحلية فبتتهيأ مرة واحدة وبتحتفظ بالقيمة بين الاستدعاءات داخل نفس CLI process أونفس Request PHP عادية. في FPM التقليدي، Request تانية بتبدأ Userland state جديدة، يعني قيم وتعريفات جديدة لكود التطبيق، حتى لو نفس Worker استقبلها؛ في Long-running loop ممكن الحالة تعيش بين Jobs، وده محتاج Reset مقصود. المثال التالي CLI:

```php
function nextId(): int
{
    static $id = 0;
    return ++$id;
}

echo nextId(), PHP_EOL; // 1
echo nextId(), PHP_EOL; // 2
echo nextId(), PHP_EOL; // 3
```

ده مش تخزين دائم. لو العملية انتهت وبدأت عملية جديدة، القيمة تبدأ من الأول. كمان الحالة المخفية ممكن تصعّب الاختبار، فلا تستخدمها بدل قاعدة البيانات أو Cache أو Dependency واضحة.

## نطاق الملفات المضمّنة

الملف اللي بتضمه باستخدام `include` أو `require` يرث نطاق السطر اللي اتضم فيه:

```php
function loadConfig(): array
{
    $environment = 'development';
    return require __DIR__ . '/config.php';
}
```

لو `config.php` استخدم `$environment`، هيكون متاحًا لأنه اتضم داخل function. السلوك ده مفيد أحيانًا، لكنه ممكن يعمل اعتمادًا مخفيًا؛ الأفضل إن ملفات الإعداد ترجع قيمة واضحة بدل تعديل متغيرات كثيرة.


## جرّب بنفسك

قارن counter بـLocal عادية ونسخة بـstatic. توقع نتيجة استدعاء كل واحدة مرتين.

<details><summary>راجع بعد المحاولة</summary>

الـLocal تبدأ تاني في كل استدعاء، وstatic تحتفظ بقيمتها بين الاستدعاءات في نفس process/request، مش بين HTTP requests مستقلة.

</details>


## راجع فهمك

<div class="quiz-list" role="list">
<section class="quiz-card" role="listitem"><div class="quiz-question-row"><span class="quiz-number">01</span><p>ليه الدالة اللي تستقبل <code>$total</code> كـArgument أسهل في الاختبار من دالة تستخدم <code>global</code>؟</p></div><details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة:</strong> لأن كل اعتماد ظاهر في التوقيع، فنقدر نعطيها مدخلات محددة ونتوقع النتيجة. <code>global</code> يخلي النتيجة مرتبطة بحالة خارجية قد تتغير من مكان آخر.</div></details></section>
<section class="quiz-card" role="listitem"><div class="quiz-question-row"><span class="quiz-number">02</span><p>اكتب Counter باستخدام <code>static</code>، ثم اشرح ليه ماينفعش تستخدمه لحفظ عدد زيارات الموقع بشكل دائم.</p></div><details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة:</strong> الـstatic variable بتحتفظ بالقيمة بين استدعاءات function في نفس CLI process أونفس Request عادية. FPM التقليدي بيبدأ Userland state جديدة لكل Request، حتى مع بقاء Worker. كمان الطلبات ممكن تروح Workers أوServers مختلفة؛ العدد الدائم محتاج Shared storage مناسب.</div></details></section>
</div>

[ارجع لدليل PHP](/php/).

