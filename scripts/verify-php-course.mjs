import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import net from 'node:net';
import { spawn, execFileSync } from 'node:child_process';
import { parse } from 'parse5';

const root = process.cwd();
const php = process.env.PHP_BINARY || 'php';
const php85 = process.env.PHP85_BINARY || php;
fs.mkdirSync(path.join(root, 'tmp'), { recursive: true });
const work = fs.mkdtempSync(path.join(root, 'tmp', 'php-course-'));
const report = { lint: 0, outputPrograms: 0, parity: [], httpAssertions: 0 };
const tick = String.fromCharCode(96);
const fence = new RegExp('^(' + tick + '{3}|~{3})([a-z]+)\\r?\\n([\\s\\S]*?)^\\1\\s*$', 'gm');
const blocks = text => [...text.matchAll(fence)].map(m => ({ language: m[2], code: m[3], start: m.index, end: m.index + m[0].length }));
const docs = {};
function run(binary, args, cwd = work) {
    return execFileSync(binary, args, { cwd, encoding: 'utf8', windowsHide: true, timeout: 15000, stdio: 'pipe' }).replaceAll('\r\n', '\n');
}
for (const file of fs.readdirSync('src/content/docs/php').filter(f => /^(0[5-9]|1[0-7])-.*\.md$/.test(f))) {
    const ar = fs.readFileSync('src/content/docs/php/' + file, 'utf8').replaceAll('\r\n', '\n');
    const en = fs.readFileSync('src/content/docs/en/php/' + file, 'utf8').replaceAll('\r\n', '\n');
    const ab = blocks(ar), eb = blocks(en);
    assert.deepEqual(ab.map(b => [b.language, b.code]), eb.map(b => [b.language, b.code]), file + ': bilingual code/output parity');
    const questions = text => (text.match(/<details>/g) || []).length;
    assert.equal(questions(ar), questions(en), file + ': exercise count');
    assert.ok(questions(ar) >= 3, file + ': exercises');
    report.parity.push({ lesson: file, codeBlocks: ab.length, exercises: questions(ar), arCharacters: ar.length, enCharacters: en.length });
    docs[file.slice(0, 2)] = ab;
    for (const [locale, source, list] of [['ar', ar, ab], ['en', en, eb]]) {
        for (const [i, block] of list.entries()) {
            if (block.language !== 'php') continue;
            const directory = path.join(work, locale + '-' + file.slice(0, 2) + '-' + i);
            fs.mkdirSync(directory);
            const target = path.join(directory, 'main.php');
            const code = /^(<\?php|<!doctype)/i.test(block.code.trimStart()) ? block.code : '<?php\n' + block.code;
            fs.writeFileSync(target, code);
            const binary = /\|>|clone\(\$draft/.test(code) ? php85 : php;
            run(binary, ['-l', target]);
            report.lint++;
            const next = list[i + 1];
            if (locale === 'ar' && next?.language === 'text' && source.slice(block.end, next.start).trim() === '') {
                if (file.startsWith('07-') && code.includes("'/config.php'")) {
                    const config = list.find(b => b.language === 'php' && b.code.includes('// config.php'));
                    fs.writeFileSync(path.join(directory, 'config.php'), config.code);
                }
                const actual = run(binary, [target], directory).trimEnd();
                assert.equal(actual, next.code.trimEnd(), file + ' program ' + i + ' expected output');
                report.outputPrograms++;
            }
        }
    }
}
function newJar() { return new Map(); }
async function request(base, url, options = {}, jar = newJar()) {
    const headers = new Headers(options.headers);
    if (jar.size) headers.set('Cookie', [...jar].map(([k, v]) => k + '=' + v).join('; '));
    const response = await fetch(base + url, { ...options, headers, redirect: 'manual', signal: AbortSignal.timeout(5000) });
    for (const cookie of response.headers.getSetCookie()) {
        const pair = cookie.split(';')[0], i = pair.indexOf('=');
        jar.set(pair.slice(0, i), pair.slice(i + 1));
    }
    const body = await response.text();
    return { status: response.status, headers: response.headers, body };
}
function equal(actual, expected, label) { assert.equal(actual, expected, label); report.httpAssertions++; }
function ok(value, label) { assert.ok(value, label); report.httpAssertions++; }
function csrf(body) {
    const match = body.match(/name="csrf" value="([a-f0-9]{64})"/);
    assert.ok(match, 'CSRF field present');
    return match[1];
}
async function serve(directory, router, env, test) {
    const probe = net.createServer();
    await new Promise(resolve => probe.listen(0, '127.0.0.1', resolve));
    const port = probe.address().port;
    await new Promise(resolve => probe.close(resolve));
    const log = fs.openSync(path.join(work, 'server-' + port + '.log'), 'w');
    const args = ['-S', '127.0.0.1:' + port, '-t', path.join(directory, 'public')];
    if (router) args.push(path.join(directory, 'public/index.php'));
    const child = spawn(php, args, { cwd: directory, windowsHide: true, env: { ...process.env, ...env }, stdio: ['ignore', log, log] });
    const base = 'http://127.0.0.1:' + port;
    try {
        let ready = false;
        for (let i = 0; i < 40; i++) {
            if (child.exitCode !== null) throw new Error('PHP server failed');
            try { await fetch(base, { signal: AbortSignal.timeout(250) }); ready = true; break; }
            catch { await new Promise(resolve => setTimeout(resolve, 100)); }
        }
        assert.ok(ready, 'PHP server ready');
        await test(base);
    } finally {
        child.kill();
        await new Promise(resolve => child.once('exit', resolve));
        fs.closeSync(log);
    }
}
await serve(path.join(root, 'examples/php-course/http-demo'), true, {}, async base => {
    for (const [url, method, body, type, expected] of [
        ['/health', 'GET', undefined, undefined, 200],
        ['/health?test=1', 'GET', undefined, undefined, 200],
        ['/missing', 'GET', undefined, undefined, 404],
        ['/notes', 'GET', undefined, undefined, 405],
        ['/notes', 'POST', '{}', 'text/plain', 415],
        ['/notes', 'POST', '{', 'application/json', 400],
        ['/notes', 'POST', '[]', 'application/json', 422],
        ['/notes', 'POST', 'null', 'application/json', 422],
        ['/notes', 'POST', '{"text":[]}', 'application/json', 422],
        ['/notes', 'POST', '{"text":" "}', 'application/json', 422],
        ['/notes', 'POST', JSON.stringify({ text: 'x'.repeat(201) }), 'application/json', 422],
        ['/notes', 'POST', JSON.stringify({ text: 'x'.repeat(5000) }), 'application/json', 413],
        ['/notes', 'POST', JSON.stringify({ text: ' تعلم PHP 👋 ' }), 'application/json; charset=UTF-8', 200],
    ]) {
        const result = await request(base, url, { method, body, headers: type ? { 'Content-Type': type } : {} });
        equal(result.status, expected, method + ' ' + url);
        ok(result.headers.get('content-type')?.startsWith('application/json'), 'JSON type');
        ok(/^[a-f0-9]{16}$/.test(result.headers.get('x-request-id')), 'Request ID');
        JSON.parse(result.body);
        if (expected === 405) equal(result.headers.get('allow'), 'POST', 'Allow header');
        if (body?.includes('تعلم')) equal(JSON.parse(result.body).text, 'تعلم PHP 👋', 'Unicode echo');
    }
});
const sessionLab = path.join(work, 'session-lab');
fs.mkdirSync(path.join(sessionLab, 'public'), { recursive: true });
const sessionBlocks = docs['09'].filter(b => b.language === 'php');
fs.writeFileSync(path.join(sessionLab, 'public/preferences.php'), sessionBlocks[0].code);
fs.writeFileSync(path.join(sessionLab, 'public/upload.php'), sessionBlocks.find(b => b.code.includes("$_FILES['avatar']")).code);
await serve(sessionLab, false, {}, async base => {
    const jar = newJar();
    let result = await request(base, '/preferences.php', {}, jar);
    equal(result.status, 200, 'preferences GET');
    ok(result.body.includes('Hello Guest'), 'initial guest');
    const token = csrf(result.body);
    result = await request(base, '/preferences.php', { method: 'POST', body: new URLSearchParams({ csrf: token, name: 'Omar' }) }, jar);
    equal(result.status, 303, 'preferences save');
    result = await request(base, '/preferences.php', {}, jar);
    ok(result.body.includes('Hello Omar'), 'session persisted');
    result = await request(base, '/preferences.php', { method: 'POST', body: new URLSearchParams({ csrf: token, 'name[]': 'Omar' }) }, jar);
    equal(result.status, 422, 'preferences array rejection');
    result = await request(base, '/preferences.php', { method: 'POST', body: new URLSearchParams({ csrf: 'bad', name: 'Omar' }) }, jar);
    equal(result.status, 403, 'preferences CSRF');
    result = await request(base, '/upload.php', {}, jar);
    const uploadToken = csrf(result.body);
    const png = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aXioAAAAASUVORK5CYII=', 'base64');
    for (const [bytes, name, mime, status] of [[png, 'avatar.php.png', 'image/png', 200], [Buffer.from('not a photo'), 'fake.jpg', 'image/jpeg', 422], [Buffer.alloc(2 * 1024 * 1024 + 1), 'big.png', 'image/png', 422]]) {
        const form = new FormData();
        form.set('csrf', uploadToken);
        form.set('avatar', new Blob([bytes], { type: mime }), name);
        result = await request(base, '/upload.php', { method: 'POST', body: form }, jar);
        equal(result.status, status, 'upload ' + name);
    }
    const stored = fs.readdirSync(path.join(sessionLab, 'storage/uploads'));
    equal(stored.length, 1, 'one accepted upload');
    ok(/^[a-f0-9]{32}\.png$/.test(stored[0]), 'generated filename');
    equal((await request(base, '/storage/uploads/' + stored[0])).status, 404, 'upload private');
});
const notebook = path.join(root, 'examples/php-course/notebook');
const storage = path.join(work, 'notebook-storage');
await serve(notebook, true, { APP_ENV: 'development', NOTEBOOK_STORAGE: storage }, async base => {
    const jar = newJar(), other = newJar();
    let result = await request(base, '/', {}, jar);
    equal(result.status, 200, 'notebook GET');
    const token = csrf(result.body);
    const text = '<img src=x onerror=alert(1)> تعلم PHP 👋';
    result = await request(base, '/notes', { method: 'POST', body: new URLSearchParams({ csrf: token, name: 'عمر', text }) }, jar);
    equal(result.status, 303, 'notebook save');
    equal(result.headers.get('location'), '/', 'PRG location');
    result = await request(base, '/', {}, jar);
    ok(result.body.includes('Note saved'), 'flash first GET');
    ok(result.body.includes('عمر'), 'Arabic name');
    ok(result.body.includes('&lt;img src=x onerror=alert(1)&gt;'), 'stored HTML escaped');
    const tree = parse(result.body);
    const visit = node => {
        equal(node.tagName === 'img', false, 'no injected image');
        for (const child of node.childNodes || []) visit(child);
    };
    visit(tree);
    result = await request(base, '/', {}, jar);
    ok(!result.body.includes('Note saved'), 'flash consumed');
    ok(result.body.includes('تعلم PHP'), 'note persists');
    const otherPage = await request(base, '/', {}, other);
    ok(otherPage.body.includes('No notes yet.'), 'session isolation');
    ok(!otherPage.body.includes('تعلم PHP'), 'other session cannot read');
    const ownerDir = path.join(storage, fs.readdirSync(storage)[0]);
    const initialCount = fs.readdirSync(ownerDir).length;
    for (const fields of [
        { csrf: token, name: '', text: 'x' },
        { csrf: token, 'name[]': 'Omar', text: 'x' },
        { csrf: token, name: 'Omar', text: 'x'.repeat(201) },
        { csrf: token, name: 'n'.repeat(41), text: 'x' },
        { csrf: token, name: 'Omar', 'text[]': 'x' },
    ]) {
        result = await request(base, '/notes', { method: 'POST', body: new URLSearchParams(fields) }, jar);
        equal(result.status, 422, 'invalid form rejected');
    }
    result = await request(base, '/notes', { method: 'POST', body: 'csrf=' + token + '&name=%FF&text=x', headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }, jar);
    equal(result.status, 422, 'invalid UTF-8 rejected');
    result = await request(base, '/notes', { method: 'POST', body: new URLSearchParams({ csrf: csrf(otherPage.body), name: 'Omar', text: 'x' }) }, jar);
    equal(result.status, 403, 'foreign session token rejected');
    equal(fs.readdirSync(ownerDir).length, initialCount, 'invalid input never writes');
    for (const [url, options, expected] of [
        ['/missing', {}, 404],
        ['/notes', {}, 405],
        ['/', { method: 'POST' }, 405],
        ['/notes', { method: 'POST', body: '{}', headers: { 'Content-Type': 'application/json' } }, 415],
        ['/notes', { method: 'POST', body: 'x'.repeat(4097) }, 413],
        ['/config.php', {}, 404],
        ['/storage/private.json', {}, 404],
    ]) equal((await request(base, url, options, jar)).status, expected, url + ' rejected');
    const notePath = path.join(ownerDir, fs.readdirSync(ownerDir)[0]);
    const saved = fs.readFileSync(notePath, 'utf8');
    equal(JSON.parse(saved).text, text, 'stored text remains unescaped');
    ok(JSON.parse(saved).created_at.endsWith('+00:00'), 'UTC stored');
    fs.writeFileSync(notePath, '{');
    result = await request(base, '/', {}, jar);
    equal(result.status, 500, 'corrupt storage fails explicitly');
    ok(/^Internal error\. Reference: [a-f0-9]{16}$/.test(result.body), 'generic failure without trace');
    fs.writeFileSync(notePath, saved);
    result = await request(base, '/notes', { method: 'POST', body: new URLSearchParams({ csrf: token, name: '0', text: '0' }) }, jar);
    equal(result.status, 303, 'string zero is valid');
    for (let i = 0; i < 98; i++) fs.writeFileSync(path.join(ownerDir, 'fixture-' + i + '.json'), saved);
    result = await request(base, '/notes', { method: 'POST', body: new URLSearchParams({ csrf: token, name: 'Omar', text: 'over limit' }) }, jar);
    equal(result.status, 409, '100-note limit');
    equal(fs.readdirSync(ownerDir).length, 100, 'limit never writes');
});
const blockedStorage = path.join(work, 'storage-is-file');

await serve(notebook, true, { APP_ENV: 'development', NOTEBOOK_STORAGE: blockedStorage }, async base => {
    const jar = newJar();
    const page = await request(base, '/', {}, jar);
    fs.writeFileSync(blockedStorage, 'not a directory');
    const result = await request(base, '/notes', { method: 'POST', body: new URLSearchParams({ csrf: csrf(page.body), name: 'Omar', text: 'x' }) }, jar);
    equal(result.status, 500, 'storage write failure');
    ok(!result.body.includes('Warning') && !result.body.includes('mkdir'), 'no implementation leak');
});
const resultFile = path.join(root, 'planning/audit-results/php-course-checks.json');
fs.writeFileSync(resultFile, JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify(report, null, 2));
