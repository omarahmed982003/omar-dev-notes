---
title: "Segment networks and prevent frame loops"
description: "Segment networks and prevent frame loops"
sidebar:
  order: 3
prev: {"link":"/en/programming-basics/14-network-layers-lan-ethernet-arp/","label":"How devices communicate on a local network"}
next: {"link":"/en/programming-basics/18-wifi-practical-basics/","label":"Connect to Wi-Fi and diagnose problems"}
---

After tracing a frame between two devices, consider an office needing separated groups and redundant links. A **frame** carries data on a local link. Understand the need for separation before its mechanisms.


## Broadcast boundaries and loops

**ICMP, Internet Control Message Protocol**, carries diagnostics and errors, not just ping. **VLAN, Virtual Local Area Network**, defines a logical local broadcast domain. **Broadcast** reaches devices in that domain, not the entire internet. **STP, Spanning Tree Protocol**, disables selected redundant link paths to prevent Ethernet frames from circulating indefinitely.

**ARP spoofing** advertises a false IP-to-MAC mapping because ARP alone does not authenticate answers. IPv6 uses **NDP, Neighbor Discovery Protocol**, for neighbor discovery and other local functions, with related trust concerns.

Ethernet and Wi-Fi have different link-frame formats: use Ethernet framing on an Ethernet link and Wi-Fi framing on Wi-Fi. At transport level, TCP uses segments and UDP uses datagrams.

**Worked check:** A host in VLAN 10 sends to VLAN 20. Even on the same switch chassis, this normally needs routing functionality and an allowing policy. The incoming link frame ends at routing, and the IP packet leaves in a new frame. A switch can flood unknown-destination or broadcast traffic within its domain; it does not always select just one output port.
