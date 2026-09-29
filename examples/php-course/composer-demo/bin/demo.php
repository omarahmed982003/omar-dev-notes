<?php
declare(strict_types=1);

use App\Billing\PriceCalculator;

require dirname(__DIR__) . '/vendor/autoload.php';

$calculator = new PriceCalculator();
echo $calculator->subtotal(1500, 3), PHP_EOL;
