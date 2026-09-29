/**
 * Services. 3D Product Animation is the primary service and must stay first and visually dominant.
 */
export interface Service {
  slug: string;
  key: 'animation' | 'visualization' | 'design';
  icon: 'film' | 'sparkle' | 'gear';
  title: string;
  kicker: string;
  primary?: boolean;
  short: string;
  intro: string;
  seoTitle: string;
  seoDescription: string;
  includes: { title: string; text: string }[];
  useCases: string[];
  faqs: { q: string; a: string }[];
}

export const services: Service[] = [
  {
    slug: '3d-product-animation',
    key: 'animation',
    icon: 'film',
    title: '3D Product Animation',
    kicker: 'Main service',
    primary: true,
    short:
      "Cinematic animations that showcase your product's design, features, functionality and details.",
    intro:
      'From a 10-second social teaser to a full launch film, I turn your product — or its CAD file — into cinematic 3D animation that explains what it does and makes people want it.',
    seoTitle: '3D Product Animation Services',
    seoDescription:
      '3D product animation for brands, startups and manufacturers: product commercials, reveals, exploded views, mechanism animations and launch videos.',
    includes: [
      { title: 'Product commercials', text: 'Cinematic hero films for your website, ads and launch events.' },
      { title: 'Product reveals', text: 'Dramatic first-look reveals that build anticipation before launch.' },
      { title: 'Feature animations', text: 'Short clips that explain one feature at a time — clearly and beautifully.' },
      { title: 'Exploded views', text: 'Open the product up and show the engineering inside, layer by layer.' },
      { title: 'Mechanism animations', text: 'Show every movement, position and accessory of technical products.' },
      { title: 'Social-media videos', text: 'Vertical 9:16 and square cuts made for Instagram, TikTok and LinkedIn.' },
      { title: 'Product launch videos', text: 'A complete launch package: master film, cut-downs and stills.' },
    ],
    useCases: ['Product launches', 'Crowdfunding campaigns', 'Trade shows', 'E-commerce pages', 'Sales presentations', 'Paid social ads'],
    faqs: [
      {
        q: 'How long does a 3D product animation take?',
        a: 'A typical 15–30 second product animation takes around 1–3 weeks from brief to final delivery, depending on the complexity of the product and the number of shots. Rush timelines are possible — just mention your deadline.',
      },
      {
        q: 'Do I need a physical product or CAD files?',
        a: 'No physical sample is needed. CAD files (STEP, IGES, OBJ, FBX, SolidWorks, Rhino…) are ideal, but I can also model the product from photos, sketches or technical drawings.',
      },
      {
        q: 'Which formats will I receive?',
        a: 'Final videos are delivered as high-quality MP4 files in the aspect ratios you need — 16:9 for web, 9:16 for Reels/TikTok, 1:1 or 4:5 for feeds — up to 4K resolution.',
      },
    ],
  },
  {
    slug: 'product-visualization',
    key: 'visualization',
    icon: 'sparkle',
    title: 'Product Visualization',
    kicker: 'Photoreal renders',
    short:
      'High-quality 3D renders that present your product with realistic materials, lighting and environments.',
    intro:
      'Photoreal product images without a photo shoot. Perfect materials, controlled lighting and any environment you need — ready before the first physical sample exists.',
    seoTitle: '3D Product Visualization & Rendering',
    seoDescription:
      'Photorealistic 3D product visualization and rendering: hero renders, marketing visuals, e-commerce images, product launch visuals and lifestyle scenes.',
    includes: [
      { title: 'Hero renders', text: 'Striking key visuals for your homepage, packaging and campaigns.' },
      { title: 'Marketing visuals', text: 'Consistent image sets for ads, brochures and presentations.' },
      { title: 'E-commerce images', text: 'Clean white-background and 360° images for product pages and marketplaces.' },
      { title: 'Product launch visuals', text: 'Teasers and key art ready before mass production.' },
      { title: 'Lifestyle visualization', text: 'Your product placed in realistic, on-brand environments.' },
    ],
    useCases: ['Amazon & e-commerce listings', 'Catalogs', 'Packaging', 'Pre-launch marketing', 'Colour & material variants'],
    faqs: [
      {
        q: 'Are 3D renders cheaper than a photo shoot?',
        a: 'Often, yes — especially when you need many colour variants or angles. Once the 3D model exists, new images and variants are fast to produce and always perfectly consistent.',
      },
      {
        q: 'Can you match our brand colours and materials exactly?',
        a: 'Yes. Send colour codes (Pantone/RAL/HEX), material samples or reference photos and the materials are matched and approved with you during review.',
      },
    ],
  },
  {
    slug: 'product-industrial-design',
    key: 'design',
    icon: 'gear',
    title: 'Product & Industrial Design',
    kicker: 'Design support',
    short: 'Product development and 3D/CAD support for physical products.',
    intro:
      'With a background in industrial design, I also support product teams earlier in the process — from concept to a clean 3D model that is ready for visualization and development.',
    seoTitle: 'Product & Industrial Design Services',
    seoDescription:
      'Industrial design and 3D/CAD support for physical products: concept development, form design, 3D modeling and visualization for startups and manufacturers.',
    includes: [
      { title: 'Concept development', text: 'Sketches and 3D concepts that explore form, function and user experience.' },
      { title: '3D modeling & CAD support', text: 'Clean, accurate 3D models of your product for development and visualization.' },
      { title: 'Design refinement', text: 'Details, proportions, colour, material and finish (CMF) exploration.' },
      { title: 'Design visualization', text: 'Present concepts to investors and stakeholders before prototyping.' },
    ],
    useCases: ['Hardware startups', 'Product redesigns', 'Investor pitches', 'Pre-prototype reviews'],
    faqs: [
      {
        q: 'Do you provide manufacturing-ready engineering files?',
        a: 'Design and 3D/CAD support is focused on form, concept and visualization. For production engineering (tolerances, tooling), I work alongside your engineering team or manufacturer.',
      },
    ],
  },
];

