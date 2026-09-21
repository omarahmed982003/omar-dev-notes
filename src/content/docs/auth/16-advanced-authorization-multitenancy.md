---
title: 16. ABAC وReBAC وعزل الـTenants
description: نماذج صلاحيات تتجاوز RBAC مع السياسات والعلاقات والعزل متعدد المستأجرين والاختبار.
sidebar:
  order: 16
---

## RBAC ليست كل شيء

- **RBAC:** القرار مبني على roles.
- **ABAC:** attributes للمستخدم والمورد والسياق.
- **ReBAC:** علاقات مثل owner/member/manager.

```text
allow if
  subject.tenant_id == resource.tenant_id
  AND subject.department == resource.department
  AND action == "read"
```

ابدأ بسياسة بسيطة، واستخدم نموذجًا أعقد فقط عندما يعبر عن قواعد حقيقية.

## Policy decision

```php
final class InvoicePolicy
{
    public function view(User $user, Invoice $invoice): bool
    {
        return $user->tenantId() === $invoice->tenantId()
            && ($user->id() === $invoice->ownerId() || $user->hasRole('auditor'));
    }
}
```

الـUI قد تخفي الزر، لكن الخادم يعيد القرار لكل request وqueue/CLI path.

## Multi-tenancy

مرّر tenant من الهوية الموثقة لا من body فقط. طبّق العزل في queries وcache keys وobject storage وqueue messages وsearch indexes وexports.

اختر database مشتركة أوschema منفصلة أوdatabase لكل tenant بناءً على العزل والتكلفة والتشغيل، ولا تفترض أن نمطًا واحدًا آمن تلقائيًا.

## Deny by default والاختبار

أي action غير معروفة تُرفض. راجع inheritance والتعارض بين allow/deny، وسجل نسخة policy والسبب العام داخليًا.

اختبر matrix تشمل owner في tenant نفسه، مستخدمًا بلا role، ID مطابقًا في tenant مختلف، auditor، وresource غير موجود. اختبر IDOR بتبديل IDs وكل HTTP/CLI/queue path.

## مرجع

- [OWASP Authorization Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html)

