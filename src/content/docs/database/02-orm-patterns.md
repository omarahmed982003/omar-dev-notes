---
title: 2. ORM وأنماط الوصول للبيانات
description: معنى ORM وActive Record وData Mapper والعلاقات ومشكلة N+1 وحدود التجريد.
sidebar:
  order: 2
---

## ما ORM؟

Object-Relational Mapping يربط صفوف الجداول بكائنات وخصائص وعلاقات. يقلل SQL المتكرر لكنه لا يلغي قاعدة البيانات ولا تكلفة الاستعلام.

```text
Object/Entity ↔ Mapper/Model ↔ Table Row
User          ↔ ORM          ↔ users
```

## Active Record

الكائن يمثل صفًا ويحتوي عمليات الحفظ والاستعلام. Laravel Eloquent مثال مشهور:

```php
$user = User::findOrFail($id);
$user->name = 'Omar';
$user->save();

$orders = Order::query()
    ->where('status', 'paid')
    ->latest()
    ->get();
```

مميزاته: مباشر وسريع في CRUD. عيوبه: قد يخلط منطق المجال بالتخزين، ويصعب فصل الاختبارات في المجالات المعقدة.

## Data Mapper

Entity تبقى أقرب إلى منطق المجال، وMapper/Repository يدير التخزين. Doctrine ORM مثال:

```php
$user = $entityManager->find(User::class, $id);
$user->rename('Omar');
$entityManager->flush();
```

مميزاته: فصل أقوى ونمذجة مجال أغنى. عيوبه: مفاهيم وحالة Unit of Work وIdentity Map وتعقيد أكبر.

:::note
Django Active Record-like ORM مثال من Python، وليس مكتبة PHP. ذكره مفيد للمقارنة فقط؛ في PHP قارن Eloquent وDoctrine.
:::

## العلاقات

- One-to-one.
- One-to-many.
- Many-to-many عبر join table.
- Foreign keys تحمي التكامل في قاعدة البيانات، لا تعتمد على ORM وحده.

حدد cascade بعناية؛ حذف parent لا يجب أن يمسح بيانات كثيرة بالمفاجأة.

## N+1 Queries

```php
$orders = Order::all();

foreach ($orders as $order) {
    echo $order->customer->name; // قد ينفذ query لكل order
}
```

الحل يكون eager loading أو join/select مصممًا:

```php
$orders = Order::with('customer')->get();
```

قِس عدد الاستعلامات وزمنها، ولا تجعل eager load كل العلاقات افتراضيًا لأنه قد ينقل بيانات ضخمة.

## Mass Assignment وSerialization

لا تمرر `$_POST` كاملًا إلى model:

```php
$user->fill([
    'name' => $validated['name'],
    'email' => $validated['email'],
]);
```

وإلا قد يمر حقل مثل `is_admin`. استخدم allow-list وDTO/validated input. كذلك لا تحول entity كاملة إلى JSON إن كانت تحمل password hash أو secrets.

## متى نستخدم SQL مباشرًا؟

- تقارير وتجميعات معقدة.
- Bulk operations.
- استعلامات تعتمد على خصائص قوية في قاعدة محددة.
- مسار أداء حرج بعد القياس.

يمكن الجمع بين ORM وQuery Builder وPDO. الهدف وضوح وصحة وأداء، لا الالتزام العقائدي بأداة واحدة.
