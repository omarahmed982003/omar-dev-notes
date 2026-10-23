import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import { parse } from 'parse5';

const root = process.cwd();
const dist = path.join(root, 'dist');
const report = { preservedRoutes: 0, homepageCards: 0, browserViews: 0 };
const nodes = node => [node, ...(node.childNodes || []).flatMap(nodes)];
const attr = (node, name) => node.attrs?.find(a => a.name === name)?.value;
for (const locale of ['', 'en/']) {
  for (const module of ['php', 'php-runtime']) {
    for (const file of fs.readdirSync(path.join(root, 'src/content/docs', locale, module))) {
      if (!file.endsWith('.md')) continue;
      const route = locale + module + '/' + (file === 'index.md' ? '' : file.replace(/\.md$/, '') + '/');
      const output = path.join(dist, route, 'index.html');
      assert.ok(fs.existsSync(output), route);
      const html = fs.readFileSync(output, 'utf8');
      assert.match(html, /data-track-index="2"/, route + ' shares PHP track');
      const tree = nodes(parse(html));
      assert.equal(tree.filter(n => (attr(n, 'class') || '').split(' ').includes('track-option')).length, 5);
      const languageSwitch = tree.find(n => n.tagName === 'a' && (attr(n, 'class') || '').split(' ').includes('language-action'));
      const otherRoute = locale ? '/' + route.replace(/^en\//, '') : '/en/' + route;
      assert.equal(attr(languageSwitch, 'href'), otherRoute, route + ' language switch');
      report.preservedRoutes++;
    }
  }
  const home = nodes(parse(fs.readFileSync(path.join(dist, locale, 'index.html'), 'utf8')));
  const cards = home.filter(n => n.tagName === 'a' && (attr(n, 'class') || '').split(' ').includes('path-card'));
	assert.equal(cards.length, 2, 'two visible homepage tracks');
	assert.deepEqual(cards.map(card => attr(card, 'href')), ['/' + locale + 'programming-basics/', '/' + locale + 'php/']);
  assert.equal(cards.filter(n => attr(n, 'href') === '/' + locale + 'php/').length, 1);
  assert.equal(cards.filter(n => attr(n, 'href')?.includes('php-runtime')).length, 0);
  report.homepageCards += cards.length;
}
const curriculum = JSON.parse(fs.readFileSync('src/data/php-curriculum.json', 'utf8'));
assert.equal(report.preservedRoutes, curriculum.flatMap(group => group.items).length * 2);

if (process.argv.includes('--browser')) {
  const { chromium } = await import('playwright-core');
  const server = http.createServer((req, res) => {
    const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    const target = path.resolve(dist, '.' + pathname, pathname.endsWith('/') ? 'index.html' : '');
    if (!target.startsWith(dist + path.sep) || !fs.existsSync(target) || !fs.statSync(target).isFile()) {
      res.writeHead(404); res.end(); return;
    }
    const type = { '.html': 'text/html', '.css': 'text/css', '.js': 'application/javascript', '.svg': 'image/svg+xml', '.ttf': 'font/ttf' }[path.extname(target)] || 'application/octet-stream';
    res.setHeader('Content-Type', type);
    fs.createReadStream(target).pipe(res);
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  let browser;
  try {
    browser = await chromium.launch({ executablePath: process.env.EDGE_BINARY || 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', headless: true });
    const page = await browser.newPage();
    for (const width of [320, 1280]) {
      await page.setViewportSize({ width, height: 900 });
      const newLessons = ['cli-input-output', 'input-validation', 'cli-expenses-project', 'first-tests', 'constants', 'scope', 'program-organization', 'request-input', 'file-uploads', 'regex', 'generators'];
      const foundations = ['', 'computer-in-depth/software-and-runtime/', '03-tcp-udp-packets/', 'computer-in-depth/06-operating-systems/'];
      const routes = ['/', '/en/', '/php/', '/en/php/', '/php-runtime/', '/en/php-runtime/', '/php-runtime/20-long-running-php/', '/en/php-runtime/20-long-running-php/', '/auth/', '/en/auth/', '/database/', '/en/database/',
        ...newLessons.flatMap(slug => ['/php/' + slug + '/', '/en/php/' + slug + '/']),
        ...foundations.flatMap(slug => ['/programming-basics/' + slug, '/en/programming-basics/' + slug])];
      for (const route of routes) {
        const response = await page.goto(`http://127.0.0.1:${server.address().port}${route}`);
        assert.equal(response.status(), 200);
        if (route === '/' || route === '/en/') {
		  assert.equal(await page.locator('.path-card').count(), 2);
        } else {
          assert.equal(await page.locator('.track-option').count(), 5);
        }
        if (route.includes('/php')) {
          assert.equal(await page.locator('track-sidebar').getAttribute('data-track-index'), '2');
          assert.equal(await page.locator('.track-option[data-active="true"]').getAttribute('href'), route.startsWith('/en/') ? '/en/php/' : '/php/');
        }
        assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 2), route + ': page width');
        report.browserViews++;
        if ((width === 320 && route === '/php/cli-input-output/') || (width === 1280 && route === '/programming-basics/computer-in-depth/software-and-runtime/')) {
          fs.mkdirSync('tmp/php-content-review', { recursive: true });
          await page.screenshot({ path: width === 320 ? 'tmp/php-content-review/cli-mobile.png' : 'tmp/php-content-review/runtime-desktop.png' });
        }
      }
    }
  } finally {
    await browser?.close();
    await new Promise(resolve => server.close(resolve));
  }
}
console.log(JSON.stringify(report));
