---
title: 16. ABAC وReBAC وعزل الـTenants
description: نماذج صلاحيات تتجاوز RBAC مع السياسات والعلاقات والعزل متعدد المستأجرين والاختبار.
sidebar:
  order: 16
---

## قبل ما تبدأ

ذاكر الدرس على 3 خطوات: افهم المشكلة الأول، تابع المثال، وبعدها جرّب الجزء العملي بنفسك. المصطلحات الجديدة الموجودة تحت متشرحة قبل ما ندخل في التفاصيل.

### كلمات جديدة في الدرس

- **HTTP:** قواعد تبادل الطلبات والردود بين المتصفح والخادم.
- **Cache:** نسخة مؤقتة من البيانات هدفها تقليل وقت الانتظار والعمل المتكرر.
- **Queue:** طابور مهام تنتظر عاملًا ينفذها في الخلفية.
- **CLI:** واجهة تتعامل معها بكتابة أوامر نصية بدل الضغط على أزرار.
- **Function:** دالة: جزء كود له اسم ومهمة محددة ويمكن استدعاؤه أكثر من مرة.


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

## سيناريو أمني

<details><summary>فين لازم نطبّق tenant boundary؟</summary><p>في كل query وcache key وjob وobject storage path، ويفضل فرضها بطبقة بيانات لا تنسى.</p></details>

## تدريب تهديد

**السيناريو:** مستخدم من Tenant A يضع معرّف Tenant B في المسار أو جسم الطلب.

**اختبار المنع:** كرر طلب القراءة والتعديل بمعرّف مورد صحيح لكنه تابع لمستأجر آخر.

**النتيجة المتوقعة:** لا تُرجع القراءة أي بيانات ولا ينفذ التعديل؛ يُشتق سياق المستأجر من الهوية الموثوقة ويُفرض داخل الاستعلام.

### مرجع التحقق

- [OWASP Authorization Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html)

## اربط النقاط ببعض

Policy engine يحتاج versioned policy وقرارًا قابلًا للتفسير وcache invalidation عند تغير العلاقة أو الدور. مثل hierarchy والعلاقات صراحة بدل شروط متناثرة. استخرج tenant من identity موثوقة وطبقه في query وstorage key وcache key وlogs، واختبر side channels في counts وtiming و404.

### جرّب بنفسك

غيّر علاقة أثناء وجود cache وتأكد أن القرار القديم لا يبقى.
