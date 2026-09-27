---
title: 10. الاختبارات وجودة الكود
description: PHPUnit وUnit/Integration/Feature tests وData Providers وDoubles وCoverage والتحليل الساكن والتنسيق.
sidebar:
  order: 10
---

## قبل ما تبدأ

ذاكر الدرس على 3 خطوات: افهم المشكلة الأول، تابع المثال، وبعدها جرّب الجزء العملي بنفسك. المصطلحات الجديدة الموجودة تحت متشرحة قبل ما ندخل في التفاصيل.

### كلمات جديدة في الدرس

- **HTTP:** قواعد تبادل الطلبات والردود بين المتصفح والخادم.
- **Function:** دالة: جزء كود له اسم ومهمة محددة ويمكن استدعاؤه أكثر من مرة.


## هرم عملي

- **Unit:** منطق صغير بلا شبكة أو قاعدة بيانات.
- **Integration:** تعاون حقيقي مع database/filesystem/client adapter.
- **Feature/HTTP:** request كاملة عبر التطبيق.
- **End-to-end:** النظام من منظور المستخدم؛ أقل عددًا وأعلى كلفة.

لا تحول كل شيء إلى unit test مع mocks. اختبر العقد عند الحدود والسلوك المهم للمستخدم.

## PHPUnit

```bash
composer require --dev phpunit/phpunit
vendor/bin/phpunit
```

```php
use PHPUnit\Framework\Attributes\DataProvider;
use PHPUnit\Framework\TestCase;

final class DiscountTest extends TestCase
{
    #[DataProvider('cases')]
    public function testDiscount(int $price, int $percent, int $expected): void
    {
        self::assertSame($expected, discount($price, $percent));
    }

    public static function cases(): iterable
    {
        yield 'none' => [1000, 0, 1000];
        yield 'ten percent' => [1000, 10, 900];
    }
}
```

اختبر exception والحدود والـside effects، واجعل اسم الاختبار يشرح السلوك.

## Test Doubles

- **Stub:** يعيد بيانات مجهزة.
- **Fake:** تنفيذ خفيف يعمل، مثل repository في الذاكرة.
- **Mock:** يتحقق من interaction متوقع.

فضّل fake/stub عند الإمكان. كثرة mocks تربط الاختبار بتفاصيل التنفيذ وتكسر refactoring.

## Coverage

Coverage تكشف السطور غير المنفذة لكنها لا تثبت صحة assertions. راقب الفروع والسلوك الحرج، ولا تجعل الوصول إلى 100% هدفًا مستقلًا.

## Static analysis وStyle

```bash
vendor/bin/phpstan analyse
vendor/bin/phpunit
vendor/bin/phpcs
```

PHPStan/Psalm تكشف تناقض الأنواع والمسارات المستحيلة. PHPCS أو PHP-CS-Fixer توحّد التنسيق. شغّل الأدوات محليًا وفي CI بنفس الإعداد.

## Test data

- اجعل الوقت والعشوائية قابلة للتحكم.
- استخدم transaction/reset لعزل database tests.
- لا تعتمد على ترتيب الاختبارات.
- لا تستخدم بيانات production حقيقية.
- اختبر migration وrollback/forward path حيث يلزم.

## مرجع

- [PHPUnit Manual](https://docs.phpunit.de/)

## مسألة تشغيلية

<details><summary>إمتى تختار integration test؟</summary><p>عندما تريد التحقق من تعاون حدود حقيقية مثل database أو HTTP، لا من منطق دالة معزولة فقط.</p></details>

## شغّل وتحقق

استخدم [المختبر القابل للتنزيل](/php/00-lab-setup/) للسكربتات المرفقة. أوامر Composer وFPM وDocker والخادم الحقيقي تُنفذ داخل المشروع المُجهز للخدمة، مش مجلد فاضي.

نفّذ نقطة التحقق التالية داخل بيئة الدرس:

~~~bash
php tests.php
~~~

**معيار النجاح:** تنجح حالات المسار الطبيعي والحدود والفشل؛ أفسد شرطًا عمدًا مرة واحدة وتأكد أن اختبارًا مناسبًا يفشل قبل إعادة الإصلاح.

دوّن كود الخروج والدليل الفعلي. إذا اختلف الناتج، فسر البيئة أو الفرضية التي اختلفت بدل تعديل «المتوقع» حتى يطابق الخطأ.

## اربط النقاط ببعض

افصل unit عن integration وcontract وend-to-end حسب boundary. اجعل الوقت والعشوائية والخدمات الخارجية قابلة للضبط، وشغل الاختبارات بالتوازي دون state مشتركة. Coverage لا يثبت جودة assertions؛ mutation testing يكشف اختبارًا يمر رغم تغيير المنطق، وCI يبدأ من بيئة نظيفة.

### جرّب بنفسك

غيّر operator عمدًا وتأكد أن اختبارًا يفشل، ثم شغل suite بترتيب عشوائي.
