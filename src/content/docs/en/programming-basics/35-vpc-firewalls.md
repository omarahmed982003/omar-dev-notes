---
title: "VPC and firewalls: define service network boundaries"
description: "Understand private cloud networks, public and private subnets, routes, NAT, security groups, and WAF placement."
sidebar:
  order: 34
prev: {"link":"/en/programming-basics/34-network-performance/","label":"Latency and bandwidth: why a fast link can still feel slow"}
next: {"link":"/en/programming-basics/36-network-troubleshooting/","label":"Troubleshoot from DNS through HTTP"}
---

<span class="foundations-reading-scope" aria-hidden="true"></span>

A **VPC, virtual private cloud**, is a logically isolated network in a cloud provider. You choose its address range, subnets, routes, and admission rules. “Private” describes a boundary, not automatic security.

<figure class="teaching-figure visual-focus">
  <img src="/diagrams/foundations/network/vpc-boundaries.svg" alt="A VPC with a public WAF and load-balancer tier, application instances in a private subnet, and a database in a data subnet" loading="lazy" />
  <figcaption>Routing controls reachability; firewall and security-group rules control admission. A private subnet is not a replacement for application authorization.</figcaption>
</figure>

| Component | Responsibility |
|---|---|
| CIDR | VPC address range |
| Subnet | Range holding resources |
| Route table | Selects a next hop by destination |
| Internet gateway | Path between public addresses and the Internet |
| NAT gateway | Lets private workloads initiate outbound connections without direct inbound reachability |
| Security group | Usually stateful resource/interface rules |
| Network ACL | Subnet rules that may be stateless, depending on platform |
| WAF | Inspects HTTP data; does not replace a network firewall |

```text
Internet
   │
[CDN/WAF or load balancer]  public subnet
   │
[Application instances]     private subnet
   │
[Database]                  isolated/private subnet
   └── controlled outbound path when required
```

A public subnet has an Internet route, but a resource still needs suitable addressing and rules. A private subnet has no direct inbound Internet route and may use NAT for outbound traffic. NAT is not complete authorization.

Apply least privilege: never expose a database to `0.0.0.0/0`; permit the load balancer to reach only the application port; permit only the application tier to reach the database; review egress; separate administration paths; and retain flow evidence where appropriate.

:::note[Deep dive: routes, firewalls, and NAT answer different questions]
A route selects a possible next hop, a firewall or security group decides whether traffic is admitted, and NAT rewrites an address or port at a boundary. A route does not grant permission, a rule does not create a route, and NAT does not prove that replies can return or that the application authorizes the caller.

A stateful security group normally remembers an admitted connection and permits its return traffic. A stateless network ACL needs suitable rules in both directions, including ephemeral ports. Exact behaviour varies by platform, so inspect flow logs, effective rules, and the actual route table rather than trusting an old architecture diagram.

Review **egress** too: a compromised server with unrestricted outbound access can exfiltrate data. Blocking every outbound destination without a plan can break DNS, updates, and required APIs. Use least privilege based on known dependencies, controlled proxy or NAT paths, and observation rather than a blanket slogan.
:::

