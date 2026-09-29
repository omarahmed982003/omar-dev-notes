<?php
$environment = getenv('APP_ENV') ?: 'development';
if (!in_array($environment, ['development', 'production'], true)) {
    throw new RuntimeException('Invalid APP_ENV');
}
return [
    'secure_cookie' => $environment === 'production',
    'storage' => getenv('NOTEBOOK_STORAGE') ?: __DIR__ . '/storage',
];
