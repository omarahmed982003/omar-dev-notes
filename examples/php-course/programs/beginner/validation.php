<?php
function quantity(mixed $raw): ?int
{
    if (!is_string($raw) && !is_int($raw)) {
        return null;
    }
    $value = filter_var($raw, FILTER_VALIDATE_INT, [
        'options' => ['min_range' => 0, 'max_range' => 100],
    ]);
    return $value === false ? null : $value;
}
foreach (['0', '100', '101', '12x', null, false, []] as $raw) {
    echo json_encode($raw), ' => ', quantity($raw) ?? 'invalid', PHP_EOL;
}
