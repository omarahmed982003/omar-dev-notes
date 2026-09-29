import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { parse } from 'parse5';

const report = { pages: 0, codeBlocks: 0, exercises: 0, links: 0, counts: {} };
const tick = String.fromCharCode(96);
const fence = new RegExp('^(' + tick + '{3}|~{3})([a-z]+)\\r?\\n([\\s\\S]*?)^\\1\\s*$', 'gm');
function collect(node, predicate, result = []) {
    if (predicate(node)) result.push(node);
    for (const child of node.childNodes || []) collect(child, predicate, result);
    return result;
}
function text(node) {
    return node.nodeName === '#text' ? node.value : (node.childNodes || []).map(text).join('');
}
function walk(directory) {
    return fs.readdirSync(directory, { withFileTypes: true }).flatMap(e => e.isDirectory() ? walk(path.join(directory, e.name)) : [path.join(directory, e.name)]);
}
for (const prefix of ['', 'en/']) {
    for (const file of fs.readdirSync('src/content/docs/' + prefix + 'php').filter(f => /^(0[5-9]|1[0-7])-.*\.md$/.test(f))) {
        const source = fs.readFileSync('src/content/docs/' + prefix + 'php/' + file, 'utf8').replaceAll('\r\n', '\n');
        const page = 'dist/' + prefix + 'php/' + file.replace('.md', '') + '/index.html';
        const dom = parse(fs.readFileSync(page, 'utf8'));
        const expected = [...source.matchAll(fence)].map(m => m[3].trimEnd());
        const actual = collect(dom, n => n.tagName === 'pre').map(pre => {
            const lines = collect(pre, n => n.attrs?.some(a => a.name === 'class' && a.value.split(' ').includes('ec-line')));
            // Expressive Code represents an empty visual line with a newline text node.
            const body = lines.length ? lines.map(line => text(line) === '\n' ? '' : text(line)).join('\n') : text(pre);
            const title = collect(pre.parentNode, n => n.tagName === 'figcaption').map(text).join('');
            const copy = collect(pre.parentNode, n => n.tagName === 'button')
                .flatMap(n => n.attrs || []).find(a => a.name === 'data-code');
            if (copy) assert.equal(copy.value.replaceAll('\u007f', '\n').trimEnd(), body.trimEnd(), page + ': copy button differs from displayed code');
            return { body: body.trimEnd(), title };
        });
        for (const block of expected) {
            assert.ok(actual.some(v => {
                if (v.body === block) return true;
                // Filename comments may become a visible figure title.
                const filename = block.match(/^<\?php\n\/\/ ([^\n]+\.php)\n/);
                return filename && v.title === filename[1]
                    && v.body === block.replace('// ' + filename[1] + '\n', '');
            }), page + ': exact rendered code mismatch: ' + block.slice(0, 60));
            report.codeBlocks++;
        }
        const details = collect(dom, n => n.tagName === 'details' && collect(n, c => c.tagName === 'summary').length > 0);
        const questions = (source.match(/<details>/g) || []).length;
        assert.ok(details.length >= questions, 'Exercises missing');
        report.exercises += questions;
        for (const m of source.matchAll(/\]\((\/[^)#]*)(?:#[^)]*)?\)/g)) {
            const url = m[1];
            if (url.startsWith('/downloads/')) {
                assert.ok(fs.existsSync('public' + url), 'Missing download ' + url);
            } else {
                assert.ok(fs.existsSync(path.join('dist', url, 'index.html')), 'Missing route ' + url);
            }
            report.links++;
        }
        report.pages++;
    }
    const tracks = ['programming-basics', 'cpp', 'php', 'php-runtime', 'oop', 'auth', 'database'];
    const counts = {};
    for (const track of tracks) {
        counts[track] = walk('src/content/docs/' + prefix + track).filter(f =>
            /\.(md|mdx)$/.test(f)
            && !/[/\\](index|networking-next|programming-practice)\.(md|mdx)$/.test(f)
            && !(track === 'cpp' && /[/\\]loops-competitive[/\\](02-competitive-programming|03-conditions-codeforces)\.(md|mdx)$/.test(f))
        ).length;
    }
    report.counts[prefix ? 'en' : 'ar'] = { ...counts, total: Object.values(counts).reduce((a, b) => a + b, 0) };
    assert.equal(counts.php, 18, '17 numbered lessons plus setup');
    const homepage = parse(fs.readFileSync('dist/' + prefix + 'index.html', 'utf8'));
    const cards = collect(homepage, n => n.tagName === 'a' && n.attrs?.some(a => a.name === 'href' && a.value === '/' + prefix + 'php/'));
    assert.ok(cards.some(card => /18/.test(text(card))), 'Homepage PHP card count');
}
fs.writeFileSync('planning/audit-results/php-course-render-checks.json', JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify(report, null, 2));
