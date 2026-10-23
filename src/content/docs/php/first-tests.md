---
title: "أول Test آلي يحمي البرنامج"
prev: {"link":"/php/cli-expenses-project/","label":"مشروع CLI: مصروفات من غير web"}
next: {"link":"/php/","label":"دليل PHP"}
description: "قارن expected بالفعلي واختبر الحدود وregression"
sidebar:
  order: 11.7
---

## تشغيل المثال مرة مش كفاية

المتطلبات: functions وarray وif وexit code. الـ**Test** تجربة لها input معروف ونتيجة متوقعة محسوبة بشكل مستقل. الـ**Assertion** مقارنة واضحة تفشل لو الفعلي مختلف. **Regression** إن سلوكًا كان شغالًا يتكسر بعد تغيير.

احفظ first-tests.php وشغّل php first-tests.php على PHP 8.1+. مفيش تعديل ملفات أوDatabase.

~~~php
<?php
declare(strict_types=1);
function total(array $values): int
{
    return array_sum($values);
}
$cases = [[[], 0], [[0], 0], [[10, 0, 20], 30]];
$failed = 0;
foreach ($cases as [$input, $expected]) {
    $actual = total($input);
    if ($actual !== $expected) {
        fwrite(STDERR, "FAIL expected=$expected actual=$actual\n");
        $failed++;
    }
}
echo 'cases=', count($cases), ' failures=', $failed, PHP_EOL;
exit($failed === 0 ? 0 : 1);
~~~

المتوقع cases=3 failures=0 وكود0. القائمة الفارغة والصفر حالات صحيحة. غيّر total مؤقتًا لترجع1: التلات حالات لازم تفشل وكود الخروج1. رجّع الحساب الصحيح. الاختبار اللي ما يكشفش العطل المقصود مش دليل كفاية.

## جرّب بنفسك

استخرج حساب «عدد المصروفات الأكبر من100» في function. اختبر القائمة الفارغة و100 و101 وقيمتين أكبر من100. احسب المتوقع بإيدك؛ ما تستدعيش نفس function عشان تنتج expected.

<details><summary>راجع بعد المحاولة</summary>

النتائج0 و0 و1 و2. حالة100 مهمة عشان تغيير> إلى>= يكسر الاختبار. خلي الطباعة خارج الحساب.

</details>

## حدود كل نوع

**Unit test** يختبر حسابًا صغيرًا معزولًا. **Integration test** يختبر تعاونًا حقيقيًا مع حد خارجي، زي file storage. استعمل ملفات تدريب مؤقتة، مش بياناتك الشخصية.

ما تعتمدش على PHP assert وحدها؛ إعدادات PHP ممكن تعطلها. هنا الفشل صريح ومعاه exit code. [أدوات جودة الكود](/php-runtime/10-testing-quality/) تعمق الموضوع بعد الأساس.

