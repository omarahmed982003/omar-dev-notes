---
title: "From an idea to steps and a program"
description: "Describe a small solution with precise instructions before writing it in a programming language. Only addition, subtraction, and multiplication of small numbers are needed."
sidebar:
  order: 13
prev: false
next: {"link":"/en/programming-basics/computer-fundamentals/05-os-terminal-files-git/","label":"Prepare your first program folder and editor"}
---

Describe a small solution with precise instructions before writing it in a programming language. Only addition, subtraction, and multiplication of small numbers are needed.

## Write your steps before the answer

Accept an age from 0 to 120 and report adult at 18 or above. Write validation and decision steps; trace 17, 18, and 121.

<details><summary>Compare the order</summary>

Read age, reject values outside 0–120, then check age at least 18. Results: not adult, adult, rejected. Making the decision before validation treats bad data as a plausible result.

</details>

## What is a programming language?

A programming language provides rules for instructions that a runtime can execute. Code is the text written using those rules. JavaScript, C++, and PHP (a programming language commonly used for server-side web processing) are different languages; the same idea can use different syntax.

Computers represent data internally with binary values: a bit is 0 or 1 and a byte contains eight bits, as in the data-representation lesson. You do not need to convert every number to binary before programming. The number 5 and the text “5” can look alike but behave differently; you will test that soon.

## An algorithm describes the solution

An algorithm is a precise sequence of steps producing a result. Three notebooks priced at 10 each require a price and quantity, multiplication, and displaying 30. “Calculate the price properly” does not specify an operation.

```text
price = 10
quantity = 3
total = price * quantity
show total
```

This is pseudocode describing reasoning, not a runnable file. `*` means multiplication, and a name such as price refers to a value. Here the inputs are chosen values; not every input must come from the keyboard.

## Check on paper

| Price | Quantity | Expected |
|---:|---:|---:|
| 10 | 3 | 30 |
| 10 | 1 | 10 |
| 10 | 0 | 0 |

Zero is reasonable for the cost of zero notebooks. A shop requiring at least one would need a rejection rule instead: correctness depends on the requirement. A negative quantity is not a valid purchase here; -30 is not a valid invoice.

## Solve before choosing tools

Identify the result, name the data, write the operation, and predict output. Change one thing at a time. This problem does not require choosing a search algorithm or analyzing growth rates.

**Worked exercise:** You have 50 and pay 30. The operation is 50−30 and the change is 20. Addition gives 80: a reasoning error even if written with valid syntax. After the next lesson you will run real instructions instead of a paper description.
