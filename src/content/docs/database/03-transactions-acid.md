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
