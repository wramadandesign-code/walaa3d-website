import type { APIRoute } from 'astro';
import { abs } from '@/config/urls';

export const GET: APIRoute = ({ site }) =>
  new Response(
    `User-agent: *\nAllow: /\nDisallow: /thank-you/\n\nSitemap: ${abs(site!, '/sitemap-index.xml')}\n`,
    { headers: { 'Content-Type': 'text/plain; charset=utf-8' } },
  );
