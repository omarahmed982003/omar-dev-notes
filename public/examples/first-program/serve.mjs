// Run beside your practice HTML files: node serve.mjs
import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url));
const types = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.json': 'application/json', '.txt': 'text/plain' };
const server = http.createServer(async (req, res) => {
  try {
    const name = decodeURIComponent(new URL(req.url, 'http://localhost').pathname).slice(1);
    if (!['GET', 'HEAD'].includes(req.method)) { res.writeHead(405, { Allow: 'GET, HEAD' }); return res.end(); }
    if (!name || name !== path.basename(name) || !types[path.extname(name)]) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      return res.end('Open a practice file, for example /storage.html or /shopping.html');
    }
    const filename = await fs.realpath(path.join(root, name));
    if (path.dirname(filename).toLowerCase() !== (await fs.realpath(root)).toLowerCase()) { res.writeHead(404); return res.end(); }
    const data = await fs.readFile(filename);
    res.writeHead(200, { 'Content-Type': types[path.extname(name)] + '; charset=utf-8', 'Cache-Control': 'no-store', 'Content-Length': data.length });
    res.end(req.method === 'HEAD' ? undefined : data);
  } catch { res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' }); res.end('File not found. Check the name and folder.'); }
});
server.on('error', error => { console.error(error.code === 'EADDRINUSE' ? 'Port 8000 is busy. Stop your earlier practice server with Ctrl+C.' : error.message); process.exitCode = 1; });
const port = Number(process.env.PRACTICE_PORT || 8000);
server.listen(port, '127.0.0.1', () => console.log(`Practice server: http://127.0.0.1:${server.address().port}/storage.html — stop with Ctrl+C`));
