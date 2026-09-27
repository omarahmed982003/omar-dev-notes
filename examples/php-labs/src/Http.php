<?php
declare(strict_types=1);

namespace Lessons;

use InvalidArgumentException;

// For an existing representation. The endpoint separately enforces GET/HEAD.
function ifNoneMatchMatches(string $field, string $currentTag): bool
{
    if (strlen($field) > 8192) {
        throw new InvalidArgumentException('Conditional field too large');
    }
    if (trim($field, " \t") === '*') {
        return true;
    }
    $position = 0;
    $found = false;
    $currentOpaque = str_starts_with($currentTag, 'W/') ? substr($currentTag, 2) : $currentTag;
    while ($position < strlen($field)) {
        // HTTP list syntax permits a reasonable number of empty members.
        $position += strspn($field, " \t,", $position);
        if ($position === strlen($field)) {
            break;
        }
        if (preg_match('/\G(?:W\/)?("[\x21\x23-\x7e\x80-\xff]*")[ \t]*/', $field, $match, 0, $position) !== 1) {
            throw new InvalidArgumentException('Malformed entity-tag list');
        }
        $position += strlen($match[0]);
        if ($position < strlen($field) && $field[$position] !== ',') {
            throw new InvalidArgumentException('Expected comma between entity-tags');
        }
        $found = $found || $match[1] === $currentOpaque;
    }
    return $found;
}

function validCsrf(mixed $sent, mixed $stored, mixed $origin, array $allowedOrigins): bool
{
    return is_string($origin) && in_array($origin, $allowedOrigins, true)
        && is_string($sent) && is_string($stored) && $stored !== ''
        && hash_equals($stored, $sent);
}

function validateAccessClaims(array $claims, string $issuer, string $audience, int $now): void
{
    // Only call AFTER a JOSE library has verified the signature and fixed algorithm.
    if (($claims['iss'] ?? null) !== $issuer
        || !is_string($claims['sub'] ?? null) || $claims['sub'] === ''
        || !is_int($claims['exp'] ?? null) || $claims['exp'] <= $now) {
        throw new InvalidArgumentException('Missing or invalid required claim');
    }
    $aud = $claims['aud'] ?? null;
    if (is_string($aud)) {
        $aud = [$aud];
    }
    if (!is_array($aud) || !array_is_list($aud) || $aud === []
        || count(array_filter($aud, 'is_string')) !== count($aud)
        || !in_array($audience, $aud, true)) {
        throw new InvalidArgumentException('Invalid audience');
    }
    if (array_key_exists('nbf', $claims)
        && (!is_int($claims['nbf']) || $claims['nbf'] > $now)) {
        throw new InvalidArgumentException('Invalid not-before claim');
    }
}
