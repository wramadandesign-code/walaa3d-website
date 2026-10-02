/**
 * Global site settings — brand, SEO defaults and contact details.
 * Values marked TODO are placeholders until Walaa provides the real ones.
 */
export const site = {
  brand: 'Walaa 3D Animation',
  shortName: 'Walaa 3D',
  person: 'Walaa Ramadan',
  jobTitle: '3D Product Animator & Industrial Designer',
  title: '3D Product Animation & Visualization | Walaa Ramadan',
  titleTemplate: '%s | Walaa 3D Animation',
  description:
    'Cinematic 3D product animation and visualization for brands, startups and manufacturers — product reveals, exploded views, mechanisms and launch videos.',
  locale: 'en_US',
  ogImage: '/og-default.jpg',
  themeColor: '#ECECEA',

  contact: {
    email: 'contact@walaa3d.studio', // Cloudflare Email Routing → forwards to Walaa's Gmail
    phone: '+201552330060', // calls (E.164)
    phoneDisplay: '+20 155 233 0060',
    whatsapp: '201552330060', // wa.me format: international, no "+" or spaces
    location: 'Cairo, Egypt · Working worldwide',
  },

  // Shown as icons in the header + footer (SocialLinks.astro) and used as JSON-LD sameAs.
  // Order here = display order. Leave a value empty to hide it.
  social: {
    instagram: 'https://www.instagram.com/walaadesign31/',
    tiktok: 'https://www.tiktok.com/@walaa3danimation',
    youtube: 'https://www.youtube.com/@walaa3danimation',
    linkedin: '',
    behance: '',
  },

  /**
   * Contact form backend (Web3Forms — free, emails every submission to you).
   * Get a key at https://web3forms.com (enter your email, the key arrives by email),
   * then paste it here. It is safe to expose publicly.
   */
  /** Google Analytics 4 Measurement ID (property "walaa3d.studio"). Loaded on production builds only. */
  gaId: 'G-ZDJVYQ1BJS',

  web3formsKey:'YOUR_WEB3FORMS_ACCESS_KEY', // TODO
} as const;

export const nav = [
  { label: 'Work', href: '/work/' },
  { label: 'Services', href: '/services/' },
  { label: 'Process', href: '/#process' },
  { label: 'About', href: '/about/' },
] as const;

export const telUrl = `tel:${site.contact.phone}`;

export const whatsappUrl =(text = 'Hi Walaa, I have a product I would like to animate.') =>
  site.contact.whatsapp
    ? `https://wa.me/${site.contact.whatsapp}?text=${encodeURIComponent(text)}`
    : '';
