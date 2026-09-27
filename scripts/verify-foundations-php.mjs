import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import net from 'node:net';
import {spawn,execFileSync} from 'node:child_process';
const candidates=[process.env.PHP_BINARY,'C:/Users/omara/.config/herd/bin/php84/php.exe','php'].filter(Boolean);
let php;for(const p of candidates){try{execFileSync(p,['-v'],{windowsHide:true,stdio:'pipe'});php=p;break;}catch{}}
assert.ok(php,'Set PHP_BINARY to a PHP executable');
const dir=fs.mkdtempSync(path.join(os.tmpdir(),'foundations-php-check-'));
const fence=String.fromCharCode(96).repeat(3);
let lint=0,runtime=0;
const runFiles=[];
for(const locale of ['', 'en/']){
 const root='src/content/docs/'+locale+'programming-basics';
 for(const rel of fs.readdirSync(root).filter(x=>x.endsWith('.md'))){
  const source=fs.readFileSync(path.join(root,rel),'utf8');
  const blocks=[...source.matchAll(new RegExp('^'+fence+'php\\r?\\n([\\s\\S]*?)^'+fence,'gm'))];
  for(const [i,m] of blocks.entries()){
   const filename=(locale?'en-':'ar-')+rel.replace('.md','')+'-'+i+'.php';
   fs.writeFileSync(path.join(dir,filename),(m[1].startsWith('<?php')?'':'<?php\n')+m[1]);
   execFileSync(php,['-l',path.join(dir,filename)],{windowsHide:true,stdio:'pipe'});lint++;
   if(rel==='05-http-messages-state.md')runFiles.push({locale,filename});
  }
 }
}
const probe=net.createServer();await new Promise(resolve=>probe.listen(0,'127.0.0.1',resolve));const port=probe.address().port;await new Promise(resolve=>probe.close(resolve));
const server=spawn(php,['-S','127.0.0.1:'+port,'-t',dir],{windowsHide:true,stdio:'ignore'});
const base='http://127.0.0.1:'+port;
try{
 let ready=false;for(let i=0;i<50&&!ready;i++){try{await fetch(base);ready=true;}catch{await new Promise(r=>setTimeout(r,100));}}assert.ok(ready,'PHP server started');
 for(const {locale,filename} of runFiles){
  const cases=[
   ['?name=Omar','GET',200,{message:locale?'Hello Omar':'مرحبًا Omar'}],
   ['','GET',200,{message:locale?'Hello Guest':'مرحبًا زائر'}],
   ['?name=%20Omar%20','GET',200,{message:locale?'Hello Omar':'مرحبًا Omar'}],
   ['?name%5B%5D=Omar','GET',400,{error:'name must be text'}],
   ['?name=Omar','POST',405,{error:'Method not allowed'}],
  ];
  for(const [query,method,status,expected] of cases){const r=await fetch(base+'/'+filename+query,{method});assert.equal(r.status,status);assert.match(r.headers.get('content-type'),/application\/json/);if(status===405)assert.equal(r.headers.get('allow'),'GET');assert.deepEqual(await r.json(),expected);runtime++;}
  const invalid=await fetch(base+'/'+filename+'?name=%FF');assert.equal(invalid.status,200);assert.ok((await invalid.json()).message.includes('\uFFFD'));runtime++;
 }
 console.log('PASS: '+lint+' PHP fragments linted; '+runtime+' live HTTP behavior checks.');
 fs.writeFileSync('planning/audit-results/php-checks.json',JSON.stringify({lint,runtime},null,2)+'\n');
}finally{server.kill();}

