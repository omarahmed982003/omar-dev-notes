---
title: 17. مشروع دفتر الملاحظات وDebugging عملي
description: برامج PHP كاملة تربط الأنواع والدوال والملفات والطلبات والاستثناءات، مع تمارين توقع الناتج وتصحيح الأخطاء.
sidebar:
  order: 17
---

## المشكلة: الأجزاء تعمل وحدها، لكن هل الطلب الكامل يعمل؟

الدالة قد تكون صحيحة، لكن النموذج يرسل Array بدل نص، أو الحفظ يفشل، أو echo مبكرة تكسر redirect. عشان كده هنربط Form وValidation وSession وFiles وRouter في **دفتر ملاحظات محلي**. لكل جلسة متصفح دفترها؛ لا يوجد Login أو Database في المشروع. لما تحتاج حسابات أو تخزينًا متعدد المستخدمين انتقل إلى [الأمان](/auth/) و[قواعد البيانات](/database/) بدل اختراعها هنا.

كل الملفات كاملة تحت `examples/php-course/notebook` أو [حزمة أمثلة المنهج](/downloads/php-course.zip). تحتاج PHP 8.1+ وmbstring ومخزن جلسات قابلًا للكتابة. اقرأ على ثلاث جلسات: الطلب والتحقق؛ الحفظ والعرض؛ الاختبارات والتصحيح.

## مراحل البناء التي وصلنا لها

| المرحلة | ما تعلمته | الدليل العملي |
|---|---|---|
| الدرس 5–7 | شروط ودوال وCallbacks | اختيار خطأ أو متابعة وتنفيذ Handler |
| الدرس 8 | ملفات وJSON وفشل I/O | كتابة ملف والتحقق من Bytes وقراءة شكله |
| الدرس 9 | Form→Validation→Session | preferences.php تتذكر الاسم وCSRF |
| الدرس 10 | Composer وأدوات الجودة | composer-demo له lock واختبارات فعلية |
| الدرس 13–15 | Unicode والوقت ومسار الطلب | UTF-8 وUTC وRouter وEmitter |
| هنا | ربط الحدود | حفظ ملاحظة ثم عرضها عبر GET |

لا تنسخ fragments متفرقة فوق بعضها. أنشئ الشجرة التالية، ثم اكتب كل ملف كما هو:

~~~text
notebook/
  config.php
  public/index.php
  src/notebook.php
  views/notebook.php
  storage/              (created on first save)
~~~

## 1. إعداد واضح بدل افتراض البيئة

`config.php`؛ environment قيمة من إعداد الخدمة، وليست من Request:

~~~php
<?php
$environment = getenv('APP_ENV') ?: 'development';
if (!in_array($environment, ['development', 'production'], true)) {
    throw new RuntimeException('Invalid APP_ENV');
}
return [
    'secure_cookie' => $environment === 'production',
    'storage' => getenv('NOTEBOOK_STORAGE') ?: __DIR__ . '/storage',
];
~~~

المحلي HTTP فيختار Cookie بدون Secure. الإنتاج يختار Secure=true ويحتاج HTTPS فعليًا. NOTEBOOK_STORAGE اختيار لمسار تخزين موثوق في الاختبار أو النشر؛ الافتراضي خارج public. إعداد غير معروف يفشل بدل تشغيل سياسة غير مقصودة. حد الطلب في الخادم وphp.ini يكمّل حد التطبيق؛ أخطاء الإنتاج تسجل ولا تعرض.

## 2. التحقق والتخزين والعرض: src/notebook.php

~~~php
<?php
declare(strict_types=1);

