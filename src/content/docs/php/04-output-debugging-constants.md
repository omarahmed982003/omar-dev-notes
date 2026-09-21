---
title: 4. الإخراج والتصحيح والثوابت
description: echo وprint وأدوات فحص القيم والثوابت العادية والسحرية والمسبقة.
sidebar:
  order: 4
---

## echo وprint

كلاهما language construct وليس دالة عادية.

| الخاصية | `echo` | `print` |
|---|---|---|
| القيمة المرجعة | لا شيء | دائمًا `1` |
| عدد الوسائط | يقبل عدة وسائط بلا أقواس | وسيط واحد |
| داخل expression | لا | نعم، بسبب القيمة المرجعة |
| الاختصار | `<?= ... ?>` | لا يوجد |

```php
echo 'Hello', ' ', 'PHP', PHP_EOL;
$result = print 'Printed';
var_dump($result); // int(1)
```

فرق السرعة غير مهم عمليًا؛ اختر `echo` عادة، ولا تطبع مدخل مستخدم داخل HTML دون `htmlspecialchars`.

## أدوات التصحيح

```php
$user = ['id' => 7, 'active' => true];

var_dump($user);            // النوع والقيمة والتفاصيل
print_r($user);             // عرض أسهل للقراءة
$text = print_r($user, true); // أعد العرض كنص
echo get_debug_type($user); // array
```

في أطر العمل قد تجد `dump()` و`dd()`؛ الثانية تطبع ثم توقف التنفيذ. لا تترك بيانات حساسة أو debugging في الإنتاج. استخدم logger وبيئة تطوير منفصلة.

## الثوابت

```php
const APP_NAME = 'Omar Notes';
define('APP_VERSION', '1.0.0');

echo APP_NAME;
```

الثابت لا يبدأ بـ `$`، وهو متاح عالميًا. الفرق الدقيق:

- `define()` استدعاء وقت التشغيل، لذلك يمكن وضعه داخل شرط؛ ينشئ constant عامة.
- `const` تصريح لغوي وله قيود موضعية، ويمكن استخدامه لتعريف class constants.
- لا يمكن استخدام `define()` لتعريف class constant.
- لا تضع `const` داخل function أو block شرطي.

```php
class HttpStatus
{
    public const OK = 200;
    public const NOT_FOUND = 404;
}
```

## Magic وPredefined constants

```php
echo __LINE__;
echo __FILE__;
echo __DIR__;
echo __FUNCTION__;
echo __CLASS__;

echo PHP_VERSION;
echo PHP_OS_FAMILY;
echo PHP_EOL;
```

تتغير Magic constants حسب مكانها في المصدر. `__DIR__` مهم لبناء مسارات ثابتة لا تعتمد على working directory:

```php
$config = require __DIR__ . '/../config/app.php';
```
