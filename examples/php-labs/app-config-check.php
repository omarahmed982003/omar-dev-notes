<?php
declare(strict_types=1);

final readonly class AppConfig
{
    public function __construct(
        public string $environment,
        public bool $debug,
        public string $databaseDsn,
        public int $httpTimeoutMs,
    ) {}

    public static function fromEnvironment(): self
    {
        $dsn = $_ENV['DATABASE_DSN'] ?? getenv('DATABASE_DSN');
        if ($dsn === false || $dsn === '') {
            throw new RuntimeException('DATABASE_DSN is required');
        }

        $environment = $_ENV['APP_ENV'] ?? (($raw = getenv('APP_ENV')) === false ? 'production' : $raw);
        if (!in_array($environment, ['local', 'testing', 'staging', 'production'], true)) {
            throw new RuntimeException('APP_ENV is invalid');
        }

        $debug = filter_var(
            $_ENV['APP_DEBUG'] ?? (($raw = getenv('APP_DEBUG')) === false ? 'false' : $raw),
            FILTER_VALIDATE_BOOL,
            FILTER_NULL_ON_FAILURE,
        );

        if ($debug === null) {
            throw new RuntimeException('APP_DEBUG must be true or false');
        }

        $timeout = filter_var(
            $_ENV['HTTP_TIMEOUT_MS'] ?? (($raw = getenv('HTTP_TIMEOUT_MS')) === false ? '5000' : $raw),
            FILTER_VALIDATE_INT,
            ['options' => ['min_range' => 100, 'max_range' => 60_000]],
        );

        if ($timeout === false) {
            throw new RuntimeException('HTTP_TIMEOUT_MS is invalid');
        }

        return new self(
            environment: $environment,
            debug: $debug,
            databaseDsn: $dsn,
            httpTimeoutMs: $timeout,
        );
    }
}

try {
    $config = AppConfig::fromEnvironment();
    echo "configuration_valid keys=APP_ENV,APP_DEBUG,DATABASE_DSN,HTTP_TIMEOUT_MS", PHP_EOL;
} catch (RuntimeException $error) {
    fwrite(STDERR, $error->getMessage() . PHP_EOL);
    exit(2);
}
