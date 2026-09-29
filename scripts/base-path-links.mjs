// Astro integration: when the site is served from a sub-path (e.g. GitHub Pages /walaa),
// prefix root-relative URLs in the built HTML with that base. Source code can keep writing
// plain "/work/" and "/media/…" links. No-op when base is "/".
import { readdirSync, readFileSync, writeFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

export default function basePathLinks() {
  let base = '/';
  return {
    name: 'base-path-links',
    hooks: {
      'astro:config:done': ({ config }) => {
        base = config.base.replace(/\/$/, '');
      },
      'astro:build:done': ({ dir }) => {
        if (!base) return;
        const root = fileURLToPath(dir);
        const walk = (d) => readdirSync(d).flatMap((n) => (statSync(join(d, n)).isDirectory() ? walk(join(d, n)) : [join(d, n)]));
        const prefix = (url) => (url === base || url.startsWith(base + '/') ? url : base + url);

        for (const file of walk(root).filter((f) => f.endsWith('.html'))) {
          const html = readFileSync(file, 'utf8')
            .replace(/\b(href|src|poster|action)="(\/(?!\/)[^"]*)"/g, (_, a, u) => `${a}="${prefix(u)}"`)
            // client-side redirect in the contact form script
            .replace(/(["'`])\/thank-you\/\1/g, (_, q) => `${q}${base}/thank-you/${q}`);
          writeFileSync(file, html);
        }
      },
    },
  };
}
