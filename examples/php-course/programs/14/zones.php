<?php
$utc = new DateTimeImmutable('2024-01-15 12:00:00', new DateTimeZone('UTC'));
$cairo = $utc->setTimezone(new DateTimeZone('Africa/Cairo'));
echo $utc->format('Y-m-d H:i:s P'), PHP_EOL;
echo $cairo->format('Y-m-d H:i:s P'), PHP_EOL;
var_dump($utc->getTimestamp() === $cairo->getTimestamp());
$tomorrow = $utc->modify('+1 day');
echo $utc->format('Y-m-d'), ' / ', $tomorrow->format('Y-m-d'), PHP_EOL;
