---
title: "9. if, else, validation, and nesting"
sidebar:
  order: 9
description: "if and else direct execution. Write conditions as readable rules and reduce nesting through early validation and grouped logic."
tableOfContents: true
---

## Before you start

Read this lesson in three passes: understand the problem, follow the example, then try the final check yourself. The terms below are explained before they are used in detail.

### New terms in this lesson

- **Compiler:** A program that turns source code into a form the computer can run.
- **Boolean:** A logical value with only two states: true or false.


## How if chooses an execution path

if and else direct execution. Write conditions as readable rules and reduce nesting through early validation and grouped logic.

## if, else, else-if, and short circuiting

- if accepts a contextually Boolean expression, but explicit predicates are often clearer.
- Braces prevent maintenance bugs when a one-line body grows.
- else binds to the nearest unmatched if; braces remove ambiguity.
- An else-if chain is exclusive; separate if statements may all run.
- Place specific boundary cases before broad cases.
- Short-circuiting can validate a denominator or index before use.

## Example: validate and classify a score

```cpp
if (score < 0 || score > 100) {
    std::cout << "Invalid score\n";
} else if (score >= 85) {
    std::cout << "Excellent\n";
} else if (score >= 50) {
    std::cout << "Pass\n";
} else {
    std::cout << "Fail\n";
}
```

## Assignment, empty-body, and nesting mistakes

- if (x = 5) assigns instead of comparing.
- A semicolon immediately after if creates an empty body.

<div class="lesson-diagram" role="img" aria-label="if/else flow: validate first, then choose one branch">
<p class="lesson-diagram-title">if/else flow: validate first, then choose one branch</p>
<div class="diagram-flow diagram-decision">
<div class="diagram-node input"><span>Read value</span></div>
<span class="diagram-arrow" data-label="validate" aria-hidden="true">→</span>
<div class="diagram-node decision"><span>Valid?</span></div>
<span class="diagram-arrow" data-label="yes" aria-hidden="true">→</span>
<div class="diagram-node decision"><span>Which range?</span></div>
<span class="diagram-arrow" data-label="one branch" aria-hidden="true">→</span>
<div class="diagram-node process"><span>Run branch</span></div>
<span class="diagram-arrow" data-label="return" aria-hidden="true">→</span>
<div class="diagram-node output"><span>Return result</span></div>
</div>
<div class="diagram-branches">
<p class="diagram-branch-label">Rejection and boundary paths</p>
<div class="diagram-node danger"><span>Invalid ← reject before business rules</span></div>
<div class="diagram-node output"><span>Shared boundary ← test equality explicitly</span></div>
</div>
</div>

## From business rule to condition

Write the rule in plain language, identify variables and boundaries, and then translate it into a Boolean expression. “Accept when quantity is positive and stock is sufficient” becomes `quantity > 0 && quantity <= stock`. Test zero, one, exactly the stock, and one above it.

Validate invalid input first, then special cases, then the general rule. Use separate `if` statements when several labels may apply, and an `else if` chain when exactly one outcome must win. Parenthesize mixed `&&` and `||` rules even when precedence would produce the same result.

## Decision ordering and short circuiting

Reject invalid data first, then handle special cases, then the general rule. `&&` and `||` short circuit, but parentheses still document grouped business rules. Several independent `if` statements may all run; an `if/else if/else` chain selects only the first true branch.

## Nested decisions, guard clauses, and strings

Nesting is useful when the second question has no meaning until the first succeeds. Guard clauses can reject invalid states early and keep the normal path shallow. `std::string` supports `==`, but case and surrounding whitespace are part of the value unless the input contract defines normalization.

## De Morgan's laws

The negation of `(age >= 18 && hasId)` is `(age < 18 || !hasId)`. Use the equivalent form that states the rule most clearly, and name complex Boolean parts instead of building one unreadable expression.

## Complete program: validate, then classify

```cpp
#include <iostream>
int main() {
    int score{};
    std::cout << "Score from 0 to 100: ";
    if (!(std::cin >> score)) { std::cerr << "Score must be an integer\n"; return 1; }
    if (score < 0 || score > 100) std::cout << "Invalid score\n";
    else if (score >= 85) std::cout << "Excellent\n";
    else if (score >= 50) std::cout << "Pass\n";
    else std::cout << "Fail\n";
}
```

