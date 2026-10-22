import { chromium } from 'playwright-core';
import { access, mkdir, writeFile } from 'node:fs/promises';
import assert from 'node:assert/strict';

const base = process.env.AUDIT_BASE_URL || 'http://127.0.0.1:4322';
let executablePath;
for (const candidate of ['C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', 'C:/Program Files/Google/Chrome/Application/chrome.exe']) {
  try { await access(candidate); executablePath = candidate; break; } catch {}
}
assert.ok(executablePath, 'An installed Chromium browser is required');
const browser = await chromium.launch({ executablePath, headless: true });
const results = [];
await mkdir('planning/audit-results', {recursive:true});
try {
  const page = await browser.newPage({viewport:{width:1280,height:900}});
  const errors=[];
  page.on('pageerror', error=>errors.push(error.message));
  for (const route of ['/', '/en/', '/programming-basics/', '/programming-basics/computer-in-depth/', '/programming-basics/computer-in-depth/software-and-runtime/', '/programming-basics/computer-in-depth/06-operating-systems/', '/programming-basics/03-tcp-udp-packets/', '/programming-basics/udp/', '/programming-basics/20-transport-diagnostics/', '/en/programming-basics/computer-in-depth/software-and-runtime/', '/en/programming-basics/03-tcp-udp-packets/', '/en/programming-basics/udp/', '/en/programming-basics/20-transport-diagnostics/', '/cpp/', '/php/', '/php-runtime/', '/auth/', '/database/']) {
    const response = await page.goto(base+route,{waitUntil:'load'});
    assert.equal(response.status(),200,route);
    assert.equal(await page.locator('a[href="/oop/"],a[href^="/oop/"],a[href="/en/oop/"],a[href^="/en/oop/"]').count(),0,route+': retired OOP link');
    assert.ok(await page.locator('h1').count(),route+': missing heading');
    const dir=await page.locator('html').getAttribute('dir');
    assert.equal(dir,route.startsWith('/en/')?'ltr':'rtl',route+': direction');
    if(route.includes('03-tcp-udp-packets') || route.includes('software-and-runtime')) {
      const counterpart=route.startsWith('/en/') ? route.slice(3) : '/en'+route;
      assert.equal(await page.locator('a.language-action').getAttribute('href'),counterpart,route+': language link');
      assert.equal((await page.request.get(base+counterpart)).status(),200,route+': counterpart unavailable');
      results.push({route,status:200,dir,languageCounterpart:counterpart});
    } else results.push({route,status:200,dir});
  }
  await page.goto(base+'/programming-basics/03-tcp-udp-packets/');
  assert.equal(await page.locator('.track-option').count(),6);
  await page.screenshot({path:'planning/audit-results/standalone-tcp-desktop.png'});
  await page.setViewportSize({width:390,height:844});
  await page.screenshot({path:'planning/audit-results/standalone-tcp-mobile.png'});
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'Mobile page overflow');
  const retired=await page.goto(base+'/oop/');
  assert.equal(retired.status(),404);
  assert.deepEqual(errors,[]);
  await writeFile('planning/audit-results/standalone-site-2026-10-20.json',JSON.stringify({results,retiredOopStatus:404,pageErrors:errors},null,2)+'\n');
  console.log(`Verified ${results.length} routes, both language directions and selectors, six tracks, mobile width, and retired OOP 404.`);
} finally { await browser.close(); }
