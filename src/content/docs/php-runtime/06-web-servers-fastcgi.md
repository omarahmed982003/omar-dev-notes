---
title: 6. Apache وNginx وFastCGI
description: مسؤولية خادم الويب وApache MPM وNginx event loop وربط PHP-FPM عبر Unix أو TCP socket.
sidebar:
  order: 6
---

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
