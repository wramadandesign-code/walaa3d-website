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

// ---------------------------------------------------------------------------
// Mouse effects — custom cursor, hover labels, magnetic buttons, gold trail.
// Only for a real mouse (fine pointer + hover) and when motion is allowed.
// Labels: add data-cursor="View" to any link/element. Buttons (.btn) are magnetic
// by default; tune with data-magnetic="0.2" or disable with data-magnetic="0".
// ---------------------------------------------------------------------------
const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
if (finePointer && !reduceMotion) {
  const root = document.documentElement;
  const ring = document.querySelector<HTMLElement>('.cursor');
  const dot = document.querySelector<HTMLElement>('.cursor-dot');
  const label = ring?.querySelector<HTMLElement>('.cursor__label');
  const mouse = { x: innerWidth / 2, y: innerHeight / 2 };
  const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

  if (ring && dot && label) {
    root.classList.add('has-cursor');
    const pos = { ...mouse };
    let seen = false;
    addEventListener('pointermove', (e) => {
      if (e.pointerType !== 'mouse') return;
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      if (!seen) { seen = true; pos.x = mouse.x; pos.y = mouse.y; }
    }, { passive: true });
    document.addEventListener('mouseleave', () => { ring.classList.add('is-hidden'); dot.classList.add('is-hidden'); });
    document.addEventListener('mouseenter', () => { ring.classList.remove('is-hidden'); dot.classList.remove('is-hidden'); });
    const tick = () => {
      pos.x = lerp(pos.x, mouse.x, 0.16);
      pos.y = lerp(pos.y, mouse.y, 0.16);
      ring.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0)`;
      dot.style.transform = `translate3d(${mouse.x}px, ${mouse.y}px, 0)`;
      requestAnimationFrame(tick);
    };
    tick();
    document.addEventListener('pointerover', (e) => {
      const el = (e.target as Element | null)?.closest?.('[data-cursor], a, button, label, select, summary') as HTMLElement | null;
      const text = el?.dataset.cursor;
      ring.classList.toggle('is-hover', !!el);
      ring.classList.toggle('is-label', !!text);
      if (text) label.textContent = text;
    });
  }

  // Magnetic buttons
  document.querySelectorAll<HTMLElement>('.btn, [data-magnetic]').forEach((el) => {
    const strength = parseFloat(el.dataset.magnetic ?? '0.2');
    if (!strength) return;
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      el.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * strength}px, ${(e.clientY - r.top - r.height / 2) * strength}px)`;
    });
    el.addEventListener('pointerleave', () => { el.style.transform = ''; });
  });

  // Soft gold trail (canvas, multiply blend so it tints the light page)
  const canvas = document.querySelector<HTMLCanvasElement>('.fluid');
  const ctx = canvas?.getContext('2d');
  if (canvas && ctx) {
    const dpr = Math.min(devicePixelRatio, 1.5);
    const resize = () => { canvas.width = innerWidth * dpr; canvas.height = innerHeight * dpr; };
    resize();
    addEventListener('resize', resize);
    type P = { x: number; y: number; r: number; life: number; vx: number; vy: number; warm: boolean };
    const parts: P[] = [];
    let last = { ...mouse };
    const draw = () => {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.fillStyle = 'rgba(0,0,0,0.08)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.globalCompositeOperation = 'source-over';
      const dx = mouse.x - last.x, dy = mouse.y - last.y, dist = Math.hypot(dx, dy);
      const n = Math.min(12, Math.floor(dist / 6));
      for (let i = 0; i < n; i++) {
        const t = i / n;
        parts.push({ x: last.x + dx * t, y: last.y + dy * t, r: 18 + Math.min(dist, 80) * 0.5, life: 1, vx: dx * 0.02 + (Math.random() - 0.5), vy: dy * 0.02 + (Math.random() - 0.5), warm: Math.random() > 0.5 });
      }
      last = { ...mouse };
      for (let i = parts.length - 1; i >= 0; i--) {
        const p = parts[i];
        p.life -= 0.022; p.x += p.vx; p.y += p.vy; p.vx *= 0.96; p.vy *= 0.96; p.r *= 1.012;
        if (p.life <= 0) { parts.splice(i, 1); continue; }
        const g = ctx.createRadialGradient(p.x * dpr, p.y * dpr, 0, p.x * dpr, p.y * dpr, p.r * dpr);
        const rgb = p.warm ? '220,194,138' : '140,109,51'; // gold · gold-deep
        g.addColorStop(0, `rgba(${rgb},${0.09 * p.life})`);
        g.addColorStop(1, `rgba(${rgb},0)`);
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(p.x * dpr, p.y * dpr, p.r * dpr, 0, Math.PI * 2);
        ctx.fill();
      }
      if (parts.length > 400) parts.splice(0, parts.length - 400);
      requestAnimationFrame(draw);
    };
    draw();
  }
}
