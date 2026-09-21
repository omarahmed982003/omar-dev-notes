---
title: 5. الثوابت وStatic وLate Static Binding
description: Class constants وstatic members والفرق بين self وstatic ومخاطر الحالة العامة.
sidebar:
  order: 5
---

## Class constants

```php
final class HttpStatus
{
    public const int OK = 200; // PHP 8.3+
    public const int NOT_FOUND = 404;
}
```

الثابت مخصص للـclass وليس لكل object. يمكن ضبط visibility وكتابة `final const`. إذا كان المشروع يستهدف PHP أقدم من 8.3 احذف نوع `int`.

## Static properties وmethods

```php
final class Id
{
    private static int $next = 1;

    public static function next(): int
    {
        return self::$next++;
    }
}
```

الـstatic property مشتركة على مستوى class/process. لا يوجد `$this` داخل static method، واستدعاء non-static method بصورة static يرمي Error.

:::caution
Static mutable state قد تصبح global state مخفية وتستمر داخل worker طويل العمر. استخدم object محقونًا عندما توجد dependency أو lifecycle.
:::

## self:: مقابل static::

`self::` يرتبط بالـclass التي عُرّفت فيها method. `static::` يستخدم Late Static Binding ويشير إلى called class.

```php
class Document
{
    protected const TYPE = 'document';
    public static function early(): string { return self::TYPE; }
    public static function late(): string { return static::TYPE; }
}

class Invoice extends Document
{
    protected const TYPE = 'invoice';
}

echo Invoice::early(); // document
echo Invoice::late();  // invoice
```

استخدم `static::` عندما صُممت method للامتداد polymorphically، و`self::` عندما تقصد class المعرّفة.

## Named constructors

```php
class Money
{
    protected function __construct(
        public readonly int $cents,
        public readonly string $currency,
    ) {}

    public static function egp(int $cents): static
    {
        return new static($cents, 'EGP');
    }
}
```

النوع `static` يحافظ على called class، لكن `new static` يفرض توافق constructors في الأبناء. Static مناسبة للثوابت وpure named constructors، وليست بديلًا تلقائيًا لـDependency Injection.
