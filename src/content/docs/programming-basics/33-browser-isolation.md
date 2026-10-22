---
title: "سياسات تحميل الموارد وعزل النوافذ"
description: "سياسات تحميل الموارد وعزل النوافذ"
sidebar:
  order: 25
prev: {"link":"/programming-basics/11-same-origin-cors/","label":"السماح بقراءة البيانات بين المواقع"}
next: {"link":"/programming-basics/12-realtime-webhooks/","label":"اسأل دوريًا أو استقبل بثًا من الخادم"}
---

<span class="foundations-reading-scope" aria-hidden="true"></span>
صورة بتظهر من موقع تاني، لكن JavaScript ما تعرفش تقرأ جسم ردها. وبعد إضافة سياسة حماية اختفت الصورة نفسها. ليه؟ لأن **قراءة الرد** و**تضمين المورد** و**العلاقة بين نافذتين** ثلاثة قرارات مختلفة.

ده درس تعمق اختياري بعد [CORS](/programming-basics/11-same-origin-cors/) وأساس HTML وJavaScript. مش شرطًا قبل أول تطبيق ويب. تقدر تبدأ بالتتبع الجاهز من غير كتابة كود، وترجع للمعمل بعد [تجهيز PHP](/php/00-lab-setup/).

## ابدأ بثلاث حاجات مختلفة

**Origin — أصل** هو scheme وhost وport معًا. `http://127.0.0.1:8775` و`http://127.0.0.1:8776` أصلان مختلفان بسبب المنفذ، رغم أنهما على نفس الجهاز.

**Embedding — تضمين** تحميل مورد لاستخدامه داخل الصفحة، زي صورة داخل وسم `img`. **Reading — قراءة** أن يحصل برنامج الصفحة على محتوى الرد ويفحصه. عرض صورة مش تصريحًا بقراءة بايتاتها من أي كود.

**no-cors** وضع لبعض طلبات الموارد لا يطلب إذن قراءة CORS بالطريقة المعتادة؛ وفي طلب JavaScript ينتج عادة **Opaque response — رد معتم** لا يكشف الجسم أو الحالة للبرنامج. الاسم لا يعني إيقاف أمان المتصفح.

| القرار | السياسة المتعلقة به | مَن يرسلها؟ |
|---|---|---|
| هل كود أصل آخر يقرأ الرد؟ | CORS | الخادم صاحب الرد |
| هل المورد يقبل تضمينًا معينًا عبر no-cors؟ | CORP | الخادم صاحب المورد |
| هل الصفحة تشترط سماحًا للموارد التي تضمها؟ | COEP | الخادم صاحب الصفحة |
| هل تبقى علاقة النافذة بالنافذة الفاتحة؟ | COOP | خادم المستند الأعلى |

## CORP: المورد يحدد نطاق استعماله

**CORP، Cross-Origin Resource Policy** حقل رد يقيّد استخدام المورد في طلبات no-cors. مثلًا يرد خادم الصورة:

~~~http
Cross-Origin-Resource-Policy: same-origin
~~~

ده يمنع استخدام الصورة عبر no-cors من أصل مختلف. `same-site` أوسع وفق تعريف site، و`cross-origin` يسمح بالتحميل من أصول مختلفة في هذا السياق.

**تتبع جاهز:** صفحة 8775 فيها صورة من 8776، ورد الصورة 200 ومعه `same-origin`. المتصفح يقدر يستلم الرد على الشبكة، لكنه يمنع تضمينه وفق السياسة؛ رمز 200 وحده مش دليل إن الصورة مسموح تظهر.

CORP مش Authentication — تحقق هوية، ولا Authorization — صلاحية مورد. أداة خارج المتصفح لا تتحول لعميل ممنوع لمجرد الحقل ده؛ حماية البيانات عند الخادم مطلوبة.

## COEP: الصفحة تشترط إذنًا للموارد

**COEP، Cross-Origin Embedder Policy** سياسة المستند الذي يضم موارد أخرى. الإعداد التالي يقول: مورد مختلف الأصل بطلب no-cors لازم يعلن سماح CORP مناسبًا:

