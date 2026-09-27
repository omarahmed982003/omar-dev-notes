---
title: "Algorithms, pseudocode, and decision trees"
description: "Pseudocode and decision trees model thinking before code: pseudocode emphasizes sequence, while a tree emphasizes branching decision paths."
tableOfContents: true
prev: {"link":"/en/programming-basics/math-problem-solving/04-computational-thinking/","label":"Computational thinking and requirements analysis"}
next: {"link":"/en/programming-basics/math-problem-solving/06-flowcharts-loops-debugging/","label":"Flowcharts, loops, and debugging"}
sidebar:
  order: 6
---

Use this section after [values, decisions, and loops](/en/programming-basics/computer-fundamentals/10-decisions-and-repetition/). Review arithmetic when needed; graphs, complexity, and dynamic programming are later extensions, not first-program prerequisites.


## Overview

Pseudocode and decision trees model thinking before code: pseudocode emphasizes sequence, while a tree emphasizes branching decision paths.

## Core concepts

- A sound algorithm has defined inputs, unambiguous steps, termination, and correct outputs.
- Use domain names instead of x and y in business problems.
- Pseudocode is language-independent but must remain precise.
- Decision trees work well when answers lead to several terminal outcomes.
- Validate invalid input first, then apply business rules from general to specific.

## Worked example

To find the largest of three values, initialize the result with the first, compare and update with the second, then repeat for the third. This avoids enumerating every ordering.

## Corrections and common mistakes

- Large trees become difficult to maintain; group related rules and name conditions.
- Every possible path must end with a defined outcome.

<div class="lesson-diagram" role="img" aria-label="A simplified decision flow that validates before applying business rules">
<p class="lesson-diagram-title">A simplified decision flow that validates before applying business rules</p>
<div class="diagram-flow diagram-decision">
<div class="diagram-node input"><span>Read input</span></div>
<span class="diagram-arrow" data-label="validate" aria-hidden="true">→</span>
<div class="diagram-node decision"><span>Is input valid?</span></div>
<span class="diagram-arrow" data-label="yes" aria-hidden="true">→</span>
<div class="diagram-node decision"><span>Does the rule pass?</span></div>
<span class="diagram-arrow" data-label="yes" aria-hidden="true">→</span>
<div class="diagram-node process"><span>Perform action</span></div>
<span class="diagram-arrow" data-label="done" aria-hidden="true">→</span>
<div class="diagram-node output"><span>Report result</span></div>
</div>
<div class="diagram-branches">
<p class="diagram-branch-label">The two “no” paths that must not disappear from the algorithm</p>
<div class="diagram-node danger"><span>Invalid input ← correction message</span></div>
<div class="diagram-node output"><span>Rule fails ← rejection or alternative</span></div>
</div>
</div>

## Write and trace the algorithm

**Pseudocode** describes precise steps without requiring a runnable programming language. This example accepts three valid numbers and returns the greatest:

```text
read a, b, c
largest = a
if b > largest:
    largest = b
if c > largest:
    largest = c
print largest
```

Here read obtains input, print displays output, if tests a condition, and = assigns a value. For a=−7, b=−2, c=−5, largest starts at−7, changes to−2, then remains there because−5 is smaller. Starting at zero would incorrectly return a value absent from the inputs.

A **precondition** states what must hold before starting: valid numbers. A **postcondition** states the required result: one input value, with no input greater than it. For a list, the **loop invariant** is that largest is the greatest value examined so far. **Termination** follows because each iteration examines another element of a finite list. Empty input needs an explicit result, such as "no value", instead of reading a nonexistent first element.




## The same maximum example as a tree

Assume valid numbers a, b, and c. Each yes/no answer chooses a branch; every leaf returns a value:

```text
a >= b?
├─ Yes: a >= c?
│        ├─ Yes → a
│        └─ No  → c
└─ No:  b >= c?
         ├─ Yes → b
         └─ No  → c
```

`>=` means greater than or equal. For −7, −2, −5 take No then Yes: b is −2. Equal values produce the same maximum whichever equal value is selected. Compare with updating `largest`: repeated updates extend to a list more easily.
## Check your understanding

<div class="lesson-quiz" role="list">
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">01</span><p>Why is “initialize with the first value, then update the maximum” better than enumerating three-value orderings?</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> It needs only two comparisons and scales to any number of values; enumerating permutations grows quickly and is error-prone.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">02</span><p>When does a decision tree become a poor representation?</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> When branches and shared rules explode and repeat. A decision table, named predicates, or a state machine may then be clearer.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">03</span><p>Which properties should a sound algorithm establish?</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> Defined inputs and outputs, unambiguous steps, finite termination, and correctness for every case inside the requirements.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">04</span><p>Order checks for a discount based on valid price, membership, and total.</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> Validate price first, then determine eligibility, then apply membership and threshold rules. Invalid data must never reach discount calculation.</div></details>
</section>
</div>

## Greedy versus dynamic programming: choose with evidence

The worked coin example follows the [algorithm comparison lesson](/en/programming-basics/08-problem-solving-algorithms/), after data structures and growth rates have been introduced. First finish describing and tracing an ordinary algorithm here.



## When a decision depends on earlier state

Each **leaf** of a decision tree ends a path. For a discount requiring membership and a price of at least100, test members at99 and100, a nonmember at100, and a rejected negative price. A **state machine** models states and allowed transitions, such as new → paid → shipped; this contract disallows new → shipped.