Test `-1`, `0`, `49`, `50`, `84`, `85`, `100`, `101`, and malformed text. Putting `score >= 50` first makes the excellent branch unreachable.

## Boolean context, independent conditions, and exclusive chains

An `if` converts its condition to Boolean. Write comparisons that communicate intent instead of depending on accidental nonzero values. Use separate `if` statements when several outcomes may all apply, such as awarding multiple badges. Use one `if`/`else if` chain when exactly one classification must win.

Order overlapping thresholds from the most specific to the least specific. If `score >= 50` appears before `score >= 85`, an excellent score is captured by the earlier branch.

## Compound text input and early validation

When a decision uses a full name or sentence, read it with `std::getline`. If formatted extraction preceded it, consume the leftover newline deliberately. Validate syntax and range before applying business rules, and use guard clauses to keep the valid path shallow.

```cpp
if (!(std::cin >> age)) {
    std::cerr << "Invalid number\n";
    return 1;
}
if (age < 0 || age > 120) {
    std::cerr << "Age outside the accepted range\n";
    return 1;
}
```


## Problems that apply conditions and formulas

## Complete problem solutions

Each solution below includes a complete program, the governing formula, boundary tests, and complexity. The goal is to derive the program rather than memorize it.

### 959A Mahmoud and Ehab

Only parity matters. An even `n` prints Mahmoud; an odd `n` prints Ehab.

```cpp
#include <iostream>
int main() { int n{}; std::cin >> n; std::cout << (n % 2 == 0 ? "Mahmoud" : "Ehab") << '\n'; }
```

Trace `1` and `2`. Time and memory are `O(1)`. Simulating turns adds work without information.

### 486A Calculating Function

Every pair `-1 + 2`, `-3 + 4`, and so on contributes `1`. An odd `n` leaves one final negative term.

```cpp
#include <iostream>
int main() {
    long long n{}; std::cin >> n;
    std::cout << (n % 2 == 0 ? n / 2 : -(n + 1) / 2) << '\n';
}
```

`n=4` gives `2`; `n=5` gives `-3`. Use `long long`. The direct solution is `O(1)`.

### 4A Watermelon

Two positive even parts require an even weight greater than 2.

```cpp
#include <iostream>
int main() {
    int w{}; std::cin >> w;
    std::cout << (w > 2 && w % 2 == 0 ? "YES" : "NO") << '\n';
}
```

Test `2`, `3`, and `4`. Checking parity alone incorrectly accepts `2`. Complexity is `O(1)`.

### 835A Key Races

Compute each total once as `s * v + 2 * t`, then compare the two values.

```cpp
#include <iostream>
int main() {
    long long s{}, v1{}, v2{}, t1{}, t2{};
    std::cin >> s >> v1 >> v2 >> t1 >> t2;
    const long long first = s * v1 + 2 * t1;
    const long long second = s * v2 + 2 * t2;
    if (first < second) std::cout << "First\n";
    else if (second < first) std::cout << "Second\n";
    else std::cout << "Friendship\n";
}
```

Test one win for each player and a tie. Complexity is `O(1)`. Do not repeat the formula in every branch.

### 1173A Nauuo and Votes

`+` is guaranteed only when `x > y + z`; the negative case is symmetric. A guaranteed tie requires `z == 0 && x == y`.

```cpp
#include <iostream>
int main() {
    long long x{}, y{}, z{}; std::cin >> x >> y >> z;
    if (x > y + z) std::cout << "+\n";
    else if (y > x + z) std::cout << "-\n";
    else if (z == 0 && x == y) std::cout << "0\n";
    else std::cout << "?\n";
}
```

Test all four outputs. Complexity is `O(1)`. Comparing only `x` and `y` ignores uncertainty.

### 318A Even Odds

The odd half contains `(n + 1) / 2` values. Map `k` into that half or subtract its size and map into the even half.

```cpp
#include <iostream>
int main() {
    long long n{}, k{}; std::cin >> n >> k;
    const long long oddCount = (n + 1) / 2;
    std::cout << (k <= oddCount ? 2 * k - 1 : 2 * (k - oddCount)) << '\n';
}
```

For `n=10`, test `k=5` and `k=6`. The formula is `O(1)` and avoids building the sequence.

