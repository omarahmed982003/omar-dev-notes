---
title: 14. Date, time, and timezones
description: DateTimeImmutable, UTC, named zones, DST, strict parsing, intervals, and storage policy.
sidebar:
  order: 14
---

## The problem: “nine o'clock” is not a complete appointment

Date and location are missing: 9 in Cairo is not 9 in London. An **instant** is one global point in time. **Local date/time** describes the clock/calendar in a place. A **timezone**, such as Africa/Cairo, holds that place's rules, including daylight saving time (**DST**). An **offset**, such as +02:00, is the UTC difference at one instant, not a replacement for zone rules. A **duration** is a length of time, not a date.

Past event instants are commonly stored in UTC and displayed in the user's zone. A recurring “9 every day in Cairo” appointment needs a local time, zone name, and DST policy, not one UTC offset forever. Examples require PHP 8.1+ and use fixed dates so results can be checked.

## One instant, two displays

Save `zones.php` and run `php zones.php`. **Immutable** means operations return a new object instead of mutating the original:

~~~php
<?php
$utc = new DateTimeImmutable('2024-01-15 12:00:00', new DateTimeZone('UTC'));
$cairo = $utc->setTimezone(new DateTimeZone('Africa/Cairo'));
echo $utc->format('Y-m-d H:i:s P'), PHP_EOL;
echo $cairo->format('Y-m-d H:i:s P'), PHP_EOL;
var_dump($utc->getTimestamp() === $cairo->getTimestamp());
$tomorrow = $utc->modify('+1 day');
echo $utc->format('Y-m-d'), ' / ', $tomorrow->format('Y-m-d'), PHP_EOL;
~~~

~~~text
2024-01-15 12:00:00 +00:00
2024-01-15 14:00:00 +02:00
bool(true)
2024-01-15 / 2024-01-16
~~~

We construct UTC time, then setTimezone changes its representation. `getTimestamp` returns Unix-epoch seconds for the same instant, so they match. `Y-m-d` is year-month-day, `H:i:s` is hour-minute-second: i means minutes, not m. `P` prints the offset. `DateTimeInterface::ATOM` provides a transport-friendly format including offset. The last line proves modify did not mutate utc.

**Mistake:** calling `$utc->modify('+1 day');` and ignoring its return, then expecting utc to change. Assign the result. DateTimeImmutable prevents surprising mutation when functions share an object.

## Strict parsing: automatic correction may be wrong for your form

**Parsing** turns text into a date value. A flexible parser may turn February 30 into a March date. Save `dates.php`:

~~~php
<?php
declare(strict_types=1);
function parseDate(string $input): DateTimeImmutable
{
    if (preg_match('/\A[0-9]{4}-[0-9]{2}-[0-9]{2}\z/', $input) !== 1) {
        throw new InvalidArgumentException('Use YYYY-MM-DD');
    }
    $date = DateTimeImmutable::createFromFormat('!Y-m-d', $input, new DateTimeZone('UTC'));
    $errors = DateTimeImmutable::getLastErrors();
    if ($date === false
        || ($errors !== false && ($errors['warning_count'] > 0 || $errors['error_count'] > 0))
        || $date->format('Y-m-d') !== $input) {
        throw new InvalidArgumentException('Invalid calendar date');
    }
    return $date;
}
foreach (['2024-02-29', '2023-02-29', '2024-2-9'] as $input) {
    try {
        echo parseDate($input)->format('Y-m-d H:i:s'), PHP_EOL;
    } catch (InvalidArgumentException) {
        echo "invalid: {$input}", PHP_EOL;
    }
}
~~~

~~~text
2024-02-29 00:00:00
invalid: 2023-02-29
invalid: 2024-2-9
~~~

Regex enforces shape and component width, not calendar validity. `!` resets unspecified fields instead of inheriting the current clock time. Capture getLastErrors immediately; since PHP 8.2 it may return false when there are no errors, so do not assume an array. Warnings matter because corrected impossible dates may produce warnings. Finally, format back and compare. Short-circuit `||` prevents calling format on false.

A date-only birthday is not necessarily an instant; a local DATE has different semantics from created_at. Do not attach a timezone merely because other time values use one.

## A calendar day is not always 24 hours

An **interval** describes a difference: `P1D` is a calendar day and `PT24H` is 24 hours. Run `dst.php` using London's historical March 2024 transition:

~~~php
<?php
$start = new DateTimeImmutable('2024-03-30 12:00:00', new DateTimeZone('Europe/London'));
$calendar = $start->add(new DateInterval('P1D'));
$elapsed = $start->add(new DateInterval('PT24H'));
foreach (['calendar' => $calendar, 'elapsed' => $elapsed] as $label => $end) {
    $seconds = $end->getTimestamp() - $start->getTimestamp();
    echo $label, ': ', $end->format('Y-m-d H:i P'), " seconds={$seconds}", PHP_EOL;
}
~~~

~~~text
calendar: 2024-03-31 12:00 +01:00 seconds=82800
elapsed: 2024-03-31 13:00 +01:00 seconds=86400
~~~

The calendar result preserves local noon but spans 23 hours because the clock moves forward. The elapsed result preserves 24 hours and becomes 13:00 local. A local time may not exist during spring-forward or may occur twice during fall-back. Choose a rejection/offset policy rather than silently accepting parser choices for important appointments.

`P1M` means a month, not 30 days: adding it to January 31 can overflow February. Decide whether the rule means the last day of the following month or ordinary calendar addition. Test leap days and month/year boundaries. Timezone rules can change politically; keep timezone data current and reassess future local schedules under an explicit policy.

## Test “now” without waiting

**Clock injection** means passing the current time as input instead of reading it deep inside logic. A simple version needs no interfaces:

~~~php
<?php
function expired(DateTimeImmutable $deadline, DateTimeImmutable $now): bool
{
    return $now >= $deadline;
}
$deadline = new DateTimeImmutable('2024-01-01T12:00:00+00:00');
foreach (['11:59:59', '12:00:00', '12:00:01'] as $time) {
    $now = new DateTimeImmutable("2024-01-01T{$time}+00:00");
    echo $time, ': ', expired($deadline, $now) ? 'expired' : 'valid', PHP_EOL;
}
~~~

~~~text
11:59:59: valid
12:00:00: expired
12:00:01: expired
~~~

The boundary itself is expired under `>=`, an explicit testable rule. Measure execution duration with a monotonic clock such as `hrtime`, rather than a wall clock that may be corrected during measurement. Store event instants explicitly, retain zones needed for local schedules, and convert at presentation.

## Predict, debug, complete

<details><summary>UTC 12:00 and Cairo 14:00 in the example: which is later?</summary><p>They are the same instant, proven by equal timestamps. Only the local representation differs.</p></details>

<details><summary>Debug: createFromFormat returned an object for 2023-02-29, so I accepted it</summary><p>The parser may have corrected it. Inspect warnings/errors and round-trip formatting; an object does not prove literal acceptance.</p></details>

<details><summary>Complete expiry at the deadline itself</summary><p>Use <code>$now &gt;= $deadline</code>. Test one second before, equality, and one second after. A strict &gt; allows the exact boundary.</p></details>

<details><summary>A daily local 9:00 appointment: store only +02:00?</summary><p>No. Retain local time, zone name, and an ambiguity policy because DST or legal changes can alter the offset.</p></details>

Run `php datetime-lab.php` from the [lab](/en/php/00-lab-setup/). The notebook's created_at is a UTC instant formatted at presentation. See the [parsing reference](https://www.php.net/manual/en/datetimeimmutable.createfromformat.php).
