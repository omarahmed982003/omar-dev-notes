---
title: "Files, folders, and saving"
description: "Create a folder, save a file inside it, close it, and reopen it from its location. Use the note you wrote in Notepad."
sidebar:
  order: 3
prev: {"link":"/en/programming-basics/computer-fundamentals/01-using-your-computer/","label":"Windows, pointing, and typing"}
next: {"link":"/en/programming-basics/computer-fundamentals/03-programs-installation-safety/","label":"Programs, installation, and safe use"}
---

Create a folder, save a file inside it, close it, and reopen it from its location. Use the note you wrote in Notepad.

## Two separate tasks after saving

After the saving steps below, do one task at a time:

1. **Compression:** Copy two practice files into a new folder. Use File Explorer’s ZIP compression option. ZIP groups files and may reduce their size. Extract into another folder and open both: compare contents, not just the `.zip` extension.
2. **Backup:** Copy a practice file to another device you own, such as a USB drive. Open that copy, then change only the original: the copy does not update automatically. Two copies on one disk do not protect against failure of that disk.

Keep the originals. A compressed file may be part of a backup, but compression alone does not choose a safe backup location.

## A file has a name, location, and contents

A file is a saved unit with a name and contents, such as text or an image. A folder groups files and other folders. A path describes the location: “Documents, then FirstSteps, then note.txt.” Documents may be inside OneDrive on some devices; use your actual location rather than assuming a fixed path.

An extension is the final part after the dot, such as `.txt` for text, `.png` for an image, or `.html` for a page. It helps the system select an application but does not guarantee content or safety. Renaming an image to `.txt` does not convert it to text.

## Save and verify

1. Open File Explorer from the taskbar or with Windows+E.
2. Open Documents and create a folder named `FirstSteps` using New → Folder or the context menu.
3. Return to Notepad, choose File → Save As, select `FirstSteps`, name the file `note.txt`, and save.
4. Close the file and reopen it from that folder. Expect the same two lines.

Save updates the current file; Save As allows another name or location. Ctrl+S saves in many programs. Check the filename at the top of the window so you do not edit the wrong copy.

## Show extensions

In Windows 11 File Explorer, look under View → Show for File name extensions. Other versions offer a similar option under View or Folder Options. The goal is seeing the full name, not memorizing a menu location. `hello.html.txt` ends in `.txt`, so it may open as text rather than as a page.

Copy and paste `note.txt` in the same folder to create an independent copy. Rename the copy `note-copy.txt`, change a line, and save. The original should remain unchanged. Delete only the practice copy into Recycle Bin, then open the bin and Restore it. Some locations/drives bypass the bin; never practice deletion on important data.

## Downloads, archives, and backups

A ZIP file contains other files and may compress them. If you download zipped examples, use Extract All into a known folder before editing them. Check Downloads when locating a downloaded file.

Two copies on one drive help with experiments but do not protect against drive failure; important backups need an independent location. A file saved locally is not necessarily uploaded to the internet.

**Exercise:** Create `FirstSteps/practice/result.txt` containing 5. Close and reopen it without using a recent-files list. Follow the folders in order; if missing, check the Save As location and full extension.
