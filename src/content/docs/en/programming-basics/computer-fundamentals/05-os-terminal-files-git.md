---
title: "Prepare your first program folder and editor"
description: "Prepare a known location for code and a clear way to open it. Existing Notepad and a browser are sufficient; the practical steps use Windows."
sidebar:
  order: 14
prev: {"link":"/en/programming-basics/computer-fundamentals/03-binary-languages-algorithms/","label":"From an idea to steps and a program"}
next: {"link":"/en/programming-basics/computer-fundamentals/08-first-program/","label":"Write, save, and run your first program"}
---

Prepare a known location for code and a clear way to open it. Existing Notepad and a browser are sufficient; the practical steps use Windows.

## Editor and runtime

An editor lets you write and save text; we use Notepad. A runtime executes instructions; a browser can execute JavaScript. Notepad saves the code, while the browser runs it. Specialized code editors provide highlighting and suggestions later, but are not required for this experiment.

HTML (Hypertext Markup Language, a language describing page structure) describes page content and structure; it is not the programming language doing our calculations. A small `.html` file will contain JavaScript instructions for the browser. The next lesson explains its parts before you change them.

## Create the workspace

1. Open Documents, then your existing `FirstSteps` folder.
2. Create a folder inside named `first-program`.
3. Open a new Notepad document and temporarily type `Ready`.
4. Use Save As inside `first-program` with filename `hello.html`. Choose All files so Notepad does not append `.txt`, and UTF-8 (Unicode Transformation Format with 8-bit units, encoding Unicode character numbers as bytes) encoding if offered.
5. Show extensions and confirm `hello.html`, not `hello.html.txt`. Open it in your browser: expect Ready.

UTF-8 stores text including Arabic and other scripts. Selecting it preserves characters when the file is read. This step checks location and format; Ready is not yet a calculation program.

## Edit and run again

Open the same file in Notepad, change Ready to `Ready 2`, and press Ctrl+S. In the browser reload with the button or Ctrl+R. Expect Ready 2. The browser cannot read an unsaved edit in Notepad: save, then reload.

If old text remains, check the Notepad filename and browser path. If unexpected source appears, check Open with and the extension. Two identically named files in different folders often cause confusion.

## What is a terminal?

A terminal is a window for typed commands instead of buttons. You will use one later with language tools. You do not need terminal commands now, or an author-specific folder such as `C:\my_docs`.

**Ready to continue:** Display Ready 2 after saving and reloading, then identify the file’s location. You are ready to put real instructions into that file.

UTF-8 maps characters to bytes; the [number and text example](/en/programming-basics/computer-fundamentals/02-binary-data-representation/) explains the distinction.
