---
title: 6. Apache وNginx وFastCGI
description: مسؤولية خادم الويب وApache MPM وNginx event loop وربط PHP-FPM عبر Unix أو TCP socket.
sidebar:
  order: 6
---

## قبل ما تبدأ

ذاكر الدرس على 3 خطوات: افهم المشكلة الأول، تابع المثال، وبعدها جرّب الجزء العملي بنفسك. المصطلحات الجديدة الموجودة تحت متشرحة قبل ما ندخل في التفاصيل.

### كلمات جديدة في الدرس

- **Runtime:** وقت التشغيل: الفترة اللي البرنامج بيكون شغال فيها فعلًا.
- **HTTP:** قواعد تبادل الطلبات والردود بين المتصفح والخادم.
- **IP:** عنوان رقمي بيميز جهازًا أو واجهة شبكة.
- **TCP:** طريقة نقل بتتأكد إن البيانات وصلت كاملة وبالترتيب.
- **TLS:** طبقة تشفير بتحمي البيانات وهي ماشية بين طرفين.
- **Proxy:** وسيط يستقبل الطلب ويمرره لجهة أخرى حسب قواعد محددة.
- **Worker:** برنامج يعمل في الخلفية ويسحب المهام من الطابور وينفذها.
- **Loop:** حلقة تكرار تعيد تنفيذ مجموعة تعليمات وفق شرط.


- **PHP-FPM:** مدير عمليات يشغّل عمال PHP لصالح خادم الويب.
- **FastCGI:** طريقة اتصال يرسل بها خادم الويب طلب التنفيذ إلى PHP-FPM.
- **Nginx:** خادم ويب يقدم الملفات أو يمرر طلبات PHP.

# أين ينتهي خادم الويب وتبدأ PHP؟

خادم الويب يستقبل HTTP/TLS، يقدّم الملفات الثابتة، يطبق routing وحدود الطلب، ويرسل ملفات PHP إلى runtime. PHP-FPM ينفذ PHP؛ لا تجعل كل طلب، بما فيه الصور وCSS، يمر عبر التطبيق بلا داعٍ.

## تصحيح مقارنة Apache وNginx

قول “Apache process لكل connection” غير دقيق كقاعدة عامة. Apache يستخدم **MPM** واحدًا:

- `prefork`: عمليات بلا threads؛ مناسب لبعض التوافقات القديمة.
- `worker`: processes تحتوي threads.
- `event`: threaded ويعالج keep-alive بكفاءة أكبر.

Nginx يعتمد workers تقود event loop غير متزامنة، فيخدم اتصالات كثيرة بعدد محدود من العمليات. لكن هذا لا يعني أن PHP نفسها تصبح async؛ كل طلب PHP يشغل FPM worker حتى ينتهي.

## Apache

يمكن تشغيل PHP تاريخيًا داخل Apache module، لكن فصل Apache عن PHP-FPM عبر FastCGI يعطي عزلًا وإدارة عمليات أوضح.

```apache
<VirtualHost *:443>
    ServerName example.com
    DocumentRoot /var/www/app/public

    <Directory /var/www/app/public>
        AllowOverride None
        Require all granted
        FallbackResource /index.php
    </Directory>

    <FilesMatch \.php$>
        SetHandler "proxy:unix:/run/php/app.sock|fcgi://localhost/"
    </FilesMatch>
</VirtualHost>
```

`.htaccess` يسمح بإعدادات موزعة إذا كان `AllowOverride` مفعّلًا، لكنه يسبب filesystem checks ويجعل السياسة موزعة. في خادم تتحكم به، ضع القواعد في VirtualHost واضبط `AllowOverride None`. في shared hosting قد يكون `.htaccess` هو الخيار المتاح.

## Nginx مع PHP-FPM

```nginx
server {
    listen 443 ssl;
    server_name example.com;
    root /var/www/app/public;
    index index.php;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location ~ \.php$ {
        try_files $uri =404;
        include fastcgi_params;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
        fastcgi_param HTTP_PROXY "";
        fastcgi_pass unix:/run/php/app.sock;
        fastcgi_read_timeout 30s;
    }

    location ~ /\. {
        deny all;
    }
}
```

