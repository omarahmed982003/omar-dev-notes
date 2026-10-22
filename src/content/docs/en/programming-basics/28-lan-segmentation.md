---
title: "Segment networks and prevent frame loops"
description: "Segment networks and prevent frame loops"
sidebar:
  order: 14
prev: {"link":"/en/programming-basics/networking-next/","label":"Networking and the web"}
next: {"link":"/en/programming-basics/18-wifi-practical-basics/","label":"Connect to Wi-Fi and diagnose problems"}
---

<span class="foundations-reading-scope" aria-hidden="true"></span>
An office needs staff and guests separated while sharing switches. It also needs spare links in case a cable fails. Separation and preventing loops solve different problems; follow each with a concrete example.

Prerequisites: a **switch** connects local devices; a **frame** is a link-layer data unit; a **MAC address** identifies an interface on that link. Review [local networking](/en/programming-basics/14-network-layers-lan-ethernet-arp/) if needed.

## Foundation: one local message need not reach the whole office

A **broadcast** frame targets devices throughout one local broadcast domain. For example, an ARP question about an IPv4 neighbor reaches eligible devices locally, not the whole internet.

**ARP, Address Resolution Protocol**, asks for the MAC address corresponding to a local IPv4 address. A **broadcast domain** defines how far that broadcast travels.

If staff and guests share one domain, guest broadcasts reach staff ports too. Logical separation does not necessarily require buying a separate switch for every group.

## VLAN: one switch, separate local groups

A **VLAN, Virtual Local Area Network**, divides a switched network into separate broadcast domains. Numbers10 and20 are administrative identifiers, not IP addresses.

This is a paper example, not instructions to reconfigure your real router:

| Device | Logical group | Example address |
|---|---|---|
| Staff laptop A | VLAN 10 |192.168.10.20/24|
| Staff printer P | VLAN 10 |192.168.10.30/24|
| Guest G | VLAN 20 |192.168.20.20/24|

`/24` assigns the first24bits to the network; [subnet calculations](/en/programming-basics/26-subnet-calculations/) explain the arithmetic. Assume the example addresses are configured correctly.

1. A sends an ARP question for P.
2. The switch forwards that broadcast to eligible VLAN10 ports, not VLAN20.
3. P replies; switches learn source MAC addresses and their ports.
4. Once the destination is known, ordinary data frames use the appropriate port rather than all ports.

For an unknown destination, the switch may **flood**, forward a frame through multiple eligible ports within that VLAN. It does not always choose just one output port.

### What if the guest needs the printer?

Communication between VLAN20 and VLAN10 needs **routing**, performed by a router or routing-capable switch, plus a policy allowing the required service.

The host sends a frame to its gateway. The routing function ends the incoming link frame, checks IP routing and access rules, then sends the packet in a new frame for the next link. Sharing a physical chassis does not bypass logical separation.

A VLAN is separation, not encryption or a complete authorization policy. Explicitly control allowed traffic between groups; a VLAN number is not a protective secret.

**First-pass stop:** distinguish traffic within a network from traffic between networks requiring routing and policy. The STP depth below explains redundant Ethernet links; it is not a prerequisite for a first web page.

## Depth: how can a spare link disrupt a network?

Assume switches A,B,C form a triangle. Every side is usable, giving an alternative path after failure. But forwarding broadcasts on every side creates a loop.

A **loop** returns a frame to a point it already crossed. Ordinary Ethernet frames have no IP TTL counter limiting their circulation. TTL belongs to an IP packet; these switches are forwarding a local link frame.

1. A receives a host broadcast and forwards it to B and C.
2. B forwards toward C; C forwards toward B.
3. Copies return to A and continue multiplying, consuming link capacity.
4. Source addresses appear from changing directions, disrupting MAC learning as well.

A **broadcast storm** is this rapid accumulation of broadcast traffic until useful communication suffers. Do not reproduce it by wiring a real home or office loop.


## STP: retain redundancy without an active loop

**STP, Spanning Tree Protocol**, lets switches exchange information and choose a loop-free forwarding topology. They select a root and suitable paths and ports; selected redundant ports do not forward user data.

Assume A is the root and costs select A–B and A–C. B–C does not forward ordinary data in the stable example. Real choices depend on configuration, bridge identifiers, and costs, not just the triangle drawing.

<figure class="teaching-figure">
  <img src="/diagrams/foundations/network/switch-loop-en.svg" alt="A triangle of switches creates a broadcast loop. With STP, A-to-B and A-to-C forward while the redundant B-to-C path does not forward ordinary data in this example." loading="lazy" />
  <figcaption>A physical spare link remains available without every link forwarding this VLAN's data simultaneously.</figcaption>
</figure>

After A–C fails, the protocol can recalculate and enable a path through B–C. Convergence takes time and depends on version and conditions; it is not a promise of instantaneous loss-free recovery.

A non-forwarding data port need not be unplugged or powered off. **RSTP, Rapid Spanning Tree Protocol**, improves convergence under its rules. You need not memorize port-state names to understand why the mechanism exists.

## Separate diagnosis from security

When peers in a VLAN cannot communicate, inspect addresses, membership, links, and MAC learning. Not every failure is an STP fault.

**ICMP, Internet Control Message Protocol**, carries IP errors and diagnostics; ping is one use. Successful ping does not prove HTTP works, and a missing reply does not prove an Ethernet loop.

**ARP spoofing** advertises a false IP-to-MAC mapping. ARP does not authenticate the answer by itself. VLAN separation limits scope but does not make every member trustworthy.

IPv6 uses **NDP, Neighbor Discovery Protocol**, for neighbor discovery and other local functions instead of ARP, with its own protection concerns. Its owner is the [IPv6 lesson](/en/programming-basics/27-routing-and-ipv6/); do not confuse it with STP's loop prevention.

Ethernet and Wi-Fi use different link-frame formats. This triangle models Ethernet switches, not every wireless topology. TCP segments and UDP datagrams belong to the transport layer above the link.

## Check your explanation

<details><summary>Can a guest reach a printer in another VLAN simply by knowing its MAC address?</summary>
No. VLAN membership bounds local forwarding. Cross-network communication needs routing and an allowing policy even when both devices share one switch chassis.
</details>

<details><summary>Why does IP TTL not solve a local broadcast-frame loop?</summary>
The example switches forward Ethernet frames without performing an IP routing step that decrements TTL each time. The link topology needs an appropriate loop-prevention mechanism.
</details>

<details><summary>B–C is connected but does not forward data. Should you immediately disable the protection?</summary>
No. It may be a deliberate STP spare path. Review roles, states, and the topology with the network owner instead of changing a real network blindly.
</details>

VLANs separate broadcast domains; routing connects networks under policy; STP prevents Ethernet forwarding loops while permitting spare physical links.

## References

- [STP loops and path selection — Cisco](https://www.cisco.com/c/en/us/td/docs/switches/lan/c9000/lyr2-fwd/stp/stp-configuration-guide/m-stp.html)
- [ARP — RFC 826](https://www.rfc-editor.org/rfc/rfc826)
- [IPv6 Neighbor Discovery — RFC 4861](https://www.rfc-editor.org/rfc/rfc4861)
