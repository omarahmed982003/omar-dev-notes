---
title: "Device addresses and connection settings"
description: "Device addresses and connection settings"
sidebar:
  order: 3
prev: {"link":"/en/programming-basics/14-network-layers-lan-ethernet-arp/","label":"How devices communicate on a local network"}
next: {"link":"/en/programming-basics/02-dns-and-ip/","label":"How a domain name becomes an address"}
---

<span class="foundations-reading-scope" aria-hidden="true"></span>

Your device has an address, but how does a router return an Internet reply to the right machine? Read local settings, then follow two translated connections.

Distinguish an IP address, identifying a network interface in context, from a **port**, a receiving endpoint number within a transport protocol. If ports are new, follow the table conceptually and revisit it after [the port lesson](/en/programming-basics/04-url-ports-http/). No router or firewall changes are required.

## Read settings before calculating

On Windows run `ipconfig /all` in PowerShell. Select the connected adapter and read:

| Field | Role | Practice value |
|---|---|---|
| IPv4 Address | Your interface address | 192.168.1.20 |
| Subnet Mask | Identifies network bits | 255.255.255.0 |
| Default Gateway | Next hop without a more specific route | 192.168.1.1 |
| DNS Servers | Servers answering name queries | What your tool displays |

A **default gateway** is not necessarily the DNS server, even if one device performs both roles. These values are examples, not settings to copy. A VPN or multiple adapters may create multiple routes; inspect without editing.

Detailed calculation belongs to [subnet boundaries](/en/programming-basics/26-subnet-calculations/); route selection and IPv6 belong to [routing](/en/programming-basics/27-routing-and-ipv6/).

## DHCP

**DHCP, Dynamic Host Configuration Protocol**, supplies an address, mask, gateway, and DNS settings for a renewable period called a **lease**.

A common initial exchange for an unconfigured client is:

1. **Discover:** find available configuration servers.
2. **Offer:** a server offers settings and a lease.
3. **Request:** the client requests the selected offer.
4. **Acknowledgement:** the server confirms settings.

Renewal need not repeat this entire exchange in exactly the same way. DHCP configures the client; it does not guarantee a remote web application works. Client addresses can change.

## Private addresses and NAT

**Private IPv4** ranges include `10.0.0.0/8`, `172.16.0.0/12`, and `192.168.0.0/16`. They are not directly routed as public Internet destinations.

A **public IP** is globally routable according to its assignment and routes, not proof of a reachable service. **NAT, Network Address Translation**, changes addresses at a network boundary. **PAT, Port Address Translation**, also called NAPT, uses ports with addresses to distinguish connections sharing a public address.

## Two machines using the same local port

This is a paper TCP trace, not configuration to apply. `203.0.113.5` and `198.51.100.10` are documentation addresses; the first plays the public-address role only inside this model. Do not contact them.

Both machines connect to model server `198.51.100.10:443`. Both choose source port 51000, but their internal addresses differ.

| Mapping point | Source IP:port |
|---|---|
| A in | 192.168.1.20:51000 |
| A out | 203.0.113.5:40001 |
| B in | 192.168.1.21:51000 |
| B out | 203.0.113.5:40002 |

The **translation table** retains the mapping needed for returning traffic. Ports 40001 and 40002 are illustrative choices, not a universal router algorithm. This trace uses TCP and one destination; mapping details differ among NAT implementations.

1. A leaves; the router rewrites its **source** to `203.0.113.5:40001`.
2. B leaves using a different mapping, `203.0.113.5:40002`.
3. A reply to `203.0.113.5:40002` matches B's connection.
4. The router rewrites the reply's **destination** to `192.168.1.21:51000` and forwards it according to routing and policy.

The external server sees the translated source, not the original private address. Choosing a route and rewriting addresses/ports are different jobs.

## Mapping limits and inbound connections

If a mapping expires or disappears after the translator restarts, existing connections may fail. An assigned IP alone does not prove connection state remains.

**Port forwarding** explicitly maps selected inbound traffic to an internal address and port. Without a suitable existing mapping or rule, traffic is not automatically forwarded to an unknown internal machine; it might target the router itself or be rejected by policy. Do not open forwarding rules for this exercise.

**Carrier-grade NAT, CGNAT**, adds provider-side translation for multiple subscribers. A home-router rule does not control that provider layer and may be insufficient for inbound access.

A **firewall** enforces allow/deny policy; NAT translates. Translation neither proves a service is secure nor encrypts its content.

## Independent practice

1. A reply targets `203.0.113.5:40001`. What is its destination after translation?
2. Does using source port 51000 on both machines mix replies? Which information distinguishes them?
3. A device has an address but neither a default gateway nor another external route. What might still work?
4. DHCP succeeds, but a website returns HTTP 500. Must DHCP renewal fix it?
5. Does home port forwarding guarantee inbound access behind CGNAT?

<details>
<summary>Solution and acceptance checks</summary>

1. `192.168.1.20:51000`, connection A.
2. No. The internal IPs differ; the example's external mappings also have different ports. Protocol and remote endpoints are part of the connection context.
3. Communication within its subnet may work; do not invent an external route.
4. No. DHCP supplies network settings; 500 is an HTTP-layer result after the request reaches a handler.
5. No. The home rule does not control provider translation. Success means following outbound sources and inbound destinations, not merely naming NAT.

</details>

## Check your understanding

Masks and routes determine local reachability. Gateway and DNS roles differ, as do translation and access policy.

## Next step

[How a domain name becomes an address](/en/programming-basics/02-dns-and-ip/).

## References

- [RFC 3022: NAT/NAPT example and return traffic](https://www.rfc-editor.org/rfc/rfc3022.html#section-2.2)
- [RFC 2131: DHCP](https://www.rfc-editor.org/rfc/rfc2131)
- [RFC 5737: IPv4 documentation addresses](https://www.rfc-editor.org/rfc/rfc5737)
