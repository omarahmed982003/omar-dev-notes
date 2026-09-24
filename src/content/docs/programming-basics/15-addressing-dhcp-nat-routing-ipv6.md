---
title: 14. DHCP وNAT وSubnetting وRouting وIPv6
description: الحصول على إعدادات الشبكة، تقسيم عناوين IP، الانتقال بين الشبكات، ولماذا نحتاج IPv6.
---

## DHCP

يمنح DHCP الجهاز إعداداته آليًا: IP Address وSubnet Mask وDefault Gateway وDNS Servers ومدة الإيجار. تبدأ العملية غالبًا برسائل Discover ثم Offer ثم Request ثم Acknowledgement. الإيجار مؤقت ويمكن تجديده، لذلك لا تفترض أن عنوان جهاز العميل ثابت دائمًا.

## Private IP وPublic IP وNAT

تستخدم الشبكات المحلية نطاقات Private مثل `10.0.0.0/8` و`172.16.0.0/12` و`192.168.0.0/16`. لا توجه هذه العناوين مباشرة على الإنترنت. يغير NAT عنوان المصدر عند خروج الاتصال، ويستخدم PAT المنافذ لتمييز اتصالات أجهزة كثيرة خلف Public IP واحد.

Port Forwarding قاعدة تسمح لاتصال وارد بالانتقال إلى جهاز داخلي محدد. أما CGNAT فيطبقه مزود الخدمة على عدة عملاء، وقد يمنع استقبال الاتصالات المباشرة حتى لو أعددت Router المنزل.

## Subnet Mask وCIDR

الكتابة `/24` تعني أن أول 24 بت تحدد الشبكة والبقية للمضيفين. في `192.168.1.0/24` يكون نطاق العناوين داخل شبكة واحدة، ويحدد الحساب الثنائي Network Address وBroadcast Address والعناوين القابلة للاستخدام.

لا يكفي حفظ `/24`. افهم أن زيادة Prefix تقلل عدد عناوين المضيفين وتنتج شبكات أكثر. يستخدم الجهاز الـMask ليقرر هل يرسل مباشرة داخل LAN أم إلى Default Gateway.

## Routing

تحتوي Routing Table على شبكات وNext Hop وواجهة وربما Metric. يختار Router المسار الأكثر تحديدًا وفق Longest Prefix Match. وإذا لم توجد قاعدة أدق يستخدم Default Route مثل `0.0.0.0/0`.

## IPv6

يستخدم IPv6 عناوين 128 بت مثل `2001:db8::1`. يوفر مساحة هائلة ويستخدم Neighbor Discovery بدل ARP. توجد عناوين Link-local تبدأ غالبًا بـ`fe80::`، وLoopback هو `::1`. لا يعني وجود IPv6 اختفاء الجدران النارية أو الحاجة إلى سياسات وصول واضحة.

## تأكد من فهمك

<div class="lesson-quiz" role="list"><section class="quiz-card" role="listitem"><div class="quiz-question-row"><span class="quiz-number">01</span><p>كيف يقرر الجهاز أن الوجهة داخل شبكته؟</p></div><details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة:</strong> يطبق الـSubnet Mask على عنوانه وعنوان الوجهة ويقارن Network Prefix.</div></details></section><section class="quiz-card" role="listitem"><div class="quiz-question-row"><span class="quiz-number">02</span><p>ما الفرق بين NAT وPort Forwarding؟</p></div><details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة:</strong> NAT يترجم الاتصالات، بينما Port Forwarding يضيف قاعدة لاتصال وارد نحو مضيف وخدمة داخلية.</div></details></section></div>