function validateNote(array $input): array
{
    $data = [];
    $errors = [];
    foreach (['name' => 40, 'text' => 200] as $field => $limit) {
        $value = $input[$field] ?? null;
        if (!is_string($value) || strlen($value) > $limit * 4
            || !mb_check_encoding($value, 'UTF-8')) {
            $errors[$field] = 'Use valid UTF-8 text';
            $data[$field] = '';
            continue;
        }
        $value = trim($value);
        $data[$field] = $value;
        if ($value === '' || mb_strlen($value, 'UTF-8') > $limit) {
            $errors[$field] = "Use 1 to {$limit} code points";
        }
    }
    return ['data' => $data, 'errors' => $errors];
}
function ownerDirectory(string $root, string $owner): string
{
    if (preg_match('/\A[a-f0-9]{32}\z/', $owner) !== 1) {
        throw new RuntimeException('Invalid storage identifier');
    }
    return $root . '/' . $owner;
}
function readNotes(string $root, string $owner): array
{
    $directory = ownerDirectory($root, $owner);
    if (file_exists($root) && (!is_dir($root) || !is_readable($root))) {
        throw new RuntimeException('Storage unavailable');
    }
    if (!is_dir($directory)) {
        return [];
    }
    $paths = glob($directory . '/*.json');
    if ($paths === false || count($paths) > 100) {
        throw new RuntimeException('Cannot list notes');
    }
    $notes = [];
    foreach ($paths as $path) {
        $raw = file_get_contents($path, false, null, 0, 8193);
        if ($raw === false || strlen($raw) > 8192) {
            throw new RuntimeException('Cannot read note');
        }
        $note = json_decode($raw, true, 32, JSON_THROW_ON_ERROR);
        if (!is_array($note)
            || !is_string($note['name'] ?? null)
            || !is_string($note['text'] ?? null)
            || !is_string($note['created_at'] ?? null)
            || !is_string($note['id'] ?? null)) {
            throw new RuntimeException('Invalid stored note');
        }
        $notes[] = $note;
    }
    usort($notes, static fn (array $a, array $b): int =>
        [$a['created_at'], $a['id']] <=> [$b['created_at'], $b['id']]);
    return $notes;
}
function saveNote(string $root, string $owner, array $data, DateTimeImmutable $now): void
{
    $directory = ownerDirectory($root, $owner);
    if (!is_dir($directory) && !mkdir($directory, 0700, true) && !is_dir($directory)) {
        throw new RuntimeException('Cannot create storage');
    }
    $id = bin2hex(random_bytes(16));
    $note = [
        'id' => $id,
        'name' => $data['name'],
        'text' => $data['text'],
        'created_at' => $now->setTimezone(new DateTimeZone('UTC'))->format(DateTimeInterface::ATOM),
    ];
    $json = json_encode($note, JSON_UNESCAPED_UNICODE | JSON_THROW_ON_ERROR);
    $temporary = tempnam($directory, '.pending-');
    if ($temporary === false) {
        throw new RuntimeException('Cannot create temporary file');
    }
    if (realpath(dirname($temporary)) !== realpath($directory)) {
        unlink($temporary);
        throw new RuntimeException('Temporary file outside storage');
    }
    try {
        if (file_put_contents($temporary, $json) !== strlen($json)) {
            throw new RuntimeException('Cannot write complete note');
        }
        if (!rename($temporary, $directory . '/' . $id . '.json')) {
            throw new RuntimeException('Cannot publish note');
        }
    } finally {
        if (is_file($temporary)) {
            unlink($temporary);
        }
    }
}
function escapeHtml(string $value): string
{
    return htmlspecialchars($value, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}
function renderNotes(array $notes, array $errors, array $old, string $csrf, string $flash): string
{
    ob_start();
    try {
        require dirname(__DIR__) . '/views/notebook.php';
        return (string) ob_get_contents();
    } finally {
        ob_end_clean();
    }
}
~~~

### اقرأ الدوال واحدة واحدة

`validateNote` تبني بيانات منظفة وأخطاء. افحص is_string قبل strlen وmb_check_encoding؛ `name[]=x` لا يكسر الدالة. حد Bytes يسبق العمل على Unicode، ثم trim وحد code points. `continue` تمنع تنفيذ باقي التحقق على قيمة مرفوضة. الصفر النصي `'0'` صالح؛ لا نستخدم empty التي ترفضه.

`ownerDirectory` تسمح فقط بمعرّف مولد من 32 حرف hex. المتصفح لا يحدد اسم الملف؛ owner تأتي من مخزن Session على الخادم. ده فصل دفاتر الجلسات، وليس نظام حسابات يمكن استعادتها.

`readNotes` تعتبر مجلدًا لم ينشأ دفترًا فارغًا. `glob` تبحث عن ملفات json المنشورة فقط، ثم نقرأ بحد حجم ونفك JSON بفشل واضح. لا نحول ملفًا تالفًا إلى «لا ملاحظات»؛ ده فقد بيانات متخفٍ. نفحص البنية، ونرتب بالوقت ثم id لكسر التعادل؛ المعرّف العشوائي لا يعني ترتيب إنشاء داخل نفس الثانية.

`saveNote` تنشئ المجلد الخاص وتولد id، وتحول now المحقونة إلى UTC. `tempnam` تنشئ ملفًا مؤقتًا؛ نتحقق من كتابة العدد الكامل، ثم rename لاسم json نهائي داخل نفس filesystem. القارئ لا يرى ملفات pending. اختبر ضمان rename على منصة النشر؛ المثال لا يَعِد بمتانة عند انقطاع الكهرباء. finally تنظف المؤقت عند الفشل.

`renderNotes` تستخدم output buffer عشان القالب يرجع string بدل إرسالها فورًا؛ finally تنظف الـbuffer حتى لو القالب فشل. `escapeHtml` تعمل عند العرض، لا عند التخزين.

## 3. القالب: views/notebook.php

~~~php
<!doctype html>
<html lang="en">
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>My learning notebook</title>
<h1>My learning notebook</h1>
<p>This browser session owns this notebook. This demo has no login.</p>
<p role="status"><?= escapeHtml($flash) ?></p>
<?php foreach ($errors as $field => $message): ?>
  <p role="alert"><?= escapeHtml($field . ': ' . $message) ?></p>
<?php endforeach; ?>
<form method="post" action="/notes">
  <input type="hidden" name="csrf" value="<?= escapeHtml($csrf) ?>">
  <p><label>Name <input name="name" required value="<?= escapeHtml($old['name'] ?? '') ?>"></label></p>
  <p><label>Note <textarea name="text" required><?= escapeHtml($old['text'] ?? '') ?></textarea></label></p>
  <button>Save note</button>
</form>
<h2>Saved notes</h2>
<?php if ($notes === []): ?><p>No notes yet.</p><?php endif; ?>
<ol>
<?php foreach ($notes as $note): ?>
  <li><strong><?= escapeHtml($note['name']) ?></strong>:
    <span class="note-text"><?= escapeHtml($note['text']) ?></span>
    <time datetime="<?= escapeHtml($note['created_at']) ?>"><?= escapeHtml($note['created_at']) ?></time>
  </li>
<?php endforeach; ?>
</ol>
</html>
~~~

hidden csrf من الجلسة، لكن المستخدم يقدر يغير أي hidden input؛ الحماية من مقارنة الخادم، مش اختفاء الحقل. نعرض errors جنب النموذج ونحافظ على input الصحيحة بعد 422. كل اسم ونص وزمن يمر عبر escapeHtml حتى لو جاء من ملفنا؛ الثقة في مكان التخزين لا تحول النص إلى HTML مسموح. لو كتبت `<b>hello</b>` لازم تشوفها حروفًا، مش خطًا عريضًا.

الواجهة الإنجليزية هنا مقصودة لتثبيت نفس المثال في اللغتين؛ الاسم والملاحظة يقبلان العربية وUTF-8. تغيير نصوص الواجهة لا يغير منطق الدرس.

## 4. نقطة الدخول والـMiddleware والـRouter

`public/index.php`؛ ده الملف الوحيد الذي يستقبل كل المسارات:

~~~php
<?php
declare(strict_types=1);
require dirname(__DIR__) . '/src/notebook.php';

function reply(string $body, int $status = 200, array $headers = []): array
{
    return ['status' => $status, 'headers' => $headers, 'body' => $body];
}
function routeNotebook(string $method, string $path, array $config): array
{
    $routes = ['/' => 'GET', '/notes' => 'POST'];
    if (!isset($routes[$path])) {
        return reply('Not found', 404);
    }
    if ($routes[$path] !== $method) {
        return reply('Method not allowed', 405, ['Allow' => $routes[$path]]);
    }
    $owner = $_SESSION['owner'];
    $csrf = $_SESSION['csrf'];
    if ($method === 'POST') {
        $type = strtolower(trim(explode(';', $_SERVER['CONTENT_TYPE'] ?? '')[0]));
        if ($type !== 'application/x-www-form-urlencoded') {
            return reply('Unsupported media type', 415);
        }
        $token = $_POST['csrf'] ?? null;
        if (!is_string($token) || !hash_equals($csrf, $token)) {
            return reply('Invalid form token', 403);
        }
        $result = validateNote($_POST);
        $notes = readNotes($config['storage'], $owner);
        if ($result['errors'] !== []) {
            return reply(renderNotes($notes, $result['errors'], $result['data'], $csrf, ''), 422);
        }
        if (count($notes) >= 100) {
            return reply('Notebook is full', 409);
        }
        saveNote($config['storage'], $owner, $result['data'], new DateTimeImmutable('now', new DateTimeZone('UTC')));
        $_SESSION['name'] = $result['data']['name'];
        $_SESSION['flash'] = 'Note saved';
        return reply('', 303, ['Location' => '/']);
    }
    $flash = $_SESSION['flash'] ?? '';
    unset($_SESSION['flash']);
    return reply(renderNotes(
        readNotes($config['storage'], $owner),
        [],
        ['name' => $_SESSION['name'] ?? '', 'text' => ''],
        $csrf,
        $flash,
    ));
}
function sessionMiddleware(callable $next, array $config): array
{
    $raw = file_get_contents('php://input', false, null, 0, 4097);
    if ($raw === false) {
        throw new RuntimeException('Cannot read body');
    }
    if (strlen($raw) > 4096 || (int) ($_SERVER['CONTENT_LENGTH'] ?? 0) > 4096) {
        return reply('Body too large', 413);
    }
    if (!session_start([
        'use_strict_mode' => true,
        'use_only_cookies' => true,
        'cookie_secure' => $config['secure_cookie'],
        'cookie_httponly' => true,
        'cookie_samesite' => 'Lax',
        'cookie_path' => '/',
    ])) {
        throw new RuntimeException('Session unavailable');
    }
    try {
        $_SESSION['owner'] ??= bin2hex(random_bytes(16));
        $_SESSION['csrf'] ??= bin2hex(random_bytes(32));
        return $next();
    } finally {
        session_write_close();
    }
}

ini_set('display_errors', '0');
ini_set('log_errors', '1');
$requestId = bin2hex(random_bytes(8));
try {
    $config = require dirname(__DIR__) . '/config.php';
    $method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
    $path = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH);
    $response = sessionMiddleware(
        static fn (): array => routeNotebook($method, is_string($path) ? $path : '', $config),
        $config,
    );
} catch (Throwable $error) {
    error_log(json_encode(['request_id' => $requestId, 'type' => get_class($error)], JSON_THROW_ON_ERROR));
    $response = reply('Internal error. Reference: ' . $requestId, 500);
}
http_response_code($response['status']);
header('Content-Type: text/html; charset=utf-8');
header('Cache-Control: no-store');
header('X-Content-Type-Options: nosniff');
header('X-Request-ID: ' . $requestId);
foreach ($response['headers'] as $name => $value) {
    header("{$name}: {$value}");
}
echo $response['body'];
~~~

