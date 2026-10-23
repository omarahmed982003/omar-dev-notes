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
