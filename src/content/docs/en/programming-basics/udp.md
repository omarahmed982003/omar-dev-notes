---
title: "UDP: independent messages without a TCP connection"
description: "Datagram boundaries, loss, ordering, duplication, message size, application responsibilities, and transport choices."
sidebar:
  order: 8
prev: {"link":"/en/programming-basics/03-tcp-udp-packets/","label":"TCP: from the first SYN to connection closure"}
next: {"link":"/en/programming-basics/05-http-messages-state/","label":"Read an HTTP request and response"}
---

<span class="foundations-reading-scope" aria-hidden="true"></span>

A game sends a player's position repeatedly. If an old update is delayed, displaying the newest position may be more useful than waiting for every old update. Choosing transport requires understanding both its service and the responsibilities left to your application.

**UDP, User Datagram Protocol**, transports independent **datagrams** over IP. IP addresses and routes packets; a port identifies a transport endpoint inside a device.

## Message boundaries

Two sends create separate datagrams, although either can be lost. UDP does not combine messages into a byte stream like TCP. The receiver needs adequate message-buffer capacity. Some APIs truncate an oversized message and discard the excess instead of returning it on the next read; check the API's contract.

The basic UDP header occupies eight bytes: source port, destination port, length, and checksum. A **checksum** detects accidental corruption; it does not authenticate or encrypt messages. Checksum requirements vary with IP and extensions, so its presence is not an application security mechanism.

## Responsibilities UDP does not provide automatically

UDP has no TCP connection-establishment handshake and supplies no built-in retransmission, delivery guarantee, ordering, duplicate suppression, or TCP-style congestion control. Applications must consider lost, reordered, and duplicated messages.

An API can provide UDP `connect` to select a default peer, filter reception, or improve error reporting. That call does not create a TCP handshake or reliable delivery.

## Follow a message sequence

```text
sent:     seq=10 x=40 | seq=11 x=42 | seq=12 x=45
received: seq=10 x=40 | seq=12 x=45 | seq=11 x=42
```

The application adds `seq`; it is not a UDP header field. Applying arrival order would move the player from position 45 back to 42 using stale state.

For some real-time state updates, retaining the highest applied sequence and ignoring older updates is appropriate. The final position is 45. This is not a complete solution for debiting money or creating an order: those operations require a known business outcome and duplicate protection.

## Message size and the path

A link has an **MTU**, its maximum supported higher-layer payload size. A large datagram may require lower-layer fragmentation or fail, depending on protocols, configuration, and path. Losing one fragment can prevent reconstruction of the complete message.

A small header does not justify sending an entire large file as one datagram. Define message limits and recovery policies for the application. There is no single universally safe payload size independent of the path and protocol.

## Suitable uses

DNS uses UDP for many exchanges but also supports TCP. Games and real-time media may use UDP with higher protocols supplying timing, ordering, or loss recovery appropriate to their data.

HTTP/3 uses **QUIC** over UDP. QUIC supplies reliable streams, encryption, and congestion control. These properties belong to QUIC, not to UDP itself.

## Misleading assumptions

- “UDP is always faster”: measure useful delivery, latency, and load rather than header size alone.
- “The send succeeded, so the message arrived”: local API success is not acknowledgement from the remote application.
- “Retry forever”: uncontrolled retries can increase congestion and duplicate application effects.
- “The source address proves identity”: UDP does not authenticate senders; source addresses can be spoofed in some circumstances.

Public services must also consider **amplification**: an attacker sends a small request with a spoofed victim address, causing a larger reply to reach that victim. Address validation, response-size policy, and rate limits depend on the application's protocol.

## Exercise

A receiver has applied `seq=12`, then receives another `seq=12`, then `seq=11`. What should happen for a complete player-position update? How does the requirement change for “debit 10 pounds”?

<details><summary>Reasoning and answer</summary>

A numbered latest-state policy can ignore duplicates and older updates. A financial operation requires authenticated identity, a unique operation identifier, durable recorded outcomes, and transaction guarantees. The client also needs a policy for an unknown outcome after a missing response.

Transport choice follows those requirements rather than a blanket speed claim.

</details>

## References

- [UDP — RFC 768](https://www.rfc-editor.org/rfc/rfc768)
- [UDP usage guidelines — RFC 8085](https://www.rfc-editor.org/rfc/rfc8085)
- [QUIC — RFC 9000](https://www.rfc-editor.org/rfc/rfc9000)
