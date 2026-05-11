import sharp from 'sharp';

const WIDTH = 1200;
const HEIGHT = 630;

// Read and circularly crop the headshot
const headshotSize = 340;
const circleMask = Buffer.from(
  `<svg width="${headshotSize}" height="${headshotSize}">
    <circle cx="${headshotSize / 2}" cy="${headshotSize / 2}" r="${headshotSize / 2}" fill="white"/>
  </svg>`
);

const headshot = await sharp('./public/Headshot.jpg')
  .resize(headshotSize, headshotSize, { position: 'top' })
  .composite([{ input: circleMask, blend: 'dest-in' }])
  .png()
  .toBuffer();

// Build the card as SVG (background + text)
const card = `
<svg width="${WIDTH}" height="${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#0f1f3d"/>
      <stop offset="100%" style="stop-color:#1a3260"/>
    </linearGradient>
    <radialGradient id="glow" cx="75%" cy="50%" r="45%">
      <stop offset="0%" style="stop-color:#2563eb;stop-opacity:0.2"/>
      <stop offset="100%" style="stop-color:#2563eb;stop-opacity:0"/>
    </radialGradient>
  </defs>

  <!-- Background -->
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#bg)"/>
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#glow)"/>

  <!-- Left accent bar -->
  <rect x="72" y="80" width="5" height="470" rx="3" fill="#2563eb"/>

  <!-- Name -->
  <text x="108" y="190" font-family="Arial, Helvetica, sans-serif" font-size="72" font-weight="800"
    fill="white" letter-spacing="-2">Jef Aldrich</text>

  <!-- Divider line -->
  <rect x="108" y="215" width="480" height="3" rx="2" fill="#2563eb"/>

  <!-- Tagline line 1 -->
  <text x="108" y="278" font-family="Arial, Helvetica, sans-serif" font-size="28" font-weight="400"
    fill="rgba(255,255,255,0.8)">Global IT Leader · AI &amp; Cybersecurity Strategist</text>

  <!-- Tagline line 2 -->
  <text x="108" y="320" font-family="Arial, Helvetica, sans-serif" font-size="24" font-weight="400"
    fill="rgba(255,255,255,0.55)">Turning Emerging Technology into Enterprise Outcomes</text>

  <!-- Certifications row -->
  <text x="108" y="420" font-family="Arial, Helvetica, sans-serif" font-size="19" font-weight="600"
    fill="rgba(255,255,255,0.4)" letter-spacing="2">CISSP · CISM · OSCP · AZURE CERTIFIED</text>

  <!-- Location -->
  <text x="108" y="490" font-family="Arial, Helvetica, sans-serif" font-size="20" font-weight="500"
    fill="rgba(255,255,255,0.35)">Atlanta, GA · jeferyaldrich.com</text>

  <!-- Headshot placeholder circle (ring behind photo) -->
  <circle cx="940" cy="315" r="${headshotSize / 2 + 14}" fill="none" stroke="rgba(37,99,235,0.35)" stroke-width="3"/>
  <circle cx="940" cy="315" r="${headshotSize / 2 + 28}" fill="none" stroke="rgba(37,99,235,0.12)" stroke-width="2"/>
</svg>`;

// Composite: SVG card + headshot
await sharp(Buffer.from(card))
  .composite([
    {
      input: headshot,
      top: Math.round(315 - headshotSize / 2),
      left: Math.round(940 - headshotSize / 2),
    },
  ])
  .png()
  .toFile('./public/og-image.png');

console.log('OG image generated at public/og-image.png');