### رحلة الحفظ سطرًا بسطر على مستوى القرار

نقرأ الإعداد ونحدد method/path، ثم sessionMiddleware تقرأ body بحد وتبدأ الجلسة. owner عشوائي ثابت داخل الجلسة، وcsrf عشوائي آخر؛ لا ترسل owner في النموذج. تستدعي next فتصل routeNotebook: تبحث المسار ثم method، ثم نوع body، ثم token، ثم validateNote. **ولا ملف يُكتب قبل نجاح الخطوات دي.**

البيانات المرفوضة ترجع 422 مع نفس النموذج. لو وصل الدفتر 100 ملاحظة يرجع 409. في النجاح نقرأ القائمة ونحفظ، ثم نخزن الاسم وflash ونرجع 303. الـfinally تغلق Session قبل الإرسال. مع file session handler الافتراضي يظل القفل ممسوكًا خلال count ثم save؛ طلبان لنفس الجلسة لا يتجاوزان الحد بسبب قراءة نفس العدد. تغيير handler يحتاج ضمان قفل مكافئ.

المتصفح يتبع Location إلى GET /. handler تقرأ flash ثم تمسحها، لذلك رسالة Note saved تظهر مرة. القراءة لا تعيد الحفظ. Emitter واحدة تطبع status والـheaders ثم body. حد الأخطاء يعطي 500 ومعرّفًا للسجل؛ logs هنا لا تحتوي النص أو Cookie.

