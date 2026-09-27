---
title: "How devices communicate on a local network"
description: How application data crosses network layers and how devices communicate inside a LAN.
sidebar:
  order: 2
prev: {"link":"/en/programming-basics/01-web-and-request-flow/","label":"The internet, the web, and a request's journey"}
next: {"link":"/en/programming-basics/28-lan-segmentation/","label":"Segment networks and prevent frame loops"}
---


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

Layers are responsibility boundaries, not necessarily separate devices. HTTP (Hypertext Transfer Protocol, the rules for web requests and responses) defines request meaning, TCP (Transmission Control Protocol, ordered byte transport with loss recovery; connections can still fail) manages ordered delivery, IP (Internet Protocol, the addressing and routing protocol; an IP address identifies a network interface in context) routes between networks, and Ethernet/Wi-Fi move one frame over the current link.

For a remote destination, the laptop needs the local default gateway's MAC (Media Access Control, an interface address used for local-link communication), not the remote server's MAC. Every router removes the current link frame and creates another for the next hop. IP identifies the routed destination; MAC addresses change hop by hop.

ARP (Address Resolution Protocol, finding a local-link MAC address for an IPv4 address) asks a local IPv4 question: “Who has this IP, and what is your MAC?” The cached answer is not authentication; ARP spoofing can advertise a malicious mapping on the LAN (Local Area Network, a network within an area such as a home or office).

## TCP/IP layers

Layers separate responsibilities. HTTP defines application messages, TCP or UDP (User Datagram Protocol, independent messages without built-in delivery or ordering guarantees) transports them, IP routes packets between networks, and Ethernet or Wi-Fi moves frames across the current link. Each layer adds a header during encapsulation and the receiving side removes it.

| Layer | Examples | Data unit |
|---|---|---|
| Application | HTTP, DNS (Domain Name System, a distributed system answering queries about domain names), TLS (Transport Layer Security, rules for establishing an authenticated protected connection) | Message/Data |
| Transport | TCP, UDP | Segment/Datagram |
| Internet | IPv4, IPv6 | Packet |
| Link | Ethernet, Wi-Fi | Frame |

## LAN, Ethernet, and switches

A LAN connects devices within a local area. An Ethernet frame contains source and destination MAC addresses, a payload type, data, and an error-detection value. A switch learns which MAC address appears on each port and forwards frames to the appropriate port.

MAC addresses serve the current local link; IP addresses identify endpoints across routed networks. Neither replaces the other.

## ARP and the default gateway

ARP discovers the MAC address associated with an IPv4 address on the LAN. A host broadcasts a request and caches the reply. For a remote IP, the host sends the frame to the default gateway's MAC address while the packet keeps the remote server's IP as its destination.

## Switches and routers

A switch forwards local frames using MAC addresses. A router connects IP networks and selects a next hop using its routing table. A home device may combine routing, switching, Wi-Fi, DHCP (Dynamic Host Configuration Protocol, automatic network configuration for hosts), and NAT (Network Address Translation, rewriting IP addresses at a network boundary), but these remain distinct functions.

## Practical exercises

<details><summary>Why is the remote server's MAC absent from the outgoing frame?</summary><p>Ethernet covers the local link. The laptop addresses its default gateway, and each router creates a new frame for the next link.</p></details>

<details><summary>Order segment, packet, and frame</summary><p>Application data enters a transport segment, then an IP packet, then a link frame. The receiver decapsulates in reverse.</p></details>

## Check your understanding

Why are both IP and MAC addresses needed? IP identifies an endpoint across networks; MAC delivers the frame on the current local link.


## Next step

After completing this practice, continue with [Segment networks and prevent frame loops](/en/programming-basics/28-lan-segmentation/).
