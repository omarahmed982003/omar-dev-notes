<?php
$path = __DIR__ . '/notes-demo.json';
$notes = [['name' => 'Omar', 'text' => 'Learn streams']];
$json = json_encode($notes, JSON_THROW_ON_ERROR);
$bytes = file_put_contents($path, $json, LOCK_EX);
if ($bytes === false || $bytes !== strlen($json)) {
    throw new RuntimeException('Save failed');
}
$raw = file_get_contents($path);
if ($raw === false) {
    throw new RuntimeException('Read failed');
}
$loaded = json_decode($raw, true, flags: JSON_THROW_ON_ERROR);
if (!is_array($loaded) || !is_string($loaded[0]['text'] ?? null)) {
    throw new RuntimeException('Unexpected data shape');
}
echo $loaded[0]['text'], PHP_EOL;
