---
title: "MTU: why small exchanges work while large transfers stall"
description: "Packet size, MTU, MSS, path discovery, and evidence that distinguishes network-size problems from application delays."
sidebar:
  order: 18
prev: {"link":"/en/programming-basics/27-routing-and-ipv6/","label":"Choose a route and read IPv6 addresses"}
next: {"link":"/en/programming-basics/29-browser-scheduling/","label":"Load scripts and schedule browser tasks"}
---

<span class="foundations-reading-scope" aria-hidden="true"></span>

A connection opens and a small response arrives, but a large upload stalls. Possible causes include application waiting, slow storage, deadlines, and packet-size restrictions along the path. This lesson investigates the last hypothesis.

Prerequisites: IP carries packets; TCP divides a byte stream into segments and recovers missing bytes. FIN/RST and connection closure belong in the [TCP lesson](/en/programming-basics/03-tcp-udp-packets/).

**When to read:** this is depth after TCP and a local request, not a prerequisite for first HTML. On a first read, understand file versus packet size and the calculation below; return to path diagnosis later.

## A file is not one packet

A 10 MB file need not be sent as one packet. Applications write bytes; networking layers divide them and add control information.

**MTU, Maximum Transmission Unit**, limits the higher-layer payload a link can carry. With an IP MTU of 1500 bytes, IP and transport headers consume part of that capacity.

**MSS, Maximum Segment Size**, concerns TCP data excluding TCP/IP headers. As a simplified calculation, MTU 1500 minus a 20-byte IPv4 header and 20-byte TCP header leaves 1460 bytes. Options or additional encapsulation change this; 1460 is not a universal setting.

## First-pass stop: calculate without changing settings

With 1500 bytes and 20-byte IP and TCP headers, 1460 remains for TCP data in this no-options model. This is not a universal setting. A 10 MB file needs many transport pieces, not one packet.

Return after a local application for the remaining depth: tightest links, fragmentation, path-size discovery, and evidence separating transfer from server processing. Do not change a real network's MTU based on this calculation.

## A path contains multiple links

Suppose one link accepts 1500 bytes but a tunnel along the route permits only 1400. The **path MTU** follows the tightest size restriction along that path. Routes can change; your interface's value does not describe the entire route.

Oversized-packet handling depends on the IP version and flags. IPv4 can permit fragmentation, while **Don't Fragment** prohibits it. IPv6 routers do not fragment on the sender's behalf; the sending endpoint must respect path limits.

**Path MTU Discovery** comprises mechanisms to find a usable path size. Some rely on size-related ICMP messages; other packet-layer mechanisms probe and validate size without relying solely on those messages.

Indiscriminately filtering control traffic can break discovery and create a connection that appears established while data stalls.

## Gather evidence

Use controlled small and large transfers between systems you own. Record application timing, received-byte evidence, and packet observations. A **packet capture** records traffic and can expose sensitive contents, so scope it to your lab.

On Windows, an IPv4 ICMP test with fragmentation prohibited is:

```powershell
ping -4 -f -l 1472 example.com
```

1472 is the ICMP payload in this test. Adding a basic 20-byte IPv4 header and 8-byte ICMP header gives 1500 bytes before link-layer framing. Actual headers, destination, and path determine whether that model applies.

An explicit fragmentation-needed response provides size evidence; a timeout alone does not, because ICMP may be filtered.

This does not directly test TCP or justify a production MTU change. Inspect TCP progress, retransmissions, size-related messages, and application state for a controlled transfer.

## Network transfer versus application processing

If logs show all upload bytes arrived before compression or video conversion began, the apparent stall can be computation or storage after network delivery. If transfer stops early with repeated retransmissions and size-related evidence, investigate the path.

A **checksum** detects some accidental corruption. A **retransmission** repeats data inferred lost. Neither encrypts the connection nor explains the cause of loss by itself.

## Diagnostic exercise

A small request succeeds but a large upload fails. Before accepting a proposal to lower MTU, identify evidence distinguishing a path problem from a server that has already received the upload and is still processing it.

<details><summary>Reasoning and answer</summary>

Compare application received-byte counts and timing with transport progress. A complete upload followed by high CPU or storage activity points toward processing. Early stalled transfer with size messages or retransmissions supports path investigation.

Controlled size comparisons help; ping success or failure alone does not establish TCP behavior. Change one variable in a lab and measure again.

</details>

## References

- [IPv4 Path MTU Discovery — RFC 1191](https://www.rfc-editor.org/rfc/rfc1191)
- [IPv6 Path MTU Discovery — RFC 8201](https://www.rfc-editor.org/rfc/rfc8201)
- [Microsoft ping](https://learn.microsoft.com/en-us/windows-server/administration/windows-commands/ping)
