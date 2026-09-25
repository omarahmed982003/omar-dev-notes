---
title: "12. Input and business rules"
sidebar:
  order: 12
description: "Business rules become clear conditions when each fact is named and inputs are validated. Separate data validity from the acceptance decision."
tableOfContents: true
---

## From requirements to conditions

Business rules become clear conditions when each fact is named and inputs are validated. Separate data validity from the acceptance decision.

## Data validity and business decisions

- Start with a table of inputs, types, and valid ranges.
- Name predicates: hasPassingGrade is clearer than a repeated expression.
- Mandatory rules combine with &&; acceptable alternatives use ||.
- Report the specific rejection reason.
- Test just below, exactly at, and just above every threshold.

## Example: student eligibility

```cpp
bool validScore = score >= 0 && score <= 100;
bool eligible = validScore && score >= 60 && attendance >= 75;
```

## Threshold and invalid-data mistakes

- Do not allow invalid data into business decisions.
- Confirm whether each threshold is inclusive.

## Turn prose into an executable rule

Do not start by typing a long `if`. First rewrite the requirement as facts that can be checked independently. For a course application, those facts might be: the score is within `0..100`, attendance is within `0..100`, the student passed the score threshold, and attendance satisfies the policy. This creates two layers:

1. **Data validation:** can these values represent a valid score and attendance percentage?
2. **Business decision:** does a valid applicant satisfy the current acceptance policy?

```cpp
bool scoreIsValid = score >= 0 && score <= 100;
bool attendanceIsValid = attendance >= 0 && attendance <= 100;

if (!scoreIsValid || !attendanceIsValid) {
    std::cout << "Invalid input\n";
} else {
    bool passedScore = score >= 60;
    bool passedAttendance = attendance >= 75;
    bool accepted = passedScore && passedAttendance;
    std::cout << (accepted ? "Accepted\n" : "Rejected\n");
}
```

Named Boolean variables make the program read like the original requirement. They also make later changes safer: if attendance becomes optional for a special track, the policy can change without weakening the input validation.

## Truth tables and decision tables

When two or more facts interact, list the combinations before writing code. For `passedScore && passedAttendance`, only the `true/true` row accepts. If a scholarship instead requires a high score **or** a competition award, `||` is appropriate. A decision table becomes even more valuable when there are exceptions, because it exposes overlapping or missing cases before they turn into deeply nested conditions.

Keep precedence visible when operators are mixed:

```cpp
bool accepted = validData &&
                (regularRequirements || hasApprovedException);
```

## Boundary-focused testing

For each rule, identify the first valid value and test one value below it, the boundary itself, and one value above it. For `score >= 60`, use `59`, `60`, and `61`. Also test impossible values such as `-1` and `101`. This method catches the most common mistakes: choosing `>` instead of `>=`, applying a decision to invalid input, or combining rules with the wrong logical operator.

## Turn prose into an executable rule

Do not start by typing a long `if`. First rewrite the requirement as facts that can be checked independently. For a course application, those facts might be: the score is within `0..100`, attendance is within `0..100`, the student passed the score threshold, and attendance satisfies the policy. This creates two layers:

1. **Data validation:** can these values represent a valid score and attendance percentage?
2. **Business decision:** does a valid applicant satisfy the current acceptance policy?

```cpp
bool scoreIsValid = score >= 0 && score <= 100;
bool attendanceIsValid = attendance >= 0 && attendance <= 100;

if (!scoreIsValid || !attendanceIsValid) {
    std::cout << "Invalid input\n";
} else {
    bool passedScore = score >= 60;
    bool passedAttendance = attendance >= 75;
    bool accepted = passedScore && passedAttendance;
    std::cout << (accepted ? "Accepted\n" : "Rejected\n");
}
```

Named Boolean variables make the program read like the original requirement. They also make later changes safer: if attendance becomes optional for a special track, the policy can change without weakening the input validation.

## Truth tables and decision tables

When two or more facts interact, list the combinations before writing code. For `passedScore && passedAttendance`, only the `true/true` row accepts. If a scholarship instead requires a high score **or** a competition award, `||` is appropriate. A decision table becomes even more valuable when there are exceptions, because it exposes overlapping or missing cases before they turn into deeply nested conditions.

Keep precedence visible when operators are mixed:

```cpp
bool accepted = validData &&
                (regularRequirements || hasApprovedException);
```

## Boundary-focused testing

For each rule, identify the first valid value and test one value below it, the boundary itself, and one value above it. For `score >= 60`, use `59`, `60`, and `61`. Also test impossible values such as `-1` and `101`. This method catches the most common mistakes: choosing `>` instead of `>=`, applying a decision to invalid input, or combining rules with the wrong logical operator.

## Lesson map

<div class="lesson-diagram" role="img" aria-label="Concept map: Input and business rules">
<p class="lesson-diagram-title">Concept map: Input and business rules</p>
<div class="diagram-flow">
<div class="diagram-node input"><span>Raw input</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>Validated input</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>Named Boolean facts</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node decision"><span>Decision table</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node output"><span>Approval or a precise rejection reason</span></div>
</div>
</div>

## Complete program: valid data before eligibility

```cpp
#include <iostream>
int main() {
    int score{}, attendance{}; char paidAnswer{};
    std::cout << "Score attendance paid(y/n): ";
    if (!(std::cin >> score >> attendance >> paidAnswer)) {
        std::cerr << "Invalid input format\n"; return 1;
    }
    if (score < 0 || score > 100 || attendance < 0 || attendance > 100 ||
        (paidAnswer != 'y' && paidAnswer != 'Y' && paidAnswer != 'n' && paidAnswer != 'N')) {
        std::cerr << "Input outside the accepted domain\n"; return 1;
    }
    const bool paid = paidAnswer == 'y' || paidAnswer == 'Y';
    const bool eligible = score >= 60 && attendance >= 75 && paid;
    std::cout << (eligible ? "Eligible\n" : "Not eligible\n");
}
```

Test `59/60`, `74/75`, both payment answers, and out-of-range input. Validation must precede the eligibility decision.

## Check your understanding

<div class="lesson-quiz" role="list">
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">01</span><p>Why separate validScore from eligible?</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> The first validates data; the second applies policy. Separation distinguishes malformed input from a normal rejection.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">02</span><p>How should a 75% attendance threshold be tested?</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> Test just below, exactly 75, above, and invalid values below zero and above 100.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">03</span><p>When do eligibility rules use &amp;&amp; versus ||?</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> Use &amp;&amp; for jointly required facts and || for alternative routes; add parentheses when mixing them.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">04</span><p>Why is “not eligible” alone a weak message?</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> It does not identify the failed rule for users, tests, or support; return a specific but non-sensitive reason.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">05</span><p>Design the smallest useful test set for age 18–60 inclusive and attendance at least 75%.</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> Test ages 17, 18, 60, and 61 with valid attendance; then 74.99 and 75 with a valid age; finally include non-numeric input.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">06</span><p>How can a decision table expose conflicting rules before coding?</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> It lists combinations of facts and their outcomes. A row with two outcomes, or no outcome, reveals ambiguity before it becomes an if chain.</div></details>
</section>
</div>
