<?php
declare(strict_types=1);

$price = 1500;
$quantity = 3;
$subtotal = $price * $quantity;
$discount = intdiv($subtotal * 10, 100);
$afterDiscount = $subtotal - $discount;
$shipping = $afterDiscount >= 4000 ? 0 : 500;
$total = $afterDiscount + $shipping;
echo "subtotal={$subtotal}", PHP_EOL;
echo "discount={$discount}", PHP_EOL;
echo "shipping={$shipping}", PHP_EOL;
echo "total={$total}", PHP_EOL;
