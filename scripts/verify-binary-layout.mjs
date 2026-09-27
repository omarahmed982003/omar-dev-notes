import assert from 'node:assert/strict';
import { chromium } from 'playwright-core';
import fs from 'node:fs/promises';

const candidates = [process.env.PLAYWRIGHT_BROWSER_PATH, 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', '/usr/bin/chromium'].filter(Boolean);
let executablePath;
for (const candidate of candidates) {
  try { await fs.access(candidate); executablePath = candidate; break; } catch {}
}
assert.ok(executablePath, 'Set PLAYWRIGHT_BROWSER_PATH');
const browser = await chromium.launch({ executablePath, headless: true });
try {
  const page = await browser.newPage();
  const base = process.env.AUDIT_BASE_URL || 'http://localhost:4321';
  const results = [];
  for (const width of [1280, 390]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto(base + '/programming-basics/computer-fundamentals/02-binary-data-representation/', { waitUntil: 'networkidle' });
    const division = page.locator('main table span[dir="ltr"]').first();
    const positions = await division.evaluate(element => {
      const node = element.firstChild;
      return [0, 2, 4].map(index => {
        const range = document.createRange();
        range.setStart(node, index); range.setEnd(node, index + 1);
        return { text: range.toString(), x: range.getBoundingClientRect().x };
      });
    });
    assert.deepEqual(positions.map(position => position.text), ['5', '÷', '2']);
    assert.ok(positions[0].x < positions[1].x && positions[1].x < positions[2].x, 'Division must display 5 ÷ 2 in this order');
    const weights = await page.locator('main table').first().locator('td').evaluateAll(cells => cells.map(cell => ({ text: cell.textContent, x: cell.getBoundingClientRect().x })));
    assert.deepEqual(weights.map(cell => cell.text), ['8', '4', '2', '1']);
    assert.ok(weights.every((cell, index) => !index || cell.x > weights[index - 1].x));
    await division.scrollIntoViewIfNeeded();
    await page.screenshot({ path: `planning/audit-results/binary-division-${width}.png` });
    results.push({ width, divisionOrder: positions.map(position => position.text), weights: weights.map(cell => cell.text) });
  }
  await fs.writeFile('planning/audit-results/binary-layout-checks.json', JSON.stringify(results, null, 2) + '\n');
  console.log('PASS: binary division and place values display in order at desktop and mobile widths');
} finally { await browser.close(); }
