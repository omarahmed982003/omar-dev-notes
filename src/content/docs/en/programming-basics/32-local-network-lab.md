---
title: "Set up a local request-and-response lab"
description: "Set up a local request-and-response lab"
sidebar:
  order: 20
prev: {"link":"/en/programming-basics/29-browser-scheduling/","label":"Load scripts and schedule browser tasks"}
next: {"link":"/en/programming-basics/07-server-side-path/","label":"A request's journey inside the server"}
---

Run a browser client and a data server locally. A **client** requests; a **server** responds. Different **ports** identify receiving programs. Use complete provided files and investigate one behavior at a time.

## Setup

1. Install Node.js and verify `node --version` using [local server setup](/en/programming-basics/computer-fundamentals/17-local-server/). No extra packages are required.
2. Create `network-practice`. Save [the complete lab.mjs](/examples/network-lab/lab.mjs) using Save link as; check it is not `lab.mjs.txt`.
3. Open PowerShell in that folder from File Explorer’s address bar and run:

```powershell
node lab.mjs
```

4. Visit `http://127.0.0.1:8765/` for the buttons. The API runs at `http://127.0.0.1:8766`. Keep the terminal open: requests log path, status, duration, and ID.
5. Stop with Ctrl+C. If a port is occupied, stop the earlier lab. Restarting clears event data and rate counters.

## Start with one response

Visit `http://127.0.0.1:8766/api/products/1`: expect Notebook, price20, currencyEGP. Open developer tools with F12, select Network, and reload. The request has status200. Change the final1 to2: expect404, a missing product in this lab.

In another **Windows PowerShell** window:

```powershell
curl.exe -i http://127.0.0.1:8766/api/products/1
```

`-i` displays response headers. Use `curl.exe` to select the executable; some PowerShell versions alias `curl` to another tool. On macOS/Linux use `curl` instead.

## Experiment map

| Experiment | Route or button | Evidence |
|---|---|---|
| One server | `/api/products/1` on8766 |200 and JSON |
| One proxy | Through one proxy | Same product; two headers carry the same request ID |
| Cross-origin reading | CORS buttons | Both responses arrive, but JavaScript reads only the allowed one |
| Cached copy | `/cache` on8766 | `max-age=2`, version tag, conditional304 |
| Polling | Poll three times | Three requests and times |
| Server stream | Receive three events | One extended request, three events |
| Missing route | `/missing` on8766 |404 with request ID |
| Intentional failure | `/failure` on8766 |500 with request ID |
| Rate limit | `/limited` on8766 three times quickly | First two200, third429 within a ten-second window |

The loopback-only lab uses no personal data or accounts. Its settings teach behavior, not deployment or payments. The complete source is available; each lesson explains its relevant experiment.
