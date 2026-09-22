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

## Lesson map

<div class="lesson-diagram" role="img" aria-label="Concept map: Date, time, and timezones">
<p class="lesson-diagram-title">Concept map: Date, time, and timezones</p>
<div class="diagram-flow">
<div class="diagram-node input"><span>Instant or local time?</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>DateTimeImmutable</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>Strict parsing</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node decision"><span>Arithmetic and DST</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node output"><span>Storage policy</span></div>
</div>
</div>

## Check your understanding

<div class="lesson-quiz" role="list">
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">01</span><p>Explain “Instant or local time?” as if reviewing a real implementation. What is its goal and most important constraint?</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> Distinguish an instant on the global timeline, a local date/time, a named timezone such as Africa/Cairo, and a duration. A fixed offset such as +02:00 is not a timezone because regional rules can change. In practice, a successful happy path is insufficient: document assumptions and validate the values and states that can break this behavior.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">02</span><p>Compare “Instant or local time?” with “DateTimeImmutable”. Why does neither replace the other in “Date, time, and timezones”?</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> For “Instant or local time?”: Distinguish an instant on the global timeline, a local date/time, a named timezone such as Africa/Cairo, and a duration. A fixed offset such as +02:00 is not a timezone because regional rules can change. For “DateTimeImmutable”: Prefer DateTimeImmutable so operations return new values instead of mutating a shared object. The first covers one part of the design while the second completes the behavior or constraints required for a correct implementation.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">03</span><p>Assume a system ignores “Strict parsing”. What failure or risk should you expect, and how would a test expose it?</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> Do not use the flexible parser for input that promises a specific format; it may normalize impossible dates. Test a valid path, an exact boundary, and invalid input, then inspect output, side effects, and logs rather than treating the absence of an exception as success.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">04</span><p>Turn “Arithmetic and DST” into a reviewable engineering decision. What should be documented and tested?</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> “Tomorrow at the same local time” can differ from “24 hours later” around DST. Define the domain meaning, especially for appointments and billing. Record the rationale, alternatives, and limits; test normal behavior, minimum and maximum boundaries, partial failure, and retry or repetition when applicable.</div></details>
</section>
</div>
