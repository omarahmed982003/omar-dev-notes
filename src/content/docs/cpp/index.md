---
title: C++
description: دروس مرتبة تبدأ من التفكير وفهم الكمبيوتر، ثم بناء برنامج C++ وترجمته، ثم البيانات والقرارات والحلقات والمشروعات.
sidebar:
  order: 0
---

# C++ من الأساسيات إلى التحكم والحلقات

يبدأ هذا القسم بطريقة تحليل المشكلة وتمثيل الأعداد داخل الكمبيوتر، ثم يشرح أدوات C++ وبنية البرنامج ومراحل الـCompiler بالتفصيل. بعد ذلك تنتقل الدروس إلى الأنواع والمتغيرات والترميز والمعاملات والإدخال، ثم الشروط و`switch` والحلقات. تتضمن الدروس أمثلة كاملة ومشروعات ومسائل تدريبية وأخطاء شائعة وأسئلة بإجابات مشروحة.

## خريطة الدروس

1. [**حل المشكلات والمخططات والتصحيح**](./foundations/01-problem-solving-review/) — Decision Trees وFlowcharts وPseudocode والاختبارات وتتبع الأخطاء المنطقية.
2. [**أنظمة الأعداد والكمبيوتر والذاكرة**](./foundations/02-number-systems-computer-internals/) — Binary وOctal وHex ومكوّنات الكمبيوتر والـCPU والذاكرة ونظام التشغيل.
3. [**مقدمة C++ والأدوات وأول برنامج**](./foundations/03-setup-syntax-translation-output/) — خصائص اللغة والمعايير وIDE والمحرر وبنية البرنامج و`cout`.
4. [**الـCompiler ومراحل البناء والتشخيص**](./conditions-projects/02-compilation-pipeline-diagnostics/) — Preprocessor وTokens وAST وIR والتحسين وAssembly وObject files والربط والأخطاء.
5. [**الأنواع والمتغيرات والنطاق والذاكرة**](./foundations/04-types-variables-scope-encoding/) — الأنواع الأساسية والأحجام والمدى والتهيئة والثوابت وScope وLifetime.
6. [**ترميز النصوص والمحارف والتحويلات**](./loops-competitive/01-encoding-casts-math/) — ASCII وUnicode وUTF-8 و`char` والتحويلات الضمنية والصريحة.
7. [**المعاملات والتعبيرات والعمليات البتية**](./foundations/05-operators-conversions-limits/) — الأولوية والإسناد والمقارنة والمنطق وShort Circuit والعمليات على البتات.
8. [**الإدخال والتحويلات والحدود والرياضيات**](./foundations/06-input-source-build-errors-math/) — `cin` وفشل الإدخال وCasting و`numeric_limits` و`cmath` والصيغ.
9. [**if وelse والتحقق والتداخل**](./conditions-projects/06-if-else-validation-nesting/) — الفروع الحصرية والمستقلة وترتيب الشروط والنطاقات والشروط المتداخلة.
10. [**switch وتدفق التحكم والحاسبة**](./conditions-projects/07-switch-control-flow/) — `case` و`break` و`default` وFall-through والنطاق المحلي.
11. [**الحلقات وأنماط التكرار**](./loops-competitive/04-loops-counters-accumulators/) — `while` و`for` و`do-while` والعدادات والمجمّعات وSentinel والحلقات المتداخلة.
12. [**المدخلات وقواعد العمل**](./conditions-projects/01-input-business-rules/) — تحويل المتطلبات إلى متغيرات وقواعد Boolean وحالات اختبار.
13. [**البرمجة التنافسية ومنصات التدريب**](./loops-competitive/02-competitive-programming/) — قراءة القيود والتعقيد وخطة التدريب وCodeforces وLeetCode.
14. [**مسائل الشروط والصيغ**](./loops-competitive/03-conditions-codeforces/) — مسائل حسابية ومنطقية وهندسية مع اشتقاق الحل واختبار الحدود.

:::tip[طريقة المذاكرة]
نفّذ كل مثال ثم غيّر المدخلات وتوقع الناتج قبل التشغيل. في درس الـCompiler ارسم مراحل البناء بيدك، وفي دروس التحكم اكتب Test Cases قبل كتابة الشرط أو الحلقة.
:::
