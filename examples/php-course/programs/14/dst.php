<?php
$start = new DateTimeImmutable('2024-03-30 12:00:00', new DateTimeZone('Europe/London'));
$calendar = $start->add(new DateInterval('P1D'));
$elapsed = $start->add(new DateInterval('PT24H'));
foreach (['calendar' => $calendar, 'elapsed' => $elapsed] as $label => $end) {
    $seconds = $end->getTimestamp() - $start->getTimestamp();
    echo $label, ': ', $end->format('Y-m-d H:i P'), " seconds={$seconds}", PHP_EOL;
}
