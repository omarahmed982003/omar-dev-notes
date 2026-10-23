<?php
declare(strict_types=1);
function total(array $values): int
{
    return array_sum($values);
}
$cases = [[[], 0], [[0], 0], [[10, 0, 20], 30]];
$failed = 0;
foreach ($cases as [$input, $expected]) {
    $actual = total($input);
    if ($actual !== $expected) {
        fwrite(STDERR, "FAIL expected=$expected actual=$actual\n");
        $failed++;
    }
}
echo 'cases=', count($cases), ' failures=', $failed, PHP_EOL;
exit($failed === 0 ? 0 : 1);
