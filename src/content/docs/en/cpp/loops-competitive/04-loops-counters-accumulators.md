---
title: "16. Loops and repetition patterns"
sidebar:
  order: 16
description: "A loop has initial state, a continuation condition, and an update. Choose while, for, or do-while according to the repetition model."
tableOfContents: true
---

## The parts of a loop

A loop has initial state, a continuation condition, and an update. Choose while, for, or do-while according to the repetition model.

## for, while, do-while, counters, and sentinels

- for fits a known counter progression.
- while fits termination driven by evolving state.
- do-while runs at least once and can support interactive validation.
- A counter counts, an accumulator combines, and a sentinel ends unknown-length input.
- break exits the nearest loop; continue skips the rest of one iteration.
- Nested loops often multiply iteration counts; analyze complexity.

## Example: summing even numbers

```cpp
long long sum{};
for (int i = 1; i <= n; ++i) {
    if (i % 2 != 0) continue;
    sum += i;
}
```

## Infinite loops and off-by-one errors

- Every path should move toward termination.
- Updating the counter in the wrong place causes off-by-one errors.

<div class="lesson-diagram" role="img" aria-label="The loop cycle and its initialization, bound, and update points">
<p class="lesson-diagram-title">The loop cycle and its initialization, bound, and update points</p>
<div class="diagram-flow">
<div class="diagram-node start"><span>Initialize</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node decision"><span>Condition</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>Loop body</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>Update</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node output"><span>Exit</span></div>
</div>
</div>

## Trace and repetition patterns

Before coding, define the start, continuation condition, and step. Trace the control variable and state after every iteration. The update must move the state toward termination.

A counter starts at zero and increments on a match. An accumulator starts with a neutral value. A sentinel ends an unknown-length sequence but is not part of the data. A validation loop repeats until input is valid. Nested loops often multiply iteration counts. You do not need an array when each value can update the final summary immediately.

## Choose the loop from the repetition model

Use `for` when initialization, condition, and update form one visible counter progression. Use `while` when the next iteration depends on input or evolving state rather than a fixed count. Use `do-while` only when one execution is genuinely required before testing the condition, such as displaying a menu for the first time.

```cpp
int value{};
long long sum{};
int count{};

while (std::cin >> value && value != -1) {
    sum += value;
    ++count;
}

if (count != 0) {
    std::cout << static_cast<double>(sum) / count << '\n';
}
```

The sentinel `-1` ends the sequence and is not included. The input operation is part of the condition, so an end-of-file or malformed token also stops safely.

## Common patterns

- **Counting:** initialize to zero and increment only when a predicate is true.
- **Summation:** start from zero; for a product, start from one.
- **Minimum or maximum:** initialize from the first real value or use an explicit “no value yet” state.
- **Validation:** repeat input until both extraction and the domain rule succeed.
- **Digit processing:** repeatedly use `% 10` to read the last digit and `/= 10` to remove it.
- **Nested patterns:** let the outer loop represent rows and the inner loop represent columns.

`break` exits the nearest loop; it should represent a clear event such as finding the requested value. `continue` skips the remaining statements in the current iteration. In a `while` loop, be careful that `continue` does not bypass the state update and accidentally create an infinite loop.

## Trace invariants and complexity

An invariant is a fact that remains true before and after each iteration. For a running sum, after processing `i` values, `sum` must equal the total of exactly those `i` values. Stating this fact makes initialization, updates, and final output easier to verify.

One loop from `0` to `n-1` is usually `O(n)`. Two independent nested loops of size `n` are usually `O(n²)`, but count the actual work rather than guessing from indentation. If an inner pointer only moves forward across the entire program, total work may still be linear.

## The loop model: start, condition, body, and update

Before choosing `while` or `for`, answer four questions:

1. What is the initial state?
2. What condition permits another iteration?
3. What work belongs in the repeated body?
4. What update moves the state toward termination?

One execution of the body is an iteration. A pre-test loop checks its condition before every possible iteration, so a false initial condition produces zero executions.

## Trace a while loop by hand

```cpp
int i = 1;

while (i <= 5) {
    std::cout << i << '\n';
    ++i;
}
```

| Value before iteration | Result of `i <= 5` | Output | Value after `++i` |
| ---: | --- | ---: | ---: |
| 1 | true | 1 | 2 |
| 2 | true | 2 | 3 |
| 3 | true | 3 | 4 |
| 4 | true | 4 | 5 |
| 5 | true | 5 | 6 |
| 6 | false | none | no update |

