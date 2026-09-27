<?php
declare(strict_types=1);

require __DIR__ . '/bootstrap.php';

// A failure throws even when PHP's assert() is disabled.
function same(mixed $expected, mixed $actual): void
{
    if ($expected !== $actual) {
        throw new RuntimeException('Expected ' . var_export($expected, true) . ', got ' . var_export($actual, true));
    }
}
function rejects(callable $operation, string $class = InvalidArgumentException::class): void
{
    try {
        $operation();
    } catch (Throwable $error) {
        if ($error instanceof $class) {
            return;
        }
        throw $error;
    }
    throw new RuntimeException('Expected rejection: ' . $class);
}

$tests = [];
$tests['values/amount grammar and decimal scaling'] = static function (): void {
    foreach (['0' => 0, '12' => 1200, '12.5' => 1250, '12.50' => 1250, '000.01' => 1] as $input => $expected) {
        same($expected, Lessons\parseMinorUnits((string) $input));
    }
    foreach (["12.5\n", ' 12', '-1', '1.234', '', '1e3', '１２'] as $input) {
        rejects(static fn () => Lessons\parseMinorUnits($input));
    }
};
$tests['values/integer boundary and total overflow'] = static function (): void {
    $digits = (string) PHP_INT_MAX;
    $largest = substr($digits, 0, -2) . '.' . substr($digits, -2);
    same(PHP_INT_MAX, Lessons\parseMinorUnits($largest));
    rejects(static fn () => Lessons\parseMinorUnits($digits));
    same(PHP_INT_MAX, Lessons\addMinorUnits(PHP_INT_MAX - 1, 1));
    rejects(static fn () => Lessons\addMinorUnits(PHP_INT_MAX, 1));
    rejects(static fn () => Lessons\multiplyMinorUnits(PHP_INT_MAX, 2));
};
$tests['values/IDs reject conversion traps'] = static function (): void {
    same([12, 3], Lessons\positiveIds(['12', 3]));
    foreach ([['12x'], [['bad']], ['0'], ['01'], ['-1'], [true], ['99999999999999999999999'], ['x' => 1]] as $input) {
        rejects(static fn () => Lessons\positiveIds($input));
    }
    rejects(static fn () => Lessons\positiveIds([1, 2], 1));
};
$tests['http/entity-tag list and weak comparison'] = static function (): void {
    foreach (['"v1"', 'W/"v1"', '"old", W/"v1"', '*', ', "old,tag", "v1",'] as $field) {
        same(true, Lessons\ifNoneMatchMatches($field, '"v1"'));
    }
    same(false, Lessons\ifNoneMatchMatches('"v10"', '"v1"'));
    same(false, Lessons\ifNoneMatchMatches('', '"v1"'));
    same(true, Lessons\ifNoneMatchMatches('"a,b"', '"a,b"'));
    foreach (['"v1" garbage', 'w/"v1"', '*, "v1"', '"unterminated'] as $field) {
        rejects(static fn () => Lessons\ifNoneMatchMatches($field, '"v1"'));
    }
};
$tests['security/CSRF token and origin'] = static function (): void {
    $allowed = ['https://app.example'];
    same(true, Lessons\validCsrf('secret', 'secret', $allowed[0], $allowed));
    same(false, Lessons\validCsrf('secret', 'secret', 'https://evil.example', $allowed));
    same(false, Lessons\validCsrf('wrong', 'secret', $allowed[0], $allowed));
    same(false, Lessons\validCsrf(['secret'], 'secret', $allowed[0], $allowed));
    same(false, Lessons\validCsrf('secret', 'secret', null, $allowed));
};
$tests['security/required claims after verified signature'] = static function (): void {
    $good = ['iss' => 'issuer', 'aud' => ['api'], 'sub' => 'u1', 'exp' => 101];
    Lessons\validateAccessClaims($good, 'issuer', 'api', 100);
    foreach (['exp', 'sub', 'aud', 'iss'] as $field) {
        $bad = $good;
        unset($bad[$field]);
        rejects(static fn () => Lessons\validateAccessClaims($bad, 'issuer', 'api', 100));
    }
    foreach (['exp' => 100, 'aud' => 'other', 'nbf' => 102] as $field => $value) {
        rejects(static fn () => Lessons\validateAccessClaims([$field => $value] + $good, 'issuer', 'api', 100));
    }
};
$tests['security/AEAD context tampering and malformed input'] = static function (): void {
    $key = sodium_crypto_aead_xchacha20poly1305_ietf_keygen();
    $stored = Lessons\seal('private data', 'tenant:1', $key);
    same('private data', Lessons\openSealed($stored, 'tenant:1', $key));
    rejects(static fn () => Lessons\openSealed($stored, 'tenant:2', $key), RuntimeException::class);
    rejects(static fn () => Lessons\openSealed('bad', 'tenant:1', $key), RuntimeException::class);
    $bytes = base64_decode($stored, true);
    $bytes[strlen($bytes) - 1] = chr(ord($bytes[strlen($bytes) - 1]) ^ 1);
    rejects(static fn () => Lessons\openSealed(base64_encode($bytes), 'tenant:1', $key), RuntimeException::class);
};
$tests['security/password verification and consistent rehash policy'] = static function (): void {
    $algorithm = PASSWORD_ARGON2ID;
    $options = ['memory_cost' => 8192, 'time_cost' => 1, 'threads' => 1]; // Fast TEST cost only.
    $hash = password_hash('training-only password', $algorithm, $options);
    same(true, password_verify('training-only password', $hash));
    same(false, password_verify('wrong', $hash));
    same(false, password_needs_rehash($hash, $algorithm, $options));
    same(true, password_needs_rehash($hash, $algorithm, ['time_cost' => 2] + $options));
};
$tests['inventory/commit duplicate and conflicting idempotency key'] = static function (): void {
    $db = Lessons\connectInventory();
    Lessons\initializeInventory($db);
    $first = Lessons\purchase($db, 'request-1', 1, 1, 4);
    $again = Lessons\purchase($db, 'request-1', 1, 1, 4);
    same($first['order_id'], $again['order_id']);
    same(true, $again['duplicate']);
    same(1, (int) $db->query('SELECT stock FROM products WHERE id=1')->fetchColumn());
    same(1, (int) $db->query('SELECT COUNT(*) FROM outbox')->fetchColumn());
    rejects(static fn () => Lessons\purchase($db, 'request-1', 1, 1, 1), DomainException::class);
    rejects(static fn () => Lessons\purchase($db, 'request-2', 2, 1, 4), DomainException::class);
};
$tests['inventory/rollback removes claim stock order and event'] = static function (): void {
    $db = Lessons\connectInventory();
    Lessons\initializeInventory($db);
    rejects(static fn () => Lessons\purchase($db, 'retry-me', 1, 1, 4, true), DomainException::class);
    same(5, (int) $db->query('SELECT stock FROM products WHERE id=1')->fetchColumn());
    foreach (['orders', 'outbox', 'processed_jobs'] as $table) {
        same(0, (int) $db->query('SELECT COUNT(*) FROM ' . $table)->fetchColumn());
    }
    same(false, Lessons\purchase($db, 'retry-me', 1, 1, 4)['duplicate']);
};
$tests['inventory/schema constraints and prepared values'] = static function (): void {
    $db = Lessons\connectInventory();
    Lessons\initializeInventory($db);
    $query = $db->prepare('SELECT id FROM users WHERE id=?');
    $query->execute(['1 OR 1=1']);
    same([], $query->fetchAll());
    rejects(static fn () => $db->exec('UPDATE products SET stock=-1'), PDOException::class);
    rejects(static fn () => $db->exec('INSERT INTO orders(user_id,product_id,quantity) VALUES(999,1,1)'), PDOException::class);
};
$tests['php/attributes target and reflection'] = static function (): void {
    #[Attribute(Attribute::TARGET_FUNCTION)]
    class RequiredRole { public function __construct(public string $role) {} }
    #[RequiredRole('admin')]
    function demoProtectedAction(): void {}
    $attribute = (new ReflectionFunction('demoProtectedAction'))->getAttributes(RequiredRole::class)[0]->newInstance();
    same('admin', $attribute->role);
};
$tests['php/CSV exact round trip'] = static function (): void {
    $stream = fopen('php://temp', 'w+');
    $row = ['id', 'comma,quote"', 'back\\slash', 'عمر'];
    fputcsv($stream, $row, escape: '');
    rewind($stream);
    same($row, fgetcsv($stream, escape: ''));
    fclose($stream);
};
$tests['php/scope references arrays and expressions'] = static function (): void {
    $a = [1, 2]; $b = $a; $b[] = 3;
    same([1, 2], $a);
    $reference =& $a; $reference[] = 4; unset($reference);
    same([1, 2, 4], $a);
    same(512, 2 ** 3 ** 2);
    same([2, 4], array_values(array_filter([1, 2, 3, 4], static fn (int $n): bool => $n % 2 === 0)));
};
$tests['php/date validation and Unicode lengths'] = static function (): void {
    $date = DateTimeImmutable::createFromFormat('!Y-m-d', '2025-02-30');
    $warnings = DateTimeImmutable::getLastErrors();
    same(true, $warnings !== false && $warnings['warning_count'] > 0);
    same(6, strlen('عمر'));
    same(3, mb_strlen('عمر', 'UTF-8'));
};

set_error_handler(static function (int $severity, string $message, string $file, int $line): never {
    throw new ErrorException($message, 0, $severity, $file, $line);
});
$group = $argv[1] ?? 'all';
$run = 0;
$failures = 0;
foreach ($tests as $name => $test) {
    if ($group !== 'all' && !str_starts_with($name, $group . '/')) {
        continue;
    }
    $run++;
    try {
        $test();
        echo "PASS {$name}\n";
    } catch (Throwable $error) {
        $failures++;
        fwrite(STDERR, "FAIL {$name}: {$error->getMessage()}\n");
    }
}
if ($run === 0) {
    fwrite(STDERR, "Unknown test group: {$group}\n");
    exit(2);
}
printf("tests=%d failures=%d\n", $run, $failures);
exit($failures === 0 ? 0 : 1);
