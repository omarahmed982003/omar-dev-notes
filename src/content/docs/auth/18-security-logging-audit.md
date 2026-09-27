---
title: 18. Security Logging وAudit Trail
description: أحداث الأمان وبنية السجل والتنقية والـaudit غير القابل للعبث والتنبيهات والتحقيق.
sidebar:
  order: 18
---

## قبل ما تبدأ

ذاكر الدرس على 3 خطوات: افهم المشكلة الأول، تابع المثال، وبعدها جرّب الجزء العملي بنفسك. المصطلحات الجديدة الموجودة تحت متشرحة قبل ما ندخل في التفاصيل.

### كلمات جديدة في الدرس

- **API:** واجهة محددة تسمح لبرنامج يطلب بيانات أو ينفّذ عملية عند برنامج آخر.
- **Session:** بيانات مؤقتة تساعد الخادم يميّز المستخدم بين أكثر من طلب.
- **Token:** قيمة تمثل هوية أو صلاحية محددة بدل إرسال كلمة السر كل مرة.


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

## سيناريو أمني

<details><summary>إيه اللي نسجله من حدث أمني؟</summary><p>الفاعل والفعل والمورد والنتيجة والوقت وcorrelation ID من غير password أو token أو بيانات حساسة زائدة.</p></details>

## تدريب تهديد

**السيناريو:** يحاول مهاجم إخفاء أثره بحقن سطر جديد في حقل يُسجل أو بإغراق السجلات بأسرار.

**اختبار المنع:** أرسل قيمة تحوي محرف سطر جديد وتوكينًا شكليًا، ثم افحص الحدث المخزن وسلسلة الارتباط.

**النتيجة المتوقعة:** يبقى الحدث سجلًا واحدًا منظمًا، تُحجب الأسرار، وتوجد هوية فاعل ووقت ونتيجة وcorrelation ID قابلة للبحث.

### مرجع التحقق

- [OWASP Logging Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html)

## اربط النقاط ببعض

Audit trail يحتاج append-only أو tamper-evident storage مع فصل صلاحية الكتابة عن الحذف، ووقتًا متزامنًا ومصدر timestamp واضحًا. حدد retention وlegal access وexport إلى SIEM، واختبر log injection وredaction. التنبيه يملك owner وrunbook وحدًا للضوضاء.

### جرّب بنفسك

عدّل event مخزنًا أو أدخل newline وتأكد أن التلاعب يُكشف.
