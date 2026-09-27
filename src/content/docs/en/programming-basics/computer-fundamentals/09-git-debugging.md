---
title: "Read an error and test your result"
description: "Read an error and test your result"
sidebar:
  order: 16
prev: {"link":"/en/programming-basics/computer-fundamentals/08-first-program/","label":"Write, save, and run your first program"}
next: {"link":"/en/programming-basics/computer-fundamentals/09-values-and-calculations/","label":"Values, variables, and calculation"}
---

Meet three ideas that support learning: diagnosing errors, checking results, and keeping change history. You do not need to install Git or memorize its commands yet.

## An error gives useful information

Debugging means finding and fixing the cause of unexpected behavior. Start with expected versus actual. Change one thing at a time so you know which change mattered.

For `2 + 3`, expect 5. Writing `2 - 3` runs and displays -1. This is a logic error: valid instructions that do not meet the requirement. Restore addition rather than reinstalling the browser.

## Read one error message

Copy `hello.html` to `error-practice.html`. In that copy only, remove the final quote from `"Hello!"`, save, and reload. A blank page may result because JavaScript syntax is invalid: a syntax error means the writing rules were broken.

In Edge or Chrome on Windows, open the browser menu, then More tools → Developer tools, and select Console. This panel displays messages and errors; do not type or paste commands into it. Read the error pointing to your file and line; exact wording varies by browser. Restore the quote, save, and reload: Hello! returns. Close the panel afterward.

When requesting help, include filename, line, error text, expected result, and what you tried. Inspect shared content for personal information. Keep the working original for comparison with your practice copy.

## A test asks a question with an expected answer

In `hello.html`, change the message to `Test 1`, save, and reload. Compare the displayed text with that expectation, then restore and retest the first message. Numeric boundaries come later.

One passing example does not prove every case. After a fix, repeat the input revealing the error so it is not forgotten during later edits. Automated tests and their categories come after functions and program organization.

## Why Git exists

Git keeps a history of project-file changes so you can inspect changes and return to earlier versions when needed. Saving in an editor updates the current file; Git can retain selected points in its history. GitHub is a service that can host Git projects; tool and service are different.

Git does not prove code correctness or replace an independent backup. Keep passwords out of project history. Knowing its purpose is enough now; learn commands, branches, and merging when managing changes in a project.

**Check yourself:** Before the fix, 2−3 gave -1; afterward 2+3 gave 5. Record the wrong operation, the change back to +, and the observed 5. A filename such as “very-final-2” does not explain history as well as an organized change record.
