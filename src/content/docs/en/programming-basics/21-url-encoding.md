---
title: "Characters and encoding in web addresses"
description: "Characters and encoding in web addresses"
sidebar:
  order: 13
prev: {"link":"/en/programming-basics/04-url-ports-http/","label":"Web addresses, ports, and HTTP"}
next: {"link":"/en/programming-basics/05-http-messages-state/","label":"Read an HTTP request and response"}
---

What happens to an address containing Arabic letters or a space? First learn the parts of a URL.

## Encoded characters and address details

**Percent-encoding** writes a byte as two hexadecimal digits after %. For example, %20 represents a space. Hexadecimal compactly represents bits, explained in [data representation](/en/programming-basics/computer-fundamentals/02-binary-data-representation/). Repeated decoding can change meaning: %252F becomes %2F and then a slash.

**URI, Uniform Resource Identifier**, is the general resource-identifier term. A URL describes how to locate a resource. **IRI, Internationalized Resource Identifier**, supports international characters. **IDNA, Internationalized Domain Names in Applications**, governs international domain-name handling; it differs from percent-encoding a path or query. Some URI syntax permits user information, but passwords must not be embedded in web URLs.

**Worked check:** For `http://[::1]:8080/search?q=hello%20world&tag=a&tag=b#results`, the host is bracketed IPv6 loopback and the port is 8080. The HTTP/1.1 request target is `/search?q=hello%20world&tag=a&tag=b`. The fragment is not sent. Repeated tag parameters may become a list or a selected value depending on the application's parser.

TCP/UDP port ranges are 0–1023 system ports, 1024–49151 user/registered ports, and 49152–65535 dynamic/private ports in the IANA registry. **IANA, Internet Assigned Numbers Authority**, coordinates these assignments. Actual operating-system ephemeral-port ranges can differ. FTP control commonly uses 21, SSH secure remote access 22, SMTP mail transfer 25, DNS 53, HTTP 80, HTTPS 443, and the MySQL/PostgreSQL database services 3306/5432. A number is an agreed configuration, not proof of the running protocol.
