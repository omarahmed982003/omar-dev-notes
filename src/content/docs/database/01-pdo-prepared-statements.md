---
title: 1. PDO والاتصال الآمن
description: إنشاء اتصال PDO وضبط الأخطاء وتنفيذ Prepared Statements ومنع SQL Injection.
sidebar:
  order: 1
---

## لماذا PDO؟

PHP Data Objects واجهة موحدة للتعامل مع عدة drivers مثل MySQL وPostgreSQL وSQLite. التوحيد لا يعني أن SQL وخصائص قواعد البيانات متطابقة؛ ارجع دائمًا لتوثيق driver.

## الاتصال

```php
<?php
declare(strict_types=1);

$dsn = 'mysql:host=127.0.0.1;port=3306;dbname=shop;charset=utf8mb4';

$pdo = new PDO(
    $dsn,
    getenv('DB_USER') ?: throw new RuntimeException('DB_USER missing'),
    getenv('DB_PASSWORD') ?: throw new RuntimeException('DB_PASSWORD missing'),
    [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
    ]
);
```

- لا تحفظ credentials داخل Git.
- استخدم charset في DSN، وليس query يدويًا بعد الاتصال.
- الاستثناءات تجعل الفشل واضحًا، لكن لا تعرض رسالتها للمستخدم.
- `ATTR_EMULATE_PREPARES=false` يطلب native prepares عندما يدعمها driver؛ اختبر SQL الفعلي وخصائص driver بدل اعتباره قانونًا عامًا.

## Prepared Statements

```php
$stmt = $pdo->prepare(
    'SELECT id, name, email
     FROM users
     WHERE email = :email AND status = :status'
);

$stmt->execute([
    'email' => $email,
    'status' => 'active',
]);

$user = $stmt->fetch(); // array|false
```

الـplaceholder يفصل **قيمة البيانات** عن تركيب SQL، فيمنع تحويل quote داخل القيمة إلى أمر SQL.

```php
$stmt = $pdo->prepare(
    'INSERT INTO products (name, price_cents)
     VALUES (:name, :price)'
);

$stmt->execute([
    'name' => $name,
    'price' => $priceCents,
]);

$id = (int) $pdo->lastInsertId();
```

## ما لا يمكن ربطه؟

الـparameter يمثل data literal كاملًا؛ لا يمثل اسم جدول/عمود أو keyword أو اتجاه ترتيب:

```php
$allowedSort = ['name', 'created_at', 'price_cents'];
$sort = $_GET['sort'] ?? 'created_at';

if (!in_array($sort, $allowedSort, true)) {
    $sort = 'created_at';
}

$sql = "SELECT * FROM products ORDER BY {$sort} DESC";
$rows = $pdo->query($sql)->fetchAll();
```

استخدم allow-list للأسماء. ولا تربط قائمة `IN` كلها بplaceholder واحد:

```php
$ids = [4, 7, 9];
$marks = implode(',', array_fill(0, count($ids), '?'));
$stmt = $pdo->prepare("SELECT * FROM products WHERE id IN ({$marks})");
$stmt->execute($ids);
```

تعامل مع القائمة الفارغة منفصلًا، وقيّد عدد العناصر.

## bindValue أم execute array؟

```php
$stmt = $pdo->prepare('SELECT * FROM users WHERE id = :id');
$stmt->bindValue('id', $id, PDO::PARAM_INT);
$stmt->execute();
```

`bindValue` يربط القيمة الآن. `bindParam` يربط المتغير بالمرجع وقد يفاجئك إذا تغير. تمرير array إلى `execute` أبسط غالبًا، واستخدم النوع الصريح عندما يؤثر في driver/query plan.

## Fetching والذاكرة

- `fetch()`: صف واحد أو `false`.
- `fetchAll()`: كل الصفوف؛ قد تستهلك ذاكرة كبيرة.
- `fetchColumn()`: عمود واحد.
- `rowCount()`: موثوق عادة لعمليات التعديل، وسلوكه مع SELECT يختلف بين drivers.

