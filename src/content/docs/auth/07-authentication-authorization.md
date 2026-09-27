---
title: 7. المصادقة والصلاحيات عمليًا
description: Login آمن وRBAC والسياسات وملكية الموارد ومنع IDOR وأقل قدر من الصلاحيات.
sidebar:
  order: 7
---

## قبل ما تبدأ

ذاكر الدرس على 3 خطوات: افهم المشكلة الأول، تابع المثال، وبعدها جرّب الجزء العملي بنفسك. المصطلحات الجديدة الموجودة تحت متشرحة قبل ما ندخل في التفاصيل.

### كلمات جديدة في الدرس

- **HTTP:** قواعد تبادل الطلبات والردود بين المتصفح والخادم.
- **URL:** العنوان الكامل لمورد على الويب، زي صفحة أو صورة أو نقطة API.
- **Session:** بيانات مؤقتة تساعد الخادم يميّز المستخدم بين أكثر من طلب.
- **Queue:** طابور مهام تنتظر عاملًا ينفذها في الخلفية.
- **CLI:** واجهة تتعامل معها بكتابة أوامر نصية بدل الضغط على أزرار.
- **Function:** دالة: جزء كود له اسم ومهمة محددة ويمكن استدعاؤه أكثر من مرة.


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

## سيناريو أمني

<details><summary>ما الفرق بين authentication وauthorization؟</summary><p>الأول يثبت من أنت، والثاني يقرر ماذا يسمح لك فعله على المورد المحدد.</p></details>

## تدريب تهديد

**السيناريو:** مستخدم مسجّل الدخول يغيّر معرّف مورد في الطلب ليقرأ فاتورة مستخدم آخر.

**اختبار المنع:** نفّذ الطلب بحساب يملك المورد، ثم بحساب آخر صحيح المصادقة لكنه لا يملكه.

**النتيجة المتوقعة:** ينجح طلب المالك ويُرفض الآخر بـ403 أو 404 وفق السياسة، ولا تعتمد الصلاحية على إخفاء الزر في الواجهة.

### مرجع التحقق

- [OWASP Authorization Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html)

## اربط النقاط ببعض

ابن authorization matrix فيها actor وresource وaction وcontext وexpected decision، ثم حولها لاختبارات allow وdeny. لا يكفي middleware عام إذا تغيرت ملكية المورد داخل domain operation. سجّل القرار وpolicy version دون تسريب بيانات المورد، واختبر direct object reference.

### جرّب بنفسك

نفذ المصفوفة على HTTP وjob خلفية وتأكد من القرار نفسه.
