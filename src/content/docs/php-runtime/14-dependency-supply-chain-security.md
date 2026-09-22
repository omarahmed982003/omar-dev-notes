---
title: 14. أمان الاعتماديات وSupply Chain
description: Composer audit والسياسات وplatform checks وlock files وplugins وscripts والتحقق في CI.
sidebar:
  order: 14
---

## composer.lock عقد البناء

ارفع `composer.lock` للتطبيقات، واستخدم `composer install` في CI والإنتاج. `update` يقرر نسخًا جديدة ويجب أن يحدث في تغيير مراجع ومختبر، لا أثناء النشر.

## Audit وسياسة الحزم

```bash
composer validate --strict
composer audit --locked
composer check-platform-reqs
composer outdated --direct
```

`composer audit` يفحص advisories والحزم المهجورة والسياسات المدعومة. لا تتجاهل advisory بلا سبب موثق ومدة ومراجعة للـreachability.

## Plugins وScripts

Composer plugins وscripts تنفذ code بصلاحية المستخدم الذي يشغّل Composer:

```json
{
  "config": {
    "allow-plugins": {
      "trusted/package": true,
      "*": false
    }
  }
}
```

لا تشغّل Composer كـroot على حزم غير موثوقة. `--no-plugins --no-scripts` يقلل التنفيذ لكنه قد يمنع build مطلوبة؛ افهم المشروع.

## Version policy

- ضع SemVer constraints مقصودة.
- اختبر أقل وأعلى نسخة مدعومة عندما تكون مكتبة.
- راجع transitive dependencies لا المباشرة فقط.
- حدّث دوريًا بدل قفزة سنوية ضخمة.
- احذف الحزم غير المستخدمة.

## CI

احمِ tokens، ثبّت permissions للـworkflow، لا تطبع environment، وثبّت actions/images حيث يمكن. أنشئ SBOM إذا تتطلب البيئة، واحتفظ بسجل artifact ومن بناها.

## استجابة لثغرة

حدد هل الكود المتأثر reachable، طبّق update أو mitigation، شغّل suite، انشر، وراقب. إذا تسرب secret عبر package/script فدوّره؛ إزالة الحزمة لا تبطل السر.

## مراجع

- [Composer CLI: audit](https://getcomposer.org/doc/03-cli.md#audit)
- [Composer plugins and scripts safety](https://getcomposer.org/doc/faqs/how-to-install-untrusted-packages-safely.md)

## خريطة الدرس

<div class="lesson-diagram" role="img" aria-label="خريطة مفاهيم: أمان الاعتماديات وSupply Chain">
<p class="lesson-diagram-title">خريطة مفاهيم: أمان الاعتماديات وSupply Chain</p>
<div class="diagram-flow">
<div class="diagram-node input"><span>composer.lock عقد البناء</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>Audit وسياسة الحزم</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>Plugins وScripts</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node decision"><span>Version policy</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node output"><span>CI</span></div>
</div>
</div>

## تأكد من فهمك

<div class="lesson-quiz" role="list">
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">01</span><p>اشرح «composer.lock عقد البناء» كأنك تراجع تطبيقًا حقيقيًا: ما الهدف وما أهم قيد يجب الانتباه له؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> ارفع composer.lock للتطبيقات، واستخدم composer install في CI والإنتاج. update يقرر نسخًا جديدة ويجب أن يحدث في تغيير مراجع ومختبر، لا أثناء النشر. عمليًا، لا يكفي تنفيذ المسار الناجح؛ يجب توثيق الافتراضات والتحقق من القيم والحالات التي قد تكسر هذا السلوك.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">02</span><p>قارن بين «composer.lock عقد البناء» و«Audit وسياسة الحزم». لماذا لا يغني أحدهما عن الآخر داخل موضوع «أمان الاعتماديات وSupply Chain»؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> في «composer.lock عقد البناء»: ارفع composer.lock للتطبيقات، واستخدم composer install في CI والإنتاج. update يقرر نسخًا جديدة ويجب أن يحدث في تغيير مراجع ومختبر، لا أثناء النشر. أما «Audit وسياسة الحزم»: composer audit يفحص advisories والحزم المهجورة والسياسات المدعومة. لا تتجاهل advisory بلا سبب موثق ومدة ومراجعة للـreachability. العلاقة بينهما أن الأول يحدد جانبًا من الحل، والثاني يكمل السلوك أو القيود اللازمة لتطبيقه بصورة صحيحة.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">03</span><p>افترض أن نظامًا تجاهل «Plugins وScripts». ما العطل أو الخطر المتوقع، وكيف تصمم اختبارًا يكشفه؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> Composer plugins وscripts تنفذ code بصلاحية المستخدم الذي يشغّل Composer: لا تشغّل Composer كـroot على حزم غير موثوقة. --no-plugins --no-scripts يقلل التنفيذ لكنه قد يمنع build مطلوبة؛ افهم المشروع. لاكتشاف الخلل، اختبر مسارًا صحيحًا، وقيمة عند الحد، ومدخلًا غير صالح، ثم راقب النتيجة والآثار الجانبية والسجل بدل الاكتفاء بعدم ظهور Exception.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">04</span><p>حوّل «Version policy» إلى قرار هندسي قابل للمراجعة. ما الذي ستوثقه وما الحالات التي ستختبرها؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> ضع SemVer constraints مقصودة. اختبر أقل وأعلى نسخة مدعومة عندما تكون مكتبة. راجع transitive dependencies لا المباشرة فقط. حدّث دوريًا بدل قفزة سنوية ضخمة. احذف الحزم غير المستخدمة. وثّق سبب الاختيار والبدائل والحدود، واختبر الحالة العادية، والحد الأدنى والأقصى، والفشل الجزئي، وإعادة المحاولة أو التكرار إن كان السلوك يسمح بذلك.</div></details>
</section>
</div>
