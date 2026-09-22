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

## خريطة الدرس

<div class="lesson-diagram" role="img" aria-label="خريطة مفاهيم: Apache وNginx وFastCGI">
<p class="lesson-diagram-title">خريطة مفاهيم: Apache وNginx وFastCGI</p>
<div class="diagram-flow">
<div class="diagram-node input"><span>تصحيح مقارنة Apache وNginx</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>Apache</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>Nginx مع PHP-FPM</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node decision"><span>Unix socket أم TCP؟</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node output"><span>معاملات FastCGI</span></div>
</div>
</div>

## تأكد من فهمك

<div class="lesson-quiz" role="list">
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">01</span><p>اشرح «تصحيح مقارنة Apache وNginx» كأنك تراجع تطبيقًا حقيقيًا: ما الهدف وما أهم قيد يجب الانتباه له؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> قول “Apache process لكل connection” غير دقيق كقاعدة عامة. Apache يستخدم MPM واحدًا: prefork: عمليات بلا threads؛ مناسب لبعض التوافقات القديمة. worker: processes تحتوي threads. event: threaded ويعالج keep-alive بكفاءة أكبر. Nginx يعتمد workers تقود event loop غير متزامنة، فيخدم اتصالات كثيرة بعدد محدود من العمليات. لكن هذا لا يعني أن PHP نفسها تصبح async؛ كل طلب PHP يشغل FPM worker حتى ينتهي. عمليًا، لا يكفي تنفيذ المسار الناجح؛ يجب توثيق الافتراضات والتحقق من القيم والحالات التي قد تكسر هذا السلوك.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">02</span><p>قارن بين «تصحيح مقارنة Apache وNginx» و«Apache». لماذا لا يغني أحدهما عن الآخر داخل موضوع «Apache وNginx وFastCGI»؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> في «تصحيح مقارنة Apache وNginx»: قول “Apache process لكل connection” غير دقيق كقاعدة عامة. Apache يستخدم MPM واحدًا: prefork: عمليات بلا threads؛ مناسب لبعض التوافقات القديمة. worker: processes تحتوي threads. event: threaded ويعالج keep-alive بكفاءة أكبر. Nginx يعتمد workers تقود event loop غير متزامنة، فيخدم اتصالات كثيرة بعدد محدود من العمليات. لكن هذا لا يعني أن PHP نفسها تصبح async؛ كل طلب PHP يشغل FPM worker حتى ينتهي. أما «Apache»: يمكن تشغيل PHP تاريخيًا داخل Apache module، لكن فصل Apache عن PHP-FPM عبر FastCGI يعطي عزلًا وإدارة عمليات أوضح. .htaccess يسمح بإعدادات موزعة إذا كان AllowOverride مفعّلًا، لكنه يسبب filesystem checks ويجعل السياسة موزعة. في خادم تتحكم به، ضع القواعد في VirtualHost واضبط AllowOverride None. في shared hosting قد يكون .htaccess هو الخيار المتاح. العلاقة بينهما أن الأول يحدد جانبًا من الحل، والثاني يكمل السلوك أو القيود اللازمة لتطبيقه بصورة صحيحة.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">03</span><p>افترض أن نظامًا تجاهل «Nginx مع PHP-FPM». ما العطل أو الخطر المتوقع، وكيف تصمم اختبارًا يكشفه؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> النمط الآمن لتطبيق Front Controller هو تمرير /index.php فقط عندما لا تحتاج تنفيذ ملفات PHP أخرى. يقلل هذا مساحة الخطأ: لا تضع .env أو vendor/ أو uploads القابلة للتنفيذ داخل public root. لاكتشاف الخلل، اختبر مسارًا صحيحًا، وقيمة عند الحد، ومدخلًا غير صالح، ثم راقب النتيجة والآثار الجانبية والسجل بدل الاكتفاء بعدم ظهور Exception.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">04</span><p>حوّل «Unix socket أم TCP؟» إلى قرار هندسي قابل للمراجعة. ما الذي ستوثقه وما الحالات التي ستختبرها؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> Unix socket مناسب عندما يكون Nginx وFPM على الجهاز نفسه؛ راجع owner/group/mode. TCP مطلوب عادة عبر containers/hosts منفصلة؛ اربطه بشبكة خاصة وجدار ناري. الفرق الأدائي غالبًا أقل أهمية من صحة الإعداد والمراقبة، فلا تختَر بالشعارات. وثّق سبب الاختيار والبدائل والحدود، واختبر الحالة العادية، والحد الأدنى والأقصى، والفشل الجزئي، وإعادة المحاولة أو التكرار إن كان السلوك يسمح بذلك.</div></details>
</section>
</div>
