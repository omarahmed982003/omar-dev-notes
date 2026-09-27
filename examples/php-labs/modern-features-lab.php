<?php
declare(strict_types=1);

enum State: string { case Pending = 'pending'; case Paid = 'paid'; }
final readonly class Receipt { public function __construct(public int $id) {} }
echo State::from('paid')->name, PHP_EOL;
try { State::from('unknown'); } catch (ValueError) { echo "enum=rejected\n"; }
$receipt = new Receipt(1);
try { $receipt->id = 2; } catch (Error) { echo "readonly=rejected\n"; }
try { match (3) { 1 => 'one', 2 => 'two' }; } catch (UnhandledMatchError) { echo "match=rejected\n"; }
