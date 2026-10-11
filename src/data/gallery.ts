/**
 * Product-visualization stills for the 3D carousel (Gallery3D.astro).
 * Files: /public/media/gallery/<slug>.webp (full, ≤1400px) + <slug>-card.webp (420×560 crop).
 * Originals: source-media/stills/. Never use stills where a client logo dominates the frame.
 * Order is interleaved so neighbouring cards show different products.
 */
export interface Still {
  slug: string;
  alt: string;
  /** optional related project page */
  project?: string;
}

export const gallery: Still[] = [
  { slug: 'delivery-robot-face', alt: 'Hotel delivery robot with a friendly face display and cyan light strip', project: 'hotel-delivery-robot-product-reveal' },
  { slug: 'sensor-in-hand', alt: 'Hand holding a smart pressure sensor showing a live reading', project: 'smart-sensor-exploded-view-animation' },
  { slug: 'navigation-path', alt: 'Cleaning robot following a glowing navigation path', project: 'autonomous-cleaning-robot-animation' },
  { slug: 'service-robot-smile', alt: 'Service robot face display smiling', project: 'service-robot-product-animation' },
  { slug: 'smart-camera', alt: 'Minimal white smart home camera on a clean studio background' },
  { slug: 'retail-robot-showcase', alt: 'Retail assistant robot under dramatic dark studio lighting', project: 'retail-assistant-robot-commercial' },
  { slug: 'sensor-exploded', alt: 'Exploded view of a smart sensor separating into its layers', project: 'smart-sensor-exploded-view-animation' },
  { slug: 'fingerprint-drawers', alt: 'Fingerprint-secured delivery drawers with glowing sensors', project: 'hotel-delivery-robot-product-reveal' },
  { slug: 'robot-hologram', alt: 'Cleaning robot with holographic interface rings', project: 'autonomous-cleaning-robot-animation' },
  { slug: 'service-robot-glow', alt: 'Service robot head with glowing light lines', project: 'service-robot-product-animation' },
  { slug: 'sensor-display-macro', alt: 'Macro of a smart sensor display reading 0.0 above a textured pad', project: 'smart-sensor-exploded-view-animation' },
  { slug: 'robot-interaction', alt: 'Silhouette of a person using a delivery robot in a corridor', project: 'hotel-delivery-robot-product-reveal' },
  { slug: 'robot-wheel', alt: 'Close-up of a cleaning robot wheel', project: 'autonomous-cleaning-robot-animation' },
  { slug: 'service-robot-profile', alt: 'Service robot side profile with blue light accents', project: 'service-robot-product-animation' },
  { slug: 'sensor-touch', alt: 'Finger pressing the textured pad of a smart sensor', project: 'smart-sensor-exploded-view-animation' },
  { slug: 'drawer-contents', alt: 'Open robot drawer carrying neatly packed supplies', project: 'hotel-delivery-robot-product-reveal' },
  { slug: 'cleaning-brushes', alt: 'Cleaning robot brushes on a white background', project: 'autonomous-cleaning-robot-animation' },
  { slug: 'service-robot-room', alt: 'Service robot standing in a dark showroom', project: 'service-robot-product-animation' },
  { slug: 'sensor-three-quarter', alt: 'Three-quarter view of a dark smart sensor with a light rim', project: 'smart-sensor-exploded-view-animation' },
  { slug: 'delivery-robot-reveal', alt: 'Hotel delivery robot revealed on a dark stage', project: 'hotel-delivery-robot-product-reveal' },
  { slug: 'light-strip-detail', alt: 'Glossy robot surface with a cyan light strip', project: 'autonomous-cleaning-robot-animation' },
  { slug: 'drawer-slide', alt: 'Delivery robot drawer sliding open', project: 'hotel-delivery-robot-product-reveal' },
];
