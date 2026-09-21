---
title: 6. Apache, Nginx, and FastCGI
description: Web-server responsibilities, Apache MPMs, Nginx's event model, and PHP-FPM over Unix or TCP sockets.
sidebar:
  order: 6
---

# Where the web server ends and PHP begins

The web server terminates HTTP/TLS, serves static files, applies request limits and routing, and forwards PHP execution. PHP-FPM executes PHP.

## Correcting the Apache/Nginx comparison

Apache is not universally “one process per connection.” Its active MPM determines the model:

- `prefork`: multiple non-threaded processes.
- `worker`: processes containing threads.
- `event`: threaded, with improved keep-alive handling.

Nginx workers drive event loops and can manage many connections with few processes. That does not make application execution asynchronous: an active PHP request still occupies an FPM worker.

## Apache with FPM

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

`.htaccess` is useful when hosting does not grant main configuration access. On a server you control, central VirtualHost configuration with `AllowOverride None` avoids per-directory checks and scattered policy.

## Nginx with FPM

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

Where possible, forwarding only the front controller `/index.php` reduces the execution surface. Keep `.env`, `vendor/`, and executable uploads outside the public document root.

## Unix versus TCP

```nginx
fastcgi_pass unix:/run/php/app.sock;
# or
fastcgi_pass 127.0.0.1:9000;
```

Unix sockets suit services on one host and need correct filesystem ownership. TCP is common across containers or hosts and must remain on a private, firewalled network. Correctness and observability matter more than simplistic performance claims.

`SCRIPT_FILENAME` identifies the script to PHP. A wrong value can yield “Primary script unknown” or expose unintended paths.

Trust forwarded IP/protocol headers only from explicitly trusted proxies. Align web-server upstream timeouts with FPM request limits and the endpoint's service objective.
