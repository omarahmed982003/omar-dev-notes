import { parse, serialize } from 'parse5';

const attr = (node, name) => node.attrs?.find(attribute => attribute.name === name)?.value;
const hasClass = (node, name) => (attr(node, 'class') || '').split(/\s+/).includes(name);
const textOf = node => node.nodeName === '#text' ? node.value : (node.childNodes || []).map(textOf).join('');
function walk(node, predicate, found = []) {
 if (predicate(node)) found.push(node);
 for (const child of node.childNodes || []) walk(child, predicate, found);
 return found;
}
export function inspectPrintHtml(html) {
 const tree = parse(html);
 const documents = walk(tree, node => node.tagName === 'article' && hasClass(node, 'document'));
 const sections = walk(tree, node => hasClass(node, 'section-cover')).map(node => {
  const id = attr(node, 'id');
  return {id,locale:id.startsWith('en-')?'en':'ar',label:textOf(walk(node, child=>child.tagName==='h2')[0]).trim()};
 });
 return {documentCount:documents.length,sections};
}
export function selectPrintPart(html, part) {
 const tree = parse(html);
 const main = walk(tree, node => node.tagName === 'main')[0];
 if (!main) throw new Error('Print page has no main element');
 const cover = part.id === 'cover';
 const prefix = 'doc-' + (part.locale === 'en' ? 'en/' : '') + part.id.slice(part.locale.length + 1);
 main.childNodes = main.childNodes.filter(node => {
  if (hasClass(node,'cover') || hasClass(node,'toc')) return cover;
  if (node.tagName !== 'div' || !attr(node,'lang')) return true;
  if (cover || attr(node,'lang') !== part.locale) return false;
  node.childNodes = node.childNodes.filter(child => {
   if (hasClass(child,'language-cover')) return part.id.endsWith('-programming-basics');
   if (hasClass(child,'section-cover')) return attr(child,'id') === part.id;
   if (hasClass(child,'document')) {
    const id = attr(child,'id');
    return id === prefix || id.startsWith(prefix+'/');
   }
   return true;
  });
  return true;
 });
 const count = walk(main,node=>node.tagName==='article'&&hasClass(node,'document')).length;
 const expected = main.attrs.find(attribute=>attribute.name==='data-document-count');
 if (expected) expected.value=String(count);
 return {html:serialize(tree),count};
}

