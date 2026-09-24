---
title: "Functions, containers, and references"
description: "Split programs into clear functions, choose array, vector, or string for the data shape, and pass values safely by value or reference."
pagefind: false
tableOfContents: true
---

## Functions give work a name

As a program grows, its steps should not remain inside `main`. A function names one task, defines its inputs and result, and can be tested and reused independently.

```cpp
double finalPrice(double subtotal, double discountRate)
{
    return subtotal * (1.0 - discountRate);
}
```

A declaration introduces the name and types. A definition supplies the body. The compiler needs a declaration before the first call, while the linker finds the final definition across object files.

## Value, reference, and const

Passing by value copies an argument. `T&` permits modification of the original. `const T&` avoids a potentially expensive copy while preventing modification.

```cpp
void addTax(double& total, double rate) { total *= 1.0 + rate; }
double average(const std::vector<int>& values);
```

Use values for small types and independent inputs, `const&` for read-only access to a large object, and `&` only when mutation is part of the function's contract. Never return a reference to a local variable whose lifetime ends at return.

## Scope and lifetime

A local variable lives until its block ends. A local `static` retains its value across calls. Scope answers where a name is visible; lifetime answers when the object exists.

## array, vector, and string

| Type | Size | Use |
|---|---|---|
| `std::array<T, N>` | Fixed at compile time | A fixed element count with a container interface |
| `std::vector<T>` | Changes at runtime | The default general-purpose sequence |
| `std::string` | Dynamic text | Text modification, search, and composition |

```cpp
std::vector<int> scores{75, 91, 60};
scores.push_back(84);

int total = 0;
for (int score : scores) total += score;
double avg = scores.empty() ? 0.0
                            : static_cast<double>(total) / scores.size();
```

Indexes begin at zero. `operator[]` does not check bounds; `at()` reports an invalid index. Vector growth may reallocate storage and invalidate older pointers and references to its elements.

## Files and interfaces

Put shared declarations in a header protected by `#pragma once` or header guards, and definitions in `.cpp` files. Avoid `using namespace std;` in a header because it affects every file that includes it.

## Check your understanding

<div class="lesson-quiz" role="list">
<section class="quiz-card" role="listitem"><div class="quiz-question-row"><span class="quiz-number">01</span><p>When is const T&amp; preferable to T?</p></div><details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Answer:</strong> When reading a large object without copying or modifying it. Small types such as int are usually clearer by value.</div></details></section>
<section class="quiz-card" role="listitem"><div class="quiz-question-row"><span class="quiz-number">02</span><p>Why can push_back invalidate a reference to a vector element?</p></div><details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Answer:</strong> The vector may move all elements to a larger allocation, leaving the reference pointing at old storage.</div></details></section>
<section class="quiz-card" role="listitem"><div class="quiz-question-row"><span class="quiz-number">03</span><p>How do you make average testable without cin or cout?</p></div><details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Answer:</strong> Accept the container and return the result. Keep input and presentation in separate functions.</div></details></section>
</div>
