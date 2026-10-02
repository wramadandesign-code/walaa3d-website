// Site-wide progressive enhancements. Everything works (content visible, links usable) without JS.

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Header: solid background once the page scrolls
const header = document.querySelector<HTMLElement>('.site-header');
const onScroll = () => header?.setAttribute('data-scrolled', String(window.scrollY > 12));
onScroll();
window.addEventListener('scroll', onScroll, { passive: true });

// Mobile menu
const toggle = document.querySelector<HTMLButtonElement>('[data-menu-toggle]');
const menu = document.querySelector<HTMLElement>('[data-menu]');
const setMenu = (open: boolean) => {
  if (!toggle || !menu) return;
  toggle.setAttribute('aria-expanded', String(open));
  menu.toggleAttribute('data-open', open);
  document.documentElement.classList.toggle('overflow-hidden', open);
};
toggle?.addEventListener('click', () => setMenu(toggle.getAttribute('aria-expanded') !== 'true'));
menu?.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => setMenu(false)));
document.addEventListener('keydown', (e) => e.key === 'Escape' && setMenu(false));

// Scroll reveal
const revealEls = document.querySelectorAll<HTMLElement>('[data-reveal]');
if (reduceMotion || !('IntersectionObserver' in window)) {
  revealEls.forEach((el) => el.classList.add('is-visible'));
} else {
  const io = new IntersectionObserver(
    (entries) =>
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      }),
    { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
  );
  revealEls.forEach((el) => io.observe(el));
}

// Analytics: count WhatsApp / call / email clicks as leads (GA4 "generate_lead", by method).
document.addEventListener('click', (e) => {
  const a = (e.target as Element | null)?.closest?.('a[href]') as HTMLAnchorElement | null;
  const gtag = (window as any).gtag;
  if (!a || !gtag) return;
  const href = a.getAttribute('href') || '';
  const method = href.startsWith('https://wa.me/') ? 'whatsapp' : href.startsWith('tel:') ? 'phone' : href.startsWith('mailto:') ? 'email' : '';
  if (method) gtag('event', 'generate_lead', { method, link_location: a.closest('header, footer, main, [aria-label]')?.tagName.toLowerCase() });
});

// Autoplay muted loop videos only while on screen (saves bandwidth & battery).
// Videos use preload="none" + poster, so nothing downloads until they are visible.
const loops = document.querySelectorAll<HTMLVideoElement>('video[data-autoplay]');
if (!reduceMotion && 'IntersectionObserver' in window) {
  const vio = new IntersectionObserver(
    (entries) =>
      entries.forEach(({ target, isIntersecting }) => {
        const v = target as HTMLVideoElement;
        if (isIntersecting) v.play().catch(() => {});
        else v.pause();
      }),
    { threshold: 0.25 },
  );
  loops.forEach((v) => vio.observe(v));
}
