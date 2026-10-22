---
title: "Images, audio, video, and size units"
description: "Pixels, sampled sound, video frames, codecs, containers, compression, and correct size calculations."
sidebar:
  order: 6
prev: {"link":"/en/programming-basics/computer-in-depth/03-binary-languages-algorithms/","label":"Representing numbers and characters in memory"}
next: {"link":"/en/programming-basics/computer-in-depth/05-ram-memory-buffers/","label":"Addresses and virtual memory"}
---

<span class="foundations-reading-scope" aria-hidden="true"></span>

A byte is eight bits in the systems used here. Those bytes can describe an image, sound, or video because a format tells software how to interpret them.

We will calculate raw sizes: before compression and file metadata. The goal is to understand relationships, not memorize one recording preset.

## Images: a grid of pixels

A **raster image** is a grid of **pixels**, individual points with color values. **Resolution** here means the grid dimensions, such as `1920 × 1080`, not the file's byte size.

A **color channel** stores a component of color. In **RGB**, red, green, and blue each use one byte in our example, so each pixel takes three bytes.

| RGB values | Example color |
|---|---|
| `255, 0, 0` | Red |
| `0, 0, 0` | Black |
| `255, 255, 255` | White |

A 3-by-2 image has six pixels: `3 × 2 × 3 = 18 B` of raw color data. Doubling both width and height multiplies the pixel count by four, not two.

An **alpha channel** may add transparency information, and other formats use different bit depths. **Vector images** describe shapes and paths instead of storing every pixel's color. The calculation is not a universal image-file formula.

## Audio: successive signal measurements

A **sample** measures a signal at an instant. **Sample rate** is measurements per second, expressed in **Hz**, or hertz: occurrences per second.

**Bit depth** is the number of bits available for each sample value. Audio **channels** are separate sound paths: mono has one and stereo has two. This is a different use of “channel” from image color channels.

For raw **PCM, pulse-code modulation**, representing samples numerically, calculate:

```text
bytes = sample rate × bit depth × channels × seconds ÷ 8
```

For example, `8000 × 16 × 1 × 1 ÷ 8 = 16000 B` for one second. Two seconds need `32000 B`; two channels instead of one double it again.

These are teaching settings, not recommendations for every recording. Rate, bit depth, and channels describe different properties; increasing a number does not automatically repair a poor source.

## Video: frames, sound, and timing

A **frame** is an image in a video sequence. **Frame rate** is frames per second, usually written FPS.

For raw RGB frames of `100 × 100` pixels, three bytes per pixel, ten frames per second, and two seconds:

```text
100 × 100 × 3 × 10 × 2 = 600000 B
```

This counts **raw video only**, excluding audio and file metadata. Compressed video need not store every frame as a complete independent image; it may encode relationships and differences between frames.

A **codec** provides rules and tools for encoding and decoding media, often including compression. A **container**, such as MP4, packages video, audio, timing, and other information.

MP4 is therefore a container name, not a guarantee of one codec or quality level. This use of “container” is unrelated to application containers that isolate an application's execution environment.

## Compression trades space for other costs

**Compression** represents data in less space. **Lossless** compression allows the original data to be recovered exactly, as required for restoring program or text files unchanged.

**Lossy** compression discards some information to reduce size. It may suit displayed images or recordings if the result meets the use case. A smaller file is not evidence of higher quality.

Decompression costs computation, and display requires memory. An image's compressed disk size need not equal its decoded size in RAM.

## File size is not transfer rate

**B** denotes bytes; **b** denotes bits. A byte is eight bits in these examples.

| Unit | Value |
|---|---|
| kB | `1000 B` |
| MB | `1000000 B` |
| KiB | `1024 B` |
| MiB | `1048576 B` |

**Bitrate** measures bits per unit of time, such as Mb/s. It is not image resolution or frame rate.

A rate of `8 Mb/s` is theoretically `1 MB/s`. A `10 MB` file takes at least ten seconds at that constant rate, often longer because of protocol overhead, congestion, or other stages. Some tools use ambiguous labels: check the actual unit.

## Compare actual files safely

Choose two images, recordings, or videos you created or may use. Inspect file properties in your existing viewer: size, duration where applicable, dimensions, and codec or container if shown.

Record the tool and settings rather than assuming identical encodings. Compare one changed factor at a time; lower resolution or shorter duration does not alone explain all compressed-size differences.

If the viewer cannot report a codec, write “not observed” rather than guessing it from .mp4. Do not upload private media or install an unknown utility to complete the exercise.

## Try, then check

1. How many raw bytes for a `4 × 3` image at three bytes per pixel?
2. How many bytes for two seconds of mono PCM at 4000 samples/second and 16 bits/sample?
3. Can an MP4 file's 10 MB size identify its resolution or codec?
4. What is the theoretical minimum for 10 MB at 16 Mb/s?

<details>
<summary>Check the reasoning</summary>

1. `4 × 3 × 3 = 36 B`.
2. `4000 × 16 × 1 × 2 ÷ 8 = 16000 B`.
3. No: inspect its tracks and encoding. Size alone does not establish quality.
4. `16 ÷ 8 = 2 MB/s`, so five seconds theoretically, before additional overhead.

</details>

## Summary

Formats give bytes meaning. Settings, duration, and compression affect size and processing cost. Next, trace active bytes through [memory](/en/programming-basics/computer-in-depth/05-ram-memory-buffers/).

## References

- [NIST: bytes and binary prefixes](https://physics.nist.gov/cuu/Units/binary.html).
- [MDN: media containers](https://developer.mozilla.org/en-US/docs/Web/Media/Guides/Formats/Containers).
