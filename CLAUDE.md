# CLAUDE.md — Walaa 3D Animation website

Portfolio + services site for **Walaa Ramadan**, a 3D product animator with an industrial-design background.
The visual reference is danthree.studio (premium, editorial, video-led), recoloured to a **light gray theme with light gold buttons**.

## Brand & positioning (from the original brief — keep consistent)

- **Brand:** Walaa 3D Animation (short: Walaa 3D). Logo = isometric cube whose front faces form a "W"; gold top face.
- **SEO title (homepage):** `3D Product Animation & Visualization | Walaa Ramadan`
- **Hero headline:** "Bring Your Product to Life in 3D". Subheading: cinematic product animation and visualization for launches, marketing, social media and digital campaigns. CTAs: **Explore Projects** (gold) + **Start a Project** (ghost).
- **Positioning:** "More than animation. I understand products." — industrial design background + 3D visualization + AI-assisted animation. Do not rebrand as a generic "Industrial Designer" or "AI video creator".
- **Services, in this priority order — 3D Product Animation must stay first and visually dominant:**
  1. 3D Product Animation (main): commercials, reveals, feature animations, exploded views, mechanism animations, social-media videos, launch videos.
  2. Product Visualization: hero renders, marketing visuals, e-commerce images, launch visuals, lifestyle visualization.
  3. Product & Industrial Design (secondary): product development and 3D/CAD support.
- **Process (5 steps):** Brief → Concept → Production → Review → Delivery.
- **Selected work:** keep it to ~5–6 strong projects, not 20.
- **CTA everywhere:** "Have a product you want to bring to life? Let's create something remarkable." → Start a Project.
- **Contact form fields:** Name, Company, Email, Product, What do you need?, Approx. video length, Deadline, Budget range, Upload/reference link (+ message).
- **Client names are NOT to be published** (no permission). Use generic product titles (e.g. "Surgical Operating Table", not the brand). Avoid posters/thumbnails where a client logo dominates the frame.
- Language: **English only** for now. Do not invent testimonials, client logos, statistics or awards.

## Stack

- **Astro 7** (static output) + **Tailwind CSS v4** via `@tailwindcss/vite` (no tailwind.config — tokens live in `src/styles/global.css` `@theme`).
- Fonts self-hosted via Fontsource: **Jost Variable** (display), **Inter Variable** (body).
- `@astrojs/sitemap` for `sitemap-index.xml`; `src/pages/robots.txt.ts` generates robots.txt.
- Contact form posts to **Web3Forms** (`site.web3formsKey` in `src/config/site.ts`), progressively enhanced with fetch; redirects to `/thank-you/`.
- Node ≥ 22.12. Path alias `@/*` → `src/*`.

## Commands

```bash
npm install
npm run dev        # http://localhost:4321
npm run build      # outputs dist/
npm run preview
node scripts/process-video.mjs <input.mp4> <name> [posterSec] [loopStartSec] [loopDurSec]
node scripts/make-icons.mjs   # re-rasterize PNG icons from public/brand/mark.svg
npm run offline               # build + share/offline/ copy that opens from disk (for sending as a zip)
```

## Hosting & domain

