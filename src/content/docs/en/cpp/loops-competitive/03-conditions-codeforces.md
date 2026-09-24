---
title: "15. Condition and formula problems"
sidebar:
  order: 15
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

## Problem families covered by this lesson

The goal is not to memorize solutions, but to recognize the mathematical form behind each statement:

| Problem pattern | Main idea | Typical trap |
|---|---|---|
| Mahmoud and Ehab and the even/odd winner | The parity of the input determines the winner | Simulating a game whose result is direct |
| Calculating Function | Pair positive and negative terms, then handle an odd remainder | Iterating up to a huge `n` |
| Watermelon | Split an even number into two positive even parts | Accepting `2`, although `1 + 1` is not valid |
| Key races | Compare two computed arrival times | Reversing distance or speed terms |
| Nauuo and Votes | Compare the difference after considering an allowed uncertainty | Missing the equality boundary |
| Even Odds | Map a 1-based position into the odd half or even half | Wrong half size when `n` is odd |
| Pasha and Stick | Form four equal sides after removing at most one unit | Forgetting positivity and divisibility |
| Pashmak and Garden | Complete an axis-aligned square or reject | Accepting a diagonal that is not at 45 degrees |

Additional short problems such as Elephant, Vasya the Hipster, Word Capitalization, and Theatre Square reinforce ceiling division, minimum/remaining counts, safe character handling, and overflow-aware multiplication.

## Derive instead of simulate

For the alternating sum `-1 + 2 - 3 + 4 ...`, every complete pair contributes `1`. Therefore `n / 2` is the answer for even `n`; for odd `n`, subtract the final odd number. This changes an `O(n)` loop into `O(1)` arithmetic.

For Theatre Square, the number of flagstones along one dimension is ceiling division:

```cpp
long long rows = (n + a - 1) / a;
long long columns = (m + a - 1) / a;
long long answer = rows * columns;
```

The variables and product must be wide enough. Integer division truncates, so plain `n / a` undercounts whenever a remainder exists.

## A disciplined contest workflow

Extract constraints, write the mathematical cases, choose types from the largest possible intermediate value, and create tiny hand-computed samples before coding. Test the first and last valid inputs, every point where a condition changes, and values that make both branches look nearly identical. Only then consider micro-optimizations.

## Problem families covered by this lesson

The goal is not to memorize solutions, but to recognize the mathematical form behind each statement:

| Problem pattern | Main idea | Typical trap |
|---|---|---|
| Mahmoud and Ehab and the even/odd winner | The parity of the input determines the winner | Simulating a game whose result is direct |
| Calculating Function | Pair positive and negative terms, then handle an odd remainder | Iterating up to a huge `n` |
| Watermelon | Split an even number into two positive even parts | Accepting `2`, although `1 + 1` is not valid |
| Key races | Compare two computed arrival times | Reversing distance or speed terms |
| Nauuo and Votes | Compare the difference after considering an allowed uncertainty | Missing the equality boundary |
| Even Odds | Map a 1-based position into the odd half or even half | Wrong half size when `n` is odd |
| Pasha and Stick | Form four equal sides after removing at most one unit | Forgetting positivity and divisibility |
| Pashmak and Garden | Complete an axis-aligned square or reject | Accepting a diagonal that is not at 45 degrees |

Additional short problems such as Elephant, Vasya the Hipster, Word Capitalization, and Theatre Square reinforce ceiling division, minimum/remaining counts, safe character handling, and overflow-aware multiplication.

## Derive instead of simulate

For the alternating sum `-1 + 2 - 3 + 4 ...`, every complete pair contributes `1`. Therefore `n / 2` is the answer for even `n`; for odd `n`, subtract the final odd number. This changes an `O(n)` loop into `O(1)` arithmetic.

For Theatre Square, the number of flagstones along one dimension is ceiling division:

```cpp
long long rows = (n + a - 1) / a;
long long columns = (m + a - 1) / a;
long long answer = rows * columns;
```

The variables and product must be wide enough. Integer division truncates, so plain `n / a` undercounts whenever a remainder exists.

## A disciplined contest workflow

Extract constraints, write the mathematical cases, choose types from the largest possible intermediate value, and create tiny hand-computed samples before coding. Test the first and last valid inputs, every point where a condition changes, and values that make both branches look nearly identical. Only then consider micro-optimizations.

## Lesson map

<div class="lesson-diagram" role="img" aria-label="Concept map: Conditions and Codeforces exercises">
<p class="lesson-diagram-title">Concept map: Conditions and Codeforces exercises</p>
<div class="diagram-flow">
<div class="diagram-node input"><span>Inputs and constraints</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>Cases and formulas</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>Example</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node decision"><span>Corrections and common mistakes</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node output"><span>Conditional problems train translation from story text into equations</span></div>
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
</div>
