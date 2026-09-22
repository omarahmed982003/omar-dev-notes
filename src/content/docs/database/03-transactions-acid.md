---
title: 3. Transactions وACID
description: Auto-commit وbeginTransaction وcommit وrollBack وتطبيق ACID في عمليات متعددة الخطوات.
sidebar:
  order: 3
---

## لماذا Transaction؟

بدون Transaction قد تنجح خطوة وتفشل أخرى، فتترك بيانات نصف مكتملة. في وضع Auto-commit المعتاد يصبح كل statement مستقلًا ما لم تبدأ معاملة صريحة.

مثال تحويل رصيد:

1. خصم من الحساب A.
2. إضافة للحساب B.
3. تسجيل الحركة.

يجب أن تنجح كلها أو لا يحدث شيء.

## ACID

- **Atomicity:** المعاملة وحدة واحدة؛ Commit كامل أو Rollback.
- **Consistency:** تنتقل البيانات بين حالات تحترم القيود والقواعد. التطبيق والـconstraints مسؤولان أيضًا.
- **Isolation:** نتائج المعاملات المتزامنة لا تتداخل بطريقة تكسر المستوى المختار.
- **Durability:** بعد Commit الناجح تبقى النتيجة رغم الأعطال ضمن ضمانات النظام.

ACID ليس معناه «لا تحدث أخطاء» ولا أن كل قواعد البيانات والإعدادات تعطي المستوى نفسه.

## PDO transaction

```php
function transfer(PDO $pdo, int $from, int $to, int $amount): void
{
    if ($amount <= 0 || $from === $to) {
        throw new InvalidArgumentException('Invalid transfer');
    }

    $pdo->beginTransaction();

    try {
        $lock = $pdo->prepare(
            'SELECT id, balance_cents
             FROM accounts
             WHERE id IN (?, ?)
             ORDER BY id
             FOR UPDATE'
        );
        $lock->execute([$from, $to]);
        $accounts = $lock->fetchAll();

        if (count($accounts) !== 2) {
            throw new RuntimeException('Account not found');
        }

        $balances = array_column($accounts, 'balance_cents', 'id');
        if ((int) $balances[$from] < $amount) {
            throw new RuntimeException('Insufficient balance');
        }

        $debit = $pdo->prepare(
            'UPDATE accounts
             SET balance_cents = balance_cents - :amount
             WHERE id = :id'
        );
        $credit = $pdo->prepare(
            'UPDATE accounts
             SET balance_cents = balance_cents + :amount
             WHERE id = :id'
        );

        $debit->execute(['amount' => $amount, 'id' => $from]);
        $credit->execute(['amount' => $amount, 'id' => $to]);

        $pdo->commit();
    } catch (Throwable $e) {
        if ($pdo->inTransaction()) {
            $pdo->rollBack();
        }
        throw $e;
    }
}
```

ترتيب قفل الحسابات حسب ID يقلل احتمال Deadlock لكنه لا يلغيه. أسماء الصياغة مثل `FOR UPDATE` ودعمها تختلف حسب قاعدة البيانات.

## حدود المعاملة

اجعلها قصيرة:

- لا تنتظر API أو بريدًا داخل lock إن أمكن.
- تحقق من المدخلات قبل البداية.
- ضع كل تغييرات قاعدة البيانات اللازمة داخلها.
- لا تُرجع نجاحًا قبل Commit.
- لا تمسك Transaction أثناء عرض صفحة للمستخدم.

لإرسال حدث/رسالة بعد نجاح البيانات استخدم **Transactional Outbox**: اكتب الحدث في جدول داخل المعاملة، ثم ينشره worker لاحقًا.

## DDL وImplicit Commit

بعض الأنظمة، ومنها حالات في MySQL، تنفذ implicit commit عند أوامر مثل `CREATE TABLE` و`DROP TABLE`. لا تفترض أن كل DDL يمكن Rollback؛ افحص محرك قاعدة البيانات.

ينطبق التنبيه كذلك على Oracle: معاملات DML تدعم ACID، بينما أوامر DDL تنفذ عادة implicit commit قبل الأمر وبعده. لا تخلط تغيير schema مع business transaction وتتوقع التراجع عن الاثنين كوحدة واحدة.

## أخطاء شائعة

- بدء المعاملة بعد أول UPDATE.
- نسيان Rollback في catch.
- ابتلاع exception وإكمال الطلب.
- الاعتماد على Transaction دون constraints.
- إجراء external side effect ثم Rollback؛ قاعدة البيانات لا تستطيع التراجع عن بريد أُرسل.

