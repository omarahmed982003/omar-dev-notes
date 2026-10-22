import {readFile,writeFile,mkdir,mkdtemp,access} from 'node:fs/promises';
import {execFileSync,spawnSync} from 'node:child_process';
import path from 'node:path';
import assert from 'node:assert/strict';
import {chromium} from 'playwright-core';

const curriculum=JSON.parse(await readFile('src/data/foundations-curriculum.json','utf8'));
const routes=['programming-basics',...curriculum.flatMap(g=>[g.guide,...g.lessons])];
const sourcePath=(route,en=false)=>`src/content/docs/${en?'en/':''}${route}${route==='programming-basics'||curriculum.some(g=>g.guide===route&&g.guide!=='programming-basics/networking-next')?'/index':''}.md`;
const phpBlocks=s=>[...s.matchAll(/```php\n([\s\S]*?)```/g)].map(m=>m[1]);
const psBlocks=s=>[...s.matchAll(/```powershell\n([\s\S]*?)```/g)].map(m=>m[1]);
const results={date:'2026-10-22',routes:routes.length*2,codeParity:[],navigation:[],labs:[],browser:[],limitations:['No claim that every optional network or mathematics lab was executed.','Power-loss durability was not experimentally tested.']};
const sources=new Map();
for(const route of routes){
  const ar=(await readFile(sourcePath(route),'utf8')).replace(/\r\n/g,'\n');
  const en=(await readFile(sourcePath(route,true),'utf8')).replace(/\r\n/g,'\n');
  sources.set(route,ar);
  // Exact code parity is required for the rebuilt core. Older network examples
  // legitimately localize strings; block counts are only an inventory there.
  if(curriculum[0].lessons.includes(route))assert.deepEqual(phpBlocks(ar),phpBlocks(en),`PHP parity: ${route}`);
  if(curriculum[0].lessons.includes(route))assert.deepEqual(psBlocks(ar),psBlocks(en),`PowerShell parity: ${route}`);
  assert.equal(ar.split('foundations-reading-scope').length,2,`Reading marker: ${route}`);
  results.codeParity.push({route,exact:curriculum[0].lessons.includes(route),arBlocks:phpBlocks(ar).length,enBlocks:phpBlocks(en).length});
  const group=curriculum.find(g=>g.lessons.includes(route));
  if(group){
    const segment=(group.stages||[{lessons:group.lessons}]).find(stage=>stage.lessons.includes(route));
    const index=segment.lessons.indexOf(route);
    for(const [lang,source]of[['',ar],['en/',en]]){
      const prev=JSON.parse(source.match(/^prev: (.+)$/m)[1]);
      const next=JSON.parse(source.match(/^next: (.+)$/m)[1]);
      assert.equal(prev.link,`/${lang}${index?segment.lessons[index-1]:group.guide}/`);
      assert.equal(next?.link,segment.lessons[index+1]?`/${lang}${segment.lessons[index+1]}/`:group.stages?`/${lang}${group.guide}/`:undefined);
    }
    results.navigation.push(route);
  }
}
await mkdir('tmp/foundations-validation',{recursive:true});
const work=await mkdtemp(path.resolve('tmp/foundations-validation/run-'));
const php=process.env.FOUNDATIONS_PHP||'C:/Users/omara/.config/herd/bin/php84/php.exe';
const run=(file,expected,status=0)=>{
  const actual=spawnSync(php,[file],{encoding:'utf8',windowsHide:true,cwd:work});
  assert.equal(actual.status,status,actual.stderr||file);
  if(expected!==null)assert.equal(actual.stdout.replace(/\r\n/g,'\n').trim(),expected,file);
  return actual;
};
for(const route of curriculum[0].lessons){
  const blocks=phpBlocks(sources.get(route));
  for(let i=0;i<blocks.length;i++){
    const file=path.join(work,route.split('/').at(-1)+`-${i}.php`);
    await writeFile(file,blocks[i]);
    execFileSync(php,['-l',file],{windowsHide:true});
    let actual;
    if(route.includes('binary-'))actual=run(file,i===0?'1\n2\nd8b9':'0.30000000000000004');
    else if(route.includes('software-and-runtime'))actual=run(file,'Hello Omar');
    else if(route.includes('06-operating'))actual=run(file,'Hello from PHP');
    else if(route.includes('12-memory')){
      actual=run(file,null);const values=actual.stdout.trim().split(/\r?\n/).map(Number);
      assert.equal(values.length,3);assert.ok(values[1]>values[0]);assert.ok(values[2]<values[1]);
    }else if(route.includes('17-terminal')){actual=run(file,'result',3);assert.equal(actual.stderr.trim(),'diagnostic');}
    else if(route.includes('14-running')){
      for(const [grade,expected]of[[-1,'invalid'],[0,'failed'],[49,'failed'],[50,'passed'],[100,'passed'],[101,'invalid']]){
        const variant=path.join(work,`grade-${grade}.php`);await writeFile(variant,blocks[i].replace('$grade = 50;',`$grade = ${grade};`));run(variant,expected);
      }
      actual=run(file,'passed');
    }else if(route.includes('16-testing')){
      actual=run(file,'failed');
      const fixed=path.join(work,'boundary-fixed.php');await writeFile(fixed,blocks[i].replace('$grade > 50','$grade >= 50'));run(fixed,'passed');
    }
    results.labs.push({route,block:i,lint:true,stdout:actual?.stdout.trim(),status:actual?.status});
  }
}
const terminal=psBlocks(sources.get('programming-basics/computer-in-depth/05-os-terminal-files-git'))[0];
const ps=execFileSync('pwsh',['-NoProfile','-NonInteractive','-Command',terminal],{encoding:'utf8',cwd:work,windowsHide:true});
assert.equal((ps.match(/Hello/g)||[]).length,3);
const absolute=await readFile(path.join(work,'terminal practice/note.txt'),'utf8');assert.equal(absolute.trim(),'Hello');
results.labs.push({check:'PowerShell fresh-folder, quoted path, absolute and relative reads',passed:true});

