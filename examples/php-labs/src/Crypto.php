<?php
declare(strict_types=1);

namespace Lessons;

use RuntimeException;

function seal(string $plain, string $context, string $key): string
{
    $nonce = random_bytes(SODIUM_CRYPTO_AEAD_XCHACHA20POLY1305_IETF_NPUBBYTES);
    $cipher = sodium_crypto_aead_xchacha20poly1305_ietf_encrypt($plain, $context, $nonce, $key);
    return base64_encode($nonce . $cipher);
}

function openSealed(string $encoded, string $context, string $key): string
{
    $payload = base64_decode($encoded, true);
    $nonceBytes = SODIUM_CRYPTO_AEAD_XCHACHA20POLY1305_IETF_NPUBBYTES;
    if ($payload === false || strlen($payload) < $nonceBytes + SODIUM_CRYPTO_AEAD_XCHACHA20POLY1305_IETF_ABYTES) {
        throw new RuntimeException('Invalid encrypted payload');
    }
    $plain = sodium_crypto_aead_xchacha20poly1305_ietf_decrypt(
        substr($payload, $nonceBytes), $context, substr($payload, 0, $nonceBytes), $key,
    );
    if ($plain === false) {
        throw new RuntimeException('Authentication failed');
    }
    return $plain;
}
