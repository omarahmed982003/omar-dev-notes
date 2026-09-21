import type { APIRoute } from 'astro';
import { readFile } from 'node:fs/promises';

export const prerender = true;

export const GET: APIRoute = async () => {
	const pdf = await readFile(
		new URL('../../../output/pdf/omar-dev-notes-complete.pdf', import.meta.url),
	);

	return new Response(pdf, {
		headers: {
			'Content-Type': 'application/pdf',
			'Content-Disposition': 'attachment; filename="omar-dev-notes-complete.pdf"',
			'Content-Length': String(pdf.byteLength),
		},
	});
};
