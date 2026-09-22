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

## خريطة الدرس

<div class="lesson-diagram" role="img" aria-label="خريطة مفاهيم: ABAC وReBAC وعزل الـTenants">
<p class="lesson-diagram-title">خريطة مفاهيم: ABAC وReBAC وعزل الـTenants</p>
<div class="diagram-flow">
<div class="diagram-node input"><span>RBAC ليست كل شيء</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>Policy decision</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>Multi-tenancy</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node decision"><span>Deny by default والاختبار</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node output"><span>مرجع</span></div>
</div>
</div>

## تأكد من فهمك

<div class="lesson-quiz" role="list">
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">01</span><p>اشرح «RBAC ليست كل شيء» كأنك تراجع تطبيقًا حقيقيًا: ما الهدف وما أهم قيد يجب الانتباه له؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> RBAC: القرار مبني على roles. ABAC: attributes للمستخدم والمورد والسياق. ReBAC: علاقات مثل owner/member/manager. ابدأ بسياسة بسيطة، واستخدم نموذجًا أعقد فقط عندما يعبر عن قواعد حقيقية. عمليًا، لا يكفي تنفيذ المسار الناجح؛ يجب توثيق الافتراضات والتحقق من القيم والحالات التي قد تكسر هذا السلوك.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">02</span><p>قارن بين «RBAC ليست كل شيء» و«Policy decision». لماذا لا يغني أحدهما عن الآخر داخل موضوع «ABAC وReBAC وعزل الـTenants»؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> في «RBAC ليست كل شيء»: RBAC: القرار مبني على roles. ABAC: attributes للمستخدم والمورد والسياق. ReBAC: علاقات مثل owner/member/manager. ابدأ بسياسة بسيطة، واستخدم نموذجًا أعقد فقط عندما يعبر عن قواعد حقيقية. أما «Policy decision»: الـUI قد تخفي الزر، لكن الخادم يعيد القرار لكل request وqueue/CLI path. العلاقة بينهما أن الأول يحدد جانبًا من الحل، والثاني يكمل السلوك أو القيود اللازمة لتطبيقه بصورة صحيحة.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">03</span><p>افترض أن نظامًا تجاهل «Multi-tenancy». ما العطل أو الخطر المتوقع، وكيف تصمم اختبارًا يكشفه؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> مرّر tenant من الهوية الموثقة لا من body فقط. طبّق العزل في queries وcache keys وobject storage وqueue messages وsearch indexes وexports. اختر database مشتركة أوschema منفصلة أوdatabase لكل tenant بناءً على العزل والتكلفة والتشغيل، ولا تفترض أن نمطًا واحدًا آمن تلقائيًا. لاكتشاف الخلل، اختبر مسارًا صحيحًا، وقيمة عند الحد، ومدخلًا غير صالح، ثم راقب النتيجة والآثار الجانبية والسجل بدل الاكتفاء بعدم ظهور Exception.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">04</span><p>حوّل «Deny by default والاختبار» إلى قرار هندسي قابل للمراجعة. ما الذي ستوثقه وما الحالات التي ستختبرها؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> أي action غير معروفة تُرفض. راجع inheritance والتعارض بين allow/deny، وسجل نسخة policy والسبب العام داخليًا. اختبر matrix تشمل owner في tenant نفسه، مستخدمًا بلا role، ID مطابقًا في tenant مختلف، auditor، وresource غير موجود. اختبر IDOR بتبديل IDs وكل HTTP/CLI/queue path. وثّق سبب الاختيار والبدائل والحدود، واختبر الحالة العادية، والحد الأدنى والأقصى، والفشل الجزئي، وإعادة المحاولة أو التكرار إن كان السلوك يسمح بذلك.</div></details>
</section>
</div>
