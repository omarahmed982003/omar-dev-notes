---
title: "مشروع CLI: مصروفات من غير web"
prev: {"link":"/php/regex/","label":"Regex: افحص شكل string واقرأ النتيجة"}
next: {"link":"/php/first-tests/","label":"أول Test آلي يحمي البرنامج"}
description: "مشروع CLI: مصروفات من غير web"
sidebar:
  order: 11.5
---

## اجمع أدوات اللغة في برنامج واحد

المتطلبات: functions وarray وvalidation وCLI. هنبني قائمة مصروفات بأصغر وحدة نقدية صحيحة، من غير HTML أوSession أوDatabase.

**Accumulator** قيمة بتجمع نتائج؛ array_sum تجمع قيم القائمة. البيانات هنا في memory فقط وبتختفي بعد انتهاء الـprocess، وهي النسخة الشغالة من البرنامج.

**Regex** نمط بيفحص شكل string. هنا بيسمح بـ0 أوعدد من1 إلى6 أرقام بدون صفر زائد في البداية؛ [درس Regex](/php/regex/) يشرح رموزه. الحد999999 وعدد100 عنصر بيخلوا المجموع أقل من100 مليون، داخل int حتى على منصة32-bit.

## التطبيق الكامل

احفظ expenses.php، واستخدم PHP 8.1+ وشغّل php expenses.php. البرنامج لا يحفظ ملفات.

~~~php
<?php
declare(strict_types=1);

function readAmount(string $raw): ?int
{
    if (preg_match('/\\A(?:0|[1-9][0-9]{0,5})\\z/', $raw) !== 1) {
        return null;
    }
    return (int) $raw;
}
$items = [];
while (true) {
    fwrite(STDOUT, "Amount in cents, or quit: ");
    $line = fgets(STDIN);
    if ($line === false) {
        break;
    }
    $raw = trim($line);
    if ($raw === 'quit') {
        break;
    }
    $amount = readAmount($raw);
    if ($amount === null) {
        fwrite(STDERR, "Use 0..999999\n");
        continue;
    }
    if (count($items) >= 100) {
        fwrite(STDERR, "Maximum 100 items\n");
        exit(1);
    }
    $items[] = $amount;
}
echo 'count=', count($items), PHP_EOL;
echo 'total_cents=', array_sum($items), PHP_EOL;
~~~

أدخل120 ثم0 ثم80 ثم quit: count=3 وtotal_cents=200. جرّب12x: يرفض ويكمل. EOF ينهي الإدخال ويعرض اللي اتجمع.

حلقة while تتعامل مع كل سطر، وcontinue تتجاوز المدخل المرفوض قبل الإضافة. فحص عدد العناصر قبل الإضافة يمنع العنصر101 من تغيير الحالة.

## تتبع الحالة

| المدخل | القائمة بعدها | الأثر |
|---|---|---|
|120|[120]|إضافة|
|0|[120,0]|الصفر مسموح|
|12x|[120,0]|لا تغيير|
|80|[120,0,80]|إضافة|
|quit|نفس القائمة|خروج|

## محاولتك المستقلة

أضف عدد المصروفات الأكبر من100 وأكبر قيمة. القائمة الفارغة تعرض max=none؛ ما تخترعش أكبر قيمة0 لو مفيش عناصر. اختبر EOF مباشرة، و100 عنصر، والعنصر101.

<details><summary>فكرة الحل بعد المحاولة</summary>

اعمل counter للشرط>100. ابدأ max بـnull ثم حدثها عند أول عنصر أوعند قيمة أكبر. الحساب من البيانات المقبولة فقط. لو فصلت العمل في function، خلي الطباعة خارجها.

</details>

## الخطوة التالية

افصل القراءة عن الحساب في [program organization](/php/program-organization/)، ثم ضيف حفظ JSON بعد [files](/php/08-files-streams-data/). مفيش Database أوGit commit مطلوبين في التجربة.


