// Quality gate for blog posts — used by CI for every automated post (and runnable locally).
//   node scripts/validate-post.mjs src/content/blog/<slug>.md [...more]
//   node scripts/validate-post.mjs --all
// Exits 1 and prints every problem if any post fails. Keep these rules in sync with CLAUDE.md.
import { readFileSync, readdirSync } from 'node:fs';
import { basename, join } from 'node:path';
import yaml from 'js-yaml';

const BLOG_DIR = 'src/content/blog';
const COVERS = ['cleaning-robot', 'cleaning-robot-vertical', 'service-robot', 'reception-robot', 'handheld-device', 'operating-table', 'water-heater'];
const CATEGORIES = ['Guides', 'Process', 'Industries', 'Marketing'];
const projectSlugs = [...readFileSync('src/data/projects.ts', 'utf8').matchAll(/slug: '([^']+)'/g)].map((m) => m[1]);
const serviceSlugs = [...readFileSync('src/data/services.ts', 'utf8').matchAll(/slug: '([^']+)'/g)].map((m) => m[1]);
const postSlugs = readdirSync(BLOG_DIR).filter((f) => f.endsWith('.md')).map((f) => f.replace(/\.md$/, ''));
const routes = new Set([
  '/', '/work/', '/services/', '/about/', '/contact/', '/blog/',
  ...projectSlugs.map((s) => `/work/${s}/`),
  ...serviceSlugs.map((s) => `/services/${s}/`),
  ...postSlugs.map((s) => `/blog/${s}/`),
]);

// Things an unsupervised writer must never publish.
const BANNED = [
  [/\b(atlantic|ghalioungui|lomi|steatite|gusto)\b/i, 'client brand name (clients are confidential)'],
  [/\bM[ōO]V\b/, 'client brand name (MōV)'],
  [/[$€£]\s?\d|\b\d[\d,.]*\s?(usd|egp|eur|dollars?)\b/i, 'price / currency amount (never state prices)'],
  [/\b\d+(\.\d+)?\s?%/, 'percentage statistic (no unsourced numbers)'],
  [/\b(according to|studies show|research shows|a survey|statistics show|data shows)\b/i, 'unsourced research claim'],
  [/\b(guarantee[sd]?|best in the world|#1|number one)\b/i, 'over-promise'],
  [/\b(as an ai|language model|i cannot)\b/i, 'AI artefact'],
  [/(\bAR\s?\/\s?VR\b|\bVR\b|augmented reality|virtual reality|3D viewer|configurator)/i, 'service the studio does not offer (AR/VR/3D viewer/configurator)'],
];

const words = (s) => s.split(/\s+/).filter(Boolean).length;

function check(file) {
  const errors = [];
  const raw = readFileSync(file, 'utf8');
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!m) return ['missing or malformed frontmatter'];
  let d;
  try { d = yaml.load(m[1]); } catch (e) { return [`frontmatter YAML error: ${e.message}`]; }
  const body = m[2];
  const slug = basename(file, '.md');
  const need = (cond, msg) => { if (!cond) errors.push(msg); };

  need(/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug), 'file name must be a kebab-case slug');
  need(typeof d.title === 'string' && d.title.length >= 20 && d.title.length <= 70, `title must be 20–70 chars (is ${d.title?.length})`);
  need(!d.seoTitle || d.seoTitle.length <= 40, `seoTitle must be ≤ 40 chars (is ${d.seoTitle?.length})`);
  need(!d.seoTitle && d.title?.length > 40 ? false : true, 'title > 40 chars requires a seoTitle ≤ 40 chars');
  need(typeof d.description === 'string' && d.description.length >= 120 && d.description.length <= 165, `description must be 120–165 chars (is ${d.description?.length})`);
  need(typeof d.summary === 'string' && d.summary.length >= 120 && d.summary.length <= 420, `summary must be 120–420 chars (is ${d.summary?.length})`);
  need(d.pubDate && !isNaN(new Date(d.pubDate)), 'pubDate missing/invalid');
  need(CATEGORIES.includes(d.category), `category must be one of ${CATEGORIES.join(', ')}`);
  need(Array.isArray(d.tags) && d.tags.length >= 3 && d.tags.length <= 8, 'tags: 3–8 items');
  need(COVERS.includes(d.cover), `cover must be one of ${COVERS.join(', ')}`);
  need(typeof d.coverAlt === 'string' && d.coverAlt.length >= 15, 'coverAlt missing/too short');
  need(Array.isArray(d.takeaways) && d.takeaways.length >= 3 && d.takeaways.length <= 6, 'takeaways: 3–6 items');
  need(Array.isArray(d.faqs) && d.faqs.length >= 3 && d.faqs.length <= 6, 'faqs: 3–6 items');
  (d.faqs || []).forEach((f, i) => need(f?.q?.endsWith('?') && f?.a?.length >= 80, `faq ${i + 1}: question must end with "?" and answer be ≥ 80 chars`));
  need(Array.isArray(d.related) && d.related.length >= 1 && d.related.every((r) => projectSlugs.includes(r)), `related must list existing project slugs (${projectSlugs.join(', ')})`);
  need(d.draft !== true, 'draft: true is not allowed for automated posts');

  const wc = words(body);
  need(wc >= 1100 && wc <= 2800, `body must be 1,100–2,800 words (is ${wc})`);
  need(!/^#\s/m.test(body), 'body must not contain an H1 (# ) — the title is the H1');
  const h2 = (body.match(/^##\s+\S/gm) || []).length;
  need(h2 >= 5, `body needs at least 5 H2 sections (has ${h2})`);
  need(/\]\(\/contact\/\)/.test(body), 'body must link to /contact/');
  need(/\]\(\/work\//.test(body), 'body must link to at least one project page (/work/...)');
  need((body.match(/\]\(\/[^)]*\)/g) || []).length >= 3, 'body needs at least 3 internal links');

  for (const [, href] of body.matchAll(/\]\(([^)\s]+)\)/g)) {
    if (/^https?:\/\//.test(href)) errors.push(`external link not allowed: ${href}`);
    else if (href.startsWith('/') && !routes.has(href.split('#')[0])) errors.push(`internal link to a page that doesn't exist: ${href}`);
  }
  const text = `${JSON.stringify(d)}\n${body}`;
  for (const [re, why] of BANNED) {
    const hit = text.match(re);
    if (hit) errors.push(`${why}: "${hit[0]}"`);
  }
  // Must not duplicate an existing post's title.
  for (const other of postSlugs.filter((s) => s !== slug)) {
    const t = readFileSync(join(BLOG_DIR, `${other}.md`), 'utf8').match(/^title:\s*['"]?(.+?)['"]?\s*$/m)?.[1];
    if (t && t.toLowerCase() === String(d.title).toLowerCase()) errors.push(`duplicate title of ${other}`);
  }
  return errors;
}

const args = process.argv.slice(2);
const files = args.includes('--all') ? postSlugs.map((s) => join(BLOG_DIR, `${s}.md`)) : args;
if (!files.length) { console.error('usage: validate-post.mjs <file.md ...> | --all'); process.exit(2); }

let failed = 0;
for (const f of files) {
  const errs = check(f);
  if (errs.length) { failed++; console.log(`✗ ${f}`); errs.forEach((e) => console.log(`   - ${e}`)); }
  else console.log(`✓ ${f}`);
}
process.exit(failed ? 1 : 0);
