import { createReadStream, existsSync, statSync } from 'node:fs';
import { createServer } from 'node:http';
import { extname, isAbsolute, join, normalize, relative, resolve } from 'node:path';

const root = resolve('dist');
const contentTypes = {
  '.css': 'text/css',
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.xml': 'application/xml'
};

createServer((request, response) => {
  let pathname;
  try {
    pathname = decodeURIComponent(new URL(request.url ?? '/', 'http://127.0.0.1').pathname);
  } catch {
    response.writeHead(400).end();
    return;
  }
  const requestedPath = normalize(join(root, pathname));
  const relativePath = relative(root, requestedPath);
  if (relativePath.startsWith('..') || isAbsolute(relativePath) || pathname.includes('\0')) {
    response.writeHead(403).end();
    return;
  }

  let filePath = requestedPath;
  if (existsSync(filePath) && statSync(filePath).isDirectory()) filePath = join(filePath, 'index.html');
  const notFound = !existsSync(filePath);
  if (notFound) filePath = join(root, '404.html');
  response.writeHead(notFound ? 404 : 200, { 'Content-Type': contentTypes[extname(filePath)] ?? 'application/octet-stream' });
  const stream = createReadStream(filePath);
  stream.on('error', () => response.destroy());
  stream.pipe(response);
}).listen(4322, '127.0.0.1');
