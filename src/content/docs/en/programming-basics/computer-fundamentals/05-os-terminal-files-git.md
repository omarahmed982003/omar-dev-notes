---
title: 8. Terminal, files, permissions, and environment
description: Shells, paths, filesystem metadata, permissions, environment variables, pipes, exit codes, and safe command-line work.
sidebar:
  order: 8
---

## Terminal and shell

A terminal displays a text session; a shell parses commands, quoting, expansions, and pipes before starting processes. PowerShell, Bash, zsh, and `cmd.exe` use different syntax, so escaping rules should not be copied blindly between them.

## Paths and working directory

An absolute path starts at a root or drive. A relative path is resolved from the current working directory; `.` means current and `..` means parent. A filename is not a complete path, and an extension does not prove content type.

Use tab completion and literal-path options for special characters. Before recursive deletion or movement, resolve and display the exact target.

## Files, directories, and metadata

A file is bytes plus metadata such as size, timestamps, owner, and permissions. A directory maps names to entries. A same-filesystem rename may update metadata quickly, while a cross-device move may copy and delete. A symbolic link refers to another path rather than copying its data.

## Users, groups, and permissions

Permissions determine read, write, and execution access. Unix commonly expresses owner/group/others bits; Windows uses detailed ACLs. Services should not run as root or administrator unnecessarily, and secret files should not be globally readable.

## Environment variables

Environment variables are key-value configuration inherited by child processes. They are not a secret vault and may appear in process inspection, crash reports, or logs. Validate required values at startup and use a production secret manager.

## stdin, stdout, stderr, and exit status

Programs read standard input, emit normal data on standard output, diagnostics on standard error, and return a status code. Zero conventionally means success. Pipes connect one process's stdout to another's stdin; backpressure can make a fast producer wait for a slower consumer.

Keep progress messages away from machine-readable stdout, quote paths with spaces, inspect help before bulk operations, and never expose secrets in command history or process arguments.

## Check your understanding

<div class="lesson-quiz" role="list">
<section class="quiz-card" role="listitem"><div class="quiz-question-row"><span class="quiz-number">01</span><p>How do a terminal and shell differ?</p></div><details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Answer:</strong> The terminal presents the session; the shell interprets commands and connects processes and streams.</div></details></section>
<section class="quiz-card" role="listitem"><div class="quiz-question-row"><span class="quiz-number">02</span><p>Why can a valid relative path fail?</p></div><details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Answer:</strong> It is resolved from the current working directory, which may differ from the script or project directory.</div></details></section>
<section class="quiz-card" role="listitem"><div class="quiz-question-row"><span class="quiz-number">03</span><p>Why separate stdout and stderr?</p></div><details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Answer:</strong> Machine-readable output remains clean while diagnostics can be displayed or logged independently.</div></details></section>
<section class="quiz-card" role="listitem"><div class="quiz-question-row"><span class="quiz-number">04</span><p>Is an environment variable a secret vault?</p></div><details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Answer:</strong> No. It is a configuration channel that can leak; use secret management, permissions, rotation, and log redaction.</div></details></section>
</div>
