---
title: "Content Negotiation: نفس المورد بأكثر من تمثيل"
description: "افهم Accept وContent-Type وAccept-Language وVary واختبر اختيار representation صحيح."
sidebar:
  order: 36
prev: {"link":"/programming-basics/36-network-troubleshooting/","label":"تشخيص الشبكة من DNS لحد HTTP"}
next: {"link":"/programming-basics/38-http-large-transfers/","label":"نقل الملفات الكبيرة: Range وMultipart وStreaming"}
---

<span class="foundations-reading-scope" aria-hidden="true"></span>

**Representation — تمثيل المورد** هو البايتات والـmetadata التي تصف حالة المورد في رد معين. نفس المنتج قد يُرسل JSON أو HTML، وبالعربية أو الإنجليزية. **Content Negotiation** هو اختيار التمثيل المناسب من قدرات server وتفضيلات العميل.

## الطلب يفضّل والرد يصرّح

```http
GET /products/42 HTTP/1.1
Host: api.example.test
Accept: application/json
Accept-Language: ar, en;q=0.8
Accept-Encoding: br, gzip
```

`Accept` يصف media types المقبولة. `q` وزن من 0 إلى 1؛ الأعلى أفضل، وصفر يعني غير مقبول. `Accept-Language` للغة، و`Accept-Encoding` لضغط النقل. في الرد، `Content-Type` يصف **التمثيل المرسل فعلًا**، و`Content-Encoding` يصف التحويل مثل `gzip`.

```http
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8
Content-Language: ar
Content-Encoding: gzip
Vary: Accept, Accept-Language, Accept-Encoding
```

| Header | اتجاهه | معناه |
|---|---|---|
| `Accept` | Request | الأنواع التي يفضّلها العميل |
| `Content-Type` | Request أوResponse | نوع body الموجود فعلًا |
| `Accept-Language` | Request | اللغات المقبولة وترتيبها |
| `Content-Language` | Response | لغة التمثيل المرسل |
| `Vary` | Response | request headers التي تغيّر نسخة الكاش |

من غير `Vary` مناسب قد يعيد cache نسخة عربية لعميل إنجليزي أو نسخة مضغوطة لعميل لا يدعمها. ولو لا يوجد تمثيل مقبول، `406 Not Acceptable` ممكن، لكن APIs كثيرة تختار default موثّقًا. أما body مرسل بنوع لا يقبله endpoint فقد ينتج `415 Unsupported Media Type`؛ ده سؤال عن `Content-Type` الداخل، مش `Accept` الخارج.

## مثال Laravel

```php
Route::get('/products/{id}', function (int $id, Request $request) {
    abort_unless($request->acceptsJson(), 406);

    return response()
        ->json(['id' => $id, 'name' => 'Keyboard'])
        ->header('Vary', 'Accept, Accept-Language');
});
```

المثال يوضح القرار فقط؛ localization الحقيقي يحتاج قائمة لغات مدعومة وfallback واضح، والـproxy يجب ألا يحذف `Vary`.

