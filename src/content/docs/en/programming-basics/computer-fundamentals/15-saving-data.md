---
title: "Save a list and open it again"
description: "Distinguish running program state from a saved browser copy and handle missing, corrupt, or unavailable storage."
sidebar:
  order: 24
prev: {"link":"/en/programming-basics/computer-fundamentals/17-local-server/","label":"Run your files at a stable local address"}
next: {"link":"/en/programming-basics/computer-fundamentals/16-shopping-project/","label":"Build and test a shopping list"}
---

Enter a shopping list, then reload the page: variables are initialized again. Saving an HTML file saves the program's **instructions**, not necessarily the data a user entered while it ran. We will save a copy of a list and restore it in a later run.

## Run your own copy

Follow [local server setup](/en/programming-basics/computer-fundamentals/17-local-server/), then open `http://127.0.0.1:8000/storage.html`. Keep the same address when reopening.

## Two different places for data

| Place | What happens on reopening? |
|---|---|
| A running variable such as `items` | It is initialized from the program again |
| `localStorage`, browser-provided local storage | We may retrieve the saved copy if it still exists and access is allowed |

`localStorage` stores **strings under keys**. A key is a name we choose, such as `foundations-list-v1`: think of a labeled drawer. `setItem` writes a string under that name; `getItem` reads it. Writing the same key replaces the previous value, which is why validation comes first.

`JSON.stringify` converts our string array to JSON text. It reverses the direction of `JSON.parse`, used in the [previous lesson](/en/programming-basics/computer-fundamentals/14-runtime-errors/). Neither conversion encrypts or password-protects the data.

## Use a consistent location

Start with the [working example](/examples/first-program/storage.html) on the site. Storage belongs to an **origin**: the scheme, hostname, and port. For example, `http://localhost:4321` differs from `http://localhost:8000`. Different browser profiles and operating-system users need not share a store.

If you copy the code into `storage.html`, serve it from a local HTTP server or use the published example. Storage behavior for directly opened `file://` URLs is not guaranteed across browsers. A successful local experiment is not a general rule. You can perform all field-based exercises using the site's example without installing new tools.

Private browsing, clearing site data, storage limits, and browser policies can remove data or prevent saving. This is local practice storage, not a backup or cross-device synchronization service. Do not put passwords in it.

## Complete program

Enter one item per line. Save writes a copy; Load saved list replaces the **current editor contents** with the last saved copy. There is no automatic saving.

```html
<!doctype html>
<html lang="en">
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Save and restore a list</title>
<h1>My saved list</h1>
<p><label for="items">One item per line (up to 20)</label><br><textarea id="items" rows="6" cols="25">milk
bread</textarea></p>
<button id="save">Save</button>
<button id="load">Load saved list</button>
<p id="status" role="status"></p>
<script>
const key = "foundations-list-v1";
const editor = document.querySelector("#items");
const status = document.querySelector("#status");

function validateItems(items) {
  if (!Array.isArray(items) || items.length > 20) {
    throw new Error("Expected a list with at most 20 items.");
  }
  for (const item of items) {
    if (typeof item !== "string" || item.trim() === "" || item.length > 80) {
      throw new Error("Invalid list item.");
    }
  }
}

function saveList() {
  try {
    const items = [];
    for (const line of editor.value.split("\n")) {
      const item = line.trim();
      if (item !== "") items.push(item);
    }
    validateItems(items);
    localStorage.setItem(key, JSON.stringify(items));
    status.textContent = "Saved " + items.length + " items on this browser.";
  } catch (error) {
    status.textContent = "Not saved. Keep your text; check item lengths, count, and browser storage permissions.";
    console.warn(error.message);
  }
}

function loadList() {
  try {
    const saved = localStorage.getItem(key);
    if (saved === null) {
      status.textContent = "No saved list yet. Your current text is unchanged.";
      return;
    }
    const items = JSON.parse(saved);
    validateItems(items);
    editor.value = items.join("\n");
    status.textContent = "Loaded " + items.length + " items.";
  } catch (error) {
    status.textContent = "Cannot load the saved list. Your current text is unchanged.";
    console.warn(error.message);
  }
}

document.querySelector("#save").addEventListener("click", saveList);
document.querySelector("#load").addEventListener("click", loadList);
</script>
</html>
```

