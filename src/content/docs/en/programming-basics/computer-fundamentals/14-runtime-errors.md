---
title: "Read data and handle a failed operation"
description: "Distinguish malformed text from unsuitable data and let the user correct a failure and retry."
sidebar:
  order: 22
prev: {"link":"/en/programming-basics/computer-fundamentals/13-text-processing/","label":"Clean, search, and split text"}
next: {"link":"/en/programming-basics/computer-fundamentals/17-local-server/","label":"Run your files at a stable local address"}
---

We learned to split words at commas. A saved list that contains commas and quotation marks needs an agreed format separating values from list boundaries. We will read one such format and handle failures without losing the last valid result.

## Observe one failure before validating a list

JSON is an agreed text format. A list needs opening and closing brackets, such as `[]`. `JSON.parse` attempts to read that format. `try` surrounds the attempt; `catch` receives a failure, named `error`. Save as `one-error.html`.

```html
<!doctype html>
<html lang="en">
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Catch one failed read</title>
<button id="read">Read invalid JSON</button>
<p id="output"></p>
<script>
function readData() {
  try {
    const data = JSON.parse("[");
    document.querySelector("#output").textContent = "Read successfully";
  } catch (error) {
    document.querySelector("#output").textContent = "Incomplete data. Try again.";
  }
}
document.querySelector("#read").addEventListener("click", readData);
</script>
</html>
```

Click: an incomplete-data message appears, and success does not. Change `"["` to `"[]"`, save, and reload: reading succeeds. This checks syntax only; whether the value is a suitable list of names is the next question.

## Represent a list as text

**JSON**, short for **JavaScript Object Notation**, is a text format for storing and exchanging data. Its name comes from JavaScript, but many languages use it. We begin with one part of the format: a list of strings.

```json
["milk", "bread"]
```

Square brackets surround the list, commas separate elements, and strings use double quotation marks. `[]` is an empty list. `["milk",]` is invalid because a comma is not followed by an element. `JSON.parse` reads text and tries to turn it into a program value. **Parsing** means interpreting the text according to format rules, not executing it as code.

## When an operation fails

A missing bracket prevents `JSON.parse` from returning a list. It throws an **exception**, a failure signal that interrupts the ordinary sequence of instructions. Without handling, the button action may end with a developer-tools error instead of a helpful message.

`try` encloses operations that may fail. `catch` receives an error when one is thrown along that path. This is an explanatory fragment, not a complete file:

```js
try {
  const items = JSON.parse("[");
  console.log(items);
} catch (error) {
  console.warn(error.message);
}
```

The instruction after `JSON.parse` does not run here; execution transfers to `catch`. `error` holds failure details and `message` is its message text. `console.warn` writes a developer warning to the browser's **Console**, the message panel in developer tools, commonly opened with F12. We will put the user's message on the page itself.

## Successful parsing is only one check

`42`, `null`, and `[5]` are valid JSON texts but not acceptable lists of names for this program. **Validation** checks the parsed value's shape and contents against our requirements.

We allow at most 20 items, each a nonempty string no longer than 80 units as measured by `length`; see the [text lesson](/en/programming-basics/computer-fundamentals/13-text-processing/) for that length distinction. `Array.isArray` checks for an array, and `typeof item` asks for the element's type; strings produce `"string"`.

`throw new Error("...")` creates and throws a failure with our message. We use it when the data violates our rules so rejection follows one common path. Malformed JSON and a failed application rule differ, but both require the user to correct the input and retry.

## Complete example

Save this as `errors.html` or [open the example](/examples/first-program/errors.html). `textarea` creates a multiline field. `rows` and `cols` describe its visible size, not a maximum data size.

```html
<!doctype html>
<html lang="en">
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Handle invalid saved data</title>
<h1>Read a list</h1>
<p><label for="data">JSON list of text items</label><br><textarea id="data" rows="4" cols="25">["milk","bread"]</textarea></p>
<button id="read">Read</button>
<p id="status" role="status"></p>
<p id="output">No valid list yet.</p>
<script>
function readList() {
  const status = document.querySelector("#status");
  try {
    const items = JSON.parse(document.querySelector("#data").value);
    if (!Array.isArray(items) || items.length > 20) {
      throw new Error("Expected a list with at most 20 items.");
    }
    for (const item of items) {
      if (typeof item !== "string" || item.trim() === "" || item.length > 80) {
        throw new Error("Each item must be nonempty text of at most 80 units.");
      }
    }
    document.querySelector("#output").textContent = "Items: " + items.join(" / ");
    status.textContent = "Read " + items.length + " items.";
  } catch (error) {
    status.textContent = "Cannot read this list. Check its format and items, then try again.";
    console.warn(error.message);
  }
}
document.querySelector("#read").addEventListener("click", readList);
</script>
</html>
```

The initial value produces `Read 2 items.` and `Items: milk / bread`. Replace it with `[` and click Read: a rejection message appears while the last valid list remains. The message makes clear that the new read failed, so the old list is not mistaken for the new input's result.

## Fail, diagnose, and recover

| Text | Result |
|---|---|
| `["milk","bread"]` | Two valid items |
| `[` or `["milk",]` | Invalid syntax |
| `42` or `null` | Valid JSON, but not an array |
| `["milk",5]` or `[" "]` | An array containing a rejected item |
| `[]` | An accepted empty list |

**Exercise and solution:** start with a valid list, then try `["milk",5]`. Change 5 to the string `"5"` to pass this example's rules. This does not make the name a quantity; our contract merely requires strings. Actual product-name restrictions would need another explicit policy.

## Not every failure throws

Opening a nonexistent file programmatically may produce a file-reader error. Another interface may report an absent saved value with a marker such as `null`, without throwing. The next lesson demonstrates that distinction. Read the interface's behavior rather than assuming `catch` detects every failure.

Do not leave `catch` empty, display success after a failure, or discard good user data before validating its replacement. This `try/catch` cannot fix source syntax errors that prevent the JavaScript file itself from being parsed, such as an unmatched source-code bracket. Use developer tools to fix the source first.

Reference: [JSON parsing and syntax errors](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse).
