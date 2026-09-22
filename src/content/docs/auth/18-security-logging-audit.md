---
title: 18. Security Logging وAudit Trail
description: أحداث الأمان وبنية السجل والتنقية والـaudit غير القابل للعبث والتنبيهات والتحقيق.
sidebar:
  order: 18
---

## Operational log أم Audit؟

- operational log للتشخيص والأداء وقد يتغير retention.
- security event للكشف والتنبيه.
- audit trail يسجل من فعل ماذا ومتى وعلى أي مورد، مع متطلبات سلامة واحتفاظ أعلى.

لا تستخدم نصوصًا غير منظمة لسجل تدقيق قانوني.

## Schema مقترحة

```json
{
  "event": "authorization.denied",
  "time": "2026-09-21T10:15:00Z",
  "request_id": "req_01J...",
  "actor_id": "usr_42",
  "tenant_id": "tn_7",
  "action": "invoice.delete",
  "resource_id": "inv_99",
  "result": "deny",
  "reason_code": "not_owner"
}
```

استخدم IDs لا أسماء/بيانات شخصية إن لم تلزم. وحّد UTC ونسخة schema ومصدر الخدمة.

## أحداث مهمة

- نجاح/فشل login وMFA وrecovery.
- تغيير password/email/MFA/roles.
- إنشاء أو تدوير أو إلغاء API key.
- authorization deny والعمليات الإدارية.
- export/delete للبيانات.
- secret access وpolicy changes.

لا تسجل password أوtoken أوsession ID أوkey خام أوrecovery code.

## سلامة ووصول

أرسل logs إلى مخزن مركزي محدود الوصول، افصل صلاحية الكتابة عن الحذف، واستخدم retention وbackup وتزامن وقت. راقب توقف ingestion ومحاولات العبث.

## التنبيه والتحقيق

التنبيه على نمط: failures موزعة، impossible travel، رفع صلاحيات، key جديدة ثم export ضخم. ضع runbook وowner وseverity، واحفظ request/trace IDs لربط الأدلة.

اختبر أن logging لا تفشل العملية الأساسية بلا سبب ولا تسرب أسرارًا عند exception.

## مرجع

- [OWASP Logging Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html)

## خريطة الدرس

<div class="lesson-diagram" role="img" aria-label="خريطة مفاهيم: Security Logging وAudit Trail">
<p class="lesson-diagram-title">خريطة مفاهيم: Security Logging وAudit Trail</p>
<div class="diagram-flow">
<div class="diagram-node input"><span>Operational log أم Audit؟</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>Schema مقترحة</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>أحداث مهمة</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node decision"><span>سلامة ووصول</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node output"><span>التنبيه والتحقيق</span></div>
</div>
</div>

## تأكد من فهمك

<div class="lesson-quiz" role="list">
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">01</span><p>اشرح «Operational log أم Audit؟» كأنك تراجع تطبيقًا حقيقيًا: ما الهدف وما أهم قيد يجب الانتباه له؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> operational log للتشخيص والأداء وقد يتغير retention. security event للكشف والتنبيه. audit trail يسجل من فعل ماذا ومتى وعلى أي مورد، مع متطلبات سلامة واحتفاظ أعلى. لا تستخدم نصوصًا غير منظمة لسجل تدقيق قانوني. عمليًا، لا يكفي تنفيذ المسار الناجح؛ يجب توثيق الافتراضات والتحقق من القيم والحالات التي قد تكسر هذا السلوك.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">02</span><p>قارن بين «Operational log أم Audit؟» و«Schema مقترحة». لماذا لا يغني أحدهما عن الآخر داخل موضوع «Security Logging وAudit Trail»؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> في «Operational log أم Audit؟»: operational log للتشخيص والأداء وقد يتغير retention. security event للكشف والتنبيه. audit trail يسجل من فعل ماذا ومتى وعلى أي مورد، مع متطلبات سلامة واحتفاظ أعلى. لا تستخدم نصوصًا غير منظمة لسجل تدقيق قانوني. أما «Schema مقترحة»: استخدم IDs لا أسماء/بيانات شخصية إن لم تلزم. وحّد UTC ونسخة schema ومصدر الخدمة. العلاقة بينهما أن الأول يحدد جانبًا من الحل، والثاني يكمل السلوك أو القيود اللازمة لتطبيقه بصورة صحيحة.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">03</span><p>افترض أن نظامًا تجاهل «أحداث مهمة». ما العطل أو الخطر المتوقع، وكيف تصمم اختبارًا يكشفه؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> نجاح/فشل login وMFA وrecovery. تغيير password/email/MFA/roles. إنشاء أو تدوير أو إلغاء API key. authorization deny والعمليات الإدارية. export/delete للبيانات. secret access وpolicy changes. لا تسجل password أوtoken أوsession ID أوkey خام أوrecovery code. لاكتشاف الخلل، اختبر مسارًا صحيحًا، وقيمة عند الحد، ومدخلًا غير صالح، ثم راقب النتيجة والآثار الجانبية والسجل بدل الاكتفاء بعدم ظهور Exception.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">04</span><p>حوّل «سلامة ووصول» إلى قرار هندسي قابل للمراجعة. ما الذي ستوثقه وما الحالات التي ستختبرها؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> أرسل logs إلى مخزن مركزي محدود الوصول، افصل صلاحية الكتابة عن الحذف، واستخدم retention وbackup وتزامن وقت. راقب توقف ingestion ومحاولات العبث. وثّق سبب الاختيار والبدائل والحدود، واختبر الحالة العادية، والحد الأدنى والأقصى، والفشل الجزئي، وإعادة المحاولة أو التكرار إن كان السلوك يسمح بذلك.</div></details>
</section>
</div>
