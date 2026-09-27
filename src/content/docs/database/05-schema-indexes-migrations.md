---
title: 5. تصميم المخطط والفهارس وMigrations
description: أنواع البيانات والقيود والعلاقات والفهارس المركبة وEXPLAIN وإدارة تغييرات المخطط.
sidebar:
  order: 5
---

## اجعل قاعدة البيانات تحمي قواعدها

التطبيق قد يحتوي bug أو توجد أداة إدارية أو worker آخر. ضع القيود الأساسية في Schema أيضًا:

```sql
CREATE TABLE orders (
    id BIGINT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    status VARCHAR(30) NOT NULL,
    total_cents BIGINT NOT NULL CHECK (total_cents >= 0),
    created_at TIMESTAMP NOT NULL,
    CONSTRAINT fk_orders_user
        FOREIGN KEY (user_id) REFERENCES users(id)
);
```

استخدم:

- `NOT NULL` للقيم الإلزامية.
- `UNIQUE` للهوية الفريدة.
- `CHECK` للقواعد المحلية المدعومة.
- Foreign keys للتكامل المرجعي.
- أنواعًا مناسبة؛ المال غالبًا integer minor units أو DECIMAL، لا float.
- timestamps مع سياسة timezone واضحة.

## الفهرس

الفهرس بنية إضافية تسرّع lookup/sort/join مقابل مساحة وكلفة كتابة.

```sql
CREATE INDEX idx_orders_user_status_created
ON orders (user_id, status, created_at);
```

ترتيب الأعمدة مهم. يفيد هذا غالبًا queries تبدأ بـ`user_id` ثم `status` وتستفيد من `created_at`. ليس ضمانًا أن index لكل عمود أو كل query أفضل.

## EXPLAIN والقياس

```sql
EXPLAIN
SELECT id, total_cents
FROM orders
WHERE user_id = 42 AND status = 'paid'
ORDER BY created_at DESC
LIMIT 20;
```

افحص plan والصفوف المقدرة والفعلية إن كانت الأداة تدعم analysis. اختبر بيانات بحجم قريب من الإنتاج، وراقب slow query log وp95/p99.

أسباب بطء شائعة:

- N+1.
- `SELECT *` ونقل بيانات غير لازمة.
- Pagination عميقة بـOFFSET.
- Functions/casts تمنع استخدام index.
- Missing أو low-selectivity index.
- Query كثيرة بدل batch.

## Pagination

Offset سهل:

```sql
SELECT * FROM orders
ORDER BY id DESC
LIMIT 20 OFFSET 10000
```

لكنه يزداد كلفة وقد يتغير مع إدخالات متزامنة. Keyset pagination:

```sql
SELECT *
FROM orders
WHERE id < :last_seen_id
ORDER BY id DESC
LIMIT 20
```

أفضل غالبًا للfeeds الكبيرة مع ترتيب ثابت.

## Migrations

Migration تغيير versioned قابل للمراجعة والتطبيق آليًا:

```text
20260921_001_create_orders
20260921_002_add_orders_status_index
```

قواعد مهمة:

1. خذ backup واختبر الاسترجاع.
2. جرّب على نسخة وحجم بيانات واقعي.
3. اجعل التغيير متوافقًا أثناء النشر المرحلي.
4. افصل schema change المكلف عن backfill الضخم.
5. راقب locks ووقت التنفيذ.
6. لا تفترض أن rollback آمن لكل DDL.

نمط Expand/Contract: أضف العمود/البنية الجديدة أولًا، انشر كودًا يدعم القديم والجديد، انقل البيانات، ثم احذف القديم في نشر لاحق.

## Seed وبيانات الاختبار

Migrations للبنية والتغييرات الحتمية. Seed ينشئ بيانات مرجعية أو تطويرية. لا تضع بيانات شخصية إنتاجية في fixtures، واجعل seed قابلًا للتكرار دون duplication.

## Checklist

- هل كل query تستخدم prepared values؟
- هل القيود تمنع الحالة المستحيلة؟
- هل transaction تغطي كل التغييرات المطلوبة فقط؟
- هل الفهرس يخدم query مقاسة؟
- هل migration آمنة على بيانات كبيرة؟
- هل النسخ الاحتياطي والاسترجاع مجرّبان؟

## مسائل مرتبطة بالدرس

<details><summary>لماذا لا نضيف index لكل عمود؟</summary><p>الفهارس تستهلك مساحة وتبطئ الكتابة؛ صممها للاستعلامات الفعلية وافحص execution plan.</p></details>

<details><summary>كيف تنشر migration خطرة بأمان؟</summary><p>استخدم expand/migrate/contract: أضف المتوافق أولًا، انقل البيانات، حدّث التطبيق، ثم احذف القديم لاحقًا.</p></details>

## مشروع تراكمي: مخزون لا يسمح بالبيع الزائد

صمّم جداول <code>products</code> و<code>orders</code> و<code>order_items</code>، ثم نفّذ عملية شراء واحدة عبر PDO. يجب أن تحمي قاعدة البيانات القواعد التي لا يجوز كسرها حتى لو أخطأ التطبيق: كمية موجبة، مفاتيح أجنبية صحيحة، ومعرّف طلب فريد.

### السيناريو المتزامن

1. ابدأ Transaction واقرأ صف المنتج بالقفل المناسب لمحركك.
2. ارفض العملية إذا كان المخزون أقل من الكمية المطلوبة.
3. أنشئ الطلب وبنوده، ثم حدّث المخزون والتزم.
4. عند أي خطأ نفّذ rollback كاملًا؛ لا تترك طلبًا بلا بنود أو خصمًا بلا طلب.

### بيانات تحقق ثابتة

~~~text
initial_stock=5
buyer_A_requests=4
buyer_B_requests=4
expected_successes=1
expected_final_stock=1
expected_negative_stock_rows=0
~~~

شغّل العمليتين بالتوازي عدة مرات. وجود نجاحين أو مخزون سالب يعني أن الاختبار كشف Race Condition حقيقية، لا مشكلة تجميلية.

### قياس الفهرس والهجرة

احفظ ناتج <code>EXPLAIN</code> لاستعلام الطلبات حسب <code>user_id, created_at</code> قبل الفهرس وبعده، وسجّل الصفوف المقدّرة أو المقروءة بدل الاكتفاء بعبارة «أصبح أسرع». طبّق migration بأسلوب expand/migrate/contract: أضف البنية المتوافقة، انقل البيانات على دفعات قابلة للاستئناف، حوّل القراءة والكتابة، ثم اترك إزالة القديم لإصدار لاحق بعد إثبات عدم استخدامه.

### شروط القبول

- كل قيم العميل تُمرر كـprepared parameters.
- اختبار التكامل يثبت commit وrollback والتنافس بين مشتريين.
- القيود تمنع الحالة المستحيلة مباشرة داخل القاعدة.
- خطة rollback أو roll-forward مكتوبة، واسترجاع النسخة الاحتياطية مُجرّب لا مفترض.
