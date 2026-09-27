<?php
declare(strict_types=1);
require __DIR__ . '/bootstrap.php';
if (($argv[1] ?? '') === '--worker') {
    $db = Lessons\connectInventory($argv[2]);
    try { Lessons\purchase($db, $argv[3], 1, 1, 3); echo "purchased\n"; }
    catch (DomainException) { echo "insufficient_stock\n"; }
    exit;
}
$path = tempnam(sys_get_temp_dir(), 'lesson-lock-');
if ($path === false) throw new RuntimeException('Cannot create temporary database');
$processes = [];
try {
    $db = Lessons\connectInventory($path); Lessons\initializeInventory($db); $db = null;
    for ($i=0; $i<2; $i++) {
        $process = proc_open([PHP_BINARY, __FILE__, '--worker', $path, 'key-'.$i], [0=>['pipe','r'],1=>['pipe','w'],2=>['pipe','w']], $pipes);
        if (!is_resource($process)) throw new RuntimeException('Cannot start worker');
        fclose($pipes[0]); $processes[] = [$process, $pipes];
    }
    foreach ($processes as [$process, $pipes]) {
        echo stream_get_contents($pipes[1]); $error = stream_get_contents($pipes[2]);
        fclose($pipes[1]); fclose($pipes[2]);
        if (proc_close($process) !== 0) throw new RuntimeException($error);
    }
    $db = Lessons\connectInventory($path);
    $stock = (int) $db->query('SELECT stock FROM products WHERE id=1')->fetchColumn();
    $orders = (int) $db->query('SELECT count(*) FROM orders')->fetchColumn();
    if ($stock !== 2 || $orders !== 1) throw new RuntimeException('Concurrency invariant failed');
    echo "orders=1 stock=2\n";
} finally { $db = null; unlink($path); }
