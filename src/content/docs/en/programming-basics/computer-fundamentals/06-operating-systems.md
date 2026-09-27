---
title: "The operating system, programs, and files"
description: "Understand the role of the operating system you have already used, without memorizing its internal architecture before writing a program."
sidebar:
  order: 11
prev: {"link":"/en/programming-basics/computer-fundamentals/05-ram-memory-buffers/","label":"Memory and saving: where did your work go?"}
next: {"link":"/en/programming-basics/computer-fundamentals/07-internet-browser-basics/","label":"The internet, browser, and address"}
---

Understand the role of the operating system you have already used, without memorizing its internal architecture before writing a program.

## Two messages need different responses

| Saving result | Meaning | First check |
|---|---|---|
| Not enough space | The destination cannot fit new data | Available space and file size; choose a suitable destination |
| Access denied | Your account cannot write there | Try the practice folder you own |

Deleting files does not grant permission; administrator access does not add space. **Exercise:** a small file saves in your folder but not a system folder. Investigate permission first, then confirm from the actual message.

## Who coordinates the device?

An operating system coordinates applications, files, and hardware. Windows, macOS, and Linux distributions are examples of computer operating-system families. Notepad is an application running on the system, not the operating system itself.

When you open a file, the system locates it and helps the application read it. When you press a key, the system and application deliver input to the appropriate window. A graphical interface with buttons and menus is one way to interact with the system.

## Users and permissions

A user account identifies who works on the computer. Permissions determine allowed actions such as reading or changing a file. “Access denied” does not necessarily mean an incorrectly typed filename; your account may lack permission to modify it. Use your own document folder rather than treating administrator mode as a universal fix.

## Two applications and a saved file

Open Notepad and Calculator together: the system manages both applications. Saving text inside `FirstSteps` asks the system to write to your chosen location. A storage-full error means saving did not succeed merely because you pressed Save; read the message and inspect the file.

Restarting starts the system and applications again according to settings; it does not automatically repair incorrect program instructions. Save work first and use the system’s shutdown/restart controls instead of disconnecting power.

**Worked exercise:** A file exists, but the application will not let you change it. Check whether it is opened read-only and whether its folder permits your account to write. Do not delete it as an experiment. Existence and permission to change are different properties.
