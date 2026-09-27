---
title: "Values, variables, and calculation"
description: "Turn the notebook problem into a program and change price and quantity without rewriting the calculation. First run the previous message program."
sidebar:
  order: 17
prev: {"link":"/en/programming-basics/computer-fundamentals/09-git-debugging/","label":"Read an error and test your result"}
next: {"link":"/en/programming-basics/computer-fundamentals/10-decisions-and-repetition/","label":"A simple decision and repeated steps"}
---

Turn the notebook problem into a program and change price and quantity without rewriting the calculation. First run the previous message program.

## Know where an error appears

The browser **Console** displays program messages and errors. Open developer tools with F12 or the browser menu, then select Console. An unknown variable can produce `ReferenceError`: a referenced name is unavailable. Read the name and line, fix the source, and reload. The earlier [debugging exercise](/en/programming-basics/computer-fundamentals/09-git-debugging/) demonstrates this.

## Why name a value?

A variable is a name associated with a value so instructions can reuse it. `let price = 10;` creates a variable named price containing the number 10. `let` is a JavaScript keyword, not part of the name. `=` assigns a value here; it does not ask whether two things are equal.

Example names use English letters without spaces. `price` and `Price` are different names. Choose names describing their meaning rather than letters you cannot explain.

## Calculate notebook cost

Save this complete program as `values.html` beside hello.html (Hypertext Markup Language, a language describing page structure):

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Notebook cost</title>
</head>
<body>
<script>
let price = 10;
let quantity = 3;
let total = price * quantity;
document.body.textContent = total;
</script>
</body>
</html>
```

Expect 30. The first two instructions set price and quantity; the third multiplies their values into total; the fourth displays it. total stores the result when that instruction executes, not a formula automatically updated if price later changes. Compare with the [working example](/examples/first-program/values.html).

## Number or text?

Unquoted 10 is a number. `"10"` is a string of characters. In JavaScript `"10" + "3"` produces `"103"` because + joins strings. Write unquoted numbers in these calculations. These values are written in the file to focus on calculation. After functions, practice [reading and validating user input](/en/programming-basics/computer-fundamentals/12-input-validation/), including empty fields and invalid numbers.

`+` adds, `-` subtracts, `*` multiplies, and `/` divides. Parentheses clarify grouping: `(2 + 3) * 4` is 20, while `2 + 3 * 4` is 14. Do not divide by zero in ordinary price exercises; that needs an explicit handling rule, not an accepted price result.

## Predict and test

Change quantity to 1, 0, and 4: expect 10, 0, and 40. Write each prediction before running. Insert `price = 20;` after calculating total but before displaying it: total stays 30 because calculation already happened. To show an updated total, change price before calculation or calculate total again afterward.

**Check yourself:** ReferenceError appears after typing `totla` in the display instruction. Why? You used an undeclared name; check spelling rather than randomly changing the numbers.
