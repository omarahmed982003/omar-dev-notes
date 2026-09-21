---
title: 2. DNS and IP addresses
description: Name resolution through caches, recursive resolvers, root, TLD, and authoritative servers.
sidebar:
  order: 2
---

An IP address identifies a network interface for routing. Private and public addresses differ, and a home router commonly performs NAT. `127.0.0.1` and `::1` are loopback addresses; `localhost` normally resolves to them.

DNS is a distributed record system. Common records include `A` (IPv4), `AAAA` (IPv6), `CNAME` (alias), `MX` (mail), `TXT`, and `NS`.

Resolution usually checks browser and OS caches, then asks a recursive resolver. On a cache miss, that resolver follows referrals from root to TLD to an authoritative server and returns the answer with a TTL.

```text
Browser/OS Cache → Recursive Resolver
                    ↓ cache miss
                 Root → TLD → Authoritative
```

The browser does not normally query every level itself, and the full chain is not repeated while a cached answer is valid. DNS may return several IPs for balancing or locality; it locates a server but does not deliver HTML or execute PHP.

```bash
nslookup example.com
nslookup -type=AAAA example.com
nslookup -type=MX example.com
```
