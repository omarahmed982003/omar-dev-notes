<?php
function describe((Countable&Stringable)|array $value): string
{
    return is_array($value) ? 'array:' . count($value) : (string) $value;
}
$items = new class implements Countable, Stringable {
    public function count(): int { return 2; }
    public function __toString(): string { return $this->count() . ' items'; }
};
echo describe([10, 20]), PHP_EOL;
echo describe($items), PHP_EOL;

readonly class Amount
{
    public function __construct(public int $minorUnits) {}
}
$amount = new Amount(500);
echo $amount->minorUnits, PHP_EOL;
try {
    $amount->minorUnits = 600;
} catch (Error) {
    echo "readonly blocked reassignment", PHP_EOL;
}
