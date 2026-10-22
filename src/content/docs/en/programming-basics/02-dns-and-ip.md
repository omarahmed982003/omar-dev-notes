---
title: "How a domain name becomes an address"
description: Understand why a service needs a name and an address, and how DNS reaches an authoritative answer through caches.
sidebar:
  order: 4
prev: {"link":"/en/programming-basics/15-addressing-dhcp-nat-routing-ipv6/","label":"Device addresses and connection settings"}
next: {"link":"/en/programming-basics/04-url-ports-http/","label":"Web addresses, ports, and HTTP"}
---

<span class="foundations-reading-scope" aria-hidden="true"></span>

The client in the previous lesson needed the server's address before it could connect.

Keep two jobs separate: **an IP (Internet Protocol, the addressing and routing protocol; an IP address identifies a network interface in context) address is a routable destination, while DNS (Domain Name System, a distributed system answering queries about domain names) finds suitable addresses for a name**.

**Reading route:** follow the lookup through its query exercise and foundation stopping point below. Focus on A, AAAA, CNAME, and resolver versus website address; mail/text records, diagnosis, and protection can wait until after a first application.

## Read a lookup result

Run `nslookup example.com`. This is an **illustration of its shape**, not a captured live result:

```text
Server:  router.home
Address: 192.168.1.1
Non-authoritative answer:
Name:    example.com
Address: 203.0.113.10
```

The first Server/Address identify the answering resolver, not the website. The later Name/Address describe the queried name. 203.0.113.10 is a documentation address, not a destination to try.

**Non-authoritative** means the answer was not obtained directly from the domain’s authoritative server; it does not by itself mean incorrect. Real output may contain multiple or IPv6 addresses.

## The mental model: a distributed address book

People remember `example.com` more easily than a number, and a service can move without changing its name. DNS is not one global file. It is a distributed system in which different authorities answer for different parts of the name space.

An IP address identifies a network interface for routing:

- `192.168.1.20`: a private IPv4 example inside a LAN (Local Area Network, a network within an area such as a home or office).
- `203.0.113.10`: an IPv4 address reserved for documentation.
- `2001:db8::10`: an IPv6 documentation address.
- `127.0.0.1` and `::1`: loopback addresses for this machine.
- `localhost`: a name that normally resolves to loopback.

A private home address is not necessarily your public address; a router commonly performs NAT (Network Address Translation, rewriting IP addresses at a network boundary). An IP also does not permanently identify a person or device: addresses can change or be shared.

## What does DNS return?

DNS returns typed records:

| Record | Meaning |
|---|---|
| `A` | A name mapped to IPv4 |
| `AAAA` | A name mapped to IPv6 |
| `CNAME` | An alias pointing to another name |
| `MX` | Mail receivers for a domain |
| `TXT` | Verification text and policies |
| `NS` | Name servers responsible for a zone |

One name may return several addresses for load distribution or locality. DNS locates a possible destination; it does not carry HTML (Hypertext Markup Language, a language describing page structure) or execute PHP (a programming language commonly used for server-side web processing).

## A cache-miss journey

1. The browser checks its cached answers.
2. The operating system checks its hosts file and cache.
3. It asks a **recursive resolver** supplied by an ISP (Internet Service Provider, an organization providing internet connectivity), organization, or public service.
4. On a cache miss, the resolver asks a **root** server who handles `.com`.
5. Root refers it to the `.com` **TLD (Top-Level Domain, a top-level name component such as com)** servers.
6. The TLD refers it to the domain's **authoritative name server**.
7. The authoritative server returns the final record.
8. The resolver returns and caches the answer according to its TTL (Time To Live, a DNS cache lifetime or an IPv4 forwarding limit depending on context).


:::caution[Important correction]
The browser does not normally query root and TLD servers itself, and the full journey is not repeated for every request. The recursive resolver performs it when no valid cached answer exists.
:::

## TTL: speed versus change

TTL is the number of seconds an answer may be cached. A long TTL reduces queries but can make a record change take longer to appear to some clients. A short TTL allows clients to refresh sooner after cached values expire but produces more queries.

“DNS propagation” is not one global timer. Each cache keeps its old answer until expiry and may apply additional local policies.

## Run a query and read it