الـ303 لا تمنع إعادة إرسال POST عمدًا ولا Double-click في كل ظرف؛ النسخة دي قد تحفظ ملاحظة ثانية عند POST ثانية. مفتاح idempotency مرحلة منفصلة عند الحاجة. انتهاء Session يفقد ربط المتصفح بالدفتر؛ تنظيف الملفات القديمة واستعادة الحسابات خارج نطاق هذه التجربة ومذكوران في README.

## التشغيل ودليل النجاح

من مجلد notebook، شغّل `php tests.php` أولًا: المتوقع `PASS: 15 notebook checks` للتحقق من المدخلات والتخزين والعزل وUTC والترميز. بعدها شغّل الخادم:

~~~bash
php -S 127.0.0.1:8083 -t public public/index.php
~~~

افتح [الدفتر المحلي](http://127.0.0.1:8083/). اكتب Omar وLearn PHP. المتوقع POST 303 ثم GET 200، رسالة Note saved وملاحظة محفوظة. Refresh ثانية: الرسالة تختفي والملاحظة تظل. نافذة خاصة: دفتر فاضي. بعد إيقاف السيرفر وتشغيله بنفس Session Cookie ومخزن جلسات ساري، الملفات ما زالت موجودة.

| التجربة | المطلوب |
|---|---|
| name فارغ أو name[] | 422، لا ملف جديد |
| نص عربي وemoji | حفظ وعرض صحيحان |
| نص يحتوي HTML | يظهر كنص، لا يتنفذ |
| CSRF ناقص/غلط | 403، لا حفظ |
| GET /notes | 405 وAllow: POST |
| /missing | 404 |
| JSON بدل form-urlencoded | 415 |
| جسم أكثر من 4096 Bytes | 413 |
| ملف JSON مخزن تالف | 500 مع reference، لا ادعاء دفتر فارغ |
| GET /storage/... | 404؛ Document Root هي public فقط |

اختبر فساد الملفات في نسخة تجارب منفصلة باستخدام NOTEBOOK_STORAGE، مش ملاحظاتك الحقيقية. الاختبارات الآلية المرفقة في المستودع تتحقق من الجلسات والعزل وCSRF وUTF-8 والإخراج والحفظ ومسارات الخطأ.

## Debugging: دليل قبل التعديل

1. ثبّت Request صغيرة تعيد العيب، وسجّل expected وactual.
2. حدد الحد: parsing أم validation أم حفظ أم عرض؟
3. افحص قيمة ونوعًا عند الحد، بدون طباعة داخل Response.
4. اختبر فرضية واحدة وعدل سببًا واحدًا.
5. أضف Regression Test تفشل قبل الإصلاح وتنجح بعده.

**Breakpoint** نقطة توقف في debugger قبل تنفيذ سطر. Xdebug امتداد PHP، والـIDE عميل يعرض المتغيرات والـCall Stack. ثبت الامتداد المطابق لبنية وإصدار PHP وفق [التثبيت الرسمي](https://xdebug.org/docs/install)، ثم `php --ri xdebug` للتأكد. إعداد محلي، مع سطر zend_extension لمسار ملفك الفعلي:

~~~ini
xdebug.mode=debug
xdebug.start_with_request=trigger
xdebug.client_host=127.0.0.1
xdebug.client_port=9003
~~~

افتح listener في IDE واضبط path mapping لو PHP داخل container. ضع breakpoint على `$result = validateNote($_POST);` ثم أرسل النموذج مع XDEBUG_TRIGGER عن طريق browser helper/Cookie. **Step Into** تدخل الدالة، **Step Over** تنفذ السطر، و**Step Out** تكمل حتى تعود للمستدعي. راقب `$_POST['name']`، ثم errors، ثم Call Stack: index→middleware→route→validateNote.

من CLI على PowerShell: `$env:XDEBUG_TRIGGER='1'` ثم شغّل الملف، وبعد التجربة `Remove-Item Env:XDEBUG_TRIGGER`. لو لا تتوقف: راجع PHP المستخدمة وملف ini وlistener وtrigger وmapping؛ امتداد CLI لا يعني أن FPM حملته. [مرجع step debugging](https://xdebug.org/docs/step_debug). في الإنتاج لا تفعّل اتصال debugger عام؛ استخدم logs محمية وrequest ID وdisplay_errors=Off. إعدادات 11 تشرح الفرق. Log منظمة بمعلومات منقحة، لا dump لكل SESSION.

## الاختبارات والأدوات على مشروع فعلي

ارجع إلى composer-demo من الدرس 10: `composer install` ثم `composer check` ثم `composer audit`. PHPUnit تتحقق من النتائج، PHPStan من العقود، وPHP-CS-Fixer من التنسيق. الـlock يثبت النسخ؛ لا تحذفها لحل خطأ test. أثناء نشر التطبيق استخدم install من lock وcheck-platform-reqs على المنصة المستهدفة، مع PHP ini منفصل للتطوير والإنتاج.

## امتداد التدريب: البرامج الكاملة السابقة ما زالت متاحة

في [مختبر PHP الأصلي](/php/00-lab-setup/) ملفات `total.php` و`orders.php` و`stream-lab.php` كاملة وليست أجزاء ناقصة:

- `php total.php 12.50 3.25` → `15.75`. تحويل المبلغ يتم كنص لوحدات صحيحة: ضبط الصيغة بـ`\A`/`\z`، تكملة الكسر لرقمين، مقارنة طول الأرقام ثم ترتيبها مع PHP_INT_MAX **قبل التحويل**. الجمع يفحص `left <= PHP_INT_MAX - right`. اختبر 0 و12 و12.5 و12.50، وارفض -1 و1.234 وnewline وقيمة ضخمة. `php tests.php values` يثبت الحدود.
- `php orders.php fixtures/orders.json` → `orders=2` و`items=3` و`total_minor=2999`، للطلبين 1250×2 و499×1. JSON المكسورة ترجع `ERROR invalid JSON` وكود خروج 2. افصل القراءة والتحقق والحساب والعرض، واختبر كمية صفرًا وسعرًا سالبًا وoverflow.
- `php stream-lab.php fixtures/large.csv` يعالج بالتتابع؛ اختبر الملف الفارغ والمفقود والسطر الكبير. Generator أو SplFileObject لا تجعل ذاكرة السطر الواحد غير محدودة آمنة. راقب العدد والذاكرة، ولا تخلط فشل القراءة بقائمة فاضية.

حالة JSON endpoint وفروق 400/422/415/413 موجودة كاملة في http-demo بالدرس 15. خلي لكل برنامج README وfixtures واختبارًا؛ الشغل من نسخة نظيفة يكشف ملفات محلية منسية.

## توقع، شخّص، كمّل

<details><summary>توقع: Save ناجحة ثم Refresh مرتين</summary><p>POST تحفظ مرة وترجع 303. أول GET تظهر flash وتمسحها؛ التالية تعرض الملاحظة بدون flash ولا حفظ جديد. إعادة POST نفسها حالة أخرى قد تضيف ملاحظة.</p></details>

<details><summary>Debugging: name[]=Omar يسبب TypeError</summary><p>يعني وصلت Array لدالة نص قبل التحقق. ضع is_string في validateNote قبل trim/mb_strlen، واختبر أن الرد 422 وأن عدد الملفات لم يتغير.</p></details>

<details><summary>كمّل اختبار يمنع XSS من ملف مخزن</summary><p>احفظ نصًا مثل &lt;img src=x onerror=alert(1)&gt; ثم افحص HTML: يظهر مرمزًا داخل note-text ولا يوجد عنصر img ناتج عنه. الاختبار لازم يقرأ الرد الحقيقي، مش يختبر escapeHtml وحدها فقط.</p></details>

<details><summary>ملف JSON تالف أدى لدفتر فاضي ورسالة نجاح. إيه الخطأ؟</summary><p>الفشل اتبلع. ارم خطأ عند decode/shape failure، وسجل reference وارجع 500 بلا تفاصيل حساسة. لا تعدل المتوقع ليتوافق مع فقد البيانات.</p></details>

<details><summary>المجموع المالي صحيح للمدخلات العادية ويفشل عند الحد الأعلى. أول خطوة؟</summary><p>ثبّت الحد وحالة تتجاوزه في Test، وافحص قبل الضرب أو الجمع؛ overflow قد يحول النتيجة إلى float قبل أن تلحق تتحقق منها.</p></details>

الانتهاء من الدرس يعني أنك تقدر تتبع طلب واحد من النموذج حتى الملف والرد، وتثبت مسار رفض بلا أثر، وتشرح سبب كل حالة HTTP.
