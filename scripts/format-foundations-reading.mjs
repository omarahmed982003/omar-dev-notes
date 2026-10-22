import {readFile, writeFile, rename} from 'node:fs/promises';

// Scoped mechanical formatting: never changes code fences, tables, or HTML blocks.
const curriculum=JSON.parse(await readFile('src/data/foundations-curriculum.json','utf8'));
const all=['programming-basics',...curriculum.flatMap(g=>[g.guide,...g.lessons])];
const marker='<span class="foundations-reading-scope" aria-hidden="true"></span>';
const title=source=>source.match(/^title:\s*(.+)$/m)?.[1].replace(/^"|"$/g,'');
let changed=0;
for(const locale of ['', 'en/']) {
  const sources=new Map();
  for(const route of all){
    const file=`src/content/docs/${locale}${route}${route==='programming-basics'||curriculum.some(g=>g.guide===route&&route!=='programming-basics/networking-next')?'/index':''}.md`;
    sources.set(route,{file,source:(await readFile(file,'utf8')).replace(/\r\n/g,'\n')});
  }
  for(const [route,entry] of sources){
    const original=entry.source;
    const boundary=original.indexOf('\n---',3);
    if(boundary<0)throw new Error(`Frontmatter: ${entry.file}`);
    let front=original.slice(0,boundary);
    let body=original.slice(boundary+4).trim().replace(marker,'').trim();
    body=body.replace(/^.*^- \[[^\]]+\]\(\/(?:en\/)?programming-basics\/(?:19-dns-protection|23-tls-handshake-details)\/\)\r?\n?/gm,'');
    body=body.replace(/\/(en\/)?programming-basics\/19-dns-protection\//g,'/$1programming-basics/02-dns-and-ip/#dns-security');
    body=body.replace(/\/(en\/)?programming-basics\/23-tls-handshake-details\//g,'/$1programming-basics/06-https-tls-certificates/#tls-handshake');
    const finalQuiz=body.match(/## (?:راجع الموضوع ده|Check this topic)\n[\s\S]*?<\/section>\s*<\/div>/);
    if(finalQuiz){body=body.replace(finalQuiz[0],'').trim()+'\n\n'+finalQuiz[0];}
    const group=curriculum.find(g=>g.lessons.includes(route));
    if(group){
      const index=group.lessons.indexOf(route);
      const prev=index?group.lessons[index-1]:group.guide;
      const next=group.lessons[index+1];
      const nav=r=>JSON.stringify({link:`/${locale}${r}/`,label:title(sources.get(r).source)});
      front=front.replace(/^prev:.*\n?/m,'').replace(/^next:.*\n?/m,'').replace(/(sidebar:\s*\n\s+order:)\s*\d+/,`$1 ${index+1}`);
      front=front.trimEnd()+`\nprev: ${nav(prev)}\nnext: ${next?nav(next):'false'}`;
      const nextHeading=body.match(/\n## (?:الخطوة التالية|Next step)\n[\s\S]*$/);
      if(nextHeading&&next){
        const heading=locale?'Next step':'الخطوة التالية';
        body=body.slice(0,nextHeading.index)+`\n\n## ${heading}\n\n[${title(sources.get(next).source)}](/${locale}${next}/).`;
      }
    }
    // Keep one idea per paragraph; split only long ordinary prose at sentence boundaries.
    let fenced=false;
    body=body.split('\n').flatMap(line=>{
      if(/^```/.test(line)){fenced=!fenced;return[line];}
      if(fenced||/^\s*(?:<|\||#|[-*] |\d+\. )/.test(line)||line.includes('</')||line.length<330)return[line];
      const sentences=line.split(/(?<=[.!؟?。])\s+(?=[\p{L}*`])/u);
      if(sentences.length<2)return[line];
      const paragraphs=[];let current='';
      for(const sentence of sentences){if(current&&current.length+sentence.length>300){paragraphs.push(current);current='';}current+=(current?' ':'')+sentence;}
      if(current)paragraphs.push(current);
      return[paragraphs.join('\n\n')];
    }).join('\n').replace(/\n{3,}/g,'\n\n');
    // Guide lists follow the same canonical curriculum as sidebar and print pages.
    const guide=curriculum.find(g=>g.guide===route);
    if(guide&&route.endsWith('/computer-in-depth')){
      const lines=guide.lessons.map(r=>`- [${title(sources.get(r).source)}](/${locale}${r}/)`).join('\n');
      body=body.replace(/(## (?:امشِ بالترتيب ده|Learning order)\n\n)(?:- .*\n?)+/,`$1${lines}\n`);
    }
    const output=front+'\n---\n\n'+marker+'\n\n'+body.trim()+'\n';
    if(output!==original){await writeFile(entry.file+'.reading-tmp',output,{flag:'wx'});await rename(entry.file+'.reading-tmp',entry.file);changed++;}
  }
}
console.log(JSON.stringify({activePages:all.length*2,changed}));
