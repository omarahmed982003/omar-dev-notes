<?php
if ($argc !== 2) {
    fwrite(STDERR, "Usage: php hello-arg.php NAME\n");
    exit(2);
}
echo "Hello ", $argv[1], PHP_EOL;