```bash
nslookup -type=A example.com
nslookup -type=AAAA example.com
nslookup -type=MX example.com
```

An `A` response should resemble this, although the address and resolver can differ:

```text
Name:    example.com
Address: 93.184.216.34
```

- `-type=A` specifically requests IPv4.
- `Name` is the resolved name.
- `Address` is one returned address, not proof that HTTP (Hypertext Transfer Protocol, the rules for web requests and responses) works.
- An `AAAA` query may return IPv6 or report no record.
- An `MX` query asks about mail servers, not the website.

## Foundation stop: draw a question and answer

Input is example.com plus type A; output is an IPv4 address or another lookup outcome, not page content. Identify the queried resolver and website address, then explain why A can work while AAAA is absent. Explain why a cache avoids repeating the complete lookup.

Then follow the guide's next foundation lesson. The following sections are diagnosis and depth for return after a local web request, not a requirement to memorize every transport or security detail before HTML.

## Lookup failures and DNS transport

**NXDOMAIN** reports that the queried name does not exist. **NODATA** describes an existing name without records of the requested type.

**SERVFAIL** reports failure to complete processing, potentially involving server or signature-validation problems. A **timeout** means no response arrived within the wait, not proof of a nonexistent name.

Traditional DNS uses port 53 over UDP or TCP. A **truncated** response did not fit the current response limit; the client may retry over TCP. TCP is not exclusively for zone transfers.

Cache, hosts-file, and browser lookup order is not identical across systems. A browser with its own encrypted-DNS policy may differ from a system lookup tool. Compare tools and resolver sources before drawing conclusions.

<span id="dns-security"></span>

## Missing answers and DNS protection

A and AAAA return IPv4 and IPv6 addresses; CNAME aliases another name; MX identifies mail receivers; TXT carries text; NS identifies authoritative servers. **Negative caching** saves an answer that a name or record type does not exist, so a newly added record need not appear immediately to every client.

**DNSSEC, Domain Name System Security Extensions**, adds signatures that supporting resolvers validate through a trust chain; it does not encrypt queries. **DoH (DNS over HTTPS (HTTP carried over a TLS-protected connection))** and **DoT (DNS over TLS)** protect transport to a resolver, not the honesty of the returned website.

**Worked check:** An A query succeeds and an AAAA query has no address. That does not invalidate A or prove that the website is down. To inspect details including TTL where shown, try `nslookup -debug -type=A example.com`, then AAAA, MX, and NS. Separate answer records from other sections.

The resolver, values, and remaining lifetimes vary.

## Common mistakes

- Treating DNS as a connection to the server; it only discovers an address.
- Assuming `localhost` means a remote machine; it means the machine running the command.
- Expecting a changed record to appear immediately despite caches and TTL.
- Hard-coding an old IP and then breaking TLS (Transport Layer Security, rules for establishing an authenticated protected connection) or name-based hosting.
- Assuming a missing `AAAA` record means the independent `A` record cannot work.

## Practical problems

<details><summary>You changed an A record, but a colleague still reaches the old server. Did the change fail?</summary><p>Not necessarily. Check the authoritative answer, the TTL, and the resolver your colleague uses. A previously cached answer may still be valid.</p></details>

<details><summary><code>nslookup</code> succeeds but <code>curl</code> fails. What did the test prove?</summary><p>It proved only that DNS returned an address. Routing, TCP (Transmission Control Protocol, ordered byte transport with loss recovery; connections can still fail), TLS, HTTP, or the service itself may fail later.</p></details>

<details><summary>Why not put an IP address directly in every application?</summary><p>Addresses can change or multiply, and TLS plus virtual hosting rely on the host name. A name separates the service's logical identity from its current location.</p></details>

## Check your understanding

1. Who normally asks root and TLD servers? **The recursive resolver on a cache miss, not the browser directly.**
2. What happens when TTL expires? **The cached answer is no longer valid, so the client or resolver must query again.**
3. Does successful DNS mean the site will open? **No. DNS supplies an address; connection, TLS, HTTP, and application stages remain.**

## References

- [DNS transport over TCP — RFC 7766](https://www.rfc-editor.org/rfc/rfc7766)
- [Negative caching — RFC 2308](https://www.rfc-editor.org/rfc/rfc2308)