## Trace each path

Save reads the text and splits at `"\n"`, the JavaScript string escape for a newline. It trims each line, ignores empty lines, and collects the rest. `validateItems` repeats the previous lesson's contract: at most 20 items, each a nonempty string of at most 80 length units.

Only after validation do we serialize and write. The Saved message follows a successful `setItem`. If writing fails, `catch` reports Not saved while preserving the editor rather than claiming persistence.

Load first checks whether `getItem` returns `null`, meaning that the key is absent. It reports that condition and returns. `null` is neither the string `"null"` nor the empty array `[]`. If text exists, we parse and validate it before replacing the editor using `join("\n")`.

## Demonstrate persistence

1. Save `milk` and `bread` on separate lines. Expect `Saved 2 items on this browser.`
2. Replace the editor with `tea` without saving, then click Load. The two saved items return: the stored copy predates your edit.
3. Close the tab, reopen the same address in the same browser profile, and click Load. The two items should return if storage was neither removed nor blocked.
4. Clear the editor, Save, then Load. This is a saved empty list, not a missing-key message.

**Exercise and solution:** enter 21 nonempty lines. Saving is rejected and your text remains. Remove a line and retry with 20. Do not change only the write-side bound; the same validator runs on reading too.

## When something fails

Do not clear the whole store as your first response to a failed load. Copy important text to a separate editor and inspect the Console message to distinguish access failure from invalid data. Bad stored data does not replace current editor contents. The preceding lesson lets you safely try malformed text in a separate field.

With two tabs writing the same key, the last save replaces the earlier value. This example does not coordinate concurrent users or synchronize devices. Keep a separate copy of a list you need: local storage has a limited, specific role.

Reference: [Local storage behavior and limits](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage).

## Try an independent data file

Browser storage differs from a JSON file on disk. After the preceding Node.js setup, create a **new practice folder** and save [data-file.mjs](/examples/first-program/data-file.mjs) there. The mjs extension selects JavaScript module execution in Node; use its built-in file library.

```js
import { readFileSync, writeFileSync } from 'node:fs';

const mode = process.argv[2];
const filename = 'practice-list.json';
try {
  if (mode === 'save') {
    const items = ['milk', 'bread'];
    writeFileSync(filename, JSON.stringify(items), { encoding: 'utf8', flag: 'wx' });
    console.log('Saved a new practice-list.json');
  } else if (mode === 'read') {
    const items = JSON.parse(readFileSync(filename, 'utf8'));
    if (!Array.isArray(items)) throw new Error('Expected a list');
    for (const item of items) {
      if (typeof item !== 'string') throw new Error('Expected text items');
    }
    console.log(items.join(' / '));
  } else {
    console.log('Use: node data-file.mjs save OR node data-file.mjs read');
  }
} catch (error) {
  if (error.code === 'ENOENT') console.log('No saved file. Run the save command first.');
  else if (error.code === 'EEXIST') console.log('File already exists. Read it or use a new practice folder.');
  else console.log('Cannot complete the operation. Check the file format and access.');
  process.exitCode = 1;
}
```

`import` selects library functions; `node:fs` is the built-in file library. `writeFileSync` writes and waits; `readFileSync` reads and waits before subsequent instructions. `process.argv[2]` is the first option after the script filename. `encoding: 'utf8'` selects text encoding; `flag: 'wx'` creates a new file and rejects overwriting an existing one.

In PowerShell in the new folder, run `node data-file.mjs read` first: expect No saved file and a nonzero exit status. Run `node data-file.mjs save`: a `practice-list.json` file appears. Close the terminal, reopen it in the same folder, and run read again: expect `milk / bread`. Data survived process termination; it is not the previous in-memory variable.

`error.code` identifies a failure: ENOENT means a required path is absent; EEXIST means the file already exists. `process.exitCode = 1` reports failure to the invoking tool. Do not claim success after failure.

**Practice:** edit JSON to `[` in Notepad, save, then read: expect a useful failure without deleting the file. Repair to `["tea"]`: reading prints tea. Saving again rejects the existing file by design. Your chosen language track develops file handling further.
