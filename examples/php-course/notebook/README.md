# Learning notebook / دفتر الملاحظات
PHP 8.1+ with mbstring, fileinfo (for the separate upload lab), and writable session storage.
This local teaching app has no login: each browser session has a private notebook.

From this folder:
```sh
php -S 127.0.0.1:8083 -t public public/index.php
```

Open http://127.0.0.1:8083/. Submit a name and note; expect 303, then GET 200 with “Note saved”. The next refresh removes the flash but preserves the note. Another browser session starts empty.

APP_ENV defaults to development (HTTP cookie). Production requires APP_ENV=production, HTTPS, a server body limit, and private writable storage. NOTEBOOK_STORAGE optionally sets a trusted deployment/test path. Storage is outside public. Never run with the project directory as the document root.

Validation: UTF-8 strings, name 1–40 code points, text 1–200, per-field byte limits, form body ≤4096 bytes, maximum 100 notes per session. SameSite and HttpOnly plus a CSRF token protect the teaching form. Files are published via a temporary file and rename on the same filesystem. There is no crash-durability promise, account recovery, quota service, or production authentication.

The default PHP file session handler serializes same-session requests through the save, protecting the count check. Replacing that handler requires equivalent locking. A repeated POST can create another note: PRG prevents ordinary refresh resubmission, not idempotency. Session expiry loses access to that notebook; private storage retention/cleanup needs an explicit policy in a real service.

في الدرس 17 شرح عربي وإنجليزي لكل ملف وترتيب التنفيذ، وتجارب فشل الإدخال وCSRF والملفات.
