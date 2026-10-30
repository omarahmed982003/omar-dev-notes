---
title: "VPC وFirewall: ابنِ حدود شبكة الخدمة"
description: "افهم الشبكة السحابية الخاصة، public وprivate subnets، routes، NAT، security groups، ومكان WAF."
sidebar:
  order: 34
prev: {"link":"/programming-basics/34-network-performance/","label":"Latency وBandwidth: ليه الاتصال السريع ممكن يتأخر؟"}
next: {"link":"/programming-basics/36-network-troubleshooting/","label":"تشخيص الشبكة من DNS لحد HTTP"}
---

<span class="foundations-reading-scope" aria-hidden="true"></span>

**VPC، Virtual Private Cloud — شبكة منطقية معزولة داخل مزود cloud** تختار لها نطاق IP وتقسمها وتحدد طرق المرور وقواعد السماح. كلمة private هنا تعني حدودًا منطقية؛ لا تعني أن كل resource آمن تلقائيًا.

## المكونات وعلاقتها

<figure class="teaching-figure visual-focus">
  <img src="/diagrams/foundations/network/vpc-boundaries.svg" alt="بنية VPC بطبقة دخول عامة للـWAF وLoad Balancer ثم application في private subnet وقاعدة بيانات في data subnet" loading="lazy" />
  <figcaption>الـroute يحدد إمكانية الوصول، وقواعد Firewall وSecurity Group تحدد مين مسموح له يدخل. وجود resource في private subnet مش بديل authorization.</figcaption>
</figure>

| المكوّن | مسؤوليته |
|---|---|
| CIDR | نطاق عناوين VPC |
| Subnet | جزء من النطاق يوضع فيه resources |
| Route table | يحدد next hop لكل وجهة |
| Internet gateway | طريق بين public addresses والإنترنت |
| NAT gateway | يسمح غالبًا لخدمة private أن تبدأ خروجًا من غير قبول دخول مباشر |
| Security group | قواعد stateful مرتبطة بـresource أو interface |
| Network ACL | قواعد subnet قد تكون stateless حسب المنصة |
| WAF | يفحص HTTP مثل paths وheaders؛ لا يستبدل network firewall |

```text
Internet
   │
[CDN/WAF or Load Balancer]  public subnet
   │  يسمح فقط بمنفذ التطبيق المطلوب
[App instances]             private subnet
   │  يسمح بقاعدة البيانات من هوية/مجموعة التطبيق فقط
[Database]                  isolated/private subnet
   └── outbound updates through controlled NAT when required
```

**Public subnet** لها route مناسب للإنترنت، لكن resource يحتاج أيضًا public address وقاعدة سماح. **Private subnet** لا تملك دخولًا مباشرًا من الإنترنت؛ قد تستخدم NAT للخروج. NAT مش firewall كامل، ووجود private IP مش authorization.

## أقل صلاحية على مستوى الشبكة

- لا تفتح database على `0.0.0.0/0`.
- اسمح للـload balancer بالوصول إلى app port، وللتطبيق وحده بالوصول إلى database port.
- افصل إدارة النظام عن traffic المستخدمين، واحتفظ بسجلات flow عند الحاجة.
- راجع egress كمان؛ خروج مفتوح بالكامل يسهل تسريب البيانات لو service اختُرقت.
- وزّع النسخ على أكثر من availability zone من غير افتراض أن ده وحده يحقق recovery.

:::note[تعمق أكثر: Route وFirewall وNAT ثلاث قرارات مختلفة]
الـRoute يحدد Next hop ممكن، والـFirewall أوSecurity Group يقرر هل المرور مسموح، والـNAT يغير عنوانًا أوPort عند العبور. وجود Route لا يعني السماح، ووجود Rule لا يخلق Route، ووجود NAT لا يثبت إن الرد هيرجع أوإن الخدمة Authorized.

الـSecurity Group الـstateful يتذكر اتصالًا مسموحًا فيسمح عادة بمرور الرد، بينما Network ACL الـstateless يحتاج قواعد مناسبة للاتجاهين بما فيها Ephemeral ports. التفاصيل تختلف بين المنصات، لذلك وقت العطل اقرأ Flow logs والـeffective rules والـroute table الفعلية بدل الاعتماد على رسم معماري قديم.

راجع **Egress** كمان: Server مخترق مع خروج مفتوح يقدر يسرب بيانات أوينادي Command-and-control. لكن منع كل خروج بلا خطة يكسر DNS والتحديثات وAPIs التابعة. الحل Least privilege مبني على احتياجات معروفة، مع Proxy أوNAT مضبوط ومراقبة، مش زر «اقفل الكل».
:::

لو request فشل، حدد أولًا هل DNS أعطى العنوان الصحيح، وهل route موجود، وهل firewall يسمح، وهل service تستمع. الدرس التالي يجمع السلم ده.

