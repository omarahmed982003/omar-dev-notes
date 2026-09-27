import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const base='src/content/docs';
const roots=['programming-basics','en/programming-basics'];
const failures=[];let links=0,messages=0,nav=0;
const docs=new Map();
const files=fs.readdirSync(base,{recursive:true}).filter(x=>/\.mdx?$/.test(x)).map(x=>x.replaceAll('\\','/'));
const routeOf=f=>'/'+f.replace(/\.mdx?$/,'').replace(/(^|\/)index$/,'') .replace(/\/$/,'')+'/';
for(const f of files)docs.set(routeOf(f).replace('//','/'),fs.readFileSync(path.join(base,f),'utf8'));
const selected=files.filter(x=>roots.some(r=>x.startsWith(r+'/')));
const check=(condition,message)=>{if(!condition)failures.push(message);};
for(const file of selected){
 const source=fs.readFileSync(path.join(base,file),'utf8').replace(/^\uFEFF/,'').replaceAll('\r','');
 const route=routeOf(file);
 check(/^---\n[\s\S]+?\n---\n/.test(source),file+': frontmatter');
 const title=source.match(/^title:\s*(.+)$/m)?.[1]||'';
 check(!/^"?\d+\s*[.\-—]/.test(title),file+': numbered title');
 check(!/(?:17 درس|17 practical lessons|قبل البرمجة.*درس|الدرس ده مفيهوش اسم تقني جديد)/.test(source),file+': stale scaffolding');
 check(!source.includes('\uFFFD'),file+': replacement character');
 check(!source.includes('{{EXAMPLE:'),file+': unexpanded example');
 const fence=String.fromCharCode(96).repeat(3);
 check(source.split('\n').filter(x=>x.startsWith(fence)).length%2===0,file+': unmatched code fence');
 const withoutCode=source.replace(new RegExp('^'+fence+'[\\s\\S]*?^'+fence,'gm'),'');
 const hrefs=[...withoutCode.matchAll(/\]\((\/[^)\s]+)\)|(?:href|src)="(\/[^"]+)"/g)].map(x=>x[1]||x[2]);
 for(const href of hrefs){
  links++;const url=new URL(href,'https://local.invalid');const pathname=decodeURIComponent(url.pathname);const normalized=pathname.endsWith('/')?pathname:pathname+'/';
  const exists=docs.has(normalized)||fs.existsSync(path.join('public',pathname.slice(1)))||fs.existsSync(path.join('dist',pathname.slice(1)));
  check(exists,file+': missing '+href);
  if(url.hash&&docs.has(normalized)){
   const htmlPath=path.join('dist',pathname.slice(1),'index.html');
   if(fs.existsSync(htmlPath))check(fs.readFileSync(htmlPath,'utf8').includes('id="'+decodeURIComponent(url.hash.slice(1))+'"'),file+': missing anchor '+href);
  }
 }
 for(const direction of ['prev','next']){
  const raw=source.match(new RegExp('^'+direction+': (.+)$','m'))?.[1];
  if(!raw||raw==='false')continue;
  const item=JSON.parse(raw);nav++;const other=docs.get(item.link);
  check(Boolean(other),file+': missing '+direction+' '+item.link);
  if(direction==='next'&&other){
   const back=other.match(/^prev: (.+)$/m)?.[1];check(back&&JSON.parse(back).link===route,file+': next does not link back');
  }
 }
 for(const block of source.matchAll(new RegExp('^'+fence+'http\\n([\\s\\S]*?)^'+fence,'gm'))){
  const length=block[1].match(/^Content-Length: (\d+)$/mi);
  if(length){messages++;const body=block[1].split('\n\n').slice(1).join('\n\n').replace(/\n$/,'');check(Buffer.byteLength(body,'utf8')===Number(length[1]),file+': incorrect Content-Length');}
 }
 const other=file.startsWith('en/')?file.slice(3):'en/'+file;
 check(fs.existsSync(path.join(base,other)),file+': missing translation');
}
for(const root of roots){
 const read=f=>fs.readFileSync(base+'/'+root+'/'+f,'utf8');
 const binary=read('computer-fundamentals/02-binary-data-representation.md');
 check(binary.includes((5).toString(2))&&binary.includes((300).toString(2)),root+': binary examples');
 check(binary.includes(Buffer.from('ع','utf8').toString('hex').toUpperCase().replace(/(..)(..)/,'$1 $2')),root+': Arabic UTF-8 bytes');
 const tls=read('06-https-tls-certificates.md') + read('23-tls-handshake-details.md');
 for(const expansion of ['Domain Validation','Organization Validation','Extended Validation','Certificate Authority','CertificateVerify','EncryptedExtensions'])check(tls.includes(expansion),root+': missing TLS explanation '+expansion);
 const flow=read('math-problem-solving/06-flowcharts-loops-debugging.md');
 check(flow.includes('i ≤ N?')&&flow.includes('sum=6'),root+': loop branches or trace missing');
 const dp=read('math-problem-solving/10-greedy-dynamic-programming.md');
 const table=dp.split('\n').find(x=>/^\| dp\[x\] \|/.test(x));
 const calculated=[0];for(let x=1;x<=6;x++)calculated[x]=Math.min(...[1,3,4].filter(c=>c<=x).map(c=>calculated[x-c]+1));
 const published=table?.split('|').slice(2,-1).map(x=>Number(x.trim()));check(JSON.stringify(calculated)===JSON.stringify(published),root+': coin table results');
}
// The prefix-mask examples in the lesson are independently recalculated.
assert.equal(20 & 192,0);assert.equal(70 & 192,64);
assert.equal(2**(32-26),64);
const summary={pages:selected.length,internalLinks:links,navigationLinks:nav,httpBodies:messages,failures};
fs.mkdirSync('planning/audit-results',{recursive:true});
fs.writeFileSync('planning/audit-results/foundations-checks.json',JSON.stringify(summary,null,2)+'\n');
if(failures.length){console.error(failures.join('\n'));process.exitCode=1;}
else console.log('PASS: '+JSON.stringify(summary));