export const getService = (slug: string) => services.find((s) => s.slug === slug);

export const process = [
  { n: '01', title: 'Brief', text: 'You send your product, CAD files, images or references — plus your goals, audience and deadline.' },
  { n: '02', title: 'Concept', text: 'We define the visual direction, camera movements and story, with a storyboard or style frames.' },
  { n: '03', title: 'Production', text: '3D visualization + AI-assisted animation + compositing — built from an accurate 3D model of your product.' },
  { n: '04', title: 'Review', text: 'You receive a preview and provide feedback. Revision rounds are included.' },
  { n: '05', title: 'Delivery', text: 'Final videos optimized for web, social media and marketing — in every format you need.' },
];

export const generalFaqs = [
  {
    q: 'What is 3D product animation?',
    a: '3D product animation is a video created from a digital 3D model of your product. Because nothing is filmed, the camera can go anywhere — inside the product, through exploded views or into impossible angles — with perfect lighting and materials every time.',
  },
  {
    q: 'How much does a 3D product animation cost?',
    a: 'Every project is quoted individually based on length, product complexity, number of shots and deadline. Share a few details through the project form and you will receive a clear quote, usually within 24–48 hours.',
  },
  {
    q: 'Do you work with clients outside your country?',
    a: 'Yes. Everything — briefing, reviews and delivery — happens online, so I work with brands, startups and manufacturers worldwide.',
  },
  {
    q: 'How do you use AI in your workflow?',
    a: 'AI-assisted tools speed up parts of the animation and compositing process. Your product itself always comes from an accurate 3D model, so shapes, proportions and details stay true to the real product.',
  },
  {
    q: 'Can I reuse the 3D model later?',
    a: 'Yes. Once your product is modeled, it can be reused for new animations, renders, colour variants and social content — making every future piece of content faster and more affordable.',
  },
];