## خريطة الدرس

<div class="lesson-diagram" role="img" aria-label="خريطة مفاهيم: Transactions وACID">
<p class="lesson-diagram-title">خريطة مفاهيم: Transactions وACID</p>
<div class="diagram-flow">
<div class="diagram-node input"><span>لماذا Transaction؟</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>ACID</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>PDO transaction</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node decision"><span>حدود المعاملة</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node output"><span>DDL وImplicit Commit</span></div>
</div>
</div>

## تأكد من فهمك

<div class="lesson-quiz" role="list">
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">01</span><p>اشرح «لماذا Transaction؟» كأنك تراجع تطبيقًا حقيقيًا: ما الهدف وما أهم قيد يجب الانتباه له؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> بدون Transaction قد تنجح خطوة وتفشل أخرى، فتترك بيانات نصف مكتملة. في وضع Auto-commit المعتاد يصبح كل statement مستقلًا ما لم تبدأ معاملة صريحة. مثال تحويل رصيد: خصم من الحساب A. إضافة للحساب B. تسجيل الحركة. يجب أن تنجح كلها أو لا يحدث شيء. عمليًا، لا يكفي تنفيذ المسار الناجح؛ يجب توثيق الافتراضات والتحقق من القيم والحالات التي قد تكسر هذا السلوك.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">02</span><p>قارن بين «لماذا Transaction؟» و«ACID». لماذا لا يغني أحدهما عن الآخر داخل موضوع «Transactions وACID»؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> في «لماذا Transaction؟»: بدون Transaction قد تنجح خطوة وتفشل أخرى، فتترك بيانات نصف مكتملة. في وضع Auto-commit المعتاد يصبح كل statement مستقلًا ما لم تبدأ معاملة صريحة. مثال تحويل رصيد: خصم من الحساب A. إضافة للحساب B. تسجيل الحركة. يجب أن تنجح كلها أو لا يحدث شيء. أما «ACID»: Atomicity: المعاملة وحدة واحدة؛ Commit كامل أو Rollback. Consistency: تنتقل البيانات بين حالات تحترم القيود والقواعد. التطبيق والـconstraints مسؤولان أيضًا. Isolation: نتائج المعاملات المتزامنة لا تتداخل بطريقة تكسر المستوى المختار. Durability: بعد Commit الناجح تبقى النتيجة رغم الأعطال ضمن ضمانات النظام. ACID ليس معناه «لا تحدث أخطاء» ولا أن كل قواعد البيانات والإعدادات تعطي المستوى نفسه. العلاقة بينهما أن الأول يحدد جانبًا من الحل، والثاني يكمل السلوك أو القيود اللازمة لتطبيقه بصورة صحيحة.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">03</span><p>افترض أن نظامًا تجاهل «PDO transaction». ما العطل أو الخطر المتوقع، وكيف تصمم اختبارًا يكشفه؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> ترتيب قفل الحسابات حسب ID يقلل احتمال Deadlock لكنه لا يلغيه. أسماء الصياغة مثل FOR UPDATE ودعمها تختلف حسب قاعدة البيانات. لاكتشاف الخلل، اختبر مسارًا صحيحًا، وقيمة عند الحد، ومدخلًا غير صالح، ثم راقب النتيجة والآثار الجانبية والسجل بدل الاكتفاء بعدم ظهور Exception.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">04</span><p>حوّل «حدود المعاملة» إلى قرار هندسي قابل للمراجعة. ما الذي ستوثقه وما الحالات التي ستختبرها؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> اجعلها قصيرة: لا تنتظر API أو بريدًا داخل lock إن أمكن. تحقق من المدخلات قبل البداية. ضع كل تغييرات قاعدة البيانات اللازمة داخلها. لا تُرجع نجاحًا قبل Commit. لا تمسك Transaction أثناء عرض صفحة للمستخدم. لإرسال حدث/رسالة بعد نجاح البيانات استخدم Transactional Outbox: اكتب الحدث في جدول داخل المعاملة، ثم ينشره worker لاحقًا. وثّق سبب الاختيار والبدائل والحدود، واختبر الحالة العادية، والحد الأدنى والأقصى، والفشل الجزئي، وإعادة المحاولة أو التكرار إن كان السلوك يسمح بذلك.</div></details>
</section>
</div>
