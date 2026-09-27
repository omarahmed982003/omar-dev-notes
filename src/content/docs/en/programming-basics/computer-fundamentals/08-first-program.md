---
title: "Write, save, and run your first program"
description: "Replace Ready in your file with instructions displaying a message. First complete the previous lesson’s edit/save/reload exercise."
sidebar:
  order: 15
prev: {"link":"/en/programming-basics/computer-fundamentals/05-os-terminal-files-git/","label":"Prepare your first program folder and editor"}
next: {"link":"/en/programming-basics/computer-fundamentals/09-git-debugging/","label":"Read an error and test your result"}
---

Replace Ready in your file with instructions displaying a message. First complete the previous lesson’s edit/save/reload exercise.

## The line you will change

In the full file below, focus on the line inside `<script>`:

```js
document.body.textContent = "Hello!";
```

Replace **only the quoted text** with `"My first change"`. The remaining file is the page wrapper. Save and reload; if unchanged, check that you saved the open file. Keep the quotation marks: they delimit the text.

## Understand the container

The browser reads HTML (Hypertext Markup Language, a language describing page structure) to organize a page. A tag is a marker between `<` and `>`, such as `<body>` starting visible content and `</body>` ending it. The head contains settings such as encoding and tab title. `<!doctype html>` selects modern HTML, and `lang="en"` describes the example message’s language. JavaScript instructions go inside `<script>`.

`document.body.textContent` refers to the text displayed in the page body. `=` assigns a value; the quoted text is our message. The semicolon `;` ends this example’s instruction. You need not memorize the whole template; distinguish settings from the instruction doing the work.

## Complete program

Open `hello.html` in Notepad, replace the entire file contents with the following text, and save:

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>First program</title>
</head>
<body>
<script>
document.body.textContent = "Hello!";
</script>
</body>
</html>
```

Open the same file in the browser or reload it. The page displays `Hello!` and the tab title is First program. Notepad shows the source; the browser shows the result. To compare your typing, [open the working example](/examples/first-program/hello.html), then return to your local copy: viewing a supplied example does not prove you saved your file.

## Change and predict

Change `"Hello!"` to `"Hello Omar!"`, save, and reload. Then replace the value with `2 + 3` without quotes: expect 5. With quotes, `"2 + 3"` displays those characters because you requested text rather than arithmetic.

Only change the right-hand side of the display instruction’s `=`; keep the template. You can use Arabic text with UTF-8 (Unicode Transformation Format with 8-bit units, encoding Unicode character numbers as bytes) saving and set lang to ar for Arabic page content.

## If the result differs

Source shown as text: check the final `.html` extension and browser application. Old text: save, verify the path, and reload. Blank page: check quotes and the capitalization of `textContent`. A later result-review lesson demonstrates reading an error message.

**Exercise and solution:** Display 12−8. Replace the display line with `document.body.textContent = 12 - 8;` and expect 4. Quoting the expression displays 12 - 8 instead: a difference in value meaning, not a broken computer.
