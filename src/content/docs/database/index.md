---
title: قواعد البيانات وPDO
description: اتصال آمن، Prepared Statements، ORM، Transactions، ACID، العزل، الأقفال والفهارس.
sidebar:
  order: 0
---

# قواعد البيانات وPDO

يحوّل هذا القسم الصفحات **67–70** إلى مسار كامل يبدأ من اتصال PDO وينتهي بتصميم معاملات آمنة وقابلة للتوسع.

1. [PDO والاتصال الآمن](./01-pdo-prepared-statements/) — DSN والإعدادات والاستعلامات المحضّرة.
2. [ORM وأنماط الوصول للبيانات](./02-orm-patterns/) — Active Record وData Mapper وN+1.
3. [Transactions وACID](./03-transactions-acid/) — Auto-commit وCommit وRollback.
4. [Isolation والأقفال وDeadlocks](./04-isolation-locking/) — مشاكل التزامن وإعادة المحاولة وSavepoints.
5. [تصميم المخطط والفهارس وMigrations](./05-schema-indexes-migrations/) — القيود والفهارس وقياس الأداء.

:::tip
ابدأ بـPDO وSQL قبل ORM. الأداة لا تلغي ضرورة فهم الاستعلامات والفهارس والمعاملات.
:::
