---
title: "13. Training center project"
sidebar:
  order: 13
description: "The training-center project should demonstrate understandable design, not one large code block. Separate input, validation, pricing, eligibility, and output."
tableOfContents: true
---

## Registration system requirements

The training-center project should demonstrate understandable design, not one large code block. Separate input, validation, pricing, eligibility, and output.

## Input, validation, pricing, and eligibility

- Define input types, plan choices, and valid ranges.
- Validate before financial calculation.
- Represent each rule with a named predicate or function.
- Separate base price, discount, tax, paid amount, and balance.
- Write normal, boundary, and rejection tests for every rule.
- After the first correct version, extract functions so main only coordinates.

## Core rule functions

```cpp
bool validAge(int age) { return age >= 12 && age <= 80; }
double planPrice(char plan) {
    switch (plan) { case 'B': return 600; case 'P': return 900; default: return 0; }
}
```

## Duplication and test-design mistakes

- Do not duplicate the full algorithm for each plan; vary data instead.
- Calculate expected test results independently before comparing output.

## Analyze the project before coding

Create an input contract first. A useful version may read the trainee's age, selected plan, whether seats remain, and the paid amount. For every field, define its type, valid values, and rejection message. Then list the output: registration status, base fee, discount, required amount, paid amount, and remaining balance.

The decision pipeline should be visible:

1. Read the raw data and confirm that extraction succeeded.
2. Validate age, plan code, and non-negative payment.
3. Check eligibility and seat availability.
4. Choose the plan price.
5. Apply one documented discount policy.
6. Compare payment with the final fee.
7. Print an itemized result and the exact rejection reason when applicable.

```cpp
bool hasValidPlan(char plan) {
    return plan == 'B' || plan == 'P';
}

long long planPrice(char plan) {
    switch (plan) {
    case 'B': return 60'000;
    case 'P': return 90'000;
    default:  return 0;
    }
}

bool canRegister(int age, bool seatsAvailable) {
    return age >= 12 && age <= 80 && seatsAvailable;
}
```

Small functions isolate rules from input/output. They can be tested directly and reused when the interface later changes from a console program to a web application.

## Decision table and tests

At minimum, cover: age `11/12/13` and `79/80/81`, every valid plan plus an unknown one, available and full capacity, payment below/equal/above the required fee, and malformed numeric input. Also test combinations—valid age with no seats, or a valid plan with insufficient payment—because projects fail where rules meet, not only where each rule stands alone.

Avoid duplicating a complete branch for each plan. The algorithm is the same; the price and plan properties are data. This keeps a new plan from requiring a copied and slightly inconsistent version of the whole program.

## Analyze the project before coding

Create an input contract first. A useful version may read the trainee's age, selected plan, whether seats remain, and the paid amount. For every field, define its type, valid values, and rejection message. Then list the output: registration status, base fee, discount, required amount, paid amount, and remaining balance.

The decision pipeline should be visible:

1. Read the raw data and confirm that extraction succeeded.
2. Validate age, plan code, and non-negative payment.
3. Check eligibility and seat availability.
4. Choose the plan price.
5. Apply one documented discount policy.
6. Compare payment with the final fee.
7. Print an itemized result and the exact rejection reason when applicable.

```cpp
bool hasValidPlan(char plan) {
    return plan == 'B' || plan == 'P';
}

long long planPrice(char plan) {
    switch (plan) {
    case 'B': return 60'000;
    case 'P': return 90'000;
    default:  return 0;
    }
}

bool canRegister(int age, bool seatsAvailable) {
    return age >= 12 && age <= 80 && seatsAvailable;
}
```

Small functions isolate rules from input/output. They can be tested directly and reused when the interface later changes from a console program to a web application.

## Decision table and tests

At minimum, cover: age `11/12/13` and `79/80/81`, every valid plan plus an unknown one, available and full capacity, payment below/equal/above the required fee, and malformed numeric input. Also test combinations—valid age with no seats, or a valid plan with insufficient payment—because projects fail where rules meet, not only where each rule stands alone.

Avoid duplicating a complete branch for each plan. The algorithm is the same; the price and plan properties are data. This keeps a new plan from requiring a copied and slightly inconsistent version of the whole program.

## Lesson map

<div class="lesson-diagram" role="img" aria-label="Concept map: Training center registration project">
<p class="lesson-diagram-title">Concept map: Training center registration project</p>
<div class="diagram-flow">
<div class="diagram-node input"><span>Trainee data</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>Eligibility and plan</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>Example</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node decision"><span>Corrections and common mistakes</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node output"><span>The training-center project should demonstrate understandable design, not one</span></div>
</div>
</div>

## Check your understanding

<div class="lesson-quiz" role="list">
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">01</span><p>Why should main not contain the entire project?</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> Mixing input, validation, calculation, and output makes testing and change difficult; main should coordinate small functions.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">02</span><p>How can planPrice be tested without running the full program?</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> Make it pure and pass every valid plan plus an unknown value, comparing direct expected results.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">03</span><p>What does an eligibility decision table provide?</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> It exposes missing combinations and policy conflicts before they become nested conditions.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">04</span><p>How do you avoid duplicating the algorithm for every plan?</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> Represent plans as data—name, price, properties—and run one calculation path over that data.</div></details>
</section>
</div>
