# Backend handbook comparison: programmer foundations

Date: 2026-10-24

Source: `references/backend-development-handbook.pdf`, Chapters 1 and 2 (PDF pages 12–58). The source is a reference, not repository instructions. Its examples use Node.js/NestJS; this site keeps PHP/Laravel as its default teaching stack.

## Verdict

The programmer-foundations card now covers the complete topic list shown for handbook Chapters 1 and 2 at an appropriate programmer-foundations depth. This does not mean the site copies every paragraph or Node/NestJS example from the handbook: the documentation owns the same concepts, corrects context where needed, and uses PHP/Laravel examples under the repository rules. The status table records the post-remediation owners.

Status meanings:

- **Covered:** the card owns and explains the topic at a useful foundations depth, although wording and PHP examples differ from the source.
- **Partial:** the idea is present, but important handbook subtopics are missing or scattered.
- **Missing:** no owned foundations explanation was found; a passing mention does not count.

## Chapter 1 — Internet & Networking Fundamentals

| Handbook topic | Status | Current owner or gap |
|---|---|---|
| 1.1 Client-server model | Covered | `01-web-and-request-flow.md`, reinforced in `07-server-side-path.md` |
| 1.2 OSI vs TCP/IP layers | Covered after this review | `14-network-layers-lan-ethernet-arp.md`; now includes the full mapping table and Encapsulation figure |
| 1.3 IPv4, IPv6, private ranges, NAT | Covered | `15-addressing-dhcp-nat-routing-ipv6.md`, `26-subnet-calculations.md`, `27-routing-and-ipv6.md` |
| 1.4 Ports and sockets | Covered | `04-url-ports-http.md` covers the 5-tuple, listening and accepted sockets, ephemeral ports, `TIME_WAIT`, exhaustion and diagnostic symptoms |
| 1.5 TCP reliable ordered byte stream | Covered | `03-tcp-udp-packets.md` owns handshake, teardown, byte stream, loss, ACK, retransmission, windows, congestion, MTU/MSS and diagnosis |
| 1.6 UDP and TCP vs UDP | Covered | `udp.md` owns datagram boundaries, failure modes, comparison and use cases |
| 1.7 DNS | Covered | `02-dns-and-ip.md` owns resolution, cache, records, TTL, negative caching and diagnostics |
| 1.8 TLS and HTTPS | Covered | `06-https-tls-certificates.md` owns the handshake, certificate chain, validation and failure cases |
| 1.9 Typing a URL and pressing Enter | Covered | `01-web-and-request-flow.md`, with the full server-side path in `07-server-side-path.md` |
| 1.10 Proxies and reverse proxies | Covered | `08-server-proxy-api-gateway.md` |
| 1.11 Load balancers | Covered at foundations depth | `31-proxy-policies.md` covers L4/L7, routing policy, health, retries and WebSocket implications |
| 1.12 CDN and edge caching | Covered | `17-proxies-cdn-waf-observability.md`, supported by `10-http-caching-compression.md` |
| 1.13 WebSockets at network level | Covered | `12-realtime-webhooks.md` covers Upgrade, frames, masking, TLS, idle timeout, backoff, resubscription, backpressure and multi-instance routing |
| 1.14 Latency vs bandwidth and useful numbers | Covered | `34-network-performance.md` separates latency, RTT, bandwidth, throughput and jitter; explains BDP and qualified measurements |
| 1.15 Firewalls and VPC | Covered | `35-vpc-firewalls.md` owns VPC, subnets, routes, gateways, NAT, security groups, ACLs, WAF and a public/private layout |
| 1.16 Network troubleshooting tools | Covered | `36-network-troubleshooting.md` provides a bottom-up DNS → route → port → TLS → HTTP ladder and evidence rules |

## Chapter 2 — HTTP in Depth

| Handbook topic | Status | Current owner or gap |
|---|---|---|
| 2.1 HTTP message structure | Covered | `05-http-messages-state.md` |
| 2.2 Safe, idempotent, cacheable methods | Covered | `05-http-messages-state.md`, deepened in `13-api-design.md` |
| 2.3 Status codes | Covered at foundations depth | `05-http-messages-state.md` and `13-api-design.md` |
| 2.4 Headers | Covered at foundations depth | `05-http-messages-state.md`, with topic-specific headers in later lessons |
| 2.5 Content negotiation | Covered | `37-http-content-negotiation.md` owns representations, Accept fields, Content-Type, Vary, 406/415 and a Laravel example |
| 2.6 Cookies | Covered | `22-http-state-and-updates.md` |
| 2.7 Sessions | Covered | `22-http-state-and-updates.md` |
| 2.8 CORS | Covered | `11-same-origin-cors.md` |
| 2.9 HTTP caching | Covered | `10-http-caching-compression.md` |
| 2.10 Conditional requests | Covered | `10-http-caching-compression.md` and the lost-update section of `22-http-state-and-updates.md` |
| 2.11 Compression | Covered | `10-http-caching-compression.md` |
| 2.12 Range requests | Covered | `38-http-large-transfers.md` covers Range, 206, Content-Range, 416 and If-Range |
| 2.13 Multipart and file uploads | Covered | `38-http-large-transfers.md` covers boundaries, per-part headers, trust limits, streaming and direct-to-storage trade-offs |
| 2.14 Chunked transfer encoding and streaming | Covered | `38-http-large-transfers.md` separates HTTP/1.1 chunked framing from application streaming and HTTP/2/3 frames |
| 2.15 HTTP/1.0 vs 1.1 vs 2 vs 3 | Covered | `16-http2-http3-quic.md`, with HTTP/1.1 semantics introduced earlier |
| 2.16 Keep-alive, connection management, timeouts | Covered | `39-http-connections-timeouts.md` owns persistence, HTTP vs TCP keepalive, pools, hop-by-hop fields and timeout budgets |
| 2.17 Redirects | Covered | `40-http-redirects.md` compares 301/302/303/307/308, PRG, loops, chains, caching and open redirects |
| 2.18 HTTPS and HSTS | Covered | `06-https-tls-certificates.md` now covers the header, first-request gap, preload and operational cautions |
| 2.19 Polling, long polling, SSE and WebSockets | Covered | `12-realtime-webhooks.md` compares all four and provides an SSE experiment |

## Remediation result

All ten documented gaps were assigned to a topic-owned lesson on 2026-10-24. Arabic and English pages cover the same concepts. The source remains a reference rather than text to copy; PHP/Laravel remains the default implementation stack.
