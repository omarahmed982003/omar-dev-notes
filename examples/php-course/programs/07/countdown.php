<?php
function countdown(int $n): void
{
    if ($n < 0 || $n > 10) {
        throw new InvalidArgumentException('Use 0..10');
    }
    if ($n === 0) {
        echo "go", PHP_EOL;
        return;
    }
    echo $n, PHP_EOL;
    countdown($n - 1);
}
countdown(3);
