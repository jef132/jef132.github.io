import sharp from 'sharp';
import { writeFile } from 'node:fs/promises';

// Tight crop on the face within NewHeadshot.jpg (800x800).
// A favicon renders at 16-32px, so the head has to fill nearly the whole frame.
const FACE = { left: 150, top: 5, width: 500, height: 500 };
const NAVY = '#0f1f3d';

const face = (size) =>
  sharp('./public/NewHeadshot.jpg')
    .extract(FACE)
    .resize(size, size, { kernel: 'lanczos3' })
    .modulate({ saturation: 1.05 })
    .linear(1.12, -12); // mild contrast lift so features survive downscaling

const circleMask = (size) =>
  Buffer.from(
    `<svg width="${size}" height="${size}"><circle cx="${size / 2}" cy="${size / 2}" r="${size / 2}" fill="white"/></svg>`
  );

// --- favicon.svg: navy rounded square + circular photo, photo embedded as base64 ---
const EMBED = 96; // 3x the 32px render size, keeps it crisp on high-DPI screens
const embedded = await face(EMBED).jpeg({ quality: 84, optimize: true }).toBuffer();
const b64 = embedded.toString('base64');

// Plain href only — every browser that renders SVG favicons supports SVG2 href,
// and duplicating the payload into xlink:href would double the file size.
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
  <defs><clipPath id="c"><circle cx="16" cy="16" r="14"/></clipPath></defs>
  <rect width="32" height="32" rx="6" fill="${NAVY}"/>
  <image clip-path="url(#c)" x="2" y="2" width="28" height="28" preserveAspectRatio="xMidYMid slice"
    href="data:image/jpeg;base64,${b64}"/>
</svg>
`;
await writeFile('./public/favicon.svg', svg);

// --- PNG fallbacks: not every browser renders SVG favicons reliably ---
async function png(size, radius, out) {
  const inner = Math.round(size * 0.875); // matches the SVG's r=14 of 16
  const pad = Math.round((size - inner) / 2);
  const photo = await face(inner)
    .composite([{ input: circleMask(inner), blend: 'dest-in' }])
    .png()
    .toBuffer();

  const bg = Buffer.from(
    `<svg width="${size}" height="${size}"><rect width="${size}" height="${size}" rx="${radius}" fill="${NAVY}"/></svg>`
  );

  await sharp(bg)
    .composite([{ input: photo, top: pad, left: pad }])
    .png({ palette: true, quality: 88, effort: 9 }) // ~4x smaller, no visible banding at icon sizes
    .toFile(out);
}

await png(32, 6, './public/favicon.png');
await png(180, 0, './public/apple-touch-icon.png'); // iOS applies its own corner rounding

console.log('Favicon assets generated: favicon.svg, favicon.png, apple-touch-icon.png');
