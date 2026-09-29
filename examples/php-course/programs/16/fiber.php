<?php
$fiber = new Fiber(function (): string {
    echo "fiber entered", PHP_EOL;
    $reply = Fiber::suspend('need input');
    echo "fiber resumed", PHP_EOL;
    return strtoupper($reply);
});
echo "main before", PHP_EOL;
echo $fiber->start(), PHP_EOL;
echo "main between", PHP_EOL;
$fiber->resume('done');
echo $fiber->getReturn(), PHP_EOL;
