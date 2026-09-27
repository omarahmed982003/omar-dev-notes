---
title: "Run your files at a stable local address"
description: "Run your files at a stable local address"
sidebar:
  order: 23
prev: {"link":"/en/programming-basics/computer-fundamentals/14-runtime-errors/","label":"Read data and handle a failed operation"}
next: {"link":"/en/programming-basics/computer-fundamentals/15-saving-data/","label":"Save a list and open it again"}
---

To test storage in your own files, run a small program that serves them at a stable address. A **local server** runs on your computer and answers browser requests; publishing to the Internet is unnecessary.

## Set up the tool once

1. Open the [official Node.js download page](https://nodejs.org/en/download). Node.js runs JavaScript outside a browser. Choose **LTS**, the long-term support release, and the Windows installer appropriate for your computer. Follow its installation steps.
2. Close an old PowerShell window and open a new one. Run `node --version`. A version such as `v24...` or later confirms the command is available; it need not match this example exactly.
3. If `node` is unknown, finish installation and reopen PowerShell before continuing.

## Serve your practice folder

1. Put `storage.html` and `shopping.html` in one practice folder. If you have not written them yet, start with your first program as `hello.html`.
2. Use Save link as to save [serve.mjs](/examples/first-program/serve.mjs) in the **same folder**. Check that it is not named `serve.mjs.txt`; the files lesson explains showing extensions.
3. Open that folder in File Explorer, type `powershell` in its address bar, and press Enter. In the terminal, run:

```powershell
node serve.mjs
```

4. Keep the terminal open. Visit `http://127.0.0.1:8000/hello.html`, replacing the filename with `storage.html` when available. `127.0.0.1` addresses this computer; `8000` selects the receiving program.
5. Change and save the HTML file, then reload. Seeing your change proves that you are running your own file.
6. Stop with Ctrl+C in the terminal. Restart using the same command and folder.

## Identify setup failures

| Observation | Check |
|---|---|
| `Cannot find module` | Is `serve.mjs` in the terminal folder? `Get-Location` shows the folder; `Get-ChildItem` lists names |
| `File not found` | The server runs, but the HTML filename or location differs |
| `Port 8000 is busy` | Stop the earlier server with Ctrl+C |
| Browser cannot connect | Is the server still running? |

Use the same address for every storage experiment: `127.0.0.1` and `localhost` are different storage hosts even when they reach the same computer. The tool serves practice files beside itself and listens only locally. Its source is available, but understanding every server instruction is not a prerequisite; the networking section explains that role.

**Practice:** Run `hello.html`, change its message, stop the server, then reload. Explain the difference between a file on disk and a currently running server.
