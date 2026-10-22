---
title: "Set up a local request-and-response lab"
description: "Set up a local request-and-response lab"
sidebar:
  order: 13
prev: {"link":"/en/programming-basics/09-browser-rendering-devtools/","label":"How the browser displays a page"}
next: {"link":"/en/programming-basics/networking-next/","label":"Networking and the web"}
---

<span class="foundations-reading-scope" aria-hidden="true"></span>

This lab is **optional and uses Node.js**, a runtime for JavaScript outside the browser; it is a viewing tool, not a change from the track's default PHP examples. Without installing it, read the experiment table as input/output traces: `/missing` produces 404, `/failure` produces 500, and an existing product produces 200 plus JSON. Explain the differences first. These are model expectations, not measurements from your computer. For executable PHP alternatives, use [success/failure responses](/en/programming-basics/07-server-side-path/) or [the session lab](/en/programming-basics/22-http-state-and-updates/).

If you choose to run this lab, run a browser client and a data server locally. A **client** requests; a **server** responds. Different **ports** identify receiving programs. Use complete provided files and investigate one behavior at a time.

## Optional lab in another language: setup

1. Install Node.js and verify `node --version` using [local server setup](/en/programming-basics/computer-fundamentals/17-local-server/). No extra packages are required.
2. Create `network-practice`. Save [the complete lab.mjs](/examples/network-lab/lab.mjs) using Save link as; check it is not `lab.mjs.txt`.
3. Open PowerShell in that folder from File Explorer’s address bar and run:

```powershell
node lab.mjs
```

4. Visit `http://127.0.0.1:8765/` for the buttons. The API runs at `http://127.0.0.1:8766`. Keep the terminal open: requests log path, status, duration, and ID.
5. Stop with Ctrl+C. If a port is occupied, stop the earlier lab. Restarting clears event data and rate counters.

## Start with one response

Visit `http://127.0.0.1:8766/api/products/1`: expect Notebook, price 20, currency EGP. Open developer tools with F12, select Network, and reload. The request has status 200. Change the final 1 to 2: expect 404, a missing product in this lab.

In another **Windows PowerShell** window:

```powershell
curl.exe -i http://127.0.0.1:8766/api/products/1
```

`-i` displays response headers. Use `curl.exe` to select the executable; some PowerShell versions alias `curl` to another tool. On macOS/Linux use `curl` instead.

## Experiment map

| Experiment | Route or button | Evidence |
|---|---|---|
| One server | `/api/products/1` on 8766 | 200 and JSON |
| One proxy | Through one proxy | Same product; two headers carry the same request ID |
| Cross-origin reading | CORS buttons | Both responses arrive, but JavaScript reads only the allowed one |
| Cached copy | `/cache` on 8766 | `max-age=2`, version tag, conditional 304 |
| Polling | Poll three times | Three requests and times |
| Server stream | Receive three events | One extended request, three events |
| Missing route | `/missing` on 8766 | 404 with request ID |
| Intentional failure | `/failure` on 8766 | 500 with request ID |
| Rate limit | `/limited` on 8766 three times quickly | First two 200, third 429 within a ten-second window |

The loopback-only lab uses no personal data or accounts. Its settings teach behavior, not deployment or payments. The complete source is available; each lesson explains its relevant experiment.
