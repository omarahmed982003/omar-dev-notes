---
title: 15. HTTP/2, HTTP/3, and QUIC
description: Binary framing, multiplexed streams, and QUIC's transport over UDP.
---

## HTTP semantics and transport

Methods, status codes, and header meanings remain broadly consistent across HTTP versions, while framing and transport change. HTTP/1.1 uses its familiar textual message format, HTTP/2 uses binary frames over TCP, and HTTP/3 runs over QUIC.

## HTTP/2 multiplexing

HTTP/2 splits one connection into streams, allowing several requests and responses to progress concurrently. HPACK compresses headers. TCP still exposes every stream to transport head-of-line blocking when a missing packet delays the ordered byte stream.

## QUIC and HTTP/3

QUIC implements reliable streams, retransmission, and congestion control over UDP and integrates TLS 1.3. Loss in one stream does not block delivery in unrelated streams. Connection IDs also help a connection survive a change between Wi-Fi and mobile data.

Using UDP does not make HTTP/3 unreliable; QUIC supplies the reliability above UDP. Clients negotiate protocol support and may fall back to HTTP/2 or HTTP/1.1. Measure real behavior because distance, loss, server configuration, and resource sizes affect performance.

## Check your understanding

Multiplexing allows multiple logical streams to share a connection. QUIC reduces cross-stream blocking by maintaining ordering independently per stream.
