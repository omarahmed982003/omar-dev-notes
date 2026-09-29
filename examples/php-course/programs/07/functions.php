<?php
declare(strict_types=1);

function subtotal(int $price, int $quantity = 1): int
{
    if ($price < 0 || $quantity < 1) {
        throw new InvalidArgumentException('Invalid order');
    }
    return $price * $quantity;
}
function receipt(int $price, int $quantity): string
{
    $amount = subtotal($price, $quantity);
    return "Total: {$amount}";
}
echo receipt(1500, 3), PHP_EOL;
echo subtotal(quantity: 2, price: 500), PHP_EOL;