### 459A Pashmak and Garden

Handle a vertical side, a horizontal side, a 45-degree diagonal, and the impossible case separately.

```cpp
#include <cstdlib>
#include <iostream>
int main() {
    int x1{}, y1{}, x2{}, y2{}; std::cin >> x1 >> y1 >> x2 >> y2;
    if (x1 == x2 && y1 != y2) {
        const int d = std::abs(y1 - y2);
        std::cout << x1 + d << ' ' << y1 << ' ' << x2 + d << ' ' << y2 << '\n';
    } else if (y1 == y2 && x1 != x2) {
        const int d = std::abs(x1 - x2);
        std::cout << x1 << ' ' << y1 + d << ' ' << x2 << ' ' << y2 + d << '\n';
    } else if (std::abs(x1 - x2) == std::abs(y1 - y2)) {
        std::cout << x1 << ' ' << y2 << ' ' << x2 << ' ' << y1 << '\n';
    } else std::cout << "-1\n";
}
```

Test all four cases, including identical points. Complexity is `O(1)`.

### 617A Elephant

Ceiling division by 5 gives the minimum number of steps.

```cpp
#include <iostream>
int main() { int x{}; std::cin >> x; std::cout << (x + 4) / 5 << '\n'; }
```

Test `1`, `5`, and `6`. Complexity is `O(1)`.

### 581A Vasya the Hipster

Different-color days equal `min(a,b)`; the remaining difference supplies same-color pairs.

```cpp
#include <algorithm>
#include <cstdlib>
#include <iostream>
int main() {
    int a{}, b{}; std::cin >> a >> b;
    std::cout << std::min(a, b) << ' ' << std::abs(a - b) / 2 << '\n';
}
```

For `3 7`, the result is `3 2`. Complexity is `O(1)`.

### 281A Word Capitalization

Change only the first character. Cast through `unsigned char` before calling `<cctype>`.

```cpp
#include <cctype>
#include <iostream>
#include <string>
int main() {
    std::string word; std::cin >> word;
    if (!word.empty()) {
        const auto first = static_cast<unsigned char>(word.front());
        word.front() = static_cast<char>(std::toupper(first));
    }
    std::cout << word << '\n';
}
```

This solves the problem's Latin-character input; it is not general Unicode case conversion. Work after input is `O(1)`.

### 1A Theatre Square

Apply ceiling division to both dimensions and multiply with `long long`.

```cpp
#include <iostream>
int main() {
    long long n{}, m{}, a{}; std::cin >> n >> m >> a;
    const long long rows = (n + a - 1) / a;
    const long long columns = (m + a - 1) / a;
    std::cout << rows * columns << '\n';
}
```

For `6 6 4`, the answer is `4`. Plain integer division undercounts whenever a remainder exists. Complexity is `O(1)`.

## Check your understanding

<div class="lesson-quiz" role="list">
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">01</span><p>Why must score&gt;=85 come before score&gt;=50?</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> An else-if chain stops at the first true branch; placing &gt;=50 first would swallow excellent scores.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">02</span><p>What does if(x=5) do?</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> It assigns 5 to x and then treats the nonzero result as true; use <code>==</code> and enable compiler warnings.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">03</span><p>When are independent if statements better than else-if?</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> When multiple outcomes may coexist, such as awarding several badges; else-if is for exclusive results.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">04</span><p>How can deeply nested validation be reduced?</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> Reject invalid states early with guard clauses so the main valid path remains shallow.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">05</span><p>A chain tests <code>score &gt;= 50</code> before <code>score &gt;= 85</code>. Why can it never award excellent?</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> A score of 85 satisfies the first branch and the else-if chain stops. Order thresholds from most specific and highest to lowest.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">06</span><p>Correct <code>if (age = 18)</code> and name one way to prevent the bug from passing silently.</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> Write <code>if (age == 18)</code>, enable warnings such as <code>-Wall -Wextra -Werror</code>, and test ages 17 and 18.</div></details>
</section>
</div>

## Connect the ideas

After hand-written cases, add property-style checks for boundaries: output stays in range and a larger input cannot move to a lower class without an explicit rule. Use compiler warnings to expose constant conditions and unreachable branches.

### Try it yourself

Generate values around every boundary and prove no unintended gap or overlap exists.
