---
title: "Read and validate user input"
description: "Calculate a cost from user-entered fields and distinguish text, numbers, and allowed values."
sidebar:
  order: 20
prev: {"link":"/en/programming-basics/computer-fundamentals/11-functions-and-lists/","label":"Functions, then lists: organize calculations and data"}
next: {"link":"/en/programming-basics/computer-fundamentals/13-text-processing/","label":"Clean, search, and split text"}
---

The notebook example stored price and quantity in its source code. A user should enter them on the page. We will add two fields and a button, then validate before calculating. First complete [functions and lists](/en/programming-basics/computer-fundamentals/11-functions-and-lists/): a function packages steps under a name.

## Try one field first

`input` is a field; `value` reads its text. `trim()` removes surrounding whitespace. A `button` triggers the function on the `click` event through `addEventListener`. `textContent` displays the response in a `p` paragraph.

`===` checks value and type; `""` is empty text. `Number` converts text; `Number.isFinite` checks for a finite number; `!` negates that answer. `return` ends the current call on failure. In the larger example, `||` means “or”: one true condition is enough.

Save as `one-input.html`. Try `12.5`, spaces, then `abc`: expect a number, a missing-value message, then rejection. Price limits come next.

```html
<!doctype html>
<html lang="en">
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>One input</title>
<label>Price <input id="price"></label>
<button id="read">Read</button>
<p id="output"></p>
<script>
function readPrice() {
  const text = document.querySelector("#price").value.trim();
  const output = document.querySelector("#output");
  if (text === "") {
    output.textContent = "Enter a price.";
    return;
  }
  const price = Number(text);
  if (!Number.isFinite(price)) {
    output.textContent = "Enter a number.";
    return;
  }
  output.textContent = price;
}
document.querySelector("#read").addEventListener("click", readPrice);
</script>
</html>
```

## From a button press to a calculation

An **input** is a field the user can edit. Its `value` property supplies **text**, even when the text looks numeric. An **event** is something that happens on a page, such as a click. An **event listener** connects an event to a function that should run when it occurs.

We connect the `click` event to `calculate`. Pass the function name without `()`: the browser calls it later. Writing `calculate()` at registration would call it immediately during page setup.

The path is **entered text → empty check → number conversion → type and range checks → calculation and display**. Each check answers a different question. A successful conversion does not establish that a quantity is allowed.

## Run the complete example

Save this as `input.html` in your practice folder and open it in your browser, or [run the example](/examples/first-program/input.html).

```html
<!doctype html>
<html lang="en">
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Read and validate input</title>
<h1>Notebook cost</h1>
<p><label for="price">Price (0 to 1000000)</label><br><input id="price" inputmode="decimal"></p>
<p><label for="quantity">Quantity (1 to 1000)</label><br><input id="quantity" inputmode="numeric"></p>
<button id="calculate">Calculate</button>
<p id="output" role="status"></p>
<script>
const output = document.querySelector("#output");

function calculate() {
  const priceText = document.querySelector("#price").value.trim();
  const quantityText = document.querySelector("#quantity").value.trim();
  if (priceText === "" || quantityText === "") {
    output.textContent = "Enter both values.";
    return;
  }
  const price = Number(priceText);
  const quantity = Number(quantityText);
  if (!Number.isFinite(price) || !Number.isFinite(quantity)) {
    output.textContent = "Enter numbers, such as 12.5 and 3.";
    return;
  }
  if (price < 0 || price > 1000000 || !Number.isInteger(quantity) || quantity < 1 || quantity > 1000) {
    output.textContent = "Price: 0 to 1000000. Whole quantity: 1 to 1000.";
    return;
  }
  output.textContent = "Total: " + price * quantity;
}

document.querySelector("#calculate").addEventListener("click", calculate);
</script>
</html>
```

Enter `12.5` and `3`, then click Calculate: the output is `Total: 37.5`. Editing a field alone does not recalculate. Another click reads the new values.

## Understand the page and the connection

- `label` names a field; `for="price"` connects it to the input with `id="price"`. An `id` identifies one particular element.
- `inputmode` suggests a phone keyboard. It neither prevents invalid values nor replaces validation.
- `document.querySelector("#price")` locates the element by its identifier; `.value` reads the text. `trim()` returns a copy without leading or trailing whitespace. The next lesson explores it further.
- `button` creates a button. `addEventListener("click", calculate)` connects its click to the function. A `p` element is a paragraph; `textContent` displays our message as text.
- `role="status"` helps screen readers announce changed messages. The `viewport` setting makes the page fit a phone's screen width.

## Why this order matters

`===` compares both value and type; `priceText === ""` asks whether the text is empty. `||` means “or”: either empty field is enough. A bare `return` ends this function call, so the following calculation does not run for that click.

`Number("12.5")` converts text to a number. `Number("abc")` produces `NaN`, **Not a Number**, a special value indicating that conversion did not produce a number. However, `Number("")` produces zero. Check emptiness **before** conversion: a deliberately free item differs from an omitted price.

`Number.isFinite` checks for a finite number, excluding `NaN` and `Infinity`. `!` reverses a Boolean result, meaning “not” in this condition. `Number.isInteger` checks for no fractional part. `<` and `>` compare values against bounds.

Our policy permits prices from zero to one million and whole quantities from 1 to 1000. These are exercise choices, not language rules. If a project permits quantity zero, change the rule, message, and tests together.

## Test cases that challenge assumptions

| Price | Quantity | Expected result and reason |
|---|---|---|
| `12.5` | `3` | `37.5` |
| `0` | `2` | `0`; a free item is allowed |
| Spaces only | `2` | Request both values instead of treating absence as zero |
| `abc` or `12abc` | `2` | Request numbers; do not accept a numeric prefix of invalid text |
| `10` | `2.5`, `-1`, or `0` | Quantity policy message |
| `Infinity` | `1` | Reject the non-finite value |

The example accepts forms understood by `Number`, including `1e2`, meaning 100. Use digits `0–9` and a decimal point during practice. A comma in `12,5` or digits such as `١٢` require additional handling here. Restricting the written format is a separate policy from checking the resulting number.

**Exercise and solution:** change the maximum quantity to 10. Replace `quantity > 1000` with `quantity > 10` and update the label and message. Quantity 10 passes; 11 fails. Changing only a message does not change the program's behavior.

Fractional arithmetic may round some results. This exercise teaches input validation, not a currency-accounting policy. A web application with a server must validate there too: users can change browser code.

## Check your understanding

- Why accept `"0"` as a price but reject `""`? The first is a selected value; the second is missing input.
- Why replace the output on rejection? An old successful result must not appear to belong to the new invalid input.
- When is quantity read? At the click, because the read occurs inside the callback function.

Reference: [Number conversion](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number).
