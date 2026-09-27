<?php
declare(strict_types=1);

$mode = getenv('LESSON_MODE');
if ($mode === false || !in_array($mode, ['development', 'test'], true)) {
    fwrite(STDERR, "Required setting missing or invalid: LESSON_MODE\n"); exit(1);
}
echo "loaded=LESSON_MODE\n";
