---
title: "13. Competitive programming and practice platforms"
sidebar:
  order: 13
description: "Competitive programming trains constraint analysis, algorithm choice, and fast correct implementation. The judge is a measurement tool, not a substitute for understanding."
tableOfContents: true
---

## Competitive programming

Competitive programming trains constraint analysis, algorithm choice, and fast correct implementation. The judge is a measurement tool, not a substitute for understanding.

## Statements, constraints, and complexity

- Read input, output, and constraints before samples.
- Translate constraints into acceptable complexity; n=10^5 usually rules out O(n²).
- Solve samples by hand, then add custom cases.
- After Wrong Answer, inspect boundaries, types, rounding, and interpretation.
- State time and memory complexity after solving.

## Example: Elephant and ceiling division

```cpp
// Elephant: minimum moves of length at most 5
int moves = (distance + 4) / 5; // integer ceiling
```

### Complete runnable submission

```cpp
#include <iostream>

int main() {
    std::ios::sync_with_stdio(false);
    std::cin.tie(nullptr);

    int distance{};
    if (!(std::cin >> distance) || distance < 0) {
        return 1;
    }

    const int moves = (distance + 4) / 5;
    std::cout << moves << '\n';
}
```

For input `12`, the output is `3`: two moves of length 5 and a final move of length 2. Time and auxiliary memory are both `O(1)`. The program prints no prompt such as `Enter distance` because an online judge compares output exactly. The validation helps during local use, although the original problem normally guarantees valid input.

## The Online Judge workflow

The judge compiles submitted source code with a documented compiler and options, runs the executable against hidden tests under time and memory limits, and compares actual output with expected output through a checker. `Compilation Error` means the source did not build. `Wrong Answer` means it ran but produced incorrect output. `Runtime Error` covers failures such as invalid access or division by zero. `Time Limit Exceeded` and `Memory Limit Exceeded` identify exhausted resource limits.

## Samples, submissions, and random changes

- Passing samples does not prove correctness.
- Do not start with maximum difficulty; build a consistent practice ladder.

## Platforms and problem patterns

Codeforces emphasizes contests, ratings, and broad problem sets. LeetCode often emphasizes interview-oriented data-structure patterns. Begin with implementation, arithmetic, and conditions, then add loops and containers. After each problem record the idea, the bug, complexity, and a missed test case.

The practice set covers: ceiling division in 617A and 1A, `min` and remainder in 581A, character handling in 281A, parity in 4A and 959A, formula derivation in 486A, three-way comparison in 835A, guaranteed outcomes in 1173A, odd/even block mapping in 318A, and geometric case analysis in 459A.

Read an editorial only after a genuine attempt, then close it and derive the method again on a different example.

## Lesson map

<div class="lesson-diagram" role="img" aria-label="Concept map: Competitive programming and practice platforms">
<p class="lesson-diagram-title">Concept map: Competitive programming and practice platforms</p>
<div class="diagram-flow">
<div class="diagram-node input"><span>Problem statement</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>Input and constraints</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>Algorithm and complexity</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node decision"><span>Submit to the judge</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node output"><span>Verdict, diagnosis, and correction</span></div>
</div>
</div>

## Check your understanding

<div class="lesson-quiz" role="list">
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">01</span><p>Why do constraints select the algorithm before coding?</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> For n=10^5, O(n²) may be impossible regardless of code quality, while O(n log n) or O(n) can fit.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">02</span><p>What does Wrong Answer after passing samples imply?</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> Samples are not proof; revisit interpretation, boundaries, types, rounding, and construct counterexamples.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">03</span><p>Why does (d+4)/5 solve Elephant?</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> It performs integer ceiling by five: adding four turns any nonzero remainder into one additional move.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">04</span><p>How do you learn after an accepted solution?</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> Record complexity, study an alternative, reimplement later, and document the misconception that blocked the first attempt.</div></details>
</section>
</div>
