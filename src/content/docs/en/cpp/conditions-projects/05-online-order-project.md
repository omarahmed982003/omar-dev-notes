---
title: "10. Online order project"
sidebar:
  order: 10
description: "An online-order project combines input, validation, calculation, and decisions. Building it in stages makes testing and change easier."
tableOfContents: true
---

## Online order requirements

An online-order project combines input, validation, calculation, and decisions. Building it in stages makes testing and change easier.

## Price, quantity, discounts, and shipping

- Write price, discount, shipping, and minimum-order rules first.
- Validate quantity, price, and coupon before calculation.
- Compute subtotal, discount, shipping, then total in a visible order.
- Keep discount policy separate from shipping policy.
- Print an itemized receipt so results are auditable.

## First calculation model

```cpp
double subtotal = quantity * unitPrice;
double discount = isMember && subtotal >= 500 ? subtotal * 0.10 : 0.0;
double shipping = subtotal - discount >= 750 ? 0.0 : 45.0;
double total = subtotal - discount + shipping;
```

## Financial precision and policy mistakes

- Define whether free shipping uses pre- or post-discount value.
- For real financial systems, prefer integer minor units or a decimal type over binary floating point.

## Build stages and test matrix

Read and validate input, calculate the subtotal once, apply the documented discount, calculate shipping according to the agreed before-or-after-discount rule, and print every intermediate amount.

Test quantity zero, totals 499/500/501, both sides of the free-shipping boundary, an unknown coupon, and text where a number is required. A training-center registration is a second application of the same design: validate age, seat availability, and payment before selecting the fee and final status.

## A complete calculation model

Money should be stored in the smallest unit, such as piasters or cents, so every calculation remains exact. Give every intermediate result a name and calculate it once.

```cpp
#include <iostream>

int main() {
    long long unitPricePiasters{};
    int quantity{};
    char memberAnswer{};

    std::cout << "Unit price in piasters, quantity, member (y/n): ";
    if (!(std::cin >> unitPricePiasters >> quantity >> memberAnswer) ||
        unitPricePiasters < 0 || quantity <= 0) {
        std::cout << "Invalid order data\n";
        return 1;
    }

    const long long subtotal = unitPricePiasters * quantity;
    const bool isMember = memberAnswer == 'y' || memberAnswer == 'Y';
    const bool earnsDiscount = isMember && subtotal >= 50'000;
    const long long discount = earnsDiscount ? subtotal / 10 : 0;
    const long long afterDiscount = subtotal - discount;
    const long long shipping = afterDiscount >= 75'000 ? 0 : 4'500;
    const long long total = afterDiscount + shipping;

    std::cout << "Subtotal: " << subtotal << " piasters\n"
              << "Discount: " << discount << " piasters\n"
              << "Shipping: " << shipping << " piasters\n"
              << "Total: " << total << " piasters\n";
}
```

This version makes a precise policy choice: both the discount and free-shipping threshold use explicitly documented amounts. If the business changes the policy, the affected expression is easy to locate.

## Requirements that must be decided, not guessed

- Does free shipping depend on subtotal or the amount after discount?
- Can a member discount and coupon be combined, or does the best discount win?
- Is a percentage rounded after each item or once for the whole order?
- What happens when stock is lower than the requested quantity?
- Are taxes included in displayed prices?

These are domain questions. Code cannot correct an undefined rule; it can only hide the ambiguity. Record each answer, then turn it into a predicate and a boundary test.

## A complete calculation model

Money should be stored in the smallest unit, such as piasters or cents, so every calculation remains exact. Give every intermediate result a name and calculate it once.

```cpp
#include <iostream>

int main() {
    long long unitPricePiasters{};
    int quantity{};
    char memberAnswer{};

    std::cout << "Unit price in piasters, quantity, member (y/n): ";
    if (!(std::cin >> unitPricePiasters >> quantity >> memberAnswer) ||
        unitPricePiasters < 0 || quantity <= 0) {
        std::cout << "Invalid order data\n";
        return 1;
    }

    const long long subtotal = unitPricePiasters * quantity;
    const bool isMember = memberAnswer == 'y' || memberAnswer == 'Y';
    const bool earnsDiscount = isMember && subtotal >= 50'000;
    const long long discount = earnsDiscount ? subtotal / 10 : 0;
    const long long afterDiscount = subtotal - discount;
    const long long shipping = afterDiscount >= 75'000 ? 0 : 4'500;
    const long long total = afterDiscount + shipping;

    std::cout << "Subtotal: " << subtotal << " piasters\n"
              << "Discount: " << discount << " piasters\n"
              << "Shipping: " << shipping << " piasters\n"
              << "Total: " << total << " piasters\n";
}
```

This version makes a precise policy choice: both the discount and free-shipping threshold use explicitly documented amounts. If the business changes the policy, the affected expression is easy to locate.

## Requirements that must be decided, not guessed

- Does free shipping depend on subtotal or the amount after discount?
- Can a member discount and coupon be combined, or does the best discount win?
- Is a percentage rounded after each item or once for the whole order?
- What happens when stock is lower than the requested quantity?
- Are taxes included in displayed prices?

These are domain questions. Code cannot correct an undefined rule; it can only hide the ambiguity. Record each answer, then turn it into a predicate and a boundary test.

## Lesson map

<div class="lesson-diagram" role="img" aria-label="Concept map: Online order analysis project">
<p class="lesson-diagram-title">Concept map: Online order analysis project</p>
<div class="diagram-flow">
<div class="diagram-node input"><span>Price and quantity</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>Discount and shipping</span></div>
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
