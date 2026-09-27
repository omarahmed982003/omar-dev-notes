---
title: "How peers establish an encrypted connection"
description: "How peers establish an encrypted connection"
sidebar:
  order: 17
prev: {"link":"/en/programming-basics/06-https-tls-certificates/","label":"Connection encryption and website certificates"}
next: {"link":"/en/programming-basics/09-browser-rendering-devtools/","label":"How the browser displays a page"}
---

Study the details behind an encrypted connection after learning encryption, certificates, and issuers in the HTTPS lesson. Follow each message in order.

## Keys are not the password you type

An **encryption key** is a value used by a cryptographic algorithm, a defined computational procedure, to protect or recover data.

- **Symmetric cryptography** uses shared secret material to protect messages efficiently. **AES-GCM** and **ChaCha20-Poly1305** are algorithms that combine encryption with detection of modification.
- **Asymmetric cryptography** uses a shareable **public key** and a secret **private key**. A **digital signature** is evidence created with the private key and checked with the public key.

We do not encrypt the entire page with the public key. Connection setup establishes identity and secrets; **traffic keys** then protect application data. The phrase **session keys** refers here to connection keys, not an application login session.

Older **RSA key exchange** encrypted a preliminary secret with the server public key; connection keys were derived from it. TLS 1.3 does not use that mechanism. A typical certificate-based TLS 1.3 handshake can use **ECDHE, Elliptic Curve Diffie–Hellman Ephemeral**, a temporary key-agreement method: each peer sends a public contribution and retains a secret contribution, and both derive the same secret without sending the final secret.

Correct ephemeral agreement and erasure of temporary secrets provide **forward secrecy**: later theft of the certificate private key alone cannot decrypt recorded earlier traffic. Resuming a previous connection has additional rules; one diagram does not cover every handshake mode.

## Starting the connection

A **handshake** is the setup exchange. This simplified diagram shows a full certificate-based TLS 1.3 handshake:

```text
Client -> ClientHello: supported versions, key share, hostname
Server -> ServerHello: chosen settings, server key share
Both derive keys protecting the rest of the handshake
Server -> EncryptedExtensions, Certificate, CertificateVerify, Finished
Client checks the certificate, signature, and handshake completion
Client -> Finished
Both exchange HTTP using application traffic keys
```

Hello messages begin negotiation. EncryptedExtensions carries protected settings. Certificate carries the certificate, CertificateVerify proves private-key possession and binds it to this handshake, and Finished checks the handshake agreement. **The certificate is not part of ServerHello itself.**

**Cipher suites** identify supported protection algorithms. In TLS 1.3, the chosen suite alone does not determine the key-agreement method or certificate type. Resumption can reduce setup messages. HTTP/3 uses **QUIC (a UDP-based transport protocol adding reliable streams and protected communication)**, a transport protocol integrating TLS 1.3, covered in [the HTTP versions lesson](/en/programming-basics/16-http2-http3-quic/).

## Expiry and revocation

**Expiry** means reaching the end of the stated validity period. **Revocation** withdraws trust before expiry, for example after private-key exposure.

- **CRL, Certificate Revocation List:** a list of certificates revoked by an issuer.
- **OCSP, Online Certificate Status Protocol:** a protocol for querying certificate status.
- **OCSP stapling:** the server supplies an issuer-signed status response instead of requiring a separate client retrieval.

Support and behavior when status cannot be checked vary by client and configuration.

## Related connection features

**HSTS, HTTP Strict Transport Security**, is a policy learned over valid HTTPS that asks the browser to use HTTPS for future connections during a specified period. Some sites are also covered by preload lists. HSTS does not repair an expired or mismatched certificate.

**ALPN, Application-Layer Protocol Negotiation**, negotiates an application protocol such as HTTP/2 within TLS. It is not another certificate type.

**mTLS, Mutual TLS**, also authenticates the client with a certificate. It can identify communicating services, but the application still decides which operations that identity may perform.
