import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { chromium } from 'playwright-core';

const candidates = [process.env.PLAYWRIGHT_BROWSER_PATH, 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', 'C:/Program Files/Google/Chrome/Application/chrome.exe', '/usr/bin/chromium'].filter(Boolean);
let executablePath;
for (const candidate of candidates) { try { await access(candidate); executablePath = candidate; break; } catch {} }
assert.ok(executablePath, 'Install a browser or set PLAYWRIGHT_BROWSER_PATH');
const browser = await chromium.launch({ executablePath, headless: true });
let checks = 0;
try {
 const page = await browser.newPage();
 const errors = [];
 page.on('pageerror', error => errors.push(error.message));
 const expected = {hello:'Hello!', values:'30', conditions:'30', loops:'6', lists:'54'};
 const sources = {};
 for (const [name, output] of Object.entries(expected)) {
  const filename = path.resolve(`public/examples/first-program/${name}.html`);
  sources[name] = await readFile(filename, 'utf8');
  await page.goto(pathToFileURL(filename).href);
  assert.equal((await page.locator('body').innerText()).trim(), output, name);
  checks++;
 }
 sources['one-function'] = await readFile('public/examples/first-program/one-function.html', 'utf8');
 const variants = [
  [sources.lists.replace('[10, 20, 30]', '[]'), '0'],
  [sources.lists.replace('[10, 20, 30]', '[20]'), '18'],
  [sources.lists.replace('[10, 20, 30]', '[10, 20, 30, 40]'), '90'],
  [sources.lists.replace('discountedPrice(price, 10)', 'discountedPrice(price, 0)'), '60'],
  [sources.lists.replace('discountedPrice(price, 10)', 'discountedPrice(price, 100)'), '0'],

  [sources.hello.replace('"Hello!"', '2 + 3'), '5'],
  [sources.hello.replace('"Hello!"', '"2 + 3"'), '2 + 3'],
  [sources.hello.replace('"Hello!"', '12 - 8'), '4'],
  [sources.values.replace('quantity = 3', 'quantity = 0'), '0'],
  [sources.values.replace('quantity = 3', 'quantity = 4'), '40'],
  [sources.values.replace('price * quantity', '"10" + "3"'), '103'],
  [sources.values.replace('document.body.textContent', 'price = 20;\ndocument.body.textContent'), '30'],
  [sources.conditions.replace('quantity = 3', 'quantity = 0'), '0'],
  [sources.conditions.replace('quantity = 3', 'quantity = -1'), 'Invalid quantity'],
  [sources.loops.replace('number <= 3', 'number <= 4'), '10'],
  [sources.loops.replace('number <= 3', 'number < 4'), '6'],
 ];
 for (const [source, output] of variants) {
  await page.goto('about:blank');
  await page.setContent(source);
  assert.equal((await page.locator('body').innerText()).trim(), output);
  checks++;
 }
 assert.deepEqual(errors, []);
 await page.goto('about:blank');
 await page.setContent(sources.hello.replace('"Hello!"', '"Hello!'));
 await page.waitForTimeout(100);
 assert.equal(errors.length, 1, 'Intentional missing quote must produce a syntax error');
 await page.goto('about:blank');
 await page.setContent(sources.hello);
 assert.equal((await page.locator('body').innerText()).trim(), 'Hello!');
 checks += 2;
 const lessons = {'08-first-program':'hello', '09-values-and-calculations':'values', '10-decisions-and-repetition':['conditions','loops'], '11-functions-and-lists':['one-function','lists']};
 for (const [lesson, names] of Object.entries(lessons)) {
  for (const locale of ['', 'en/']) {
   const markdown = await readFile(`src/content/docs/${locale}programming-basics/computer-fundamentals/${lesson}.md`, 'utf8');
   const blocks = [...markdown.matchAll(/^```html\r?\n([\s\S]*?)^```/gm)].map(match=>match[1].trim().replaceAll('\r',''));
   assert.deepEqual(blocks, [names].flat().map(name=>sources[name].trim().replaceAll('\r','')), `${locale}${lesson}: published examples match tested files`);
   checks++;
  }
 }
 console.log(`PASS: ${checks} browser execution and bilingual example checks.`);
} finally { await browser.close(); }
