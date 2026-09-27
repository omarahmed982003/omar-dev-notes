---
title: "Resource loading and window isolation"
description: "Resource loading and window isolation"
sidebar:
  order: 26
prev: {"link":"/en/programming-basics/11-same-origin-cors/","label":"Controlling cross-origin data access"}
next: {"link":"/en/programming-basics/12-realtime-webhooks/","label":"Poll or receive a server stream"}
---

Read the CORS experiment first: it governs a script’s access to a cross-origin response. These policies answer different questions:

| Policy | Full name | Question |
|---|---|---|
| CORP | Cross-Origin Resource Policy | May a resource be used in relevant cross-origin requests, including no-cors loads? |
| COEP | Cross-Origin Embedder Policy | Does the document require appropriate permissions for embedded resources? |
| COOP | Cross-Origin Opener Policy | Should browsing contexts be separated when opener policies differ? |

**no-cors** gives a script an opaque response rather than disabling protection. Appropriate combinations can provide isolation required by certain browser capabilities; careless headers can block loads or change window communication.

**Reason:** displaying a cross-origin image does not prove that script can read its response. Distinguish embedding and response access before changing policy.

Other policies solve different isolation problems: **CORP, Cross-Origin Resource Policy**, restricts selected resource loading; **COEP, Cross-Origin Embedder Policy**, sets requirements for resources embedded by a document; **COOP, Cross-Origin Opener Policy**, separates browsing contexts according to policy.
