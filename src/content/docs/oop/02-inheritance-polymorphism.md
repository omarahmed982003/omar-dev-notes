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
