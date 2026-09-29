<?php
declare(strict_types=1);

if (!extension_loaded('redis')) {
    http_response_code(503);
    exit('ext-redis unavailable');
}

$redis = new Redis();
$redis->connect(getenv('REDIS_HOST') ?: 'redis', 6379, 1.0);
$job = ['job_id' => bin2hex(random_bytes(8)), 'type' => 'LessonProbe', 'created_at' => gmdate(DATE_ATOM)];
$redis->lPush('lesson:queue', json_encode($job, JSON_THROW_ON_ERROR));

header('Content-Type: application/json; charset=utf-8');
http_response_code(202);
echo json_encode($job, JSON_THROW_ON_ERROR);
