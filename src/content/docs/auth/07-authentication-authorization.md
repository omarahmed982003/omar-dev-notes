---
title: 7. المصادقة والصلاحيات عمليًا
description: Login آمن وRBAC والسياسات وملكية الموارد ومنع IDOR وأقل قدر من الصلاحيات.
sidebar:
  order: 7
---

## ثلاثة أسئلة مختلفة

1. **Authentication:** من المستخدم؟
2. **Authorization:** هل يُسمح له بهذا الفعل على هذا المورد؟
3. **Accounting/Auditing:** ماذا حدث، ومتى، ومن أي جلسة؟

نجاح تسجيل الدخول لا يعني السماح بكل شيء. وإخفاء الزر في الواجهة ليس Authorization.

## Login flow

```text
Validate input
→ Load account by normalized identifier
→ Verify password
→ Apply rate/risk controls
→ Regenerate session ID
→ Store minimal identity state
→ Redirect
```

أعد رسالة عامة مثل «بيانات الدخول غير صحيحة» لتقليل كشف وجود الحساب. لا تجعل كل الردود متطابقة زمنيًا بصورة مثالية على حساب DoS، لكن تجنب الفروق الفاضحة. سجّل الأحداث دون passwords أو tokens.

## RBAC

```php
enum Role: string
{
    case Admin = 'admin';
    case Editor = 'editor';
    case Viewer = 'viewer';
}

function canPublish(array $user): bool
{
    return in_array($user['role'], [
        Role::Admin->value,
        Role::Editor->value,
    ], true);
}
```

RBAC مناسب للصلاحيات العامة، لكنه لا يحل ملكية الموارد.

## Ownership وPolicies

```php
function canUpdatePost(array $user, array $post): bool
{
    return $user['role'] === 'admin'
        || (
            $user['role'] === 'editor'
            && $post['author_id'] === $user['id']
        );
}
```

الأفضل تحميل المورد مقيدًا بالمستخدم عندما يناسب:

```sql
SELECT * FROM posts
WHERE id = :post_id AND author_id = :user_id
```

هذا يقلل IDOR/BOLA حيث يغيّر المستخدم ID في URL للوصول إلى مورد غيره.

## Middleware لا يلغي الفحص داخل المجال

Middleware يتحقق من وجود مستخدم أو صلاحية عامة. أما قاعدة مثل «لا يمكن رد الطلب بعد الشحن» فتنتمي لخدمة المجال/Policy ويجب تطبيقها مهما كان المدخل HTTP أو CLI أو Queue.

## حالات HTTP

- `401 Unauthorized`: المصادقة مفقودة/غير صالحة، رغم أن الاسم التاريخي مربك.
- `403 Forbidden`: الهوية معروفة لكن الفعل غير مسموح.
- `404 Not Found`: قد يُستخدم لإخفاء وجود مورد لا يحق للمستخدم معرفته.

## Defense in depth

- Least privilege لحسابات DB والخدمات.
- Deny by default.
- تحقق server-side في كل request.
- MFA وstep-up auth للعمليات الحساسة.
- Audit logs محمية من التعديل.
- إبطال الجلسات عند تغيير كلمة المرور أو الدور.
- اختبارات Authorization: مستخدم صحيح، دور خاطئ، مورد يملكه غيره، ID غير موجود.
