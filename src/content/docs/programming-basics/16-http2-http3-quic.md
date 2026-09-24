---
title: 15. HTTP/2 وHTTP/3 وQUIC
description: تطور نقل رسائل HTTP من الاتصالات المتعددة إلى Multiplexing وQUIC فوق UDP.
---

## HTTP Semantics ونسخة النقل

تبقى معاني Methods وStatus Codes وHeaders متشابهة بين الإصدارات، لكن طريقة تمثيل الرسائل ونقلها تتغير. HTTP/1.1 نصي في صورته المعروفة، بينما يستخدم HTTP/2 Frames ثنائية، ويعمل HTTP/3 فوق QUIC.

## HTTP/2 وMultiplexing

يقسم HTTP/2 الاتصال إلى Streams مستقلة تحمل Frames، فيستطيع المتصفح إرسال طلبات متعددة على اتصال TCP واحد بدل انتظار كل استجابة. ويضغط Headers باستخدام HPACK.

يحل ذلك مشكلة انتظار الطلبات على مستوى HTTP/1.1، لكن فقد Packet واحدة في TCP قد يؤخر كل Streams حتى يعيد TCP ترتيب البايتات. تسمى هذه المشكلة Transport Head-of-line Blocking.

## QUIC وHTTP/3

يبني QUIC نقلًا موثوقًا ومشفرًا فوق UDP، ويدمج TLS 1.3 في Handshake. لكل Stream ترتيب مستقل، لذلك لا يوقف فقد البيانات في Stream كل Streams الأخرى. كما يستخدم Connection ID ليساعد الاتصال على الاستمرار عند تغير شبكة الهاتف من Wi-Fi إلى بيانات الهاتف.

لا يعني استخدام UDP أن HTTP/3 غير موثوق؛ QUIC نفسه ينفذ التأكيد وإعادة الإرسال والتحكم في الازدحام. يستخدم UDP كواجهة للنظام كي يطبق هذه الآليات في User Space بصورة أسرع قابلية للتطوير.

## اختيار الإصدار

يتفاوض العميل والخادم على البروتوكول، وقد يعود المتصفح إلى HTTP/2 أو HTTP/1.1 إذا تعذر QUIC. تقيس الأدوات النتيجة الفعلية بدل افتراض أن الإصدار الأحدث أسرع دائمًا؛ المسافة وفقد الحزم وإعداد الخادم وحجم الموارد كلها مؤثرة.

## تأكد من فهمك

<div class="lesson-quiz" role="list"><section class="quiz-card" role="listitem"><div class="quiz-question-row"><span class="quiz-number">01</span><p>ما الذي يقدمه Multiplexing؟</p></div><details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة:</strong> يسمح لعدة طلبات واستجابات بمشاركة اتصال واحد عبر Streams مستقلة منطقيًا.</div></details></section><section class="quiz-card" role="listitem"><div class="quiz-question-row"><span class="quiz-number">02</span><p>هل HTTP/3 غير موثوق لأنه يستخدم UDP؟</p></div><details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة:</strong> لا؛ QUIC يضيف الاعتمادية وإعادة الإرسال والتحكم في الازدحام فوق UDP.</div></details></section></div>
