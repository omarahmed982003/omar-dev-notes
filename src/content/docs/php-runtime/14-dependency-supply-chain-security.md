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

