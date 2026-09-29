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
    email: 'hello@example.com', // TODO: real business email
    whatsapp: '', // TODO: international format without "+" or spaces, e.g. 201001234567
    location: 'Egypt · Working worldwide', // TODO: confirm
  },

  social: {
    // TODO: fill in; empty entries are hidden automatically
    behance: '',
    instagram: '',
    linkedin: '',
    youtube: '',
    vimeo: '',
  },

  /**
   * Contact form backend (Web3Forms — free, emails every submission to you).
   * Get a key at https://web3forms.com (enter your email, the key arrives by email),
   * then paste it here. It is safe to expose publicly.
   */
  web3formsKey: 'YOUR_WEB3FORMS_ACCESS_KEY', // TODO
} as const;

export const nav = [
  { label: 'Work', href: '/work/' },
  { label: 'Services', href: '/services/' },
  { label: 'Process', href: '/#process' },
  { label: 'About', href: '/about/' },
] as const;

export const whatsappUrl = (text = 'Hi Walaa, I have a product I would like to animate.') =>
  site.contact.whatsapp
    ? `https://wa.me/${site.contact.whatsapp}?text=${encodeURIComponent(text)}`
    : '';
