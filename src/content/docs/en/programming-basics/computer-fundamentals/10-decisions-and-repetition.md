---
title: "A simple decision and repeated steps"
description: "Make the program choose a result from a value, then repeat an operation. First understand variables and run values.html."
sidebar:
  order: 18
prev: {"link":"/en/programming-basics/computer-fundamentals/09-values-and-calculations/","label":"Values, variables, and calculation"}
next: {"link":"/en/programming-basics/computer-fundamentals/11-functions-and-lists/","label":"Functions, then lists: organize calculations and data"}
---

Make the program choose a result from a value, then repeat an operation. First understand variables and run values.html (Hypertext Markup Language, a language describing page structure).

## One decision without repetition

Use the first-program wrapper and replace its `<script>` instructions with this fragment. `if` selects the true branch; `else` selects the alternative:

```js
const age = 17;
if (age >= 18) {
  document.body.textContent = "Adult";
} else {
  document.body.textContent = "Under 18";
}
```

`>=` means greater than or equal. Predict 17, 18, and 19: Under 18, then Adult twice. This assumes valid age data; the input lesson adds validation. Explain why 18 takes the first branch before learning repetition.

## Choose a branch

A condition is a true-or-false question. `quantity < 0` asks whether quantity is below zero. `if` executes its first part when true; `else` executes the other part. Braces `{ }` group the instructions belonging to each part.

Save as `conditions.html`. Here quantity is an integer written in the code, not text supplied by a user:

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Quantity check</title>
</head>
<body>
<script>
let price = 10;
let quantity = 3;
if (quantity < 0) {
  document.body.textContent = "Invalid quantity";
} else {
  document.body.textContent = price * quantity;
}
</script>
</body>
</html>
```

Quantity 3 displays 30, zero displays 0, and -1 displays Invalid quantity. This choice does not execute both branches. The example permits zero as the cost of buying nothing; if a task requires at least one, change the check to `quantity < 1`. [Working example](/examples/first-program/conditions.html).

## Repeat instead of copying

A loop repeats instructions according to a rule. Sum 1, 2, and 3 without writing three separate addition instructions. Save this as `loops.html`:

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Sum three numbers</title>
</head>
<body>
<script>
let total = 0;
for (let number = 1; number <= 3; number = number + 1) {
  total = total + number;
}
document.body.textContent = total;
</script>
</body>
</html>
```

The `for` has initialization `number = 1`, a check `number <= 3` before each iteration, and an increment `number = number + 1` afterward. `<=` means less than or equal to. The body adds number to total and stores the new sum.

| Iteration | number | total before | total after |
|---|---:|---:|---:|
| First | 1 | 0 | 1 |
| Second | 2 | 1 | 3 |
| Third | 3 | 3 | 6 |

After incrementing to 4, the check fails and the loop ends; the page displays 6. Compare with the [working example](/examples/first-program/loops.html). Do not remove the increment as an experiment: a nonterminating loop may freeze the page. Close a stuck practice tab and inspect its code before reopening.

**Worked exercise:** Sum 1 through 4. Change the limit from 3 to 4 and expect 10. If 6 remains, check saving and which file you opened. With limit 4 but `<` instead of `<=`, you still sum only 1,2,3: a logical difference in the stopping condition.
