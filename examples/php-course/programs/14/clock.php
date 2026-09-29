<?php
function expired(DateTimeImmutable $deadline, DateTimeImmutable $now): bool
{
    return $now >= $deadline;
}
$deadline = new DateTimeImmutable('2024-01-01T12:00:00+00:00');
foreach (['11:59:59', '12:00:00', '12:00:01'] as $time) {
    $now = new DateTimeImmutable("2024-01-01T{$time}+00:00");
    echo $time, ': ', expired($deadline, $now) ? 'expired' : 'valid', PHP_EOL;
}
