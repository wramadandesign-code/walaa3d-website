// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import basePathLinks from './scripts/base-path-links.mjs';

// PUBLIC_SITE_URL = full public URL of the site, including any sub-path.
//   Production:    https://walaa3d.studio          (set in .github/workflows/deploy.yml)
//   Sub-path host: https://user.github.io/repo     (base-path-links.mjs handles the prefix)
const siteUrl = new URL(process.env.PUBLIC_SITE_URL || 'https://walaa3d.studio');
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
