---
title: 6. HTTPS وTLS والشهادات
description: ما الذي يحميه HTTPS، كيف يعمل TLS Handshake، المفاتيح، Session Keys، والشهادات DV وOV وEV.
sidebar:
  order: 6
---

## HTTPS

**HTTPS = HTTP over TLS**. لا يغيّر دلالات GET وPOST أو status codes، لكنه ينقل رسائل HTTP داخل قناة محمية.

يوفر TLS ثلاث خصائص رئيسية:

1. **Confidentiality:** منع قراءة المحتوى في الطريق.
2. **Integrity:** كشف تعديل البيانات.
3. **Authentication:** التحقق من أن الخادم يملك الهوية/المفتاح المرتبط بالشهادة.

HTTPS لا يصلح SQL Injection أو XSS أو ضعف الصلاحيات، ولا يخفي بالضرورة عنوان IP أو اسم النطاق عن كل طبقات الشبكة.

## التشفير المتماثل وغير المتماثل

- **Asymmetric cryptography:** زوج Public/Private Key. مناسب للتوقيع والاتفاق الآمن على الأسرار، لكنه أعلى كلفة.
- **Symmetric cryptography:** مفتاح مشترك مثل Session Key لتشفير بيانات الاتصال بسرعة، مثل AES-GCM أو ChaCha20-Poly1305.

الملاحظات تشرح أن العميل ينشئ Session Key ويشفره بـPublic Key. هذا يصف RSA key exchange القديم بصورة مبسطة. في TLS 1.3 يجري عادة **اتفاق مفاتيح مؤقت ECDHE**؛ لا يُرسل Session Key النهائي نفسه، بل يشتق الطرفان مفاتيح متماثلة من السر المشترك وبيانات المصافحة. هذا يوفر Forward Secrecy.

## TLS 1.3 Handshake مبسط

```text
ClientHello
- supported TLS versions
- cipher suites
- key share
- server name
        ↓
ServerHello
- chosen parameters
- server key share
- certificate + signature
        ↓
Client validates certificate and signature
Both derive traffic keys
        ↓
Encrypted HTTP data
```

قد تُستأنف جلسة سابقة فتقل الخطوات. ومع QUIC/HTTP/3 يندمج TLS 1.3 داخل بروتوكول QUIC.

## ما الشهادة الرقمية؟

تربط الشهادة Public Key باسم نطاق، وتوقّعها Certificate Authority موثوقة أو سلسلة تنتهي في Root CA موجودة في Trust Store.

يفحص العميل عادة:

- اسم النطاق في SAN.
- مدة الصلاحية.
- سلسلة التوقيع حتى Root موثوق.
- Key Usage/Extended Key Usage.
- حالة الإلغاء عند دعم آليته.
- توقيع الخادم الذي يثبت امتلاك Private Key.

امتلاك الشهادة لا يعني أن الموقع «آمن من كل شيء»؛ يعني أن الاتصال بهوية النطاق المطلوبة موثق ومشفر ضمن حدود TLS.

## مستويات التحقق

| النوع | ما تتحقق منه CA |
|---|---|
| DV | السيطرة على النطاق |
| OV | النطاق وهوية المؤسسة وفق إجراءات CA |
| EV | تحقق مؤسسي أوسع وفق سياسة EV |

:::caution[تصحيح]
OV وEV لا يعنيان خوارزمية تشفير أقوى من DV. قوة القناة تعتمد على TLS والإعدادات؛ الفرق في مقدار التحقق من هوية الجهة، كما أن المتصفحات الحديثة لا تعرض EV بالطريقة البارزة القديمة.
:::

## أخطاء شائعة

- تجاهل تحذير certificate في الإنتاج.
- استخدام `http://` لإرسال كلمة مرور.
- تعطيل TLS verification في عميل API.
- حفظ Private Key داخل Git.
- الاعتقاد أن Base64 تشفير؛ هو encoding فقط.

## تجربة

افتح DevTools → Security أو نفذ:

```bash
curl -v https://example.com/ -o NUL
```

راقب نسخة TLS والشهادة وALPN الذي قد يختار HTTP/2. لا تطبع أسرارًا أو tokens أثناء التصحيح.
