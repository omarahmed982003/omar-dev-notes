---
title: "HTTP Redirects: انقل العميل من غير ما تغيّر العملية بالغلط"
description: "افهم Location والفرق بين 301 و302 و303 و307 و308، وتجنب loops وopen redirects."
sidebar:
  order: 39
prev: {"link":"/programming-basics/39-http-connections-timeouts/","label":"HTTP Connections وTimeout Budget"}
next: {"link":"/programming-basics/networking-next/","label":"الشبكات والويب"}
---

<span class="foundations-reading-scope" aria-hidden="true"></span>

**Redirect — رد يطلب من العميل التوجه إلى URL آخر** يستخدم status من فئة 3xx وheader اسمه `Location`.

| Status | الاستمرار المعتاد | مناسب لـ |
|---|---|---|
| `301 Moved Permanently` | دائم؛ العملاء قد يحوّلون POST إلى GET تاريخيًا | نقل صفحة/مورد مع مراعاة caching |
| `302 Found` | مؤقت؛ قد يتحول POST إلى GET في browsers | تحويل مؤقت تقليدي |
| `303 See Other` | استخدم GET للعنوان الجديد | Post/Redirect/Get بعد form |
| `307 Temporary Redirect` | يحافظ على method وbody | نقل مؤقت لنفس العملية |
| `308 Permanent Redirect` | يحافظ على method وbody | نقل دائم لنفس العملية |

```http
HTTP/1.1 303 See Other
Location: /orders/842
```

في **Post/Redirect/Get** ينفذ server عملية POST مرة، ثم يرجع 303، فيعرض browser النتيجة بـGET؛ إعادة تحميل صفحة النتيجة لا تعيد POST تلقائيًا. ده لا يغني عن idempotency في الدفع أو APIs.

:::note[تعمق أكثر: Redirect ممكن يغيّر Method أويسرّب قرارًا]
`301` و`302` تاريخيًا قد يحولهما بعض Clients من `POST` إلى `GET`. `303` يقصد الانتقال إلى `GET`، وده مناسب لنمط **Post/Redirect/Get** بعد Form ناجحة. `307` و`308` يحافظان على Method وBody؛ الأول مؤقت والثاني دائم. لنقل API فيها Body استخدم `307/308` فقط لو Client المفروض تعيد نفس العملية، والأفضل غالبًا دعم المسارين أثناء deprecation بدل إجبار كل Clients على Redirect.

الـBrowser قد يحفظ `301/308` مدة طويلة، فاختبر بـ`302/307` قبل قرار دائم. كل Hop في Redirect chain يضيف Latency وقد يعيد DNS وConnection وTLS. كثير من Clients تحذف `Authorization` عند الانتقال إلى Host آخر، وده حماية من تسريب Credential لا عطلًا نلتف حوله.

في `/login?next=...` لا تثق في URL كاملة من المستخدم. اقبل Relative path داخل الموقع أوHost ضمن allowlist بعد Parse صحيح، وامنع أشكالًا ملتوية مثل `//evil.example`. والـCORS preflight لا تعتمد على Redirect لها؛ خلي Client تنادي Canonical URL مباشرة.
:::

## أخطاء تشغيل وأمان

- **Redirect loop**: A يحول إلى B وB يرجع إلى A؛ يحدث كثيرًا عند اختلاف فهم proxy وapp لـHTTPS أو host.
- **Redirect chain**: تحويلات متتابعة تضيف latency وتزيد فرص الفشل؛ حدّث الروابط لتشير للوجهة النهائية.
- **Open redirect**: endpoint يقبل `next=https://evil.example` من غير تحقق، فيُستخدم لخداع المستخدم. اسمح بمسارات داخلية أو allowlist دقيقة، وحلّل URL بدل فحص prefix ساذج.
- لا ترسل token أو بيانات حساسة في `Location` query.
- 301/308 قد يُخزنان؛ اختبر الانتقال قبل إعلان الدوام.

Laravel يوفر `redirect()->route('orders.show', $order)` لوجهة مسماة. لو تقبل return URL من المستخدم، تحقّق أنه relative ومسموح بدل تمريره مباشرة.

