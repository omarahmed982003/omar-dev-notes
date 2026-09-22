---
title: 2. الوراثة وتعدد الأشكال
description: علاقة is-a وextends وoverride وfinal والتعامل مع عدة أنواع من خلال عقد واحد.
sidebar:
  order: 2
---

## Inheritance: علاقة is-a

```php
abstract class Notification
{
    public function __construct(public readonly string $recipient) {}

    abstract public function send(string $message): void;
}

final class EmailNotification extends Notification
{
    public function send(string $message): void
    {
        echo "Email to {$this->recipient}: {$message}";
    }
}

final class SmsNotification extends Notification
{
    public function send(string $message): void
    {
        echo "SMS to {$this->recipient}: {$message}";
    }
}
```

`EmailNotification is a Notification` علاقة منطقية. إذا لم يستطع child احترام عقد الأب فليست الوراثة مناسبة.

PHP تدعم single class inheritance: class لها parent واحدة، لكنها تستطيع تنفيذ عدة interfaces واستخدام عدة traits.

## Override

الـchild يعيد تنفيذ method موروثة مع توقيع متوافق. لا تغيّر المعنى المتوقع أو تشدد الشروط بطريقة تكسر المستدعي.

```php
function notify(Notification $notification, string $message): void
{
    $notification->send($message);
}

notify(new EmailNotification('omar@example.com'), 'Welcome');
notify(new SmsNotification('+201...'), 'Code: 1234');
```

هذه **Polymorphism**: الكود يتعامل مع contract مشترك، والتنفيذ الفعلي يتحدد حسب object.

يمكن استخدام attribute لتأكيد نية override في PHP الحديثة:

```php
#[\Override]
public function send(string $message): void
{
    // ...
}
```

## final

- `final class`: لا يمكن تمديدها.
- `final method`: لا يمكن للـchild عمل override.
- `final const`: لا يمكن إعادة تعريفها في child.

استخدم `final` عندما يكون الامتداد سيكسر invariants أو لا يمثل extension point مصممًا.

## private وprotected أثناء الوراثة

الـprivate في الأب موجود في جزء الأب من object لكن child لا يصل إليه مباشرة. اعرض protected/public method بدل تحويل كل شيء إلى protected.

## Composition بدل inheritance

```php
final class OrderService
{
    public function __construct(
        private PaymentGateway $payments,
        private Notifier $notifier,
    ) {}
}
```

Composition تعني **has-a** وتسمح بتبديل التعاون عبر interfaces دون شجرة وراثة صلبة. استخدم inheritance عندما توجد علاقة is-a ثابتة وsubstitutability صحيحة؛ وإلا فضّل composition.

## أخطاء تصميم

- Base class ضخمة فيها hooks كثيرة.
- child يرمي exceptions للعمليات الأساسية التي يعد بها الأب.
- الوراثة لإعادة استخدام سطرين فقط.
- فحص `instanceof` طويل بدل polymorphic method.
- تعديل signature بطريقة غير متوافقة.

## خريطة الدرس

<div class="lesson-diagram" role="img" aria-label="خريطة مفاهيم: الوراثة وتعدد الأشكال">
<p class="lesson-diagram-title">خريطة مفاهيم: الوراثة وتعدد الأشكال</p>
<div class="diagram-flow">
<div class="diagram-node input"><span>Inheritance: علاقة is-a</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>Override</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>final</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node decision"><span>private وprotected أثناء الوراثة</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node output"><span>Composition بدل inheritance</span></div>
</div>
</div>

## تأكد من فهمك

<div class="lesson-quiz" role="list">
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">01</span><p>اشرح «Inheritance: علاقة is-a» كأنك تراجع تطبيقًا حقيقيًا: ما الهدف وما أهم قيد يجب الانتباه له؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> EmailNotification is a Notification علاقة منطقية. إذا لم يستطع child احترام عقد الأب فليست الوراثة مناسبة. PHP تدعم single class inheritance: class لها parent واحدة، لكنها تستطيع تنفيذ عدة interfaces واستخدام عدة traits. عمليًا، لا يكفي تنفيذ المسار الناجح؛ يجب توثيق الافتراضات والتحقق من القيم والحالات التي قد تكسر هذا السلوك.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">02</span><p>قارن بين «Inheritance: علاقة is-a» و«Override». لماذا لا يغني أحدهما عن الآخر داخل موضوع «الوراثة وتعدد الأشكال»؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> في «Inheritance: علاقة is-a»: EmailNotification is a Notification علاقة منطقية. إذا لم يستطع child احترام عقد الأب فليست الوراثة مناسبة. PHP تدعم single class inheritance: class لها parent واحدة، لكنها تستطيع تنفيذ عدة interfaces واستخدام عدة traits. أما «Override»: الـchild يعيد تنفيذ method موروثة مع توقيع متوافق. لا تغيّر المعنى المتوقع أو تشدد الشروط بطريقة تكسر المستدعي. هذه Polymorphism: الكود يتعامل مع contract مشترك، والتنفيذ الفعلي يتحدد حسب object. يمكن استخدام attribute لتأكيد نية override في PHP الحديثة: العلاقة بينهما أن الأول يحدد جانبًا من الحل، والثاني يكمل السلوك أو القيود اللازمة لتطبيقه بصورة صحيحة.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">03</span><p>افترض أن نظامًا تجاهل «final». ما العطل أو الخطر المتوقع، وكيف تصمم اختبارًا يكشفه؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> final class: لا يمكن تمديدها. final method: لا يمكن للـchild عمل override. final const: لا يمكن إعادة تعريفها في child. استخدم final عندما يكون الامتداد سيكسر invariants أو لا يمثل extension point مصممًا. لاكتشاف الخلل، اختبر مسارًا صحيحًا، وقيمة عند الحد، ومدخلًا غير صالح، ثم راقب النتيجة والآثار الجانبية والسجل بدل الاكتفاء بعدم ظهور Exception.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">04</span><p>حوّل «private وprotected أثناء الوراثة» إلى قرار هندسي قابل للمراجعة. ما الذي ستوثقه وما الحالات التي ستختبرها؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> الـprivate في الأب موجود في جزء الأب من object لكن child لا يصل إليه مباشرة. اعرض protected/public method بدل تحويل كل شيء إلى protected. وثّق سبب الاختيار والبدائل والحدود، واختبر الحالة العادية، والحد الأدنى والأقصى، والفشل الجزئي، وإعادة المحاولة أو التكرار إن كان السلوك يسمح بذلك.</div></details>
</section>
</div>
