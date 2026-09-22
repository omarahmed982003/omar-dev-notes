---
title: 5. Conditions and loops
description: if, switch, match, for, while, do-while, and foreach with important differences.
sidebar:
  order: 5
---

```php
if ($score >= 90) {
    $grade = 'A';
} elseif ($score >= 75) {
    $grade = 'B';
} else {
    $grade = 'C';
}

$label = $active ? 'active' : 'inactive';
$username = $_GET['username'] ?? 'guest';
$postId = $user?->latestPost()?->id;
```

Alternative `if: ... endif;` syntax is useful in templates. `??` checks existence/non-null like `isset`; the nullsafe operator is `?->`.

```php
switch ($role) {
    case 'admin':
        $permissions = ['all'];
        break;
    default:
        $permissions = ['read'];
}
```

`switch` historically uses loose comparison and falls through without `break`.

```php
$message = match ($status) {
    200, 201 => 'success',
    404 => 'not found',
    default => 'unexpected',
};

$category = match (true) {
    $age < 13 => 'child',
    $age < 18 => 'teen',
    default => 'adult',
};
```

`match` returns a value, compares strictly, has no fall-through, and throws `UnhandledMatchError` when no arm/default matches.

```php
for ($i = 0; $i < 5; $i++) {
    echo $i;
}

while ($attempts < 3) {
    $attempts++;
}

do {
    $input = readline();
} while ($input === '');
```

A `while` body may never run; `do-while` runs once before checking.

```php
foreach ($users as ['id' => $id, 'name' => $name]) {
    echo "{$id}: {$name}";
}

foreach ($prices as &$price) {
    $price *= 1.14;
}
unset($price);
```

Always unset a reference variable after a by-reference `foreach`. Use `continue` to skip an iteration, `break` to leave a loop, and `break 2` for two nested levels.

## Lesson map

<div class="lesson-diagram" role="img" aria-label="Concept map: Conditions and loops">
<p class="lesson-diagram-title">Concept map: Conditions and loops</p>
<div class="diagram-flow">
<div class="diagram-node input"><span>Alternative if: </span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>switch historically uses loose comparison and falls through</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>match returns a value, compares strictly, has no</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node decision"><span>A while body may never run; do-while runs</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node output"><span>Always unset a reference variable after a by-reference</span></div>
</div>
</div>

## Check your understanding

<div class="lesson-quiz" role="list">
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">01</span><p>Explain “Alternative if: ” as if reviewing a real implementation. What is its goal and most important constraint?</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> Alternative if: ... endif; syntax is useful in templates. ?? checks existence/non-null like isset; the nullsafe operator is ?-&gt;. In practice, a successful happy path is insufficient: document assumptions and validate the values and states that can break this behavior.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">02</span><p>Compare “Alternative if: ” with “switch historically uses loose comparison and falls through”. Why does neither replace the other in “Conditions and loops”?</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> For “Alternative if: ”: Alternative if: ... endif; syntax is useful in templates. ?? checks existence/non-null like isset; the nullsafe operator is ?-&gt;. For “switch historically uses loose comparison and falls through”: switch historically uses loose comparison and falls through without break. The first covers one part of the design while the second completes the behavior or constraints required for a correct implementation.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">03</span><p>Assume a system ignores “match returns a value, compares strictly, has no”. What failure or risk should you expect, and how would a test expose it?</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> match returns a value, compares strictly, has no fall-through, and throws UnhandledMatchError when no arm/default matches. Test a valid path, an exact boundary, and invalid input, then inspect output, side effects, and logs rather than treating the absence of an exception as success.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">04</span><p>Turn “A while body may never run; do-while runs” into a reviewable engineering decision. What should be documented and tested?</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> A while body may never run; do-while runs once before checking. Record the rationale, alternatives, and limits; test normal behavior, minimum and maximum boundaries, partial failure, and retry or repetition when applicable.</div></details>
</section>
</div>
