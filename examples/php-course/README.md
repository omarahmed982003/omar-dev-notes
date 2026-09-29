# PHP course examples / أمثلة منهج PHP

Read PHP lessons 5–17 in either language. Both editions use identical code.

- programs/05 through programs/16: complete console programs. Run each from its own lesson folder, for example: php programs/05/grade.php. programs/07/main.php loads its sibling config.php.
- programs.json lists minimum PHP versions. pipe.php and features85.php need PHP 8.5; contact.php needs 8.4; dnf.php needs 8.2. Use a currently supported PHP installation. Unicode examples need mbstring and intl.
- session-demo: run php -S 127.0.0.1:8081 -t public from this folder. Visit /preferences.php and /upload.php. Uploads are created privately outside public.
- http-demo: run php -S 127.0.0.1:8082 -t public public/index.php. GET /health, POST /notes with JSON.
- composer-demo: PHP 8.3+ and Composer 2. Run composer install, composer demo, composer check, composer audit. Dependencies are locked; vendor is intentionally not bundled.
- notebook: run php tests.php, then php -S 127.0.0.1:8083 -t public public/index.php. See its README for configuration and scope.
- programs/11/boundary.php is an HTTP failure demonstration, not a successful CLI command.

هذه ملفات كاملة للتجربة المحلية. ابدأ بالدروس بالترتيب، وافتح README لكل مشروع. برامج PHP 8.5 منفصلة لأن شرط الإصدار داخل نفس الملف لا يحمي Syntax أحدث. الجلسات هنا تربط طلبات متصفح واحد، ولا تمثل نظام حسابات إنتاجيًا.

The documentation is the source of truth for exported programs. Repository maintainers regenerate them with:
node scripts/export-php-course.mjs
node scripts/package-php-course.mjs

This package contains no user data, vendor directory, secrets, or generated cache.
