<?php
declare(strict_types=1);

final class LeakyRequestState
{
    /** @var array<string, string> */
    private static array $values = [];

    public static function handle(string $requestId, ?string $user): ?string
    {
        if ($user !== null) {
            self::$values['user'] = $user;
        }

        return self::$values['user'] ?? null;
    }

    public static function reset(): void
    {
        self::$values = [];
    }
}

$first = LeakyRequestState::handle('request-a', 'alice');
$leaked = LeakyRequestState::handle('request-b', null);
if ($first !== 'alice' || $leaked !== 'alice') {
    throw new RuntimeException('The deliberate leak was not reproduced.');
}

LeakyRequestState::reset();
$clean = LeakyRequestState::handle('request-c', null);
if ($clean !== null) {
    throw new RuntimeException('Reset failed to clear request state.');
}

echo "leak_detected=yes reset_ok=yes\n";