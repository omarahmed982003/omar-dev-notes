---
title: "Objects, the STL, RAII, and testing"
description: "Model data and rules with clear types, then use the standard library, automatic resource management, and focused tests to build maintainable programs."
pagefind: false
tableOfContents: true
---

## Types that represent the domain

A class keeps state together with operations that preserve its validity. Hide implementation details and expose an interface that cannot create an invalid object.

```cpp
class Order {
public:
    explicit Order(double subtotal) : subtotal_{subtotal} {
        if (subtotal < 0) throw std::invalid_argument{"negative subtotal"};
    }

    double total(double discount) const {
        return subtotal_ * (1.0 - discount);
    }
private:
    double subtotal_{};
};
```

The constructor establishes a valid object. The trailing `const` promises that the method does not change observable state. Prefer composition before inheritance when a type is assembled from collaborating parts rather than forming a true substitutable is-a relationship.

## RAII and resource ownership

RAII ties a resource to an object's lifetime: acquisition happens during construction and release during destruction. `vector`, `string`, and file streams use this pattern.

Avoid direct `new` and `delete` in application code. Use `std::unique_ptr` when dynamic ownership is necessary. Use `std::shared_ptr` only for genuine shared ownership because reference cycles can prevent cleanup.

## STL algorithms

Algorithms express intent across iterator ranges.

```cpp
std::vector<int> scores{75, 42, 91, 60};
std::sort(scores.begin(), scores.end());
auto passed = std::count_if(scores.begin(), scores.end(),
    [](int score) { return score >= 50; });
```

Learn `find`, `transform`, and `accumulate` as well. Use an algorithm when it makes the operation and boundaries clearer, not only to shorten code.

## Errors and tests

Represent expected invalid user input as a validation result. Use an exception when an operation cannot fulfill its contract. Catch it where the program can recover or create a useful message.

Test normal, boundary, and invalid cases. Compiler warnings, a debugger, and sanitizers help expose out-of-bounds access and lifetime errors. Every fixed bug should gain a regression test that failed before the fix.

## Capstone refactor

Rebuild the online order project with `Product`, `Cart`, and a pricing policy. Store items in a vector, use algorithms for totals, and test an empty cart, the discount boundary, and an invalid quantity.

## Check your understanding

<div class="lesson-quiz" role="list">
<section class="quiz-card" role="listitem"><div class="quiz-question-row"><span class="quiz-number">01</span><p>Why is RAII safer than cleanup copied into every control-flow path?</p></div><details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Answer:</strong> Destruction runs when scope ends, including early returns and exceptions, so cleanup is centralized and leaks are less likely.</div></details></section>
<section class="quiz-card" role="listitem"><div class="quiz-question-row"><span class="quiz-number">02</span><p>When is composition clearer than inheritance?</p></div><details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Answer:</strong> When a type contains collaborating parts and there is no genuine substitutable is-a relationship.</div></details></section>
<section class="quiz-card" role="listitem"><div class="quiz-question-row"><span class="quiz-number">03</span><p>Which regression test follows a discount bug at subtotal 500?</p></div><details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Answer:</strong> Test 500 together with 499 and 501 so the exact boundary and both neighboring behaviors remain defined.</div></details></section>
</div>
