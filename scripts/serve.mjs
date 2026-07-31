import { createServer } from 'node:http';
import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import { extname, join, normalize, resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const publicDir = resolve(root, 'apps/web/public');
const port = Number(process.env.PORT || 4174);

const types = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.ico': 'image/x-icon'
};

createServer(async (request, response) => {
  const url = new URL(request.url || '/', `http://${request.headers.host || 'localhost'}`);
  const requested = normalize(url.pathname === '/' ? '/index.html' : url.pathname);
  const filePath = join(publicDir, requested);

  if (!filePath.startsWith(publicDir)) {
    response.writeHead(403);
    response.end('Forbidden');
    return;
  }

  try {
    const fileStat = await stat(filePath);
    const finalPath = fileStat.isDirectory() ? join(filePath, 'index.html') : filePath;
    response.writeHead(200, {
      'Content-Type': types[extname(finalPath)] || 'application/octet-stream'
    });
    createReadStream(finalPath).pipe(response);
  } catch {
    response.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    createReadStream(join(publicDir, 'index.html')).pipe(response);
  }
}).listen(port, () => {
  console.log(`ClAppOne CPA Genie running at http://localhost:${port}`);
});
