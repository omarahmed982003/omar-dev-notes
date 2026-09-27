<?php
declare(strict_types=1);

namespace Lessons;

use DomainException;
use PDO;
use Throwable;

function connectInventory(string $path = ':memory:'): PDO
{
    $pdo = new PDO('sqlite:' . $path, options: [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    ]);
    $pdo->exec('PRAGMA foreign_keys=ON');
    $pdo->exec('PRAGMA busy_timeout=3000');
    return $pdo;
}

function initializeInventory(PDO $pdo): void
{
    $pdo->exec(file_get_contents(__DIR__ . '/../schema.sql'));
}

function purchase(PDO $pdo, string $key, int $userId, int $productId, int $quantity, bool $simulateFailure = false): array
{
    if ($key === '' || strlen($key) > 100 || $quantity < 1 || $quantity > 1000) {
        throw new DomainException('Invalid purchase');
    }
    $fingerprint = hash('sha256', json_encode([$userId, $productId, $quantity], JSON_THROW_ON_ERROR));
    $pdo->beginTransaction();
    try {
        // Claim and business effect commit together; a rolled-back claim can retry.
        $claim = $pdo->prepare('INSERT OR IGNORE INTO processed_jobs (user_id, job_key, fingerprint) VALUES (?, ?, ?)');
        $claim->execute([$userId, $key, $fingerprint]);
        if ($claim->rowCount() === 0) {
            $read = $pdo->prepare('SELECT fingerprint, order_id FROM processed_jobs WHERE user_id=? AND job_key=?');
            $read->execute([$userId, $key]);
            $previous = $read->fetch();
            if ($previous === false || !hash_equals($previous['fingerprint'], $fingerprint)) {
                throw new DomainException('Idempotency key reused with different input');
            }
            $pdo->commit();
            return ['order_id' => (int) $previous['order_id'], 'duplicate' => true];
        }
        $reserve = $pdo->prepare('UPDATE products SET stock=stock-? WHERE id=? AND stock>=?');
        $reserve->execute([$quantity, $productId, $quantity]);
        if ($reserve->rowCount() !== 1) {
            throw new DomainException('Insufficient stock or unknown product');
        }
        $order = $pdo->prepare('INSERT INTO orders (user_id, product_id, quantity) VALUES (?, ?, ?)');
        $order->execute([$userId, $productId, $quantity]);
        $orderId = (int) $pdo->lastInsertId();
        $record = $pdo->prepare('UPDATE processed_jobs SET order_id=? WHERE user_id=? AND job_key=?');
        $record->execute([$orderId, $userId, $key]);
        $event = $pdo->prepare('INSERT INTO outbox (order_id, event_type) VALUES (?, ?)');
        $event->execute([$orderId, 'OrderCreated']);
        if ($simulateFailure) {
            throw new DomainException('Simulated crash before commit');
        }
        $pdo->commit();
        return ['order_id' => $orderId, 'duplicate' => false];
    } catch (Throwable $error) {
        if ($pdo->inTransaction()) {
            $pdo->rollBack();
        }
        throw $error;
    }
}
