<?php

declare(strict_types=1);

namespace App\Billing;

final class PriceCalculator
{
    public function subtotal(int $price, int $quantity): int
    {
        if ($price < 0 || $quantity < 1 || $price > intdiv(PHP_INT_MAX, $quantity)) {
            throw new \InvalidArgumentException('Invalid order');
        }

        return $price * $quantity;
    }
}
