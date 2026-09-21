---
title: 3. TCP, UDP, and packets
description: Handshake, segments, packets, frames, ACKs, retransmission, flow, and congestion control.
sidebar:
  order: 3
---

Application data is encapsulated as a TCP segment or UDP datagram, then an IP packet, then a local Ethernet/Wi-Fi frame. Headers contain information such as ports, IPs, TCP sequence/flags, and IP TTL/hop limit. Large content is commonly split and reassembled.

TCP provides a reliable ordered byte stream and normally starts with:

```text
Client                         Server
  | -------- SYN ------------> |
  | <----- SYN + ACK ---------- |
  | -------- ACK ------------> |
  | ===== Application Data ===> |
```

Sequence numbers and acknowledgements let TCP reorder data and retransmit loss. An ACK confirms transport receipt, not completion of PHP business logic.

Flow control uses the receiver’s advertised window to avoid overwhelming it. Congestion control changes the sender’s congestion window to protect the network. Effective in-flight data is constrained by both.

UDP sends independent datagrams without a traditional connection, guaranteed delivery, or ordering. It has less protocol overhead and is used by DNS, live media, and games. TCP is common for HTTP/1.1 and HTTP/2. HTTP/3 uses QUIC over UDP; QUIC adds its own reliability, security, and congestion control.

```bash
ping example.com
tracert example.com
```

Use `traceroute` instead of `tracert` on Linux/macOS. Ping uses ICMP, not TCP.
