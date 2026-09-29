<?php
declare(strict_types=1);
require __DIR__ . '/src/notebook.php';
$checks = 0;
function check(bool $condition, string $message): void
{
    global $checks;
    if (!$condition) {
        throw new RuntimeException($message);
    }
    $checks++;
}
$root = sys_get_temp_dir() . '/notebook-test-' . bin2hex(random_bytes(8));
$owner = str_repeat('a', 32);
try {
    foreach ([
        ['name' => '', 'text' => 'x'],
        ['name' => ['Omar'], 'text' => 'x'],
        ['name' => 'Omar', 'text' => []],
        ['name' => "\xFF", 'text' => 'x'],
        ['name' => str_repeat('n', 41), 'text' => 'x'],
        ['name' => 'Omar', 'text' => str_repeat('x', 201)],
    ] as $input) {
        check(validateNote($input)['errors'] !== [], 'Invalid input accepted');
    }
    check(validateNote(['name' => '0', 'text' => '0'])['errors'] === [], 'Zero string rejected');
    $validated = validateNote(['name' => ' عمر ', 'text' => '<b>تعلم PHP 👋</b>']);
    check($validated['errors'] === [], 'Valid Unicode rejected');
    check($validated['data']['name'] === 'عمر', 'Name not trimmed');
    $now = new DateTimeImmutable('2024-01-15T14:00:00+02:00');
    saveNote($root, $owner, $validated['data'], $now);
    $notes = readNotes($root, $owner);
    check(count($notes) === 1, 'Note not persisted');
    check($notes[0]['created_at'] === '2024-01-15T12:00:00+00:00', 'Time not stored in UTC');
    check($notes[0]['text'] === '<b>تعلم PHP 👋</b>', 'Stored text changed');
    check(readNotes($root, str_repeat('b', 32)) === [], 'Owner isolation failed');
    $html = renderNotes($notes, [], [], str_repeat('c', 64), '');
    check(str_contains($html, '&lt;b&gt;تعلم PHP 👋&lt;/b&gt;'), 'HTML not escaped');
    try {
        ownerDirectory($root, '../outside');
        throw new LogicException('Path traversal accepted');
    } catch (RuntimeException $error) {
        check($error->getMessage() === 'Invalid storage identifier', 'Wrong failure');
    }
    echo "PASS: {$checks} notebook checks", PHP_EOL;
} finally {
    $directory = $root . '/' . $owner;
    foreach (glob($directory . '/*') ?: [] as $file) {
        if (is_file($file)) {
            unlink($file);
        }
    }
    if (is_dir($directory)) { rmdir($directory); }
    if (is_dir($root)) { rmdir($root); }
}

