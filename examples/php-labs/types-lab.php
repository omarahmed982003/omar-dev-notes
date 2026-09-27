<?php
declare(strict_types=1);

function twice(int $value): int { return $value * 2; }
echo twice(3), PHP_EOL;
try { twice('3'); } catch (TypeError) { echo "strict_type=rejected\n"; }