مرّ على النتائج الكبيرة صفًا صفًا، وحدد الأعمدة بدل `SELECT *` في الكود الإنتاجي.

## معالجة الخطأ

```php
try {
    $user = $stmt->fetch();
} catch (PDOException $e) {
    error_log($e);
    throw new RuntimeException('Database operation failed', previous: $e);
}
```

في المنتج أظهر رسالة عامة وRequest ID، وسجل التفاصيل في مكان محمي دون credentials أو بيانات شخصية غير لازمة.

## خريطة الدرس

<div class="lesson-diagram" role="img" aria-label="خريطة مفاهيم: PDO والاتصال الآمن">
<p class="lesson-diagram-title">خريطة مفاهيم: PDO والاتصال الآمن</p>
<div class="diagram-flow">
<div class="diagram-node input"><span>لماذا PDO؟</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>الاتصال</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>Prepared Statements</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node decision"><span>ما لا يمكن ربطه؟</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node output"><span>bindValue أم execute array؟</span></div>
</div>
</div>

## تأكد من فهمك

<div class="lesson-quiz" role="list">
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">01</span><p>اشرح «لماذا PDO؟» كأنك تراجع تطبيقًا حقيقيًا: ما الهدف وما أهم قيد يجب الانتباه له؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> PHP Data Objects واجهة موحدة للتعامل مع عدة drivers مثل MySQL وPostgreSQL وSQLite. التوحيد لا يعني أن SQL وخصائص قواعد البيانات متطابقة؛ ارجع دائمًا لتوثيق driver. عمليًا، لا يكفي تنفيذ المسار الناجح؛ يجب توثيق الافتراضات والتحقق من القيم والحالات التي قد تكسر هذا السلوك.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">02</span><p>قارن بين «لماذا PDO؟» و«الاتصال». لماذا لا يغني أحدهما عن الآخر داخل موضوع «PDO والاتصال الآمن»؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> في «لماذا PDO؟»: PHP Data Objects واجهة موحدة للتعامل مع عدة drivers مثل MySQL وPostgreSQL وSQLite. التوحيد لا يعني أن SQL وخصائص قواعد البيانات متطابقة؛ ارجع دائمًا لتوثيق driver. أما «الاتصال»: لا تحفظ credentials داخل Git. استخدم charset في DSN، وليس query يدويًا بعد الاتصال. الاستثناءات تجعل الفشل واضحًا، لكن لا تعرض رسالتها للمستخدم. ATTR_EMULATE_PREPARES=false يطلب native prepares عندما يدعمها driver؛ اختبر SQL الفعلي وخصائص driver بدل اعتباره قانونًا عامًا. العلاقة بينهما أن الأول يحدد جانبًا من الحل، والثاني يكمل السلوك أو القيود اللازمة لتطبيقه بصورة صحيحة.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">03</span><p>افترض أن نظامًا تجاهل «Prepared Statements». ما العطل أو الخطر المتوقع، وكيف تصمم اختبارًا يكشفه؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> الـplaceholder يفصل قيمة البيانات عن تركيب SQL، فيمنع تحويل quote داخل القيمة إلى أمر SQL. لاكتشاف الخلل، اختبر مسارًا صحيحًا، وقيمة عند الحد، ومدخلًا غير صالح، ثم راقب النتيجة والآثار الجانبية والسجل بدل الاكتفاء بعدم ظهور Exception.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">04</span><p>حوّل «ما لا يمكن ربطه؟» إلى قرار هندسي قابل للمراجعة. ما الذي ستوثقه وما الحالات التي ستختبرها؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> الـparameter يمثل data literal كاملًا؛ لا يمثل اسم جدول/عمود أو keyword أو اتجاه ترتيب: استخدم allow-list للأسماء. ولا تربط قائمة IN كلها بplaceholder واحد: تعامل مع القائمة الفارغة منفصلًا، وقيّد عدد العناصر. وثّق سبب الاختيار والبدائل والحدود، واختبر الحالة العادية، والحد الأدنى والأقصى، والفشل الجزئي، وإعادة المحاولة أو التكرار إن كان السلوك يسمح بذلك.</div></details>
</section>
</div>
