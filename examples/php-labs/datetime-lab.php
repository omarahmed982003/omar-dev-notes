<?php
declare(strict_types=1);

$utc = new DateTimeImmutable('2026-01-15T12:00:00+00:00');
foreach (['UTC','Africa/Cairo','America/New_York'] as $zone) {
    $local = $utc->setTimezone(new DateTimeZone($zone));
    echo $zone, ' ', $local->format(DATE_ATOM), ' timestamp=', $local->getTimestamp(), PHP_EOL;
}
$before = new DateTimeImmutable('2026-03-08T06:59:00+00:00');
echo $before->setTimezone(new DateTimeZone('America/New_York'))->format(DATE_ATOM), PHP_EOL;
echo $before->modify('+1 minute')->setTimezone(new DateTimeZone('America/New_York'))->format(DATE_ATOM), PHP_EOL;