This table exposes boundary errors before execution. With `i < 5`, the last output is 4. Without `++i`, the state never changes and the program prints 1 indefinitely.

## Counting up, counting down, and changing the step

```cpp
// 0 through 9: exactly ten iterations
int i = 0;
while (i < 10) {
    std::cout << i << ' ';
    ++i;
}

// 10 through 1
int countdown = 10;
while (countdown >= 1) {
    std::cout << countdown << ' ';
    --countdown;
}

// Even numbers from 0 through 20
int even = 0;
while (even <= 20) {
    std::cout << even << ' ';
    even += 2;
}
```

The update must move toward the stopping boundary. Incrementing `countdown` while the condition is `countdown >= 1` moves away from termination and may eventually cause signed overflow.

## Multiplicative updates

```cpp
int value = 1;
while (value <= 64) {
    std::cout << value << ' ';
    value *= 2;
}
// 1 2 4 8 16 32 64
```

```cpp
int value{};
std::cin >> value;

while (value > 0) {
    std::cout << value << ' ';
    value /= 2;
}
```

For input `100`, the second trace is `100, 50, 25, 12, 6, 3, 1`. Integer division discards fractions, and the next update produces zero. Repeated halving takes roughly `log₂(value)` iterations. Repeated multiplication requires overflow analysis because wrapping or undefined behavior may prevent the expected termination.

## The stray semicolon after while

```cpp
int i = 1;
while (i <= 5);  // empty loop body
{
    std::cout << i;
    ++i;
}
```

The semicolon is the complete empty body. The following block is not part of the loop, and `i` cannot change while the condition remains true. Compiler warnings help catch this mistake.

## Sentinel-controlled input

```cpp
int number{};
std::cin >> number;

while (number != 0) {
    std::cout << "Accepted: " << number << '\n';
    std::cin >> number;
}
```

Zero ends the sequence and is not data. The loop needs a priming read before the condition and another read in the body. Omitting the second read leaves the condition unchanged. A safer form also accounts for stream failure:

```cpp
while (std::cin >> number && number != 0) {
    std::cout << "Accepted: " << number << '\n';
}
```

## do-while for required first execution

```cpp
int number{};

do {
    std::cout << "Enter a positive number: ";
    std::cin >> number;
} while (number <= 0);
```

The first input happens before any condition check. The semicolon after `while (condition);` is required in this syntax, unlike the accidental semicolon after a normal `while` header.

### A menu that must appear once

```cpp
int choice{};

do {
    std::cout << "1. Play\n2. Settings\n0. Exit\n";
    std::cin >> choice;

    if (choice == 1) {
        std::cout << "Playing\n";
    } else if (choice == 2) {
        std::cout << "Settings\n";
    } else if (choice != 0) {
        std::cout << "Unknown choice\n";
    }
} while (choice != 0);
```

A real program must also handle stream failure so that invalid text does not leave the menu using stale state forever.

## The exact execution order of for

```cpp
for (int i = 1; i <= 5; ++i) {
    std::cout << i << '\n';
}
```

Initialization runs once. The condition runs before every possible iteration. When it is true, the body runs, followed by the update. Control then returns to the condition; initialization does not run again.

The equivalent `while` form is:

```cpp
int i = 1;
while (i <= 5) {
    std::cout << i << '\n';
    ++i;
}
```

For `n` zero-based elements, `i < n` visits `0` through `n - 1`. With `n = 5`, these are `0, 1, 2, 3, 4`. Using `i <= n` creates six iterations and later causes an out-of-bounds access when used as an index.

## Counters, accumulators, and averages

A counter answers “how many?” while an accumulator combines values.

```cpp
int evenCount = 0;

for (int i = 1; i <= 10; ++i) {
    if (i % 2 == 0) {
        ++evenCount;
    }
}

std::cout << evenCount; // 5
```

```cpp
int n{};
std::cin >> n;

long long sum = 0;
for (int i = 0; i < n; ++i) {
    int number{};
    std::cin >> number;
    sum += number;
}

if (n > 0) {
    double average = static_cast<double>(sum) / n;
    std::cout << "Sum: " << sum << "\nAverage: " << average;
}
```

Zero is the additive identity. The cast happens before division so the fractional part survives. A `long long` sum can be necessary even when each individual input fits in `int`.

