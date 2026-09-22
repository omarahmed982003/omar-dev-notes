---
title: 4. التجريد والواجهات
description: Abstract Classes وMethods وInterfaces والعقود والفروق ومتى نستخدم كل نوع.
sidebar:
  order: 4
---

## Abstraction

التجريد يعرض ما يحتاجه المستدعي ويخفي تفاصيل التنفيذ. في PHP نستخدم abstract classes وinterfaces وcomposition.

## Abstract class

لا يمكن إنشاء instance منها. تستطيع الاحتفاظ بحالة وconstructor وmethods منفذة وabstract methods:

```php
abstract class PaymentMethod
{
    public function __construct(
        protected readonly string $accountId,
    ) {}

    final public function charge(int $amountCents): Receipt
    {
        if ($amountCents <= 0) {
            throw new InvalidArgumentException('Amount must be positive');
        }
        return $this->performCharge($amountCents);
    }

    abstract protected function performCharge(int $amountCents): Receipt;
}
```

الـabstract method تعلن signature بلا body، وعلى concrete child تنفيذها بتوافق. وجود تنفيذ مشترك وحالة محمية قد يبرر abstract base، لكن لا تجعلها مخزن utilities غير مترابطة.

بدءًا من PHP 8.4 توجد abstract properties بشروط get/set، لكن استخدمها فقط عند استهداف ذلك الإصدار وبعد فهم property hooks؛ method contract أكثر توافقًا ووضوحًا في مكتبات متعددة الإصدارات.

## Interface

Interface عقد type بلا فرض inheritance tree:

```php
interface PaymentGateway
{
    public function charge(string $customerId, int $amountCents): Receipt;
    public function refund(string $paymentId): void;
}

final class StripeGateway implements PaymentGateway
{
    public function charge(string $customerId, int $amountCents): Receipt
    {
        return new Receipt('pay_123');
    }

    public function refund(string $paymentId): void {}
}
```

class تستطيع تنفيذ عدة interfaces. Methods في interface public. يمكنها تعريف constants، لكن لا تحولها إلى حقيبة إعدادات.

## Interface Segregation

```php
interface ChargesPayments
{
    public function charge(string $customerId, int $amount): Receipt;
}

interface RefundsPayments
{
    public function refund(string $paymentId): void;
}
```

العميل يعتمد فقط على capability التي يحتاجها.

| النقطة | Abstract class | Interface |
|---|---|---|
| State وconstructor | نعم | لا كحالة instance |
| تنفيذ مشترك | نعم | signatures فقط عادة |
| العدد | extends واحدة | implements متعددة |
| العلاقة | عائلة قريبة | capability/contract |

استخدم interface عند حدود التطبيق وحقن الاعتماديات. استخدم abstract class عندما توجد علاقة قوية وتنفيذ مشترك ثابت، لا لمجرد تجنب تكرار بسيط.

## خريطة الدرس

<div class="lesson-diagram" role="img" aria-label="خريطة مفاهيم: التجريد والواجهات">
<p class="lesson-diagram-title">خريطة مفاهيم: التجريد والواجهات</p>
<div class="diagram-flow">
<div class="diagram-node input"><span>Abstraction</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>Abstract class</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>Interface</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node decision"><span>Interface Segregation</span></div>
</div>
</div>

## تأكد من فهمك

<div class="lesson-quiz" role="list">
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">01</span><p>اشرح «Abstraction» كأنك تراجع تطبيقًا حقيقيًا: ما الهدف وما أهم قيد يجب الانتباه له؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> التجريد يعرض ما يحتاجه المستدعي ويخفي تفاصيل التنفيذ. في PHP نستخدم abstract classes وinterfaces وcomposition. عمليًا، لا يكفي تنفيذ المسار الناجح؛ يجب توثيق الافتراضات والتحقق من القيم والحالات التي قد تكسر هذا السلوك.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">02</span><p>قارن بين «Abstraction» و«Abstract class». لماذا لا يغني أحدهما عن الآخر داخل موضوع «التجريد والواجهات»؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> في «Abstraction»: التجريد يعرض ما يحتاجه المستدعي ويخفي تفاصيل التنفيذ. في PHP نستخدم abstract classes وinterfaces وcomposition. أما «Abstract class»: لا يمكن إنشاء instance منها. تستطيع الاحتفاظ بحالة وconstructor وmethods منفذة وabstract methods: الـabstract method تعلن signature بلا body، وعلى concrete child تنفيذها بتوافق. وجود تنفيذ مشترك وحالة محمية قد يبرر abstract base، لكن لا تجعلها مخزن utilities غير مترابطة. بدءًا من PHP 8.4 توجد abstract properties بشروط get/set، لكن استخدمها فقط عند استهداف ذلك الإصدار وبعد فهم property hooks؛ method contract أكثر… العلاقة بينهما أن الأول يحدد جانبًا من الحل، والثاني يكمل السلوك أو القيود اللازمة لتطبيقه بصورة صحيحة.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">03</span><p>افترض أن نظامًا تجاهل «Interface». ما العطل أو الخطر المتوقع، وكيف تصمم اختبارًا يكشفه؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> Interface عقد type بلا فرض inheritance tree: class تستطيع تنفيذ عدة interfaces. Methods في interface public. يمكنها تعريف constants، لكن لا تحولها إلى حقيبة إعدادات. لاكتشاف الخلل، اختبر مسارًا صحيحًا، وقيمة عند الحد، ومدخلًا غير صالح، ثم راقب النتيجة والآثار الجانبية والسجل بدل الاكتفاء بعدم ظهور Exception.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">04</span><p>حوّل «Interface Segregation» إلى قرار هندسي قابل للمراجعة. ما الذي ستوثقه وما الحالات التي ستختبرها؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> العميل يعتمد فقط على capability التي يحتاجها. | النقطة | Abstract class | Interface | |---|---|---| | State وconstructor | نعم | لا كحالة instance | | تنفيذ مشترك | نعم | signatures فقط عادة | | العدد | extends واحدة | implements متعددة | | العلاقة | عائلة قريبة | capability/contract | استخدم interface عند حدود التطبيق وحقن الاعتماديات. استخدم abstract class عندما توجد علاقة قوية وتنفيذ مشترك ثابت، لا لمجرد تجنب… وثّق سبب الاختيار والبدائل والحدود، واختبر الحالة العادية، والحد الأدنى والأقصى، والفشل الجزئي، وإعادة المحاولة أو التكرار إن كان السلوك يسمح بذلك.</div></details>
</section>
</div>
