---
title: "Connection encryption and website certificates"
description: "Understand TLS, certificate authorities, DV, OV, and EV through an explained connection and practical checks."
sidebar:
  order: 16
prev: {"link":"/en/programming-basics/22-http-state-and-updates/","label":"Remembering users and protecting updates"}
next: {"link":"/en/programming-basics/23-tls-handshake-details/","label":"How peers establish an encrypted connection"}
---

A password travels through networks before reaching a website. We need to prevent an observer from reading or changing it and verify the destination. **TLS, Transport Layer Security**, defines how two programs establish a protected connection. This lesson explains that connection and then the certificate labels.

Review [HTTP messages](/en/programming-basics/05-http-messages-state/) first: the browser is a client sending a request, and the server is the program responding.

## HTTP and HTTPS

**HTTP, Hypertext Transfer Protocol**, defines web requests and responses. **HTTPS (HTTP carried over a TLS-protected connection)** carries HTTP over TLS. GET still requests a resource, and 200 still indicates HTTP success; transport protection changes.

TLS provides **confidentiality**, preventing observers from reading protected content; **integrity**, detecting unauthorized changes; and **authentication**, checking evidence that binds the destination name to a key controlled by the server.

Protection ends at the connection endpoints. A compromised server can read decrypted data. HTTPS does not fix **SQL injection**, input that changes a database command, **XSS (Cross-Site Scripting)**, hostile code running in a user's page, or broken access permissions. The destination **IP (Internet Protocol, the addressing and routing protocol; an IP address identifies a network interface in context) address**, its network address, can remain visible, and the hostname may be exposed by parts of the connection process.

## What a certificate says

A **domain name** is a name such as example.com. A **digital certificate** binds website names to a public key and validity period, with an issuer's signature.

A **CA, Certificate Authority**, checks a certificate applicant and signs the certificate. A browser or operating system maintains a **trust store**, a collection of trusted authorities. A certificate chain commonly runs from the website through an intermediate authority to a trusted **root CA**.

The client checks:

1. Whether the requested name appears in **SAN, Subject Alternative Name**, the certificate field listing covered names.
2. Whether the current time falls within the validity period; an incorrect device clock can cause errors.
3. Whether the signature chain reaches a trusted authority.
4. Whether **Key Usage and Extended Key Usage** permit the intended use.
5. Whether the server proves private-key possession and whether applicable revocation checks accept the certificate.

A valid certificate for shop.example does not validate bank.example. Encryption without checking the intended name is insufficient.

## DV, OV, and EV

These labels describe **validation before certificate issuance**. Domain control means proving the ability to perform a required challenge in domain settings or at an approved location on the website. It is not a guarantee that every page is secure.

| Label and full name | Plain meaning | Example of what it establishes |
|---|---|---|
| **DV — Domain Validation** | The applicant controls the domain name | Ability to publish an approved domain-verification record; no verified legal company identity |
| **OV — Organization Validation** | Domain control plus checks on the applicant organization | Organization identity and existence checked using accepted records and sources |
| **EV — Extended Validation** | Organizational validation with additional specified checks | Legal and operational existence and the authority of the certificate requester |

**OV and EV do not provide stronger encryption than DV.** They can use the same TLS settings. The difference concerns identity checks, not guaranteed honesty. Browser certificate displays vary; do not identify certificate type from an obsolete color or interface icon.

## Inspect a certificate

Open https://example.com and find certificate information through the browser's connection controls; exact menus vary. Record one SAN name, the **issuer**, and validity dates. These are public information, not the private key.

On Windows, open PowerShell from Start:

```powershell
curl.exe -v https://example.com/ -o NUL
```

curl.exe is an HTTP client; -v shows connection details, and -o NUL discards page content. On Linux/macOS, use curl and /dev/null instead of NUL. Depending on the build, details may show TLS and ALPN. Do not bypass verification errors or print passwords and access tokens while diagnosing.

**Worked exercise:** A certificate-name mismatch appears. Would buying EV fix it? No: the certificate must cover the requested name and be configured correctly. If verification succeeds but HTTP returns 500, investigate request processing rather than replacing a valid certificate.

## Mistakes and understanding checks

- Sending a password over http:// does not gain TLS protection; use the correct HTTPS address.
- Committing a private key to **Git**, a file-history tool, exposes it to history readers. Exposure requires key replacement and appropriate certificate revocation, not merely deleting a line.
- **Base64** is a reversible representation using text characters. It is **encoding**, not secret-key encryption.

<details><summary>Does working HTTPS prove the site owner is honest?</summary><p>No. It establishes a protected connection to the checked name. A fraudulent site can have a valid certificate for its own name.</p></details>
<details><summary>Why separate certificates from traffic keys?</summary><p>A certificate binds identity to a public key. Setup verifies identity and establishes secrets; efficient symmetric traffic keys protect application data.</p></details>
<details><summary>Explain DV, OV, and EV in one sentence.</summary><p>DV checks domain control, OV adds organization checks, and EV applies more extensive organizational requirements; this is identity validation, not an encryption-strength ranking.</p></details>

You can now distinguish network reachability, certificate verification, and HTTP errors after connection setup. Next: [how the browser renders a page](/en/programming-basics/09-browser-rendering-devtools/).

## References

- [TLS 1.3 handshake messages](https://www.rfc-editor.org/rfc/rfc8446#section-2).
- [Website certificate requirements](https://cabforum.org/working-groups/server/baseline-requirements/requirements/).
- [Extended Validation requirements](https://cabforum.org/working-groups/server/extended-validation/guidelines/).

## Next step

After completing this practice, continue with [How peers establish an encrypted connection](/en/programming-basics/23-tls-handshake-details/).
