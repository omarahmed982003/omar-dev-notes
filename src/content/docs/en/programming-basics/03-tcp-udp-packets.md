---
title: "Moving data with TCP and UDP"
description: Understand encapsulation, handshakes, ordering, retransmission, and when TCP, UDP, or QUIC supplies the needed behavior.
sidebar:
  order: 10
prev: {"link":"/en/programming-basics/19-dns-protection/","label":"DNS failures and protection"}
next: {"link":"/en/programming-basics/20-transport-diagnostics/","label":"Closing connections and diagnosing packet size"}
---


After DNS (Domain Name System, a distributed system answering queries about domain names) returns an IP (Internet Protocol, the addressing and routing protocol; an IP address identifies a network interface in context) address, data still has to move. A network may lose, delay, or reorder pieces. IP, TCP (Transmission Control Protocol, ordered byte transport with loss recovery; connections can still fail), and UDP (User Datagram Protocol, independent messages without built-in delivery or ordering guarantees) divide the work of handling that problem.

## A number locating bytes

Imagine sending `ABCDEF`: in a simplified stream, ABC starts at100 and DEF at103. A **sequence number** locates bytes in TCP, not a purchase order. A receiver waiting for103 can acknowledge earlier data while missing data is recovered.

Delivered bytes do not prove business success. An **idempotent** operation has the same intended state effect when repeated, such as “set closed,” unlike “add10.” Keep this distinction when retrying.

## From a message to signals

A large page is not sent as one magical object. Data moves down layers, and each layer adds information for its job:

```text
HTTP data
   ↓ + transport header
TCP segment or UDP datagram
   ↓ + IP header
IP packet
   ↓ + local-link header
Ethernet/Wi-Fi frame
   ↓
Bits or signals
```

Headers can contain ports at the transport layer, source and destination IPs at the network layer, TCP sequence numbers and flags, and an IP TTL (Time To Live, a DNS cache lifetime or an IPv4 forwarding limit depending on context) or hop limit. Adding these layers is **encapsulation**; the receiver removes them in reverse.

The NIC (Network Interface Card, hardware providing a network connection) handles the local link, frames, and signals. A router selects the packet's next hop, and an ISP (Internet Service Provider, an organization providing internet connectivity) connects your network to others. Later lessons examine frames, MAC (Media Access Control, an interface address used for local-link communication) addresses, and routing in detail.

## TCP: a reliable, ordered stream

TCP presents an ordered **byte stream** to the application. A connection normally begins with a three-way handshake:

```text
Client                         Server
  | -------- SYN ------------> |  request and synchronize
  | <----- SYN + ACK ---------- |  accept and acknowledge
  | -------- ACK ------------> |  client acknowledges
  | ===== Application data ===> |
```

Four values distinguish a connection: source IP, source port, destination IP, and destination port. One computer can therefore open many connections to the same server.

### How TCP hides loss and reordering

```text
Sent:         1  2  3  4
Received:     1  2  _  4
Action:       acknowledge progress; retransmit 3
Application:  1  2  3  4
```

Sequence numbers locate data, and acknowledgements tell the sender what arrived. When TCP infers loss, it retransmits and holds later data until it can expose an ordered stream.

:::note
A TCP ACK means the transport layer received the required data. It does not mean PHP (a programming language commonly used for server-side web processing) stored an order or that the business operation succeeded.
:::

## Two windows solve two problems

- **Flow control** protects the receiver through its advertised receive window.
- **Congestion control** protects the network by changing the sender's congestion window in response to congestion and loss signals.
- The smaller window helps limit how much data may remain in flight.

Retransmission is not free: it adds delay, and loss may cause congestion control to reduce the sending rate.

## UDP: independent datagrams

UDP sends independent messages without a traditional handshake. It does not itself guarantee arrival, order, or duplicate suppression. Its header is simpler, while the application or a higher protocol decides whether to add those behaviors.

| Property | TCP | UDP |
|---|---|---|
| Data shape | Byte stream | Independent datagrams |
| Traditional connection handshake | Yes | No |
| Built-in ordering and retransmission | Yes | No |
| Examples | HTTP/1.1 (Hypertext Transfer Protocol, the rules for web requests and responses) and HTTP/2, mail, files | DNS, games, live media |

“UDP is faster” is an oversimplification. It may have less protocol overhead, but performance depends on the network and what the application builds above it.

## Where QUIC fits

HTTP/3 uses **QUIC (a UDP-based transport protocol adding reliable streams and protected communication) over UDP**. UDP supplies a widely deployable base; QUIC adds reliability, encryption, congestion control, and multiple streams. Using UDP does not force a higher-level protocol to lose data.

## Run a network experiment

```bash
ping example.com
tracert example.com
```

Use `traceroute` instead of `tracert` on Linux and macOS. A ping result may resemble:

```text
Reply from 93.184.216.34: time=42ms
```

- `ping` uses ICMP (Internet Control Message Protocol, network diagnostics and error messages), not TCP or UDP.
- `time=42ms` is an approximate round trip, not page-load time.
- No reply does not prove the host is down; ICMP may be filtered.
- `tracert` shows visible hops, while `*` can mean a hop chose not to answer.

## Common mistakes

- Mixing up segment, packet, and frame; each belongs to a layer.
- Treating a TCP ACK as application success.
- Assuming TCP prevents disconnection; it repairs some loss but a connection can still fail.
- Assuming UDP is always unsuitable; it is a useful base when a higher protocol supplies its chosen behavior.
- Treating `ping` as a complete HTTP test; they use different protocols.

## Practical problems

<details><summary>A payment was charged twice even though the app uses TCP. Why did TCP not prevent it?</summary><p>TCP prevents duplicate byte delivery within a connection, but it cannot stop a client from retrying an HTTP request after an ambiguous disconnect. The application needs an idempotency key or transactional duplicate protection.</p></details>

<details><summary>Packet 4 arrives before packet 3. What does a TCP application observe?</summary><p>TCP holds the later data and waits for or requests the missing data, then exposes an ordered stream. The cost is delayed reading until the gap closes.</p></details>

<details><summary>Why might a game choose UDP?</summary><p>Old state may become useless before a retransmission arrives. The game can send newer state and implement the ordering or recovery policy that matches its needs.</p></details>

## Check your understanding

1. Order the units during sending: **application data → segment/datagram → IP packet → frame.**
2. How do flow control and congestion control differ? **The first protects the receiver; the second protects the network.**
3. Is HTTP/3 unreliable because it uses UDP? **No. QUIC adds the required reliability, encryption, and congestion control.**


## Next step

After completing this practice, continue with [Closing connections and diagnosing packet size](/en/programming-basics/20-transport-diagnostics/).
