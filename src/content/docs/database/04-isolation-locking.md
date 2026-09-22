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

## خريطة الدرس

<div class="lesson-diagram" role="img" aria-label="خريطة مفاهيم: Isolation والأقفال وDeadlocks">
<p class="lesson-diagram-title">خريطة مفاهيم: Isolation والأقفال وDeadlocks</p>
<div class="diagram-flow">
<div class="diagram-node input"><span>لماذا التزامن صعب؟</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>مستويات العزل</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>Pessimistic locking</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node decision"><span>Optimistic locking</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node output"><span>Deadlock</span></div>
</div>
</div>

## تأكد من فهمك

<div class="lesson-quiz" role="list">
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">01</span><p>اشرح «لماذا التزامن صعب؟» كأنك تراجع تطبيقًا حقيقيًا: ما الهدف وما أهم قيد يجب الانتباه له؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> قد يقرأ طلبان القيمة نفسها ثم يكتبان نتائج متعارضة. Transaction وحدها لا تعني أن كل المعاملات تعمل واحدًا بعد الآخر؛ Isolation Level يحدد ما يمكن لكل معاملة رؤيته. مشكلات معروفة: Dirty Read: قراءة تغيير لم يُعمل له Commit. Non-repeatable Read: قراءة الصف مرتين والحصول على قيمتين بسبب Commit آخر. Phantom Read: إعادة query شرطية وظهور/اختفاء صفوف. Lost Update: تحديث يطغى على تحديث متزامن. Write Skew: معاملتان تقرآن… عمليًا، لا يكفي تنفيذ المسار الناجح؛ يجب توثيق الافتراضات والتحقق من القيم والحالات التي قد تكسر هذا السلوك.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">02</span><p>قارن بين «لماذا التزامن صعب؟» و«مستويات العزل». لماذا لا يغني أحدهما عن الآخر داخل موضوع «Isolation والأقفال وDeadlocks»؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> في «لماذا التزامن صعب؟»: قد يقرأ طلبان القيمة نفسها ثم يكتبان نتائج متعارضة. Transaction وحدها لا تعني أن كل المعاملات تعمل واحدًا بعد الآخر؛ Isolation Level يحدد ما يمكن لكل معاملة رؤيته. مشكلات معروفة: Dirty Read: قراءة تغيير لم يُعمل له Commit. Non-repeatable Read: قراءة الصف مرتين والحصول على قيمتين بسبب Commit آخر. Phantom Read: إعادة query شرطية وظهور/اختفاء صفوف. Lost Update: تحديث يطغى على تحديث متزامن. Write Skew: معاملتان تقرآن… أما «مستويات العزل»: | المستوى | الفكرة | |---|---| | Read Uncommitted | أقل عزل؛ يسمح برؤية أوسع لتغييرات غير مثبتة حسب النظام | | Read Committed | كل statement يرى بيانات committed | | Repeatable Read | القراءات داخل المعاملة أكثر ثباتًا | | Serializable | أقرب لتنفيذ متسلسل، وقد يزيد الانتظار/الفشل القابل لإعادة المحاولة | التفاصيل تختلف بشدة حسب MySQL/PostgreSQL/SQL Server وآلية MVCC. لا تحفظ جدولًا عامًا فقط؛ اختبر قاعدة بياناتك. العلاقة بينهما أن الأول يحدد جانبًا من الحل، والثاني يكمل السلوك أو القيود اللازمة لتطبيقه بصورة صحيحة.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">03</span><p>افترض أن نظامًا تجاهل «Pessimistic locking». ما العطل أو الخطر المتوقع، وكيف تصمم اختبارًا يكشفه؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> يقفل الصفوف المختارة عادة حتى نهاية المعاملة. استخدم index ليصل إلى الصفوف المقصودة؛ query سيئة قد تقفل نطاقًا أوسع. لاكتشاف الخلل، اختبر مسارًا صحيحًا، وقيمة عند الحد، ومدخلًا غير صالح، ثم راقب النتيجة والآثار الجانبية والسجل بدل الاكتفاء بعدم ظهور Exception.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">04</span><p>حوّل «Optimistic locking» إلى قرار هندسي قابل للمراجعة. ما الذي ستوثقه وما الحالات التي ستختبرها؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> أضف version: إذا كان affected rows = 0 فقد عدّل طرف آخر الصف؛ أعد القراءة وقرر retry أو conflict 409. وثّق سبب الاختيار والبدائل والحدود، واختبر الحالة العادية، والحد الأدنى والأقصى، والفشل الجزئي، وإعادة المحاولة أو التكرار إن كان السلوك يسمح بذلك.</div></details>
</section>
</div>
