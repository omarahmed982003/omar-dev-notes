import assert from 'node:assert/strict';
import http from 'node:http';
import path from 'node:path';
import { readFile, stat, mkdir, writeFile } from 'node:fs/promises';
import { chromium } from 'playwright-core';

// Run after npm run build; test the actual production output and search index.
const root = path.resolve('dist');
const output = 'tmp/design-review-2026-10-29';
const mime = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.png': 'image/png', '.woff2': 'font/woff2', '.ttf': 'font/ttf', '.json': 'application/json', '.wasm': 'application/wasm' };
const server = http.createServer(async (request, response) => {
  try {
    const pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
    let target = path.resolve(root, '.' + pathname);
    assert.ok(target === root || target.startsWith(root + path.sep));
    if ((await stat(target)).isDirectory()) target = path.join(target, 'index.html');
    const content = await readFile(target);
    response.writeHead(200, { 'content-type': mime[path.extname(target)] || 'application/octet-stream' });
    response.end(content);
  } catch { response.writeHead(404).end('Not found'); }
});
await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
const base = `http://127.0.0.1:${server.address().port}`;
const browser = await chromium.launch({ executablePath: process.env.PLAYWRIGHT_BROWSER_PATH || 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', headless: true });
const teachingSlugs = [
  'programming-basics/computer-in-depth/04-cpu-gpu',
  'programming-basics/computer-in-depth/05-ram-memory-buffers',
  'programming-basics/computer-in-depth/06-operating-systems',
  'programming-basics/05-http-messages-state',
  'php/02-variables-scope-superglobals', 'php/scope', 'php/11-errors-exceptions',
  'php-runtime/05-php-fpm-processes',
];
const routes = process.argv.includes('--teaching')
  ? teachingSlugs.flatMap(slug => [`/${slug}/`, `/en/${slug}/`])
  : process.argv.includes('--extra')
  ? ['/cpp/', '/en/cpp/', '/php-runtime/', '/en/php-runtime/']
  : ['/', '/en/', '/programming-basics/', '/en/programming-basics/', '/programming-basics/03-tcp-udp-packets/', '/en/programming-basics/03-tcp-udp-packets/', '/php/', '/en/php/', '/php/scope/', '/en/php/scope/', '/auth/', '/en/database/'];
const report = { views: [], interactions: [], browserErrors: [] };
const luminance = color => {
  const channels = color.match(/[\d.]+/g).slice(0, 3).map(value => Number(value) / 255).map(value => value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4);
  return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
};
await mkdir(output, { recursive: true });
try {
  for (const theme of (process.argv.includes('--interactions') ? [] : ['light', 'dark'])) {
    const context = await browser.newContext({ reducedMotion: 'reduce' });
    await context.addInitScript(value => localStorage.setItem('starlight-theme', value), theme);
    const page = await context.newPage();
    page.on('pageerror', error => report.browserErrors.push(error.message));
    for (const width of [320, 768, 1280]) {
      await page.setViewportSize({ width, height: 900 });
      for (const route of routes) {
        const response = await page.goto(base + route, { waitUntil: 'load' });
        assert.equal(response.status(), 200, route);
        await page.evaluate(() => document.fonts.ready);
        const isEnglish = route.startsWith('/en/');
        assert.equal(await page.locator('html').getAttribute('dir'), isEnglish ? 'ltr' : 'rtl');
        const dimensions = await page.evaluate(() => ({ viewport: innerWidth, document: document.documentElement.scrollWidth }));
        assert.ok(dimensions.document <= dimensions.viewport + 2, `Page overflow: ${route} ${theme} ${width} ${JSON.stringify(dimensions)}`);
        const expectedLanguage = isEnglish ? route.slice(3) || '/' : '/en' + route;
        assert.equal(await page.locator('.language-action').getAttribute('href'), expectedLanguage);
        const overlap = await page.evaluate(() => {
          const elements = [...document.querySelectorAll('.header-brand, .header-search, .header-actions, .sl-menu-button')].filter(element => element.getBoundingClientRect().width > 0);
          const collisions = [];
          for (let i = 0; i < elements.length; i++) for (let j = i + 1; j < elements.length; j++) {
            const a = elements[i].getBoundingClientRect(), b = elements[j].getBoundingClientRect();
            if (Math.min(a.right, b.right) - Math.max(a.left, b.left) > 2 && Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top) > 2) collisions.push([elements[i].className, elements[j].className]);
          }
          return collisions;
        });
        assert.deepEqual(overlap, [], `Header overlap: ${route} ${width}`);
        if (route === '/' || route === '/en/') assert.equal(await page.locator('.path-card').count(), 2);
        const tableAlignment = await page.locator('main :is(th,td)').evaluateAll(cells => cells.every(cell => getComputedStyle(cell).textAlign === 'center'));
        assert.ok(tableAlignment, `Table alignment: ${route}`);
        const readingColors = await page.evaluate(() => ({
          text: getComputedStyle(document.querySelector('.sl-markdown-content')).color,
          background: getComputedStyle(document.body).backgroundColor,
        }));
        const foreground = luminance(readingColors.text), background = luminance(readingColors.background);
        const contrast = (Math.max(foreground, background) + 0.05) / (Math.min(foreground, background) + 0.05);
        assert.ok(contrast >= 4.5, `Reading contrast below 4.5: ${route} ${theme} ${contrast}`);
        if (process.argv.includes('--teaching')) {
          const figure = page.locator('figure.concept-visual');
          assert.equal(await figure.count(), 1, `Teaching diagram missing: ${route}`);
          await figure.scrollIntoViewIfNeeded();
          const diagram = await figure.evaluate(element => ({
            width: element.clientWidth, scroll: element.scrollWidth,
            caption: element.querySelector('figcaption')?.textContent.trim().length,
            name: Boolean(document.getElementById(element.getAttribute('aria-labelledby'))),
          }));
          assert.ok(diagram.scroll <= diagram.width + 2, `Diagram overflow: ${route} ${width}`);
          assert.ok(diagram.caption > 30 && diagram.name, `Missing diagram explanation: ${route}`);
          const alternatives = await figure.locator('.visual-alternatives > section').evaluateAll(elements => elements.map(element => {
            const rect = element.getBoundingClientRect();
            return { x: rect.x, y: rect.y, width: rect.width };
          }));
          if (alternatives.length) {
            assert.equal(alternatives.length, 3);
            assert.ok(alternatives.every((item, index) => Math.abs(item.x - alternatives[0].x) < 1 && (!index || item.y > alternatives[index - 1].y)), `Alternative branches are not equal rows: ${route}`);
          }
          const operations = await figure.locator('.visual-operation').evaluateAll(elements => elements.map(element => {
            const code = element.querySelector('code').getBoundingClientRect(), arrow = element.querySelector('.visual-arrow').getBoundingClientRect();
            return { offset: Math.abs(code.x + code.width / 2 - arrow.x - arrow.width / 2), ordered: arrow.y >= code.bottom };
          }));
          assert.ok(operations.every(item => item.offset < 1 && item.ordered), `Operation arrow is not aligned: ${route}`);
          for (const step of await figure.locator('details.trace-step').all()) {
            if (!(await step.evaluate(element => element.open))) await step.locator('summary').click();
            assert.ok(await step.locator('.trace-state').isVisible(), `Trace state not visible: ${route}`);
          }
          const openWidth = await figure.evaluate(element => ({ width: element.clientWidth, scroll: element.scrollWidth }));
          assert.ok(openWidth.scroll <= openWidth.width + 2, `Expanded trace overflow: ${route}`);
          if (theme === 'light' && (width === 320 || width === 1280) && !isEnglish) {
            const name = route.split('/').filter(Boolean).at(-1);
            const overlayStyle = await page.addStyleTag({ content: 'header.header, .sl-menu-button, mobile-starlight-toc, .back-to-top { visibility: hidden !important; }' });
            await figure.screenshot({ path: `${output}/teaching-${name}-${width}.png`, animations: 'disabled' });
            await overlayStyle.evaluate(element => element.remove());
          }
        }
        report.views.push({ route, theme, width, overflow: false, headerOverlap: false, readingContrast: Number(contrast.toFixed(2)) });
      }
    }
    console.log(`Reviewed ${theme} layouts`);
    await context.close();
  }

  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'reduce' });
  page.on('pageerror', error => report.browserErrors.push(error.message));
  await page.goto(base + '/programming-basics/03-tcp-udp-packets/');
  const trigger = page.locator('.track-trigger');
  assert.equal(await page.locator('.track-menu-shell').evaluate(element => element.inert), true);
  await trigger.focus();
  await page.keyboard.press('ArrowDown');
  assert.equal(await trigger.getAttribute('aria-expanded'), 'true');
  assert.equal(await page.locator('.track-option[data-active="true"]').evaluate(element => element === document.activeElement), true);
  await page.keyboard.press('Escape');
  assert.equal(await trigger.getAttribute('aria-expanded'), 'false');
  assert.equal(await trigger.evaluate(element => element === document.activeElement), true);
  report.interactions.push('Keyboard track picker opens, focuses current track, closes, and returns focus');

  await page.locator('.focus-action').click();
  assert.equal(await page.locator('.sidebar-pane').isVisible(), false);
  assert.equal(await page.locator('.right-sidebar-container').isVisible(), false);
  assert.equal(await page.locator('.focus-action').getAttribute('aria-pressed'), 'true');
  await page.screenshot({ path: `${output}/lesson-focus.png` });
  await page.locator('.focus-action').click();
  assert.equal(await page.locator('.sidebar-pane').isVisible(), true);
  report.interactions.push('Reading focus toggles both navigation panels and restores them');

  const originalTheme = await page.locator('html').getAttribute('data-theme');
  await page.locator('.theme-action').click();
  assert.notEqual(await page.locator('html').getAttribute('data-theme'), originalTheme);
  await page.reload();
  assert.notEqual(await page.locator('html').getAttribute('data-theme'), originalTheme);
  report.interactions.push('Theme changes and survives reload');

  await page.locator('site-search > button').click();
  await page.locator('.pagefind-ui__search-input').fill('TCP');
  await page.locator('.pagefind-ui__result').first().waitFor();
  await page.keyboard.press('Escape');
  report.interactions.push('Production search returns TCP results');

  await page.setViewportSize({ width: 390, height: 844 });
  await page.locator('.sl-menu-button').click();
  assert.equal(await page.locator('#starlight__sidebar').evaluate(element => element.matches(':popover-open')), true);
  await page.locator('.track-trigger').click();
  await page.screenshot({ path: `${output}/mobile-menu-before-switch.png` });
  await page.locator('.track-option[href="/php/"]').click();
  await page.waitForURL(base + '/php/');
  report.interactions.push('Mobile menu and track switch navigate to PHP');

  for (const [name, route, width, theme] of [
    ['home-ar-desktop', '/', 1440, 'light'], ['home-en-desktop', '/en/', 1440, 'light'],
    ['home-ar-dark', '/', 1440, 'dark'], ['home-ar-mobile', '/', 390, 'light'],
    ['lesson-ar-desktop', '/programming-basics/03-tcp-udp-packets/', 1440, 'light'],
    ['lesson-en-dark', '/en/php/scope/', 1440, 'dark'], ['lesson-ar-mobile', '/programming-basics/03-tcp-udp-packets/', 390, 'light'],
  ]) {
    await page.setViewportSize({ width, height: width < 800 ? 844 : 1000 });
    await page.goto(base + route, { waitUntil: 'load' });
    await page.evaluate(value => document.documentElement.dataset.theme = value, theme);
    await page.evaluate(() => document.fonts.ready);
    await page.screenshot({ path: `${output}/${name}.png`, animations: 'disabled' });
    if (name === 'home-ar-desktop') {
      await page.locator('#learning-paths').scrollIntoViewIfNeeded();
      await page.screenshot({ path: `${output}/home-courses.png`, animations: 'disabled' });
    }
    if (name === 'lesson-ar-desktop') {
      await page.locator('.expressive-code').first().scrollIntoViewIfNeeded();
      await page.screenshot({ path: `${output}/lesson-code.png`, animations: 'disabled' });
    }
  }
  assert.deepEqual(report.browserErrors, []);
  const reportName = process.argv.includes('--teaching') ? 'teaching-report' : process.argv.includes('--extra') ? 'extra-report' : 'report';
  await writeFile(`${output}/${reportName}.json`, JSON.stringify(report, null, 2));
  console.log(JSON.stringify({ views: report.views.length, interactions: report.interactions, errors: report.browserErrors, screenshots: output }, null, 2));
} finally {
  await browser.close();
  await new Promise(resolve => server.close(resolve));
}
