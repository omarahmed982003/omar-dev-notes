---
title: 8. قائمة مراجعة OOP
description: قائمة أسئلة وتمرين يجمع التغليف والواجهات والتركيب والحقن والاختبار.
sidebar:
  order: 8
---

# قائمة مراجعة OOP

قبل اعتماد تصميم اسأل:

- هل لكل class مسؤولية واضحة واسم من مجال المشروع؟
- هل constructor ينتج object صالحًا؟
- هل الـproperties محمية بأقل visibility؟
- هل الوراثة تعبّر عن is-a حقيقية، أم composition أوضح؟
- هل الواجهة صغيرة ويحتاجها المستدعي فعلًا؟
- هل الـTrait صغيرة ولا تخفي dependencies؟
- هل static state ستعقّد الاختبار أو workers طويلة العمر؟
- هل readonly تحمي المرجع فقط أم نحتاج deep immutability؟
- هل Magic Method تحسن API فعلًا أم تخفي typo؟
- هل الاعتماديات صريحة وقابلة للاستبدال في الاختبار؟

## تمرين جامع

صمّم Checkout:

1. `Order` يحمي حالته ولا يسمح بالدفع مرتين.
2. `PaymentGateway` interface لها تنفيذ fake للاختبار.
3. `Receipt` و`Money` كـreadonly value objects.
4. `OrderService` يستقبل gateway وrepository وclock بالـDI.
5. أضف notification بالـcomposition لا بجعل Order ترث Email.
6. اختبر نجاح الدفع، فشل المزود، والطلب المدفوع مسبقًا.

إذا احتجت `instanceof` متكررًا أو setters كثيرة أو Service Locator، عد لمراجعة حدود الكائنات والعقود.
