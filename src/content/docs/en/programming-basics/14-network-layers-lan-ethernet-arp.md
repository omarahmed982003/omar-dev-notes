---
title: 13. TCP/IP layers, LANs, Ethernet, and ARP
description: How application data crosses network layers and how devices communicate inside a LAN.
---

## TCP/IP layers

Layers separate responsibilities. HTTP defines application messages, TCP or UDP transports them, IP routes packets between networks, and Ethernet or Wi-Fi moves frames across the current link. Each layer adds a header during encapsulation and the receiving side removes it.

| Layer | Examples | Data unit |
|---|---|---|
| Application | HTTP, DNS, TLS | Message/Data |
| Transport | TCP, UDP | Segment/Datagram |
| Internet | IPv4, IPv6 | Packet |
| Link | Ethernet, Wi-Fi | Frame |

## LAN, Ethernet, and switches

A LAN connects devices within a local area. An Ethernet frame contains source and destination MAC addresses, a payload type, data, and an error-detection value. A switch learns which MAC address appears on each port and forwards frames to the appropriate port.

MAC addresses serve the current local link; IP addresses identify endpoints across routed networks. Neither replaces the other.

## ARP and the default gateway

ARP discovers the MAC address associated with an IPv4 address on the LAN. A host broadcasts a request and caches the reply. For a remote IP, the host sends the frame to the default gateway's MAC address while the packet keeps the remote server's IP as its destination.

## Switches and routers

A switch forwards local frames using MAC addresses. A router connects IP networks and selects a next hop using its routing table. A home device may combine routing, switching, Wi-Fi, DHCP, and NAT, but these remain distinct functions.

## Check your understanding

Why are both IP and MAC addresses needed? IP identifies an endpoint across networks; MAC delivers the frame on the current local link.
