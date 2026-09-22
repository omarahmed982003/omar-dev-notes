---
title: 3. TCP, UDP, and packets
description: Handshake, segments, packets, frames, ACKs, retransmission, flow, and congestion control.
sidebar:
  order: 3
---

Application data is encapsulated as a TCP segment or UDP datagram, then an IP packet, then a local Ethernet/Wi-Fi frame. Headers contain information such as ports, IPs, TCP sequence/flags, and IP TTL/hop limit. Large content is commonly split and reassembled.

TCP provides a reliable ordered byte stream and normally starts with:

```text
Client                         Server
  | -------- SYN ------------> |
  | <----- SYN + ACK ---------- |
  | -------- ACK ------------> |
  | ===== Application Data ===> |
```

Sequence numbers and acknowledgements let TCP reorder data and retransmit loss. An ACK confirms transport receipt, not completion of PHP business logic.

Flow control uses the receiver’s advertised window to avoid overwhelming it. Congestion control changes the sender’s congestion window to protect the network. Effective in-flight data is constrained by both.

UDP sends independent datagrams without a traditional connection, guaranteed delivery, or ordering. It has less protocol overhead and is used by DNS, live media, and games. TCP is common for HTTP/1.1 and HTTP/2. HTTP/3 uses QUIC over UDP; QUIC adds its own reliability, security, and congestion control.

```bash
ping example.com
tracert example.com
```

Use `traceroute` instead of `tracert` on Linux/macOS. Ping uses ICMP, not TCP.

## Lesson map

<div class="lesson-diagram" role="img" aria-label="Concept map: TCP, UDP, and packets">
<p class="lesson-diagram-title">Concept map: TCP, UDP, and packets</p>
<div class="diagram-flow">
<div class="diagram-node input"><span>Application data is encapsulated as a TCP segment</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>TCP provides a reliable ordered byte stream and</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>Sequence numbers and acknowledgements let TCP reorder data</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node decision"><span>Flow control uses the receiver’s advertised window to</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node output"><span>UDP sends independent datagrams without a traditional connection,</span></div>
</div>
</div>

## Check your understanding

<div class="lesson-quiz" role="list">
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">01</span><p>Explain “Application data is encapsulated as a TCP segment” as if reviewing a real implementation. What is its goal and most important constraint?</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> Application data is encapsulated as a TCP segment or UDP datagram, then an IP packet, then a local Ethernet/Wi-Fi frame. Headers contain information such as ports, IPs, TCP sequence/flags, and IP TTL/hop limit. Large content is commonly split and reassembled. In practice, a successful happy path is insufficient: document assumptions and validate the values and states that can break this behavior.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">02</span><p>Compare “Application data is encapsulated as a TCP segment” with “TCP provides a reliable ordered byte stream and”. Why does neither replace the other in “TCP, UDP, and packets”?</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> For “Application data is encapsulated as a TCP segment”: Application data is encapsulated as a TCP segment or UDP datagram, then an IP packet, then a local Ethernet/Wi-Fi frame. Headers contain information such as ports, IPs, TCP sequence/flags, and IP TTL/hop limit. Large content is commonly split and reassembled. For “TCP provides a reliable ordered byte stream and”: TCP provides a reliable ordered byte stream and normally starts with: The first covers one part of the design while the second completes the behavior or constraints required for a correct implementation.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">03</span><p>Assume a system ignores “Sequence numbers and acknowledgements let TCP reorder data”. What failure or risk should you expect, and how would a test expose it?</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> Sequence numbers and acknowledgements let TCP reorder data and retransmit loss. An ACK confirms transport receipt, not completion of PHP business logic. Test a valid path, an exact boundary, and invalid input, then inspect output, side effects, and logs rather than treating the absence of an exception as success.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">04</span><p>Turn “Flow control uses the receiver’s advertised window to” into a reviewable engineering decision. What should be documented and tested?</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> Flow control uses the receiver’s advertised window to avoid overwhelming it. Congestion control changes the sender’s congestion window to protect the network. Effective in-flight data is constrained by both. Record the rationale, alternatives, and limits; test normal behavior, minimum and maximum boundaries, partial failure, and retry or repetition when applicable.</div></details>
</section>
</div>
