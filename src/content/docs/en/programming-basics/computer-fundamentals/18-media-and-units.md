---
title: "Images, sound, and size units"
description: "Images, sound, and size units"
sidebar:
  order: 7
prev: {"link":"/en/programming-basics/computer-fundamentals/02-binary-data-representation/","label":"How computers represent numbers and text"}
next: {"link":"/en/programming-basics/computer-fundamentals/03-hardware-architecture/","label":"The computer components you use"}
---

After representing numbers and characters, use bytes to represent images and sound. Calculate each example before moving on; only simple multiplication and division are needed.


## Images and sound

A digital image can be represented as a grid of **pixels**, small colored points. **RGB**, Red Green Blue, describes amounts of three color channels. A common representation uses one byte per channel: 255,0,0 is red, and 0,0,0 is black. A 2×2 image has four pixels; at three bytes per pixel, raw color data needs 12 bytes. The actual file size may differ because of file metadata, compression, or another pixel representation.

Sound can be represented by **samples**, measurements of a signal at successive times. The **sample rate** is the number of measurements per second. One channel at 8000 samples per second and 16 bits per sample needs `8000×16÷8 = 16000` raw bytes per second. These are example settings, not a rule for every recording.

**Compression** reduces representation size. Lossless compression can recover the exact original data; lossy compression discards some detail. Text and executable programs need exact recovery, while some image and audio uses tolerate selected losses.

## Size and transfer-rate units

Lowercase b means bit; uppercase B means byte. `kB = 1000 B` and `MB = 1,000,000 B`. Binary units have distinct names: `KiB = 1024 B` and `MiB = 1,048,576 B`. Some interfaces use ambiguous labels, so check the intended unit.

A rate of `8 Mb/s` is eight million bits per second, theoretically `1 MB/s` before protocol overhead and other limits. File size measures data; transfer rate measures data per unit of time.

## Keep the calculations separate

1. Mono audio,4000 samples/second,16bits/sample,one second: `4000×16÷8=8000` raw bytes. Doubling only duration gives16000.
2. Program files require lossless compression to recover identical bytes. Display images may accept lossy compression if retained detail meets the purpose.
3.16Mb/s theoretically equals2MB/s before overhead.10MB needs at least five seconds at that constant theoretical rate, potentially longer in practice.

Write units beside values; confusing bits with bytes changes the result by eight.
