---
title: "How devices communicate on a local network"
description: How application data crosses network layers and how devices communicate inside a LAN.
sidebar:
  order: 2
prev: {"link":"/en/programming-basics/01-web-and-request-flow/","label":"The internet, the web, and a request's journey"}
next: {"link":"/en/programming-basics/15-addressing-dhcp-nat-routing-ipv6/","label":"Device addresses and connection settings"}
---

<span class="foundations-reading-scope" aria-hidden="true"></span>

## Two computers and a router

```text
Laptop A ── Switch ── Laptop B
               │
             Router ── other networks
```

A **switch** connects local devices; a **router** connects networks. Assume A=192.168.1.20 and B=192.168.1.30, both /24: the first24bits identify the subnet. A recognizes B as local, uses ARP to ask for B’s interface address, and sends a **frame** through the switch. **MAC** addresses identify interfaces on the link.

For a remote destination, the local frame targets the router’s interface while the IP destination remains the remote host in this no-translation example. **Trace:** B→A targets A locally; B→another network targets the router locally.

## Start with one trip across a local network

Suppose a laptop requests a page. A network card does not transmit the URL (Uniform Resource Locator, an address identifying a resource and how to access it) as-is. Data moves down layers, and each layer adds information for its responsibility:

```text
HTTP data → TCP segment / UDP datagram → IP packet → Ethernet frame → signals
```

Layers are responsibility boundaries, not necessarily separate devices.

HTTP (Hypertext Transfer Protocol, the rules for web requests and responses) defines request meaning, TCP (Transmission Control Protocol, ordered byte transport with loss recovery; connections can still fail) manages ordered delivery, IP (Internet Protocol, the addressing and routing protocol; an IP address identifies a network interface in context) routes between networks, and Ethernet/Wi-Fi move one frame over the current link.

For a remote destination, the laptop needs the local default gateway's MAC (Media Access Control, an interface address used for local-link communication), not the remote server's MAC. Every router removes the current link frame and creates another for the next hop.

IP identifies the routed destination; MAC addresses change hop by hop.

ARP (Address Resolution Protocol, finding a local-link MAC address for an IPv4 address) asks a local IPv4 question: “Who has this IP, and what is your MAC?” The cached answer is not authentication; ARP spoofing can advertise a malicious mapping on the LAN (Local Area Network, a network within an area such as a home or office).

## TCP/IP layers

Layers separate responsibilities. HTTP defines application messages, TCP or UDP (User Datagram Protocol, independent messages without built-in delivery or ordering guarantees) transports them, IP routes packets between networks, and Ethernet or Wi-Fi moves frames across the current link.

The **OSI model** is a seven-layer teaching vocabulary behind names such as Layer 4 and Layer 7. The **TCP/IP model** is closer to the protocol stack used by the Internet. Their mapping is approximate: the upper OSI layers usually sit inside the TCP/IP Application layer.

| OSI layer | TCP/IP layer | Data unit | Examples | Addressing |
|---|---|---|---|---|
| 7 Application | Application | Message / Data | HTTP, DNS, SMTP, WebSocket | URLs, hostnames |
| 6 Presentation | Application | Message / Data | Encoding, compression, TLS roughly | — |
| 5 Session | Application | Message / Data | Session setup and teardown roughly | — |
| 4 Transport | Transport | Segment / Datagram | TCP, UDP, QUIC over UDP | Ports |
| 3 Network | Internet | Packet | IPv4, IPv6, ICMP | IP addresses |
| 2 Data link | Link | Frame | Ethernet, Wi-Fi, ARP | MAC addresses |
| 1 Physical | Link | Bits | Copper, fiber, radio | — |

This table is a reasoning aid, not a claim that every protocol fits one box perfectly. TLS, for example, serves applications while depending on a transport below it.

## Encapsulation: what each layer adds

**Encapsulation** means that a layer treats the complete unit from the layer above as its payload, then adds the metadata needed for its own responsibility. The receiver performs **decapsulation** in reverse until the application receives the original bytes.

<figure class="teaching-figure teaching-figure-wide">
  <picture>
    <source media="(max-width: 500px)" srcset="/diagrams/foundations/network/encapsulation-mobile.svg" />
    <img src="/diagrams/foundations/network/encapsulation.svg" alt="HTTP request bytes become the payload of a TCP segment; IP wraps that segment in a packet; Ethernet wraps the packet with a header and FCS." loading="lazy" />
  </picture>
  <figcaption>The boxes show containment, not scale. In a common no-options case, a 1500-byte Ethernet MTU minus a 20-byte IPv4 header and a 20-byte TCP header leaves an MSS near 1460 bytes. Options, tunnels, and other links change the calculation.</figcaption>
</figure>

The TCP header carries fields such as ports and sequence acknowledgements. The IP header carries source and destination IP addresses. The Ethernet header carries MAC addresses for the current local hop, while the **FCS (Frame Check Sequence)** helps the link detect frame corruption.

## LAN, Ethernet, and switches

A LAN connects devices within a local area. An Ethernet frame contains source and destination MAC addresses, a payload type, data, and an error-detection value. A switch learns which MAC address appears on each port and forwards frames to the appropriate port.

MAC addresses serve the current local link; IP addresses identify endpoints across routed networks. Neither replaces the other.

## ARP and the default gateway

ARP discovers the MAC address associated with an IPv4 address on the LAN. A host broadcasts a request and caches the reply. For a remote IP, the host sends the frame to the default gateway's MAC address while the packet keeps the remote server's IP as its destination.

## Switches and routers

A switch forwards local frames using MAC addresses. A router connects IP networks and selects a next hop using its routing table.

A home device may combine routing, switching, Wi-Fi, DHCP (Dynamic Host Configuration Protocol, automatic network configuration for hosts), and NAT (Network Address Translation, rewriting IP addresses at a network boundary), but these remain distinct functions.

:::note[Deep dive: encapsulation changes at every hop]
When an application sends HTTP, HTTP data becomes payload in a TCP segment, the segment becomes payload in an IP packet, and the packet becomes payload in a link-layer frame. A router does not forward one Ethernet frame unchanged across the Internet. It removes the incoming frame, decrements the hop limit or TTL, chooses a route, and builds a new frame for the next link. Endpoint IP addresses normally remain while MAC addresses change at each link; NAT or a proxy can deliberately change other boundaries.

An **L4 load balancer** primarily routes using transport protocol, IP addresses, and ports, so it does not normally inspect an HTTP URL. An **L7 load balancer** terminates HTTP or TLS at some point and understands paths and headers, allowing `/api` and `/images` to reach different pools. The layer number describes the information available to the decision, not a claim that the product implements only one layer.
:::

## Practical exercises

<details><summary>Why is the remote server's MAC absent from the outgoing frame?</summary><p>Ethernet covers the local link. The laptop addresses its default gateway, and each router creates a new frame for the next link.</p></details>

<details><summary>Order segment, packet, and frame</summary><p>Application data enters a transport segment, then an IP packet, then a link frame. The receiver decapsulates in reverse.</p></details>

## Check your understanding

Why are both IP and MAC addresses needed? IP identifies an endpoint across networks; MAC delivers the frame on the current local link.

## Next step

[Device addresses and connection settings](/en/programming-basics/15-addressing-dhcp-nat-routing-ipv6/).
