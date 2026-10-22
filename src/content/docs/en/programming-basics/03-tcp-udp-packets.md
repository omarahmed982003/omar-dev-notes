---
title: "TCP: from the first SYN to connection closure"
description: "Connections, byte streams, ordering, retransmission, flow and congestion control, closure, and diagnosis with a local PHP lab."
sidebar:
  order: 7
prev: {"link":"/en/programming-basics/21-url-encoding/","label":"Characters and encoding in web addresses"}
next: {"link":"/en/programming-basics/udp/","label":"UDP: independent messages without a TCP connection"}
---

<span class="foundations-reading-scope" aria-hidden="true"></span>

A network can lose, delay, duplicate, or reorder data. When sending a file or request, your application needs an ordered sequence of bytes and must handle failure if delivery cannot complete. TCP provides this transport service.

Prerequisites: **IP** addresses and routes packets between devices. A **port** is a number used to identify a transport endpoint within a device. DNS can discover an address; TCP can also connect directly to an address without a DNS lookup.

**Reading route:** follow the first pass through the foundation stopping point below. Recovery, congestion, and diagnosis follow in this same topic-owned page.

## The service TCP provides

**Transmission Control Protocol** supplies an ordered **byte stream** between endpoints. A byte contains eight bits. TCP handles loss, ordering, and duplicates within a connection, but does not preserve application-message boundaries.

Two writes containing `Hello` and `World` might be read as `HelloWorld` or as smaller pieces. The number of writes need not match the number of reads. The application needs framing, such as a newline terminator or a length prefix.

Reliability does not mean the network cannot fail. Timeouts, resources, and recovery limits still exist. A connection is transport state maintained by endpoints, not an exclusively reserved physical circuit.

## Identify the endpoints

A typical TCP connection is identified by each endpoint's IP address and port:

```text
Client 127.0.0.1:51024  <-->  Server 127.0.0.1:9099
```

`127.0.0.1` refers to the local computer. The operating system normally assigns the client a temporary source port. The server listens on a known port. Another client can reach the same server using a different source endpoint.

A **socket** is the application's communication interface. A server **listens** for connections and **accepts** a connection to obtain a connected resource. Accepting a connection is separate from receiving an application message.

## Establish a connection

The usual three-way handshake is:



**SYN** synchronizes sequence numbers. **ACK** acknowledges progress expected from the peer. Each direction has an independent sequence space. SYN consumes one sequence number, explaining the increment shown.

<figure class="teaching-figure">
  <img src="/diagrams/foundations/network/tcp-handshake-en.svg" alt="The client sends SYN with sequence 100; the server sends SYN+ACK with sequence 700 and acknowledgement 101; the client acknowledges 701." loading="lazy" />
  <figcaption>Read top to bottom. This example uses x = 100 and y = 700. Each SYN consumes one sequence number, so the acknowledgement names the next one. Establishing TCP is not user authentication.</figcaption>
</figure>

Completing this handshake means a TCP endpoint accepted the connection. It does not prove user authorization, application health, or database availability.

## Close the connection

Each direction can close independently. **FIN** means no more data will be sent in that direction. The peer acknowledges it and can finish its remaining output. The usual bidirectional close involves FIN and ACK for both directions, but messages can combine; four distinct packets are not compulsory.

A **half-close** ends sending while reception continues. **RST** resets a connection abruptly. Applications must distinguish a complete application message from EOF, end of the stream, or an error.

## Local PHP lab: a message is not a connection

Execution is optional after [PHP setup](/en/php/00-lab-setup/). **CLI, command-line interface**, runs the file from a terminal. Without execution, trace input Hello plus a newline: accept a connection, read one framed message, return Received: Hello. Connection acceptance is not the application response. For execution use a fresh training directory. Start a server and client in separate terminals. Bind only to `127.0.0.1:9099`; no internet exposure is required.

Save `tcp-server.php`:

```php
<?php
declare(strict_types=1);

$server = stream_socket_server('tcp://127.0.0.1:9099', $code, $message);
if ($server === false) {
    throw new RuntimeException($message, $code);
}
echo 'Listening', PHP_EOL;
$client = stream_socket_accept($server, 15);
if ($client === false) {
    fclose($server);
    throw new RuntimeException('No client connected');
}
stream_set_timeout($client, 5);
$line = fgets($client, 128);
if ($line !== "Hello\n") {
    fclose($client);
    fclose($server);
    throw new RuntimeException('Expected one short newline-terminated message');
}
$response = "Received: Hello\n";
while ($response !== '') {
    $written = fwrite($client, $response);
    if ($written === false || $written === 0) {
        throw new RuntimeException('Write failed');
    }
    $response = substr($response, $written);
}
fclose($client);
fclose($server);
```

