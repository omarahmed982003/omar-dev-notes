---
title: "Build and test a shopping list"
description: "Combine input, strings, lists, functions, validation, persistence, and failure handling in a small program."
sidebar:
  order: 25
prev: {"link":"/en/programming-basics/computer-fundamentals/15-saving-data/","label":"Save a list and open it again"}
next: {"link":"/en/programming-basics/computer-fundamentals/04-tech-fields-ai-engineering-mindset/","label":"Review your project and choose the next step"}
---

Now combine the ideas. Add an item name and quantity, display the list, remove its last item, and save or restore a copy. Complete the [saving lesson](/en/programming-basics/computer-fundamentals/15-saving-data/) first: the data-processing tools have already been practiced separately.

## Build four runnable stages

Each link is a complete file. Save it under its filename in the practice folder and open it through the local server. Read the purpose, verify the expected result, then continue.

| Stage | Experiment | Success evidence |
|---|---|---|
| [Add only](/examples/first-program/shopping-stage-1.html) | Use `milk` and `3`; this stage assumes valid input | `3 x milk`; then try bad input to see why validation is needed |
| [Add with validation](/examples/first-program/shopping-stage-2.html) | Try spaces, `2.5`, and `abc` before valid input | Rejection without changing the list |
| [Add and remove](/examples/first-program/shopping-stage-3.html) | Add two entries and remove through empty | `pop()` removes the last value; rendering follows the data |
| [Save and restore](/examples/first-program/shopping.html) | Save, reopen, and press Load | The saved version returns; adding is separate from saving |

Start with stage one: read fields, `push` data, render. Stage two adds `if` before mutation; three adds a removal button and function; four adds `try/catch` around storage operations from the preceding lesson. The full source below is the stage-four reference, not the starting point.

## Run your own copy

Follow [local server setup](/en/programming-basics/computer-fundamentals/17-local-server/), then open `http://127.0.0.1:8000/shopping.html`. Keep the same address when reopening.

## Agree on behavior first

- A trimmed name must be nonempty and at most 60 `length` units; some visible symbols occupy multiple units.
- Quantity must be a whole number from 1 to 100; allow at most 20 list items.
- Duplicate names are allowed; this example does not combine them automatically.
- Adding and removing affect the on-screen list. Save writes a copy; Load replaces the current list with that copy. Save edits first if you want to keep them.
- Failed saving or loading produces a message while preserving the current list.

Each row is a string such as `"3 x milk"`, stored in an array of strings. This small representation matches the previous lessons. Independently editing quantities or summing them would call for separate name and number fields in the data; do not guess them by splitting display text.

## Divide the responsibilities

| Function | Practical input | Responsibility |
|---|---|---|
| `addItem` | The name and quantity fields | Validate and add a display string |
| `renderList` | The current in-memory array | Redraw its items |
| `removeLastItem` | The array | Remove its last item if present |
| `saveList` | The array | Store a copy in this browser |
| `loadList` | The stored copy | Read and validate before replacement |

The add path is **two fields → validation → in-memory array → display**. Saving is a separate path from the array to storage. Keeping these separate prevents claiming a save merely because an item appeared.

## The new part: individual display rows

`ol` is an HTML ordered list; each `li` is one item. `document.createElement("li")` creates a row and `list.append(row)` inserts it. Assign `textContent` so user text remains data even if it resembles HTML markup.

Rendering clears the old display with `list.textContent = ""` and then visits the data in `items`; it does not empty `items`. `pop()` removes the array's last item. We check the length first to produce a helpful empty-list message.

The one-line `style` rule sets `overflow-wrap: anywhere` for list items, allowing a long unbroken name to wrap inside the phone screen. It changes presentation only.

## Run the project

Open the [shopping list project](/examples/first-program/shopping.html). Use the same origin and browser profile when restoring saved data. You can save the complete code as `shopping.html` and serve it through a local HTTP server. Direct `file://` opening is not a reliable storage test.

