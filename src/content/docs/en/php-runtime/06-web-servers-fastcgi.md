---
title: 6. Apache, Nginx, and FastCGI
description: Web-server responsibilities, Apache MPMs, Nginx's event model, and PHP-FPM over Unix or TCP sockets.
sidebar:
  order: 6
---

## Before you start

Read this lesson in three passes: understand the problem, follow the example, then try the final check yourself. The terms below are explained before they are used in detail.

### New terms in this lesson

- **HTTP:** The rules used to exchange requests and responses on the web.
- **IP:** A numeric address that identifies a device or network interface.
- **TCP:** A transport method that checks that data arrives completely and in order.
- **TLS:** An encryption layer that protects data while it moves between two parties.
- **Proxy:** An intermediary that receives a request and forwards it according to rules.
- **Worker:** A background process that takes jobs from a queue and runs them.


- **PHP-FPM:** A process manager that runs PHP workers for a web server.
- **FastCGI:** A protocol used to send execution work to PHP-FPM.
- **Nginx:** A web server that serves files or forwards PHP requests.
- **Observability:** Understanding system state from logs, metrics, and traces.

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

Where possible, forwarding only the front controller `/index.php` reduces the execution surface:

```nginx
location = /index.php {
    include fastcgi_params;
    fastcgi_param SCRIPT_FILENAME $document_root/index.php;
    fastcgi_pass unix:/run/php/app.sock;
}
```

Keep `.env`, `vendor/`, and executable uploads outside the public document root.

## Unix versus TCP

```nginx
fastcgi_pass unix:/run/php/app.sock;
# or
fastcgi_pass 127.0.0.1:9000;
```

Unix sockets suit services on one host and need correct filesystem ownership. TCP is common across containers or hosts and must remain on a private, firewalled network. Correctness and observability matter more than simplistic performance claims.

`SCRIPT_FILENAME` identifies the script to PHP. A wrong value can yield “Primary script unknown” or expose unintended paths.

Trust forwarded IP/protocol headers only from explicitly trusted proxies. Align web-server upstream timeouts with FPM request limits and the endpoint's service objective.

## Operational problem

<details><summary>What does a 502 between Nginx and PHP-FPM mean?</summary><p>Nginx received no valid FastCGI response; inspect the socket, service, timeout, and logs before page logic.</p></details>

## Run and verify

Use the [downloadable lab](/en/php/00-lab-setup/) for supplied scripts. Commands for Composer, FPM, Docker, or a real server run inside the corresponding configured project, not an empty folder.

Start `examples/php-labs/production` as described in its README, then run:

~~~bash
curl -sS -D - http://127.0.0.1:8080/health -o /dev/null
curl -fsS http://127.0.0.1:8080/
~~~

**Success criterion:** The first request shows status and headers from PHP, while the second returns a static file from Nginx. A request for `/health.php` or a missing path returns 404 and exposes no internal filesystem path. In Windows PowerShell, replace `/dev/null` with `NUL`.

Record the exit code and observed evidence. If reality differs, explain the environmental or design assumption that failed instead of editing the expectation to match a defect.

## Connect the ideas

Define ownership of TLS, HTTP/2, compression, and static files. Tune request/response buffering, timeouts, and body limits by endpoint. Bind SCRIPT_FILENAME to trusted paths, prevent path-info confusion, and add security headers in one clear layer without conflicting duplication.

#### Practice cycle

Write your prediction before running the example and record the output. Introduce one controlled failure, collect evidence from logs or metrics, repair the cause, and rerun the check to prove the fix handles the fault instead of hiding it.


### Try it yourself

Test static, PHP, a large upload, and a missing path and identify the responding layer.
