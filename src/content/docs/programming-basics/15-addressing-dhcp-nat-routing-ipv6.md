---
title: "إعدادات عنوان الجهاز والاتصال"
description: "إعدادات عنوان الجهاز والاتصال"
sidebar:
  order: 5
prev: {"link":"/programming-basics/18-wifi-practical-basics/","label":"اتصل بشبكة Wi-Fi وافهم مشاكلها"}
next: {"link":"/programming-basics/26-subnet-calculations/","label":"احسب حدود الشبكة من عنوانها"}
---


## اقرأ إعداداتك قبل الحساب

على Windows اكتب `ipconfig /all` في PowerShell. ابحث عن المحول المتصل، واقرأ أربعة أشياء فقط: IPv4 Address عنوان الجهاز، Subnet Mask قناع يحدد جزء الشبكة، Default Gateway الراوتر الذي نرسل له عند غياب طريق أدق، وDNS Servers خوادم سؤال أسماء المواقع. لا تغيّر الإعدادات في التجربة.

**DHCP** اختصار Dynamic Host Configuration Protocol: طريقة يحصل بها الجهاز على إعدادات من خادم لمدة قابلة للتجديد. مثال: عنوان192.168.1.20، قناع255.255.255.0، بوابة192.168.1.1؛ القيم الفعلية على جهازك قد تختلف. الحساب التفصيلي والتوجيه والإصدار السادس لكل منها درس تالٍ.

## DHCP

يمنح DHCP الجهاز إعداداته آليًا: IP (Internet Protocol؛ قواعد عنونة الحزم وتوجيهها بين الشبكات، وعنوان IP رقم يحدد واجهة في هذا السياق) Address وSubnet Mask وDefault Gateway وDNS Servers ومدة الإيجار. تبدأ العملية غالبًا برسائل Discover، سؤال عن خادم إعدادات، ثم Offer، عرض إعدادات، ثم Request، طلب استخدام العرض المختار، ثم Acknowledgement، تأكيد الإعدادات. الإيجار مؤقت ويمكن تجديده، لذلك لا تفترض أن عنوان جهاز العميل ثابت دائمًا.

## Private IP وPublic IP وNAT

تستخدم الشبكات المحلية نطاقات Private مثل `10.0.0.0/8` و`172.16.0.0/12` و`192.168.0.0/16`. لا توجه هذه العناوين مباشرة على الإنترنت. يغير NAT عنوان المصدر عند خروج الاتصال، ويستخدم PAT المنافذ لتمييز اتصالات أجهزة كثيرة خلف Public IP واحد.

Port Forwarding قاعدة تسمح لاتصال وارد بالانتقال إلى جهاز داخلي محدد. أما CGNAT (Carrier-Grade NAT؛ ترجمة عناوين ينفذها مزود الخدمة لعدة مشتركين) فيطبقه مزود الخدمة على عدة عملاء، وقد يمنع استقبال الاتصالات المباشرة حتى لو أعددت Router المنزل.

## تدريب عملي

<details><summary>الجهاز عنده IP لكن مفيش Default Gateway. إيه اللي يشتغل؟</summary><p>غالبًا يقدر يكلم نفس الـSubnet، لكنه لا يملك طريقًا للشبكات الخارجية من غير Route أخرى.</p></details>

<details><summary>ليه NAT مش Firewall؟</summary><p>NAT يترجم عناوين وPorts؛ Firewall يطبق سياسة السماح والمنع. ممكن NAT تكون موجودة مع قواعد ضعيفة أوPort Forwarding مفتوح.</p></details>

## تأكد من فهمك

<div class="lesson-quiz" role="list"><section class="quiz-card" role="listitem"><div class="quiz-question-row"><span class="quiz-number">01</span><p>كيف يقرر الجهاز أن الوجهة داخل شبكته؟</p></div><details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة:</strong> يطبق الـSubnet Mask على عنوانه وعنوان الوجهة ويقارن Network Prefix.</div></details></section><section class="quiz-card" role="listitem"><div class="quiz-question-row"><span class="quiz-number">02</span><p>ما الفرق بين NAT وPort Forwarding؟</p></div><details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة:</strong> NAT يترجم الاتصالات، بينما Port Forwarding يضيف قاعدة لاتصال وارد نحو مضيف وخدمة داخلية.</div></details></section></div>

## الخطوة التالية


كمّل في [احسب حدود الشبكة من عنوانها](/programming-basics/26-subnet-calculations/) بعد تنفيذ التجربة هنا.



كمّل في [اختيار الطريق وقراءة عناوين IPv6](/programming-basics/27-routing-and-ipv6/) بعد تنفيذ التجربة هنا.
