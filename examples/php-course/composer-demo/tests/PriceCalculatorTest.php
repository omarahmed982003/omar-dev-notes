<?php
declare(strict_types=1);

use App\Billing\PriceCalculator;
use PHPUnit\Framework\TestCase;

final class PriceCalculatorTest extends TestCase
{
    public function testValidOrder(): void
    {
        self::assertSame(4500, (new PriceCalculator())->subtotal(1500, 3));
    }

    public function testZeroPriceIsAllowed(): void
    {
        self::assertSame(0, (new PriceCalculator())->subtotal(0, 1));
    }

    public function testZeroQuantityIsRejected(): void
    {
        $this->expectException(InvalidArgumentException::class);
        (new PriceCalculator())->subtotal(100, 0);
    }

    public function testNegativePriceIsRejected(): void
    {
        $this->expectException(InvalidArgumentException::class);
        (new PriceCalculator())->subtotal(-1, 1);
    }

    public function testOverflowIsRejected(): void
    {
        $this->expectException(InvalidArgumentException::class);
        (new PriceCalculator())->subtotal(PHP_INT_MAX, 2);
    }
}
