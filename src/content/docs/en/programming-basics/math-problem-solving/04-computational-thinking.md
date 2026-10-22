---
title: "Computational thinking and requirements analysis"
description: "Computational thinking is a disciplined way to turn an unclear problem into components, rules, and steps that can be implemented and tested."
tableOfContents: true
sidebar:
  order: 5
prev: {"link":"/en/programming-basics/math-problem-solving/08-sets-relations/","label":"Sets, relations, and function inputs"}
next: {"link":"/en/programming-basics/math-problem-solving/05-algorithms-pseudocode-decision-trees/","label":"Algorithms, pseudocode, and decision trees"}
---

<span class="foundations-reading-scope" aria-hidden="true"></span>

“Build an ATM” does not specify a program. Is zero valid? Are there fees or denomination restrictions? **Requirements analysis** turns these questions into rules and testable outcomes.

This example needs [Boolean conditions](/en/programming-basics/math-problem-solving/02-variables-equations-logic/), not code or a real banking system.

## Specify a small contract

A **contract** states accepted inputs and required results. Assume balance 200, no fees, and a positive integer amount divisible by 50 that does not exceed the balance.

Acceptance deducts the amount once; rejection leaves the balance unchanged. This training model does not establish identity verification, fund reservation, or safe concurrent withdrawals.

| Input | Expected result | Rule tested |
|---|---|---|
| 150 | Accept, balance 50 | Ordinary case |
| 200 | Accept, balance 0 | Upper boundary |
| 250 | Reject, balance 200 | Over balance |
| 0 or−50 | Reject, balance 200 | Must be positive |
| 75 | Reject, balance 200 | Must be divisible by 50 |
| Nonnumeric text | Reject before arithmetic | Input type |

**Constraints** limit valid input and behavior. A **boundary case** is at or near an important limit. Decide the expected outcome before execution; program output is not its own proof.

## Separate checking from action

Split the task into reading, validation, deduction, and display. This is **decomposition**: smaller responsibilities that can be understood separately.

Reject before deduction. Deducting 75 before checking denominations changes system state before establishing validity.

<figure class="teaching-figure">
  <img src="/diagrams/foundations/math/atm-decision-en.svg" alt="A valid withdrawal deducts from balance; a rejected withdrawal leaves it unchanged." loading="lazy" />
  <figcaption>For the rule above, 150 follows Yes and leaves 50. A request for 250 follows No and leaves 200. No fees are included.</figcaption>
</figure>

## Abstraction and reusable patterns

**Abstraction** retains details that affect the question and defers irrelevant ones. Machine color does not change whether 150 is affordable; balance and fees do. Abstraction must not hide a detail that changes the answer.

**Pattern recognition** notices a reusable structure: read, validate, act, display. The structure may help with shopping quantities or bookings without copying withdrawal rules into them.

**Algorithm design** orders precise steps, decisions, and repetitions to implement the contract. A name does not substitute for the steps.

## Change tests when requirements change

Add a fixed fee 10. The financial condition becomes `amount + 10 <= balance`. Request 200 now fails because 210 exceeds 200; request 150 leaves 40.

“Accept quantity” is also vague. If the rule is an integer 1 through 100, separate reading text, rejecting empty input, careful conversion, boundary checking, and insertion. Among `0,1,100,101,2.5` only 1 and 100 pass.

“Fast” needs a measurable standard: perhaps 95% of searches complete under 500 milliseconds **under specified load and hardware**. This is a test criterion, not a universal performance promise.

## Optional depth: decomposition is not system correctness

A real ATM can involve card and PIN verification, operation selection, balance and daily-limit checks, cash dispensing, ledger updates, and receipts. Listing these units does not establish safe ordering for every failure.

A small example permits a complete state trace; larger systems need explicit failure, recovery, and concurrency treatment. Cost comparison belongs to [its own lesson](/en/programming-basics/08-problem-solving-algorithms/).

## Independent practice

1. Add daily limit 150 to the original fee-free contract. Predict requests 150, 200, 75 with balance 200.
2. Define a quantity rule rejecting empty and fractional inputs and accepting 1 through 100. Write five cases before coding.
3. How does splitting tasks differ from deferring machine color?

<details>
<summary>Answers and reasoning</summary>

1. Accept 150, leaving 50. Reject 200 for the daily limit and 75 for denomination; rejections leave 200.
2. Require a representation of an integer in the inclusive range. Cases: empty reject, 0 reject, 1 accept, 100 accept, 2.5 reject; add 101 outside the upper boundary.
3. Splitting responsibilities is decomposition; deferring irrelevant color is abstraction.

</details>

## Summary

Clear requirements and independent expected outcomes come before code. Continue to [algorithms and tracing](/en/programming-basics/math-problem-solving/05-algorithms-pseudocode-decision-trees/).
