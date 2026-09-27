---
title: "Memory and saving: where did your work go?"
description: "Distinguish active working space from saved files. Use your practice note; do not disconnect power to test memory."
sidebar:
  order: 10
prev: {"link":"/en/programming-basics/computer-fundamentals/04-cpu-gpu/","label":"The processor and executing instructions"}
next: {"link":"/en/programming-basics/computer-fundamentals/06-operating-systems/","label":"The operating system, programs, and files"}
---

Distinguish active working space from saved files. Use your practice note; do not disconnect power to test memory.

## Working desk and storage cabinet

RAM (Random Access Memory, working memory for active program data and instructions) is memory used while programs run. Storage such as an SSD (Solid-State Drive, electronic storage without moving mechanical parts) or HDD (Hard Disk Drive, storage using rotating magnetic disks) retains files for longer. A desk and cabinet are useful analogies: take out work, then save its result. This describes roles, not the literal movement of every byte.

Ordinary RAM loses its contents when power is removed. Successfully saved files normally remain on storage. Some applications autosave or recover work; do not rely on that without checking the feature and save location.

## Size units

A bit is a two-state value; a byte contains eight bits. File sizes use units such as KB, MB, and GB; you need not convert all of them yet. A short text file is usually smaller than a long video. Character count is not always byte count because some characters require multiple bytes.

Adding RAM increases working space, not drive capacity. Deleting a stored file does not necessarily fix slowness caused by an application consuming memory.

## Safe experiment

Copy `note.txt` to `memory-practice.txt`. Open the copy, add a line, and save. Close and reopen it: the line remains. Next change a word without saving and close the file. If asked, discard changes only for this practice copy; reopening should show the last saved version. If the application automatically restores tabs, inspect the actual file opened from its folder rather than relying on a recovered tab.

**Check yourself:** Closing is not saving, and minimizing is not closing. Save and reopen from the location to confirm your result. Later you will study memory management; now distinguish active work from the saved file.

Quick reminder: [memory, processing, and storage](/en/programming-basics/computer-fundamentals/03-hardware-architecture/). RAM holds current working data; storage retains files after closing.
