/**
 * Absolute-URL helpers that respect the deploy base path (e.g. GitHub Pages "/walaa").
 * Use for canonical, Open Graph and JSON-LD URLs. Plain in-page links can stay root-relative
 * ("/work/") — scripts/base-path-links.mjs prefixes them at build time.
 */
export const siteRoot = (site: URL) => new URL(import.meta.env.BASE_URL.replace(/\/?$/, '/'), site);

/** Base URL without trailing slash, e.g. "https://mo3110.github.io/walaa" */
export const originOf = (site: URL) => siteRoot(site).href.replace(/\/$/, '');

/** Absolute URL for a root-relative path, e.g. abs(site, "/work/") */
export const abs = (site: URL, path: string) => new URL(path.replace(/^\//, ''), siteRoot(site)).href;