النمط الآمن لتطبيق Front Controller هو تمرير `/index.php` فقط عندما لا تحتاج تنفيذ ملفات PHP أخرى. يقلل هذا مساحة الخطأ:

```nginx
location = /index.php {
    include fastcgi_params;
    fastcgi_param SCRIPT_FILENAME $document_root/index.php;
    fastcgi_pass unix:/run/php/app.sock;
}
```

لا تضع `.env` أو `vendor/` أو uploads القابلة للتنفيذ داخل public root.

## Unix socket أم TCP؟

```nginx
fastcgi_pass unix:/run/php/app.sock;
# أو
fastcgi_pass 127.0.0.1:9000;
```

- Unix socket مناسب عندما يكون Nginx وFPM على الجهاز نفسه؛ راجع owner/group/mode.
- TCP مطلوب عادة عبر containers/hosts منفصلة؛ اربطه بشبكة خاصة وجدار ناري.
- الفرق الأدائي غالبًا أقل أهمية من صحة الإعداد والمراقبة، فلا تختَر بالشعارات.

## معاملات FastCGI

`SCRIPT_FILENAME` يخبر PHP بالملف المطلوب. خطأ فيه ينتج “Primary script unknown” أو قد يفتح مسارًا غير مقصود. مرّر كذلك method وquery/content parameters عبر الملف القياسي الملائم لتوزيعتك.

لا تثق في headers يرسلها العميل مثل `X-Forwarded-For` إلا إذا جاءت من reverse proxy موثوق ومحدد. اضبط real-IP/trusted proxies بوضوح حتى لا يزوّر المستخدم IP أو scheme.

## حدود ومسؤوليات

- Web server: TLS، static files، request-size limits، timeouts، buffering.
- PHP-FPM: عدد workers، PHP settings، slowlog، status.
- Application: validation، authorization، business logic، response.
- CDN/load balancer: edge caching، health routing، وقد ينهي TLS.

اجعل timeouts متناسقة: مهلة upstream في خادم الويب يجب ألا تخفي عملية PHP عالقة بلا حد، و`request_terminate_timeout` في FPM يجب أن يعكس SLA وطبيعة endpoint.

## مسألة تشغيلية

<details><summary>ماذا يعني 502 بين Nginx وPHP-FPM؟</summary><p>لم يحصل Nginx على FastCGI response صالح؛ افحص socket والخدمة والمهلة والسجلات قبل كود الصفحة.</p></details>

## شغّل وتحقق

استخدم [المختبر القابل للتنزيل](/php/00-lab-setup/) للسكربتات المرفقة. أوامر Composer وFPM وDocker والخادم الحقيقي تُنفذ داخل المشروع المُجهز للخدمة، مش مجلد فاضي.

نفّذ نقطة التحقق التالية داخل بيئة الدرس:

~~~bash
curl -sS -D - http://localhost/index.php -o NUL
~~~

**معيار النجاح:** ترى status وheaders من التطبيق، بينما يُخدم الملف الساكن بلا تمريره إلى PHP. المسار غير الموجود لا يكشف مسارًا داخليًا.

دوّن كود الخروج والدليل الفعلي. إذا اختلف الناتج، فسر البيئة أو الفرضية التي اختلفت بدل تعديل «المتوقع» حتى يطابق الخطأ.

## اربط النقاط ببعض

حدد من يملك TLS وHTTP/2 والضغط والstatic files. اضبط request buffering وresponse buffering وtimeouts وحدود body حسب endpoint. اربط SCRIPT_FILENAME بمسار موثوق ولا تسمح path info بفتح ملف غير مقصود، وأضف security headers في طبقة واضحة دون تكرار متعارض.

### جرّب بنفسك

اختبر static وPHP وupload كبيرًا ومسارًا غير موجود واقرأ أي طبقة أجابت.