~~~http
Cross-Origin-Embedder-Policy: require-corp
~~~

لصورة من أصل مختلف، عندنا في هذا المثال بديلان واضحان:

- تحميل no-cors ورد المورد يحتوي `Cross-Origin-Resource-Policy: cross-origin`.
- طلب CORS، مثل صورة لها `crossorigin="anonymous"`، مع رد CORS يسمح بأصل الصفحة.

COEP لا يلغي منعًا صريحًا في CORP، ولا يصنع إذن CORS من نفسه. ولو لا تملك خادم المورد فلا تغيّر رأس الصفحة عشوائيًا؛ راجع هل المورد مناسب لسياسة تطبيقك أصلًا.

فيه قيمة `credentialless` تسمح ببعض تحميلات no-cors عبر الأصل من غير بيانات اعتماد مثل Cookies وفق دعم المتصفح. مش نفس إعداد require-corp، ومش تصريحًا بنسخ وصفة بلا مراجعة احتياجات الدخول.

## COOP: العلاقة بين نافذتين

**COOP، Cross-Origin Opener Policy** يحدد مشاركة المستندات العليا في **Browsing context group — مجموعة سياقات تصفح**: مجموعة نوافذ/تبويبات يمكن أن تحتفظ بعلاقات برمجية محددة بينها.

~~~http
Cross-Origin-Opener-Policy: same-origin
~~~

في السيناريو المعتاد: صفحة ذات same-origin تفتح مستندًا من أصل آخر لا يطابق السياسة؛ يفصل المتصفح العلاقة بين السياقين. قد يكون `window.opener`، مرجع النافذة الفاتحة، غير متاح كما كان.

ده مش إذن قراءة API، ولا منع تحميل صورة. وقد يكسر تكامل دخول أو دفع يعتمد على نافذة من أصل آخر ترسل نتيجة للنافذة الفاتحة. اختبر التكامل وقواعد المطابقة؛ لا تستنتج أن كل فشل Popup سببه CORS.

## ليه نجمع COOP وCOEP أحيانًا؟

**Cross-origin isolation — عزل عبر الأصول** وضع يسمح بقدرات حساسة بشروط أقوى، مثل مشاركة ذاكرة بواسطة `SharedArrayBuffer`، مساحة بايتات مشتركة بين جهات تنفيذ مسموحة.

تركيب شائع:

~~~http
Cross-Origin-Opener-Policy: same-origin
Cross-Origin-Embedder-Policy: require-corp
~~~

الشرطان وحدهما مش ضمانًا في كل سياق. نحتاج سياقًا آمنًا، دعم المتصفح، وعدم منع الميزة في Permissions-Policy أو المستند الحاوي. **Permissions-Policy** سياسة تتيح أو تقيد قدرات المتصفح.

`window.crossOriginIsolated` قيمة true أوfalse تفحص الوضع الفعلي. ده أدق من عدّ الرؤوس وافتراض النجاح. loopback المحلي مؤهل كسياق موثوق في متصفحات حديثة، لكنه ليس بديل HTTPS لخدمة منشورة.

## معمل PHP اختياري: صورة ممنوعة ثم مسموحة

المعمل يكتب ملفين فقط في مجلد تدريب جديد. محتاج PHP ومتصفحًا حديثًا؛ Node.js مش مطلوب. كل العناوين محلية، ومفيش تسجيل دخول أو بيانات سرية.

احفظ الملف التالي باسم `page.php`. قبل الكود: `header` ترسل حقل رد، و`img` عنصر صورة، و`alt` نص بديل، و`document.querySelector` يختار عنصرًا، و`textContent` يكتب نصه. JavaScript هنا يعرض نتيجة فحص العزل فقط:

~~~php
<?php
header('Content-Type: text/html; charset=utf-8');
header('Cross-Origin-Opener-Policy: same-origin');
header('Cross-Origin-Embedder-Policy: require-corp');
?>
<!doctype html>
<html lang="en">
<meta charset="utf-8">
<title>Local isolation lab</title>
<p id="state"></p>
<img src="http://127.0.0.1:8776/resource.php" alt="Lab image was blocked" width="180" height="80">
<script>
document.querySelector('#state').textContent =
    'crossOriginIsolated: ' + window.crossOriginIsolated;
