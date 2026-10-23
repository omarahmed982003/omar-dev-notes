---
title: "CLI: Input / Output"
prev: {"link":"/en/php/05-control-flow/","label":"Conditions and loops"}
next: {"link":"/en/php/07-functions-and-includes/","label":"Functions and callbacks"}
description: "CLI input, output, and exit codes"
sidebar:
  order: 6.5
---

## Read input instead of fixing it in the source

Prerequisites: values, strings, and if. Input is data a program receives; output is what it produces. CLI runs a program through a terminal command. STDIN carries input, STDOUT carries results, and STDERR carries diagnostics. EOF means there is no more input; it is not an empty line. fgets returns a string or false, so check false before trim.

## Complete program

PHP 8.1+. Save greeting.php in a training directory and run php greeting.php. It makes no file or network writes.

~~~php
<?php
declare(strict_types=1);

fwrite(STDOUT, "Name: ");
$line = fgets(STDIN);
if ($line === false) {
    fwrite(STDERR, "No input\n");
    exit(2);
}
$name = trim($line);
if ($name === '') {
    fwrite(STDERR, "Name is required\n");
    exit(1);
}
fwrite(STDOUT, "Hello " . $name . PHP_EOL);
~~~

Omar followed by Enter produces Hello Omar and exit code 0. Spaces produce Name is required and code 1. Closing input without a line produces No input and code 2. An exit code is the result returned to the operating system; zero indicates success here.

Read $LASTEXITCODE in PowerShell or echo $? in Bash. Ctrl+Z followed by Enter commonly closes interactive input on Windows; Ctrl+D is common on Unix. Automated tests should provide a closed input stream directly.

## Arguments and channel boundaries

An argument is supplied with the launch command. $argv contains the argument strings and $argc their count, including the script at index 0:

~~~php
<?php
if ($argc !== 2) {
    fwrite(STDERR, "Usage: php hello-arg.php NAME\n");
    exit(2);
}
echo "Hello ", $argv[1], PHP_EOL;
~~~

Run php hello-arg.php Omar. Arguments remain strings; validate them before casting. See [validation](/en/php/input-validation/). Keeping errors out of STDOUT protects another program reading the results.

## Independent exercise

Read a product name, allow '0', reject an empty cleaned line, and return 2 for EOF. The valid result is Product: 0.

<details><summary>Solution after your attempt</summary>

Check fgets with === false, then trim and compare with === ''. Send the result to STDOUT and errors to STDERR. Test zero-text, spaces, and EOF separately.

</details>

## Summary

Input strings require an explicit contract. EOF, emptiness, and zero are different. [Official reference](https://www.php.net/manual/en/features.commandline.io-streams.php).


