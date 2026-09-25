---
title: 3. Hardware components and motherboard architecture
description: Motherboards, buses, storage, I/O devices, power, cooling, and the path data follows through a computer.
sidebar:
  order: 3
---

## Hardware is a connected system

A computer is not an isolated CPU surrounded by unrelated parts. The motherboard connects the processor, memory, storage, and expansion devices through electrical links and protocols. Applications request operating-system services; a driver communicates with each device controller.

## Motherboard and chipset

The board determines the CPU socket, RAM technology and channels, storage connectors, PCIe lanes, and external I/O. A chipset supplies additional controllers and connectivity. Matching connector shape is insufficient: firmware, electrical power, protocol generation, and available lanes also determine compatibility.

## Buses, PCIe, and USB

A bus carries data, addressing, and control information. PCIe is a point-to-point serial interconnect built from lanes. An `x16` link exposes more lanes than `x1`, but throughput also depends on PCIe generation and the device. USB carries data and often power; a USB-C connector alone does not promise a particular speed or feature set.

## HDD, SATA SSD, and NVMe

An HDD is mechanical magnetic storage with inexpensive capacity and relatively high seek latency. A SATA SSD removes mechanical motion. NVMe normally uses PCIe and multiple queues designed for solid-state storage. Storage is persistent; RAM is faster and volatile. Opening a file does not copy the entire disk into RAM—systems fetch blocks or pages as needed and cache them.

## I/O, controllers, drivers, and interrupts

Input and network devices produce data or events; displays and printers consume results; many devices do both. Hardware controllers operate devices, and kernel drivers expose a stable software interface. Interrupts report events without permanent polling. DMA can transfer blocks between a device and RAM without making the CPU copy every byte.

## Power and cooling

The PSU converts incoming power into regulated rails and needs suitable capacity, quality, and protection. Heat can cause throttling and instability, so heatsinks, airflow, fans, and thermal interfaces are functional components.

## Data path

```text
SSD/HDD -> controller -> RAM -> CPU cache/registers -> execution
                                  |
                                  +-> GPU/NIC/display/storage
```

Caches, DMA, memory mapping, and buffers can reduce or postpone copying. Overall performance is constrained by the bottleneck on the actual path, not the largest number printed on one component.

## Check your understanding

<div class="lesson-quiz" role="list">
<section class="quiz-card" role="listitem"><div class="quiz-question-row"><span class="quiz-number">01</span><p>Why does USB-C shape not identify speed?</p></div><details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Answer:</strong> Connector shape is only one layer; protocol version, cable, host, and device determine speed, power, and features.</div></details></section>
<section class="quiz-card" role="listitem"><div class="quiz-question-row"><span class="quiz-number">02</span><p>How do a controller and driver differ?</p></div><details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Answer:</strong> A controller is hardware operating a device; a driver is operating-system software that communicates with it.</div></details></section>
<section class="quiz-card" role="listitem"><div class="quiz-question-row"><span class="quiz-number">03</span><p>Why is NVMe not simply another word for SSD?</p></div><details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Answer:</strong> SSD describes solid-state media; NVMe is a protocol designed for nonvolatile storage over PCIe.</div></details></section>
<section class="quiz-card" role="listitem"><div class="quiz-question-row"><span class="quiz-number">04</span><p>What does DMA improve?</p></div><details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Answer:</strong> It lets devices transfer blocks to or from RAM without CPU instructions copying every byte.</div></details></section>
</div>
