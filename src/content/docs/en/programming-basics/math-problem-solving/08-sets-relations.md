---
title: "Sets, relations, and function inputs"
description: "Sets, relations, and function inputs"
sidebar:
  order: 4
prev: {"link":"/en/programming-basics/math-problem-solving/02-variables-equations-logic/","label":"Variables, equations, and Boolean logic"}
next: {"link":"/en/programming-basics/math-problem-solving/04-computational-thinking/","label":"Computational thinking and requirements analysis"}
---

<span class="foundations-reading-scope" aria-hidden="true"></span>

Two exams have lists of passing students. Who passed both, or at least one? A **set** contains distinct elements; repetition and written order do not define a different set.

## Apply operations to one example

Let `A={1,2,3}` pass exam one and `B={3,4}` pass exam two. These are student identifiers, not grades.

| Question | Operation | Result |
|---|---|---|
| At least one exam? | Union: elements in either set | {1, 2, 3, 4} |
| Both exams? | Intersection: shared elements | {3} |
| Only exam one? | Difference: A elements absent from B | {1, 2} |

`A−B` need not equal `B−A`; the latter is {4}. A **subset** contains only elements of the larger set. {1, 3} is a subset of A; {1, 4} is not.

The union count is `3+2−1=4`; subtract the overlap counted twice. See [counting and probability](/en/programming-basics/math-problem-solving/11-counting-probability/) for further applications.

## A function: permitted versus actually produced

A mathematical **function** associates every permitted input with exactly one output. Let `f(x)=x×x` and allow only 1 and 2.

| Name | Meaning here |
|---|---|
| Domain | Permitted inputs: {1, 2} |
| Codomain | Declared target set: nonnegative integers |
| Range | Actual outputs: {1, 4} |

The codomain specifies allowed outputs, not a promise to produce all of them. Adding input 3 adds output 9; it does not produce every nonnegative integer.

Program-interface design asks similar questions: which inputs are valid, and is the outcome specified for every valid input? A program function reading a changing file or clock also needs those external inputs described; do not assume mathematical purity.

## “Every” is not “there exists”

A **predicate** is a condition on a value, such as “x is even.” A **quantifier** says whether it must hold for every element or for at least one.

For {2, 3}, an even element exists, but not every element is even. “Every order is valid” differs from “some order is valid.” Libraries may call such checks `all_of` and `any_of`; these are illustrative names, not assumed PHP functions.

## Optional depth: relations

A **relation** is a set of pairs connecting elements. If both (1, 2) and (1, 3) belong, it is not a function assigning one output to input 1.

- **Reflexive:**  every element relates to itself.
- **Symmetric:**  a relating to b implies b relating to a.
- **Transitive:**  a relating to b and b relating to c implies a relating to c.

Equality has all three properties. “Less than” is transitive, but neither reflexive nor symmetric. Test actual pairs rather than memorizing names.

## Optional logic reminder

A Boolean is true or false. AND requires both; OR requires at least one; XOR requires different values. Implication `A→B` fails only when `A=true,B=false`; it does not prove causation.

De Morgan transforms a negated AND into OR of the negations, and conversely. Full truth tables, assignment, and branch examples belong to [the logic lesson](/en/programming-basics/math-problem-solving/02-variables-equations-logic/), rather than a second glossary here.

## Independent practice

1. For `A={1,2}` and `B={2,3}`, find union, intersection, and differences in both directions.
2. Squaring has domain {−2, 2} and nonnegative-integer codomain. What is its range? Can different inputs share one output?
3. Does {3, 5} contain an even element? Is every element in {2, 4} even?
4. Give a pair showing that “less than” is not symmetric.

<details>
<summary>Answers and reasoning</summary>

1. Union{1, 2, 3}, intersection{2}, A−B={1}, B−A={3}.
2. Range{4}. Distinct inputs may share an output; one input cannot have two outputs in this defined function.
3. No; yes.
4. One is less than two, but two is not less than one.

</details>

## Summary

Sets contain distinct elements, functions assign one output to every valid input, and “every” differs from “some.” Continue to [requirements analysis](/en/programming-basics/math-problem-solving/04-computational-thinking/).
