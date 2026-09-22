---
title: 3. Traits وإعادة الاستخدام الأفقي
description: تجميع السلوك المشترك وحل التعارض باستخدام insteadof وas وضبط visibility.
sidebar:
  order: 3
---

## لماذا Trait؟

PHP لا تدعم multiple class inheritance. Trait تجمع methods/properties/constants لإدخالها في classes غير مرتبطة بوراثة واحدة. لا يمكن إنشاء instance من Trait.

```php
trait HasTimestamps
{
    private ?DateTimeImmutable $updatedAt = null;

    public function touch(): void
    {
        $this->updatedAt = new DateTimeImmutable();
    }

    public function updatedAt(): ?DateTimeImmutable
    {
        return $this->updatedAt;
    }
}

final class Article
{
    use HasTimestamps;
}
```

الـTrait reuse أفقي أو composition وقت تعريف class، وليست type contract. إذا احتاج المستدعي معرفة capability فاستخدم interface أيضًا.

## الأولوية

بالنسبة للـmethods:

1. method داخل class الحالية تتغلب على Trait.
2. method من Trait تتغلب على method موروثة.
3. تعارض method بين Traitين يحتاج حلًا صريحًا.

```php
trait JsonLogger
{
    public function log(string $message): void
    {
        echo json_encode(['message' => $message]);
    }
}

trait TextLogger
{
    public function log(string $message): void
    {
        echo $message;
    }
}

final class Importer
{
    use JsonLogger, TextLogger {
        JsonLogger::log insteadof TextLogger;
        TextLogger::log as logText;
        JsonLogger::log as protected logJson;
    }
}
```

- `insteadof` يختار التنفيذ الفائز.
- `as` يضيف alias أو يغيّر visibility، ولا يحل التعارض وحده.
- إذا لم تحل تعارض الاسم يحدث fatal error.

## Trait تفرض متطلبات

```php
trait PublishesEvents
{
    abstract protected function aggregateId(): string;

    public function event(string $name): array
    {
        return ['id' => $this->aggregateId(), 'name' => $name];
    }
}
```

class المستخدمة يجب أن تنفذ التوقيع المتوافق.

## حدود ومخاطر

- Trait كبيرة قد تخفي dependencies وحالة داخلية.
- تعارض properties/constants يجب أن يكون متوافقًا أو يفشل.
- الوصول إلى static members مباشرة على اسم Trait deprecated؛ استخدم class التي تستعملها.
- من PHP 8.3 يمكن جعل method المستوردة `final` عبر `as final`.
- PHP 8.5 غيّرت ترتيب ربط trait مع parent بالنسبة لتعارض property/constant؛ اختبر السلوك عند الترقية.

استخدم Trait لسلوك صغير متماسك. إذا احتاجت خدمات متعددة أو lifecycle معقدًا فغالبًا object composition أوضح.

## خريطة الدرس

<div class="lesson-diagram" role="img" aria-label="خريطة مفاهيم: Traits وإعادة الاستخدام الأفقي">
<p class="lesson-diagram-title">خريطة مفاهيم: Traits وإعادة الاستخدام الأفقي</p>
<div class="diagram-flow">
<div class="diagram-node input"><span>لماذا Trait؟</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>الأولوية</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>Trait تفرض متطلبات</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node decision"><span>حدود ومخاطر</span></div>
</div>
</div>

## تأكد من فهمك

<div class="lesson-quiz" role="list">
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">01</span><p>اشرح «لماذا Trait؟» كأنك تراجع تطبيقًا حقيقيًا: ما الهدف وما أهم قيد يجب الانتباه له؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> PHP لا تدعم multiple class inheritance. Trait تجمع methods/properties/constants لإدخالها في classes غير مرتبطة بوراثة واحدة. لا يمكن إنشاء instance من Trait. الـTrait reuse أفقي أو composition وقت تعريف class، وليست type contract. إذا احتاج المستدعي معرفة capability فاستخدم interface أيضًا. عمليًا، لا يكفي تنفيذ المسار الناجح؛ يجب توثيق الافتراضات والتحقق من القيم والحالات التي قد تكسر هذا السلوك.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">02</span><p>قارن بين «لماذا Trait؟» و«الأولوية». لماذا لا يغني أحدهما عن الآخر داخل موضوع «Traits وإعادة الاستخدام الأفقي»؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> في «لماذا Trait؟»: PHP لا تدعم multiple class inheritance. Trait تجمع methods/properties/constants لإدخالها في classes غير مرتبطة بوراثة واحدة. لا يمكن إنشاء instance من Trait. الـTrait reuse أفقي أو composition وقت تعريف class، وليست type contract. إذا احتاج المستدعي معرفة capability فاستخدم interface أيضًا. أما «الأولوية»: بالنسبة للـmethods: method داخل class الحالية تتغلب على Trait. method من Trait تتغلب على method موروثة. تعارض method بين Traitين يحتاج حلًا صريحًا. insteadof يختار التنفيذ الفائز. as يضيف alias أو يغيّر visibility، ولا يحل التعارض وحده. إذا لم تحل تعارض الاسم يحدث fatal error. العلاقة بينهما أن الأول يحدد جانبًا من الحل، والثاني يكمل السلوك أو القيود اللازمة لتطبيقه بصورة صحيحة.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">03</span><p>افترض أن نظامًا تجاهل «Trait تفرض متطلبات». ما العطل أو الخطر المتوقع، وكيف تصمم اختبارًا يكشفه؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> class المستخدمة يجب أن تنفذ التوقيع المتوافق. لاكتشاف الخلل، اختبر مسارًا صحيحًا، وقيمة عند الحد، ومدخلًا غير صالح، ثم راقب النتيجة والآثار الجانبية والسجل بدل الاكتفاء بعدم ظهور Exception.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">04</span><p>حوّل «حدود ومخاطر» إلى قرار هندسي قابل للمراجعة. ما الذي ستوثقه وما الحالات التي ستختبرها؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> Trait كبيرة قد تخفي dependencies وحالة داخلية. تعارض properties/constants يجب أن يكون متوافقًا أو يفشل. الوصول إلى static members مباشرة على اسم Trait deprecated؛ استخدم class التي تستعملها. من PHP 8.3 يمكن جعل method المستوردة final عبر as final. PHP 8.5 غيّرت ترتيب ربط trait مع parent بالنسبة لتعارض property/constant؛ اختبر السلوك عند الترقية. استخدم Trait لسلوك صغير متماسك. إذا احتاجت خدمات متعددة أو lifecycle… وثّق سبب الاختيار والبدائل والحدود، واختبر الحالة العادية، والحد الأدنى والأقصى، والفشل الجزئي، وإعادة المحاولة أو التكرار إن كان السلوك يسمح بذلك.</div></details>
</section>
</div>
