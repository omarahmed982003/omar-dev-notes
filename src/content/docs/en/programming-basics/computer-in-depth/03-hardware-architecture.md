---
title: Hardware components and motherboard architecture
description: Motherboards, buses, storage, I/O devices, power, cooling, and the path data follows through a computer.
sidebar:
  order: 3
prev: {"link":"/en/programming-basics/computer-in-depth/02-computers-data-processing/","label":"Computers, data, and the processing cycle"}
next: {"link":"/en/programming-basics/computer-in-depth/04-cpu-gpu/","label":"How a processor executes instructions"}
---

## Give each connection a purpose

| Part | Meaning | Example |
|---|---|---|
| Processor socket | Mount and electrical connection on the board | CPU compatibility requires the correct socket, not merely a similar size |
| Bus | Communication path for data and signals | USB connects a peripheral to its controller |
| Seek | Moving an HDD head to a data location | Scattered reads require movement; an SSD has no moving head |
| PSU — Power Supply Unit | Converts input power to voltages components need | Capacity, quality, and connectors affect stability |

For a file read: storage reads, a bus transfers, memory holds, and a processor uses data. Power and cooling enable operation; they do not store the file.

## Hardware is a connected system

A computer is not an isolated CPU (Central Processing Unit, the main instruction-executing processor) surrounded by unrelated parts. The motherboard connects the processor, memory, storage, and expansion devices through electrical links and protocols. Applications request operating-system services; a driver communicates with each device controller.

## Motherboard and chipset

The board determines the CPU socket, RAM (Random Access Memory, working memory for active program data and instructions) technology and channels, storage connectors, PCIe (Peripheral Component Interconnect Express, a component interconnect using data lanes) lanes, and external I/O (Input/Output, reading, writing, and device communication). A chipset supplies additional controllers and connectivity. Matching connector shape is insufficient: firmware, electrical power, protocol generation, and available lanes also determine compatibility.

## Buses, PCIe, and USB

A bus carries data, addressing, and control information. PCIe is a point-to-point serial interconnect built from lanes. An `x16` link exposes more lanes than `x1`, but throughput also depends on PCIe generation and the device. USB (Universal Serial Bus, a device connection standard supporting data and power according to capabilities) carries data and often power; a USB-C connector alone does not promise a particular speed or feature set.

## HDD, SATA SSD, and NVMe

An HDD (Hard Disk Drive, storage using rotating magnetic disks) is mechanical magnetic storage with inexpensive capacity and relatively high seek latency. A SATA (Serial ATA, a storage connection standard) SSD (Solid-State Drive, electronic storage without moving mechanical parts) removes mechanical motion. NVMe (Non-Volatile Memory Express, a storage protocol commonly used over PCIe) normally uses PCIe and multiple queues designed for solid-state storage. Storage is persistent; RAM is faster and volatile. Opening a file does not copy the entire disk into RAM—systems fetch blocks or pages as needed and cache them.

## I/O, controllers, drivers, and interrupts

Input and network devices produce data or events; displays and printers consume results; many devices do both. Hardware controllers operate devices, and kernel drivers expose a stable software interface. Interrupts report events without permanent polling. DMA (Direct Memory Access, device-memory transfer without the CPU copying every byte) can transfer blocks between a device and RAM without making the CPU copy every byte.

## Power and cooling

The PSU (Power Supply Unit, hardware supplying appropriate electrical power) converts incoming power into regulated rails and needs suitable capacity, quality, and protection. Heat can cause throttling and instability, so heatsinks, airflow, fans, and thermal interfaces are functional components.

## Data path

```text
SSD/HDD -> controller -> RAM -> CPU cache/registers -> execution
                                  |
                                  +-> GPU/NIC/display/storage
```

Caches, DMA, memory mapping, and buffers can reduce or postpone copying. Overall performance is constrained by the bottleneck on the actual path, not the largest number printed on one component.

## Startup and bottleneck evidence

**Firmware** initializes hardware. **UEFI (Unified Extensible Firmware Interface, an interface for platform startup firmware)** manages startup entries and launches a **bootloader**, which loads the operating system; neither is the full OS.

A **bottleneck** is the stage limiting the actual workload. **Queue depth** measures outstanding storage requests according to the tool; **utilization** measures resource activity. **Thermal throttling** reduces processor rate at thermal limits. A busy disk with a long queue is different evidence from a hot processor reducing its clock.

**RAID (Redundant Array of Independent Disks, combining drives for properties such as availability or performance depending on level)** organizes multiple drives for properties such as performance or fault tolerance, depending on level. It is not a backup; mistaken deletion or ransomware can affect the whole array.

**Worked check:** Slow file opening with little CPU activity calls for storage latency, queue, and health evidence. Slowness correlated with temperature and falling CPU frequency calls for cooling and controlled-load checks, not an immediate purchase recommendation.

## Check your understanding

<div class="lesson-quiz" role="list">
<section class="quiz-card" role="listitem"><div class="quiz-question-row"><span class="quiz-number">01</span><p>Why does USB-C shape not identify speed?</p></div><details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Answer:</strong> Connector shape is only one layer; protocol version, cable, host, and device determine speed, power, and features.</div></details></section>
<section class="quiz-card" role="listitem"><div class="quiz-question-row"><span class="quiz-number">02</span><p>How do a controller and driver differ?</p></div><details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Answer:</strong> A controller is hardware operating a device; a driver is operating-system software that communicates with it.</div></details></section>
<section class="quiz-card" role="listitem"><div class="quiz-question-row"><span class="quiz-number">03</span><p>Why is NVMe not simply another word for SSD?</p></div><details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Answer:</strong> SSD describes solid-state media; NVMe is a protocol designed for nonvolatile storage over PCIe.</div></details></section>
<section class="quiz-card" role="listitem"><div class="quiz-question-row"><span class="quiz-number">04</span><p>What does DMA improve?</p></div><details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Answer:</strong> It lets devices transfer blocks to or from RAM without CPU instructions copying every byte.</div></details></section>
</div>
