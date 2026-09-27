---
title: "Functions, then lists: organize calculations and data"
description: "Functions, then lists: organize calculations and data"
sidebar:
  order: 19
prev: {"link":"/en/programming-basics/computer-fundamentals/10-decisions-and-repetition/","label":"A simple decision and repeated steps"}
next: {"link":"/en/programming-basics/computer-fundamentals/12-input-validation/","label":"Read and validate user input"}
---

We already repeated steps with a condition. Now calculate three discounted prices without writing the same calculation three times. A **list** groups the data; a **function** names the calculation.

## Start with one function and one number

A function is named instructions. `double` is our name; `number` names its input inside the function. `return` sends the result back to the call. Save this as `one-function.html`: expect 14. Replace 7 with 0 and predict the result before running.

```html
<!doctype html>
<html lang="en">
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>One function</title>
<pre id="output"></pre>
<script>
function double(number) {
  return number * 2;
}
document.querySelector("#output").textContent = double(7);
</script>
</html>
```

`double(7)` is the call: it supplies 7 and returns 14. Defining the function alone does not run it. Separate the questions: the function performs one calculation; a list later groups the values to repeat it on.

## One list instead of many names

A JavaScript **array** stores ordered values under one name. Here we call it a list: `const prices = [10, 20, 30];`. Square brackets enclose elements and commas separate them. This differs from `"10, 20, 30"`, which is one string value.

An **index** is an element position, starting at zero: `prices[0]` is10, `prices[1]` is20, and `prices[2]` is30. The element count, `prices.length`, is3. Position3 has no fourth element here; reading it produces `undefined`, meaning no defined value at that position. An empty list, `[]`, has length0.

## Name one calculation with a function

A **function** names a set of steps, accepts inputs when needed, and returns a result when we use `return`. Our discount recipe takes a price and percentage and returns the discounted price.

In `function discountedPrice(price, percent)`, `function` declares the function, `discountedPrice` is our chosen name, and `price` and `percent` are **parameters**, names for inputs. Calling `discountedPrice(20, 10)` supplies the **arguments**,20 and10. The calculation20×(1−10÷100) returns18.

`return` sends a value to the caller and ends that invocation. Defining a function does not execute it; calling it with parentheses does. **Scope** describes where a name is available; this function's parameter `price` does not become a global name throughout the page.

## Run the complete example

Create `lists.html` in your practice folder, paste this code, save it, and open it in a browser. See [creating your first working file](/en/programming-basics/computer-fundamentals/08-first-program/) if needed.

```html
<!doctype html>
<html lang="en">
<meta charset="utf-8">
<title>Lists and functions</title>
<pre id="output"></pre>
<script>
const prices = [10, 20, 30];

function discountedPrice(price, percent) {
  return price * (1 - percent / 100);
}

let total = 0;
for (const price of prices) {
  total = total + discountedPrice(price, 10);
}

document.querySelector("#output").textContent = total;
</script>
</html>
```

Expected output: **54**. Prices10,20,30 become9,18,27, which sum to54.

- `prices` stores the list. `const` prevents assigning a different list to that name; it does not make the array's elements immutable.
- `for (const price of prices)` visits the list's **values** in order, calling the function once per element.
- `total` starts at zero, then becomes9,27,54. It uses `let` because its value changes.
- `document.querySelector("#output")` finds the page element identified by `output`; `textContent` sets its displayed text, as in the first-program lesson.
- `<pre>` preserves text formatting; `<script>` contains JavaScript. The surrounding HTML defines the page and UTF-8 character encoding.

## State the contract and limits

A function's **contract** describes allowed inputs and the required output: here a nonnegative numeric price and a numeric percentage from0 through100. This teaching example uses valid constants; it does not implement input validation. User-supplied values must be checked for type and bounds before calculation.

JavaScript fractional calculations may round; fractions such as0.1 cannot be represented exactly in binary floating point. These values illustrate the idea; a real money system must specify currency units and rounding rules.

## Predict a change before running it

| Change | Expected result | Reason |
|---|---:|---|
| Replace the list with `[]` |0|No iteration changes the starting total|
| Replace it with `[20]` |18|One call|
| Pass percentage0 |60|No discount|
| Pass percentage100 |0|The entire price is discounted|
| Call with price−20 |Invalid input|The contract rejects it; this code does not check it|

**Worked exercise:** Add40 to the original list. Its discounted value is36, producing total90. Putting `total = 0` inside the loop resets earlier work and leaves only the last discounted value.

## Check your understanding

1. Why is the first index0 while the length is3? An index labels a position; length counts elements. A nonempty list's final index is length−1.
2. How do definition and invocation differ? Definition records steps; invocation runs them with specific values.
3. Does displaying a value replace `return`? No. Returning supplies another calculation; displaying produces visible output. Here we sum returned values, then display once.

You can now group related data and reuse one operation. Explain the result, vary the fixed values, then apply the same ideas to user-entered data.

## Use the result with real input

Next, [read and validate user input](/en/programming-basics/computer-fundamentals/12-input-validation/). We will call a function from a button and check the input contract before calculating.
