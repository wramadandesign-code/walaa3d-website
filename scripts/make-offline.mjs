// Builds a copy of dist/ that works when opened straight from disk (double-click index.html),
// so the site can be shared as a zip without hosting.
//   npm run build && node scripts/make-offline.mjs   → writes share/offline/
//
// - Root-relative URLs (/media/…, /work/…) become relative paths ending in index.html.
// - Module scripts are made classic (browsers block module scripts on file://); the
//   hover-prefetch script is dropped since it only matters on a real server.
import { cpSync, rmSync, readdirSync, readFileSync, writeFileSync, statSync } from 'node:fs';
import { join, relative, dirname, sep } from 'node:path';

const SRC = 'dist';
const OUT = 'share/offline';

rmSync(OUT, { recursive: true, force: true });
cpSync(SRC, OUT, { recursive: true });
for (const f of ['_headers', 'robots.txt', 'sitemap-index.xml', 'sitemap-0.xml']) rmSync(join(OUT, f), { force: true });

const walk = (dir) =>
  readdirSync(dir).flatMap((n) => {
    const p = join(dir, n);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });

const files = walk(OUT);

// Sub-path deploys (e.g. GitHub Pages /walaa) prefix every URL; drop a first segment that isn't in the build.
const stripBase = (p) => {
  const first = p.split('/')[1];
  return first && !readdirSync(OUT).includes(first) ? p.slice(first.length + 1) || '/' : p;
};

const toRelative = (fromFile, url) => {
  const [pathAndQuery, hash = ''] = url.split('#');
  let path = stripBase(pathAndQuery.split('?')[0]);
  if (path === '' || path.endsWith('/')) path += 'index.html';
  const prefix = relative(dirname(fromFile), OUT).split(sep).join('/');
  return `${prefix ? prefix + '/' : './'}${path.replace(/^\//, '')}${hash ? '#' + hash : ''}`;
};

for (const file of files.filter((f) => f.endsWith('.html'))) {
  let html = readFileSync(file, 'utf8');
  html = html.replace(/<script type="module" src="[^"]*"><\/script>/g, '');
  html = html.replace(/<script type="module">([\s\S]*?)<\/script>/g, (_, code) => `<script>(()=>{${code}})();</script>`);
  html = html.replace(/\b(href|src|poster|action)="\/(?!\/)([^"]*)"/g, (_, attr, url) => `${attr}="${toRelative(file, '/' + url)}"`);
  // Contact form JS redirects to /thank-you/ — point it at the local file.
  html = html.replace(/window\.location\.href\s*=\s*(["'`])(\/[^"'`]*)?\/thank-you\/\1/g, `window.location.href='${toRelative(file, '/thank-you/')}'`);
  writeFileSync(file, html);
}

for (const file of files.filter((f) => f.endsWith('.css'))) {
  const css = readFileSync(file, 'utf8').replace(/url\(\/(?!\/)([^)]*)\)/g, (_, url) => `url(${toRelative(file, '/' + url)})`);
  writeFileSync(file, css);
}

console.log(`Offline copy written to ${OUT}/ — open index.html`);
