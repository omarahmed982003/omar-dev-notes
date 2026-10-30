---
title: "Troubleshoot from DNS through HTTP"
description: "A bottom-up evidence ladder separating name, route, port, TLS, and HTTP failures."
sidebar:
  order: 35
prev: {"link":"/en/programming-basics/35-vpc-firewalls/","label":"VPC and firewalls: define service network boundaries"}
next: {"link":"/en/programming-basics/37-http-content-negotiation/","label":"Content negotiation: one resource, multiple representations"}
---

<span class="foundations-reading-scope" aria-hidden="true"></span>

Start at the lowest layer for which you have evidence, then move upward. One successful stage does not prove the next.

<figure class="teaching-figure visual-focus">
  <img src="/diagrams/foundations/network/troubleshooting-ladder.svg" alt="A troubleshooting ladder progressing from host configuration through DNS, route, port, TLS, and finally HTTP and application behavior" loading="lazy" />
  <figcaption>Work bottom-up and preserve the first failed stage as evidence. DNS success does not prove the port; TCP success does not prove TLS; an HTTP 500 means the exchange reached HTTP.</figcaption>
</figure>

| Stage | Question | Common Windows tool |
|---|---|---|
| Host configuration | Address, gateway, and DNS present? | `ipconfig /all` |
| DNS | Which records does the name return? | `nslookup` or `Resolve-DnsName` |
| Route | Where does the path stop? | `tracert`, `route print` |
| Reachability | Does ICMP answer? | `ping`; silence does not prove service failure |
| Port | Can TCP connect? | `Test-NetConnection host -Port 443` |
| Listener | Is the local process listening? | `Get-NetTCPConnection -State Listen` |
| TLS | Are name, certificate, and negotiation valid? | `curl.exe -v https://...` |
| HTTP | What status, headers, and body arrived? | `curl.exe -i`, DevTools Network |

```powershell
Resolve-DnsName example.com
Test-NetConnection example.com -Port 443
curl.exe -v https://example.com/ -o NUL
curl.exe -i https://example.com/
```

`ping` uses ICMP, which may be blocked while HTTPS works. A silent intermediate `tracert` hop does not prove path failure when the destination remains reachable.

DNS errors occur before TCP. A timeout can mean routing, dropped firewall traffic, or a slow service. Refusal usually means the address answered but no listener accepted. A certificate error means TCP worked but channel validation failed. HTTP `404` or `500` means the exchange reached HTTP and now points toward routing or application behavior.

A **packet capture** records visible packets on an interface. It can contain addresses, tokens, and sensitive data, and TLS payload is not automatically readable. Capture the smallest safe scope and protect the result.

