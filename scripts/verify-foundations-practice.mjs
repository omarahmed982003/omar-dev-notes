import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import http from 'node:http';
import { chromium } from 'playwright-core';

const examples = {input:'12-input-validation',texts:'13-text-processing',errors:'14-runtime-errors',storage:'15-saving-data',shopping:'16-shopping-project'};
const sources = {};
let checks=0;
const results=[];
function pass(label) {checks++;results.push(label);}
for(const [name,lesson] of Object.entries(examples)) {
  sources[name]=await fs.readFile(`public/examples/first-program/${name}.html`,'utf8');
  for(const locale of ['', 'en/']) {
    const doc=await fs.readFile(`src/content/docs/${locale}programming-basics/computer-fundamentals/${lesson}.md`,'utf8');
    const code=[...doc.matchAll(/^```html\r?\n([\s\S]*?)^```/gm)].map(match=>match[1].trim().replaceAll('\r',''));
    const stage={input:'one-input',texts:'one-name',errors:'one-error',shopping:'records'}[name];
    const stageSource=stage?(await fs.readFile(`public/examples/first-program/${stage}.html`,'utf8')).trim().replaceAll('\r',''):null;
    const expected=stage==='records'?[sources[name].trim().replaceAll('\r',''),stageSource]:stage?[stageSource,sources[name].trim().replaceAll('\r','')]:[sources[name].trim().replaceAll('\r','')];
    assert.deepEqual(code,expected);
    pass(`${locale}${lesson}: published code matches runnable file`);
  }
}
const server=http.createServer((request,response)=>{
  const name=new URL(request.url,'http://localhost').pathname.slice(1).replace(/\.html$/,'');
  if(!sources[name]) {response.writeHead(404);response.end();return;}
  response.writeHead(200,{'Content-Type':'text/html; charset=utf-8'});response.end(sources[name]);
});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
const base=`http://127.0.0.1:${server.address().port}`;
const candidates=[process.env.PLAYWRIGHT_BROWSER_PATH,'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe','/usr/bin/chromium'].filter(Boolean);
let executablePath;for(const candidate of candidates){try{await fs.access(candidate);executablePath=candidate;break;}catch{}}
assert.ok(executablePath,'Set PLAYWRIGHT_BROWSER_PATH');
const browser=await chromium.launch({executablePath,headless:true});
const context=await browser.newContext();
let page=await context.newPage();
const errors=[];context.on('page',p=>p.on('pageerror',e=>errors.push(e.message)));page.on('pageerror',e=>errors.push(e.message));
const visit=async name=>{await page.goto(`${base}/${name}.html`,{waitUntil:'load'});};
const text=selector=>page.locator(selector).innerText();
try {
  await visit('input');
  for(const [price,quantity,expected] of [
    ['12.5','3','Total: 37.5'],['0','2','Total: 0'],[' 12.5 ',' 3 ','Total: 37.5'],
    ['', '3','Enter both values.'],['  ','3','Enter both values.'],['3','','Enter both values.'],
    ['abc','3','Enter numbers'],['12abc','3','Enter numbers'],['Infinity','3','Enter numbers'],['١٢','3','Enter numbers'],
    ['3','0','Whole quantity'],['3','-1','Whole quantity'],['3','2.5','Whole quantity'],['-1','3','Whole quantity'],
    ['1000000','1000','Total: 1000000000'],['1000001','3','Whole quantity'],['3','1001','Whole quantity'],['1e2','3','Total: 300']
  ]) {
    await page.locator('#price').fill(price);await page.locator('#quantity').fill(quantity);await page.locator('#calculate').click();
    assert.ok((await text('#output')).includes(expected),JSON.stringify({price,quantity,expected}));pass(`input: ${JSON.stringify([price,quantity])}`);
  }
  await visit('texts');await page.locator('#process').click();
  assert.equal(await text('#output'),'Name: Omar | Same as omar: true | Contains mar: true | Tags: code / web / art');pass('text: trim, search, compare, split, join');
  await page.locator('#name').fill('OMAR');await page.locator('#tags').fill('code,,web,');await page.locator('#process').click();
  assert.equal(await text('#output'),'Name: OMAR | Same as omar: true | Contains mar: true | Tags: code / web');pass('text: case and empty pieces');
  await page.locator('#name').fill('  ');await page.locator('#process').click();assert.equal(await text('#output'),'Enter a name.');pass('text: empty name');
  await page.locator('#name').fill('<b>Omar</b>');await page.locator('#tags').fill('');await page.locator('#process').click();
  assert.equal(await page.locator('#output b').count(),0);assert.ok((await text('#output')).includes('<b>Omar</b>'));pass('text: markup remains data');
  await visit('errors');await page.locator('#read').click();assert.equal(await text('#output'),'Items: milk / bread');pass('errors: valid JSON');
  for(const data of ['[','["milk",]','null','42','{}','["milk",5]','[null]','[" "]',JSON.stringify(Array(21).fill('x')),JSON.stringify(['x'.repeat(81)])]) {
    await page.locator('#data').fill(data);await page.locator('#read').click();
    assert.ok((await text('#status')).startsWith('Cannot read'));assert.equal(await text('#output'),'Items: milk / bread');pass('errors: rejected '+data.slice(0,40));
  }
  await page.locator('#data').fill('[]');await page.locator('#read').click();assert.equal(await text('#status'),'Read 0 items.');pass('errors: empty list');

  await visit('storage');await page.locator('#load').click();assert.ok((await text('#status')).startsWith('No saved list'));pass('storage: missing key');
  await page.locator('#items').fill(' milk \n\nbread');await page.locator('#save').click();assert.equal(await text('#status'),'Saved 2 items on this browser.');pass('storage: save normalized list');
  await page.close();page=await context.newPage();await visit('storage');await page.locator('#load').click();assert.equal(await page.locator('#items').inputValue(),'milk\nbread');pass('storage: close, reopen, restore');
  await page.locator('#items').fill('unsaved');await page.locator('#load').click();assert.equal(await page.locator('#items').inputValue(),'milk\nbread');pass('storage: explicit load replaces edit');
  for(const value of ['[','null','[5]',JSON.stringify(Array(21).fill('x')),JSON.stringify(['x'.repeat(81)])]) {
    await page.evaluate(value=>localStorage.setItem('foundations-list-v1',value),value);await page.locator('#items').fill('keep me');await page.locator('#load').click();
    assert.ok((await text('#status')).startsWith('Cannot load'));assert.equal(await page.locator('#items').inputValue(),'keep me');pass('storage: invalid saved data preserves editor');
  }
  await page.locator('#items').fill(Array(21).fill('item').join('\n'));await page.locator('#save').click();assert.ok((await text('#status')).startsWith('Not saved'));pass('storage: excessive item count');
  await page.locator('#items').fill('');await page.locator('#save').click();await page.locator('#items').fill('unsaved');await page.locator('#load').click();assert.equal(await page.locator('#items').inputValue(),'');pass('storage: empty saved list differs from missing');
  await page.evaluate(()=>{Storage.prototype.setItem=function(){throw new DOMException('test quota','QuotaExceededError');};});
  await page.locator('#items').fill('keep this');await page.locator('#save').click();assert.ok((await text('#status')).startsWith('Not saved'));assert.equal(await page.locator('#items').inputValue(),'keep this');pass('storage: denied write preserves text');

  await visit('shopping');await page.locator('#remove').click();assert.equal(await text('#status'),'The list is already empty.');pass('project: empty removal');
  for(const [name,quantity] of [['  ','1'],['milk','0'],['milk','2.5'],['milk','abc'],['x'.repeat(61),'1']]){
    await page.locator('#name').fill(name);await page.locator('#quantity').fill(quantity);await page.locator('#add').click();assert.equal(await page.locator('#list li').count(),0);pass('project: invalid input leaves list alone');
  }
  for(const [name,quantity] of [['milk','3'],['bread','2']]) {await page.locator('#name').fill(name);await page.locator('#quantity').fill(quantity);await page.locator('#add').click();}
  assert.deepEqual(await page.locator('#list li').allTextContents(),['3 x milk','2 x bread']);await page.locator('#save').click();pass('project: add and save');
  await page.close();page=await context.newPage();await visit('shopping');await page.locator('#load').click();assert.deepEqual(await page.locator('#list li').allTextContents(),['3 x milk','2 x bread']);pass('project: restore after closing');
  await page.locator('#remove').click();assert.deepEqual(await page.locator('#list li').allTextContents(),['3 x milk']);pass('project: remove last');
  await page.locator('#name').fill('<b>milk</b>');await page.locator('#quantity').fill('1');await page.locator('#add').click();assert.equal(await page.locator('#list b').count(),0);pass('project: safe text rendering');
  const before=await page.locator('#list li').allTextContents();
  for(const invalid of ['[','null','[5]',JSON.stringify(Array(21).fill('x'))]) {
    await page.evaluate(value=>localStorage.setItem('foundations-shopping-v1',value),invalid);await page.locator('#load').click();assert.deepEqual(await page.locator('#list li').allTextContents(),before);assert.ok((await text('#status')).startsWith('Cannot load'));pass('project: corrupt saved data preserves list');
  }
  await page.evaluate(()=>{Storage.prototype.getItem=function(){throw new DOMException('test access','SecurityError');};});await page.locator('#load').click();assert.deepEqual(await page.locator('#list li').allTextContents(),before);pass('project: denied read preserves list');
  await page.evaluate(()=>{Storage.prototype.setItem=function(){throw new DOMException('test quota','QuotaExceededError');};});await page.locator('#save').click();assert.ok((await text('#status')).startsWith('Not saved'));assert.deepEqual(await page.locator('#list li').allTextContents(),before);pass('project: failed write is never reported as success');
  await visit('shopping');await page.locator('#name').fill('item');await page.locator('#quantity').fill('1');for(let i=0;i<21;i++)await page.locator('#add').click();assert.equal(await page.locator('#list li').count(),20);assert.ok((await text('#status')).includes('full'));pass('project: item limit');
  for(let i=0;i<20;i++)await page.locator('#remove').click();await page.locator('#save').click();await page.reload();await page.locator('#load').click();assert.equal(await page.locator('#list li').count(),0);assert.equal(await text('#status'),'Loaded 0 items.');pass('project: empty save and restore');
  await page.setViewportSize({width:390,height:844});
  for(const name of Object.keys(examples)) {
    await visit(name);
    if(name==='shopping'){await page.locator('#name').fill('x'.repeat(60));await page.locator('#add').click();}
    const size=await page.evaluate(()=>({width:innerWidth,actual:document.documentElement.scrollWidth}));assert.ok(size.actual<=size.width+1,name+': mobile overflow '+JSON.stringify(size));pass(name+': mobile layout');
    await fs.mkdir('planning/audit-results',{recursive:true});await page.screenshot({path:`planning/audit-results/practice-${name}-mobile.png`});
  }
  assert.deepEqual(errors,[]);
  await fs.writeFile('planning/audit-results/practice-checks.json',JSON.stringify({checks,results,errors},null,2)+'\n');
  console.log(`PASS: ${checks} example, parity, validation, persistence, failure, and mobile checks.`);
} finally {await browser.close();await new Promise(resolve=>server.close(resolve));}
