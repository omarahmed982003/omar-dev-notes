---
title: 11. الأخطاء والاستثناءات
description: Throwable وError وException وtry/catch/finally والاستثناءات المخصصة وحدود المعالجة والتسجيل الآمن.
sidebar:
  order: 11
---

## المشكلة: الفشل مش نتيجة عادية

حساب رصيد ممكن ينجح، أو يرفض مبلغًا سالبًا، أو يرفض مبلغًا أكبر من الرصيد. وقراءة ملف ممكن تفشل لأن القرص غير متاح. لو كل الحالات ترجع `null`، المستدعي مش هيعرف هل دي «لا توجد بيانات» ولا Bug.

**Exception** إعلان إن العملية لم تنتج نتيجتها الطبيعية. `throw` ترمي الفشل؛ `try` تحدد المنطقة التي نراقبها، و`catch` تستقبل نوعًا تعرف تعالجه. **Throwable** المظلة التي تجمع Exception وError. الأخيرة تشمل أخطاء مثل TypeError وDivisionByZeroError؛ مش كل خطأ في PHP Exception: Warning قد تطبع تشخيصًا وترجع false.

الدرس PHP 8.1+. ارجع لـCall Stack في الدرس 7: الاستثناء يمشي عكس سلسلة الاستدعاءات لحد catch مناسبة.

## برنامج كامل بثلاث حالات

احفظ `withdraw.php` وشغّل `php withdraw.php`. **Domain** هنا قواعد السحب، وDomainException فشل قاعدة عمل رغم أن النوع صحيح:

~~~php
<?php
declare(strict_types=1);

function withdraw(int $balance, int $amount): int
{
    if ($balance < 0 || $amount <= 0) {
        throw new InvalidArgumentException('Use a nonnegative balance and positive amount');
    }
    if ($amount > $balance) {
        throw new DomainException('Insufficient funds');
    }
    return $balance - $amount;
}
foreach ([200, 1200, -1] as $amount) {
    echo "request={$amount}", PHP_EOL;
    try {
        $remaining = withdraw(1000, $amount);
        echo "remaining={$remaining}", PHP_EOL;
    } catch (InvalidArgumentException $error) {
        echo "invalid input", PHP_EOL;
    } catch (DomainException $error) {
        echo "declined", PHP_EOL;
    } finally {
        echo "finished attempt", PHP_EOL;
    }
}
~~~

~~~text
request=200
remaining=800
finished attempt
request=1200
declined
finished attempt
request=-1
invalid input
finished attempt
~~~

كل دورة تبدأ برصيد 1000؛ المثال يقارن حالات مستقلة، مش كشف حساب متراكم. 200 ترجع 800؛ 1200 ترمي قبل return، فيُتخطى echo remaining وتعمل catch المجال. -1 تدخل فحص المدخل. finally تعمل في الحالات الثلاث. لا تجعل catch عامة قبل الخاصة لأنها ستلتقط النوع مبكرًا.

لو دالة داخل withdraw رمت، يُلغى مسارها ثم يبحث PHP خارجها. catch لا تعيد التنفيذ للسطر الذي فشل؛ تكمل بعد الكتلة المعالجة. بدون catch يصل الفشل للحد العام وينتهي الطلب/السكربت عادة.

## finally للتنظيف، مش لتغيير النتيجة

المورد المفتوح يحتاج إغلاقًا في النجاح والفشل. تجربة `cleanup.php`:

~~~php
<?php
$stream = fopen('php://temp', 'w+b');
if ($stream === false) {
    throw new RuntimeException('Open failed');
}
try {
    try {
        throw new RuntimeException('Simulated read failure');
    } finally {
        fclose($stream);
        echo "closed", PHP_EOL;
    }
} catch (RuntimeException $error) {
    echo "handled", PHP_EOL;
}
echo is_resource($stream) ? "open\n" : "not open\n";
~~~

~~~text
closed
handled
not open
~~~

الـfinally الداخلية تعمل أثناء خروج الاستثناء، وبعدها catch الخارجية. finally تعمل أيضًا مع return العادية، لكن لا تعتمد عليها بعد `exit` أو إنهاء العملية بالقوة. **خطأ:** return داخل finally قد تخفي نتيجة أو Exception؛ اتركها للتنظيف الذي لا يخفي سبب الفشل الأصلي.

استثناء مخصص مثل `final class InsufficientStock extends DomainException {}` يعطي نوعًا واضحًا، لكن لا تحتاج صنفًا لكل رسالة. عند تغليف فشل احتفظ بـprevious: `throw new RuntimeException('Could not load notes', 0, $error);`. قرارات البرنامج تعتمد على النوع، لا على مقارنة نص الرسالة.

## Warning مش هتدخل catch تلقائيًا

