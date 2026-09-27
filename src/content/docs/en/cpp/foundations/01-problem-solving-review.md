---
title: "1. Problem solving, diagrams, and debugging"
sidebar:
  order: 1
description: "Before writing C++, stabilize the solution logic: define inputs and output, write the steps, model decisions, and dry-run the algorithm. The language implements the reasoning; it does not replace it."
tableOfContents: true
---

## Before you start

Read this lesson in three passes: understand the problem, follow the example, then try the final check yourself. The terms below are explained before they are used in detail.

### New terms in this lesson

- **Runtime:** The period when a program is actually running.
- **Loop:** A structure that repeats instructions according to a condition.


## Problem analysis before code

Before writing C++, stabilize the solution logic: define inputs and output, write the steps, model decisions, and dry-run the algorithm. The language implements the reasoning; it does not replace it.

## Inputs, outputs, constraints, and tests

- Use pseudocode for sequence and a flowchart for visible branches.
- Design the valid path, then add boundaries and invalid inputs.
- Syntax errors stop the build; logic errors produce wrong answers even when the program runs.
- A trace table records variable values after each step and exposes divergence.

## Example: safe division

```text
READ a, b
IF b = 0 THEN
  PRINT "Division is undefined"
ELSE
  PRINT a / b
END IF
```

## Syntax, runtime, and logic errors

- Do not test only easy values; include zero, boundaries, and negatives.
- A diagram must reflect real execution paths, not act as decoration.

<div class="lesson-diagram" role="img" aria-label="From problem analysis to a verifiable result">
<p class="lesson-diagram-title">From problem analysis to a verifiable result</p>
<div class="diagram-flow diagram-pipeline">
<div class="diagram-node start"><span>Start</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node input"><span>Read input</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node decision"><span>Validate</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>Run algorithm</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node output"><span>Report and test</span></div>
</div>
</div>

## Decision trees and business rules

A decision tree places a question at each node, a branch for each answer, and a complete outcome at each leaf. It exposes missing paths and contradictory rules before they become nested `if` statements. Test exact boundaries such as age 21 or subtotal 500.

## Flowcharts and pseudocode

Flowcharts use terminators, process boxes, decision diamonds, input/output shapes, connectors, and directed lines. Pseudocode expresses the same logic in structured, language-independent text. A calculator flowchart should branch by operator, validate a zero divisor on the division branch, and rejoin successful paths at one result output.

## Tests and logic-error tracing

Prepare normal, boundary, and invalid cases before code. Reproduce a wrong result, record state after each step, find the first divergence, correct one cause, and rerun the failing case plus its neighbors. In a running-total bug, the first incorrect iteration is more informative than later totals that inherited the error.

## Problem contract and algorithm correctness

Write the input domain, required output, constraints, and invalid cases before choosing syntax. An algorithm is correct only when it terminates and produces the required result for every valid input, not only for the sample. A trace table records the state after each step and exposes missing updates or incorrect branches.

## Flowchart symbols and equivalent test classes

Use an oval for start/end, a parallelogram for input/output, a rectangle for processing, and a diamond for a decision. Label both decision exits. Group similar inputs into equivalence classes, then test boundaries on both sides: for an allowed score `0..100`, test `-1, 0, 1, 99, 100, 101`.

## Logic-error investigation

When code runs but returns a wrong answer, reproduce the failure with the smallest input, write the expected trace, compare it with the actual state, and locate the first divergence. Keep that case as a regression test after fixing the defect.

## Pseudocode, flowcharts, and trace tables

Pseudocode records the order of decisions without committing to C++ syntax. A flowchart makes branching and repetition visible. A trace table then verifies the algorithm by listing each important variable after every step. These tools answer different questions: pseudocode explains the procedure, the flowchart exposes paths, and the trace table tests state changes.

For safe division, write the contract first:

1. Read a numerator and denominator.
2. If the denominator is zero, produce an error and stop that path.
3. Otherwise divide and display the result.

| numerator | denominator | selected path | result |
|---:|---:|---|---:|
| 8 | 2 | valid division | 4 |
| 8 | 0 | rejection | — |
| -9 | 3 | valid division | -3 |

## Test cases before implementation

Partition inputs into equivalent classes instead of choosing only comfortable samples: a normal positive value, zero, a negative value, a minimum or maximum boundary, and malformed input when the program reads text. A single representative from each class is useful, but values immediately below, at, and above every boundary are essential for discovering off-by-one errors.

When investigating a logic error, preserve the failing input, state the expected result, record the actual result, and trace only the variables that influence the wrong decision. Change one hypothesis at a time; random edits destroy evidence.


## Apply the problem-solving method on practice platforms

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
<div class="diagram-flow diagram-grid">
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
<div class="quiz-question-row"><span class="quiz-number">01</span><p>Why must a denominator be checked before division?</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> After division the invalid operation has already happened. Early validation prevents it and defines a clear rejection path.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">02</span><p>A program runs but mishandles equal maximum values. What kind of defect is this?</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> A logic error in comparisons or branch order; successful compilation and execution do not prove algorithm correctness.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">03</span><p>When is a flowchart better than pseudocode?</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> When branches and returns need visual communication; pseudocode is better for detailed sequential logic close to code.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">04</span><p>How would you prove a largest-of-three algorithm covers its domain?</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> Test each position as largest, ties, negatives, and type boundaries, with expected results written first.</div></details>
</section>
</div>

## Connect the ideas

After drawing the solution, state a loop invariant and a termination argument instead of relying on examples. Convert the division example into a complete C++ program with zero, negative, and boundary tests, then compare its trace with the prediction.

### Try it yourself

Introduce a compiling logic defect and prove a boundary test catches it.
