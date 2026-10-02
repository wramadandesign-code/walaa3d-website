/**
 * Portfolio projects. Client brand names are intentionally NOT used (no public permission).
 * Media lives in /public/media — see CLAUDE.md "Media pipeline" for how to add or replace videos.
 */
export type Aspect = 'landscape' | 'portrait' | 'cinema';

export interface ProjectMedia {
  /** file base name in /public/media (video/<name>.mp4, video/<name>-loop.{mp4,webm}, posters/<name>.{webp,jpg}) */
  name: string;
  aspect: Aspect;
  width: number;
  height: number;
  /** ISO 8601 duration for VideoObject schema */
  duration: string;
  label?: string;
}

export interface Project {
  slug: string;
  number: string;
  title: string;
  type: string; // shown on cards, e.g. "Product Commercial"
  industry: string;
  service: 'animation' | 'visualization' | 'design';
  summary: string;
  seoTitle: string;
  seoDescription: string;
  challenge: string;
  approach: string;
  result: string;
  deliverables: string[];
  formats: string[];
  media: ProjectMedia[];
}

export const projects: Project[] = [
  {
    slug: 'autonomous-cleaning-robot-animation',
    number: '01',
    title: 'Autonomous Cleaning Robot',
    type: 'Product Commercial',
    industry: 'Robotics · Commercial Cleaning',
    service: 'animation',
    summary:
      'A cinematic launch film for a commercial floor-cleaning robot — spotlight reveals, X-ray internals and navigation graphics.',
    seoTitle: 'Cleaning Robot — 3D Product Commercial',
    seoDescription:
      'Cinematic 3D product animation for an autonomous cleaning robot: dramatic reveal, X-ray view of internal parts, brush close-ups and navigation graphics.',
    challenge:
      'A cleaning robot is a technical product sold to facility managers — it has to look premium, but it also has to explain how it works: brushes, sensors, navigation and autonomy.',
    approach:
      'We built the story in three beats: a moody spotlight reveal to establish the product as a hero object, macro shots of brushes and sensors to prove quality, and a transparent X-ray pass plus animated path graphics to explain autonomous navigation.',
    result:
      'A wide 21:9 cinematic master for website and presentations, plus a vertical 9:16 cut for social media — all from the same 3D scene.',
    deliverables: ['Product reveal', 'X-ray / internal view', 'Feature animation', 'Social-media cut'],
    formats: ['21:9 cinematic', '9:16 vertical'],
    media: [
      { name: 'cleaning-robot', aspect: 'cinema', width: 1920, height: 836, duration: 'PT15S', label: 'Cinematic master · 21:9' },
      { name: 'cleaning-robot-vertical', aspect: 'portrait', width: 1080, height: 1920, duration: 'PT15S', label: 'Social cut · 9:16' },
    ],
  },
  {
    slug: 'service-robot-product-animation',
    number: '02',
    title: 'Hospitality Service Robot',
    type: 'Product Reveal',
    industry: 'Robotics · Hospitality',
    service: 'animation',
    summary:
      'A friendly product reveal for a restaurant delivery robot — animated face display, UI screens and ambient light details.',
    seoTitle: 'Service Robot — 3D Product Reveal',
    seoDescription:
      '3D product reveal animation for a restaurant and hotel delivery robot, featuring an animated character display, touchscreen UI and glowing light-line details.',
    challenge:
      'Service robots work next to guests, so the brand needed to feel approachable and trustworthy — not cold or industrial.',
    approach:
      'Close-ups of the light lines and glossy shell set a premium tone, then the face display comes alive with a smile and switches into the ordering interface. A slow pull-back reveals the full robot and its tray system.',
    result:
      'A 15-second vertical film designed for social media and trade-show screens, showing both personality and function.',
    deliverables: ['Product reveal', 'Screen / UI animation', 'Detail close-ups'],
    formats: ['9:16 vertical'],
    media: [{ name: 'service-robot', aspect: 'portrait', width: 1080, height: 1920, duration: 'PT15S' }],
  },
  {
    slug: 'smart-sensor-exploded-view-animation',
    number: '03',
    title: 'Smart Pressure Sensor',
    type: 'Exploded View Animation',
    industry: 'Consumer Electronics · Health Tech',
    service: 'animation',
    summary:
      'An exploded-view animation that opens a compact smart device layer by layer — shell, flex circuit, PCB and display.',
    seoTitle: 'Smart Sensor — Exploded View Animation',
    seoDescription:
      '3D exploded view animation of a compact smart pressure-sensor device, revealing housing, flexible circuit, PCB electronics and a live display UI.',
    challenge:
      'The value of this device is hidden inside it. Photos can only show a smooth shell; buyers needed to see the engineering.',
    approach:
      'Starting on a macro texture shot, the device separates into its components in a clean, controlled exploded view, with warm light tracing the circuitry. It then reassembles and the display switches on to show a real-time reading.',
    result:
      'A clear, satisfying explainer that communicates build quality and technology in 15 seconds — ideal for launch campaigns and crowdfunding pages.',
    deliverables: ['Exploded view', 'Material close-ups', 'Display UI animation'],
    formats: ['9:16 vertical'],
    media: [{ name: 'handheld-device', aspect: 'portrait', width: 1080, height: 1920, duration: 'PT15S' }],
  },
  {
    slug: 'retail-assistant-robot-commercial',
    number: '04',
    title: 'Retail Assistant Robot',
    type: 'Product Commercial',
    industry: 'Robotics · Retail',
    service: 'animation',
    summary:
      'A clean, bright commercial for an in-store assistant robot, highlighting its sculpted form and interactive touchscreen.',
    seoTitle: 'Retail Robot — 3D Product Commercial',
    seoDescription:
      '3D product commercial for a retail assistant robot: sculpted form, light-line details and an animated touchscreen interface in a bright studio environment.',
    challenge:
      'The robot had to feel modern and welcoming for shoppers, and the software experience needed to be shown alongside the hardware.',
    approach:
      'A bright studio set and soft shadows keep the focus on the sculpted shell. Camera moves follow the curves of the body, then the screen animates into its greeting and menu.',
    result:
      'A premium vertical film for the product launch and social channels, reusable for retail presentations.',
    deliverables: ['Product commercial', 'UI screen animation', 'Studio renders'],
    formats: ['9:16 vertical'],
    media: [{ name: 'reception-robot', aspect: 'portrait', width: 1080, height: 1920, duration: 'PT15S' }],
  },
  {
    slug: 'surgical-operating-table-mechanism-animation',
    number: '05',
    title: 'Surgical Operating Table',
    type: 'Mechanism Animation',
    industry: 'Medical Devices',
    service: 'animation',
    summary:
      'A technical mechanism animation showing every movement of an electro-hydraulic operating table, with on-screen feature callouts.',
    seoTitle: 'Operating Table — Mechanism Animation',
    seoDescription:
      '3D mechanism animation of a medical operating table showing electro-hydraulic tilting, adjustable headrest, removable leg and arm rests and accessories.',
    challenge:
      'Operating tables have dozens of positions and accessories. Sales teams needed one video that explains all of them clearly to hospitals and distributors.',
    approach:
      'Each movement — tilting, back and leg sections, headrest and accessories — is animated in sequence from the angle that explains it best, paired with short on-screen text.',
    result:
      'A complete product explainer designed for tenders, exhibitions and distributor training.',
    deliverables: ['Mechanism animation', 'Feature callouts', 'Accessory showcase'],
    formats: ['16:9 landscape'],
    media: [{ name: 'operating-table', aspect: 'landscape', width: 1196, height: 720, duration: 'PT1M22S' }],
  },
  {
    slug: 'electric-water-heater-product-visualization',
    number: '06',
    title: 'Electric Water Heater',
    type: 'Product Visualization',
    industry: 'Home Appliances',
    service: 'visualization',
    summary:
      'Photoreal visualization of a home water heater — control dial, temperature gauge and premium finish in motion.',
    seoTitle: 'Water Heater — 3D Product Visualization',
    seoDescription:
      'Photorealistic 3D product visualization and animation of an electric water heater, highlighting the control dial, temperature gauge, materials and finish.',
    challenge:
      'Water heaters look alike on a shop shelf. The brand wanted to show the design details and quality finish that set this model apart.',
    approach:
      'Slow, close camera moves across the enamel finish, chrome trim and control interface, with the dial and gauge animated to show how simply the product is used.',
    result:
      'A 40-second product film plus hero stills for e-commerce listings and retail screens.',
    deliverables: ['Product film', 'Hero renders', 'Feature close-ups'],
    formats: ['16:9 landscape'],
    media: [{ name: 'water-heater', aspect: 'landscape', width: 1920, height: 1080, duration: 'PT40S' }],
  },
];

export const getProject = (slug: string) => projects.find((p) => p.slug === slug);
