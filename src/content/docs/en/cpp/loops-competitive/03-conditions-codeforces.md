---
title: "14. Condition and formula problems"
sidebar:
  order: 14
description: "Conditional problems train translation from story text into equations and exclusive cases. The main difficulty is usually boundaries, not typing if."
tableOfContents: true
---

## From a problem statement to cases and formulas

Conditional problems train translation from story text into equations and exclusive cases. The main difficulty is usually boundaries, not typing if.

## Boundaries, exclusive cases, and direct formulas

- Define symbols and equations before coding.
- Look for a mathematical shortcut instead of unnecessary simulation.
- Make cases mutually exclusive or define a clear priority.
- Use a wide type when large constraints are multiplied.
- For Even Odds, split the odd and even halves using the 1-based position.

## Example: deriving Even Odds

```cpp
long long oddCount = (n + 1) / 2;
long long answer = (k <= oddCount)
    ? 2 * k - 1
    : 2 * (k - oddCount);
```

## Indexing, overflow, and precision mistakes

- Confirm whether k is 1-based or 0-based.
- Do not use double for exact integer arithmetic.

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

## Derive instead of simulate

Constraints decide whether simulation is possible. If `n` may reach `10^18`, an `O(n)` loop cannot finish, so a direct or logarithmic solution is required. Test every transition boundary, such as the last odd position and first even position in Even Odds.

## A disciplined contest workflow

Extract the input and output, write the cases and formulas, choose types from the largest intermediate value, and compute small expected answers by hand. Then test the first and last valid inputs and every point where the selected branch changes.

## Lesson map

<div class="lesson-diagram" role="img" aria-label="Concept map: Conditions and Codeforces exercises">
<p class="lesson-diagram-title">Concept map: Conditions and Codeforces exercises</p>
<div class="diagram-flow">
<div class="diagram-node input"><span>Inputs and constraints</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>Mutually exclusive cases</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>Derive the formula</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node decision"><span>Boundary tests</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node output"><span>Complete O(1) solution</span></div>
</div>
</div>

## Check your understanding

<div class="lesson-quiz" role="list">
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">01</span><p>Derive the odd half of Even Odds.</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> There are (n+1)/2 odds through n; position k in that half maps to 2k-1.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">02</span><p>Why use long long when each input fits in int?</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> Products and sums can overflow even when individual inputs fit; intermediate expression range matters.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">03</span><p>When is a formula better than simulation?</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> If position or total can be computed directly, O(1) avoids a loop that may exceed time limits.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">04</span><p>Which boundaries expose a 0-based/1-based mistake?</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> Test k=1, the last position of the first half, the first of the second half, and k=n.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">05</span><p>Why is <code>w % 2 == 0</code> alone insufficient for Watermelon?</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> Two is even but cannot be split into two positive even parts. The full condition is <code>w &gt; 2 &amp;&amp; w % 2 == 0</code>.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">06</span><p>For Even Odds with <code>n = 7</code>, what are the final odd position and first even position?</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> There are <code>(7 + 1) / 2 = 4</code> odd values. Position 4 contains 7; position 5 begins the even block with 2.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">07</span><p>Why does Theatre Square need <code>long long</code> even when each dimension fits in int?</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> Multiplying tile counts for both axes may exceed int. Intermediate values and multiplication must be wide, not only the destination variable.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">08</span><p>Which three geometric cases must Pashmak and Garden distinguish?</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> A vertical side, a horizontal side, or a 45-degree diagonal where <code>abs(dx) == abs(dy)</code>. Any other slanted case is impossible.</div></details>
</section>
</div>