Run:

```bash
php tcp-server.php
```

The server prints `Listening` and accepts one client within 15 seconds. After acceptance it applies a five-second read timeout. Save `tcp-client.php` and start it in a second terminal while the server waits:

```php
<?php
declare(strict_types=1);

$socket = stream_socket_client('tcp://127.0.0.1:9099', $code, $message, 5);
if ($socket === false) {
    throw new RuntimeException($message, $code);
}
stream_set_timeout($socket, 5);
$request = "Hello\n";
while ($request !== '') {
    $written = fwrite($socket, $request);
    if ($written === false || $written === 0) {
        throw new RuntimeException('Write failed');
    }
    $request = substr($request, $written);
}
$response = fgets($socket, 128);
fclose($socket);
if ($response !== "Received: Hello\n") {
    throw new RuntimeException('Missing or incomplete response');
}
echo $response;
```

```bash
php tcp-client.php
```

Expected client output:

```text
Received: Hello
```

Here, `fgets` reads until a newline, a length limit, or end of the resource. The newline is **application framing**. The write loops are necessary because `fwrite` can accept fewer bytes than requested. This bounded teaching protocol rejects missing, incomplete, or oversized messages; it does not accept arbitrary-length input.

The server accepts one client and exits. The client first establishes TCP, then sends its message, then verifies an application response. These are different success conditions. This example does not encrypt the connection.

## Delivery is not business completion

A **TCP ACK** concerns transport reception, not an order committed to a database. A server might execute a payment, then lose the connection before its response reaches the client. A disconnect alone cannot tell the client whether the payment happened.

Retrying can repeat the business operation. **Idempotency** is application-level protection against duplicating the intended effect, often using a unique request key and recorded outcome. TCP suppresses duplicate stream bytes within a connection; applications must handle repeated requests across connections.

## Foundation stop: connection, message, and outcome

Explain the handshake, distinguish connection from application message, and account for partial reads/writes. Compare orderly FIN with abrupt RST, and explain why an ACK does not prove payment completion.

If you can trace Hello and its reply without inventing TCP message boundaries, continue along the foundation route. The following depth proceeds through byte numbers, size, receiver/path windows, closure details, and diagnosis. Return after a first local web application.

## Sequence numbers and acknowledgements

For a simplified data range starting at 1000, bytes `ABC` occupy 1000–1002 and `DEF` start at 1003. Sequence numbers locate bytes rather than numbering purchase orders or merely counting packets.

An ordinary **cumulative ACK** identifies the next expected byte. An ACK of 1003 acknowledges the contiguous preceding bytes. TCP can retain later data while recovering a missing range, then deliver an ordered stream.

```text
Received:      ABC     [gap]     GHI
Application:   ABC
After recovery: ABCDEF GHI in order
```

**Retransmission** resends data inferred to be lost using timers and acknowledgement information. Delay or reordering can make that inference imperfect. **Selective acknowledgements, SACK**, let the receiver report additional received ranges to help recovery.

Later bytes may wait behind a gap. This is transport **head-of-line blocking**: data exists but cannot yet be exposed as the next ordered bytes.

### Follow a lost range with actual numbers

Send ABC, DEF, then GHI, three bytes per group. Assume a receiver that retains out-of-order data. These are selected acknowledgement points for teaching, not a rule that every segment receives an immediate separate ACK.

| Event | Data byte range | Receiver response in this trace | Available to the application |
|---|---|---|---|
| ABC arrives |1000–1002| ACK 1003 |ABC|
| DEF is lost |1003–1005| Receiver does not observe it |ABC|
| GHI arrives beyond the gap |1006–1008| ACK 1003: byte 1003 is still missing |ABC; retain GHI internally |
| Retransmitted DEF arrives |1003–1005| ACK 1009: bytes through 1008 are now contiguous |ABCDEFGHI|

ACK 1003 does not claim the receiver has seen no higher byte. It identifies the next byte needed for **contiguous progress**. Once DEF fills the gap, GHI is already present, allowing ACK 1009.

Assume the sender retransmits after a suitable timeout. **One duplicate ACK alone does not mandate immediate retransmission**. Recovery algorithms and timers vary; this explains ordering and progress rather than simulating every TCP implementation.

**Independent trace:** Start at 2000. JKL arrives, MNO is lost, then PQR arrives. Each group has three bytes. What ACK follows PQR, and what ACK follows recovery of MNO?

<details>
<summary>Review after attempting the trace</summary>

