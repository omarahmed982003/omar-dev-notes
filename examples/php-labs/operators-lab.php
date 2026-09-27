<?php
declare(strict_types=1);

foreach (['"0" == 0' => '0' == 0, '"0" === 0' => '0' === 0, '0 ?? 9' => 0 ?? 9, '0 ?: 9' => 0 ?: 9, '2 ** 3 ** 2' => 2 ** 3 ** 2] as $expression => $result) {
    echo $expression, ' => ', json_encode($result), ' type=', get_debug_type($result), PHP_EOL;
}
