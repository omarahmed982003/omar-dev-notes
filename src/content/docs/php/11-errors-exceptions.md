---
title: 11. الأخطاء والاستثناءات
description: Throwable وError وException وtry/catch/finally والاستثناءات المخصصة وحدود المعالجة والتسجيل الآمن.
sidebar:
  order: 11
---

## Error أم Exception؟

كل من `Exception` و`Error` يطبقان `Throwable`. الاستثناء يمثل غالبًا فشلًا متوقعًا في العملية، بينما `Error` يشمل أخطاء لغة/نوع وتشغيل لا ينبغي تحويلها كلها إلى “نجاح”.

```php
try {
    $receipt = $payments->charge($order);
} catch (PaymentDeclined $e) {
    // فشل مجال متوقع
} catch (Throwable $e) {
    // حد التطبيق: سجّل ثم حوّل لاستجابة عامة
} finally {
    $lock?->release();
}
```

`finally` ينفذ سواء نجح المسار أو رُمي exception، لذلك يناسب تحرير resource. لا تستخدم catch فارغًا.

## استثناءات المجال

```php
final class InsufficientStock extends DomainException
{
    public function __construct(public readonly int $productId)
    {
        parent::__construct('Insufficient stock');
    }
}
```

اجعل النوع يحمل معنى يمكن للطبقة العليا ترجمته إلى `409` أو رسالة مناسبة. لا تستخدم نص الرسالة لاتخاذ قرار برمجي.

## Error reporting

في التطوير:

```ini
display_errors=On
error_reporting=E_ALL
```

في الإنتاج:

```ini
display_errors=Off
log_errors=On
error_reporting=E_ALL
```

إظهار stack trace للمستخدم قد يكشف paths وأسرارًا وSQL. أعطِ المستخدم رسالة عامة وrequest ID، وسجّل التفاصيل في قناة محمية.

## Global boundary

```php
set_exception_handler(function (Throwable $e): void {
    $requestId = bin2hex(random_bytes(8));
    error_log("[{$requestId}] {$e}");

    if (!headers_sent()) {
        http_response_code(500);
        header('Content-Type: application/json');
    }

    echo json_encode(['error' => 'Internal error', 'request_id' => $requestId]);
});
```

الـhandler شبكة أمان، وليس بديلًا عن معالجة الفشل المتوقع قرب سياقه.

## قواعد

- لا تستخدم `@` لإخفاء الأخطاء.
- لا تعرض رسالة exception الخام للعميل.
- احتفظ بـ`previous` عند wrapping.
- لا تسجل password أو token أو body كاملًا بلا تنقية.
- أعد المحاولة فقط للأخطاء المؤقتة وبعملية idempotent.

## خريطة الدرس

<div class="lesson-diagram" role="img" aria-label="خريطة مفاهيم: الأخطاء والاستثناءات">
<p class="lesson-diagram-title">خريطة مفاهيم: الأخطاء والاستثناءات</p>
<div class="diagram-flow">
<div class="diagram-node input"><span>Error أم Exception؟</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>استثناءات المجال</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>Error reporting</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node decision"><span>Global boundary</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node output"><span>قواعد</span></div>
</div>
</div>

## تأكد من فهمك

<div class="lesson-quiz" role="list">
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">01</span><p>اشرح «Error أم Exception؟» كأنك تراجع تطبيقًا حقيقيًا: ما الهدف وما أهم قيد يجب الانتباه له؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> كل من Exception وError يطبقان Throwable. الاستثناء يمثل غالبًا فشلًا متوقعًا في العملية، بينما Error يشمل أخطاء لغة/نوع وتشغيل لا ينبغي تحويلها كلها إلى “نجاح”. finally ينفذ سواء نجح المسار أو رُمي exception، لذلك يناسب تحرير resource. لا تستخدم catch فارغًا. عمليًا، لا يكفي تنفيذ المسار الناجح؛ يجب توثيق الافتراضات والتحقق من القيم والحالات التي قد تكسر هذا السلوك.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">02</span><p>قارن بين «Error أم Exception؟» و«استثناءات المجال». لماذا لا يغني أحدهما عن الآخر داخل موضوع «الأخطاء والاستثناءات»؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> في «Error أم Exception؟»: كل من Exception وError يطبقان Throwable. الاستثناء يمثل غالبًا فشلًا متوقعًا في العملية، بينما Error يشمل أخطاء لغة/نوع وتشغيل لا ينبغي تحويلها كلها إلى “نجاح”. finally ينفذ سواء نجح المسار أو رُمي exception، لذلك يناسب تحرير resource. لا تستخدم catch فارغًا. أما «استثناءات المجال»: اجعل النوع يحمل معنى يمكن للطبقة العليا ترجمته إلى 409 أو رسالة مناسبة. لا تستخدم نص الرسالة لاتخاذ قرار برمجي. العلاقة بينهما أن الأول يحدد جانبًا من الحل، والثاني يكمل السلوك أو القيود اللازمة لتطبيقه بصورة صحيحة.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">03</span><p>افترض أن نظامًا تجاهل «Error reporting». ما العطل أو الخطر المتوقع، وكيف تصمم اختبارًا يكشفه؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> في التطوير: في الإنتاج: إظهار stack trace للمستخدم قد يكشف paths وأسرارًا وSQL. أعطِ المستخدم رسالة عامة وrequest ID، وسجّل التفاصيل في قناة محمية. لاكتشاف الخلل، اختبر مسارًا صحيحًا، وقيمة عند الحد، ومدخلًا غير صالح، ثم راقب النتيجة والآثار الجانبية والسجل بدل الاكتفاء بعدم ظهور Exception.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">04</span><p>حوّل «Global boundary» إلى قرار هندسي قابل للمراجعة. ما الذي ستوثقه وما الحالات التي ستختبرها؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> الـhandler شبكة أمان، وليس بديلًا عن معالجة الفشل المتوقع قرب سياقه. وثّق سبب الاختيار والبدائل والحدود، واختبر الحالة العادية، والحد الأدنى والأقصى، والفشل الجزئي، وإعادة المحاولة أو التكرار إن كان السلوك يسمح بذلك.</div></details>
</section>
</div>
