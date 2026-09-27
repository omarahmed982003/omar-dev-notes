---
title: "Clean, search, and split text"
description: "Process a name and a list of words while distinguishing text transformations, comparisons, and lists."
sidebar:
  order: 21
prev: {"link":"/en/programming-basics/computer-fundamentals/12-input-validation/","label":"Read and validate user input"}
next: {"link":"/en/programming-basics/computer-fundamentals/14-runtime-errors/","label":"Read data and handle a failed operation"}
---

Someone enters `"  Omar  "` as a name and `"code, web, , art"` as interests. We want to remove edge spaces, compare the name, and obtain a list without empty words. Reuse the [input and button](/en/programming-basics/computer-fundamentals/12-input-validation/) from the previous lesson; text operations are the new topic.

## One name before a list of tags

`trim` returns a copy without surrounding spaces. Save as `one-name.html`: the output becomes `Omar`, while the field retains its original text. Only the displayed result changed. Try `Omar Ali`: the middle space remains. Next add comparison, then splitting tags.

```html
<!doctype html>
<html lang="en">
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Clean one name</title>
<label>Name <input id="name" value="  Omar  "></label>
<button id="clean">Clean</button>
<p id="output"></p>
<script>
function cleanName() {
  const original = document.querySelector("#name").value;
  const cleaned = original.trim();
  document.querySelector("#output").textContent = cleaned;
}
document.querySelector("#clean").addEventListener("click", cleanName);
</script>
</html>
```

## One purpose per operation

A **string** is a sequence of units representing characters and symbols. A **method** is a function associated with a value, such as `name.trim()`: the dot selects an operation on `name`. These string methods return new values; they do not change the original string.

| Operation | Purpose | Example result |
|---|---|---|
| `"  Omar  ".trim()` | Remove leading and trailing whitespace | `"Omar"` |
| `"Omar".toLowerCase()` | Lowercase letters that have lowercase forms | `"omar"` |
| `"omar".includes("mar")` | Check whether a substring occurs | `true` |
| `"code,web".split(",")` | Separate text at commas | `["code", "web"]` |
| `["code", "web"].join(" / ")` | Combine list elements with a separator | `"code / web"` |

`true` and `false` are **Boolean** values: yes and no. `===` compares the complete text; `includes` checks for a part. `"omar2"` contains `"omar"` but is not equal to it.

## Complete example

Save this as `texts.html`, or [run the example](/examples/first-program/texts.html). Separate tags with the comma character `,`.

```html
<!doctype html>
<html lang="en">
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Work with text</title>
<h1>Names and tags</h1>
<p><label for="name">Name</label><br><input id="name" value="  Omar  "></p>
<p><label for="tags">Tags separated by commas</label><br><input id="tags" value="code, web, , art"></p>
<button id="process">Process text</button>
<p id="output" role="status"></p>
<script>
function processText() {
  const name = document.querySelector("#name").value.trim();
  const output = document.querySelector("#output");
  if (name === "") {
    output.textContent = "Enter a name.";
    return;
  }
  const normalized = name.toLowerCase();
  const parts = document.querySelector("#tags").value.split(",");
  const tags = [];
  for (const part of parts) {
    const cleaned = part.trim();
    if (cleaned !== "") {
      tags.push(cleaned);
    }
  }
  output.textContent = "Name: " + name
    + " | Same as omar: " + (normalized === "omar")
    + " | Contains mar: " + normalized.includes("mar")
    + " | Tags: " + tags.join(" / ");
}
document.querySelector("#process").addEventListener("click", processText);
</script>
</html>
```

Click Process text with the initial values:

```text
Name: Omar | Same as omar: true | Contains mar: true | Tags: code / web / art
```

## Follow each word

`split` returns a list. `for...of` visits each value, and `trim` cleans it. `!==` means “not strictly equal.” If a piece is not empty, `push` adds it to the end of the list.

| Piece after splitting | Cleaned piece | Add it? |
|---|---|---|
| `"code"` | `"code"` | Yes |
| `" web"` | `"web"` | Yes |
| `" "` | `""` | No |
| `" art"` | `"art"` | Yes |

`const tags = []` prevents assigning another list to the name, but permits adding elements to the same list. Finally, `join` creates display text. `+` combines strings, and parentheses ensure that the comparison is evaluated before its result is joined into the message.

## A comparison needs a policy

We display `Omar` with its entered capitalization after trimming, while comparing a separate `omar` version. This is **normalization** in the general sense of preparing a consistent form for a purpose. Here it means trimming and lowercasing English letters, not a complete solution for every writing system.

`trim` preserves the space inside `Omar Ali`. Arabic has no uppercase/lowercase distinction; `toLowerCase` does not equate Arabic letters such as `أ` and `ا`. Removing diacritics or replacing letters requires an explicit policy, because it can change meaning or confuse two names.

`text.length` counts JavaScript string units, not necessarily visible characters. Some symbols, including many emoji, occupy multiple units. Later exercise limits use this measured length; they are not a promise to count human-perceived characters.

## Test boundaries and solve an exercise

- A name made only of spaces produces the missing-name message.
- `OMAR` matches the comparison with `omar`, while the displayed name remains `OMAR`.
- Tags `code,,web,` produce only the nonempty items.
- Empty tags produce an empty list, so nothing follows `Tags:`.
- `<b>Omar</b>` is displayed as text, not interpreted as markup, because we use `textContent`.

**Exercise and solution:** use `;` instead of `,` as the tag separator. Change `split(",")` to `split(";")`, update the field description and sample to `code; web; art`, then test consecutive separators to verify that empty pieces are still ignored.

This scheme is insufficient for an arbitrary file format whose words may themselves contain commas. In our exercise, a comma is always a boundary. Defining the data format is part of designing the solution.
