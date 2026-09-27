import { access, mkdir, mkdtemp, writeFile, unlink, rmdir } from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import process from 'node:process';
import { execFileSync } from 'node:child_process';
import { chromium } from 'playwright-core';
import {inspectPrintHtml, selectPrintPart} from './pdf-sections.mjs';

const targetUrl = process.env.DOCS_PRINT_URL ?? 'http://localhost:4321/print/all/';
const outputPath = path.resolve('output/pdf/omar-dev-notes-complete.pdf');
const browserCandidates = [
 process.env.PLAYWRIGHT_BROWSER_PATH,
 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
 'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
 'C:/Program Files/Google/Chrome/Application/chrome.exe',
 '/usr/bin/microsoft-edge', '/usr/bin/google-chrome', '/usr/bin/chromium',
].filter(Boolean);
let executablePath;
for (const candidate of browserCandidates) {
 try { await access(candidate); executablePath = candidate; break; } catch {}
}
if (!executablePath) throw new Error('Set PLAYWRIGHT_BROWSER_PATH to an installed Chromium browser.');

const pythonCandidates = [
 process.env.PYTHON_BINARY,
 path.join(os.homedir(), '.cache/codex-runtimes/codex-primary-runtime/dependencies/python/python.exe'),
 'python3', 'python',
].filter(Boolean);
let python;
for (const candidate of pythonCandidates) {
 try { execFileSync(candidate, ['-c', 'import pypdf, reportlab'], { windowsHide: true, stdio: 'pipe' }); python = candidate; break; } catch {}
}
if (!python) throw new Error('Install Python with pypdf and reportlab, or set PYTHON_BINARY to the bundled Python runtime.');

await mkdir(path.dirname(outputPath), { recursive: true });
await mkdir('tmp/pdfs', { recursive: true });
const temporary = await mkdtemp(path.resolve('tmp/pdfs/docs-'));
const createdFiles = [];
const browser = await chromium.launch({ executablePath, headless: true, args: ['--disable-dev-shm-usage'] });
try {
 const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
 const sourceResponse = await fetch(targetUrl);
 if (!sourceResponse.ok) throw new Error('Print page failed with HTTP '+sourceResponse.status);
 const sourceHtml = await sourceResponse.text();
 const {sections,documentCount} = inspectPrintHtml(sourceHtml);
 if (sections.length !== 14 || !documentCount) throw new Error('Expected seven sections for each of two languages');
 let currentHtml='';
 const printPath=new URL(targetUrl).pathname;
 await page.route('**/*', async route=>{
  if(route.request().resourceType()==='document' && new URL(route.request().url()).pathname===printPath)
   return route.fulfill({status:200,contentType:'text/html; charset=utf-8',body:currentHtml});
  return route.continue();
 });
 await page.emulateMedia({ media: 'print' });
 // Large pages can still be parsing after network-idle. Export complete,
 // bounded sections, then merge and add continuous page numbers.
 const parts = [{ id: 'cover', label: 'Contents', locale: '' }, ...sections];
 const manifest = [];
 let included = 0;
 for (const [index, part] of parts.entries()) {
  // Split the complete HTML before the browser parses it. Printing after
  // network-idle alone can otherwise capture a still-incomplete document.
  const selected=selectPrintPart(sourceHtml,part);
  currentHtml=selected.html;
  const partUrl=new URL(targetUrl);partUrl.searchParams.set('pdf-part',part.id);
  await page.goto(partUrl.href,{waitUntil:'load',timeout:120_000});
  await page.locator('#print-complete').waitFor({state:'attached'});
  const visible=await page.locator('article.document').count();
  if(visible!==selected.count)throw new Error('Incomplete browser parse for '+part.id);
  await page.evaluate(async()=>{
   await document.fonts.ready;
   document.querySelectorAll('details').forEach(detail=>{detail.open=true;});
   await Promise.all([...document.images].filter(image=>!image.complete).map(image=>new Promise(resolve=>{
    image.addEventListener('load',resolve,{once:true});image.addEventListener('error',resolve,{once:true});
   })));
  });
  if (part.id !== 'cover' && !visible) throw new Error('Empty PDF section: ' + part.id);
  included += visible;
  const filename = path.join(temporary, String(index).padStart(2, '0') + '.pdf');
  await page.pdf({
   path: filename, format: 'A4', printBackground: true, preferCSSPageSize: true,
   displayHeaderFooter: false, margin: { top: '16mm', right: '15mm', bottom: '18mm', left: '15mm' },
   timeout: 120_000,
  });
  createdFiles.push(filename);
  manifest.push({ file: filename, label: (part.locale ? part.locale.toUpperCase() + ' - ' : '') + part.label, documents: visible });
  console.log('Exported ' + part.id + ': ' + visible + ' documents');
 }
 if (included !== documentCount) throw new Error('PDF sections did not include every document: ' + included + '/' + documentCount);
 const manifestPath = path.join(temporary, 'manifest.json');
 await writeFile(manifestPath, JSON.stringify(manifest));
 createdFiles.push(manifestPath);
 const result = execFileSync(python, [path.resolve('scripts/merge-docs-pdf.py'), manifestPath, outputPath], { windowsHide: true, encoding: 'utf8', maxBuffer: 10 * 1024 * 1024 });
 await mkdir('planning/audit-results', { recursive: true });
 await writeFile('planning/audit-results/pdf-export.json', result);
 console.log('Created ' + outputPath + ' from ' + included + ' documents in ' + sections.length + ' sections.');
} finally {
 await browser.close();
 for (const filename of createdFiles) await unlink(filename).catch(() => {});
 await rmdir(temporary).catch(() => {});
}
