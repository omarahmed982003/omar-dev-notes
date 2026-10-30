---
title: "How HTTP/2 and HTTP/3 differ"
description: Binary framing, multiplexed streams, and QUIC's transport over UDP.
sidebar:
  order: 29
prev: {"link":"/en/programming-basics/13-api-design/","label":"Designing data interfaces"}
next: {"link":"/en/programming-basics/17-proxies-cdn-waf-observability/","label":"Deliver content and understand the origin server"}
---

<span class="foundations-reading-scope" aria-hidden="true"></span>

On a first pass, compare the table: message meaning remains while connection sharing changes. The remaining detail follows TCP and HTTP; configuring HTTP/3 is not required for a first PHP application.

## The same three requests under loss

A **stream** is a logical message flow within a shared connection. A **protocol frame** carries a type, stream identifier, and data according to its protocol; it need not mean an Ethernet frame.

Assume resources A,B,C and loss affecting A. This compares ordering, not measured speed:

| Version and assumption | Before loss | Effect |
|---|---|---|
| HTTP/1.1, one connection, sequential requests | A thenB thenC | Waiting for A delays starting the others in this model; browsers can open more connections |
| HTTP/2 over one TCP connection | A,B,C pieces interleave | Missing TCP data delays later byte delivery for all its streams until recovery |
| HTTP/3 over QUIC streams | A,B,C pieces interleave | Recovering A does not impose its byte ordering on B/C; congestion and shared resources still matter |

**Check:** HTTP/3 does not remove every delay. Separate cross-stream transport ordering from capacity and application work.

## HTTP semantics and transport

Methods, status codes, and header meanings remain broadly consistent across HTTP versions, while framing and transport change. HTTP/1.1 uses its familiar textual message format, HTTP/2 uses binary frames over TCP, and HTTP/3 runs over QUIC.

The practical problem is waiting for resources: HTTP/1.1 browsers may use multiple connections rather than serialize everything on one. Later versions change sharing and transport, not GET or 404 meaning.

## HTTP/2 multiplexing

**Multiplexing** interleaves logical streams on one connection instead of dedicating a connection to each. HTTP/2 splits one connection into streams, allowing several requests and responses to progress concurrently. **HPACK** compresses HTTP/2 header fields. TCP still exposes every stream to transport head-of-line blocking when a missing packet delays the ordered byte stream.

## QUIC and HTTP/3

QUIC implements reliable streams, retransmission, and congestion control over UDP and integrates TLS (Transport Layer Security, rules for establishing an authenticated protected connection) 1.3. Loss in one stream does not block delivery in unrelated streams.

Connection IDs also help a connection survive a change between Wi-Fi and mobile data.

Using UDP does not make HTTP/3 unreliable; QUIC supplies the reliability above UDP. Clients negotiate protocol support and may fall back to HTTP/2 or HTTP/1.1. Measure real behavior because distance, loss, server configuration, and resource sizes affect performance.

## Header compression and early data

**HPACK** compresses HTTP/2 header fields; **QPACK** compresses HTTP/3 fields. QPACK reduces cross-stream dependency problems but does not eliminate all waiting: a stream can depend on a compression-table update.

**RTT, Round-Trip Time**, measures a round trip. **0-RTT** sends early application data when resuming an eligible connection. Such data can be replayed; state-changing operations need explicit protections.

**Connection IDs** can support **migration**, changing the network path while retaining a connection, subject to endpoint support, validation, and network policy.

**Worked check:** Data for an image stream is lost in HTTP/3. Another independent stream whose required data arrived can progress, but shared congestion control or header dependencies may still affect it.

HTTP/2 over TCP can withhold later bytes for all streams on that connection until the gap is filled. Compare under matching conditions rather than assuming the newer protocol wins.

:::note[Deep dive: where head-of-line blocking occurs]
With HTTP/1.1, a slow response on a connection can block later requests, so browsers opened several connections as mitigation. HTTP/2 multiplexes streams in one TCP connection and removes that HTTP-level queue, but TCP still delivers one ordered byte stream. A lost packet delays delivery of later bytes for every stream on that connection until recovery.

HTTP/3 uses QUIC over UDP. QUIC orders data independently within each stream, so loss in one stream does not prevent delivery of a completed different stream. Congestion control and loss still exist, but the blocking scope changes. QUIC integrates TLS 1.3 and uses connection IDs for migration, allowing a phone to continue a connection across Wi-Fi and mobile networks when state permits.

This does not mean a Laravel worker speaks QUIC directly. A CDN or load balancer commonly terminates HTTP/3 and reaches the application over HTTP/1.1 or HTTP/2. Inspect each hop rather than describing the entire path as one protocol version.
:::

## Practical exercises

<details><summary>Did HTTP/2 change semantics or transport?</summary><p>Core semantics remained while transport gained binary frames, multiplexing, and header compression.</p></details>

<details><summary>Why is HTTP/3 reliable over UDP?</summary><p>QUIC supplies acknowledgements, retransmission, ordering, congestion control, and encryption above UDP.</p></details>

<details><summary>How do you verify the negotiated version?</summary><p>Inspect the browser Network Protocol column or another measurement tool instead of assuming from server support.</p></details>

## Check your understanding

Multiplexing allows multiple logical streams to share a connection. QUIC reduces cross-stream blocking by maintaining ordering independently per stream.
