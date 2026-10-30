---
title: "نقل الملفات الكبيرة: Range وMultipart وStreaming"
description: "استأنف التنزيل، ارفع حقولًا وملفات، وافهم framing في HTTP/1.1 من غير تحميل كل body في memory."
sidebar:
  order: 37
prev: {"link":"/programming-basics/37-http-content-negotiation/","label":"Content Negotiation: نفس المورد بأكثر من تمثيل"}
next: {"link":"/programming-basics/39-http-connections-timeouts/","label":"HTTP Connections وTimeout Budget"}
---

<span class="foundations-reading-scope" aria-hidden="true"></span>

المشكلة هنا واحدة: body كبير أو طويل العمر لا ينفع دائمًا نتعامل معه كقطعة واحدة في memory. لكن كل آلية تحل اتجاهًا مختلفًا.

<figure class="teaching-figure visual-focus">
  <img src="/diagrams/foundations/network/large-http-transfer.svg" alt="مقارنة بصرية بين Range لتنزيل جزء وMultipart لرفع أجزاء متعددة وStreaming لإنتاج الرد تدريجيًا" loading="lazy" />
  <figcaption>Range تختار جزءًا من مورد يُنزّل، وMultipart تفصل أجزاء request مرفوع، وStreaming تصف إنتاج البيانات تدريجيًا بينما طبقة HTTP تتولى framing.</figcaption>
</figure>

## Range Requests: اطلب جزءًا من المورد

```http
GET /videos/lesson.mp4 HTTP/1.1
Range: bytes=1000000-1999999
```

لو server يدعم النطاق يرجع `206 Partial Content`:

```http
HTTP/1.1 206 Partial Content
Accept-Ranges: bytes
Content-Range: bytes 1000000-1999999/8000000
Content-Length: 1000000
```

نطاق غير قابل للتنفيذ يرجع غالبًا `416 Range Not Satisfiable` ومعه `Content-Range: bytes */8000000`. **If-Range** يقول: أرسل الجزء فقط لو validator ما زال يطابق؛ وإلا أرسل المورد كاملًا، وده يمنع جمع أجزاء من نسختين مختلفتين.

## Multipart: حقول وملف في Request واحد

`multipart/form-data` يقسم body إلى أجزاء يفصلها **Boundary — علامة فصل فريدة**. كل part له headers وبياناته:

```http
Content-Type: multipart/form-data; boundary=demo-boundary

--demo-boundary
Content-Disposition: form-data; name="title"

avatar
--demo-boundary
Content-Disposition: form-data; name="photo"; filename="me.png"
Content-Type: image/png

...binary bytes...
--demo-boundary--
```

لا تثق في filename أو MIME القادم من العميل. ضع حدودًا للحجم والعدد والوقت، افحص المحتوى، خزّن باسم يولده النظام، ولا تحمل الملف كله في memory. في Laravel استخدم validation مثل `file` و`mimes` و`max`، ثم storage API.

للملفات الضخمة قد يكون **Direct-to-object-storage upload** أفضل: التطبيق يصدر URL محدود الصلاحية والحجم، والعميل يرفع للتخزين مباشرة، ثم يؤكد التطبيق metadata. ده يقلل ضغط workers لكنه يحتاج authorization وexpiry وقيودًا ومراجعة اكتمال الرفع.

:::note[تعمق أكثر: اسم الملف وMIME مش دليل على محتواه]
`photo.jpg` و`Content-Type: image/jpeg` كلام أرسله Client؛ المهاجم يقدر يغيرهما. **Magic bytes** هي توقيع بايتات في بداية صيغ كثيرة يساعدك تتعرف على النوع الفعلي. افحصها بمكتبة موثوقة، ثم حاول Parse أوdecode للصيغة المتوقعة؛ التوقيع وحده مش Antivirus ولا يثبت إن الملف آمن.

خزّن الملف باسم يولده النظام خارج مجلد تنفيذ الكود، وحدد الحجم وعدد الأجزاء والمدة قبل وأثناء القراءة. لو التطبيق يحتاج صورة، أعد ترميزها بدل تقديم البايتات الأصلية مباشرة متى كان ده مناسبًا، ولا تسمح للامتداد أوMIME القادم من Client يختار مسار تنفيذ.
:::

:::note[تعمق أكثر: Direct upload لسه له مرحلة تحقق]
في Direct-to-object-storage upload، الـAPI يصدر Signed URL قصير العمر ومقيدًا بالمستخدم وObject key والحجم أوالنوع قدر الإمكان. انتهاء رفع الـClient لا يعني إن الملف أصبح موثوقًا: سجله أولًا بحالة `pending`، وبعد Event من التخزين أوConfirm request شغّل Worker يفحص النوع والحجم وAntivirus ويستخرج metadata أوthumbnail داخل بيئة معزولة.

انقل الملف إلى مكانه النهائي أوغيّر حالته إلى `ready` فقط بعد نجاح الفحص. عند الفشل اعزله أوامسحه حسب سياسة معلنة، وسجّل السبب من غير كشف أسرار. كده المستخدم لا يقدر يجعل رابط عام يشير إلى ملف غير مفحوص في اللحظة بين الرفع والمعالجة.
:::

## Chunked transfer encoding مش هو streaming نفسه

في HTTP/1.1، لما sender لا يعرف الطول مقدمًا يمكنه استخدام `Transfer-Encoding: chunked`. كل chunk يبدأ بحجمه hexadecimal، وينتهي stream بـchunk حجمه صفر. دي **Framing — طريقة تحديد حدود البيانات على السلك**؛ التطبيق قد ينتج stream، لكن proxy قد يجمعه في buffer.

HTTP/2 وHTTP/3 لا يستخدمان صيغة chunked دي؛ عندهما frames خاصة بالبروتوكول. لذلك لا تضف `Transfer-Encoding: chunked` يدويًا داخل Laravel؛ web server/runtime يدير framing. أنت ركز على streaming response، تعطيل buffering حيث يلزم، timeouts، backpressure، والتعامل مع انقطاع العميل.

| الحاجة | الآلية |
|---|---|
| استئناف تنزيل أو seek لفيديو | Range + `206` |
| رفع حقول وملفات معًا | `multipart/form-data` |
| إرسال output قبل معرفة الحجم | Streaming؛ HTTP layer تختار framing |

