---
title: "Program organization and entry points"
prev: {"link":"/en/php/","label":"PHP guide"}
next: {"link":"/en/php/08-files-streams-data/","label":"Files, streams, JSON, and CSV"}
description: "Program organization and entry points"
sidebar:
  order: 7.8
---

After functions and arrays, separate calculation from program startup. An entry point starts execution; bootstrap prepares required components. The working directory is the terminal's directory, not necessarily the source file's directory. require executes a required file and __DIR__ anchors its path.

## A two-file project: require executes a file

Create a folder containing `config.php` and `main.php`. This is a complete project without Composer. The first returns data; the second needs it:

~~~php
<?php
// config.php
return ['name' => 'Notebook', 'limit' => 3];
~~~

~~~php
<?php
// main.php
$config = require __DIR__ . '/config.php';
echo $config['name'], ': ', $config['limit'], PHP_EOL;
~~~

~~~text
Notebook: 3
~~~

Run `php main.php`. `__DIR__` is the current file's directory, independent of the working directory. `require` executes the file and receives its return value. Without an explicit return, successful inclusion normally returns 1. Included code inherits the inclusion scope, so avoid hidden dependencies on outside variables.

`include` emits a warning on failure and usually continues. Modern PHP's `require` raises an Error, interrupting the current path unless handled. The `_once` versions prevent repeated definitions. Do not expect repeated require_once calls for configuration to return the same array; a later call may return true. Never build inclusion paths from user input. Lesson 10 moves class loading to Composer.

`goto` jumps to a label in the same file and scope; it cannot enter a loop or switch from outside. `goto done; echo 'skip'; done: echo 'done';` prints done, but a small function or break is usually easier to follow.


## Independent exercise

Run main.php from its own folder and its parent. Set limit in config.php to 0 and trace the output.

<details><summary>Review after trying</summary>

__DIR__ anchors the path to the file. require returns the file's return value; successful inclusion alone does not validate data.

</details>

[Return to the PHP guide](/en/php/).

