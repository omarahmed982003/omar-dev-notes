// A loopback-only teaching lab. Run: node lab.mjs
import http from 'node:http';
import { randomUUID } from 'node:crypto';
import { pathToFileURL } from 'node:url';

export async function startLab({ clientPort = 8765, apiPort = 8766, quiet = false } = {}) {
  let clientOrigin = '';
  const seen = new Set();
  const events = new Set();
  let limitStart = Date.now(), limitCount = 0;
  function send(res, status, value, headers = {}) {
    const body = JSON.stringify(value);
    res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', ...headers });
    res.end(body);
  }
  function observe(req, res) {
    const incoming = req.headers['x-request-id'];
    const id = typeof incoming === 'string' && /^[a-f0-9-]{36}$/.test(incoming) ? incoming : randomUUID();
    res.setHeader('X-Request-Id', id);
    const start = performance.now();
    res.on('finish', () => {
      if (!quiet) console.log(JSON.stringify({ id, method: req.method, path: new URL(req.url, 'http://local').pathname, status: res.statusCode, milliseconds: Math.round(performance.now() - start) }));
    });
    return id;
  }
  async function jsonBody(req) {
    let text = '';
    for await (const chunk of req) {
      text += chunk;
      if (Buffer.byteLength(text) > 8192) throw new Error('Body too large');
    }
    return JSON.parse(text);
  }
  const api = http.createServer(async (req, res) => {
    observe(req, res);
    const url = new URL(req.url, 'http://local');
    if (url.pathname === '/webhook' && req.method === 'POST') {
      if (!(req.headers['content-type'] || '').startsWith('application/json')) return send(res, 415, { error: 'Send application/json' });
      try {
        const value = await jsonBody(req);
        if (!value || typeof value.id !== 'string' || !/^[a-zA-Z0-9_-]{1,60}$/.test(value.id)) return send(res, 400, { error: 'id must contain 1-60 letters, digits, underscores, or hyphens' });
        const duplicate = seen.has(value.id);
        if (!duplicate && seen.size >= 1000) return send(res, 503, { error: 'Restart the teaching lab to clear its in-memory event list' });
        seen.add(value.id);
        return send(res, 200, { duplicate, processedCount: seen.size });
      } catch { return send(res, 400, { error: 'Invalid or oversized JSON' }); }
    }
    if (!['GET', 'HEAD'].includes(req.method)) return send(res, 405, { error: 'Method not allowed' }, { Allow: url.pathname === '/webhook' ? 'POST' : 'GET, HEAD' });
    if (url.pathname === '/cors/no' || url.pathname === '/cors/yes') {
      const headers = url.pathname.endsWith('/yes') ? { 'Access-Control-Allow-Origin': clientOrigin, Vary: 'Origin' } : {};
      return send(res, 200, { message: 'The response reached the browser.' }, headers);
    }
    if (url.pathname === '/cache') {
      const headers = { 'Cache-Control': 'public, max-age=2', ETag: '"lesson-v1"' };
      if (req.headers['if-none-match'] === '"lesson-v1"') {
        res.writeHead(304, headers); return res.end();
      }
      return send(res, 200, { lesson: 'One reusable representation' }, headers);
    }
    if (url.pathname === '/clock') return send(res, 200, { time: new Date().toISOString() });
    if (url.pathname === '/events') {
      res.writeHead(200, { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-store' });
      res.flushHeaders();
      if (req.method === 'HEAD') return res.end();
      let count = 0;
      const timer = setInterval(() => {
        count++;
        res.write(`id: ${count}\ndata: ${JSON.stringify({ count })}\n\n`);
        if (count === 3) { clearInterval(timer); events.delete(timer); res.end(); }
      }, 250);
      events.add(timer);
      res.on('close', () => { clearInterval(timer); events.delete(timer); });
      return;
    }
    if (url.pathname === '/limited') {
      if (Date.now() - limitStart >= 10000) { limitStart = Date.now(); limitCount = 0; }
      limitCount++;
      return limitCount <= 2 ? send(res, 200, { allowed: true }) : send(res, 429, { error: 'Teaching window allows two requests in ten seconds' }, { 'Retry-After': String(Math.max(1, Math.ceil((10000 - (Date.now() - limitStart)) / 1000))) });
    }
    if (url.pathname === '/failure') return send(res, 500, { error: 'Intentional teaching failure' });
    if (url.pathname.startsWith('/api/products/')) {
      const id = url.pathname.slice('/api/products/'.length);
      if (!/^[1-9]\d*$/.test(id)) return send(res, 400, { error: { code: 'INVALID_ID', message: 'Use a positive integer ID' } });
      if (id !== '1') return send(res, 404, { error: { code: 'NOT_FOUND', message: 'Product not found' } });
      return send(res, 200, { id: 1, name: 'Notebook', price: 20, currency: 'EGP' });
    }
    send(res, 404, { error: 'No route here' });
  });
  await listen(api, apiPort);
  const apiOrigin = `http://127.0.0.1:${api.address().port}`;
  const client = http.createServer(async (req, res) => {
    const id = observe(req, res);
    const pathname = new URL(req.url, 'http://local').pathname;
    if (!['GET', 'HEAD'].includes(req.method)) return send(res, 405, { error: 'Method not allowed' }, { Allow: 'GET, HEAD' });
    if (pathname === '/proxy') {
      try {
        const response = await fetch(apiOrigin + '/api/products/1', { headers: { 'X-Request-Id': id }, signal: AbortSignal.timeout(2000) });
        const value = await response.json();
        return send(res, response.status, value, { 'X-Lab-Proxy': 'forwarded', 'X-Upstream-Request-Id': response.headers.get('x-request-id') });
      } catch (error) { return send(res, error.name === 'TimeoutError' ? 504 : 502, { error: 'Upstream unavailable' }); }
    }
    if (pathname !== '/') return send(res, 404, { error: 'No route here' });
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' });
    res.end(`<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Local network lab</title><style>body{font:18px system-ui;max-width:48rem;margin:2rem auto;padding:1rem}button{padding:.7rem;margin:.2rem}pre{white-space:pre-wrap;overflow-wrap:anywhere}a{display:block;margin:1rem 0}</style>
<h1>Local network lab</h1><p>Open developer tools → Network, then try one action at a time.</p>
<button id="blocked">CORS: blocked read</button><button id="allowed">CORS: allowed read</button>
<button id="proxy">Through one proxy</button><button id="poll">Poll three times</button><button id="sse">Receive three events</button>
<a href="${apiOrigin}/api/products/1">Open the API directly</a><a href="${apiOrigin}/cache">Open the cache response</a><pre id="output" role="status">Choose one experiment.</pre>
<script>
const api = ${JSON.stringify(apiOrigin)};
const output = document.querySelector('#output');
async function read(url) { const r = await fetch(url); if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); }
document.querySelector('#blocked').onclick = async () => { try { output.textContent = JSON.stringify(await read(api+'/cors/no')); } catch { output.textContent = 'Blocked: JavaScript cannot read the response. Inspect Network and Console.'; } };
document.querySelector('#allowed').onclick = async () => { try { output.textContent = JSON.stringify(await read(api+'/cors/yes')); } catch { output.textContent = 'Read failed. Check both server ports.'; } };
document.querySelector('#proxy').onclick = async () => { try { output.textContent = JSON.stringify(await read('/proxy')); } catch { output.textContent = 'Proxy failed.'; } };
document.querySelector('#poll').onclick = async function () { this.disabled=true; output.textContent=''; try { for(let i=0;i<3;i++){ const r=await read('/proxy-clock'); output.textContent+=r.time+'\\n'; await new Promise(resolve=>setTimeout(resolve,300)); } } catch { output.textContent+='Polling failed.'; } finally { this.disabled=false; } };
document.querySelector('#sse').onclick = function () { this.disabled=true; output.textContent=''; const button=this; const source=new EventSource('/proxy-events'); source.onmessage=e=>{ const value=JSON.parse(e.data); output.textContent+='Event '+value.count+'\\n'; if(value.count===3){source.close();button.disabled=false;} }; source.onerror=()=>{source.close();button.disabled=false;output.textContent+='Stream stopped.';}; };
</script></html>`);
  });
  // Same-origin forwarding lets polling and SSE focus on delivery, separately from CORS.
  const mainHandler = client.listeners('request')[0];
  client.removeAllListeners('request');
  client.on('request', (req, res) => {
    const pathname = new URL(req.url, 'http://local').pathname;
    if (!['/proxy-clock', '/proxy-events'].includes(pathname)) return mainHandler(req, res);
    const id = observe(req, res);
    if (req.method !== 'GET') return send(res, 405, { error: 'Method not allowed' }, { Allow: 'GET' });
    const upstream = http.get(apiOrigin + (pathname === '/proxy-clock' ? '/clock' : '/events'), { headers: { 'X-Request-Id': id } }, response => {
      res.writeHead(response.statusCode, response.headers);
      response.pipe(res);
    });
    upstream.on('error', () => { if (!res.headersSent) send(res, 502, { error: 'Upstream unavailable' }); else res.end(); });
    res.on('close', () => upstream.destroy());
  });
  try { await listen(client, clientPort); } catch (error) { api.close(); throw error; }
  clientOrigin = `http://127.0.0.1:${client.address().port}`;
  if (!quiet) console.log(`Client: ${clientOrigin}/\nAPI: ${apiOrigin}\nStop with Ctrl+C. Data resets when you restart.`);
  return { clientOrigin, apiOrigin, close: async () => {
    for (const timer of events) clearInterval(timer);
    await Promise.all([client, api].map(server => new Promise(resolve => { server.close(resolve); server.closeAllConnections(); })));
  } };
}
function listen(server, port) {
  return new Promise((resolve, reject) => { server.once('error', reject); server.listen(port, '127.0.0.1', () => { server.off('error', reject); resolve(); }); });
}
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try { await startLab(); } catch (error) { console.error(error.code === 'EADDRINUSE' ? 'A lab port is busy. Stop the earlier lab with Ctrl+C.' : error.message); process.exitCode = 1; }
}
