---
title: 6. Constructors وReadonly وDependency Injection
description: تهيئة object صالح وConstructor Promotion وReadonly وحقن الاعتماديات بدل إنشائها داخليًا.
sidebar:
  order: 6
---

## Constructor يحمي بداية الكائن

```php
final class EmailAddress
{
    public function __construct(public readonly string $value)
    {
        if (filter_var($value, FILTER_VALIDATE_EMAIL) === false) {
            throw new InvalidArgumentException('Invalid email');
        }
    }
}
```

بعد نجاح constructor يجب أن يكون object صالحًا. المثال يستخدم Constructor Property Promotion. وإذا عرّف child constructor خاصًا به فلن يستدعي parent constructor تلقائيًا؛ استدعِ `parent::__construct(...)` عند الحاجة.

## readonly

```php
final readonly class Money
{
    public function __construct(
        public int $cents,
        public string $currency,
    ) {
        if ($cents < 0) {
            throw new InvalidArgumentException();
        }
    }
}
```

Readonly class من PHP 8.2 تجعل properties المعلنة readonly وتمنع dynamic properties. لا يمكنها static أو untyped properties.

:::caution[ليست Deep Immutability]
إذا احتوت readonly property على object، لا يمكن تبديل المرجع لكن يمكن أن تتغير حالة object الداخلي إن كان mutable.
:::

في PHP 8.4 أصبح نطاق التهيئة الافتراضي للـreadonly property هو `protected(set)` بدل private-set الضمني السابق؛ انتبه عند الوراثة والترقية.

## Dependency Injection

```php
final class OrderService
{
    public function __construct(
        private PaymentGateway $payments,
        private OrderRepository $orders,
        private Clock $clock,
    ) {}

    public function checkout(Order $order): Receipt
    {
        $receipt = $this->payments->charge(
            $order->customerId(),
            $order->totalCents(),
        );
        $this->orders->markPaid($order, $receipt, $this->clock->now());
        return $receipt;
    }
}
```

DI تجعل dependencies ظاهرة وتسمح بـproduction وfake implementations. Dependency Injection ليست Container؛ يمكن توصيل objects يدويًا.

- Constructor injection للاعتماد المطلوب طوال عمر object.
- Method parameter لبيانات/اعتماد خاص بعملية واحدة.
- Setter injection قد تترك object ناقصًا.

تجنب Service Locator مثل `Container::get()` داخل منطق المجال لأنه يخفي dependencies.