- **Live:** https://walaa3d.studio — domain registered at Namecheap, nameservers + DNS on Cloudflare (Walaa's account), site on GitHub Pages.
- **Repo:** https://github.com/wramadandesign-code/walaa3d-website — every push to `main` builds and deploys via `.github/workflows/deploy.yml` (Pages source = GitHub Actions, custom domain walaa3d.studio, `public/CNAME`).
- DNS (Cloudflare): apex A → 185.199.108–111.153, `www` CNAME → wramadandesign-code.github.io. Keep records **DNS only** (grey cloud) so GitHub can issue/renew the HTTPS certificate.
- *.netlify.app is blocked on Walaa's ISP — don't use Netlify.
- **Email:** contact@walaa3d.studio — *receiving* via Cloudflare Email Routing (rule → wramadan.design@gmail.com; MX route1-3.mx.cloudflare.net + DKIM `cf2024-1._domainkey`); *sending* via Gmail "Send mail as" through smtp.gmail.com:587 (app password). SPF: `v=spf1 include:_spf.mx.cloudflare.net include:_spf.google.com ~all`; DMARC `_dmarc` is `p=none` (keep it — Gmail-relayed mail isn't DKIM-aligned for walaa3d.studio, so a stricter policy would reject it).
- **Google Search Console:** Domain property `walaa3d.studio` (wramadan.design@gmail.com), verified by the `google-site-verification=…` TXT record in Cloudflare — never delete it. Sitemap `https://walaa3d.studio/sitemap-index.xml` submitted.
- **Google Analytics 4:** account "Walaa 3D Animation", property "walaa3d.studio" (Egypt time, USD), web stream "Walaa 3D website", Measurement ID `G-ZDJVYQ1BJS` (`site.gaId`). The tag loads only in production builds (BaseLayout). Leads are tracked as `generate_lead` with `method` = contact_form | whatsapp | phone | email (ContactForm.astro + scripts/site.ts) — `generate_lead` is marked as a key event in GA.
- **Phone/WhatsApp:** +20 155 233 0060 (`site.contact.phone` / `whatsapp` in `src/config/site.ts`); floating WhatsApp button = `src/components/WhatsAppFab.astro`.
- Base-path support is kept for sub-path hosts: keep writing root-relative links in source (`/work/`, `/media/…`) — `scripts/base-path-links.mjs` prefixes them only when `base` ≠ `/`. For absolute URLs (canonical, OG, JSON-LD) use `abs()` / `originOf()` from `src/config/urls.ts`, never `Astro.site` directly.

## Structure

```
src/config/site.ts        brand, SEO defaults, contact + social (TODO placeholders), Web3Forms key, nav
src/data/projects.ts      portfolio projects (single source of truth for /work and cards)
src/data/services.ts      services, process steps, FAQs
src/layouts/BaseLayout    <head> SEO: title template, canonical, OG/Twitter, JSON-LD (ProfessionalService, Person, Breadcrumbs + per-page schema)
src/components/           Header, Footer, Logo, Icon, VideoLoop, ProjectCard, SectionHeader, CtaBand, Faq, ContactForm
src/pages/                index, work/, work/[slug], services/, services/[slug], about, contact, thank-you (noindex), 404
src/scripts/site.ts       header scroll state, mobile menu, scroll reveal, play-videos-only-when-visible
public/media/video|posters   optimized media (see below)
public/brand/             logo.svg, mark.svg, mark-512.png
source-media/             original WhatsApp videos + brief (git-ignored, never deployed)
```

## Design system

- Colours (Tailwind names): `canvas` #ECECEA page bg · `surface` #F6F6F4 cards · `mist` alt sections · `line` borders · `ink` #151515 text · `ink-soft` secondary text · `ink-faint` meta (large text only) · `night` video frames · `gold` #DCC28A buttons · `gold-light` hover · `gold-pale` tints · `gold-deep` #8C6D33 for gold **text** on light backgrounds (AA contrast). Never put `gold` text on `canvas`.
- Buttons: `btn btn-gold` (primary), `btn btn-ghost` (secondary). Always include both classes.
- Section rhythm: `container-x` wrapper, `py-24 sm:py-32`, eyebrow (`.eyebrow`) → Jost heading → `.prose-body`.
- Motion: add `data-reveal` (optional `style="--reveal-delay:120ms"`) for scroll reveal. The first section of each page animates with pure CSS so above-the-fold content never waits for JS. Respect `prefers-reduced-motion` (already global).
- Rounded, soft cards (`rounded-[1.5rem]`, `ring-1 ring-line`); the primary service card is the one dark (`bg-ink`) element.

## Media pipeline

For every video `name` the site expects:
`public/media/video/<name>.mp4` (full, with controls on project pages), `<name>-loop.webm` + `<name>-loop.mp4` (muted ≤15 s previews, ≤960 px), `public/media/posters/<name>.webp` + `.jpg`.

- Generate all of them with `scripts/process-video.mjs`. ffmpeg is installed via winget (Gyan.FFmpeg); if not on PATH, set `FFMPEG` to `%LOCALAPPDATA%\Microsoft\WinGet\Packages\Gyan.FFmpeg_*\ffmpeg-*\bin\ffmpeg.exe`.
- Loop videos use `preload="none"` + poster and only play while on screen — keep it that way for performance.
- **To swap in HQ renders:** run the script with the same `name` to overwrite, then update `width/height/duration` in `projects.ts`. Pick a poster time without a dominant client logo.
- Current media names → project: `cleaning-robot` (21:9) + `cleaning-robot-vertical` → Autonomous Cleaning Robot · `service-robot` → Hospitality Service Robot · `handheld-device` → Smart Pressure Sensor · `reception-robot` → Retail Assistant Robot · `operating-table` → Surgical Operating Table · `water-heater` → Electric Water Heater.

## Adding a project

1. Process the video(s) with the script.
2. Add an entry to `projects` in `src/data/projects.ts` (unique `slug` with keywords, `number`, `seoTitle`/`seoDescription`, challenge/approach/result, `media`). The detail page, sitemap, cards and VideoObject schema are generated automatically.
3. Homepage "Selected work" layout is hand-placed in `src/pages/index.astro`; `/work/` order is set by the `order` array in `src/pages/work/index.astro`.

## SEO rules

- One `<h1>` per page; titles ≤ 60 chars via `title` prop (template adds "| Walaa 3D Animation"), descriptions 140–160 chars.
- Keyword-rich slugs (`/work/…-animation/`, `/services/3d-product-animation/`). Target terms: 3D product animation, product visualization, product commercial, exploded view animation, mechanism animation, product launch video, 3D rendering.
- Every video has a poster, `aria-label`, and VideoObject JSON-LD on its project page. Keep `uploadDate` accurate.
- `PUBLIC_SITE_URL` (default https://walaa3d.studio, also set in the deploy workflow) drives `site` + `base`, canonical/OG/JSON-LD and the sitemap.

## Open TODOs (need input from Walaa)

- LinkedIn / Behance links (Instagram, TikTok, YouTube are set in `site.social`; icons via `SocialLinks.astro` in header, mobile menu and footer).
- Web3Forms access key → `site.web3formsKey` (until then the form shows a "not connected" message).
- Logo files (portrait is in `public/media/about/walaa-ramadan.*`, original in `source-media/founder.jpeg`).
- HQ renders are in `source-media/HQ/` (AI-upscaled). Full videos are capped at 1920px long side, loops at 1600px.
- Verify project descriptions, timelines ("1–3 weeks", "24–48 h quote") and budget ranges (USD) in the form.
- Google Business Profile (needs Walaa to verify in person) + Bing Webmaster Tools (can import from Search Console).
