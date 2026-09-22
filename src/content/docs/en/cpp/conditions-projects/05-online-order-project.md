---
title: "Online order analysis project"
description: "An online-order project combines input, validation, calculation, and decisions. Building it in stages makes testing and change easier."
tableOfContents: true
---

## Overview

An online-order project combines input, validation, calculation, and decisions. Building it in stages makes testing and change easier.

## Concepts you need

- Write price, discount, shipping, and minimum-order rules first.
- Validate quantity, price, and coupon before calculation.
- Compute subtotal, discount, shipping, then total in a visible order.
- Keep discount policy separate from shipping policy.
- Print an itemized receipt so results are auditable.

## Example

```cpp
double subtotal = quantity * unitPrice;
double discount = isMember && subtotal >= 500 ? subtotal * 0.10 : 0.0;
double shipping = subtotal - discount >= 750 ? 0.0 : 45.0;
double total = subtotal - discount + shipping;
```

## Corrections and common mistakes

- Define whether free shipping uses pre- or post-discount value.
- For real financial systems, prefer integer minor units or a decimal type over binary floating point.

## Lesson map

<div class="lesson-diagram" role="img" aria-label="Concept map: Online order analysis project">
<p class="lesson-diagram-title">Concept map: Online order analysis project</p>
<div class="diagram-flow">
<div class="diagram-node input"><span>Overview</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>Concepts you need</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>Example</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node decision"><span>Corrections and common mistakes</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node output"><span>An online-order project combines input, validation, calculation, and decisions</span></div>
</div>
</div>

## Check your understanding

<div class="lesson-quiz" role="list">
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">01</span><p>Should free shipping be calculated before or after discount?</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> This is a business decision, not a technical fact. Documenting the basis is essential because boundary outcomes change.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">02</span><p>Why is double unsuitable for serious money calculations?</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> Binary floating point cannot exactly represent many decimal fractions; use integer minor units or an appropriate decimal type.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">03</span><p>How do you prevent coupon and member discounts from stacking?</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> Encode an explicit policy that selects the best or highest-priority discount instead of automatically summing both.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">04</span><p>What is a useful minimum test set?</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> Normal order, below/at/above every threshold, valid/invalid coupon, zero/negative quantity, and a large input.</div></details>
</section>
</div>

## Summary

Build the solution in stages, enable warnings, and test normal, boundary, and invalid cases. Understanding means you can explain why each line exists.
