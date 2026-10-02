import rss from '@astrojs/rss';
import type { APIRoute } from 'astro';
import { getPosts } from '@/lib/blog';
import { site } from '@/config/site';
import { siteRoot } from '@/config/urls';

export const GET: APIRoute = async ({ site: astroSite }) => {
  const posts = await getPosts();
  return rss({
    title: `${site.brand} — Blog`,
    description: 'Guides and insights on 3D product animation and product visualization.',
    site: siteRoot(astroSite!).href,
    items: posts.map((p) => ({
      title: p.data.title,
      description: p.data.description,
      pubDate: p.data.pubDate,
      link: `blog/${p.id}/`,
      categories: [p.data.category, ...p.data.tags],
      author: `${site.contact.email} (${site.person})`,
    })),
    customData: '<language>en</language>',
  });
};
