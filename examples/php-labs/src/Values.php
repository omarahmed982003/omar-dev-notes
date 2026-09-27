<?php
declare(strict_types=1);

namespace Lessons;

use InvalidArgumentException;

function parseMinorUnits(string $value): int
{
    if (preg_match('/\A[0-9]+(?:\.[0-9]{1,2})?\z/', $value) !== 1) {
        throw new InvalidArgumentException('Invalid amount');
    }
    [$whole, $fraction] = array_pad(explode('.', $value, 2), 2, '');
    $digits = ltrim($whole . str_pad($fraction, 2, '0'), '0');
    $digits = $digits === '' ? '0' : $digits;
    $maximum = (string) PHP_INT_MAX;
    if (strlen($digits) > strlen($maximum)
        || (strlen($digits) === strlen($maximum) && strcmp($digits, $maximum) > 0)) {
        throw new InvalidArgumentException('Amount exceeds integer range');
    }
    return (int) $digits;
}

function addMinorUnits(int $left, int $right): int
{
    if ($left < 0 || $right < 0 || $left > PHP_INT_MAX - $right) {
        throw new InvalidArgumentException('Total exceeds integer range');
    }
    return $left + $right;
}

function multiplyMinorUnits(int $price, int $quantity): int
{
    if ($price < 0 || $quantity < 1 || $price > intdiv(PHP_INT_MAX, $quantity)) {
        throw new InvalidArgumentException('Invalid line total');
    }
    return $price * $quantity;
}

function positiveIds(mixed $input, int $maximumCount = 100): array
{
    if (!is_array($input) || !array_is_list($input) || count($input) > $maximumCount) {
        throw new InvalidArgumentException('Expected a bounded list of IDs');
    }
    $ids = [];
    foreach ($input as $raw) {
        if ((!is_string($raw) && !is_int($raw))
            || preg_match('/\A[1-9][0-9]*\z/', (string) $raw) !== 1) {
            throw new InvalidArgumentException('Invalid ID');
        }
        $id = filter_var($raw, FILTER_VALIDATE_INT, ['options' => ['min_range' => 1]]);
        if ($id === false) {
            throw new InvalidArgumentException('ID exceeds integer range');
        }
        $ids[] = $id;
    }
    return $ids;
}
