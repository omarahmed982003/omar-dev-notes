---
title: 14. DHCP, NAT, subnetting, routing, and IPv6
description: Address assignment, private and public networks, CIDR, routes, and IPv6 fundamentals.
---

## DHCP

DHCP supplies an IP address, subnet mask, default gateway, DNS servers, and a lease time. The common exchange is Discover, Offer, Request, and Acknowledgement. A client address may change when the lease changes.

## Private addresses and NAT

Private IPv4 ranges include `10.0.0.0/8`, `172.16.0.0/12`, and `192.168.0.0/16`. NAT rewrites addresses at a boundary, while PAT uses ports to distinguish many connections behind one public IP. Port forwarding maps selected inbound traffic to an internal host. Carrier-grade NAT may prevent direct inbound connections even when a home router is configured.

## CIDR and subnetting

In `/24`, the first 24 bits identify the network and the remaining bits identify hosts. A device applies the mask to decide whether a destination is local or must go through the default gateway. A longer prefix creates smaller networks with fewer host addresses.

## Routing and IPv6

A routing table lists prefixes, next hops, interfaces, and metrics. Routers prefer the most specific matching prefix, then use a default route when no specific entry matches.

IPv6 uses 128-bit addresses such as `2001:db8::1`. It uses Neighbor Discovery instead of ARP. `::1` is loopback, and `fe80::/10` contains link-local addresses. IPv6 still requires firewall and access-control policies.

## Check your understanding

NAT translates traffic at a boundary; port forwarding adds an inbound mapping to one internal service.