```html
<!doctype html>
<html lang="en">
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Shopping list project</title>
<style>li { overflow-wrap: anywhere; }</style>
<h1>Shopping list</h1>
<p><label for="name">Item name</label><br><input id="name"></p>
<p><label for="quantity">Whole quantity (1 to 100)</label><br><input id="quantity" inputmode="numeric" value="1"></p>
<button id="add">Add item</button>
<button id="remove">Remove last item</button>
<button id="save">Save</button>
<button id="load">Load saved list</button>
<ol id="list"></ol>
<p id="status" role="status"></p>
<script>
const key = "foundations-shopping-v1";
const status = document.querySelector("#status");
let items = [];

function renderList() {
  const list = document.querySelector("#list");
  list.textContent = "";
  for (const item of items) {
    const row = document.createElement("li");
    row.textContent = item;
    list.append(row);
  }
}

function addItem() {
  const name = document.querySelector("#name").value.trim();
  const quantityText = document.querySelector("#quantity").value.trim();
  const quantity = Number(quantityText);
  if (name === "" || name.length > 60 || quantityText === "" || !Number.isInteger(quantity) || quantity < 1 || quantity > 100) {
    status.textContent = "Enter a short name and a whole quantity from 1 to 100.";
    return;
  }
  if (items.length >= 20) {
    status.textContent = "The list is full: at most 20 items.";
    return;
  }
  items.push(quantity + " x " + name);
  renderList();
  status.textContent = "Added. Save to keep this change.";
}

function removeLastItem() {
  if (items.length === 0) {
    status.textContent = "The list is already empty.";
    return;
  }
  items.pop();
  renderList();
  status.textContent = "Removed. Save to keep this change.";
}

function saveList() {
  try {
    localStorage.setItem(key, JSON.stringify(items));
    status.textContent = "Saved " + items.length + " items on this browser.";
  } catch (error) {
    status.textContent = "Not saved. Your list is still on screen; keep a separate copy before closing.";
    console.warn(error.message);
  }
}

function loadList() {
  try {
    const saved = localStorage.getItem(key);
    if (saved === null) {
      status.textContent = "No saved list yet. Current list unchanged.";
      return;
    }
    const restored = JSON.parse(saved);
    if (!Array.isArray(restored) || restored.length > 20) {
      throw new Error("Invalid saved list.");
    }
    for (const item of restored) {
      if (typeof item !== "string" || item.trim() === "" || item.length > 80) {
        throw new Error("Invalid saved item.");
      }
    }
    items = restored;
    renderList();
    status.textContent = "Loaded " + items.length + " items.";
  } catch (error) {
    status.textContent = "Cannot load the saved list. Current list unchanged.";
    console.warn(error.message);
  }
}

document.querySelector("#add").addEventListener("click", addItem);
document.querySelector("#remove").addEventListener("click", removeLastItem);
document.querySelector("#save").addEventListener("click", saveList);
document.querySelector("#load").addEventListener("click", loadList);
renderList();
</script>
</html>
```

Enter `milk` and `3` to display `3 x milk`. Add `bread` and `2` to obtain two rows. Save, close the tab, reopen the same address, and Load: both rows return. Each page opening starts with an empty in-memory list; restoration is an explicit user action.

## Build it in stages

1. Prepare the fields and display, then add one item. Verify that the display is produced from `items`.
2. Place validation before `push`. Try an empty name or quantity `2.5`: the array must remain unchanged.
3. Remove the last item, then try removing from an empty list. Redraw after actual data changes.
4. Connect the save and load operations practiced in the preceding lesson. Display Saved only after writing succeeds.

Use the full code as a reference for each stage. Try writing and understanding a stage before copying the next one.

## Acceptance tests

An **acceptance test** demonstrates that an agreed requirement is met. Write the expected outcome before running each case:

| Action | Expected outcome |
|---|---|
| Add `milk` with `3`, then `bread` with `2` | Two rows in order |
| Spaces-only name, or quantity `abc`, `2.5`, or zero | Rejection; list unchanged |
| Add after reaching 20 items | Rejection; no twenty-first row |
| Remove last item from a two-row list | Only the first remains |
| Remove from an empty list | Helpful message without an error |
| Save, reopen the page, then Load | Restore the saved copy |
| Edit without saving, then Load | Return to the last saved copy, as the button promises |
| Save an empty list, then Load | Accept the empty list |
| Use name `<b>milk</b>` | Literal text, not formatting |

If browser storage is blocked, Save reports Not saved and keeps the visible list. Being visible does not establish persistence. Corrupt or unsuitable saved data is rejected before assigning to `items`. Try malformed data in the [JSON exercise](/examples/first-program/errors.html), and test storage restrictions in a practice browser profile rather than changing your main account settings.

## A small modification with a worked solution

**Task:** reduce the maximum list size to five. Change the add check to `items.length >= 5` and the restored-data check to `restored.length > 5`; update the message. Test four, five, and six items, including a previously saved six-item list. Changing only the add rule leaves the load path able to exceed the new policy.

The project meets its stated requirements. It does not synchronize devices, manage accounts, or coordinate simultaneous tabs. Your next step is to explain it and implement the idea in a chosen language, rather than adding every feature at once.

## When quantity must change independently

An **object** groups named values. `name` is a text property; `quantity` is a numeric property. `:` separates a property name and value; `.` accesses or changes it. Save this independent example as `records.html`:

```html
<!doctype html>
<html lang="en">
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Keep name and quantity separate</title>
<pre id="output"></pre>
<script>
const product = { name: "milk", quantity: 3 };
product.quantity = product.quantity + 1;
document.querySelector("#output").textContent = product.name + ": " + product.quantity;
</script>
</html>
```

Expect `milk: 4`. Display text is derived from data, not the storage format for quantity. **Practice:** Add `price: 10` and display `product.price * product.quantity`: expect 40. Put objects in a list and serialize with `JSON.stringify`. Converting the shopping project also requires new load validation; old string-list data does not automatically match the new shape.
