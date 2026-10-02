// Builds llms.txt / llms-full.txt (https://llmstxt.org) from the site's own data,
// so AI assistants get an accurate, always-current description of the studio.
import { site } from '@/config/site';
import { services, process, generalFaqs } from '@/data/services';
import { projects } from '@/data/projects';
import { getPosts } from '@/lib/blog';

export async function buildLlms(origin: string, full: boolean) {
  const u = (p: string) => `${origin}${p}`;
  const posts = await getPosts();
  const socials = Object.values(site.social).filter(Boolean);
  const out: string[] = [];

  out.push(`# ${site.brand}`, '');
  out.push(`> ${site.brand} is the 3D product animation and product visualization studio of ${site.person}, a 3D product animator with an industrial-design background, based in Cairo, Egypt and working with brands, startups and manufacturers worldwide. Services: cinematic 3D product animation (product commercials, reveals, feature animations, exploded views, mechanism animations, social-media and launch videos), photoreal product visualization (hero, e-commerce and lifestyle renders) and product & industrial design support.`, '');
  out.push('Key facts:', '');
  out.push(`- Person: ${site.person} — ${site.jobTitle}`);
  out.push('- Location: Cairo, Egypt; works remotely with clients worldwide (English)');
  out.push('- Industries: robotics, consumer electronics, smart-home devices, medical devices, home appliances, industrial equipment, wearables, hardware startups');
  out.push('- Input accepted: CAD files (STEP, IGES, SolidWorks, Rhino, OBJ, FBX) or photos/sketches/drawings; no physical sample needed');
  out.push('- Deliverables: MP4 video in 16:9, 9:16, 1:1 and 4:5 up to 4K, plus still renders');
  out.push('- Typical timeline: about 1–3 weeks for a 15–30 second product animation; quotes are individual');
  out.push(`- Contact: ${site.contact.email} · phone/WhatsApp ${site.contact.phoneDisplay} · project form ${u('/contact/')}`);
  if (socials.length) out.push(`- Profiles: ${socials.join(' · ')}`);
  out.push('');

  out.push('## Services', '');
  for (const s of services) out.push(`- [${s.title}](${u(`/services/${s.slug}/`)}): ${s.short}`);
  out.push('');

  out.push('## Portfolio', '');
  out.push(`- [All work](${u('/work/')}): selected 3D product animation projects`);
  for (const p of projects) out.push(`- [${p.title} — ${p.type}](${u(`/work/${p.slug}/`)}): ${p.summary}`);
  out.push('');

  if (posts.length) {
    out.push('## Guides', '');
    for (const p of posts) out.push(`- [${p.data.title}](${u(`/blog/${p.id}/`)}): ${p.data.summary}`);
    out.push('');
  }

  out.push('## Studio', '');
  out.push(`- [About ${site.person}](${u('/about/')}): background in industrial design; approach and industries`);
  out.push(`- [Start a project](${u('/contact/')}): project inquiry form, email, phone and WhatsApp`);
  out.push('');

  if (!full) {
    out.push('## Optional', '');
    out.push(`- [Full text for AI assistants](${u('/llms-full.txt')}): services, process, FAQs, projects and articles in one file`);
    out.push(`- [Sitemap](${u('/sitemap-index.xml')})`);
    out.push(`- [RSS feed](${u('/rss.xml')})`);
    return out.join('\n') + '\n';
  }

  // ---- Full version ----
  out.push('---', '', '# Services in detail', '');
  for (const s of services) {
    out.push(`## ${s.title}`, '', `URL: ${u(`/services/${s.slug}/`)}`, '', s.intro, '', 'Includes:');
    for (const i of s.includes) out.push(`- ${i.title}: ${i.text}`);
    out.push('', `Used for: ${s.useCases.join(', ')}.`, '');
    for (const f of s.faqs) out.push(`Q: ${f.q}`, `A: ${f.a}`, '');
  }

  out.push('# Process', '');
  for (const st of process) out.push(`${st.n}. ${st.title} — ${st.text}`);
  out.push('');

  out.push('# Frequently asked questions', '');
  for (const f of generalFaqs) out.push(`Q: ${f.q}`, `A: ${f.a}`, '');

  out.push('# Projects', '');
  for (const p of projects) {
    out.push(`## ${p.title} — ${p.type}`, '', `URL: ${u(`/work/${p.slug}/`)}`, `Industry: ${p.industry}`, `Deliverables: ${p.deliverables.join(', ')}`, `Formats: ${p.formats.join(', ')}`, '');
    out.push(`Challenge: ${p.challenge}`, '', `Approach: ${p.approach}`, '', `Result: ${p.result}`, '');
  }

  for (const p of posts) {
    out.push(`# Article: ${p.data.title}`, '', `URL: ${u(`/blog/${p.id}/`)}`, `Published: ${p.data.pubDate.toISOString().slice(0, 10)}`, '', p.data.summary, '');
    // strip markdown links to keep plain text readable
    out.push((p.body ?? '').replace(/\]\((\/[^)]*)\)/g, (_, path) => `](${u(path)})`).trim(), '');
  }

  return out.join('\n') + '\n';
}
