import { readFile, readdir, access, mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import { chromium } from 'playwright-core';

const base = process.env.AUDIT_BASE_URL || 'http://127.0.0.1:4323';
const output = 'planning/audit-results/foundations-diagrams-2026-10-22';
await mkdir(output, { recursive: true });
const report = { date: '2026-10-22', sources: [], routes: [], figures: [], svgText: [], browserErrors: [] };
const withoutCode = source => source.replace(/(^|\n)(`{3,}|~{3,})[^\n]*\n[\s\S]*?\n\2\s*(?=\n|$)/g, '\n');
for (const locale of ['', 'en/']) {
  const root = `src/content/docs/${locale}programming-basics`;
  const files = (await readdir(root, { recursive: true })).filter(file => file.endsWith('.md')).sort();
  for (const relative of files) {
    const file = path.join(root, relative);
    const source = await readFile(file, 'utf8');
    const body = withoutCode(source);
    assert.ok(!/lesson-diagram|diagram-flow|^## (?:خريطة الدرس|Lesson map)/m.test(body), `Decorative map: ${file}`);
    const images = [...body.matchAll(/<img\b[^>]*src="([^"]+)"[^>]*>/g)].map(match => match[1]);
    images.push(...[...body.matchAll(/!\[[^\]]*\]\(([^)]+)\)/g)].map(match => match[1]));
    for (const src of images) {
      assert.ok((src.startsWith('/diagrams/foundations/') || /^\/diagrams\/request-flow-(ar|en)\.svg$/.test(src)), `Unreviewed figure ${src}: ${file}`);
      await access(path.join('public', src));
    }
    const normalized = relative.replaceAll('\\', '/').replace(/\.md$/, '').replace(/(?:^|\/)index$/, '');
    const route = `/${locale}programming-basics/${normalized}${normalized ? '/' : ''}`;
    report.sources.push({ file, route, diagrams: images.length });
  }
}
assert.equal(report.sources.length, 194);
assert.equal(report.sources.reduce((sum, source) => sum + source.diagrams, 0), 14);

const browser = await chromium.launch({ executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', headless: true });
try {
  const page = await browser.newPage({ viewport: { width: 320, height: 844 } });
  page.on('pageerror', error => report.browserErrors.push(error.message));
  for (const [index, source] of report.sources.entries()) {
    const response = await page.goto(base + source.route, { waitUntil: 'load' });
    assert.equal(response.status(), 200, source.route);
    const en = source.route.startsWith('/en/');
    assert.equal(await page.locator('html').getAttribute('dir'), en ? 'ltr' : 'rtl');
    const counterpart = en ? source.route.slice(3) : '/en' + source.route;
    assert.equal(await page.locator('a.language-action').getAttribute('href'), counterpart);
    assert.equal(await page.locator('.lesson-diagram').count(), 0, source.route);
    const dimensions = await page.evaluate(() => ({ scroll: document.documentElement.scrollWidth, width: innerWidth }));
    assert.ok(dimensions.scroll <= dimensions.width + 2, `Page overflow: ${source.route} ${JSON.stringify(dimensions)}`);
    const preDirections = await page.locator('.sl-markdown-content pre').evaluateAll(elements => elements.map(element => getComputedStyle(element).direction));
    assert.ok(preDirections.every(direction => direction === 'ltr'), `Code direction: ${source.route}`);
    const figures = page.locator('.sl-markdown-content figure.teaching-figure, .sl-markdown-content figure.request-journey-figure');
    assert.equal(await figures.count(), source.diagrams, source.route);
    report.routes.push({ route: source.route, status: 200, direction: en ? 'ltr' : 'rtl', width: 320, overflow: false, languageSwitch: true });
    if (source.diagrams) {
      for (const width of [320, 390, 1280]) {
        await page.setViewportSize({ width, height: 900 });
        for (let i = 0; i < source.diagrams; i++) {
          const figure = figures.nth(i);
          await figure.scrollIntoViewIfNeeded();
          await page.waitForFunction(element => element.querySelector('img')?.complete && element.querySelector('img').naturalWidth > 0, await figure.elementHandle());
          assert.ok((await figure.locator('img').getAttribute('alt')).length > 20);
          assert.ok((await figure.locator('figcaption').textContent()).trim().length > 20);
          const size = await figure.evaluate(element => ({ scroll: element.scrollWidth, width: element.clientWidth, image: element.querySelector('img').getBoundingClientRect().width }));
          assert.ok(size.scroll <= size.width + 2, `Figure overflow: ${source.route} ${width}`);
          // All assets use viewBox width 360 and text >= 20 units.
          if (await figure.evaluate(element => element.classList.contains('request-journey-figure'))) {
            const fullSize = await figure.locator('figcaption a').getAttribute('href');
            assert.ok(/^\/diagrams\/request-flow-(ar|en)\.svg$/.test(fullSize));
            assert.equal((await page.request.get(base + fullSize)).status(), 200);
          } else assert.ok(size.image * 20 / 360 >= 14, `Tiny diagram text: ${source.route} ${width}`);
          const name = `${en ? 'en' : 'ar'}-${source.route.split('/').filter(Boolean).at(-1)}-${width}.png`;
          await figure.screenshot({ path: path.join(output, name) });
          report.figures.push({ route: source.route, width, imageWidth: size.image, screenshot: name });
        }
      }
      await page.setViewportSize({ width: 320, height: 844 });
    }
    if ((index + 1) % 25 === 0) console.log(`Reviewed ${index + 1}/${report.sources.length} foundations pages`);
  }
  const assets = [];
  for (const domain of ['math', 'network']) {
    for (const name of await readdir(`public/diagrams/foundations/${domain}`)) if (name.endsWith('.svg')) assets.push(`/diagrams/foundations/${domain}/${name}`);
  }
  for (const asset of assets) {
    await page.goto(base + asset, { waitUntil: 'load' });
    const outside = await page.locator('svg').evaluate(svg => {
      const bounds = svg.viewBox.baseVal;
      return [...svg.querySelectorAll('text')].flatMap(text => {
        const box = text.getBBox();
        return box.x < -1 || box.y < -1 || box.x + box.width > bounds.width + 1 || box.y + box.height > bounds.height + 1 ? [{ text: text.textContent, x: box.x, width: box.width }] : [];
      });
    });
    assert.deepEqual(outside, [], `Clipped SVG labels: ${asset}`);
    report.svgText.push({ asset, clipped: false });
  }
  for (const route of ['/cpp/', '/php/', '/php-runtime/', '/auth/', '/database/']) {
    assert.equal((await page.goto(base + route)).status(), 200);
    assert.equal(await page.locator('.foundations-reading-scope').count(), 0);
  }
  assert.deepEqual(report.browserErrors, []);
} finally { await browser.close(); }
await writeFile(path.join(output, 'report.json'), JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify({ sources: report.sources.length, routes: report.routes.length, figureChecks: report.figures.length, svgAssets: report.svgText.length, report: `${output}/report.json` }));
