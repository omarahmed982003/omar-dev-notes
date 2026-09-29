<?php
function batches(): Generator
{
    echo "begin", PHP_EOL;
    yield from [10, 20];
    yield from [30];
    echo "end", PHP_EOL;
}
$items = batches();
echo "created", PHP_EOL;
foreach ($items as $key => $value) {
    echo "{$key}:{$value}", PHP_EOL;
}
echo implode(',', iterator_to_array(batches(), false)), PHP_EOL;
