---
title: "Device addresses and connection settings"
description: "Device addresses and connection settings"
sidebar:
  order: 5
prev: {"link":"/en/programming-basics/18-wifi-practical-basics/","label":"Connect to Wi-Fi and diagnose problems"}
next: {"link":"/en/programming-basics/26-subnet-calculations/","label":"Calculate a subnet from its address"}
---


## Read settings before calculating

On Windows run `ipconfig /all` in PowerShell. Find the connected adapter and read four fields: IPv4 Address, Subnet Mask identifying network bits, Default Gateway used without a more specific route, and DNS Servers answering name queries. Do not edit settings.

**DHCP, Dynamic Host Configuration Protocol**, supplies settings for a renewable lease. Example:192.168.1.20, mask255.255.255.0, gateway192.168.1.1. Your values may differ. Detailed subnet calculation, routing, and IPv6 follow separately.

## DHCP

DHCP supplies an IP (Internet Protocol, the addressing and routing protocol; an IP address identifies a network interface in context) address, subnet mask, default gateway, DNS servers, and a lease time. The common exchange is Discover, Offer, Request, and Acknowledgement. A client address may change when the lease changes.

## Private addresses and NAT

Private IPv4 ranges include `10.0.0.0/8`, `172.16.0.0/12`, and `192.168.0.0/16`. NAT rewrites addresses at a boundary, while PAT uses ports to distinguish many connections behind one public IP. Port forwarding maps selected inbound traffic to an internal host. Carrier-grade NAT may prevent direct inbound connections even when a home router is configured.

## Practical exercises

<details><summary>A device has an IP but no default gateway. What can work?</summary><p>It can usually reach its own subnet but lacks a route to external networks unless another route exists.</p></details>

<details><summary>Why is NAT not a firewall?</summary><p>NAT translates addresses and ports; a firewall applies allow/deny policy. NAT can coexist with weak rules or exposed forwarding.</p></details>

## Check your understanding

NAT translates traffic at a boundary; port forwarding adds an inbound mapping to one internal service.

## Next step


After completing this practice, continue with [Calculate a subnet from its address](/en/programming-basics/26-subnet-calculations/).



After completing this practice, continue with [Choose a route and read IPv6 addresses](/en/programming-basics/27-routing-and-ipv6/).
