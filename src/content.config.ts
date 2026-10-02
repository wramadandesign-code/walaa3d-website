import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

/**
 * Blog posts live in src/content/blog/*.md — the file name is the URL slug (/blog/<slug>/).
 * `summary` + `takeaways` + `faqs` are rendered on the page AND used for structured data
 * and llms.txt, so write them as clear, self-contained answers (that's what search engines
 * and AI assistants quote).
 */
const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string().max(70),
    /** <title> override (≤ 60 chars incl. the " | Walaa 3D Animation" suffix budget ~40) */
    seoTitle: z.string().optional(),
    description: z.string().min(120).max(165),
    /** 1–2 sentence answer shown under the title (answer-first for AI/featured snippets) */
    summary: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    category: z.string().default('Guides'),
    tags: z.array(z.string()).default([]),
    /** media name from /public/media (poster used as cover + OG image) */
    cover: z.string(),
    coverAlt: z.string(),
    takeaways: z.array(z.string()).default([]),
    faqs: z.array(z.object({ q: z.string(), a: z.string() })).default([]),
    /** project slugs to feature at the end */
    related: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

export const collections = { blog };
