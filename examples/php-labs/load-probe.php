<?php
declare(strict_types=1);

if (!extension_loaded('curl')) {
    fwrite(STDERR, "ext-curl is required\n");
    exit(2);
}

$url = $argv[1] ?? 'http://127.0.0.1:8080/health';
$total = max(1, min(1000, (int) ($argv[2] ?? 50)));
$concurrency = max(1, min(100, (int) ($argv[3] ?? 10)));
$pending = $total;
$active = [];
$latencies = [];
$failures = 0;
$multi = curl_multi_init();

$start = static function () use ($url, $multi, &$active): void {
    $handle = curl_init($url);
    curl_setopt_array($handle, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_CONNECTTIMEOUT_MS => 500,
        CURLOPT_TIMEOUT_MS => 2000,
    ]);
    $active[spl_object_id($handle)] = ['handle' => $handle, 'started' => hrtime(true)];
    curl_multi_add_handle($multi, $handle);
};

while ($pending > 0 || $active !== []) {
    while ($pending > 0 && count($active) < $concurrency) {
        $start();
        $pending--;
    }

    do {
        $status = curl_multi_exec($multi, $running);
    } while ($status === CURLM_CALL_MULTI_PERFORM);

    while ($info = curl_multi_info_read($multi)) {
        $handle = $info['handle'];
        $key = spl_object_id($handle);
        $latencies[] = (hrtime(true) - $active[$key]['started']) / 1_000_000;
        $code = curl_getinfo($handle, CURLINFO_RESPONSE_CODE);
        if ($info['result'] !== CURLE_OK || $code < 200 || $code >= 400) {
            $failures++;
        }
        curl_multi_remove_handle($multi, $handle);
        curl_close($handle);
        unset($active[$key]);
    }

    if ($running > 0) {
        curl_multi_select($multi, 0.2);
    }
}

curl_multi_close($multi);
sort($latencies);
$percentile = static fn (float $p): float => $latencies[(int) ceil($p * count($latencies)) - 1];
printf("requests=%d concurrency=%d failures=%d p50_ms=%.2f p95_ms=%.2f p99_ms=%.2f\n", $total, $concurrency, $failures, $percentile(0.50), $percentile(0.95), $percentile(0.99));
exit($failures === 0 ? 0 : 1);