</script>
</html>
~~~

احفظ `resource.php` في نفس المجلد. **SVG — Scalable Vector Graphics** صيغة نصية لرسم أشكال؛ المثال يرسم مستطيلًا مكتوبًا فيه Allowed:

~~~php
<?php
header('Content-Type: image/svg+xml');
header('Cross-Origin-Resource-Policy: same-origin');
header('Cache-Control: no-store');
echo '<svg xmlns="http://www.w3.org/2000/svg" width="180" height="80">'
    . '<rect width="180" height="80" fill="#165dca"/>'
    . '<text x="90" y="48" text-anchor="middle" fill="white" font-size="24">Allowed</text>'
    . '</svg>';
~~~

من مجلد التدريب شغّل طرفيتين:

~~~powershell
php -S 127.0.0.1:8775
~~~

~~~powershell
php -S 127.0.0.1:8776
~~~

افتح `http://127.0.0.1:8775/page.php`، وافتح Network وConsole في أدوات المطور. الصورة متوقّع تتمنع بسبب CORP؛ صياغة رسالة المنع تختلف حسب المتصفح. فحص العزل قد يظهر true لو شروط البيئة متحققة.

غيّر **سطر CORP في resource.php فقط** إلى:

~~~php
header('Cross-Origin-Resource-Policy: cross-origin');
~~~

أعد التحميل مع تعطيل cache في أدوات المطور أثناء المقارنة. المتوقع ظهور المستطيل. نجح التضمين، لكن ده مش معناه إن `fetch` من أصل الصفحة يقدر يقرأ جسم الرد من غير CORS مناسب.

**التجربة الثالثة:** احذف سطر CORP من نسخة التدريب ثم أعد التحميل؛ مع require-corp في الصفحة، الصورة المختلفة الأصل بلا سماح مناسب تتمنع أيضًا. أعد السطر بعد الملاحظة. لا تغيّر رؤوس الموقع الحقيقي بهذه التجربة.

أوقف الخادمين بـCtrl+C. وجود المنفذين لأننا نمثل أصلين مختلفين، مش لأن كل موقع يحتاج خادمين.

## شخّص بالدليل

| الملاحظة | الفحص المناسب |
|---|---|
| HTTP 200 لكن الصورة ممنوعة | طريقة الطلب، ثم CORP في المورد وCOEP في المستند، ورسالة المتصفح |
| الصورة تظهر لكن fetch لا يقرأ | افحص CORS؛ التضمين ليس إذن قراءة |
| نافذة دفع لا تعيد النتيجة | افحص COOP وعلاقة النوافذ وعقد التكامل، لا تغيّر CORS تلقائيًا |
| الرأسان موجودان لكن العزل false | افحص السياق الآمن والدعم والسياسات والسياق الحاوي |

**تدريب:** زميل أضاف الرؤوس الثلاثة لكل رد علشان «نزود الأمان». اكتب اختبارًا يكشف أثرها على صورة خارجية وعلى نافذة دخول، وفسّر لماذا أن سياسة واحدة لا تجيب السؤالين.

<details><summary>إجابة مرشدة</summary>
اختبر تضمين المورد مع رؤوسه وطريقة طلبه، واختبر علاقة النافذة الفاتحة بالمفتوحة منفصلًا. CORP/COEP يخصان تحميل الموارد هنا، وCOOP يخص فصل سياقات النوافذ. السماح يجب أن يخدم حاجة معروفة، لا يكون مجموعة رؤوس عمياء.
</details>

## مراجع

- [CORP — MDN](https://developer.mozilla.org/en-US/docs/Web/Security/Practical_implementation_guides/CORP)
- [COEP — MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Cross-Origin-Embedder-Policy)
- [COOP — MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Cross-Origin-Opener-Policy)
- [فحص crossOriginIsolated — MDN](https://developer.mozilla.org/en-US/docs/Web/API/Window/crossOriginIsolated)