if(process.argv.includes('--browser')){
  const base=process.env.AUDIT_BASE_URL||'http://127.0.0.1:4322';
  const executablePath='C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
  await access(executablePath);
  await mkdir('planning/audit-results/foundations-content-2026-10-22',{recursive:true});
  const browser=await chromium.launch({executablePath,headless:true});
  try{
    const page=await browser.newPage({viewport:{width:1280,height:900}});
    const errors=[];page.on('pageerror',e=>errors.push(e.message));
    for(const en of[false,true])for(const route of routes){
      const url=`/${en?'en/':''}${route}/`;
      const response=await page.goto(base+url,{waitUntil:'load'});assert.equal(response.status(),200,url);
      assert.equal(await page.locator('html').getAttribute('dir'),en?'ltr':'rtl');
      assert.equal(await page.locator('a.language-action').getAttribute('href'),`/${en?'':'en/'}${route}/`);
      assert.equal(await page.locator('.foundations-reading-scope').count(),1,url);
      // Check content links, not unrelated global navigation; anchors must exist too.
      const links=await page.locator('.sl-markdown-content a[href^="/"]').evaluateAll(items=>items.map(a=>a.getAttribute('href')));
      for(const href of new Set(links)){
        if(!href.includes('programming-basics/'))continue;
        const target=await page.request.get(base+href.split('#')[0]);assert.equal(target.status(),200,`${url} -> ${href}`);
        if(href.includes('#')){
          const fragment=decodeURIComponent(href.split('#')[1]);
          const html=await target.text();
          assert.ok(html.includes(`id="${fragment}"`),`${url} -> missing #${fragment}`);
        }
      }
      results.browser.push({route:url,status:200,languageSwitch:true,dir:en?'ltr':'rtl'});
    }
    for(const route of['computer-in-depth/05-ram-memory-buffers','computer-fundamentals/18-media-and-units','06-https-tls-certificates']){
      await page.goto(base+'/programming-basics/'+route+'/',{waitUntil:'load'});
      await page.screenshot({path:`planning/audit-results/foundations-content-2026-10-22/foundations-${route.split('/').at(-1)}-desktop.png`});
      const style=await page.locator('.sl-markdown-content').evaluate(el=>({lineHeight:getComputedStyle(el).lineHeight,fontSize:getComputedStyle(el).fontSize}));
      assert.ok(parseFloat(style.lineHeight)/parseFloat(style.fontSize)>1.9);
      await page.setViewportSize({width:390,height:844});
      assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+2),'Mobile document overflow');
      await page.screenshot({path:`planning/audit-results/foundations-content-2026-10-22/foundations-${route.split('/').at(-1)}-mobile.png`});
      await page.setViewportSize({width:1280,height:900});
    }
    for(const route of['/cpp/','/php/','/php-runtime/','/auth/','/database/']){
      const response=await page.goto(base+route);assert.equal(response.status(),200);
      assert.equal(await page.locator('.foundations-reading-scope').count(),0,'Scoped typography leaked');
    }
    for(const route of['19-dns-protection','23-tls-handshake-details']){
      assert.equal((await page.request.get(base+'/programming-basics/'+route+'/')).status(),200);
    }
    assert.deepEqual(errors,[]);
    results.browserErrors=errors;
  }finally{await browser.close();}
}
await mkdir('planning/audit-results',{recursive:true});
await writeFile('planning/audit-results/foundations-card-2026-10-22.json',JSON.stringify({...results,work},null,2)+'\n');
console.log(JSON.stringify({routes:results.routes,codeParity:results.codeParity.length,navigation:results.navigation.length,labs:results.labs.length,browser:results.browser.length,work}));
