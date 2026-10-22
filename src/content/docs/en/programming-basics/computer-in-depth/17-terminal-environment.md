---
title: "Command channels, permissions, and environment"
description: "Command channels, permissions, and environment"
sidebar:
  order: 11
prev: {"link":"/en/programming-basics/computer-in-depth/05-os-terminal-files-git/","label":"Read and write files from a terminal"}
next: {"link":"/en/programming-basics/computer-in-depth/15-parallel-work/","label":"When does parallel work help?"}
---

<span class="foundations-reading-scope" aria-hidden="true"></span>

## Why does the same command fail elsewhere?

Typing `php` may work in one terminal while another cannot find it. A command name is only part of the story: inherited settings, search paths, and separate data and diagnostic channels also matter.

Recall shells, working directories, and paths from [files and terminals](/en/programming-basics/computer-in-depth/05-os-terminal-files-git/). These experiments use PowerShell on Windows without permanent configuration changes.

## Environment: named settings

An **environment variable** is a named value a program reads as configuration. A **parent process** starts a **child process**, which normally inherits a copy of the parent's environment at creation.

PowerShell's `$env:` accesses environment variables. APP_ENV is our nonsensitive example setting, with value development:

```powershell
$env:APP_ENV = 'development'
Get-ChildItem Env:APP_ENV
```

Expect APP_ENV and its value. This affects the current process and children started afterward, not permanent device configuration or already-running processes.

A child's environment changes do not automatically update its parent. For stale settings, inspect process creation time and configuration source before changing the whole device.

### Configuration is not a secret vault

Inspection tools or crash reports may expose environment values. Do not screenshot all variables or print passwords to logs.

A **secret manager** stores sensitive values with access control and rotation. Environment-based configuration still requires validation and protection against logging.

## PATH: finding an executable

**PATH** lists directories searched for executable files when a command has no explicit path. It is neither the working directory nor your project's data path.

`Get-Command` reveals the selected command. This read-only check does not change PATH:

```powershell
Get-Command php
```

If a PHP path appears, check the intended version with `php -v`; `-v` requests version information. If missing, inspect installation and the current terminal rather than randomly installing copies.

An explicit executable path may bypass name search, but the file itself must be trusted. An untrusted search directory can make a familiar name select a different program.

## Three channels and an exit result

**stdin**, standard input, receives data from a keyboard or another program. **stdout**, standard output, carries ordinary results. **stderr**, standard error, carries separate diagnostics.

An **exit code** is a numeric termination result. Zero usually means success; other values indicate failures or documented outcomes. Printing “success” alone does not establish success.

**CI**, continuous integration with automated checks, commonly relies on exit codes. Keep machine-readable results separate from progress messages.

## A pipe is not always plain text

A **pipe**, written `|`, connects an output to a following command's input. An **object** carries properties, such as a file's name and size. PowerShell normally passes objects between its native commands.

`-File` selects files; `Select-Object` selects properties; Name and Length identify the file name and data length:

```powershell
Get-ChildItem -File | Select-Object Name, Length
```

External programs expose channels according to their interfaces. Do not automatically equate a PowerShell object pipeline with a Bash byte pipeline.

**Redirection** sends a channel to another destination, such as a file. **Backpressure** can slow a producer when the reader falls behind and buffers fill. A pipe is not unlimited memory.

### Optional channel experiment after configuring PHP

`fwrite` writes to a channel. STDOUT and STDERR identify PHP CLI output streams; **CLI** means command-line execution. `exit(3)` deliberately returns code 3.

Save a new `channels.php` in a fresh practice folder:

```php
<?php
fwrite(STDOUT, "result\n");
fwrite(STDERR, "diagnostic\n");
exit(3);
```

From that directory in PowerShell, `1>` saves ordinary output and `2>` saves diagnostics. These can replace existing destination files, so use only new practice names:

```powershell
php .\channels.php 1> output.txt 2> error.txt
$LASTEXITCODE
Get-Content -LiteralPath '.\output.txt'
Get-Content -LiteralPath '.\error.txt'
```

`$LASTEXITCODE` records the last external program's exit status. Expect 3, result, and diagnostic. Three is the deliberate experiment contract, not an installation failure.

### Recognizing an older cmd example

`cmd /c` executes Windows command text and exits. Inside that text, `echo` prints, `&` separates commands, `1>&2` routes output to error, and `exit /b 3` selects status three.

Those operators belong to cmd; redirection outside its quoted text belongs to PowerShell. Understanding the interpreter boundary matters more than copying syntax between shells.

## Diagnostic practice

One program writes diagnostic text but exits zero; another writes a result and exits three. Does stderr text alone determine exit status? How do you distinguish a missing executable from a missing data file?

<details>
<summary>Review after attempting</summary>

Channels and exit status are separate signals defined by the program's contract; CI commonly relies on status. Inspect Get-Command for the executable, then the working directory and data-file path for missing input.

</details>

## Summary

Environment is inherited configuration, PATH searches for executables, streams carry data, and exit codes report agreed outcomes. Experiment without permanent changes or exposing secrets.

## References

- [Microsoft: environment variables](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_environment_variables)
- [Microsoft: stream redirection](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_redirection)
