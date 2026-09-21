---
title: 14. Date, time, and timezones
description: DateTimeImmutable, UTC, named zones, DST, strict parsing, intervals, and storage policy.
sidebar:
  order: 14
---

## Instant or local time?

Distinguish an **instant** on the global timeline, a **local date/time**, a named timezone such as `Africa/Cairo`, and a duration. A fixed offset such as `+02:00` is not a timezone because regional rules can change.

## DateTimeImmutable

```php
$now = new DateTimeImmutable('now', new DateTimeZone('UTC'));
$cairo = $now->setTimezone(new DateTimeZone('Africa/Cairo'));

echo $now->format(DateTimeInterface::ATOM);
echo $cairo->format('Y-m-d H:i:s P');
```

Prefer `DateTimeImmutable` so operations return new values instead of mutating a shared object.

## Strict parsing

```php
$date = DateTimeImmutable::createFromFormat(
    '!Y-m-d',
    $input,
    new DateTimeZone('Africa/Cairo'),
);
$errors = DateTimeImmutable::getLastErrors();

if ($date === false || ($errors !== false &&
    ($errors['warning_count'] > 0 || $errors['error_count'] > 0))) {
    throw new InvalidArgumentException('Invalid date');
}
```

Do not use the flexible parser for input that promises a specific format; it may normalize impossible dates.

## Arithmetic and DST

“Tomorrow at the same local time” can differ from “24 hours later” around DST. Define the domain meaning, especially for appointments and billing.

## Storage policy

- Store instants in UTC with sufficient precision.
- Preserve the named timezone for future local schedules.
- Convert at presentation boundaries.
- Avoid implicit default timezones in business logic.
- Test month/year boundaries, leap days, and DST transitions.

Inject a clock in tests instead of reading “now” throughout domain code.

