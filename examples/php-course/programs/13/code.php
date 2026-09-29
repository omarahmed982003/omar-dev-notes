<?php
function orderId(string $input): ?string
{
    if (strlen($input) > 32) {
        return null;
    }
    $matched = preg_match('/\AORD-(?<id>[0-9]{4})\z/u', $input, $matches);
    if ($matched === false) {
        throw new RuntimeException(preg_last_error_msg());
    }
    return $matched === 1 ? $matches['id'] : null;
}
foreach (['ORD-1234', 'xORD-1234', "ORD-1234\n", 'ORD-0000'] as $input) {
    echo json_encode($input), ' => ', orderId($input) ?? 'invalid', PHP_EOL;
}
