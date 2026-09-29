---
title: 14. أمان الاعتماديات وSupply Chain
description: Composer audit والسياسات وplatform checks وlock files وplugins وscripts والتحقق في CI.
sidebar:
  order: 14
---

## قبل ما تبدأ

ذاكر الدرس على 3 خطوات: افهم المشكلة الأول، تابع المثال، وبعدها جرّب الجزء العملي بنفسك. المصطلحات الجديدة الموجودة تحت متشرحة قبل ما ندخل في التفاصيل.

### كلمات جديدة في الدرس

- **Token:** قيمة تمثل هوية أو صلاحية محددة بدل إرسال كلمة السر كل مرة.
- **CLI:** واجهة تتعامل معها بكتابة أوامر نصية بدل الضغط على أزرار.


## composer.lock عقد البناء

ارفع `composer.lock` للتطبيقات، واستخدم `composer install` في CI والإنتاج. `update` يقرر نسخًا جديدة ويجب أن يحدث في تغيير مراجع ومختبر، لا أثناء النشر.

## Audit وسياسة الحزم

```bash
composer validate --strict
composer audit --locked
composer check-platform-reqs --lock --no-dev
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

## SBOM وProvenance والتوقيع

أنشئ SBOM من artifact النهائية، لا من `composer.json` وحده، لأن الصورة تضم نظام تشغيل وextensions وملفات أخرى. اربط provenance بالـcommit والـbuilder والـworkflow والـdigest. التوقيع يثبت مصدر artifact وسلامتها ولا يثبت خلوها من الثغرات.

سياسة القبول يجب أن تجيب: من يوافق على exception؟ ما مدته؟ هل الحزمة المتأثرة reachable؟ وأي بيئة تحتوي digest المصابة؟ اختبر البحث من CVE إلى lock ثم image ثم deployment.

## CI والـSecrets

قلّل permissions الافتراضية للـworkflow، ثبّت third-party actions إلى commit موثوق، وامنع pull requests غير الموثوقة من الوصول إلى secrets. نفّذ secret scanning على التاريخ، ودوّر السر إذا ظهر؛ حذفه من آخر commit لا يلغيه.

~~~text
source commit -> locked dependencies -> SBOM -> signed image digest -> deployment record
~~~


## استجابة لثغرة

حدد هل الكود المتأثر reachable، طبّق update أو mitigation، شغّل suite، انشر، وراقب. إذا تسرب secret عبر package/script فدوّره؛ إزالة الحزمة لا تبطل السر.

## مراجع

- [Composer CLI: audit](https://getcomposer.org/doc/03-cli.md#audit)
- [Composer plugins and scripts safety](https://getcomposer.org/doc/faqs/how-to-install-untrusted-packages-safely.md)

## مسألة تشغيلية

<details><summary>ماذا تفعل عند advisory في dependency؟</summary><p>حدد هل النسخة والمسار المتأثران مستخدمان، حدّث واختبر، وطبّق mitigation مؤقتًا بدل تجاهل أو ترقية عمياء.</p></details>

## شغّل وتحقق

استخدم [المختبر القابل للتنزيل](/php/00-lab-setup/) للسكربتات المرفقة. أوامر Composer وFPM وDocker والخادم الحقيقي تُنفذ داخل المشروع المُجهز للخدمة، مش مجلد فاضي.

نفّذ نقطة التحقق التالية داخل `examples/php-labs` أو النسخة المستخرجة من الحزمة:

~~~bash
composer audit --locked
composer check-platform-reqs --lock --no-dev
~~~

**معيار النجاح:** لا توجد ثغرة معروفة غير مقبولة في الـlock الحالي؛ أي استثناء موثق بمالك وسبب وموعد انتهاء.

دوّن كود الخروج والدليل الفعلي. إذا اختلف الناتج، فسر البيئة أو الفرضية التي اختلفت بدل تعديل «المتوقع» حتى يطابق الخطأ.

## اربط النقاط ببعض

أضف SBOM وprovenance وتوقيع artifact، وافحص typosquatting وmaintainer change لا CVE فقط. Secret scanning يمنع token في source/history. استخدم VEX أو توثيقًا مماثلًا لبيان قابلية الاستغلال، وكل استثناء له مالك وسبب وموعد انتهاء.

#### دورة التجربة

قبل التنفيذ اكتب توقعك، ثم شغّل المثال وسجّل الخروج. أحدث فشلًا واحدًا مقصودًا، اجمع الدليل من logs أو metrics، أصلح السبب، وأعد التشغيل لإثبات أن الإصلاح يعالج العطل ولا يخفيه.


### جرّب بنفسك

تتبع package من commit إلى artifact وdeployment واثبت مصدرها.
