---
title: "Sets, relations, and function inputs"
description: "Sets, relations, and function inputs"
sidebar:
  order: 4
prev: {"link":"/en/programming-basics/math-problem-solving/02-variables-equations-logic/","label":"Variables, equations, and Boolean logic"}
next: {"link":"/en/programming-basics/math-problem-solving/04-computational-thinking/","label":"Computational thinking and requirements analysis"}
---

Start with squaring, allowing only inputs 1 and 2. Outputs are 1 and 4. The **domain** is allowed inputs {1,2}. If outputs are declared to be nonnegative integers, that is the **codomain**. The **range** actually produced is {1,4}. Allowed versus achieved results differ.

**Try:** Add input 3: the range gains 9, but still does not contain every nonnegative integer. Next use sets to understand relations and “every” versus “exists.”


## Sets, functions, truth tables, and predicates

A set contains unique elements. Union combines membership, intersection keeps shared elements, and difference removes one set from another. A function maps every element in its domain to one result; its range contains the results actually produced.

Truth tables enumerate Boolean inputs. De Morgan's laws transform `!(A && B)` into `!A || !B` and `!(A || B)` into `!A && !B`. A predicate is a Boolean statement about a value. Universal and existential conditions correspond to operations such as “all elements” and “at least one element.”

## Truth tables and concrete relations

A **Boolean** is true or false. Many languages use &&, ||, and ! for AND, OR, and NOT; actual syntax is language-specific.

| A | B | A AND B | A OR B | A XOR B | A implies B |
|---|---|---|---|---|---|
| false | false | false | false | false | true |
| false | true | false | true | true | true |
| true | false | false | true | true | false |
| true | true | true | true | false | true |

Implication fails only for a true premise and false conclusion; it does not prove causation. **De Morgan's laws** state NOT(A AND B)=(NOT A OR NOT B), and NOT(A OR B)=(NOT A AND NOT B). Verify all four rows.

For A={1,2}, B={2,3}, union is {1,2,3}, intersection {2}, and difference A−B={1}. {1} is a subset of A. A relation is **reflexive** if each element relates to itself, **symmetric** if aRb implies bRa, and **transitive** if aRb and bRc imply aRc. Equality satisfies all three.

For f(x)=x×x on {1,2}, the **domain** is {1,2}. If the **codomain** is nonnegative integers, the actual **range** is {1,4}. Each input has exactly one output.

A **predicate** is a value-dependent condition, such as x is even. A **quantifier** specifies every element or at least one. In {2,3}, an even element exists, but not every element is even: changing the quantifier changes the claim.
