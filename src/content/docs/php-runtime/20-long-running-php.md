---
title: 20. PHP طويلة العمر وWorker Runtimes
description: تشغيل FrankenPHP وRoadRunner وSwoole بأمان وإعادة ضبط الحالة والذاكرة والإشارات والنشر.
sidebar:
  order: 20
---

## قبل ما تبدأ

في FPM يبدأ الطلب بحالة PHP شبه نظيفة وتنتهي معظم الذاكرة بانتهاء الطلب. FrankenPHP Worker Mode وRoadRunner وSwoole وOctane يحتفظون بالعملية والتطبيق في الذاكرة لطلبات كثيرة، فيقل bootstrap لكن يتغير عقد البرمجة.

### كلمات جديدة

- **Long-running runtime:** عملية PHP تعالج عدة طلبات.
- **State leakage:** وصول بيانات طلب إلى طلب لاحق.
- **Reset hook:** خطوة تنظف خدمة بعد كل طلب.
- **Worker recycling:** إنهاء العامل واستبداله بعد حد محدد.

## ما الذي يبقى؟

Static properties وsingletons والـglobals والاتصالات والـin-memory caches قد تبقى. لا تضع Request أو User أو locale داخل service طويلة العمر. اجعل request-scoped state داخل context يُنشأ ويُتلف في كل دورة.

~~~php
final class RequestContext
{
    public function __construct(
        public readonly string $requestId,
        public readonly ?int $userId,
    ) {}
}

function handle(ServerRequestInterface $request): ResponseInterface
{
    $context = new RequestContext(bin2hex(random_bytes(8)), null);
    return dispatch($request, $context);
}
~~~

اختبر طلب A ببيانات سرية ثم طلب B بلا هوية، وتأكد أن B لا يرى أي قيمة من A. شغّل الاختبار مرات كثيرة وعلى العامل نفسه.

## الذاكرة والموارد

تسرب صغير لكل طلب يصبح نموًا دائمًا. راقب RSS بعد كل N طلبات، وحدد max jobs أو max memory لإعادة التدوير كحاجز، ثم أصلح السبب. أغلق streams وcursors، أزل listeners المؤقتة، ونظف context وtracer scope في `finally`.

## الإشارات والنشر

عند SIGTERM توقف عن قبول عمل جديد، أكمل الجاري ضمن grace period، صدّر telemetry المتبقية ثم اخرج. يجب أن تتجاوز مهلة المنصة مدة الإنهاء المتوقعة. rollout يحتاج توافق الجلسات والـqueue payload وقاعدة البيانات مع نسختين في الوقت نفسه.

## اختيار النموذج

FPM مناسب لعزل بسيط وسلوك request واضح. Runtime طويلة العمر مفيدة عندما يكون bootstrap غاليًا أو تحتاج concurrency وWebSockets، لكنها تتطلب إطارًا يدعم reset واختبارات تسرب. لا تختَرها لمجرد benchmark hello-world.

~~~text
FPM: request -> fresh execution -> response -> cleanup
Worker runtime: boot once -> request -> reset -> request -> reset -> recycle
~~~

راجع توافق extensions والعملاء مع threads أو coroutines. Blocking I/O داخل event loop قد يجمد عدة طلبات، والاتصال غير الآمن للتزامن لا يصبح آمنًا لأن API تبدو asynchronous.

## تمرين state leakage محلي

~~~bash
php memory-lab.php
php resilience-lab.php
php long-running-state-lab.php
~~~

ثم نفّذ التطبيق نفسه على runtime طويلة العمر، أرسل 1000 طلب بهويات مختلفة، وراقب RSS والقيم الثابتة. النجاح يتطلب عدم تسرب الهوية واستقرار الذاكرة بعد warm-up واستجابة صحيحة لـSIGTERM.

## تأكد من فهمك

<div class="lesson-quiz" role="list">
<section class="quiz-card" role="listitem"><details><summary>لماذا singleton أخطر هنا؟</summary><p>لأنه يبقى بين الطلبات وقد يحتفظ ببيانات مستخدم أو إعداد طلب سابق.</p></details></section>
<section class="quiz-card" role="listitem"><details><summary>هل recycling يصلح memory leak؟</summary><p>يحد أثره لكنه لا يزيل السبب؛ يجب القياس والإصلاح.</p></details></section>
<section class="quiz-card" role="listitem"><details><summary>ما وظيفة reset hook؟</summary><p>تنظيف الحالة الخاصة بالطلب وإرجاع الخدمات إلى حالة آمنة قبل الطلب التالي.</p></details></section>
<section class="quiz-card" role="listitem"><details><summary>متى تفضّل FPM؟</summary><p>عندما تكون بساطة العزل أهم من كلفة bootstrap أو عندما لا يدعم التطبيق دورة reset موثوقة.</p></details></section>
</div>

#### دورة التجربة

قبل التنفيذ اكتب توقعك، ثم شغّل المثال وسجّل الخروج. أحدث فشلًا واحدًا مقصودًا، اجمع الدليل من logs أو metrics، أصلح السبب، وأعد التشغيل لإثبات أن الإصلاح يعالج العطل ولا يخفيه.


### جرّب بنفسك

أنشئ تسربًا عمديًا في static array، أثبت نمو RSS أو انتقال قيمة بين طلبين، ثم أضف reset واختبار regression وحدًا لإعادة تدوير العامل.
