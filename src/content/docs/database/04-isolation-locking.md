---
title: 4. Isolation والأقفال وDeadlocks
description: مشكلات التزامن ومستويات العزل والأقفال وDeadlocks وSavepoints وسياسة إعادة المحاولة.
sidebar:
  order: 4
---

## لماذا التزامن صعب؟

قد يقرأ طلبان القيمة نفسها ثم يكتبان نتائج متعارضة. Transaction وحدها لا تعني أن كل المعاملات تعمل واحدًا بعد الآخر؛ **Isolation Level** يحدد ما يمكن لكل معاملة رؤيته.

مشكلات معروفة:

- **Dirty Read:** قراءة تغيير لم يُعمل له Commit.
- **Non-repeatable Read:** قراءة الصف مرتين والحصول على قيمتين بسبب Commit آخر.
- **Phantom Read:** إعادة query شرطية وظهور/اختفاء صفوف.
- **Lost Update:** تحديث يطغى على تحديث متزامن.
- **Write Skew:** معاملتان تقرآن حالة مشتركة وتكتبان صفوفًا مختلفة فتنكسر قاعدة.

## مستويات العزل

| المستوى | الفكرة |
|---|---|
| Read Uncommitted | أقل عزل؛ يسمح برؤية أوسع لتغييرات غير مثبتة حسب النظام |
| Read Committed | كل statement يرى بيانات committed |
| Repeatable Read | القراءات داخل المعاملة أكثر ثباتًا |
| Serializable | أقرب لتنفيذ متسلسل، وقد يزيد الانتظار/الفشل القابل لإعادة المحاولة |

التفاصيل تختلف بشدة حسب MySQL/PostgreSQL/SQL Server وآلية MVCC. لا تحفظ جدولًا عامًا فقط؛ اختبر قاعدة بياناتك.

## Pessimistic locking

```sql
SELECT id, stock
FROM products
WHERE id = :id
FOR UPDATE
```

يقفل الصفوف المختارة عادة حتى نهاية المعاملة. استخدم index ليصل إلى الصفوف المقصودة؛ query سيئة قد تقفل نطاقًا أوسع.

## Optimistic locking

أضف `version`:

```sql
UPDATE products
SET stock = :new_stock, version = version + 1
WHERE id = :id AND version = :old_version
```

إذا كان affected rows = 0 فقد عدّل طرف آخر الصف؛ أعد القراءة وقرر retry أو conflict `409`.

## Deadlock

يحدث عندما تمسك معاملة A قفلًا تحتاجه B، وتمسك B قفلًا تحتاجه A. قاعدة البيانات تقتل إحدى المعاملات لحل الحلقة.

قلل الاحتمال عبر:

- ترتيب الوصول للموارد دائمًا بنفس الطريقة.
- معاملات قصيرة.
- فهارس مناسبة.
- عدم طلب تفاعل المستخدم داخل المعاملة.
- Retry محدود مع backoff وjitter للأخطاء القابلة للإعادة.

يجب أن تكون العملية idempotent أو تستخدم idempotency key حتى لا يتكرر side effect عند retry.

## Savepoints والمعاملات المتداخلة

PDO لا يوفر nested transactions حقيقية بطريقة عامة. بعض قواعد البيانات تدعم Savepoints:

```php
$pdo->beginTransaction();

try {
    $pdo->exec('SAVEPOINT before_optional_step');
    // optional database work
    $pdo->exec('RELEASE SAVEPOINT before_optional_step');
    $pdo->commit();
} catch (Throwable $e) {
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }
    throw $e;
}
```

للرجوع الجزئي استخدم `ROLLBACK TO SAVEPOINT ...` وفق dialect. انتبه: rollback إلى savepoint لا يلغي ضرورة commit/rollback للمعاملة الخارجية.

## لا تجعل isolation دواءً سحريًا

رفع المستوى إلى Serializable قد يحسن الصحة لكنه يزيد conflicts والـretries. ابدأ من invariants: ما القاعدة التي لا يجوز كسرها؟ ثم استخدم constraints وatomic updates وlocks أو optimistic version بما يناسب.
