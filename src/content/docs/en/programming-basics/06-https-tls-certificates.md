---
title: 6. HTTPS, TLS, and certificates
description: TLS guarantees, handshake, keys, certificates, and DV/OV/EV validation.
sidebar:
  order: 6
---

HTTPS is HTTP carried through TLS. TLS provides confidentiality, integrity, and authentication of the server identity represented by its certificate. It does not repair SQL injection, XSS, or broken authorization.

Asymmetric cryptography uses public/private keys for signatures and secure agreement; symmetric traffic keys efficiently protect application data. The note that a client simply encrypts a session key with the server public key describes old RSA key exchange. TLS 1.3 normally uses ephemeral key agreement such as ECDHE: both peers derive traffic keys rather than transmitting the final symmetric key, providing forward secrecy.

```text
ClientHello (versions, ciphers, key share, name)
        ↓
ServerHello (choice, key share, certificate, signature)
        ↓
Certificate/signature validation
        ↓
Derived traffic keys → encrypted HTTP
```

A certificate binds a public key to domain names and chains to a trusted CA. Clients check names in SAN, validity, chain, key usage, and proof that the server holds the private key.

DV validates domain control; OV adds organisation checks; EV applies broader organisational policy. OV/EV do not create stronger encryption than DV; they differ in identity validation.

Never ignore production certificate errors, disable API TLS verification, commit a private key, or mistake Base64 for encryption.

```bash
curl -v https://example.com/ -o NUL
```

Use `/dev/null` on Linux/macOS.
