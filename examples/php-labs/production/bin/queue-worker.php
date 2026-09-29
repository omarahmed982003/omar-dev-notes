<?php
declare(strict_types=1);

if (!extension_loaded('redis')) {
    fwrite(STDERR, "ext-redis is required\n");
    exit(2);
}

$redis = new Redis();
$redis->connect(getenv('REDIS_HOST') ?: 'redis', 6379, 1.0);
$maximum = max(1, (int) (getenv('WORKER_MAX_JOBS') ?: 20));
$handled = 0;
$stop = false;

if (function_exists('pcntl_async_signals')) {
    pcntl_async_signals(true);
    pcntl_signal(SIGTERM, static function () use (&$stop): void { $stop = true; });
    pcntl_signal(SIGINT, static function () use (&$stop): void { $stop = true; });
}

while (!$stop && $handled < $maximum) {
    $item = $redis->brPop(['lesson:queue'], 2);
    if ($item === null || $item === false) {
        continue;
    }

    $job = json_decode($item[1], true, flags: JSON_THROW_ON_ERROR);
    $jobId = (string) ($job['job_id'] ?? 'missing');
    if (!$redis->set("lesson:done:{$jobId}", '1', ['nx', 'ex' => 300])) {
        fwrite(STDOUT, "duplicate={$jobId}\n");
        continue;
    }

    fwrite(STDOUT, "processed={$jobId}\n");
    $handled++;
}

fwrite(STDOUT, "worker_stopped handled={$handled}\n");
