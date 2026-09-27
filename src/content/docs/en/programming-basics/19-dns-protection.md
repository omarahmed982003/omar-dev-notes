---
title: "DNS failures and protection"
description: "DNS failures and protection"
sidebar:
  order: 9
prev: {"link":"/en/programming-basics/02-dns-and-ip/","label":"How a domain name becomes an address"}
next: {"link":"/en/programming-basics/03-tcp-udp-packets/","label":"Moving data with TCP and UDP"}
---

After reading a successful lookup, distinguish a nonexistent name from lookup failure, then privacy from data authenticity.

## Missing answers and DNS protection

A and AAAA return IPv4 and IPv6 addresses; CNAME aliases another name; MX identifies mail receivers; TXT carries text; NS identifies authoritative servers. **Negative caching** saves an answer that a name or record type does not exist, so a newly added record need not appear immediately to every client.

**DNSSEC, Domain Name System Security Extensions**, adds signatures that supporting resolvers validate through a trust chain; it does not encrypt queries. **DoH (DNS over HTTPS (HTTP carried over a TLS-protected connection))** and **DoT (DNS over TLS)** protect transport to a resolver, not the honesty of the returned website.

**Worked check:** An A query succeeds and an AAAA query has no address. That does not invalidate A or prove that the website is down. To inspect details including TTL where shown, try `nslookup -debug -type=A example.com`, then AAAA, MX, and NS. Separate answer records from other sections. The resolver, values, and remaining lifetimes vary.
