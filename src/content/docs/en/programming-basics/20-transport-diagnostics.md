---
title: "Closing connections and diagnosing packet size"
description: "Closing connections and diagnosing packet size"
sidebar:
  order: 11
prev: {"link":"/en/programming-basics/03-tcp-udp-packets/","label":"Moving data with TCP and UDP"}
next: {"link":"/en/programming-basics/04-url-ports-http/","label":"Web addresses, ports, and HTTP"}
---

Build on ordered delivery and acknowledgements. Follow connection termination and packets too large for one link along the route.

## Closing a connection and diagnosing large transfers

**SYN (Synchronize)** starts TCP sequence-number synchronization; **ACK (Acknowledgement)** confirms received transport data. **FIN (Finish)** indicates no more data from that sender, while **RST (Reset)** terminates abruptly. The example's 1,2,3,4 labels are illustrative; TCP sequence numbers count positions in the byte stream, not simple packet numbers.

**MTU, Maximum Transmission Unit**, limits the higher-layer packet size carried on a link. **Path MTU Discovery** seeks the smallest suitable limit along the route. Failure can let small setup exchanges work while larger transfers stall. A **checksum** detects accidental corruption; it does not authenticate a sender. **Packet capture** records network traffic; **retransmission** repeats data inferred to be missing.

**Worked check:** Setup succeeds but a large upload stalls. This alone does not prove an MTU problem. Compare captures, size-related network messages, and retransmissions with application timing. An application that already received the entire request and is still computing suggests another cause. Ping alone cannot distinguish these cases.
