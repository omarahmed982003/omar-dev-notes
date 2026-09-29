<?php
declare(strict_types=1);

function validateNote(array $input): array
{
    $data = [];
    $errors = [];
    foreach (['name' => 40, 'text' => 200] as $field => $limit) {
        $value = $input[$field] ?? null;
        if (!is_string($value) || strlen($value) > $limit * 4
            || !mb_check_encoding($value, 'UTF-8')) {
            $errors[$field] = 'Use valid UTF-8 text';
            $data[$field] = '';
            continue;
        }
        $value = trim($value);
        $data[$field] = $value;
        if ($value === '' || mb_strlen($value, 'UTF-8') > $limit) {
            $errors[$field] = "Use 1 to {$limit} code points";
        }
    }
    return ['data' => $data, 'errors' => $errors];
}
function ownerDirectory(string $root, string $owner): string
{
    if (preg_match('/\A[a-f0-9]{32}\z/', $owner) !== 1) {
        throw new RuntimeException('Invalid storage identifier');
    }
    return $root . '/' . $owner;
}
function readNotes(string $root, string $owner): array
{
    $directory = ownerDirectory($root, $owner);
    if (file_exists($root) && (!is_dir($root) || !is_readable($root))) {
        throw new RuntimeException('Storage unavailable');
    }
    if (!is_dir($directory)) {
        return [];
    }
    $paths = glob($directory . '/*.json');
    if ($paths === false || count($paths) > 100) {
        throw new RuntimeException('Cannot list notes');
    }
    $notes = [];
    foreach ($paths as $path) {
        $raw = file_get_contents($path, false, null, 0, 8193);
        if ($raw === false || strlen($raw) > 8192) {
            throw new RuntimeException('Cannot read note');
        }
        $note = json_decode($raw, true, 32, JSON_THROW_ON_ERROR);
        if (!is_array($note)
            || !is_string($note['name'] ?? null)
            || !is_string($note['text'] ?? null)
            || !is_string($note['created_at'] ?? null)
            || !is_string($note['id'] ?? null)) {
            throw new RuntimeException('Invalid stored note');
        }
        $notes[] = $note;
    }
    usort($notes, static fn (array $a, array $b): int =>
        [$a['created_at'], $a['id']] <=> [$b['created_at'], $b['id']]);
    return $notes;
}
function saveNote(string $root, string $owner, array $data, DateTimeImmutable $now): void
{
    $directory = ownerDirectory($root, $owner);
    if (!is_dir($directory) && !mkdir($directory, 0700, true) && !is_dir($directory)) {
        throw new RuntimeException('Cannot create storage');
    }
    $id = bin2hex(random_bytes(16));
    $note = [
        'id' => $id,
        'name' => $data['name'],
        'text' => $data['text'],
        'created_at' => $now->setTimezone(new DateTimeZone('UTC'))->format(DateTimeInterface::ATOM),
    ];
    $json = json_encode($note, JSON_UNESCAPED_UNICODE | JSON_THROW_ON_ERROR);
    $temporary = tempnam($directory, '.pending-');
    if ($temporary === false) {
        throw new RuntimeException('Cannot create temporary file');
    }
    if (realpath(dirname($temporary)) !== realpath($directory)) {
        unlink($temporary);
        throw new RuntimeException('Temporary file outside storage');
    }
    try {
        if (file_put_contents($temporary, $json) !== strlen($json)) {
            throw new RuntimeException('Cannot write complete note');
        }
        if (!rename($temporary, $directory . '/' . $id . '.json')) {
            throw new RuntimeException('Cannot publish note');
        }
    } finally {
        if (is_file($temporary)) {
            unlink($temporary);
        }
    }
}
function escapeHtml(string $value): string
{
    return htmlspecialchars($value, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}
function renderNotes(array $notes, array $errors, array $old, string $csrf, string $flash): string
{
    ob_start();
    try {
        require dirname(__DIR__) . '/views/notebook.php';
        return (string) ob_get_contents();
    } finally {
        ob_end_clean();
    }
}
