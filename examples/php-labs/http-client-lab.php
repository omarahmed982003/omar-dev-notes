<?php
declare(strict_types=1);

// Only the local teaching server is contacted; no caller-supplied URL.
function request(string $path, int $timeoutMs = 2000, array $headers = []): array
{
    $curl = curl_init('http://127.0.0.1:8097' . $path);
    curl_setopt_array($curl, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_CONNECTTIMEOUT_MS => 500,
        CURLOPT_TIMEOUT_MS => $timeoutMs,
        CURLOPT_FOLLOWLOCATION => false,
        CURLOPT_HTTPHEADER => $headers,
    ]);
    $body = curl_exec($curl);
    $result = ['body' => $body, 'status' => curl_getinfo($curl, CURLINFO_RESPONSE_CODE), 'error' => curl_errno($curl)];
    return $result;
}
$health = request('/health');
if ($health['status'] !== 200 || $health['error'] !== 0) {
    fwrite(STDERR, "Start the local server: php -S 127.0.0.1:8097 http-router.php\n");
    exit(1);
}
$failure = request('/error');
$etag = '"' . hash('sha256', '{"id":42,"name":"Notebook"}') . '"';
$cached = request('/product', headers: ['If-None-Match: "old", W/' . $etag]);
$slow = request('/slow', 50);
if ($failure['status'] !== 500 || $cached['status'] !== 304 || $cached['body'] !== '' || $slow['error'] !== CURLE_OPERATION_TIMEDOUT) {
    fwrite(STDERR, "Unexpected HTTP behavior\n");
    exit(1);
}
echo "status=200\nserver_error=500\nconditional=304\ntimeout_handled=yes\n";
