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

// One worker only: recover its unacknowledged message before reserving new work.
// This lab proves worker-crash recovery, not broker persistence or multi-worker leases.
$finish = <<<'LUA'
local fresh = redis.call('SETNX', KEYS[2], '1')
if fresh == 1 then redis.call('INCR', KEYS[3]) end
redis.call('LREM', KEYS[1], 1, ARGV[1])
return fresh
LUA;
while (!$stop && $handled < $maximum) {
    $raw = $redis->lIndex('lesson:processing', -1);
    if ($raw === false) {
        $raw = $redis->brpoplpush('lesson:queue', 'lesson:processing', 2);
    }
    if ($raw === null || $raw === false) {
        continue;
    }
    if (getenv('CRASH_AFTER_RESERVE') === '1') {
        fwrite(STDERR, "simulated_crash pending=1\n");
        exit(3);
    }
    try {
        $job = json_decode($raw, true, 32, JSON_THROW_ON_ERROR);
        $jobId = $job['job_id'] ?? null;
        if (!is_string($jobId) || preg_match('/\A[a-f0-9]{32}\z/', $jobId) !== 1
            || ($job['type'] ?? null) !== 'LessonProbe') {
            throw new InvalidArgumentException('Invalid job contract');
        }
    } catch (JsonException | InvalidArgumentException) {
        $redis->multi();
        $redis->lPush('lesson:dead', $raw);
        $redis->lRem('lesson:processing', $raw, 1);
        $redis->exec();
        fwrite(STDERR, "dead_letter=invalid_payload\n");
        $handled++;
        continue;
    }
    // The effect, deduplication marker and acknowledgment share one Redis operation.
    // Do not replace INCR with an external payment/mail call: that is a different boundary.
    $fresh = $redis->eval($finish, [
        'lesson:processing', 'lesson:done:' . $jobId, 'lesson:effect-count', $raw,
    ], 3);
    if ($fresh === false) {
        throw new RuntimeException('Could not finalize message');
    }
    fwrite(STDOUT, ($fresh === 1 ? 'processed=' : 'duplicate=') . $jobId . PHP_EOL);
    $handled++;
}

fwrite(STDOUT, "worker_stopped handled={$handled}\n");
