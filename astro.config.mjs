// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import basePathLinks from './scripts/base-path-links.mjs';

// PUBLIC_SITE_URL = full public URL of the site, including any sub-path.
//   GitHub Pages:  https://mo3110.github.io/walaa   (set in .github/workflows/deploy.yml)
//   Custom domain: https://example.com
const siteUrl = new URL(process.env.PUBLIC_SITE_URL || 'https://mo3110.github.io/walaa');
const base = siteUrl.pathname.replace(/\/$/, '') || '/';

export default defineConfig({
  site: siteUrl.origin,
  base,
  trailingSlash: 'ignore',
  build: { format: 'directory' },
  prefetch: { prefetchAll: true, defaultStrategy: 'hover' },
  integrations: [
    sitemap({
      filter: (page) => !page.includes('/thank-you'),
    }),
    // Source code uses root-relative links ("/work/", "/media/…"); this prefixes them with `base` at build time.
    basePathLinks(),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
