<?php
declare(strict_types=1);
function parseDate(string $input): DateTimeImmutable
{
    if (preg_match('/\A[0-9]{4}-[0-9]{2}-[0-9]{2}\z/', $input) !== 1) {
        throw new InvalidArgumentException('Use YYYY-MM-DD');
    }
    $date = DateTimeImmutable::createFromFormat('!Y-m-d', $input, new DateTimeZone('UTC'));
    $errors = DateTimeImmutable::getLastErrors();
    if ($date === false
        || ($errors !== false && ($errors['warning_count'] > 0 || $errors['error_count'] > 0))
        || $date->format('Y-m-d') !== $input) {
        throw new InvalidArgumentException('Invalid calendar date');
    }
    return $date;
}
foreach (['2024-02-29', '2023-02-29', '2024-2-9'] as $input) {
    try {
        echo parseDate($input)->format('Y-m-d H:i:s'), PHP_EOL;
    } catch (InvalidArgumentException) {
        echo "invalid: {$input}", PHP_EOL;
    }
}
