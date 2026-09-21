---
title: 7. Magic Methods وCloning
description: سلوك PHP الخاص عبر __get و__set و__call و__toString و__invoke و__clone و__debugInfo.
sidebar:
  order: 7
---

## ما Magic Methods؟

أسماء تبدأ بـ`__` ويحجزها PHP لاعتراض أحداث معينة. لا تنشئ method مخصصة بهذا النمط. باستثناء `__construct` و`__destruct` و`__clone`، يجب إعلان magic methods كـ`public`.

## __get و__set و__isset و__unset

```php
final class AttributeBag
{
    public function __construct(private array $data = []) {}

    public function __get(string $name): mixed
    {
        if (!array_key_exists($name, $this->data)) {
            throw new OutOfBoundsException($name);
        }
        return $this->data[$name];
    }

    public function __set(string $name, mixed $value): void
    {
        $this->data[$name] = $value;
    }

    public function __isset(string $name): bool
    {
        return isset($this->data[$name]);
    }

    public function __unset(string $name): void
    {
        unset($this->data[$name]);
    }
}
```

تعمل عند property غير متاحة. المرونة تقلل static analysis وتخفي typos؛ الأعضاء الصريحة أفضل في domain models.

## __call و__callStatic

يعملان عند method غير موجودة/غير متاحة:

```php
public function __call(string $name, array $arguments): mixed
{
    throw new BadMethodCallException("Unknown method {$name}");
}
```

تُستخدم في proxies وfluent APIs لكن يجب أن تفشل بوضوح.

## __toString و__invoke

```php
final readonly class OrderId
{
    public function __construct(private string $value) {}
    public function __toString(): string { return $this->value; }
}

final class Slugify
{
    public function __invoke(string $value): string
    {
        return strtolower(trim(str_replace(' ', '-', $value)));
    }
}

$slugify = new Slugify();
echo $slugify(' Hello World ');
```

الكائن القابل للاستدعاء مناسب لـstrategy صغيرة قابلة للحقن.

## clone و__clone

`clone` shallow copy افتراضيًا؛ nested objects تظل مشتركة:

```php
final class Order
{
    public function __construct(public DateTime $createdAt) {}

    public function __clone(): void
    {
        $this->createdAt = clone $this->createdAt;
    }
}
```

لا تستنسخ ORM Entity ذات identity بلا فهم Unit of Work؛ قد تحتاج factory لهوية جديدة.

## __debugInfo وSerialization

```php
public function __debugInfo(): array
{
    return ['id' => $this->id, 'token' => '[redacted]'];
}
```

يساعد على إخفاء secrets من `var_dump`، لكنه لا يبرر logging للكائن كاملًا. فضّل `__serialize()` و`__unserialize()` عند الحاجة، ولا تعمل `unserialize()` على بيانات غير موثوقة.

لا تعتمد على destructor لعمل business حرج؛ استخدم methods صريحة و`try/finally`.
