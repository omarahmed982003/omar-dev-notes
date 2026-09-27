import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import {chromium} from 'playwright-core';
const candidates=[process.env.PLAYWRIGHT_BROWSER_PATH,'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe','C:/Program Files/Google/Chrome/Application/chrome.exe','/usr/bin/chromium'].filter(Boolean);
let executablePath;for(const p of candidates){try{await fs.access(p);executablePath=p;break;}catch{}}
assert.ok(executablePath,'Set PLAYWRIGHT_BROWSER_PATH');
const base=process.env.AUDIT_BASE_URL||'http://localhost:4321';
const browser=await chromium.launch({executablePath,headless:true});
const results={desktopPages:0,mobilePages:0,navigationChecks:0,errors:[]};
await fs.mkdir('planning/audit-results',{recursive:true});
const routes=['/','/en/'];
for(const root of ['programming-basics','en/programming-basics']){
 const files=await fs.readdir('src/content/docs/'+root,{recursive:true});
 for(const f of files.filter(x=>x.endsWith('.md')))routes.push('/'+root+'/'+f.replaceAll('\\','/').replace(/\.md$/,'').replace(/(^|\/)index$/,'').replace(/\/$/,'')+'/');
}
try{
 const page=await browser.newPage({viewport:{width:1280,height:900}});
 page.on('pageerror',e=>results.errors.push(e.message));
 for(const route of routes){
  const response=await page.goto(base+route,{waitUntil:'networkidle'});
  assert.equal(response.status(),200,route);
  assert.ok(await page.locator('h1').first().innerText(),route+': missing title');
  assert.equal(await page.locator('vite-error-overlay, .vite-error-overlay').count(),0,route+': error overlay');
  assert.ok((await page.locator('main').innerText()).length>200,route+': empty main');
  assert.equal(await page.locator('main img').evaluateAll(imgs=>imgs.filter(i=>!i.complete||i.naturalWidth===0).length),0,route+': broken image');
  results.desktopPages++;
 }
 const mobileRoutes=[
 '/programming-basics/32-local-network-lab/','/en/programming-basics/32-local-network-lab/',
 '/programming-basics/math-problem-solving/12-graphs-and-search/','/programming-basics/25-request-observation/',
 '/programming-basics/computer-fundamentals/17-local-server/',
 '/','/programming-basics/','/programming-basics/programming-practice/','/programming-basics/18-wifi-practical-basics/',
 '/programming-basics/computer-fundamentals/12-input-validation/','/programming-basics/computer-fundamentals/13-text-processing/',
 '/programming-basics/computer-fundamentals/14-runtime-errors/','/programming-basics/computer-fundamentals/15-saving-data/',
 '/programming-basics/computer-fundamentals/16-shopping-project/',
 '/en/programming-basics/computer-fundamentals/16-shopping-project/',
 '/programming-basics/computer-fundamentals/02-binary-data-representation/',
 '/programming-basics/computer-fundamentals/11-functions-and-lists/','/programming-basics/06-https-tls-certificates/',
 '/programming-basics/math-problem-solving/06-flowcharts-loops-debugging/','/programming-basics/15-addressing-dhcp-nat-routing-ipv6/',
 '/en/programming-basics/computer-fundamentals/11-functions-and-lists/'
 ];
 await page.setViewportSize({width:390,height:844});
 for(const route of mobileRoutes){
  await page.goto(base+route,{waitUntil:'networkidle'});
  const size=await page.evaluate(()=>({view:innerWidth,page:document.documentElement.scrollWidth}));
  assert.ok(size.page<=size.view+1,route+': horizontal page overflow '+JSON.stringify(size));
  results.mobilePages++;
 }
 await page.goto(base+'/programming-basics/computer-fundamentals/02-binary-data-representation/');
 const table=page.locator('main table').first();
 const cells=await table.locator('td').evaluateAll(cells=>cells.map(c=>({text:c.textContent,x:c.getBoundingClientRect().x})));
 assert.deepEqual(cells.map(c=>c.text),['8','4','2','1']);
 assert.ok(cells.every((c,i)=>!i||c.x>cells[i-1].x),'Binary weights must read left to right');
 await table.scrollIntoViewIfNeeded();
 await page.screenshot({path:'planning/audit-results/binary-mobile-verified.png'});
 await page.locator('.pagination-links a[rel="next"]').click();
 assert.ok(page.url().includes('/18-media-and-units/'));results.navigationChecks++;
 await page.goto(base+'/programming-basics/computer-fundamentals/11-functions-and-lists/');
 await page.locator('.pagination-links a[rel="prev"]').click();
 assert.ok(page.url().includes('/10-decisions-and-repetition/'));results.navigationChecks++;
 await page.goto(base+'/programming-basics/math-problem-solving/06-flowcharts-loops-debugging/');
 await page.locator('.lesson-diagram').scrollIntoViewIfNeeded();
 await page.screenshot({path:'planning/audit-results/loop-mobile-verified.png'});
 await page.goto(base+'/programming-basics/06-https-tls-certificates/');
 await page.locator('main table').scrollIntoViewIfNeeded();
 await page.screenshot({path:'planning/audit-results/tls-mobile-verified.png'});
 await page.setViewportSize({width:1280,height:900});await page.goto(base+'/');
 await page.screenshot({path:'planning/audit-results/home-desktop-verified.png'});
 assert.deepEqual(results.errors,[]);
 console.log('PASS: '+JSON.stringify(results));
 await fs.writeFile('planning/audit-results/browser-checks.json',JSON.stringify(results,null,2)+'\n');
}finally{await browser.close();}

