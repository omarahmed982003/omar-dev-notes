<!doctype html>
<html lang="en">
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>My learning notebook</title>
<h1>My learning notebook</h1>
<p>This browser session owns this notebook. This demo has no login.</p>
<p role="status"><?= escapeHtml($flash) ?></p>
<?php foreach ($errors as $field => $message): ?>
  <p role="alert"><?= escapeHtml($field . ': ' . $message) ?></p>
<?php endforeach; ?>
<form method="post" action="/notes">
  <input type="hidden" name="csrf" value="<?= escapeHtml($csrf) ?>">
  <p><label>Name <input name="name" required value="<?= escapeHtml($old['name'] ?? '') ?>"></label></p>
  <p><label>Note <textarea name="text" required><?= escapeHtml($old['text'] ?? '') ?></textarea></label></p>
  <button>Save note</button>
</form>
<h2>Saved notes</h2>
<?php if ($notes === []): ?><p>No notes yet.</p><?php endif; ?>
<ol>
<?php foreach ($notes as $note): ?>
  <li><strong><?= escapeHtml($note['name']) ?></strong>:
    <span class="note-text"><?= escapeHtml($note['text']) ?></span>
    <time datetime="<?= escapeHtml($note['created_at']) ?>"><?= escapeHtml($note['created_at']) ?></time>
  </li>
<?php endforeach; ?>
</ol>
</html>
