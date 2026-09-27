import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import { spawn, spawnSync } from 'node:child_process';
import { chromium } from 'playwright-core';
import { startLab } from '../public/examples/network-lab/lab.mjs';

const checks=[];
function check(condition, label) { assert.ok(condition,label); checks.push(label); }
const browser = await chromium.launch({executablePath:process.env.PLAYWRIGHT_BROWSER_PATH || 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',headless:true});
const folder=await fs.mkdtemp(path.join(os.tmpdir(),'foundations-server-test-'));
let child, lab;
try {
  for(const name of ['serve.mjs','data-file.mjs','one-function.html','one-input.html','one-name.html','one-error.html','records.html','render.html','shopping-stage-1.html','shopping-stage-2.html','shopping-stage-3.html','shopping.html','storage.html']) {
    await fs.copyFile('public/examples/first-program/'+name,path.join(folder,name));
  }
  const runFile=mode=>spawnSync(process.execPath,[path.join(folder,'data-file.mjs'),mode],{cwd:folder,encoding:'utf8',windowsHide:true});
  const missing=runFile('read');check(missing.status===1 && missing.stdout.includes('No saved file'),'File exercise handles missing data');
  check(runFile('save').status===0,'File exercise creates a new data file');
  check(runFile('read').stdout.trim()==='milk / bread','A fresh process restores file data');
  check(runFile('save').status===1,'File exercise refuses accidental overwrite');
  await fs.writeFile(path.join(folder,'practice-list.json'),'[');
  check(runFile('read').status===1,'File exercise rejects malformed saved JSON');
  await fs.writeFile(path.join(folder,'practice-list.json'),'["tea"]');
  check(runFile('read').stdout.trim()==='tea','File exercise recovers after repairing data');
  child=spawn(process.execPath,[path.join(folder,'serve.mjs')],{env:{...process.env,PRACTICE_PORT:'0'},windowsHide:true,stdio:['ignore','pipe','pipe']});
  const base=await new Promise((resolve,reject)=>{
    const timer=setTimeout(()=>reject(new Error('Practice server did not start')),10000);
    let stdout='';child.stdout.on('data',chunk=>{stdout+=chunk;const match=stdout.match(/http:\/\/127.0.0.1:\d+/);if(match){clearTimeout(timer);resolve(match[0]);}});
    child.once('error',reject);child.once('exit',code=>{clearTimeout(timer);reject(new Error('Practice server exited '+code));});
  });
  check((await fetch(base+'/missing.html')).status===404,'Own server reports a missing file');
  check((await fetch(base+'/serve.mjs')).status===404,'Own server serves only practice content types');
  check((await fetch(base+'/one-function.html',{method:'POST'})).status===405,'Own server rejects writes');
  check((await fetch(base+'/%2e%2e%5csecret.html')).status===404,'Own server rejects parent paths');
  const context=await browser.newContext();const page=await context.newPage();const errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  const visit=async name=>page.goto(base+'/'+name+'.html');
  await visit('one-function');check((await page.locator('#output').textContent())==='14','One function returns14');
  await visit('one-input');
  for(const [value,expected] of [['12.5','12.5'],['  ','Enter a price.'],['abc','Enter a number.']]){
    await page.locator('#price').fill(value);await page.locator('#read').click();check(await page.locator('#output').textContent()===expected,'Single input: '+JSON.stringify(value));
  }
  await visit('one-name');await page.locator('#clean').click();check(await page.locator('#output').textContent()==='Omar','Single name trims only the displayed copy');
  check(await page.locator('#name').inputValue()==='  Omar  ','Single name preserves input');
  await visit('one-error');await page.locator('#read').click();check((await page.locator('#output').textContent()).includes('Incomplete'),'One parse failure gets a useful message');
  await visit('records');check(await page.locator('#output').textContent()==='milk: 4','Record quantity changes separately from its name');
  await visit('render');const before=await page.locator('#sample').boundingBox();await page.locator('#grow').click();const after=await page.locator('#sample').boundingBox();check(after.width>before.width && after.height>before.height,'Rendering experiment changes measurable geometry');
  for(let stage=1;stage<=3;stage++){
    await visit('shopping-stage-'+stage);await page.locator('#name').fill('milk');await page.locator('#quantity').fill('3');await page.locator('#add').click();check(await page.locator('#list').innerText()==='3 x milk','Shopping stage'+stage+' adds valid input');
    if(stage>=2){await page.locator('#quantity').fill('2.5');await page.locator('#add').click();check(await page.locator('#list li').count()===1,'Shopping stage'+stage+' rejects invalid input');}
    if(stage===3){await page.locator('#remove').click();await page.locator('#remove').click();check(await page.locator('#list li').count()===0,'Removal stage handles empty data');}
  }
  await visit('storage');await page.locator('#items').fill('from my local server');await page.locator('#save').click();await page.close();const reopened=await context.newPage();await reopened.goto(base+'/storage.html');await reopened.locator('#load').click();check(await reopened.locator('#items').inputValue()==='from my local server','Own server supports persistence across reopening');
  check(errors.length===0,'New beginner examples have no uncaught errors');await context.close();

  lab=await startLab({clientPort:0,apiPort:0,quiet:true});
  for(const [route,status] of [['/api/products/1',200],['/api/products/2',404],['/api/products/abc',400],['/missing',404],['/failure',500]]){
    const response=await fetch(lab.apiOrigin+route);check(response.status===status,route+' status '+status);check(Boolean(response.headers.get('x-request-id')),route+' has request correlation');
  }
  const product=await (await fetch(lab.apiOrigin+'/api/products/1')).json();assert.deepEqual(product,{id:1,name:'Notebook',price:20,currency:'EGP'});checks.push('Product contract includes exact field values and types');
  const method=await fetch(lab.apiOrigin+'/api/products/1',{method:'POST'});check(method.status===405 && method.headers.get('allow')==='GET, HEAD','API rejects unsupported method explicitly');
  const first=await fetch(lab.apiOrigin+'/cache');check(first.status===200 && first.headers.get('cache-control')==='public, max-age=2','First cache response supplies content and freshness');
  const conditional=await fetch(lab.apiOrigin+'/cache',{headers:{'If-None-Match':first.headers.get('etag')}});check(conditional.status===304 && await conditional.text()==='','Unchanged conditional response is304 without a body');
  await fs.writeFile(path.join(folder,'cache-headers.txt'),'If-None-Match: "lesson-v1"\n');
  const windowsCurl = await new Promise((resolve,reject)=>{
    const ps=spawn('powershell.exe',['-NoProfile','-NonInteractive','-Command',`curl.exe -i -H "@cache-headers.txt" ${lab.apiOrigin}/cache`],{cwd:folder,windowsHide:true,stdio:['ignore','pipe','pipe']});
    let output='';ps.stdout.on('data',chunk=>output+=chunk);ps.on('error',reject);ps.on('close',code=>code===0?resolve(output):reject(new Error('Windows curl failed: '+code)));
  });
  check(windowsCurl.includes('304 Not Modified'),'Published header-file command works in Windows PowerShell');
  const changed=await fetch(lab.apiOrigin+'/cache',{headers:{'If-None-Match':'"other"'}});check(changed.status===200,'Different cache validator receives full content');
  const proxy=await fetch(lab.clientOrigin+'/proxy');check(proxy.headers.get('x-request-id')===proxy.headers.get('x-upstream-request-id'),'One proxy preserves request correlation');assert.deepEqual(await proxy.json(),product);checks.push('Proxy returns the same product');
  const webhook=async body=>(await fetch(lab.apiOrigin+'/webhook',{method:'POST',headers:{'Content-Type':'application/json'},body}));
  const one=await (await webhook('{"id":"order-1"}')).json(),two=await (await webhook('{"id":"order-1"}')).json();
  check(!one.duplicate && two.duplicate && two.processedCount===1,'Repeated webhook has one effect');check((await webhook('[')).status===400,'Malformed webhook is rejected');check((await webhook('{"id":2}')).status===400,'Invalid event identifier is rejected');
  const limits=[];for(let i=0;i<3;i++)limits.push((await fetch(lab.apiOrigin+'/limited')).status);assert.deepEqual(limits,[200,200,429]);checks.push('Fixed-window lab rate limit is reproducible');
  const labContext=await browser.newContext();const labPage=await labContext.newPage();const labErrors=[];labPage.on('pageerror',e=>labErrors.push(e.message));
  await labPage.goto(lab.clientOrigin);
  await labPage.locator('#blocked').click();await labPage.waitForFunction(()=>document.querySelector('#output').textContent.startsWith('Blocked:'));checks.push('Real browser blocks reading response without CORS permission');
  await labPage.locator('#allowed').click();await labPage.waitForFunction(()=>document.querySelector('#output').textContent.includes('The response reached'));checks.push('Real browser reads response with CORS permission');
  await labPage.locator('#proxy').click();await labPage.waitForFunction(()=>document.querySelector('#output').textContent.includes('Notebook'));checks.push('Browser proxy action works');
  let polls=0,streams=0;labPage.on('request',r=>{if(r.url().endsWith('/proxy-clock'))polls++;if(r.url().endsWith('/proxy-events'))streams++;});
  await labPage.locator('#poll').click();await labPage.waitForFunction(()=>!document.querySelector('#poll').disabled);check(polls===3,'Polling performs exactly three browser requests');
  await labPage.locator('#sse').click();await labPage.waitForFunction(()=>document.querySelector('#output').textContent.includes('Event 3'));check(streams===1,'SSE delivers three events in one browser request');
  check((await labPage.locator('#output').innerText()).trim()==='Event 1\nEvent 2\nEvent 3','SSE event order matches the lesson');
  await labPage.setViewportSize({width:390,height:844});check(await labPage.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'Local lab fits a phone viewport');check(labErrors.length===0,'Local lab has no uncaught browser errors');
  await labPage.screenshot({path:'planning/audit-results/network-lab-mobile.png'});await labContext.close();
  const output={checks:checks.length,results:checks};await fs.writeFile('planning/audit-results/progression-checks.json',JSON.stringify(output,null,2)+'\n');console.log('PASS: '+checks.length+' staged-example, local-server, API, proxy, cache, CORS, polling, SSE, webhook, and failure checks.');
} finally {
  await lab?.close();
  if(child && child.exitCode===null){child.kill();await new Promise(resolve=>child.once('exit',resolve));}
  await browser.close();
  // The only removed directory is the exact fresh test directory under the OS temp root.
  if(path.dirname(folder)===path.resolve(os.tmpdir()) && path.basename(folder).startsWith('foundations-server-test-'))await fs.rm(folder,{recursive:true,force:true});
}
