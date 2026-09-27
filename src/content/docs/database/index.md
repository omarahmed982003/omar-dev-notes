---
title: قواعد البيانات وPDO
description: اتصال آمن، Prepared Statements، ORM، Transactions، ACID، العزل، الأقفال والفهارس.
sidebar:
  order: 0
---

# قواعد البيانات وPDO

المسار ده يبدأ من أول اتصال بقاعدة البيانات، وبعدها يشرح القراءة والكتابة الآمنة وتنظيم المعاملات والفهارس والترحيلات خطوة بخطوة.

0. [أساسيات SQL والجداول والربط](/database/00-sql-foundations/).

1. [PDO والاتصال الآمن](/database/01-pdo-prepared-statements/) — DSN والإعدادات والاستعلامات المحضّرة.
2. [ORM وأنماط الوصول للبيانات](/database/02-orm-patterns/) — Active Record وData Mapper وN+1.
3. [Transactions وACID](/database/03-transactions-acid/) — Auto-commit وCommit وRollback.
4. [Isolation والأقفال وDeadlocks](/database/04-isolation-locking/) — مشاكل التزامن وإعادة المحاولة وSavepoints.
5. [تصميم المخطط والفهارس وMigrations](/database/05-schema-indexes-migrations/) — القيود والفهارس وقياس الأداء.

:::tip
ابدأ بـPDO وSQL قبل ORM. الأداة لا تلغي ضرورة فهم الاستعلامات والفهارس والمعاملات.
:::
