---
title: "الحروف والرموز داخل عنوان الويب"
description: "الحروف والرموز داخل عنوان الويب"
sidebar:
  order: 13
prev: {"link":"/programming-basics/04-url-ports-http/","label":"عنوان الويب والمنافذ وبروتوكول HTTP"}
next: {"link":"/programming-basics/05-http-messages-state/","label":"اقرأ طلب HTTP وردّه"}
---

اكتب عنوانًا فيه اسم عربي أو مسافة: إزاي يبقى له شكل يصلح للنقل؟ ابدأ بعد معرفة أجزاء عنوان الويب.

## الرموز داخل العنوان

**Percent-encoding — الترميز بعلامة %** يكتب بايتًا برقمين سداسيين بعد %؛ مثل `%20` لمسافة. الرقم السداسي طريقة مختصرة لكتابة البتات كما شرحنا في [تمثيل البيانات](/programming-basics/computer-fundamentals/02-binary-data-representation/). فك الترميز مرتين بالخطأ قد يغيّر المعنى؛ مثل تحويل `%252F` أولًا إلى `%2F` ثم إلى شرطة مائلة.

**URI، Uniform Resource Identifier** اسم عام لمعرّف مورد، وURL نوع يصف الوصول إليه. **IRI، Internationalized Resource Identifier** يسمح بمحارف دولية في كتابة المعرّف. **IDNA، Internationalized Domain Names in Applications** قواعد التعامل مع أسماء نطاقات دولية وتحويلها لصيغة مناسبة لنظام الأسماء. ده مختلف عن ترميز المسار والبحث بعلامة %.

**تدريب محلول:** في `http://[::1]:8080/search?q=hello%20world&tag=a&tag=b#results`، المضيف عنوان جهازك المحلي IPv6 (Internet Protocol version 6؛ إصدار عناوين الشبكة ذي128 بتًا) بين أقواس، والمنفذ 8080. الهدف المرسل في HTTP/1.1 هو `/search?q=hello%20world&tag=a&tag=b`، والجزء بعد # لا يدخل فيه. المفتاح tag مكرر؛ تفسيره كقائمة أو اختيار قيمة واحدة يعتمد على مكتبة التطبيق، فلا نفترض سلوكًا واحدًا.