`file_get_contents` قد تصدر Warning وترجع false. ضع فحصًا صريحًا كما في درس الملفات. `@` يخفي التشخيص ولا يصلح القراءة. إذا احتجت تحويل Warning إلى Exception عند حد I/O محدد، ثبّت handler مؤقتًا وأعد السابق في finally، واحترم `error_reporting()`. لا تحول كل Notice في تطبيق كامل عشوائيًا ثم ترجع نجاحًا.

في worker طويل العمر، catch على حد الرسالة تقرر retry أو رفض المهمة وإعادة تنظيف الحالة. retry مناسبة فقط لفشل مؤقت وعملية يمكن تكرارها بدون تنفيذ أثر مرتين؛ الاسم التقني **idempotent**. TypeError داخل الحساب Bug يحتاج إصلاحًا، مش خمس محاولات.

## التطوير والإنتاج: نفس الخطأ وعرض مختلف

**Development** بيئة تجرب فيها، و**production** خدمة يستخدمها الناس. اعرف الملف المحمل بـ`php --ini`؛ إعداد CLI قد يختلف عن FPM/Apache. مثال ملف ini للتطوير:

~~~ini
error_reporting=E_ALL
display_errors=On
display_startup_errors=On
log_errors=On
~~~

وفي الإنتاج، مع error_log في مسار محمي قابل لكتابة الخدمة:

~~~ini
error_reporting=E_ALL
display_errors=Off
display_startup_errors=Off
log_errors=On
zend.exception_ignore_args=On
~~~

الهدف الاحتفاظ بالتشخيص في سجل محمي بدل إرساله للمستخدم. لا تسجل Password أو Session ID أو Body كاملة. حجب arguments من trace يقلل تسربًا محتملًا لكنه لا ينقح رسالة كتبت أسرارًا يدويًا. خطأ parsing في نفس الملف قد يحدث قبل ini_set؛ إعداد php.ini يسبق التنفيذ.

## حد تطبيق كامل يعيد JSON

احفظ `boundary.php` وشغّله بخادم PHP محلي. الطلب يرجع 500 وJSON بها request_id مختلف كل مرة. السجل يحتوي النوع والمكان فقط؛ ده مثال لتقليل البيانات، ويمكن إضافة سياق منقح حسب الحاجة:

~~~php
<?php
declare(strict_types=1);

set_exception_handler(static function (Throwable $error): void {
    $id = bin2hex(random_bytes(8));
    error_log(json_encode([
        'event' => 'unhandled_failure',
        'request_id' => $id,
        'type' => get_class($error),
        'file' => basename($error->getFile()),
        'line' => $error->getLine(),
    ], JSON_THROW_ON_ERROR));
    http_response_code(500);
    header('Content-Type: application/json; charset=utf-8');
    header('Cache-Control: no-store');
    echo json_encode(['error' => 'Internal error', 'request_id' => $id], JSON_THROW_ON_ERROR);
});
throw new RuntimeException('Demonstration failure');
~~~

المعالج شبكة أمان للفشل غير المتوقع؛ لا يستبدل 422 عند فشل Validation. لو سبق إرسال body، مش هتقدر تصلح الاستجابة بالكامل؛ خلي الإخراج في نقطة واحدة. catch فارغة أو `catch (Throwable) { return null; }` تخفي الأعطال. سجل الخطأ مرة في الحد المسؤول، مش في كل طبقة مر بها.

## توقع، شخّص، كمّل

<details><summary>توقع ترتيب cleanup.php لو العملية تفشل</summary><p>closed ثم handled ثم not open. التنظيف يحصل أثناء خروج الاستثناء وقبل catch الخارجية.</p></details>

<details><summary>Debugging: catch (Exception) لا تمسك TypeError</summary><p>TypeError تحت Error، والاثنان تحت Throwable. امسك الأنواع المتوقعة قرب العملية وThrowable عند الحد العام؛ لا تحول Bug إلى نجاح.</p></details>

<details><summary>كمّل تغليف خطأ مع الاحتفاظ بالسبب</summary><p><code>throw new RuntimeException('Load failed', 0, $error);</code>. المعامل الثالث previous يحفظ سلسلة السبب للتشخيص.</p></details>

<details><summary>مستخدم يرى مسار ملف داخلي في JSON الإنتاج</summary><p>راجع display_errors وoutput العشوائية ورسائل exceptions الخام. افصل رسالة عامة ومعرّف تتبع عن سجل محمي، ثم أعد اختبار الرد للتأكد أنه JSON واحدة.</p></details>

جرّب `php error-lab.php` من [المختبر](/php/00-lab-setup/). في الدفتر، بيانات نموذج غير صحيحة 422، وفشل تخزين غير متوقع 500؛ لا نخلطهما.
