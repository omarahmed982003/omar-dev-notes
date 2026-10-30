---
title: "تشخيص الشبكة من DNS لحد HTTP"
description: "سلم أدلة عملي يفصل مشكلة الاسم والطريق والمنفذ وTLS وHTTP بدل التخمين."
sidebar:
  order: 35
prev: {"link":"/programming-basics/35-vpc-firewalls/","label":"VPC وFirewall: ابنِ حدود شبكة الخدمة"}
next: {"link":"/programming-basics/37-http-content-negotiation/","label":"Content Negotiation: نفس المورد بأكثر من تمثيل"}
---

<span class="foundations-reading-scope" aria-hidden="true"></span>

ابدأ من أقل طبقة تملك دليلًا عليها، واصعد. نجاح خطوة لا يثبت الخطوات اللي بعدها.

| المرحلة | السؤال | أدوات Windows شائعة |
|---|---|---|
| إعداد الجهاز | عندي address وgateway وDNS؟ | `ipconfig /all` |
| DNS | الاسم يرجع أي records؟ | `nslookup` أو `Resolve-DnsName` |
| Route | الطريق يقف فين؟ | `tracert`، و`route print` |
| Reachability | هل فيه رد ICMP؟ | `ping`؛ عدم الرد لا يثبت تعطل الخدمة |
| Port | TCP connection يفتح؟ | `Test-NetConnection host -Port 443` |
| Listening | البرنامج يستمع محليًا؟ | `Get-NetTCPConnection -State Listen` |
| TLS | الاسم والشهادة والتفاوض سليمون؟ | `curl.exe -v https://...` |
| HTTP | status وheaders وbody إيه؟ | `curl.exe -i` وDevTools Network |

## سلم عملي

<figure class="teaching-figure visual-focus">
  <img src="/diagrams/foundations/network/troubleshooting-ladder.svg" alt="سلم تشخيص يبدأ بإعداد الجهاز ثم DNS والطريق والمنفذ وTLS وأخيرًا HTTP والتطبيق" loading="lazy" />
  <figcaption>ابدأ من أسفل، وثبّت أول مرحلة فشلت بدليل. نجاح DNS لا يثبت المنفذ، ونجاح TCP لا يثبت TLS، ووصول 500 معناه إنك وصلت لمرحلة HTTP.</figcaption>
</figure>

```powershell
Resolve-DnsName example.com
Test-NetConnection example.com -Port 443
curl.exe -v https://example.com/ -o NUL
curl.exe -i https://example.com/
```

`ping` يستخدم ICMP، والخادم قد يمنعه بينما HTTPS يعمل. `tracert` يعرض عقدًا تستجيب برسائل زمنية؛ نجمة في عقدة وسطية لا تثبت أن الطريق انقطع لو الوجهة النهائية تعمل.

## اقرأ نوع الفشل

- DNS error: لسه ما وصلناش لمرحلة TCP.
- Timeout: قد يكون route أو إسقاط firewall أو خدمة بطيئة؛ اجمع دليلًا إضافيًا.
- Refused: وصلت للعنوان ورفضت الجهة الاتصال غالبًا لعدم وجود listener أو رفض نشط.
- TLS certificate error: TCP نجح، لكن تحقق القناة فشل.
- HTTP `404` أو `500`: الشبكة وTLS غالبًا أوصلا الطلب إلى HTTP؛ افحص route التطبيق أو تنفيذه.

**Packet capture — تسجيل الحزم المرئية على interface** أداة أخيرة قوية، لكنها قد تحتوي addresses وtokens وبيانات حساسة. التقط أقل مدة ونطاق، اخفِ الأسرار، ولا تفترض أنك ترى traffic داخل TLS كنص.

دوّن الوقت، الجهاز، الأمر، والنتيجة. تغيير DNS وfirewall والكود معًا يضيع السبب الحقيقي.

