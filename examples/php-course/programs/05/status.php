<?php
$status = '200';
switch ($status) {
    case 200:
        echo "switch: success", PHP_EOL;
        break;
    default:
        echo "switch: other", PHP_EOL;
}
$message = match ($status) {
    200, 201 => 'success',
    default => 'other',
};
echo "match: {$message}", PHP_EOL;
