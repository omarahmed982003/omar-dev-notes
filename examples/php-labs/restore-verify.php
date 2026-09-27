<?php
declare(strict_types=1);
require __DIR__ . '/bootstrap.php';
$path = tempnam(sys_get_temp_dir(), 'lesson-backup-');
if ($path === false) throw new RuntimeException('Cannot allocate snapshot path');
try {
    $db = Lessons\connectInventory(); Lessons\initializeInventory($db);
    Lessons\purchase($db, 'backup-order', 1, 1, 2);
    $db->exec('VACUUM INTO ' . $db->quote($path));
    $start = hrtime(true);
    $restored = Lessons\connectInventory($path);
    if ($restored->query('PRAGMA integrity_check')->fetchColumn() !== 'ok'
        || $restored->query('PRAGMA foreign_key_check')->fetchAll() !== []
        || (int) $restored->query('SELECT count(*) FROM orders')->fetchColumn() !== 1
        || (int) $restored->query('SELECT stock FROM products')->fetchColumn() !== 3) {
        throw new RuntimeException('Restored snapshot failed checks');
    }
    echo 'snapshot=ok verification_ms=', (hrtime(true)-$start)/1e6, PHP_EOL;
} finally { $restored = null; $db = null; unlink($path); }
