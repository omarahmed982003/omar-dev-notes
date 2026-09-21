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

