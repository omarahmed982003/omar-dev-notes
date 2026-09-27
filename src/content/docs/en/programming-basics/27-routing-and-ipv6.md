---
title: "Choose a route and read IPv6 addresses"
description: "Choose a route and read IPv6 addresses"
sidebar:
  order: 7
prev: {"link":"/en/programming-basics/26-subnet-calculations/","label":"Calculate a subnet from its address"}
next: {"link":"/en/programming-basics/02-dns-and-ip/","label":"How a domain name becomes an address"}
---

After deciding whether a destination is local, choose the next device along the route. **Routing** selects a path using a table. A **next hop** is the device receiving the packet next. Start with a small table before extending addresses to IPv6.


## Routing and IPv6

A routing table lists prefixes, next hops, interfaces, and metrics. Routers prefer the most specific matching prefix, then use a default route when no specific entry matches.

IPv6 uses 128-bit addresses such as `2001:db8::1`. It uses Neighbor Discovery instead of ARP. `::1` is loopback, and `fe80::/10` contains link-local addresses. IPv6 still requires firewall and access-control policies.

## Choosing routes and reading IPv6

A **prefix** is the shared network bit sequence; a **next hop** is the next forwarding device. A **metric** is a route cost used under the router's policy. In an ordinary selected routing table, prefer the longest matching prefix before comparing suitable equal-prefix alternatives.

**Worked check:** With 0.0.0.0/0 via A, 192.168.0.0/16 via B, and 192.168.1.0/24 via C, address 192.168.1.70 selects C, 192.168.2.8 selects B, and 203.0.113.8 selects A.

IPv6 usually writes 128 bits as eight 16-bit hexadecimal groups. Omit leading zeroes in a group; use :: once to compress consecutive zero groups. 2001:db8::1 is for examples, ::1 is loopback, and fe80::/10 is the link-local range.

**SLAAC, Stateless Address Autoconfiguration**, forms addresses using router information. **Router Advertisements** also identify default routers. **DHCPv6** can supply addresses or other settings depending on the network; the default route is normally learned from router advertisements rather than DHCPv6. **NDP (Neighbor Discovery Protocol, IPv6 discovery of neighbors and routers)** discovers neighbors and local-link information. A **firewall** applies allow/deny policy; NAT does not replace it.

## A device needs more than an IP address

Joining Wi-Fi normally requires an address, local prefix, default gateway, and DNS (Domain Name System, a distributed system answering queries about domain names) resolver. DHCP (Dynamic Host Configuration Protocol, automatic network configuration for hosts) commonly supplies them:

```text
Discover → Offer → Request → Acknowledge
```

The subnet/CIDR (Classless Inter-Domain Routing, specifying a network prefix length after a slash) prefix decides which destinations are local. Local traffic stays on the link; non-local traffic goes to a gateway. A router selects the most specific matching route and next hop.

NAT (Network Address Translation, rewriting IP addresses at a network boundary) is not routing. Routing selects a path; NAT changes addresses or ports. Home PAT (Port Address Translation, distinguishing connections behind one address through port mappings) lets many devices share one public IPv4 address through port mappings. That is not a firewall and does not automatically secure the internal network.

IPv6 expands address space and uses Neighbor Discovery rather than ARP (Address Resolution Protocol, finding a local-link MAC address for an IPv4 address). Notation changes, while prefixes, routes, and next-hop decisions remain fundamental.
