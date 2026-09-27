import assert from 'node:assert/strict';
import fs from 'node:fs';

const config=fs.readFileSync('astro.config.mjs','utf8').replaceAll('\r','');
const start=config.indexOf('\n{',config.indexOf('sidebar: ['));
const end=config.indexOf("\n\t\t\t\t{\n\t\t\t\t\tlabel: 'لغة C++'",start);
const section=JSON.parse(config.slice(start,end).trim().replace(/,$/,''));
const groups=section.items.slice(1);
assert.deepEqual(groups.map(group=>group.label),['استخدام الكمبيوتر','أساسيات البرمجة وتطبيقاتها','الرياضيات وحل المشكلات','داخل الكمبيوتر وأدوات التطوير','الشبكات والويب']);
function links(item){return item.link?[item.link]:(item.items||[]).flatMap(links);}
const entries=links(section);
assert.equal(entries.length,new Set(entries).size,'A page is listed twice');
assert.equal(entries.length,95);
const expectedCounts=[12,14,14,16,33];
assert.deepEqual(groups.map(group=>links(group).filter(link=>/\/\d[^/]*$/.test(link)).length),expectedCounts);
const actual=fs.readdirSync('src/content/docs/programming-basics',{recursive:true}).filter(f=>f.endsWith('.md')).map(f=>'programming-basics/'+f.replaceAll('\\','/').replace(/\.md$/,'').replace(/\/index$/,'').replace(/\/index$/,''));
assert.deepEqual([...entries].sort(),actual.map(id=>id==='programming-basics/index'?'programming-basics':id).sort());
for(const locale of ['', 'en/']) {
  for(const group of groups) {
    const lessonIds=links(group).filter(link=>/\/\d[^/]*$/.test(link));
    const orders=lessonIds.map(id=>{
      const source=fs.readFileSync(`src/content/docs/${locale}${id}.md`,'utf8');
      assert.ok(source.includes('sidebar:'),id);
      return Number(source.match(/^  order: (\d+)$/m)?.[1]);
    });
    assert.ok(orders.every((value,index)=>Number.isFinite(value)&&(!index||value>orders[index-1])),JSON.stringify({locale,group:group.label,orders}));
  }
}
const base=process.env.AUDIT_BASE_URL||'http://localhost:4321';
const html=await (await fetch(base+'/print/all/')).text();
const printed=[...html.matchAll(/id="doc-((?:en\/)?programming-basics(?:\/[^"]*)?)"/g)].map(match=>match[1]);
for(const locale of ['', 'en/'])assert.deepEqual(printed.filter(id=>locale?id.startsWith('en/'):!id.startsWith('en/')),entries.map(id=>locale+id),'Print order must match sidebar learning order');
const result={sections:5,lessons:89,guides:6,pagesBothLanguages:190,sectionLessons:expectedCounts,printOrderMatches:true};
fs.writeFileSync('planning/audit-results/structure-checks.json',JSON.stringify(result,null,2)+'\n');
console.log('PASS: '+JSON.stringify(result));
