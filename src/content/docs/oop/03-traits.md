---
title: 3. Traits وإعادة الاستخدام الأفقي
description: تجميع السلوك المشترك وحل التعارض باستخدام insteadof وas وضبط visibility.
sidebar:
  order: 3
---

## لماذا Trait؟

PHP لا تدعم multiple class inheritance. Trait تجمع methods/properties/constants لإدخالها في classes غير مرتبطة بوراثة واحدة. لا يمكن إنشاء instance من Trait.

```php
trait HasTimestamps
{
    private ?DateTimeImmutable $updatedAt = null;

    public function touch(): void
    {
        $this->updatedAt = new DateTimeImmutable();
    }

    public function updatedAt(): ?DateTimeImmutable
    {
        return $this->updatedAt;
    }
}

final class Article
{
    use HasTimestamps;
}
```

الـTrait reuse أفقي أو composition وقت تعريف class، وليست type contract. إذا احتاج المستدعي معرفة capability فاستخدم interface أيضًا.

## الأولوية

بالنسبة للـmethods:

1. method داخل class الحالية تتغلب على Trait.
2. method من Trait تتغلب على method موروثة.
3. تعارض method بين Traitين يحتاج حلًا صريحًا.

```php
trait JsonLogger
{
    public function log(string $message): void
    {
        echo json_encode(['message' => $message]);
    }
}

trait TextLogger
{
    public function log(string $message): void
    {
        echo $message;
    }
}

final class Importer
{
    use JsonLogger, TextLogger {
        JsonLogger::log insteadof TextLogger;
        TextLogger::log as logText;
        JsonLogger::log as protected logJson;
    }
}
```

- `insteadof` يختار التنفيذ الفائز.
- `as` يضيف alias أو يغيّر visibility، ولا يحل التعارض وحده.
- إذا لم تحل تعارض الاسم يحدث fatal error.

## Trait تفرض متطلبات

```php
trait PublishesEvents
{
    abstract protected function aggregateId(): string;

    public function event(string $name): array
    {
        return ['id' => $this->aggregateId(), 'name' => $name];
    }
}
```

class المستخدمة يجب أن تنفذ التوقيع المتوافق.

## حدود ومخاطر

- Trait كبيرة قد تخفي dependencies وحالة داخلية.
- تعارض properties/constants يجب أن يكون متوافقًا أو يفشل.
- الوصول إلى static members مباشرة على اسم Trait deprecated؛ استخدم class التي تستعملها.
- من PHP 8.3 يمكن جعل method المستوردة `final` عبر `as final`.
- PHP 8.5 غيّرت ترتيب ربط trait مع parent بالنسبة لتعارض property/constant؛ اختبر السلوك عند الترقية.

استخدم Trait لسلوك صغير متماسك. إذا احتاجت خدمات متعددة أو lifecycle معقدًا فغالبًا object composition أوضح.
