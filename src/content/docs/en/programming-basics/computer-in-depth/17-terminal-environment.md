---
title: "Command channels, permissions, and environment"
description: "Command channels, permissions, and environment"
sidebar:
  order: 13
prev: {"link":"/en/programming-basics/computer-in-depth/05-os-terminal-files-git/","label":"Read and write files from a terminal"}
next: {"link":"/en/programming-basics/computer-in-depth/09-git-debugging/","label":"Record file history and merge changes"}
---

Begin after creating and reading a file in the terminal. Separate normal output from diagnostics, then examine inherited settings and permission boundaries.


## stdin, stdout, stderr, and exit status

Programs read standard input, emit normal data on standard output, diagnostics on standard error, and return a status code. Zero conventionally means success. Pipes connect one process's stdout to another's stdin; backpressure can make a fast producer wait for a slower consumer.

Keep progress messages away from machine-readable stdout, quote paths with spaces, inspect help before bulk operations, and never expose secrets in command history or process arguments.

## Files, directories, and metadata

A file is bytes plus metadata such as size, timestamps, owner, and permissions. A directory maps names to entries. A same-filesystem rename may update metadata quickly, while a cross-device move may copy and delete. A symbolic link refers to another path rather than copying its data.

## Users, groups, and permissions

Permissions determine read, write, and execution access. Unix commonly expresses owner/group/others bits; Windows uses detailed ACLs (Access Control Lists, rules granting operations on resources to identities). Services should not run as root or administrator unnecessarily, and secret files should not be globally readable.

## Environment variables

Environment variables are key-value configuration inherited by child processes. They are not a secret vault and may appear in process inspection, crash reports, or logs. Validate required values at startup and use a production secret manager.


## Try the channels after defining them

PowerShell cmdlet pipes normally pass **objects**, values with properties, rather than always plain text:

```powershell
Get-ChildItem -File | Select-Object Name, Length
```

Select-Object chooses the Name and Length properties. External programs expose standard input, output, error, and an exit status. This Windows-only example deliberately returns status 3:

```powershell
cmd /c 'echo result & echo diagnostic 1>&2 & exit /b 3' 1> output.txt 2> error.txt
$LASTEXITCODE
```

cmd writes result to standard output and diagnostic to standard error. 1> and 2> save them separately. Expect LASTEXITCODE=3; that is intentional. cmd, PowerShell, and Bash quoting are not interchangeable.

In the cmd example, `/c` executes the supplied text and exits; `&` inside it separates cmd commands; `echo` writes a message; `1>&2` routes stdout to stderr; `exit /b 3` selects exit status3. Those quoted operators belong to cmd; redirection outside the quotes belongs to PowerShell.
