<?php
declare(strict_types=1);

function withdraw(int $balance, int $amount): int
{
    if ($balance < 0 || $amount <= 0) {
        throw new InvalidArgumentException('Use a nonnegative balance and positive amount');
    }
    if ($amount > $balance) {
        throw new DomainException('Insufficient funds');
    }
    return $balance - $amount;
}
foreach ([200, 1200, -1] as $amount) {
    echo "request={$amount}", PHP_EOL;
    try {
        $remaining = withdraw(1000, $amount);
        echo "remaining={$remaining}", PHP_EOL;
    } catch (InvalidArgumentException $error) {
        echo "invalid input", PHP_EOL;
    } catch (DomainException $error) {
        echo "declined", PHP_EOL;
    } finally {
        echo "finished attempt", PHP_EOL;
    }
}
