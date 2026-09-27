<?php
declare(strict_types=1);

require __DIR__ . '/bootstrap.php';

try {
    $path = $argv[1] ?? '';
    if (!is_file($path) || !is_readable($path)) {
        throw new InvalidArgumentException('Expected a readable JSON file under 1 MB');
    }
    $json = file_get_contents($path, length: 1_000_001);
    if ($json === false || strlen($json) > 1_000_000) {
        throw new InvalidArgumentException('Cannot read a bounded JSON file');
    }
    $rows = json_decode($json, true, 32, JSON_THROW_ON_ERROR);
    if (!is_array($rows) || !array_is_list($rows) || count($rows) > 1000) {
        throw new InvalidArgumentException('Expected a bounded order list');
    }
    $total = 0;
    $items = 0;
    $seen = [];
    foreach ($rows as $row) {
        if (!is_array($row) || !is_string($row['id'] ?? null) || $row['id'] === ''
            || isset($seen[$row['id']]) || !is_int($row['unit_price_minor'] ?? null)
            || !is_int($row['quantity'] ?? null) || $row['quantity'] > 1000) {
            throw new InvalidArgumentException('Invalid or duplicate order');
        }
        $seen[$row['id']] = true;
        $total = Lessons\addMinorUnits($total, Lessons\multiplyMinorUnits($row['unit_price_minor'], $row['quantity']));
        $items += $row['quantity'];
    }
    printf("orders=%d\nitems=%d\ntotal_minor=%d\n", count($rows), $items, $total);
} catch (JsonException) {
    fwrite(STDERR, "ERROR invalid JSON\n");
    exit(2);
} catch (InvalidArgumentException $error) {
    fwrite(STDERR, 'ERROR ' . $error->getMessage() . PHP_EOL);
    exit(1);
}
