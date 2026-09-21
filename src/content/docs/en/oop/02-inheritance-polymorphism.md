---
title: 2. Inheritance and polymorphism
description: is-a relationships, overriding, final members, substitutability, and composition.
sidebar:
  order: 2
---

Inheritance models a real is-a relationship. PHP supports one parent class, while classes may implement multiple interfaces and use multiple traits.

```php
abstract class Notification
{
    abstract public function send(string $message): void;
}

final class EmailNotification extends Notification
{
    #[\Override]
    public function send(string $message): void
    {
        // send email
    }
}

function notify(Notification $channel, string $message): void
{
    $channel->send($message);
}
```

Polymorphism lets the caller use a shared contract while the runtime object supplies behaviour. Overrides must keep a compatible signature and meaning.

A final class cannot be extended; a final method or constant cannot be overridden/redefined. Private parent members are not directly accessible from children; expose meaningful methods rather than making all state protected.

Prefer composition for has-a relationships and swappable collaborators. Use inheritance only when substitutability is real. Avoid giant base classes, unsupported operations in children, and inheritance used merely to reuse a few lines.
