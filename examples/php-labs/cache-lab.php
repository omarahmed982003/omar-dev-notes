<?php
declare(strict_types=1);

// Deterministic interleaving model, no Redis server is contacted.
$database = 10; $cache = null;
$oldRead = $database; // Reader A pauses before publishing.
$database = 11; $cache = null; // Writer B commits and invalidates.
$cache = $oldRead; // Reader A resumes.
echo "database=$database stale_cache=$cache\n";
$version = 1; $observedVersion = $version; $oldRead = 10;
$database = 11; $version++; $cache = null;
if ($version === $observedVersion) $cache = $oldRead;
echo 'obsolete_refill=', $cache === null ? 'rejected' : 'accepted', PHP_EOL;
