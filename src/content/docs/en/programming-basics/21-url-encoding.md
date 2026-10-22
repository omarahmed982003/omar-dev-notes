---
title: "Characters and encoding in web addresses"
description: "Characters and encoding in web addresses"
sidebar:
  order: 6
prev: {"link":"/en/programming-basics/04-url-ports-http/","label":"Web addresses, ports, and HTTP"}
next: {"link":"/en/programming-basics/03-tcp-udp-packets/","label":"TCP: from the first SYN to connection closure"}
---

<span class="foundations-reading-scope" aria-hidden="true"></span>

A search contains Arabic letters and an `&`. It must arrive as **one value**, not accidentally become multiple fields. Follow the original text through bytes and a URL, then back to what the application reads.

Start after [URL parts](/en/programming-basics/04-url-ports-http/). The tables need no code. The PHP experiment is optional after variables, arrays, and running a file in the [PHP course](/en/php/).

## Encoded characters and address details

The **query** follows `?`. In `q=book&page=1`, `=` connects a field name to a value and `&` separates fields. An ampersand inside the value must remain data rather than become a separator.

**Percent-encoding** represents a byte using two hexadecimal digits after `%`. **UTF-8** turns text into bytes; one Arabic letter may require multiple bytes. See [data representation](/en/programming-basics/computer-in-depth/03-binary-languages-algorithms/) for bytes and hexadecimal.

| Original value | UTF-8 bytes in hexadecimal | Encoded form |
|---|---|---|
| Arabic letter ع | D8 B9 | `%D8%B9` |
| Space | 20 | `%20` |
| Literal & within a value | 26 | `%26` |
| Literal + within a value | 2B | `%2B` |

Encoding preserves the value within URL syntax. It is **not encryption**.

## Follow a complete Arabic search

The value is `عمر & سارة` under field q, with a separate `page=1` field. Encode the values while preserving the URL's separators:

~~~text
https://example.test/search?q=%D8%B9%D9%85%D8%B1%20%26%20%D8%B3%D8%A7%D8%B1%D8%A9&page=1
~~~

`example.test` is a practice name, not a service to contact.

- `%26` inside q represents a literal ampersand.
- `&page=1` begins another field; that ampersand is syntax.

Manually joining `q=عمر & سارة&page=1` gives the ampersand inside the name a separator's role. Encoding the entire URL as one value also changes the roles of characters such as `?` and `=`. Build the appropriate component using a suitable API.

## Optional PHP round trip

Save `url-query.php` in a new practice folder and run `php url-query.php` with PHP 8+. It only prints: no network request or settings change occurs.

`http_build_query` builds query text from names and values. `PHP_QUERY_RFC3986` selects `%20` for spaces here; `&` separates fields. `parse_str` parses query text into an array, `count` counts fields, `echo` prints, and `PHP_EOL` ends a line.

~~~php
<?php
declare(strict_types=1);

$term = 'عمر & سارة';
$query = http_build_query(
    ['q' => $term, 'page' => 1],
    '',
    '&',
    PHP_QUERY_RFC3986
);
$url = 'https://example.test/search?' . $query;

parse_str($query, $received);

echo $url . PHP_EOL;
echo $received['q'] . PHP_EOL;
echo $received['page'] . PHP_EOL;
echo count($received) . PHP_EOL;
~~~

Expected output:

~~~text
https://example.test/search?q=%D8%B9%D9%85%D8%B1%20%26%20%D8%B3%D8%A7%D8%B1%D8%A9&page=1
عمر & سارة
1
2
~~~

The full name survives and there are two fields, not three. Parsed page is the string `"1"`, not automatically a validated number. The application must still check shape, length, range, and permissions.

`parse_str` models parsing locally; it is **not a web server**. Receiving a real GET through `$_GET` belongs to the PHP-for-web application work.

## Spaces, plus signs, and decoding

The **application/x-www-form-urlencoded** format commonly represents spaces as `+`. PHP's default query-building mode uses this style; this example explicitly chooses RFC3986. A literal plus is `%2B` so a form-style parser will not mistake it for a space. Do not apply the plus rule indiscriminately to every URL component.

**Double encoding/decoding** changes the representation layer. Decoding `%252F` once yields the text `%2F`; another decoding yields `/`. Do not decode the same value again without a contract requiring it. A slash within data is not necessarily a path separator.

## Host names, paths, and fragments differ

**URI, Uniform Resource Identifier**, is the general identifier term; a URL describes access to a resource. **IRI, Internationalized Resource Identifier**, supports international characters. **IDNA, Internationalized Domain Names in Applications**, handles international domain names, not percent-encoding of a query or path value.

For `http://[::1]:8080/search?q=hello%20world&tag=a&tag=b#results`:

- `[::1]` is bracketed IPv6 loopback, the same machine, with port 8080.
- The HTTP/1.1 request target is `/search?q=hello%20world&tag=a&tag=b`.
- The **fragment**, `#results`, is not part of that request target. A literal # inside q must instead be encoded as `%23`.
- Repeated tag parameters may become a list or a selected value depending on the application parser.

Never embed passwords or access tokens in URLs. Encoding does not hide them from logs and history.

## Independent practice

1. Build q for `C++ & PHP`. Distinguish a separator ampersand from data.
2. Change `$term` to `س`, then an empty string. How many fields survive? Is an empty search automatically valid?
3. Decode `%252F` once. Is the result already a slash?
4. Search for the literal text `part#2`. Should # remain unencoded?

<details>
<summary>Solution and acceptance checks</summary>

1. `q=C%2B%2B%20%26%20PHP`. Another field uses an unencoded ampersand; %26 belongs to the value.
2. س becomes `%D8%B3`. Empty text produces `q=&page=1`; both fields remain. Validation decides whether that search is accepted.
3. The text `%2F`, not yet a slash. Do not automatically apply another decoding.
4. Encode the value as `part%232`. Success means recovering the original text without introducing a field or fragment.

</details>

## Summary and references

Identify the component, encode its data, and validate the parsed value. Continue to [TCP](/en/programming-basics/03-tcp-udp-packets/).

- [PHP: http_build_query encoding options](https://www.php.net/manual/en/function.http-build-query.php)
- [PHP: parse_str](https://www.php.net/manual/en/function.parse-str.php)
- [MDN: URLSearchParams](https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams)