JKL occupies 2000–2002. The gap starts at 2003, so ACK 2003 remains despite receiving 2006–2008. Recovery makes bytes through 2008 contiguous, giving ACK 2009. The ordered TCP stream does not expose PQR past the gap.

</details>

## Segments and path size

Application bytes travel through layers:

```text
Application bytes → TCP segment → IP packet → Ethernet/Wi-Fi frame
```

Each layer adds a **header** containing its control information. TCP includes ports, sequence numbers, and flags. IP includes addresses and routing-related information. MAC addresses concern the local link; routers select an IP packet's next hop.

**MTU** limits the higher-layer payload a link can carry. **MSS** is the maximum amount of TCP data a peer advertises it can receive per segment, excluding TCP/IP headers. MSS and MTU are not interchangeable; options and path information affect actual segmentation.

A large application message is not necessarily one equally large packet.

**Path MTU Discovery** tries to find a usable path size. Filtering relevant control messages can make small exchanges succeed while larger transfers stall. This is one diagnostic hypothesis, not the explanation for every failed upload.

A **checksum** detects some accidental corruption. It is not protection against an attacker forging traffic. TCP alone does not encrypt application data; a protocol such as TLS supplies protected communication.

## Receiver capacity versus network congestion

**Flow control** protects the receiver through its advertised receive window, `rwnd`. **Congestion control** adapts to conditions along the network path through the sender's congestion window, `cwnd`.

The smaller window helps bound unacknowledged data in flight, accounting for data already outstanding. A faster CPU does not automatically repair a congested network or an application that is not reading.

Different congestion-control algorithms use different policies. Do not assume every implementation has an identical reaction to loss.

### Calculate remaining room, not just the window size

Assume rwnd is 6000 bytes, cwnd is 4000, and 3000 bytes are already outstanding. The simple bound is 4000, leaving `4000 − 3000 = 1000` bytes of **new data**, not another 4000 on top.

If rwnd becomes zero, ordinary new-data transmission pauses; protocol window probes may still occur. If cwnd is smaller, increasing receiver buffering alone does not remove the congestion limit.

**Try:** rwnd=6000, cwnd=5000, outstanding data 3500. How much room remains in this model?

<details>
<summary>Review the calculation</summary>

`min(6000, 5000) − 3500 = 1500` bytes. This is a simplified ordinary-flow calculation, not a timing equation or promise of immediate transmission; recovery and scheduling details also matter.

</details>

## Closure depth: TIME_WAIT and keepalive

**TIME_WAIT** is a normal state following orderly closure at the relevant endpoint. It helps handle delayed segments and retransmitted closing messages. Reducing it indiscriminately changes protocol behavior.

TCP **keepalive** can detect some dead idle peers according to its configuration. It differs from HTTP connection reuse and does not replace an application deadline.

## Diagnose observed failures

For `Connection refused`, check whether a service is listening on the intended endpoint. A rejecting network policy can also produce refusal. A timeout can reflect dropped traffic, routing trouble, or an unresponsive peer; the error alone does not identify the cause.

On Windows PowerShell:

```powershell
Get-NetTCPConnection -LocalPort 9099 -ErrorAction SilentlyContinue
```

On Linux:

```bash
ss -tn
```

A short connection may end before inspection. A **packet capture** records traffic and can reveal handshakes, acknowledgements, retransmissions, and closure. It may expose sensitive content, so use a local lab.

`ping` uses ICMP rather than TCP. Success does not prove that a TCP server accepts connections on a particular port.

## Check your understanding

<details><summary>Two writes were read together. Is TCP broken?</summary>
No. It supplies a byte stream. Define application framing with a delimiter, length, or protocol format.
</details>

<details><summary>An ACK arrived but payment processing failed. Is that contradictory?</summary>
No. The ACK concerns transport. Payment validation, transactions, and application responses are separate.
</details>

<details><summary>A handshake succeeds but a large upload stalls. What should you inspect?</summary>
Check whether the application reads, whether deadlines expire, whether retransmissions occur, and whether path size causes trouble. Gather evidence instead of assuming MTU is the cause.
</details>

<details><summary>How do FIN and RST differ?</summary>
FIN orderly ends one sending direction while the opposite direction can continue. RST abruptly resets the connection.
</details>

## References

- [TCP specification — RFC 9293](https://www.rfc-editor.org/rfc/rfc9293.html)
- [PHP stream_socket_server](https://www.php.net/manual/en/function.stream-socket-server.php)
- [PHP stream_socket_client](https://www.php.net/manual/en/function.stream-socket-client.php)
- [PHP fwrite and partial writes](https://www.php.net/manual/en/function.fwrite.php)
