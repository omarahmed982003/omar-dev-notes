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

## Lesson map

<div class="lesson-diagram" role="img" aria-label="Concept map: HTTPS, TLS, and certificates">
<p class="lesson-diagram-title">Concept map: HTTPS, TLS, and certificates</p>
<div class="diagram-flow">
<div class="diagram-node input"><span>HTTPS is HTTP carried through TLS</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>Asymmetric cryptography uses public/private keys for signatures and</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>A certificate binds a public key to domain</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node decision"><span>DV validates domain control; OV adds organisation checks;</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node output"><span>Never ignore production certificate errors, disable API TLS</span></div>
</div>
</div>

## Check your understanding

<div class="lesson-quiz" role="list">
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">01</span><p>Explain “HTTPS is HTTP carried through TLS” as if reviewing a real implementation. What is its goal and most important constraint?</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> HTTPS is HTTP carried through TLS. TLS provides confidentiality, integrity, and authentication of the server identity represented by its certificate. It does not repair SQL injection, XSS, or broken authorization. In practice, a successful happy path is insufficient: document assumptions and validate the values and states that can break this behavior.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">02</span><p>Compare “HTTPS is HTTP carried through TLS” with “Asymmetric cryptography uses public/private keys for signatures and”. Why does neither replace the other in “HTTPS, TLS, and certificates”?</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> For “HTTPS is HTTP carried through TLS”: HTTPS is HTTP carried through TLS. TLS provides confidentiality, integrity, and authentication of the server identity represented by its certificate. It does not repair SQL injection, XSS, or broken authorization. For “Asymmetric cryptography uses public/private keys for signatures and”: Asymmetric cryptography uses public/private keys for signatures and secure agreement; symmetric traffic keys efficiently protect application data. The note that a client simply encrypts a session key with the server public key describes old RSA key exchange. TLS 1.3 normally uses ephemeral key agreement such as ECDHE: both peers derive traffic keys rather than transmitting the final symmetric key, providing forward… The first covers one part of the design while the second completes the behavior or constraints required for a correct implementation.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">03</span><p>Assume a system ignores “A certificate binds a public key to domain”. What failure or risk should you expect, and how would a test expose it?</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> A certificate binds a public key to domain names and chains to a trusted CA. Clients check names in SAN, validity, chain, key usage, and proof that the server holds the private key. Test a valid path, an exact boundary, and invalid input, then inspect output, side effects, and logs rather than treating the absence of an exception as success.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">04</span><p>Turn “DV validates domain control; OV adds organisation checks;” into a reviewable engineering decision. What should be documented and tested?</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> DV validates domain control; OV adds organisation checks; EV applies broader organisational policy. OV/EV do not create stronger encryption than DV; they differ in identity validation. Record the rationale, alternatives, and limits; test normal behavior, minimum and maximum boundaries, partial failure, and retry or repetition when applicable.</div></details>
</section>
</div>
