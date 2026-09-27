<?php
declare(strict_types=1);
require __DIR__ . '/bootstrap.php';
final readonly class Money {
    public function __construct(public int $minor, public string $currency) {
        if ($minor < 0 || !in_array($currency, ['EGP','USD'], true)) throw new InvalidArgumentException('Invalid money');
    }
    public function plus(self $other): self {
        if ($this->currency !== $other->currency) throw new InvalidArgumentException('Currency mismatch');
        return new self(Lessons\addMinorUnits($this->minor, $other->minor), $this->currency);
    }
}
final class Order {
    private string $status = 'draft';
    public function __construct(public readonly string $id, public readonly Money $total) {}
    public function beginPayment(): void {
        if ($this->status !== 'draft') throw new DomainException('Order is not payable');
        $this->status = 'pending';
    }
    public function approve(): void {
        if ($this->status !== 'pending') throw new DomainException('Order is not pending');
        $this->status = 'paid';
    }
    public function decline(): void {
        if ($this->status !== 'pending') throw new DomainException('Order is not pending');
        $this->status = 'draft';
    }
    public function status(): string { return $this->status; }
}
interface PaymentGateway { public function charge(string $idempotencyKey, Money $amount): bool; }
interface OrderRepository { public function save(Order $order): void; }
interface Clock { public function now(): DateTimeImmutable; }
interface Notifier { public function receipt(Receipt $receipt): void; }
final readonly class Receipt {
    public function __construct(public string $orderId, public Money $total, public DateTimeImmutable $issuedAt) {}
}
final class CheckoutService {
    public function __construct(private PaymentGateway $gateway, private OrderRepository $orders, private Clock $clock, private Notifier $notifier) {}
    public function pay(Order $order): Receipt {
        $order->beginPayment();
        // A thrown/ambiguous provider outcome leaves pending for reconciliation.
        if (!$this->gateway->charge('order:'.$order->id, $order->total)) {
            $order->decline();
            throw new DomainException('Payment declined');
        }
        $order->approve();
        $this->orders->save($order);
        $receipt = new Receipt($order->id, $order->total, $this->clock->now());
        $this->notifier->receipt($receipt);
        return $receipt;
    }
}
final class FakeGateway implements PaymentGateway {
    public int $calls = 0;
    public function __construct(private bool $approve) {}
    public function charge(string $idempotencyKey, Money $amount): bool { $this->calls++; return $this->approve; }
}
final class FakeRepository implements OrderRepository {
    public int $saves = 0;
    public function save(Order $order): void { $this->saves++; }
}
final class FixedClock implements Clock {
    public function now(): DateTimeImmutable { return new DateTimeImmutable('2026-01-01T00:00:00Z'); }
}
final class FakeNotifier implements Notifier {
    public int $calls = 0;
    public function receipt(Receipt $receipt): void { $this->calls++; }
}
function check(bool $condition): void { if (!$condition) throw new RuntimeException('Test failed'); }
$gateway = new FakeGateway(true); $repository = new FakeRepository(); $notifier = new FakeNotifier();
$service = new CheckoutService($gateway, $repository, new FixedClock(), $notifier);
$order = new Order('42', new Money(2999, 'EGP'));
$receipt = $service->pay($order);
check($order->status()==='paid' && $repository->saves===1 && $gateway->calls===1 && $notifier->calls===1 && $receipt->total->minor===2999);
try { $service->pay($order); throw new RuntimeException('Duplicate accepted'); } catch (DomainException) {}
check($gateway->calls===1 && $repository->saves===1);
$declining = new FakeGateway(false); $unsaved = new FakeRepository(); $silent = new FakeNotifier();
$other = new Order('43', new Money(100, 'EGP'));
try { (new CheckoutService($declining,$unsaved,new FixedClock(),$silent))->pay($other); throw new RuntimeException('Decline ignored'); } catch (DomainException) {}
check($other->status()==='draft' && $unsaved->saves===0 && $silent->calls===0);
try { (new Money(1,'EGP'))->plus(new Money(1,'USD')); throw new RuntimeException('Mixed currencies accepted'); } catch (InvalidArgumentException) {}
check((new Money(100,'EGP'))->plus(new Money(25,'EGP'))->minor===125);
echo "checkout: approval, decline, duplicate, currency = PASS\n";
