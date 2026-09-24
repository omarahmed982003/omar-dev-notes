---
title: "9. Input and business rules"
sidebar:
  order: 9
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
<div class="diagram-node input"><span>Inputs</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>Validation</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>Example</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node decision"><span>Corrections and common mistakes</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node output"><span>Business rules become clear conditions when each fact is</span></div>
</div>
</div>

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
</div>
