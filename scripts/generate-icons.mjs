import sharp from "sharp";
import { mkdirSync } from "fs";

mkdirSync("public/icons", { recursive: true });

const svg = (size) => `
<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <defs>
    <radialGradient id="bg" cx="50%" cy="35%" r="65%">
      <stop offset="0%" stop-color="#1a1f35"/>
      <stop offset="100%" stop-color="#0b0d18"/>
    </radialGradient>
    <radialGradient id="glow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#7cb9e8" stop-opacity="0.25"/>
      <stop offset="100%" stop-color="#9b6b9e" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="orb" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#7cb9e8"/>
      <stop offset="100%" stop-color="#9b6b9e"/>
    </linearGradient>
    <clipPath id="round">
      <rect width="${size}" height="${size}" rx="${size * 0.22}" ry="${size * 0.22}"/>
    </clipPath>
  </defs>

  <!-- Background -->
  <rect width="${size}" height="${size}" rx="${size * 0.22}" fill="url(#bg)"/>

  <!-- Ambient glow -->
  <ellipse cx="${size * 0.5}" cy="${size * 0.38}" rx="${size * 0.45}" ry="${size * 0.35}" fill="url(#glow)"/>

  <!-- Gradient orb -->
  <circle cx="${size * 0.5}" cy="${size * 0.44}" r="${size * 0.22}" fill="url(#orb)" opacity="0.9"/>

  <!-- Letter A -->
  <text
    x="${size * 0.5}"
    y="${size * 0.62}"
    text-anchor="middle"
    font-family="system-ui, -apple-system, sans-serif"
    font-weight="700"
    font-size="${size * 0.28}"
    fill="white"
    opacity="0.95"
  >A</text>
</svg>
`;

await sharp(Buffer.from(svg(512))).png().toFile("public/icons/icon-512.png");
await sharp(Buffer.from(svg(192))).png().toFile("public/icons/icon-192.png");
await sharp(Buffer.from(svg(180))).png().toFile("public/icons/apple-touch-icon.png");
await sharp(Buffer.from(svg(32))).png().toFile("public/favicon.ico");

console.log("Icons generated in public/icons/");
