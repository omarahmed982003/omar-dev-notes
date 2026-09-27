---
title: "Objects, the STL, RAII, and testing"
description: "Model data and rules with clear types, then use the standard library, automatic resource management, and focused tests to build maintainable programs."
sidebar:
  order: 14
tableOfContents: true
---

First read [functions and containers](/en/cpp/advanced/01-functions-containers-references/). The small class/algorithm fragments need their surrounding program and headers. The final example is complete. An iterator identifies a position in a container; `[begin, end)` includes the first position and excludes the position after the last element.


## Types that represent the domain

A class keeps state together with operations that preserve its validity. Hide implementation details and expose an interface that cannot create an invalid object.

```cpp
class Order {
public:
    explicit Order(double subtotal) : subtotal_{subtotal} {
        if (!std::isfinite(subtotal) || subtotal < 0) throw std::invalid_argument{"negative subtotal"};
    }

    double total(double discount) const {
        if (!std::isfinite(discount) || discount < 0 || discount > 1)
            throw std::invalid_argument{"discount outside 0..1"};
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


## Complete program and boundary checks

```cpp
#include <algorithm>
#include <fstream>
#include <iostream>
#include <stdexcept>
#include <vector>

void savePassingScores(const std::vector<int>& scores) {
    std::ofstream file("passing-scores.txt");
    if (!file) throw std::runtime_error("Cannot open output");
    for (int score : scores) {
        if (score < 0 || score > 100) throw std::invalid_argument("Invalid score");
        if (score >= 50) file << score << '\n';
    }
    file.flush();
    if (!file) throw std::runtime_error("Write failed");
    file.close();
    if (!file) throw std::runtime_error("Close failed");
}
int main() {
    std::vector<int> scores{75, 42, 91, 60};
    std::sort(scores.begin(), scores.end());
    const auto passed = std::count_if(scores.begin(), scores.end(),
        [](int score) { return score >= 50; });
    try {
        savePassingScores(scores);
        std::cout << "passed=" << passed << '\n';
    } catch (const std::exception& error) {
        std::cerr << error.what() << '\n';
        return 1;
    }
}
```

Save as `raii.cpp`, compile with `g++ -std=c++17 -Wall -Wextra -pedantic raii.cpp -o raii`, then run in a writable scratch folder. It overwrites `passing-scores.txt` with 60,75,91 on separate lines and prints `passed=3`. `sort` changes the vector; `count_if` reads it using a lambda, a small callable defined where it is needed. The stream owns its file handle and releases it on scope exit, including exception unwinding. Explicit flush/close checks make write failures observable; a destructor cannot report them through this normal result path. RAII releases resources, but does not undo already written bytes: inserting an invalid score can leave a partial file. Validate first and use a temporary-file replacement protocol when all-or-nothing output is required. Test an empty list and an unwritable directory.


The Order fragment needs `<cmath>` and `<stdexcept>`. It rejects non-finite values such as NaN as well as negative subtotals and discounts outside 0..1. Approximate double values illustrate class structure here; represent financial amounts with bounded integer minor units or a decimal type in a real pricing model.
