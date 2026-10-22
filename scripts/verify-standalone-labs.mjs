import { readFile, writeFile, mkdir, mkdtemp } from 'node:fs/promises';
import { spawn, execFileSync } from 'node:child_process';
import path from 'node:path';
import assert from 'node:assert/strict';

await mkdir('tmp/standalone-labs', { recursive: true });
const directory = await mkdtemp(path.resolve('tmp/standalone-labs/run-'));
const blocks = source => [...source.matchAll(/```php\r?\n([\s\S]*?)```/g)].map(match => match[1].replaceAll('\r\n', '\n'));
const pages = ['computer-in-depth/software-and-runtime', 'computer-in-depth/06-operating-systems', '03-tcp-udp-packets'];
const results = [];
for (const page of pages) {
  const ar = blocks(await readFile(`src/content/docs/programming-basics/${page}.md`, 'utf8'));
  const en = blocks(await readFile(`src/content/docs/en/programming-basics/${page}.md`, 'utf8'));
  assert.deepEqual(ar, en, `Code differs between languages: ${page}`);
  results.push({ check: `language-code-parity:${page}`, passed: true });
}
const hello = blocks(await readFile('src/content/docs/programming-basics/computer-in-depth/software-and-runtime.md', 'utf8'))[0];
const os = blocks(await readFile('src/content/docs/programming-basics/computer-in-depth/06-operating-systems.md', 'utf8'))[0];
const [server, client] = blocks(await readFile('src/content/docs/programming-basics/03-tcp-udp-packets.md', 'utf8'));
for (const [name, source] of Object.entries({ hello, os, server, client })) {
  const file = path.join(directory, name + '.php');
  await writeFile(file, source);
  execFileSync('php', ['-l', file], { windowsHide: true });
  if (name === 'hello' || name === 'os') {
    const actual = execFileSync('php', [file], { encoding: 'utf8', windowsHide: true }).trim();
    assert.equal(actual, name === 'hello' ? 'Hello Omar' : 'Hello from PHP');
    results.push({ check: `php-output:${name}`, actual, passed: true });
  }
}
assert.equal(await readFile(path.join(directory, 'os-lab-note.txt'), 'utf8'), 'Hello from PHP\n');
async function tcpRound(source, expectSuccess) {
  const file = path.join(directory, expectSuccess ? 'client.php' : 'invalid-client.php');
  await writeFile(file, source);
  const process = spawn('php', [path.join(directory, 'server.php')], { windowsHide: true });
  let serverError = '';
  process.stderr.on('data', chunk => serverError += chunk);
  const completion = new Promise((resolve, reject) => { process.on('exit', resolve); process.on('error', reject); });
  try {
    await new Promise((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error('Server readiness timeout')), 5000);
      process.stdout.on('data', chunk => { if (chunk.toString().includes('Listening')) { clearTimeout(timer); resolve(); } });
      process.on('error', error => { clearTimeout(timer); reject(error); });
      process.on('exit', code => { clearTimeout(timer); if (code !== 0) reject(new Error(serverError)); });
    });
    let output = '', clientCode = 0;
    try { output = execFileSync('php', [file], { encoding: 'utf8', timeout: 12000, windowsHide: true, stdio: ['ignore', 'pipe', 'pipe'] }).trim(); }
    catch (error) { clientCode = error.status; output = String(error.stdout ?? '') + String(error.stderr ?? ''); }
    const serverCode = await completion;
    if (expectSuccess) { assert.equal(clientCode, 0, output); assert.equal(serverCode, 0, serverError); assert.equal(output, 'Received: Hello'); }
    else { assert.notEqual(clientCode, 0); assert.notEqual(serverCode, 0); }
    results.push({ check: expectSuccess ? 'tcp-round-trip' : 'tcp-invalid-message-rejected', passed: true });
  } finally { if (process.exitCode === null) process.kill(); }
}
await tcpRound(client, true);
await tcpRound(client.replace('"Hello\\n"', '"Wrong\\n"'), false);
await mkdir('planning/audit-results', { recursive: true });
await writeFile('planning/audit-results/standalone-labs-2026-10-20.json', JSON.stringify({directory, php: execFileSync('php', ['-v'], {encoding:'utf8'}).split('\n')[0], results}, null, 2) + '\n');
console.log(JSON.stringify(results));
