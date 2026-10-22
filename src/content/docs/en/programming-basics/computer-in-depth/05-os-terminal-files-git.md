---
title: "Read and write files from a terminal"
description: "Read and write files from a terminal"
sidebar:
  order: 10
prev: {"link":"/en/programming-basics/computer-in-depth/13-buffers-and-durability/","label":"Moving data and making writes durable"}
next: {"link":"/en/programming-basics/computer-in-depth/17-terminal-environment/","label":"Command channels, permissions, and environment"}
---

<span class="foundations-reading-scope" aria-hidden="true"></span>

## Reach the same file in two ways

“File not found” can mean a wrong starting location rather than a missing file. We will distinguish names and paths, then read one new practice file through relative and absolute paths.

The experiment uses PowerShell on Windows, a particular command language rather than PHP. Do not copy its syntax into Bash as if they were identical.

## Terminal versus shell

A **terminal** displays a text session. A **shell** interprets commands; PowerShell, Bash, zsh, and cmd have different rules.

A **command** requests an operation. **Arguments** supply its values; a named **parameter**, such as `-Name`, identifies a value's purpose.

A shell may execute an internal command or start a **process**, a running program. **Escaping** protects a symbol from special interpretation; **quoting** groups text between quotation marks. Their rules depend on the shell.

## Files, directories, and paths

A **file** contains data with **metadata**, such as size, timestamps, and ownership. A **directory** organizes file and directory names.

A **filesystem** manages the association between names and stored data. A **path** identifies how to reach an item, not merely its name.

The **working directory** is the starting point for relative paths. An **absolute path** identifies a location from a drive root, such as `C:\Users\Learner\note.txt`.

A **relative path**, such as `.\note.txt`, depends on that starting point. `.` means the current directory and `..` the parent. Changing the working directory changes relative interpretation, not file contents.

An **extension**, such as .txt, is part of the name. A **format** describes the data organization; renaming does not convert an image into text.

## Identity and permissions before administration

A **user** is an identity; a **group** collects identities that can share access. **Permissions** control operations such as reading, writing, and execution.

Unix commonly separates owner, group, and others. Windows uses an **ACL**, an access control list associating identities with permissions. Permission to execute does not prove safety.

**Administrator and root** have broad privileges. Do not elevate everything to hide access errors; inspect identity, path, and required permission first.

A **handle or file descriptor** is a reference supplied by the OS after opening a resource. A name locates it; the program then uses its open reference. Details differ between systems.

## A practice run that refuses an existing folder

Open PowerShell in a location you may write. These commands create `terminal practice` inside the current directory. If it exists, stop and choose a new name instead of reusing it.

Before running: `Get-Location` displays the location; `Test-Path` checks existence; `if` tests a condition; `throw` stops execution. `New-Item` creates a directory, and `Set-Location` changes location.

`Set-Content` writes and can replace a file, so it follows successful creation of a fresh directory. `Get-Content` reads; `Resolve-Path` obtains an absolute path. `-LiteralPath` prevents wildcard interpretation.

```powershell
Get-Location
if (Test-Path -LiteralPath '.\terminal practice') { throw 'Choose a new practice folder name' }
New-Item -ItemType Directory -Name 'terminal practice' -ErrorAction Stop
Set-Location -LiteralPath '.\terminal practice'
Set-Content -LiteralPath '.\note.txt' -Value 'Hello' -ErrorAction Stop
Get-ChildItem
Get-Content -LiteralPath '.\note.txt'
$practiceFile = (Resolve-Path -LiteralPath '.\note.txt').Path
Set-Location ..
Get-Content -LiteralPath $practiceFile
Get-Content -LiteralPath '.\terminal practice\note.txt'
```

`Get-ChildItem` lists items; `-ErrorAction Stop` stops on failure. `$practiceFile` retains the resolved path, and `.Path` selects its text property.

Expect note.txt and three Hello readings. After returning to the parent, `.\note.txt` no longer identifies the same location, but the absolute path and longer relative path still identify the file.

If access is denied or the name exists, stop and inspect the message. Do not elevate privileges or delete a directory to force the example.

## Names are not copies

A same-filesystem rename can update metadata quickly. Moving across devices may require copying and deleting, with different costs and guarantees.

A **symbolic link** refers to a path. It is neither a data copy nor a backup; changing or removing its target affects access through it.

## Before touching many files

A **wildcard**, such as `*`, may select many files. **Recursive** operations include child directories; a **bulk operation** affects multiple items.

Inspect the location and names first. Read `Get-Help` or a program's supported `--help`. Tab completion helps type names but does not validate the intended target.

`$HOME` identifies the user's home directory, which is not necessarily the current working directory. Never use the entire home directory as a recursive move or deletion target.

Do not place secrets in command history. A **script** executes saved commands and must handle errors and external-program exit codes, covered next.

## Check your reasoning

1. Why does the absolute path still work after changing the working directory?
2. Does renaming .jpg to .txt change its bytes?
3. Is a symbolic link a backup?
4. What should you do before repeating the folder experiment?

<details>
<summary>Review after attempting</summary>

1. Absolute interpretation does not depend on the current starting directory.
2. No. Names and data formats differ.
3. No. It refers to a path.
4. Choose a new nonexisting practice-folder name rather than replacing older files.

</details>

## Summary

Establish identity, location, and path before executing commands. Next: [program environment and output channels](/en/programming-basics/computer-in-depth/17-terminal-environment/).

## Reference

[Microsoft: PowerShell quoting rules](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_quoting_rules)
