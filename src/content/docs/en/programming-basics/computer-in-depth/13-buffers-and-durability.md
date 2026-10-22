---
title: "Moving data and making writes durable"
description: "Moving data and making writes durable"
sidebar:
  order: 9
prev: {"link":"/en/programming-basics/computer-in-depth/12-memory-allocation/","label":"Allocation and the lifetime of data"}
next: {"link":"/en/programming-basics/computer-in-depth/05-os-terminal-files-git/","label":"Read and write files from a terminal"}
---

<span class="foundations-reading-scope" aria-hidden="true"></span>

## Why writing is not one step

A program produces one hundred messages per second while the receiver processes sixty. Without a waiting policy, data accumulates. Even a “Saved” message leaves a second question: what persistence guarantee was actually provided?

Recall that RAM is working memory and programs request operating-system services. This lesson separates moving data from surviving failure.

## Buffers versus caches

A **buffer** temporarily holds data in transit or combines small operations into a batch. A **cache** keeps a reusable copy to avoid repeating work or reading.

A send buffer may contain a message not stored anywhere else; losing it loses the message. A rebuildable cache can generally be discarded without losing the original data. Not every temporary area is the source of truth.

A **queue** organizes pending work under an ordering policy. A **stream** supplies sequential data whose total length may be unknown.

A **pool** contains reusable resources, such as a **connection** between programs or a **worker** processing tasks. One structure can serve multiple roles, but loss policies differ.

## When production exceeds consumption

A **producer** adds data; a **consumer** processes it. At rates of one hundred and sixty per second, backlog grows by forty per second: four hundred after ten seconds, assuming constant rates and no rejection.

**Backpressure** makes the producer slow down when the consumer cannot keep up. A bounded queue with explicit rejection is another policy. More RAM alone only delays exhaustion.

An initially empty buffer holding two hundred messages fills in five seconds under this model. Real systems must also account for message size, variable rates, and retries.

## Different buffer uses

- An **input buffer** retains events, such as keystrokes, until the program reads them.
- A **file buffer** may batch small writes to reduce **system calls**, requests for OS services.
- A **socket**, a programmatic communication endpoint, commonly has send and receive buffers to absorb rate differences.
- **stdout**, the ordinary output channel, may use line or batch buffering depending on the program, library, and destination. There is no universal rule for every PHP setup and terminal.
- A **ring buffer** reuses fixed storage through read and write positions.
- **Double buffering** prepares a background image **frame** while displaying the current frame, reducing **flicker**, or visible display instability.

**Buffer overflow** means writing beyond allowed capacity in an environment that does not prevent it and can be a security risk. **Underflow** means the consumer needs data before it arrives, as with audio samples.

## From application to storage

**Flush** pushes data from one buffer to a following layer; it does not name one universal guarantee. File data can pass through application buffering, the operating system's **page cache**, and storage-device buffers.

A device **controller** manages storage access. Successful writing can mean that one layer accepted the data rather than that it reached power-loss-resistant storage.

**Durability** means surviving specified failure types under a defined contract. Filesystem, device, and synchronization policies determine that contract.

### Closing and synchronizing are not universal promises

An **API**, an application programming interface, defines an operation, result, and guarantee. Closing a file releases resources under implementation rules; do not infer the same guarantee as a storage-synchronization API.

In PHP, `fflush` pushes the file buffer, while `fsync`, available from PHP 8.1, requests synchronization of file data and metadata to storage. Check return values and system guarantees. This is not a universal guarantee of database-protocol correctness or an all-or-nothing update across multiple files.

**Metadata** describes attributes such as names, links, and timestamps. File creation, renaming, and failure durability have system-specific details; write followed by close is not a promise of surviving every failure.

Do not cut device power or risk real files. Actual PHP file writing and error handling follow language foundations.

## Optional depth: reducing copies

**DMA**, direct memory access, lets a device transfer blocks to or from RAM without the CPU personally copying every byte. The CPU and OS still configure and manage the operation.

**Zero-copy** names techniques reducing copies between application, OS, and device buffers. It does not mean physical data never moves.

Use these techniques after measuring copying costs; their availability does not identify your bottleneck.

## Independent practice

1. Calculate backlog from production of 120 messages per second and consumption of 90 over four seconds.
2. Can an unsent-message buffer be discarded like a rebuildable cache?
3. A write succeeded: what question remains before claiming durability?
4. Draw three writing layers and define flush at one layer.

<details>
<summary>Review after attempting</summary>

1. Thirty extra per second gives 120 messages before rejection or rate changes.
2. No: the first may contain the only copy.
3. Which layer accepted it, and which synchronization, filesystem, and device contract applies?
4. Application → OS memory → device. Advancing one layer does not prove completion of all later layers.

</details>

## Summary

A buffer absorbs rate differences rather than preventing exhaustion forever. Transfer success between layers is not itself failure durability.

## References

- [PHP: fflush](https://www.php.net/manual/en/function.fflush.php)
- [PHP: fsync and its contract](https://www.php.net/manual/en/function.fsync.php)
