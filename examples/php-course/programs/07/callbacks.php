<?php
declare(strict_types=1);

function transform(array $values, callable $operation): array
{
    $result = [];
    foreach ($values as $value) {
        $result[] = $operation($value);
    }
    return $result;
}
$factor = 2;
$double = function (int $n) use ($factor): int {
    return $n * $factor;
};
$factor = 10;
$values = transform([1, 2, 3], $double);
echo implode(',', $values), PHP_EOL;
$plusOne = fn (int $n): int => $n + 1;
echo implode(',', transform($values, $plusOne)), PHP_EOL;
