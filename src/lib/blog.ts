import { getCollection, type CollectionEntry } from 'astro:content';

export type Post = CollectionEntry<'blog'>;

/** Published posts, newest first. */
export const getPosts = async () =>
  (await getCollection('blog', ({ data }) => !data.draft)).sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());

export const readingMinutes = (post: Post) => Math.max(1, Math.round((post.body ?? '').split(/\s+/).filter(Boolean).length / 220));

export const wordCount = (post: Post) => (post.body ?? '').split(/\s+/).filter(Boolean).length;

export const formatDate = (d: Date) => d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
