---
title: "Calculate a subnet from its address"
description: "Calculate a subnet from its address"
sidebar:
  order: 6
prev: {"link":"/en/programming-basics/15-addressing-dhcp-nat-routing-ipv6/","label":"Device addresses and connection settings"}
next: {"link":"/en/programming-basics/27-routing-and-ipv6/","label":"Choose a route and read IPv6 addresses"}
---

Two device addresses end in .20 and .70. Are they in one subnet? The address alone is insufficient: the mask identifies network bits. Calculate with /24 and /26 after reviewing binary representation.


## CIDR and subnetting

A **subnet** shares an address prefix. A **subnet mask** identifies those network bits. **CIDR, Classless Inter-Domain Routing**, writes the prefix length after a slash. Review [binary representation](/en/programming-basics/computer-fundamentals/02-binary-data-representation/) before calculating.

IPv4 is 32 bits, displayed as four 8-bit groups from 0 to 255. A /24 leaves eight host bits: 256 total addresses. In an ordinary IPv4 subnet of this size, reserve the network and broadcast addresses, leaving 254 hosts. Do not subtract two indiscriminately: /31 point-to-point links and /32 host routes have different uses.

### Calculate /24 and /26

192.168.1.0/24 has mask 255.255.255.0, network .0, broadcast .255, and ordinary host addresses .1–.254. A device at 192.168.1.20/24 treats .70 as local.

192.168.1.0/26 leaves six bits: 64 addresses. Its mask is 255.255.255.192; the final byte is 11000000. The range is .0–.63, hosts .1–.62, broadcast .63. Address .70 belongs to .64/26 and needs a route from .20/26.

Bitwise **AND** outputs 1 only when both input bits are 1:

```text
20:   00010100
192:  11000000
AND:  00000000 -> network .0
```

70 is 01000110; AND with the same mask gives 01000000, or .64. **Worked check:** .62 is local to .20/26; .65 is not. Check routing and access policy instead of trying to send to a remote server's MAC (Media Access Control, an interface address used for local-link communication).

In `/24`, the first 24 bits identify the network and the remaining bits identify hosts. A device applies the mask to decide whether a destination is local or must go through the default gateway. A longer prefix creates smaller networks with fewer host addresses.
