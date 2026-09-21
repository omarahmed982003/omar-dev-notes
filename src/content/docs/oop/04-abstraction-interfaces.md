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
