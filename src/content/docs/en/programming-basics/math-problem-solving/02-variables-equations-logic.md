---
title: "Variables, equations, and Boolean logic"
description: "A variable names a value that may change, while an equation describes a relationship. Boolean logic turns problem rules into decisions a program can evaluate."
tableOfContents: true
sidebar:
  order: 3
prev: {"link":"/en/programming-basics/math-problem-solving/07-division-and-precision/","label":"Division, remainders, and numerical precision"}
next: {"link":"/en/programming-basics/math-problem-solving/08-sets-relations/","label":"Sets, relations, and function inputs"}
---

<span class="foundations-reading-scope" aria-hidden="true"></span>

A ticket holder is blocked. Should they enter? This is a decision, not an amount. A **Boolean** has two values: `true` or `false`.

## Turn the sentence into a condition

Entry requires “has a ticket **and is not** blocked.” **AND** requires both conditions; **NOT** reverses the blocked condition.

| Ticket? | Blocked? | Allowed? |
|---|---|---|
| No | No | No |
| No | Yes | No |
| Yes | No | Yes |
| Yes | Yes | No |

This **truth table** covers every Boolean input combination. The last row is denied because a ticket does not override a block.

**OR** requires at least one true condition. **XOR** requires different values: with both true, OR is true but XOR false. XOR is less common in everyday business conditions.

## A variable is not an equation

A **variable** names a value during execution. An **expression** produces a value, such as `price * quantity`. **Assignment** stores a new value: `x = x + 1` reads the old value, adds one, and stores the result.

Starting at 4 gives 5. Assignment order can change program state and results. As a mathematical equation, `x=x+1` has no solution over ordinary numbers; it is not an update instruction.

A **comparison** asks about a relationship and returns a Boolean, such as whether age is at least 18. Assignment and equality testing have language-specific symbols.

## Optional complete PHP experiment

Run `php logic.php` using PHP 8+ in a training folder. If variables and lists are new, read the [PHP course](/en/php/) first or use the truth table now and return later.

`$` starts a PHP variable name. `&&` means AND, `!` means NOT, `foreach` visits pairs, `? :` selects text, and `echo` prints. No files are written.

~~~php
<?php
declare(strict_types=1);

foreach ([[false, false], [false, true], [true, false], [true, true]] as [$hasTicket, $isBlocked]) {
    $allowed = $hasTicket && !$isBlocked;
    echo $allowed ? "allow\n" : "deny\n";
}
~~~

Expected output:

~~~text
deny
deny
allow
deny
~~~

Each iteration matches one truth-table row. Predict which rows change before changing a condition.

## Parentheses express the business rule

“An employee or someone with enough income, provided they are not blocked” becomes:

~~~text
(isEmployee OR hasEnoughIncome) AND NOT isBlocked
~~~

Parentheses group the alternative eligibility conditions before applying the block to both. A loan rule might instead require suitable age AND enough income AND no risky debt. Name simple conditions before combining them.

An **if** chooses execution when a condition succeeds. Independent `if` statements can execute multiple branches; an `if / else-if` chain chooses the first matching branch. Use the former for simultaneous outcomes and the latter for one alternative.

## Optional depth: negation and implication

**De Morgan's laws** state that NOT `A AND B` equals `NOT A OR NOT B`, and NOT `A OR B` equals `NOT A AND NOT B`. Failing to satisfy both age and income means at least one failed.

**Logical implication**, `A → B`, fails only when A is true and B false. “A paid order must have a receipt” is violated by a paid order without a receipt. This is a logical constraint, not a claim of physical causation. When A is false, this rule alone does not specify whether B exists.

## Independent practice

1. Apply the eligibility rule to a blocked employee, then an unblocked nonemployee with sufficient income.
2. Negate “employee or sufficient income” using De Morgan.
3. Which row disproves a gate that lets blocked ticket holders enter? Suggest a faulty condition.
4. To display every applicable warning, use independent if statements or an else-if chain?

<details>
<summary>Answers and reasoning</summary>

1. Denied, then allowed; the block applies to both alternatives.
2. `NOT (isEmployee OR hasEnoughIncome)` equals `NOT isEmployee AND NOT hasEnoughIncome`.
3. Ticket=true, blocked=true must deny. `hasTicket OR !isBlocked` incorrectly allows it.
4. Independent if statements; else-if selects only the first match.

</details>

## Summary

Express the policy clearly, name its conditions, and test combinations and boundaries before coding. Continue to [sets, relations, and function inputs](/en/programming-basics/math-problem-solving/08-sets-relations/).
