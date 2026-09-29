// Rasterizes the SVG brand mark into PNG icons. Run: node scripts/make-icons.mjs
import sharp from 'sharp';
import { readFile } from 'node:fs/promises';

const mark = await readFile('public/brand/mark.svg');
const bg = { r: 236, g: 236, b: 234, alpha: 1 };

const icon = async (size, pad, out) => {
  const inner = Math.round(size * (1 - pad * 2));
  const png = await sharp(mark, { density: 1200 }).resize(inner, inner).png().toBuffer();
  await sharp({ create: { width: size, height: size, channels: 4, background: bg } })
    .composite([{ input: png, gravity: 'center' }])
    .png()
    .toFile(out);
};

await icon(512, 0.12, 'public/icon-512.png');
await icon(192, 0.12, 'public/icon-192.png');
await icon(180, 0.12, 'public/apple-touch-icon.png');
await sharp(mark, { density: 1200 }).resize(512, 512).png().toFile('public/brand/mark-512.png');
console.log('icons written');
