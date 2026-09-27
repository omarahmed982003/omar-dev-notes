---
title: 14. Date, time, and timezones
description: DateTimeImmutable, UTC, named zones, DST, strict parsing, intervals, and storage policy.
sidebar:
  order: 14
---

## Before you start

Read this lesson in three passes: understand the problem, follow the example, then try the final check yourself. The terms below are explained before they are used in detail.


### New terms in this lesson

This lesson introduces no extra technical label that needs memorizing; its new ideas are explained where they first appear.

## Clock text is not the whole meaning

“The meeting is at 9” is incomplete without a date, time zone, and daylight-saving context. Distinguish:

- an **instant** on the global timeline;
- a **local date and time** shown in one region;
- a **time zone**, whose rules include historical and future DST changes;
- an **interval or duration** between values.

A useful default is to store instants in UTC, retain the original zone when the event's local meaning matters, and convert at presentation boundaries.

```php
$createdAt = new DateTimeImmutable('now', new DateTimeZone('UTC'));
$cairoTime = $createdAt->setTimezone(new DateTimeZone('Africa/Cairo'));

echo $createdAt->format(DateTimeInterface::ATOM), PHP_EOL;
echo $cairoTime->format('Y-m-d H:i:s P'), PHP_EOL;
```

`DateTimeImmutable` reduces surprise because `modify()` and `setTimezone()` return new objects. Do not add `24 * 60 * 60` and assume that means the same local clock time tomorrow; a DST transition can change a local day's length.

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

## Progressive practice

<details><summary>1. Display a UTC instant in Cairo</summary><p>Create an immutable UTC value, call <code>setTimezone()</code> with <code>Africa/Cairo</code>, and include the offset in formatted output.</p></details>

<details><summary>2. Why is adding 86,400 seconds not always “same time tomorrow”?</summary><p>A local day can change length across DST. Use calendar and zone rules that match the operation's meaning.</p></details>

<details><summary>3. Reject an invalid date</summary><p>Use strict parsing and inspect parsing errors rather than accepting PHP's automatic date normalization.</p></details>

## Lesson-specific problems

<details><summary>Why store an instant in UTC and keep a timezone when needed?</summary><p>UTC preserves an unambiguous instant; the timezone supports local display and DST rules.</p></details>

<details><summary>Why is adding 24 hours not always tomorrow at the same local time?</summary><p>DST can make a local day 23 or 25 hours; use calendar operations for local-day intent.</p></details>

## Run and verify

Use the [downloadable lab](/en/php/00-lab-setup/) for supplied scripts. Commands for Composer, FPM, Docker, or a real server run inside the corresponding configured project, not an empty folder.

Execute this checkpoint inside the lesson environment:

~~~bash
php datetime-lab.php
~~~

**Success criterion:** The instant is stored in UTC and rendered in two zones as local times for the same instant, including a daylight-saving boundary where applicable.

Record the exit code and observed evidence. If reality differs, explain the environmental or design assumption that failed instead of editing the expectation to match a defect.

## Connect the ideas

A local time can be missing or repeated across DST; parsing without policy can choose an unexpected result. A calendar month is not a fixed number of seconds. Inject a Clock instead of calling now deep in logic, and store the instant plus any zone needed for later rendering.

### Try it yourself

Test around a DST transition and with a fixed fake clock.