## Product accumulation

```cpp
long long product = 1;

for (int i = 0; i < 5; ++i) {
    int number{};
    std::cin >> number;
    product *= number;
}

std::cout << product;
```

One is the multiplicative identity. Starting from zero makes every product zero. Product growth is fast, so the wider type still needs a justified input range.

## Classify values without storing them

```cpp
int positive = 0;
int negative = 0;
int even = 0;
int odd = 0;

for (int i = 0; i < n; ++i) {
    int number{};
    std::cin >> number;

    if (number > 0) {
        ++positive;
    } else if (number < 0) {
        ++negative;
    }

    if (number % 2 == 0) {
        ++even;
    } else {
        ++odd;
    }
}
```

Zero is neither positive nor negative, but it is even. No array is needed because each summary updates as its value arrives. Store the sequence only if later work needs the original elements.

## Maximum without assuming zero

```cpp
int maximum{};

if (!(std::cin >> maximum)) {
    return 1;
}

for (int i = 1; i < 5; ++i) {
    int number{};
    std::cin >> number;

    if (number > maximum) {
        maximum = number;
    }
}
```

Initializing from the first real input handles an all-negative sequence. `maximum = 0` would incorrectly report a value that never appeared. If an empty sequence is possible, represent the “no value yet” state explicitly.

## Search flags and early exit

```cpp
bool found = false;

for (int i = 0; i < 10; ++i) {
    int number{};
    std::cin >> number;

    if (number == 7) {
        found = true;
    }
}
```

The flag remains true after the first match. Add `break` when the first match is sufficient and leaving unread input does not damage later parsing.

## break and continue traces

```cpp
for (int i = 1; i <= 10; ++i) {
    if (i == 5) break;
    std::cout << i << ' ';
}
// 1 2 3 4
```

`break` exits the nearest loop immediately. By contrast:

```cpp
for (int i = 1; i <= 10; ++i) {
    if (i == 5) continue;
    std::cout << i << ' ';
}
// 1 2 3 4 6 7 8 9 10
```

`continue` skips only the rest of the current iteration. In a `for` loop control goes to the update. In a `while` loop it returns directly to the condition, which can accidentally bypass a state update placed at the end of the body.

## Nested loops as rows and columns

```cpp
for (int row = 1; row <= 3; ++row) {
    for (int column = 1; column <= 4; ++column) {
        std::cout << "* ";
    }
    std::cout << '\n';
}
```

The inner loop completes four columns for each of three rows, so the print statement runs 12 times. The `while` form must reset its column inside every outer iteration:

```cpp
int row = 1;

while (row <= 3) {
    int column = 1;

    while (column <= 4) {
        std::cout << "* ";
        ++column;
    }

    std::cout << '\n';
    ++row;
}
```

If `column` is initialized only once outside the outer loop, it reaches 5 after the first row and later rows print no stars. Different loop types may be nested when each one models a different role.

## Check your understanding

<div class="lesson-quiz" role="list">
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">01</span><p>When is do-while preferable to while?</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> When the body must execute once before continuation is tested, such as showing a menu or reading a first attempt.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">02</span><p>What commonly causes an off-by-one bug?</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> Ambiguous inclusive bounds, starting value, or update position; write the intended first and last iterations before coding.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">03</span><p>How do you average values terminated by -1?</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> Accumulate and count values without including -1, then divide only after confirming count is nonzero.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">04</span><p>What is the complexity of two n-sized nested loops?</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> Usually O(n²), but actual bounds matter; shrinking or globally advancing inner work can change the result.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">05</span><p>What does repeated <code>i /= 2</code> print from 100, and why do fractions disappear?</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> It prints 100, 50, 25, 12, 6, 3, 1. Integer division discards the fractional part; the update after 1 produces 0 and stops the loop.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">06</span><p>Why does a product start at 1, and why should a maximum not always start at 0?</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> One is the multiplicative identity, whereas zero destroys a product. A maximum should start from real data because every input may be negative.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">07</span><p>How do break and continue differ, and what is continue's special risk in while?</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> break exits the nearest loop; continue skips one iteration's remaining body. In while, continue may bypass the state update and create an infinite loop.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">08</span><p>Why must column be reset inside each outer row iteration?</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> The first row advances column past its limit. Reinitializing inside the outer loop gives every row a fresh complete column traversal.</div></details>
</section>
</div>
