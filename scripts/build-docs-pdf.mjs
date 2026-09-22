import { access, mkdir } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { chromium } from 'playwright-core';

const targetUrl = process.env.DOCS_PRINT_URL ?? 'http://127.0.0.1:4322/print/all/';
const outputPath = path.resolve('output/pdf/omar-dev-notes-complete.pdf');
const browserCandidates = [
	process.env.PLAYWRIGHT_BROWSER_PATH,
	'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
	'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
	'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
	'/usr/bin/microsoft-edge',
	'/usr/bin/google-chrome',
	'/usr/bin/chromium',
].filter(Boolean);

let executablePath;
for (const candidate of browserCandidates) {
	try {
		await access(candidate);
		executablePath = candidate;
		break;
	} catch {
		// Try the next locally installed browser.
	}
}

if (!executablePath) {
	throw new Error('No supported browser was found. Set PLAYWRIGHT_BROWSER_PATH to Edge, Chrome, or Chromium.');
}

await mkdir(path.dirname(outputPath), { recursive: true });
const browser = await chromium.launch({ executablePath, headless: true, args: ['--disable-dev-shm-usage'] });

try {
	const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
	const response = await page.goto(targetUrl, { waitUntil: 'networkidle', timeout: 120_000 });
	if (!response?.ok()) throw new Error('Print page failed with HTTP ' + response?.status());

	await page.evaluate(async () => {
		await document.fonts.ready;
		document.querySelectorAll('details.quiz-answer').forEach((details) => {
			details.open = true;
		});
		await Promise.all(
			Array.from(document.images)
				.filter((image) => !image.complete)
				.map((image) => new Promise((resolve) => {
					image.addEventListener('load', resolve, { once: true });
					image.addEventListener('error', resolve, { once: true });
				})),
		);
	});

	await page.emulateMedia({ media: 'print' });
	await page.pdf({
		path: outputPath,
		format: 'A4',
		printBackground: true,
		preferCSSPageSize: true,
		displayHeaderFooter: true,
		headerTemplate: '<span></span>',
		footerTemplate: '<div style="box-sizing:border-box;width:100%;padding:0 15mm;font:8px Arial;color:#718096;display:flex;justify-content:space-between;"><span>Omar Dev Notes</span><span><span class="pageNumber"></span> / <span class="totalPages"></span></span></div>',
		margin: { top: '16mm', right: '15mm', bottom: '18mm', left: '15mm' },
		timeout: 120_000,
	});
	console.log('Created ' + outputPath);
} finally {
	await browser.close();
}
